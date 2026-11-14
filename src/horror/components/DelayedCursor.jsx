import { useEffect, useRef } from "react";

export default function DelayedCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    const cursor = cursorRef.current;
    const points = [];
    let frame = null;
    let lastMovement = performance.now();

    const move = (event) => {
      points.push({ x: event.clientX, y: event.clientY, time: performance.now() });
      lastMovement = performance.now();
      cursor.dataset.active = "true";
    };

    const draw = (now) => {
      while (points.length && points[0].time < now - 3200) points.shift();
      const targetTime = now - 1500;
      let point = points[0];
      for (let index = points.length - 1; index >= 0; index -= 1) {
        if (points[index].time <= targetTime) {
          point = points[index];
          break;
        }
      }

      if (point) {
        let { x, y } = point;
        const idle = now - lastMovement > 1300;
        if (idle && Math.floor(now / 1000) % 8 < 3) {
          const reveal = document.querySelector(".horror-thought-spoiler");
          if (reveal) {
            const bounds = reveal.getBoundingClientRect();
            x += (bounds.left + bounds.width * 0.65 - x) * 0.68;
            y += (bounds.top + bounds.height * 0.5 - y) * 0.68;
          }
        }
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      frame = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", move, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={cursorRef} className="delayed-cursor" aria-hidden="true">
      <svg viewBox="0 0 18 24">
        <path d="M2 1l13 13-7 1 4 6-3 1-4-6-4 5Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
