import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/about": {
      en: "/about",
      de: "/ueber-uns",
    },
    "/events": {
      en: "/events",
      de: "/veranstaltungen",
    },
    "/events/[slug]": {
      en: "/events/[slug]",
      de: "/veranstaltungen/[slug]",
    },
    "/privacy": {
      en: "/privacy",
      de: "/datenschutz",
    },
    "/impressum": {
      en: "/impressum",
      de: "/impressum",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
