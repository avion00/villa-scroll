"use client";

import { useState } from "react";
import { CompareButton, FavoriteButton } from "./property-actions";

export default function PropertyDetailActions({ id, title }: { id: string; title: string }) {
  const [status, setStatus] = useState("");

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") setStatus("Sharing is unavailable in this browser.");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
    } catch {
      setStatus("Unable to copy the link. You can copy it from your browser address bar.");
    }
  };

  return (
    <div className="detail-actions">
      <FavoriteButton id={id} compact />
      <CompareButton id={id} />
      <button className="text-button" type="button" onClick={share}>Share</button>
      <button className="text-button" type="button" onClick={() => window.print()}>Print</button>
      {status && <span className="sr-only" role="status">{status}</span>}
    </div>
  );
}
