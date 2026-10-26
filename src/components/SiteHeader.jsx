import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { splashTexts } from "../data/home";
import { BLOG_URL } from "../data/site";
import { useSettings } from "../settings/SettingsContext";
import { WavyLine } from "./WavyHeading";

function SiteControls() {
  const {
    theme,
    toggleTheme,
    rainPreference,
    toggleRain,
    soundPreference,
    soundPlaying,
    soundBusy,
    toggleSound,
  } = useSettings();

  const soundLabel = soundPreference && !soundPlaying
    ? "Tap to start sound"
    : `Rain sound: ${soundPlaying ? "on" : "off"}`;

  return (
    <div className="site-controls" aria-label="Website settings">
      <button
        type="button"
        className="setting-toggle"
        onClick={toggleTheme}
        aria-label={`Theme: ${theme}. Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        Theme: {theme}
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
  );
}

export default function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reducedMotion } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const isHome = location.pathname === "/";
  const [splash] = useState(
    () => splashTexts[Math.floor(Math.random() * splashTexts.length)],
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleAbout = (event) => {
    setMenuOpen(false);
    if (isHome) {
      event.preventDefault();
      if (location.hash === "#about") {
        scrollToAbout();
      } else {
        navigate("/#about");
      }
    }
  };

  const active = (path) => location.pathname === path;

  const pageLink = (to, label, newTab = false) => (
    <Link
      to={to}
      className={`menu-link ${active(to) ? "is-active" : ""}`}
      aria-current={active(to) ? "page" : undefined}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
      onClick={() => setMenuOpen(false)}
    >
      {label}
      {active(to) && <WavyLine />}
    </Link>
  );

  return (
    <header className={`site-header ${isHome ? "home-header" : "inner-header"}`}>
      {isHome ? (
        <div className="home-title-block">
          <h1>The Delight Experience</h1>
          <div className="splash-wrap">
            <p className="splash-text">{splash}</p>
          </div>
        </div>
      ) : (
        <Link to="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          The Delight Experience
        </Link>
      )}

      <nav className="main-nav" aria-label="Main menu">
        <button
          ref={menuButtonRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="menu-panel"
          onClick={() => setMenuOpen((current) => !current)}
        >
          Menu
        </button>
        <div id="menu-panel" className={`menu-panel ${menuOpen ? "is-open" : ""}`}>
          <div className="menu-links">
            <Link
              to="/#about"
              className={`menu-link ${isHome ? "is-active" : ""}`}
              aria-current={isHome ? "location" : undefined}
              onClick={handleAbout}
            >
              About
              {isHome && <WavyLine />}
            </Link>
            {pageLink("/training-data", "Training Data")}
            {pageLink("/interests", "What I Like")}
            <a
              href={BLOG_URL}
              className="menu-link"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </a>
            {pageLink("/minecraft", "Minecraft Server")}
            {pageLink("/clicks", "Clicks")}
          </div>
          <SiteControls />
        </div>
      </nav>
    </header>
  );
}
