-- ABCN: German translations for CMS-managed event content.
--
-- Run once against the Neon database. Every column is nullable: when a German
-- value is absent the site falls back to the English column, so the site keeps
-- working from the moment this runs and you can translate events gradually.
--
-- Read path: lib/events.ts -> normaliseEvent(row, locale)

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS title_de              text,
  ADD COLUMN IF NOT EXISTS eyebrow_de            text,
  ADD COLUMN IF NOT EXISTS short_description_de  text,
  ADD COLUMN IF NOT EXISTS description_de        text,
  ADD COLUMN IF NOT EXISTS long_description_de   text,
  ADD COLUMN IF NOT EXISTS date_label_de         text,
  ADD COLUMN IF NOT EXISTS venue_de              text,
  ADD COLUMN IF NOT EXISTS application_cta_de    text,
  ADD COLUMN IF NOT EXISTS application_deadline_de text,
  -- JSON-shaped columns mirror their English counterparts exactly.
  ADD COLUMN IF NOT EXISTS highlights_de   jsonb,
  ADD COLUMN IF NOT EXISTS stages_de       jsonb,
  ADD COLUMN IF NOT EXISTS eligibility_de  jsonb,
  ADD COLUMN IF NOT EXISTS grants_de       jsonb,
  ADD COLUMN IF NOT EXISTS focus_areas_de  jsonb,
  ADD COLUMN IF NOT EXISTS benefits_de     jsonb;

COMMENT ON COLUMN events.title_de IS
  'German title. NULL falls back to events.title.';
