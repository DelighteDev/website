import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CornerFace() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [eyeTrack, setEyeTrack] = useState({ lx: 0, ly: 0, rx: 0, ry: 0 });
  const frameRef = useRef(null);

  useEffect(() => {
    setVisible(false);
    setClicked(false);
    const timer = window.setTimeout(() => setVisible(true), 9000 + Math.random() * 5000);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  // Eyes follow the user's cursor
  useEffect(() => {
    if (!visible || clicked) return undefined;
    const onMove = (event) => {
      const mx = event.clientX / window.innerWidth;
      const my = event.clientY / window.innerHeight;
      // Map mouse position to small pupil offsets (eyes locked toward viewer)
      const lx = (mx - 0.85) * 3.2;
      const ly = (my - 0.75) * 2.8;
      const rx = (mx - 0.85) * 2.6;
      const ry = (my - 0.75) * 2.4;
      setEyeTrack({
        lx: Math.max(-2.5, Math.min(2.5, lx)),
        ly: Math.max(-2, Math.min(2, ly)),
        rx: Math.max(-2.5, Math.min(2.5, rx)),
        ry: Math.max(-2, Math.min(2, ry)),
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [visible, clicked]);

  if (!visible) return null;

  return (
    <div className={`corner-presence ${clicked ? "was-clicked" : ""}`}>
      {!clicked ? (
        <button
          type="button"
          className="corner-face"
          aria-label="A face at the edge of the page"
          onClick={() => setClicked(true)}
          ref={frameRef}
        >
          <svg viewBox="0 0 190 250" aria-hidden="true">
            <defs>
              <filter id="face-softness">
                <feGaussianBlur stdDeviation="0.5" />
              </filter>
              <filter id="face-grime">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <linearGradient id="face-shadow" x1="0" x2="1">
                <stop offset="0" stopColor="#020303" stopOpacity="0" />
                <stop offset="0.45" stopColor="#0a100d" stopOpacity="0.92" />
                <stop offset="1" stopColor="#010202" />
              </linearGradient>
              <radialGradient id="eye-hollow-l" cx="0.5" cy="0.45" r="0.55">
                <stop offset="0" stopColor="#030404" />
                <stop offset="0.65" stopColor="#070a09" />
                <stop offset="1" stopColor="#1a201d" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="eye-hollow-r" cx="0.5" cy="0.45" r="0.55">
                <stop offset="0" stopColor="#030404" />
                <stop offset="0.6" stopColor="#070a09" />
                <stop offset="1" stopColor="#1a201d" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Head shape - slightly tilted, gaunt */}
            <g transform="rotate(2.5, 95, 120)">
              <path
                d="M22 250C8 180 12 78 52 30c30-42 86-44 118 3 25 37 28 138 14 217Z"
                fill="url(#face-shadow)"
              />

              {/* Skin texture distortion layer */}
              <g filter="url(#face-grime)" opacity="0.6">
                <path
                  d="M32 245C18 178 22 84 58 38c28-39 80-40 108 4 22 34 24 130 12 203Z"
                  fill="#0d1311"
                />
              </g>

              <g filter="url(#face-softness)">
                {/* Deep sunken eye sockets */}
                <ellipse cx="68" cy="88" rx="24" ry="18" fill="url(#eye-hollow-l)" />
                <ellipse cx="132" cy="85" rx="22" ry="19" fill="url(#eye-hollow-r)" />

                {/* Eye whites - too wide, asymmetric, staring */}
                <path d="M42 88c10-19 40-21 53 0-12 16-42 17-53 0Z" fill="#bfc5b8" opacity="0.82" />
                <path d="M108 84c9-17 39-19 50-1-10 16-40 18-50 1Z" fill="#c4c9bd" opacity="0.76" />

                {/* Irises - too large, slightly different sizes */}
                <ellipse cx={68 + eyeTrack.lx} cy={88 + eyeTrack.ly} rx="10" ry="12" fill="#2a3830" opacity="0.9" />
                <ellipse cx={132 + eyeTrack.rx} cy={85 + eyeTrack.ry} rx="9" ry="11.5" fill="#2a3830" opacity="0.85" />

                {/* Pupils - dilated, pitch black, watching */}
                <ellipse className="corner-pupil-l" cx={68 + eyeTrack.lx} cy={88 + eyeTrack.ly} rx="6" ry="8" fill="#020303" />
                <ellipse className="corner-pupil-r" cx={132 + eyeTrack.rx} cy={85 + eyeTrack.ry} rx="5.5" ry="7.5" fill="#020303" />

                {/* Tiny pinprick reflections */}
                <circle cx={65 + eyeTrack.lx} cy={84 + eyeTrack.ly} r="1.1" fill="#d4d9cf" opacity="0.6" />
                <circle cx={129 + eyeTrack.rx} cy={81 + eyeTrack.ry} r="0.9" fill="#d4d9cf" opacity="0.5" />

                {/* Dark veins in eye whites */}
                <path d="M48 91c5-1 8-3 11-2" stroke="#6b3a3a" strokeWidth="0.4" opacity="0.3" fill="none" />
                <path d="M85 90c-4-2-6-4-9-2" stroke="#6b3a3a" strokeWidth="0.4" opacity="0.25" fill="none" />
                <path d="M114 87c4-1 7-3 10-1" stroke="#6b3a3a" strokeWidth="0.35" opacity="0.28" fill="none" />

                {/* Under-eye shadows / dark circles */}
                <path d="M46 100c14 6 32 5 46-1" fill="none" stroke="#0a0d0c" strokeWidth="3" opacity="0.4" />
                <path d="M112 97c12 5 28 4 42-2" fill="none" stroke="#0a0d0c" strokeWidth="2.5" opacity="0.35" />

                {/* Nose - crooked, barely there */}
                <path d="M95 100c-6 24-10 38-4 44 4 1 9 0 12-3" fill="none" stroke="#4a5650" strokeWidth="1.6" opacity="0.3" />

                {/* The smile - too wide, stretched unnaturally past the face, teeth showing */}
                <path
                  className="corner-smile"
                  d="M38 168c28 14 62 18 118-3-18 28-38 42-62 39-24-3-40-16-56-36Z"
                  fill="#050706"
                  stroke="#5a6858"
                  strokeWidth="1.2"
                  opacity="0.95"
                />

                {/* Upper teeth row - uneven, slightly too many */}
                <path
                  d="M50 170c5 2 9 1 13-1m5 2c5 2 9 0 12-2m6 2c4 1 9 0 13-2m5 1c5 2 10 0 14-2m5 2c4 1 8-1 12-3"
                  stroke="#b8bfb2"
                  strokeWidth="1.8"
                  opacity="0.45"
                  fill="none"
                />

                {/* Tooth gaps - dark lines between teeth */}
                <path
                  d="M63 170l-1 9m18-10 0 10m17-10 0 9m18-10 0 10m16-11 0 8"
                  stroke="#030504"
                  strokeWidth="1.2"
                  opacity="0.55"
                />

                {/* Lower lip shadow */}
                <path d="M56 185c22 6 50 5 80-3" fill="none" stroke="#3d4a40" strokeWidth="1.5" opacity="0.35" />

                {/* Cheek creases pulled by the unnatural width of the smile */}
                <path d="M36 162c-4-8-6-14-3-20" fill="none" stroke="#3a443c" strokeWidth="1" opacity="0.3" />
                <path d="M158 160c3-9 4-15 1-21" fill="none" stroke="#3a443c" strokeWidth="1" opacity="0.25" />

                {/* Faint forehead creases */}
                <path d="M52 55c20-4 42-3 58 1m-52 7c16-3 34-2 48 1" fill="none" stroke="#2a3530" strokeWidth="0.8" opacity="0.25" />

                {/* Hollow cheekbone shadows */}
                <ellipse cx="48" cy="135" rx="14" ry="22" fill="#060908" opacity="0.35" />
                <ellipse cx="150" cy="132" rx="13" ry="21" fill="#060908" opacity="0.3" />
              </g>
            </g>
          </svg>
        </button>
      ) : (
        <p className="corner-last-words">i just wanted to be happy</p>
      )}
    </div>
  );
}
