import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "../components/breadcrumbs";
import InquiryForm from "../components/inquiry-form";
import MortgageCalculator from "../components/mortgage-calculator";
import MapPreview from "../components/map-preview";
import AreaCard from "../components/area-card";
import PropertyCard from "../components/property-card";
import ContactPage from "../components/contact-page";
import { areas, areaBySlug } from "../lib/areas";
import { guideBySlug, guides } from "../lib/guides";
import { properties } from "../lib/properties";

type CatchAllProps = { params: Promise<{ path: string[] }> };

const routeTitles: Record<string, string> = {
  about: "About ESPACE",
  "off-plan": "Off-plan developments in Dubai",
  agents: "Our property team",
  services: "Property services in Dubai",
  contact: "Contact",
  "book-a-viewing": "Book a property viewing",
  "property-valuation": "Request a property valuation",
  "mortgage-calculator": "Mortgage calculator",
  favorites: "Saved properties",
  compare: "Compare properties",
  guides: "Dubai property guides",
  "privacy-policy": "Privacy policy",
  "terms-and-conditions": "Terms and conditions",
  "cookie-policy": "Cookie policy",
};

export async function generateMetadata({ params }: CatchAllProps): Promise<Metadata> {
  const { path } = await params;
  const route = path.join("/");
  const base = path[0] ?? "";
  const title =
    base === "areas" || base === "communities"
      ? areaBySlug(path[1] ?? "")?.name ?? "Dubai property areas"
      : base === "guides"
        ? guideBySlug(path[1] ?? "")?.title ?? routeTitles.guides
        : base === "services" && path[1]
          ? servicePages[path[1]]?.title ?? "Property services"
          : routeTitles[base] ?? "Dubai property";
  return {
    title,
    description: `${title}. Explore Dubai property information and supplied demonstration listings with details to verify.`,
    ...(route ? { alternates: { canonical: `/${route}` } } : {}),
  };
}

const servicePages: Record<string, { title: string; summary: string; points: string[] }> = {
  buying: { title: "Buying property in Dubai", summary: "A structured way to define your search, compare homes and prepare for a purchase.", points: ["Clarify the areas, property types and budget that fit your brief.", "Arrange viewings and gather current property information.", "Review documents and next steps with qualified professionals before committing."] },
  selling: { title: "Selling a property in Dubai", summary: "Present your property clearly and plan a considered route to market.", points: ["Prepare accurate property facts and imagery.", "Discuss a marketing plan and intended audience.", "Review enquiries, viewing feedback and offers with an advisor."] },
  renting: { title: "Renting a home in Dubai", summary: "Find a rental home that works for your household and daily routines.", points: ["Define your preferred area, home type and move-in timing.", "Confirm availability, rental terms and included features directly.", "Review all documents and applicable requirements before signing."] },
  "property-management": { title: "Property management", summary: "A service overview for owners seeking support with property administration.", points: ["Discuss the property, service scope and owner priorities.", "Agree responsibilities and reporting expectations in writing.", "Confirm all fees, authorities and service terms before appointment."] },
  "investment-advisory": { title: "Investment guidance", summary: "A decision-support conversation grounded in your goals and risk tolerance.", points: ["Clarify your objectives, time horizon and constraints.", "Review available information and assumptions transparently.", "Seek independent financial, legal and tax advice where appropriate."] },
};

const legalPages: Record<string, { title: string; intro: string; sections: string[] }> = {
  "privacy-policy": { title: "Privacy policy", intro: "This demonstration site does not currently submit or store enquiry form data. Favorites and comparison selections are saved locally in your browser.", sections: ["No analytics, CRM or email delivery service is configured in this project.", "Local storage is used only for saved property IDs and comparison selections; clearing browser data removes these selections.", "Before production, replace this notice with a reviewed policy explaining the real operator, data controller, purposes, retention periods, processors, user rights and contact details."] },
  "terms-and-conditions": { title: "Terms and conditions", intro: "This site is a demonstration property-discovery experience. Its supplied listing records and third-party image references have not been independently verified.", sections: ["Property information, prices, availability and images are not offers or guarantees and must be confirmed with the relevant source.", "Nothing on this site is legal, tax, mortgage or investment advice. Consult appropriately qualified professionals.", "Before production, configure the business operator and obtain legal review of terms applicable to the actual service."] },
  "cookie-policy": { title: "Cookie policy", intro: "This demonstration does not install an analytics or advertising cookie service. Browser local storage supports the favorites and comparison controls.", sections: ["Local storage entries are held in this browser and are not transmitted to a server.", "If analytics, marketing or other storage is introduced, disclose it accurately and obtain any consent required before deployment.", "Before production, review all third-party assets and integrations and publish an up-to-date policy."] },
};

