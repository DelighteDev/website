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
          <path d="M38 500C17 362 32 116 114 37c42-41 103-33 137 17 54 80 50 306 21 446Z" fill="#5f6a61" />
          <ellipse cx="108" cy="198" rx="34" ry="14" fill="#c0c5b9" />
          <ellipse cx="205" cy="194" rx="29" ry="14" fill="#c0c5b9" />
          <ellipse cx="109" cy="198" rx="8" ry="17" fill="#050706" />
          <ellipse cx="204" cy="194" rx="7" ry="17" fill="#050706" />
          <path d="M91 330c41-24 90-23 130 4-23 70-45 93-69 90-27-3-45-36-61-94Z" fill="#030504" />
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
