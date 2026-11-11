import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

const W = 1200;
const H = 630;

// RGBA pixel buffer
const pixels = new Uint8Array(W * H * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (y * W + x) * 4;
  if (a >= 255) {
    pixels[idx] = r;
    pixels[idx + 1] = g;
    pixels[idx + 2] = b;
    pixels[idx + 3] = 255;
  } else {
    const alpha = a / 255;
    const inv = 1 - alpha;
    pixels[idx] = Math.round(r * alpha + pixels[idx] * inv);
    pixels[idx + 1] = Math.round(g * alpha + pixels[idx + 1] * inv);
    pixels[idx + 2] = Math.round(b * alpha + pixels[idx + 2] * inv);
    pixels[idx + 3] = 255;
  }
}

// 1. Fill base dark blue gradient
for (let y = 0; y < H; y++) {
  const t = y / H;
  const r = Math.round(7 + t * 5);
  const g = Math.round(43 + t * 25);
  const b = Math.round(77 + t * 35);
  for (let x = 0; x < W; x++) {
    setPixel(x, y, r, g, b, 255);
  }
}

// 2. Playful dotted grid pattern
for (let y = 20; y < H; y += 32) {
  for (let x = 20; x < W; x += 32) {
    setPixel(x, y, 255, 255, 255, 30);
    setPixel(x + 1, y, 255, 255, 255, 30);
    setPixel(x, y + 1, 255, 255, 255, 30);
  }
}

// Function to draw shaded sphere (Bingo Ball)
function drawBingoBall(cx, cy, radius, hexColor, numStr) {
  const rBase = parseInt(hexColor.slice(1, 3), 16);
  const gBase = parseInt(hexColor.slice(3, 5), 16);
  const bBase = parseInt(hexColor.slice(5, 7), 16);

  // Ball circle with 3D specular highlight and shadow
  for (let y = cy - radius - 8; y <= cy + radius + 12; y++) {
    for (let x = cx - radius - 8; x <= cx + radius + 12; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Drop shadow
      const sdy = y - (cy + 10);
      const sDist = Math.sqrt(dx * dx + sdy * sdy);
      if (sDist <= radius + 6 && dist > radius) {
        setPixel(x, y, 5, 20, 35, 120);
      }

      if (dist <= radius) {
        // Outline border
        if (dist >= radius - 5) {
          setPixel(x, y, 11, 44, 77, 255);
          continue;
        }

        // 3D light vector from top-left (-0.4, -0.4)
        const lx = (dx / radius) + 0.35;
        const ly = (dy / radius) + 0.35;
        const ldist = Math.sqrt(lx * lx + ly * ly);
        const shine = Math.max(0, 1 - ldist * 0.9);

        const r = Math.min(255, Math.round(rBase * (0.6 + shine * 0.7) + shine * 90));
        const g = Math.min(255, Math.round(gBase * (0.6 + shine * 0.7) + shine * 90));
        const b = Math.min(255, Math.round(bBase * (0.6 + shine * 0.7) + shine * 90));

        setPixel(x, y, r, g, b, 255);
      }
    }
  }

  // Center white badge disc
  const discR = Math.round(radius * 0.52);
  for (let y = cy - discR; y <= cy + discR; y++) {
    for (let x = cx - discR; x <= cx + discR; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= discR) {
        if (dist >= discR - 3) {
          setPixel(x, y, 11, 44, 77, 255);
        } else {
          setPixel(x, y, 255, 255, 255, 255);
        }
      }
    }
  }
}

// Function to draw rounded rect
function fillRoundRect(rx, ry, rw, rh, rad, r, g, b, a = 255) {
  for (let y = ry; y < ry + rh; y++) {
    for (let x = rx; x < rx + rw; x++) {
      let inside = true;
      if (x < rx + rad && y < ry + rad) {
        const dx = x - (rx + rad), dy = y - (ry + rad);
        inside = (dx * dx + dy * dy) <= rad * rad;
      } else if (x > rx + rw - rad && y < ry + rad) {
        const dx = x - (rx + rw - rad), dy = y - (ry + rad);
        inside = (dx * dx + dy * dy) <= rad * rad;
      } else if (x < rx + rad && y > ry + rh - rad) {
        const dx = x - (rx + rad), dy = y - (ry + rh - rad);
        inside = (dx * dx + dy * dy) <= rad * rad;
      } else if (x > rx + rw - rad && y > ry + rh - rad) {
        const dx = x - (rx + rw - rad), dy = y - (ry + rh - rad);
        inside = (dx * dx + dy * dy) <= rad * rad;
      }
      if (inside) setPixel(x, y, r, g, b, a);
    }
  }
}

// 3. Draw Center Big Card Backdrop with thick 3D border
fillRoundRect(200, 75, 800, 480, 40, 7, 40, 71, 160); // Drop shadow
fillRoundRect(200, 65, 800, 480, 40, 11, 44, 77, 255); // Outer dark border
fillRoundRect(208, 73, 784, 464, 32, 255, 255, 255, 255); // White inner card

// Top header bar inside card
fillRoundRect(208, 73, 784, 90, 32, 2, 132, 199, 255);
fillRoundRect(208, 120, 784, 43, 0, 2, 132, 199, 255);

