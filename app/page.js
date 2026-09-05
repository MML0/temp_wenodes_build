"use client";

import { useEffect, useRef, useState } from "react";
import ParticleScene from "./components/ParticleScene";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ProjectCard from "./components/ProjectCard";
import MemberCard from "./components/MemberCard";
import { works } from "./data/works";
import { team } from "./data/team";
import Link from "next/link";

/* ═══════════════════════════════════════════════
   SYSTEM DATA
═══════════════════════════════════════════════ */

const disciplines = [
  "ART",
  "DESIGN",
  "MEDIA",
  "EMERGING TECH",
  "INTERACTION",
  "SPACE",
  "SOUND",
  "CODE",
  "LIGHT",
  "PERFORMANCE",
];

const terminalLines = [
  "BOOTING EXPERIENCE SYSTEMS...",
  "PARTICLES / 18,000 — SYNCED",
  "IDEAS → SYSTEMS → EXPERIENCES",
  "NETWORK STATUS / ONLINE",
  "SCANNING FOR NEW SIGNALS_",
];

/* ═══════════════════════════════════════════════
   MAGNETIC WORD
═══════════════════════════════════════════════ */

function MagneticWord({ children, className = "" }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "translate3d(0,0,0)";
    }
  };

  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`hn-magnetic ${className}`}
    >
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   LIVE CLOCK
═══════════════════════════════════════════════ */

function SystemClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour12: false,
          timeZone: "UTC",
        }) + " UTC"
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{time}</span>;
}

/* ═══════════════════════════════════════════════
   TERMINAL STATUS (rotating)
═══════════════════════════════════════════════ */

function TerminalStatus() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % terminalLines.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hn-terminal">
      <span className="hn-terminal-prompt">&gt;</span>
      <span key={index} className="hn-terminal-line">
        {terminalLines[index]}
      </span>
      <span className="hn-terminal-cursor" />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REVEAL ON SCROLL
