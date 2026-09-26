import type { MetadataRoute } from "next";
import { sitemapEntry } from "@/lib/seo";
import { getPublishedEvents } from "@/lib/events-server";

/**
 * Regenerate the sitemap on the same cadence as the event CMS (one hour), so an
 * event published from /admin/events appears to search engines without a
 * redeploy. Next parses this value statically, so it must stay a literal -
 * see EVENTS_REVALIDATE in lib/events-server.ts.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await getPublishedEvents();

  const staticRoutes = [
    ...sitemapEntry("/", { priority: 1.0, changeFrequency: "weekly" }),
    ...sitemapEntry("/about", { priority: 0.8, changeFrequency: "monthly" }),
    ...sitemapEntry("/events", { priority: 0.9, changeFrequency: "weekly" }),
    ...sitemapEntry("/privacy", { priority: 0.3, changeFrequency: "yearly" }),
    ...sitemapEntry("/impressum", { priority: 0.3, changeFrequency: "yearly" }),
  ];

  const eventRoutes = events.flatMap((event) =>
    sitemapEntry(
      { pathname: "/events/[slug]", params: { slug: event.slug } },
      {
        // Featured programmes carry the same weight as the homepage.
        priority: event.featured ? 1.0 : 0.7,
        changeFrequency: "weekly",
        lastModified: event.start_at ? new Date(event.start_at) : new Date(),
      }
    )
  );

  return [...staticRoutes, ...eventRoutes];
}
