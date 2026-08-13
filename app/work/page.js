"use client";

import { useState, useMemo, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleScene";
import ProjectCard from "../components/ProjectCard";
import { works } from "../data/works";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (event) => {
      setMouse({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(works.map((w) => w.category))];
    return ["All", ...cats];
  }, []);

  const filteredWorks = useMemo(() => {
    if (activeFilter === "All") return works;
    return works.filter((w) => w.category === activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (category) => {
    if (category === activeFilter) return;
    setActiveFilter(category);
  };

  return (
    <main className="wn-work-page">
      <style>{`
        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(30px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes workHeroEnter {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes workLineEnter {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }

          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        @keyframes statusPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.85);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes filterEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wn-work-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .wn-work-scene {
          position: fixed;
          inset: -30px;
          z-index: 0;
          pointer-events: none;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .wn-work-hero,
        .wn-work-controls,
        .wn-work-content {
          position: relative;
          z-index: 2;
        }

        .wn-work-hero {
          padding-top: clamp(8rem, 15vw, 13rem);
          padding-bottom: clamp(4rem, 8vw, 7rem);
        }

        .wn-work-hero-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          margin-bottom: clamp(3rem, 7vw, 6rem);
          opacity: ${isLoaded ? 1 : 0};
          transform: ${isLoaded ? "translateY(0)" : "translateY(20px)"};
          transition:
            opacity 0.8s ease,
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wn-work-title {
          margin: 0;
          font-size: clamp(4rem, 12vw, 11rem);
          font-weight: 400;
          line-height: 0.82;
          letter-spacing: -0.055em;
          max-width: 1100px;
          opacity: ${isLoaded ? 1 : 0};
          transform: ${isLoaded ? "translateY(0)" : "translateY(40px)"};
          transition:
            opacity 1s ease 0.1s,
            transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;
        }

        .wn-work-title span {
          display: inline-block;
          margin-left: clamp(1rem, 8vw, 8rem);
          color: rgba(232, 230, 227, 0.32);
          transition:
            color 0.6s ease,
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .wn-work-title:hover span {
          color: rgba(232, 230, 227, 0.8);
          transform: translateX(10px);
        }

        .wn-work-hero-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 3rem;
          margin-top: clamp(3rem, 7vw, 6rem);
          padding-top: 1.2rem;
          border-top: 1px solid rgba(232, 230, 227, 0.12);
          position: relative;
          opacity: ${isLoaded ? 1 : 0};
          transform: ${isLoaded ? "translateY(0)" : "translateY(20px)"};
          transition:
            opacity 0.8s ease 0.3s,
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;
        }

        .wn-work-hero-bottom::before {
          content: "";
          position: absolute;
          top: -1px;
          left: 0;
          width: 28%;
          height: 1px;
          background: rgba(232, 230, 227, 0.7);
          animation: workLineEnter 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
        }

        .wn-work-description {
          max-width: 520px;
          margin: 0;
          color: rgba(232, 230, 227, 0.55);
          font-size: clamp(0.95rem, 1.3vw, 1.15rem);
          line-height: 1.6;
        }

        .wn-work-data-tag {
          white-space: nowrap;
          color: rgba(232, 230, 227, 0.35);
        }

        .wn-system-label {
          font-family: var(--font-pixel, monospace);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: rgba(232, 230, 227, 0.4);
          white-space: nowrap;
        }

        .wn-system-label::before {
          content: "";
          display: inline-block;
          width: 5px;
          height: 5px;
          margin-right: 8px;
          border-radius: 50%;
          background: rgba(232, 230, 227, 0.8);
          animation: statusPulse 1.8s ease-in-out infinite;
        }

        .wn-work-controls {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
          padding: 1.2rem 10px;
          border-top: 1px solid rgba(232, 230, 227, 0.1);
          border-bottom: 1px solid rgba(232, 230, 227, 0.1);
          margin-bottom: 2rem;
        }

        .wn-work-filter-group {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          min-width: 0;
        }

        .wn-filter-label {
          color: rgba(232, 230, 227, 0.3);
          white-space: nowrap;
        }

        .wn-filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .wn-filter-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(232, 230, 227, 0.4);
          padding: 0.5rem 0.7rem;
          font-family: inherit;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition:
            color 0.3s ease,
            border-color 0.3s ease,
            background 0.3s ease,
            transform 0.3s ease;
        }

        .wn-filter-btn:hover {
          color: rgba(232, 230, 227, 0.9);
          border-color: rgba(232, 230, 227, 0.12);
          transform: translateY(-2px);
        }

        .wn-filter-btn.active {
          color: #e8e6e3;
          border-color: rgba(232, 230, 227, 0.2);
          background: rgba(232, 230, 227, 0.035);
        }

        .wn-filter-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.3;
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        .wn-filter-btn:hover .wn-filter-dot,
        .wn-filter-btn.active .wn-filter-dot {
          opacity: 1;
          transform: scale(1.5);
        }

        .wn-work-counter {
          color: rgba(232, 230, 227, 0.3);
          white-space: nowrap;
        }

        .wn-work-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .wn-work-grid > * {
          animation: filterEnter 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .wn-work-grid > *:nth-child(1) {
          animation-delay: 0ms;
        }

        .wn-work-grid > *:nth-child(2) {
          animation-delay: 60ms;
        }

        .wn-work-grid > *:nth-child(3) {
          animation-delay: 120ms;
        }

        .wn-work-grid > *:nth-child(4) {
          animation-delay: 180ms;
        }

        .wn-work-grid > *:nth-child(5) {
          animation-delay: 240ms;
        }

        .wn-work-grid > *:nth-child(6) {
          animation-delay: 300ms;
        }

        .wn-work-empty {
          padding: 7rem 1rem;
          text-align: center;
          color: rgba(232, 230, 227, 0.3);
          border: 1px solid rgba(232, 230, 227, 0.1);
        }

        @media (max-width: 800px) {
          .wn-work-hero-top,
          .wn-work-hero-bottom,
          .wn-work-controls {
            align-items: flex-start;
            flex-direction: column;
          }

          .wn-work-grid {
            grid-template-columns: 1fr;
          }

          .wn-work-filter-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }

          .wn-work-title span {
            margin-left: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wn-work-scene {
            transform: none !important;
            transition: none;
          }

          .wn-work-hero-top,
          .wn-work-title,
          .wn-work-hero-bottom {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .wn-work-grid > * {
            animation: none;
          }
        }
      `}</style>

      {/* BACKGROUND */}
      <div
        className="wn-work-scene"
        aria-hidden="true"
        style={{
          transform: `translate(${mouse.x * -6}px, ${mouse.y * -6}px)`,
        }}
      >
        <ParticleScene />
      </div>

      <div className="grain" />

      <Navigation />

      {/* HERO */}
      <section className="wn-work-hero">
        <div className="wn-work-hero-top">
          <span className="wn-pixel-text">
            02 — INDEX / ARCHIVE
          </span>

          <span className="wn-system-label">
            SYSTEM STATUS: [ ONLINE ]
          </span>
        </div>

        <h1 className="wn-work-title">
          SELECTED
          <br />
          <span>PROJECTS.</span>
        </h1>

        <div className="wn-work-hero-bottom">
          <p className="wn-work-description">
            {works.length} projects across immersive installations,
            audiovisual performances, brand experiences, and cultural
            productions.
          </p>

          <div className="wn-work-data-tag wn-pixel-text">
            DATASET / {new Date().getFullYear()}
          </div>
        </div>
      </section>

      {/* FILTER CONTROL PANEL */}
      <section className="wn-work-controls">
        <div className="wn-work-filter-group">
          <span className="wn-filter-label wn-pixel-text">
            SORT_BY:
          </span>

          <div className="wn-filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                onMouseEnter={() => setHoveredFilter(cat)}
                onMouseLeave={() => setHoveredFilter(null)}
                className={`wn-filter-btn ${
                  activeFilter === cat ? "active" : ""
                }`}
              >
                <span className="wn-filter-dot" />
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="wn-work-counter wn-pixel-text">
          TOTAL_NODES: [
          {filteredWorks.length < 10
            ? `0${filteredWorks.length}`
            : filteredWorks.length}
          ]
        </div>
      </section>

      {/* PROJECT GRID */}
      <section className="wn-work-content">
        <div className="wn-work-grid" key={activeFilter}>
          {filteredWorks.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
            />
          ))}
        </div>

        {filteredWorks.length === 0 && (
          <div className="wn-work-empty wn-pixel-text">
            [ ERROR: NO_DATA_FOUND_IN_THIS_CATEGORY ]
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}