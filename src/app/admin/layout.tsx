"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Quick Auth Guard: Kick out anyone who isn't logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Verifying Game Master Credentials...</p>
      </div>
    );
  }

  const navLinks = [
    { name: "Dashboard Overview", path: "/admin", icon: "📊" },
    { name: "Blog Posts (CRUD)", path: "/admin/posts", icon: "📝" },
    { name: "Gallery Manager", path: "/admin/gallery", icon: "🖼️" },
    { name: "Game Installer", path: "/admin/installer", icon: "📦" },
    { name: "Manage Admins", path: "/admin/users", icon: "👑" },
  ];

  return (
    <div className="admin-layout">
      {/* Persistent Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>CMS Portal</h2>
          <p>Kulay ng Isip</p>
        </div>

        <nav className="admin-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`admin-nav-link ${pathname === link.path ? "active" : ""}`}
            >
              <span className="admin-nav-icon">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="btn-admin-logout">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Dynamic Content Area */}
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
}