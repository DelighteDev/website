import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { createHorrorAudio } from "../horror/audio";
import { isHorrorPath } from "../horror/routes";

const SettingsContext = createContext(null);

function savedChoice(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function rememberChoice(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The site still works when browser storage is unavailable.
  }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function SettingsProvider({ children }) {
  const location = useLocation();
  const horrorMode = isHorrorPath(location.pathname);
  const [theme, setTheme] = useState(() =>
    savedChoice("delightedev-theme") === "light" ? "light" : "dark",
  );
  const [rainPreference, setRainPreference] = useState(
    () => savedChoice("delightedev-rain") === "on",
  );
  const [soundPreference, setSoundPreference] = useState(
    () => savedChoice("delightedev-sound") === "on",
  );
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [soundBusy, setSoundBusy] = useState(false);
  const audioRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // The hidden section owns its own dark and "???" themes.
    if (horrorMode) return;
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#111b18" : "#e2e8e1");
    rememberChoice("delightedev-theme", theme);
  }, [theme, horrorMode]);

  useEffect(() => {
    rememberChoice("delightedev-rain", rainPreference ? "on" : "off");
  }, [rainPreference]);

  useEffect(() => {
    rememberChoice("delightedev-sound", soundPreference ? "on" : "off");
  }, [soundPreference]);

  const stopSound = useCallback(() => {
    const audio = audioRef.current;
    audioRef.current = null;
    setSoundPlaying(false);
    setSoundPreference(false);

    if (!audio) return;

    const { context, gain, source } = audio;
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.8);
    window.setTimeout(() => {
      audio.dispose?.();
      try {
        source.stop();
      } catch {
        // The sound source may already have stopped.
      }
      context.close().catch(() => {});
    }, 850);
  }, []);

  const startSound = useCallback(async () => {
    if (audioRef.current || soundBusy) return;
    setSoundBusy(true);

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const context = new AudioContext();
      await context.resume();

      if (horrorMode) {
        audioRef.current = { context, ...createHorrorAudio(context), kind: "horror" };
        setSoundPlaying(true);
        setSoundPreference(true);
        return;
      }

      // Soft filtered noise makes rain without downloading an audio file.
      const seconds = 4;
      const buffer = context.createBuffer(
        2,
        context.sampleRate * seconds,
        context.sampleRate,
      );

      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        const samples = buffer.getChannelData(channel);
        let previous = 0;
        for (let index = 0; index < samples.length; index += 1) {
          const white = Math.random() * 2 - 1;
          previous = (previous + 0.025 * white) / 1.025;
          samples[index] = previous * 4.5;
        }
      }

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const highpass = context.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 350;

      const lowpass = context.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 4800;

      const gain = context.createGain();
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.075, context.currentTime + 1.4);

      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(context.destination);
      source.start();

      audioRef.current = { context, source, gain, kind: "cozy" };
      setSoundPlaying(true);
      setSoundPreference(true);
    } catch {
      setSoundPlaying(false);
      setSoundPreference(false);
    } finally {
      setSoundBusy(false);
    }
  }, [soundBusy, horrorMode]);

  const toggleSound = useCallback(() => {
    if (soundPlaying) {
      stopSound();
    } else {
      startSound();
    }
  }, [soundPlaying, startSound, stopSound]);

  useEffect(() => {
    const audio = audioRef.current;
    const expectedKind = horrorMode ? "horror" : "cozy";
    if (audio && audio.kind !== expectedKind) stopSound();
  }, [horrorMode, stopSound]);

  useEffect(
    () => () => {
      audioRef.current?.dispose?.();
      audioRef.current?.context.close().catch(() => {});
      audioRef.current = null;
    },
    [],
  );

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
      reducedMotion,
      rainActive: rainPreference && (!reducedMotion || horrorMode),
      rainPreference,
      toggleRain: () => setRainPreference((current) => !current),
      soundPreference,
      soundPlaying,
      soundBusy,
      toggleSound,
    }),
    [
      theme,
      reducedMotion,
      horrorMode,
      rainPreference,
      soundPreference,
      soundPlaying,
      soundBusy,
      toggleSound,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
