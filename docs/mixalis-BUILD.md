# BUILD — /mixalis Physics Workspace

Reference name: **BUILD**
Teaching prompt reference: **START** (`PHYS-B2-2026-001`)

## Goal

Create a private, personal Physics learning workspace at `/mixalis` for a B' Lykeiou student preparing for 2nd Scientific Field in G' Lykeiou, with long-term interest in Naval Architecture at University of West Attica (ΠΑΔΑ).

The workspace must support living chapters that grow across multiple lessons, source uploads from phone photos, AI-assisted source understanding, lesson generation using START, comprehension tests, tutoring, versioning, and progress tracking.

## Core product principles

1. A chapter is a **living knowledge container**, not a one-time generated page.
2. A chapter may evolve over 6–7 lessons or more.
3. New material is added incrementally as **Material Batches**.
4. Original source files remain attached to the chapter permanently unless explicitly deleted.
5. New material must not blindly overwrite prior teaching content. It should create an updated revision while preserving previous revisions.
6. School curriculum determines the scope of what is taught.
7. Exercises and teacher handouts are a secondary source of intelligence: they reveal tricks, traps, combinations, misconceptions, and expected reasoning depth, but they never limit teaching to only those examples.
8. The AI teaching layer must follow START.
9. The student-facing experience must be educational, visual, non-sterile, age-appropriate, and focused on understanding Physics before formulas.

## Access and privacy

- Base route: `/mixalis`
- Personal/private area.
- User: `mixalis`.
- Session-based authentication.
- Use secure server-side session cookies (`HttpOnly`, `Secure`, `SameSite`, expiration, logout).
- Never store production passwords in source control or plain text.
- `/mixalis/*` must be excluded from sitemap.
- Apply `noindex`, `nofollow`, `noarchive`.
- Authentication is the security boundary; robots/noindex are only indexing controls.
- All `/mixalis` APIs must enforce authorization server-side.
- Uploaded source files must not be publicly accessible.

## Main information architecture

### Dashboard

`/mixalis`

Shows:
- existing chapters,
- chapter status,
- number of material additions,
- latest update,
- current progress,
- CTA: `+ Δημιουργία κεφαλαίου`.

### Chapter

Each chapter has four primary student/admin areas:

1. **Μάθημα** — generated teaching content.
2. **Υλικό** — original uploaded sources and batches.
3. **Τεστ** — comprehension tests and attempts.
4. **Ρώτα τον καθηγητή** — chapter-aware AI tutor.

## Living chapter model

A chapter may contain many Material Batches, for example:

- Batch #1 — school book theory
- Batch #2 — school book exercises
- Batch #3 — Savvalas exercises
- Batch #4 — Tripolitis handout
- Batch #5 — school teacher photocopies
- Batch #6 — later supplementary exercises

Adding new material must analyze only the new batch where possible, then compare its findings to stored chapter knowledge and propose an updated chapter revision.

## Supported source categories

- School Book — Theory
- School Book — Exercises
- Savvalas study guide
- Tripolitis handouts
- School teacher photocopies
- Other material

Uploads are expected primarily as mobile-phone photographs and should support multi-file batch upload.

## File storage

### Private object storage

Use private object/blob storage for:
- phone photos,
- future PDFs,
- scans and handouts.

Do not store raw image binaries in Postgres.

### Neon Postgres

Use a dedicated `physics` schema, isolated from booking/staff/SEO data.

Store:
- chapters,
- material batches,
- source file metadata,
- source analyses,
- concept intelligence,
- chapter revisions,
- tests/questions/attempts,
- learning progress,
- tutor threads/messages.

Indicative tables:

- `physics.chapters`
- `physics.material_batches`
- `physics.source_files`
- `physics.source_analyses`
- `physics.concepts`
- `physics.chapter_revisions`
- `physics.tests`
- `physics.test_questions`
- `physics.test_attempts`
- `physics.progress`
- `physics.tutor_threads`
- `physics.tutor_messages`

## Upload quality gate

Before source analysis, check photographs for:

- blur,
- cropped text,
- missing parts of exercises,
- wrong orientation,
- duplicate images,
- wrong ordering,
- low readability.

If a page is insufficient, identify the exact page/photo and request a replacement rather than guessing missing content.

## Source Intelligence phase

Source analysis happens before START lesson generation.

### From theory sources

Extract:
- new Physics concepts,
- physical quantities,
- terminology,
- laws,
- formulas,
- prerequisites,
- curriculum boundaries.

### From exercises

Extract:
- what each exercise is testing,
- tricks,
- traps,
- hidden information,
- common misconceptions,
- combined concepts,
- unusual contexts,
- reasoning patterns,
- difficult cases,
- expected depth of understanding.

### From teacher handouts

Extract:
- what the teacher emphasizes,
- additional interpretations,
- recurring techniques,
- points flagged as important,
- supplemental reasoning patterns.

Store this as structured chapter knowledge instead of repeatedly sending all raw images to the AI.

## Concept map

Maintain a concept graph across chapters so the system knows:

- what has already been taught,
- prerequisites,
- related concepts,
- later reuse,
- gaps and weak concepts.

The tutor and chapter generator should reuse existing knowledge rather than reteaching every concept from zero.

## START generation pipeline

After Source Intelligence, generate or update the lesson using START.

