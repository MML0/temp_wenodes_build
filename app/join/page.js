"use client";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ParticleScene from "../components/ParticleScene";
import { useState } from "react";

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="subpage">
      <div className="scene" aria-hidden="true" style={{ opacity: 0.4 }}>
        <ParticleScene />
      </div>
      <div className="grain" />
      
      <Navigation />
      
      <section className="subpage-hero">
        <span className="eyebrow">04 — JOIN</span>
        <h1>JOIN THE<br />COLLECTIVE.</h1>
      </section>
      
      <section className="subpage-content">
        <div className="content-block">
          <p style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.4, opacity: 0.8 }}>
            We are always looking for curious minds — developers, designers, 
            artists, and dreamers who want to push the boundaries of digital craft.
          </p>
        </div>
        
        {submitted ? (
          <div className="content-block success-message">
            <h3>Application Received.</h3>
            <p>We will review your submission and get back to you within 7 days.</p>
          </div>
        ) : (
          <form className="join-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required placeholder="Your name" />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" required placeholder="you@example.com" />
            </div>
            
            <div className="form-group">
              <label>Portfolio / Website</label>
              <input type="url" placeholder="https://your-portfolio.com" />
            </div>
            
            <div className="form-group">
              <label>Role</label>
              <select required>
                <option value="">Select a role...</option>
                <option value="developer">Creative Developer</option>
                <option value="designer">Interaction Designer</option>
                <option value="artist">Generative Artist</option>
                <option value="audio">Sound Designer</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Bio / Message</label>
              <textarea rows={5} required placeholder="Tell us about yourself and why you want to join..." />
            </div>
            
            <button type="submit" className="btn btn-large">SUBMIT APPLICATION ↗</button>
          </form>
        )}
      </section>
      
      <Footer />
    </main>
  );
}