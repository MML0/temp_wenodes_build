"use client";

import { useEffect, useRef, useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleScene";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Creative Direction",
    short: "Ideas → systems → experiences",
    description:
      "Creative direction, art direction, concept development, experience design, and narrative development from the first idea through final execution.",
    tags: [
      "Creative Direction",
      "Art Direction",
      "Concept Development",
      "Experience Design",
      "Narrative",
    ],
  },
  {
    number: "02",
    title: "Interactive Technology",
    short: "Systems that respond",
    description:
      "Interactive installations, projection mapping, sensor systems, embedded technology, AI-integrated experiences, and realtime media systems.",
    tags: [
      "Interactive",
      "Projection Mapping",
      "Sensors",
      "IoT",
      "AI",
      "Realtime",
    ],
  },
  {
    number: "03",
    title: "Visual & Motion",
    short: "Images that behave",
    description:
      "Generative visuals, realtime content, motion design, 3D and CG imagery, and AI-driven content systems.",
    tags: [
      "Generative",
      "Realtime",
      "Motion",
      "3D / CG",
      "AI",
    ],
  },
  {
    number: "04",
    title: "Spatial Design",
    short: "The room becomes the medium",
    description:
      "Immersive environments, exhibition design, stage and scenic design, interactive environments, and spatial storytelling.",
    tags: [
      "Immersive",
      "Exhibition",
      "Stage",
      "Spatial",
      "Storytelling",
    ],
  },
  {
    number: "05",
    title: "Live Experiences",
    short: "Built for the moment",
    description:
      "Audiovisual performances, immersive activations, interactive exhibitions, festivals, and live productions.",
    tags: [
      "A/V",
      "Performance",
      "Festival",
      "Production",
      "Live",
    ],
  },
  {
    number: "06",
    title: "Digital Platforms",
    short: "Experiences beyond the room",
    description:
      "Websites, interactive web experiences, digital archives, and online platforms that extend the experience into the digital space.",
    tags: [
      "Web",
      "Interactive",
      "Platforms",
      "Archives",
    ],
  },
];

const principles = [
  {
    number: "01",
    title: "Interdisciplinary by Nature",
    text:
      "Creatives, designers, technologists, and strategists work together from early ideation through final execution.",
  },
  {
    number: "02",
    title: "Concept-Driven",
    text:
      "We establish the concept and narrative before production. Technology is treated as a creative medium, not simply a tool.",
  },
  {
    number: "03",
    title: "Idea → Execution",
    text:
      "Creative development, technical implementation, fabrication, and production exist inside one integrated workflow.",
  },
  {
    number: "04",
    title: "Hybrid Thinking",
    text:
      "Commercial, cultural, and experimental projects inform each other, allowing ideas to move between disciplines.",
  },
  {
    number: "05",
    title: "Experience-Focused",
    text:
      "We don't produce isolated outputs. We design experiences that engage people emotionally, spatially, and interactively.",
  },
];

const projects = [
  {
    year: "2026",
    title: "Continuum",
    description:
      "Projection mapping, laser scenography, intelligent lighting, sound, and movement formed one continuously evolving environment.",
  },
  {
    year: "2025",
    title: "Constructed",
    description:
      "A 2,000 m² industrial exhibition bringing together more than 20 international artists.",
  },
  {
    year: "2024–25",
    title: "A/V Experience",
    description:
      "Four editions, fourteen performances, and more than 10,000 attendees across an original audiovisual series.",
  },
];

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`about-reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function MagneticWord({ children }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) * 14;

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) * 14;

    element.style.transform =
      `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transform =
        "translate3d(0,0,0)";
    }
  };

  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="about-magnetic-word"
    >
      {children}
    </span>
  );
}

