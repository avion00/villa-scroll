import Link from "next/link";
import AppointmentRequestForm from "./appointment-request-form";
import Breadcrumbs from "./breadcrumbs";
import { site } from "../lib/site";

const phoneHref = `tel:${site.contactPerson.phone.replace(/[^\d+]/g, "")}`;
const whatsappHref = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;
const mortgageHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.officeAddress)}`;

function ContactIcon({ kind }: { kind: "whatsapp" | "phone" | "calendar" | "location" }) {
  const common = {
    "aria-hidden": true as const,
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "whatsapp") {
    return <svg {...common}><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" /><path d="M9 8.5c.5 2.2 2.2 3.9 4.5 4.5l1-1 1.8.8c.3.1.4.5.2.8-.5.8-1.4 1.2-2.3 1.1-3.2-.5-5.7-3-6.2-6.2-.1-.9.3-1.8 1.1-2.3.3-.2.7-.1.8.2l.8 1.8-1 1Z" /></svg>;
  }
  if (kind === "phone") {
    return <svg {...common}><path d="M7 3.8h2.6l1.2 4-1.7 1.5a14 14 0 0 0 5.6 5.6l1.5-1.7 4 1.2V17c0 1.1-.9 2-2 2A15.2 15.2 0 0 1 5 5.8c0-1.1.9-2 2-2Z" /></svg>;
  }
  if (kind === "calendar") {
    return <svg {...common}><rect x="3.5" y="5" width="17" height="15.5" rx="1.5" /><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h.1M12 13h.1M16 13h.1M8 16.5h.1M12 16.5h.1" /></svg>;
  }
  return <svg {...common}><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></svg>;
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      <div className="page-container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <header className="contact-hero">
          <div>
            <span className="eyebrow">A first conversation</span>
            <h1>Good moves start<br />with a conversation.</h1>
          </div>
          <p>
            Speak with our Dubai property team about buying, renting, selling or arranging a viewing.
            Call, message us on WhatsApp, or request a time that suits you.
          </p>
        </header>

        <section className="contact-quick-links" aria-label="Ways to contact us">
          <a className="contact-method-card contact-method-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <span className="contact-method-icon"><ContactIcon kind="whatsapp" /></span>
            <span className="contact-method-copy"><small>Fastest response</small><strong>Chat on WhatsApp</strong><span>Message {site.contactPerson.name}</span></span>
            <span className="contact-method-arrow" aria-hidden="true">↗</span>
          </a>
          <a className="contact-method-card" href={phoneHref}>
            <span className="contact-method-icon"><ContactIcon kind="phone" /></span>
            <span className="contact-method-copy"><small>Speak to our team</small><strong>Call {site.contactPerson.name}</strong><span>{site.contactPerson.phone}</span></span>
            <span className="contact-method-arrow" aria-hidden="true">↗</span>
          </a>
          <a className="contact-method-card" href="#appointment">
            <span className="contact-method-icon"><ContactIcon kind="calendar" /></span>
            <span className="contact-method-copy"><small>Plan a conversation</small><strong>Book an appointment</strong><span>Choose a preferred date and time</span></span>
            <span className="contact-method-arrow" aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="contact-people">
          <div className="contact-person-card">
            <div className="contact-person-monogram" aria-hidden="true">SM</div>
            <div className="contact-person-copy">
              <span className="eyebrow">Your point of contact</span>
              <h2>{site.contactPerson.name}</h2>
              <p>{site.contactPerson.role}</p>
              <div className="contact-person-actions">
                <a href={phoneHref}><ContactIcon kind="phone" /> Call directly</a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer"><ContactIcon kind="whatsapp" /> WhatsApp</a>
              </div>
            </div>
            <span className="contact-person-note">Here to help you take the next step with confidence.</span>
          </div>
          <div className="contact-office-card">
            <div className="contact-office-heading">
              <span className="contact-method-icon"><ContactIcon kind="location" /></span>
              <span><span className="eyebrow">Visit us</span><h2>Espace Real Estate office</h2></span>
            </div>
            <address>{site.officeAddress}</address>
            <a className="text-link" href={mapsHref} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a>
            <div className="contact-office-phone"><span>Mortgage enquiries</span><a href={mortgageHref}>{site.phone}</a></div>
          </div>
        </section>

        <section className="contact-appointment" id="appointment">
          <div className="contact-appointment-intro">
            <span className="eyebrow">Make time for what matters</span>
            <h2>Let&apos;s find a time to talk.</h2>
            <p>Tell us what you&apos;re looking for and when you&apos;re available. We&apos;ll prepare a message for WhatsApp so you can send your request directly to the team.</p>
            <ul>
              <li>Buying, renting or selling a home</li>
              <li>Property viewings and area questions</li>
              <li>Valuation or mortgage conversations</li>
            </ul>
            <p className="contact-privacy-note">Your details are only shared with WhatsApp if you choose to send the prepared message.</p>
          </div>
          <div className="contact-appointment-form">
            <div className="appointment-form-heading"><span>Appointment request</span><small>Usually takes less than a minute</small></div>
            <AppointmentRequestForm />
          </div>
        </section>

        <section className="contact-next-step">
          <div><span className="eyebrow">Prefer to browse first?</span><h2>Explore homes at your own pace.</h2></div>
          <Link className="button button-outline" href="/properties">View properties <span aria-hidden="true">↗</span></Link>
        </section>
      </div>
    </div>
  );
}
