//kimi
import Link from "next/link";
import Particle404 from "../components/Particle404";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata = {
  title: "Node Lost — WENODES",
  description: "The requested node could not be located in the system.",
};

export default function NotFoundPage() {
  return (
    <main className="wn-error-page">
      {/* Background Systems */}
      <div className="scene" aria-hidden="true" style={{ opacity: 0.6 }}>
        <Particle404 />
      </div>
      <div className="grain" aria-hidden="true" />
      <div className="wn-grid-overlay" />

      <Navigation />

      {/* Main Diagnostic Interface */}
      <section className="wn-error-hero">
        {/* System Header */}
        <div className="wn-error-system">
          <div className="wn-system-left">
            <span className="wn-system-dot wn-system-dot--alert" />
            <span>SYSTEM / DIAGNOSTIC MODE</span>
          </div>
          <span>ERR_404</span>
        </div>

        {/* Status Eyebrow */}
        <div className="wn-error-eyebrow">
          <span>CONNECTION FAILED</span>
          <span className="wn-eyebrow-divider">/</span>
          <span>NODE UNREACHABLE</span>
        </div>

        {/* Primary Message */}
        <h1 className="wn-error-title">
          <span className="wn-title-word" style={{ "--word-delay": "0ms" } as React.CSSProperties}>
            NODE
          </span>
          <span className="wn-title-word" style={{ "--word-delay": "120ms" } as React.CSSProperties}>
            LOST
          </span>
          <span className="wn-title-dot">.</span>
        </h1>

        {/* System Report */}
        <div className="wn-error-report">
          <div className="wn-report-line">
            <span className="wn-report-label">STATUS</span>
            <span className="wn-report-value">404 — NOT FOUND</span>
          </div>
          <div className="wn-report-line">
            <span className="wn-report-label">SECTOR</span>
            <span className="wn-report-value">UNKNOWN_COORDINATES</span>
          </div>
          <div className="wn-report-line">
            <span className="wn-report-label">TRACE</span>
            <span className="wn-report-value wn-report-value--blink">
              SEARCHING_NETWORK...
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="wn-error-description">
          The requested node could not be located within the WeNodes system.
          It may have been moved, renamed, or temporarily disconnected from the network.
        </p>

        {/* Action */}
        <div className="wn-error-action">
          <Link href="/" className="wn-system-button">
            <span className="wn-button-arrow">←</span>
            <span>RETURN TO SYSTEM</span>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="wn-scroll-indicator">
          <span>FIELD SCAN ACTIVE</span>
          <span className="wn-scroll-line" />
          <span>↓</span>
        </div>
      </section>

      {/* Technical Footer Strip */}
      <section className="wn-error-footer-strip">
        <div className="wn-strip-item">
          <span className="wn-strip-label">PARTICLES</span>
          <span className="wn-strip-value">18,000</span>
        </div>
        <div className="wn-strip-item">
          <span className="wn-strip-label">STATE</span>
          <span className="wn-strip-value">SCATTERED</span>
        </div>
        <div className="wn-strip-item">
          <span className="wn-strip-label">NETWORK</span>
          <span className="wn-strip-value wn-strip-value--offline">OFFLINE</span>
        </div>
        <div className="wn-strip-item">
          <span className="wn-strip-label">ID</span>
          <span className="wn-strip-value">0x4E4F4445</span>
        </div>
      </section>

      <Footer />

      <style>{`
        /* ═══════════════════════════════════════
           BASE & TOKENS
        ═══════════════════════════════════════ */
        .wn-error-page {
          --wn-white: #e8e6e3;
          --wn-muted: #888;
          --wn-dim: #555;
          --wn-border: rgba(232,230,227,0.12);
          --wn-border-strong: rgba(232,230,227,0.22);
          --wn-black: #090909;
          --wn-alert: #c45a5a;
        }

        .wn-grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.04;
          background-image:
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* ═══════════════════════════════════════
           HERO
        ═══════════════════════════════════════ */
        .wn-error-hero {
          position: relative;
          min-height: 85vh;
          padding: clamp(8rem, 15vw, 12rem) clamp(1.2rem, 5vw, 5rem) 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          z-index: 2;
        }

        .wn-error-system {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
          font-family: var(--font-pixel, monospace);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          color: #666;
        }

        .wn-system-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .wn-system-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #e8e6e3;
          box-shadow: 0 0 12px rgba(232,230,227,0.7);
          animation: wnLivePulse 1.8s ease-in-out infinite;
        }

        .wn-system-dot--alert {
          background: var(--wn-alert);
          box-shadow: 0 0 12px rgba(196,90,90,0.7);
          animation: wnAlertPulse 1.2s ease-in-out infinite;
        }

        @keyframes wnLivePulse {
          0%, 100% { opacity: .35; transform: scale(.7); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes wnAlertPulse {
          0%, 100% { opacity: .4; transform: scale(.7); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .wn-error-eyebrow {
          display: flex;
          align-items: center;
          gap: .6rem;
          margin-bottom: 1.5rem;
          font-family: var(--font-pixel, monospace);
          font-size: .68rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--wn-alert);
        }

        .wn-eyebrow-divider {
          color: #333;
        }

        .wn-error-title {
          display: flex;
          flex-wrap: wrap;
          gap: 0 .3em;
          max-width: 1200px;
          margin: 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(4.5rem, 14vw, 13rem);
          font-weight: 400;
          line-height: .82;
          letter-spacing: -.065em;
          text-transform: uppercase;
        }

        .wn-title-word {
          opacity: 0;
          transform: translateY(60px);
          animation: wnTitleIn 1s cubic-bezier(.22,1,.36,1) var(--word-delay, 0ms) forwards;
        }

        .wn-title-dot {
          opacity: 0;
          animation: wnTitleIn .8s cubic-bezier(.22,1,.36,1) 300ms forwards;
          color: var(--wn-alert);
        }

        @keyframes wnTitleIn {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ═══════════════════════════════════════
           SYSTEM REPORT
        ═══════════════════════════════════════ */
        .wn-error-report {
          margin-top: 3rem;
          padding: 1.5rem 0;
          border-top: 1px solid var(--wn-border);
          border-bottom: 1px solid var(--wn-border);
          max-width: 520px;
        }

        .wn-report-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          font-family: var(--font-pixel, monospace);
          font-size: 0.6rem;
          letter-spacing: 0.1em;
        }

        .wn-report-label {
          color: #444;
        }

        .wn-report-value {
          color: #aaa;
        }

        .wn-report-value--blink {
          color: var(--wn-alert);
          animation: wnBlink 1.5s steps(1) infinite;
        }

        @keyframes wnBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* ═══════════════════════════════════════
           DESCRIPTION
        ═══════════════════════════════════════ */
        .wn-error-description {
          max-width: 520px;
          margin: 2.5rem 0 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(0.95rem, 1.4vw, 1.15rem);
          line-height: 1.6;
          color: #777;
          opacity: 0;
          transform: translateY(20px);
          animation: wnFadeUp .8s cubic-bezier(.22,1,.36,1) .8s forwards;
        }

        @keyframes wnFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ═══════════════════════════════════════
           ACTION BUTTON
        ═══════════════════════════════════════ */
        .wn-error-action {
          margin-top: 3.5rem;
          opacity: 0;
          animation: wnFadeUp .8s cubic-bezier(.22,1,.36,1) 1.1s forwards;
        }

        .wn-system-button {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2rem;
          border: 1px solid var(--wn-border-strong);
          font-family: var(--font-pixel, monospace);
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          color: #aaa;
          transition: all 0.4s cubic-bezier(.22,1,.36,1);
        }

        .wn-system-button:hover {
          border-color: rgba(232,230,227,0.5);
          color: var(--wn-white);
          background: rgba(232,230,227,0.04);
          padding-left: 2.4rem;
          padding-right: 1.6rem;
        }

        .wn-button-arrow {
          transition: transform 0.4s cubic-bezier(.22,1,.36,1);
        }

        .wn-system-button:hover .wn-button-arrow {
          transform: translateX(-4px);
        }

        /* ═══════════════════════════════════════
           SCROLL INDICATOR
        ═══════════════════════════════════════ */
        .wn-scroll-indicator {
          display: flex;
          align-items: center;
          gap: .8rem;
          margin-top: 5rem;
          font-family: var(--font-pixel, monospace);
          font-size: .58rem;
          letter-spacing: .1em;
          color: #444;
        }

        .wn-scroll-line {
          width: 70px;
          height: 1px;
          background: #333;
          position: relative;
          overflow: hidden;
        }

        .wn-scroll-line::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--wn-alert);
          transform: translateX(-100%);
          animation: wnScan 2.5s ease-in-out infinite;
        }

        @keyframes wnScan {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }

        /* ═══════════════════════════════════════
           TECHNICAL FOOTER STRIP
        ═══════════════════════════════════════ */
        .wn-error-footer-strip {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--wn-border);
          border-bottom: 1px solid var(--wn-border);
          margin-top: auto;
        }

        .wn-strip-item {
          padding: 1.2rem 1.5rem;
          border-right: 1px solid var(--wn-border);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .wn-strip-item:last-child {
          border-right: 0;
        }

        .wn-strip-label {
          font-family: var(--font-pixel, monospace);
          font-size: 0.52rem;
          letter-spacing: 0.12em;
          color: #444;
        }

        .wn-strip-value {
          font-family: var(--font-whyte, sans-serif);
          font-size: 1.1rem;
          letter-spacing: -0.02em;
          color: #aaa;
        }

        .wn-strip-value--offline {
          color: var(--wn-alert);
        }

        /* ═══════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════ */
        @media (max-width: 800px) {
          .wn-error-hero {
            min-height: 75vh;
            padding-top: 7rem;
          }

          .wn-error-title {
            font-size: clamp(3.5rem, 16vw, 7rem);
          }

          .wn-error-footer-strip {
            grid-template-columns: 1fr 1fr;
          }

          .wn-strip-item:nth-child(2) {
            border-right: 0;
          }

          .wn-strip-item:nth-child(1),
          .wn-strip-item:nth-child(2) {
            border-bottom: 1px solid var(--wn-border);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wn-title-word,
          .wn-title-dot,
          .wn-error-description,
          .wn-error-action,
          .wn-system-dot,
          .wn-scroll-line::after,
          .wn-report-value--blink {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}