import { useCallback, useEffect, useRef, useState } from "react";
import ProceduralPhoto from "./ProceduralPhoto";

export default function HorrorLightbox({ photos, selectedId, onClose, onSelect }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchStart = useRef(null);
  const idleTimer = useRef(null);
  const slipTimer = useRef(null);
  const hesitated = useRef(false);
  const [creeping, setCreeping] = useState(false);
  const [slipping, setSlipping] = useState(false);
  const index = photos.findIndex((photo) => photo.id === selectedId);
  const photo = photos[index];

  const showPrevious = () => {
    const previous = (index - 1 + photos.length) % photos.length;
    onSelect(photos[previous].id);
  };
  const showNext = () => onSelect(photos[(index + 1) % photos.length].id);

  const resetCreep = useCallback(() => {
    setCreeping(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setCreeping(true), 1400);
  }, []);

  useEffect(() => {
    resetCreep();
    return () => window.clearTimeout(idleTimer.current);
  }, [selectedId, resetCreep]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
      window.clearTimeout(slipTimer.current);
    };
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll("button");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [index, photos, onClose]);

  if (!photo) return null;

  const closeWithHesitation = () => {
    if (!hesitated.current) {
      hesitated.current = true;
      setSlipping(true);
      slipTimer.current = window.setTimeout(() => setSlipping(false), 380);
      return;
    }
    onClose();
  };

  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = (event) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const horizontal = touch.clientX - touchStart.current.x;
    const vertical = touch.clientY - touchStart.current.y;
    if (Math.abs(horizontal) > 45 && Math.abs(horizontal) > Math.abs(vertical)) {
      if (horizontal > 0) showPrevious();
      else showNext();
    }
    touchStart.current = null;
  };

  return (
    <div
      className="lightbox horror-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      ref={dialogRef}
      onPointerMove={resetCreep}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        ref={closeRef}
        type="button"
        className={`lightbox-close ${slipping ? "is-slipping" : ""}`}
        onClick={closeWithHesitation}
      >
        Close
      </button>
      <div className={`lightbox-photo horror-lightbox-photo ${creeping ? "is-creeping" : ""}`}>
        <ProceduralPhoto key={photo.id} photo={photo} large />
        <svg className="lightbox-hidden-face" viewBox="0 0 300 500" aria-hidden="true">
          <g transform="rotate(-2, 150, 250)">
            <path d="M32 500C10 355 25 105 110 30c45-44 110-36 144 18 58 84 54 318 24 452Z" fill="#4a544d" opacity="0.7" />
            {/* Sunken eye sockets */}
            <ellipse cx="105" cy="190" rx="32" ry="24" fill="#030504" opacity="0.6" />
            <ellipse cx="208" cy="186" rx="29" ry="25" fill="#030504" opacity="0.55" />
            {/* Staring eyes */}
            <path d="M78 192c12-22 46-24 56 0-14 18-44 20-56 0Z" fill="#b8bdb2" opacity="0.75" />
            <path d="M183 187c10-20 42-22 52-1-12 17-42 19-52 1Z" fill="#bcc1b5" opacity="0.7" />
            <ellipse cx="108" cy="192" rx="13" ry="17" fill="#040605" />
            <ellipse cx="208" cy="188" rx="12" ry="16" fill="#040605" />
            <circle cx="104" cy="186" r="2" fill="#c8cdc3" opacity="0.45" />
            <circle cx="204" cy="182" r="1.6" fill="#c8cdc3" opacity="0.38" />
            {/* Mouth - too wide */}
            <path d="M68 340c48-28 100-27 150 4-28 72-52 98-80 95-30-3-50-38-70-99Z" fill="#020403" />
            <path d="M86 348c36 14 80 15 124 2" stroke="#a0a69a" strokeWidth="4" opacity="0.45" />
            <path d="M100 348l-2 40m26-38-1 48m30-46 0 45m28-50 2 42m24-46 1 36" stroke="#bbbfb2" strokeWidth="2" opacity="0.35" />
          </g>
        </svg>
      </div>
      {photo.caption && (
        <div className="lightbox-caption"><p>{photo.caption}</p></div>
      )}
      <div className="lightbox-controls">
        <button type="button" onClick={showPrevious}>Previous</button>
        <button type="button" onClick={showNext}>Next</button>
      </div>
    </div>
  );
}
