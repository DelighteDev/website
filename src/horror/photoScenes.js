function randomGenerator(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

const WIDTH = 480;
const HEIGHT = 600;

function polygon(context, points, fill, stroke = null, lineWidth = 1) {
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.closePath();
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.stroke();
  }
}

function background(context, top = "#121a17", bottom = "#020404") {
  const gradient = context.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  context.fillStyle = gradient;
  context.fillRect(0, 0, WIDTH, HEIGHT);
}

function corridor(context, random) {
  background(context);
  polygon(context, [[0, 0], [480, 0], [335, 184], [145, 184]], "#111814");
  polygon(context, [[0, 600], [480, 600], [335, 355], [145, 355]], "#0a0f0d");
  polygon(context, [[0, 0], [145, 184], [145, 355], [0, 600]], "#161d19");
  polygon(context, [[480, 0], [335, 184], [335, 355], [480, 600]], "#0d1310");
  context.fillStyle = "#010303";
  context.fillRect(145, 184, 190, 171);
  context.fillStyle = "#222923";
  context.fillRect(208, 178, 64, 8);
  context.fillStyle = "#6e7569";
  context.globalAlpha = 0.24;
  context.fillRect(214, 181, 52, 2);
  context.globalAlpha = 1;
  for (let index = 0; index < 4; index += 1) {
    const inset = index * 28;
    const alpha = 0.34 - index * 0.05;
    context.strokeStyle = `rgba(61,72,63,${alpha})`;
    context.lineWidth = 4;
    context.strokeRect(22 + inset, 82 + index * 34, 94 - index * 12, 360 - index * 49);
    context.strokeRect(364 - inset + index * 12, 82 + index * 34, 94 - index * 12, 360 - index * 49);
  }
  context.strokeStyle = "#252e28";
  context.lineWidth = 2;
  for (let index = 0; index < 9; index += 1) {
    context.beginPath();
    context.moveTo(240, 355);
    context.lineTo(index * 60, 600);
    context.stroke();
  }
  for (let index = 0; index < 12; index += 1) {
    const x = 35 + random() * 410;
    const y = random() * 560;
    context.fillStyle = "rgba(0,0,0,0.2)";
    context.fillRect(x, y, 2 + random() * 20, 1 + random() * 3);
  }
}

function stairwell(context, random) {
  background(context, "#161d19", "#030605");
  polygon(context, [[0, 0], [160, 0], [160, 600], [0, 600]], "#111713");
  polygon(context, [[480, 0], [350, 0], [350, 600], [480, 600]], "#090e0c");
  for (let index = 0; index < 12; index += 1) {
    const y = 110 + index * 38;
    const inset = index * 8;
    polygon(
      context,
      [[110 + inset, y], [370 - inset, y], [350 - inset, y + 25], [130 + inset, y + 25]],
      index % 2 ? "#151c18" : "#1b221d",
      "#28322b",
    );
  }
  context.strokeStyle = "#3a443b";
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(78, 96);
  context.lineTo(190, 570);
  context.moveTo(402, 96);
  context.lineTo(290, 570);
  context.stroke();
  context.lineWidth = 3;
  for (let index = 0; index < 8; index += 1) {
    const y = 130 + index * 55;
    context.beginPath();
    context.moveTo(87 + index * 13, y);
    context.lineTo(87 + index * 13, y + 85);
    context.moveTo(393 - index * 13, y);
    context.lineTo(393 - index * 13, y + 85);
    context.stroke();
  }
  context.fillStyle = "rgba(1,3,2,0.72)";
  context.fillRect(180, 0, 120, 76);
  for (let index = 0; index < 20; index += 1) {
    context.fillStyle = "rgba(0,0,0,0.18)";
    context.fillRect(random() * 480, random() * 600, 2, 10 + random() * 70);
  }
}