═══════════════════════════════════════════════ */

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`hn-reveal ${visible ? "is-visible" : ""}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════ */

export default function Home() {
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });
  const featuredTeam = team.slice(2, 5);

  const handleMouseMove = (e) => {
    setCoords({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  };

  return (
    <main className="hn-page" onMouseMove={handleMouseMove}>

      {/* BACKGROUND SYSTEMS */}
      <div
        className="scene"
        aria-hidden="true"
        style={{ opacity: 0.7 }}
      >
        <ParticleScene />
      </div>

      <div className="grain" aria-hidden="true" />
      <div className="hn-grid-overlay" aria-hidden="true" />

      <Navigation />

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}

      <section className="hn-hero">

        {/* system header */}
        <div className="hn-system-bar">
          <div className="hn-system-left">
            <span className="hn-system-dot" />
            <span>WENODES / HOME SYSTEM</span>
          </div>
          <SystemClock />
        </div>

        {/* eyebrow */}
        <div className="hn-hero-eyebrow">
          <span>CREATIVE TECHNOLOGY</span>
          <span className="hn-eyebrow-divider">/</span>
          <span>DIGITAL SYSTEMS</span>
          <span className="hn-eyebrow-divider">/</span>
          <span className="hn-eyebrow-alert">LIVE</span>
        </div>

        {/* title */}
        <h1 className="hn-title">
          <span
            className="hn-title-word"
            style={{ "--word-delay": "0ms" }}
          >
            WE
          </span>
          <span
            className="hn-title-word"
            style={{ "--word-delay": "100ms" }}
          >
            MAKE
          </span>
          <span
            className="hn-title-word hn-title-ghost"
            style={{ "--word-delay": "200ms" }}
          >
            THINGS
          </span>
          <span
            className="hn-title-word"
            style={{ "--word-delay": "320ms" }}
          >
            <MagneticWord className="hn-move">
              MOVE
            </MagneticWord>
            <span className="hn-title-dot">.</span>
          </span>
        </h1>

        {/* terminal status */}
        <div
          className="hn-terminal-wrap"
          style={{ "--word-delay": "600ms" }}
        >
          <TerminalStatus />
        </div>

        {/* orbit decoration */}
        <div
          className="hn-orbit"
          aria-hidden="true"
          style={{
            transform: `translate3d(${(coords.x - 0.5) * 24}px, ${
              (coords.y - 0.5) * 24
            }px, 0)`,
          }}
        >
          <div className="hn-orbit-dot" />
          <span className="hn-orbit-label">NODE / 001</span>
        </div>

        {/* coordinates readout */}
        <div className="hn-coords" aria-hidden="true">
          <span>X / {coords.x.toFixed(3)}</span>
          <span>Y / {coords.y.toFixed(3)}</span>
        </div>

        {/* bottom row */}
        <div className="hn-hero-bottom">
          <p>
            A collective exploring the space
            <br />
            between technology, art and interaction.
          </p>

          <span className="hn-scroll">
            <span>SCROLL TO EXPLORE</span>
            <span className="hn-scroll-line" />
            <span>↓</span>
          </span>
        </div>

        {/* scanline */}
        <div className="hn-scanline" aria-hidden="true" />
      </section>

      {/* ═══════════════════════════════════════
          TECHNICAL STRIP
      ═══════════════════════════════════════ */}

      <section className="hn-strip">
        <div className="hn-strip-item">
          <span className="hn-strip-label">PARTICLES</span>
          <span className="hn-strip-value">18,000</span>
        </div>
        <div className="hn-strip-item">
          <span className="hn-strip-label">STATE</span>
          <span className="hn-strip-value">ONLINE</span>
        </div>
        <div className="hn-strip-item">
          <span className="hn-strip-label">LATENCY</span>
          <span className="hn-strip-value">00.4ms</span>
        </div>
        <div className="hn-strip-item">
          <span className="hn-strip-label">ID</span>
          <span className="hn-strip-value">0x574E4F4445</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          DISCIPLINE MARQUEE
      ═══════════════════════════════════════ */}

      <div className="hn-marquee" aria-hidden="true">
        <div className="hn-marquee-track">
          {[...disciplines, ...disciplines].map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          ABOUT / MANIFESTO
      ═══════════════════════════════════════ */}

      <Reveal>
        <section className="manifesto" id="about">
          <div className="hn-section-label">
            <span>01 — ABOUT</span>
            <span>SYSTEM OVERVIEW</span>
          </div>

          <h2>
            We build <i>experiences</i>
            <br />
            that behave like living systems.
          </h2>

          <div className="manifesto-cta">
            <Link href="/about" className="btn">
              READ MORE →
            </Link>
          </div>
        </section>
      </Reveal>

      {/* ═══════════════════════════════════════
          SELECTED WORK
      ═══════════════════════════════════════ */}

      <Reveal>
        <section className="manifesto" id="work">
          <div className="hn-section-label">
            <span>02 — SELECTED WORK</span>
            <span>03 PROJECTS</span>
          </div>

          <div className="section-header">
            <h2>Projects that push boundaries.</h2>

            <Link href="/work" className="btn-outline">
              VIEW ALL →
            </Link>
          </div>

          <div className="projects-grid">
            {[17, 3, 5].map((id, i) => {
              const project = works.find((work) => work.id === id);
              if (!project) return null;
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                />
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* ═══════════════════════════════════════
          TEAM
      ═══════════════════════════════════════ */}

      <Reveal>
        <section className="manifesto" id="team">
          <div className="hn-section-label">
            <span>03 — TEAM</span>
            <span>{team.length} NODES ACTIVE</span>
          </div>

          <div className="section-header">
            <h2>People × ideas × technology.</h2>

            <Link href="/team" className="btn-outline">
              MEET ALL →
            </Link>
          </div>

          <div className="team-grid">
            {featuredTeam.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══════════════════════════════════════
          JOIN
      ═══════════════════════════════════════ */}

      <Reveal>
        <section className="manifesto join-section">
          <div className="hn-section-label">
            <span>04 — JOIN</span>
            <span>OPEN CHANNEL</span>
          </div>

          <h2>
            Want to <i>build</i> the future
            <br />
            with us?
          </h2>

          <div className="manifesto-cta">
            <Link href="/join" className="btn btn-large">
              APPLY TO JOIN ↗
            </Link>
          </div>
        </section>
      </Reveal>

      <Footer />

      {/* ═══════════════════════════════════════
          PAGE CSS
      ═══════════════════════════════════════ */}

      <style>{`

        /* ═══════════ TOKENS & BASE ═══════════ */

        .hn-page {
          --hn-white: #e8e6e3;
          --hn-muted: #888;
          --hn-dim: #555;
          --hn-border: rgba(232,230,227,.12);
          --hn-border-strong: rgba(232,230,227,.22);
          --hn-alert: #c45a5a;
          position: relative;
        }

        .hn-grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: .035;
          background-image:
            linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* ═══════════ HERO ═══════════ */

        .hn-hero {
          position: relative;
          min-height: 92vh;
          padding:
            clamp(8rem, 14vw, 11rem)
            clamp(1.2rem, 5vw, 5rem)
            4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          z-index: 2;
        }

        .hn-system-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
          font-family: var(--font-pixel, monospace);
          font-size: .62rem;
          letter-spacing: .12em;
          color: #666;
        }

        .hn-system-left {
          display: flex;
          align-items: center;
          gap: .6rem;
        }

        .hn-system-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #e8e6e3;
          box-shadow: 0 0 12px rgba(232,230,227,.7);
          animation: hnLivePulse 1.8s ease-in-out infinite;
        }

        @keyframes hnLivePulse {
          0%, 100% { opacity: .35; transform: scale(.7); }
          50% { opacity: 1; transform: scale(1); }
        }

        .hn-hero-eyebrow {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: .6rem;
          margin-bottom: 1.5rem;
          font-family: var(--font-pixel, monospace);
          font-size: .68rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #777;
        }

        .hn-eyebrow-divider { color: #333; }

        .hn-eyebrow-alert { color: var(--hn-alert); }

        .hn-title {
          display: flex;
          flex-wrap: wrap;
          gap: 0 .28em;
          max-width: 1300px;
          margin: 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(4rem, 13vw, 12.5rem);
          font-weight: 400;
          line-height: .82;
          letter-spacing: -.065em;
          text-transform: uppercase;
        }

        .hn-title-word {
          opacity: 0;
          transform: translateY(70px);
          animation:
            hnTitleIn 1s cubic-bezier(.22,1,.36,1)
            var(--word-delay, 0ms) forwards;
          will-change: transform, opacity;
        }

        .hn-title-ghost {
          color: transparent;
          -webkit-text-stroke: 1px rgba(232,230,227,.45);
        }

        .hn-title-dot {
          color: var(--hn-alert);
        }

        @keyframes hnTitleIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .hn-magnetic {
          display: inline-block;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
        }

        /* terminal */

        .hn-terminal-wrap {
          margin-top: 3rem;
          opacity: 0;
          animation: hnFadeUp .8s cubic-bezier(.22,1,.36,1)
            var(--word-delay, 600ms) forwards;
        }

        .hn-terminal {
          display: inline-flex;
          align-items: center;
          gap: .7rem;
          padding: .8rem 1.2rem;
          border: 1px solid var(--hn-border);
          font-family: var(--font-pixel, monospace);
          font-size: .62rem;
          letter-spacing: .1em;
          color: #888;
          background: rgba(9,9,9,.4);
          backdrop-filter: blur(4px);
        }

        .hn-terminal-prompt { color: var(--hn-alert); }

        .hn-terminal-line { animation: hnTermIn .4s ease both; }

        @keyframes hnTermIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hn-terminal-cursor {
          width: 7px;
          height: 12px;
          background: var(--hn-alert);
          animation: hnBlink 1s steps(1) infinite;
        }

        @keyframes hnBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* orbit */

        .hn-orbit {
          position: absolute;
          right: 8%;
          top: 22%;
          width: clamp(140px, 19vw, 280px);
          aspect-ratio: 1;
          border: 1px solid rgba(232,230,227,.12);
          border-radius: 50%;
          transition: transform .25s ease-out;
          pointer-events: none;
        }

        .hn-orbit::before,
        .hn-orbit::after {
          content: "";
          position: absolute;
          inset: 16%;
          border: 1px solid rgba(232,230,227,.07);
          border-radius: 50%;
        }

        .hn-orbit::after { inset: 36%; }

        .hn-orbit-dot {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e8e6e3;
          left: 50%;
          top: -4px;
          transform-origin: 0 50%;
          animation: hnOrbit 9s linear infinite;
        }

        .hn-orbit-label {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-pixel, monospace);
          font-size: .52rem;
          letter-spacing: .12em;
          color: #555;
        }

        @keyframes hnOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* coordinates */

        .hn-coords {
          position: absolute;
          right: clamp(1.2rem, 5vw, 5rem);
          bottom: 8rem;
          display: flex;
          flex-direction: column;
          gap: .3rem;
          font-family: var(--font-pixel, monospace);
          font-size: .55rem;
          letter-spacing: .1em;
          color: #444;
          text-align: right;
          pointer-events: none;
        }

        /* hero bottom */

        .hn-hero-bottom {
          margin-top: 5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .hn-hero-bottom p {
          margin: 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(.95rem, 1.4vw, 1.15rem);
          line-height: 1.6;
          color: #777;
        }

        .hn-scroll {
          display: flex;
          align-items: center;
          gap: .8rem;
          font-family: var(--font-pixel, monospace);
          font-size: .58rem;
          letter-spacing: .1em;
          color: #555;
        }

        .hn-scroll-line {
          width: 70px;
          height: 1px;
          background: #333;
          position: relative;
          overflow: hidden;
        }

        .hn-scroll-line::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--hn-alert);
          transform: translateX(-100%);
          animation: hnScan 2.4s ease-in-out infinite;
        }

        @keyframes hnScan {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }

        /* scanline sweep */

        .hn-scanline {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(196,90,90,.35),
            transparent
          );
          animation: hnSweep 7s linear infinite;
          pointer-events: none;
        }

        @keyframes hnSweep {
          0% { transform: translateY(0); opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { transform: translateY(88vh); opacity: 0; }
        }

        /* ═══════════ TECHNICAL STRIP ═══════════ */

        .hn-strip {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--hn-border);
          border-bottom: 1px solid var(--hn-border);
        }

        .hn-strip-item {
          padding: 1.4rem 1.5rem;
          border-right: 1px solid var(--hn-border);
          display: flex;
          flex-direction: column;
          gap: .45rem;
          transition: background .35s ease;
        }

        .hn-strip-item:last-child { border-right: 0; }

        .hn-strip-item:hover {
          background: rgba(232,230,227,.03);
        }

        .hn-strip-label {
          font-family: var(--font-pixel, monospace);
          font-size: .52rem;
          letter-spacing: .12em;
          color: #444;
        }

        .hn-strip-value {
          font-family: var(--font-whyte, sans-serif);
          font-size: 1.15rem;
          letter-spacing: -.02em;
          color: #aaa;
        }

        /* ═══════════ MARQUEE ═══════════ */

        .hn-marquee {
          overflow: hidden;
          padding: 1.4rem 0;
          border-bottom: 1px solid var(--hn-border);
          white-space: nowrap;
          position: relative;
          z-index: 2;
        }

        .hn-marquee-track {
          display: inline-flex;
          animation: hnMarquee 32s linear infinite;
        }

        .hn-marquee span {
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(1.8rem, 3.6vw, 3.4rem);
          letter-spacing: -.03em;
          margin-right: 3rem;
          color: rgba(232,230,227,.16);
        }

        .hn-marquee span::after {
          content: " × ";
          margin-left: 3rem;
          color: rgba(232,230,227,.08);
        }

        @keyframes hnMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ═══════════ SECTION LABELS ═══════════ */

        .hn-section-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          margin-bottom: 2.5rem;
          border-top: 1px solid var(--hn-border);
          font-family: var(--font-pixel, monospace);
          font-size: .58rem;
          letter-spacing: .1em;
          color: #666;
        }

        /* ═══════════ REVEAL ═══════════ */

        .hn-reveal {
          opacity: 0;
          transform: translateY(45px);
          transition:
            opacity .9s ease,
            transform 1s cubic-bezier(.22,1,.36,1);
          transition-delay: var(--reveal-delay, 0ms);
        }

        .hn-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes hnFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardEnter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ═══════════ RESPONSIVE ═══════════ */

        @media (max-width: 800px) {
          .hn-hero {
            min-height: 82vh;
            padding-top: 7rem;
          }

          .hn-system-bar { margin-bottom: 2.5rem; }

          .hn-title {
            font-size: clamp(3.2rem, 15vw, 7rem);
          }

          .hn-orbit { opacity: .35; }

          .hn-coords { display: none; }

          .hn-strip {
            grid-template-columns: 1fr 1fr;
          }

          .hn-strip-item:nth-child(2) { border-right: 0; }

          .hn-strip-item:nth-child(1),
          .hn-strip-item:nth-child(2) {
            border-bottom: 1px solid var(--hn-border);
          }

          .hn-hero-bottom { margin-top: 3.5rem; }
        }

        /* ═══════════ REDUCED MOTION ═══════════ */

        @media (prefers-reduced-motion: reduce) {
          .hn-title-word,
          .hn-terminal-wrap,
          .hn-system-dot,
          .hn-orbit-dot,
          .hn-scroll-line::after,
          .hn-scanline,
          .hn-marquee-track {
            animation: none !important;
            opacity: 1;
            transform: none;
          }

          .hn-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }

          * { scroll-behavior: auto !important; }
        }

      `}</style>
    </main>
  );
}