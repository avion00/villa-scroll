import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import InquiryForm from "../../components/inquiry-form";
import PropertyDetailActions from "../../components/property-detail-actions";
import PropertyGallery from "../../components/property-gallery";
import PropertyCard from "../../components/property-card";
import MapPreview from "../../components/map-preview";
import { properties, propertyBySlug } from "../../lib/properties";
import { formatAED, formatNumber } from "../../lib/site";

type PropertyPageProps = Pick<PageProps<"/properties/[slug]">, "params">;

export function generateStaticParams() {
  return [
    { slug: "for-sale" },
    { slug: "for-rent" },
    ...properties.map(({ slug }) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "for-sale" || slug === "for-rent") {
    return {
      title: slug === "for-sale" ? "Properties for Sale in Dubai" : "Properties for Rent in Dubai",
      description: `Explore the supplied demonstration listings for ${slug === "for-sale" ? "sale" : "rent"} in Dubai.`,
      alternates: { canonical: `/properties/${slug}` },
    };
  }
  const property = propertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  return {
    title: `${property.title} | ${property.community}, Dubai`,
    description: `${property.bedrooms}-bedroom ${property.propertyType.toLowerCase()} in ${property.subCommunity}, ${property.community}. Supplied listing details; verify before publication.`,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: { images: property.images.slice(0, 1).map(({ src }) => ({ url: src })) },
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  return (
    <Suspense fallback={<div className="page-container empty-state">Loading property…</div>}>
      <PropertyPageContent params={params} />
    </Suspense>
  );
}

async function PropertyPageContent({ params }: PropertyPageProps) {
  const { slug } = await params;
  if (slug === "for-sale" || slug === "for-rent") {
    const { default: PropertyExplorer } = await import("../../components/property-explorer");
    const forRent = slug === "for-rent";
    return (
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Properties", href: "/properties" }, { label: forRent ? "For rent" : "For sale" }]} />
        <header className="page-intro"><span className="eyebrow">Dubai property</span><h1 className="page-title">Homes {forRent ? "to rent" : "for sale"}.</h1><p className="section-intro">{forRent ? "No rental listings were included in this demonstration dataset. Contact us to discuss your requirements." : "Explore the supplied sale listings, filter by the details that matter and confirm availability with the source."}</p></header>
        <Suspense fallback={<div className="empty-state">Loading property search…</div>}>
          <PropertyExplorer properties={properties} initialTransaction={forRent ? "rent" : "sale"} />
        </Suspense>
      </div>
    );
  }

  const property = propertyBySlug(slug);
  if (!property) notFound();
  const related = properties.filter((item) => item.id !== property.id && item.community === property.community).slice(0, 2);
  const pricePerSqft = property.builtUpArea ? property.price / property.builtUpArea : null;

  return (
    <div className="page-container property-detail-hero">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Properties", href: "/properties" }, { label: property.community, href: `/areas/${property.community.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }, { label: property.title }]} />
      <div className="property-detail-top">
        <div><span className="eyebrow">{property.isExclusive ? "Exclusive listing" : "Supplied listing"}</span><h1>{property.title}</h1><p className="property-detail-location">{property.subCommunity}, {property.community}, {property.city}</p></div>
        <div><div className="property-detail-price">{formatAED(property.price)}</div><div className="property-detail-ref">Reference {property.reference}</div><PropertyDetailActions id={property.id} title={property.title} /></div>
      </div>
      <PropertyGallery images={property.images} title={property.title} />
      <div className="detail-columns">
        <div>
          <section className="detail-section">
            <h2>Property overview</h2>
            <p>{property.description}</p>
            <div className="detail-facts">
              <div className="detail-fact"><span>Asking price</span><strong>{formatAED(property.price)}</strong></div>
              <div className="detail-fact"><span>Bedrooms</span><strong>{property.bedrooms}</strong></div>
              {property.bathrooms !== null && <div className="detail-fact"><span>Bathrooms</span><strong>{property.bathrooms}</strong></div>}
              <div className="detail-fact"><span>Built-up area</span><strong>{property.builtUpArea ? `${formatNumber(property.builtUpArea)} sqft` : "Contact for details"}</strong></div>
              <div className="detail-fact"><span>Property type</span><strong>{property.propertyType}</strong></div>
              <div className="detail-fact"><span>Availability</span><strong>{property.availability ?? "Contact for details"}</strong></div>
            </div>
            {pricePerSqft && <p className="price-per-sqft">Calculated asking price: {formatAED(pricePerSqft)} per sqft of stated built-up area. Calculation only; not an appraisal.</p>}
            {property.headlineBedrooms && <p className="disclaimer">Verification note: the supplied property data states {property.bedrooms} bedrooms, while the supplied headline refers to {property.headlineBedrooms} bedrooms plus a maid&apos;s room. Please confirm the layout with the source.</p>}
            {property.features.length > 0 && <><h3>Details in the supplied headline</h3><ul className="feature-list">{property.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></>}
          </section>
          <section className="detail-section">
            <h2>Location</h2><p>This page identifies the supplied community only. No precise property coordinates or verified nearby distances were provided.</p>
            <MapPreview area={property.community} />
          </section>
          <section className="detail-section"><h2>Floor plan</h2><p>A floor plan was not included in the supplied listing materials. Contact us to ask whether one is available.</p></section>
          <section className="detail-section"><h2>Listing source</h2><p>This is an independent demonstration of property discovery and is not an official page of the source brokerage.</p><a className="text-link" href={property.sourceUrl} target="_blank" rel="noreferrer">View original source listing <span aria-hidden="true">↗</span></a><p className="source-note">Image sources were supplied as reference URLs. Confirm rights and availability before public or commercial use.</p></section>
        </div>
        <aside className="detail-contact">
          <h2>Ask about this home</h2><p>Share your question or request a viewing. Form submissions are not delivered until an inquiry service is configured.</p>
          <InquiryForm propertyId={property.id} propertyReference={property.reference} sourcePage={`/properties/${property.slug}`} purpose="Property enquiry" />
          <div className="source-note">No agent profile or direct contact details have been provided.</div>
        </aside>
      </div>
      {related.length > 0 && <section className="section-narrow"><div className="section-heading"><div><span className="eyebrow">Similar setting</span><h2 className="section-title">More in {property.community}.</h2></div><Link className="text-link" href={`/areas/${property.community.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>Explore the area ↗</Link></div><div className="property-grid">{related.map((item) => <PropertyCard key={item.id} property={item} />)}</div></section>}
    </div>
  );
}
