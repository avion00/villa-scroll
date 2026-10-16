import Link from "next/link";
import FrameSequenceCanvas from "./components/frame-sequence-canvas";
import AreaCard from "./components/area-card";
import PropertyCard from "./components/property-card";
import { areas } from "./lib/areas";
import { properties } from "./lib/properties";

export default function Home() {
  return (
    <>
      <FrameSequenceCanvas frameCount={720} initialFrameCount={150} />

      <section className="section">
        <div className="page-container">
          <div className="section-heading">
            <div><span className="eyebrow">Selected homes</span><h2 className="section-title">A place for what<br />comes next.</h2><p className="section-intro">Explore a small selection of supplied property listings. Details and availability should be confirmed with the listing source.</p></div>
            <Link className="text-link" href="/properties">View all properties <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="property-grid">
            {properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        </div>
      </section>

      <section className="section-narrow">
        <div className="page-container">
          <div className="section-heading"><div><span className="eyebrow">Browse by home type</span><h2 className="section-title">Start with the shape<br />of your next home.</h2></div></div>
          <div className="category-grid">
            {["Villa", "Apartment", "Townhouse", "Penthouse", "Waterfront", "Investment"].map((category) => (
              <Link className="category-link" href={`/properties?type=${encodeURIComponent(category)}`} key={category}>
                <span>{category}</span><span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
          <p className="source-note">Some home types do not appear in the supplied demonstration listings yet.</p>
        </div>
      </section>

      <section className="section dark-section">
        <div className="page-container">
          <div className="section-heading">
            <div><span className="eyebrow">Find your setting</span><h2 className="section-title">Explore Dubai,<br />area by area.</h2><p className="section-intro">Browse community pages and discover available listings. Local market details are intentionally limited to what has been verified.</p></div>
            <Link className="text-link" href="/areas">All areas <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="area-grid">{areas.slice(0, 8).map((area) => <AreaCard key={area.slug} area={area} />)}</div>
        </div>
      </section>

      <section className="section-narrow">
        <div className="page-container">
          <div className="section-heading"><div><span className="eyebrow">Looking ahead</span><h2 className="section-title">Off-plan, with<br />the facts in view.</h2><p className="section-intro">No verified development records were supplied, so we do not publish unconfirmed developer details, pricing or payment plans.</p></div><Link className="button button-outline" href="/off-plan">Explore off-plan <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="page-container">
          <div className="section-heading"><div><span className="eyebrow">A clear way forward</span><h2 className="section-title">Good decisions begin<br />with good guidance.</h2></div></div>
          <div className="value-grid">
            <div className="value-item"><h3>Understand the details</h3><p>Property facts are presented transparently, with unknown information left open for verification.</p></div>
            <div className="value-item"><h3>Explore with intention</h3><p>Search by area, type, budget and the everyday qualities that make a home feel right.</p></div>
            <div className="value-item"><h3>Move at your pace</h3><p>Compare your shortlist, save properties locally and prepare questions before speaking with an advisor.</p></div>
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="page-container">
          <div className="section-heading"><div><span className="eyebrow">Your next chapter</span><h2 className="section-title">The right home is<br />more than an address.</h2><p className="section-intro">Our buying, selling, rental and property-management service information is ready to help you plan your next step.</p></div><Link className="button button-light" href="/services">Explore our services <span aria-hidden="true">↗</span></Link></div>
          <div className="guide-grid">
            <Link className="guide-card" href="/guides/understanding-a-property-listing"><span>Buyer resource</span><h2>How to read a property listing</h2><p>Separate confirmed facts from questions to ask before arranging a viewing.</p><span>Read the guide ↗</span></Link>
            <Link className="guide-card" href="/mortgage-calculator"><span>Planning tool</span><h2>Plan a monthly mortgage estimate</h2><p>Explore an indicative repayment using assumptions you can adjust.</p><span>Open calculator ↗</span></Link>
            <Link className="guide-card" href="/guides/choosing-a-dubai-community"><span>Area guide</span><h2>Find a community that fits</h2><p>Build your shortlist around commute, home type, routines and priorities.</p><span>Explore the guide ↗</span></Link>
          </div>
        </div>
      </section>

      <section className="section-narrow">
        <div className="page-container">
          <div className="cta-band"><div><span className="eyebrow">A conversation, without pressure</span><h2>Tell us what you are looking for.</h2></div><Link className="button button-dark" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>
    </>
  );
}
