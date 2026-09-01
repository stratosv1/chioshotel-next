import type { HomePageData } from "@/content/home";

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
    hero: {
      ...localized.hero,
      reviews: "182 κριτικές",
    },
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
