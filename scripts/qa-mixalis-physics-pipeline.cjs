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

function requireMissing(relativePaths) {
  for (const relativePath of relativePaths) {
    if (fs.existsSync(path.join(root, relativePath))) {
      throw new Error(`[mixalis-pipeline] obsolete AI page-mapping file still exists: ${relativePath}`);
    }
  }
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
  'savvalas_page_from',
  'official_page_from',
]);
forbidText('lib/mixalis/lesson-navigation.ts', [
  'savvalas-auto-map',
  'official-auto-map',
  'Mapping Σαββάλα',
  'Έλεγχος σχολικού range',
]);

requireText('app/mixalis/api/manual-mapping/[subchapterId]/route.ts', [
  'savvalasFrom',
  'savvalasTo',
  'officialFrom',
  'officialTo',
  'assertSavvalasRangeIntegrity',
  'assertOfficialRangeIntegrity',
  'upsertSavvalasSourceRange',
  'upsertOfficialSourceRange',
  'Manual mapping is authoritative',
]);
requireText('lib/mixalis/official-source-range.ts', [
  "sd.source_kind = 'school_book'",
  "status = 'superseded'",
  'subchapter_intelligence_versions',
]);

requireMissing([
  'app/mixalis/api/savvalas-audit/auto-map/route.ts',
  'app/mixalis/api/savvalas-audit/auto-map/discard/route.ts',
  'app/mixalis/(private)/savvalas-auto-map/page.tsx',
  'lib/mixalis/savvalas-auto-mapping.ts',
  'app/mixalis/api/official-auto-map/propose/route.ts',
  'app/mixalis/api/official-auto-map/confirm/route.ts',
  'app/mixalis/(private)/official-auto-map/page.tsx',
  'lib/mixalis/official-auto-mapping.ts',
  'lib/mixalis/savvalas-mapping-proposal-cookie.ts',
]);

requireText('app/mixalis/api/lesson-build/[subchapterId]/route.ts', [
  'runSavvalasSourceIntelligence',
  'createOfficialAnalysisFromRange',
  'runOfficialSourceIntelligence',
  'createCanonicalSubchapterIntelligenceVersion',
  'runSubchapterIntelligence',
  'createLessonRevisionFromIntelligence',
  'runLessonRevision',
  'Συμπλήρωσε πρώτα χειροκίνητα τις ORIGINAL PDF σελίδες',
  'only the manually supplied Savvalas range',
  'only the manually supplied official range',
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
  'savvalas-auto-map',
  'official-auto-map',
]);
requireText('app/mixalis/(private)/chapters/[id]/page.tsx', [
  'listSingleSmartLabStatesByChapterCompat',
  'manual ranges',
  'Σελίδες → Δημιουργία μαθήματος → LAB',
  'Δεν γίνεται AI αναζήτηση σελίδων',
]);

requireText('components/mixalis/PhysicsPipeline.tsx', [
  'SingleSmartLabPipelineState',
  '/mixalis/api/manual-mapping/',
  '/mixalis/api/lesson-build/',
  '/mixalis/api/smartlab/subchapters/',
  'Σαββάλας · ORIGINAL PDF',
  'Σχολικό βιβλίο · ORIGINAL PDF',
  'Δημιουργία μαθήματος',
  'Δεν γίνεται πλέον AI εντοπισμός σελίδων',
  'Το LAB παραμένει ξεχωριστό',
]);
forbidText('components/mixalis/PhysicsPipeline.tsx', [
  '/mixalis/api/smartlab/chapters/',
  'currentLessonRevisionIds',
  'savvalas-auto-map',
  'official-auto-map',
]);

requireText('app/mixalis/(private)/chapters/[id]/lab/page.tsx', [
  'listSingleSmartLabStatesByChapterCompat',
  'getSingleSmartLabStateCompat',
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

requireText('lib/mixalis/smartlab-single-compat.ts', [
  'runSingleSmartLabRevisionCompat',
  "status = 'superseded'",
  "status IN ('current', 'superseded')",
  'completed_at IS NOT NULL',
  "input_snapshot_hash LIKE 'single:%'",
  'Free the legacy one-current-per-chapter slot',
]);

requireText('app/mixalis/api/smartlab/subchapters/[subchapterId]/route.ts', [
  'createSingleSmartLabRevision',
  'subchapter',
  'revision',
]);

requireText('app/mixalis/api/smartlab/chapters/[chapterId]/route.ts', [
  'chapter-wide δημιουργία SMARTLAB έχει απενεργοποιηθεί',
  'requiredRoute',
  '/mixalis/api/smartlab/subchapters/[subchapterId]',
  'status: 409',
]);

requireText('lib/mixalis/smartlab-prompt.ts', [
  'finalver3',
  'ΑΠΑΡΑΒΑΤΟΣ ΟΠΤΙΚΟΣ ΚΑΝΟΝΑΣ',
  'ΒΛΕΠΩ ΤΟ ΦΑΙΝΟΜΕΝΟ ΝΑ ΑΛΛΑΖΕΙ',
  'physicsPreset=centripetal_force',
  'κεντρομόλος δύναμη είναι derived αποτέλεσμα και ΠΟΤΕ ανεξάρτητο control',
  'Το φαινόμενο της κρούσης',
]);

requireText('lib/mixalis/smartlab-physics-audit.ts', [
  'widget.physicsPreset === "centripetal_force"',
  'Fκ=mυ²/r',
  'Fκ=mω²r',
]);

requireText('components/mixalis/SmartLabRunner.tsx', [
  'SmartLabGenericExperience',
  'widget?.physicsPreset === "generic_relation"',
]);
requireText('components/mixalis/SmartLabGenericExperience.tsx', [
  'looksLikeSystemForces',
  'SystemForcesDiagram',
  'looksLikeCollision',
  'SmartLabCollision1D',
  'RelationDiagram',
  'πρέπει να χρησιμοποιεί ειδικό renderer και πραγματικό γράφημα του φαινομένου',
  'εσωτερικές δυνάμεις',
  'συνολική ορμή του συστήματος',
]);
requireText('components/mixalis/SmartLabCollision1D.tsx', [
  'Διαδραστική προσομοίωση μονοδιάστατης πλαστικής κρούσης',
  'ΠΡΙΝ ΤΗΝ ΚΡΟΥΣΗ',
  'ΣΤΙΓΜΗ ΚΡΟΥΣΗΣ',
  'ΜΕΤΑ ΤΗΝ ΚΡΟΥΣΗ',
  'Ορμή συστήματος',
  'ΚΙΝΗΤΙΚΗ ΕΝΕΡΓΕΙΑ',
  'Εξέλιξη της κρούσης',
]);

requireText('app/mixalis/api/smartlab/revisions/[revisionId]/route.ts', [
  'maxDuration = 900',
  'MAX_AUTOMATIC_ATTEMPTS = 3',
  'isSingleSmartLabRevision',
  'runSingleSmartLabRevisionCompat',
  'after(async () =>',
]);

requireText('lib/mixalis/savvalas-range-integrity.ts', [
  "sd.source_kind = 'savvalas_book'",
  'sr.file_page_from <=',
  'sr.file_page_to >=',
  'επικαλύπτεται',
]);
requireText('lib/mixalis/official-range-integrity.ts', [
  "sd.source_kind = 'school_book'",
  'sr.file_page_from <=',
  'sr.file_page_to >=',
  'επικαλύπτεται',
]);

console.log('Mixalis Physics pipeline QA passed: page mapping is manual-only, AI page detection is removed, one-click lesson generation is enforced, canonical PDF guards remain active, and LAB stays independent per lesson with visible physical phenomena.');
