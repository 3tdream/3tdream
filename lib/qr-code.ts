// lib/qr-code.ts — zero-import, pure ISO 18004 QR encoder (byte mode, EC level M,
// versions 1-6 / 21..41 modules). No imports, no network, no DB — auditable by
// inspection (US-08, AC-14). Only `qrMatrix` and `qrSvg` are the public contract;
// everything else here is an implementation detail of those two pure functions.

type VersionInfo = {
  version: number; size: number; capacity: number; totalDataCw: number;
  ecPerBlock: number; dataPerBlock: number[];
};

// EC level M — byte capacity: 14, 26, 42, 62, 84, 106 (ISO 18004 Table 9)
// totalDataCw = sum(dataPerBlock); ecPerBlock = EC codewords per block
const VERSION_TABLE: VersionInfo[] = [
  { version: 1, size: 21, capacity: 14, totalDataCw: 16, ecPerBlock: 10, dataPerBlock: [16] },
  { version: 2, size: 25, capacity: 26, totalDataCw: 28, ecPerBlock: 16, dataPerBlock: [28] },
  { version: 3, size: 29, capacity: 42, totalDataCw: 44, ecPerBlock: 26, dataPerBlock: [44] },
  { version: 4, size: 33, capacity: 62, totalDataCw: 64, ecPerBlock: 18, dataPerBlock: [32, 32] },
  { version: 5, size: 37, capacity: 84, totalDataCw: 86, ecPerBlock: 24, dataPerBlock: [43, 43] },
  { version: 6, size: 41, capacity: 106, totalDataCw: 108, ecPerBlock: 16, dataPerBlock: [27, 27, 27, 27] },
];

const ALIGNMENT_COORDS: Record<number, number[]> = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
};

// --- GF(256) tables for Reed-Solomon error correction ---
const GF_EXP: number[] = new Array(512).fill(0);
const GF_LOG: number[] = new Array(256).fill(0);
(function initGf() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const term = [1, GF_EXP[i]];
    const next = new Array(poly.length + term.length - 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      for (let k = 0; k < term.length; k++) next[j + k] ^= gfMul(poly[j], term[k]);
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: number[], ecCount: number): number[] {
  const gen = rsGeneratorPoly(ecCount);
  const result = data.concat(new Array(ecCount).fill(0));
  for (let i = 0; i < data.length; i++) {
    const coef = result[i];
    if (coef === 0) continue;
    for (let j = 0; j < gen.length; j++) result[i + j] ^= gfMul(gen[j], coef);
  }
  return result.slice(data.length);
}

function selectVersion(byteLength: number): VersionInfo {
  if (byteLength === 0) throw new RangeError("text is empty");
  for (const v of VERSION_TABLE) if (byteLength <= v.capacity) return v;
  throw new RangeError("text too long for supported QR versions (1-6)");
}

function buildDataCodewords(bytes: Uint8Array, totalDataCw: number): number[] {
  const bits: number[] = [];
  const push = (value: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((value >> i) & 1);
  };
  push(0b0100, 4); // byte mode indicator
  push(bytes.length, 8); // char count indicator (8 bits, versions 1-9)
  for (const b of Array.from(bytes)) push(b, 8);
  const maxBits = totalDataCw * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);
  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    codewords.push(byte);
  }
  const pad = [0xec, 0x11];
  let p = 0;
  while (codewords.length < totalDataCw) codewords.push(pad[p++ % 2]);
  if (codewords.length > totalDataCw) throw new RangeError("data overflow for selected QR version");
  return codewords;
}

function buildFinalCodewords(dataCw: number[], v: VersionInfo): number[] {
  const blocksData: number[][] = [];
  let idx = 0;
  for (const len of v.dataPerBlock) {
    blocksData.push(dataCw.slice(idx, idx + len));
    idx += len;
  }
  const blocksEc = blocksData.map((b) => rsEncode(b, v.ecPerBlock));
  const maxLen = Math.max(...v.dataPerBlock);
  const result: number[] = [];
  for (let i = 0; i < maxLen; i++) for (const b of blocksData) if (i < b.length) result.push(b[i]);
  for (let i = 0; i < v.ecPerBlock; i++) for (const b of blocksEc) result.push(b[i]);
  return result;
}

const FINDER = [
  [1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1],
];
const ALIGN = [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]];

function drawFinder(m: boolean[][], r: boolean[][], size: number, top: number, left: number) {
  for (let i = -1; i <= 7; i++) {
    for (let j = -1; j <= 7; j++) {
      const rr = top + i, cc = left + j;
      if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
      const dark = i >= 0 && i <= 6 && j >= 0 && j <= 6 ? FINDER[i][j] === 1 : false;
      m[rr][cc] = dark; r[rr][cc] = true;
    }
  }
}

function drawAlignment(m: boolean[][], r: boolean[][], cr: number, cc: number) {
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      m[cr + i][cc + j] = ALIGN[i + 2][j + 2] === 1;
      r[cr + i][cc + j] = true;
    }
  }
}

function drawTiming(m: boolean[][], r: boolean[][], size: number) {
  for (let i = 8; i <= size - 9; i++) {
    const dark = i % 2 === 0;
    if (!r[6][i]) { m[6][i] = dark; r[6][i] = true; }
    if (!r[i][6]) { m[i][6] = dark; r[i][6] = true; }
  }
}

