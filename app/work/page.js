import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleScene";
import ProjectCard from "../components/ProjectCard";
import { works } from "../data/works";

export const metadata = {
  title: "Work — WENODES",
  description: "Selected projects by WENODES."
};

export default function WorkPage() {
  return (
    <main className="subpage">
      <div className="scene" aria-hidden="true" style={{ opacity: 0.4 }}>
        <ParticleScene />
      </div>
      <div className="grain" />
      
      <Navigation />
      
      <section className="subpage-hero">
        <span className="eyebrow">02 — WORK</span>
        <h1>SELECTED<br />PROJECTS.</h1>
      </section>
      
      <section className="subpage-content">
        <div className="projects-grid full">
          {works.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}