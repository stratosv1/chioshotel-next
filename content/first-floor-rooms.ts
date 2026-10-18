import type { IndividualRoomData, RoomDetailData } from "@/content/room-details";

/* ==========================================================================
   FIRST FLOOR ROOMS 1, 3 & 4 — the "standard double / triple" category pages
   (existing URLs kept: /chios-rooms/standard-double-room/ and translations).

   Owner-confirmed facts (booking_core.rooms / room_features / guest_pricing):
   - All three: first floor, 14 stairs with handrail, no lift, approx. 30–35 m²,
     upper-floor view.
   - Room 1: up to 4 guests, 1 double + 2 single beds, two spaces without a
     connecting door, shared terrace, mini fridge & kettle (no kitchenette).
     3rd and 4th guest +€15 per night each.
   - Room 3: up to 3 guests, 1 double + 1 sofa bed, two spaces without a
     connecting door, kitchenette, shared terrace. 3rd guest +€15.
   - Room 4: up to 3 guests, 1 double + 1 sofa bed, open-plan, kitchenette,
     private balcony. 3rd guest +€15.
   - Kitchenettes: hobs, small oven, kettle, pans, cutlery; no microwave.
   ========================================================================== */

type Lang = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export const firstFloorRoomsPaths: Record<Lang, string> = {
  en: "/chios-rooms/standard-double-room/",
  el: "/el/domatia-xios/diklina-triklina-domatia/",
  fr: "/fr/chambres-a-chios/chambres-doubles-standard/",
  de: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
  it: "/it/stanze-a-chios/camere-doppie-standard-chios/",
  es: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
  tr: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
};

const groundPaths: Record<Lang, string> = {
  en: "/chios-rooms/ground-floor-rooms/",
  el: "/el/domatia-xios/isogeia-domatia/",
  fr: "/fr/chambres-a-chios/chambres-rez-de-chaussee/",
  de: "/de/zimmer-chios/erdgeschoss-zimmer/",
  it: "/it/stanze-a-chios/camere-piano-terra/",
  es: "/es/habitaciones-en-chios/habitaciones-planta-baja/",
  tr: "/tr/chios-odalari/zemin-kat-odalari/",
};

const economyPaths: Record<Lang, string> = {
  en: "/chios-rooms/economy-double-rooms/",
  el: "/el/domatia-xios/oikonomiko-diklino-domatio/",
  fr: "/fr/chambres-a-chios/chambres-doubles-economiques/",
  de: "/de/zimmer-chios/economy-zimmer-auf-chios/",
  it: "/it/stanze-a-chios/camera-doppia-economica-chios/",
  es: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
};

const familyPaths: Record<Lang, string> = {
  en: "/chios-rooms/family-chios-apartments/",
  el: "/el/domatia-xios/oikogeneiako-diamerisma/",
  fr: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
  de: "/de/zimmer-chios/familienapartments-in-chios/",
  it: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
  es: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
  tr: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
};

const roomsIndexPaths: Record<Lang, string> = {
  en: "/chios-rooms/",
  el: "/el/domatia-xios/",
  fr: "/fr/chambres-a-chios/",
  de: "/de/chios-zimmer/",
  it: "/it/camere-a-chios/",
  es: "/es/habitaciones-en-chios/",
  tr: "/tr/sakiz-adasi-odalari/",
};

const bookingPaths: Record<Lang, string> = {
  en: "/chios-hotels-rates/",
  el: "/el/amesi-kratisi-voulamandis-house/",
  fr: "/fr/tarifs-des-hotels-a-chios/",
  de: "/de/hotelpreise-auf-der-insel-chios/",
  it: "/it/prezzi-hotel-chios/",
  es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  tr: "/tr/sakiz-adasi-rezervasyon/",
};

const PHONE_HREF = "tel:+306944764654";
const WHATSAPP_NUMBER = "306944474226";
const HERO_IMAGE = "/images/rooms/DSC07776-2-e1675109942622.webp";

/* English base; badges, beds, amenities and captions are translated by
   RoomDetailPage / the schema builder. Descriptions are localized below. */
const baseRooms: IndividualRoomData[] = [
  {
    id: "room-1",
    name: "Room 1",
    type: "First-floor double / triple",
    location: "First floor",
    maxGuests: 4,
    sizeM2: 32,
    description:
      "Room 1 is approximately 30–35 m² and sleeps up to 4 guests in 1 double and 2 single beds. It has two open connected spaces without an internal door and access to a shared terrace.",
    badges: ["First floor", "Shared terrace", "Two spaces", "Up to 4 guests"],
    beds: ["1 double bed", "2 single beds"],
    amenities: [
      { icon: "❄️", label: "Air conditioning" },
      { icon: "🧊", label: "Fridge" },
      { icon: "💨", label: "Hair dryer" },
      { icon: "🌤️", label: "Shared terrace" },
      { icon: "🚪", label: "Two spaces, no connecting door" },
      { icon: "🌾", label: "Upper-floor view" },
      { icon: "🪜", label: "14 stairs" },
      { icon: "📶", label: "Wi-Fi" },
    ],
    images: [
      { src: "/images/rooms/DSC07776-2-e1675109942622.webp", alt: "First floor room 1 in Chios with stone wall and double bed - Voulamandis House, Kambos", caption: "Bedroom" },
      { src: "/images/rooms/DSC07769-1.webp", alt: "First floor room 1 in Chios - two connected spaces for up to 4 guests - Voulamandis House", caption: "Spacious layout" },
      { src: "/images/rooms/----1-1.webp", alt: "First floor room 1 in Chios - second space with single beds - Voulamandis House", caption: "Two spaces" },
      { src: "/images/rooms/voulamandis-house-bathrooms-1.webp", alt: "First floor room 1 in Chios - renovated private bathroom with shower - Voulamandis House", caption: "Bathroom" },
    ],
  },
  {
    id: "room-3",
    name: "Room 3",
    type: "First-floor double / triple",
    location: "First floor",
    maxGuests: 3,
    sizeM2: 32,
    description:
      "Room 3 is approximately 30–35 m² with 1 double bed and 1 sofa bed for up to 3 guests. It has two connected spaces without an internal door, a kitchenette and access to the shared terrace.",
    badges: ["First floor", "Kitchenette", "Shared terrace", "Up to 3 guests"],
    beds: ["1 double bed", "1 sofa bed"],
    amenities: [
      { icon: "❄️", label: "Air conditioning" },
      { icon: "🧊", label: "Fridge" },
      { icon: "💨", label: "Hair dryer" },
      { icon: "🥣", label: "Kitchenette" },
      { icon: "🌤️", label: "Shared terrace" },
      { icon: "🚪", label: "Two spaces, no connecting door" },
      { icon: "🪜", label: "14 stairs" },
      { icon: "📶", label: "Wi-Fi" },
    ],
    images: [
      { src: "/images/rooms/DSC07867-1.webp", alt: "First floor room 3 in Chios with stone walls and antique furniture - Voulamandis House", caption: "Bedroom" },
      { src: "/images/rooms/DSC07860-1.webp", alt: "First floor room 3 in Chios - bed and traditional stone wall - Voulamandis House", caption: "Stone wall interior" },
      { src: "/images/rooms/DSC07849-1.webp", alt: "First floor room 3 in Chios - kitchenette with hobs, fridge and kettle - Voulamandis House", caption: "Kitchenette" },
      { src: "/images/rooms/DSC07891-1.webp", alt: "First floor room 3 in Chios - private bathroom - Voulamandis House", caption: "Bathroom" },
    ],
  },
  {
    id: "room-4",
    name: "Room 4",
    type: "First-floor double / triple",
    location: "First floor",
    maxGuests: 3,
    sizeM2: 32,
    description:
      "Room 4 is approximately 30–35 m², open-plan, with 1 double bed and 1 sofa bed for up to 3 guests, a kitchenette and its own private balcony.",
    badges: ["First floor", "Private balcony", "Kitchenette", "Up to 3 guests"],
    beds: ["1 double bed", "1 sofa bed"],
    amenities: [
      { icon: "❄️", label: "Air conditioning" },
      { icon: "🧊", label: "Fridge" },
      { icon: "💨", label: "Hair dryer" },
      { icon: "🌤️", label: "Private balcony" },
      { icon: "🥣", label: "Kitchenette" },
      { icon: "📐", label: "Open-plan space" },
      { icon: "🪜", label: "14 stairs" },
      { icon: "📶", label: "Wi-Fi" },
    ],
    images: [
      { src: "/images/rooms/received_1748354861920234.webp", alt: "First floor room 4 in Chios with wooden beams and double bed - Voulamandis House", caption: "Room layout" },
      { src: "/images/rooms/received_1748358935253160.webp", alt: "First floor room 4 in Chios - kitchenette and desk area - Voulamandis House", caption: "Kitchenette area" },
      { src: "/images/rooms/received_1748356725253381.webp", alt: "First floor room 4 in Chios - private bathroom with walk-in shower - Voulamandis House", caption: "Bathroom" },
      { src: "/images/rooms/received_1748356718586715.webp", alt: "First floor room 4 in Chios - view from the bathroom into the bedroom - Voulamandis House", caption: "Room view" },
    ],
  },
];

const galleryImages = [
  HERO_IMAGE,
  "/images/rooms/DSC07769-1.webp",
  "/images/rooms/DSC07867-1.webp",
  "/images/rooms/DSC07849-1.webp",
  "/images/rooms/received_1748354861920234.webp",
  "/images/rooms/voulamandis-house-bathrooms-1.webp",
];

type Copy = {
  seo: { title: string; description: string };
  hero: { kicker: string; title: string; subtitle: string; description: string; imageAlt: string; badges: string[]; bookLabel: string; askLabel: string };
  overview: { kicker: string; title: string; paragraphs: string[]; highlights: { label: string; value: string }[] };
  gallery: { kicker: string; title: string; alts: string[] };
  amenities: { kicker: string; title: string; items: { icon: string; label: string; text: string }[] };
  individual: { kicker: string; title: string; description: string };
  roomDescriptions: [string, string, string];
  comparison: NonNullable<RoomDetailData["comparison"]>;
  bestFor: { kicker: string; title: string; items: string[] };
  booking: { kicker: string; title: string; text: string; phoneLabel: string; whatsappLabel: string; whatsappText: string; note: string };
  faq: { question: string; answer: string }[];
  related: { kicker: string; title: string; ground: [string, string]; economy: [string, string]; family: [string, string]; all: [string, string] };
};

