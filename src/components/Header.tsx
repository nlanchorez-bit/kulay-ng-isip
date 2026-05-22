"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define your user type based on your PHP session variables
type User = {
  username: string;
  role?: "admin" | "user";
};

export default function Header() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Use state instead of a hardcoded const so TypeScript knows this value can change dynamically
  // To test being logged in, change `null` to: { username: "Player1", role: "admin" }
  const [mockUser] = useState<User | null>(null);

  // Handle scroll detection for the solid background effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to check if a link is active
  const isActive = (path: string) => pathname === path ? "active" : "";

  return (
    <header className={`kni-nav ${isScrolled ? "scrolled" : ""}`} id="kniNav">
      <div className="kni-nav-inner">
        
        {/* Brand */}
        <Link href="/" className="kni-brand">
          Kulay ng Isip
        </Link>

        {/* Desktop links */}
        <ul className="kni-links">
          <li><Link href="/" className={isActive("/")}>Home</Link></li>
          <li><Link href="/about" className={isActive("/about")}>About</Link></li>
          <li><Link href="/gallery" className={isActive("/gallery")}>Gallery</Link></li>
          <li><Link href="/blog" className={isActive("/blog")}>DevBlog</Link></li>
          <li><Link href="/gameplay" className={isActive("/gameplay")}>Gameplay</Link></li>

          {mockUser ? (
            <>
              {mockUser.role === "admin" && (
                <>
                  <li><div className="nav-pip" /></li>
                  <li><Link href="/admin/create-post" className="admin-link">+ Post</Link></li>
                  <li><Link href="/admin/gallery-upload" className="admin-link">+ Image</Link></li>
                </>
              )}
              <li><div className="nav-pip" /></li>
              <li>
                <Link href="/api/auth/logout" className="btn-logout">
                  Logout ({mockUser.username})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li><div className="nav-pip" /></li>
              <li><Link href="/login" className="btn-login">Login</Link></li>
              <li><Link href="/register" className="btn-register">Register</Link></li>
            </>
          )}
        </ul>

        {/* Hamburger */}
        <button
          className={`kni-toggler ${isDrawerOpen ? "open" : ""}`}
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <nav className={`kni-drawer ${isDrawerOpen ? "open" : ""}`}>
        <Link href="/" className={isActive("/")}>Home</Link>
        <Link href="/about" className={isActive("/about")}>About</Link>
        <Link href="/gallery" className={isActive("/gallery")}>Gallery</Link>
        <Link href="/forum" className={isActive("/forum")}>Forum</Link>
        <Link href="/gameplay" className={isActive("/gameplay")}>Gameplay</Link>

        {mockUser ? (
          <>
            {mockUser.role === "admin" && (
              <>
                <hr className="drawer-divider" />
                <Link href="/admin/create-post" className="admin-link">+ Create Post</Link>
                <Link href="/admin/gallery-upload" className="admin-link">+ Upload Image</Link>
              </>
            )}
            <hr className="drawer-divider" />
            <Link href="/api/auth/logout" className="btn-logout">
              Logout ({mockUser.username})
            </Link>
          </>
        ) : (
          <>
            <hr className="drawer-divider" />
            <Link href="/login" className="btn-login">Login</Link>
            <Link href="/register" className="btn-register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}