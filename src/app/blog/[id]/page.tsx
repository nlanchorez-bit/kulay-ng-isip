import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "./ShareButtons";
import { supabase } from "@/lib/supabase";

async function getPostData(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostData(id);
  
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Kulay ng Isip Dev Blog`,
    description: post.content.substring(0, 150) + "...", 
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 150) + "...",
      images: post.image_url ? [post.image_url] : [], 
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostData(id);

  if (!post) {
    notFound(); 
  }

  return (
    <main className="blog-public-wrapper">
      <Header />

      <article className="premium-article-layout">
        
        {/* Constrained Header */}
        <header className="premium-article-header">
          <div className="article-nav">
            <Link href="/blog" className="btn-article-back">
              <span className="arrow">←</span> Back to Transmissions
            </Link>
          </div>
          
          <span className="badge-dev">Dev Update</span>
          <h1 className="article-title">{post.title}</h1>
          
          <div className="article-meta">
            <div className="author-avatar">
              <span className="avatar-icon">A</span>
            </div>
            <div className="meta-text">
              <span className="author-name">TechTytes Dev Team</span>
              <span className="publish-date">
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Wide Hero Image */}
        {post.image_url && (
          <div className="premium-article-hero">
            <img src={post.image_url} alt={post.title} />
          </div>
        )}

        {/* Constrained Body Content */}
        <div className="premium-article-body">
          {post.content}
        </div>

        {/* Footer & Share */}
        <footer className="premium-article-footer">
          <ShareButtons title={post.title} />
        </footer>

      </article>

      <Footer />
    </main>
  );
}