"use client";

import { useState, useMemo } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleScene";
import ProjectCard from "../components/ProjectCard";
import { works } from "../data/works";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = useMemo(() => {
    const cats = [...new Set(works.map((w) => w.category))];
    return ["All", ...cats];
  }, []);

  const filteredWorks = useMemo(() => {
    if (activeFilter === "All") return works;

    return works.filter((w) => w.category === activeFilter);
  }, [activeFilter]);

  return (
    <main className="subpage">
      {/* Card entrance animation keyframes */}
      <style>{`
        @keyframes cardEnter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className="scene"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <ParticleScene />
      </div>

      <div className="grain" />

      <Navigation />

      {/* Hero */}
      <section className="subpage-hero">
        <span className="eyebrow">02 — WORK</span>

        <h1>
          SELECTED
          <br />
          PROJECTS.
        </h1>

        <p
          style={{
            maxWidth: "560px",
            marginTop: "1rem",
            fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
            lineHeight: 1.6,
            color: "#888",
          }}
        >
          {works.length} projects across immersive installations,
          audiovisual performances, brand experiences, and cultural
          productions.
        </p>
      </section>

      {/* Filter Tabs */}
      <section
        className="subpage-content"
        style={{ paddingBottom: "1rem" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "999px",
                border: "1px solid",
                borderColor:
                  activeFilter === cat
                    ? "rgba(232,230,227,0.6)"
                    : "rgba(232,230,227,0.12)",
                background:
                  activeFilter === cat
                    ? "rgba(232,230,227,0.08)"
                    : "transparent",
                color:
                  activeFilter === cat
                    ? "#e8e6e3"
                    : "#888",
                fontSize: "0.75rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== cat) {
                  e.currentTarget.style.borderColor =
                    "rgba(232,230,227,0.3)";
                  e.currentTarget.style.color = "#b8b5b0";
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== cat) {
                  e.currentTarget.style.borderColor =
                    "rgba(232,230,227,0.12)";
                  e.currentTarget.style.color = "#888";
                }
              }}
            >
              {cat}
            </button>
          ))}

          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.7rem",
              color: "#666",
              letterSpacing: "0.04em",
            }}
          >
            {filteredWorks.length} project
            {filteredWorks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* Projects Grid */}
      <section
        className="subpage-content"
        style={{ paddingTop: 0 }}
      >
        <div
          className="projects-grid full"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filteredWorks.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
            />
          ))}
        </div>

        {filteredWorks.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "#666",
              fontSize: "0.9rem",
            }}
          >
            No projects in this category yet.
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}