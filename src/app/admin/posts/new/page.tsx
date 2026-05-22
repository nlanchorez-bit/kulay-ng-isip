"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
  });

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup the preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- DRAG AND DROP HANDLERS ---
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(""); // Clear any previous errors
    } else {
      setError("Please upload a valid image file (JPG, PNG, WEBP).");
    }
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let finalImageUrl = null;

    // 1. If an image was selected, upload it to Supabase Storage first
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `post-hero-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-images") // The new bucket we just created!
        .upload(fileName, selectedFile);

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      // 2. Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage.from("blog-images").getPublicUrl(fileName);
      finalImageUrl = publicUrlData.publicUrl;
    }

    // 3. Insert the post into the database
    const { error: insertError } = await supabase
      .from("posts")
      .insert([{ 
        ...formData, 
        image_url: finalImageUrl 
      }]);

    if (insertError) {
      setError("Failed to create post: " + insertError.message);
      setLoading(false);
    } else {
      router.push("/admin/posts"); // Go back to the manager on success
    }
  };

  return (
    <div className="admin-page-wrap" style={{ maxWidth: "800px" }}>
      <header className="admin-page-header">
        <Link href="/admin/posts" className="admin-back-link">← Back to Posts</Link>
        <h1 style={{ marginTop: "1rem" }}>Write New Post</h1>
      </header>

      {error && <div className="admin-error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Post Title</label>
          <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Patch Notes v1.2" />
        </div>

        <div className="form-group">
          <label>Short Excerpt (Shows on the blog list)</label>
          <textarea name="excerpt" required rows={3} value={formData.excerpt} onChange={handleChange} placeholder="A brief summary..." />
        </div>

        <div className="form-group">
          <label>Full Content</label>
          <textarea name="content" required rows={10} value={formData.content} onChange={handleChange} placeholder="The full post content..." />
        </div>

        {/* Drag and Drop Zone for Hero Image */}
        <div className="form-group">
          <label>Hero Image (Optional)</label>
          
          <div 
            className={`admin-dropzone ${isDragging ? 'drag-active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={onFileSelect}
            />
            
            <div className="dropzone-content">
              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '0.5rem', objectFit: 'cover' }} 
                  />
                  <span style={{ color: "#86efac", fontWeight: 700 }}>Image Selected. Click or drag to change.</span>
                </div>
              ) : (
                <>
                  <span className="drop-icon">🖼️</span>
                  <div>
                    <strong>Click to upload</strong> or drag and drop an image<br/>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Accepts JPG, PNG, or WEBP</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="admin-action-btn primary" disabled={loading}>
            {loading ? "Uploading & Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}