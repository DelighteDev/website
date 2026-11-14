import { useEffect, useRef, useState } from "react";
import { drawCorruptedArtwork } from "../corruptArtwork";

function PeripheralCorridor() {
  return (
    <svg className="peripheral-corridor" viewBox="0 0 360 540" aria-hidden="true">
      <rect width="360" height="540" fill="#020303" />
      <path d="M0 0h360L274 540H86Z" fill="#111713" />
      <path d="M0 0l130 150v390H0Zm360 0L230 150v390h130Z" fill="#080d0b" />
      <path d="M130 150h100v390H130Z" fill="#030605" />
      <path d="M149 184h62v273h-62Z" fill="#141a16" stroke="#354039" strokeWidth="3" />
      <path d="M158 194h43v263h-43Z" fill="#000" />
      <path d="M158 194l23 14v249h-23Z" fill="#0c110e" />
      <path d="M130 540l50-83h62l-12 83Z" fill="#090d0b" />
      <path d="M142 128h76" stroke="#879087" strokeWidth="4" opacity="0.2" />
      <path d="M0 0h360v540H0Z" fill="none" stroke="#400710" strokeWidth="12" opacity="0.25" />
    </svg>
  );
}

export function CorruptedArtwork({ item, featured = false, flash = false }) {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const source = item.horrorImage || item.image;

  useEffect(() => {
    if (!source) return undefined;
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) drawCorruptedArtwork(canvasRef.current, image, item);
    };
    image.onerror = () => setFailed(true);
    image.src = source;
    return () => {
      cancelled = true;
    };
  }, [source, item]);

  if (!source || failed) {
    return (
      <div className={`name-tile corrupted-name-tile ${featured ? "is-featured" : ""}`} role="img" aria-label={item.name}>
        <span>{item.name}</span>
      </div>
    );
  }

  return (
    <div
      className={`corrupted-artwork ${near ? "is-near" : ""} ${featured ? "is-featured" : ""}`}
      onPointerMove={() => setNear(true)}
      onPointerLeave={() => setNear(false)}
    >
      <canvas ref={canvasRef} role="img" aria-label={`${item.name} corrupted artwork`} />
      <div className="corruption-scanlines" aria-hidden="true" />
      {flash && <PeripheralCorridor />}
    </div>
  );
}

export function CorruptedSpotlight({ item }) {
  return (
    <div className="artwork-spotlight">
      <div className="artwork-frame corrupted-frame">
        <CorruptedArtwork item={item} featured />
      </div>
      <h3>{item.name}</h3>
    </div>
  );
}

export function CorruptedGrid({ items, flashId }) {
  return (
    <div className="artwork-grid">
      {items.map((item) => (
        <figure className="artwork-item" key={item.id}>
          <div className="artwork-frame corrupted-frame">
            <CorruptedArtwork item={item} flash={flashId === item.id} />
          </div>
          <figcaption>{item.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
