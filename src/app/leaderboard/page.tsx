"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// TypeScript interface updated with the new database columns
interface ScoreEntry {
  id: number;
  position: number;      // The player's standing on the leaderboard (1, 2, 3...)
  name: string;
  score: number;
  gameRank: string;     // The letter grade from the database 'rank' column (e.g., S, A, B)
  timeElapsed: number;  // The raw float seconds from 'time_elapsed'
  maxStreak: number;    // The integer from 'max_streak'
  date: string;
  color: string;
}

const AVATAR_COLORS = [
  "var(--orange)", "var(--pink)", "var(--indigo)",
  "var(--blue-tint)", "var(--green-tint)", "var(--red-tint)", "var(--yellow)"
];

// Helper to format raw seconds (e.g., 220.572) into "3m 40s"
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
};

export default function LeaderboardPage() {
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/submit-score");
        const json = await response.json();

        if (json.success && json.data) {
          const formattedScores = json.data.map((item: any, index: number) => {
            const dateObj = new Date(item.created_at);
            const formattedDate = dateObj.toLocaleDateString("en-US", { 
              month: "short", day: "numeric", year: "numeric" 
            });

            const colorIndex = item.player_id.length % AVATAR_COLORS.length;

            return {
              id: item.id,
              position: index + 1,
              name: item.player_id,
              score: item.score,
              gameRank: item.rank || "-",
              timeElapsed: item.time_elapsed || 0,
              maxStreak: item.max_streak || 0,
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

  useEffect(() => {
    if (!pageRef.current) return;

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
      reveals.forEach((el: Element) => revObs.observe(el));
    }, 100);

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
  }, [isLoading]); 

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const topThree = scores.slice(0, 3);
  const remainingPlayers = scores.slice(3);

  return (
    <main className="leaderboard-wrapper" ref={pageRef}>
      <Header />

      <section className="leaderboard-hero" ref={heroRef}>
        <div className="leaderboard-hero-content">
          <span className="eyebrow" style={{ color: "var(--yellow)" }}>Hall of Fame</span>
          <h1>Global Arena <span className="gradient-text">Leaderboard</span></h1>
          <p>The most creative and fastest minds in the world of Kulay ng Isip.</p>
        </div>
      </section>

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
            {/* ── PODIUM (Top 3) ── */}
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
                  <div className="podium-stats">
                    <span className="stat-badge">{topThree[1].gameRank} Rank</span>
                    <span>⏱️ {formatTime(topThree[1].timeElapsed)}</span>
                    <span>🔥 {topThree[1].maxStreak} Streak</span>
                  </div>
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
                  <div className="podium-stats">
                    <span className="stat-badge">{topThree[0].gameRank} Rank</span>
                    <span>⏱️ {formatTime(topThree[0].timeElapsed)}</span>
                    <span>🔥 {topThree[0].maxStreak} Streak</span>
                  </div>
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
                  <div className="podium-stats">
                    <span className="stat-badge">{topThree[2].gameRank} Rank</span>
                    <span>⏱️ {formatTime(topThree[2].timeElapsed)}</span>
                    <span>🔥 {topThree[2].maxStreak} Streak</span>
                  </div>
                </div>
              )}

            </div>

            {/* ── LIST (Ranks 4+) ── */}
            {remainingPlayers.length > 0 && (
              <div className="leaderboard-list reveal" style={{ transitionDelay: "0.2s" }}>
                <div className="list-header">
                  <span className="col-pos">#</span>
                  <span className="col-player">Player</span>
                  <span className="col-stats">Rank</span>
                  <span className="col-stats">Time</span>
                  <span className="col-stats">Streak</span>
                  <span className="col-date">Date Achieved</span>
                  <span className="col-score">Score</span>
                </div>

                <div className="list-body">
                  {remainingPlayers.map((player) => (
                    <div key={player.id} className="list-row">
                      <span className="col-pos">{player.position}</span>
                      <span className="col-player">
                        <div className="list-avatar" style={{ background: player.color }}>
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        {player.name}
                      </span>
                      <span className="col-stats stat-rank">{player.gameRank}</span>
                      <span className="col-stats">{formatTime(player.timeElapsed)}</span>
                      <span className="col-stats">{player.maxStreak}</span>
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