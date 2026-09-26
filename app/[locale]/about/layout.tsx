import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { alternatesFor, urlFor } from "@/lib/seo";

/**
 * Locale-aware metadata. A page that does not export its own inherits the root
 * layout's alternates, which canonicalised every sub-page to the homepage and
 * told Google they were duplicates of it.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    alternates: alternatesFor("/about", locale as Locale),
    openGraph: {
      title: t("aboutTitle"),
      description: t("aboutOgDescription"),
      type: "website",
      url: urlFor("/about", locale as Locale),
      siteName: "Afropean Business & Culture Network",
      locale: locale === "de" ? "de_DE" : "en_GB",
      alternateLocale: locale === "de" ? ["en_GB"] : ["de_DE"],
      images: [
        {
          url: "/assets/abcn/abcn-logo.png",
          width: 704,
          height: 254,
          alt: "ABCN Brand Mark",
        },
      ],
    },
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
