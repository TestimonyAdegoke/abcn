import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ABCN - Afropean Business & Culture Network",
  description:
    "Afropean Business and Culture Networks (ABCN) is an inclusive platform dedicated to elevating Afropean diaspora communities by celebrating their cultures and connecting their businesses, fostering visibility, opportunity, and cross-cultural collaboration.",
  openGraph: {
    title: "About ABCN - Afropean Business & Culture Network",
    description:
      "Bridging African heritage and European opportunity through business, culture, and collaborative leadership.",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
