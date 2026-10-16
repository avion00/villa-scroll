import Link from "next/link";
import type { Area } from "../lib/areas";

export default function AreaCard({ area }: { area: Area }) {
  return (
    <Link className="area-card" href={`/areas/${area.slug}`}>
      <span className="area-card-arrow" aria-hidden="true">↗</span>
      <span className="eyebrow">Explore Dubai</span>
      <strong>{area.name}</strong>
      <span>{area.character}</span>
    </Link>
  );
}
