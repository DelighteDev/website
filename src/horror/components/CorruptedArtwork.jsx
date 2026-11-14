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
      {/* Gaunt head shape with skin distortion */}
      <g transform="rotate(-1.5, 180, 270)">
        <path d="M58 540c-26-148-12-360 68-432 40-38 100-36 134 10 65 88 68 295 44 422Z" fill="#141a17" />
        {/* Hollowed eye sockets */}
        <ellipse cx="135" cy="215" rx="38" ry="30" fill="#050707" />
        <ellipse cx="248" cy="212" rx="35" ry="31" fill="#050707" />
        {/* Eye whites - too wide, staring */}
        <path d="M100 218c16-28 58-30 72 0-18 24-56 26-72 0Z" fill="#c0c6b9" opacity="0.85" />
        <path d="M215 213c14-26 54-28 67-1-16 22-52 25-67 1Z" fill="#c4c9bc" opacity="0.78" />
        {/* Dilated pupils */}
        <ellipse cx="140" cy="219" rx="16" ry="22" fill="#030505" />
        <ellipse cx="247" cy="216" rx="14" ry="21" fill="#030505" />
        {/* Pinprick reflections */}
        <circle cx="134" cy="210" r="2.5" fill="#d0d5cb" opacity="0.5" />
        <circle cx="241" cy="208" r="2" fill="#d0d5cb" opacity="0.4" />
        {/* Mouth - stretched impossibly wide, showing teeth */}
        <path d="M72 385c60-42 145-40 210 5-42 80-72 112-110 108-42-5-72-48-100-113Z" fill="#020303" />
        <path d="M98 394c48 18 104 20 160 3M116 426c40 13 84 13 124-2" stroke="#aab0a3" strokeWidth="4.5" opacity="0.5" />
        <path d="M118 394l-4 52m30-48-2 58m34-56 1 54m32-60 3 52m28-56 2 46" stroke="#c8cab8" strokeWidth="2.5" opacity="0.4" />
        {/* Cheek creases from the too-wide grin */}
        <path d="M68 378c-6-12-8-22-4-32" stroke="#2a3530" strokeWidth="2" opacity="0.35" fill="none" />
        <path d="M288 372c5-13 6-24 2-33" stroke="#2a3530" strokeWidth="2" opacity="0.3" fill="none" />
        {/* Under-eye hollows */}
        <path d="M105 248c20 8 44 7 62-2" stroke="#060908" strokeWidth="4" opacity="0.45" fill="none" />
        <path d="M222 244c18 7 38 6 55-3" stroke="#060908" strokeWidth="3.5" opacity="0.4" fill="none" />
      </g>
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
