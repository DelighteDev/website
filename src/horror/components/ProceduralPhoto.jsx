import { useEffect, useRef } from "react";

function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function ProceduralPhoto({ photo, large = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const width = 480;
    const height = 600;
    canvas.width = width;
    canvas.height = height;
    const random = randomGenerator(photo.seed);

    const grain = () => {
      for (let index = 0; index < 10500; index += 1) {
        const shade = Math.floor(random() * 35);
        context.fillStyle = `rgba(${shade}, ${shade + 5}, ${shade + 2}, ${random() * 0.16})`;
        context.fillRect(random() * width, random() * height, 1 + random() * 2, 1 + random() * 2);
      }
      context.fillStyle = "rgba(0, 0, 0, 0.19)";
      for (let line = 0; line < height; line += 5) context.fillRect(0, line, width, 1);
      const vignette = context.createRadialGradient(width / 2, height / 2, 70, width / 2, height / 2, 390);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.82)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);
    };

    const silhouette = (x, y, scale = 1, alpha = 0.75) => {
      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = "#020303";
      context.beginPath();
      context.ellipse(x, y - 104 * scale, 29 * scale, 39 * scale, -0.08, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(x - 54 * scale, y + 100 * scale);
      context.quadraticCurveTo(x - 47 * scale, y - 66 * scale, x, y - 64 * scale);
      context.quadraticCurveTo(x + 47 * scale, y - 66 * scale, x + 54 * scale, y + 100 * scale);
      context.closePath();
      context.fill();
      context.restore();
    };

    const drawScene = () => {
      const background = context.createLinearGradient(0, 0, 0, height);
      background.addColorStop(0, "#111a17");
      background.addColorStop(1, "#020404");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      if (photo.variant === 0) {
        context.fillStyle = "#1b2420";
        context.fillRect(54, 45, 372, 540);
        context.fillStyle = "#030605";
        context.fillRect(116, 83, 242, 502);
        context.strokeStyle = "#354039";
        context.lineWidth = 9;
        context.strokeRect(108, 75, 258, 510);
        context.fillStyle = "#151c18";
        context.beginPath();
        context.moveTo(116, 83);
        context.lineTo(196, 116);
        context.lineTo(194, 585);
        context.lineTo(116, 585);
        context.closePath();
        context.fill();
        silhouette(303 + random() * 25, 390, 1.05, 0.88);
        context.fillStyle = "#81877b";
        context.beginPath();
        context.ellipse(303, 274, 5, 3, 0, 0, Math.PI * 2);
        context.ellipse(327, 273, 4, 3, 0, 0, Math.PI * 2);
        context.fill();
      } else if (photo.variant === 1) {
        context.fillStyle = "#202923";
        context.beginPath();
        context.ellipse(242, 286, 145, 211, -0.06, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#050707";
        context.beginPath();
        context.ellipse(184, 242, 47, 25, -0.2, 0, Math.PI * 2);
        context.ellipse(300, 236, 42, 29, 0.15, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.ellipse(245, 403, 43, 91, 0.08, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#050706";
        context.lineWidth = 3;
        for (let index = 0; index < 42; index += 1) {
          const x = 95 + random() * 300;
          const y = 120 + random() * 340;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x + (random() - 0.5) * 120, y + random() * 100);
          context.stroke();
        }
      } else if (photo.variant === 2) {
        context.fillStyle = "#080d0c";
        context.fillRect(54, 52, 372, 410);
        context.strokeStyle = "#29332d";
        context.lineWidth = 14;
        context.strokeRect(54, 52, 372, 410);
        context.lineWidth = 7;
        context.beginPath();
        context.moveTo(240, 52);
        context.lineTo(240, 462);
        context.moveTo(54, 254);
        context.lineTo(426, 254);
        context.stroke();
        silhouette(335, 385, 0.8, 0.63);
        context.strokeStyle = "rgba(88, 9, 19, 0.55)";
        for (let index = 0; index < 72; index += 1) {
          const x = 65 + random() * 350;
          const y = 60 + random() * 380;
          context.lineWidth = 0.5 + random() * 2;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x - 8, y + 35 + random() * 90);
          context.stroke();
        }
        context.fillStyle = "#111713";
        context.fillRect(0, 468, width, 132);
      } else if (photo.variant === 3) {
        context.strokeStyle = "#27322b";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(0, 420);
        context.lineTo(480, 350);
        context.moveTo(58, 600);
        context.lineTo(214, 365);
        context.moveTo(425, 600);
        context.lineTo(300, 360);
        context.stroke();
        context.fillStyle = "#111814";
        context.fillRect(85, 255, 120, 160);
        context.fillRect(102, 410, 13, 130);
        context.fillRect(177, 410, 13, 130);
        context.fillStyle = "#050807";
        context.fillRect(290, 84, 142, 310);
        context.strokeStyle = "#27332c";
        context.lineWidth = 7;
        context.strokeRect(290, 84, 142, 310);
        silhouette(174, 414, 0.72, 0.5);
        context.fillStyle = "#050706";
        context.fillRect(0, 540, width, 60);
      } else {
        context.fillStyle = "#1b241f";
        context.fillRect(38, 65, 404, 440);
        const positions = [117, 214, 315, 382];
        positions.forEach((x, index) => silhouette(x, 360 + (index % 2) * 24, 0.85 + random() * 0.2, 0.72));
        context.strokeStyle = "#050706";
        context.lineWidth = 5;
        positions.forEach((x) => {
          for (let index = 0; index < 11; index += 1) {
            context.beginPath();
            context.moveTo(x - 43 + random() * 86, 213 + random() * 45);
            context.lineTo(x - 45 + random() * 90, 270 + random() * 45);
            context.stroke();
          }
        });
        context.fillStyle = "#0b100e";
        context.fillRect(38, 505, 404, 35);
      }
      grain();
    };

    if (photo.image) {
      const image = new Image();
      image.onload = () => {
        if (cancelled) return;
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        context.filter = "grayscale(0.65) contrast(1.4) brightness(0.5)";
        context.drawImage(
          image,
          (width - image.naturalWidth * scale) / 2,
          (height - image.naturalHeight * scale) / 2,
          image.naturalWidth * scale,
          image.naturalHeight * scale,
        );
        context.filter = "none";
        grain();
      };
      image.onerror = drawScene;
      image.src = photo.image;
    } else {
      drawScene();
    }

    return () => {
      cancelled = true;
    };
  }, [photo]);

  return <canvas ref={canvasRef} className={`procedural-photo ${large ? "is-large" : ""}`} role="img" aria-label={photo.alt} />;
}
