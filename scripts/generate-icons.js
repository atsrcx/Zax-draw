import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

// 1. Standard vector icon (512x512)
const svgStandard = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <g transform="translate(106, 106)">
    <!-- Canvas Grid / Frame -->
    <rect x="20" y="20" width="260" height="260" rx="36" fill="none" stroke="#60a5fa" stroke-width="16" stroke-dasharray="16 12" opacity="0.6"/>
    <!-- Pencil / Pen Stylus -->
    <path d="M210 30 L270 90 L120 240 L60 240 L60 180 Z" fill="#ffffff"/>
    <path d="M210 30 L235 5 L285 55 L260 80 Z" fill="#93c5fd"/>
    <path d="M60 240 L90 230 L70 210 Z" fill="#1e3a8a"/>
    <!-- Infinite curve path -->
    <path d="M30 250 Q 80 270 140 230 T 260 190" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" fill="none"/>
    <circle cx="30" cy="250" r="10" fill="#38bdf8"/>
  </g>
</svg>`;

// 2. Maskable icon: full bleed background, artwork safely within central 70% zone (safe zone padding > 15%)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg-mask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="100%" stop-color="#1e40af" />
    </linearGradient>
  </defs>
  <!-- Full bleed without rounded corners so Android can safely clip into squircle/circle -->
  <rect width="512" height="512" fill="url(#bg-mask)"/>
  <g transform="translate(136, 136) scale(0.8)">
    <rect x="20" y="20" width="260" height="260" rx="36" fill="none" stroke="#60a5fa" stroke-width="16" stroke-dasharray="16 12" opacity="0.6"/>
    <path d="M210 30 L270 90 L120 240 L60 240 L60 180 Z" fill="#ffffff"/>
    <path d="M210 30 L235 5 L285 55 L260 80 Z" fill="#93c5fd"/>
    <path d="M60 240 L90 230 L70 210 Z" fill="#1e3a8a"/>
    <path d="M30 250 Q 80 270 140 230 T 260 190" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" fill="none"/>
    <circle cx="30" cy="250" r="10" fill="#38bdf8"/>
  </g>
</svg>`;

async function run() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgStandard);

  const stdBuffer = Buffer.from(svgStandard);
  const maskBuffer = Buffer.from(svgMaskable);

  // 192x192
  await sharp(stdBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512
  await sharp(stdBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 512x512 maskable
  await sharp(maskBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // apple-touch-icon (180x180)
  await sharp(stdBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // favicon.ico (64x64 png format compatible with browsers)
  await sharp(stdBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico');
}

run().catch(console.error);
