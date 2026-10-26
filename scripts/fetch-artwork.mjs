import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputFolder = path.resolve("public/images/interests");
await mkdir(outputFolder, { recursive: true });

const games = [
  ["omori.png", "OMORI", "1150690", "png"],
  ["cyberpunk-2077.png", "Cyberpunk 2077", "1091500", "png"],
  ["undertale.webp", "Undertale", "391540"],
  ["to-the-moon.webp", "To the Moon", "206440"],
  ["doki-doki-literature-club.webp", "Doki Doki Literature Club", "698780"],
  ["oneshot.webp", "OneShot", "420530"],
  ["fran-bow.webp", "Fran Bow", "362680"],
  ["five-nights-at-freddys-2.webp", "Five Nights at Freddy's 2", "332800"],
  ["inscryption.webp", "Inscryption", "1092790"],
  ["town-of-salem.webp", "Town of Salem", "334230"],
  ["cuphead.webp", "Cuphead", "268910"],
  ["slay-the-princess.webp", "Slay the Princess", "1989270"],
  ["brawlhalla.webp", "Brawlhalla", "291550"],
  ["broforce.webp", "Broforce", "274190"],
  ["the-kindergarten-series.webp", "The Kindergarten Series", "589590"],
  ["the-witcher-3-wild-hunt.webp", "The Witcher 3: Wild Hunt", "292030"],
  ["subnautica.webp", "Subnautica", "264710"],
  ["control.webp", "Control", "870780"],
  ["clair-obscur-expedition-33.webp", "Clair Obscur: Expedition 33", "1903340"],
  ["papers-please.webp", "Papers, Please", "239030"],
  ["emily-is-away.webp", "Emily is Away", "417860"],
];

const shows = [
  ["steins-gate.webp", "Steins;Gate"],
  ["pantheon.webp", "Pantheon"],
  ["jojos-bizarre-adventure.webp", "Jojo's Bizarre Adventure"],
  ["dragon-ball.webp", "Dragon Ball"],
  ["arcane.webp", "Arcane"],
  ["parks-and-recreation.webp", "Parks and Recreation"],
  ["one-punch-man.webp", "One Punch Man"],
  ["mob-psycho-100.webp", "Mob Psycho 100"],
];

async function download(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "DelighteDevArtworkSetup/1.0" },
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`Not an image: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function saveArtwork(buffer, filename, format = "webp", logo = false, position = "attention") {
  let image;

  if (logo) {
    const foreground = await sharp(buffer)
      .resize(520, 460, { fit: "inside" })
      .png()
      .toBuffer();
    image = sharp({
      create: {
        width: 600,
        height: 900,
        channels: 4,
        background: "#263b31",
      },
    }).composite([{ input: foreground, gravity: "center" }]);
  } else {
    image = sharp(buffer)
      .rotate()
      .resize(600, 900, { fit: "cover", position });
  }

  if (format === "png") {
    await image.png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(outputFolder, filename));
  } else {
    await image.webp({ quality: 82, effort: 5 }).toFile(path.join(outputFolder, filename));
  }
}

async function saveBannerArtwork(buffer, filename) {
  const background = await sharp(buffer)
    .resize(600, 900, { fit: "cover" })
    .modulate({ brightness: 0.38, saturation: 0.65 })
    .png()
    .toBuffer();
  const foreground = await sharp(buffer)
    .resize(570, 680, { fit: "inside" })
    .png()
    .toBuffer();

  await sharp(background)
    .composite([{ input: foreground, gravity: "center" }])
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(outputFolder, filename));
}

const results = [];
const failures = [];

for (const [filename, name, appId, format] of games) {
  try {
    const image = await download(
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`,
    );
    await saveArtwork(image, filename, format);
    results.push(name);
    console.log(`Image: ${name}`);
  } catch (error) {
    if (appId === "332800") {
      try {
        const banner = await download(
          "https://cdn.cloudflare.steamstatic.com/steam/apps/332800/capsule_616x353.jpg",
        );
        await saveBannerArtwork(banner, filename);
        results.push(name);
        console.log(`Image: ${name} (official Steam banner)`);
        continue;
      } catch (bannerError) {
        error = bannerError;
      }
    }
    failures.push(name);
    console.error(`Name tile needed: ${name} (${error.message})`);
  }
}

try {
  const image = await download(
    "https://minecraft.wiki/images/Minecraft_Key_Art_2024.jpg",
  );
  await saveArtwork(image, "minecraft.webp", "webp", false, "center");
  results.push("Minecraft");
  console.log("Image: Minecraft");
} catch (error) {
  failures.push("Minecraft");
  console.error(`Name tile needed: Minecraft (${error.message})`);
}

for (const [filename, query] of shows) {
  try {
    const response = await fetch(
      `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(30000) },
    );
    if (!response.ok) throw new Error(`${response.status} show search`);
    const show = await response.json();
    if (!show.image?.original) throw new Error("No artwork");
    const image = await download(show.image.original);
    await saveArtwork(image, filename);
    results.push(query);
    console.log(`Image: ${query} (${show.name})`);
  } catch (error) {
    failures.push(query);
    console.error(`Name tile needed: ${query} (${error.message})`);
  }
}

const favicon = await readFile(path.resolve("public/favicon.svg"));
for (const [filename, size] of [
  ["favicon-16.png", 16],
  ["favicon-32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
]) {
  await sharp(favicon).resize(size, size).png({ compressionLevel: 9 }).toFile(path.resolve("public", filename));
}

console.log(`\nReal images: ${results.length}`);
console.log(`Name tiles needed: ${failures.length ? failures.join(", ") : "none"}`);
