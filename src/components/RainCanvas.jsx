import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSettings } from "../settings/SettingsContext";
import { isHorrorPath } from "../horror/routes";

export default function RainCanvas() {
  const canvasRef = useRef(null);
  const location = useLocation();
  const { rainActive, theme } = useSettings();
  const horrorMode = isHorrorPath(location.pathname);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frame;
    let width = 0;
    let height = 0;
    let drops = [];

    if (!rainActive) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      return undefined;
    }

    const makeDrop = (randomHeight = true) => ({
      x: Math.random() * width,
      y: randomHeight ? Math.random() * height : -30,
      length: horrorMode ? 12 + Math.random() * 27 : 8 + Math.random() * 11,
      speed: horrorMode ? 5 + Math.random() * 6 : 4 + Math.random() * 4,
      opacity: horrorMode ? 0.16 + Math.random() * 0.38 : 0.18 + Math.random() * 0.3,
      width: horrorMode ? 0.6 + Math.random() * 1.7 : 1,
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = horrorMode
        ? Math.min(140, Math.max(52, Math.round(width / 10)))
        : Math.min(75, Math.max(28, Math.round(width / 18)));
      drops = Array.from({ length: count }, () => makeDrop());
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      drops.forEach((drop, index) => {
        context.lineWidth = drop.width;
        context.strokeStyle = horrorMode
          ? `rgba(116, 9, 22, ${drop.opacity})`
          : `rgba(175, 198, 184, ${drop.opacity})`;
        context.beginPath();
        context.moveTo(drop.x, drop.y);
        context.lineTo(drop.x - (horrorMode ? 2.8 : 1.5), drop.y + drop.length);
        context.stroke();
        drop.y += drop.speed;
        drop.x -= horrorMode ? 0.46 : 0.22;

        if (drop.y > height + 20 || drop.x < -20) {
          drops[index] = { ...makeDrop(false), x: Math.random() * (width + 30) };
        }
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      context.clearRect(0, 0, width, height);
    };
  }, [rainActive, theme, horrorMode]);

  return (
    <>
      <canvas ref={canvasRef} className="rain-canvas" aria-hidden="true" />
      {horrorMode && rainActive && <div className="blood-rain-vignette" aria-hidden="true" />}
    </>
  );
}
