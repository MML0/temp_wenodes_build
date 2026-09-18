"use client";

import { useState } from "react";
import SplatStage, { DEFAULT_FX } from "../components/SplatStage";
import SplatControls from "../components/SplatControls";

export default function SplatTest() {
  const [fx, setFx] = useState(DEFAULT_FX);

  return (
    <main
      style={{
        background: "#050505",
        minHeight: "100vh",
        padding: "50px 24px",
        color: "white",
        font: "400 14px/1.5 ui-sans-serif,system-ui,-apple-system,sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
      }}
    >
      <h1
        style={{
          margin: 0,
          font: "600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        Team
      </h1>

      <div
        style={{
          display: "flex",
          gap: "22px",
          alignItems: "flex-start",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "620px",
        }}
      >
        <div
          style={{
            width: "min(350px, 100%)",
            background: "#0b0b12",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 30px 80px -30px rgba(120,60,255,0.45)",
          }}
        >
          <div style={{ position: "relative", aspectRatio: "35 / 38" }}>
            <SplatStage src="/team/parsa/scene.splat" fx={fx} />
          </div>

          <div style={{ padding: "18px 20px 22px" }}>
            <h2
              style={{
                margin: "0 0 4px",
                font: "600 17px/1.2 ui-sans-serif,system-ui,sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Alex.
            </h2>
            <p
              style={{
                margin: 0,
                font: "400 12px/1.4 ui-sans-serif,system-ui,sans-serif",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Creative Engineer
            </p>
          </div>
        </div>

        <SplatControls fx={fx} onChange={setFx} />
      </div>
    </main>
  );
}
