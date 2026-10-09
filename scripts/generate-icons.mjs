// Regenerates raster icons and the default social image from public/favicon.svg.
// Usage: pnpm icons
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const pub = new URL("../public/", import.meta.url);
const svg = await readFile(new URL("favicon.svg", pub));

const png = (size) => sharp(svg, { density: 72 * (size / 32) }).resize(size, size).png().toBuffer();

for (const [file, size] of [
  ["favicon-192.png", 192],
  ["favicon-512.png", 512],
  ["apple-touch-icon.png", 180],
  ["favicon.png", 180],
]) {
  await writeFile(new URL(file, pub), await png(size));
}

// favicon.ico: ICO container holding 16px and 32px PNGs.
const images = [await png(16), await png(32)];
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const size = i === 0 ? 16 : 32;
  const entry = 6 + 16 * i;
  header.writeUInt8(size, entry);
  header.writeUInt8(size, entry + 1);
  header.writeUInt16LE(1, entry + 4); // color planes
  header.writeUInt16LE(32, entry + 6); // bits per pixel
  header.writeUInt32LE(img.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += img.length;
});
await writeFile(new URL("favicon.ico", pub), Buffer.concat([header, ...images]));

// Default Open Graph image (1200x630).
// TODO: replace with a designed share image once branding exists.
const mark = svg.toString().replace(/<!--[\s\S]*?-->/g, "").replace(/<\/?svg[^>]*>/g, "");
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0d1117"/>
  <g transform="translate(96 200) scale(4)">${mark}</g>
  <text x="96" y="420" font-family="Inter, Geist, Helvetica, Arial, sans-serif" font-size="96" font-weight="600" fill="#ffffff" letter-spacing="-3">Rungwise</text>
  <text x="96" y="490" font-family="Inter, Geist, Helvetica, Arial, sans-serif" font-size="36" fill="#8b949e">Fintech · Singapore</text>
</svg>`;
await writeFile(new URL("og-default.png", pub), await sharp(Buffer.from(og)).png().toBuffer());

console.log("Icons and og-default.png generated in public/");
