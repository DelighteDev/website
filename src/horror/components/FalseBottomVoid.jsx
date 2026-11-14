import { useEffect, useRef } from "react";

export default function FalseBottomVoid() {
  const endRef = useRef(null);
  const timerRef = useRef(null);
  const waitingRef = useRef(false);

  useEffect(() => {
    const end = endRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || waitingRef.current) return;
        waitingRef.current = true;
        timerRef.current = window.setTimeout(() => {
          document.querySelector(".horror-footer")?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
          window.setTimeout(() => {
            waitingRef.current = false;
          }, 4000);
        }, 1100);
      },
      { threshold: 0.75 },
    );
    observer.observe(end);
    return () => {
      observer.disconnect();
      window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="false-bottom-void" aria-hidden="true">
      <p ref={endRef}>There is nothing down here. Go back up.</p>
    </div>
  );
}
