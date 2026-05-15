// Generate the placeholder PWA icons from an inline SVG monogram.
// Run once, commit the output. Re-run if you change the monogram.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

function svg({ size, monogram = 'S', bg = '#0b0c0e', fg = '#d6c89c', radius, padding = 0 }) {
  const r = radius ?? Math.round(size * 0.18);
  const fontSize = Math.round((size - padding * 2) * 0.55);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
          font-family="ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', Arial"
          font-weight="700" font-size="${fontSize}" fill="${fg}" letter-spacing="-${Math.round(fontSize * 0.03)}">${monogram}</text>
  </svg>`;
}

async function emit(name, buf) {
  const out = resolve(outDir, name);
  writeFileSync(out, buf);
  console.log('  wrote', out);
}

async function render(name, opts) {
  const buf = await sharp(Buffer.from(svg(opts))).png().toBuffer();
  await emit(name, buf);
}

async function renderMaskable(name, size) {
  // Maskable: full-bleed background, monogram inside the safe zone (~80%).
  const safe = Math.round(size * 0.8);
  const padding = Math.round((size - safe) / 2);
  const inner = svg({ size, padding, radius: 0 });
  const buf = await sharp(Buffer.from(inner)).png().toBuffer();
  await emit(name, buf);
}

await render('icon-192.png', { size: 192 });
await render('icon-512.png', { size: 512 });
await renderMaskable('icon-512-maskable.png', 512);
await render('apple-touch-icon.png', { size: 180, radius: 0 });

console.log('Icons generated.');
