import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ParticleScene from "../../components/ParticleScene";
import { works } from "../../data/works";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id.toString() }));
}

export function generateMetadata({ params }) {
  const work = works.find((w) => w.id.toString() === params.id);
  return {
    title: work ? `${work.title} — WENODES` : "Work — WENODES",
  };
}

export default function WorkDetailPage({ params }) {
  const work = works.find((w) => w.id.toString() === params.id);
  if (!work) return notFound();

  return (
    <main className="subpage">
      <div className="scene" aria-hidden="true" style={{ opacity: 0.4 }}>
        <ParticleScene />
      </div>
      <div className="grain" />
      
      <Navigation />
      
      <section className="subpage-hero">
        <span className="eyebrow">{work.category} / {work.year}</span>
        <h1>{work.title.toUpperCase()}.</h1>
      </section>
      
      <section className="subpage-content">
        <div className="content-block">
          <div className="project-detail-image">
            <div className="project-placeholder" style={{ height: "50vh" }} />
          </div>
        </div>
        <div className="content-block">
          <h3>About the Project</h3>
          <p>{work.description}</p>
        </div>
        <div className="content-block">
          <Link href="/work" className="btn">← ALL PROJECTS</Link>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}