import type { HomePageData } from "@/content/home";
import type { SchemaObject } from "@/lib/structured-data";

const greekUiReplacements: ReadonlyArray<readonly [string, string]> = [
  ["💎 Value for money", "💎 Καλή σχέση ποιότητας–τιμής"],
  ["Room Wizard", "Βρες το δωμάτιό σου"],
  ["Scratch to reveal your discount", "Ξύσε για να αποκαλύψεις την έκπτωσή σου"],
  ["Direct booking code", "Κωδικός απευθείας κράτησης"],
  ["Discover Chios", "Ανακάλυψε τη Χίο"],
  ["Clear waters", "Καθαρά νερά"],
  ["Mastic villages", "Μαστιχοχώρια"],
  ["Culture", "Πολιτισμός"],
  ["Parking", "Στάθμευση"],
  ["Economy", "Οικονομικό"],
  ["Family beds", "Οικογενειακά κρεβάτια"],
  [" + extra", " + επιπλέον κρεβάτι"],
  ["Last Minute Προσφορές", "Προσφορές τελευταίας στιγμής"],
  ["last minute", "τελευταίας στιγμής"],
  ["🏡 Apt", "🏡 Διαμέρισμα"],
];

const greekSchemaReplacements: Record<string, string> = {
  "ωρεάν WiFi": "Δωρεάν WiFi",
  "σύρματη πρόσβαση στο διαδίκτυο για τους επισκέπτες":
    "Ασύρματη πρόσβαση στο διαδίκτυο για τους επισκέπτες",
  "λιματισμός": "Κλιματισμός",
  "λιματισμός στα καταλύματα": "Κλιματισμός στα καταλύματα",
  "διωτικό μπάνιο": "Ιδιωτικό μπάνιο",
  "διωτικές εγκαταστάσεις μπάνιου": "Ιδιωτικές εγκαταστάσεις μπάνιου",
  "ηλεόραση επίπεδης οθόνης": "Τηλεόραση επίπεδης οθόνης",
  "ηλεόραση στο κατάλυμα": "Τηλεόραση στο κατάλυμα",
  "ήπος και βεράντα": "Κήπος και βεράντα",
  "ξωτερικοί χώροι κήπου και βεράντας": "Εξωτερικοί χώροι κήπου και βεράντας",
  "ιαθέσιμος χώρος στάθμευσης": "Διαθέσιμος χώρος στάθμευσης",
  "ώρος στάθμευσης διαθέσιμος για τους επισκέπτες":
    "Χώρος στάθμευσης διαθέσιμος για τους επισκέπτες",
  "πηρεσία καθαριότητας": "Υπηρεσία καθαριότητας",
  "πηρεσία καθαριότητας κατά τη διάρκεια της διαμονής":
    "Υπηρεσία καθαριότητας κατά τη διάρκεια της διαμονής",
};

function replaceGreekUiString(value: string): string {
  return greekUiReplacements.reduce(
    (result, [source, replacement]) => result.split(source).join(replacement),
    value,
  );
}

function deepMapStrings(value: unknown, mapper: (input: string) => string): unknown {
  if (typeof value === "string") {
    return mapper(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepMapStrings(item, mapper));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
        key,
        deepMapStrings(nestedValue, mapper),
      ]),
    );
  }

  return value;
}

export function hardenGreekHomePageData(data: HomePageData): HomePageData {
  if (data.seo.canonicalPath !== "/el/") {
    return data;
  }

  const localized = deepMapStrings(data, replaceGreekUiString) as HomePageData;

  return {
    ...localized,
    location: {
      ...localized.location,
      discount: {
        ...localized.location.discount,
        badge: "Προσφορά τώρα • Πάρε κωδικό",
      },
    },
    roomsPreview: {
      ...localized.roomsPreview,
      primaryCta: {
        ...localized.roomsPreview.primaryCta,
        label: "Βρες το δωμάτιό σου",
      },
      rooms: localized.roomsPreview.rooms.map((room) => ({
        ...room,
        liveBadge: "ΤΩΡΑ",
      })),
    },
    lastMinute: {
      ...localized.lastMinute,
      kicker: "Προσφορές τελευταίας στιγμής",
      widget: {
        ...localized.lastMinute.widget,
        timerLabel: "Οι τιμές τελευταίας στιγμής ανανεώνονται σε:",
      },
    },
    traveler: {
      ...localized.traveler,
      kicker: "Ανακάλυψε τη Χίο",
    },
  };
}

export function hardenGreekSchema(
  data: SchemaObject,
  canonicalPath: string,
): SchemaObject {
  if (canonicalPath !== "/el/") {
    return data;
  }

  return deepMapStrings(
    data,
    (value) => greekSchemaReplacements[value] ?? value,
  ) as SchemaObject;
}
