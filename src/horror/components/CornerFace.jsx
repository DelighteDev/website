import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const COOLDOWN_MS = 180000; // 3 minutes cooldown between sightings across the entire session
const LAST_SEEN_KEY = "delightedev-horror-face-last-seen";

function isCooldownActive() {
  try {
    const lastSeen = Number(sessionStorage.getItem(LAST_SEEN_KEY) || 0);
    return Date.now() - lastSeen < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markLastSeen() {
  try {
    sessionStorage.setItem(LAST_SEEN_KEY, Date.now().toString());
  } catch {
    // Session storage is optional
  }
}

export default function CornerFace() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [retreating, setRetreating] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [eyeTrack, setEyeTrack] = useState({ x: -2, y: -1 });

  const lastMoveTime = useRef(performance.now());
  const lastMouseNorm = useRef({ x: -0.5, y: -0.5 });
  const isSaccade = useRef(false);
  const retreatTimer = useRef(null);
  const cleanupTimer = useRef(null);

  useEffect(() => {
    setVisible(false);
    setClicked(false);
    setRetreating(false);
    setBlinking(false);

    window.clearTimeout(retreatTimer.current);
    window.clearTimeout(cleanupTimer.current);

    // If cooldown is active, do not schedule an appearance on this page visit
    if (isCooldownActive()) {
      return undefined;
    }

    // Long, rare delay: appears only after 40 to 65 seconds of presence on a page
    const arriveDelay = 40000 + Math.random() * 25000;
    const timer = window.setTimeout(() => {
      if (isCooldownActive()) return;

      setVisible(true);
      markLastSeen();

      // Peeking behavior: stays visible for 13 to 17 seconds, then retreats
      retreatTimer.current = window.setTimeout(() => {
        setRetreating(true);
        // After retreat animation finishes, hide completely
        cleanupTimer.current = window.setTimeout(() => {
          setVisible(false);
          setRetreating(false);
          markLastSeen();
        }, 3600);
      }, 13000 + Math.random() * 4000);
    }, arriveDelay);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(retreatTimer.current);
      window.clearTimeout(cleanupTimer.current);
    };
  }, [location.pathname]);

  // Mouse cursor tracking
  useEffect(() => {
    if (!visible || clicked || retreating) return undefined;

    const onMove = (event) => {
      lastMoveTime.current = performance.now();
      isSaccade.current = false;

      // Position relative to corner face (bottom-right: ~innerWidth - 90, innerHeight - 100)
      const faceX = window.innerWidth - 90;
      const faceY = window.innerHeight - 100;

      const normX = Math.max(-1, Math.min(0.2, (event.clientX - faceX) / window.innerWidth));
      const normY = Math.max(-1, Math.min(0.2, (event.clientY - faceY) / window.innerHeight));
      lastMouseNorm.current = { x: normX, y: normY };

      // Map to realistic pupil displacement in pixels
      const targetX = normX < 0 ? normX * 6.5 : normX * 8.0;
      const targetY = normY < 0 ? normY * 4.2 : normY * 6.0;

      setEyeTrack({
        x: Math.max(-6.5, Math.min(3.5, targetX)),
        y: Math.max(-4.2, Math.min(2.5, targetY)),
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [visible, clicked, retreating]);

  // Idle saccades: eyes dart left and right when user isn't moving mouse
  useEffect(() => {
    if (!visible || clicked || retreating) return undefined;

    const saccadeTimer = window.setInterval(() => {
      const idleTime = performance.now() - lastMoveTime.current;
      if (idleTime > 2200) {
        isSaccade.current = true;
        const choice = Math.random();
        let sx = 0;
        let sy = (Math.random() - 0.5) * 1.8;

        if (choice < 0.45) {
          // Glance sharply left across the page
          sx = -6.5;
        } else if (choice < 0.75) {
          // Glance right / suspicious peripheral check
          sx = 2.8;
        } else {
          // Return to center / stare directly at screen
          sx = -1.2;
        }

        setEyeTrack({ x: sx, y: sy });

        // Snap back to cursor position after a brief pause
        window.setTimeout(() => {
          if (performance.now() - lastMoveTime.current > 1800) {
            const { x: nx, y: ny } = lastMouseNorm.current;
            setEyeTrack({
              x: Math.max(-6.5, Math.min(3.5, nx < 0 ? nx * 6.5 : nx * 8.0)),
              y: Math.max(-4.2, Math.min(2.5, ny < 0 ? ny * 4.2 : ny * 6.0)),
            });
            isSaccade.current = false;
          }
        }, 750 + Math.random() * 450);
      }
    }, 2800 + Math.random() * 1800);

    return () => window.clearInterval(saccadeTimer);
  }, [visible, clicked, retreating]);

  // Periodic natural blink
  useEffect(() => {
    if (!visible || clicked || retreating) return undefined;

    let timeoutId;
    const scheduleBlink = () => {
      setBlinking(true);
      window.setTimeout(() => setBlinking(false), 140);
      timeoutId = window.setTimeout(scheduleBlink, 4500 + Math.random() * 6000);
    };

    timeoutId = window.setTimeout(scheduleBlink, 3500);
    return () => window.clearTimeout(timeoutId);
  }, [visible, clicked, retreating]);

  const handleClick = () => {
    window.clearTimeout(retreatTimer.current);
    window.clearTimeout(cleanupTimer.current);
    setRetreating(false);
    setClicked(true);
    markLastSeen();
  };

  if (!visible) return null;

  return (
    <div
      className={`corner-presence ${clicked ? "was-clicked" : ""} ${retreating ? "is-retreating" : ""}`}
    >
      {!clicked ? (
        <button
          type="button"
          className="corner-face"
          aria-label="A face at the edge of the page"
          onClick={handleClick}
        >
          <svg viewBox="0 0 190 250" aria-hidden="true">
            <defs>
              {/* Eyelid clip paths */}
              <clipPath id="left-eye-clip">
                <path d="M 46 93 C 50 77 86 76 94 92 C 86 104 52 104 46 93 Z" />
              </clipPath>
              <clipPath id="right-eye-clip">
                <path d="M 110 89 C 114 74 150 73 158 88 C 150 100 116 100 110 89 Z" />
              </clipPath>

              {/* Sclera depth gradients */}
              <radialGradient id="sclera-grad-l" cx="50%" cy="48%" r="55%">
                <stop offset="0%" stopColor="#f5f8f2" />
                <stop offset="60%" stopColor="#d8e0d4" />
                <stop offset="85%" stopColor="#9da69a" />
                <stop offset="100%" stopColor="#5c655a" />
              </radialGradient>
              <radialGradient id="sclera-grad-r" cx="50%" cy="48%" r="55%">
                <stop offset="0%" stopColor="#f5f8f2" />
                <stop offset="60%" stopColor="#d8e0d4" />
                <stop offset="85%" stopColor="#9da69a" />
                <stop offset="100%" stopColor="#5c655a" />
              </radialGradient>

              {/* Realistic Iris Gradients */}
              <radialGradient id="iris-grad-l" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#182c20" />
                <stop offset="28%" stopColor="#304f3a" />
                <stop offset="65%" stopColor="#41644c" />
                <stop offset="85%" stopColor="#223829" />
                <stop offset="100%" stopColor="#0b140e" />
              </radialGradient>
              <radialGradient id="iris-grad-r" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#182c20" />
                <stop offset="28%" stopColor="#304f3a" />
                <stop offset="65%" stopColor="#41644c" />
                <stop offset="85%" stopColor="#223829" />
                <stop offset="100%" stopColor="#0b140e" />
              </radialGradient>

              {/* Upper eyelid cast shadow on eyeball */}
              <linearGradient id="lid-shadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#040705" stopOpacity="0.88" />
                <stop offset="55%" stopColor="#0a120e" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0a120e" stopOpacity="0" />
              </linearGradient>

              {/* Tooth enamel gradients - Darker, deeply shadowed (Option B) */}
              <linearGradient id="tooth-grad-upper" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e261d" />
                <stop offset="35%" stopColor="#3d4939" />
                <stop offset="75%" stopColor="#697a64" />
                <stop offset="100%" stopColor="#8d9f87" />
              </linearGradient>
              <linearGradient id="tooth-grad-side" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#141a13" />
                <stop offset="40%" stopColor="#2c3629" />
                <stop offset="85%" stopColor="#4f5e4b" />
                <stop offset="100%" stopColor="#677862" />
              </linearGradient>
              <linearGradient id="tooth-grad-back" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a0e0a" />
                <stop offset="50%" stopColor="#1c231a" />
                <stop offset="100%" stopColor="#364233" />
              </linearGradient>
              <linearGradient id="tooth-grad-lower" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#182016" />
                <stop offset="35%" stopColor="#364233" />
                <stop offset="80%" stopColor="#62735d" />
                <stop offset="100%" stopColor="#859780" />
              </linearGradient>

              {/* Upper lip shadow draped over upper teeth */}
              <linearGradient id="lip-overhang-shadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#040102" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#070204" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#070204" stopOpacity="0" />
              </linearGradient>

              {/* Mouth cavity depth */}
              <radialGradient id="mouth-depth" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#140306" />
                <stop offset="70%" stopColor="#060103" />
                <stop offset="100%" stopColor="#010001" />
              </radialGradient>
            </defs>

            {/* Cartoonish Head Silhouette - Craning neck angle (3.2 deg) */}
            <g transform="rotate(3.2, 95, 120)">
              {/* Sleek stylized head contour */}
              <path
                d="M 22 250 C 8 178 12 72 52 28 C 82 -10 138 -8 166 32 C 190 72 192 172 178 250 Z"
                fill="#040705"
              />

              {/* Dark orbital socket hollows under cartoon face */}
              <ellipse cx="68" cy="92" rx="28" ry="20" fill="#020503" opacity="0.5" />
              <ellipse cx="132" cy="88" rx="26" ry="19" fill="#020503" opacity="0.45" />

              {/* Strained neck and jaw muscle contour lines */}
              <path
                d="M 46 220 Q 56 236 68 250"
                stroke="#08100b"
                strokeWidth="1.8"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 144 218 Q 137 235 128 250"
                stroke="#08100b"
                strokeWidth="1.8"
                fill="none"
                opacity="0.55"
              />
              <path
                d="M 96 224 Q 97 237 96 250"
                stroke="#060c08"
                strokeWidth="1.4"
                fill="none"
                opacity="0.4"
              />

              {/* Subtle chin/jaw contour */}
              <path
                d="M 52 248 C 76 254 122 254 148 248"
                fill="none"
                stroke="#09120c"
                strokeWidth="2.5"
                opacity="0.6"
              />

              {/* ==============================================
                  LEFT EYE (Realistic human eye inside cartoon head)
                  ============================================== */}
              <g className="corner-eye-unit">
                {/* Eyeball masked by eyelids */}
                <g clipPath="url(#left-eye-clip)">
                  {/* 3D Sclera */}
                  <rect x="42" y="74" width="56" height="34" fill="url(#sclera-grad-l)" />

                  {/* Delicate red capillary blood vessels */}
                  <path
                    d="M 47 93 Q 53 91 57 92 M 50 92 Q 54 95 59 94 M 93 92 Q 87 91 83 93 M 89 91 Q 86 88 81 89"
                    stroke="#9e3a3a"
                    strokeWidth="0.55"
                    opacity="0.4"
                    fill="none"
                  />

                  {/* Movable Iris & Pupil Group */}
                  <g
                    className="corner-eye-pupil"
                    transform={`translate(${eyeTrack.x}, ${eyeTrack.y})`}
                  >
                    {/* Dark limbal ring */}
                    <circle cx="68" cy="92" r="13" fill="none" stroke="#0a140f" strokeWidth="1.8" opacity="0.9" />

                    {/* Iris with depth gradient */}
                    <circle cx="68" cy="92" r="12.5" fill="url(#iris-grad-l)" />

                    {/* Iris radial striae / fibers */}
                    <g opacity="0.4" stroke="#688f73" strokeWidth="0.5">
                      <line x1="68" y1="80" x2="68" y2="84" />
                      <line x1="68" y1="100" x2="68" y2="104" />
                      <line x1="56" y1="92" x2="60" y2="92" />
                      <line x1="76" y1="92" x2="80" y2="92" />
                      <line x1="59.5" y1="83.5" x2="62.5" y2="86.5" />
                      <line x1="73.5" y1="97.5" x2="76.5" y2="100.5" />
                      <line x1="59.5" y1="100.5" x2="62.5" y2="97.5" />
                      <line x1="73.5" y1="86.5" x2="76.5" y2="83.5" />
                    </g>

                    {/* Deep rich pitch-black pupil */}
                    <ellipse cx="68" cy="92" rx="5.8" ry="6.2" fill="#020302" />

                    {/* Glossy Cornea Specular Reflections (Monitor screen reflection) */}
                    <ellipse
                      cx="65.5"
                      cy="88"
                      rx="3.2"
                      ry="1.8"
                      transform="rotate(-20 65.5 88)"
                      fill="#ffffff"
                      opacity="0.88"
                    />
                    <circle cx="71" cy="96" r="1.1" fill="#ffffff" opacity="0.45" />
                  </g>

                  {/* Upper eyelid cast shadow over eyeball */}
                  <path d="M 46 93 C 50 77 86 76 94 92 C 86 86 54 86 46 93 Z" fill="url(#lid-shadow)" />

                  {/* Inner tear duct moisture */}
                  <circle cx="47" cy="93" r="2.2" fill="#8f4a4a" opacity="0.4" />
                  <circle cx="47" cy="93" r="0.8" fill="#ffffff" opacity="0.55" />

                  {/* Wet waterline gleam */}
                  <path d="M 50 99 Q 68 103 88 99" stroke="#ffffff" strokeWidth="0.6" fill="none" opacity="0.38" />

                  {/* Blink eyelid cover */}
                  <rect
                    x="42"
                    y="74"
                    width="56"
                    height="34"
                    fill="#040705"
                    className={`corner-blink-lid ${blinking ? "is-blinking" : ""}`}
                  />
                </g>

                {/* Stylized dark eyelash contour & upper lid crease */}
                <path
                  d="M 44 93 C 49 76 87 75 96 91"
                  stroke="#040605"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="round"
                  className={`corner-lash-top ${blinking ? "is-blinking" : ""}`}
                />
                <path d="M 47 93 C 53 105 87 105 94 93" stroke="#08100b" strokeWidth="1.2" fill="none" />
                <path d="M 48 76 Q 70 72 90 77" stroke="#1c2620" strokeWidth="1" fill="none" opacity="0.45" />
              </g>

              {/* ==============================================
                  RIGHT EYE (Realistic human eye inside cartoon head)
                  ============================================== */}
              <g className="corner-eye-unit">
                {/* Eyeball masked by eyelids */}
                <g clipPath="url(#right-eye-clip)">
                  {/* 3D Sclera */}
                  <rect x="106" y="70" width="56" height="34" fill="url(#sclera-grad-r)" />

                  {/* Delicate red capillary blood vessels */}
                  <path
                    d="M 111 89 Q 117 87 121 88 M 114 88 Q 118 91 123 90 M 157 88 Q 151 87 147 89 M 153 87 Q 150 84 145 85"
                    stroke="#9e3a3a"
                    strokeWidth="0.55"
                    opacity="0.38"
                    fill="none"
                  />

                  {/* Movable Iris & Pupil Group */}
                  <g
                    className="corner-eye-pupil"
                    transform={`translate(${eyeTrack.x}, ${eyeTrack.y})`}
                  >
                    {/* Dark limbal ring */}
                    <circle cx="132" cy="88" r="12.5" fill="none" stroke="#0a140f" strokeWidth="1.8" opacity="0.9" />

                    {/* Iris with depth gradient */}
                    <circle cx="132" cy="88" r="12" fill="url(#iris-grad-r)" />

                    {/* Iris radial striae / fibers */}
                    <g opacity="0.4" stroke="#688f73" strokeWidth="0.5">
                      <line x1="132" y1="76" x2="132" y2="80" />
                      <line x1="132" y1="96" x2="132" y2="100" />
                      <line x1="120" y1="88" x2="124" y2="88" />
                      <line x1="140" y1="88" x2="144" y2="88" />
                      <line x1="123.5" y1="79.5" x2="126.5" y2="82.5" />
                      <line x1="137.5" y1="93.5" x2="140.5" y2="96.5" />
                      <line x1="123.5" y1="96.5" x2="126.5" y2="93.5" />
                      <line x1="137.5" y1="82.5" x2="140.5" y2="79.5" />
                    </g>

                    {/* Deep rich pitch-black pupil */}
                    <ellipse cx="132" cy="88" rx="5.5" ry="6" fill="#020302" />

                    {/* Glossy Cornea Specular Reflections */}
                    <ellipse
                      cx="129.5"
                      cy="84"
                      rx="3.0"
                      ry="1.7"
                      transform="rotate(-20 129.5 84)"
                      fill="#ffffff"
                      opacity="0.85"
                    />
                    <circle cx="135" cy="92" r="1.0" fill="#ffffff" opacity="0.42" />
                  </g>

                  {/* Upper eyelid cast shadow over eyeball */}
                  <path d="M 110 89 C 114 74 150 73 158 88 C 150 82 118 82 110 89 Z" fill="url(#lid-shadow)" />

                  {/* Inner tear duct moisture */}
                  <circle cx="111" cy="89" r="2.0" fill="#8f4a4a" opacity="0.4" />
                  <circle cx="111" cy="89" r="0.7" fill="#ffffff" opacity="0.5" />

                  {/* Wet waterline gleam */}
                  <path d="M 114 95 Q 132 99 152 95" stroke="#ffffff" strokeWidth="0.6" fill="none" opacity="0.35" />

                  {/* Blink eyelid cover */}
                  <rect
                    x="106"
                    y="70"
                    width="56"
                    height="34"
                    fill="#040705"
                    className={`corner-blink-lid ${blinking ? "is-blinking" : ""}`}
                  />
                </g>

                {/* Stylized dark eyelash contour & upper lid crease */}
                <path
                  d="M 108 89 C 113 73 151 72 160 87"
                  stroke="#040605"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  className={`corner-lash-top ${blinking ? "is-blinking" : ""}`}
                />
                <path d="M 111 89 C 117 101 151 101 158 89" stroke="#08100b" strokeWidth="1.2" fill="none" />
                <path d="M 112 73 Q 134 69 154 74" stroke="#1c2620" strokeWidth="1" fill="none" opacity="0.4" />
              </g>

              {/* Minimal cartoon nose bridge */}
              <path
                d="M 96 98 Q 98 126 94 135"
                fill="none"
                stroke="#15211a"
                strokeWidth="1.4"
                opacity="0.4"
              />

              {/* ==============================================
                  THE DDLC UNSETTLING GRIN (Darker, shadowed humanoid parted teeth - Option B)
                  ============================================== */}
              <g className="corner-smile">
                {/* Dark mouth cavity background */}
                <path
                  d="M 38 167 Q 97 155 156 165 Q 97 206 38 167 Z"
                  fill="url(#mouth-depth)"
                />

                {/* Scalloped upper gum tissue margin */}
                <path
                  d="M 50 166 Q 97 157 144 165 Q 97 170 50 166 Z"
                  fill="#2d080e"
                  opacity="0.95"
                />

                {/* UPPER TEETH ROW (Shadowed humanoid teeth barely emerging from dark) */}
                <g className="upper-teeth">
                  {/* Left Central Incisor */}
                  <path
                    d="M 88 162.5 C 87.5 165.5 87 169 87.5 172 Q 92 173.2 96.5 172 C 97 169 96.5 165.5 96 162.5 C 93.5 161.8 90.5 161.8 88 162.5 Z"
                    fill="url(#tooth-grad-upper)"
                  />
                  {/* Right Central Incisor */}
                  <path
                    d="M 97.5 162.5 C 97 165.5 97 169 97.5 172 Q 102 173.2 106.5 172 C 107 169 106.5 165.5 106 162.5 C 103.5 161.8 100.5 161.8 97.5 162.5 Z"
                    fill="url(#tooth-grad-upper)"
                  />
                  {/* Left Lateral Incisor */}
                  <path
                    d="M 80 163.5 C 79.5 166.5 79 169.5 79.5 171.2 Q 83 172 86.5 171.2 C 87 168.5 86.5 165.5 86 163 C 84 162.5 82 162.5 80 163.5 Z"
                    fill="url(#tooth-grad-upper)"
                  />
                  {/* Right Lateral Incisor */}
                  <path
                    d="M 107.5 163 C 107 165.5 107 168.5 107.5 171.2 Q 111 172 114.5 171.2 C 115 169.5 114.5 166.5 114 163.5 C 112 162.5 110 162.5 107.5 163 Z"
                    fill="url(#tooth-grad-upper)"
                  />
                  {/* Left Canine (anatomical pointed human canine) */}
                  <path
                    d="M 72 164.5 C 71.5 167 71 169.5 72 171.8 Q 75.5 173.8 78.5 171.5 C 79 169 78.5 166.5 78 164 C 76 163.8 74 163.8 72 164.5 Z"
                    fill="url(#tooth-grad-upper)"
                  />
                  {/* Right Canine */}
                  <path
                    d="M 115.5 164 C 115 166.5 114.5 169 115.5 171.5 Q 118.5 173.8 122 171.8 C 123 169.5 122.5 167 122 164.5 C 120 163.8 118 163.8 115.5 164 Z"
                    fill="url(#tooth-grad-upper)"
                  />
                  {/* Left Premolar 1 (curving back into shadow) */}
                  <path
                    d="M 64.5 166 C 64 167.5 63.5 169.5 64 170.8 Q 67.5 171.8 70.5 170.5 C 71 169 71 167.5 70.5 165.5 Z"
                    fill="url(#tooth-grad-side)"
                  />
                  {/* Right Premolar 1 */}
                  <path
                    d="M 123.5 165.5 C 123 167.5 123 169 123.5 170.5 Q 126.5 171.8 130 170.8 C 130.5 169.5 130 167.5 129.5 166 Z"
                    fill="url(#tooth-grad-side)"
                  />
                  {/* Left Premolar 2 / Molar (in deep shadow) */}
                  <path
                    d="M 57.5 167.5 C 57 169 56.5 170.2 57 170.8 Q 60 171.5 63 170.2 C 63.5 169.5 63.5 168.2 63 167 Z"
                    fill="url(#tooth-grad-back)"
                  />
                  {/* Right Premolar 2 / Molar (in deep shadow) */}
                  <path
                    d="M 131 167 C 130.5 168.2 130.5 169.5 131 170.2 Q 134 171.5 137 170.8 C 137.5 170.2 137 169 136.5 167.5 Z"
                    fill="url(#tooth-grad-back)"
                  />

                  {/* Heavy shadow cast from upper lip overhang */}
                  <path
                    d="M 50 166 Q 97 157 144 165 Q 97 170.5 50 166 Z"
                    fill="url(#lip-overhang-shadow)"
                  />

                  {/* Interdental shadow crevices between upper teeth */}
                  <path
                    d="M 97 162 L 97 172.5 M 87 163 L 87 171.5 M 107 163 L 107 171.5 M 79 164 L 79 171 M 115 164 L 115 171 M 71.5 165 L 71.5 170.8 M 122.5 165 L 122.5 170.8 M 63.5 166.5 L 63.5 170 M 130.5 166.5 L 130.5 170"
                    stroke="#050102"
                    strokeWidth="0.8"
                    opacity="0.9"
                  />

                  {/* Subtle wet enamel reflections catching dim light in the dark */}
                  <rect x="89.5" y="171" width="5.2" height="0.8" rx="0.4" fill="#d4e0ce" opacity="0.25" />
                  <rect x="99" y="171" width="5.2" height="0.8" rx="0.4" fill="#d4e0ce" opacity="0.25" />
                  <circle cx="74" cy="171.5" r="0.6" fill="#d4e0ce" opacity="0.2" />
                  <circle cx="120" cy="171.5" r="0.6" fill="#d4e0ce" opacity="0.2" />
                </g>

                {/* PARTED VOID (Deep pitch-black open cavity between upper and lower teeth) */}
                <path
                  d="M 54 171.5 Q 97 175 140 171.5 Q 97 179.5 54 171.5 Z"
                  fill="#020001"
                />

                {/* Scalloped lower gum margin */}
                <path
                  d="M 64 190.5 Q 97 194.5 130 190.5 Q 97 186.5 64 190.5 Z"
                  fill="#2d080e"
                  opacity="0.9"
                />

                {/* LOWER TEETH ROW (Shadowed and emerging from lower jaw) */}
                <g className="lower-teeth" opacity="0.85">
                  {/* Left Lower Central */}
                  <path
                    d="M 92.5 188.5 C 92 185.5 91.5 182.5 92 179.5 Q 94.2 179 96.5 179.5 C 97 182.5 97 185.5 96.5 188.5 Z"
                    fill="url(#tooth-grad-lower)"
                  />
                  {/* Right Lower Central */}
                  <path
                    d="M 97.5 188.5 C 97 185.5 97 182.5 97.5 179.5 Q 99.8 179 102 179.5 C 102.5 182.5 102 185.5 101.5 188.5 Z"
                    fill="url(#tooth-grad-lower)"
                  />
                  {/* Left Lower Lateral */}
                  <path
                    d="M 86.5 189 C 86 186 85.5 183 86 180.2 Q 88.5 179.8 91 180.2 C 91.5 183 91.2 186 91 189 Z"
                    fill="url(#tooth-grad-lower)"
                  />
                  {/* Right Lower Lateral */}
                  <path
                    d="M 103 189 C 102.8 186 102.5 183 103 180.2 Q 105.5 179.8 108 180.2 C 108.5 183 108 186 107.5 189 Z"
                    fill="url(#tooth-grad-lower)"
                  />
                  {/* Left Lower Canine */}
                  <path
                    d="M 80.5 189.5 C 80 186.5 79.5 183.5 80.5 181 Q 83 180.5 85.5 181 C 86 183.5 85.5 186.5 85 189.5 Z"
                    fill="url(#tooth-grad-lower)"
                  />
                  {/* Right Lower Canine */}
                  <path
                    d="M 109 189.5 C 108.5 186.5 108 183.5 108.5 181 Q 111 180.5 113.5 181 C 114.5 183.5 114 186.5 113.5 189.5 Z"
                    fill="url(#tooth-grad-lower)"
                  />
                  {/* Left Lower Premolar */}
                  <path
                    d="M 74 190 C 73.5 187 73 184.5 74 182.5 Q 76.8 181.8 79.5 182.5 C 80 184.5 79.8 187 79 190 Z"
                    fill="url(#tooth-grad-lower)"
                  />
                  {/* Right Lower Premolar */}
                  <path
                    d="M 114.5 190 C 114 187 114 184.5 114.5 182.5 Q 117.2 181.8 120 182.5 C 120.5 184.5 120 187 119.5 190 Z"
                    fill="url(#tooth-grad-lower)"
                  />

                  {/* Interdental shadow crevices between lower teeth */}
                  <path
                    d="M 97 179.5 L 97 188.5 M 91.5 180 L 91.5 189 M 102.5 180 L 102.5 189 M 85.5 180.8 L 85.5 189.5 M 108.5 180.8 L 108.5 189.5 M 79.5 181.8 L 79.5 190 M 114 181.8 L 114 190"
                    stroke="#050102"
                    strokeWidth="0.8"
                    opacity="0.85"
                  />

                  {/* Highlights on lower incisors */}
                  <rect x="93" y="180.2" width="2.4" height="0.8" rx="0.4" fill="#d4e0ce" opacity="0.2" />
                  <rect x="98.5" y="180.2" width="2.4" height="0.8" rx="0.4" fill="#d4e0ce" opacity="0.2" />
                </g>

                {/* Stiff drawn lip contours */}
                <path
                  d="M 38 167 Q 96 155 156 165"
                  fill="none"
                  stroke="#223328"
                  strokeWidth="2.0"
                  strokeLinecap="round"
                />
                <path
                  d="M 38 167 Q 96 206 156 165"
                  fill="none"
                  stroke="#1c2c22"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                {/* Stretched cheek creases from unnaturally wide grin */}
                <path
                  d="M 34 158 Q 26 168 33 178"
                  fill="none"
                  stroke="#1d2a21"
                  strokeWidth="1.8"
                />
                <path
                  d="M 160 156 Q 168 166 161 176"
                  fill="none"
                  stroke="#1d2a21"
                  strokeWidth="1.8"
                />
                <path
                  d="M 42 153 Q 66 155 86 161"
                  fill="none"
                  stroke="#16221a"
                  strokeWidth="1.2"
                  opacity="0.45"
                />
                <path
                  d="M 152 152 Q 128 154 108 160"
                  fill="none"
                  stroke="#16221a"
                  strokeWidth="1.2"
                  opacity="0.45"
                />
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
