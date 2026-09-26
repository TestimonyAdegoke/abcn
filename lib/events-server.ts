import { neon } from "@/lib/neon";
import { EventRecord, fallbackEvent, normaliseEvent } from "@/lib/events";

/**
 * Server-side reads of the event CMS, for the things that must exist in the
 * HTML Google receives rather than being fetched by the browser: the sitemap,
 * page metadata and the Event structured data.
 *
 * Every read degrades to the seeded FIALI programme instead of throwing, so a
 * database blip can never fail a build or blank out a page's metadata.
 */

/**
 * Re-read the CMS at most once an hour per route.
 *
 * Route segments cannot import this: Next evaluates `export const revalidate`
 * statically and rejects an identifier. Each route repeats the literal 3600 and
 * points back here, so this stays the documented source of the number.
 */
export const EVENTS_REVALIDATE = 3600;

export async function getPublishedEvents(locale: string = "en"): Promise<EventRecord[]> {
  try {
    const { data } = await neon
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("priority", { ascending: false });

    if (data?.length) {
      return data.map((row) => normaliseEvent(row as Partial<EventRecord>, locale));
    }
  } catch {
    // fall through to the seeded programme
  }
  return [fallbackEvent(locale)];
}

export async function getEventBySlug(
  slug: string,
  locale: string = "en"
): Promise<EventRecord | null> {
  try {
    const { data } = await neon
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .limit(1);

    const row = data?.[0];
    if (row) return normaliseEvent(row as Partial<EventRecord>, locale);
  } catch {
    // fall through
  }

  const seeded = fallbackEvent(locale);
  return seeded.slug === slug ? seeded : null;
}
