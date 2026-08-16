"use client";

import { useState, useEffect, useRef } from "react";

/* ─── 10×12 Pixel Matrix Definitions ─── */
const LETTERS2 = {
  W: [
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  ],
  E: [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  ],
  N: [
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
  ],
  O: [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  ],
  D: [
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
  S: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  ],
};
const LETTERS = {
  W: [
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  ],
  E: [
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  ],
  N: [
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  ],
  O: [
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  ],
  D: [
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  ],
  S: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};
// const LETTER_ORDER = ["W", "E", "N", "O", "D", "E", "S"];
const LETTER_ORDER = ["E", "N", "O", "D", "E", "S"];
// const ANIMATIONS = ["dither", "slide", "vanish", "smoked", "cascade", "pixelZoom"];
const ANIMATIONS = ["dither", "slide", "vanish", "smoked", "cascade"];

/* ─── Helpers ─── */
const clone = (m) => m.map((r) => [...r]);

const seededRand = (seed) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const shuf = (arr, rand) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ─── Frame Generators ─── */
function ditherFrames(from, to, fc, seed) {
  const rand = seededRand(seed);
  const h = from.length, w = from[0].length;
  const diff = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (from[y][x] !== to[y][x]) diff.push({ x, y, t: to[y][x] });
    }
  }

  if (!diff.length) return Array(fc).fill().map(() => clone(to));

  const seeds = shuf(diff, rand).slice(0, 1 + Math.floor(rand() * 3));
  const maxD = w + h;
  const pix = diff.map((p) => {
    let min = maxD;
    for (const s of seeds) min = Math.min(min, Math.abs(p.x - s.x) + Math.abs(p.y - s.y));
    const t = Math.floor(((min / maxD) * 0.65 + rand() * 0.35) * fc);
    return { ...p, at: Math.min(fc - 1, t) };
  });

  return Array.from({ length: fc }, (_, f) => {
    const m = clone(from);
    for (const p of pix) if (f >= p.at) m[p.y][p.x] = p.t;
    return m;
  });
}

function ditherOutInFrames(from, to, fc, seed) {
  const h = from.length, w = from[0].length;
  const EMPTY = Array.from({ length: h }, () => Array(w).fill(0));
  const fcOut = Math.floor(fc / 2);
  const fcIn = fc - fcOut;

  const outFrames = ditherFrames(from, EMPTY, fcOut, seed);
  const inFrames = ditherFrames(EMPTY, to, fcIn, seed + 1000);

  return [...outFrames, ...inFrames];
}

function slideFrames(from, to, fc, seed) {
  const rand = seededRand(seed);
  const dirs = ["left", "right", "up", "down", "diag-br", "diag-tl"];
  const dir = dirs[Math.floor(rand() * dirs.length)];
  const h = from.length, w = from[0].length;

  return Array.from({ length: fc }, (_, f) => {
    const p = f / Math.max(fc - 1, 1);
    const m = Array.from({ length: h }, () => Array(w).fill(0));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let show = false;
        switch (dir) {
          case "left": show = x / w <= p; break;
          case "right": show = (w - 1 - x) / w <= p; break;
          case "up": show = y / h <= p; break;
          case "down": show = (h - 1 - y) / h <= p; break;
          case "diag-br": show = (x + y) / (w + h - 2) <= p; break;
          case "diag-tl": show = ((w - 1 - x) + (h - 1 - y)) / (w + h - 2) <= p; break;
        }
        m[y][x] = show ? to[y][x] : from[y][x];
      }
    }
    return m;
  });
}

function vanishFrames(from, to, fc, seed) {
  const rand = seededRand(seed);
  const h = from.length, w = from[0].length;
  const oldP = [], newP = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (from[y][x]) oldP.push({ x, y });
      if (to[y][x]) newP.push({ x, y });
    }
  }

  const sOld = shuf(oldP, rand), sNew = shuf(newP, rand);
  const vanishEnd = Math.floor(fc * 0.45);

  return Array.from({ length: fc }, (_, f) => {
    const m = Array.from({ length: h }, () => Array(w).fill(0));
    if (f < vanishEnd) {
      const keep = Math.floor(sOld.length * (1 - f / vanishEnd));
      for (let i = 0; i < keep; i++) { const p = sOld[i]; m[p.y][p.x] = 1; }
    } else {
      const prog = (f - vanishEnd) / (fc - vanishEnd);
      const show = Math.floor(sNew.length * prog);
      for (let i = 0; i < show; i++) { const p = sNew[i]; m[p.y][p.x] = 1; }
    }
    return m;
  });
}

function smokedFrames(from, to, fc, seed) {
  const rand = seededRand(seed);
  const h = from.length, w = from[0].length;

  const oldP = [], newP = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (from[y][x]) oldP.push({ x, y, thr: rand() });
      if (to[y][x]) newP.push({ x, y, thr: rand() });
    }
  }

  const f0 = Math.floor(fc * 0.10);
  const f1 = Math.floor(fc * 0.40);
  const f2 = Math.floor(fc * 0.50);
  const f3 = Math.floor(fc * 0.85);

  return Array.from({ length: fc }, (_, f) => {
    const m = Array.from({ length: h }, () => Array(w).fill(0));

    if (f < f0) {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) m[y][x] = from[y][x];
    } else if (f < f1) {
      const prog = (f - f0) / (f1 - f0);
      for (const p of oldP) {
        const alive = Math.max(0, 1 - prog * 0.8 - p.thr * 0.25);
        m[p.y][p.x] = rand() < alive ? 1 : 0;
      }
    } else if (f < f2) {
      for (const p of newP) if (rand() < 0.04) m[p.y][p.x] = 1;
    } else if (f < f3) {
      const prog = (f - f2) / (f3 - f2);
      for (const p of newP) {
        const on = prog * 0.85 + p.thr * 0.15;
        m[p.y][p.x] = rand() < on ? 1 : 0;
      }
    } else {
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) m[y][x] = to[y][x];
    }
    return m;
  });
}

