import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSettings } from "../../settings/SettingsContext";
import { WavyLine } from "../../components/WavyHeading";
import { horrorRoutes } from "../routes";

const splashTexts = [
  "This is normal",
  "This is OK?",
  "Help",
  "I am me",
  "I am still here",
  "Who are you?",
  "nullnullnullnullnullnullnullnullnull",
];

const randomSplash = () => splashTexts[Math.floor(Math.random() * splashTexts.length)];

function readVisitCount() {
  try {
    return Number(localStorage.getItem("delightedev-horror-about-visits") || 0);
  } catch {
    return 0;
  }
}

export default function HorrorHeader({ voidMode, onToggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    rainPreference,
    toggleRain,
    soundPreference,
    soundPlaying,
    soundBusy,
    toggleSound,
  } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [splash, setSplash] = useState(randomSplash);
  const menuButtonRef = useRef(null);
  const recordedVisit = useRef(null);
  const backTrap = useRef({ pushed: false, armed: false });
  const isHome = location.pathname === horrorRoutes.about;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isHome) {
      recordedVisit.current = null;
      return;
    }
    if (recordedVisit.current === location.pathname) return;
    recordedVisit.current = location.pathname;

    const visits = readVisitCount();
    setSplash(visits > 0 ? "Why did you come back?" : randomSplash());
    try {
      localStorage.setItem("delightedev-horror-about-visits", String(visits + 1));
    } catch {
      // A repeat visit can still be remembered for this open page.
    }
  }, [isHome, location.pathname]);

  useEffect(() => {
    if (!isHome) {
      backTrap.current = { pushed: false, armed: false };
      return undefined;
    }

    if (!backTrap.current.pushed) {
      window.history.pushState({ horrorAboutTrap: true }, "", window.location.href);
      backTrap.current = { pushed: true, armed: true };
    }

    const holdOnce = () => {
      if (!backTrap.current.armed) return;
      backTrap.current.armed = false;
      setSplash("I am still here");
    };
    window.addEventListener("popstate", holdOnce);
    return () => window.removeEventListener("popstate", holdOnce);
  }, [isHome, location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const handleAbout = (event) => {
    setMenuOpen(false);
    if (!isHome) return;
    event.preventDefault();
    if (location.hash === "#about") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`${horrorRoutes.about}#about`);
    }
  };

  const active = (path) => location.pathname === path;
  const pageLink = (to, label) => (
    <Link
      to={to}
      className={`menu-link ${active(to) ? "is-active" : ""}`}
      aria-current={active(to) ? "page" : undefined}
      onClick={() => setMenuOpen(false)}
    >
      {label}
      {active(to) && <WavyLine />}
    </Link>
  );

  const soundLabel = soundPreference && !soundPlaying
    ? "Tap to start sound"
    : `Rain sound: ${soundPlaying ? "on" : "off"}`;

  return (
    <header className={`site-header horror-header ${isHome ? "home-header" : "inner-header"}`}>
      {isHome ? (
        <div className="home-title-block">
          <h1>The Delight Experience?</h1>
          <div className="splash-wrap">
            <p className="splash-text horror-splash">{splash}</p>
          </div>
        </div>
      ) : (
        <Link to={horrorRoutes.about} className="site-brand" onClick={() => setMenuOpen(false)}>
          The Delight Experience?
        </Link>
      )}

      <nav className="main-nav" aria-label="Main menu">
        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="horror-menu-panel"
          onClick={() => setMenuOpen((current) => !current)}
        >
          Menu
        </button>
        <div id="horror-menu-panel" className={`menu-panel ${menuOpen ? "is-open" : ""}`}>
          <div className="menu-links">
            <Link
              to={`${horrorRoutes.about}#about`}
              className={`menu-link ${isHome ? "is-active" : ""}`}
              aria-current={isHome ? "location" : undefined}
              onClick={handleAbout}
            >
              About
              {isHome && <WavyLine />}
            </Link>
            {pageLink(horrorRoutes.training, "Training Data")}
            {pageLink(horrorRoutes.interests, "What I Like")}
            {pageLink(horrorRoutes.blog, "Blog")}
            {pageLink(horrorRoutes.minecraft, "Minecraft Server")}
            {pageLink(horrorRoutes.clicks, "Clicks")}
          </div>
          <div className="site-controls" aria-label="Website settings">
            <button
              type="button"
              className="setting-toggle"
              onClick={onToggleTheme}
              aria-label={`Theme: ${voidMode ? "???" : "dark"}. Switch to ${voidMode ? "dark" : "???"} mode`}
            >
              Theme: {voidMode ? "???" : "dark"}
            </button>
            <button
              type="button"
              className="setting-toggle"
              onClick={toggleRain}
              aria-pressed={rainPreference}
            >
              Rain effect: {rainPreference ? "on" : "off"}
            </button>
            <button
              type="button"
              className="setting-toggle"
              onClick={toggleSound}
              aria-pressed={soundPlaying}
              disabled={soundBusy}
            >
              {soundLabel}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