export default function AboutPage() {
  const [activeCapability, setActiveCapability] = useState(0);
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouse({
        x:
          (event.clientX / window.innerWidth - 0.5) *
          2,
        y:
          (event.clientY / window.innerHeight - 0.5) *
          2,
      });
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
  }, []);

  return (
    <main className="subpage about-page">

      <style>{`

        .about-page {
          overflow: hidden;
        }

        /* ---------------- HERO ---------------- */

        .about-hero {
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          padding: 9rem 5vw 5rem;
        }

        .about-hero-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          font-size: .7rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(232,230,227,.45);
        }

        .about-hero h1 {
          margin: 0;
          font-size: clamp(4.5rem, 13vw, 13rem);
          line-height: .78;
          letter-spacing: -.065em;
          font-weight: 400;
          position: relative;
          z-index: 2;
        }

        .about-hero h1 .line {
          display: block;
          overflow: hidden;
        }

        .about-hero h1 .line-inner {
          display: inline-block;
          animation: aboutHeroIn 1.2s
            cubic-bezier(.22,1,.36,1)
            both;
        }

        .about-hero h1 .line:nth-child(2) .line-inner {
          animation-delay: .12s;
        }

        .about-hero h1 .line:nth-child(3) .line-inner {
          animation-delay: .24s;
        }

        .about-hero h1 em {
          font-style: normal;
          opacity: .35;
        }

        .about-magnetic-word {
          display: inline-block;
          transition:
            transform .5s cubic-bezier(.22,1,.36,1);
        }

        .about-hero-orbit {
          position: absolute;
          right: 8%;
          top: 25%;
          width: clamp(150px, 20vw, 300px);
          aspect-ratio: 1;
          border: 1px solid rgba(232,230,227,.12);
          border-radius: 50%;
          transform:
            translate3d(
              ${mouse.x * 20}px,
              ${mouse.y * 20}px,
              0
            );
          transition: transform .2s ease-out;
        }

        .about-hero-orbit::before,
        .about-hero-orbit::after {
          content: "";
          position: absolute;
          inset: 15%;
          border: 1px solid rgba(232,230,227,.08);
          border-radius: 50%;
        }

        .about-hero-orbit::after {
          inset: 35%;
        }

        .about-orbit-dot {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e8e6e3;
          left: 50%;
          top: -4px;
          transform-origin: 0 calc(
            clamp(150px, 20vw, 300px) / 2
          );
          animation: orbit 9s linear infinite;
        }

        .about-hero-bottom {
          margin-top: 5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 850px;
        }

        .about-hero-bottom p {
          color: #888;
          line-height: 1.7;
          max-width: 480px;
        }

        .about-scroll-indicator {
          align-self: end;
          font-size: .65rem;
          letter-spacing: .14em;
          color: #666;
          text-transform: uppercase;
        }

        /* ---------------- INTRO ---------------- */

        .about-intro {
          padding: 10rem 5vw;
          border-top: 1px solid rgba(232,230,227,.08);
          border-bottom: 1px solid rgba(232,230,227,.08);
        }

        .about-intro-grid {
          display: grid;
          grid-template-columns: .35fr 1fr;
          gap: 5rem;
        }

        .about-label {
          font-size: .65rem;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #666;
        }

        .about-intro h2 {
          margin: 0;
          font-size: clamp(2.2rem, 5vw, 5rem);
          line-height: 1;
          font-weight: 400;
          letter-spacing: -.04em;
        }

        .about-intro h2 i {
          font-style: normal;
          opacity: .4;
        }

        .about-intro p {
          margin-top: 3rem;
          max-width: 700px;
          color: #888;
          font-size: 1rem;
          line-height: 1.8;
        }

        /* ---------------- DISCIPLINES ---------------- */

        .about-marquee {
          overflow: hidden;
          border-bottom: 1px solid rgba(232,230,227,.08);
          padding: 1.5rem 0;
          white-space: nowrap;
        }

        .about-marquee-track {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }

        .about-marquee span {
          font-size: clamp(2rem, 4vw, 4rem);
          letter-spacing: -.03em;
          margin-right: 3rem;
          color: rgba(232,230,227,.18);
        }

        .about-marquee span::after {
          content: " × ";
          margin-left: 3rem;
          color: rgba(232,230,227,.08);
        }

        /* ---------------- CAPABILITIES ---------------- */

        .about-section {
          padding: 9rem 5vw;
        }

        .about-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 5rem;
        }

        .about-section-header h2 {
          font-size: clamp(3rem, 7vw, 7rem);
          line-height: .85;
          letter-spacing: -.06em;
          font-weight: 400;
          margin: 0;
        }

        .about-section-header p {
          max-width: 300px;
          color: #666;
          font-size: .8rem;
          line-height: 1.6;
        }

        .capabilities-layout {
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          border-top: 1px solid rgba(232,230,227,.1);
        }

        .capability-list {
          border-right: 1px solid rgba(232,230,227,.1);
        }

        .capability-item {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(232,230,227,.08);
          cursor: pointer;
          display: grid;
          grid-template-columns: 45px 1fr;
          transition:
            background .35s ease,
            padding-left .35s ease;
        }

        .capability-item:hover,
        .capability-item.active {
          background: rgba(232,230,227,.035);
          padding-left: 1.5rem;
        }

        .capability-number {
          font-size: .6rem;
          color: #555;
        }

        .capability-title {
          font-size: clamp(1rem, 2vw, 1.5rem);
        }

        .capability-short {
          font-size: .65rem;
          color: #666;
          margin-top: .35rem;
        }

        .capability-detail {
          padding: 4rem;
          min-height: 430px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .capability-detail-number {
          font-size: 5rem;
          line-height: 1;
          color: rgba(232,230,227,.08);
        }

        .capability-detail h3 {
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 400;
          margin: 0 0 1rem;
          letter-spacing: -.04em;
        }

        .capability-detail p {
          color: #888;
          max-width: 600px;
          line-height: 1.7;
        }

        .capability-tags {
          display: flex;
          flex-wrap: wrap;
          gap: .4rem;
          margin-top: 2rem;
        }

        .capability-tag {
          padding: .45rem .7rem;
          border: 1px solid rgba(232,230,227,.1);
          font-size: .6rem;
          color: #777;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        /* ---------------- PRINCIPLES ---------------- */

        .principles {
          padding: 9rem 5vw;
          background: rgba(232,230,227,.025);
        }

        .principles-grid {
          display: grid;
          grid-template-columns: .7fr 1.3fr;
          margin-top: 5rem;
        }

        .principle-tabs {
          border-top: 1px solid rgba(232,230,227,.1);
        }

        .principle-tab {
          border-bottom: 1px solid rgba(232,230,227,.1);
          padding: 1.5rem 0;
          cursor: pointer;
          transition: padding-left .35s ease;
        }

        .principle-tab:hover,
        .principle-tab.active {
          padding-left: 1rem;
        }

        .principle-tab small {
          color: #555;
          margin-right: 1rem;
        }

        .principle-display {
          padding: 0 5rem;
        }

        .principle-display-number {
          font-size: clamp(5rem, 15vw, 13rem);
          line-height: .7;
          color: rgba(232,230,227,.05);
        }

        .principle-display h3 {
          margin: 2rem 0 1rem;
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 400;
        }

        .principle-display p {
          max-width: 600px;
          color: #888;
          line-height: 1.8;
        }

        /* ---------------- NUMBERS ---------------- */

        .about-numbers {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(232,230,227,.08);
          border-bottom: 1px solid rgba(232,230,227,.08);
        }

        .about-number {
          padding: 4rem 2rem;
          border-right: 1px solid rgba(232,230,227,.08);
        }

        .about-number:last-child {
          border-right: 0;
        }

        .about-number strong {
          display: block;
          font-size: clamp(2.5rem, 5vw, 5rem);
          font-weight: 400;
          letter-spacing: -.05em;
        }

        .about-number span {
          display: block;
          margin-top: .7rem;
          color: #666;
          font-size: .65rem;
          text-transform: uppercase;
          letter-spacing: .1em;
        }

        /* ---------------- SELECTED ---------------- */

        .about-project {
          display: grid;
          grid-template-columns: 100px 1fr 1fr;
          gap: 2rem;
          padding: 2rem 0;
          border-top: 1px solid rgba(232,230,227,.08);
          transition: padding-left .4s ease;
        }

        .about-project:hover {
          padding-left: 1.5rem;
        }

        .about-project-year {
          color: #555;
          font-size: .7rem;
        }

        .about-project-title {
          font-size: clamp(1.3rem, 2vw, 2rem);
        }

        .about-project-description {
          color: #777;
          font-size: .8rem;
          line-height: 1.6;
          max-width: 500px;
        }

        /* ---------------- REVEAL ---------------- */

        .about-reveal {
          opacity: 0;
          transform: translateY(45px);
          transition:
            opacity .9s ease,
            transform 1s cubic-bezier(.22,1,.36,1);
        }

        .about-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes aboutHeroIn {
          from {
            transform: translateY(110%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 800px) {

          .about-hero {
            min-height: 80vh;
          }

          .about-hero-orbit {
            opacity: .4;
          }

          .about-hero-bottom,
          .about-intro-grid,
          .capabilities-layout,
          .principles-grid {
            grid-template-columns: 1fr;
          }

          .capability-list {
            border-right: 0;
          }

          .capability-detail {
            padding: 3rem 1rem;
          }

          .principle-display {
            padding: 4rem 0 0;
          }

          .about-numbers {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-number:nth-child(2) {
            border-right: 0;
          }

          .about-project {
            grid-template-columns: 70px 1fr;
          }

          .about-project-description {
            grid-column: 2;
          }

          .about-section-header {
            display: block;
          }

          .about-section-header p {
            margin-top: 2rem;
          }
        }

      `}</style>

      <div
        className="scene"
        aria-hidden="true"
        style={{ opacity: 0.6 }}
      >
        <ParticleScene />
      </div>

      <div
        className="grain"
        aria-hidden="true"
      />

      <Navigation />

      {/* HERO */}

      <section className="about-hero">

        <div className="about-hero-meta">
          <span>01 — ABOUT</span>
          <span>ART × DESIGN × TECHNOLOGY</span>
        </div>

        <h1>
          <span className="line">
            <span className="line-inner">
              WE
            </span>
          </span>

          <span className="line">
            <span className="line-inner">
              MAKE <em>IDEAS</em>
            </span>
          </span>

          <span className="line">
            <span className="line-inner">
              <MagneticWord>
                MOVE.
              </MagneticWord>
            </span>
          </span>
        </h1>

        <div className="about-hero-orbit">
          <div className="about-orbit-dot" />
        </div>

        <div className="about-hero-bottom">

          <p>
            WeNodes is a creative experience design
            studio operating between art, design,
            new media and emerging technologies.
          </p>

          <span className="about-scroll-indicator">
            SCROLL TO EXPLORE ↓
          </span>

        </div>

      </section>

      {/* INTRO */}

      <Reveal>
        <section className="about-intro">

          <div className="about-intro-grid">

            <span className="about-label">
              01 — WHO WE ARE
            </span>

            <div>

              <h2>
                We build{" "}
                <i>experiences</i>{" "}
                that behave like living systems.
              </h2>

              <p>
                Our practice spans commercial
                commissions, cultural productions,
                original products, installations,
                performances and digital experiences.
              </p>

              <p>
                We bring artists, designers,
                technologists and strategists
                together to develop meaningful
                experiences rather than isolated
                outputs.
              </p>

            </div>

          </div>

        </section>
      </Reveal>

      {/* MOVING DISCIPLINES */}

      <div className="about-marquee">

        <div className="about-marquee-track">

          {[
            "ART",
            "DESIGN",
            "MEDIA",
            "EMERGING TECHNOLOGIES",
            "INTERACTION",
            "SPACE",
            "SOUND",
            "CODE",
            "LIGHT",
            "PERFORMANCE",
          ].map((item, index) => (
            <span key={index}>
              {item}
            </span>
          ))}

          {[
            "ART",
            "DESIGN",
            "MEDIA",
            "EMERGING TECHNOLOGIES",
            "INTERACTION",
            "SPACE",
            "SOUND",
            "CODE",
            "LIGHT",
            "PERFORMANCE",
          ].map((item, index) => (
            <span key={`copy-${index}`}>
              {item}
            </span>
          ))}

        </div>

      </div>

      {/* CAPABILITIES */}

      <Reveal>
        <section className="about-section">

          <div className="about-section-header">

            <h2>
              WHAT<br />
              WE DO.
            </h2>

            <p>
              From the first conceptual sketch
              to the final pixel, physical system,
              performance or platform.
            </p>

          </div>

          <div className="capabilities-layout">

            <div className="capability-list">

              {capabilities.map(
                (capability, index) => (

                  <div
                    key={capability.number}
                    className={`capability-item ${
                      activeCapability === index
                        ? "active"
                        : ""
                    }`}
                    onMouseEnter={() =>
                      setActiveCapability(index)
                    }
                    onClick={() =>
                      setActiveCapability(index)
                    }
                  >

                    <span className="capability-number">
                      {capability.number}
                    </span>

                    <div>

                      <div className="capability-title">
                        {capability.title}
                      </div>

                      <div className="capability-short">
                        {capability.short}
                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

            <div className="capability-detail">

              <div>

                <div className="capability-detail-number">
                  {capabilities[
                    activeCapability
                  ].number}
                </div>

                <h3>
                  {capabilities[
                    activeCapability
                  ].title}
                </h3>

                <p>
                  {capabilities[
                    activeCapability
                  ].description}
                </p>

              </div>

              <div className="capability-tags">

                {capabilities[
                  activeCapability
                ].tags.map((tag) => (
                  <span
                    key={tag}
                    className="capability-tag"
                  >
                    {tag}
                  </span>
                ))}

              </div>

            </div>

          </div>

        </section>
      </Reveal>

      {/* NUMBERS */}

      <Reveal>
        <section className="about-numbers">

          <div className="about-number">
            <strong>20+</strong>
            <span>International artists</span>
          </div>

          <div className="about-number">
            <strong>14</strong>
            <span>A/V performances</span>
          </div>

          <div className="about-number">
            <strong>10K+</strong>
            <span>Audience members</span>
          </div>

          <div className="about-number">
            <strong>2,000m²</strong>
            <span>Exhibition scale</span>
          </div>

        </section>
      </Reveal>

      {/* PRINCIPLES */}

      <Reveal>
        <section className="principles">

          <div className="about-section-header">

            <h2>
              WHY<br />
              WENODES.
            </h2>

            <p>
              The principles behind how
              we approach every project.
            </p>

          </div>

          <div className="principles-grid">

            <div className="principle-tabs">

              {principles.map(
                (principle, index) => (

                  <div
                    key={principle.number}
                    className={`principle-tab ${
                      activePrinciple === index
                        ? "active"
                        : ""
                    }`}
                    onMouseEnter={() =>
                      setActivePrinciple(index)
                    }
                    onClick={() =>
                      setActivePrinciple(index)
                    }
                  >

                    <small>
                      {principle.number}
                    </small>

                    {principle.title}

                  </div>

                )
              )}

            </div>

            <div className="principle-display">

              <div className="principle-display-number">
                {
                  principles[
                    activePrinciple
                  ].number
                }
              </div>

              <h3>
                {
                  principles[
                    activePrinciple
                  ].title
                }
              </h3>

              <p>
                {
                  principles[
                    activePrinciple
                  ].text
                }
              </p>

            </div>

          </div>

        </section>
      </Reveal>

      {/* SELECTED EXPERIENCE */}

      <Reveal>
        <section className="about-section">

          <div className="about-section-header">

            <h2>
              SELECTED<br />
              EXPERIENCES.
            </h2>

            <p>
              A few projects that represent
              the range of our practice.
            </p>

          </div>

          <div>

            {projects.map((project) => (

              <div
                key={project.title}
                className="about-project"
              >

                <span className="about-project-year">
                  {project.year}
                </span>

                <div className="about-project-title">
                  {project.title}
                </div>

                <p className="about-project-description">
                  {project.description}
                </p>

              </div>

            ))}

          </div>

          <div
            style={{
              marginTop: "3rem",
            }}
          >

            <Link
              href="/work"
              className="btn-outline"
            >
              EXPLORE ALL WORK →
            </Link>

          </div>

        </section>
      </Reveal>

      {/* FINAL STATEMENT */}

      <Reveal>

        <section
          className="manifesto join-section"
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >

          <span>
            06 — THE NEXT NODE
          </span>

          <h2>
            The next idea
            <br />
            <i>could be yours.</i>
          </h2>

          <div className="manifesto-cta">

            <Link
              href="/join"
              className="btn btn-large"
            >
              START A PROJECT ↗
            </Link>

          </div>

        </section>

      </Reveal>

      <Footer />

    </main>
  );
}