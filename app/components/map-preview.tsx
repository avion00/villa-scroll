import { site } from "../lib/site";

export default function MapPreview({ area }: { area: string }) {
  const query = encodeURIComponent(`${area}, Dubai`);
  const googleSearchUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <section className="map-preview" aria-label={`Area map for ${area}`}>
      {site.mapProvider === "google" ? (
        <iframe
          title={`Map search for ${area}, Dubai`}
          src={`https://maps.google.com/maps?q=${query}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-placeholder"><span>Area-level map search</span><p>{area}, Dubai</p></div>
      )}
      <div className="map-caption"><span>Area-level search only · no property pin</span><a href={googleSearchUrl} target="_blank" rel="noreferrer">Open in Maps ↗</a></div>
    </section>
  );
}
