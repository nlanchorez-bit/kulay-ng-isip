"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type Post = {
  id: number;
  title: string;
  excerpt: string;
  image_url?: string; 
  created_at: string;
};

export default function DeveloperBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Supabase
  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("id, title, excerpt, image_url, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <main className="blog-public-wrapper">
      <Header />

      {/* Upgraded Hero Section */}
      <section className="blog-public-hero">
        <div className="blog-hero-pattern"></div>
        <div className="blog-public-hero-content">
          <span className="hero-eyebrow">Studio Updates</span>
          <h1>Developer Blog</h1>
          <p>Read the latest patch notes, feature deep-dives, and behind-the-scenes stories directly from the Arterion Dev Team.</p>
        </div>
      </section>

      <div className="blog-public-container">
        {loading ? (
          <div className="blog-loading-state">
            <div className="pulse-loader"></div>
            <p>Fetching latest transmissions...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="blog-masonry-grid">
            {posts.map((post, index) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="blog-premium-card" style={{ animationDelay: `${index * 0.1}s` }}>
                
                {post.image_url && (
                  <div className="blog-premium-image">
                    <img src={post.image_url} alt={post.title} />
                    <div className="blog-premium-overlay"></div>
                  </div>
                )}

                <div className="blog-premium-content">
                  <div className="blog-premium-meta">
                    <span className="badge-dev">Dev Update</span>
                    <span className="blog-date">
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="blog-premium-title">{post.title}</h2>
                  <p className="blog-premium-excerpt">{post.excerpt}</p>
                </div>

                <div className="blog-premium-footer">
                  <span className="read-article-btn">Read Article <span className="arrow">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="blog-empty-state">
            <span className="blog-empty-icon">✨</span>
            <h3>No transmissions yet</h3>
            <p>The development team is working hard behind the scenes. Check back soon for our first update!</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}