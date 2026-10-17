import type { MetadataRoute } from "next";
import { site } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(site.canonicalOrigin
      ? { sitemap: new URL("/sitemap.xml", site.canonicalOrigin).toString() }
      : {}),
  };
}
