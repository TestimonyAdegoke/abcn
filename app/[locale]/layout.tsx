import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";
import "../benchmark-components.css";
import GdprModal from "@/components/GdprModal";
import CookieBanner from "@/components/CookieBanner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL("https://abcn.network"),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_GB",
    },
    alternates: {
      languages: {
        en: "/",
        de: "/de",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Required for static rendering of the locale segment.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${plusJakartaSans.variable} ${newsreader.variable}`}>
      <body>
        <NextIntlClientProvider>
          {children}
          <GdprModal />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
