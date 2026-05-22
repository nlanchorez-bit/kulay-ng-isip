"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  
  // Toggle between login and forgot password views
  const [view, setView] = useState<"login" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // --- 1. HANDLE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formattedEmail = email.trim().toLowerCase();

    // Whitelist Check
    const { data: whitelistData, error: whitelistError } = await supabase
      .from("admin_whitelist")
      .select("email")
      .eq("email", formattedEmail)
      .single();

    if (whitelistError || !whitelistData) {
      setError("Unauthorized access. This portal is for Game Masters only.");
      setLoading(false);
      return;
    }

    // Supabase Auth
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: password,
      });

      if (authError) throw authError;

      if (data.session) {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLE FORGOT PASSWORD ---
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const formattedEmail = email.trim().toLowerCase();

    // Whitelist Check (Don't send emails to non-admins!)
    const { data: whitelistData, error: whitelistError } = await supabase
      .from("admin_whitelist")
      .select("email")
      .eq("email", formattedEmail)
      .single();

    if (whitelistError || !whitelistData) {
      setError("Email not found in the Game Master whitelist.");
      setLoading(false);
      return;
    }

    // Send Reset Email via Supabase
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(formattedEmail, {
        // This tells Supabase where to send the user after they click the email link
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) throw resetError;

      setSuccessMsg("Recovery email sent! Check your inbox for the reset link.");
      setEmail(""); // Clear input
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page-wrapper">
      <Header />

      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-blob blob-1"></div>
          <div className="login-blob blob-2"></div>
          <div className="login-blob blob-3"></div>

          <div className="login-content">
            <h2 className="login-title">
              Game Master <span className="gradient-text">Portal</span>
            </h2>
            <p className="login-subtitle">
              {view === "login" ? "Restricted CMS Access" : "Password Recovery"}
            </p>

            {error && <div className="error-msg">{error}</div>}
            {successMsg && (
              <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.5rem", textAlign: "center", fontWeight: 700 }}>
                {successMsg}
              </div>
            )}

            {/* LOGIN VIEW */}
            {view === "login" && (
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <input type="email" placeholder="Admin Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="input-group">
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                  <button type="button" onClick={() => { setView("forgot"); setError(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", color: "var(--yellow)", cursor: "pointer", fontWeight: 700 }}>
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Authenticating..." : "Enter CMS"}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD VIEW */}
            {view === "forgot" && (
              <form onSubmit={handleForgotPassword}>
                <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "1.5rem", fontSize: "0.95rem", textAlign: "center" }}>
                  Enter your whitelisted email address and we will send you a secure link to reset your password.
                </p>
                
                <div className="input-group">
                  <input type="email" placeholder="Admin Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <button type="button" onClick={() => { setView("login"); setError(""); setSuccessMsg(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontWeight: 700 }}>
                    ← Back to Login
                  </button>
                </div>
              </form>
            )}

            <div className="return-link">
              <Link href="/">← Return to Main Site</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}