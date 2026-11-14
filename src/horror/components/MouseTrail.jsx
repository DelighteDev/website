import { useEffect, useRef } from "react";

export default function MouseTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const points = [];
    let frame = null;
    let lastPoint = null;
    let lastTime = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const move = (event) => {
      const now = performance.now();
      const distance = lastPoint
        ? Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y)
        : 20;
      if (now - lastTime < 38 || distance < 7) return;
      lastTime = now;
      lastPoint = { x: event.clientX, y: event.clientY };
      points.push({
        ...lastPoint,
        born: now,
        size: 2 + Math.random() * 3.5,
        stretch: 1.2 + Math.random() * 1.8,
      });
      if (points.length > 70) points.shift();
    };

    const draw = (now) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let index = points.length - 1; index >= 0; index -= 1) {
        const point = points[index];
        const age = now - point.born;
        if (age > 4000) {
          points.splice(index, 1);
          continue;
        }
        const opacity = (1 - age / 4000) * 0.075;
        context.fillStyle = `rgba(126, 86, 87, ${opacity})`;
        context.beginPath();
        context.ellipse(point.x, point.y, point.size * point.stretch, point.size, -0.35, 0, Math.PI * 2);
        context.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="horror-mouse-trail" aria-hidden="true" />;
}