function setFmt(m: boolean[][], r: boolean[][], row: number, col: number, bit: number) {
  m[row][col] = bit === 1; r[row][col] = true;
}

function drawFormatBits(m: boolean[][], r: boolean[][], size: number, bits: number[]) {
  for (let i = 0; i < 6; i++) setFmt(m, r, i, 8, bits[i]);
  setFmt(m, r, 7, 8, bits[6]);
  setFmt(m, r, 8, 8, bits[7]);
  setFmt(m, r, 8, 7, bits[8]);
  for (let i = 9; i < 15; i++) setFmt(m, r, 8, 14 - i, bits[i]);
  for (let i = 0; i < 8; i++) setFmt(m, r, 8, size - 1 - i, bits[i]);
  for (let i = 8; i < 15; i++) setFmt(m, r, size - 15 + i, 8, bits[i]);
}

function computeFormatBits(maskPattern: number): number[] {
  const GEN = 0b10100110111;
  const data = maskPattern; // EC level M is 00, so the 5 data bits are just the mask id
  let g = data << 10;
  for (let i = 4; i >= 0; i--) if ((g >>> (i + 10)) & 1) g ^= GEN << i;
  const full = ((data << 10) | g) ^ 0b101010000010010;
  const bits: number[] = [];
  for (let i = 0; i < 15; i++) bits.push((full >>> i) & 1); // drawFormatBits indexes from the LSB
  return bits;
}

function placeData(m: boolean[][], r: boolean[][], size: number, codewords: number[]) {
  const bits: number[] = [];
  for (const cw of codewords) for (let i = 7; i >= 0; i--) bits.push((cw >> i) & 1);
  let bi = 0, upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i;
      for (const c of [col, col - 1]) {
        if (r[row][c]) continue;
        m[row][c] = bi < bits.length ? bits[bi] === 1 : false;
        bi++;
      }
    }
    upward = !upward;
  }
}

const MASKS: ((row: number, col: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function applyMask(m: boolean[][], r: boolean[][], size: number, mask: number) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (r[row][col]) continue;
      if (MASKS[mask](row, col)) m[row][col] = !m[row][col];
    }
  }
}

const FINDER_LIKE = ["10111010000", "00001011101"];

function linePenalty(line: boolean[]): number {
  let score = 0;
  let run = 1;
  for (let i = 1; i <= line.length; i++) {
    if (i < line.length && line[i] === line[i - 1]) { run++; continue; }
    if (run >= 5) score += 3 + (run - 5);
    run = 1;
  }
  // The quiet zone is light, so a finder-like pattern at the edge still counts.
  const padded = `0000${line.map((dark) => (dark ? "1" : "0")).join("")}0000`;
  for (let i = 0; i + 11 <= padded.length; i++) {
    if (FINDER_LIKE.includes(padded.slice(i, i + 11))) score += 40;
  }
  return score;
}

function penalty(m: boolean[][]): number {
  const size = m.length;
  let score = 0;
  let dark = 0;
  for (let i = 0; i < size; i++) {
    score += linePenalty(m[i]);
    score += linePenalty(m.map((row) => row[i]));
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (m[r][c]) dark++;
      if (r < size - 1 && c < size - 1 && m[r][c] === m[r][c + 1] && m[r][c] === m[r + 1][c] && m[r][c] === m[r + 1][c + 1]) score += 3;
    }
  }
  return score + Math.floor(Math.abs((dark * 100) / (size * size) - 50) / 5) * 10;
}

export function qrMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const v = selectVersion(bytes.length);
  const size = v.size;
  const dataCw = buildDataCodewords(bytes, v.totalDataCw);
  const finalCw = buildFinalCodewords(dataCw, v);

  const matrix: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const reserved: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));

  drawFinder(matrix, reserved, size, 0, 0);
  drawFinder(matrix, reserved, size, 0, size - 7);
  drawFinder(matrix, reserved, size, size - 7, 0);
  drawTiming(matrix, reserved, size);
  matrix[size - 8][8] = true; reserved[size - 8][8] = true; // dark module

  const coords = ALIGNMENT_COORDS[v.version] ?? [];
  for (const r of coords) {
    for (const c of coords) {
      if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue;
      drawAlignment(matrix, reserved, r, c);
    }
  }

  // Reserves the format modules so data placement skips them; each mask redraws them below.
  drawFormatBits(matrix, reserved, size, computeFormatBits(0));
  placeData(matrix, reserved, size, finalCw);

  let best = matrix;
  let bestScore = Infinity;
  for (let mask = 0; mask < MASKS.length; mask++) {
    const candidate = matrix.map((row) => row.slice());
    applyMask(candidate, reserved, size, mask);
    drawFormatBits(candidate, reserved, size, computeFormatBits(mask));
    const score = penalty(candidate);
    if (score < bestScore) { best = candidate; bestScore = score; }
  }
  return best;
}

export function qrSvg(text: string): string {
  const matrix = qrMatrix(text);
  const quiet = 4;
  const size = matrix.length;
  const n = size + quiet * 2;
  let d = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}
