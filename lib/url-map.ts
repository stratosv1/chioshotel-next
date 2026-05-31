import { type LanguageCode, normalizePath } from "./languages";

export type RouteAction = "KEEP" | "CHECK" | "REDIRECT" | "REMOVE" | "MERGE";

export type PageTemplate =
  | "HomePage"
  | "RoomsCategoryPage"
  | "RoomDetailPage"
  | "BookingPage"
  | "DealsPage"
  | "ContactPage"
  | "ChiosGuidePage"
  | "ChiosCategoryPage"
  | "ChiosDetailPage"
  | "LandingPage"
  | "StaticPage"
  | "Redirect";

export type RouteContentType =
  | "home"
  | "rooms-category"
  | "room-detail"
  | "booking-rates"
  | "deals"
  | "contact"
  | "chios-guide-index"
  | "chios-category"
  | "chios-detail"
  | "landing-page"
  | "photos"
  | "videos"
  | "ai-chatbox"
  | "legal"
  | "old-test"
  | "redirect-candidate";

export type RouteRecord = {
  path: string;
  language: LanguageCode;
  contentType: RouteContentType;
  category?: string;
  itemId: string;
  template: PageTemplate;
  action: RouteAction;
  priority: "Critical" | "High" | "Medium" | "Low";
  canonicalPath?: string;
  notes?: string;
};

