"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // 1. Unwrap the params using React.use()
  const { id } = use(params); 

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
  });

  // Fetch the existing post data
  useEffect(() => {
    async function fetchPost() {
      // Changed 'fetchError' to 'error' to match Supabase's type definition
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Post not found.");
      } else {
        setFormData({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          image_url: data.image_url || "",
        });
      }
      setLoading(false);
    }
    
    fetchPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Update in Supabase
    const { error: updateError } = await supabase
      .from("posts")
      .update(formData)
      .eq("id", id); // Use the unwrapped id here

    if (updateError) {
      setError("Failed to update post: " + updateError.message);
      setSaving(false);
    } else {
      router.push("/admin/posts");
    }
  };

  if (loading) return <div style={{ color: "#fff", padding: "3rem" }}>Loading post editor...</div>;

  return (
    <div className="admin-page-wrap" style={{ maxWidth: "800px" }}>
      <header className="admin-page-header">
        <Link href="/admin/posts" className="admin-back-link">← Back to Posts</Link>
        <h1 style={{ marginTop: "1rem" }}>Edit Post</h1>
      </header>

      {error && <div className="admin-error-msg">{error}</div>}

      {!error && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Post Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Short Excerpt</label>
            <textarea name="excerpt" required rows={3} value={formData.excerpt} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Full Content</label>
            <textarea name="content" required rows={10} value={formData.content} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Hero Image URL</label>
            <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="admin-action-btn primary" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}