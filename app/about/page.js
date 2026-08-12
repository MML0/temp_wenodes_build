import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleScene";
import Link from "next/link";

export const metadata = {
  title: "About — WENODES",
  description: "We build experiences that behave like living systems."
};

export default function AboutPage() {
  return (
    <main className="subpage">
      <div className="scene" aria-hidden="true" style={{ opacity: 0.4 }}>
        <ParticleScene />
      </div>
      <div className="grain" />
      
      <Navigation />
      
      <section className="subpage-hero">
        <span className="eyebrow">01 — ABOUT</span>
        <h1>WE ARE<br />WENODES.</h1>
      </section>
      
      <section className="subpage-content">
        <div className="content-block">
          <h3>Philosophy</h3>
          <p>
            We believe technology should feel alive. Our work sits at the intersection 
            of code, art, and human emotion — creating systems that breathe, respond, 
            and evolve. Every project is an experiment in making the invisible visible.
          </p>
        </div>
        
        <div className="content-block">
          <h3>Process</h3>
          <p>
            We start with chaos — raw ideas, broken assumptions, and curiosity. 
            Through rapid prototyping and obsessive refinement, we shape that chaos 
            into experiences that feel inevitable. No templates. No shortcuts. 
            Only craft.
          </p>
        </div>
        
        <div className="content-block">
          <h3>Capabilities</h3>
          <ul className="capabilities-list">
            <li>Real-time 3D & WebGL</li>
            <li>Generative Design Systems</li>
            <li>Interactive Installations</li>
            <li>Creative Direction</li>
            <li>Spatial Audio Design</li>
            <li>AI & Machine Learning Art</li>
          </ul>
        </div>
        
        <div className="content-block">
          <h3>Contact</h3>
          <p>
            hello@wenodes.studio<br />
            Based in Seoul / Tokyo / Berlin
          </p>
          <div style={{ marginTop: "32px" }}>
            <Link href="/join" className="btn">APPLY TO JOIN ↗</Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}