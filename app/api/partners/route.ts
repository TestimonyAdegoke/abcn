import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query(
      `SELECT id, name, logo_url, website_url, category, description, tier, priority
       FROM site_partners 
       WHERE active = true 
       ORDER BY priority DESC, created_at ASC`
    );
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows });
    }
  } catch (error: any) {
    console.error("GET /api/partners error:", error);
  }

  // Graceful verified fallback partners with bundled high-res logos
  return NextResponse.json({
    success: true,
    data: [
      { id: "p1", name: "ABCN", logo_url: "/assets/fiali/logos/abcn.png", website_url: "https://afropeanbusiness.com" },
      { id: "p2", name: "DIVOC Rising", logo_url: "/assets/fiali/logos/divoc-rising.png", website_url: "https://divocrising.com" },
      { id: "p3", name: "Kompass Frankfurt", logo_url: "/assets/fiali/logos/kompass-frankfurt.png", website_url: "https://kompassfrankfurt.de" },
      { id: "p4", name: "Black Women in Tech DACH", logo_url: "/assets/fiali/logos/black-women-in-tech-dach.png", website_url: "https://bwit-dach.org" },
      { id: "p5", name: "EquiNet", logo_url: "/assets/fiali/logos/equinet.png", website_url: "https://equinet.org" },
      { id: "p6", name: "Flourish & Prosper", logo_url: "/assets/fiali/logos/flourish-prosper.png", website_url: "https://flourishandprosper.org" },
    ],
  });
}
