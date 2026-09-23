import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "", priority: 1.0, frequency: "weekly" as const },
    { path: "/about", priority: 0.8, frequency: "monthly" as const },
    { path: "/events", priority: 0.9, frequency: "weekly" as const },
    { path: "/events/fiali-frankfurt-2026", priority: 1.0, frequency: "weekly" as const },
    { path: "/privacy", priority: 0.3, frequency: "monthly" as const },
    { path: "/impressum", priority: 0.3, frequency: "monthly" as const },
    { path: "/de", priority: 1.0, frequency: "weekly" as const },
    { path: "/de/ueber-uns", priority: 0.8, frequency: "monthly" as const },
    { path: "/de/veranstaltungen", priority: 0.9, frequency: "weekly" as const },
    { path: "/de/veranstaltungen/fiali-frankfurt-2026", priority: 1.0, frequency: "weekly" as const },
    { path: "/de/datenschutz", priority: 0.3, frequency: "monthly" as const },
    { path: "/de/impressum", priority: 0.3, frequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: siteUrl + route.path,
    lastModified: now,
    changeFrequency: route.frequency,
    priority: route.priority,
  }));
}
