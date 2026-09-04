import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ParticleScene from "../../components/ParticleScene";
import ProjectGallery from "../../components/ProjectGallery";
import { team } from "../../data/team";
import { works } from "../../data/works";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ═══════════════════════════════════════════════
   STATIC ROUTES
═══════════════════════════════════════════════ */

export function generateStaticParams() {
  return team.map((member) => ({
    slug: member.slug,
  }));
}

/* ═══════════════════════════════════════════════
   METADATA
═══════════════════════════════════════════════ */

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const member = team.find(
    (m) => m.slug === slug
  );

  return {
    title: member
      ? `${member.nickname} — WENODES`
      : "Team — WENODES",

    description:
      member?.description ||
      "WeNodes team member",
  };
}

/* ═══════════════════════════════════════════════
   CONTENT BLOCK
═══════════════════════════════════════════════ */

function ContentBlock({
  block,
  index,
  memberName,
}) {
  switch (block.type) {

    case "text":
      return (
        <div
          className="wn-member-content-block wn-reveal"
          style={{
            "--reveal-delay": `${index * 80}ms`,
          }}
          key={index}
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
          className="wn-member-content-block wn-reveal"
          style={{
            "--reveal-delay": `${index * 80}ms`,
          }}
          key={index}
        >
          <div className="wn-media-frame">
            <div className="wn-media-meta">
              <span>
                MEDIA /{" "}
                {String(index + 1).padStart(2, "0")}
              </span>

              <span>IMAGE</span>
            </div>

            <div className="wn-member-image">
              <img
                src={block.src}
                alt={
                  block.alt ||
                  memberName
                }
                loading="lazy"
              />
            </div>
          </div>
        </div>
      );

case "gallery":
  return (
    <div
      className="wn-member-content-block wn-reveal"
      style={{
        "--reveal-delay": `${index * 80}ms`,
      }}
      key={index}
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

        <ProjectGallery
          images={block.images}
          title={memberName}
        />

      </div>
    </div>
  );
    case "quote":
      return (
        <div
          className="wn-member-content-block wn-reveal"
          style={{
            "--reveal-delay": `${index * 80}ms`,
          }}
          key={index}
        >
          <div className="wn-block-index">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="wn-block-content">
            <blockquote className="wn-member-quote">
              <span className="wn-quote-mark">"</span>
              <span>{block.text}</span>
            </blockquote>
          </div>
        </div>
      );

    case "video":
      return (
        <div
          className="wn-member-content-block wn-reveal"
          key={index}
        >
          <div className="wn-media-frame">

            <div className="wn-media-meta">
              <span>
                MEDIA /{" "}
                {String(index + 1).padStart(2, "0")}
              </span>

              <span>VIDEO</span>
            </div>

            <video
              className="wn-member-video"
              controls
              poster={block.poster}
              playsInline
            >
              <source
                src={block.src}
                type="video/mp4"
              />

              Your browser does not support
              the video tag.
            </video>

          </div>
        </div>
      );

    case "html":
      return (
        <div
          className="wn-member-content-block wn-reveal wn-html-block"
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

/* ═══════════════════════════════════════════════
   TAG
═══════════════════════════════════════════════ */

function MemberTag({ label, index }) {
  return (
    <span
      className="wn-member-tag"
      style={{
        "--tag-delay": `${index * 60}ms`,
      }}
    >
      <span className="wn-member-tag-dot" />
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   STAT
═══════════════════════════════════════════════ */

function MemberStat({
  label,
  value,
  index,
}) {
  return (
    <div
      className="wn-member-stat"
      style={{
        "--stat-delay": `${index * 100}ms`,
      }}
    >
      <div className="wn-member-stat-value">
        {value}
      </div>

      <div className="wn-member-stat-label">
        {label}
      </div>

      <div className="wn-member-stat-line" />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   INFO ITEM
═══════════════════════════════════════════════ */

function InfoItem({
  label,
  children,
}) {
  return (
    <div className="wn-member-info-item">

      <span className="wn-member-info-label">
        {label}
      </span>

      <span className="wn-member-info-value">
        {children}
      </span>

    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */

export default async function TeamDetailPage({
  params,
}) {
  const { slug } = await params;

  const member = team.find(
    (m) => m.slug === slug
  );

  if (!member) return notFound();

  const hasStory =
    member.story &&
    (member.story.title ||
      member.story.intro);

  const hasStats =
    Array.isArray(member.stats) &&
    member.stats.length > 0;

  const hasDisciplines =
    Array.isArray(member.disciplines) &&
    member.disciplines.length > 0;

  const hasSpecialties =
    Array.isArray(member.specialties) &&
    member.specialties.length > 0;

  const hasTools =
    Array.isArray(member.tools) &&
    member.tools.length > 0;

  const hasContent =
    Array.isArray(member.content) &&
    member.content.length > 0;

  const hasWorks =
    Array.isArray(member.works) &&
    member.works.length > 0;

  const currentIndex = team.findIndex(
    (m) => m.slug === member.slug
  );

  const previousMember =
    currentIndex > 0
      ? team[currentIndex - 1]
      : team[team.length - 1];

  const nextMember =
    currentIndex <
    team.length - 1
      ? team[currentIndex + 1]
      : team[0];

  /*
   * Resolve the member's connected projects.
   */
  const memberWorks = hasWorks
    ? member.works
        .map((id) =>
          works.find(
            (work) => work.id === id
          )
        )
        .filter(Boolean)
    : [];

  return (
    <main
      className="subpage wn-member-page"
      data-member={member.slug}
    >

      {/* ═══════════════════════════════════════
          BACKGROUND
      ═══════════════════════════════════════ */}

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

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}

      <section className="wn-member-hero">

        <div className="wn-member-system">

          <div className="wn-system-left">

            <span className="wn-system-dot" />

            <span>
              WENODES / PEOPLE SYSTEM
            </span>

          </div>

          <span>
            {String(
              currentIndex + 1
            ).padStart(2, "0")}
          </span>

        </div>

        <div className="wn-member-eyebrow">

          <span>
            {member.role}
          </span>

          <span className="wn-eyebrow-divider">
            /
          </span>

          <span>
            {member.location}
          </span>

        </div>

        <h1 className="wn-member-title">

          {member.nickname
            .split(" ")
            .map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="wn-title-word"
                style={{
                  "--word-delay": `${
                    index * 90
                  }ms`,
                }}
              >
                {word}
              </span>
            ))}

          <span className="wn-title-dot">
            .
          </span>

        </h1>

        {member.description && (
          <p className="wn-member-description">
            {member.description}
          </p>
        )}

        <div className="wn-scroll-indicator">

          <span>
            SCROLL TO EXPLORE
          </span>

          <span className="wn-scroll-line" />

          <span>↓</span>

        </div>

      </section>

      {/* ═══════════════════════════════════════
          PORTRAIT / IDENTITY
      ═══════════════════════════════════════ */}

      {member.hero?.src && (
        <section
          className="subpage-content wn-member-cover-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-member-cover">

            <div className="wn-cover-meta">

              <span>
                01 / IDENTITY
              </span>

              <span>
                {member.nickname}
              </span>

            </div>

            <div className="wn-member-cover-image">

              <img
                src={member.hero.src}
                alt={
                  member.hero.alt ||
                  member.fullName
                }
              />

              <div className="wn-member-cover-overlay" />

              <div className="wn-member-crosshair">
                <span />
                <span />
              </div>

              <div className="wn-member-image-label">

                <span>
                  SUBJECT
                </span>

                <strong>
                  {member.nickname}
                </strong>

              </div>

            </div>

            <div className="wn-cover-footer">

              <span>
                WENODES CREATIVE TECHNOLOGY
              </span>

              <span>
                PERSON /{" "}
                {String(
                  member.id
                ).padStart(2, "0")}
              </span>

            </div>

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          PERSONAL DATA
      ═══════════════════════════════════════ */}

      <section
        className="subpage-content wn-member-info-section"
        style={{ paddingTop: "2rem" }}
      >

        <div className="wn-section-label">

          <span>
            02 — MEMBER DATA
          </span>

          <span>
            LIVE RECORD
          </span>

        </div>

        <div className="wn-member-info-grid">

          <InfoItem label="Name">
            {member.fullName}
          </InfoItem>

          <InfoItem label="Role">
            {member.role}
          </InfoItem>

          <InfoItem label="Location">
            {member.location}
          </InfoItem>

          {hasDisciplines && (
            <InfoItem label="Disciplines">
              {member.disciplines.join(
                " / "
              )}
            </InfoItem>
          )}

        </div>

      </section>

      {/* ═══════════════════════════════════════
          DISCIPLINES
      ═══════════════════════════════════════ */}

      {hasDisciplines && (
        <section
          className="subpage-content wn-member-tags-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              03 — DISCIPLINES
            </span>

            <span>
              {member.disciplines.length} PARAMETERS
            </span>

          </div>

          <div className="wn-member-tags">

            {member.disciplines.map(
              (discipline, index) => (
                <MemberTag
                  key={discipline}
                  label={discipline}
                  index={index}
                />
              )
            )}

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          SPECIALTIES
      ═══════════════════════════════════════ */}

      {hasSpecialties && (
        <section
          className="subpage-content wn-member-tags-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              04 — SPECIALTIES
            </span>

            <span>
              WORKING SYSTEM
            </span>

          </div>

          <div className="wn-member-tags">

            {member.specialties.map(
              (specialty, index) => (
                <MemberTag
                  key={specialty}
                  label={specialty}
                  index={index}
                />
              )
            )}

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          STATS
      ═══════════════════════════════════════ */}

      {hasStats && (
        <section
          className="subpage-content wn-member-stats-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              05 — SYSTEM METRICS
            </span>

            <span>
              PERFORMANCE DATA
            </span>

          </div>

          <div className="wn-member-stats">

            {member.stats.map(
              (stat, index) => (
                <MemberStat
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  index={index}
                />
              )
            )}

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          STORY
      ═══════════════════════════════════════ */}

      {hasStory && (
        <section
          className="subpage-content wn-member-story-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              06 — CONTEXT
            </span>

            <span>
              PERSONAL NARRATIVE
            </span>

          </div>

          <div className="wn-member-story">

            {member.story.title && (
              <h2>
                {member.story.title}
              </h2>
            )}

            {member.story.intro && (
              <p>
                {member.story.intro}
              </p>
            )}

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          LONG DESCRIPTION
      ═══════════════════════════════════════ */}

      {member.longDescription && (
        <section
          className="subpage-content wn-member-description-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              07 — ABOUT THE MEMBER
            </span>

            <span>
              FIELD NOTES
            </span>

          </div>

          <div className="wn-member-long-description">

            <div className="wn-description-marker">
              <span />
              <span />
              <span />
            </div>

            <p>
              {member.longDescription}
            </p>

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          TOOLS
      ═══════════════════════════════════════ */}

      {hasTools && (
        <section
          className="subpage-content wn-member-tools-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              08 — TOOLCHAIN
            </span>

            <span>
              ACTIVE STACK
            </span>

          </div>

          <div className="wn-member-tools">

            {member.tools.map(
              (tool, index) => (
                <div
                  className="wn-tool"
                  key={tool}
                >

                  <span className="wn-tool-number">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </span>

                  <span className="wn-tool-name">
                    {tool}
                  </span>

                  <span className="wn-tool-arrow">
                    ↗
                  </span>

                </div>
              )
            )}

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          QUOTE
      ═══════════════════════════════════════ */}

      {member.quote && (
        <section
          className="subpage-content wn-member-quote-section"
          style={{ paddingTop: 0 }}
        >

          <blockquote className="wn-member-big-quote">

            <span className="wn-quote-mark">
              “
            </span>

            <span>
              {member.quote}
            </span>

          </blockquote>

        </section>
      )}

      {/* ═══════════════════════════════════════
          RICH CONTENT
      ═══════════════════════════════════════ */}

      {hasContent && (
        <section
          className="subpage-content wn-member-content-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              09 — PROCESS / MEDIA
            </span>

            <span>
              PERSONAL ARCHIVE
            </span>

          </div>

          {member.content.map(
            (block, index) => (
              <ContentBlock
                key={index}
                block={block}
                index={index}
                memberName={
                  member.fullName
                }
              />
            )
          )}

        </section>
      )}

      {/* ═══════════════════════════════════════
          SELECTED WORK
      ═══════════════════════════════════════ */}

      {memberWorks.length > 0 && (
        <section
          className="subpage-content wn-member-work-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              10 — SELECTED WORK
            </span>

            <span>
              {memberWorks.length} PROJECTS
            </span>

          </div>

          <div className="wn-member-work-grid">

            {memberWorks.map(
              (work, index) => (
                <Link
                  href={`/work/${work.id}`}
                  className="wn-member-work-card"
                  key={work.id}
                >

                  <div className="wn-member-work-image">

                    {work.coverImage && (
                      <img
                        src={
                          work.coverImage
                        }
                        alt={work.title}
                        loading="lazy"
                      />
                    )}

                    <div className="wn-member-work-index">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>

                  </div>

                  <div className="wn-member-work-meta">

                    <div>
                      <strong>
                        {work.title}
                      </strong>

                      <span>
                        {work.category}
                      </span>
                    </div>

                    <span>
                      {work.year}
                    </span>

                  </div>

                </Link>
              )
            )}

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          SOCIAL / CONTACT
      ═══════════════════════════════════════ */}

      {member.links && (
        <section
          className="subpage-content wn-member-links-section"
          style={{ paddingTop: 0 }}
        >

          <div className="wn-section-label">

            <span>
              11 — NETWORK
            </span>

            <span>
              EXTERNAL CHANNELS
            </span>

          </div>

          <div className="wn-member-links">

            {Object.entries(
              member.links
            ).map(([name, url]) => (
              <a
                key={name}
                href={url}
                className="wn-member-link"
                target="_blank"
                rel="noreferrer"
              >

                <span>
                  {name.toUpperCase()}
                </span>

                <span>↗</span>

              </a>
            ))}

          </div>

        </section>
      )}

      {/* ═══════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════ */}

      <section
        className="subpage-content wn-member-navigation"
        style={{ paddingTop: 0 }}
      >

        <div className="wn-section-label">

          <span>
            12 — CONTINUE EXPLORING
          </span>

          <span>
            {currentIndex + 1} /{" "}
            {team.length}
          </span>

        </div>

        <div className="wn-member-nav-grid">

          <Link
            href={`/team/${previousMember.slug}`}
            className="wn-member-nav-card"
          >

            <span className="wn-nav-direction">
              ← PREVIOUS
            </span>

            <strong>
              {previousMember.nickname}
            </strong>

            <span>
              {previousMember.role}
            </span>

          </Link>

          <Link
            href="/team"
            className="wn-all-members"
          >

            <span className="wn-all-members-symbol">
              ×
            </span>

            <span>
              ALL MEMBERS
            </span>

          </Link>

          <Link
            href={`/team/${nextMember.slug}`}
            className="wn-member-nav-card wn-next"
          >

            <span className="wn-nav-direction">
              NEXT →
            </span>

            <strong>
              {nextMember.nickname}
            </strong>

            <span>
              {nextMember.role}
            </span>

          </Link>

        </div>

      </section>

      <Footer />

      {/* ═══════════════════════════════════════
          PAGE CSS
      ═══════════════════════════════════════ */}

      <style>{`

        /* ═══════════════════════════════════════
           CORE
        ═══════════════════════════════════════ */

        .wn-member-page {
          --wn-white: #e8e6e3;
          --wn-muted: #888;
          --wn-dim: #555;
          --wn-border: rgba(232,230,227,.12);
          --wn-border-strong: rgba(232,230,227,.22);
          --wn-black: #090909;
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

        /* ═══════════════════════════════════════
           HERO
        ═══════════════════════════════════════ */

        .wn-member-hero {
          position: relative;
          min-height: 78vh;

          padding:
            clamp(8rem,15vw,12rem)
            clamp(1.2rem,5vw,5rem)
            6rem;

          display: flex;
          flex-direction: column;
          justify-content: center;

          overflow: hidden;
        }

        .wn-member-system {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 4rem;

          font-family:
            var(--font-pixel, monospace);

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
            0 0 12px
            rgba(232,230,227,.7);

          animation:
            wnLivePulse
            1.8s
            ease-in-out
            infinite;
        }

        @keyframes wnLivePulse {

          0%,100% {
            opacity: .35;
            transform: scale(.7);
          }

          50% {
            opacity: 1;
            transform: scale(1);
          }

        }

        .wn-member-eyebrow {
          display: flex;
          align-items: center;
          gap: .6rem;

          margin-bottom: 1.5rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .68rem;
          letter-spacing: .12em;

          text-transform: uppercase;

          color: #777;
        }

        .wn-eyebrow-divider {
          color: #333;
        }

        .wn-member-title {
          display: flex;
          flex-wrap: wrap;

          gap: 0 .25em;

          max-width: 1300px;

          margin: 0;

          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(4rem,12vw,11rem);

          font-weight: 400;

          line-height: .82;

          letter-spacing: -.065em;

          text-transform: uppercase;
        }

        .wn-title-word {
          opacity: 0;

          transform:
            translateY(60px);

          animation:
            wnTitleIn
            .9s
            cubic-bezier(.22,1,.36,1)
            var(--word-delay)
            forwards;
        }

        .wn-title-dot {
          opacity: 0;

          animation:
            wnTitleIn
            .7s
            cubic-bezier(.22,1,.36,1)
            500ms
            forwards;
        }

        @keyframes wnTitleIn {

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        .wn-member-description {
          max-width: 700px;

          margin: 3rem 0 0;

          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(1rem,1.6vw,1.3rem);

          line-height: 1.55;

          color: #aaa7a2;

          opacity: 0;

          transform:
            translateY(20px);

          animation:
            wnFadeUp
            .8s
            cubic-bezier(.22,1,.36,1)
            .65s
            forwards;
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

          font-family:
            var(--font-pixel, monospace);

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

          transform:
            translateX(-100%);

          animation:
            wnScan
            2s
            ease-in-out
            infinite;
        }

        @keyframes wnScan {

          0% {
            transform:
              translateX(-100%);
          }

          50%,100% {
            transform:
              translateX(100%);
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

          border-top:
            1px solid
            var(--wn-border);

          font-family:
            var(--font-pixel, monospace);

          font-size: .58rem;
          letter-spacing: .1em;

          color: #666;
        }

        /* ═══════════════════════════════════════
           IDENTITY IMAGE
        ═══════════════════════════════════════ */

        .wn-member-cover {
          position: relative;
        }

        .wn-cover-meta,
        .wn-cover-footer {
          display: flex;
          justify-content: space-between;

          font-family:
            var(--font-pixel, monospace);

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

        .wn-member-cover-image {
          position: relative;
          overflow: hidden;

          background: #111;
        }

        .wn-member-cover-image img {
          display: block;
          width: 100%;
          height: min(578px, 78vw);
          object-fit: cover;
          object-position: center;
          filter: grayscale(.15);

          transition:
            transform 1.8s
              cubic-bezier(.22,1,.36,1),
            filter 1s ease;
        }

        .wn-member-cover:hover
        .wn-member-cover-image img {
          transform: scale(1.018);
          filter: grayscale(0);
        }

        .wn-member-cover-overlay {
          position: absolute;
          inset: 0;

          pointer-events: none;

          background:
            linear-gradient(
              180deg,
              transparent 60%,
              rgba(0,0,0,.55)
            );
        }

        .wn-member-crosshair {
          position: absolute;

          top: 50%;
          left: 50%;

          width: 30px;
          height: 30px;

          transform:
            translate(-50%,-50%);

          opacity: .35;
        }

        .wn-member-crosshair::before,
        .wn-member-crosshair::after {
          content: "";

          position: absolute;

          background:
            rgba(232,230,227,.7);
        }

        .wn-member-crosshair::before {
          width: 1px;
          height: 100%;

          left: 50%;
        }

        .wn-member-crosshair::after {
          height: 1px;
          width: 100%;

          top: 50%;
        }

        .wn-member-image-label {
          position: absolute;

          left: 1.5rem;
          bottom: 1.5rem;

          display: flex;
          flex-direction: column;

          gap: .35rem;
        }

        .wn-member-image-label span {
          font-family:
            var(--font-pixel, monospace);

          font-size: .5rem;
          letter-spacing: .12em;

          color: rgba(232,230,227,.5);
        }

        .wn-member-image-label strong {
          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(1.5rem,4vw,3rem);

          font-weight: 400;

          letter-spacing: -.04em;

          color: #e8e6e3;
        }

        /* ═══════════════════════════════════════
           INFO
        ═══════════════════════════════════════ */

        .wn-member-info-grid {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(180px,1fr)
            );

          border-bottom:
            1px solid
            var(--wn-border);
        }

        .wn-member-info-item {
          position: relative;

          min-height: 120px;

          padding: 1.3rem;

          border-right:
            1px solid
            var(--wn-border);

          border-bottom:
            1px solid
            var(--wn-border);

          transition:
            background .35s ease,
            transform .35s ease;
        }

        .wn-member-info-item:hover {
          background:
            rgba(232,230,227,.035);

          transform:
            translateY(-3px);
        }

        .wn-member-info-label {
          display: block;

          margin-bottom: 1rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .58rem;
          letter-spacing: .1em;

          text-transform: uppercase;

          color: #555;
        }

        .wn-member-info-value {
          display: block;

          font-family:
            var(--font-whyte, sans-serif);

          font-size: .95rem;
          line-height: 1.4;

          color: #d0cdc8;
        }

        /* ═══════════════════════════════════════
           TAGS
        ═══════════════════════════════════════ */

        .wn-member-tags {
          display: flex;
          flex-wrap: wrap;

          gap: .5rem;
        }

        .wn-member-tag {
          display: inline-flex;
          align-items: center;

          gap: .45rem;

          padding: .5rem .8rem;

          border:
            1px solid
            rgba(232,230,227,.14);

          border-radius: 999px;

          font-family:
            var(--font-pixel, monospace);

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

        .wn-member-tag:hover {
          color: #e8e6e3;

          border-color:
            rgba(232,230,227,.4);

          background:
            rgba(232,230,227,.05);

          transform:
            translateY(-3px);
        }

        .wn-member-tag-dot {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #666;

          transition:
            background .3s ease,
            box-shadow .3s ease;
        }

        .wn-member-tag:hover
        .wn-member-tag-dot {
          background: #e8e6e3;

          box-shadow:
            0 0 8px
            rgba(232,230,227,.7);
        }

        /* ═══════════════════════════════════════
           STATS
        ═══════════════════════════════════════ */

        .wn-member-stats {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(150px,1fr)
            );

          border-left:
            1px solid
            var(--wn-border);
        }

        .wn-member-stat {
          position: relative;

          padding: 2rem 1.5rem;

          min-height: 150px;

          border-right:
            1px solid
            var(--wn-border);

          border-bottom:
            1px solid
            var(--wn-border);

          overflow: hidden;

          transition:
            background .4s ease;
        }

        .wn-member-stat:hover {
          background:
            rgba(232,230,227,.035);
        }

        .wn-member-stat-value {
          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(2rem,4vw,3.5rem);

          line-height: 1;

          letter-spacing: -.04em;

          color: #e8e6e3;

          transition:
            transform .5s
            cubic-bezier(.22,1,.36,1);
        }

        .wn-member-stat:hover
        .wn-member-stat-value {
          transform:
            translateX(8px);
        }

        .wn-member-stat-label {
          margin-top: .8rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;
          letter-spacing: .1em;

          text-transform: uppercase;

          color: #555;
        }

        .wn-member-stat-line {
          position: absolute;

          left: 0;
          bottom: 0;

          width: 0;
          height: 1px;

          background: #e8e6e3;

          transition:
            width .6s
            cubic-bezier(.22,1,.36,1);
        }

        .wn-member-stat:hover
        .wn-member-stat-line {
          width: 100%;
        }

        /* ═══════════════════════════════════════
           STORY
        ═══════════════════════════════════════ */

        .wn-member-story {
          max-width: 1000px;
        }

        .wn-member-story h2 {
          margin: 0 0 2rem;

          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(2.5rem,6vw,6rem);

          font-weight: 400;

          line-height: .95;

          letter-spacing: -.055em;
        }

        .wn-member-story p {
          max-width: 800px;

          margin: 0;

          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(1.15rem,2vw,1.5rem);

          line-height: 1.6;

          color: #aaa7a2;
        }

        /* ═══════════════════════════════════════
           DESCRIPTION
        ═══════════════════════════════════════ */

        .wn-member-long-description {
          display: grid;

          grid-template-columns:
            80px minmax(0,800px);

          gap: 2rem;
        }

        .wn-member-long-description p {
          margin: 0;

          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(1.2rem,2.2vw,1.7rem);

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
           TOOLS
        ═══════════════════════════════════════ */

        .wn-member-tools {
          border-top:
            1px solid
            var(--wn-border);
        }

        .wn-tool {
          display: grid;

          grid-template-columns:
            80px 1fr 40px;

          align-items: center;

          padding: 1.1rem 0;

          border-bottom:
            1px solid
            var(--wn-border);

          font-family:
            var(--font-pixel, monospace);

          font-size: .62rem;

          letter-spacing: .08em;

          transition:
            padding .35s
              cubic-bezier(.22,1,.36,1),
            background .35s ease;
        }

        .wn-tool:hover {
          padding-left: 1rem;
          padding-right: 1rem;

          background:
            rgba(232,230,227,.025);
        }

        .wn-tool-number {
          color: #444;
        }

        .wn-tool-name {
          color: #aaa;
        }

        .wn-tool-arrow {
          text-align: right;

          color: #444;

          transition:
            transform .4s ease,
            color .3s ease;
        }

        .wn-tool:hover
        .wn-tool-arrow {
          color: #e8e6e3;

          transform:
            translate(3px,-3px);
        }

        /* ═══════════════════════════════════════
           QUOTE
        ═══════════════════════════════════════ */

        .wn-member-big-quote {
          display: flex;

          gap: 1rem;

          max-width: 1100px;

          margin: 0;

          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(2rem,5vw,5rem);

          font-weight: 400;

          line-height: 1;

          letter-spacing: -.045em;

          color: #e8e6e3;
        }

        .wn-quote-mark {
          color: #555;
          font-size: 1.6em;
          line-height: 1;
          margin-right: .4rem;
          position: relative;
          top: .08em;
        }

        .wn-member-quote {
          display: block;
          grid-column: 1 / -1;
          margin: 0;
          padding: 0;
          border: none;
          font-family:
            var(--font-whyte, sans-serif);

          font-size: clamp(1.5rem,3vw,2.5rem);
          font-weight: 400;
          line-height: 1.3;
          letter-spacing: -.03em;
          color: #e8e6e3;
        }

        /* ═══════════════════════════════════════
           CONTENT
        ═══════════════════════════════════════ */

        .wn-member-content-block {
          position: relative;

          display: grid;

          grid-template-columns:
            80px minmax(0,900px);

          gap: 2rem;

          padding: 4rem 0;

          border-bottom:
            1px solid
            var(--wn-border);
        }

        .wn-block-index {
          font-family:
            var(--font-pixel, monospace);

          font-size: .6rem;

          color: #555;

          padding-top: .5rem;
        }

        .wn-block-content h3 {
          margin: 0 0 1rem;

          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(1.5rem,3vw,2.5rem);

          font-weight: 400;

          letter-spacing: -.03em;
        }

        .wn-block-content p {
          margin: 0;

          font-family:
            var(--font-whyte, sans-serif);

          font-size: 1.05rem;

          line-height: 1.7;

          color: #999;
        }

        .wn-media-frame {
          grid-column: 1 / -1;
        }

        .wn-media-meta {
          display: flex;
          justify-content: space-between;

          margin-bottom: .7rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;

          letter-spacing: .1em;

          color: #555;
        }

        .wn-member-image {
          position: relative;
          overflow: hidden;
          max-width: 400px;

          background: #111;
        }

        .wn-member-image img {
          width: 100%;

          display: block;

          transition:
            transform 1.2s
              cubic-bezier(.22,1,.36,1),
            filter .8s ease;
        }

        .wn-member-image:hover img {
          transform: scale(1.025);
          filter: brightness(.8);
        }

        .wn-member-gallery {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(280px,1fr)
            );

          gap: 1rem;
        }

        .wn-member-gallery-image {
          position: relative;
          overflow: hidden;

          background: #111;
        }

        .wn-member-gallery-image img {
          width: 100%;
          display: block;

          transition:
            transform 1.2s
            cubic-bezier(.22,1,.36,1);
        }

        .wn-member-gallery-image:hover img {
          transform: scale(1.025);
        }

        .wn-member-gallery-image span {
          position: absolute;

          left: .8rem;
          bottom: .8rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;

          color:
            rgba(232,230,227,.7);

          opacity: 0;

          transform:
            translateY(5px);

          transition: .3s ease;
        }

        .wn-member-gallery-image:hover span {
          opacity: 1;
          transform:
            translateY(0);
        }

        .wn-member-video {
          width: 100%;
          display: block;

          background: #050505;
        }

        /* ═══════════════════════════════════════
           SELECTED WORK
        ═══════════════════════════════════════ */

        .wn-member-work-grid {
          display: grid;

          grid-template-columns:
            repeat(2,1fr);

          gap: 1rem;
        }

        .wn-member-work-card {
          display: block;

          text-decoration: none;

          color: inherit;
        }

        .wn-member-work-image {
          position: relative;

          overflow: hidden;

          background: #111;
        }

        .wn-member-work-image img {
          width: 100%;
          display: block;

          transition:
            transform 1.2s
              cubic-bezier(.22,1,.36,1),
            filter .8s ease;
        }

        .wn-member-work-card:hover
        .wn-member-work-image img {
          transform: scale(1.035);
          filter: brightness(.72);
        }

        .wn-member-work-index {
          position: absolute;

          left: 1rem;
          top: 1rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;

          color:
            rgba(232,230,227,.7);
        }

        .wn-member-work-meta {
          display: flex;
          justify-content: space-between;

          padding: 1rem 0;

          border-bottom:
            1px solid
            var(--wn-border);

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;
        }

        .wn-member-work-meta div {
          display: flex;
          flex-direction: column;
          gap: .35rem;
        }

        .wn-member-work-meta strong {
          font-family:
            var(--font-whyte, sans-serif);

          font-size: 1.2rem;

          font-weight: 400;

          letter-spacing: -.03em;
        }

        .wn-member-work-meta span {
          color: #555;
        }

        /* ═══════════════════════════════════════
           LINKS
        ═══════════════════════════════════════ */

        .wn-member-links {
          display: grid;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(180px,1fr)
            );

          border-top:
            1px solid
            var(--wn-border);
        }

        .wn-member-link {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 1.3rem;

          border-right:
            1px solid
            var(--wn-border);

          border-bottom:
            1px solid
            var(--wn-border);

          font-family:
            var(--font-pixel, monospace);

          font-size: .58rem;

          letter-spacing: .1em;

          text-decoration: none;

          color: #777;

          transition:
            color .3s ease,
            background .3s ease,
            padding .3s ease;
        }

        .wn-member-link:hover {
          color: #e8e6e3;

          background:
            rgba(232,230,227,.035);

          padding-left: 1.7rem;
        }

        /* ═══════════════════════════════════════
           NAVIGATION
        ═══════════════════════════════════════ */

        .wn-member-nav-grid {
          display: grid;

          grid-template-columns:
            1fr 120px 1fr;

          border-top:
            1px solid
            var(--wn-border);

          border-bottom:
            1px solid
            var(--wn-border);
        }

        .wn-member-nav-card,
        .wn-all-members {
          min-height: 220px;

          padding: 1.5rem;

          display: flex;
          flex-direction: column;

          justify-content: center;

          text-decoration: none;

          color: inherit;

          border-right:
            1px solid
            var(--wn-border);

          transition:
            background .4s ease,
            padding .4s
            cubic-bezier(.22,1,.36,1);
        }

        .wn-member-nav-card:hover {
          background:
            rgba(232,230,227,.035);

          padding-left: 2rem;
        }

        .wn-member-nav-card.wn-next {
          text-align: right;
          align-items: flex-end;
        }

        .wn-nav-direction {
          margin-bottom: 1.2rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;

          letter-spacing: .1em;

          color: #555;
        }

        .wn-member-nav-card strong {
          font-family:
            var(--font-whyte, sans-serif);

          font-size:
            clamp(1.5rem,3vw,3rem);

          font-weight: 400;

          line-height: .95;

          letter-spacing: -.04em;
        }

        .wn-member-nav-card > span:last-child {
          margin-top: 1rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;

          color: #555;
        }

        .wn-all-members {
          align-items: center;
          justify-content: center;

          gap: 1rem;

          font-family:
            var(--font-pixel, monospace);

          font-size: .55rem;

          letter-spacing: .08em;

          color: #777;

          text-align: center;
        }

        .wn-all-members:hover {
          color: #e8e6e3;

          background:
            rgba(232,230,227,.035);
        }

        .wn-all-members-symbol {
          font-family:
            var(--font-whyte, sans-serif);

          font-size: 3rem;

          line-height: 1;

          transition:
            transform .5s ease;
        }

        .wn-all-members:hover
        .wn-all-members-symbol {
          transform:
            rotate(90deg);
        }

        /* ═══════════════════════════════════════
           REVEAL
        ═══════════════════════════════════════ */

        .wn-reveal {
          opacity: 0;

          transform:
            translateY(35px);

          animation:
            wnReveal
            .8s
            cubic-bezier(.22,1,.36,1)
            var(--reveal-delay,0ms)
            forwards;
        }

        @keyframes wnReveal {

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        /* ═══════════════════════════════════════
           MOBILE
        ═══════════════════════════════════════ */

        @media (max-width: 800px) {

          .wn-member-hero {
            min-height: 70vh;
            padding-top: 8rem;
          }

          .wn-member-system {
            margin-bottom: 2.5rem;
          }

          .wn-member-title {
            font-size:
              clamp(
                3.4rem,
                16vw,
                7rem
              );
          }

          .wn-scroll-indicator {
            margin-top: 3rem;
          }

          .wn-member-long-description,
          .wn-member-content-block {
            grid-template-columns:
              35px minmax(0,1fr);

            gap: 1rem;
          }

          .wn-member-work-grid {
            grid-template-columns: 1fr;
          }

          .wn-member-nav-grid {
            grid-template-columns: 1fr;
          }

          .wn-member-nav-card,
          .wn-all-members {
            min-height: 150px;

            border-right: 0;

            border-bottom:
              1px solid
              var(--wn-border);
          }

          .wn-member-nav-card.wn-next {
            text-align: left;
            align-items: flex-start;
          }

          .wn-all-members {
            min-height: 100px;
          }

          .wn-tool {
            grid-template-columns:
              45px 1fr 30px;
          }

        }

        /* ═══════════════════════════════════════
           REDUCED MOTION
        ═══════════════════════════════════════ */

        @media (prefers-reduced-motion: reduce) {

          .wn-title-word,
          .wn-title-dot,
          .wn-member-description,
          .wn-reveal,
          .wn-system-dot,
          .wn-scroll-line::after {
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
