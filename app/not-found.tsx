import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container">
      <section className="page-intro">
        <span className="eyebrow">404 · Page not found</span>
        <h1 className="page-title">This address<br />has moved on.</h1>
        <p className="section-intro">The page may have changed or may not exist in this demonstration site.</p>
        <div className="detail-actions"><Link className="button button-dark" href="/">Return home</Link><Link className="button button-outline" href="/properties">Explore properties</Link></div>
      </section>
    </div>
  );
}
