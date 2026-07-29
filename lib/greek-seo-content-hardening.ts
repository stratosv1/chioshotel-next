type JsonLike = string | number | boolean | null | JsonLike[] | { [key: string]: JsonLike };

const exactReplacements = new Map<string, string>([
  ["3 km", "3 χλμ."],
  ["6 km", "6 χλμ."],
  ["Περίπου 3 km", "Περίπου 3 χλμ."],
  ["Περίπου 6 km", "Περίπου 6 χλμ."],
  ["Ψυγείο & A/C", "Ψυγείο & κλιματισμός"],
  ["Ρωτήστε το AI Room Finder", "Ρωτήστε τον βοηθό εύρεσης δωματίου AI"],
  ["Δοκιμάστε το AI Room Finder", "Δοκιμάστε τον βοηθό εύρεσης δωματίου AI"],
]);

function hardenGreekString(value: string) {
  const exact = exactReplacements.get(value);
  if (exact) return exact;

  return value
    .replace(/\bπιθανό split stay\b/gi, "πιθανή διαμονή σε δύο δωμάτια")
    .replace(/\bενός ξενοδοχείου ή resort\b/gi, "ενός ξενοδοχείου ή θερέτρου");
}

function deepMapGreekStrings(value: JsonLike): JsonLike {
  if (typeof value === "string") return hardenGreekString(value);
  if (Array.isArray(value)) return value.map(deepMapGreekStrings);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, deepMapGreekStrings(nested)]),
    );
  }
  return value;
}

export function hardenGreekSeoContent<T>(value: T): T {
  return deepMapGreekStrings(value as JsonLike) as T;
}
