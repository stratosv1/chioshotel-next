# BUILD — /mixalis Physics Workspace

Reference name: **BUILD**  
Teaching prompt reference: **START** (`PHYS-B2-2026-001`)  
Source Intelligence reference: **PHASE3**

## Goal

Create a private, personal Physics learning workspace at `/mixalis` for B' Lykeiou. The product must teach Physics for understanding first, while preserving the official school curriculum and continuously improving each lesson as new exercise material, study-guide pages, teacher handouts and tests are added.

The workspace is a living system. It must not require all source material to exist on day one.

---

## Core pedagogical principle

**The official school book defines the curriculum and scientific scope. Exercises, study guides and teacher material reveal the depth of understanding required and enrich the teaching of the theory.**

Exercises are therefore not a separate, secondary output bucket. Exercise intelligence can change how the theory itself is taught by revealing:

- relationships between physical quantities that need stronger explanation,
- hidden applications of the same Physics,
- common misconceptions,
- reasoning traps,
- combinations of concepts,
- difficult cases,
- what students are expected to infer rather than merely recall.

START transforms the combined Source Intelligence into the teaching experience.

---

## Academic hierarchy

The canonical academic structure is:

```text
Course
└── Chapter
    └── Subchapter
        └── Concepts
```

There are two strictly separated courses:

1. **Φυσική Γενικής Παιδείας** (`general_education`)
2. **Φυσική Προσανατολισμού** (`orientation`)

Both have chapters and subchapters. Content, source mapping, intelligence and lesson generation must always remain course-scoped.

A **Subchapter** is the primary teaching/intelligence unit. A **Chapter** is also an ingestion boundary because real source material is often supplied as a whole chapter rather than pre-separated by subchapter.

---

## Main information architecture

### Dashboard — `/mixalis`

Entry point to the two Physics courses.

```text
/mixalis
├── Φυσική Γενικής Παιδείας
└── Φυσική Προσανατολισμού
```

### Course

Shows official chapters and their progress.

### Chapter

A chapter contains:

1. **Δομή κεφαλαίου** — official subchapters.
2. **Μάθημα** — current START lesson revisions.
3. **Υλικό** — permanent sources and incremental Material Batches.
4. **Source Intelligence** — analysis status, segmentation and pending updates.
5. **Τεστ** — later phase.
6. **Ρώτα τον καθηγητή** — later phase.

---

## Source Library

Sources are divided into two categories.

### Permanent documents

Examples:

- official school book PDF for General Education,
- official school book PDF for Orientation,
- future study-guide PDFs if legally/user-supplied and available.

Permanent documents are uploaded once and stored in private Blob storage.

### Incremental Material Batches

Examples:

- Savvalas photographed chapter,
- Tripolitis photographed chapter/handout,
- teacher photocopies,
- handwritten notes,
- exercise pages,
- tests and supplementary material.

Material Batches remain the unit for material arriving over time.

---

## Chapter-level ingestion

The system must **not require the user to upload every source image separately into a subchapter**.

Preferred workflow for sources such as Savvalas or Tripolitis:

```text
Choose Course
   ↓
Choose Chapter
   ↓
Choose Source Type
   ↓
Upload ALL chapter photos in page order
   ↓
Automatic segmentation
   ↓
Review proposed subchapter mapping
   ↓
Confirm segmentation
```

Example:

```text
Savvalas — Orientation — Chapter 1
├── photo 001
├── photo 002
├── photo 003
├── ...
└── photo 040

AI proposed mapping:
1.1 → photos 001–008
1.2 → photos 009–018
1.3 → photos 019–027
1.4 → photos 028–035
combined/boundary pages → photos 036–040 as appropriate
```

Original images are stored **once**. Mapping is relational metadata; images are never duplicated per subchapter.

A photo may map to more than one subchapter when appropriate. Supported relationships include:

- `primary` — page mainly belongs to this subchapter,
- `related` — page uses/includes another subchapter,
- `boundary` — page contains the end of one section and the start of another.

The AI must not force an uncertain page into one subchapter. Low-confidence mappings become `needs_review`.

---

## Source segmentation review

Automatic segmentation is a proposal, not an irreversible write.

Flow:

```text
Uploaded chapter batch
   ↓
AI segmentation run
   ↓
Proposed file ↔ subchapter links
   ↓
Review screen
   ↓
[ Επιβεβαίωση διαχωρισμού ]
```

The review should summarize:

- number of images per subchapter,
- boundary/multi-subchapter pages,
- low-confidence pages,
- unclassified pages.

Only confirmed mapping becomes trusted input for Subchapter Source Intelligence.

The database must prevent cross-chapter mappings. A source file belonging to Chapter 1 must not be linkable to a subchapter of Chapter 2, even if application code contains a bug.

---

## File storage and privacy

Use private Vercel Blob storage for:

- school book PDFs,
- phone photos,
- scans,
- handouts.

Do not store raw binaries in Postgres.

