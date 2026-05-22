"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

// 1. Team Data Array
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Niko Luis Anchorez",
    role: "Project Manager",
    image: "https://i.imgur.com/7w9HTnv.png", 
    description: "The leadership behind the project. Niko actively manages the team, administrative, and quality assurance that keeps the development aligned with the game's stakeholders. He oversees the entire development pipeline, bridging the gap between technical architecture and creative game design.",
  },
  {
    id: 2,
    name: "Alexander Jay Eliarda",
    role: "Development Engineer",
    image: "https://i.imgur.com/T8lmHSC.png", 
    description: "The strongarm in development. Alex is responsible for spearheading the architecture, and development of the game by providing hands-on hardwork to the success of the development timeline.",
  },
  {
    id: 3,
    name: "Gabriel Miro Velasco",
    role: "Development Engineer",
    image: "https://i.imgur.com/O64jrA2.png", 
    description: "Another strongarm in development. Miro works hand-in-hand with his team ensuring the game is aligned with our development goals through his meticulous work ethic that makes the game effective and unforgettable.",
  },
  {
    id: 4,
    name: "Althaea Japon",
    role: "Art Designer",
    image: "https://i.imgur.com/MDeOik1.png", 
    description: "The creativity behind the game's identity. Althaea creates vibrant visual identity of Kulay ng Isip through the characters, environments, and 2D art assets that make exploring the game world immersive.",
  }
];

export default function TeamPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Scroll reveal observer
    const reveals = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    reveals.forEach((el) => obs.observe(el));

    // Scroll to top visibility
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      obs.disconnect();
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main className="about-wrapper">
      <Header />

      {/* ══════════════ PREMIUM STUDIO HERO ══════════════ */}
      <section className="studio-hero">
        
        {/* Animated Background Elements */}
        <div className="studio-hero-bg">
          <div className="hero-glow glow-orange"></div>
          <div className="hero-glow glow-indigo"></div>
          <div className="hero-grid"></div>
        </div>

        {/* Hero Content */}
        <div className="studio-hero-content">
          <div className="studio-badge reveal">
            <span className="pulse-dot"></span>
            Behind the Scenes
          </div>
          
          <h1 className="reveal" style={{ transitionDelay: "0.1s" }}>
            TechTytes <br/>
            <span className="gradient-text">Game Studios</span>
          </h1>
          
          <p className="reveal" style={{ transitionDelay: "0.2s" }}>
            We are a passionate team of developers dedicated to uplifting the creativity of the Filipino through interactive media.
          </p>
        </div>
        
        {/* Subtle fade divider at the bottom */}
        <div className="studio-hero-fade"></div>
      </section>

      {/* ══════════════ SPLIT TEAM LAYOUT ══════════════ */}
      <section className="team-split-layout">
        
        {/* Left Side: Sticky Studio Info */}
        <div className="team-split-left reveal">
          <span className="about-eyebrow" style={{ color: "var(--indigo)" }}>The Developers</span>
          <h2>Meet the <br/>Minds Behind<br/>the Colors.</h2>
          <p>
            Building <strong>Kulay ng Isip</strong> takes a lot of talents. From programming complex physics and crafting 3D environments to designing each element, every member of our studio brings a unique brushstroke to the canvas.
          </p>
        </div>

        {/* Right Side: 2x2 Grid of Cards */}
        <div className="team-split-right">
          <div className="team-grid-2x2">
            {TEAM_MEMBERS.map((member, index) => (
              <div 
                key={member.id} 
                className="team-card reveal" 
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="team-card-image">
                  <img src={member.image} alt={member.name} />
                  <div className="team-card-overlay"></div>
                </div>
                
                <div className="team-card-content">
                  <span className="team-role-badge">{member.role}</span>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-desc">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="about-cta reveal">
        <h2>Want to support the project?</h2>
        <p>Follow our development journey or download the latest build to playtest.</p>
        <div className="about-cta-buttons">
          <Link href="/blog" className="btn-secondary">Read Dev Blog</Link>
          <Link href="/play" className="btn-primary">Download Game</Link>
        </div>
      </section>

      {/* Scroll-to-top */}
      <button
        id="scrollTopBtn"
        title="Back to top"
        onClick={scrollToTop}
        style={{ display: showScrollTop ? "flex" : "none" }}
      >
        ↑
      </button>

      <Footer />
    </main>
  );
}