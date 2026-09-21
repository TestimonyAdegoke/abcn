import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABCN — Afropean Business & Culture Network",
  description:
    "An inclusive platform dedicated to elevating Afropean diaspora communities through business, culture, connection and cross-border opportunity.",
  openGraph: {
    title: "ABCN — Afropean Business & Culture Network",
    description:
      "African roots. European horizons. Business, culture and community in motion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