function rainyWindow(context, random) {
  background(context, "#0b1211", "#020404");
  context.fillStyle = "#030706";
  context.fillRect(42, 38, 396, 474);
  for (let building = 0; building < 8; building += 1) {
    const x = 48 + building * 51;
    const height = 90 + random() * 230;
    context.fillStyle = building % 2 ? "#0c1412" : "#101815";
    context.fillRect(x, 512 - height, 44, height);
    for (let y = 512 - height + 15; y < 495; y += 25) {
      context.fillStyle = random() > 0.92 ? "#43483c" : "#030605";
      context.fillRect(x + 9, y, 8, 11);
      context.fillRect(x + 26, y, 8, 11);
    }
  }
  context.strokeStyle = "#303b34";
  context.lineWidth = 12;
  context.strokeRect(42, 38, 396, 474);
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(240, 38);
  context.lineTo(240, 512);
  context.moveTo(42, 280);
  context.lineTo(438, 280);
  context.stroke();
  for (let index = 0; index < 110; index += 1) {
    const x = 48 + random() * 384;
    const y = 45 + random() * 455;
    context.strokeStyle = `rgba(94,13,25,${0.15 + random() * 0.35})`;
    context.lineWidth = 0.5 + random() * 1.5;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x - 7, y + 20 + random() * 85);
    context.stroke();
  }
  polygon(context, [[0, 0], [90, 0], [69, 600], [0, 600]], "#111713");
  polygon(context, [[390, 0], [480, 0], [480, 600], [413, 600]], "#0a100d");
  context.fillStyle = "#151b17";
  context.fillRect(0, 512, 480, 88);
}

function bedroom(context, random) {
  background(context, "#171e1a", "#050807");
  polygon(context, [[0, 430], [480, 390], [480, 600], [0, 600]], "#0b100e");
  context.fillStyle = "#111713";
  context.fillRect(35, 72, 126, 355);
  context.strokeStyle = "#354038";
  context.lineWidth = 6;
  context.strokeRect(35, 72, 126, 355);
  context.fillStyle = "#010302";
  context.fillRect(49, 88, 98, 323);
  polygon(context, [[49, 88], [93, 103], [93, 411], [49, 411]], "#141b17");
  context.fillStyle = "#202721";
  context.fillRect(324, 81, 111, 225);
  context.strokeStyle = "#303a32";
  context.strokeRect(324, 81, 111, 225);
  context.fillStyle = "#080d0b";
  context.fillRect(335, 92, 89, 203);
  context.strokeStyle = "#1b2520";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(342, 274);
  context.lineTo(414, 115);
  context.stroke();
  polygon(context, [[91, 392], [337, 354], [427, 468], [142, 526]], "#202720", "#333c33", 3);
  polygon(context, [[91, 392], [142, 526], [142, 570], [91, 437]], "#101612");
  polygon(context, [[142, 526], [427, 468], [427, 507], [142, 570]], "#0c120f");
  polygon(context, [[112, 392], [194, 379], [224, 414], [137, 431]], "#343a30");
  for (let index = 0; index < 9; index += 1) {
    const x = 30 + random() * 410;
    const y = 485 + random() * 90;
    context.save();
    context.translate(x, y);
    context.rotate((random() - 0.5) * 1.2);
    context.fillStyle = "#292f27";
    context.fillRect(0, 0, 22 + random() * 20, 12 + random() * 15);
    context.restore();
  }
}

function television(context, random) {
  background(context, "#131b17", "#020404");
  context.fillStyle = "#0b100e";
  context.fillRect(0, 480, 480, 120);
  context.fillStyle = "#202821";
  context.fillRect(77, 118, 326, 264);
  context.strokeStyle = "#354037";
  context.lineWidth = 7;
  context.strokeRect(77, 118, 326, 264);
  context.fillStyle = "#020504";
  context.fillRect(96, 139, 257, 211);
  for (let index = 0; index < 4200; index += 1) {
    const shade = 30 + Math.floor(random() * 90);
    context.fillStyle = `rgba(${shade},${shade + 4},${shade},${0.12 + random() * 0.42})`;
    context.fillRect(96 + random() * 257, 139 + random() * 211, 1 + random() * 3, 1);
  }
  context.fillStyle = "#090d0b";
  context.fillRect(366, 147, 22, 44);
  context.beginPath();
  context.arc(377, 231, 10, 0, Math.PI * 2);
  context.arc(377, 271, 10, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#252e27";
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(113, 382);
  context.lineTo(99, 431);
  context.moveTo(365, 382);
  context.lineTo(382, 431);
  context.stroke();
  context.fillStyle = "#121914";
  context.fillRect(146, 459, 188, 91);
  context.fillStyle = "#060a08";
  context.fillRect(126, 446, 228, 26);
  context.fillRect(126, 550, 228, 21);
  context.strokeStyle = "#252d27";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(390, 349);
  context.bezierCurveTo(465, 390, 420, 470, 475, 529);
  context.stroke();
}

function woods(context, random) {
  background(context, "#19211c", "#020504");
  polygon(context, [[193, 600], [300, 600], [262, 286], [239, 286]], "#171c16");
  for (let index = 0; index < 42; index += 1) {
    const x = random() * 520 - 20;
    const width = 3 + random() * 17;
    const lean = (random() - 0.5) * 35;
    context.strokeStyle = random() > 0.5 ? "#080e0b" : "#111813";
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x, 620);
    context.lineTo(x + lean, -30);
    context.stroke();
    context.lineWidth = Math.max(1, width * 0.28);
    for (let branch = 0; branch < 3; branch += 1) {
      const y = 80 + random() * 350;
      context.beginPath();
      context.moveTo(x + lean * 0.5, y);
      context.lineTo(x + (random() - 0.5) * 120, y - 40 - random() * 80);
      context.stroke();
    }
  }
  const mist = context.createLinearGradient(0, 230, 0, 520);
  mist.addColorStop(0, "rgba(93,104,90,0.08)");
  mist.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = mist;
  context.fillRect(0, 230, 480, 290);
}

