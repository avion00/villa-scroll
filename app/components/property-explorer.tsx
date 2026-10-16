"use client";

import { useMemo, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Property } from "../lib/properties";
import PropertyCard from "./property-card";

type Filters = {
  transaction: string;
  location: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  maxBedrooms: string;
  minBathrooms: string;
  minArea: string;
  maxArea: string;
  furnishing: string;
  completionStatus: string;
  developer: string;
  keyword: string;
  exclusive: boolean;
};

const blankFilters: Filters = {
  transaction: "",
  location: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  maxBedrooms: "",
  minBathrooms: "",
  minArea: "",
  maxArea: "",
  furnishing: "",
  completionStatus: "",
  developer: "",
  keyword: "",
  exclusive: false,
};

function filtersFromSearch(search: URLSearchParams): Filters {
  return {
    transaction: search.get("transaction") ?? "",
    location: search.get("location") ?? "",
    type: search.get("type") ?? "",
    minPrice: search.get("minPrice") ?? "",
    maxPrice: search.get("maxPrice") ?? "",
    bedrooms: search.get("bedrooms") ?? "",
    maxBedrooms: search.get("maxBedrooms") ?? "",
    minBathrooms: search.get("minBathrooms") ?? "",
    minArea: search.get("minArea") ?? "",
    maxArea: search.get("maxArea") ?? "",
    furnishing: search.get("furnishing") ?? "",
    completionStatus: search.get("completionStatus") ?? "",
    developer: search.get("developer") ?? "",
    keyword: search.get("keyword") ?? "",
    exclusive: search.get("exclusive") === "true",
  };
}

