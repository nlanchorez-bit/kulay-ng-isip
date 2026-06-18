"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import KulayNgIsipGame from "@/components/KulayNgIsipGame";

export default function PlayPage() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [version, setVersion] = useState<string>("");
  const [releaseNotes, setReleaseNotes] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstaller() {
      const { data, error } = await supabase
        .from("game_installer")
        .select("windows_url, version, release_notes")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setDownloadUrl(data.windows_url);
        setVersion(data.version);
        setReleaseNotes(data.release_notes || "No patch notes provided for this build.");
      }
      setLoading(false);
    }
    fetchInstaller();
  }, []);

  return (
    <main className="play-wrapper min-h-screen flex flex-col bg-gray-950">
      <Header />

      <section className="play-hero">
        <div className="play-hero-content">
          <h1>Ready to Restore the Colors?</h1>
          <p>Play instantly in your browser or download the full PC build for the best experience.</p>
        </div>
      </section>

      <div className="play-container max-w-7xl mx-auto px-4 w-full">
        
        {/* Browser Play Section */}
        <div className="mb-12 w-full animate-fade-in">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-2xl font-bold text-white">Browser Edition</h2>
            <span className="text-sm font-semibold text-indigo-400 bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-800/50">
              Web Optimized
            </span>
          </div>
          
          <KulayNgIsipGame />

          {/* NEW: Game Controls UI directly matching your image */}
          <div className="play-card" style={{ marginTop: "2rem", background: "#1e293b", border: "1px solid #334155" }}>
            <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>Game Controls</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
              
              {/* Keyboard Column */}
              <div>
                <h4 style={{ color: "#94a3b8", marginBottom: "1.25rem", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>Keyboard</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <kbd style={{ background: "#0f172a", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #475569", fontFamily: "monospace", color: "#f8fafc", fontSize: "0.9rem" }}>Esc</kbd> 
                    <span style={{ color: "#cbd5e1" }}>Pause</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <kbd style={{ background: "#0f172a", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #475569", fontFamily: "monospace", color: "#f8fafc", fontSize: "0.9rem" }}>WASD</kbd> 
                    <span style={{ color: "#cbd5e1" }}>Movement</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <kbd style={{ background: "#0f172a", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #475569", fontFamily: "monospace", color: "#f8fafc", fontSize: "0.9rem" }}>1</kbd> 
                    <span style={{ color: "#cbd5e1" }}>Primary Colors</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <kbd style={{ background: "#0f172a", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #475569", fontFamily: "monospace", color: "#f8fafc", fontSize: "0.9rem" }}>2</kbd> 
                    <span style={{ color: "#cbd5e1" }}>Secondary Colors</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <kbd style={{ background: "#0f172a", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #475569", fontFamily: "monospace", color: "#f8fafc", fontSize: "0.9rem" }}>3</kbd> 
                    <span style={{ color: "#cbd5e1" }}>Items</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <kbd style={{ background: "#0f172a", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #475569", fontFamily: "monospace", color: "#f8fafc", fontSize: "0.9rem" }}>F</kbd> 
                    <span style={{ color: "#cbd5e1" }}>Interact</span>
                  </li>
                </ul>
              </div>

              {/* Mouse Column */}
              <div>
                <h4 style={{ color: "#94a3b8", marginBottom: "1.25rem", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>Mouse</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#0f172a", padding: "0.75rem", borderRadius: "8px", border: "1px solid #334155" }}>
                    <div style={{ width: "20px", height: "20px", background: "#ef4444", borderRadius: "4px", flexShrink: 0, boxShadow: "0 0 10px rgba(239, 68, 68, 0.3)" }}></div>
                    <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "#f8fafc", fontSize: "0.9rem" }}>Left Click</strong> 
                      <span style={{ color: "#cbd5e1", fontSize: "0.9rem", textAlign: "right" }}>Use Color / Item</span>
                    </div>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#0f172a", padding: "0.75rem", borderRadius: "8px", border: "1px solid #334155" }}>
                    <div style={{ width: "20px", height: "20px", background: "#22c55e", borderRadius: "4px", flexShrink: 0, boxShadow: "0 0 10px rgba(34, 197, 94, 0.3)" }}></div>
                    <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "#f8fafc", fontSize: "0.9rem" }}>Scroll Wheel</strong> 
                      <span style={{ color: "#cbd5e1", fontSize: "0.9rem", textAlign: "right" }}>Cycle Colors & Items</span>
                    </div>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#0f172a", padding: "0.75rem", borderRadius: "8px", border: "1px solid #334155" }}>
                    <div style={{ width: "20px", height: "20px", background: "#3b82f6", borderRadius: "4px", flexShrink: 0, boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)" }}></div>
                    <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "#f8fafc", fontSize: "0.9rem" }}>Right Click</strong> 
                      <span style={{ color: "#cbd5e1", fontSize: "0.9rem", textAlign: "right" }}>Shield</span>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Existing Download Section */}
        <div className="download-card">
          <div className="download-info">
            <h2>Download for Windows</h2>
            <p className="build-version">Current Build: <strong>{version || "Checking..."}</strong></p>
          </div>
          <div className="download-action">
            {loading ? (
              <button className="btn-download-game disabled" disabled>Fetching Link...</button>
            ) : downloadUrl ? (
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-download-game">
                <span className="dl-icon">⬇</span> Download .EXE
              </a>
            ) : (
              <button className="btn-download-game disabled" disabled>Build Unavailable</button>
            )}
          </div>
        </div>

        {/* Patch Notes Section */}
        {!loading && (
          <div className="play-card" style={{ marginBottom: "2rem", animation: "fadeUp 0.6s ease 0.25s both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #334155", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, borderBottom: "none", paddingBottom: 0 }}>Patch Notes</h3>
              <span className="badge-dev" style={{ background: "rgba(249, 115, 22, 0.1)", color: "var(--orange)", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" }}>
                {version}
              </span>
            </div>
            <div style={{ whiteSpace: "pre-wrap", color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.7 }}>
              {releaseNotes}
            </div>
          </div>
        )}

        <div className="play-grid">
          {/* Installation Instructions */}
          <div className="play-card">
            <h3>Installation Guide (PC Build)</h3>
            <ol className="install-steps">
              <li>
                <strong>Download the file</strong>
                <p>Click the download button above to get the latest <code>.zip</code> or <code>.exe</code> file.</p>
              </li>
              <li>
                <strong>Extract the game (If Zip)</strong>
                <p>Right-click the downloaded file and select "Extract All" to a folder on your PC.</p>
              </li>
              <li>
                <strong>Run the application</strong>
                <p>Open the extracted folder and double-click <code>KulayNgIsip.exe</code> to launch the game.</p>
              </li>
              <li>
                <strong>Windows SmartScreen (Optional)</strong>
                <p>If Windows blocks the app, click "More info" and then "Run anyway".</p>
              </li>
            </ol>
          </div>

          {/* System Requirements */}
          <div className="play-card">
            <h3>System Requirements (PC Build)</h3>
            
            <div className="req-block">
              <h4>Minimum</h4>
              <ul>
                <li><strong>OS:</strong> Windows 10 (64-bit)</li>
                <li><strong>Processor:</strong> Intel Core i3 / AMD Ryzen 3</li>
                <li><strong>Memory:</strong> 4 GB RAM</li>
                <li><strong>Graphics:</strong> Intel UHD Graphics 620 or equivalent</li>
                <li><strong>Storage:</strong> 2 GB available space</li>
              </ul>
            </div>

            <div className="req-block recommended">
              <h4>Recommended</h4>
              <ul>
                <li><strong>OS:</strong> Windows 10 / 11 (64-bit)</li>
                <li><strong>Processor:</strong> Intel Core i5 / AMD Ryzen 5</li>
                <li><strong>Memory:</strong> 8 GB RAM</li>
                <li><strong>Graphics:</strong> NVIDIA GTX 1050 / AMD Radeon RX 560</li>
                <li><strong>Storage:</strong> 2 GB available space</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}