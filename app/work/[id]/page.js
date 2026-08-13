import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ParticleScene from "../../components/ParticleScene";
import ProjectGallery from "../../components/ProjectGallery";
import { works } from "../../data/works";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id.toString() }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  const work = works.find(
    (w) => w.id.toString() === id
  );

  return {
    title: work ? `${work.title} — WENODES` : "Work — WENODES",
    description:
      work?.description || "WeNodes creative project",
  };
}

/* ─────────────────────────────────────────────
   CONTENT BLOCK RENDERER
───────────────────────────────────────────── */

function ContentBlock({ block, index, workTitle }) {
  switch (block.type) {
    case "text":
      return (
        <div
          className="wn-project-content-block wn-reveal"
          key={index}
          style={{
            "--reveal-delay": `${index * 80}ms`,
          }}
        >
          <div className="wn-block-index">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="wn-block-content">
            {block.title && (
              <h3>{block.title}</h3>
            )}

            <p>{block.text}</p>
          </div>
        </div>
      );

    case "image":
      return (
        <div
          className="wn-project-content-block wn-reveal"
          key={index}
          style={{
            "--reveal-delay": `${index * 80}ms`,
          }}
        >
          <div className="wn-media-frame">
            <div className="wn-media-meta">
              <span>MEDIA / {String(index + 1).padStart(2, "0")}</span>
              <span>IMAGE</span>
            </div>

            <div className="project-detail-image wn-project-image">
              <img
                src={block.src}
                alt={block.alt || workTitle}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      );

    case "gallery":
      return (
        <div
          className="wn-project-content-block wn-reveal"
          key={index}
          style={{
            "--reveal-delay": `${index * 80}ms`,
          }}
        >
          <div className="wn-media-frame">
            <div className="wn-media-meta">
              <span>
                GALLERY / {String(index + 1).padStart(2, "0")}
              </span>

              <span>
                {block.images.length} FRAMES
              </span>
            </div>

            <div className="project-gallery-grid">
              {block.images.map((img, i) => (
                <div
                  className="wn-project-image wn-gallery-image"
                  key={i}
                >
                  <img
                    src={img}
                    alt={`${workTitle} gallery ${i + 1}`}
                    loading="lazy"
                  />

                  <span className="wn-image-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "quote":
      return (
        <div
          className="wn-project-content-block wn-reveal"
          key={index}
        >
          <blockquote className="wn-project-quote">
            <span className="wn-quote-mark">“</span>
            <span>{block.text}</span>
          </blockquote>
        </div>
      );

    case "video":
      return (
        <div
          className="wn-project-content-block wn-reveal"
          key={index}
        >
          <div className="wn-media-frame">
            <div className="wn-media-meta">
              <span>
                MEDIA / {String(index + 1).padStart(2, "0")}
              </span>

              <span>VIDEO</span>
            </div>

            <video
              controls
              poster={block.poster}
              className="wn-project-video"
            >
              <source
                src={block.src}
                type="video/mp4"
              />

              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      );

    case "html":
      return (
        <div
          className="wn-project-content-block wn-reveal wn-html-block"
          key={index}
          dangerouslySetInnerHTML={{
            __html: block.html,
          }}
        />
      );

    default:
      return null;
  }
}

/* ─────────────────────────────────────────────
   TAG
───────────────────────────────────────────── */

function TagPill({ label, index }) {
  return (
    <span
      className="wn-tag"
      style={{
        "--tag-delay": `${index * 70}ms`,
      }}
    >
      <span className="wn-tag-dot" />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   STAT
───────────────────────────────────────────── */

function StatBox({ label, value, index }) {
  return (
    <div
      className="wn-stat"
      style={{
        "--stat-delay": `${index * 100}ms`,
      }}
    >
      <div className="wn-stat-value">
        {value}
      </div>

      <div className="wn-stat-label">
        {label}
      </div>

      <div className="wn-stat-line" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   INFO ITEM
───────────────────────────────────────────── */

function InfoItem({ label, children }) {
  return (
    <div className="wn-info-item">
      <span className="wn-info-label">
        {label}
      </span>

      <span className="wn-info-value">
        {children}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default async function WorkDetailPage({
  params,
}) {
  const { id } = await params;

  const work = works.find(
    (w) => w.id.toString() === id
  );

  if (!work) return notFound();

  const hasGallery =
    Array.isArray(work.gallery) &&
    work.gallery.length > 0;

  const hasContent =
    Array.isArray(work.content) &&
    work.content.length > 0;

  const hasStats =
    Array.isArray(work.stats) &&
    work.stats.length > 0;

  const hasServices =
    Array.isArray(work.services) &&
    work.services.length > 0;

  const hasCollaborators =
    Array.isArray(work.collaborators) &&
    work.collaborators.length > 0;

  const hasTags =
    Array.isArray(work.tags) &&
    work.tags.length > 0;

  const hasStory =
    work.story &&
    (work.story.title ||
      work.story.intro);

  const currentIndex = works.findIndex(
    (w) => w.id === work.id
  );

  const previousWork =
    currentIndex > 0
      ? works[currentIndex - 1]
      : works[works.length - 1];

  const nextWork =
    currentIndex < works.length - 1
      ? works[currentIndex + 1]
      : works[0];

  return (
    <main className="subpage wn-project-page">

      {/* ─────────────────────────────────────
          BACKGROUND SYSTEM
      ───────────────────────────────────── */}

      <div
        className="scene"
        aria-hidden="true"
        style={{ opacity: 0.4 }}
      >
        <ParticleScene />
      </div>

      <div
        className="grain"
        aria-hidden="true"
      />

      <div className="wn-grid-overlay" />

      <Navigation />

      {/* ─────────────────────────────────────
          PROJECT HERO
      ───────────────────────────────────── */}

      <section className="wn-project-hero">

        <div className="wn-project-system">

          <div className="wn-system-left">
            <span className="wn-system-dot" />
            <span>WENODES / PROJECT SYSTEM</span>
          </div>

          <span>
            {String(work.id).padStart(2, "0")}
          </span>

        </div>

        <div className="wn-project-eyebrow">
          <span>
            {work.category}
          </span>

          <span className="wn-eyebrow-divider">
            /
          </span>

          <span>
            {work.year}
          </span>

          {work.month && (
            <>
              <span className="wn-eyebrow-divider">
                /
              </span>

              <span>{work.month}</span>
            </>
          )}
        </div>

        <h1 className="wn-project-title">
          {work.title.split(" ").map(
            (word, i) => (
              <span
                key={`${word}-${i}`}
                className="wn-title-word"
                style={{
                  "--word-delay": `${i * 90}ms`,
                }}
              >
                {word}
              </span>
            )
          )}
          <span className="wn-title-dot">.</span>
        </h1>

        {work.description && (
          <p className="wn-project-description">
            {work.description}
          </p>
        )}

        <div className="wn-scroll-indicator">
          <span>SCROLL TO EXPLORE</span>
          <span className="wn-scroll-line" />
          <span>↓</span>
        </div>

      </section>

      {/* ─────────────────────────────────────
          COVER
      ───────────────────────────────────── */}

      {work.coverImage && (
        <section
          className="subpage-content wn-cover-section"
          style={{ paddingTop: 0 }}
        >
          <div className="wn-cover-wrapper">

            <div className="wn-cover-corner wn-cover-corner-tl" />
            <div className="wn-cover-corner wn-cover-corner-tr" />
            <div className="wn-cover-corner wn-cover-corner-bl" />
            <div className="wn-cover-corner wn-cover-corner-br" />

            <div className="wn-cover-meta">
              <span>01 / COVER</span>
              <span>PROJECT {work.id}</span>
            </div>

            <div className="wn-cover-image">
              <img
                src={work.coverImage}
                alt={work.title}
              />

              <div className="wn-cover-scan" />
            </div>

            <div className="wn-cover-footer">
              <span>
                WENODES CREATIVE TECHNOLOGY
              </span>

              <span>
                {work.year}
              </span>
            </div>

          </div>
        </section>
      )}

      {/* ─────────────────────────────────────
          PROJECT INFORMATION
      ───────────────────────────────────── */}

      <section
        className="subpage-content wn-info-section"
        style={{ paddingTop: "2rem" }}
      >
        <div className="wn-section-label">
          <span>02 — PROJECT DATA</span>
          <span>LIVE RECORD</span>
        </div>

        <div className="wn-info-grid">

          {work.client && (
            <InfoItem label="Client">
              {work.client}
            </InfoItem>
          )}

          {work.location && (
            <InfoItem label="Location">
              {work.location}
            </InfoItem>
          )}

          {work.year && (
            <InfoItem label="Year">
              {work.year}
            </InfoItem>
          )}

          {hasServices && (
            <InfoItem label="Services">
              {work.services.join(" / ")}
            </InfoItem>
          )}

          {hasCollaborators && (
            <InfoItem label="Collaborators">
              {work.collaborators.join(" / ")}
            </InfoItem>
          )}

        </div>
      </section>

      {/* ─────────────────────────────────────
          TAGS
      ───────────────────────────────────── */}

      {hasTags && (
        <section
          className="subpage-content wn-tags-section"
          style={{ paddingTop: 0 }}
        >
          <div className="wn-section-label">
            <span>03 — SYSTEM TAGS</span>
            <span>
              {work.tags.length} PARAMETERS
            </span>
          </div>

          <div className="wn-tags">
            {work.tags.map((tag, i) => (
              <TagPill
                key={i}
                label={tag}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────
          STATS
      ───────────────────────────────────── */}

      {hasStats && (
        <section
          className="subpage-content wn-stats-section"
          style={{ paddingTop: 0 }}
        >
          <div className="wn-section-label">
            <span>04 — SYSTEM METRICS</span>
            <span>PERFORMANCE DATA</span>
          </div>

          <div className="wn-stats">
            {work.stats.map((stat, i) => (
              <StatBox
                key={i}
                label={stat.label}
                value={stat.value}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────
          STORY
      ───────────────────────────────────── */}

      {hasStory && (
        <section
          className="subpage-content wn-story-section"
          style={{ paddingTop: 0 }}
        >
          <div className="wn-section-label">
            <span>05 — CONTEXT</span>
            <span>PROJECT NARRATIVE</span>
          </div>

          <div className="wn-story">

            {work.story.title && (
              <h2>
                {work.story.title}
              </h2>
            )}

            {work.story.intro && (
              <p>
                {work.story.intro}
              </p>
            )}

          </div>
        </section>
      )}

      {/* ─────────────────────────────────────
          LONG DESCRIPTION
      ───────────────────────────────────── */}

      {work.longDescription && (
        <section
          className="subpage-content wn-description-section"
          style={{ paddingTop: 0 }}
        >
          <div className="wn-section-label">
            <span>06 — ABOUT THE PROJECT</span>
            <span>FIELD NOTES</span>
          </div>

          <div className="wn-long-description">

            <div className="wn-description-marker">
              <span />
              <span />
              <span />
            </div>

            <p>
              {work.longDescription}
            </p>

          </div>
        </section>
      )}

      {/* ─────────────────────────────────────
          RICH CONTENT
      ───────────────────────────────────── */}

      {hasContent && (
        <section
          className="subpage-content wn-content-section"
          style={{ paddingTop: 0 }}
        >
          <div className="wn-section-label">
            <span>07 — PROCESS / MEDIA</span>
            <span>ARCHIVE</span>
          </div>

          {work.content.map(
            (block, index) => (
              <ContentBlock
                block={block}
                index={index}
                key={index}
                workTitle={work.title}
              />
            )
          )}
        </section>
      )}

      {/* ─────────────────────────────────────
          GALLERY
      ───────────────────────────────────── */}

      {hasGallery && (
        <section
          className="subpage-content wn-gallery-section"
          style={{ paddingTop: 0 }}
        >
          <div className="wn-section-label">
            <span>08 — VISUAL ARCHIVE</span>

            <span>
              {work.gallery.length} FRAMES
            </span>
          </div>

          <div className="wn-gallery-intro">
            <div className="wn-gallery-title">
              VISUAL
              <br />
              MEMORY.
            </div>

            <div className="wn-gallery-description">
              A collection of captured states,
              environments, interactions and
              moments from the project.
            </div>
          </div>

          <ProjectGallery
            images={work.gallery}
            title={work.title}
          />
        </section>
      )}

      {/* ─────────────────────────────────────
          CREDITS
      ───────────────────────────────────── */}

      {work.credits && (
        <section
          className="subpage-content wn-credits-section"
          style={{ paddingTop: 0 }}
        >
          <div className="wn-section-label">
            <span>09 — CREDITS</span>
            <span>PROJECT LOG</span>
          </div>

          <div className="wn-credits">

            <div className="wn-credit-header">
              <span>ENTITY</span>
              <span>ROLE</span>
            </div>

            <div className="wn-credit-row">
              <span>WENODES</span>
              <span>STUDIO</span>
            </div>

            {work.credits.client && (
              <div className="wn-credit-row">
                <span>
                  {work.credits.client}
                </span>

                <span>CLIENT</span>
              </div>
            )}

            {work.credits.collaborator && (
              <div className="wn-credit-row">
                <span>
                  {work.credits.collaborator}
                </span>

                <span>
                  COLLABORATOR
                </span>
              </div>
            )}

            {work.credits.collaborators && (
              <div className="wn-credit-row">
                <span>
                  {Array.isArray(
                    work.credits.collaborators
                  )
                    ? work.credits.collaborators.join(
                        " / "
                      )
                    : work.credits.collaborators}
                </span>

                <span>
                  COLLABORATORS
                </span>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ─────────────────────────────────────
          NEXT / PREVIOUS PROJECTS
      ───────────────────────────────────── */}

      <section
        className="subpage-content wn-project-navigation"
        style={{ paddingTop: 0 }}
      >
        <div className="wn-section-label">
          <span>10 — CONTINUE EXPLORING</span>
          <span>
            {currentIndex + 1} / {works.length}
          </span>
        </div>

        <div className="wn-project-nav-grid">

          <Link
            href={`/work/${previousWork.id}`}
            className="wn-project-nav-card"
          >
            <span className="wn-nav-direction">
              ← PREVIOUS
            </span>

            <strong>
              {previousWork.title}
            </strong>

            <span>
              {previousWork.category}
            </span>
          </Link>

          <Link
            href="/work"
            className="wn-all-projects"
          >
            <span className="wn-all-projects-symbol">
              ×
            </span>

            <span>
              ALL PROJECTS
            </span>
          </Link>

          <Link
            href={`/work/${nextWork.id}`}
            className="wn-project-nav-card wn-next"
          >
            <span className="wn-nav-direction">
              NEXT →
            </span>

            <strong>
              {nextWork.title}
            </strong>

            <span>
              {nextWork.category}
            </span>
          </Link>

        </div>
      </section>

      <Footer />

      {/* ─────────────────────────────────────
          PAGE STYLES
      ───────────────────────────────────── */}

      <style>{`

        /* ═══════════════════════════════════════
           BASE
        ═══════════════════════════════════════ */

        .wn-project-page {
          --wn-white: #e8e6e3;
          --wn-muted: #888;
          --wn-dim: #555;
          --wn-border: rgba(232,230,227,0.12);
          --wn-border-strong: rgba(232,230,227,0.22);
          --wn-black: #090909;
        }

        .wn-grid-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.035;
          background-image:
            linear-gradient(
              rgba(255,255,255,0.5) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.5) 1px,
              transparent 1px
            );
          background-size: 80px 80px;
        }

        /* ═══════════════════════════════════════
           HERO
        ═══════════════════════════════════════ */

        .wn-project-hero {
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

        .wn-project-system {
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
          box-shadow:
            0 0 12px rgba(232,230,227,0.7);
          animation: wnLivePulse 1.8s ease-in-out infinite;
        }

        @keyframes wnLivePulse {
          0%, 100% {
            opacity: .35;
            transform: scale(.7);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .wn-project-eyebrow {
          display: flex;
          align-items: center;
          gap: .6rem;
          margin-bottom: 1.5rem;
          font-family: var(--font-pixel, monospace);
          font-size: .68rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #777;
        }

        .wn-eyebrow-divider {
          color: #333;
        }

        .wn-project-title {
          display: flex;
          flex-wrap: wrap;
          gap: 0 .25em;
          max-width: 1300px;
          margin: 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(4rem, 12vw, 11rem);
          font-weight: 400;
          line-height: .82;
          letter-spacing: -.065em;
          text-transform: uppercase;
        }

        .wn-title-word {
          opacity: 0;
          transform: translateY(60px);
          animation:
            wnTitleIn .9s
            cubic-bezier(.22,1,.36,1)
            var(--word-delay)
            forwards;
        }

        .wn-title-dot {
          opacity: 0;
          animation:
            wnTitleIn .7s
            cubic-bezier(.22,1,.36,1)
            500ms forwards;
        }

        @keyframes wnTitleIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wn-project-description {
          max-width: 700px;
          margin: 3rem 0 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(1rem, 1.6vw, 1.3rem);
          line-height: 1.55;
          color: #aaa7a2;
          opacity: 0;
          transform: translateY(20px);
          animation:
            wnFadeUp .8s
            cubic-bezier(.22,1,.36,1)
            .65s forwards;
        }

        @keyframes wnFadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wn-scroll-indicator {
          display: flex;
          align-items: center;
          gap: .8rem;
          margin-top: 5rem;
          font-family: var(--font-pixel, monospace);
          font-size: .58rem;
          letter-spacing: .1em;
          color: #666;
        }

        .wn-scroll-line {
          width: 70px;
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
          animation: wnScan 2s ease-in-out infinite;
        }

        @keyframes wnScan {
          0% {
            transform: translateX(-100%);
          }

          50%, 100% {
            transform: translateX(100%);
          }
        }

        /* ═══════════════════════════════════════
           SECTION LABEL
        ═══════════════════════════════════════ */

        .wn-section-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          margin-bottom: 1.5rem;
          border-top: 1px solid var(--wn-border);
          font-family: var(--font-pixel, monospace);
          font-size: .58rem;
          letter-spacing: .1em;
          color: #666;
        }

        /* ═══════════════════════════════════════
           COVER
        ═══════════════════════════════════════ */

        .wn-cover-wrapper {
          position: relative;
        }

        .wn-cover-image {
          position: relative;
          overflow: hidden;
          background: #111;
        }

        .wn-cover-image img {
          width: 100%;
          display: block;
          transition:
            transform 1.8s cubic-bezier(.22,1,.36,1),
            filter 1s ease;
        }

        .wn-cover-wrapper:hover
        .wn-cover-image img {
          transform: scale(1.025);
          filter: brightness(.75);
        }

        .wn-cover-meta,
        .wn-cover-footer {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-pixel, monospace);
          font-size: .56rem;
          letter-spacing: .1em;
          color: #555;
        }

        .wn-cover-meta {
          margin-bottom: .8rem;
        }

        .wn-cover-footer {
          padding-top: .8rem;
        }

        .wn-cover-scan {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          top: -2px;
          background: rgba(232,230,227,.35);
          box-shadow: 0 0 15px rgba(232,230,227,.25);
          animation: wnCoverScan 5s linear infinite;
          pointer-events: none;
        }

        @keyframes wnCoverScan {
          from {
            top: -2px;
          }

          to {
            top: calc(100% + 2px);
          }
        }

        .wn-cover-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #777;
          z-index: 3;
          pointer-events: none;
        }

        .wn-cover-corner-tl {
          top: 27px;
          left: -5px;
          border-top: 1px solid;
          border-left: 1px solid;
        }

        .wn-cover-corner-tr {
          top: 27px;
          right: -5px;
          border-top: 1px solid;
          border-right: 1px solid;
        }

        .wn-cover-corner-bl {
          bottom: 27px;
          left: -5px;
          border-bottom: 1px solid;
          border-left: 1px solid;
        }

        .wn-cover-corner-br {
          bottom: 27px;
          right: -5px;
          border-bottom: 1px solid;
          border-right: 1px solid;
        }

        /* ═══════════════════════════════════════
           PROJECT INFO
        ═══════════════════════════════════════ */

        .wn-info-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(180px, 1fr));
          border-bottom: 1px solid var(--wn-border);
        }

        .wn-info-item {
          position: relative;
          min-height: 120px;
          padding: 1.3rem;
          border-right: 1px solid var(--wn-border);
          border-bottom: 1px solid var(--wn-border);
          transition:
            background .35s ease,
            transform .35s ease;
        }

        .wn-info-item:hover {
          background: rgba(232,230,227,.035);
          transform: translateY(-3px);
        }

        .wn-info-label {
          display: block;
          margin-bottom: 1rem;
          font-family: var(--font-pixel, monospace);
          font-size: .58rem;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #555;
        }

        .wn-info-value {
          display: block;
          font-family: var(--font-whyte, sans-serif);
          font-size: .95rem;
          line-height: 1.4;
          color: #d0cdc8;
        }

        /* ═══════════════════════════════════════
           TAGS
        ═══════════════════════════════════════ */

        .wn-tags {
          display: flex;
          flex-wrap: wrap;
          gap: .5rem;
        }

        .wn-tag {
          display: inline-flex;
          align-items: center;
          gap: .45rem;
          padding: .5rem .8rem;
          border: 1px solid rgba(232,230,227,.14);
          border-radius: 999px;
          font-family: var(--font-pixel, monospace);
          font-size: .58rem;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #999;
          transition:
            border-color .3s ease,
            color .3s ease,
            background .3s ease,
            transform .3s ease;
        }

        .wn-tag:hover {
          color: #e8e6e3;
          border-color: rgba(232,230,227,.4);
          background: rgba(232,230,227,.05);
          transform: translateY(-3px);
        }

        .wn-tag-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #666;
          transition:
            background .3s ease,
            box-shadow .3s ease;
        }

        .wn-tag:hover .wn-tag-dot {
          background: #e8e6e3;
          box-shadow: 0 0 8px rgba(232,230,227,.7);
        }

        /* ═══════════════════════════════════════
           STATS
        ═══════════════════════════════════════ */

        .wn-stats {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(150px, 1fr));
          border-left: 1px solid var(--wn-border);
        }

        .wn-stat {
          position: relative;
          padding: 2rem 1.5rem;
          min-height: 150px;
          border-right: 1px solid var(--wn-border);
          border-bottom: 1px solid var(--wn-border);
          overflow: hidden;
          transition: background .4s ease;
        }

        .wn-stat:hover {
          background: rgba(232,230,227,.035);
        }

        .wn-stat-value {
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 1;
          letter-spacing: -.04em;
          color: #e8e6e3;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
        }

        .wn-stat:hover .wn-stat-value {
          transform: translateX(8px);
        }

        .wn-stat-label {
          margin-top: .8rem;
          font-family: var(--font-pixel, monospace);
          font-size: .55rem;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #555;
        }

        .wn-stat-line {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 1px;
          background: #e8e6e3;
          transition: width .6s cubic-bezier(.22,1,.36,1);
        }

        .wn-stat:hover .wn-stat-line {
          width: 100%;
        }

        /* ═══════════════════════════════════════
           STORY
        ═══════════════════════════════════════ */

        .wn-story {
          max-width: 1000px;
        }

        .wn-story h2 {
          margin: 0 0 2rem;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(2.5rem, 6vw, 6rem);
          font-weight: 400;
          line-height: .95;
          letter-spacing: -.055em;
        }

        .wn-story p {
          max-width: 800px;
          margin: 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(1.15rem, 2vw, 1.5rem);
          line-height: 1.6;
          color: #aaa7a2;
        }

        /* ═══════════════════════════════════════
           LONG DESCRIPTION
        ═══════════════════════════════════════ */

        .wn-long-description {
          display: grid;
          grid-template-columns: 80px minmax(0, 800px);
          gap: 2rem;
        }

        .wn-long-description p {
          margin: 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(1.2rem, 2.2vw, 1.7rem);
          line-height: 1.6;
          color: #aaa7a2;
        }

        .wn-description-marker {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-top: .7rem;
        }

        .wn-description-marker span {
          width: 35px;
          height: 1px;
          background: #555;
        }

        .wn-description-marker span:nth-child(2) {
          width: 22px;
        }

        .wn-description-marker span:nth-child(3) {
          width: 12px;
        }

        /* ═══════════════════════════════════════
           CONTENT
        ═══════════════════════════════════════ */

        .wn-project-content-block {
          position: relative;
          display: grid;
          grid-template-columns: 80px minmax(0, 900px);
          gap: 2rem;
          padding: 4rem 0;
          border-bottom: 1px solid var(--wn-border);
        }

        .wn-block-index {
          font-family: var(--font-pixel, monospace);
          font-size: .6rem;
          color: #555;
          padding-top: .5rem;
        }

        .wn-block-content h3 {
          margin: 0 0 1rem;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 400;
          letter-spacing: -.03em;
        }

        .wn-block-content p {
          margin: 0;
          font-family: var(--font-whyte, sans-serif);
          font-size: 1.05rem;
          line-height: 1.7;
          color: #999;
        }

        /* ═══════════════════════════════════════
           MEDIA
        ═══════════════════════════════════════ */

        .wn-media-frame {
          grid-column: 1 / -1;
        }

        .wn-media-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: .7rem;
          font-family: var(--font-pixel, monospace);
          font-size: .55rem;
          letter-spacing: .1em;
          color: #555;
        }

        .wn-project-image {
          overflow: hidden;
          background: #111;
          position: relative;
        }

        .wn-project-image img {
          width: 100%;
          height: auto;
          display: block;
          transition:
            transform 1.2s cubic-bezier(.22,1,.36,1),
            filter .8s ease;
        }

        .wn-project-image:hover img {
          transform: scale(1.025);
          filter: brightness(.8);
        }

        .project-gallery-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .wn-gallery-image {
          overflow: hidden;
        }

        .wn-image-number {
          position: absolute;
          left: .8rem;
          bottom: .8rem;
          font-family: var(--font-pixel, monospace);
          font-size: .55rem;
          color: rgba(232,230,227,.7);
          opacity: 0;
          transform: translateY(5px);
          transition: .3s ease;
        }

        .wn-gallery-image:hover .wn-image-number {
          opacity: 1;
          transform: translateY(0);
        }

        .wn-project-video {
          width: 100%;
          display: block;
          background: #050505;
        }

        /* ═══════════════════════════════════════
           QUOTE
        ═══════════════════════════════════════ */

        .wn-project-quote {
          display: flex;
          gap: 1rem;
          margin: 0;
          max-width: 1000px;
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(2rem, 5vw, 5rem);
          font-weight: 400;
          line-height: 1;
          letter-spacing: -.045em;
          color: #e8e6e3;
        }

        .wn-quote-mark {
          color: #555;
        }

        /* ═══════════════════════════════════════
           GALLERY INTRO
        ═══════════════════════════════════════ */

        .wn-gallery-intro {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .wn-gallery-title {
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(3rem, 7vw, 7rem);
          line-height: .82;
          letter-spacing: -.06em;
        }

        .wn-gallery-description {
          max-width: 450px;
          align-self: end;
          font-family: var(--font-whyte, sans-serif);
          font-size: 1rem;
          line-height: 1.6;
          color: #777;
        }

        /* ═══════════════════════════════════════
           CREDITS
        ═══════════════════════════════════════ */

        .wn-credits {
          border-top: 1px solid var(--wn-border);
        }

        .wn-credit-header,
        .wn-credit-row {
          display: grid;
          grid-template-columns: 1fr 180px;
          gap: 2rem;
          padding: 1rem;
          border-bottom: 1px solid var(--wn-border);
          font-family: var(--font-pixel, monospace);
          font-size: .58rem;
          letter-spacing: .08em;
        }

        .wn-credit-header {
          color: #444;
        }

        .wn-credit-row {
          color: #aaa;
          transition:
            background .3s ease,
            padding-left .3s ease;
        }

        .wn-credit-row:hover {
          background: rgba(232,230,227,.03);
          padding-left: 1.5rem;
        }

        /* ═══════════════════════════════════════
           PROJECT NAVIGATION
        ═══════════════════════════════════════ */

        .wn-project-nav-grid {
          display: grid;
          grid-template-columns: 1fr 120px 1fr;
          border-top: 1px solid var(--wn-border);
          border-bottom: 1px solid var(--wn-border);
        }

        .wn-project-nav-card,
        .wn-all-projects {
          min-height: 220px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-decoration: none;
          color: inherit;
          border-right: 1px solid var(--wn-border);
          transition:
            background .4s ease,
            padding .4s cubic-bezier(.22,1,.36,1);
        }

        .wn-project-nav-card:last-child {
          border-right: 0;
        }

        .wn-project-nav-card:hover {
          background: rgba(232,230,227,.035);
          padding-left: 2rem;
        }

        .wn-project-nav-card.wn-next {
          text-align: right;
          align-items: flex-end;
        }

        .wn-nav-direction {
          margin-bottom: 1.2rem;
          font-family: var(--font-pixel, monospace);
          font-size: .55rem;
          letter-spacing: .1em;
          color: #555;
        }

        .wn-project-nav-card strong {
          font-family: var(--font-whyte, sans-serif);
          font-size: clamp(1.5rem, 3vw, 3rem);
          font-weight: 400;
          line-height: .95;
          letter-spacing: -.04em;
        }

        .wn-project-nav-card > span:last-child {
          margin-top: 1rem;
          font-family: var(--font-pixel, monospace);
          font-size: .55rem;
          color: #555;
        }

        .wn-all-projects {
          align-items: center;
          justify-content: center;
          gap: 1rem;
          border-right: 1px solid var(--wn-border);
          font-family: var(--font-pixel, monospace);
          font-size: .55rem;
          letter-spacing: .08em;
          color: #777;
          text-align: center;
        }

        .wn-all-projects:hover {
          color: #e8e6e3;
          background: rgba(232,230,227,.035);
        }

        .wn-all-projects-symbol {
          font-family: var(--font-whyte, sans-serif);
          font-size: 3rem;
          line-height: 1;
          transition: transform .5s ease;
        }

        .wn-all-projects:hover
        .wn-all-projects-symbol {
          transform: rotate(90deg);
        }

        /* ═══════════════════════════════════════
           REVEALS
        ═══════════════════════════════════════ */

        .wn-reveal {
          opacity: 0;
          transform: translateY(35px);
          animation:
            wnReveal .8s
            cubic-bezier(.22,1,.36,1)
            var(--reveal-delay, 0ms)
            forwards;
        }

        @keyframes wnReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ═══════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════ */

        @media (max-width: 800px) {

          .wn-project-hero {
            min-height: 70vh;
            padding-top: 8rem;
          }

          .wn-project-system {
            margin-bottom: 2.5rem;
          }

          .wn-project-title {
            font-size: clamp(3.4rem, 16vw, 7rem);
          }

          .wn-scroll-indicator {
            margin-top: 3rem;
          }

          .wn-long-description,
          .wn-project-content-block {
            grid-template-columns: 35px minmax(0, 1fr);
            gap: 1rem;
          }

          .wn-gallery-intro {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .wn-project-nav-grid {
            grid-template-columns: 1fr;
          }

          .wn-project-nav-card,
          .wn-all-projects {
            min-height: 150px;
            border-right: 0;
            border-bottom: 1px solid var(--wn-border);
          }

          .wn-project-nav-card.wn-next {
            text-align: left;
            align-items: flex-start;
          }

          .wn-all-projects {
            min-height: 100px;
          }

          .wn-credit-header,
          .wn-credit-row {
            grid-template-columns: 1fr 120px;
          }
        }

        @media (prefers-reduced-motion: reduce) {

          .wn-title-word,
          .wn-title-dot,
          .wn-project-description,
          .wn-reveal,
          .wn-system-dot,
          .wn-scroll-line::after,
          .wn-cover-scan {
            animation: none !important;
            opacity: 1;
            transform: none;
          }

          * {
            scroll-behavior: auto !important;
          }
        }

      `}</style>

    </main>
  );
}