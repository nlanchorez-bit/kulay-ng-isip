"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase"; 

type GalleryImage = {
  id: number;
  image_url: string;
  description: string | null;
};

export default function Gallery() {
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Data State
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightbox, setLightbox] = useState<{ src: string; desc: string } | null>(null);

  // Fetch from Supabase
  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("id, image_url, description")
          .order("id", { ascending: false });

        if (error) throw error;
        if (data) setImages(data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Scroll & Animation Effects
  useEffect(() => {
    if (!pageRef.current) return;

    // Scroll reveal
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

    // Scroll Listener
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
  }, [images]); 

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    // Esc key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="gallery-page-wrapper" ref={pageRef}>
      <Header />

      {/* ══════════════ PAGE HERO ══════════════ */}
      <section className="gallery-hero" ref={heroRef}>
        <div className="gallery-hero-content">
          <h1>Game Gallery</h1>
          <p>Screenshots, artwork, and moments from the world of Kulay ng Isip</p>
        </div>
      </section>

      {/* ══════════════ GALLERY ══════════════ */}
      <div className="gallery-wrap">
        
        {/* Top bar */}
        <div className="gallery-topbar reveal">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div className="gallery-eyebrow">
              <span>Gallery</span>
              <div className="line"></div>
            </div>
            <span className="img-count-chip">
              <span className="dot"></span>
              {images.length} image{images.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="gallery-empty-state">
            <h3>Loading gallery...</h3>
          </div>
        ) : images.length > 0 ? (
          <div className="gallery-grid">
            {images.map((img, index) => {
              const delay = Math.round((index % 10) * 0.07 * 100) / 100;

              return (
                <div
                  key={img.id}
                  className="gallery-card reveal"
                  style={{ transitionDelay: `${delay}s` }}
                  onClick={() => setLightbox({ src: img.image_url, desc: img.description || "" })}
                >
                  <img src={img.image_url} alt={img.description || "Gallery Image"} />

                  {/* expand icon */}
                  <div className="gallery-expand-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>

                  {/* hover overlay */}
                  <div className="gallery-card-overlay">
                    {img.description && (
                      <p className="gallery-card-desc">{img.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="gallery-empty-state reveal">
            <span className="gallery-empty-icon">🖼️</span>
            <h3>No images yet!</h3>
            <p>The gallery is waiting to be filled with colorful screenshots and artwork.</p>
          </div>
        )}
      </div>

      {/* ══════════════ LIGHTBOX ══════════════ */}
      {lightbox && (
        <div className="lightbox open" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.src} alt={lightbox.desc || "Gallery Image"} />
            {lightbox.desc && (
              <div className="lightbox-caption">{lightbox.desc}</div>
            )}
          </div>
        </div>
      )}

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