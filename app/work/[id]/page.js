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
/* ─── Content Block Renderer ─── */
function ContentBlock({ block, index, workTitle }) {
  switch (block.type) {
    case "text":
      return (
        <div className="content-block" key={index}>
          {block.title && <h3>{block.title}</h3>}
          <p>{block.text}</p>
        </div>
      );

    case "image":
      return (
        <div className="content-block" key={index}>
          <div className="project-detail-image">
            <img
              src={block.src}
              alt={block.alt || workTitle}
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="content-block" key={index}>
          <div
            className="project-gallery-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {block.images.map((img, i) => (
              <div className="project-detail-image" key={i}>
                <img
                  src={img}
                  alt={`${workTitle} gallery ${i + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "4px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="content-block" key={index}>
          <blockquote
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontStyle: "italic",
              lineHeight: 1.3,
              color: "#e8e6e3",
              borderLeft: "2px solid #e8e6e3",
              paddingLeft: "1.5rem",
              margin: "2rem 0",
            }}
          >
            &ldquo;{block.text}&rdquo;
          </blockquote>
        </div>
      );

    case "video":
      return (
        <div className="content-block" key={index}>
          <video
            controls
            poster={block.poster}
            style={{
              width: "100%",
              borderRadius: "4px",
              display: "block",
            }}
          >
            <source src={block.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );

    case "html":
      return (
        <div
          className="content-block"
          key={index}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    default:
      return null;
  }
}

/* ─── Tag Pill ─── */
function TagPill({ label }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.35rem 0.9rem",
        border: "1px solid rgba(232,230,227,0.25)",
        borderRadius: "999px",
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "#b8b5b0",
      }}
    >
      {label}
    </span>
  );
}

/* ─── Stat Box ─── */
function StatBox({ label, value }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "1.2rem",
        border: "1px solid rgba(232,230,227,0.12)",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          fontWeight: 300,
          lineHeight: 1,
          marginBottom: "0.4rem",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#888",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default async function WorkDetailPage({ params }) {
  const { id } = await params;

  const work = works.find(
    (w) => w.id.toString() === id
  );
  if (!work) return notFound();

  const hasGallery = Array.isArray(work.gallery) && work.gallery.length > 0;
  const hasContent = Array.isArray(work.content) && work.content.length > 0;
  const hasStats = Array.isArray(work.stats) && work.stats.length > 0;
  const hasServices = Array.isArray(work.services) && work.services.length > 0;
  const hasCollaborators =
    Array.isArray(work.collaborators) && work.collaborators.length > 0;
  const hasTags = Array.isArray(work.tags) && work.tags.length > 0;
  const hasStory = work.story && (work.story.title || work.story.intro);

  return (
    <main className="subpage">
      <div className="scene" aria-hidden="true" style={{ opacity: 0.4 }}>
        <ParticleScene />
      </div>
      <div className="grain" />

      <Navigation />

      {/* ─── Hero ─── */}
      <section className="subpage-hero">
        <span className="eyebrow">
          {work.category} / {work.year}
          {work.month ? ` / ${work.month}` : ""}
        </span>
        <h1>{work.title.toUpperCase()}.</h1>
        {work.description && (
          <p
            style={{
              maxWidth: "720px",
              marginTop: "1.2rem",
              fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
              lineHeight: 1.5,
              color: "#b8b5b0",
            }}
          >
            {work.description}
          </p>
        )}
      </section>

      {/* ─── Cover Image ─── */}
      {work.coverImage && (
        <section className="subpage-content" style={{ paddingTop: 0 }}>
          <div className="content-block">
            <div className="project-detail-image">
              <img
                src={work.coverImage}
                alt={work.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ─── Project Info Bar ─── */}
      <section className="subpage-content" style={{ paddingTop: "1rem" }}>
        <div
          className="content-block"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1.5rem",
            padding: "1.5rem 0",
            borderTop: "1px solid rgba(232,230,227,0.12)",
            borderBottom: "1px solid rgba(232,230,227,0.12)",
          }}
        >
          {work.client && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "0.3rem",
                }}
              >
                Client
              </div>
              <div style={{ fontSize: "0.95rem" }}>{work.client}</div>
            </div>
          )}
          {work.location && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "0.3rem",
                }}
              >
                Location
              </div>
              <div style={{ fontSize: "0.95rem" }}>{work.location}</div>
            </div>
          )}
          {work.year && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "0.3rem",
                }}
              >
                Year
              </div>
              <div style={{ fontSize: "0.95rem" }}>{work.year}</div>
            </div>
          )}
          {hasServices && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "0.3rem",
                }}
              >
                Services
              </div>
              <div style={{ fontSize: "0.95rem" }}>
                {work.services.join(", ")}
              </div>
            </div>
          )}
          {hasCollaborators && (
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "0.3rem",
                }}
              >
                Collaborators
              </div>
              <div style={{ fontSize: "0.95rem" }}>
                {work.collaborators.join(", ")}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Tags ─── */}
      {hasTags && (
        <section className="subpage-content" style={{ paddingTop: 0 }}>
          <div
            className="content-block"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              paddingBottom: "1rem",
            }}
          >
            {work.tags.map((tag, i) => (
              <TagPill key={i} label={tag} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Stats ─── */}
      {hasStats && (
        <section className="subpage-content" style={{ paddingTop: 0 }}>
          <div
            className="content-block"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {work.stats.map((stat, i) => (
              <StatBox key={i} label={stat.label} value={stat.value} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Story Block ─── */}
      {hasStory && (
        <section className="subpage-content" style={{ paddingTop: 0 }}>
          <div className="content-block">
            {work.story.title && <h3>{work.story.title}</h3>}
            {work.story.intro && (
              <p
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  lineHeight: 1.5,
                  color: "#d0cdc8",
                }}
              >
                {work.story.intro}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ─── Long Description ─── */}
      {work.longDescription && (
        <section className="subpage-content" style={{ paddingTop: 0 }}>
          <div className="content-block">
            <h3>About the Project</h3>
            <p>{work.longDescription}</p>
          </div>
        </section>
      )}

      {/* ─── Rich Content Blocks ─── */}
      {hasContent && (
        <section className="subpage-content" style={{ paddingTop: 0 }}>
          {work.content.map((block, index) => (
            <ContentBlock block={block} index={index} key={index} workTitle={work.title} />
          ))}
        </section>
      )}

      {/* ─── Gallery (if no content blocks) !hasContent &&  ─── */}
      {hasGallery && (
        <section className="subpage-content" style={{ paddingTop: 0 }}>
          <ProjectGallery
            images={work.gallery}
            title={work.title}
          />
        </section>
      )}

      {/* ─── Credits ─── */}
      {work.credits && (
        <section className="subpage-content" style={{ paddingTop: 0 }}>
          <div
            className="content-block"
            style={{
              padding: "1.5rem 0",
              borderTop: "1px solid rgba(232,230,227,0.12)",
              fontSize: "0.85rem",
              color: "#888",
            }}
          >
            <div style={{ marginBottom: "0.3rem" }}>
              <strong style={{ color: "#e8e6e3" }}>Studio:</strong>{" "}
              {work.credits.studio}
            </div>
            {work.credits.client && (
              <div style={{ marginBottom: "0.3rem" }}>
                <strong style={{ color: "#e8e6e3" }}>Client:</strong>{" "}
                {work.credits.client}
              </div>
            )}
            {work.credits.collaborator && (
              <div style={{ marginBottom: "0.3rem" }}>
                <strong style={{ color: "#e8e6e3" }}>Collaborator:</strong>{" "}
                {work.credits.collaborator}
              </div>
            )}
            {work.credits.collaborators && (
              <div>
                <strong style={{ color: "#e8e6e3" }}>Collaborators:</strong>{" "}
                {Array.isArray(work.credits.collaborators)
                  ? work.credits.collaborators.join(", ")
                  : work.credits.collaborators}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Back Link ─── */}
      <section className="subpage-content" style={{ paddingTop: 0 }}>
        <div className="content-block">
          <Link href="/work" className="btn">
            ← ALL PROJECTS
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}