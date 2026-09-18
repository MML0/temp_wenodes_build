import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleSceneLazy";
import MemberCard from "../components/MemberCard";
import { team } from "../data/team";

export const metadata = {
  title: "Team — WENODES",
  description: "The people behind WENODES."
};

export default function TeamPage() {
  return (
    <main className="subpage wn-team-page">

      {/* BACKGROUND */}

      <div
        className="scene"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <ParticleScene />
      </div>

      <div className="grain" />

      <div className="wn-grid-overlay" />

      <Navigation />

      {/* HERO */}

      <section className="wn-team-hero">

        <div className="wn-team-system">

          <div className="wn-system-left">
            <span className="wn-system-dot" />
            <span>WENODES / HUMAN SYSTEM</span>
          </div>

          <span>
            {String(team.length).padStart(2, "0")} MEMBERS
          </span>

        </div>

        <div className="wn-team-eyebrow">
          <span>03</span>
          <span>/</span>
          <span>TEAM</span>
          <span>/</span>
          <span>STUDIO NETWORK</span>
        </div>

        <h1 className="wn-team-title">
          THE
          <br />
          <span>CREW</span>
          <span className="wn-title-dot">.</span>
        </h1>

        <div className="wn-team-intro">

          <p>
            A small system of humans, machines,
            ideas and questionable decisions.
          </p>

          <div className="wn-team-scroll">
            <span>SCROLL TO IDENTIFY</span>
            <span className="wn-scroll-line" />
            <span>↓</span>
          </div>

        </div>

      </section>

      {/* TEAM INDEX */}

      <section className="subpage-content wn-team-index">

        <div className="wn-section-label">
          <span>01 — PERSONNEL DATABASE</span>

          <span>
            {team.length} ENTITIES
          </span>
        </div>

        <div className="wn-team-list">

          {team.map((member, index) => (

            <MemberCard
              key={member.id}
              member={member}
              index={index}
            />

          ))}

        </div>

      </section>

      {/* FOOTER */}

      <Footer />

      <style>{`

        /* ═══════════════════════════════════════
           TEAM PAGE
        ═══════════════════════════════════════ */

        .wn-team-page {
          --wn-white: #e8e6e3;
          --wn-muted: #888;
          --wn-dim: #555;
          --wn-border: rgba(232,230,227,0.12);
          --wn-border-strong: rgba(232,230,227,0.22);
        }

        .wn-grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: .035;

          background-image:
            linear-gradient(
              rgba(255,255,255,.5) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.5) 1px,
              transparent 1px
            );

          background-size: 80px 80px;
        }

        /* HERO */

        .wn-team-hero {
          position: relative;
          min-height: 78vh;

          padding:
            clamp(8rem, 15vw, 12rem)
            clamp(1.2rem, 5vw, 5rem)
            6rem;

          display: flex;
          flex-direction: column;
          justify-content: center;

          overflow: hidden;
        }

        .wn-team-system {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 4rem;

          font-family: var(--font-pixel, monospace);
          font-size: .62rem;
          letter-spacing: .12em;
          color: #666;
        }

        .wn-system-left {
          display: flex;
          align-items: center;
          gap: .6rem;
        }

        .wn-system-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;

          background: #e8e6e3;

          box-shadow:
            0 0 12px rgba(232,230,227,.7);

          animation:
            wnTeamPulse
            1.8s
            ease-in-out
            infinite;
        }

        @keyframes wnTeamPulse {

          0%,100% {
            opacity: .35;
            transform: scale(.7);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }

        }

        .wn-team-eyebrow {
          display: flex;
          gap: .6rem;

          margin-bottom: 1.5rem;

          font-family: var(--font-pixel, monospace);
          font-size: .68rem;

          letter-spacing: .12em;

          color: #777;
        }

        .wn-team-eyebrow span:nth-child(even) {
          color: #333;
        }

        .wn-team-title {
          margin: 0;

          font-family: var(--font-whyte, sans-serif);

          font-size:
            clamp(5rem, 17vw, 14rem);

          font-weight: 400;

          line-height: .75;

          letter-spacing: -.075em;

          text-transform: uppercase;
        }

        .wn-team-title span:first-of-type {
          display: inline-block;
        }

        .wn-title-dot {
          display: inline-block;
          margin-left: .04em;

          animation:
            wnDotBlink
            2s
            ease-in-out
            infinite;
        }

        @keyframes wnDotBlink {

          0%,100% {
            opacity: .25;
          }

          50% {
            opacity: 1;
          }

        }

        .wn-team-intro {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;

          margin-top: 4rem;

          max-width: 1000px;
        }

        .wn-team-intro p {
          max-width: 500px;

          margin: 0;

          font-family: var(--font-whyte, sans-serif);

          font-size:
            clamp(1rem, 1.5vw, 1.3rem);

          line-height: 1.5;

          color: #999;
        }

        .wn-team-scroll {
          display: flex;
          align-items: center;
          gap: .8rem;

          font-family: var(--font-pixel, monospace);

          font-size: .56rem;

          letter-spacing: .1em;

          color: #555;
        }

        .wn-scroll-line {
          width: 60px;
          height: 1px;

          background: #444;

          position: relative;
          overflow: hidden;
        }

        .wn-scroll-line::after {
          content: "";

          position: absolute;
          inset: 0;

          background: #e8e6e3;

          transform: translateX(-100%);

          animation:
            wnTeamScan
            2s
            ease-in-out
            infinite;
        }

        @keyframes wnTeamScan {

          0% {
            transform: translateX(-100%);
          }

          50%,100% {
            transform: translateX(100%);
          }

        }

        /* INDEX */

        .wn-team-index {
          position: relative;
        }

        .wn-section-label {
          display: flex;
          justify-content: space-between;

          padding: 1rem 0;

          margin-bottom: 2rem;

          border-top: 1px solid var(--wn-border);

          font-family: var(--font-pixel, monospace);

          font-size: .58rem;

          letter-spacing: .1em;

          color: #666;
        }

        .wn-team-list {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 1px;

          background: var(--wn-border);

          border: 1px solid var(--wn-border);
        }

        @media (max-width: 800px) {

          .wn-team-list {
            grid-template-columns: 1fr;
          }

          .wn-team-intro {
            flex-direction: column;
            align-items: flex-start;
            gap: 2rem;
          }

          .wn-team-scroll {
            margin-top: 1rem;
          }

        }

      `}</style>

    </main>
  );
}