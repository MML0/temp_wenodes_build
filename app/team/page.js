import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleScene";
import MemberCard from "../components/MemberCard";
import { team } from "../data/team";

export const metadata = {
  title: "Team — WENODES",
  description: "The people behind WENODES."
};

export default function TeamPage() {
  return (
    <main className="subpage">
      <div className="scene" aria-hidden="true" style={{ opacity: 0.4 }}>
        <ParticleScene />
      </div>
      <div className="grain" />
      
      <Navigation />
      
      <section className="subpage-hero">
        <span className="eyebrow">03 — TEAM</span>
        <h1>THE<br />CREW.</h1>
      </section>
      
      <section className="subpage-content">
        <div className="team-grid full">
          {team.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}