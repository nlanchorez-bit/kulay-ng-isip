"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase"; 
import "./globals.css";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Refs for the floating ambient blobs
  const leftBlobRef = useRef<HTMLDivElement>(null);
  const rightBlobRef = useRef<HTMLDivElement>(null);

  // 1. State for the Game Installer & Testimonials
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [gameVersion, setGameVersion] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    // 2. Fetch the live download link and dynamic testimonials from CMS
    async function fetchData() {
      // Fetch Installer
      const { data: installerData, error: installerError } = await supabase
        .from("game_installer")
        .select("windows_url, version")
        .eq("id", 1)
        .single();

      if (!installerError && installerData?.windows_url) {
        setDownloadUrl(installerData.windows_url);
        setGameVersion(installerData.version);
      }

      // Fetch Testimonials
      const { data: testData, error: testError } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (!testError && testData) {
        setTestimonials(testData);
      }
    }
    fetchData();

    // Scroll reveal (Intersection Observer)
    const reveals = document.querySelectorAll(".reveal");
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    reveals.forEach((el) => revealObs.observe(el));

    // Scroll Listener (Parallax + Scroll To Top)
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${scrollY * 0.4}px`;
      }

      // Move blobs down dynamically based on scroll depth
      if (leftBlobRef.current) {
        leftBlobRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
      
      if (rightBlobRef.current) {
        rightBlobRef.current.style.transform = `translateY(${scrollY * 0.25}px)`;
      }

      setShowScrollTop(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealObs.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper variables to split testimonials into two distinct rows
  const midpoint = Math.ceil(testimonials.length / 2);
  const topRowTestimonials = testimonials.slice(0, midpoint);
  const bottomRowTestimonials = testimonials.slice(midpoint);

  return (
    <>
      {/* The Ambient Background Blobs */}
      <div className="ambient-background">
        <div ref={leftBlobRef} className="ambient-blob blob-left"></div>
        <div ref={rightBlobRef} className="ambient-blob blob-right"></div>
      </div>

      <Header />

      {/* ══════════════ HERO ══════════════ */}
      <section className="hero" id="hero" ref={heroRef}>
        <div className="hero-content">
          <img
            src="https://i.imgur.com/pqTeuRO.png"
            alt="Kulay ng Isip"
            className="hero-title-img"
          />
          <img
            src="https://i.imgur.com/BtZyQ9Q.png"
            alt="A 3D Adventure-based Educational PC Game"
            className="hero-sub-img"
          />
          
          {/* 3. Dynamic Play/Download Button */}
          {downloadUrl ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                <a 
                  href={downloadUrl} 
                  className="btn-play" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download Windows PC
                </a>
                
                {/* Link to the WebGL Play Route */}
                <Link href="/play" className="btn-play" style={{ background: "var(--indigo)" }}>
                  Play in Browser
                </Link>
              </div>

              {gameVersion && (
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", fontWeight: 700, letterSpacing: "0.05em" }}>
                  Latest Build: {gameVersion}
                </span>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/play" className="btn-play">
                Play in Browser
              </Link>
              <Link href="/gameplay" className="btn-play" style={{ background: "var(--indigo)" }}>
                Explore Gameplay
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section className="about" id="about">
        <div
          className="blob"
          style={{ background: "#f97316", width: 220, height: 220, top: -40, left: -60 }}
        />
        <div
          className="blob"
          style={{ background: "#60a5fa", width: 220, height: 220, top: -20, right: -60 }}
        />
        <div
          className="blob"
          style={{
            background: "#f472b6",
            width: 260,
            height: 120,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <p className="eyebrow">About the Game</p>
          <h2>
            <span className="gradient-text">Bring color back.</span>
            <br />
            <span style={{ color: "#1e1b4b" }}>Play, learn, and create!</span>
          </h2>

          <div className="divider">
            <div className="divider-line" style={{ background: "var(--orange)" }} />
            <div className="divider-dot" style={{ background: "var(--pink)" }} />
            <div className="divider-line" style={{ background: "var(--indigo)" }} />
          </div>

          <p>
            Kulay ng Isip is a fun PC game where you go on an adventure inside a{" "}
            <span className="hi">magical world that has lost its colors.</span> You will solve
            puzzles, mix colors, and help bring <span className="ho">happiness and creativity</span>{" "}
            back to the land.
          </p>
        </div>
      </section>

      {/* ══════════════ COLOR CARDS ══════════════ */}
      <section className="color-cards">
        <div className="color-cards-grid">
          <div className="color-card reveal">
            <img
              src="https://i.pinimg.com/1200x/11/7a/e2/117ae2efcbacce6aff0fcf32c6a589ee.jpg"
              alt="Primary Colors"
            />
            <div className="color-card-label">
              <h4>Primary<br />Colors</h4>
            </div>
          </div>

          <div className="color-card reveal" style={{ transitionDelay: ".12s" }}>
            <img
              src="https://i.pinimg.com/736x/f6/9f/b9/f69fb955aebe93c0bb4c606be8d02b8a.jpg"
              alt="Secondary Colors"
            />
            <div className="color-card-label">
              <h4>Secondary<br />Colors</h4>
            </div>
          </div>

          <div className="color-card reveal" style={{ transitionDelay: ".24s" }}>
            <img
              src="https://i.pinimg.com/1200x/be/ab/83/beab835cb836a4fd83dc91f9476ed6d3.jpg"
              alt="Tertiary Colors"
            />
            <div className="color-card-label">
              <h4>Tertiary<br />Colors</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ OVERVIEW ══════════════ */}
      <section
        className="overview"
        id="overview"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/bc/d9/c4/bcd9c48f8baa8755f593b048dc8eb47d.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src="https://i.imghippo.com/files/HDHU5101tbg.png"
          alt="Main Character"
          className="overview-img reveal"
        />

        <div className="overview-text reveal" style={{ transitionDelay: ".15s" }}>
          <p className="eyebrow">— Game Feature</p>
          <h2>
            Learn While<br />
            <span className="grad">You Play</span>
          </h2>
          <div className="overview-rule" />
          <p>
            Learning doesn't have to feel like homework.<br />
            Here, <span className="hi">learning feels like a game.</span><br />
            <br />
            As you play, you'll understand colors, shapes,<br />
            and ideas in a fun and exciting way.
          </p>
        </div>
      </section>

      {/* ══════════════ MEDIA ══════════════ */}
      <section className="media" id="media">
        <div className="media-inner">
          <div className="video-wrap reveal">
            <iframe
              src="https://www.youtube.com/embed/P0zST6dPHgY?si=8UhB6Xp5ynN1muCN"
              title="Kulay ng Isip Trailer"
              allowFullScreen
            />
          </div>

          <div className="screenshots">
            <img src="https://i.imgur.com/0AABy9S.png" alt="Screenshot 1" className="reveal" />
            <img src="https://i.imgur.com/5RTyZyz.png" alt="Screenshot 2" className="reveal" style={{ transitionDelay: ".08s" }} />
            <img src="https://i.imgur.com/BTs8f9E.png" alt="Screenshot 3" className="reveal" style={{ transitionDelay: ".16s" }} />
            <img src="https://i.imgur.com/48YRKLq.png" alt="Screenshot 4" className="reveal" style={{ transitionDelay: ".24s" }} />
            <img src="https://i.imgur.com/UBSnouG.png" alt="Screenshot 5" className="reveal" style={{ transitionDelay: ".32s" }} />
            <img src="https://i.imgur.com/svKwXRT.png" alt="Screenshot 6" className="reveal" style={{ transitionDelay: ".40s" }} />
          </div>

          {/* WHY IT WORKS (Padding reduced here to pull testimonials up) */}
          <div className="why reveal" style={{ paddingBottom: "2rem" }}>
            <p className="eyebrow">Why It Works</p>
            <h2>
              Gamifying a<br />
              <span className="gradient-text">Learning Approach</span>
            </h2>

            <div className="divider">
              <div className="divider-line" style={{ background: "var(--yellow)" }} />
              <div className="divider-dot" style={{ background: "var(--pink)" }} />
              <div className="divider-line" style={{ background: "var(--orange)" }} />
            </div>

            <p>
              A proven way that learners appreciate and effectively learn all about{" "}
              <span className="hi">Color Theory</span> through our game,{" "}
              <span className="bold">Kulay ng Isip!</span>
            </p>

            <a href="/downloads/study.pdf" download className="btn-download">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 15.5h1.8c.9 0 1.5-.6 1.5-1.5s-.6-1.5-1.5-1.5H8v5h.5v-2zm0-2.5h1.3c.6 0 1 .4 1 1s-.4 1-1 1H8.5v-2zm5 .5h-.5v4h.5c1.1 0 2-.9 2-2s-.9-2-2-2zm0 3.5h-.5v-3h.5c.8 0 1.5.7 1.5 1.5S14.3 17 13.5 17zm3-3.5h2.5v.5H17v1.5h2v.5h-2V17h-.5v-3.5z" />
              </svg>
              Download our Study
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS (DUAL MARQUEE) ══════════════ */}
      {testimonials.length > 0 && (
        <section className="testimonials">
          <div className="testimonials-inner">
            
            {/* REMOVED the 'reveal' class so this title never gets stuck invisible */}
            <div className="testimonials-header">
              <p className="eyebrow" style={{ color: "var(--pink)" }}>Community Feedback</p>
              <h2 style={{ fontSize: "2.5rem", fontFamily: "'Fredoka One', cursive", marginBottom: "1rem" }}>
                Hear from the <span className="gradient-text">Players</span>
              </h2>
            </div>

            <div className="marquee-wrapper">
              
              {/* TOP ROW: Moves Right */}
              <div className="marquee-track scroll-right">
                {[...topRowTestimonials, ...topRowTestimonials].map((t, i) => (
                  <div key={`top-${t.id}-${i}`} className="message-blob">
                    <p className="message-text">"{t.content}"</p>
                    <div className="message-author">
                      <div className="author-avatar" style={{ background: t.avatar_color }}>
                        {t.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="author-info">
                        <strong>{t.author_name}</strong>
                        <span>{t.author_role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTTOM ROW: Moves Left (Only render if we have enough testimonials) */}
              {bottomRowTestimonials.length > 0 && (
                <div className="marquee-track scroll-left">
                  {[...bottomRowTestimonials, ...bottomRowTestimonials].map((t, i) => (
                    <div key={`bottom-${t.id}-${i}`} className="message-blob">
                      <p className="message-text">"{t.content}"</p>
                      <div className="message-author">
                        <div className="author-avatar" style={{ background: t.avatar_color }}>
                          {t.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="author-info">
                          <strong>{t.author_name}</strong>
                          <span>{t.author_role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ══════════════ PARENTS & EDUCATORS HUB ══════════════ */}
      <section className="educators-hub reveal">
        <div className="hub-inner">
          <div className="hub-header">
            <p className="eyebrow" style={{ color: "var(--indigo)" }}>For Parents & Teachers</p>
            <h2>Safe. Educational. <span className="gradient-text">Inspiring.</span></h2>
            <p>Designed specifically for young learners aged 7 to 12, Kulay ng Isip provides a worry-free environment where foundational art concepts take center stage.</p>
          </div>

          <div className="hub-grid">
            {/* Card 1: Safety */}
            <div className="hub-card">
              <div className="hub-icon">🛡️</div>
              <h3>100% Kid-Safe</h3>
              <p>No microtransactions, no hidden fees, and no online chat. Just a secure, single-player PC adventure that can be played entirely offline.</p>
            </div>

            {/* Card 2: Educational Value */}
            <div className="hub-card">
              <div className="hub-icon">🧠</div>
              <h3>Curriculum Aligned</h3>
              <p>Mechanics are built around real color theory, reinforcing pattern recognition, problem-solving, and primary-to-tertiary color mixing.</p>
            </div>

            {/* Card 3: Creativity */}
            <div className="hub-card">
              <div className="hub-icon">🎨</div>
              <h3>Sparks Imagination</h3>
              <p>We don't just test knowledge; we encourage children to experiment with colors and understand the artistic process through play.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA STRIP ══════════════ */}
      <section className="cta-strip reveal">
        <h2>Ready to Explore?</h2>
        <p>Join the adventure, read the latest patch notes, and help bring color back to the world!</p>
        <Link href="/blog" className="btn-cta">
          Visit the Dev Blog
        </Link>
      </section>

      {/* Scroll-to-top */}
      <button
        id="scrollTopBtn"
        title="Back to top"
        onClick={scrollToTop}
        style={{
          display: showScrollTop ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ↑
      </button>

      <Footer />
    </>
  );
}