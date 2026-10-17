"use client";

import { useState } from "react";
import { useSavedProperties } from "./saved-properties";

export function FavoriteButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { favorites, toggleFavorite } = useSavedProperties();
  const saved = favorites.includes(id);
  return (
    <button
      type="button"
      className={`icon-button favorite-button${saved ? " is-active" : ""}${compact ? " is-compact" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved properties" : "Save property"}
      onClick={() => toggleFavorite(id)}
    >
      <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
    </button>
  );
}

export function CompareButton({ id }: { id: string }) {
  const { compared, toggleCompare } = useSavedProperties();
  const [message, setMessage] = useState("");
  const selected = compared.includes(id);
  const toggle = () => {
    if (!toggleCompare(id)) setMessage("You can compare up to three properties. Remove one to add another.");
    else setMessage("");
  };
  return (
    <span className="compare-action">
      <button type="button" className={`text-button${selected ? " is-active" : ""}`} aria-pressed={selected} onClick={toggle}>
        {selected ? "Added to compare" : "Compare"}
      </button>
      {message && <span className="sr-only" role="status">{message}</span>}
    </span>
  );
}
