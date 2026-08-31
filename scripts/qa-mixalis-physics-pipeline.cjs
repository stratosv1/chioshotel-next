const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function requireText(relativePath, needles) {
  const content = read(relativePath);
  for (const needle of needles) {
    if (!content.includes(needle)) {
      throw new Error(`[mixalis-pipeline] ${relativePath} is missing required guard: ${needle}`);
    }
  }
  return content;
}

function forbidText(relativePath, needles) {
  const content = read(relativePath);
  for (const needle of needles) {
    if (content.includes(needle)) {
      throw new Error(`[mixalis-pipeline] ${relativePath} contains forbidden legacy workflow text: ${needle}`);
    }
  }
  return content;
}

requireText('lib/mixalis/canonical-subchapter-sources.ts', [
  "a.source_kind = 'source_range'",
  "a.source_role = 'official' AND sd.source_kind = 'school_book'",
  "a.source_role = 'depth' AND sd.source_kind = 'savvalas_book'",
  'sourceCount: 2',
]);

requireText('lib/mixalis/lesson-navigation.ts', [
  "sd.source_kind = 'savvalas_book'",
  "sd.source_kind = 'school_book'",
  "a.source_kind = 'source_range'",
  'CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION',
  'Mapping Σαββάλα',
  'Depth Audit Σαββάλα',
  'Official Intelligence',
  'Canonical Intelligence',
  'Δημιουργία START',
]);

requireText('app/mixalis/api/subchapter-intelligence/[versionId]/route.ts', [
  'CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION',
  'view.sources.length !== 2',
  'officialCount !== 1',
  'depthCount !== 1',
]);

requireText('app/mixalis/api/lesson-revisions/from-intelligence/[versionId]/route.ts', [
  'CANONICAL_SUBCHAPTER_INTELLIGENCE_PROMPT_VERSION',
  'intelligence.sources.length !== 2',
  'officialCount !== 1',
  'depthCount !== 1',
]);

requireText('app/mixalis/(private)/subchapter-intelligence/[versionId]/page.tsx', [
  'PDF-only canonical',
  'Legacy · ιστορικό',
  'Δημιουργία νέας PDF-only Canonical Version',
]);

requireText('app/mixalis/(private)/source-intelligence/[analysisId]/page.tsx', [
  'Canonical PDF source',
  'Legacy · δεν χρησιμοποιείται',
  'legacy φωτογραφίες',
]);

forbidText('app/mixalis/(private)/chapters/[id]/page.tsx', [
  'BatchPhotoUploader',
  'listMaterialBatches',
  'getSmartLabChapterState',
]);
requireText('app/mixalis/(private)/chapters/[id]/page.tsx', [
  'listSingleSmartLabStatesByChapter',
  'LAB ready',
  'Κάθε μάθημα ολοκληρώνεται ανεξάρτητα',
  'δεν ξανατρέχει το 1.1',
]);

requireText('components/mixalis/PhysicsPipeline.tsx', [
  '6 · LAB',
  'SingleSmartLabPipelineState',
  '/mixalis/api/smartlab/subchapters/',
  'Ένα μάθημα · ένα ανεξάρτητο LAB',
  'Το 1.2 δεν ξαναδημιουργεί το LAB του 1.1',
]);
forbidText('components/mixalis/PhysicsPipeline.tsx', [
  '/mixalis/api/smartlab/chapters/',
  'currentLessonRevisionIds',
]);

requireText('app/mixalis/(private)/chapters/[id]/lab/page.tsx', [
  'listSingleSmartLabStatesByChapter',
  'getSingleSmartLabState',
  '/mixalis/api/smartlab/subchapters/',
  'Κάθε LAB είναι ανεξάρτητο',
  'Κανένα άλλο μάθημα του κεφαλαίου δεν θα σταλεί στο AI',
]);
forbidText('app/mixalis/(private)/chapters/[id]/lab/page.tsx', [
  '/mixalis/api/smartlab/chapters/',
  'getSmartLabChapterState',
]);

requireText('lib/mixalis/smartlab-single.ts', [
  'SINGLE_SNAPSHOT_PREFIX = "single:"',
  'single-subchapter-v1',
  'jsonb_array_length(smart_versions) = 1',
  "smart_versions->0->>'subchapterId'",
  'runSingleSmartLabRevision',
  'assertRuntimePhysicsFormulas',
  'derivePhysicsImpactModel',
  "status = 'superseded'",
]);

requireText('app/mixalis/api/smartlab/subchapters/[subchapterId]/route.ts', [
  'createSingleSmartLabRevision',
  'subchapter',
  'revision',
]);

requireText('lib/mixalis/smartlab-prompt.ts', [
  'finalver2',
  'physicsPreset=centripetal_force',
  'κεντρομόλος δύναμη είναι derived αποτέλεσμα και ΠΟΤΕ ανεξάρτητο control',
]);

requireText('lib/mixalis/smartlab-physics-audit.ts', [
  'widget.physicsPreset === "centripetal_force"',
  'Fκ=mυ²/r',
  'Fκ=mω²r',
]);

requireText('app/mixalis/api/smartlab/revisions/[revisionId]/route.ts', [
  'maxDuration = 900',
  'MAX_AUTOMATIC_ATTEMPTS = 3',
  'isSingleSmartLabRevision',
  'runSingleSmartLabRevision',
  'after(async () =>',
]);

requireText('app/mixalis/api/savvalas-audit/ranges/route.ts', [
  'assertSavvalasRangeIntegrity',
]);
requireText('lib/mixalis/savvalas-range-integrity.ts', [
  "sd.source_kind = 'savvalas_book'",
  'sr.file_page_from <=',
  'sr.file_page_to >=',
  'επικαλύπτεται',
]);
requireText('app/mixalis/api/savvalas-audit/ranges/[rangeId]/run/route.ts', [
  'recoverStaleSavvalasSourceAnalysisForRange',
]);

console.log('Mixalis Physics PDF-only pipeline QA passed: canonical sources, START guards and independent manual per-lesson SMARTLAB revisions are enforced without regenerating completed labs.');
