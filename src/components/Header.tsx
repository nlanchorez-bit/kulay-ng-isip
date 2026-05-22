"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

          <li><div className="nav-pip" /></li>
          <li><Link href="/login" className="btn-login">Game Master</Link></li>
          <li><Link href="/play" className="btn-register" style={{ background: "linear-gradient(135deg, var(--yellow), var(--orange))", color: "var(--dark)" }}>Play Now</Link></li>
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
        <Link href="/blog" className={isActive("/blog")}>DevBlog</Link>
        <Link href="/gameplay" className={isActive("/gameplay")}>Gameplay</Link>

        <hr className="drawer-divider" />
        <Link href="/login" className="btn-login">Game Master Login</Link>
        <Link href="/play" className="btn-register" style={{ background: "var(--orange)", color: "#fff", textAlign: "center", marginTop: "0.5rem" }}>Play Now</Link>
      </nav>
    </header>
  );
}