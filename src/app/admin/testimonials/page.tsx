"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Testimonial = {
  id: number;
  author_name: string;
  author_role: string;
  content: string;
  avatar_color: string;
};

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New state to track if we are editing an existing testimonial
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    author_name: "",
    author_role: "",
    content: "",
    avatar_color: "var(--orange)"
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) setTestimonials(data);
    setLoading(false);
  }

  // Helper to reset the form back to default "Add" mode
  const resetForm = () => {
    setFormData({ author_name: "", author_role: "", content: "", avatar_color: "var(--orange)" });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingId) {
      // UPDATE EXISTING
      const { error } = await supabase
        .from("testimonials")
        .update(formData)
        .eq("id", editingId);
        
      if (!error) {
        resetForm();
        fetchTestimonials();
      }
    } else {
      // INSERT NEW
      const { error } = await supabase
        .from("testimonials")
        .insert([formData]);
      
      if (!error) {
        resetForm();
        fetchTestimonials();
      }
    }
    setSaving(false);
  };

  const handleEdit = (t: Testimonial) => {
    // Populate form with the selected testimonial
    setFormData({
      author_name: t.author_name,
      author_role: t.author_role || "", // Fallback to empty string if null
      content: t.content,
      avatar_color: t.avatar_color
    });
    setEditingId(t.id);
    
    // Smooth scroll to top so the admin sees the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    
    // If they delete the item they are currently editing, reset the form
    if (editingId === id) resetForm();
    
    fetchTestimonials();
  };

  return (
    <div className="admin-page-wrap">
      <header className="admin-page-header">
        <h1>Manage Testimonials</h1>
        <p>Add or edit player reviews on the homepage scrolling ticker.</p>
      </header>

      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "minmax(300px, 1fr) 2fr" }}>
        
        {/* FORM SECTION */}
        <div className="admin-card" style={{ alignSelf: "start" }}>
          <h2>{editingId ? "Edit Testimonial" : "Add New"}</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <div className="form-group">
              <label>Player Name</label>
              <input type="text" value={formData.author_name} onChange={(e) => setFormData({...formData, author_name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Role / Title</label>
              <input type="text" placeholder="e.g., Parent, Art Teacher" value={formData.author_role} onChange={(e) => setFormData({...formData, author_role: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Avatar Color</label>
              <select value={formData.avatar_color} onChange={(e) => setFormData({...formData, avatar_color: e.target.value})}>
                <option value="var(--orange)">Orange</option>
                <option value="var(--pink)">Pink</option>
                <option value="var(--indigo)">Indigo</option>
                <option value="var(--blue-tint)">Blue</option>
              </select>
            </div>
            <div className="form-group">
              <label>Review / Message</label>
              <textarea rows={4} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required></textarea>
            </div>
            
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button type="submit" className="admin-action-btn primary" disabled={saving} style={{ flex: 1 }}>
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Testimonial"}
              </button>
              
              {/* Cancel Button (Only shows when editing) */}
              {editingId && (
                <button type="button" onClick={resetForm} className="admin-action-btn outline" disabled={saving}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST EXISTING SECTION */}
        <div className="admin-card">
          <h2>Existing Testimonials ({testimonials.length})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            {loading ? <p>Loading...</p> : testimonials.map((t) => (
              <div key={t.id} style={{ 
                background: editingId === t.id ? "rgba(99, 102, 241, 0.1)" : "rgba(255,255,255,0.05)", 
                border: editingId === t.id ? "1px solid var(--indigo)" : "1px solid transparent",
                padding: "1rem", 
                borderRadius: "8px", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                transition: "all 0.2s ease"
              }}>
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: t.avatar_color }}></div>
                    <strong>{t.author_name}</strong> <span style={{ color: "#64748b", fontSize: "0.85rem" }}>({t.author_role})</span>
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>"{t.content}"</p>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleEdit(t)} style={{ background: "rgba(96, 165, 250, 0.2)", color: "#60a5fa", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)} style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}