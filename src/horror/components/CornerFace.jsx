import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CornerFace() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setVisible(false);
    setClicked(false);
    const timer = window.setTimeout(() => setVisible(true), 9000 + Math.random() * 5000);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className={`corner-presence ${clicked ? "was-clicked" : ""}`}>
      {!clicked ? (
        <button
          type="button"
          className="corner-face"
          aria-label="A face at the edge of the page"
          onClick={() => setClicked(true)}
        >
          <svg viewBox="0 0 190 230" aria-hidden="true">
            <defs>
              <filter id="face-softness">
                <feGaussianBlur stdDeviation="0.65" />
              </filter>
              <linearGradient id="face-shadow" x1="0" x2="1">
                <stop offset="0" stopColor="#020303" stopOpacity="0" />
                <stop offset="0.55" stopColor="#101615" stopOpacity="0.86" />
                <stop offset="1" stopColor="#010202" />
              </linearGradient>
            </defs>
            <path d="M26 230C14 173 18 87 54 36c27-38 82-41 112 4 23 35 25 128 11 190Z" fill="url(#face-shadow)" />
            <g filter="url(#face-softness)">
              <path d="M46 91c13-14 34-14 47 1-14 12-34 12-47-1Z" fill="#aab3a9" opacity="0.7" />
              <path d="M110 89c12-12 31-11 40 3-13 10-29 9-40-3Z" fill="#b8bdb4" opacity="0.64" />
              <ellipse cx="72" cy="92" rx="5" ry="9" fill="#111817" />
              <ellipse cx="128" cy="91" rx="4" ry="9" fill="#111817" />
              <circle cx="70" cy="89" r="1.4" fill="#d9ded4" opacity="0.65" />
              <circle cx="126" cy="88" r="1.2" fill="#d9ded4" opacity="0.55" />
              <path d="M97 101c-4 22-8 34-3 39 5 2 11 1 15-2" fill="none" stroke="#5f6c64" strokeWidth="2" opacity="0.35" />
              <path className="corner-smile" d="M53 158c22 9 52 12 87-2-13 23-29 34-48 31-18-2-30-12-39-29Z" fill="#090c0b" stroke="#768077" strokeWidth="1.4" opacity="0.9" />
              <path d="M63 164c20 7 43 7 66-1" fill="none" stroke="#a2a99e" strokeWidth="2" opacity="0.42" />
              <path d="M75 168l-2 12m15-10-1 14m16-14 1 13m14-15 2 10" stroke="#c0c4b8" strokeWidth="1" opacity="0.25" />
            </g>
          </svg>
        </button>
      ) : (
        <p className="corner-last-words">i just wanted to be happy</p>
      )}
    </div>
  );
}
