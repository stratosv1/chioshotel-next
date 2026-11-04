export type StaffExpenseAccount = "kampos" | "family" | "tailormade";

export type StaffExpenseCategory = {
  slug: string;
  label: string;
  icon: string;
};

export type StaffExpenseEntity = {
  slug: string;
  label: string;
  icon: string;
  account: StaffExpenseAccount;
};

export const staffExpenseAccounts: Array<{
  slug: StaffExpenseAccount;
  label: string;
  shortLabel: string;
  icon: string;
}> = [
  { slug: "kampos", label: "ΚΑΜΠΟΣ", shortLabel: "Κάμπος", icon: "🏡" },
  { slug: "family", label: "ΣΠΙΤΙ", shortLabel: "Σπίτι", icon: "🏠" },
  { slug: "tailormade", label: "TAILORMADE", shortLabel: "Tailormade", icon: "✂️" },
];

export const staffExpenseCategories: StaffExpenseCategory[] = [
  { slug: "electricity", label: "Ρεύμα", icon: "⚡" },
  { slug: "tuition", label: "Φροντιστήριο", icon: "🎓" },
  { slug: "devices", label: "Συσκευές", icon: "🔌" },
  { slug: "sports", label: "Αθλητισμός", icon: "🏃" },
  { slug: "entertainment", label: "Διασκέδαση", icon: "🎉" },
  { slug: "travel", label: "Ταξίδι", icon: "✈️" },
  { slug: "books", label: "Βιβλία", icon: "📚" },
  { slug: "clothes", label: "Ρούχα", icon: "👕" },
  { slug: "shoes", label: "Παπούτσια", icon: "👟" },
  { slug: "delivery", label: "Delivery", icon: "🛵" },
  { slug: "gifts", label: "Δώρα", icon: "🎁" },
  { slug: "emi", label: "Έμη", icon: "👤" },
  { slug: "mobile", label: "Κινητό", icon: "📱" },
  { slug: "tv", label: "Τηλεόραση", icon: "📺" },
  { slug: "supermarket", label: "Σούπερ Μάρκετ", icon: "🛒" },
  { slug: "fuel", label: "Βενζίνη", icon: "⛽" },
  { slug: "booking_commission", label: "Προμήθειες Booking.com", icon: "🏨" },
  { slug: "carme", label: "Carme", icon: "🚗" },
  { slug: "tools", label: "Εργαλεία", icon: "🧰" },
  { slug: "garden", label: "Περιβόλι", icon: "🌿" },
  { slug: "damages", label: "Ζημιές", icon: "🧱" },
  { slug: "cleaning_supplies", label: "Υλ. Καθαριότητας", icon: "🧼" },
  { slug: "service", label: "Υπηρεσία", icon: "🤝" },
  { slug: "car", label: "Αυτοκίνητο", icon: "🚗" },
  { slug: "accessories", label: "Αξεσουάρ", icon: "🎒" },
  { slug: "insurance", label: "Ασφάλειες", icon: "🛡️" },
];

export const staffExpenseEntities: StaffExpenseEntity[] = [
  { slug: "kampos", label: "ΚΑΜΠΟΣ", icon: "🏡", account: "kampos" },
  { slug: "home", label: "ΣΠΙΤΙ", icon: "🏠", account: "family" },
  { slug: "tailormade", label: "TAILORMADE", icon: "✂️", account: "tailormade" },
  { slug: "michalis", label: "ΜΙΧΑΛΗΣ", icon: "👤", account: "family" },
  { slug: "sideris", label: "ΣΙΔΕΡΗΣ", icon: "👤", account: "family" },
  { slug: "aggeliki", label: "ΑΓΓΕΛΙΚΗ", icon: "👤", account: "family" },
  { slug: "stratis", label: "ΣΤΡΑΤΗΣ", icon: "👤", account: "family" },
];

const kamposCategories = [
  "electricity",
  "supermarket",
  "fuel",
  "booking_commission",
  "carme",
  "tools",
  "garden",
  "damages",
  "cleaning_supplies",
  "service",
  "devices",
  "clothes",
  "shoes",
  "delivery",
  "gifts",
  "emi",
  "car",
  "accessories",
  "insurance",
];

const tailormadeCategories = [
  "electricity",
  "devices",
  "entertainment",
  "travel",
  "delivery",
  "gifts",
  "mobile",
  "supermarket",
  "fuel",
  "tools",
  "damages",
  "cleaning_supplies",
  "service",
  "car",
  "accessories",
  "insurance",
];

