"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Security check: Make sure they actually clicked an email link to get here
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Invalid or expired recovery link. Please request a new one.");
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Supabase uses the temporary session from the email link to authorize this update
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      alert("Password successfully updated! Redirecting to CMS...");
      router.push("/admin"); // Log them right into the dashboard
      
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
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
          
          <div className="login-content">
            <h2 className="login-title">
              Secure <span className="gradient-text">Reset</span>
            </h2>
            <p className="login-subtitle">Enter your new password</p>

            {error ? (
              <div className="error-msg">
                {error}
                <br /><br />
                <button onClick={() => router.push("/login")} style={{ background: "none", border: "none", color: "#fff", textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}>
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword}>
                <div className="input-group">
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="input-group">
                  <input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Updating..." : "Save & Enter CMS"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}