export type StaffExpenseCategory = {
  slug: string;
  label: string;
  icon: string;
};

export type StaffExpenseEntity = {
  slug: string;
  label: string;
  icon: string;
  account: "kampos" | "family";
};

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
  { slug: "michalis", label: "ΜΙΧΑΛΗΣ", icon: "👤", account: "family" },
  { slug: "sideris", label: "ΣΙΔΕΡΗΣ", icon: "👤", account: "family" },
  { slug: "aggeliki", label: "ΑΓΓΕΛΙΚΗ", icon: "👤", account: "family" },
  { slug: "stratis", label: "ΣΤΡΑΤΗΣ", icon: "👤", account: "family" },
];

export const staffExpenseEntityCategoryMap: Record<string, string[]> = {
  kampos: [
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
  ],
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

export function categoryExists(slug: string) {
  return staffExpenseCategories.some((category) => category.slug === slug);
}

export function entityExists(slug: string) {
  return staffExpenseEntities.some((entity) => entity.slug === slug);
}

export function categoryBelongsToEntity(entity: string, category: string) {
  return staffExpenseEntityCategoryMap[entity]?.includes(category) ?? false;
}
