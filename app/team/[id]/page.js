import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import ParticleScene from "../../components/ParticleScene";
import { team } from "../../data/team";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return team.map((member) => ({ id: member.id.toString() }));
}

export function generateMetadata({ params }) {
  const member = team.find((m) => m.id.toString() === params.id);
  return {
    title: member ? `${member.nickname} — WENODES` : "Team — WENODES",
  };
}

export default function TeamDetailPage({ params }) {
  const member = team.find((m) => m.id.toString() === params.id);
  if (!member) return notFound();

  return (
    <main className="subpage">
      <div className="scene" aria-hidden="true" style={{ opacity: 0.4 }}>
        <ParticleScene />
      </div>
      <div className="grain" />
      
      <Navigation />
      
      <section className="subpage-hero">
        <span className="eyebrow">{member.role}</span>
        <h1>{member.nickname}.</h1>
      </section>
      
      <section className="subpage-content">
        <div className="content-block">
          <div className="member-detail-avatar">
            <div className="member-placeholder" style={{ height: "40vh", width: "100%" }} />
          </div>
        </div>
        <div className="content-block">
          <h3>{member.fullName}</h3>
          <p>{member.bio}</p>
        </div>
        <div className="content-block">
          <Link href="/team" className="btn">← ALL MEMBERS</Link>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}