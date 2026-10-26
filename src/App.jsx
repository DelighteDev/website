import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import RainCanvas from "./components/RainCanvas";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import ClicksPage from "./pages/ClicksPage";
import HomePage from "./pages/HomePage";
import InterestsPage from "./pages/InterestsPage";
import MinecraftPage from "./pages/MinecraftPage";
import TrainingDataPage from "./pages/TrainingDataPage";
import { useSettings } from "./settings/SettingsContext";

function PageEffects() {
  const location = useLocation();
  const { reducedMotion } = useSettings();

  useEffect(() => {
    document.title = "The Delight Experience";

    if (location.hash === "#about") {
      const timer = window.setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }, 0);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return undefined;
  }, [location.pathname, location.hash, reducedMotion]);

  return null;
}

export default function App() {
  return (
    <div className="site-shell">
      <RainCanvas />
      <div className="site-content">
        <SiteHeader />
        <PageEffects />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/interests" element={<InterestsPage />} />
            <Route path="/clicks" element={<ClicksPage />} />
            <Route path="/minecraft" element={<MinecraftPage />} />
            <Route path="/training-data" element={<TrainingDataPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
