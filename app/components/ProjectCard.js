import Link from "next/link";

export default function ProjectCard({ project, index }) {
  return (
    <Link href={`/work/${project.id}`} className="project-card">
      <div className="project-image">
        <div className="project-placeholder" style={{ backgroundPosition: `${index * 20}% ${index * 30}%` }} />
        <div className="project-overlay" />
      </div>
      <div className="project-info">
        <span className="project-meta">{project.category} / {project.year}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
    </Link>
  );
}