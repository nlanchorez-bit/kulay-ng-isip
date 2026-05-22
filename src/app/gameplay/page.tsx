"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Gameplay() {
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!pageRef.current) return;

    // 1. Scroll reveal (Intersection Observer)
    const reveals = pageRef.current.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -60px 0px" }
    );
    
    // Slight timeout ensures DOM paints before observing
    setTimeout(() => {
      reveals.forEach((el) => obs.observe(el));
    }, 100);

    // 2. Scroll Listener (Parallax + Scroll To Top)
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.35}px`;
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      obs.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="gp-page-wrapper" ref={pageRef}>
      <Header />

      {/* ══════════════ HERO ══════════════ */}
      <section className="gp-page-hero" ref={heroRef}>
        <div className="gp-page-hero-content">
          <h1>Gameplay</h1>
          <p>Explore, mix colors, and bring life back to a world drained of hues</p>
        </div>
      </section>

      {/* ══════════════ OVERVIEW ══════════════ */}
      <section className="gp-overview-strip">
        {/* blobs */}
        <div className="gp-overview-blob" style={{ background: "#f97316", width: 320, height: 320, top: -80, left: -80 }} />
        <div className="gp-overview-blob" style={{ background: "#6366f1", width: 280, height: 280, bottom: -60, right: -60 }} />

        {/* Removed 'reveal' so it renders instantly on load */}
        <div className="gp-overview-grid">
          <div className="gp-overview-text">
            <span className="gp-eyebrow">How It Works</span>
            <h2 className="gp-section-title" style={{ color: "#1a1a2e" }}>
              Exploration,<br />
              <span className="gp-gradient-text-inline">
                Combat & Color
              </span>
            </h2>
            <div className="gp-rule-divider">
              <div className="gp-rline" style={{ background: "var(--orange)" }} />
              <div className="gp-rdot" style={{ background: "var(--pink)" }} />
              <div className="gp-rline" style={{ background: "var(--indigo)" }} />
            </div>
            <p>
              Kulay ng Isip blends adventure with learning. You roam through
              a world stripped of color, solving puzzles and battling enemies
              by mixing primary, secondary, and tertiary hues.<br /><br />
              Every color you restore unlocks a new ability — master the
              color wheel and you master the world.
            </p>
          </div>

          <div className="gp-overview-img-wrap">
            <img src="https://i.imgur.com/uMAvd6X.jpeg" alt="Gameplay screenshot" />
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="gp-features-section">
        <div className="gp-features-header reveal">
          <span className="gp-eyebrow">Core Mechanics</span>
          <h2 className="gp-section-title">
            What You'll <span className="gp-gradient-text">Experience</span>
          </h2>
        </div>

        <div className="gp-features-grid">
          <div className="gp-feature-card gp-c-orange reveal" style={{ transitionDelay: ".0s" }}>
            <span className="gp-feature-icon">🎨</span>
            <h3>Color Mixing</h3>
            <p>Combine primary colors in real time to create new hues, each unlocking a unique spell or path forward.</p>
          </div>

          <div className="gp-feature-card gp-c-pink reveal" style={{ transitionDelay: ".08s" }}>
            <span className="gp-feature-icon">⚔️</span>
            <h3>Color Combat</h3>
            <p>Fight enemies using color-based abilities. Mix the right hues to exploit weaknesses and deal maximum damage.</p>
          </div>

          <div className="gp-feature-card gp-c-indigo reveal" style={{ transitionDelay: ".16s" }}>
            <span className="gp-feature-icon">🌍</span>
            <h3>World Exploration</h3>
            <p>Traverse three hand-crafted environments, each drained of a different color family waiting to be restored.</p>
          </div>

          <div className="gp-feature-card gp-c-yellow reveal" style={{ transitionDelay: ".24s" }}>
            <span className="gp-feature-icon">🧩</span>
            <h3>Puzzle Solving</h3>
            <p>Navigate color-locked doors, bridges, and mechanisms by applying the correct color combinations.</p>
          </div>

          <div className="gp-feature-card gp-c-teal reveal" style={{ transitionDelay: ".32s" }}>
            <span className="gp-feature-icon">📖</span>
            <h3>Story & Lore</h3>
            <p>Uncover why the world lost its colors and piece together the mystery through collectible story fragments.</p>
          </div>

          <div className="gp-feature-card gp-c-rose reveal" style={{ transitionDelay: ".40s" }}>
            <span className="gp-feature-icon">🏆</span>
            <h3>Color Mastery</h3>
            <p>Earn color badges for each theory concept you master — collect them all to unlock the true ending.</p>
          </div>
        </div>
      </section>

      {/* ══════════════ STAGES ══════════════ */}
      <section className="gp-stages-section">
        <div className="gp-stages-header reveal">
          <span className="gp-eyebrow">Game World</span>
          <h2 className="gp-section-title">
            Three <span className="gp-gradient-text">Stages</span> to Restore
          </h2>
          <p style={{ color: "rgba(255,255,255,.55)", fontSize: "1rem", marginTop: ".5rem" }}>
            Hover each stage to explore it
          </p>
        </div>

        <div className="gp-stages-grid reveal" style={{ transitionDelay: ".1s" }}>
          <div className="gp-stage-item">
            <img src="https://i.imgur.com/uMAvd6X.jpeg" alt="Stage 1" />
            <div className="gp-stage-item-overlay">
              <div className="gp-stage-number">01</div>
              <span className="gp-stage-tag tag-primary">Primary Colors</span>
              <h3>Kapatagang Guhit</h3>
              <p>A vast plain drained of all red. Restore crimson to awaken its sleeping guardians.</p>
            </div>
          </div>

          <div className="gp-stage-item">
            <img src="https://i.imgur.com/pL3Dczv.jpeg" alt="Stage 2" />
            <div className="gp-stage-item-overlay">
              <div className="gp-stage-number">02</div>
              <span className="gp-stage-tag tag-secondary">Secondary Colors</span>
              <h3>Luntian Grove</h3>
              <p>A dense forest where green has vanished. Mix blue and yellow to revive the canopy.</p>
            </div>
          </div>

          <div className="gp-stage-item">
            <img src="https://i.imgur.com/T4ynOP4.jpeg" alt="Stage 3" />
            <div className="gp-stage-item-overlay">
              <div className="gp-stage-number">03</div>
              <span className="gp-stage-tag tag-tertiary">Tertiary Colors</span>
              <h3>Lake Pintados</h3>
              <p>An ancient lake shrouded in grey. Master all tertiary hues to unlock its final secret.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="gp-cta-band reveal">
        <div className="gp-cta-band-inner">
          <h2>Ready to Paint the World?</h2>
          <p>Jump into the adventure and discover what happens when color meets courage.</p>
          <Link href="/#play" className="gp-btn-cta">
            Play Now
          </Link>
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