"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminInstallerManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    version: "",
    windows_url: "",
    mac_url: "",
    release_notes: "",
  });

  // Fetch the master installer settings (Row ID 1)
  useEffect(() => {
    async function fetchInstallerInfo() {
      const { data, error } = await supabase
        .from("game_installer")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setFormData({
          version: data.version || "",
          windows_url: data.windows_url || "",
          mac_url: data.mac_url || "",
          release_notes: data.release_notes || "",
        });
      }
      setLoading(false);
    }
    fetchInstallerInfo();
  }, []);

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
      const file = e.dataTransfer.files[0];
      // Optional: Check if it's an .exe or .zip
      if (file.name.endsWith('.exe') || file.name.endsWith('.zip')) {
        setSelectedFile(file);
      } else {
        setMessage({ type: "error", text: "Please upload a .exe or .zip file." });
      }
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    let finalWindowsUrl = formData.windows_url;

    // 1. If a new file was selected, upload it to Supabase Storage first
    if (selectedFile) {
      setMessage({ type: "success", text: "Uploading build to server... Do not close window." });
      
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `kulay-ng-isip-win-${Date.now()}.${fileExt}`; // Unique filename

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("builds") // Ensure this bucket exists in your Supabase!
        .upload(fileName, selectedFile);

      if (uploadError) {
        setMessage({ type: "error", text: "Upload failed: " + uploadError.message });
        setSaving(false);
        return;
      }

      // 2. Get the public URL of the newly uploaded file
      const { data: publicUrlData } = supabase.storage.from("builds").getPublicUrl(fileName);
      finalWindowsUrl = publicUrlData.publicUrl;
    }

    // 3. Update Row 1 in Supabase Database
    const { error: dbError } = await supabase
      .from("game_installer")
      .update({
        version: formData.version,
        windows_url: finalWindowsUrl,
        mac_url: formData.mac_url,
        release_notes: formData.release_notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (dbError) {
      setMessage({ type: "error", text: "Failed to update database: " + dbError.message });
    } else {
      setMessage({ type: "success", text: "Live build updated successfully!" });
      setFormData(prev => ({ ...prev, windows_url: finalWindowsUrl }));
      setSelectedFile(null); // Clear selected file
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div style={{ color: "#fff", padding: "3rem" }}>Loading installer config...</div>;

  return (
    <div className="admin-page-wrap" style={{ maxWidth: "800px" }}>
      <header className="admin-page-header">
        <h1>Game Installer Manager</h1>
        <p>Update the current version, patch notes, and live download links for the game.</p>
      </header>

      {/* Status Card */}
      <div className="installer-status-card">
        <div className="status-icon">🚀</div>
        <div>
          <h3 style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Live Build</h3>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.8rem", color: "#fff", marginTop: "0.25rem" }}>
            {formData.version || "Unknown"}
          </div>
        </div>
      </div>

      {message.text && (
        <div className={message.type === "error" ? "admin-error-msg" : "admin-success-msg"}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Version Number / Build Name</label>
          <input type="text" name="version" required value={formData.version} onChange={handleChange} placeholder="e.g. Beta v2.1.0" />
        </div>

        {/* Drag and Drop Zone for Windows Build */}
        <div className="form-group">
          <label>Windows Build (.exe or .zip)</label>
          
          <div 
            className={`admin-dropzone ${isDragging ? 'drag-active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".exe,.zip" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              onChange={onFileSelect}
            />
            
            <div className="dropzone-content">
              <span className="drop-icon">📤</span>
              {selectedFile ? (
                <div style={{ color: "#86efac", fontWeight: 700 }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              ) : (
                <div>
                  <strong>Click to upload</strong> or drag and drop<br/>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Accepts .exe or .zip files</span>
                </div>
              )}
            </div>
          </div>
          
          {formData.windows_url && !selectedFile && (
            <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#94a3b8" }}>
              <strong>Current File:</strong> <a href={formData.windows_url} target="_blank" style={{ color: "var(--indigo)" }}>Download & Verify</a>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Mac Download URL <span style={{fontWeight: 'normal', color: '#64748b'}}>- Optional</span></label>
          <input type="url" name="mac_url" value={formData.mac_url} onChange={handleChange} placeholder="Paste external link if applicable" />
        </div>

        <div className="form-group">
          <label>Patch / Release Notes</label>
          <textarea name="release_notes" rows={6} value={formData.release_notes} onChange={handleChange} placeholder="What's new in this update?" />
        </div>

        <div className="form-actions">
          <button type="submit" className="admin-action-btn primary" disabled={saving}>
            {saving ? "Uploading & Pushing Update..." : "Push Live Update"}
          </button>
        </div>
      </form>
    </div>
  );
}