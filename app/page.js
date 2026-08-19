"use client";

import ParticleScene from "./components/ParticleScene";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ProjectCard from "./components/ProjectCard";
import MemberCard from "./components/MemberCard";
import { works } from "./data/works";
import { team } from "./data/team";
import Link from "next/link";

export default function Home() {
  const featuredWorks = works.slice(0, 3);
  const featuredTeam = team.slice(0, 2);

  return (
    <main>
      {/* PARTICLE BACKGROUND */}
      <div
        className="scene"
        aria-hidden="true"
        style={{ opacity: 0.6 }}
      >
        <ParticleScene />
      </div>

      {/* GRAIN */}
      <div
        className="grain"
        aria-hidden="true"
      />

      {/* FOREGROUND */}
      <Navigation />

      <section className="hero">
        <p className="eyebrow">
          CREATIVE TECHNOLOGY / DIGITAL SYSTEMS
        </p>

        <h1>
          WE
          <span>MAKE</span>
          <em>THINGS</em>
          <strong>MOVE.</strong>
        </h1>

        <div className="hero-bottom">
          <p>
            A collective exploring the space
            <br />
            between technology, art and interaction.
          </p>

          <span className="scroll">
            SCROLL TO EXPLORE ↓
          </span>
        </div>
      </section>

      <section
        className="manifesto"
        id="about"
      >
        <span>01 — ABOUT</span>

        <h2>
          We build <i>experiences</i>
          <br />
          that behave like living systems.
        </h2>

        <div className="manifesto-cta">
          <Link
            href="/about"
            className="btn"
          >
            READ MORE →
          </Link>
        </div>
      </section>

      <section
        className="manifesto"
        id="work"
      >
        <span>02 — SELECTED WORK</span>

        <div className="section-header">
          <h2>
            Projects that push boundaries.
          </h2>

          <Link
            href="/work"
            className="btn-outline"
          >
            VIEW ALL →
          </Link>
        </div>
<style>{`
    @keyframes cardEnter {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
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

      <section
        className="manifesto"
        id="team"
      >
        <span>03 — TEAM</span>

        <div className="section-header">
          <h2>
            People × ideas × technology.
          </h2>

          <Link
            href="/team"
            className="btn-outline"
          >
            MEET ALL →
          </Link>
        </div>

        <div className="team-grid">
          {featuredTeam.map(
            (member) => (
              <MemberCard
                key={member.id}
                member={member}
              />
            )
          )}
        </div>
      </section>

      <section className="manifesto join-section">
        <span>04 — JOIN</span>

        <h2>
          Want to <i>build</i> the future
          <br />
          with us?
        </h2>

        <div className="manifesto-cta">
          <Link
            href="/join"
            className="btn btn-large"
          >
            APPLY TO JOIN ↗
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}