export const routeMap = [
  {
    path: "/",
    language: "en",
    contentType: "home",
    itemId: "home",
    template: "HomePage",
    action: "KEEP",
    priority: "Critical",
    notes: "English is the default/base language.",
  },
  {
    path: "/el/",
    language: "el",
    contentType: "home",
    itemId: "home",
    template: "HomePage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/fr/",
    language: "fr",
    contentType: "home",
    itemId: "home",
    template: "HomePage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/de/",
    language: "de",
    contentType: "home",
    itemId: "home",
    template: "HomePage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/it/",
    language: "it",
    contentType: "home",
    itemId: "home",
    template: "HomePage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/es/",
    language: "es",
    contentType: "home",
    itemId: "home",
    template: "HomePage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/tr/",
    language: "tr",
    contentType: "home",
    itemId: "home",
    template: "HomePage",
    action: "KEEP",
    priority: "Critical",
  },

  {
    path: "/chios-rooms/",
    language: "en",
    contentType: "rooms-category",
    category: "rooms",
    itemId: "rooms-index",
    template: "RoomsCategoryPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/el/domatia-xios/",
    language: "el",
    contentType: "rooms-category",
    category: "rooms",
    itemId: "rooms-index",
    template: "RoomsCategoryPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/fr/chambres-a-chios/",
    language: "fr",
    contentType: "rooms-category",
    category: "rooms",
    itemId: "rooms-index",
    template: "RoomsCategoryPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/de/chios-zimmer/",
    language: "de",
    contentType: "rooms-category",
    category: "rooms",
    itemId: "rooms-index",
    template: "RoomsCategoryPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/it/le-migliori-camere-a-chios-hotel-a-chios-camere-a-chios/",
    language: "it",
    contentType: "rooms-category",
    category: "rooms",
    itemId: "rooms-index",
    template: "RoomsCategoryPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/es/habitaciones-en-chios/",
    language: "es",
    contentType: "rooms-category",
    category: "rooms",
    itemId: "rooms-index",
    template: "RoomsCategoryPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/tr/chiosta-odalar/",
    language: "tr",
    contentType: "rooms-category",
    category: "rooms",
    itemId: "rooms-index",
    template: "RoomsCategoryPage",
    action: "KEEP",
    priority: "Critical",
  },

  {
    path: "/chios-rooms/economy-double-rooms/",
    language: "en",
    contentType: "room-detail",
    category: "rooms",
    itemId: "economy-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    language: "el",
    contentType: "room-detail",
    category: "rooms",
    itemId: "economy-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/fr/chambres-a-chios/chambres-doubles-economiques/",
    language: "fr",
    contentType: "room-detail",
    category: "rooms",
    itemId: "economy-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/de/zimmer-chios/economy-zimmer-auf-chios/",
    language: "de",
    contentType: "room-detail",
    category: "rooms",
    itemId: "economy-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/it/stanze-a-chios/camera-doppia-economica-chios/",
    language: "it",
    contentType: "room-detail",
    category: "rooms",
    itemId: "economy-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
    language: "es",
    contentType: "room-detail",
    category: "rooms",
    itemId: "economy-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
    language: "tr",
    contentType: "room-detail",
    category: "rooms",
    itemId: "economy-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },

  {
    path: "/chios-rooms/standard-double-room/",
    language: "en",
    contentType: "room-detail",
    category: "rooms",
    itemId: "standard-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/el/domatia-xios/diklina-triklina-domatia/",
    language: "el",
    contentType: "room-detail",
    category: "rooms",
    itemId: "standard-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/fr/chambres-a-chios/chambres-doubles-standard/",
    language: "fr",
    contentType: "room-detail",
    category: "rooms",
    itemId: "standard-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
    language: "de",
    contentType: "room-detail",
    category: "rooms",
    itemId: "standard-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/it/stanze-a-chios/camere-doppie-standard-chios/",
    language: "it",
    contentType: "room-detail",
    category: "rooms",
    itemId: "standard-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/es/habitaciones-en-chios/habitaciones-dobles-en-la-isla-de-chios/",
    language: "es",
    contentType: "room-detail",
    category: "rooms",
    itemId: "standard-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/tr/chios-odalari/standart-cift-kisilik-odalar-sakiz-adasi/",
    language: "tr",
    contentType: "room-detail",
    category: "rooms",
    itemId: "standard-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },

  {
    path: "/chios-rooms/family-chios-apartments/",
    language: "en",
    contentType: "room-detail",
    category: "rooms",
    itemId: "family-apartment",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/el/domatia-xios/oikogeneiako-diamerisma/",
    language: "el",
    contentType: "room-detail",
    category: "rooms",
    itemId: "family-apartment",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    language: "fr",
    contentType: "room-detail",
    category: "rooms",
    itemId: "family-apartment",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/de/zimmer-chios/familienapartments-in-chios/",
    language: "de",
    contentType: "room-detail",
    category: "rooms",
    itemId: "family-apartment",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
    language: "it",
    contentType: "room-detail",
    category: "rooms",
    itemId: "family-apartment",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    language: "es",
    contentType: "room-detail",
    category: "rooms",
    itemId: "family-apartment",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    language: "tr",
    contentType: "room-detail",
    category: "rooms",
    itemId: "family-apartment",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },

  {
    path: "/chios-hotels-rates/",
    language: "en",
    contentType: "booking-rates",
    itemId: "booking",
    template: "BookingPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/el/amesi-kratisi-voulamandis-house/",
    language: "el",
    contentType: "booking-rates",
    itemId: "booking",
    template: "BookingPage",
    action: "KEEP",
    priority: "Critical",
  },

  {
    path: "/voulamandis-house-contact-us-form-fill-in-the-form/",
    language: "en",
    contentType: "contact",
    itemId: "contact",
    template: "ContactPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/el/epikoinonia-voulamandis-house/",
    language: "el",
    contentType: "contact",
    itemId: "contact",
    template: "ContactPage",
    action: "KEEP",
    priority: "High",
  },

  {
    path: "/chios-island/",
    language: "en",
    contentType: "chios-guide-index",
    category: "chios",
    itemId: "chios-index",
    template: "ChiosGuidePage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/el/ti-na-do-sti-xio/",
    language: "el",
    contentType: "chios-guide-index",
    category: "chios",
    itemId: "chios-index",
    template: "ChiosGuidePage",
    action: "KEEP",
    priority: "High",
  },

  {
    path: "/chios/chios-beaches/",
    language: "en",
    contentType: "chios-category",
    category: "beaches",
    itemId: "beaches-index",
    template: "ChiosCategoryPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-villages/",
    language: "en",
    contentType: "chios-category",
    category: "villages",
    itemId: "villages-index",
    template: "ChiosCategoryPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-museums/",
    language: "en",
    contentType: "chios-category",
    category: "museums",
    itemId: "museums-index",
    template: "ChiosCategoryPage",
    action: "KEEP",
    priority: "High",
  },

  {
    path: "/chios/chios-beaches/agia-dynami-beach-chios/",
    language: "en",
    contentType: "chios-detail",
    category: "beaches",
    itemId: "agia-dynami",
    template: "ChiosDetailPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-villages/chios-pyrgi/",
    language: "en",
    contentType: "chios-detail",
    category: "villages",
    itemId: "pyrgi",
    template: "ChiosDetailPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-museums/the-mastic-museum-chios/",
    language: "en",
    contentType: "chios-detail",
    category: "museums",
    itemId: "mastic-museum",
    template: "ChiosDetailPage",
    action: "KEEP",
    priority: "High",
  },

  {
    path: "/chios-holidays-quiz/",
    language: "en",
    contentType: "landing-page",
    category: "landing",
    itemId: "chios-quiz",
    template: "LandingPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/el/diakopes-sti-chio-quiz/",
    language: "el",
    contentType: "landing-page",
    category: "landing",
    itemId: "chios-quiz",
    template: "LandingPage",
    action: "KEEP",
    priority: "High",
  },

  {
    path: "/mike-2/",
    language: "en",
    contentType: "old-test",
    itemId: "mike",
    template: "Redirect",
    action: "CHECK",
    priority: "Low",
    canonicalPath: "/",
    notes: "Looks like test/old page. Check analytics before redirect.",
  },
  {
    path: "/es/mike/",
    language: "es",
    contentType: "old-test",
    itemId: "mike",
    template: "Redirect",
    action: "CHECK",
    priority: "Low",
    canonicalPath: "/es/",
    notes: "Looks like test/old page. Check analytics before redirect.",
  },
  {
    path: "/tr/offer/",
    language: "tr",
    contentType: "redirect-candidate",
    itemId: "old-offer",
    template: "Redirect",
    action: "CHECK",
    priority: "Low",
    canonicalPath: "/tr/sakiz-adasi-otel-firsatlari/",
    notes: "Likely old offer page.",
  },
] as const satisfies readonly RouteRecord[];

export type RouteMapItem = (typeof routeMap)[number];

export function getRouteByPath(path: string): RouteMapItem | undefined {
  const normalizedPath = normalizePath(path);

  return routeMap.find((route) => route.path === normalizedPath);
}

export function getRoutesByItemId(itemId: string): RouteMapItem[] {
  return routeMap.filter((route) => route.itemId === itemId);
}

export function getRoutesByTemplate(template: PageTemplate): RouteMapItem[] {
  return routeMap.filter((route) => route.template === template);
}

export function getRoutesByLanguage(language: LanguageCode): RouteMapItem[] {
  return routeMap.filter((route) => route.language === language);
}

export function getLocalizedRoutes(path: string): RouteMapItem[] {
  const route = getRouteByPath(path);

  if (!route) {
    return [];
  }

  return getRoutesByItemId(route.itemId);
}

export function getCanonicalPath(path: string): string {
  const route = getRouteByPath(path);

  if (!route) {
    return normalizePath(path);
  }

  return normalizePath(route.canonicalPath || route.path);
}