function cascadeFrames(from, to, fc, seed) {
  const rand = seededRand(seed);
  const h = from.length, w = from[0].length;
  const isRowScan = rand() < 0.5;

  return Array.from({ length: fc }, (_, f) => {
    const p = f / Math.max(fc - 1, 1);
    const m = Array.from({ length: h }, () => Array(w).fill(0));

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const progress = isRowScan ? y / h : x / w;
        m[y][x] = progress <= p ? to[y][x] : from[y][x];
      }
    }
    return m;
  });
}

function pixelZoomFrames(from, to, fc, seed) {
  const h = from.length, w = from[0].length;
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  const halfFc = Math.floor(fc / 2);

  return Array.from({ length: fc }, (_, f) => {
    const m = Array.from({ length: h }, () => Array(w).fill(0));

    if (f < halfFc) {
      const scale = 1 - f / halfFc;
      if (scale > 0.1) {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            if (from[y][x]) {
              const nx = Math.round(cx + (x - cx) * scale);
              const ny = Math.round(cy + (y - cy) * scale);
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                m[ny][nx] = 1;
              }
            }
          }
        }
      }
    } else {
      const scale = (f - halfFc + 1) / (fc - halfFc);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (to[y][x]) {
            const nx = Math.round(cx + (x - cx) * scale);
            const ny = Math.round(cy + (y - cy) * scale);
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              m[ny][nx] = 1;
            }
          }
        }
      }
    }
    return m;
  });
}

const GENERATORS = {
  dither: ditherFrames,
  slide: slideFrames,
  vanish: vanishFrames,
  smoked: smokedFrames,
  cascade: cascadeFrames,
  pixelZoom: pixelZoomFrames,
};

/* ─── Main Component ─── */
export default function PixelLogo({ size = 28, className = "" }) {
  const [pixels, setPixels] = useState(LETTERS.W);

  const sRef = useRef({
    mode: "idle", // "idle" | "transitioning" | "pausing"
    frames: [],
    frameIdx: 0,
    nextAt: 0,
    seq: [],
    seqIdx: 0,
    isFirst: true, // Flag to ensure the initial animation is dither out/in over 5s
  });

  const FPS = 10;
  const MS = 1000 / FPS;

  useEffect(() => {
    let rid;

    const startTransition = () => {
      const s = sRef.current;
      const from = s.seq[s.seqIdx];
      const to = s.seq[s.seqIdx + 1];

      if (!to) {
        s.mode = "idle";
        setPixels(LETTERS.W);
        // Rest on 'W' for 2 to 4 seconds
        s.nextAt = Date.now() + 2000 + Math.random() * 2000;
        return;
      }

      if (s.isFirst) {
        s.isFirst = false;
        // Total duration = 5000ms = 60 frames (2.5s dither out + 2.5s dither in)
        const fcTotal = Math.round(4000 / MS);
        s.frames = ditherOutInFrames(LETTERS[from], LETTERS[to], fcTotal, Date.now());
      } else {
        const type = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
        const fc = 5 + Math.floor(Math.random() * 5);
        s.frames = GENERATORS[type](LETTERS[from], LETTERS[to], fc, Date.now());
      }

      s.frameIdx = 0;
      s.mode = "transitioning";
      s.nextAt = Date.now() + MS;
    };

    const plan = () => {
      const s = sRef.current;
      const r = Math.random();

      if (r < 0.80) {
        // 60% chance: Quick jump (W -> random letter -> W)
        const pick = LETTER_ORDER[1 + Math.floor(Math.random() * (LETTER_ORDER.length - 1))];
        s.seq = ["W", pick, "W"];
      } else if (r < 0.88) {
        // 28% chance: Short run of 2-4 letters -> W
        const len = 2 + Math.floor(Math.random() * 3);
        const start = Math.floor(Math.random() * (LETTER_ORDER.length - len + 1));
        s.seq = ["W", ...LETTER_ORDER.slice(start, start + len), "W"];
      } else {
        // 12% chance: Full sequence run W -> E -> N -> O -> D -> S -> E -> W
        s.seq = [...LETTER_ORDER, "W"];
      }

      s.seqIdx = 0;
      startTransition();
    };

    const tick = () => {
      const now = Date.now();
      const s = sRef.current;

      if (now >= s.nextAt) {
        if (s.mode === "idle") {
          plan();
        } else if (s.mode === "transitioning") {
          if (s.frameIdx < s.frames.length) {
            setPixels(s.frames[s.frameIdx]);
            s.frameIdx++;
            s.nextAt = now + MS;
          } else {
            // Pause briefly on the target letter before next transition
            s.mode = "pausing";
            s.nextAt = now + 400 + Math.random() * 300;
          }
        } else if (s.mode === "pausing") {
          s.seqIdx++;
          startTransition();
        }
      }

      rid = requestAnimationFrame(tick);
    };

    sRef.current.nextAt = Date.now() + 0;
    rid = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rid);
  }, [MS]);

  return (
    <svg
      width={size}
      height={(size / 10) * 12}
      viewBox="0 0 10 12"
      className={className}
      style={{ imageRendering: "pixelated" }}
    >
      {pixels.map((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill="currentColor"
            />
          ) : null
        )
      )}
    </svg>
  );
}