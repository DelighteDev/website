import { useEffect, useRef, useState } from "react";

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function seedFromName(name) {
  return [...name].reduce((total, letter) => ((total << 5) - total + letter.charCodeAt(0)) | 0, 0);
}

function StaringFace() {
  return (
    <svg className="peripheral-face" viewBox="0 0 360 540" aria-hidden="true">
      <rect width="360" height="540" fill="#020303" />
      <path d="M64 540c-24-144-9-351 65-421 38-37 96-34 128 9 62 83 64 285 40 412Z" fill="#171d1a" />
      <path d="M75 220c40-50 91-49 125 4-36 35-91 34-125-4Z" fill="#c4c9bb" />
      <path d="M209 218c29-38 69-36 91 7-30 28-65 25-91-7Z" fill="#c4c9bb" />
      <ellipse cx="143" cy="222" rx="14" ry="34" fill="#030505" />
      <ellipse cx="250" cy="220" rx="12" ry="34" fill="#030505" />
      <path d="M89 382c55-38 135-37 190 5-36 76-66 108-99 103-39-5-65-44-91-108Z" fill="#010202" />
      <path d="M108 391c44 17 94 18 147 3M124 421c37 12 76 12 113-2" stroke="#aab0a3" strokeWidth="5" opacity="0.55" />
      <path d="M130 391l-4 50m34-45-2 68m37-66 1 66m34-73 4 49" stroke="#d3d5c8" strokeWidth="3" opacity="0.48" />
    </svg>
  );
}

export function CorruptedArtwork({ item, featured = false, flash = false }) {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const source = item.horrorImage || item.image;

  useEffect(() => {
    const frame = frameRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !source) return undefined;
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      const width = 360;
      const height = 540;
      canvas.width = width;
      canvas.height = height;
      const random = seededRandom(seedFromName(item.name));

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.filter = item.horrorImage
        ? "grayscale(0.35) contrast(1.18) brightness(0.72)"
        : "grayscale(0.88) contrast(1.65) brightness(0.52)";
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      context.filter = "none";

      const pixels = context.getImageData(0, 0, width, height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const noise = (random() - 0.5) * (item.horrorImage ? 12 : 34);
        pixels.data[index] = Math.max(0, pixels.data[index] * 0.82 + noise);
        pixels.data[index + 1] = Math.max(0, pixels.data[index + 1] * 0.9 + noise * 0.7);
        pixels.data[index + 2] = Math.max(0, pixels.data[index + 2] * 0.78 + noise * 0.45);
      }
      context.putImageData(pixels, 0, 0);

      if (!item.horrorImage) {
        for (let tear = 0; tear < 8; tear += 1) {
          const y = Math.floor(random() * height);
          const stripHeight = 2 + Math.floor(random() * 13);
          const shift = Math.floor((random() - 0.5) * 44);
          context.drawImage(canvas, 0, y, width, stripHeight, shift, y, width, stripHeight);
        }

        const faceY = height * (0.24 + random() * 0.17);
        const leftEye = width * (0.34 + random() * 0.09);
        const rightEye = width * (0.61 + random() * 0.08);
        context.save();
        context.filter = "blur(3px)";
        context.fillStyle = "rgba(0, 0, 0, 0.9)";
        context.beginPath();
        context.ellipse(leftEye, faceY, 27 + random() * 18, 13 + random() * 15, -0.15, 0, Math.PI * 2);
        context.ellipse(rightEye, faceY + random() * 9 - 4, 25 + random() * 17, 15 + random() * 17, 0.16, 0, Math.PI * 2);
        context.fill();
        context.filter = "blur(5px)";
        context.beginPath();
        context.ellipse(width * 0.5, faceY + 105 + random() * 45, 25 + random() * 20, 50 + random() * 38, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.strokeStyle = "rgba(2, 4, 3, 0.78)";
        context.lineWidth = 1.2;
        for (let scratch = 0; scratch < 25; scratch += 1) {
          const x = random() * width;
          const y = random() * height;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + (random() - 0.5) * 70, y + 25 + random() * 130);
          context.stroke();
        }
      }

      context.fillStyle = "rgba(0, 0, 0, 0.13)";
      for (let line = 0; line < height; line += 4) context.fillRect(0, line, width, 1);
      context.fillStyle = "rgba(45, 0, 8, 0.12)";
      context.fillRect(0, 0, width, height);
    };
    image.onerror = () => setFailed(true);
    image.src = source;
    return () => {
      cancelled = true;
    };
  }, [shouldLoad, source, item.name, item.horrorImage]);

  if (!source || failed) {
    return (
      <div className={`name-tile corrupted-name-tile ${featured ? "is-featured" : ""}`} role="img" aria-label={item.name}>
        <span>{item.name}</span>
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      className={`corrupted-artwork ${near ? "is-near" : ""} ${featured ? "is-featured" : ""}`}
      onPointerMove={() => setNear(true)}
      onPointerLeave={() => setNear(false)}
    >
      <canvas ref={canvasRef} role="img" aria-label={`${item.name} corrupted artwork`} />
      <div className="corruption-scanlines" aria-hidden="true" />
      {flash && <StaringFace />}
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
