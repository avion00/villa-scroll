import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "../components/breadcrumbs";
import PropertyExplorer from "../components/property-explorer";
import { properties } from "../lib/properties";

export const metadata: Metadata = {
  title: "Properties for Sale and Rent in Dubai",
  description: "Explore the supplied demonstration listings in Dubai. Filter by price, location, home type and bedrooms.",
  alternates: { canonical: "/properties" },
};

export default function PropertiesPage() {
  return (
    <div className="page-container">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Properties" }]} />
      <header className="page-intro">
        <span className="eyebrow">The property collection</span>
        <h1 className="page-title">Find your place<br />in Dubai.</h1>
        <p className="section-intro">Explore our collection of supplied demonstration listings. Discover homes across Dubai, refine by location, property type, price and bedrooms, or contact us to discuss a search. Confirm current availability and details with the listing source.</p>
      </header>
      <Suspense fallback={<div className="empty-state">Loading property search…</div>}>
        <PropertyExplorer properties={properties} />
      </Suspense>
    </div>
  );
}
