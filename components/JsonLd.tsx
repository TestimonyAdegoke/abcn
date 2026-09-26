/**
 * Renders structured data into the server-rendered HTML. Crawlers read JSON-LD
 * from the initial response, so this must never be produced client-side.
 */
export default function JsonLd({ data }: { data: unknown | null }) {
  if (!data) return null;

  // Escape "<" so CMS-authored text containing "</script>" cannot break out of
  // the JSON-LD block. JSON parsers read the escape back as a literal "<".
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
