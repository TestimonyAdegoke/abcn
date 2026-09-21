import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://abcn.network"),
  title: "ABCN - Afropean Business & Culture Network",
  description:
    "An inclusive platform dedicated to elevating Afropean diaspora communities through business, culture, connection and cross-border opportunity.",
  openGraph: {
    title: "ABCN - Afropean Business & Culture Network",
    description:
      "African roots. European horizons. Business, culture and community in motion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${newsreader.variable}`}>
      <body>
        {children}
        <GdprModal />
        <CookieBanner />
      </body>
    </html>
  );
}

