"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    images: 0,
    testimonials: 0,
    admins: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const { count: postCount } = await supabase.from("posts").select("*", { count: "exact", head: true });
      const { count: imageCount } = await supabase.from("gallery").select("*", { count: "exact", head: true });
      const { count: testimonialCount } = await supabase.from("testimonials").select("*", { count: "exact", head: true });

      setStats({
        posts: postCount || 0,
        images: imageCount || 0,
        testimonials: testimonialCount || 0,
        admins: 1, 
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="admin-page-wrap">
      <header className="admin-page-header">
        <h1>Welcome back, Game Master.</h1>
        <p>Here is the current status of the Kulay ng Isip platform.</p>
      </header>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Total Blog Posts</h3>
            <span className="stat-number">{stats.posts}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">🖼️</div>
          <div className="stat-info">
            <h3>Gallery Images</h3>
            <span className="stat-number">{stats.images}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>Testimonials</h3>
            <span className="stat-number">{stats.testimonials}</span>
          </div>
        </div>
      </div>

      <div className="admin-quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-button-group">
          <Link href="/admin/posts/new" className="admin-action-btn primary">+ Write New Post</Link>
          <Link href="/admin/testimonials" className="admin-action-btn secondary">+ Add Testimonial</Link>
          <Link href="/admin/gallery" className="admin-action-btn outline">Manage Gallery</Link>
          <Link href="/admin/installer" className="admin-action-btn outline">Update Installer Link</Link>
        </div>
      </div>
    </div>
  );
}