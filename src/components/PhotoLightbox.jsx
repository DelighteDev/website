import { useEffect, useRef } from "react";

export default function PhotoLightbox({ photos, selectedId, onClose, onSelect }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchStart = useRef(null);
  const index = photos.findIndex((photo) => photo.id === selectedId);
  const photo = photos[index];

  const showPrevious = () => {
    const previous = (index - 1 + photos.length) % photos.length;
    onSelect(photos[previous].id);
  };

  const showNext = () => {
    const next = (index + 1) % photos.length;
    onSelect(photos[next].id);
  };

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
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
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        onClick={onClose}
      >
        Close
      </button>
      <div className="lightbox-photo">
        <img src={photo.src} alt={photo.alt || photo.title} />
      </div>
      {(photo.title || photo.place || photo.date || photo.camera) && (
        <div className="lightbox-caption">
          {photo.title && <h2>{photo.title}</h2>}
          {photo.place && <p>{photo.place}</p>}
          {photo.date && <p>{photo.date}</p>}
          {photo.camera && <p>{photo.camera}</p>}
        </div>
      )}
      <div className="lightbox-controls">
        <button type="button" onClick={showPrevious}>Previous</button>
        <button type="button" onClick={showNext}>Next</button>
      </div>
    </div>
  );
}