function build(lang: Lang, copy: Copy): RoomDetailData {
  return {
    id: "standard-double-room",
    seo: {
      canonicalPath: firstFloorRoomsPaths[lang],
      title: copy.seo.title,
      description: copy.seo.description,
      ogImage: HERO_IMAGE,
    },
    hero: {
      kicker: copy.hero.kicker,
      title: copy.hero.title,
      subtitle: copy.hero.subtitle,
      description: copy.hero.description,
      image: HERO_IMAGE,
      imageAlt: copy.hero.imageAlt,
      badges: copy.hero.badges,
      primaryCta: { label: copy.hero.bookLabel, href: bookingPaths[lang] },
      secondaryCta: { label: copy.hero.askLabel, href: PHONE_HREF },
    },
    overview: copy.overview,
    gallery: {
      kicker: copy.gallery.kicker,
      title: copy.gallery.title,
      images: galleryImages.map((src, index) => ({ src, alt: copy.gallery.alts[index] ?? copy.hero.imageAlt })),
    },
    amenities: copy.amenities,
    individualRooms: {
      kicker: copy.individual.kicker,
      title: copy.individual.title,
      description: copy.individual.description,
      rooms: baseRooms.map((room, index) => ({ ...room, description: copy.roomDescriptions[index] })),
    },
    comparison: copy.comparison,
    bestFor: copy.bestFor,
    booking: {
      kicker: copy.booking.kicker,
      title: copy.booking.title,
      text: copy.booking.text,
      phoneHref: PHONE_HREF,
      phoneLabel: copy.booking.phoneLabel,
      whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.booking.whatsappText)}`,
      whatsappLabel: copy.booking.whatsappLabel,
      note: copy.booking.note,
    },
    faq: copy.faq,
    related: {
      kicker: copy.related.kicker,
      title: copy.related.title,
      links: [
        { href: groundPaths[lang], title: copy.related.ground[0], text: copy.related.ground[1] },
        { href: economyPaths[lang], title: copy.related.economy[0], text: copy.related.economy[1] },
        { href: familyPaths[lang], title: copy.related.family[0], text: copy.related.family[1] },
        { href: roomsIndexPaths[lang], title: copy.related.all[0], text: copy.related.all[1] },
      ],
    },
  };
}

/* ------------------------------------------------------------------ EN -- */

export const firstFloorRoomsEn = build("en", {
  seo: {
    title: "First Floor Double & Triple Rooms in Chios | Voulamandis House",
    description:
      "First floor rooms 1, 3 & 4 in Kambos, Chios: 30–35 m², up to 4 guests, terrace or private balcony, kitchenette in rooms 3 & 4. Book direct and save 10%.",
  },
  hero: {
    kicker: "First floor rooms in Chios",
    title: "First floor double & triple rooms",
    subtitle: "Rooms 1, 3 & 4 · terrace or balcony · up to 4 guests",
    description:
      "Bright upstairs rooms in our historic Kambos estate, with stone walls, views over the citrus orchards and a shared terrace or private balcony. Rooms 3 and 4 also have their own kitchenette.",
    imageAlt: "First floor double room with stone wall and garden-facing window at Voulamandis House, Kambos, Chios",
    badges: ["First floor", "Terrace or balcony", "30–35 m²", "Up to 4 guests"],
    bookLabel: "Book direct",
    askLabel: "Ask availability",
  },
  overview: {
    kicker: "At a glance",
    title: "Upstairs rooms with space, light and a terrace",
    paragraphs: [
      "Rooms 1, 3 and 4 are the double / triple rooms on the first floor of Voulamandis House. They are reached by 14 stairs with a handrail and look out over the estate and the Kambos orchards.",
      "Each room is about 30–35 m² with traditional Chian stone, a private bathroom with shower and room for a third guest. Room 1 takes up to 4 guests in two connected spaces; Rooms 3 and 4 add a kitchenette, and Room 4 has its own private balcony.",
      "They suit couples who want more space than an economy room, friends travelling together and families with one or two children who are happy with a flight of stairs.",
    ],
    highlights: [
      { label: "Guests", value: "2–4" },
      { label: "Size", value: "30–35 m²" },
      { label: "Access", value: "14 stairs" },
      { label: "Outside", value: "Terrace or balcony" },
    ],
  },
  gallery: {
    kicker: "Photos",
    title: "Inside the first floor rooms",
    alts: [
      "First floor room 1 at Voulamandis House in Chios with stone wall",
      "Two connected spaces in first floor room 1 in Kambos, Chios",
      "First floor room 3 with antique furniture and stone walls in Chios",
      "Kitchenette in first floor room 3 at Voulamandis House",
      "First floor room 4 with wooden beams in Chios",
      "Renovated private bathroom in a first floor room in Chios",
    ],
  },
  amenities: {
    kicker: "In every room",
    title: "What the first floor rooms include",
    items: [
      { icon: "🌤️", label: "Terrace or balcony", text: "Shared terrace for Rooms 1 & 3, private balcony in Room 4." },
      { icon: "🥣", label: "Kitchenette", text: "In Rooms 3 & 4: hobs, small oven, pans and cutlery." },
      { icon: "❄️", label: "Air conditioning", text: "Plus heating for spring and autumn." },
      { icon: "📶", label: "Free WiFi", text: "Throughout the house." },
      { icon: "📺", label: "Smart TV", text: "With apps such as Netflix and YouTube." },
      { icon: "🧊", label: "Mini fridge & kettle", text: "Complimentary coffee and tea, replenished daily." },
      { icon: "🚿", label: "Private bathroom", text: "Shower, hairdryer and toiletries." },
      { icon: "🧳", label: "Luggage help", text: "We carry your bags upstairs on request." },
    ],
  },
  individual: {
    kicker: "Choose your room",
    title: "Room 1, Room 3 and Room 4",
    description:
      "All three rooms are on the first floor, about 30–35 m². Room 1 is the one for 4 guests, Room 3 adds a kitchenette and Room 4 combines a kitchenette with a private balcony.",
  },
  roomDescriptions: [
    "Room 1 is approximately 30–35 m² and sleeps up to 4 guests in 1 double and 2 single beds. It has two open connected spaces without an internal door and access to a shared terrace.",
    "Room 3 is approximately 30–35 m² with 1 double bed and 1 sofa bed for up to 3 guests. It has two connected spaces without an internal door, a kitchenette and access to the shared terrace.",
    "Room 4 is approximately 30–35 m², open-plan, with 1 double bed and 1 sofa bed for up to 3 guests, a kitchenette and its own private balcony.",
  ],
  comparison: {
    kicker: "Side by side",
    title: "Room 1, Room 3 or Room 4?",
    note: "Online booking reserves the first floor category; if you prefer a specific room, tell us and we will confirm it in writing when available.",
    columns: ["Room 1", "Room 3", "Room 4"],
    rows: [
      { label: "Max guests", values: ["4", "3", "3"] },
      { label: "Beds", values: ["1 double + 2 single", "1 double + 1 sofa bed", "1 double + 1 sofa bed"] },
      { label: "Layout", values: ["2 spaces, no door", "2 spaces, no door", "Open-plan"] },
      { label: "Kitchen", values: ["Mini fridge & kettle", "Kitchenette", "Kitchenette"] },
      { label: "Outside", values: ["Shared terrace", "Shared terrace", "Private balcony"] },
      { label: "Extra guests", values: ["+€15 each (3rd, 4th)", "+€15 (3rd)", "+€15 (3rd)"] },
    ],
  },
  bestFor: {
    kicker: "Best for",
    title: "Who will love the first floor rooms?",
    items: [
      "Families or friends of four who want one room together (Room 1).",
      "Guests who like to prepare breakfast or a light meal (Rooms 3 & 4).",
      "Couples who want a private balcony and more space (Room 4).",
      "Anyone who prefers an upstairs room with more light and views over the estate.",
    ],
  },
  booking: {
    kicker: "Direct booking",
    title: "Want a first floor room for your dates?",
    text: "Book the first floor category online with the WELCOME10 code, or message us with your dates and number of guests and we will check Rooms 1, 3 and 4 for you.",
    phoneLabel: "Call us",
    whatsappLabel: "WhatsApp",
    whatsappText: "Hello! I would like a first floor room (Room 1, 3 or 4) at Voulamandis House. My dates are:",
    note: "Direct bookings get 10% off with code WELCOME10. Breakfast is optional (€12 per adult per day).",
  },
  faq: [
    {
      question: "How many stairs are there to the first floor rooms?",
      answer:
        "Rooms 1, 3 and 4 are reached by 14 stairs with a handrail; there is no lift. We help with luggage on request. If you prefer no stairs, see our ground floor rooms 5 and 7.",
    },
    {
      question: "Which first floor room is best for 4 guests?",
      answer:
        "Room 1. It sleeps up to 4 guests in 1 double and 2 single beds, arranged in two connected spaces without an internal door. The 3rd and 4th guest are charged €15 per night each.",
    },
    {
      question: "Which rooms have a kitchenette?",
      answer:
        "Rooms 3 and 4, at no extra charge. The kitchenette has hobs, a small oven, kettle, pans and cutlery; there is no microwave. Room 1 has a mini fridge and kettle.",
    },
    {
      question: "Do the first floor rooms have a balcony or terrace?",
      answer:
        "Room 4 has its own private balcony. Rooms 1 and 3 have access to a shared terrace with views over the estate.",
    },
    {
      question: "Can I book a specific first floor room?",
      answer:
        "The online system books the first floor room category. If you want Room 1, 3 or 4 specifically, tell us after booking or ask through the AI Room Finder; we confirm the room in writing when it is available.",
    },
    {
      question: "Is there a cheaper room upstairs?",
      answer:
        "Yes. Economy Room 2 is also on the first floor with access to the shared terrace. It is smaller (about 16 m²) and sleeps 2 guests in one double bed.",
    },
  ],
  related: {
    kicker: "Other options",
    title: "Compare with our other rooms",
    ground: ["Ground floor rooms", "Rooms 5 & 7, no stairs, straight onto the courtyard and garden."],
    economy: ["Economy double rooms", "Rooms 2 & 6, 16 m², the best value for two."],
    family: ["Family apartments", "Apartments 8–10 with separate bedroom and full kitchen."],
    all: ["All rooms & apartments", "Compare every category with live prices."],
  },
});

/* ------------------------------------------------------------------ EL -- */

export const firstFloorRoomsEl = build("el", {
  seo: {
    title: "Δίκλινα & Τρίκλινα Δωμάτια Ορόφου στη Χίο | Voulamandis House",
    description:
      "Δωμάτια ορόφου 1, 3 & 4 στον Κάμπο Χίου: 30–35 m², έως 4 άτομα, βεράντα ή ιδιωτικό μπαλκόνι, μικρή κουζίνα στα 3 & 4. Κλείστε απευθείας με 10% έκπτωση.",
  },
  hero: {
    kicker: "Δωμάτια ορόφου στη Χίο",
    title: "Δίκλινα & τρίκλινα δωμάτια ορόφου",
    subtitle: "Δωμάτια 1, 3 & 4 · βεράντα ή μπαλκόνι · έως 4 άτομα",
    description:
      "Φωτεινά δωμάτια στον πρώτο όροφο του ιστορικού μας κτήματος στον Κάμπο, με πέτρινους τοίχους, θέα στους κήπους με τα εσπεριδοειδή και κοινόχρηστη βεράντα ή ιδιωτικό μπαλκόνι. Τα Δωμάτια 3 και 4 έχουν και δική τους μικρή κουζίνα.",
    imageAlt: "Δίκλινο δωμάτιο ορόφου με πέτρινο τοίχο και παράθυρο στο Voulamandis House, Κάμπος Χίου",
    badges: ["Πρώτος όροφος", "Βεράντα ή μπαλκόνι", "30–35 m²", "Έως 4 άτομα"],
    bookLabel: "Απευθείας κράτηση",
    askLabel: "Ρωτήστε διαθεσιμότητα",
  },
  overview: {
    kicker: "Με μια ματιά",
    title: "Δωμάτια ορόφου με χώρο, φως και βεράντα",
    paragraphs: [
      "Τα Δωμάτια 1, 3 και 4 είναι τα δίκλινα / τρίκλινα του πρώτου ορόφου στο Voulamandis House. Ανεβαίνετε 14 σκαλιά με κουπαστή και η θέα ανοίγει πάνω από το κτήμα και τους κήπους του Κάμπου.",
      "Κάθε δωμάτιο έχει περίπου 30–35 m², παραδοσιακή χιώτικη πέτρα, ιδιωτικό μπάνιο με ντους και χώρο για τρίτο άτομο. Το Δωμάτιο 1 φιλοξενεί έως 4 άτομα σε δύο ενωμένους χώρους· τα Δωμάτια 3 και 4 έχουν μικρή κουζίνα και το Δωμάτιο 4 δικό του ιδιωτικό μπαλκόνι.",
      "Ταιριάζουν σε ζευγάρια που θέλουν περισσότερο χώρο από ένα οικονομικό δωμάτιο, σε παρέες φίλων και σε οικογένειες με ένα ή δύο παιδιά που δεν τις πειράζουν οι σκάλες.",
    ],
    highlights: [
      { label: "Άτομα", value: "2–4" },
      { label: "Εμβαδόν", value: "30–35 m²" },
      { label: "Πρόσβαση", value: "14 σκαλιά" },
      { label: "Έξω", value: "Βεράντα ή μπαλκόνι" },
    ],
  },
  gallery: {
    kicker: "Φωτογραφίες",
    title: "Μέσα στα δωμάτια ορόφου",
    alts: [
      "Δωμάτιο 1 ορόφου στο Voulamandis House στη Χίο με πέτρινο τοίχο",
      "Δύο ενωμένοι χώροι στο Δωμάτιο 1 στον Κάμπο Χίου",
      "Δωμάτιο 3 ορόφου με αντίκες και πέτρινους τοίχους στη Χίο",
      "Μικρή κουζίνα στο Δωμάτιο 3 του Voulamandis House",
      "Δωμάτιο 4 ορόφου με ξύλινα δοκάρια στη Χίο",
      "Ανακαινισμένο ιδιωτικό μπάνιο σε δωμάτιο ορόφου στη Χίο",
    ],
  },
  amenities: {
    kicker: "Σε κάθε δωμάτιο",
    title: "Τι περιλαμβάνουν τα δωμάτια ορόφου",
    items: [
      { icon: "🌤️", label: "Βεράντα ή μπαλκόνι", text: "Κοινόχρηστη βεράντα για τα 1 & 3, ιδιωτικό μπαλκόνι στο 4." },
      { icon: "🥣", label: "Μικρή κουζίνα", text: "Στα Δωμάτια 3 & 4: εστίες, φουρνάκι, σκεύη και μαχαιροπίρουνα." },
      { icon: "❄️", label: "Κλιματισμός", text: "Και θέρμανση για άνοιξη και φθινόπωρο." },
      { icon: "📶", label: "Δωρεάν WiFi", text: "Σε όλο το σπίτι." },
      { icon: "📺", label: "Smart TV", text: "Με εφαρμογές όπως Netflix και YouTube." },
      { icon: "🧊", label: "Ψυγειάκι & βραστήρας", text: "Δωρεάν καφές και τσάι, ανανεώνονται καθημερινά." },
      { icon: "🚿", label: "Ιδιωτικό μπάνιο", text: "Ντους, πιστολάκι μαλλιών και είδη περιποίησης." },
      { icon: "🧳", label: "Βοήθεια με αποσκευές", text: "Ανεβάζουμε τις βαλίτσες σας αν το ζητήσετε." },
    ],
  },
  individual: {
    kicker: "Επιλέξτε δωμάτιο",
    title: "Δωμάτιο 1, Δωμάτιο 3 και Δωμάτιο 4",
    description:
      "Και τα τρία βρίσκονται στον πρώτο όροφο, με περίπου 30–35 m². Το Δωμάτιο 1 είναι για 4 άτομα, το Δωμάτιο 3 έχει μικρή κουζίνα και το Δωμάτιο 4 συνδυάζει μικρή κουζίνα με ιδιωτικό μπαλκόνι.",
  },
  roomDescriptions: [
    "Το Δωμάτιο 1 έχει περίπου 30–35 m² και φιλοξενεί έως 4 άτομα σε 1 διπλό και 2 μονά κρεβάτια. Έχει δύο ενωμένους χώρους χωρίς ενδιάμεση πόρτα και πρόσβαση σε κοινόχρηστη βεράντα.",
    "Το Δωμάτιο 3 έχει περίπου 30–35 m² με 1 διπλό κρεβάτι και 1 καναπέ-κρεβάτι για έως 3 άτομα. Έχει δύο ενωμένους χώρους χωρίς ενδιάμεση πόρτα, μικρή κουζίνα και πρόσβαση στην κοινόχρηστη βεράντα.",
    "Το Δωμάτιο 4 έχει περίπου 30–35 m², ενιαίο χώρο με 1 διπλό κρεβάτι και 1 καναπέ-κρεβάτι για έως 3 άτομα, μικρή κουζίνα και δικό του ιδιωτικό μπαλκόνι.",
  ],
  comparison: {
    kicker: "Δίπλα-δίπλα",
    title: "Δωμάτιο 1, 3 ή 4;",
    note: "Η online κράτηση δεσμεύει την κατηγορία ορόφου. Αν προτιμάτε συγκεκριμένο δωμάτιο, πείτε μας και θα το επιβεβαιώσουμε γραπτώς εφόσον είναι διαθέσιμο.",
    columns: ["Δωμάτιο 1", "Δωμάτιο 3", "Δωμάτιο 4"],
    rows: [
      { label: "Μέγ. άτομα", values: ["4", "3", "3"] },
      { label: "Κρεβάτια", values: ["1 διπλό + 2 μονά", "1 διπλό + 1 καναπές-κρεβάτι", "1 διπλό + 1 καναπές-κρεβάτι"] },
      { label: "Διαρρύθμιση", values: ["2 χώροι, χωρίς πόρτα", "2 χώροι, χωρίς πόρτα", "Ενιαίος χώρος"] },
      { label: "Κουζίνα", values: ["Ψυγειάκι & βραστήρας", "Μικρή κουζίνα", "Μικρή κουζίνα"] },
      { label: "Έξω", values: ["Κοινόχρηστη βεράντα", "Κοινόχρηστη βεράντα", "Ιδιωτικό μπαλκόνι"] },
      { label: "Επιπλέον άτομα", values: ["+15 € το καθένα (3ο, 4ο)", "+15 € (3ο)", "+15 € (3ο)"] },
    ],
  },
  bestFor: {
    kicker: "Ιδανικά για",
    title: "Σε ποιους ταιριάζουν τα δωμάτια ορόφου;",
    items: [
      "Σε οικογένειες ή παρέες τεσσάρων που θέλουν ένα δωμάτιο μαζί (Δωμάτιο 1).",
      "Σε όσους θέλουν να ετοιμάζουν πρωινό ή ένα ελαφρύ γεύμα (Δωμάτια 3 & 4).",
      "Σε ζευγάρια που θέλουν ιδιωτικό μπαλκόνι και περισσότερο χώρο (Δωμάτιο 4).",
      "Σε όποιον προτιμά δωμάτιο στον όροφο, με περισσότερο φως και θέα στο κτήμα.",
    ],
  },
  booking: {
    kicker: "Απευθείας κράτηση",
    title: "Θέλετε δωμάτιο ορόφου για τις ημερομηνίες σας;",
    text: "Κλείστε online την κατηγορία ορόφου με τον κωδικό WELCOME10 ή στείλτε μας ημερομηνίες και αριθμό ατόμων και θα ελέγξουμε για εσάς τα Δωμάτια 1, 3 και 4.",
    phoneLabel: "Καλέστε μας",
    whatsappLabel: "WhatsApp",
    whatsappText: "Γεια σας! Θα ήθελα δωμάτιο ορόφου (1, 3 ή 4) στο Voulamandis House. Οι ημερομηνίες μου είναι:",
    note: "Οι απευθείας κρατήσεις έχουν 10% έκπτωση με τον κωδικό WELCOME10. Το πρωινό είναι προαιρετικό (12 € ανά ενήλικα την ημέρα).",
  },
  faq: [
    {
      question: "Πόσα σκαλιά έχουν τα δωμάτια ορόφου;",
      answer:
        "Στα Δωμάτια 1, 3 και 4 ανεβαίνετε 14 σκαλιά με κουπαστή· δεν υπάρχει ασανσέρ. Βοηθάμε με τις αποσκευές κατόπιν αιτήματος. Αν προτιμάτε χωρίς σκάλες, δείτε τα ισόγεια Δωμάτια 5 και 7.",
    },
    {
      question: "Ποιο δωμάτιο ορόφου είναι καλύτερο για 4 άτομα;",
      answer:
        "Το Δωμάτιο 1. Φιλοξενεί έως 4 άτομα σε 1 διπλό και 2 μονά κρεβάτια, σε δύο ενωμένους χώρους χωρίς ενδιάμεση πόρτα. Το 3ο και το 4ο άτομο χρεώνονται 15 € τη βραδιά το καθένα.",
    },
    {
      question: "Ποια δωμάτια έχουν μικρή κουζίνα;",
      answer:
        "Τα Δωμάτια 3 και 4, χωρίς επιπλέον χρέωση. Η κουζίνα έχει εστίες, φουρνάκι, βραστήρα, σκεύη και μαχαιροπίρουνα· δεν υπάρχει φούρνος μικροκυμάτων. Το Δωμάτιο 1 έχει ψυγειάκι και βραστήρα.",
    },
    {
      question: "Έχουν μπαλκόνι ή βεράντα τα δωμάτια ορόφου;",
      answer:
        "Το Δωμάτιο 4 έχει δικό του ιδιωτικό μπαλκόνι. Τα Δωμάτια 1 και 3 έχουν πρόσβαση σε κοινόχρηστη βεράντα με θέα στο κτήμα.",
    },
    {
      question: "Μπορώ να κλείσω συγκεκριμένο δωμάτιο ορόφου;",
      answer:
        "Το online σύστημα κρατά την κατηγορία ορόφου. Αν θέλετε συγκεκριμένα το Δωμάτιο 1, 3 ή 4, ενημερώστε μας μετά την κράτηση ή ζητήστε το μέσω του AI Room Finder· το επιβεβαιώνουμε γραπτώς όταν είναι διαθέσιμο.",
    },
    {
      question: "Υπάρχει πιο οικονομικό δωμάτιο στον όροφο;",
      answer:
        "Ναι. Το οικονομικό Δωμάτιο 2 βρίσκεται επίσης στον πρώτο όροφο με πρόσβαση στην κοινόχρηστη βεράντα. Είναι μικρότερο (περίπου 16 m²) και φιλοξενεί 2 άτομα σε ένα διπλό κρεβάτι.",
    },
  ],
  related: {
    kicker: "Άλλες επιλογές",
    title: "Συγκρίνετε με τα υπόλοιπα δωμάτια",
    ground: ["Ισόγεια δωμάτια", "Δωμάτια 5 & 7, χωρίς σκάλες, κατευθείαν στην αυλή και στον κήπο."],
    economy: ["Οικονομικά δίκλινα", "Δωμάτια 2 & 6, 16 m², η πιο οικονομική επιλογή για δύο."],
    family: ["Οικογενειακά διαμερίσματα", "Διαμερίσματα 8–10 με ξεχωριστό υπνοδωμάτιο και πλήρη κουζίνα."],
    all: ["Όλα τα δωμάτια & διαμερίσματα", "Συγκρίνετε όλες τις κατηγορίες με ζωντανές τιμές."],
  },
});

/* ------------------------------------------------------------------ FR -- */

export const firstFloorRoomsFr = build("fr", {
  seo: {
    title: "Chambres doubles et triples à l’étage à Chios | Voulamandis House",
    description:
      "Chambres 1, 3 et 4 à l’étage à Kambos, Chios : 30–35 m², jusqu’à 4 personnes, terrasse ou balcon privé, kitchenette dans les chambres 3 et 4. -10 % en direct.",
  },
  hero: {
    kicker: "Chambres à l’étage à Chios",
    title: "Chambres doubles et triples à l’étage",
    subtitle: "Chambres 1, 3 et 4 · terrasse ou balcon · jusqu’à 4 personnes",
    description:
      "Des chambres lumineuses à l’étage de notre domaine historique de Kambos, avec murs en pierre, vue sur les vergers d’agrumes et terrasse partagée ou balcon privé. Les chambres 3 et 4 ont aussi leur kitchenette.",
    imageAlt: "Chambre double à l’étage avec mur en pierre et fenêtre à Voulamandis House, Kambos, Chios",
    badges: ["Premier étage", "Terrasse ou balcon", "30–35 m²", "Jusqu’à 4 personnes"],
    bookLabel: "Réserver en direct",
    askLabel: "Demander les disponibilités",
  },
  overview: {
    kicker: "En bref",
    title: "Des chambres à l’étage, spacieuses et lumineuses",
    paragraphs: [
      "Les chambres 1, 3 et 4 sont les chambres doubles / triples du premier étage de Voulamandis House. On y accède par 14 marches avec rampe, et la vue s’ouvre sur le domaine et les vergers de Kambos.",
      "Chaque chambre fait environ 30–35 m², avec pierre de Chios traditionnelle, salle de bain privée avec douche et place pour une troisième personne. La chambre 1 accueille jusqu’à 4 personnes dans deux espaces communicants ; les chambres 3 et 4 ont une kitchenette et la chambre 4 un balcon privé.",
      "Elles conviennent aux couples qui veulent plus d’espace qu’une chambre économique, aux groupes d’amis et aux familles avec un ou deux enfants à l’aise avec les escaliers.",
    ],
    highlights: [
      { label: "Personnes", value: "2–4" },
      { label: "Surface", value: "30–35 m²" },
      { label: "Accès", value: "14 marches" },
      { label: "Extérieur", value: "Terrasse ou balcon" },
    ],
  },
  gallery: {
    kicker: "Photos",
    title: "À l’intérieur des chambres à l’étage",
    alts: [
      "Chambre 1 à l’étage de Voulamandis House à Chios avec mur en pierre",
      "Deux espaces communicants dans la chambre 1 à Kambos, Chios",
      "Chambre 3 à l’étage avec meubles anciens et murs en pierre",
      "Kitchenette de la chambre 3 à Voulamandis House",
      "Chambre 4 à l’étage avec poutres en bois à Chios",
      "Salle de bain privée rénovée dans une chambre à l’étage",
    ],
  },
  amenities: {
    kicker: "Dans chaque chambre",
    title: "Ce que comprennent les chambres à l’étage",
    items: [
      { icon: "🌤️", label: "Terrasse ou balcon", text: "Terrasse partagée pour les chambres 1 et 3, balcon privé pour la 4." },
      { icon: "🥣", label: "Kitchenette", text: "Chambres 3 et 4 : plaques, petit four, casseroles et couverts." },
      { icon: "❄️", label: "Climatisation", text: "Et chauffage au printemps et en automne." },
      { icon: "📶", label: "WiFi gratuit", text: "Dans toute la maison." },
      { icon: "📺", label: "Smart TV", text: "Avec Netflix, YouTube et autres applis." },
      { icon: "🧊", label: "Mini-frigo & bouilloire", text: "Café et thé offerts, renouvelés chaque jour." },
      { icon: "🚿", label: "Salle de bain privée", text: "Douche, sèche-cheveux et produits d’accueil." },
      { icon: "🧳", label: "Aide aux bagages", text: "Nous montons vos valises sur demande." },
    ],
  },
  individual: {
    kicker: "Choisissez votre chambre",
    title: "Chambre 1, chambre 3 et chambre 4",
    description:
      "Les trois chambres sont au premier étage, d’environ 30–35 m². La chambre 1 est celle pour 4 personnes, la 3 ajoute une kitchenette et la 4 associe kitchenette et balcon privé.",
  },
  roomDescriptions: [
    "La chambre 1 fait environ 30–35 m² et accueille jusqu’à 4 personnes avec 1 lit double et 2 lits simples, dans deux espaces communicants sans porte intérieure, avec accès à une terrasse partagée.",
    "La chambre 3 fait environ 30–35 m² avec 1 lit double et 1 canapé-lit pour jusqu’à 3 personnes, deux espaces communicants sans porte, une kitchenette et l’accès à la terrasse partagée.",
    "La chambre 4 fait environ 30–35 m², en espace ouvert, avec 1 lit double et 1 canapé-lit pour jusqu’à 3 personnes, une kitchenette et son propre balcon privé.",
  ],
  comparison: {
    kicker: "Côte à côte",
    title: "Chambre 1, 3 ou 4 ?",
    note: "La réservation en ligne bloque la catégorie à l’étage ; si vous préférez une chambre précise, dites-le-nous et nous la confirmerons par écrit si elle est disponible.",
    columns: ["Chambre 1", "Chambre 3", "Chambre 4"],
    rows: [
      { label: "Personnes max.", values: ["4", "3", "3"] },
      { label: "Lits", values: ["1 double + 2 simples", "1 double + 1 canapé-lit", "1 double + 1 canapé-lit"] },
      { label: "Agencement", values: ["2 espaces, sans porte", "2 espaces, sans porte", "Espace ouvert"] },
      { label: "Cuisine", values: ["Mini-frigo & bouilloire", "Kitchenette", "Kitchenette"] },
      { label: "Extérieur", values: ["Terrasse partagée", "Terrasse partagée", "Balcon privé"] },
      { label: "Pers. supplémentaires", values: ["+15 € chacune (3e, 4e)", "+15 € (3e)", "+15 € (3e)"] },
    ],
  },
  bestFor: {
    kicker: "Idéal pour",
    title: "À qui conviennent les chambres à l’étage ?",
    items: [
      "Aux familles ou amis à quatre qui veulent une seule chambre (chambre 1).",
      "À ceux qui aiment préparer le petit-déjeuner ou un repas léger (chambres 3 et 4).",
      "Aux couples qui veulent un balcon privé et plus d’espace (chambre 4).",
      "À tous ceux qui préfèrent une chambre à l’étage, plus lumineuse, avec vue sur le domaine.",
    ],
  },
  booking: {
    kicker: "Réservation directe",
    title: "Une chambre à l’étage pour vos dates ?",
    text: "Réservez la catégorie à l’étage en ligne avec le code WELCOME10, ou envoyez-nous vos dates et le nombre de personnes et nous vérifierons les chambres 1, 3 et 4.",
    phoneLabel: "Appelez-nous",
    whatsappLabel: "WhatsApp",
    whatsappText: "Bonjour ! Je souhaite une chambre à l’étage (1, 3 ou 4) à Voulamandis House. Mes dates sont :",
    note: "Les réservations directes bénéficient de 10 % de réduction avec le code WELCOME10. Petit-déjeuner en option (12 € par adulte et par jour).",
  },
  faq: [
    {
      question: "Combien de marches pour accéder aux chambres à l’étage ?",
      answer:
        "Les chambres 1, 3 et 4 sont accessibles par 14 marches avec rampe ; il n’y a pas d’ascenseur. Aide aux bagages sur demande. Si vous préférez éviter les escaliers, voyez nos chambres 5 et 7 au rez-de-chaussée.",
    },
    {
      question: "Quelle chambre à l’étage pour 4 personnes ?",
      answer:
        "La chambre 1. Elle accueille jusqu’à 4 personnes avec 1 lit double et 2 lits simples, dans deux espaces communicants sans porte intérieure. Les 3e et 4e personnes coûtent 15 € par nuit chacune.",
    },
    {
      question: "Quelles chambres ont une kitchenette ?",
      answer:
        "Les chambres 3 et 4, sans supplément. La kitchenette comprend plaques, petit four, bouilloire, casseroles et couverts ; pas de micro-ondes. La chambre 1 a un mini-frigo et une bouilloire.",
    },
    {
      question: "Les chambres à l’étage ont-elles un balcon ou une terrasse ?",
      answer:
        "La chambre 4 a son propre balcon privé. Les chambres 1 et 3 ont accès à une terrasse partagée avec vue sur le domaine.",
    },
    {
      question: "Puis-je réserver une chambre précise à l’étage ?",
      answer:
        "Le système en ligne réserve la catégorie à l’étage. Si vous voulez spécifiquement la chambre 1, 3 ou 4, indiquez-le après la réservation ou via l’AI Room Finder ; nous la confirmons par écrit si elle est disponible.",
    },
    {
      question: "Existe-t-il une chambre moins chère à l’étage ?",
      answer:
        "Oui. La chambre économique 2 est aussi au premier étage, avec accès à la terrasse partagée. Elle est plus petite (environ 16 m²) et accueille 2 personnes dans un lit double.",
    },
  ],
  related: {
    kicker: "Autres options",
    title: "Comparez avec nos autres chambres",
    ground: ["Chambres au rez-de-chaussée", "Chambres 5 et 7, sans escalier, directement sur la cour et le jardin."],
    economy: ["Chambres doubles économiques", "Chambres 2 et 6, 16 m², le meilleur prix pour deux."],
    family: ["Appartements familiaux", "Appartements 8–10 avec chambre séparée et cuisine complète."],
    all: ["Toutes les chambres", "Comparez toutes les catégories avec les prix en direct."],
  },
});

/* ------------------------------------------------------------------ DE -- */

export const firstFloorRoomsDe = build("de", {
  seo: {
    title: "Doppel- und Dreibettzimmer im Obergeschoss auf Chios | Voulamandis House",
    description:
      "Zimmer 1, 3 & 4 im Obergeschoss in Kambos, Chios: 30–35 m², bis 4 Gäste, Terrasse oder Privatbalkon, Kochnische in Zimmer 3 & 4. Direkt buchen, 10 % sparen.",
  },
  hero: {
    kicker: "Zimmer im Obergeschoss auf Chios",
    title: "Doppel- & Dreibettzimmer im Obergeschoss",
    subtitle: "Zimmer 1, 3 & 4 · Terrasse oder Balkon · bis 4 Gäste",
    description:
      "Helle Zimmer im Obergeschoss unseres historischen Anwesens in Kambos, mit Steinwänden, Blick über die Zitrusgärten und Gemeinschaftsterrasse oder Privatbalkon. Zimmer 3 und 4 haben zudem eine eigene Kochnische.",
    imageAlt: "Doppelzimmer im Obergeschoss mit Steinwand und Fenster im Voulamandis House, Kambos, Chios",
    badges: ["Obergeschoss", "Terrasse oder Balkon", "30–35 m²", "Bis 4 Gäste"],
    bookLabel: "Direkt buchen",
    askLabel: "Verfügbarkeit anfragen",
  },
  overview: {
    kicker: "Auf einen Blick",
    title: "Zimmer im Obergeschoss mit Platz, Licht und Terrasse",
    paragraphs: [
      "Die Zimmer 1, 3 und 4 sind die Doppel- / Dreibettzimmer im Obergeschoss des Voulamandis House. Sie erreichen sie über 14 Stufen mit Handlauf, der Blick reicht über das Anwesen und die Gärten von Kambos.",
      "Jedes Zimmer hat ca. 30–35 m², traditionellen Chios-Stein, ein eigenes Bad mit Dusche und Platz für eine dritte Person. Zimmer 1 bietet bis zu 4 Gästen zwei verbundene Bereiche; Zimmer 3 und 4 haben eine Kochnische, Zimmer 4 zudem einen privaten Balkon.",
      "Ideal für Paare, die mehr Platz als im Economy-Zimmer möchten, für Freunde und für Familien mit ein oder zwei Kindern, denen eine Treppe nichts ausmacht.",
    ],
    highlights: [
      { label: "Gäste", value: "2–4" },
      { label: "Größe", value: "30–35 m²" },
      { label: "Zugang", value: "14 Stufen" },
      { label: "Draußen", value: "Terrasse oder Balkon" },
    ],
  },
  gallery: {
    kicker: "Fotos",
    title: "Einblick in die Zimmer im Obergeschoss",
    alts: [
      "Zimmer 1 im Obergeschoss des Voulamandis House auf Chios mit Steinwand",
      "Zwei verbundene Bereiche in Zimmer 1 in Kambos, Chios",
      "Zimmer 3 im Obergeschoss mit antiken Möbeln und Steinwänden",
      "Kochnische in Zimmer 3 im Voulamandis House",
      "Zimmer 4 im Obergeschoss mit Holzbalken auf Chios",
      "Renoviertes eigenes Bad in einem Zimmer im Obergeschoss",
    ],
  },
  amenities: {
    kicker: "In jedem Zimmer",
    title: "Ausstattung der Zimmer im Obergeschoss",
    items: [
      { icon: "🌤️", label: "Terrasse oder Balkon", text: "Gemeinschaftsterrasse für Zimmer 1 & 3, Privatbalkon in Zimmer 4." },
      { icon: "🥣", label: "Kochnische", text: "In Zimmer 3 & 4: Kochfeld, kleiner Ofen, Töpfe und Besteck." },
      { icon: "❄️", label: "Klimaanlage", text: "Dazu Heizung für Frühling und Herbst." },
      { icon: "📶", label: "Kostenloses WLAN", text: "Im ganzen Haus." },
      { icon: "📺", label: "Smart-TV", text: "Mit Apps wie Netflix und YouTube." },
      { icon: "🧊", label: "Minikühlschrank & Wasserkocher", text: "Kaffee und Tee gratis, täglich aufgefüllt." },
      { icon: "🚿", label: "Eigenes Bad", text: "Dusche, Föhn und Pflegeprodukte." },
      { icon: "🧳", label: "Gepäckhilfe", text: "Wir tragen Ihr Gepäck auf Wunsch nach oben." },
    ],
  },
  individual: {
    kicker: "Ihr Zimmer wählen",
    title: "Zimmer 1, Zimmer 3 und Zimmer 4",
    description:
      "Alle drei Zimmer liegen im Obergeschoss und haben ca. 30–35 m². Zimmer 1 ist das Zimmer für 4 Gäste, Zimmer 3 hat eine Kochnische, Zimmer 4 kombiniert Kochnische und Privatbalkon.",
  },
  roomDescriptions: [
    "Zimmer 1 hat ca. 30–35 m² und bietet bis zu 4 Gästen 1 Doppelbett und 2 Einzelbetten in zwei verbundenen Bereichen ohne Innentür, mit Zugang zu einer Gemeinschaftsterrasse.",
    "Zimmer 3 hat ca. 30–35 m² mit 1 Doppelbett und 1 Schlafsofa für bis zu 3 Gäste, zwei verbundenen Bereichen ohne Tür, Kochnische und Zugang zur Gemeinschaftsterrasse.",
    "Zimmer 4 hat ca. 30–35 m², einen offenen Grundriss mit 1 Doppelbett und 1 Schlafsofa für bis zu 3 Gäste, eine Kochnische und einen eigenen Privatbalkon.",
  ],
  comparison: {
    kicker: "Im Vergleich",
    title: "Zimmer 1, 3 oder 4?",
    note: "Online wird die Kategorie Obergeschoss gebucht. Wenn Sie ein bestimmtes Zimmer bevorzugen, sagen Sie es uns – wir bestätigen es schriftlich, sofern verfügbar.",
    columns: ["Zimmer 1", "Zimmer 3", "Zimmer 4"],
    rows: [
      { label: "Max. Gäste", values: ["4", "3", "3"] },
      { label: "Betten", values: ["1 Doppel- + 2 Einzelbetten", "1 Doppelbett + 1 Schlafsofa", "1 Doppelbett + 1 Schlafsofa"] },
      { label: "Grundriss", values: ["2 Bereiche, ohne Tür", "2 Bereiche, ohne Tür", "Offen"] },
      { label: "Küche", values: ["Minikühlschrank & Wasserkocher", "Kochnische", "Kochnische"] },
      { label: "Draußen", values: ["Gemeinschaftsterrasse", "Gemeinschaftsterrasse", "Privatbalkon"] },
      { label: "Zusatzgäste", values: ["je +15 € (3., 4.)", "+15 € (3.)", "+15 € (3.)"] },
    ],
  },
  bestFor: {
    kicker: "Ideal für",
    title: "Für wen eignen sich die Zimmer im Obergeschoss?",
    items: [
      "Für Familien oder Freunde zu viert, die ein gemeinsames Zimmer möchten (Zimmer 1).",
      "Für Gäste, die Frühstück oder eine kleine Mahlzeit selbst zubereiten möchten (Zimmer 3 & 4).",
      "Für Paare, die einen Privatbalkon und mehr Platz möchten (Zimmer 4).",
      "Für alle, die ein helleres Zimmer im Obergeschoss mit Blick über das Anwesen bevorzugen.",
    ],
  },
  booking: {
    kicker: "Direktbuchung",
    title: "Ein Zimmer im Obergeschoss für Ihre Reisedaten?",
    text: "Buchen Sie die Kategorie Obergeschoss online mit dem Code WELCOME10 oder schicken Sie uns Reisedaten und Personenzahl – wir prüfen Zimmer 1, 3 und 4 für Sie.",
    phoneLabel: "Anrufen",
    whatsappLabel: "WhatsApp",
    whatsappText: "Hallo! Ich interessiere mich für ein Zimmer im Obergeschoss (1, 3 oder 4) im Voulamandis House. Meine Reisedaten:",
    note: "Direktbuchungen erhalten 10 % Rabatt mit dem Code WELCOME10. Frühstück optional (12 € pro Erwachsenem und Tag).",
  },
  faq: [
    {
      question: "Wie viele Stufen führen zu den Zimmern im Obergeschoss?",
      answer:
        "Zimmer 1, 3 und 4 erreichen Sie über 14 Stufen mit Handlauf; einen Aufzug gibt es nicht. Hilfe mit dem Gepäck auf Anfrage. Wenn Sie keine Treppen möchten, sehen Sie sich unsere Erdgeschoss-Zimmer 5 und 7 an.",
    },
    {
      question: "Welches Zimmer im Obergeschoss eignet sich für 4 Gäste?",
      answer:
        "Zimmer 1. Es bietet bis zu 4 Gästen 1 Doppelbett und 2 Einzelbetten in zwei verbundenen Bereichen ohne Innentür. Der 3. und 4. Gast kosten je 15 € pro Nacht.",
    },
    {
      question: "Welche Zimmer haben eine Kochnische?",
      answer:
        "Zimmer 3 und 4, ohne Aufpreis. Die Kochnische hat Kochfeld, kleinen Ofen, Wasserkocher, Töpfe und Besteck; eine Mikrowelle gibt es nicht. Zimmer 1 hat Minikühlschrank und Wasserkocher.",
    },
    {
      question: "Haben die Zimmer im Obergeschoss Balkon oder Terrasse?",
      answer:
        "Zimmer 4 hat einen eigenen Privatbalkon. Zimmer 1 und 3 haben Zugang zu einer Gemeinschaftsterrasse mit Blick über das Anwesen.",
    },
    {
      question: "Kann ich ein bestimmtes Zimmer im Obergeschoss buchen?",
      answer:
        "Online wird die Kategorie Obergeschoss gebucht. Wenn Sie gezielt Zimmer 1, 3 oder 4 möchten, teilen Sie uns das nach der Buchung oder über den AI Room Finder mit; wir bestätigen es schriftlich, sofern verfügbar.",
    },
    {
      question: "Gibt es ein günstigeres Zimmer im Obergeschoss?",
      answer:
        "Ja. Das Economy-Zimmer 2 liegt ebenfalls im Obergeschoss mit Zugang zur Gemeinschaftsterrasse. Es ist kleiner (ca. 16 m²) und bietet 2 Gästen ein Doppelbett.",
    },
  ],
  related: {
    kicker: "Weitere Optionen",
    title: "Mit unseren anderen Zimmern vergleichen",
    ground: ["Zimmer im Erdgeschoss", "Zimmer 5 & 7, ohne Treppen, direkt zu Hof und Garten."],
    economy: ["Economy-Doppelzimmer", "Zimmer 2 & 6, 16 m², die günstigste Wahl für zwei."],
    family: ["Familienapartments", "Apartments 8–10 mit separatem Schlafzimmer und voller Küche."],
    all: ["Alle Zimmer & Apartments", "Alle Kategorien mit Live-Preisen vergleichen."],
  },
});

/* ------------------------------------------------------------------ IT -- */

export const firstFloorRoomsIt = build("it", {
  seo: {
    title: "Camere doppie e triple al primo piano a Chios | Voulamandis House",
    description:
      "Camere 1, 3 e 4 al primo piano a Kambos, Chios: 30–35 m², fino a 4 ospiti, terrazza o balcone privato, angolo cottura nelle camere 3 e 4. Prenota diretto, -10%.",
  },
  hero: {
    kicker: "Camere al primo piano a Chios",
    title: "Camere doppie e triple al primo piano",
    subtitle: "Camere 1, 3 e 4 · terrazza o balcone · fino a 4 ospiti",
    description:
      "Camere luminose al primo piano della nostra storica tenuta di Kambos, con muri in pietra, vista sui frutteti di agrumi e terrazza condivisa o balcone privato. Le camere 3 e 4 hanno anche un angolo cottura.",
    imageAlt: "Camera doppia al primo piano con muro in pietra e finestra a Voulamandis House, Kambos, Chios",
    badges: ["Primo piano", "Terrazza o balcone", "30–35 m²", "Fino a 4 ospiti"],
    bookLabel: "Prenota diretto",
    askLabel: "Chiedi disponibilità",
  },
  overview: {
    kicker: "In breve",
    title: "Camere al piano superiore, spaziose e luminose",
    paragraphs: [
      "Le camere 1, 3 e 4 sono le doppie / triple al primo piano di Voulamandis House. Si raggiungono con 14 gradini con corrimano e la vista si apre sulla tenuta e sui frutteti di Kambos.",
      "Ogni camera misura circa 30–35 m², con pietra tradizionale di Chios, bagno privato con doccia e spazio per un terzo ospite. La camera 1 ospita fino a 4 persone in due ambienti comunicanti; le camere 3 e 4 hanno l’angolo cottura e la camera 4 un balcone privato.",
      "Perfette per coppie che vogliono più spazio di una camera economica, per gruppi di amici e per famiglie con uno o due bambini a cui non pesano le scale.",
    ],
    highlights: [
      { label: "Ospiti", value: "2–4" },
      { label: "Metratura", value: "30–35 m²" },
      { label: "Accesso", value: "14 gradini" },
      { label: "Esterno", value: "Terrazza o balcone" },
    ],
  },
  gallery: {
    kicker: "Foto",
    title: "Dentro le camere al primo piano",
    alts: [
      "Camera 1 al primo piano di Voulamandis House a Chios con muro in pietra",
      "Due ambienti comunicanti nella camera 1 a Kambos, Chios",
      "Camera 3 al primo piano con mobili d’epoca e muri in pietra",
      "Angolo cottura della camera 3 a Voulamandis House",
      "Camera 4 al primo piano con travi in legno a Chios",
      "Bagno privato rinnovato in una camera al primo piano",
    ],
  },
  amenities: {
    kicker: "In ogni camera",
    title: "Cosa includono le camere al primo piano",
    items: [
      { icon: "🌤️", label: "Terrazza o balcone", text: "Terrazza condivisa per le camere 1 e 3, balcone privato nella 4." },
      { icon: "🥣", label: "Angolo cottura", text: "Nelle camere 3 e 4: fornelli, fornetto, pentole e posate." },
      { icon: "❄️", label: "Aria condizionata", text: "E riscaldamento in primavera e autunno." },
      { icon: "📶", label: "WiFi gratuito", text: "In tutta la casa." },
      { icon: "📺", label: "Smart TV", text: "Con app come Netflix e YouTube." },
      { icon: "🧊", label: "Frigobar & bollitore", text: "Caffè e tè omaggio, riforniti ogni giorno." },
      { icon: "🚿", label: "Bagno privato", text: "Doccia, asciugacapelli e set di cortesia." },
      { icon: "🧳", label: "Aiuto bagagli", text: "Portiamo su le valigie su richiesta." },
    ],
  },
  individual: {
    kicker: "Scegli la camera",
    title: "Camera 1, camera 3 e camera 4",
    description:
      "Tutte e tre sono al primo piano, di circa 30–35 m². La camera 1 è quella per 4 ospiti, la 3 ha l’angolo cottura e la 4 unisce angolo cottura e balcone privato.",
  },
  roomDescriptions: [
    "La camera 1 misura circa 30–35 m² e ospita fino a 4 persone con 1 letto matrimoniale e 2 singoli, in due ambienti comunicanti senza porta interna, con accesso a una terrazza condivisa.",
    "La camera 3 misura circa 30–35 m² con 1 letto matrimoniale e 1 divano letto per fino a 3 ospiti, due ambienti comunicanti senza porta, angolo cottura e accesso alla terrazza condivisa.",
    "La camera 4 misura circa 30–35 m², open space, con 1 letto matrimoniale e 1 divano letto per fino a 3 ospiti, angolo cottura e un proprio balcone privato.",
  ],
  comparison: {
    kicker: "A confronto",
    title: "Camera 1, 3 o 4?",
    note: "La prenotazione online blocca la categoria primo piano; se preferisci una camera precisa, dicci quale e la confermeremo per iscritto se disponibile.",
    columns: ["Camera 1", "Camera 3", "Camera 4"],
    rows: [
      { label: "Ospiti max", values: ["4", "3", "3"] },
      { label: "Letti", values: ["1 matrimoniale + 2 singoli", "1 matrimoniale + 1 divano letto", "1 matrimoniale + 1 divano letto"] },
      { label: "Disposizione", values: ["2 ambienti, senza porta", "2 ambienti, senza porta", "Open space"] },
      { label: "Cucina", values: ["Frigobar & bollitore", "Angolo cottura", "Angolo cottura"] },
      { label: "Esterno", values: ["Terrazza condivisa", "Terrazza condivisa", "Balcone privato"] },
      { label: "Ospiti extra", values: ["+15 € ciascuno (3°, 4°)", "+15 € (3°)", "+15 € (3°)"] },
    ],
  },
  bestFor: {
    kicker: "Ideali per",
    title: "A chi sono adatte le camere al primo piano?",
    items: [
      "A famiglie o amici in quattro che vogliono un’unica camera (camera 1).",
      "A chi ama preparare la colazione o un pasto leggero (camere 3 e 4).",
      "Alle coppie che desiderano un balcone privato e più spazio (camera 4).",
      "A chi preferisce una camera al piano superiore, più luminosa e con vista sulla tenuta.",
    ],
  },
  booking: {
    kicker: "Prenotazione diretta",
    title: "Vuoi una camera al primo piano per le tue date?",
    text: "Prenota online la categoria primo piano con il codice WELCOME10, oppure scrivici date e numero di ospiti e verificheremo per te le camere 1, 3 e 4.",
    phoneLabel: "Chiamaci",
    whatsappLabel: "WhatsApp",
    whatsappText: "Buongiorno! Vorrei una camera al primo piano (1, 3 o 4) a Voulamandis House. Le mie date sono:",
    note: "Le prenotazioni dirette hanno il 10% di sconto con il codice WELCOME10. Colazione facoltativa (12 € per adulto al giorno).",
  },
  faq: [
    {
      question: "Quanti gradini per le camere al primo piano?",
      answer:
        "Le camere 1, 3 e 4 si raggiungono con 14 gradini con corrimano; non c’è ascensore. Aiuto con i bagagli su richiesta. Se preferisci evitare le scale, guarda le camere 5 e 7 al piano terra.",
    },
    {
      question: "Quale camera al primo piano è adatta a 4 persone?",
      answer:
        "La camera 1. Ospita fino a 4 persone con 1 letto matrimoniale e 2 singoli, in due ambienti comunicanti senza porta interna. Il 3° e il 4° ospite costano 15 € a notte ciascuno.",
    },
    {
      question: "Quali camere hanno l’angolo cottura?",
      answer:
        "Le camere 3 e 4, senza costi aggiuntivi. L’angolo cottura ha fornelli, fornetto, bollitore, pentole e posate; non c’è il microonde. La camera 1 ha frigobar e bollitore.",
    },
    {
      question: "Le camere al primo piano hanno balcone o terrazza?",
      answer:
        "La camera 4 ha un proprio balcone privato. Le camere 1 e 3 hanno accesso a una terrazza condivisa con vista sulla tenuta.",
    },
    {
      question: "Posso prenotare una camera specifica al primo piano?",
      answer:
        "Il sistema online prenota la categoria primo piano. Se desideri proprio la camera 1, 3 o 4, comunicacelo dopo la prenotazione o tramite l’AI Room Finder; la confermiamo per iscritto se disponibile.",
    },
    {
      question: "C’è una camera più economica al primo piano?",
      answer:
        "Sì. La camera economica 2 è anch’essa al primo piano, con accesso alla terrazza condivisa. È più piccola (circa 16 m²) e ospita 2 persone in un letto matrimoniale.",
    },
  ],
  related: {
    kicker: "Altre opzioni",
    title: "Confronta con le altre camere",
    ground: ["Camere al piano terra", "Camere 5 e 7, senza scale, direttamente su cortile e giardino."],
    economy: ["Camere doppie economiche", "Camere 2 e 6, 16 m², la scelta più conveniente per due."],
    family: ["Appartamenti familiari", "Appartamenti 8–10 con camera separata e cucina completa."],
    all: ["Tutte le camere e gli appartamenti", "Confronta tutte le categorie con i prezzi live."],
  },
});

/* ------------------------------------------------------------------ ES -- */

export const firstFloorRoomsEs = build("es", {
  seo: {
    title: "Habitaciones dobles y triples en primera planta en Quíos | Voulamandis House",
    description:
      "Habitaciones 1, 3 y 4 en primera planta en Kambos, Quíos: 30–35 m², hasta 4 personas, terraza o balcón privado, kitchenette en la 3 y la 4. Reserva directa, -10%.",
  },
  hero: {
    kicker: "Habitaciones en primera planta en Quíos",
    title: "Habitaciones dobles y triples en primera planta",
    subtitle: "Habitaciones 1, 3 y 4 · terraza o balcón · hasta 4 personas",
    description:
      "Habitaciones luminosas en la primera planta de nuestra finca histórica de Kambos, con paredes de piedra, vistas a los huertos de cítricos y terraza compartida o balcón privado. Las habitaciones 3 y 4 tienen además su propia kitchenette.",
    imageAlt: "Habitación doble en primera planta con pared de piedra y ventana en Voulamandis House, Kambos, Quíos",
    badges: ["Primera planta", "Terraza o balcón", "30–35 m²", "Hasta 4 personas"],
    bookLabel: "Reservar directo",
    askLabel: "Consultar disponibilidad",
  },
  overview: {
    kicker: "De un vistazo",
    title: "Habitaciones en la planta alta, amplias y luminosas",
    paragraphs: [
      "Las habitaciones 1, 3 y 4 son las dobles / triples de la primera planta de Voulamandis House. Se accede por 14 escalones con pasamanos y la vista se abre sobre la finca y los huertos de Kambos.",
      "Cada habitación tiene unos 30–35 m², piedra tradicional de Quíos, baño privado con ducha y sitio para una tercera persona. La 1 aloja hasta 4 personas en dos espacios comunicados; la 3 y la 4 tienen kitchenette y la 4, balcón privado.",
      "Son ideales para parejas que quieren más espacio que en una habitación económica, grupos de amigos y familias con uno o dos niños a las que no les importan las escaleras.",
    ],
    highlights: [
      { label: "Personas", value: "2–4" },
      { label: "Superficie", value: "30–35 m²" },
      { label: "Acceso", value: "14 escalones" },
      { label: "Exterior", value: "Terraza o balcón" },
    ],
  },
  gallery: {
    kicker: "Fotos",
    title: "Dentro de las habitaciones en primera planta",
    alts: [
      "Habitación 1 en primera planta de Voulamandis House en Quíos con pared de piedra",
      "Dos espacios comunicados en la habitación 1 en Kambos, Quíos",
      "Habitación 3 en primera planta con muebles antiguos y paredes de piedra",
      "Kitchenette de la habitación 3 en Voulamandis House",
      "Habitación 4 en primera planta con vigas de madera en Quíos",
      "Baño privado renovado en una habitación de primera planta",
    ],
  },
  amenities: {
    kicker: "En cada habitación",
    title: "Qué incluyen las habitaciones en primera planta",
    items: [
      { icon: "🌤️", label: "Terraza o balcón", text: "Terraza compartida para la 1 y la 3, balcón privado en la 4." },
      { icon: "🥣", label: "Kitchenette", text: "En la 3 y la 4: placas, horno pequeño, ollas y cubiertos." },
      { icon: "❄️", label: "Aire acondicionado", text: "Y calefacción en primavera y otoño." },
      { icon: "📶", label: "WiFi gratis", text: "En toda la casa." },
      { icon: "📺", label: "Smart TV", text: "Con apps como Netflix y YouTube." },
      { icon: "🧊", label: "Mininevera y hervidor", text: "Café y té gratis, repuestos a diario." },
      { icon: "🚿", label: "Baño privado", text: "Ducha, secador y artículos de aseo." },
      { icon: "🧳", label: "Ayuda con el equipaje", text: "Subimos tus maletas si lo pides." },
    ],
  },
  individual: {
    kicker: "Elige tu habitación",
    title: "Habitación 1, habitación 3 y habitación 4",
    description:
      "Las tres están en la primera planta y miden unos 30–35 m². La 1 es la de 4 personas, la 3 tiene kitchenette y la 4 combina kitchenette y balcón privado.",
  },
  roomDescriptions: [
    "La habitación 1 tiene unos 30–35 m² y aloja hasta 4 personas con 1 cama doble y 2 individuales, en dos espacios comunicados sin puerta interior, con acceso a una terraza compartida.",
    "La habitación 3 tiene unos 30–35 m² con 1 cama doble y 1 sofá cama para hasta 3 personas, dos espacios comunicados sin puerta, kitchenette y acceso a la terraza compartida.",
    "La habitación 4 tiene unos 30–35 m², espacio abierto, con 1 cama doble y 1 sofá cama para hasta 3 personas, kitchenette y su propio balcón privado.",
  ],
  comparison: {
    kicker: "Lado a lado",
    title: "¿Habitación 1, 3 o 4?",
    note: "La reserva online bloquea la categoría primera planta; si prefieres una habitación concreta, dínoslo y la confirmaremos por escrito si está disponible.",
    columns: ["Habitación 1", "Habitación 3", "Habitación 4"],
    rows: [
      { label: "Máx. personas", values: ["4", "3", "3"] },
      { label: "Camas", values: ["1 doble + 2 individuales", "1 doble + 1 sofá cama", "1 doble + 1 sofá cama"] },
      { label: "Distribución", values: ["2 espacios, sin puerta", "2 espacios, sin puerta", "Espacio abierto"] },
      { label: "Cocina", values: ["Mininevera y hervidor", "Kitchenette", "Kitchenette"] },
      { label: "Exterior", values: ["Terraza compartida", "Terraza compartida", "Balcón privado"] },
      { label: "Personas extra", values: ["+15 € cada una (3.ª, 4.ª)", "+15 € (3.ª)", "+15 € (3.ª)"] },
    ],
  },
  bestFor: {
    kicker: "Ideales para",
    title: "¿Para quién son las habitaciones en primera planta?",
    items: [
      "Para familias o amigos de cuatro que quieren una sola habitación (habitación 1).",
      "Para quienes prefieren preparar el desayuno o una comida ligera (habitaciones 3 y 4).",
      "Para parejas que quieren balcón privado y más espacio (habitación 4).",
      "Para quien prefiere una habitación en planta alta, más luminosa y con vistas a la finca.",
    ],
  },
  booking: {
    kicker: "Reserva directa",
    title: "¿Quieres una habitación en primera planta para tus fechas?",
    text: "Reserva online la categoría primera planta con el código WELCOME10, o escríbenos tus fechas y número de personas y comprobaremos las habitaciones 1, 3 y 4 por ti.",
    phoneLabel: "Llámanos",
    whatsappLabel: "WhatsApp",
    whatsappText: "¡Hola! Me gustaría una habitación en primera planta (1, 3 o 4) en Voulamandis House. Mis fechas son:",
    note: "Las reservas directas tienen un 10% de descuento con el código WELCOME10. Desayuno opcional (12 € por adulto y día).",
  },
  faq: [
    {
      question: "¿Cuántos escalones hay hasta las habitaciones de primera planta?",
      answer:
        "A las habitaciones 1, 3 y 4 se sube por 14 escalones con pasamanos; no hay ascensor. Ayuda con el equipaje bajo petición. Si prefieres evitar escaleras, mira nuestras habitaciones 5 y 7 en planta baja.",
    },
    {
      question: "¿Qué habitación de primera planta es mejor para 4 personas?",
      answer:
        "La habitación 1. Aloja hasta 4 personas con 1 cama doble y 2 individuales, en dos espacios comunicados sin puerta interior. La 3.ª y 4.ª persona pagan 15 € por noche cada una.",
    },
    {
      question: "¿Qué habitaciones tienen kitchenette?",
      answer:
        "Las habitaciones 3 y 4, sin coste adicional. La kitchenette tiene placas, horno pequeño, hervidor, ollas y cubiertos; no hay microondas. La habitación 1 tiene mininevera y hervidor.",
    },
    {
      question: "¿Tienen balcón o terraza las habitaciones de primera planta?",
      answer:
        "La habitación 4 tiene su propio balcón privado. Las habitaciones 1 y 3 tienen acceso a una terraza compartida con vistas a la finca.",
    },
    {
      question: "¿Puedo reservar una habitación concreta en primera planta?",
      answer:
        "El sistema online reserva la categoría primera planta. Si quieres específicamente la habitación 1, 3 o 4, indícalo tras reservar o pídelo con el AI Room Finder; la confirmamos por escrito si está disponible.",
    },
    {
      question: "¿Hay una habitación más económica en primera planta?",
      answer:
        "Sí. La habitación económica 2 también está en la primera planta, con acceso a la terraza compartida. Es más pequeña (unos 16 m²) y aloja a 2 personas en una cama doble.",
    },
  ],
  related: {
    kicker: "Otras opciones",
    title: "Compara con nuestras otras habitaciones",
    ground: ["Habitaciones en planta baja", "Habitaciones 5 y 7, sin escaleras, directas al patio y al jardín."],
    economy: ["Habitaciones dobles económicas", "Habitaciones 2 y 6, 16 m², lo más económico para dos."],
    family: ["Apartamentos familiares", "Apartamentos 8–10 con dormitorio aparte y cocina completa."],
    all: ["Todas las habitaciones", "Compara todas las categorías con precios en directo."],
  },
});

/* ------------------------------------------------------------------ TR -- */

export const firstFloorRoomsTr = build("tr", {
  seo: {
    title: "Sakız Adası Üst Kat Çift ve Üç Kişilik Odalar | Voulamandis House",
    description:
      "Kambos’ta üst kattaki 1, 3 ve 4 numaralı odalar: 30–35 m², 4 kişiye kadar, teras veya balkon, 3 ve 4’te mini mutfak. Direkt rezervasyonda %10 indirim.",
  },
  hero: {
    kicker: "Sakız Adası üst kat odaları",
    title: "Üst kat çift ve üç kişilik odalar",
    subtitle: "Oda 1, 3 ve 4 · teras veya balkon · 4 kişiye kadar",
    description:
      "Kambos’taki tarihi çiftliğimizin üst katında, taş duvarlı, narenciye bahçelerine bakan ve ortak teras ya da özel balkonlu aydınlık odalar. Oda 3 ve 4’te ayrıca kendi mini mutfağı bulunur.",
    imageAlt: "Voulamandis House’ta taş duvarlı ve pencereli üst kat çift kişilik oda, Kambos, Sakız Adası",
    badges: ["Üst kat", "Teras veya balkon", "30–35 m²", "4 kişiye kadar"],
    bookLabel: "Direkt rezervasyon",
    askLabel: "Müsaitlik sorun",
  },
  overview: {
    kicker: "Kısaca",
    title: "Geniş, aydınlık ve teraslı üst kat odaları",
    paragraphs: [
      "Oda 1, 3 ve 4, Voulamandis House’un üst kattaki çift / üç kişilik odalarıdır. Tırabzanlı 14 basamakla çıkılır ve manzara çiftliğin ve Kambos bahçelerinin üzerine açılır.",
      "Her oda yaklaşık 30–35 m², geleneksel Sakız taşıyla, duşlu özel banyolu ve üçüncü kişi için yeterince geniştir. Oda 1 iki bağlantılı alanda 4 kişiye kadar ağırlar; Oda 3 ve 4’te mini mutfak, Oda 4’te ayrıca özel balkon vardır.",
      "Ekonomik odadan daha fazla alan isteyen çiftler, arkadaş grupları ve merdiven sorun olmayan bir veya iki çocuklu aileler için idealdir.",
    ],
    highlights: [
      { label: "Misafir", value: "2–4" },
      { label: "Büyüklük", value: "30–35 m²" },
      { label: "Erişim", value: "14 basamak" },
      { label: "Dış alan", value: "Teras veya balkon" },
    ],
  },
  gallery: {
    kicker: "Fotoğraflar",
    title: "Üst kat odalarından görüntüler",
    alts: [
      "Sakız Adası Voulamandis House üst kat Oda 1, taş duvar",
      "Kambos, Sakız Adası’nda Oda 1’in iki bağlantılı alanı",
      "Antika mobilyalı ve taş duvarlı üst kat Oda 3",
      "Voulamandis House’ta Oda 3’ün mini mutfağı",
      "Sakız Adası’nda ahşap kirişli üst kat Oda 4",
      "Üst kat odasında yenilenmiş özel banyo",
    ],
  },
  amenities: {
    kicker: "Her odada",
    title: "Üst kat odalarında neler var?",
    items: [
      { icon: "🌤️", label: "Teras veya balkon", text: "Oda 1 ve 3 için ortak teras, Oda 4’te özel balkon." },
      { icon: "🥣", label: "Mini mutfak", text: "Oda 3 ve 4’te: ocak, küçük fırın, tencere ve çatal bıçak." },
      { icon: "❄️", label: "Klima", text: "İlkbahar ve sonbahar için ısıtma da var." },
      { icon: "📶", label: "Ücretsiz WiFi", text: "Tüm evde." },
      { icon: "📺", label: "Smart TV", text: "Netflix ve YouTube gibi uygulamalarla." },
      { icon: "🧊", label: "Mini buzdolabı ve su ısıtıcı", text: "Ücretsiz kahve ve çay, her gün yenilenir." },
      { icon: "🚿", label: "Özel banyo", text: "Duş, saç kurutma makinesi ve banyo ürünleri." },
      { icon: "🧳", label: "Bavul yardımı", text: "İstek üzerine bavullarınızı yukarı taşırız." },
    ],
  },
  individual: {
    kicker: "Odanızı seçin",
    title: "Oda 1, Oda 3 ve Oda 4",
    description:
      "Üç oda da üst kattadır ve yaklaşık 30–35 m²’dir. Oda 1 dört kişiliktir, Oda 3’te mini mutfak vardır, Oda 4 mini mutfak ile özel balkonu birleştirir.",
  },
  roomDescriptions: [
    "Oda 1 yaklaşık 30–35 m²’dir; 1 çift ve 2 tek kişilik yatakla 4 kişiye kadar ağırlar. Ara kapısı olmayan iki bağlantılı alanı ve ortak terasa erişimi vardır.",
    "Oda 3 yaklaşık 30–35 m²’dir; 1 çift kişilik yatak ve 1 çekyatla 3 kişiye kadar, ara kapısız iki bağlantılı alan, mini mutfak ve ortak terasa erişim sunar.",
    "Oda 4 yaklaşık 30–35 m², açık planlıdır; 1 çift kişilik yatak ve 1 çekyatla 3 kişiye kadar, mini mutfak ve kendine ait özel balkon sunar.",
  ],
  comparison: {
    kicker: "Yan yana",
    title: "Oda 1, 3 mü, 4 mü?",
    note: "Online rezervasyon üst kat kategorisini ayırır; belirli bir odayı tercih ediyorsanız bize yazın, müsaitse yazılı olarak onaylayalım.",
    columns: ["Oda 1", "Oda 3", "Oda 4"],
    rows: [
      { label: "Maks. misafir", values: ["4", "3", "3"] },
      { label: "Yataklar", values: ["1 çift + 2 tek", "1 çift + 1 çekyat", "1 çift + 1 çekyat"] },
      { label: "Düzen", values: ["2 alan, kapısız", "2 alan, kapısız", "Açık plan"] },
      { label: "Mutfak", values: ["Mini buzdolabı ve su ısıtıcı", "Mini mutfak", "Mini mutfak"] },
      { label: "Dış alan", values: ["Ortak teras", "Ortak teras", "Özel balkon"] },
      { label: "Ek kişi", values: ["Her biri +15 € (3., 4.)", "+15 € (3.)", "+15 € (3.)"] },
    ],
  },
  bestFor: {
    kicker: "Kimler için ideal?",
    title: "Üst kat odaları kimlere uygun?",
    items: [
      "Tek odada kalmak isteyen dört kişilik aileler veya arkadaşlar (Oda 1).",
      "Kahvaltı veya hafif bir yemek hazırlamak isteyenler (Oda 3 ve 4).",
      "Özel balkon ve daha fazla alan isteyen çiftler (Oda 4).",
      "Daha aydınlık, çiftliğe bakan bir üst kat odasını tercih eden herkes.",
    ],
  },
  booking: {
    kicker: "Direkt rezervasyon",
    title: "Tarihleriniz için üst kat odası mı istiyorsunuz?",
    text: "Üst kat kategorisini WELCOME10 koduyla online rezerve edin ya da tarihlerinizi ve kişi sayısını bize yazın; Oda 1, 3 ve 4’ü sizin için kontrol edelim.",
    phoneLabel: "Bizi arayın",
    whatsappLabel: "WhatsApp",
    whatsappText: "Merhaba! Voulamandis House’ta üst kat odası (1, 3 veya 4) istiyorum. Tarihlerim:",
    note: "Direkt rezervasyonlarda WELCOME10 koduyla %10 indirim. Kahvaltı isteğe bağlıdır (yetişkin başına günlük 12 €).",
  },
  faq: [
    {
      question: "Üst kat odalarına kaç basamakla çıkılıyor?",
      answer:
        "Oda 1, 3 ve 4’e tırabzanlı 14 basamakla çıkılır; asansör yoktur. İstek üzerine bavul yardımı sağlanır. Merdivensiz bir oda isterseniz zemin kattaki Oda 5 ve 7’ye göz atın.",
    },
    {
      question: "4 kişi için en uygun üst kat odası hangisi?",
      answer:
        "Oda 1. Ara kapısı olmayan iki bağlantılı alanda 1 çift ve 2 tek kişilik yatakla 4 kişiye kadar ağırlar. 3. ve 4. kişi için her biri gecelik 15 € alınır.",
    },
    {
      question: "Hangi odalarda mini mutfak var?",
      answer:
        "Oda 3 ve 4’te, ek ücret olmadan. Mini mutfakta ocak, küçük fırın, su ısıtıcı, tencere ve çatal bıçak bulunur; mikrodalga yoktur. Oda 1’de mini buzdolabı ve su ısıtıcı vardır.",
    },
    {
      question: "Üst kat odalarında balkon veya teras var mı?",
      answer:
        "Oda 4’ün kendine ait özel balkonu vardır. Oda 1 ve 3, çiftliğe bakan ortak bir terasa erişir.",
    },
    {
      question: "Belirli bir üst kat odasını rezerve edebilir miyim?",
      answer:
        "Online sistem üst kat kategorisini rezerve eder. Özellikle Oda 1, 3 veya 4’ü istiyorsanız rezervasyondan sonra bize bildirin veya AI Room Finder üzerinden talep edin; müsaitse yazılı olarak onaylarız.",
    },
    {
      question: "Üst katta daha uygun fiyatlı bir oda var mı?",
      answer:
        "Evet. Ekonomik Oda 2 de üst kattadır ve ortak terasa erişimi vardır. Daha küçüktür (yaklaşık 16 m²) ve tek çift kişilik yatakta 2 kişi kalır.",
    },
  ],
  related: {
    kicker: "Diğer seçenekler",
    title: "Diğer odalarımızla karşılaştırın",
    ground: ["Zemin kat odaları", "Oda 5 ve 7, merdivensiz, doğrudan avlu ve bahçeye açılır."],
    economy: ["Ekonomik çift kişilik odalar", "Oda 2 ve 6, 16 m², iki kişi için en uygun seçenek."],
    family: ["Aile apartları", "Ayrı yatak odalı ve tam mutfaklı Apart 8–10."],
    all: ["Tüm odalar ve apartlar", "Tüm kategorileri canlı fiyatlarla karşılaştırın."],
  },
});