export function generateStaticParams() {
  return [
    ["areas"],
    ["communities"],
    ...areas.flatMap((area) => [["areas", area.slug], ["communities", area.slug]]),
    ["about"],
    ["services"],
    ...Object.keys(servicePages).map((slug) => ["services", slug]),
    ["off-plan"],
    ["agents"],
    ["contact"],
    ["book-a-viewing"],
    ["property-valuation"],
    ["mortgage-calculator"],
    ["favorites"],
    ["compare"],
    ["guides"],
    ...guides.map((guide) => ["guides", guide.slug]),
    ...Object.keys(legalPages).map((slug) => [slug]),
  ].map((path) => ({ path }));
}

function PageHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <header className="page-intro"><span className="eyebrow">{eyebrow}</span><h1 className="page-title">{title}</h1><p className="section-intro">{text}</p></header>;
}

function DirectoryCards({ items }: { items: { title: string; text: string; href: string }[] }) {
  return <div className="route-link-grid">{items.map((item) => <article className="route-link-card" key={item.href}><h2>{item.title}</h2><p>{item.text}</p><Link href={item.href}>Explore <span aria-hidden="true">↗</span></Link></article>)}</div>;
}

export default function OtherPages({ params }: CatchAllProps) {
  return (
    <Suspense fallback={<div className="page-container empty-state">Loading page…</div>}>
      <OtherPagesContent params={params} />
    </Suspense>
  );
}

