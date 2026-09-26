import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  // English stays at the root (/), German lives under /de.
  localePrefix: "as-needed",

  /**
   * Localized URLs. German visitors and German search results get real German
   * slugs (/de/veranstaltungen, /de/ueber-uns, /de/datenschutz) rather than
   * English paths under a /de prefix, which is what EU geotargeting rewards.
   *
   * The key on the left is the internal route (the folder under app/[locale]).
   * Always link with the Link/redirect/getPathname helpers exported below and
   * pass the internal route - next-intl writes the localized URL for the active
   * locale, so no component needs to branch on locale to build an href.
   */
  pathnames: {
    "/": "/",
    "/about": { en: "/about", de: "/ueber-uns" },
    "/events": { en: "/events", de: "/veranstaltungen" },
    "/events/[slug]": { en: "/events/[slug]", de: "/veranstaltungen/[slug]" },
    "/privacy": { en: "/privacy", de: "/datenschutz" },
    "/impressum": { en: "/impressum", de: "/impressum" },
    "/admin/events": "/admin/events",
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
