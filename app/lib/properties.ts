export type PropertyImage = {
  src: string;
  alt: string;
};

export type Property = {
  id: string;
  slug: string;
  reference: string;
  title: string;
  transactionType: "sale" | "rent";
  propertyType: string;
  price: number;
  currency: "AED";
  bedrooms: number;
  headlineBedrooms?: number;
  bathrooms: number | null;
  builtUpArea: number | null;
  plotArea: number | null;
  furnishing: string | null;
  availability: string | null;
  completionStatus?: "ready" | "off-plan" | null;
  developer?: string | null;
  project?: string | null;
  community: string;
  subCommunity: string;
  city: string;
  country: string;
  images: PropertyImage[];
  amenities: string[];
  features: string[];
  sourceUrl: string;
  isFeatured: boolean;
  isExclusive: boolean;
  isOffPlan: boolean;
  coordinates?: { latitude: number; longitude: number } | null;
  floorPlans?: PropertyImage[];
  videos?: string[];
  agentId?: string | null;
  verifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  description: string;
};

const image = (src: string, label: string): PropertyImage => ({
  src,
  alt: `${label} — supplied reference image; verify usage rights before publication`,
});

export const properties: Property[] = [
  {
    id: "es-41428",
    slug: "renovated-extended-type-4e-springs-9",
    reference: "ES-41428",
    title: "Renovated and Extended | Type 4E",
    transactionType: "sale",
    propertyType: "Villa",
    price: 4599000,
    currency: "AED",
    bedrooms: 2,
    bathrooms: null,
    builtUpArea: 1793,
    plotArea: null,
    furnishing: null,
    availability: null,
    community: "The Springs",
    subCommunity: "Springs 9",
    city: "Dubai",
    country: "United Arab Emirates",
    images: [
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-renovated-and-extended--type-4e1-7065.webp?width=600&format=webp", "Renovated and Extended | Type 4E"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-renovated-and-extended--type-4e2-1045.webp?width=400&format=webp", "Renovated and Extended | Type 4E"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-renovated-and-extended--type-4e4-1038.webp?width=400&format=webp", "Renovated and Extended | Type 4E"),
    ],
    amenities: [],
    features: ["Renovated", "Extended", "Type 4E"],
    sourceUrl: "https://www.espace.ae/properties-single/2-bedroom-villa-for-sale--springs-9-springs-dubai-es-41428",
    isFeatured: true,
    isExclusive: false,
    isOffPlan: false,
    description:
      "A two-bedroom Type 4E villa in Springs 9. The supplied listing headline describes the home as renovated and extended. Details should be verified with the listing source before a transaction.",
  },
  {
    id: "es-41383",
    slug: "upgraded-kitchen-plaza-residences-jvc",
    reference: "ES-41383",
    title: "Upgraded Kitchen | Built-in Wardrobes | Vacant",
    transactionType: "sale",
    propertyType: "Apartment",
    price: 1300000,
    currency: "AED",
    bedrooms: 2,
    bathrooms: null,
    builtUpArea: 1209,
    plotArea: null,
    furnishing: null,
    availability: "Vacant (as stated in supplied headline; verify)",
    community: "Jumeirah Village Circle",
    subCommunity: "Plaza Residences",
    city: "Dubai",
    country: "United Arab Emirates",
    images: [
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-upgraded-kitchen--built-in-wardrobes--vacant2-3093.webp?width=600&format=webp", "Plaza Residences apartment"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-upgraded-kitchen--built-in-wardrobes--vacant1-5499.webp?width=400&format=webp", "Plaza Residences apartment"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-upgraded-kitchen--built-in-wardrobes--vacant3-3854.webp?width=400&format=webp", "Plaza Residences apartment"),
    ],
    amenities: [],
    features: ["Upgraded kitchen", "Built-in wardrobes"],
    sourceUrl: "https://www.espace.ae/properties-single/2-bedroom-apartment-for-sale-plaza-residences-jumeirah-village-circle-dubai-es-41383",
    isFeatured: true,
    isExclusive: false,
    isOffPlan: false,
    description:
      "A two-bedroom apartment in Plaza Residences, Jumeirah Village Circle. The supplied headline notes an upgraded kitchen, built-in wardrobes and vacant status; please confirm current details with the listing source.",
  },
  {
    id: "es-40920",
    slug: "upgraded-2m-alma-arabian-ranches",
    reference: "ES-40920",
    title: "Upgraded 2M | Backing Greenery | VOT",
    transactionType: "sale",
    propertyType: "Villa",
    price: 6290000,
    currency: "AED",
    bedrooms: 3,
    bathrooms: null,
    builtUpArea: 2641,
    plotArea: null,
    furnishing: null,
    availability: "VOT (as stated in supplied headline; verify)",
    community: "Arabian Ranches",
    subCommunity: "Alma 1",
    city: "Dubai",
    country: "United Arab Emirates",
    images: [
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-mar-1681615-3016.webp?width=600&format=webp", "Alma 1 villa"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-mar-1681612-3684.webp?width=400&format=webp", "Alma 1 villa"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-mar-1681613-1713.webp?width=400&format=webp", "Alma 1 villa"),
    ],
    amenities: [],
    features: ["Upgraded", "Backing greenery"],
    sourceUrl: "https://www.espace.ae/properties-single/3-bedroom-villa-for-sale-alma-1-arabian-ranches-dubai-es-40920",
    isFeatured: true,
    isExclusive: false,
    isOffPlan: false,
    description:
      "A three-bedroom villa in Alma 1, Arabian Ranches. The supplied headline describes it as upgraded and backing greenery. Availability and all other details should be confirmed.",
  },
  {
    id: "es-3404",
    slug: "exclusive-renovated-springs-10",
    reference: "ES-3404",
    title: "Exclusive | Fully Renovated | Biggest Layout",
    transactionType: "sale",
    propertyType: "Villa",
    price: 7250000,
    currency: "AED",
    bedrooms: 3,
    bathrooms: null,
    builtUpArea: 3049,
    plotArea: null,
    furnishing: null,
    availability: null,
    community: "The Springs",
    subCommunity: "Springs 10",
    city: "Dubai",
    country: "United Arab Emirates",
    images: [
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-exclusive-and-fully-renovated-villa-with-rare-layout1-6211.webp?width=600&format=webp", "Springs 10 villa"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-exclusive-and-fully-renovated-villa-with-rare-layout14-6557.webp?width=400&format=webp", "Springs 10 villa"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-exclusive-and-fully-renovated-villa-with-rare-layout3-3760.webp?width=400&format=webp", "Springs 10 villa"),
    ],
    amenities: [],
    features: ["Fully renovated", "Largest layout (as stated in supplied headline)"],
    sourceUrl: "https://www.espace.ae/properties-single/3-bedroom-villa-for-sale-springs-10-springs-dubai-es-3404",
    isFeatured: true,
    isExclusive: true,
    isOffPlan: false,
    description:
      "A three-bedroom villa in Springs 10 with an exclusive listing badge. The supplied headline describes it as fully renovated with a large layout; verify the description and status before publication.",
  },
  {
    id: "es-33209",
    slug: "single-row-villa-murooj-al-furjan-east",
    reference: "ES-33209",
    title: "Best Price | Vastu | Single-Row | Next to Park",
    transactionType: "sale",
    propertyType: "Villa",
    price: 7600000,
    currency: "AED",
    bedrooms: 4,
    bathrooms: null,
    builtUpArea: 4042,
    plotArea: null,
    furnishing: null,
    availability: null,
    community: "Al Furjan",
    subCommunity: "Murooj Al Furjan - East",
    city: "Dubai",
    country: "United Arab Emirates",
    images: [
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-upgraded-l-great-location-l-ready-to-move1-8268.webp?width=600&format=webp", "Murooj Al Furjan villa"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-upgraded-l-great-location-l-ready-to-move2-4743.webp?width=400&format=webp", "Murooj Al Furjan villa"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-upgraded-l-great-location-l-ready-to-move3-9578.webp?width=400&format=webp", "Murooj Al Furjan villa"),
    ],
    amenities: [],
    features: ["Single-row", "Next to park (as stated in supplied headline)", "Vastu (as stated in supplied headline)"],
    sourceUrl: "https://www.espace.ae/properties-single/4-bedroom-villa-for-sale--murooj-al-furjan---east-al-furjan-dubai-es-33209",
    isFeatured: true,
    isExclusive: false,
    isOffPlan: false,
    description:
      "A four-bedroom villa in Murooj Al Furjan - East. The supplied headline mentions a single-row position, proximity to a park and Vastu; these claims should be confirmed with the source.",
  },
  {
    id: "es-40361",
    slug: "extended-villa-harmony-2-tilal-al-ghaf",
    reference: "ES-40361",
    title: "Extended | Fully Upgraded | 5 Bedrooms + Maids",
    transactionType: "sale",
    propertyType: "Villa",
    price: 11500000,
    currency: "AED",
    bedrooms: 4,
    headlineBedrooms: 5,
    bathrooms: null,
    builtUpArea: null,
    plotArea: null,
    furnishing: null,
    availability: null,
    community: "Tilal Al Ghaf",
    subCommunity: "Harmony 2",
    city: "Dubai",
    country: "United Arab Emirates",
    images: [
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-mar-589981-4571.webp?width=600&format=webp", "Harmony 2 villa"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-mar-589982-3523.webp?width=400&format=webp", "Harmony 2 villa"),
      image("https://d2fvuj1ffdxm4a.cloudfront.net/property_image/espace-mar-589983-2683.webp?width=400&format=webp", "Harmony 2 villa"),
    ],
    amenities: [],
    features: ["Extended", "Fully upgraded", "Maid's room (as stated in supplied headline)"],
    sourceUrl: "https://www.espace.ae/properties-single/4-bedroom-villa-for-sale-harmony-2-tilal-al-ghaf-dubai-es-40361",
    isFeatured: true,
    isExclusive: false,
    isOffPlan: false,
    description:
      "A villa in Harmony 2, Tilal Al Ghaf. The supplied listing metadata states four bedrooms while its headline says five bedrooms plus a maid's room. This discrepancy is shown for verification; built-up area was not supplied.",
  },
];

export const propertyBySlug = (slug: string) =>
  properties.find((property) => property.slug === slug);

export const propertyById = (id: string) =>
  properties.find((property) => property.id === id);
