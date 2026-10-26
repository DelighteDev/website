import { useEffect, useRef } from "react";
import { useSettings } from "../settings/SettingsContext";

export default function RainCanvas() {
  const canvasRef = useRef(null);
  const { rainActive, theme } = useSettings();

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
      y: randomHeight ? Math.random() * height : -20,
      length: 8 + Math.random() * 11,
      speed: 4 + Math.random() * 4,
      opacity: 0.18 + Math.random() * 0.3,
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
      const count = Math.min(75, Math.max(28, Math.round(width / 18)));
      drops = Array.from({ length: count }, () => makeDrop());
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.lineCap = "round";

      drops.forEach((drop, index) => {
        context.strokeStyle = `rgba(175, 198, 184, ${drop.opacity})`;
        context.beginPath();
        context.moveTo(drop.x, drop.y);
        context.lineTo(drop.x - 1.5, drop.y + drop.length);
        context.stroke();
        drop.y += drop.speed;
        drop.x -= 0.22;

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
  }, [rainActive, theme]);

  return <canvas ref={canvasRef} className="rain-canvas" aria-hidden="true" />;
}
