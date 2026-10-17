"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const FAVORITES_KEY = "villa-scroll:favorites";
const COMPARE_KEY = "villa-scroll:compare";
const CHANGE_EVENT = "villa-scroll:saved-properties-change";
const MAX_COMPARE = 3;

type SavedPropertiesContextValue = {
  favorites: string[];
  compared: string[];
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => boolean;
};

const SavedPropertiesContext = createContext<SavedPropertiesContextValue | null>(null);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function snapshot(key: string) {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(key) ?? "[]";
}

function readIds(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function updateIds(key: string, id: string, limit?: number) {
  const current = readIds(snapshot(key));
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : limit && current.length >= limit
      ? null
      : [...current, id];
  if (!next) return false;

  window.localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}

export function SavedPropertiesProvider({ children }: { children: React.ReactNode }) {
  const favoriteSnapshot = useSyncExternalStore(
    subscribe,
    () => snapshot(FAVORITES_KEY),
    () => "[]",
  );
  const compareSnapshot = useSyncExternalStore(
    subscribe,
    () => snapshot(COMPARE_KEY),
    () => "[]",
  );

  const value: SavedPropertiesContextValue = {
    favorites: readIds(favoriteSnapshot),
    compared: readIds(compareSnapshot),
    toggleFavorite: (id) => { updateIds(FAVORITES_KEY, id); },
    toggleCompare: (id) => updateIds(COMPARE_KEY, id, MAX_COMPARE),
  };

  return <SavedPropertiesContext.Provider value={value}>{children}</SavedPropertiesContext.Provider>;
}

export function useSavedProperties() {
  const context = useContext(SavedPropertiesContext);
  if (!context) throw new Error("useSavedProperties must be used inside SavedPropertiesProvider");
  return context;
}
