import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/docs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contribute`, changeFrequency: "monthly", priority: 0.8 },
  ];
}