function washroom(context, random) {
  background(context, "#1a211c", "#050706");
  context.strokeStyle = "#29322b";
  context.lineWidth = 2;
  for (let x = 0; x <= 480; x += 60) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 430);
    context.stroke();
  }
  for (let y = 0; y <= 430; y += 60) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(480, y);
    context.stroke();
  }
  context.fillStyle = "#0a100d";
  context.fillRect(94, 48, 292, 236);
  context.strokeStyle = "#3a443b";
  context.lineWidth = 8;
  context.strokeRect(94, 48, 292, 236);
  for (let index = 0; index < 23; index += 1) {
    const x = 110 + random() * 250;
    context.strokeStyle = `rgba(116,124,109,${0.04 + random() * 0.09})`;
    context.lineWidth = 2 + random() * 6;
    context.beginPath();
    context.moveTo(x, 60 + random() * 80);
    context.lineTo(x - 8, 160 + random() * 105);
    context.stroke();
  }
  polygon(context, [[73, 360], [407, 360], [365, 465], [115, 465]], "#272e27", "#3b453b", 3);
  context.fillStyle = "#030605";
  context.beginPath();
  context.ellipse(240, 397, 91, 30, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#454d42";
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(240, 360);
  context.lineTo(240, 320);
  context.quadraticCurveTo(240, 301, 267, 315);
  context.stroke();
  context.fillStyle = "#0a0f0c";
  context.fillRect(0, 480, 480, 120);
}

function elevator(context, random) {
  background(context, "#151c18", "#030504");
  context.fillStyle = "#252c26";
  context.fillRect(44, 25, 392, 551);
  context.fillStyle = "#010302";
  context.fillRect(86, 72, 308, 478);
  context.fillStyle = "#111713";
  context.fillRect(111, 91, 258, 459);
  context.fillStyle = "#060a08";
  context.fillRect(111, 91, 258, 63);
  context.fillStyle = "#666d60";
  context.globalAlpha = 0.25;
  context.fillRect(180, 105, 120, 5);
  context.globalAlpha = 1;
  polygon(context, [[86, 72], [230, 91], [205, 550], [86, 550]], "#202721", "#3b443b", 3);
  polygon(context, [[394, 72], [275, 97], [290, 550], [394, 550]], "#171e19", "#333d34", 3);
  context.fillStyle = "#080d0a";
  context.fillRect(405, 144, 42, 176);
  for (let index = 0; index < 6; index += 1) {
    context.beginPath();
    context.fillStyle = index === 0 ? "#5e6558" : "#272f28";
    context.arc(426, 166 + index * 26, 6, 0, Math.PI * 2);
    context.fill();
  }
  context.strokeStyle = "#313a32";
  context.lineWidth = 2;
  for (let index = 0; index < 20; index += 1) {
    const y = 100 + random() * 430;
    context.beginPath();
    context.moveTo(95 + random() * 100, y);
    context.lineTo(100 + random() * 100, y + random() * 5);
    context.stroke();
  }
}

