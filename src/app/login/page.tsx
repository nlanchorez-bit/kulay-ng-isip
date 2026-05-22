"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  
  const [view, setView] = useState<"login" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // OWASP Best Practice: Basic client-side input validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // --- 1. HANDLE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formattedEmail = email.trim().toLowerCase();

    if (!isValidEmail(formattedEmail)) {
      setError("Please enter a valid email format.");
      setLoading(false);
      return;
    }

    try {
      // 1. Whitelist Check
      const { data: whitelistData, error: whitelistError } = await supabase
        .from("admin_whitelist")
        .select("email")
        .eq("email", formattedEmail)
        .single();

      // OWASP: Generic Error Message (Do not reveal if the whitelist check failed or the password failed)
      if (whitelistError || !whitelistData) {
        throw new Error("Invalid credentials or unauthorized access.");
      }

      // 2. Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: password,
      });

      if (authError) throw new Error("Invalid credentials or unauthorized access.");

      if (data.session) {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message);
      // OWASP: Always clear the password field from memory after a failed attempt
      setPassword(""); 
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

    if (!isValidEmail(formattedEmail)) {
      setError("Please enter a valid email format.");
      setLoading(false);
      return;
    }

    // OWASP Anti-Enumeration: Always show a success message immediately, 
    // regardless of whether the email is actually in your database.
    setSuccessMsg("If your email is authorized, a recovery link has been sent to your inbox.");
    setEmail(""); 
    setLoading(false);

    // Perform the actual checks silently in the background
    try {
      const { data: whitelistData } = await supabase
        .from("admin_whitelist")
        .select("email")
        .eq("email", formattedEmail)
        .single();

      if (whitelistData) {
        await supabase.auth.resetPasswordForEmail(formattedEmail, {
          redirectTo: `${window.location.origin}/update-password`,
        });
      }
    } catch (err) {
      // Fail silently to prevent leaking information to attackers
      console.error("Background reset task failed.");
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
              <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#86efac", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.5rem", textAlign: "center", fontWeight: 700, lineHeight: 1.5 }}>
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
                  <button type="button" onClick={() => { setView("forgot"); setError(""); setSuccessMsg(""); setPassword(""); }} style={{ background: "none", border: "none", color: "var(--yellow)", cursor: "pointer", fontWeight: 700 }}>
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
                <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "1.5rem", fontSize: "0.95rem", textAlign: "center", lineHeight: 1.6 }}>
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