Private Blob URLs must never be exposed as permanent public URLs. Backend processing reads private files server-side; authenticated routes are used for any future user viewing.

### Upload quality gate

Before semantic Source Intelligence, evaluate:

- blur/readability,
- cropped text,
- missing exercise fragments,
- wrong orientation,
- duplicates,
- sequence/order problems,
- page-number visibility where useful.

If a source page cannot be read reliably, mark the exact image `needs_retake`; do not invent missing content.

---

# PHASE3 — Source Intelligence

## PHASE3 reference philosophy

> **The school book defines the official curriculum. Exercises, study guides and teacher material reveal the required depth of understanding and enrich the teaching of the theory. Source Intelligence synthesizes those sources, and START transforms the synthesis into a lesson. Every newly added source is analyzed incrementally and can produce a new revision without losing the previous lesson.**

PHASE3 must be incremental by design.

```text
New source
   ↓
Analyze only new material
   ↓
Structured Source Intelligence
   ↓
Merge with current Subchapter Intelligence
   ↓
Detect new knowledge / depth / misconceptions /
traps / combinations / teaching implications
   ↓
Pending lesson update
```

Adding new material later must not require re-analyzing all historical raw files unless an explicit full re-analysis is requested.

---

## Two levels of intelligence

### 1. Source-level Intelligence

Each source/file/range is analyzed once where possible.

From theory sources extract:

- concepts,
- definitions,
- physical quantities,
- laws,
- formulas,
- assumptions,
- prerequisites,
- official curriculum boundaries,
- worked examples.

From exercises extract:

- concept(s) being tested,
- physical reasoning required,
- dependencies between quantities,
- hidden information,
- common misconceptions,
- traps,
- combined concepts,
- unusual contexts,
- difficult cases,
- solution strategies,
- expected understanding depth,
- **teaching implications for the theory**.

From teacher material extract:

- emphasis,
- repeated methods,
- additional interpretations,
- flagged-important points,
- likely assessment emphasis,
- supplemental reasoning patterns.

### 2. Subchapter Intelligence

All confirmed source intelligence belonging to the same subchapter is synthesized into a versioned knowledge model.

```text
School Book Intelligence
        +
Savvalas Intelligence
        +
Tripolitis Intelligence
        +
Teacher Intelligence
        +
Tests Intelligence
        ↓
SUBCHAPTER INTELLIGENCE VERSION
```

This intelligence contains both **what Physics must be taught** and **how deeply it must be understood**.

---

## Exercises enrich theory

This is an explicit architecture rule.

If new exercises reveal, for example, that students must understand that horizontal launch speed does not affect fall time, PHASE3 must not merely add a tag called `trap`.

It should record a teaching implication such as:

```text
Concept: independence of horizontal and vertical motion
Exercise evidence:
- repeated confusion between vx and time of fall
- two-body comparison appears frequently
Teaching implication:
- strengthen the theory explanation
- explicitly contrast horizontal speed with vertical fall
- include a hidden-context transfer example before formal exercise practice
```

Therefore new exercise material may legitimately create a pending **theory lesson update** even when it introduces no new curriculum concept.

---

## Provenance

Every important intelligence item must retain evidence.

Example:

```text
Claim / teaching implication
├── School Book pages 12–14
├── Savvalas photos/pages 24–26
├── Teacher handout page 2
└── START enrichment (when generated by teaching layer)
```

Never turn the system into untraceable AI prose.

---

## Intelligence versioning and incremental updates

Example lifecycle:

```text
School book only
→ Intelligence v1
→ Lesson Revision 1

+ Savvalas Chapter 1 photos
→ analyze new source only
→ Intelligence v2
→ diff vs v1
→ Pending update
→ [ Ενημέρωση μαθήματος ]
→ Lesson Revision 2

+ teacher handout
→ analyze new source only
→ Intelligence v3
→ Pending update
→ Lesson Revision 3
```

Previous intelligence and lesson revisions remain available for traceability.

---

## Human-controlled lesson update

Uploading new material must **not automatically overwrite the lesson**.

After new Source Intelligence is merged, show:

```text
Υπάρχει νέο υλικό που δεν έχει ενσωματωθεί στο μάθημα.

[ Δες τι άλλαξε ]
[ Ενημέρωση μαθήματος ]
```

Primary CTA:

- **Ενημέρωση μαθήματος** — integrate meaningful changes using current intelligence and START.

Advanced/admin action:

- **Πλήρης αναδημιουργία** — regenerate from the full current intelligence; used rarely.

---

## START generation pipeline

START consumes the **current Subchapter Intelligence**, not all raw source images on every generation.

Teaching flow:

1. real phenomenon,
2. intuitive physical meaning,
3. hidden/non-obvious real-world occurrence,
4. explicit explanation of where the same Physics exists,
5. physical quantities/parameters,
6. why each parameter matters,
7. qualitative dependencies,
8. formal terminology,
9. formula as compact expression of already-understood Physics,
10. applications and transfer,
11. exercise-derived misconceptions/traps integrated into the teaching preparation,
12. natural engineering/naval connection only where useful.