async function OtherPagesContent({ params }: CatchAllProps) {
  const { path } = await params;
  const [section, slug] = path;

  if ((section === "areas" || section === "communities") && !slug) {
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: section === "areas" ? "Areas" : "Communities" }]} /><PageHeading eyebrow="Explore Dubai" title={section === "areas" ? "Discover by area." : "Explore communities."} text="Browse Dubai locations represented in this demonstration directory. Community information is intentionally high-level until verified local details are configured." /><div className="area-grid">{areas.map((area) => <AreaCard key={area.slug} area={area} />)}</div></div>;
  }

  if ((section === "areas" || section === "communities") && slug) {
    const area = areaBySlug(slug);
    if (!area) notFound();
    const matchingProperties = properties.filter((property) => property.community.toLowerCase() === area.name.toLowerCase());
    const nearby = areas.filter((item) => item.slug !== slug).slice(0, 4);
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: section === "areas" ? "Areas" : "Communities", href: `/${section}` }, { label: area.name }]} /><PageHeading eyebrow="Dubai area guide" title={`${area.name}.`} text={`${area.intro} Typical property styles noted in this directory: ${area.character}. No precise market statistics, travel times or nearby-facility details are asserted here.`} /><section className="detail-section"><h2>Area overview</h2><p>{area.intro} Visit the community and verify facilities, access, current market information and any property-specific claims directly before making a decision.</p><p className="disclaimer">This area guide is an introductory overview only. No location pin or nearby distances are provided because no verified coordinates or source data were supplied.</p><MapPreview area={area.name} /></section><section className="section-narrow"><div className="section-heading"><div><span className="eyebrow">Available listings</span><h2 className="section-title">Homes in {area.name}.</h2></div></div>{matchingProperties.length ? <div className="property-grid">{matchingProperties.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="empty-state"><h2>No supplied listings for this area yet.</h2><p>The available demonstration data does not include a listing for {area.name}.</p><Link className="button button-dark" href="/contact">Discuss a search ↗</Link></div>}</section><section className="section-narrow"><div className="section-heading"><div><span className="eyebrow">Continue exploring</span><h2 className="section-title">Other Dubai areas.</h2></div></div><div className="area-grid">{nearby.map((item) => <AreaCard key={item.slug} area={item} />)}</div></section></div>;
  }

  if (section === "about") {
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} /><PageHeading eyebrow="About this experience" title="Property, with perspective." text="ESPACE is an original demonstration brand created to explore a premium Dubai property discovery experience. It is not an official website of any brokerage and does not currently represent a configured operating business." /><div className="value-grid"><div className="value-item"><h3>Clarity</h3><p>Show what is known, keep missing facts visible and provide a clear source for supplied listing records.</p></div><div className="value-item"><h3>Context</h3><p>Make it easier to explore homes by location and practical property details.</p></div><div className="value-item"><h3>Care</h3><p>Use transparent forms and avoid claims about people, credentials or services that have not been configured.</p></div></div><div className="section-narrow"><div className="disclaimer">Before public launch, configure the real business name, verified team, contact channels, social links, service terms and authorized listing content.</div></div></div>;
  }

  if (section === "services" && !slug) {
    const services = Object.entries(servicePages).map(([key, value]) => ({ title: value.title, text: value.summary, href: `/services/${key}` }));
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} /><PageHeading eyebrow="How we can help" title="A clearer path forward." text="Explore service information for buyers, sellers, renters, property owners and investors. No service engagement or advisory relationship is active through this demonstration site." /><DirectoryCards items={services} /></div>;
  }

  if (section === "services" && slug) {
    const service = servicePages[slug];
    if (!service) notFound();
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]} /><PageHeading eyebrow="Property services" title={service.title} text={service.summary} /><div className="detail-columns"><div className="detail-section"><h2>What to consider</h2><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul><p className="disclaimer">Service availability, terms, fees and credentials must be confirmed with a real, configured business before relying on this information.</p></div><aside className="detail-contact"><h2>Start a conversation</h2><InquiryForm purpose={service.title} /></aside></div></div>;
  }

  if (section === "off-plan" && !slug) {
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Off-plan" }]} /><PageHeading eyebrow="New developments" title="A considered look ahead." text="No verified off-plan development records were supplied. We do not publish developer names, starting prices, payment plans or completion dates without confirmed source information." /><div className="empty-state"><h2>Development details are not yet configured.</h2><p>Ask us to help shape a search. No inquiry is delivered until a backend service is connected.</p><Link href="/contact" className="button button-dark">Make an enquiry ↗</Link></div></div>;
  }

  if (section === "off-plan" && slug) notFound();

  if (section === "agents" && !slug) {
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Agents" }]} /><PageHeading eyebrow="The people behind the search" title="Meet your property team." text="Agent profiles, identities, languages and contact information have not been configured. We avoid inventing team members or professional credentials." /><div className="empty-state"><h2>Team profiles coming after verification.</h2><p>Configure verified names, biographies, areas of expertise, photographs and contact details to publish agent profiles.</p><Link href="/contact" className="button button-dark">Contact the team ↗</Link></div></div>;
  }

  if (section === "agents" && slug) notFound();

  if (section === "contact") {
    return <ContactPage />;
  }

  if (section === "book-a-viewing" || section === "property-valuation") {
    const content = section === "book-a-viewing"
      ? { eyebrow: "See it for yourself", title: "Request a viewing.", text: "Tell us which listing you would like to view and a preferred time. Viewing requests are not delivered until a backend service is configured." }
      : { eyebrow: "Understand your options", title: "Request a valuation.", text: "Provide details about your property to start a valuation enquiry. No estimate is generated and this form does not send or store your details." };
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: content.title }]} /><PageHeading {...content} /><div className="detail-columns"><div className="detail-section"><h2>How this works</h2><p>Use the contact details on our contact page to speak with the team directly.</p></div><aside className="detail-contact"><h2>{content.title}</h2><InquiryForm purpose={section === "book-a-viewing" ? "Viewing request" : "Valuation enquiry"} /></aside></div></div>;
  }

  if (section === "mortgage-calculator") {
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Mortgage calculator" }]} /><PageHeading eyebrow="Plan with assumptions" title="Understand the numbers." text="Explore an illustrative amortizing-loan estimate and adjust assumptions to understand how they affect a monthly repayment." /><MortgageCalculator /></div>;
  }

  if (section === "favorites" || section === "compare") {
    const { FavoritesCollection, CompareCollection } = await import("../components/saved-collection");
    const Collection = section === "favorites" ? FavoritesCollection : CompareCollection;
    return <Collection />;
  }

  if (section === "guides" && !slug) {
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} /><PageHeading eyebrow="Knowledge, made useful" title="A little more perspective." text="Practical reading to help structure your property search. This content is general information, not legal, financial or investment advice." /><div className="guide-grid">{guides.map((guide) => <Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}><span>{guide.category}</span><h2>{guide.title}</h2><p>{guide.excerpt}</p><span>Read the guide ↗</span></Link>)}</div></div>;
  }

  if (section === "guides" && slug) {
    const guide = guideBySlug(slug);
    if (!guide) notFound();
    return <article className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: guide.title }]} /><header className="page-intro"><span className="eyebrow">{guide.category}</span><h1 className="page-title">{guide.title}</h1><p className="section-intro">{guide.excerpt}</p></header><div className="guide-article">{guide.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<p className="disclaimer">This guide provides general information only and is not a substitute for professional advice.</p><Link className="text-link" href="/guides">← Back to all guides</Link></div></article>;
  }

  if (legalPages[section]) {
    const legal = legalPages[section];
    return <div className="page-container"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: legal.title }]} /><PageHeading eyebrow="Site information" title={legal.title} text={legal.intro} /><div className="legal-copy">{legal.sections.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div>;
  }

  notFound();
}
