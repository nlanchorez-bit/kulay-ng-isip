"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type GalleryImage = {
  id: number;
  image_url: string;
  description: string | null;
  created_at: string;
};

export default function AdminGalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // READ: Fetch all gallery images
  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // CREATE: Add new image link to database
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    setSubmitting(true);
    setError("");

    const { data, error: insertError } = await supabase
      .from("gallery")
      .insert([{ image_url: imageUrl.trim(), description: description.trim() || null }])
      .select();

    if (insertError) {
      setError("Upload failed: " + insertError.message);
      setSubmitting(false);
    } else {
      // Clear form inputs
      setImageUrl("");
      setDescription("");
      setError("");
      setSubmitting(false);
      
      // Update UI state immediately
      if (data) {
        setImages([data[0], ...images]);
      }
    }
  };

  // DELETE: Remove image from database
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this artwork from the live site gallery? This cannot be undone.")) return;

    const { error: deleteError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("Failed to delete image: " + deleteError.message);
    } else {
      setImages(images.filter((img) => img.id !== id));
    }
  };

  return (
    <div className="admin-page-wrap">
      <header className="admin-page-header">
        <h1>Gallery Manager</h1>
        <p>Upload new concept art, environments, or screenshots and manage the public showcase.</p>
      </header>

      {/* Upload Manager Form */}
      <div className="admin-gallery-form-wrap">
        <h2>Add New Image asset</h2>
        {error && <div className="admin-error-msg">{error}</div>}
        
        <form onSubmit={handleUpload} className="admin-gallery-form">
          <div className="form-group-row">
            <div className="form-group flex-2">
              <label>Image URL</label>
              <input
                type="url"
                placeholder="https://i.imgur.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            <div className="form-group flex-3">
              <label>Description / Caption</label>
              <input
                type="text"
                placeholder="e.g. Stage 1 Environment Concept Artwork"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group-btn">
              <button type="submit" className="admin-action-btn primary" disabled={submitting}>
                {submitting ? "Adding..." : "Add to Gallery"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Display Grid */}
      <div className="admin-gallery-grid-title">
        <h2>Live Artwork Feed ({images.length})</h2>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>Loading assets...</div>
      ) : images.length === 0 ? (
        <div className="admin-gallery-empty">No assets uploaded yet. Use the form above to populate the repository.</div>
      ) : (
        <div className="admin-gallery-grid">
          {images.map((img) => (
            <div key={img.id} className="admin-gallery-card">
              <div className="admin-card-img-wrap">
                <img src={img.image_url} alt={img.description || "Gallery item"} />
              </div>
              <div className="admin-card-info">
                <p className="admin-card-desc">
  {img.description || <span style={{ color: "#475569", fontStyle: "italic" }}>No caption provided</span>}
</p>
                <button onClick={() => handleDelete(img.id)} className="btn-card-delete">
                  🗑️ Delete Asset
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}