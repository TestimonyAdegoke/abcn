import type { Metadata } from "next";
import { siteUrl } from "@/lib/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const de = locale === "de";
  const isFiali = slug === "fiali-frankfurt-2026";

  const title = isFiali
    ? de
      ? "FIALI Frankfurt 2026 | ABCN"
      : "FIALI Frankfurt 2026 | ABCN"
    : de
      ? "ABCN Veranstaltung"
      : "ABCN Event";

  const description = isFiali
    ? de
      ? "Female Innovation Afropean Leadership Initiative: ein zweistufiges Gründerinnenprogramm in Frankfurt mit Growth Lab, KI & Digitalisierung, Matchmaking und Ökosystemzugang."
      : "Female Innovation Afropean Leadership Initiative: a two-stage Frankfurt founder programme covering growth, AI & digitalisation, matchmaking and ecosystem access."
    : de
      ? "Veranstaltungen und Programme des Afropean Business & Culture Network."
      : "Events and programmes from the Afropean Business & Culture Network.";

  const canonical = de
    ? "/de/veranstaltungen/" + slug
    : "/events/" + slug;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: "/events/" + slug,
        de: "/de/veranstaltungen/" + slug,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "Afropean Business & Culture Network",
      images: isFiali
        ? [{ url: "/assets/fiali/fiali-hero-banner.jpg", alt: "FIALI Frankfurt 2026" }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: isFiali ? ["/assets/fiali/fiali-hero-banner.jpg"] : undefined,
    },
  };
}

export default function EventDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
