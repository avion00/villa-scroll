import type { MetadataRoute } from "next";
import { areas } from "./lib/areas";
import { guides } from "./lib/guides";
import { properties } from "./lib/properties";
import { site } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = site.canonicalOrigin;
  if (!origin) return [];
  const staticRoutes = [
    "/", "/properties", "/properties/for-sale", "/properties/for-rent",
    "/off-plan", "/areas", "/communities", "/agents", "/about", "/services",
    "/contact", "/book-a-viewing", "/property-valuation", "/mortgage-calculator",
    "/guides", "/favorites", "/compare", "/privacy-policy",
    "/terms-and-conditions", "/cookie-policy",
  ];
  return [
    ...staticRoutes.map((path) => ({ url: new URL(path, origin).toString() })),
    ...properties.map((property) => ({ url: new URL(`/properties/${property.slug}`, origin).toString() })),
    ...areas.flatMap((area) => [
      { url: new URL(`/areas/${area.slug}`, origin).toString() },
      { url: new URL(`/communities/${area.slug}`, origin).toString() },
    ]),
    ...guides.map((guide) => ({ url: new URL(`/guides/${guide.slug}`, origin).toString() })),
  ];
}
