"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// TypeScript interface for our typed state
interface ScoreEntry {
  id: number;
  rank: number;
  name: string;
  score: number;
  date: string;
  color: string;
}

// Vibrant colors for avatars, dynamically assigned based on Player ID
const AVATAR_COLORS = [
  "var(--orange)", "var(--pink)", "var(--indigo)",
  "var(--blue-tint)", "var(--green-tint)", "var(--red-tint)", "var(--yellow)"
];

export default function LeaderboardPage() {
  // FIX: Added <HTMLElement> so TypeScript knows what these refs point to
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch data from our new API route
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/submit-score");
        const json = await response.json();

        if (json.success && json.data) {
          // Map database rows to UI format
          const formattedScores = json.data.map((item: any, index: number) => {
            // Format timestamp to "Oct 24, 2026"
            const dateObj = new Date(item.created_at);
            const formattedDate = dateObj.toLocaleDateString("en-US", { 
              month: "short", day: "numeric", year: "numeric" 
            });

            // Deterministically assign a color based on the character length of the player's ID
            const colorIndex = item.player_id.length % AVATAR_COLORS.length;

            return {
              id: item.id,
              rank: index + 1, // Overall leaderboard rank based on array position
              name: item.player_id,
              score: item.score,
              date: formattedDate,
              color: AVATAR_COLORS[colorIndex]
            };
          });

          setScores(formattedScores);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Scroll animations and scroll-to-top handler
  useEffect(() => {
    if (!pageRef.current) return;

    // Scroll reveal observer
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
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" } 
    );

    setTimeout(() => {
      // FIX: Typed 'el' as Element
      reveals.forEach((el: Element) => revObs.observe(el));
    }, 100);

    // Scroll Listener
    const handleScroll = () => {
      if (heroRef.current) {
        // FIX: Re-added the missing * multiplication operator
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.35}px`;
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      revObs.disconnect();
    };
  }, [isLoading]); // Re-bind observer when loading finishes and new DOM nodes exist

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const topThree = scores.slice(0, 3);
  const remainingPlayers = scores.slice(3);

  // FIX: Restored the <main> wrapper and <Header />
  return (
    <main className="leaderboard-wrapper" ref={pageRef}>
      <Header />

      {/* ══════════════ PAGE HERO ══════════════ */}
      <section className="leaderboard-hero" ref={heroRef}>
        <div className="leaderboard-hero-content">
          <span className="eyebrow" style={{ color: "var(--yellow)" }}>Hall of Fame</span>
          <h1>Global Arena <span className="gradient-text">Leaderboard</span></h1>
          <p>The most creative and fastest minds in the world of Kulay ng Isip.</p>
        </div>
      </section>

      {/* ══════════════ LEADERBOARD CONTENT ══════════════ */}
      <section className="leaderboard-container">
        
        {isLoading ? (
          <div className="loading-state" style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            <h2>Loading Leaderboard...</h2>
          </div>
        ) : scores.length === 0 ? (
          <div className="empty-state" style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            <h2>No scores yet. Be the first to play!</h2>
          </div>
        ) : (
          <>
            {/* PODIUM (Top 3) */}
            <div className="podium-section reveal">
              
              {/* Rank 2 - Silver */}
              {topThree[1] && (
                <div className="podium-card silver">
                  <div className="podium-rank">2</div>
                  <div className="podium-avatar" style={{ background: topThree[1].color }}>
                    {topThree[1].name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="podium-name">{topThree[1].name}</h3>
                  <div className="podium-score">{topThree[1].score.toLocaleString()} pts</div>
                </div>
              )}

              {/* Rank 1 - Gold */}
              {topThree[0] && (
                <div className="podium-card gold">
                  <div className="podium-crown">👑</div>
                  <div className="podium-rank">1</div>
                  <div className="podium-avatar" style={{ background: topThree[0].color }}>
                    {topThree[0].name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="podium-name">{topThree[0].name}</h3>
                  <div className="podium-score">{topThree[0].score.toLocaleString()} pts</div>
                </div>
              )}

              {/* Rank 3 - Bronze */}
              {topThree[2] && (
                <div className="podium-card bronze">
                  <div className="podium-rank">3</div>
                  <div className="podium-avatar" style={{ background: topThree[2].color }}>
                    {topThree[2].name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="podium-name">{topThree[2].name}</h3>
                  <div className="podium-score">{topThree[2].score.toLocaleString()} pts</div>
                </div>
              )}

            </div>

            {/* LIST (Ranks 4+) */}
            {remainingPlayers.length > 0 && (
              <div className="leaderboard-list reveal" style={{ transitionDelay: "0.2s" }}>
                <div className="list-header">
                  <span className="col-rank">Rank</span>
                  <span className="col-player">Player</span>
                  <span className="col-date">Date Achieved</span>
                  <span className="col-score">Score</span>
                </div>

                <div className="list-body">
                  {remainingPlayers.map((player) => (
                    <div key={player.id} className="list-row">
                      <span className="col-rank">#{player.rank}</span>
                      <span className="col-player">
                        <div className="list-avatar" style={{ background: player.color }}>
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        {player.name}
                      </span>
                      <span className="col-date">{player.date}</span>
                      <span className="col-score">{player.score.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

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