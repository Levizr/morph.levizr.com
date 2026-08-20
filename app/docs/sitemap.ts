import type { MetadataRoute } from "next";
import { fetchDocsNav } from "@/lib/github-docs";
import { SITE_URL } from "@/lib/site";

// Sitemap.js is cached by default; force-dynamic renders it per request.
// The registry data it reads lives in the fetch data cache (NAV_TAG) and is
// purged by the Vercel purge workflow on every docs push — so the sitemap
// reflects the registry within milliseconds of a change, with no timers.
export const dynamic = "force-dynamic";

const VALID_CHANGEFREQ = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await fetchDocsNav();

  return docs.map((doc) => {
    const changeFrequency = VALID_CHANGEFREQ.includes(
      doc.changefreq as (typeof VALID_CHANGEFREQ)[number]
    )
      ? (doc.changefreq as (typeof VALID_CHANGEFREQ)[number])
      : "weekly";

    return {
      url: `${SITE_URL}/docs/${doc.path}`,
      lastModified: doc.lastUpdated ?? doc.publishedAt,
      changeFrequency,
      priority: doc.priority ?? 0.5,
    };
  });
}