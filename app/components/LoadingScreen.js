"use client";

import { useState, useEffect } from "react";
import PixelLogo from "./PixelLogo";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("wenodes_visited");
    const duration = hasVisited ? 500 : 2200;
    const interval = 16;
    let current = 0;
    
    const timer = setInterval(() => {
      current += (100 / (duration / interval));
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          setFading(true);
          setTimeout(() => setVisible(false), 600);
          localStorage.setItem("wenodes_visited", "true");
        }, 200);
      } else {
        setProgress(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`loading-screen ${fading ? 'fade-out' : ''}`}>
      <div style={{ animation: "logoPulse 2s ease-in-out infinite" }}>
        <PixelLogo size={64} />
      </div>
      <div style={{ 
        fontSize: "11px", 
        letterSpacing: "0.2em", 
        opacity: 0.5 
      }}>
        WENODES
      </div>
      <div style={{
        width: "120px",
        height: "1px",
        background: "rgba(244,244,240,0.1)",
        marginTop: "8px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${progress}%`,
          background: "#f4f4f0",
          transition: "width 0.1s linear"
        }} />
      </div>
      <div style={{ 
        fontSize: "10px", 
        letterSpacing: "0.15em", 
        opacity: 0.35,
        fontVariantNumeric: "tabular-nums"
      }}>
        {progress}%
      </div>
    </div>
  );
}