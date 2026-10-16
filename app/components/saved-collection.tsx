"use client";

import Link from "next/link";
import { properties } from "../lib/properties";
import { formatAED, formatNumber } from "../lib/site";
import PropertyCard from "./property-card";
import { useSavedProperties } from "./saved-properties";

export function FavoritesCollection() {
  const { favorites } = useSavedProperties();
  const saved = properties.filter((property) => favorites.includes(property.id));
  return (
    <div className="page-container">
      <header className="page-intro"><span className="eyebrow">Your shortlist</span><h1 className="page-title">Saved properties.</h1><p className="section-intro">Your saved homes are stored in this browser only. They are not connected to an account.</p></header>
      {saved.length ? <div className="property-grid">{saved.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="empty-state"><h2>Your shortlist is ready when you are.</h2><p>Save a property to keep it here. Saved items persist in your browser using local storage.</p><Link className="button button-dark" href="/properties">Explore properties <span aria-hidden="true">↗</span></Link></div>}
    </div>
  );
}

export function CompareCollection() {
  const { compared } = useSavedProperties();
  const selected = properties.filter((property) => compared.includes(property.id));
  const rows: [string, (property: (typeof selected)[number]) => string][] = [
    ["Price", (property) => formatAED(property.price)],
    ["Property type", (property) => property.propertyType],
    ["Community", (property) => `${property.subCommunity}, ${property.community}`],
    ["Bedrooms", (property) => String(property.bedrooms)],
    ["Bathrooms", (property) => property.bathrooms === null ? "Not supplied" : String(property.bathrooms)],
    ["Built-up area", (property) => property.builtUpArea ? `${formatNumber(property.builtUpArea)} sqft` : "Not supplied"],
    ["Plot area", (property) => property.plotArea ? `${formatNumber(property.plotArea)} sqft` : "Not supplied"],
    ["Price per built-up sqft", (property) => property.builtUpArea ? formatAED(property.price / property.builtUpArea) : "Not available"],
    ["Furnishing", (property) => property.furnishing ?? "Not supplied"],
    ["Availability", (property) => property.availability ?? "Not supplied"],
    ["Reference", (property) => property.reference],
  ];

  return (
    <div className="page-container">
      <header className="page-intro"><span className="eyebrow">Make a considered choice</span><h1 className="page-title">Compare homes.</h1><p className="section-intro">Compare up to three properties. Missing facts are clearly marked rather than assumed.</p></header>
      {selected.length ? (
        <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>Property</th>{selected.map((property) => <th key={property.id}><Link href={`/properties/${property.slug}`}>{property.title}</Link><p>{property.reference}</p></th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><td>{label}</td>{selected.map((property) => <td key={property.id}>{value(property)}</td>)}</tr>)}</tbody></table><p className="source-note">Comparison uses the supplied demonstration listing information. Confirm current facts and availability with the listing source.</p></div>
      ) : (
        <div className="empty-state"><h2>Your comparison is empty.</h2><p>Add properties to compare from property cards or detail pages. You can compare up to three homes.</p><Link className="button button-dark" href="/properties">Explore properties <span aria-hidden="true">↗</span></Link></div>
      )}
    </div>
  );
}
