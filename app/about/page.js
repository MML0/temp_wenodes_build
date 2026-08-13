"use client";

import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleScene";
import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "REAL-TIME 3D",
    description:
      "Realtime environments, WebGL systems, projection pipelines and spatial interfaces.",
  },
  {
    number: "02",
    title: "GENERATIVE SYSTEMS",
    description:
      "Visual systems that generate, react, transform and evolve instead of simply playing back.",
  },
  {
    number: "03",
    title: "INTERACTIVE INSTALLATIONS",
    description:
      "Physical and digital environments connecting people, sensors, light, image, sound and space.",
  },
  {
    number: "04",
    title: "CREATIVE TECHNOLOGY",
    description:
      "Technology used as a creative material rather than something hidden behind the experience.",
  },
  {
    number: "05",
    title: "SPATIAL AUDIO",
    description:
      "Sound designed as part of the physical architecture of an experience.",
  },
  {
    number: "06",
    title: "AI / MACHINE LEARNING",
    description:
      "Experimental systems exploring machine intelligence, perception and generative media.",
  },
];

const process = [
  {
    number: "01",
    title: "QUESTION",
    text: "Start with an idea, a problem, a strange observation or something that simply should exist.",
  },
  {
    number: "02",
    title: "BREAK",
    text: "Challenge assumptions. Prototype quickly. Find the interesting failure before committing to a solution.",
  },
  {
    number: "03",
    title: "BUILD",
    text: "Turn the experiment into a working system through code, hardware, visuals, sound and interaction.",
  },
  {
    number: "04",
    title: "REFINE",
    text: "Remove everything unnecessary until the experience feels inevitable.",
  },
];

export default function AboutPage() {
  const [activeCapability, setActiveCapability] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
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

  return (
    <main className="subpage about-page">
      {/* BACKGROUND */}
      <div
        className="scene"
        aria-hidden="true"
        style={{
          opacity: 0.32,
          transform: `translate(${mouse.x * -8}px, ${mouse.y * -8}px)`,
          transition: "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <ParticleScene />
      </div>

      <div className="grain" />

      <Navigation />

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-top">
          <span className="eyebrow pixel-text">
            01 — ABOUT / WENODES
          </span>

          <span className="system-label">
            CREATIVE TECHNOLOGY / DIGITAL SYSTEMS
          </span>
        </div>

        <h1 className="about-title">
          WE ARE
          <br />
          <span>WENODES.</span>
        </h1>

        <div className="about-hero-bottom">
          <p>
            A collective exploring the space
            <br />
            between technology, art and interaction.
          </p>

          <div className="scroll-indicator">
            <span />
            SCROLL TO EXPLORE
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="about-intro">
        <div className="about-section-number pixel-text">
          00 / WHAT WE DO
        </div>

        <div className="about-intro-content">
          <h2>
            We build <i>experiences</i>
            <br />
            that behave like
            <br />
            <strong>living systems.</strong>
          </h2>

          <p>
            WENODES operates between technology, art and interaction.
            We design experiences that respond to their environment,
            their audience and the systems around them.
          </p>

          <p>
            From immersive audiovisual environments to interactive
            installations and experimental digital systems, we treat
            technology as a creative material.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="about-philosophy">
        <div className="about-section-number pixel-text">
          01 / PHILOSOPHY
        </div>

        <div className="philosophy-statement">
          <span className="philosophy-line">TECHNOLOGY</span>
          <span className="philosophy-line dim">SHOULD FEEL</span>
          <span className="philosophy-line">ALIVE.</span>
        </div>

        <div className="philosophy-detail">
          <p>
            We are interested in systems that breathe, respond and
            evolve. Not interfaces that simply wait for commands,
            but environments capable of becoming part of the
            experience themselves.
          </p>

          <div className="signal">
            <span className="signal-dot" />
            <span>LIVE SYSTEM</span>
            <span className="signal-value">01.0001</span>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="about-process">
        <div className="about-section-number pixel-text">
          02 / PROCESS
        </div>

        <div className="process-header">
          <h2>
            FROM CHAOS
            <br />
            TO <i>EXPERIENCE.</i>
          </h2>

          <p>
            No fixed formula. Every project develops its own
            language through experimentation.
          </p>
        </div>

        <div className="process-grid">
          {process.map((item, index) => (
            <div
              className="process-item"
              key={item.number}
              onMouseEnter={() => setActiveCapability(index)}
            >
              <div className="process-number">
                {item.number}
              </div>

              <div className="process-line" />

              <h3>{item.title}</h3>

              <p>{item.text}</p>

              <span className="process-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="about-capabilities">
        <div className="about-section-number pixel-text">
          03 / CAPABILITIES
        </div>

        <div className="capabilities-layout">
          <div className="capabilities-list-large">
            {capabilities.map((item, index) => (
              <button
                key={item.number}
                className={`capability-item ${
                  activeCapability === index
                    ? "active"
                    : ""
                }`}
                onMouseEnter={() =>
                  setActiveCapability(index)
                }
                onFocus={() =>
                  setActiveCapability(index)
                }
              >
                <span>{item.number}</span>
                <strong>{item.title}</strong>
                <em>↗</em>
              </button>
            ))}
          </div>

          <div className="capability-display">
            <div className="capability-orbit">
              <div className="orbit-ring ring-one" />
              <div className="orbit-ring ring-two" />
              <div className="orbit-ring ring-three" />

              <div className="orbit-core">
                <span>
                  {capabilities[activeCapability].number}
                </span>
              </div>
            </div>

            <div className="capability-description">
              <span className="pixel-text">
                SYSTEM / CAPABILITY
              </span>

              <h3>
                {capabilities[activeCapability].title}
              </h3>

              <p>
                {capabilities[activeCapability].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="about-manifesto">
        <div className="manifesto-grid">
          <span className="pixel-text">
            04 / MANIFESTO
          </span>

          <div>
            <p className="manifesto-big">
              MAKE
              <br />
              THE
              <br />
              <i>INVISIBLE</i>
              <br />
              VISIBLE.
            </p>

            <p className="manifesto-small">
              Every project is an experiment in perception,
              interaction and possibility.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="about-contact">
        <span className="eyebrow pixel-text">
          05 — CONNECT
        </span>

        <h2>
          HAVE AN
          <br />
          <i>IDEA?</i>
        </h2>

        <p>
          Let's turn it into something that moves.
        </p>

        <Link
          href="/join"
          className="btn btn-large about-contact-button"
        >
          APPLY TO JOIN ↗
        </Link>

        <div className="contact-meta">
          <span>WENODES</span>
          <span>CREATIVE TECHNOLOGY / DIGITAL SYSTEMS</span>
        </div>
      </section>

      <Footer />
    </main>
  );
}