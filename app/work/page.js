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

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouse({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(works.map((w) => w.category))];
    return ["All", ...cats];
  }, []);

  const filteredWorks = useMemo(() => {
    if (activeFilter === "All") return works;
    return works.filter((w) => w.category === activeFilter);
  }, [activeFilter]);

  return (
    <main className="wn-work-page">
      {/* This is the crucial fix. 
        It allows your UNTOUCHED ProjectCard to find the animation it needs to become visible.
      */}
      <style>{`
        @keyframes cardEnter {
          to {
            opacity: 1;
            transform: translateY(0);
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

      {/* HERO SECTION */}
      <section className="wn-work-hero">
        <div className="wn-work-hero-top">
          <span className="wn-pixel-text">02 — INDEX / ARCHIVE</span>
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
                onClick={() => setActiveFilter(cat)}
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
          TOTAL_NODES: [{filteredWorks.length < 10 ? `0${filteredWorks.length}` : filteredWorks.length}]
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="wn-work-content">
        <div className="wn-work-grid">
          {filteredWorks.map((project, i) => (
            /* We removed the wrapper animation here because your card handles it natively */
            <ProjectCard key={project.id} project={project} index={i} />
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