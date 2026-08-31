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
]);
requireText('app/mixalis/(private)/chapters/[id]/page.tsx', [
  'Νέα σταθερή ροή · PDF only',
  'Δεν ανεβάζεις πλέον φωτογραφίες',
]);

requireText('app/mixalis/api/savvalas-audit/ranges/[rangeId]/run/route.ts', [
  'recoverStaleSavvalasSourceAnalysisForRange',
]);

console.log('Mixalis Physics PDF-only pipeline QA passed: canonical source selection, legacy quarantine, stage guards, START guard and stale-audit recovery are enforced.');
