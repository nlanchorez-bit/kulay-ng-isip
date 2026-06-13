"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";

export default function About() {
  const pageRef = useRef<HTMLElement>(null); // Safely scope our animations to this page
  const heroRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!pageRef.current) return;

    // 1. Safely query ONLY elements inside this specific page
    const reveals = pageRef.current.querySelectorAll(".reveal");
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revObs.unobserve(e.target);
          }
        });
      },
      // Lowered the threshold slightly so it triggers easier on fast scrolls
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" } 
    );
    
    // Slight timeout ensures the Next.js DOM is fully painted before observing
    setTimeout(() => {
      reveals.forEach((el) => revObs.observe(el));
    }, 100);

    // 2. Scroll Listener
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.35}px`;
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      revObs.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="about-page-wrapper" ref={pageRef}>
      <Header />

      {/* ══════════════ PAGE HERO ══════════════ */}
      <section className="about-hero" ref={heroRef}>
        <h1>About the Game</h1>
      </section>

      {/* ══════════════ OVERVIEW ══════════════ */}
      <section className="about-overview">
        <div className="about-overview-inner">

          {/* Row 1: About 
              FIX: Removed 'reveal' so it renders instantly on page load! */}
          <div className="about-row">
            <div className="about-row-text">
              <h2>Kulay ng Isip is a game about<br />colors, creativity, and imagination</h2>
              <p>
                Learn about colors by playing and trying things out.<br />
                You can mix colors, discover new ones, and see<br />
                what happens when you experiment.<br /><br />
                Your choices and ideas make each experience different.
              </p>
            </div>
            <div className="about-row-img">
              <img src="https://i.imgur.com/2CVEDPV.png" alt="Main Character" />
            </div>
          </div>

          {/* Row 2: How to play 
              FIX: Removed 'reveal' so it renders instantly on page load! */}
          <div className="about-row reverse">
            <div className="about-row-text">
              <h2>How Do You Play?</h2>
              <p>You play differently by exploring the world of colors. Try different combinations and solve fun challenges in your own way.</p>
              <ul>
                <li>Mix colors</li>
                <li>Test ideas</li>
                <li>Discover something new</li>
              </ul>
              <p style={{ marginTop: ".85rem" }}>The game lets you learn by doing and gaming at the same time.</p>
            </div>
            <div className="about-row-img">
              <img src="https://i.imgur.com/rwFjo7Z.png" alt="Canvas NPC" />
            </div>
          </div>

          {/* Mix heading (Kept reveal because you scroll to this) */}
          <div className="about-mix-heading reveal" style={{ transitionDelay: ".15s" }}>
            <h2>Mix colors to solve and fight</h2>
            <p>
              Learning doesn't have to feel like homework. Here, learning feels like a game.
              As you play, you will understand colors, shapes, and ideas in a fun and exciting way.
            </p>
          </div>

          {/* Stage cards */}
          <div className="stages">
            <div className="stage-card reveal" style={{ transitionDelay: ".2s" }}>
              <img src="https://i.imgur.com/pL3Dczv.jpeg" alt="Stage 1 Environment" />
              <div className="stage-card-overlay" style={{ background: "var(--green-tint)" }} />
              <div className="stage-card-label">Stage 1 Environment</div>
            </div>

            <div className="stage-card reveal" style={{ transitionDelay: ".3s" }}>
              <img src="https://i.imgur.com/T4ynOP4.jpeg" alt="Stage 2 Environment" />
              <div className="stage-card-overlay" style={{ background: "var(--blue-tint)" }} />
              <div className="stage-card-label">Stage 2 Environment</div>
            </div>

            <div className="stage-card reveal" style={{ transitionDelay: ".4s" }}>
              <img src="https://i.imgur.com/uMAvd6X.jpeg" alt="Stage 3 Environment" />
              <div className="stage-card-overlay" style={{ background: "var(--red-tint)" }} />
              <div className="stage-card-label">Stage 3 Environment</div>
            </div>
          </div>

        </div>
      </section>
{/* ══════════════ MEET THE TEAM CTA ══════════════ */}
      <section className="about-team-cta reveal">
        <div className="team-cta-inner">
          <div className="team-cta-content">
            <span className="eyebrow">The Studio</span>
            <h2>Meet the <span className="gradient-text">Developers</span></h2>
            <p>
              Discover the passionate team of developers at 
              <strong> TechTytes Game Studios</strong> working hard to bring Kulay ng Isip to life.
            </p>
            <Link href="/team" className="btn-team-link">
              Get to know us <span className="arrow">→</span>
            </Link>
          </div>
          <div className="team-cta-visual">
            {/* A decorative overlapping layout to make it look premium */}
            <div className="team-visual-bg"></div>
            <img src="https://i.imghippo.com/files/HDHU5101tbg.png" alt="Arterion Development Team" className="team-visual-img" />
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section className="faq">
        <div className="faq-inner">
          <h2>Frequently Asked Questions</h2>

          {/* Wrap in a static 'reveal' div so React doesn't wipe out the 'visible' class! */}
          <div className="reveal">
            <div className={`faq-item ${openFaq === 0 ? "open" : ""}`}>
              <button className="faq-question" aria-expanded={openFaq === 0} onClick={() => toggleFaq(0)}>
                What is this game about?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                Kulay ng Isip is a 3D adventure-based educational PC game that teaches children about Color Theory in Arts. You explore a magical world that has lost its colors, solving puzzles and mixing hues to restore life and creativity.
              </div>
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: ".08s" }}>
            <div className={`faq-item ${openFaq === 1 ? "open" : ""}`}>
              <button className="faq-question" aria-expanded={openFaq === 1} onClick={() => toggleFaq(1)}>
                Who can play this game?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                The game is designed for children who want to learn about colors and art in an engaging way, but anyone who loves adventure and creativity can enjoy it!
              </div>
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: ".16s" }}>
            <div className={`faq-item ${openFaq === 2 ? "open" : ""}`}>
              <button className="faq-question" aria-expanded={openFaq === 2} onClick={() => toggleFaq(2)}>
                What will I learn from the game?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                You'll learn the fundamentals of Color Theory — primary, secondary, and tertiary colors — through hands-on mixing, puzzle-solving, and exploration across three unique stage environments.
              </div>
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: ".24s" }}>
            <div className={`faq-item ${openFaq === 3 ? "open" : ""}`}>
              <button className="faq-question" aria-expanded={openFaq === 3} onClick={() => toggleFaq(3)}>
                Do I need to know about colors before playing?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                Not at all! The game is built to teach you everything from scratch. Just jump in, experiment, and discover — the adventure will guide you every step of the way.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════ CTA STRIP ══════════════ */}
      <section className="cta-strip reveal">
        <h2>Ready to Start Your Adventure?</h2>
        <p>Join the community, share your discoveries, and bring color back to the world!</p>
        <Link href="/forum" className="btn-cta">
          Visit the Forum
        </Link>
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