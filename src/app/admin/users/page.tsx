"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AdminUser = {
  id: number;
  email: string;
  role: string;
  added_at: string;
};

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // New Admin Form State
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Game Master");

  // READ: Fetch all whitelisted admins
  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_whitelist")
      .select("*")
      .order("added_at", { ascending: true });

    if (!error && data) {
      setAdmins(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // CREATE: Add a new admin to the whitelist
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formattedEmail = newEmail.trim().toLowerCase();

    // Check if they already exist in the UI list
    if (admins.some(admin => admin.email === formattedEmail)) {
      setError("This email is already on the whitelist.");
      setSubmitting(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("admin_whitelist")
      .insert([{ email: formattedEmail, role: newRole }])
      .select();

    if (insertError) {
      setError("Failed to add admin: " + insertError.message);
    } else if (data) {
      setAdmins([...admins, data[0]]);
      setNewEmail(""); // Reset form
      setNewRole("Game Master");
    }
    setSubmitting(false);
  };

  // DELETE: Remove an admin from the whitelist
  const handleRemoveAdmin = async (id: number, email: string) => {
    if (!window.confirm(`Are you sure you want to revoke CMS access for ${email}?`)) return;

    const { error: deleteError } = await supabase
      .from("admin_whitelist")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("Failed to remove admin: " + deleteError.message);
    } else {
      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  return (
    <div className="admin-page-wrap">
      <header className="admin-page-header">
        <h1>Manage Game Masters</h1>
        <p>Control who has access to the CMS. Only whitelisted emails can log in.</p>
      </header>

      {/* Add New Admin Form */}
      <div className="admin-form" style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", marginBottom: "1.5rem" }}>
          Whitelist New Admin
        </h2>
        
        {error && <div className="admin-error-msg">{error}</div>}

        <form onSubmit={handleAddAdmin} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="form-group" style={{ flex: "2", marginBottom: 0 }}>
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="developer@arterion.ph" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ flex: "1", minWidth: "150px", marginBottom: 0 }}>
            <label>Role</label>
            <select 
              value={newRole} 
              onChange={(e) => setNewRole(e.target.value)}
              style={{
                width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid #475569", 
                color: "#fff", padding: "0.85rem 1rem", borderRadius: "0.5rem", fontSize: "1rem"
              }}
            >
              <option value="Game Master">Game Master</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <button type="submit" className="admin-action-btn primary" disabled={submitting} style={{ height: "calc(1rem + 2.15rem)" }}>
            {submitting ? "Adding..." : "+ Grant Access"}
          </button>
        </form>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "1rem" }}>
          <strong>Note:</strong> After whitelisting, you still must send them a Supabase Invite via your dashboard so they can set a password.
        </p>
      </div>

      {/* Admins Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading access list...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin Email</th>
                <th>Role</th>
                <th>Date Added</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td style={{ fontWeight: 700, color: "#fff" }}>{admin.email}</td>
                  <td>
                    <span style={{
                      background: admin.role === 'Super Admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                      color: admin.role === 'Super Admin' ? '#a5b4fc' : '#fdba74',
                      padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800
                    }}>
                      {admin.role}
                    </span>
                  </td>
                  <td style={{ color: "#94a3b8" }}>
                    {new Date(admin.added_at).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="admin-table-actions">
                      <button 
                        onClick={() => handleRemoveAdmin(admin.id, admin.email)} 
                        className="btn-table-delete"
                      >
                        Revoke Access
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}