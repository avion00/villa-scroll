import Link from "next/link";
import type { Property } from "../lib/properties";
import { formatAED, formatNumber } from "../lib/site";
import { CompareButton, FavoriteButton } from "./property-actions";
import ReferenceImage from "./reference-image";

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.images[0];
  return (
    <article className="property-card">
      <Link className="property-card-image" href={`/properties/${property.slug}`} aria-label={`View ${property.title}`}>
        <ReferenceImage
          src={cover.src}
          alt={cover.alt}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        <span className="property-label">{property.isExclusive ? "Exclusive" : "For sale"}</span>
      </Link>
      <FavoriteButton id={property.id} />
      <div className="property-card-body">
        <div className="property-card-price">{formatAED(property.price)}</div>
        <Link href={`/properties/${property.slug}`} className="property-card-title">{property.title}</Link>
        <p className="property-card-location">{property.subCommunity}, {property.community}</p>
        <div className="property-facts">
          <span>{property.bedrooms} bed</span>
          {property.bathrooms !== null && <span>{property.bathrooms} bath</span>}
          <span>{property.builtUpArea ? `${formatNumber(property.builtUpArea)} sqft` : "Area on request"}</span>
          <span>{property.propertyType}</span>
        </div>
        <div className="property-card-foot">
          <span>Ref. {property.reference}</span>
          <CompareButton id={property.id} />
        </div>
      </div>
    </article>
  );
}
