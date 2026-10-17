export type Area = {
  slug: string;
  name: string;
  intro: string;
  character: string;
};

export const areas: Area[] = [
  { slug: "the-springs", name: "The Springs", intro: "Explore homes and community information for The Springs.", character: "Villas" },
  { slug: "arabian-ranches", name: "Arabian Ranches", intro: "Explore homes and community information for Arabian Ranches.", character: "Villas and townhouses" },
  { slug: "jumeirah-village-circle", name: "Jumeirah Village Circle", intro: "Explore homes and community information for Jumeirah Village Circle.", character: "Apartments, villas and townhouses" },
  { slug: "al-furjan", name: "Al Furjan", intro: "Explore homes and community information for Al Furjan.", character: "Villas, townhouses and apartments" },
  { slug: "tilal-al-ghaf", name: "Tilal Al Ghaf", intro: "Explore homes and community information for Tilal Al Ghaf.", character: "Villas and townhouses" },
  { slug: "dubai-marina", name: "Dubai Marina", intro: "Explore homes and community information for Dubai Marina.", character: "Apartments and waterfront homes" },
  { slug: "downtown-dubai", name: "Downtown Dubai", intro: "Explore homes and community information for Downtown Dubai.", character: "Apartments and penthouses" },
  { slug: "dubai-hills-estate", name: "Dubai Hills Estate", intro: "Explore homes and community information for Dubai Hills Estate.", character: "Villas and apartments" },
  { slug: "palm-jumeirah", name: "Palm Jumeirah", intro: "Explore homes and community information for Palm Jumeirah.", character: "Waterfront apartments and villas" },
  { slug: "business-bay", name: "Business Bay", intro: "Explore homes and community information for Business Bay.", character: "Apartments" },
  { slug: "emirates-living", name: "Emirates Living", intro: "Explore homes and community information for Emirates Living.", character: "Villas and townhouses" },
];

export const areaBySlug = (slug: string) => areas.find((area) => area.slug === slug);

export function areaSlugFromName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