export default function PropertyExplorer({
  properties,
  initialTransaction = "",
}: {
  properties: Property[];
  initialTransaction?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => ({
    ...blankFilters,
    ...filtersFromSearch(new URLSearchParams(searchParams.toString())),
    transaction:
      new URLSearchParams(searchParams.toString()).get("transaction") ??
      initialTransaction,
  }));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [sort, setSort] = useState("featured");
  const [filterError, setFilterError] = useState("");

  const results = useMemo(() => {
    const filtered = properties.filter((property) => {
      const text = `${property.title} ${property.reference} ${property.community} ${property.subCommunity}`.toLowerCase();
      return (
        (!filters.transaction || (filters.transaction === "off-plan" ? property.isOffPlan : property.transactionType === filters.transaction)) &&
        (!filters.location || `${property.community} ${property.subCommunity}`.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.type || property.propertyType.toLowerCase() === filters.type.toLowerCase()) &&
        (!filters.minPrice || property.price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || property.price <= Number(filters.maxPrice)) &&
        (!filters.bedrooms || property.bedrooms >= Number(filters.bedrooms)) &&
        (!filters.maxBedrooms || property.bedrooms <= Number(filters.maxBedrooms)) &&
        (!filters.minBathrooms || (property.bathrooms !== null && property.bathrooms >= Number(filters.minBathrooms))) &&
        (!filters.minArea || (property.builtUpArea !== null && property.builtUpArea >= Number(filters.minArea))) &&
        (!filters.maxArea || (property.builtUpArea !== null && property.builtUpArea <= Number(filters.maxArea))) &&
        (!filters.furnishing || property.furnishing?.toLowerCase() === filters.furnishing) &&
        (!filters.completionStatus || property.completionStatus === filters.completionStatus) &&
        (!filters.developer || `${property.developer ?? ""} ${property.project ?? ""}`.toLowerCase().includes(filters.developer.toLowerCase())) &&
        (!filters.keyword || text.includes(filters.keyword.toLowerCase())) &&
        (!filters.exclusive || property.isExclusive)
      );
    });

    return filtered.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "area") return (b.builtUpArea ?? 0) - (a.builtUpArea ?? 0);
      return Number(b.isFeatured) - Number(a.isFeatured);
    });
  }, [filters, properties, sort]);

  const update = (key: keyof Filters, value: string | boolean) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      (filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice)) ||
      (filters.bedrooms && filters.maxBedrooms && Number(filters.bedrooms) > Number(filters.maxBedrooms)) ||
      (filters.minArea && filters.maxArea && Number(filters.minArea) > Number(filters.maxArea))
    ) {
      setFilterError("Minimum values cannot be greater than maximum values.");
      return;
    }
    setFilterError("");
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilters({ ...blankFilters, transaction: initialTransaction });
    setFilterError("");
    router.replace(pathname, { scroll: false });
  };

  const setField = (key: keyof Filters, value: string) => update(key, value);
  const activeCount = Object.entries(filters).filter(([key, value]) => value && !(key === "transaction" && value === initialTransaction)).length;

  return (
    <div className="listing-layout">
      <aside className={`filters-panel${filtersOpen ? " is-open" : ""}`}>
        <h2>Refine your search</h2>
        <form onSubmit={applyFilters}>
          <label className="filter-field">Buy or rent
            <select value={filters.transaction} onChange={(event) => setField("transaction", event.target.value)}>
              <option value="">Any listing</option><option value="sale">For sale</option><option value="rent">For rent</option>
            </select>
          </label>
          <label className="filter-field">Location
            <select value={filters.location} onChange={(event) => setField("location", event.target.value)}>
              <option value="">All locations</option>
              {[...new Set(properties.flatMap((property) => [property.community, property.subCommunity]))].sort().map((location) => <option key={location}>{location}</option>)}
            </select>
          </label>
          <label className="filter-field">Property type
            <select value={filters.type} onChange={(event) => setField("type", event.target.value)}>
              <option value="">Any type</option>{[...new Set(properties.map((property) => property.propertyType))].map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <div className="filter-row">
            <label className="filter-field">Min. price (AED)<input inputMode="numeric" min="0" type="number" value={filters.minPrice} onChange={(event) => setField("minPrice", event.target.value)} /></label>
            <label className="filter-field">Max. price (AED)<input inputMode="numeric" min="0" type="number" value={filters.maxPrice} onChange={(event) => setField("maxPrice", event.target.value)} /></label>
          </div>
          <div className="filter-row">
            <label className="filter-field">Min. bedrooms<input inputMode="numeric" min="0" type="number" value={filters.bedrooms} onChange={(event) => setField("bedrooms", event.target.value)} /></label>
            <label className="filter-field">Max. bedrooms<input inputMode="numeric" min="0" type="number" value={filters.maxBedrooms} onChange={(event) => setField("maxBedrooms", event.target.value)} /></label>
          </div>
          <label className="filter-field">Minimum bathrooms<input inputMode="numeric" min="0" type="number" value={filters.minBathrooms} onChange={(event) => setField("minBathrooms", event.target.value)} /></label>
          <div className="filter-row">
            <label className="filter-field">Min. area (sqft)<input inputMode="numeric" min="0" type="number" value={filters.minArea} onChange={(event) => setField("minArea", event.target.value)} /></label>
            <label className="filter-field">Max. area (sqft)<input inputMode="numeric" min="0" type="number" value={filters.maxArea} onChange={(event) => setField("maxArea", event.target.value)} /></label>
          </div>
          <label className="filter-field">Furnishing
            <select value={filters.furnishing} onChange={(event) => setField("furnishing", event.target.value)}>
              <option value="">Any / not specified</option><option value="furnished">Furnished</option><option value="unfurnished">Unfurnished</option><option value="part-furnished">Part furnished</option>
            </select>
          </label>
          <label className="filter-field">Property status
            <select value={filters.completionStatus} onChange={(event) => setField("completionStatus", event.target.value)}>
              <option value="">Any / not specified</option><option value="ready">Ready</option><option value="off-plan">Off-plan</option>
            </select>
          </label>
          <label className="filter-field">Developer or project<input type="search" value={filters.developer} onChange={(event) => setField("developer", event.target.value)} placeholder="Project or developer" /></label>
          <label className="filter-field">Keyword or reference<input type="search" value={filters.keyword} onChange={(event) => setField("keyword", event.target.value)} placeholder="e.g. ES-41428" /></label>
          <label className="filter-check"><input type="checkbox" checked={filters.exclusive} onChange={(event) => update("exclusive", event.target.checked)} /> Exclusive listings</label>
          <div className="filter-actions">
            <button className="button button-dark" type="submit">Apply filters ({activeCount})</button>
            <button className="button button-outline" type="button" onClick={clearFilters}>Clear all</button>
          </div>
        </form>
      </aside>
      <div>
        <div className="listing-tools">
          <button className="button button-outline filter-mobile-toggle" type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>Filters{activeCount > 0 ? ` (${activeCount})` : ""}</button>
          <span className="listing-count" aria-live="polite">{results.length} {results.length === 1 ? "property" : "properties"} found</span>
          <div className="listing-controls">
            <label className="sr-only" htmlFor="property-sort">Sort properties</label>
            <select id="property-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="area">Area: largest first</option>
            </select>
            <button className="button button-outline view-toggle" type="button" aria-pressed={listView} onClick={() => setListView((value) => !value)}>{listView ? "Grid view" : "List view"}</button>
          </div>
        </div>
        {activeCount > 0 && (
          <div className="active-filters" aria-label="Active filters">
            {(Object.entries(filters) as [keyof Filters, string | boolean][])
              .filter(([key, value]) => Boolean(value) && !(key === "transaction" && value === initialTransaction))
              .map(([key, value]) => {
                const labels: Record<keyof Filters, string> = {
                  transaction: value === "sale" ? "For sale" : value === "off-plan" ? "Off-plan" : "For rent",
                  location: "Location",
                  type: "Property type",
                  minPrice: "Min. price",
                  maxPrice: "Max. price",
                  bedrooms: "Min. bedrooms",
                  maxBedrooms: "Max. bedrooms",
                  minBathrooms: "Min. bathrooms",
                  minArea: "Min. area",
                  maxArea: "Max. area",
                  furnishing: "Furnishing",
                  completionStatus: "Status",
                  developer: "Developer / project",
                  keyword: "Keyword",
                  exclusive: "Exclusive",
                };
                return <button key={key} className="filter-chip" onClick={() => update(key, key === "exclusive" ? false : key === "transaction" ? initialTransaction : "")}>{labels[key]}: {typeof value === "boolean" ? "Yes" : value} ×</button>;
              })}
            <button className="filter-chip" onClick={clearFilters}>Clear all</button>
          </div>
        )}
        {filterError && <p className="form-status" role="alert">{filterError}</p>}
        {results.length ? (
          <div className={`listing-grid${listView ? " is-list" : ""}`}>{results.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
        ) : (
          <div className="empty-state">
            <h2>No matching properties in this demonstration dataset</h2>
            <p>We have not been supplied with a complete live inventory. Adjust your filters or get in touch to discuss a search.</p>
            <button type="button" className="button button-dark" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
