function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function seedFromName(name) {
  return [...name].reduce(
    (total, letter) => ((total << 5) - total + letter.charCodeAt(0)) | 0,
    0,
  );
}

function copyCanvas(canvas) {
  const copy = document.createElement("canvas");
  copy.width = canvas.width;
  copy.height = canvas.height;
  copy.getContext("2d").drawImage(canvas, 0, 0);
  return copy;
}

function tear(context, canvas, random, count = 12) {
  for (let index = 0; index < count; index += 1) {
    const y = Math.floor(random() * canvas.height);
    const stripHeight = 2 + Math.floor(random() * 17);
    const shift = Math.floor((random() - 0.5) * 62);
    context.drawImage(
      canvas,
      0,
      y,
      canvas.width,
      stripHeight,
      shift,
      y,
      canvas.width,
      stripHeight,
    );
  }
}

function scratch(context, random, count, colour = "rgba(2, 4, 3, 0.72)") {
  context.strokeStyle = colour;
  for (let index = 0; index < count; index += 1) {
    const x = random() * 360;
    const y = random() * 540;
    context.lineWidth = 0.4 + random() * 1.5;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + (random() - 0.5) * 90, y + 20 + random() * 160);
    context.stroke();
  }
}

function addGrain(context, random, customImage) {
  const pixels = context.getImageData(0, 0, 360, 540);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const noise = (random() - 0.5) * (customImage ? 10 : 29);
    pixels.data[index] = Math.max(0, pixels.data[index] * 0.83 + noise);
    pixels.data[index + 1] = Math.max(0, pixels.data[index + 1] * 0.88 + noise * 0.65);
    pixels.data[index + 2] = Math.max(0, pixels.data[index + 2] * 0.79 + noise * 0.4);
  }
  context.putImageData(pixels, 0, 0);
}

export function drawCorruptedArtwork(canvas, image, item) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const random = seededRandom(seedFromName(item.name));
  const variant = Math.abs(seedFromName(item.name)) % 8;
  canvas.width = 360;
  canvas.height = 540;

  const scale = Math.max(360 / image.naturalWidth, 540 / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  const filters = [
    "grayscale(0.8) contrast(1.65) brightness(0.5)",
    "grayscale(0.72) contrast(1.85) brightness(0.44)",
    "grayscale(0.95) contrast(1.45) brightness(0.58)",
    "grayscale(0.65) contrast(1.7) brightness(0.46)",
    "grayscale(0.88) contrast(1.5) brightness(0.42)",
    "grayscale(0.8) contrast(1.8) brightness(0.55)",
    "grayscale(0.9) contrast(1.55) brightness(0.4)",
    "grayscale(0.75) contrast(1.9) brightness(0.48)",
  ];
  context.filter = item.horrorImage
    ? "grayscale(0.3) contrast(1.18) brightness(0.72)"
    : filters[variant];
  context.drawImage(image, (360 - drawWidth) / 2, (540 - drawHeight) / 2, drawWidth, drawHeight);
  context.filter = "none";
  addGrain(context, random, Boolean(item.horrorImage));

  if (!item.horrorImage) {
    if (variant === 0) {
      tear(context, canvas, random, 20);
      scratch(context, random, 18);
    } else if (variant === 1) {
      const original = copyCanvas(canvas);
      for (let y = 0; y < 540; y += 4) {
        const shift = Math.sin(y * 0.045) * (7 + random() * 15);
        context.drawImage(original, 0, y, 360, 4, shift, y, 360, 4);
      }
      context.fillStyle = "rgba(0,0,0,0.32)";
      context.fillRect(0, 250 + random() * 130, 360, 7 + random() * 20);
    } else if (variant === 2) {
      const original = copyCanvas(canvas);
      for (let band = 0; band < 7; band += 1) {
        const y = random() * 500;
        const height = 8 + random() * 38;
        context.save();
        context.filter = "invert(0.88) contrast(1.4)";
        context.globalAlpha = 0.38 + random() * 0.35;
        context.drawImage(original, 0, y, 360, height, 0, y, 360, height);
        context.restore();
      }
      tear(context, canvas, random, 7);
    } else if (variant === 3) {
      const original = copyCanvas(canvas);
      context.fillStyle = "#020403";
      context.fillRect(0, 0, 360, 540);
      for (let x = 0; x < 360; x += 30) {
        const shift = (random() - 0.5) * 150;
        context.drawImage(original, x, 0, 30, 540, x, shift, 30, 540);
        context.fillStyle = `rgba(0,0,0,${0.12 + random() * 0.3})`;
        context.fillRect(x, 0, 2, 540);
      }
    } else if (variant === 4) {
      const original = copyCanvas(canvas);
      context.fillStyle = "#020403";
      context.fillRect(0, 0, 360, 540);
      context.globalAlpha = 0.72;
      context.drawImage(original, -24, -18, 408, 576);
      context.globalAlpha = 0.24;
      context.filter = "invert(0.75)";
      context.drawImage(original, 29, 8, 342, 522);
      context.filter = "none";
      context.globalAlpha = 1;
      scratch(context, random, 32, "rgba(118,130,116,0.18)");
    } else if (variant === 5) {
      for (let bar = 0; bar < 6; bar += 1) {
        const y = 40 + random() * 450;
        const x = random() * 170;
        context.fillStyle = `rgba(0,0,0,${0.65 + random() * 0.3})`;
        context.fillRect(x, y, 90 + random() * 180, 5 + random() * 25);
      }
      tear(context, canvas, random, 10);
      scratch(context, random, 15);
    } else if (variant === 6) {
      const burn = context.createRadialGradient(180, 230, 20, 180, 260, 300);
      burn.addColorStop(0, "rgba(0,0,0,0.08)");
      burn.addColorStop(0.55, "rgba(0,0,0,0.22)");
      burn.addColorStop(1, "rgba(0,0,0,0.94)");
      context.fillStyle = burn;
      context.fillRect(0, 0, 360, 540);
      for (let drip = 0; drip < 22; drip += 1) {
        const x = random() * 360;
        const y = random() * 310;
        context.strokeStyle = `rgba(68,5,14,${0.15 + random() * 0.35})`;
        context.lineWidth = 1 + random() * 3;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + (random() - 0.5) * 7, y + 50 + random() * 180);
        context.stroke();
      }
    } else {
      const original = copyCanvas(canvas);
      for (let block = 0; block < 75; block += 1) {
        const x = Math.floor(random() * 330);
        const y = Math.floor(random() * 520);
        const width = 8 + Math.floor(random() * 38);
        const height = 3 + Math.floor(random() * 14);
        context.drawImage(original, x, y, width, height, x + (random() - 0.5) * 70, y, width, height);
      }
      context.fillStyle = "rgba(0,0,0,0.3)";
      context.fillRect(0, 0, 360, 540);
    }
  }

  context.fillStyle = "rgba(0, 0, 0, 0.14)";
  for (let line = 0; line < 540; line += 4) context.fillRect(0, line, 360, 1);
  context.fillStyle = "rgba(45, 0, 8, 0.1)";
  context.fillRect(0, 0, 360, 540);
}
