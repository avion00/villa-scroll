import type { MetadataRoute } from "next";
import { site } from "./lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.displayName,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ef",
    theme_color: "#343a30",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
