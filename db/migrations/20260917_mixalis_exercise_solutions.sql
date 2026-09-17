CREATE TABLE IF NOT EXISTS physics.exercise_solutions (
  id uuid PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES physics.courses(id),
  chapter_id uuid NOT NULL REFERENCES physics.chapters(id),
  subchapter_id uuid NOT NULL REFERENCES physics.subchapters(id),
  source_document_id uuid NOT NULL REFERENCES physics.source_documents(id),
  exercise_identifier text NOT NULL,
  title text NOT NULL,
  source_page_from integer NOT NULL CHECK (source_page_from > 0),
  source_page_to integer NOT NULL CHECK (source_page_to >= source_page_from),
  solution jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (
    subchapter_id,
    exercise_identifier,
    source_document_id,
    source_page_from,
    source_page_to
  )
);

CREATE INDEX IF NOT EXISTS exercise_solutions_chapter_updated_idx
ON physics.exercise_solutions (chapter_id, updated_at DESC);
