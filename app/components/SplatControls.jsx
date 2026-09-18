"use client";

import { DEFAULT_FX } from "./SplatStage";

const SLIDERS = [
  {
    key: "scatter",
    name: "Scatter",
    note: "blows the gaussians apart",
    min: 0,
    max: 1,
    step: 0.005,
    fmt: (v) => `${Math.round(v * 100)}%`,
  },
  {
    key: "splatSize",
    name: "Splat size",
    note: "pointillist → blobby",
    min: 0.1,
    max: 3,
    step: 0.01,
    fmt: (v) => `${v.toFixed(2)}x`,
  },
  {
    key: "ghost",
    name: "Ghost",
    note: "per-gaussian opacity",
    min: 0.03,
    max: 1,
    step: 0.01,
    fmt: (v) => `${Math.round(v * 100)}%`,
  },
  {
    key: "kaleido",
    name: "Kaleidoscope",
    note: "0 = off",
    min: 0,
    max: 12,
    step: 1,
    fmt: (v) => (v < 2 ? "off" : `${v} seg`),
  },
  {
    key: "warp",
    name: "Liquid warp",
    note: "domain-warps the frame",
    min: 0,
    max: 1,
    step: 0.005,
    fmt: (v) => `${Math.round(v * 100)}%`,
  },
];

const TOGGLES = [
  { key: "pointCloud", name: "Point cloud", note: "screen-space discs" },
  { key: "glitch", name: "Glitch", note: "blocky RGB tear" },
  { key: "crt", name: "CRT", note: "scanlines + phosphor" },
  { key: "holo", name: "Hologram", note: "cyan interference" },
  { key: "thermal", name: "Thermal", note: "heat-map palette" },
];

export default function SplatControls({ fx, onChange }) {
  const set = (key, value) => onChange({ ...fx, [key]: value });
  const dirty = JSON.stringify(fx) !== JSON.stringify(DEFAULT_FX);

  return (
    <aside style={panel}>
      <style>{css}</style>

      <header style={head}>
        <span style={title}>Effects</span>
        <button
          type="button"
          className="fx-reset"
          disabled={!dirty}
          onClick={() => onChange(DEFAULT_FX)}
        >
          reset
        </button>
      </header>

      <div style={group}>
        {SLIDERS.map((s) => (
          <label key={s.key} style={row}>
            <span style={rowHead}>
              <span style={name}>{s.name}</span>
              <span style={value}>{s.fmt(fx[s.key])}</span>
            </span>
            <input
              className="fx-range"
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={fx[s.key]}
              onChange={(e) => set(s.key, parseFloat(e.target.value))}
            />
            <span style={note}>{s.note}</span>
          </label>
        ))}
      </div>

      <div style={{ ...group, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "16px" }}>
        {TOGGLES.map((t) => (
          <label key={t.key} className="fx-check" style={checkRow}>
            <input
              type="checkbox"
              checked={fx[t.key]}
              onChange={(e) => set(t.key, e.target.checked)}
            />
            <span>
              <span style={name}>{t.name}</span>
              <span style={{ ...note, display: "block" }}>{t.note}</span>
            </span>
          </label>
        ))}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */

const panel = {
  width: "232px",
  flex: "0 0 auto",
  padding: "18px 18px 22px",
  background: "rgba(14,14,22,0.88)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  backdropFilter: "blur(14px)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const head = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
};

const title = {
  font: "600 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.75)",
};

const group = { display: "flex", flexDirection: "column", gap: "14px" };

const row = { display: "flex", flexDirection: "column", gap: "5px", cursor: "pointer" };

const rowHead = { display: "flex", justifyContent: "space-between", alignItems: "baseline" };

const name = {
  font: "500 11px/1.2 ui-sans-serif,system-ui,sans-serif",
  color: "rgba(255,255,255,0.88)",
};

const value = {
  font: "500 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
  letterSpacing: "0.08em",
  color: "#7fd9ff",
};

const note = {
  font: "400 9px/1.3 ui-sans-serif,system-ui,sans-serif",
  color: "rgba(255,255,255,0.32)",
};

const checkRow = {
  display: "flex",
  alignItems: "flex-start",
  gap: "9px",
  cursor: "pointer",
};

const css = `
.fx-range{
  -webkit-appearance:none;appearance:none;
  width:100%;height:14px;background:transparent;cursor:pointer;margin:0;
}
.fx-range::-webkit-slider-runnable-track{
  height:2px;border-radius:2px;
  background:linear-gradient(90deg,#6ad8ff,#c56bff);
}
.fx-range::-moz-range-track{
  height:2px;border-radius:2px;
  background:linear-gradient(90deg,#6ad8ff,#c56bff);
}
.fx-range::-webkit-slider-thumb{
  -webkit-appearance:none;appearance:none;
  width:11px;height:11px;border-radius:50%;
  background:#fff;border:none;margin-top:-4.5px;
  box-shadow:0 0 10px rgba(140,200,255,.8);
}
.fx-range::-moz-range-thumb{
  width:11px;height:11px;border-radius:50%;
  background:#fff;border:none;
  box-shadow:0 0 10px rgba(140,200,255,.8);
}
.fx-check input{
  -webkit-appearance:none;appearance:none;
  width:13px;height:13px;flex:0 0 auto;margin:1px 0 0;
  border:1px solid rgba(255,255,255,.25);border-radius:3px;
  background:transparent;cursor:pointer;position:relative;
  transition:background .15s,border-color .15s;
}
.fx-check input:checked{
  background:linear-gradient(135deg,#6ad8ff,#c56bff);
  border-color:transparent;
}
.fx-check input:checked::after{
  content:"";position:absolute;left:4px;top:1px;
  width:3px;height:6px;border:solid #0b0b12;
  border-width:0 1.6px 1.6px 0;transform:rotate(45deg);
}
.fx-reset{
  font:500 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;
  letter-spacing:.14em;text-transform:uppercase;
  color:rgba(255,255,255,.5);background:none;border:none;
  padding:0;cursor:pointer;transition:color .15s;
}
.fx-reset:hover:not(:disabled){color:#7fd9ff}
.fx-reset:disabled{opacity:.3;cursor:default}
`;