function diningRoom(context, random) {
  background(context, "#161d18", "#030504");
  context.strokeStyle = "#2e382f";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(240, 0);
  context.lineTo(240, 128);
  context.stroke();
  polygon(context, [[177, 128], [303, 128], [334, 192], [146, 192]], "#242b24");
  const light = context.createRadialGradient(240, 192, 10, 240, 235, 200);
  light.addColorStop(0, "rgba(142,145,119,0.14)");
  light.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = light;
  context.fillRect(30, 170, 420, 300);
  polygon(context, [[54, 373], [410, 346], [474, 496], [0, 531]], "#1d241e", "#353e34", 3);
  polygon(context, [[0, 531], [474, 496], [474, 528], [0, 569]], "#0b100d");
  for (const [x, y, rotation] of [[72, 320, -0.1], [347, 301, 0.08], [370, 461, 0.34]]) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.fillStyle = "#101612";
    context.fillRect(0, 0, 69, 116);
    context.fillStyle = "#050807";
    context.fillRect(10, 13, 49, 66);
    context.fillStyle = "#161d17";
    context.fillRect(-5, 111, 79, 22);
    context.fillRect(3, 133, 8, 85);
    context.fillRect(59, 133, 8, 85);
    context.restore();
  }
  for (let index = 0; index < 3; index += 1) {
    context.strokeStyle = "#42493d";
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(155 + index * 89, 408 + index * 4, 37, 14, -0.05, 0, Math.PI * 2);
    context.stroke();
  }
  context.fillStyle = "rgba(0,0,0,0.45)";
  context.fillRect(0, 565, 480, 35);
}

function ceiling(context, random) {
  background(context, "#171e19", "#060908");
  context.strokeStyle = "#2d362e";
  context.lineWidth = 3;
  for (let index = -5; index <= 5; index += 1) {
    context.beginPath();
    context.moveTo(240 + index * 48, 0);
    context.lineTo(240 + index * 126, 600);
    context.stroke();
  }
  for (let y = 55; y < 600; y += 88) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(480, y + 20);
    context.stroke();
  }
  polygon(context, [[67, 87], [193, 91], [180, 145], [51, 140]], "#5b6254");
  polygon(context, [[302, 321], [449, 331], [438, 396], [285, 383]], "#090d0b", "#333c33", 3);
  polygon(context, [[191, 206], [310, 211], [299, 269], [176, 262]], "#41483d");
  for (let index = 0; index < 18; index += 1) {
    const x = 50 + random() * 380;
    const y = 50 + random() * 480;
    context.fillStyle = `rgba(32,20,16,${0.1 + random() * 0.25})`;
    context.beginPath();
    context.ellipse(x, y, 12 + random() * 45, 5 + random() * 20, random(), 0, Math.PI * 2);
    context.fill();
  }
  context.strokeStyle = "rgba(2,4,3,0.65)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, 443);
  context.bezierCurveTo(110, 413, 170, 510, 290, 475);
  context.bezierCurveTo(360, 456, 411, 510, 480, 492);
  context.stroke();
}

const scenes = [corridor, stairwell, rainyWindow, bedroom, television, woods, washroom, elevator, diningRoom, ceiling];

function finish(context, random) {
  for (let index = 0; index < 9500; index += 1) {
    const shade = Math.floor(random() * 38);
    context.fillStyle = `rgba(${shade},${shade + 4},${shade + 1},${random() * 0.14})`;
    context.fillRect(random() * WIDTH, random() * HEIGHT, 1 + random() * 2, 1 + random() * 2);
  }
  context.fillStyle = "rgba(0,0,0,0.15)";
  for (let line = 0; line < HEIGHT; line += 5) context.fillRect(0, line, WIDTH, 1);
  const vignette = context.createRadialGradient(240, 290, 90, 240, 290, 390);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.83)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, WIDTH, HEIGHT);
}

export function drawGeneratedPhoto(canvas, photo) {
  const context = canvas.getContext("2d");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const random = randomGenerator(photo.seed);
  scenes[photo.variant % scenes.length](context, random);
  finish(context, random);
}

export function drawCustomPhoto(canvas, image, photo) {
  const context = canvas.getContext("2d");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const random = randomGenerator(photo.seed);
  const scale = Math.max(WIDTH / image.naturalWidth, HEIGHT / image.naturalHeight);
  context.filter = "grayscale(0.55) contrast(1.35) brightness(0.55)";
  context.drawImage(
    image,
    (WIDTH - image.naturalWidth * scale) / 2,
    (HEIGHT - image.naturalHeight * scale) / 2,
    image.naturalWidth * scale,
    image.naturalHeight * scale,
  );
  context.filter = "none";
  finish(context, random);
}