For every new important concept, the teaching flow is:

1. Real-world, easy-to-imagine phenomenon.
2. Plain-language understanding of the concept.
3. A creative, hidden/non-obvious real-world example where the same Physics exists.
4. Explicit explanation of where and why the same Physics is hidden there.
5. Reveal the physical quantities/parameters that determine the concept — do not make the student guess unknown theory.
6. Explain why each parameter matters using a vivid, appropriate example.
7. Explain qualitative dependence when a parameter increases/decreases/doubles/etc., again through physical imagery rather than dry arrows.
8. Only then present the mathematical formula as the compact expression of what has already been understood.
9. Connect the concept to other concepts in the chapter.
10. Where naturally relevant, add a second-level connection to engineering/naval architecture without turning all teaching into naval examples.
11. Use exercise intelligence to prepare the student for upcoming reasoning traps and unusual contexts without limiting teaching to those exercises.

Examples must be chosen freely from the real world — nature, technology, electricity, magnetism, biology, machinery, weather, fluids, structures, micro/macro scales, universe, etc. — based on what best illuminates the concept. Do not mechanically force examples from every category.

## Chapter revisions

Never blindly overwrite a chapter when new material is added.

Flow:

1. Upload new Material Batch.
2. Analyze only new material where possible.
3. Compare new findings with existing chapter intelligence.
4. Show important additions/changes.
5. Generate a new chapter revision.
6. Preserve previous revisions for traceability.

Example:

- Revision 3 remains available.
- New exercises introduce one new trap and one new context.
- Revision 4 incorporates these additions.

## Source traceability

Maintain a source map so important concepts/sections can be traced to supporting material, e.g.:

- School book pages/photos
- Savvalas batch
- Tripolitis handout
- School teacher material
- START enrichment

Student UI does not need to show this constantly, but admin/debug views should preserve provenance.

## Comprehension tests

After theory, generate adaptive comprehension tests.

Suggested levels:

1. Understand the phenomenon.
2. Understand parameter relationships.
3. Apply the concept in a new but recognizable context.
4. Identify the concept when hidden in an unfamiliar real-world situation.
5. Trap/difficult reasoning.

Questions should avoid sterile wording such as generic `body A/body B` when a meaningful real-world context can test the same Physics.

Do not reveal answers before the student responds.

If the student requests explanation:
- explain why the correct answer is correct,
- explain why wrong choices/reasoning are wrong,
- identify the misconception that could lead to each error where useful.

If the student struggles, return briefly to the concept with a different example before increasing difficulty.

## AI Tutor — `Ρώτα τον καθηγητή`

The tutor is not a generic chatbot.

Its context should include:

- START,
- current chapter content,
- stored Source Intelligence,
- concepts already taught,
- relevant exercise intelligence,
- student's learning progress and weak concepts.

It should not resend all original photos on every question.

### Tutor behavior

If the student says they do not understand a concept:
- do not lead with the formula,
- find a different real-world example,
- rebuild the physical intuition,
- explain the hidden Physics,
- then return to the formal relationship only when ready.

### Uploaded exercise mode

If the student photographs an exercise and asks for help:

1. Read and understand the exercise.
2. Identify the core Physics and possible trap.
3. Do not immediately solve it.
4. Reconnect the student to the relevant theory.
5. Give a first hint.
6. Give further hints if requested.
7. Provide a full step-by-step solution only if explicitly requested or if the learning flow requires it, with physical reasoning for each step.

## Learning progress

Track pedagogically useful chapter progress, such as:

- concept understood,
- parameter relationships understood,
- common trap unresolved,
- hidden-context transfer weak/strong,
- test performance.

Use this to adapt future tutor explanations and tests.

## AI model configuration

Do not hard-code models.

Use configurable environment variables such as:

- `PHYSICS_ANALYSIS_MODEL`
- `PHYSICS_GENERATION_MODEL`
- `PHYSICS_TUTOR_MODEL`

Optimize cost by analyzing source images once and persisting structured knowledge.

## Product phases

### Phase 1 — Foundation

- `/mixalis/login`
- session authentication
- protected `/mixalis`
- noindex/private setup
- dashboard shell
- chapter list shell
- create-chapter skeleton

### Phase 2 — Living Chapters

- Material Batches
- private uploads
- source categories
- source library per chapter

### Phase 3 — Source Intelligence

- image quality checks
- structured source analysis
- concepts/tricks/traps extraction
- persisted intelligence

### Phase 4 — START Generator

- lesson generation
- chapter revisions
- incremental updates
- source traceability

### Phase 5 — Tests

- comprehension tests
- answer explanations
- attempts
- adaptive difficulty

### Phase 6 — AI Professor

- chapter-aware tutor
- hints
- uploaded exercise mode
- learning-history aware responses

### Phase 7 — Concept Map

- cross-chapter concept graph
- prerequisites
- long-term progression toward G' Lykeiou reasoning

## Implementation rules

- Build incrementally.
- Work on a feature branch before main.
- Preserve existing chioshotel.gr behavior.
- Keep `/mixalis` technically isolated from accommodation/booking/staff features.
- Do not install dependencies or change environment variables without explicit approval.
- Validate each meaningful phase before proceeding.
- Treat this document as the technical source of truth for the friendly reference **BUILD**.
