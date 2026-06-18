"use client";

import React, { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { supabase } from "@/lib/supabase"; // Ensure this path is correct

export default function KulayNgIsipGame() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [volume, setVolume] = useState<number>(1);
  
  // Bug Report Modal State
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugTitle, setBugTitle] = useState("");
  const [bugDesc, setBugDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobileRegex = /Mobi|Android|iPhone|iPad|iPod/i;
      const isMobileDevice = mobileRegex.test(navigator.userAgent) || window.innerWidth < 1024;
      setIsMobile(isMobileDevice);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Extract sendMessage to communicate with Unity
  const { unityProvider, isLoaded, loadingProgression, requestFullscreen, sendMessage } = useUnityContext({
    loaderUrl: "/Build/KULAYISIP-WEBGL.loader.js",
    dataUrl: "/Build/KULAYISIP-WEBGL.data",
    frameworkUrl: "/Build/KULAYISIP-WEBGL.framework.js",
    codeUrl: "/Build/KULAYISIP-WEBGL.wasm",
  });

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // sendMessage("GameObject_Name", "Method_Name", value)
    if (isLoaded) {
      sendMessage("WebBridge", "SetWebVolume", newVolume);
    }
  };

  // Handle Bug Submit
  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle || !bugDesc) return;
    
    setIsSubmitting(true);
    const { error } = await supabase
      .from("bug_reports")
      .insert([{ title: bugTitle, description: bugDesc }]);

    setIsSubmitting(false);

    if (!error) {
      alert("Bug reported successfully. Thank you!");
      setIsBugModalOpen(false);
      setBugTitle("");
      setBugDesc("");
    } else {
      alert("Failed to submit bug report. Please try again.");
    }
  };

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 p-8 bg-gray-900 border border-red-500 rounded-lg text-center">
        <h2 className="text-xl font-bold text-red-500 mb-2">PC Version Only</h2>
        <p className="text-gray-300">Kulay ng Isip requires a keyboard and desktop-class graphics.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-950 p-6 rounded-xl shadow-2xl relative">
      
      {/* Loading Bar */}
      {!isLoaded && (
        <div className="w-full max-w-md bg-gray-800 rounded-full h-4 mb-6 overflow-hidden border border-gray-700">
          <div 
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${Math.round(loadingProgression * 100)}%` }}
          />
          <p className="text-center text-xs text-gray-400 mt-2">
            Loading Game Modules... {Math.round(loadingProgression * 100)}%
          </p>
        </div>
      )}

      {/* Game Container */}
      <div 
        className="w-full relative shadow-inner overflow-hidden bg-black rounded-t-lg border border-gray-800"
        style={{ aspectRatio: "1920 / 1080", maxWidth: "1920px", visibility: isLoaded ? "visible" : "hidden" }}
      >
        <Unity 
          unityProvider={unityProvider} 
          style={{ width: "100%", height: "100%" }} 
          devicePixelRatio={window.devicePixelRatio || 1}
        />
        
        {/* Fullscreen Button */}
        {isLoaded && (
          <button 
            onClick={() => requestFullscreen(true)}
            className="absolute bottom-4 right-4 bg-indigo-600/80 hover:bg-indigo-500 text-white px-4 py-2 rounded shadow-lg transition-all z-10 font-bold flex items-center gap-2 backdrop-blur-sm opacity-50 hover:opacity-100"
            title="Enter Fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            Fullscreen
          </button>
        )}
      </div>

      {/* Game Action Bar (Appears when loaded) */}
      {isLoaded && (
        <div className="w-full bg-slate-900 border border-t-0 border-gray-800 rounded-b-lg p-4 flex flex-wrap justify-between items-center gap-4">
          
          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange}
              className="w-32 cursor-pointer accent-indigo-500"
              title="Game Volume"
            />
          </div>

          {/* Report Bug Button */}
          <button 
            onClick={() => setIsBugModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 2 1.88 1.88"></path>
              <path d="M14.12 3.88 16 2"></path>
              <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path>
              <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path>
              <path d="M12 20v-9"></path>
              <path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path>
              <path d="M17.47 9c1.93-.2 3.53-1.9 3.53-4"></path>
            </svg>
            Report Issue
          </button>
        </div>
      )}

      {/* Bug Report Modal */}
      {isBugModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Report an Issue</h3>
              <button onClick={() => setIsBugModalOpen(false)} className="text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleBugSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Issue Title</label>
                <input 
                  type="text" 
                  required
                  maxLength={100}
                  value={bugTitle}
                  onChange={(e) => setBugTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white outline-none focus:border-indigo-500 transition-colors"
                  placeholder="E.g., Character gets stuck on level 2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={bugDesc}
                  onChange={(e) => setBugDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-white outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Describe what happened and how to reproduce it..."
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsBugModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}