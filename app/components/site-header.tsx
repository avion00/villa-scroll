"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "../lib/site";

const links = [
  { label: "Properties", href: "/properties" },
  { label: "Areas", href: "/areas" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header className={`villa-nav site-nav${isHome ? "" : " site-nav-interior"}${isHome && hasScrolled ? " has-scrolled" : ""}`}>
      <Link className="villa-brand" href="/" aria-label={`${site.displayName} home`}>
        <span className="villa-brand-mark" aria-hidden="true">E</span>
        <span className="villa-brand-wordmark">{site.name}<small>{site.descriptor}</small></span>
      </Link>
      <nav aria-label="Main navigation">
        {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
    </header>
  );
}