export const staffExpenseEntityCategoryMap: Record<string, string[]> = {
  kampos: kamposCategories,
  tailormade: tailormadeCategories,
  home: [
    "electricity",
    "tuition",
    "devices",
    "sports",
    "entertainment",
    "travel",
    "books",
    "clothes",
    "shoes",
    "delivery",
    "gifts",
    "emi",
    "mobile",
    "tv",
    "supermarket",
    "fuel",
    "tools",
    "damages",
    "service",
    "car",
    "accessories",
    "insurance",
  ],
  michalis: [
    "tuition",
    "sports",
    "entertainment",
    "travel",
    "books",
    "clothes",
    "shoes",
    "delivery",
    "gifts",
    "mobile",
    "accessories",
  ],
  sideris: [
    "tuition",
    "sports",
    "entertainment",
    "travel",
    "books",
    "clothes",
    "shoes",
    "delivery",
    "gifts",
    "mobile",
    "accessories",
  ],
  aggeliki: [
    "sports",
    "entertainment",
    "travel",
    "books",
    "clothes",
    "shoes",
    "delivery",
    "gifts",
    "mobile",
    "accessories",
  ],
  stratis: [
    "sports",
    "entertainment",
    "travel",
    "books",
    "clothes",
    "shoes",
    "delivery",
    "gifts",
    "mobile",
    "accessories",
  ],
};

export const staffTuitionSubjects = [
  "Αγγλικά",
  "Γερμανικά",
  "Μαθηματικά",
  "Φυσική",
  "Γλώσσα",
];

// Reads an amount the way it is typed in Greece: comma for decimals, dot for
// thousands. Returns 0 for anything unclear, so the form asks again instead of
// guessing (negative numbers, "1,250", "0.500", letters).
export function parseExpenseAmount(value: unknown) {
  const raw = String(value ?? "").replace(/[\s€]/g, "");
  if (!/^[\d.,]+$/.test(raw)) return 0;

  const commas = raw.split(",").length - 1;
  const dots = raw.split(".").length - 1;
  let decimalAt = -1;

  if (commas > 0 && dots > 0) decimalAt = Math.max(raw.lastIndexOf(","), raw.lastIndexOf("."));
  else if (commas === 1) decimalAt = raw.indexOf(",");
  else if (dots === 1 && !/^[1-9]\d{0,2}\.\d{3}$/.test(raw)) decimalAt = raw.indexOf(".");

  const whole = decimalAt >= 0 ? raw.slice(0, decimalAt) : raw;
  const decimals = decimalAt >= 0 ? raw.slice(decimalAt + 1) : "";

  if (/[.,]/.test(whole) && !/^\d{1,3}([.,]\d{3})+$/.test(whole)) return 0;
  if (!/^\d{0,2}$/.test(decimals)) return 0;

  const amount = Number(`${whole.replace(/[.,]/g, "") || "0"}.${decimals || "0"}`);
  return Number.isFinite(amount) && amount <= 99_999_999.99 ? amount : 0;
}

export function accountExists(value: string): value is StaffExpenseAccount {
  return staffExpenseAccounts.some((account) => account.slug === value);
}

export function accountForEntity(entity: string): StaffExpenseAccount | null {
  return staffExpenseEntities.find((item) => item.slug === entity)?.account ?? null;
}

export function accountLabel(account: StaffExpenseAccount) {
  return staffExpenseAccounts.find((item) => item.slug === account)?.label ?? account;
}

export function categoryExists(slug: string) {
  return staffExpenseCategories.some((category) => category.slug === slug);
}

export function entityExists(slug: string) {
  return staffExpenseEntities.some((entity) => entity.slug === slug);
}

export function categoryBelongsToEntity(entity: string, category: string) {
  return staffExpenseEntityCategoryMap[entity]?.includes(category) ?? false;
}

export function categoriesForAccount(account: StaffExpenseAccount) {
  const entitySlugs = staffExpenseEntities
    .filter((entity) => entity.account === account)
    .map((entity) => entity.slug);

  const allowed = new Set(
    entitySlugs.flatMap((entity) => staffExpenseEntityCategoryMap[entity] ?? []),
  );

  return staffExpenseCategories.filter((category) => allowed.has(category.slug));
}