START is common to both courses; the intelligence and lesson context are always scoped to the selected course/chapter/subchapter.

---

## Lesson revisions

Never blindly overwrite lessons.

```text
Current Subchapter Intelligence
       + START
       ↓
Lesson Revision N
```

When intelligence changes:

```text
Intelligence vN
vs
Intelligence vN+1
       ↓
meaningful diff
       ↓
pending update
       ↓
Lesson Revision N+1
```

---

## Concept map

Later phases maintain concept relationships across subchapters and chapters:

- prerequisites,
- previously taught concepts,
- related concepts,
- future reuse,
- weak concepts,
- transfer ability.

The concept graph must never merge the two courses incorrectly merely because terminology overlaps.

---

## Comprehension tests

After theory, tests should progressively check:

1. phenomenon understanding,
2. parameter relationships,
3. recognizable application,
4. hidden/unfamiliar context transfer,
5. trap/difficult reasoning.

Tests use current intelligence and can incorporate exercise-derived misconceptions without copying source material verbatim.

---

## AI Tutor — `Ρώτα τον καθηγητή`

The tutor context should eventually include:

- START,
- current lesson revision,
- current Subchapter Intelligence,
- relevant exercise intelligence,
- concept graph,
- student progress and weak points.

It should not resend all raw images on every question.

For uploaded exercise help:

1. identify the Physics,
2. identify possible traps,
3. reconnect to theory,
4. provide graduated hints,
5. full solution only when requested/needed.

---

## Neon Postgres architecture

Use dedicated `physics` schema.

Existing/core entities:

- `physics.courses`
- `physics.chapters`
- `physics.subchapters`
- `physics.material_batches`
- `physics.source_files`
- `physics.source_documents`
- `physics.source_ranges`

PHASE3 entities include:

- `physics.source_segmentation_runs`
- `physics.source_file_subchapter_links`
- later `physics.source_analyses`
- later `physics.intelligence_items`
- later `physics.intelligence_evidence`
- later `physics.subchapter_intelligence_versions`

Later phases:

- lesson revisions,
- tests/questions/attempts,
- progress,
- tutor threads/messages,
- concept graph.

Do not create all later tables prematurely. Add schema as each phase becomes executable and testable.

---

## AI model configuration

Do not hard-code the production model contract.

Use configuration such as:

- `PHYSICS_ANALYSIS_MODEL`
- `PHYSICS_GENERATION_MODEL`
- `PHYSICS_TUTOR_MODEL`

For source-image analysis, private Blob content is fetched server-side and sent to the configured multimodal model. Persist the structured result so the same images are not repeatedly analyzed.

---

## Access and privacy

- `/mixalis` is private.
- Session-based authentication.
- All APIs enforce authorization server-side.
- `noindex`, `nofollow`, `noarchive`.
- Excluded from sitemap.
- No raw production password in source.
- Source files remain private.

---

## Product phases

### Phase 1 — Foundation — COMPLETE

- login/session auth,
- protected `/mixalis`,
- noindex/private setup,
- isolated dashboard.

### Phase 2 — Academic structure & Source Foundation — COMPLETE

- two courses,
- official chapters/subchapters,
- Material Batches,
- private photo uploads,
- permanent Source Library,
- two official school-book PDFs.

### Phase 3 — Source Intelligence — ACTIVE

Order of implementation:

1. chapter-level source upload,
2. private image processing,
3. automatic chapter → subchapter segmentation,
4. review/confirmation,
5. image quality checks,
6. source-level structured analysis,
7. exercise → theory teaching implications,
8. persisted intelligence,
9. Subchapter Intelligence versions,
10. incremental diff / pending lesson update.

### Phase 4 — START Generator

- first student lesson,
- lesson revisions,
- `Ενημέρωση μαθήματος`,
- traceability.

### Phase 5 — Tests

- comprehension tests,
- attempts,
- adaptive difficulty.

### Phase 6 — AI Professor

- chapter-aware tutor,
- hints,
- uploaded exercise mode,
- progress-aware explanations.

### Phase 7 — Concept Map

- cross-chapter concept graph,
- prerequisites,
- long-term learning progression.

---

## Implementation rules

- Work on feature branches before main.
- Preserve existing chioshotel.gr behavior.
- Keep `/mixalis` isolated from accommodation/booking/staff features.
- Use safe database migrations on temporary Neon branches before main.
- Validate course/chapter/subchapter consistency both in application logic and database relationships.
- Preserve original source files and historical revisions.
- Analyze new source material incrementally.
- Do not silently overwrite trusted mappings or lessons.
- Do not install dependencies or change environment variables without explicit approval.
- Validate each meaningful phase before production.
- Treat this document as the technical source of truth for **BUILD** and the PHASE3 section as the source of truth for **PHASE3**.
