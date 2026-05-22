"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Post = {
  id: number;
  title: string;
  created_at: string;
};

export default function AdminPostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // READ: Fetch all posts
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // DELETE: Remove a post
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);
    
    if (error) {
      alert("Failed to delete post: " + error.message);
    } else {
      // Remove it from the UI immediately
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  return (
    <div className="admin-page-wrap">
      <header className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Blog Post Manager</h1>
          <p>Create, edit, and manage developer updates.</p>
        </div>
        <Link href="/admin/posts/new" className="admin-action-btn primary">
          + Write New Post
        </Link>
      </header>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No posts found. Create one!</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date Created</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 700, color: "#fff" }}>{post.title}</td>
                  <td style={{ color: "#94a3b8" }}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="admin-table-actions">
                      <Link href={`/admin/posts/${post.id}/edit`} className="btn-table-edit">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(post.id)} className="btn-table-delete">
                        Delete
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