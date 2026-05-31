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

export const routeMap: readonly RouteRecord[] = [
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
    path: "/it/camere-a-chios/",
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
    path: "/tr/sakiz-adasi-odalari/",
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
    path: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
    language: "es",
    contentType: "room-detail",
    category: "rooms",
    itemId: "standard-double",
    template: "RoomDetailPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
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
    path: "/fr/tarifs-des-hotels-a-chios/",
    language: "fr",
    contentType: "booking-rates",
    itemId: "booking",
    template: "BookingPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/de/hotelpreise-auf-der-insel-chios/",
    language: "de",
    contentType: "booking-rates",
    itemId: "booking",
    template: "BookingPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/it/prezzi-hotel-chios/",
    language: "it",
    contentType: "booking-rates",
    itemId: "booking",
    template: "BookingPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    language: "es",
    contentType: "booking-rates",
    itemId: "booking",
    template: "BookingPage",
    action: "KEEP",
    priority: "Critical",
  },
  {
    path: "/tr/sakiz-adasi-rezervasyon/",
    language: "tr",
    contentType: "booking-rates",
    itemId: "booking",
    template: "BookingPage",
    action: "KEEP",
    priority: "Critical",
  },

  {
    path: "/best-chios-travel-deals-for-chios-hotels/",
    language: "en",
    contentType: "deals",
    itemId: "deals",
    template: "DealsPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/el/crazy-travel-deals-for-chios-hotels/",
    language: "el",
    contentType: "deals",
    itemId: "deals",
    template: "DealsPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/fr/offres-de-voyage-pour-les-hotels-a-chios/",
    language: "fr",
    contentType: "deals",
    itemId: "deals",
    template: "DealsPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/de/beste-reiseangebote-fur-chios-hotels-auf-chios/",
    language: "de",
    contentType: "deals",
    itemId: "deals",
    template: "DealsPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/it/offerte-di-viaggio-hotels-chios/",
    language: "it",
    contentType: "deals",
    itemId: "deals",
    template: "DealsPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/es/mejores-ofertas-de-viaje-a-quios-para-hoteles-en-quios/",
    language: "es",
    contentType: "deals",
    itemId: "deals",
    template: "DealsPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/tr/sakiz-adasi-otel-firsatlari/",
    language: "tr",
    contentType: "deals",
    itemId: "deals",
    template: "DealsPage",
    action: "KEEP",
    priority: "High",
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
    path: "/fr/contactez-nous/",
    language: "fr",
    contentType: "contact",
    itemId: "contact",
    template: "ContactPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/de/kontaktieren-voulamandis-house/",
    language: "de",
    contentType: "contact",
    itemId: "contact",
    template: "ContactPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/it/contattaci-voulamandis-house/",
    language: "it",
    contentType: "contact",
    itemId: "contact",
    template: "ContactPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/es/contacta-con-voulamandis-house/",
    language: "es",
    contentType: "contact",
    itemId: "contact",
    template: "ContactPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/tr/sakiz-adasi-otelleri-ile-iletisim/",
    language: "tr",
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
    path: "/fr/chios-en-grece/",
    language: "fr",
    contentType: "chios-guide-index",
    category: "chios",
    itemId: "chios-index",
    template: "ChiosGuidePage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/de/chios-insel/",
    language: "de",
    contentType: "chios-guide-index",
    category: "chios",
    itemId: "chios-index",
    template: "ChiosGuidePage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/it/chios-lisola-in-grecia/",
    language: "it",
    contentType: "chios-guide-index",
    category: "chios",
    itemId: "chios-index",
    template: "ChiosGuidePage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/es/chios-en-grecia/",
    language: "es",
    contentType: "chios-guide-index",
    category: "chios",
    itemId: "chios-index",
    template: "ChiosGuidePage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/tr/sakiz-adasi/",
    language: "tr",
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
    path: "/chios/chios-beaches/komi-beach/",
    language: "en",
    contentType: "chios-detail",
    category: "beaches",
    itemId: "komi",
    template: "ChiosDetailPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-beaches/emporios-beach/",
    language: "en",
    contentType: "chios-detail",
    category: "beaches",
    itemId: "emporios",
    template: "ChiosDetailPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-beaches/agia-fotia-beach/",
    language: "en",
    contentType: "chios-detail",
    category: "beaches",
    itemId: "agia-fotia",
    template: "ChiosDetailPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-beaches/lefkathia-beach/",
    language: "en",
    contentType: "chios-detail",
    category: "beaches",
    itemId: "lefkathia",
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
    path: "/chios/chios-villages/mesta-chios/",
    language: "en",
    contentType: "chios-detail",
    category: "villages",
    itemId: "mesta",
    template: "ChiosDetailPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-villages/vessa-chios/",
    language: "en",
    contentType: "chios-detail",
    category: "villages",
    itemId: "vessa",
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
    path: "/chios/chios-museums/archaeological-museum-chios/",
    language: "en",
    contentType: "chios-detail",
    category: "museums",
    itemId: "archaeological-museum",
    template: "ChiosDetailPage",
    action: "KEEP",
    priority: "High",
  },
  {
    path: "/chios/chios-museums/chios-maritime-museum/",
    language: "en",
    contentType: "chios-detail",
    category: "museums",
    itemId: "maritime-museum",
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
    path: "/best-beaches-in-chios/",
    language: "en",
    contentType: "landing-page",
    category: "landing",
    itemId: "best-beaches",
    template: "LandingPage",
    action: "KEEP",
    priority: "Medium",
  },
  {
    path: "/family-travel-in-chios/",
    language: "en",
    contentType: "landing-page",
    category: "landing",
    itemId: "family-travel",
    template: "LandingPage",
    action: "KEEP",
    priority: "Medium",
  },
  {
    path: "/10-best-tips-to-explore-chiosvoulamandis-house/",
    language: "en",
    contentType: "landing-page",
    category: "landing",
    itemId: "explore-chios",
    template: "LandingPage",
    action: "KEEP",
    priority: "Medium",
  },
  {
    path: "/taste-lover-chios/",
    language: "en",
    contentType: "landing-page",
    category: "landing",
    itemId: "taste-lover",
    template: "LandingPage",
    action: "KEEP",
    priority: "Medium",
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
];

export type RouteMapItem = RouteRecord;

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