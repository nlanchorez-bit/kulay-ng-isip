"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default function PlayPage() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [version, setVersion] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstaller() {
      const { data, error } = await supabase
        .from("game_installer")
        .select("windows_url, version")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setDownloadUrl(data.windows_url);
        setVersion(data.version);
      }
      setLoading(false);
    }
    fetchInstaller();
  }, []);

  return (
    <main className="play-wrapper">
      <Header />

      <section className="play-hero">
        <div className="play-hero-content">
          <h1>Ready to Restore the Colors?</h1>
          <p>Download the latest build of Kulay ng Isip and start your adventure.</p>
        </div>
      </section>

      <div className="play-container">
        
        {/* Download Section */}
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

        <div className="play-grid">
          {/* Installation Instructions */}
          <div className="play-card">
            <h3>Installation Guide</h3>
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
            <h3>System Requirements</h3>
            
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