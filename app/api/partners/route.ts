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
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("GET /api/partners error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch partners" },
      { status: 500 }
    );
  }
}
