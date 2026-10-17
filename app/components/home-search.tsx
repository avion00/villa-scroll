"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function HomeSearch() {
  const router = useRouter();
  const [transaction, setTransaction] = useState("sale");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (transaction === "off-plan") {
      router.push("/off-plan");
      return;
    }
    const query = new URLSearchParams();
    query.set("transaction", transaction);
    if (location) query.set("location", location);
    if (type) query.set("type", type);
    if (maxPrice) query.set("maxPrice", maxPrice);
    if (bedrooms) query.set("bedrooms", bedrooms);
    router.push(`/properties?${query.toString()}`);
  };

  return (
    <form className="search-form" onSubmit={search} aria-label="Search properties">
      <div className="search-tabs" role="tablist" aria-label="Property transaction type">
        {[["sale", "Buy"], ["rent", "Rent"], ["off-plan", "Off-plan"]].map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={transaction === value} className={transaction === value ? "is-active" : ""} onClick={() => setTransaction(value)}>{label}</button>
        ))}
      </div>
      <div className="search-panel">
      <label>Where
        <select value={location} onChange={(event) => setLocation(event.target.value)}>
          <option value="">All Dubai</option>
          <option>The Springs</option><option>Arabian Ranches</option><option>Jumeirah Village Circle</option>
          <option>Al Furjan</option><option>Tilal Al Ghaf</option><option>Dubai Marina</option>
          <option>Downtown Dubai</option><option>Dubai Hills Estate</option><option>Palm Jumeirah</option>
          <option>Business Bay</option><option>Emirates Living</option>
        </select>
      </label>
      <label>Property type
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Any type</option><option>Villa</option><option>Apartment</option><option>Townhouse</option>
        </select>
      </label>
      <label>Max budget
        <select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
          <option value="">No maximum</option><option value="1500000">AED 1.5m</option><option value="3000000">AED 3m</option><option value="5000000">AED 5m</option><option value="10000000">AED 10m</option>
        </select>
      </label>
      <label>Bedrooms
        <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
          <option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option>
        </select>
      </label>
      <button className="button button-dark" type="submit">Explore homes <span aria-hidden="true">↗</span></button>
      </div>
    </form>
  );
}