// 4. Draw 5 Big Candy B-I-N-G-O 3D Blocks in Header
const letterColors = [
  { c: '#00a8ff', s: '#005b8a' }, // B
  { c: '#ff4757', s: '#b31b27' }, // I
  { c: '#ffa502', s: '#b37400' }, // N
  { c: '#2ed573', s: '#1b8a47' }, // G
  { c: '#ff7f50', s: '#b34720' }, // O
];

const startX = 370;
for (let i = 0; i < 5; i++) {
  const bx = startX + i * 90;
  const by = 88;
  const col = letterColors[i];
  const r = parseInt(col.c.slice(1, 3), 16);
  const g = parseInt(col.c.slice(3, 5), 16);
  const b = parseInt(col.c.slice(5, 7), 16);

  // Shadow
  fillRoundRect(bx, by + 5, 74, 60, 18, 7, 40, 71, 200);
  // Border
  fillRoundRect(bx, by, 74, 60, 18, 11, 44, 77, 255);
  // Body
  fillRoundRect(bx + 4, by + 4, 66, 52, 14, r, g, b, 255);
  // Specular pill
  fillRoundRect(bx + 14, by + 10, 46, 12, 6, 255, 255, 255, 120);
}

// 5. Draw Decorative Bingo Balls on corners
drawBingoBall(120, 150, 68, '#eab308', '7');
drawBingoBall(1080, 160, 64, '#ef4444', '21');
drawBingoBall(110, 460, 56, '#3b82f6', '3');
drawBingoBall(1070, 450, 70, '#10b981', '15');

// 6. Draw 5x5 Grid representation in card body
const gridX = 350;
const gridY = 190;
const cellSize = 56;
const gap = 8;

for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 5; c++) {
    const cx = gridX + c * (cellSize + gap);
    const cy = gridY + r * (cellSize + gap);
    const isGold = (r === c) || (r === 2); // Winning line
    const isMarked = (r + c) % 2 === 0;

    // Cell shadow
    fillRoundRect(cx, cy + 3, cellSize, cellSize, 12, 7, 40, 71, 100);

    if (isGold) {
      // Golden winning cell
      fillRoundRect(cx, cy, cellSize, cellSize, 12, 133, 77, 14, 255); // border
      fillRoundRect(cx + 3, cy + 3, cellSize - 6, cellSize - 6, 10, 253, 224, 71, 255); // gold
    } else if (isMarked) {
      // Stamped marked cell
      fillRoundRect(cx, cy, cellSize, cellSize, 12, 203, 213, 225, 255);
      fillRoundRect(cx + 2, cy + 2, cellSize - 4, cellSize - 4, 10, 241, 245, 249, 255);
      // Red X
      for (let d = 12; d < cellSize - 12; d++) {
        setPixel(cx + d, cy + d, 220, 38, 38, 255);
        setPixel(cx + d + 1, cy + d, 220, 38, 38, 255);
        setPixel(cx + (cellSize - d), cy + d, 220, 38, 38, 255);
        setPixel(cx + (cellSize - d) - 1, cy + d, 220, 38, 38, 255);
      }
    } else {
      // Normal white cell
      fillRoundRect(cx, cy, cellSize, cellSize, 12, 11, 44, 77, 255);
      fillRoundRect(cx + 2, cy + 2, cellSize - 4, cellSize - 4, 10, 255, 255, 255, 255);
    }
  }
}

// Bold red winning strikethrough line across row 2
const lineY = gridY + 2 * (cellSize + gap) + Math.round(cellSize / 2);
for (let lx = gridX - 10; lx <= gridX + 5 * (cellSize + gap) + 4; lx++) {
  for (let dy = -3; dy <= 3; dy++) {
    setPixel(lx, lineY + dy, 220, 38, 38, 240);
  }
}

// 7. Bottom Promotional Banner Pill
fillRoundRect(290, 500, 620, 48, 24, 11, 44, 77, 255); // Border
fillRoundRect(293, 503, 614, 42, 21, 34, 197, 94, 255); // Emerald body

// Build PNG
const scanlines = Buffer.alloc((1 + W * 3) * H);
for (let y = 0; y < H; y++) {
  const rowOffset = y * (1 + W * 3);
  scanlines[rowOffset] = 0; // Filter none
  for (let x = 0; x < W; x++) {
    const pIdx = (y * W + x) * 4;
    const sIdx = rowOffset + 1 + x * 3;
    scanlines[sIdx] = pixels[pIdx];
    scanlines[sIdx + 1] = pixels[pIdx + 1];
    scanlines[sIdx + 2] = pixels[pIdx + 2];
  }
}

const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(W, 0);
ihdrData.writeUInt32BE(H, 4);
ihdrData[8] = 8;
ihdrData[9] = 2; // RGB
ihdrData[10] = 0;
ihdrData[11] = 0;
ihdrData[12] = 0;

const ihdr = makeChunk('IHDR', ihdrData);
const idat = makeChunk('IDAT', zlib.deflateSync(scanlines, { level: 9 }));
const iend = makeChunk('IEND', Buffer.alloc(0));

const finalPng = Buffer.concat([sig, ihdr, idat, iend]);
fs.writeFileSync('client/public/og-preview.png', finalPng);
console.log('og-preview.png generated successfully! Size:', finalPng.length, 'bytes');
