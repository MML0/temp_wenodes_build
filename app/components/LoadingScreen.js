"use client";

import { useState, useEffect } from "react";
import PixelLogo from "./PixelLogo";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const hasVisited =
      localStorage.getItem("wenodes_visited");

    const duration = hasVisited ? 500 : 2200;
    const interval = 16;
    let current = 0;

    const timer = setInterval(() => {
      current += 100 / (duration / interval);

      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setProgress(100);

        setTimeout(() => {
          setFading(true);

          setTimeout(() => {
            setVisible(false);

            localStorage.setItem(
              "wenodes_visited",
              "true"
            );
          }, 600);
        }, 200);
      } else {
        setProgress(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`loading-screen ${
        fading ? "fade-out" : ""
      }`}
    >
      <div
        style={{
          animation:
            "logoPulse 2s ease-in-out infinite",
        }}
      >
        <PixelLogo size={64} />
      </div>

      <div
        style={{
          fontFamily:
            "var(--font-pixel), monospace",
          fontSize: "11px",
          letterSpacing: "0.2em",
          opacity: 0.5,
        }}
      >
        WENODES
      </div>

      <div
        style={{
          width: "120px",
          height: "1px",
          background:
            "rgba(244,244,240,0.1)",
          marginTop: "8px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${progress}%`,
            background: "#f4f4f0",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      <div
        style={{
          fontFamily:
            "var(--font-pixel), monospace",
          fontSize: "10px",
          letterSpacing: "0.15em",
          opacity: 0.35,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {progress}%
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          z-index: 99999;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          background: #090909;
          color: #e8e6e3;

          opacity: 1;
          visibility: visible;

          transition:
            opacity 0.6s ease,
            visibility 0.6s ease;
        }

        .loading-screen.fade-out {
          opacity: 0;
          visibility: hidden;
        }

        @keyframes logoPulse {
          0%,
          100% {
            opacity: 0.7;
          }

          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}










