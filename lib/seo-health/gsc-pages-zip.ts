import { inflateRawSync } from "node:zlib";

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;
const MAX_ENTRIES = 100;
const MAX_ENTRY_BYTES = 12 * 1024 * 1024;
const MAX_TOTAL_UNCOMPRESSED = 24 * 1024 * 1024;

export type GscPagesZipContents = {
  tableCsv: Buffer | null;
  metadataCsv: Buffer | null;
  criticalIssuesCsv: Buffer | null;
  nonCriticalIssuesCsv: Buffer | null;
  chartCsv: Buffer | null;
  kind: "drilldown" | "overview";
};

function assertRange(buffer: Buffer, offset: number, length: number, label: string) {
  if (offset < 0 || length < 0 || offset + length > buffer.length) {
    throw new Error(`Invalid ZIP structure while reading ${label}.`);
  }
}

function findEndOfCentralDirectory(buffer: Buffer) {
  const minimum = Math.max(0, buffer.length - 65_557);
  for (let offset = buffer.length - 22; offset >= minimum; offset -= 1) {
    if (buffer.readUInt32LE(offset) === EOCD_SIGNATURE) return offset;
  }
  throw new Error("Το ZIP δεν έχει έγκυρη κεντρική δομή αρχείων.");
}

function decodeName(buffer: Buffer, utf8: boolean) {
  return buffer.toString(utf8 ? "utf8" : "latin1").replace(/\\/g, "/");
}

function basename(value: string) {
  const parts = value.split("/").filter(Boolean);
  return String(parts[parts.length - 1] || "").toLowerCase();
}

function readEntry(buffer: Buffer, input: {
  name: string;
  method: number;
  compressedSize: number;
  uncompressedSize: number;
  localOffset: number;
}) {
  assertRange(buffer, input.localOffset, 30, "ZIP local header");
  if (buffer.readUInt32LE(input.localOffset) !== LOCAL_SIGNATURE) {
    throw new Error(`Το ${input.name} έχει μη έγκυρο ZIP header.`);
  }

  const localNameLength = buffer.readUInt16LE(input.localOffset + 26);
  const localExtraLength = buffer.readUInt16LE(input.localOffset + 28);
  const dataOffset = input.localOffset + 30 + localNameLength + localExtraLength;
  assertRange(buffer, dataOffset, input.compressedSize, input.name);
  const compressed = buffer.subarray(dataOffset, dataOffset + input.compressedSize);

  let output: Buffer;
  if (input.method === 0) {
    output = Buffer.from(compressed);
  } else if (input.method === 8) {
    output = inflateRawSync(compressed, { maxOutputLength: MAX_ENTRY_BYTES });
  } else {
    throw new Error(`Το ${input.name} χρησιμοποιεί μη υποστηριζόμενη ZIP συμπίεση (${input.method}).`);
  }

  if (input.uncompressedSize && output.length !== input.uncompressedSize) {
    throw new Error(`Το ${input.name} δεν αποσυμπιέστηκε στο αναμενόμενο μέγεθος.`);
  }
  return output;
}

export function readGscPagesZip(buffer: Buffer): GscPagesZipContents {
  if (buffer.length < 22) throw new Error("Το ZIP είναι κενό ή κατεστραμμένο.");

  const eocd = findEndOfCentralDirectory(buffer);
  assertRange(buffer, eocd, 22, "ZIP directory footer");

  const diskNumber = buffer.readUInt16LE(eocd + 4);
  const centralDisk = buffer.readUInt16LE(eocd + 6);
  const entryCount = buffer.readUInt16LE(eocd + 10);
  const centralSize = buffer.readUInt32LE(eocd + 12);
  const centralOffset = buffer.readUInt32LE(eocd + 16);

  if (diskNumber !== 0 || centralDisk !== 0) {
    throw new Error("Δεν υποστηρίζεται multi-part ZIP export.");
  }
  if (entryCount < 1 || entryCount > MAX_ENTRIES) {
    throw new Error("Το ZIP έχει μη αναμενόμενο αριθμό αρχείων.");
  }
  assertRange(buffer, centralOffset, centralSize, "ZIP central directory");

  let cursor = centralOffset;
  let totalUncompressed = 0;
  let tableCsv: Buffer | null = null;
  let metadataCsv: Buffer | null = null;
  let criticalIssuesCsv: Buffer | null = null;
  let nonCriticalIssuesCsv: Buffer | null = null;
  let chartCsv: Buffer | null = null;

  for (let index = 0; index < entryCount; index += 1) {
    assertRange(buffer, cursor, 46, "ZIP central entry");
    if (buffer.readUInt32LE(cursor) !== CENTRAL_SIGNATURE) {
      throw new Error("Το ZIP περιέχει μη έγκυρη εγγραφή αρχείου.");
    }

    const flags = buffer.readUInt16LE(cursor + 8);
    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const fileNameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);

    assertRange(buffer, cursor + 46, fileNameLength, "ZIP filename");
    const name = decodeName(buffer.subarray(cursor + 46, cursor + 46 + fileNameLength), Boolean(flags & 0x0800));
    const fileBase = basename(name);

    if (flags & 0x0001) throw new Error("Δεν υποστηρίζεται κρυπτογραφημένο ZIP.");
    if (compressedSize > MAX_ENTRY_BYTES || uncompressedSize > MAX_ENTRY_BYTES) {
      throw new Error("Το ZIP περιέχει υπερβολικά μεγάλο αρχείο.");
    }
    totalUncompressed += uncompressedSize;
    if (totalUncompressed > MAX_TOTAL_UNCOMPRESSED) {
      throw new Error("Το ZIP είναι υπερβολικά μεγάλο μετά την αποσυμπίεση.");
    }

    const wanted = new Set([
      "table.csv",
      "metadata.csv",
      "critical issues.csv",
      "non-critical issues.csv",
      "chart.csv",
    ]);
    if (wanted.has(fileBase)) {
      const output = readEntry(buffer, { name, method, compressedSize, uncompressedSize, localOffset });
      if (fileBase === "table.csv") tableCsv = output;
      if (fileBase === "metadata.csv") metadataCsv = output;
      if (fileBase === "critical issues.csv") criticalIssuesCsv = output;
      if (fileBase === "non-critical issues.csv") nonCriticalIssuesCsv = output;
      if (fileBase === "chart.csv") chartCsv = output;
    }

    cursor += 46 + fileNameLength + extraLength + commentLength;
  }

  if (tableCsv) {
    return { tableCsv, metadataCsv, criticalIssuesCsv, nonCriticalIssuesCsv, chartCsv, kind: "drilldown" };
  }
  if (criticalIssuesCsv || nonCriticalIssuesCsv) {
    return { tableCsv, metadataCsv, criticalIssuesCsv, nonCriticalIssuesCsv, chartCsv, kind: "overview" };
  }

  throw new Error("Το Google ZIP δεν περιέχει αναγνωρίσιμο Pages export (Table.csv ή Critical issues.csv). ");
}
