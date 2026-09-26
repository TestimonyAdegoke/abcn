import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Public Events API:
 * Serves published events to website visitors directly from PostgreSQL
 * with zero authentication barriers, zero 503 gateway cold-starts, and sub-30ms latency.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const showOnHome = searchParams.get("show_on_home");
    const limit = searchParams.get("limit");

    let sql = "SELECT * FROM events WHERE status = 'published'";
    const params: any[] = [];
    let idx = 1;

    if (slug) {
      sql += ` AND slug = $${idx++}`;
      params.push(slug);
    }

    if (showOnHome === "true") {
      sql += ` AND show_on_home = true`;
    }

    sql += " ORDER BY priority DESC, created_at DESC";

    if (limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(parseInt(limit, 10));
    }

    const rows = await query(sql, params);

    return NextResponse.json({
      data: rows,
      error: null,
    });
  } catch (err: any) {
    console.error("[GET /api/events error]", err);
    return NextResponse.json(
      { data: null, error: err.message || "Failed to load published events" },
      { status: 500 }
    );
  }
}
