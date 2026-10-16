import Link from "next/link";
import { site } from "../lib/site";

const socials = [
  { label: "Instagram", href: site.socialLinks.instagram },
  { label: "YouTube", href: site.socialLinks.youtube },
  { label: "LinkedIn", href: site.socialLinks.linkedin },
  { label: "Facebook", href: site.socialLinks.facebook },
].filter((social) => social.href);

function SocialIcon({ name }: { name: string }) {
  const common = {
    "aria-hidden": true as const,
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "Instagram":
      return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.7" r=".8" fill="currentColor" stroke="none" /></svg>;
    case "YouTube":
      return <svg {...common}><path d="M21 7.2a2.8 2.8 0 0 0-2-2C17.3 4.7 12 4.7 12 4.7s-5.3 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 7 .5 7 .5s5.3 0 7-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 21.5 12a29 29 0 0 0-.5-4.8Z" /><path d="m10 15.5 5-3.5-5-3.5v7Z" fill="currentColor" stroke="none" /></svg>;
    case "LinkedIn":
      return <svg {...common}><path d="M5 9v10M5 5.5v.1M10 19v-6a4 4 0 0 1 8 0v6M10 9v10" /><circle cx="5" cy="5.5" r="1" fill="currentColor" stroke="none" /></svg>;
    case "Facebook":
      return <svg {...common}><path d="M14.5 21v-8h3l.5-3h-3.5V8c0-.9.4-1.5 1.7-1.5H18V4a18 18 0 0 0-2.6-.2c-2.6 0-4.4 1.6-4.4 4.5v1.7H8v3h3v8h3.5Z" fill="currentColor" stroke="none" /></svg>;
    default:
      return null;
  }
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-intro">
          <div className="footer-brand">
            <Link href="/" className="brand brand-light">
              <span className="brand-mark" aria-hidden="true">E</span>
              <span className="brand-wordmark">{site.name}<small>{site.descriptor}</small></span>
            </Link>
            <p>{site.description}</p>
          </div>
          <div className="footer-social-block">
            <span className="footer-label">Espace Real Estate channels</span>
            <nav className="footer-socials" aria-label="Social media">
              {socials.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${label}`}>
                  <SocialIcon name={label} />
                  <span className="footer-social-name">{label}</span>
                  <span className="footer-social-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="footer-link-groups">
          <nav className="footer-column" aria-label="Explore">
            <h2>Explore</h2>
            <Link href="/properties">Properties</Link>
            <Link href="/off-plan">Off-plan</Link>
            <Link href="/areas">Dubai areas</Link>
            <Link href="/communities">Communities</Link>
          </nav>
          <nav className="footer-column" aria-label="Our approach">
            <h2>Our approach</h2>
            <Link href="/services/buying">Buying</Link>
            <Link href="/services/selling">Selling</Link>
            <Link href="/services/renting">Renting</Link>
            <Link href="/services/property-management">Property management</Link>
          </nav>
          <nav className="footer-column" aria-label="Get in touch">
            <h2>Get in touch</h2>
            <Link href="/contact">Contact</Link>
            <Link href="/book-a-viewing">Book a viewing</Link>
            <Link href="/property-valuation">Request a valuation</Link>
            <Link href="/mortgage-calculator">Mortgage calculator</Link>
            {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>}
            {site.phone && <a href={`tel:${site.phone}`}>{site.phone}</a>}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {site.name}. Listing details require verification.</span>
          <nav className="footer-legal" aria-label="Legal">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/cookie-policy">Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
