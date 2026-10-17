export const site = {
  name: "ESPACE",
  descriptor: "The real Estate",
  displayName: "ESPACE The real Estate",
  tagline: "A considered way to find home.",
  description:
    "A Dubai property discovery experience. Listing records and supplied image references are presented for demonstration and require verification before publication.",
  contactEmail: "",
  phone: "+971 4 306 9999",
  whatsapp: "+971585720614",
  contactPerson: {
    name: "Saima Miah",
    role: "Client Manager",
    phone: "+971585720614",
  },
  officeAddress: "2702 & 2703 Marina Plaza, Dubai Marina, Dubai, U.A.E.",
  canonicalOrigin: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  socialLinks: {
    instagram: "https://www.instagram.com/espacerealestate/",
    facebook: "https://www.facebook.com/espacerealestate",
    linkedin: "https://www.linkedin.com/company/espace-real-estate/",
    youtube: "https://www.youtube.com/user/EspaceRealEstate",
  },
  mapProvider: process.env.NEXT_PUBLIC_MAP_PROVIDER ?? "google",
};

export function formatAED(value: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-AE").format(value);
}

export function siteUrl(path = "/") {
  return site.canonicalOrigin ? new URL(path, site.canonicalOrigin).toString() : undefined;
}
