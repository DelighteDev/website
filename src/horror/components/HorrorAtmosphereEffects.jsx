import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SCROLL_KEY = "delightedev-horror-scroll";
const AUTO_SCROLL_KEY = "delightedev-horror-auto-scroll";

function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

function savedScrollPositions() {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}");
  } catch {
    return {};
  }
}

function useFaviconAndConsole() {
  useEffect(() => {
    const links = [...document.querySelectorAll('link[rel~="icon"]')];
    const originals = links.map((link) => ({
      link,
      href: link.getAttribute("href"),
      type: link.getAttribute("type"),
      sizes: link.getAttribute("sizes"),
    }));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="#24070c"/><path d="M21.2 16.4c-.4 9.7-.5 20.9-.1 31.1M21.1 16.8c5.7-.5 11.4-.8 15.5 1.4 6.4 3.3 10 7.8 9.8 14.4-.2 9.1-6.2 14.9-15.3 15-3.4.1-6.8-.1-10-.3" fill="none" stroke="#d9384c" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="49" cy="14" r="3" fill="#8f1f2d"/></svg>`;
    const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    links.forEach((link) => {
      link.href = href;
      link.type = "image/svg+xml";
      link.removeAttribute("sizes");
    });

    const style = "color:#9db9a0;background:#080d0a;padding:5px 9px;border-left:2px solid #65111e;font:13px monospace";
    const timers = [
      window.setTimeout(() => console.log("%cYou were not supposed to look here.", style), 250),
      window.setTimeout(() => console.log("%cThis is not a bug.", style), 1300),
      window.setTimeout(() => console.log("%cClose the inspector. Now.", style), 2800),
    ];

    return () => {
      originals.forEach(({ link, href: originalHref, type, sizes }) => {
        if (originalHref) link.setAttribute("href", originalHref);
        if (type) link.setAttribute("type", type);
        if (sizes) link.setAttribute("sizes", sizes);
      });
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);
}

function useScrollMemory(pathname, hash) {
  useEffect(() => {
    let frame = null;
    let observedScroll = false;
    const positions = savedScrollPositions();
    const remembered = positions[pathname];
    const restoreTimer = window.setTimeout(() => {
      if (remembered == null || hash) return;
      const shift = randomBetween(30, 50) * (Math.random() < 0.5 ? -1 : 1);
      window.scrollTo({ top: Math.max(0, remembered + shift), behavior: "instant" });
    }, 350);

    const remember = () => {
      observedScroll = true;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        positions[pathname] = window.scrollY;
        try {
          sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions));
        } catch {
          // Scroll memory is optional when browser storage is unavailable.
        }
        frame = null;
      });
    };
    window.addEventListener("scroll", remember, { passive: true });
    return () => {
      window.clearTimeout(restoreTimer);
      window.removeEventListener("scroll", remember);
      if (frame) cancelAnimationFrame(frame);
      // React's development-only effect rehearsal must not erase the saved
      // position before the restoration timer has had a chance to run.
      if (observedScroll) {
        positions[pathname] = window.scrollY;
        try {
          sessionStorage.setItem(SCROLL_KEY, JSON.stringify(positions));
        } catch {
          // The effect still works without storage.
        }
      }
    };
  }, [pathname, hash]);
}

function useGradualDecay() {
  useEffect(() => {
    const shell = document.querySelector(".horror-shell");
    const content = document.querySelector(".horror-content");
    const start = performance.now();
    const blend = (from, to, amount) => Math.round(from + (to - from) * amount);
    const update = () => {
      const elapsed = performance.now() - start;
      const drift = Math.min(elapsed / 240000, 1);
      const top = `rgb(${blend(5, 13, drift)},${blend(8, 9, drift)},${blend(6, 8, drift)})`;
      const bottom = `rgb(${blend(9, 16, drift)},${blend(14, 9, drift)},${blend(12, 9, drift)})`;
      content.style.background = `linear-gradient(180deg, ${top}, ${bottom} 34rem)`;

      const decay = Math.max(0, Math.min((elapsed - 120000) / 120000, 1));
      shell.style.setProperty("--horror-decay-spacing", `${-0.018 * decay}em`);
      shell.style.setProperty("--horror-decay-leading", String(-0.22 * decay));
      shell.classList.toggle("typography-decay", decay > 0);
    };
    update();
    const interval = window.setInterval(update, 10000);
    return () => {
      window.clearInterval(interval);
      content.style.removeProperty("background");
      shell.style.removeProperty("--horror-decay-spacing");
      shell.style.removeProperty("--horror-decay-leading");
      shell.classList.remove("typography-decay");
    };
  }, []);
}

function useMicroFreezes() {
  useEffect(() => {
    const shell = document.querySelector(".horror-shell");
    let timer = null;
    let resumeTimer = null;
    let disposed = false;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (disposed) return;
        shell.classList.add("horror-micro-freeze");
        resumeTimer = window.setTimeout(() => {
          shell.classList.remove("horror-micro-freeze");
          schedule();
        }, 300);
      }, randomBetween(45000, 90000));
    };
    schedule();
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      window.clearTimeout(resumeTimer);
      shell.classList.remove("horror-micro-freeze");
    };
  }, []);
}

function useAutonomousScroll() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(AUTO_SCROLL_KEY)) return undefined;
    } catch {
      // Allow the effect when storage is unavailable.
    }

    let timer = null;
    let frame = null;
    let disposed = false;
    let active = false;
    let lastInteraction = performance.now();
    const interrupt = () => {
      lastInteraction = performance.now();
      if (active) {
        active = false;
        if (frame) cancelAnimationFrame(frame);
      }
    };
    const events = ["mousemove", "keydown", "wheel", "touchstart", "pointerdown"];
    events.forEach((event) => window.addEventListener(event, interrupt, { passive: true }));

    const begin = () => {
      if (disposed || document.hidden || performance.now() - lastInteraction < 8000) {
        timer = window.setTimeout(begin, 15000);
        return;
      }
      try {
        sessionStorage.setItem(AUTO_SCROLL_KEY, "done");
      } catch {
        // The single animation still runs without storage.
      }
      const startY = window.scrollY;
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const direction = startY + 30 <= maximum ? 1 : -1;
      const distance = randomBetween(20, 30) * direction;
      const start = performance.now();
      active = true;
      const move = (now) => {
        if (!active || disposed) return;
        const progress = Math.min((now - start) / 1500, 1);
        const eased = progress * progress * (3 - 2 * progress);
        window.scrollTo({ top: startY + distance * eased, behavior: "instant" });
        if (progress < 1) frame = requestAnimationFrame(move);
        else active = false;
      };
      frame = requestAnimationFrame(move);
    };
    timer = window.setTimeout(begin, randomBetween(25000, 50000));

    return () => {
      disposed = true;
      active = false;
      window.clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
      events.forEach((event) => window.removeEventListener(event, interrupt));
    };
  }, []);
}

export default function HorrorAtmosphereEffects() {
  const location = useLocation();
  useFaviconAndConsole();
  useScrollMemory(location.pathname, location.hash);
  useGradualDecay();
  useMicroFreezes();
  useAutonomousScroll();
  return null;
}
