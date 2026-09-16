import type { SmartLabWidget } from "@/lib/mixalis/smartlab-types";

export const COULOMB_CONSTANT = 8.9875517923e9;

export type ElectrostaticsMode = "coulomb_pair" | "point_charge_field";
export type ChargeInteraction = "attraction" | "repulsion" | "none";

function finite(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function safeDistance(value: number) {
  return Math.max(Math.abs(finite(value, 1)), 1e-9);
}

export function electrostaticsMode(widget: SmartLabWidget): ElectrostaticsMode | null {
  const text = `${widget.title} ${widget.concept} ${widget.scene?.description || ""}`
    .normalize("NFC")
    .toLocaleLowerCase("el-GR");

  if (
    text.includes("ηλεκτρικό πεδίο")
    || text.includes("ηλεκτρικού πεδίου")
    || text.includes("electric field")
  ) return "point_charge_field";

  if (
    text.includes("coulomb")
    || text.includes("κουλόμπ")
    || (text.includes("ηλεκτρικ") && text.includes("φορτί") && text.includes("δύναμ"))
  ) return "coulomb_pair";

  return null;
}

export function parseFixedCharge(text: string | null | undefined, fallback: number) {
  const normalized = String(text || "")
    .normalize("NFKC")
    .replace(/,/g, ".")
    .replace(/[−–—]/g, "-");
  const match = normalized.match(/[qQ](?:[_1])?\s*=\s*([+-]?\d+(?:\.\d+)?)\s*(?:[×x·]\s*10\s*(?:\^)?\s*([+-]?\d+))?\s*C/i);
  if (!match) return fallback;
  const coefficient = Number(match[1]);
  const exponent = match[2] ? Number(match[2]) : 0;
  const parsed = coefficient * (10 ** exponent);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function calculateCoulombPair(sourceCharge: number, testCharge: number, distance: number) {
  const q1 = finite(sourceCharge);
  const q2 = finite(testCharge);
  const r = safeDistance(distance);
  const product = q1 * q2;
  const interaction: ChargeInteraction = product > 0 ? "repulsion" : product < 0 ? "attraction" : "none";

  return {
    sourceCharge: q1,
    testCharge: q2,
    distance: r,
    forceMagnitude: COULOMB_CONSTANT * Math.abs(product) / (r * r),
    interaction,
  };
}

export function calculatePointChargeField(sourceCharge: number, testCharge: number, distance: number) {
  const pair = calculateCoulombPair(sourceCharge, testCharge, distance);
  const electricFieldMagnitude = COULOMB_CONSTANT * Math.abs(pair.sourceCharge) / (pair.distance * pair.distance);
  const potential = COULOMB_CONSTANT * pair.sourceCharge / pair.distance;

  return {
    ...pair,
    electricFieldMagnitude,
    potential,
    potentialEnergy: pair.testCharge * potential,
    fieldDirection: pair.sourceCharge > 0 ? "outward" as const : pair.sourceCharge < 0 ? "inward" as const : "none" as const,
  };
}
