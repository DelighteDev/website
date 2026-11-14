import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import RainCanvas from "../components/RainCanvas";
import CornerFace from "./components/CornerFace";
import FalseBottomVoid from "./components/FalseBottomVoid";
import HorrorAtmosphereEffects from "./components/HorrorAtmosphereEffects";
import HorrorHeader from "./components/HorrorHeader";
import HorrorPageEffects from "./components/HorrorPageEffects";
import MouseTrail from "./components/MouseTrail";
import HorrorAboutPage from "./pages/HorrorAboutPage";
import HorrorBlogPage from "./pages/HorrorBlogPage";
import HorrorClicksPage from "./pages/HorrorClicksPage";
import HorrorInterestsPage from "./pages/HorrorInterestsPage";
import HorrorMinecraftPage from "./pages/HorrorMinecraftPage";
import HorrorTrainingDataPage from "./pages/HorrorTrainingDataPage";
import { horrorRoutes } from "./routes";
import "./horror.css";

function savedVoidMode() {
  try {
    return localStorage.getItem("delightedev-horror-theme") === "void";
  } catch {
    return false;
  }
}

export default function HorrorApp() {
  const location = useLocation();
  const [voidMode, setVoidMode] = useState(savedVoidMode);
  const previousTheme = useRef({
    theme: document.documentElement.dataset.theme || "dark",
    colour: document.querySelector('meta[name="theme-color"]')?.content || "#111b18",
  });
  const isAbout = location.pathname === horrorRoutes.about;

  useEffect(() => {
    const previous = previousTheme.current;
    return () => {
      document.documentElement.dataset.theme = previous.theme;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", previous.colour);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = voidMode ? "horror-void" : "dark";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#080b0a");
    try {
      localStorage.setItem("delightedev-horror-theme", voidMode ? "void" : "dark");
    } catch {
      // The visual effect still works when storage is unavailable.
    }
  }, [voidMode]);

  return (
    <div className={`site-shell horror-shell ${voidMode ? "horror-void-mode" : ""}`}>
      <RainCanvas />
      <div className="site-content horror-content">
        <HorrorHeader
          voidMode={voidMode}
          onToggleTheme={() => setVoidMode((current) => !current)}
        />
        <HorrorPageEffects />
        <HorrorAtmosphereEffects />
        <main id="main-content" className="horror-main">
          <Routes>
            <Route path={horrorRoutes.about} element={<HorrorAboutPage />} />
            <Route path={horrorRoutes.interests} element={<HorrorInterestsPage />} />
            <Route path={horrorRoutes.clicks} element={<HorrorClicksPage />} />
            <Route path={horrorRoutes.blog} element={<HorrorBlogPage />} />
            <Route path={horrorRoutes.minecraft} element={<HorrorMinecraftPage />} />
            <Route path={horrorRoutes.training} element={<HorrorTrainingDataPage />} />
            <Route path="*" element={<Navigate to={horrorRoutes.about} replace />} />
          </Routes>
        </main>
        <footer className="site-footer horror-footer">{"With <3, by DelighteDev"}</footer>
        {isAbout && <FalseBottomVoid />}
      </div>
      <MouseTrail />
      <CornerFace />
      {voidMode && (
        <div className="void-warning" role="status">
          Get away from here.
        </div>
      )}
    </div>
  );
}
