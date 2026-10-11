import type { IndividualRoomData, RoomDetailData } from "@/content/room-details";

/* ==========================================================================
   GROUND FLOOR ROOMS 5 & 7 — dedicated category page (7 languages)

   Facts are owner-confirmed (booking_core.rooms / room_features, 2026-09-05):
   - Rooms 5 and 7: ground floor, 0 entrance steps, direct courtyard & garden
     access, approx. 30–35 m², open-plan, max 3 guests, mini fridge + kettle,
     no kitchenette. Rooms 5 and 7: 1 double + 1 sofa bed.
   - 3rd guest supplement: €15 per night (booking_core.guest_pricing).
   - Not specially adapted for wheelchair users.
   ========================================================================== */

type Lang = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export const groundFloorRoomsPaths: Record<Lang, string> = {
  en: "/chios-rooms/ground-floor-rooms/",
  el: "/el/domatia-xios/isogeia-domatia/",
  fr: "/fr/chambres-a-chios/chambres-rez-de-chaussee/",
  de: "/de/zimmer-chios/erdgeschoss-zimmer/",
  it: "/it/stanze-a-chios/camere-piano-terra/",
  es: "/es/habitaciones-en-chios/habitaciones-planta-baja/",
  tr: "/tr/chios-odalari/zemin-kat-odalari/",
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

const standardPaths: Record<Lang, string> = {
  en: "/chios-rooms/standard-double-room/",
  el: "/el/domatia-xios/diklina-triklina-domatia/",
  fr: "/fr/chambres-a-chios/chambres-doubles-standard/",
  de: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
  it: "/it/stanze-a-chios/camere-doppie-standard-chios/",
  es: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
  tr: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
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
const HERO_IMAGE = "/images/rooms/double-triple-room.jpg";

/* Individual rooms. Text stays in English; RoomDetailPage and the schema
   builder translate these exact strings for the other languages. */
const groundFloorRooms: IndividualRoomData[] = [
  {
    id: "room-5",
    name: "Room 5",
    type: "Ground-floor double / triple",
    location: "Ground floor",
    maxGuests: 3,
    sizeM2: 32,
    description:
      "Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection.",
    badges: ["Ground floor", "No stairs", "Garden access", "Up to 3 guests"],
    beds: ["1 double bed", "1 sofa bed"],
    amenities: [
      { icon: "🪜❌", label: "No stairs" },
      { icon: "🌿", label: "Garden access" },
      { icon: "📐", label: "Open-plan space" },
      { icon: "📶", label: "Wi-Fi" },
      { icon: "☕", label: "Coffee and tea kettle" },
    ],
    images: [
      {
        src: "/images/rooms/voulamandis-house-rooms.webp",
        alt: "Ground floor room 5 in Chios with stone wall and sitting area - Voulamandis House, Kambos",
        caption: "Bedroom",
      },
      {
        src: "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp",
        alt: "Ground floor room 5 in Chios - mini fridge and kettle corner - Voulamandis House",
        caption: "Traditional interior",
      },
      {
        src: "/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp",
        alt: "Ground floor room 5 in Chios - renovated private bathroom with shower - Voulamandis House",
        caption: "Bathroom",
      },
      {
        src: "/images/rooms/hotels-chios-voulamandis_1620x1080.webp",
        alt: "Ground floor room 5 in Chios - bedside detail with traditional stone - Voulamandis House",
        caption: "Detail",
      },
    ],
  },
  {
    id: "room-7",
    name: "Room 7",
    type: "Ground-floor double / triple",
    location: "Ground floor",
    maxGuests: 3,
    sizeM2: 32,
    description:
      "Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed.",
    badges: ["Ground floor", "No stairs", "Garden access", "Sofa bed"],
    beds: ["1 double bed", "1 sofa bed"],
    amenities: [
      { icon: "🪜❌", label: "No stairs" },
      { icon: "🌿", label: "Garden access" },
      { icon: "🛋️", label: "Sofa bed" },
      { icon: "📶", label: "Wi-Fi" },
      { icon: "☕", label: "Coffee and tea kettle" },
    ],
    images: [
      {
        src: "/images/rooms/double-triple-room.jpg",
        alt: "Ground floor room 7 in Chios with stone wall, wooden beams and sofa bed - Voulamandis House",
        caption: "Room layout",
      },
      {
        src: "/images/rooms/view-double-room-chios-hotels.webp",
        alt: "Ground floor room 7 in Chios - interior with traditional stone wall - Voulamandis House",
        caption: "Stone wall interior",
      },
      {
        src: "/images/rooms/double-room-bathroom.webp",
        alt: "Ground floor room 7 in Chios - modern shower bathroom - Voulamandis House",
        caption: "Bathroom",
      },
      {
        src: "/images/rooms/voulamandis-stone-bathroom.webp",
        alt: "Ground floor room 7 in Chios - traditional stone bathroom details - Voulamandis House",
        caption: "Stone bathroom details",
      },
    ],
  },
];

const outdoorImages = [
  "/images/homepage-gallery/voulamandis-house-shaded-garden.webp",
  "/images/homepage-gallery/voulamandis-house-garden.webp",
  "/images/homepage-gallery/voulamandis-house-courtyard-seating.webp",
  "/images/homepage-gallery/chios-guesthouse-courtyard-lounge.webp",
];

const galleryImages = [
  HERO_IMAGE,
  "/images/rooms/voulamandis-house-rooms.webp",
  "/images/rooms/view-double-room-chios-hotels.webp",
  "/images/homepage-gallery/voulamandis-house-shaded-garden.webp",
  "/images/rooms/double-room-bathroom.webp",
  "/images/homepage-gallery/voulamandis-house-garden.webp",
];

type Copy = {
  seo: { title: string; description: string };
  hero: { kicker: string; title: string; subtitle: string; description: string; imageAlt: string; badges: string[]; bookLabel: string; askLabel: string };
  overview: { kicker: string; title: string; paragraphs: string[]; highlights: { label: string; value: string }[] };
  gallery: { kicker: string; title: string; alts: string[] };
  amenities: { kicker: string; title: string; items: { icon: string; label: string; text: string }[] };
  individual: { kicker: string; title: string; description: string };
  comparison: NonNullable<RoomDetailData["comparison"]>;
  outdoor: { kicker: string; title: string; paragraphs: string[]; alts: string[] };
  bestFor: { kicker: string; title: string; items: string[] };
  booking: { kicker: string; title: string; text: string; phoneLabel: string; whatsappLabel: string; whatsappText: string; note: string };
  faq: { question: string; answer: string }[];
  related: { kicker: string; title: string; first: [string, string]; economy: [string, string]; family: [string, string]; all: [string, string] };
};

function build(lang: Lang, copy: Copy): RoomDetailData {
  return {
    id: "ground-floor-rooms",
    seo: {
      canonicalPath: groundFloorRoomsPaths[lang],
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
      rooms: groundFloorRooms,
    },
    comparison: copy.comparison,
    outdoor: {
      kicker: copy.outdoor.kicker,
      title: copy.outdoor.title,
      paragraphs: copy.outdoor.paragraphs,
      images: outdoorImages.map((src, index) => ({ src, alt: copy.outdoor.alts[index] ?? copy.outdoor.title })),
    },
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
        { href: standardPaths[lang], title: copy.related.first[0], text: copy.related.first[1] },
        { href: economyPaths[lang], title: copy.related.economy[0], text: copy.related.economy[1] },
        { href: familyPaths[lang], title: copy.related.family[0], text: copy.related.family[1] },
        { href: roomsIndexPaths[lang], title: copy.related.all[0], text: copy.related.all[1] },
      ],
    },
  };
}

/* ------------------------------------------------------------------ EN -- */

export const groundFloorRoomsEn = build("en", {
  seo: {
    title: "Ground Floor Rooms in Chios, No Stairs | Voulamandis House",
    description:
      "Ground floor rooms 5 & 7 in Kambos, Chios: no stairs, direct courtyard and garden access, 30–35 m², up to 3 guests. Book direct and save 10%.",
  },
  hero: {
    kicker: "Ground floor rooms in Chios",
    title: "Ground floor rooms with garden access",
    subtitle: "Rooms 5 & 7 · no stairs · up to 3 guests",
    description:
      "Two spacious double / triple rooms at street level in our historic Kambos estate. Step out of your door straight into the courtyard and the citrus garden, with no entrance steps at all.",
    imageAlt: "Ground floor double / triple room in Chios with stone wall and wooden beams at Voulamandis House, Kambos",
    badges: ["No stairs", "Garden access", "30–35 m²", "Up to 3 guests"],
    bookLabel: "Book direct",
    askLabel: "Ask availability",
  },
  overview: {
    kicker: "At a glance",
    title: "Easy, step-free rooms in a quiet citrus estate",
    paragraphs: [
      "Rooms 5 and 7 are the double / triple rooms on the ground floor of Voulamandis House. There are no entrance steps: you walk in directly from the courtyard, with the garden and the shaded pergola just outside your door.",
      "Each room is about 30–35 m², open-plan, with traditional Chian stone walls, a private bathroom with shower and enough space for a third guest. Both rooms have a double bed and a sofa bed.",
      "They suit couples who want more space than an economy room, friends travelling together, parents with a child, older guests and anyone carrying heavy luggage or simply preferring to avoid stairs.",
    ],
    highlights: [
      { label: "Guests", value: "2–3" },
      { label: "Size", value: "30–35 m²" },
      { label: "Entrance steps", value: "0" },
      { label: "Outside your door", value: "Courtyard & garden" },
    ],
  },
  gallery: {
    kicker: "Photos",
    title: "Inside the ground floor rooms",
    alts: [
      "Ground floor room 7 at Voulamandis House in Chios with stone wall and wooden beams",
      "Ground floor room 5 in Kambos, Chios with sitting area",
      "Traditional stone wall interior of a ground floor room in Chios",
      "Shaded garden outside the ground floor rooms at Voulamandis House",
      "Private bathroom with shower in a ground floor room in Chios",
      "Pergola and garden tables steps from the ground floor rooms",
    ],
  },
  amenities: {
    kicker: "In every room",
    title: "What the ground floor rooms include",
    items: [
      { icon: "🪜", label: "No stairs", text: "Step-free entrance from the courtyard." },
      { icon: "🌿", label: "Garden access", text: "Courtyard, garden and pergola right outside." },
      { icon: "❄️", label: "Air conditioning", text: "Plus heating for spring and autumn." },
      { icon: "📶", label: "Free WiFi", text: "Throughout the room and garden." },
      { icon: "📺", label: "Smart TV", text: "With apps such as Netflix and YouTube." },
      { icon: "🧊", label: "Mini fridge & kettle", text: "Complimentary coffee and tea, replenished daily." },
      { icon: "🚿", label: "Private bathroom", text: "Shower, hairdryer and toiletries." },
      { icon: "🅿️", label: "Free parking", text: "Private parking at the property, no reservation needed." },
    ],
  },
  individual: {
    kicker: "Choose your room",
    title: "Room 5 and Room 7",
    description:
      "Both rooms are on the ground floor with direct courtyard and garden access. Both have the same bed setup: a double bed and a sofa bed for the third guest.",
  },
  comparison: {
    kicker: "Side by side",
    title: "Room 5 vs Room 7",
    note: "Online booking reserves the ground floor category; if you prefer a specific room, tell us and we will confirm it in writing when available.",
    columns: ["Room 5", "Room 7"],
    rows: [
      { label: "Size", values: ["≈ 30–35 m²", "≈ 30–35 m²"] },
      { label: "Max guests", values: ["3", "3"] },
      { label: "Beds", values: ["1 double + 1 sofa bed", "1 double + 1 sofa bed"] },
      { label: "Layout", values: ["Open-plan", "Open-plan"] },
      { label: "Access", values: ["0 steps", "0 steps"] },
      { label: "Outside", values: ["Courtyard & garden", "Courtyard & garden"] },
      { label: "Kitchen", values: ["Mini fridge & kettle", "Mini fridge & kettle"] },
      { label: "3rd guest", values: ["+€15 / night", "+€15 / night"] },
    ],
  },
  outdoor: {
    kicker: "Right outside your door",
    title: "The courtyard, the pergola and the citrus garden",
    paragraphs: [
      "The ground floor rooms open onto the shared courtyard of the estate. A few steps away are the shaded pergola with wooden tables and outdoor sofas, where breakfast is served, and the garden with citrus and fruit trees.",
      "Guests are welcome to use the garden at any time, bring their own food and drinks and enjoy the quiet Kambos evenings, respecting quiet hours.",
    ],
    alts: [
      "Shaded pergola and garden at Voulamandis House in Kambos, Chios",
      "Garden tables under the vine pergola next to the ground floor rooms",
      "Courtyard seating with outdoor sofas at Voulamandis House",
      "Outdoor lounge in the courtyard of a traditional guesthouse in Chios",
    ],
  },
  bestFor: {
    kicker: "Best for",
    title: "Who will love the ground floor rooms?",
    items: [
      "Guests who prefer to avoid stairs or are travelling with heavy luggage.",
      "Older travellers and guests with limited mobility (the rooms are step-free but not specially adapted for wheelchairs).",
      "Couples who want more space than an economy room, with the garden at their door.",
      "Parents with one child or three friends sharing one room.",
    ],
  },
  booking: {
    kicker: "Direct booking",
    title: "Want a ground floor room for your dates?",
    text: "Book the ground floor category online with the WELCOME10 code, or message us with your dates and number of guests and we will check Room 5 and Room 7 for you.",
    phoneLabel: "Call us",
    whatsappLabel: "WhatsApp",
    whatsappText: "Hello! I would like a ground floor room (Room 5 or 7) at Voulamandis House. My dates are:",
    note: "Direct bookings get 10% off with code WELCOME10. Breakfast is optional (€12 per adult per day).",
  },
  faq: [
    {
      question: "Are there really no stairs to the ground floor rooms?",
      answer:
        "Yes. Rooms 5 and 7 have no entrance steps: you enter directly from the courtyard, and the garden is right outside your door. They are the only double / triple rooms at Voulamandis House with no stairs.",
    },
    {
      question: "Are the ground floor rooms wheelchair accessible?",
      answer:
        "They are step-free, but they are not specially adapted for wheelchair users. If you have limited mobility, contact us and we will describe the access and bathroom in detail before you book. Luggage assistance is available on request.",
    },
    {
      question: "How many guests can stay in Room 5 or Room 7?",
      answer:
        "Up to 3 guests. Both Room 5 and Room 7 have a double bed and a sofa bed. The third guest is charged €15 per night. A baby cot is free on request.",
    },
    {
      question: "What is the difference between Room 5 and Room 7?",
      answer:
        "Both are about 30–35 m², open-plan and open onto the courtyard and garden. Both have a double bed and a sofa bed, so they are practically equivalent.",
    },
    {
      question: "Can I book a specific ground floor room?",
      answer:
        "The online system books the ground floor room category. If you want Room 5 or Room 7 specifically, tell us after booking or ask through the AI Room Finder; we confirm the room in writing when it is available.",
    },
    {
      question: "Is there a cheaper ground floor option?",
      answer:
        "Yes. Economy Room 6 is also on the ground floor with no stairs and garden access. It is smaller (about 16 m²) and sleeps 2 guests in one double bed.",
    },
    {
      question: "Do the ground floor rooms have a kitchen?",
      answer:
        "No. They have a mini fridge, a kettle and complimentary coffee and tea. If you need to cook, Rooms 3 and 4 have a kitchenette and the family apartments a full kitchen.",
    },
  ],
  related: {
    kicker: "Other options",
    title: "Compare with our other rooms",
    first: ["First floor rooms", "Rooms 1, 3 & 4 with terrace or balcony, some with kitchenette."],
    economy: ["Economy double rooms", "Rooms 2 & 6, 16 m², the best value for two."],
    family: ["Family apartments", "Apartments 8–10 with separate bedroom and full kitchen."],
    all: ["All rooms & apartments", "Compare every category with live prices."],
  },
});

/* ------------------------------------------------------------------ EL -- */

export const groundFloorRoomsEl = build("el", {
  seo: {
    title: "Ισόγεια Δωμάτια στη Χίο χωρίς Σκάλες | Voulamandis House",
    description:
      "Ισόγεια δωμάτια 5 & 7 στον Κάμπο Χίου: χωρίς σκάλες, άμεση πρόσβαση σε αυλή και κήπο, 30–35 m², έως 3 άτομα. Κλείστε απευθείας με έκπτωση 10%.",
  },
  hero: {
    kicker: "Ισόγεια δωμάτια στη Χίο",
    title: "Ισόγεια δωμάτια με πρόσβαση στον κήπο",
    subtitle: "Δωμάτια 5 & 7 · χωρίς σκάλες · έως 3 άτομα",
    description:
      "Δύο ευρύχωρα δίκλινα / τρίκλινα δωμάτια στο ισόγειο του ιστορικού μας κτήματος στον Κάμπο. Βγαίνετε από την πόρτα σας κατευθείαν στην αυλή και στον κήπο με τα εσπεριδοειδή, χωρίς κανένα σκαλί στην είσοδο.",
    imageAlt: "Ισόγειο δίκλινο / τρίκλινο δωμάτιο στη Χίο με πέτρινο τοίχο και ξύλινα δοκάρια στο Voulamandis House, Κάμπος",
    badges: ["Χωρίς σκάλες", "Πρόσβαση στον κήπο", "30–35 m²", "Έως 3 άτομα"],
    bookLabel: "Απευθείας κράτηση",
    askLabel: "Ρωτήστε διαθεσιμότητα",
  },
  overview: {
    kicker: "Με μια ματιά",
    title: "Άνετα δωμάτια χωρίς σκαλιά, σε ένα ήσυχο κτήμα με εσπεριδοειδή",
    paragraphs: [
      "Τα Δωμάτια 5 και 7 είναι τα δίκλινα / τρίκλινα δωμάτια του ισογείου στο Voulamandis House. Δεν υπάρχουν σκαλιά στην είσοδο: μπαίνετε απευθείας από την αυλή, με τον κήπο και τη σκιερή πέργκολα ακριβώς έξω από την πόρτα σας.",
      "Κάθε δωμάτιο έχει περίπου 30–35 m², ενιαίο χώρο με παραδοσιακούς χιώτικους πέτρινους τοίχους, ιδιωτικό μπάνιο με ντους και άνεση για τρίτο άτομο. Και τα δύο δωμάτια έχουν ένα διπλό κρεβάτι και έναν καναπέ-κρεβάτι.",
      "Ταιριάζουν σε ζευγάρια που θέλουν περισσότερο χώρο από ένα οικονομικό δωμάτιο, σε φίλους, σε γονείς με ένα παιδί, σε ηλικιωμένους και σε όποιον έχει βαριές αποσκευές ή απλώς προτιμά να αποφύγει τις σκάλες.",
    ],
    highlights: [
      { label: "Άτομα", value: "2–3" },
      { label: "Εμβαδόν", value: "30–35 m²" },
      { label: "Σκαλιά εισόδου", value: "0" },
      { label: "Έξω από την πόρτα", value: "Αυλή & κήπος" },
    ],
  },
  gallery: {
    kicker: "Φωτογραφίες",
    title: "Μέσα στα ισόγεια δωμάτια",
    alts: [
      "Ισόγειο δωμάτιο 7 στο Voulamandis House στη Χίο με πέτρινο τοίχο και ξύλινα δοκάρια",
      "Ισόγειο δωμάτιο 5 στον Κάμπο Χίου με καθιστικό",
      "Παραδοσιακός πέτρινος τοίχος σε ισόγειο δωμάτιο στη Χίο",
      "Σκιερός κήπος έξω από τα ισόγεια δωμάτια του Voulamandis House",
      "Ιδιωτικό μπάνιο με ντους σε ισόγειο δωμάτιο στη Χίο",
      "Πέργκολα και τραπέζια στον κήπο δίπλα στα ισόγεια δωμάτια",
    ],
  },
  amenities: {
    kicker: "Σε κάθε δωμάτιο",
    title: "Τι περιλαμβάνουν τα ισόγεια δωμάτια",
    items: [
      { icon: "🪜", label: "Χωρίς σκάλες", text: "Είσοδος χωρίς σκαλιά από την αυλή." },
      { icon: "🌿", label: "Πρόσβαση στον κήπο", text: "Αυλή, κήπος και πέργκολα ακριβώς έξω." },
      { icon: "❄️", label: "Κλιματισμός", text: "Και θέρμανση για άνοιξη και φθινόπωρο." },
      { icon: "📶", label: "Δωρεάν WiFi", text: "Σε όλο το δωμάτιο και στον κήπο." },
      { icon: "📺", label: "Smart TV", text: "Με εφαρμογές όπως Netflix και YouTube." },
      { icon: "🧊", label: "Ψυγειάκι & βραστήρας", text: "Δωρεάν καφές και τσάι, ανανεώνονται καθημερινά." },
      { icon: "🚿", label: "Ιδιωτικό μπάνιο", text: "Ντους, πιστολάκι μαλλιών και είδη περιποίησης." },
      { icon: "🅿️", label: "Δωρεάν πάρκινγκ", text: "Ιδιωτικός χώρος στο κατάλυμα, χωρίς κράτηση." },
    ],
  },
  individual: {
    kicker: "Επιλέξτε δωμάτιο",
    title: "Δωμάτιο 5 και Δωμάτιο 7",
    description:
      "Και τα δύο δωμάτια βρίσκονται στο ισόγειο με άμεση πρόσβαση σε αυλή και κήπο. Έχουν την ίδια διάταξη κρεβατιών: ένα διπλό κρεβάτι και έναν καναπέ-κρεβάτι για το τρίτο άτομο.",
  },
  comparison: {
    kicker: "Δίπλα-δίπλα",
    title: "Δωμάτιο 5 ή Δωμάτιο 7;",
    note: "Η online κράτηση δεσμεύει την κατηγορία ισογείου. Αν προτιμάτε συγκεκριμένο δωμάτιο, πείτε μας και θα το επιβεβαιώσουμε γραπτώς εφόσον είναι διαθέσιμο.",
    columns: ["Δωμάτιο 5", "Δωμάτιο 7"],
    rows: [
      { label: "Εμβαδόν", values: ["≈ 30–35 m²", "≈ 30–35 m²"] },
      { label: "Μέγ. άτομα", values: ["3", "3"] },
      { label: "Κρεβάτια", values: ["1 διπλό + 1 καναπές-κρεβάτι", "1 διπλό + 1 καναπές-κρεβάτι"] },
      { label: "Διαρρύθμιση", values: ["Ενιαίος χώρος", "Ενιαίος χώρος"] },
      { label: "Πρόσβαση", values: ["0 σκαλιά", "0 σκαλιά"] },
      { label: "Έξω", values: ["Αυλή & κήπος", "Αυλή & κήπος"] },
      { label: "Κουζίνα", values: ["Ψυγειάκι & βραστήρας", "Ψυγειάκι & βραστήρας"] },
      { label: "3ο άτομο", values: ["+15 € / βράδυ", "+15 € / βράδυ"] },
    ],
  },
  outdoor: {
    kicker: "Ακριβώς έξω από την πόρτα σας",
    title: "Η αυλή, η πέργκολα και ο κήπος με τα εσπεριδοειδή",
    paragraphs: [
      "Τα ισόγεια δωμάτια ανοίγουν στην κοινόχρηστη αυλή του κτήματος. Λίγα βήματα πιο πέρα βρίσκονται η σκιερή πέργκολα με τα ξύλινα τραπέζια και τους καναπέδες, όπου σερβίρεται το πρωινό, και ο κήπος με εσπεριδοειδή και οπωροφόρα δέντρα.",
      "Μπορείτε να χρησιμοποιείτε τον κήπο όποτε θέλετε, να φέρετε δικό σας φαγητό και ποτό και να απολαύσετε τα ήσυχα βράδια του Κάμπου, σεβόμενοι τις ώρες κοινής ησυχίας.",
    ],
    alts: [
      "Σκιερή πέργκολα και κήπος στο Voulamandis House στον Κάμπο Χίου",
      "Τραπέζια κήπου κάτω από την κληματαριά δίπλα στα ισόγεια δωμάτια",
      "Καθιστικό με καναπέδες στην αυλή του Voulamandis House",
      "Υπαίθριο καθιστικό στην αυλή παραδοσιακού καταλύματος στη Χίο",
    ],
  },
  bestFor: {
    kicker: "Ιδανικά για",
    title: "Σε ποιους ταιριάζουν τα ισόγεια δωμάτια;",
    items: [
      "Σε όσους θέλουν να αποφύγουν τις σκάλες ή έχουν βαριές αποσκευές.",
      "Σε ηλικιωμένους και σε άτομα με περιορισμένη κινητικότητα (χωρίς σκαλιά, αλλά όχι ειδικά διαμορφωμένα για αναπηρικό αμαξίδιο).",
      "Σε ζευγάρια που θέλουν περισσότερο χώρο από ένα οικονομικό δωμάτιο, με τον κήπο στην πόρτα τους.",
      "Σε γονείς με ένα παιδί ή σε τρεις φίλους σε ένα δωμάτιο.",
    ],
  },
  booking: {
    kicker: "Απευθείας κράτηση",
    title: "Θέλετε ισόγειο δωμάτιο για τις ημερομηνίες σας;",
    text: "Κλείστε online την κατηγορία ισογείου με τον κωδικό WELCOME10 ή στείλτε μας ημερομηνίες και αριθμό ατόμων και θα ελέγξουμε για εσάς τα Δωμάτια 5 και 7.",
    phoneLabel: "Καλέστε μας",
    whatsappLabel: "WhatsApp",
    whatsappText: "Γεια σας! Θα ήθελα ισόγειο δωμάτιο (5 ή 7) στο Voulamandis House. Οι ημερομηνίες μου είναι:",
    note: "Οι απευθείας κρατήσεις έχουν 10% έκπτωση με τον κωδικό WELCOME10. Το πρωινό είναι προαιρετικό (12 € ανά ενήλικα την ημέρα).",
  },
  faq: [
    {
      question: "Τα ισόγεια δωμάτια δεν έχουν πραγματικά καθόλου σκάλες;",
      answer:
        "Ναι. Τα Δωμάτια 5 και 7 δεν έχουν σκαλιά στην είσοδο: μπαίνετε απευθείας από την αυλή και ο κήπος είναι ακριβώς έξω από την πόρτα σας. Είναι τα μόνα δίκλινα / τρίκλινα του Voulamandis House χωρίς σκάλες.",
    },
    {
      question: "Είναι τα ισόγεια δωμάτια προσβάσιμα με αναπηρικό αμαξίδιο;",
      answer:
        "Δεν έχουν σκαλιά, αλλά δεν είναι ειδικά διαμορφωμένα για χρήστες αναπηρικού αμαξιδίου. Αν έχετε περιορισμένη κινητικότητα, επικοινωνήστε μαζί μας και θα σας περιγράψουμε αναλυτικά την πρόσβαση και το μπάνιο πριν κλείσετε. Βοήθεια με τις αποσκευές παρέχεται κατόπιν αιτήματος.",
    },
    {
      question: "Πόσα άτομα χωράνε στο Δωμάτιο 5 ή στο Δωμάτιο 7;",
      answer:
        "Έως 3 άτομα. Και το Δωμάτιο 5 και το Δωμάτιο 7 έχουν διπλό κρεβάτι και καναπέ-κρεβάτι. Το τρίτο άτομο χρεώνεται 15 € τη βραδιά. Βρεφική κούνια παρέχεται δωρεάν κατόπιν αιτήματος.",
    },
    {
      question: "Ποια είναι η διαφορά ανάμεσα στο Δωμάτιο 5 και στο Δωμάτιο 7;",
      answer:
        "Και τα δύο έχουν περίπου 30–35 m², ενιαίο χώρο και ανοίγουν στην αυλή και στον κήπο. Και τα δύο έχουν διπλό κρεβάτι και καναπέ-κρεβάτι, οπότε είναι πρακτικά ισοδύναμα.",
    },
    {
      question: "Μπορώ να κλείσω συγκεκριμένο ισόγειο δωμάτιο;",
      answer:
        "Το online σύστημα κρατά την κατηγορία ισογείου. Αν θέλετε συγκεκριμένα το Δωμάτιο 5 ή το 7, ενημερώστε μας μετά την κράτηση ή ζητήστε το μέσω του AI Room Finder· το επιβεβαιώνουμε γραπτώς όταν είναι διαθέσιμο.",
    },
    {
      question: "Υπάρχει πιο οικονομικό ισόγειο δωμάτιο;",
      answer:
        "Ναι. Το οικονομικό Δωμάτιο 6 βρίσκεται επίσης στο ισόγειο, χωρίς σκάλες και με πρόσβαση στον κήπο. Είναι μικρότερο (περίπου 16 m²) και φιλοξενεί 2 άτομα σε ένα διπλό κρεβάτι.",
    },
    {
      question: "Έχουν κουζίνα τα ισόγεια δωμάτια;",
      answer:
        "Όχι. Διαθέτουν ψυγειάκι, βραστήρα και δωρεάν καφέ και τσάι. Αν θέλετε να μαγειρεύετε, τα Δωμάτια 3 και 4 έχουν μικρή κουζίνα και τα οικογενειακά διαμερίσματα πλήρη κουζίνα.",
    },
  ],
  related: {
    kicker: "Άλλες επιλογές",
    title: "Συγκρίνετε με τα υπόλοιπα δωμάτια",
    first: ["Δωμάτια ορόφου", "Δωμάτια 1, 3 & 4 με βεράντα ή μπαλκόνι, κάποια με μικρή κουζίνα."],
    economy: ["Οικονομικά δίκλινα", "Δωμάτια 2 & 6, 16 m², η πιο οικονομική επιλογή για δύο."],
    family: ["Οικογενειακά διαμερίσματα", "Διαμερίσματα 8–10 με ξεχωριστό υπνοδωμάτιο και πλήρη κουζίνα."],
    all: ["Όλα τα δωμάτια & διαμερίσματα", "Συγκρίνετε όλες τις κατηγορίες με ζωντανές τιμές."],
  },
});

/* ------------------------------------------------------------------ FR -- */

export const groundFloorRoomsFr = build("fr", {
  seo: {
    title: "Chambres au rez-de-chaussée à Chios, sans escalier | Voulamandis House",
    description:
      "Chambres 5 et 7 au rez-de-chaussée à Kambos, Chios : sans escalier, accès direct à la cour et au jardin, 30–35 m², jusqu’à 3 personnes. -10 % en direct.",
  },
  hero: {
    kicker: "Chambres au rez-de-chaussée à Chios",
    title: "Chambres au rez-de-chaussée avec accès au jardin",
    subtitle: "Chambres 5 et 7 · sans escalier · jusqu’à 3 personnes",
    description:
      "Deux chambres doubles / triples spacieuses de plain-pied dans notre domaine historique de Kambos. Vous sortez directement dans la cour et le jardin d’agrumes, sans aucune marche à l’entrée.",
    imageAlt: "Chambre double / triple au rez-de-chaussée à Chios avec mur en pierre et poutres en bois, Voulamandis House, Kambos",
    badges: ["Sans escalier", "Accès jardin", "30–35 m²", "Jusqu’à 3 personnes"],
    bookLabel: "Réserver en direct",
    askLabel: "Demander les disponibilités",
  },
  overview: {
    kicker: "En bref",
    title: "Des chambres de plain-pied dans un domaine d’agrumes paisible",
    paragraphs: [
      "Les chambres 5 et 7 sont les chambres doubles / triples du rez-de-chaussée de Voulamandis House. Aucune marche à l’entrée : on y entre directement depuis la cour, avec le jardin et la pergola ombragée juste devant la porte.",
      "Chaque chambre fait environ 30–35 m², en espace ouvert, avec murs en pierre traditionnels de Chios, salle de bain privée avec douche et assez d’espace pour une troisième personne. Les deux chambres ont un lit double et un canapé-lit.",
      "Elles conviennent aux couples qui veulent plus d’espace qu’une chambre économique, aux amis, aux parents avec un enfant, aux voyageurs âgés et à tous ceux qui préfèrent éviter les escaliers.",
    ],
    highlights: [
      { label: "Personnes", value: "2–3" },
      { label: "Surface", value: "30–35 m²" },
      { label: "Marches", value: "0" },
      { label: "Devant la porte", value: "Cour & jardin" },
    ],
  },
  gallery: {
    kicker: "Photos",
    title: "À l’intérieur des chambres du rez-de-chaussée",
    alts: [
      "Chambre 7 au rez-de-chaussée de Voulamandis House à Chios avec mur en pierre",
      "Chambre 5 au rez-de-chaussée à Kambos, Chios, avec coin salon",
      "Mur en pierre traditionnel dans une chambre au rez-de-chaussée à Chios",
      "Jardin ombragé devant les chambres du rez-de-chaussée",
      "Salle de bain privée avec douche dans une chambre au rez-de-chaussée",
      "Pergola et tables du jardin à quelques pas des chambres",
    ],
  },
  amenities: {
    kicker: "Dans chaque chambre",
    title: "Ce que comprennent les chambres du rez-de-chaussée",
    items: [
      { icon: "🪜", label: "Sans escalier", text: "Entrée de plain-pied depuis la cour." },
      { icon: "🌿", label: "Accès jardin", text: "Cour, jardin et pergola juste devant." },
      { icon: "❄️", label: "Climatisation", text: "Et chauffage au printemps et en automne." },
      { icon: "📶", label: "WiFi gratuit", text: "Dans la chambre et au jardin." },
      { icon: "📺", label: "Smart TV", text: "Avec Netflix, YouTube et autres applis." },
      { icon: "🧊", label: "Mini-frigo & bouilloire", text: "Café et thé offerts, renouvelés chaque jour." },
      { icon: "🚿", label: "Salle de bain privée", text: "Douche, sèche-cheveux et produits d’accueil." },
      { icon: "🅿️", label: "Parking gratuit", text: "Parking privé sur place, sans réservation." },
    ],
  },
  individual: {
    kicker: "Choisissez votre chambre",
    title: "Chambre 5 et chambre 7",
    description:
      "Les deux chambres sont au rez-de-chaussée avec accès direct à la cour et au jardin. Elles ont le même couchage : un lit double et un canapé-lit pour la troisième personne.",
  },
  comparison: {
    kicker: "Côte à côte",
    title: "Chambre 5 ou chambre 7 ?",
    note: "La réservation en ligne bloque la catégorie rez-de-chaussée ; si vous préférez une chambre précise, dites-le-nous et nous la confirmerons par écrit si elle est disponible.",
    columns: ["Chambre 5", "Chambre 7"],
    rows: [
      { label: "Surface", values: ["≈ 30–35 m²", "≈ 30–35 m²"] },
      { label: "Personnes max.", values: ["3", "3"] },
      { label: "Lits", values: ["1 double + 1 canapé-lit", "1 double + 1 canapé-lit"] },
      { label: "Agencement", values: ["Espace ouvert", "Espace ouvert"] },
      { label: "Accès", values: ["0 marche", "0 marche"] },
      { label: "Extérieur", values: ["Cour & jardin", "Cour & jardin"] },
      { label: "Cuisine", values: ["Mini-frigo & bouilloire", "Mini-frigo & bouilloire"] },
      { label: "3e personne", values: ["+15 € / nuit", "+15 € / nuit"] },
    ],
  },
  outdoor: {
    kicker: "Juste devant votre porte",
    title: "La cour, la pergola et le jardin d’agrumes",
    paragraphs: [
      "Les chambres du rez-de-chaussée donnent sur la cour commune du domaine. À quelques pas se trouvent la pergola ombragée avec tables en bois et canapés, où est servi le petit-déjeuner, et le jardin planté d’agrumes et d’arbres fruitiers.",
      "Le jardin est accessible à tout moment ; vous pouvez y apporter vos repas et boissons et profiter des soirées calmes de Kambos, dans le respect des heures de repos.",
    ],
    alts: [
      "Pergola ombragée et jardin à Voulamandis House à Kambos, Chios",
      "Tables de jardin sous la treille près des chambres du rez-de-chaussée",
      "Salon extérieur avec canapés dans la cour de Voulamandis House",
      "Coin détente dans la cour d’une maison d’hôtes traditionnelle à Chios",
    ],
  },
  bestFor: {
    kicker: "Idéal pour",
    title: "À qui conviennent les chambres du rez-de-chaussée ?",
    items: [
      "Aux voyageurs qui préfèrent éviter les escaliers ou ont des bagages lourds.",
      "Aux personnes âgées ou à mobilité réduite (de plain-pied, mais non spécialement adaptées aux fauteuils roulants).",
      "Aux couples qui veulent plus d’espace qu’une chambre économique, avec le jardin devant la porte.",
      "Aux parents avec un enfant ou à trois amis dans une même chambre.",
    ],
  },
  booking: {
    kicker: "Réservation directe",
    title: "Une chambre au rez-de-chaussée pour vos dates ?",
    text: "Réservez la catégorie rez-de-chaussée en ligne avec le code WELCOME10, ou envoyez-nous vos dates et le nombre de personnes et nous vérifierons les chambres 5 et 7 pour vous.",
    phoneLabel: "Appelez-nous",
    whatsappLabel: "WhatsApp",
    whatsappText: "Bonjour ! Je souhaite une chambre au rez-de-chaussée (5 ou 7) à Voulamandis House. Mes dates sont :",
    note: "Les réservations directes bénéficient de 10 % de réduction avec le code WELCOME10. Petit-déjeuner en option (12 € par adulte et par jour).",
  },
  faq: [
    {
      question: "Les chambres du rez-de-chaussée sont-elles vraiment sans escalier ?",
      answer:
        "Oui. Les chambres 5 et 7 n’ont aucune marche à l’entrée : on y entre directement depuis la cour, et le jardin est juste devant la porte. Ce sont les seules chambres doubles / triples de Voulamandis House sans escalier.",
    },
    {
      question: "Les chambres sont-elles accessibles en fauteuil roulant ?",
      answer:
        "Elles sont de plain-pied mais ne sont pas spécialement adaptées aux utilisateurs de fauteuil roulant. Si votre mobilité est réduite, contactez-nous et nous vous décrirons l’accès et la salle de bain avant la réservation. Aide pour les bagages sur demande.",
    },
    {
      question: "Combien de personnes peuvent dormir dans la chambre 5 ou 7 ?",
      answer:
        "Jusqu’à 3 personnes. Les deux chambres ont un lit double et un canapé-lit. La troisième personne coûte 15 € par nuit. Lit bébé gratuit sur demande.",
    },
    {
      question: "Quelle est la différence entre la chambre 5 et la chambre 7 ?",
      answer:
        "Les deux font environ 30–35 m², en espace ouvert, et donnent sur la cour et le jardin. Les deux ont un lit double et un canapé-lit : elles sont pratiquement équivalentes.",
    },
    {
      question: "Puis-je réserver une chambre précise ?",
      answer:
        "Le système en ligne réserve la catégorie rez-de-chaussée. Si vous souhaitez spécifiquement la chambre 5 ou 7, indiquez-le après la réservation ou via l’AI Room Finder ; nous la confirmons par écrit si elle est disponible.",
    },
    {
      question: "Existe-t-il une option moins chère au rez-de-chaussée ?",
      answer:
        "Oui. La chambre économique 6 est aussi au rez-de-chaussée, sans escalier et avec accès au jardin. Elle est plus petite (environ 16 m²) et accueille 2 personnes dans un lit double.",
    },
    {
      question: "Les chambres du rez-de-chaussée ont-elles une cuisine ?",
      answer:
        "Non. Elles disposent d’un mini-frigo, d’une bouilloire et de café et thé offerts. Pour cuisiner, les chambres 3 et 4 ont une kitchenette et les appartements familiaux une cuisine complète.",
    },
  ],
  related: {
    kicker: "Autres options",
    title: "Comparez avec nos autres chambres",
    first: ["Chambres à l’étage", "Chambres 1, 3 et 4 avec terrasse ou balcon, certaines avec kitchenette."],
    economy: ["Chambres doubles économiques", "Chambres 2 et 6, 16 m², le meilleur prix pour deux."],
    family: ["Appartements familiaux", "Appartements 8–10 avec chambre séparée et cuisine complète."],
    all: ["Toutes les chambres", "Comparez toutes les catégories avec les prix en direct."],
  },
});

/* ------------------------------------------------------------------ DE -- */

export const groundFloorRoomsDe = build("de", {
  seo: {
    title: "Erdgeschoss-Zimmer auf Chios ohne Treppen | Voulamandis House",
    description:
      "Erdgeschoss-Zimmer 5 & 7 in Kambos, Chios: ohne Treppen, direkter Zugang zu Hof und Garten, 30–35 m², bis 3 Gäste. Direkt buchen und 10 % sparen.",
  },
  hero: {
    kicker: "Erdgeschoss-Zimmer auf Chios",
    title: "Zimmer im Erdgeschoss mit Gartenzugang",
    subtitle: "Zimmer 5 & 7 · ohne Treppen · bis 3 Gäste",
    description:
      "Zwei geräumige Doppel- / Dreibettzimmer ebenerdig auf unserem historischen Anwesen in Kambos. Sie treten direkt in den Innenhof und den Zitrusgarten, ganz ohne Eingangsstufen.",
    imageAlt: "Doppel- / Dreibettzimmer im Erdgeschoss auf Chios mit Steinwand und Holzbalken, Voulamandis House, Kambos",
    badges: ["Ohne Treppen", "Gartenzugang", "30–35 m²", "Bis 3 Gäste"],
    bookLabel: "Direkt buchen",
    askLabel: "Verfügbarkeit anfragen",
  },
  overview: {
    kicker: "Auf einen Blick",
    title: "Stufenlose Zimmer auf einem ruhigen Zitrusanwesen",
    paragraphs: [
      "Die Zimmer 5 und 7 sind die Doppel- / Dreibettzimmer im Erdgeschoss des Voulamandis House. Es gibt keine Eingangsstufen: Sie betreten das Zimmer direkt vom Innenhof, Garten und schattige Pergola liegen gleich vor der Tür.",
      "Jedes Zimmer hat ca. 30–35 m², einen offenen Grundriss mit traditionellen Chios-Steinwänden, ein eigenes Bad mit Dusche und Platz für eine dritte Person. Beide Zimmer haben ein Doppelbett und ein Schlafsofa.",
      "Ideal für Paare, die mehr Platz als im Economy-Zimmer möchten, für Freunde, Eltern mit einem Kind, ältere Gäste und alle, die schweres Gepäck haben oder Treppen lieber vermeiden.",
    ],
    highlights: [
      { label: "Gäste", value: "2–3" },
      { label: "Größe", value: "30–35 m²" },
      { label: "Eingangsstufen", value: "0" },
      { label: "Vor der Tür", value: "Hof & Garten" },
    ],
  },
  gallery: {
    kicker: "Fotos",
    title: "Einblick in die Erdgeschoss-Zimmer",
    alts: [
      "Erdgeschoss-Zimmer 7 im Voulamandis House auf Chios mit Steinwand und Holzbalken",
      "Erdgeschoss-Zimmer 5 in Kambos, Chios, mit Sitzecke",
      "Traditionelle Steinwand in einem Erdgeschoss-Zimmer auf Chios",
      "Schattiger Garten vor den Erdgeschoss-Zimmern",
      "Eigenes Bad mit Dusche in einem Erdgeschoss-Zimmer auf Chios",
      "Pergola und Gartentische wenige Schritte von den Zimmern",
    ],
  },
  amenities: {
    kicker: "In jedem Zimmer",
    title: "Ausstattung der Erdgeschoss-Zimmer",
    items: [
      { icon: "🪜", label: "Ohne Treppen", text: "Stufenloser Eingang vom Innenhof." },
      { icon: "🌿", label: "Gartenzugang", text: "Hof, Garten und Pergola direkt vor der Tür." },
      { icon: "❄️", label: "Klimaanlage", text: "Dazu Heizung für Frühling und Herbst." },
      { icon: "📶", label: "Kostenloses WLAN", text: "Im Zimmer und im Garten." },
      { icon: "📺", label: "Smart-TV", text: "Mit Apps wie Netflix und YouTube." },
      { icon: "🧊", label: "Minikühlschrank & Wasserkocher", text: "Kaffee und Tee gratis, täglich aufgefüllt." },
      { icon: "🚿", label: "Eigenes Bad", text: "Dusche, Föhn und Pflegeprodukte." },
      { icon: "🅿️", label: "Kostenloser Parkplatz", text: "Privatparkplatz am Haus, ohne Reservierung." },
    ],
  },
  individual: {
    kicker: "Ihr Zimmer wählen",
    title: "Zimmer 5 und Zimmer 7",
    description:
      "Beide Zimmer liegen im Erdgeschoss mit direktem Zugang zu Hof und Garten. Beide haben dieselbe Bettenaufteilung: ein Doppelbett und ein Schlafsofa für die dritte Person.",
  },
  comparison: {
    kicker: "Im Vergleich",
    title: "Zimmer 5 oder Zimmer 7?",
    note: "Online wird die Kategorie Erdgeschoss gebucht. Wenn Sie ein bestimmtes Zimmer bevorzugen, sagen Sie es uns – wir bestätigen es schriftlich, sofern verfügbar.",
    columns: ["Zimmer 5", "Zimmer 7"],
    rows: [
      { label: "Größe", values: ["≈ 30–35 m²", "≈ 30–35 m²"] },
      { label: "Max. Gäste", values: ["3", "3"] },
      { label: "Betten", values: ["1 Doppelbett + 1 Schlafsofa", "1 Doppelbett + 1 Schlafsofa"] },
      { label: "Grundriss", values: ["Offen", "Offen"] },
      { label: "Zugang", values: ["0 Stufen", "0 Stufen"] },
      { label: "Draußen", values: ["Hof & Garten", "Hof & Garten"] },
      { label: "Küche", values: ["Minikühlschrank & Wasserkocher", "Minikühlschrank & Wasserkocher"] },
      { label: "3. Gast", values: ["+15 € / Nacht", "+15 € / Nacht"] },
    ],
  },
  outdoor: {
    kicker: "Direkt vor Ihrer Tür",
    title: "Innenhof, Pergola und Zitrusgarten",
    paragraphs: [
      "Die Erdgeschoss-Zimmer öffnen sich zum gemeinsamen Innenhof des Anwesens. Wenige Schritte entfernt liegen die schattige Pergola mit Holztischen und Sofas, wo das Frühstück serviert wird, und der Garten mit Zitrus- und Obstbäumen.",
      "Der Garten steht Ihnen jederzeit offen; Sie können eigene Speisen und Getränke mitbringen und die ruhigen Abende in Kambos genießen – unter Beachtung der Ruhezeiten.",
    ],
    alts: [
      "Schattige Pergola und Garten im Voulamandis House in Kambos, Chios",
      "Gartentische unter der Weinlaube neben den Erdgeschoss-Zimmern",
      "Sitzbereich mit Sofas im Innenhof des Voulamandis House",
      "Lounge im Innenhof eines traditionellen Gästehauses auf Chios",
    ],
  },
  bestFor: {
    kicker: "Ideal für",
    title: "Für wen eignen sich die Erdgeschoss-Zimmer?",
    items: [
      "Für Gäste, die Treppen vermeiden möchten oder schweres Gepäck haben.",
      "Für ältere Reisende und Gäste mit eingeschränkter Mobilität (stufenlos, aber nicht speziell rollstuhlgerecht).",
      "Für Paare, die mehr Platz als im Economy-Zimmer und den Garten vor der Tür möchten.",
      "Für Eltern mit einem Kind oder drei Freunde in einem Zimmer.",
    ],
  },
  booking: {
    kicker: "Direktbuchung",
    title: "Ein Erdgeschoss-Zimmer für Ihre Reisedaten?",
    text: "Buchen Sie die Kategorie Erdgeschoss online mit dem Code WELCOME10 oder schicken Sie uns Reisedaten und Personenzahl – wir prüfen Zimmer 5 und 7 für Sie.",
    phoneLabel: "Anrufen",
    whatsappLabel: "WhatsApp",
    whatsappText: "Hallo! Ich interessiere mich für ein Erdgeschoss-Zimmer (5 oder 7) im Voulamandis House. Meine Reisedaten:",
    note: "Direktbuchungen erhalten 10 % Rabatt mit dem Code WELCOME10. Frühstück optional (12 € pro Erwachsenem und Tag).",
  },
  faq: [
    {
      question: "Gibt es wirklich keine Treppen zu den Erdgeschoss-Zimmern?",
      answer:
        "Ja. Zimmer 5 und 7 haben keine Eingangsstufen: Sie betreten sie direkt vom Innenhof, der Garten liegt gleich vor der Tür. Es sind die einzigen Doppel- / Dreibettzimmer im Voulamandis House ohne Treppen.",
    },
    {
      question: "Sind die Erdgeschoss-Zimmer rollstuhlgerecht?",
      answer:
        "Sie sind stufenlos, aber nicht speziell für Rollstuhlfahrer ausgestattet. Bei eingeschränkter Mobilität kontaktieren Sie uns bitte; wir beschreiben Zugang und Bad vor der Buchung genau. Hilfe mit dem Gepäck auf Anfrage.",
    },
    {
      question: "Wie viele Gäste können in Zimmer 5 oder 7 übernachten?",
      answer:
        "Bis zu 3 Gäste. Beide Zimmer haben ein Doppelbett und ein Schlafsofa. Der dritte Gast kostet 15 € pro Nacht. Ein Babybett ist auf Anfrage kostenlos.",
    },
    {
      question: "Was ist der Unterschied zwischen Zimmer 5 und Zimmer 7?",
      answer:
        "Beide haben ca. 30–35 m², einen offenen Grundriss und öffnen sich zu Hof und Garten. Beide haben ein Doppelbett und ein Schlafsofa und sind praktisch gleichwertig.",
    },
    {
      question: "Kann ich ein bestimmtes Erdgeschoss-Zimmer buchen?",
      answer:
        "Online wird die Kategorie Erdgeschoss gebucht. Wenn Sie gezielt Zimmer 5 oder 7 möchten, teilen Sie uns das nach der Buchung oder über den AI Room Finder mit; wir bestätigen es schriftlich, sofern verfügbar.",
    },
    {
      question: "Gibt es eine günstigere Option im Erdgeschoss?",
      answer:
        "Ja. Das Economy-Zimmer 6 liegt ebenfalls im Erdgeschoss, ohne Treppen und mit Gartenzugang. Es ist kleiner (ca. 16 m²) und bietet 2 Gästen ein Doppelbett.",
    },
    {
      question: "Haben die Erdgeschoss-Zimmer eine Küche?",
      answer:
        "Nein. Es gibt einen Minikühlschrank, einen Wasserkocher sowie Kaffee und Tee gratis. Zum Kochen haben die Zimmer 3 und 4 eine Kochnische und die Familienapartments eine voll ausgestattete Küche.",
    },
  ],
  related: {
    kicker: "Weitere Optionen",
    title: "Mit unseren anderen Zimmern vergleichen",
    first: ["Zimmer im Obergeschoss", "Zimmer 1, 3 & 4 mit Terrasse oder Balkon, teils mit Kochnische."],
    economy: ["Economy-Doppelzimmer", "Zimmer 2 & 6, 16 m², die günstigste Wahl für zwei."],
    family: ["Familienapartments", "Apartments 8–10 mit separatem Schlafzimmer und voller Küche."],
    all: ["Alle Zimmer & Apartments", "Alle Kategorien mit Live-Preisen vergleichen."],
  },
});

/* ------------------------------------------------------------------ IT -- */

export const groundFloorRoomsIt = build("it", {
  seo: {
    title: "Camere al piano terra a Chios senza scale | Voulamandis House",
    description:
      "Camere 5 e 7 al piano terra a Kambos, Chios: senza scale, accesso diretto a cortile e giardino, 30–35 m², fino a 3 ospiti. Prenota diretto e risparmia il 10%.",
  },
  hero: {
    kicker: "Camere al piano terra a Chios",
    title: "Camere al piano terra con accesso al giardino",
    subtitle: "Camere 5 e 7 · senza scale · fino a 3 ospiti",
    description:
      "Due spaziose camere doppie / triple al piano terra della nostra storica tenuta di Kambos. Uscite dalla porta direttamente nel cortile e nel giardino di agrumi, senza alcun gradino all’ingresso.",
    imageAlt: "Camera doppia / tripla al piano terra a Chios con muro in pietra e travi in legno, Voulamandis House, Kambos",
    badges: ["Senza scale", "Accesso al giardino", "30–35 m²", "Fino a 3 ospiti"],
    bookLabel: "Prenota diretto",
    askLabel: "Chiedi disponibilità",
  },
  overview: {
    kicker: "In breve",
    title: "Camere senza gradini in una tranquilla tenuta di agrumi",
    paragraphs: [
      "Le camere 5 e 7 sono le doppie / triple al piano terra di Voulamandis House. Non ci sono gradini all’ingresso: si entra direttamente dal cortile, con il giardino e il pergolato ombreggiato appena fuori dalla porta.",
      "Ogni camera misura circa 30–35 m², open space, con muri in pietra tradizionali di Chios, bagno privato con doccia e spazio per un terzo ospite. Entrambe le camere hanno un letto matrimoniale e un divano letto.",
      "Perfette per coppie che vogliono più spazio di una camera economica, amici, genitori con un bambino, ospiti anziani e chiunque abbia bagagli pesanti o preferisca evitare le scale.",
    ],
    highlights: [
      { label: "Ospiti", value: "2–3" },
      { label: "Metratura", value: "30–35 m²" },
      { label: "Gradini", value: "0" },
      { label: "Fuori dalla porta", value: "Cortile & giardino" },
    ],
  },
  gallery: {
    kicker: "Foto",
    title: "Dentro le camere al piano terra",
    alts: [
      "Camera 7 al piano terra di Voulamandis House a Chios con muro in pietra e travi in legno",
      "Camera 5 al piano terra a Kambos, Chios, con angolo salotto",
      "Muro in pietra tradizionale in una camera al piano terra a Chios",
      "Giardino ombreggiato davanti alle camere al piano terra",
      "Bagno privato con doccia in una camera al piano terra a Chios",
      "Pergolato e tavoli in giardino a pochi passi dalle camere",
    ],
  },
  amenities: {
    kicker: "In ogni camera",
    title: "Cosa includono le camere al piano terra",
    items: [
      { icon: "🪜", label: "Senza scale", text: "Ingresso senza gradini dal cortile." },
      { icon: "🌿", label: "Accesso al giardino", text: "Cortile, giardino e pergolato appena fuori." },
      { icon: "❄️", label: "Aria condizionata", text: "E riscaldamento in primavera e autunno." },
      { icon: "📶", label: "WiFi gratuito", text: "In camera e in giardino." },
      { icon: "📺", label: "Smart TV", text: "Con app come Netflix e YouTube." },
      { icon: "🧊", label: "Frigobar & bollitore", text: "Caffè e tè omaggio, riforniti ogni giorno." },
      { icon: "🚿", label: "Bagno privato", text: "Doccia, asciugacapelli e set di cortesia." },
      { icon: "🅿️", label: "Parcheggio gratuito", text: "Privato nella struttura, senza prenotazione." },
    ],
  },
  individual: {
    kicker: "Scegli la camera",
    title: "Camera 5 e camera 7",
    description:
      "Entrambe le camere sono al piano terra con accesso diretto a cortile e giardino. Hanno la stessa disposizione: un letto matrimoniale e un divano letto per il terzo ospite.",
  },
  comparison: {
    kicker: "A confronto",
    title: "Camera 5 o camera 7?",
    note: "La prenotazione online blocca la categoria piano terra; se preferisci una camera precisa, dicci quale e la confermeremo per iscritto se disponibile.",
    columns: ["Camera 5", "Camera 7"],
    rows: [
      { label: "Metratura", values: ["≈ 30–35 m²", "≈ 30–35 m²"] },
      { label: "Ospiti max", values: ["3", "3"] },
      { label: "Letti", values: ["1 matrimoniale + 1 divano letto", "1 matrimoniale + 1 divano letto"] },
      { label: "Disposizione", values: ["Open space", "Open space"] },
      { label: "Accesso", values: ["0 gradini", "0 gradini"] },
      { label: "Esterno", values: ["Cortile & giardino", "Cortile & giardino"] },
      { label: "Cucina", values: ["Frigobar & bollitore", "Frigobar & bollitore"] },
      { label: "3° ospite", values: ["+15 € / notte", "+15 € / notte"] },
    ],
  },
  outdoor: {
    kicker: "Appena fuori dalla porta",
    title: "Il cortile, il pergolato e il giardino di agrumi",
    paragraphs: [
      "Le camere al piano terra si aprono sul cortile comune della tenuta. A pochi passi ci sono il pergolato ombreggiato con tavoli in legno e divani, dove si serve la colazione, e il giardino con agrumi e alberi da frutto.",
      "Il giardino è sempre a disposizione degli ospiti: potete portare cibo e bevande e godervi le serate tranquille di Kambos, nel rispetto delle ore di silenzio.",
    ],
    alts: [
      "Pergolato ombreggiato e giardino a Voulamandis House a Kambos, Chios",
      "Tavoli da giardino sotto la pergola di vite accanto alle camere",
      "Salotto esterno con divani nel cortile di Voulamandis House",
      "Area relax nel cortile di una casa tradizionale a Chios",
    ],
  },
  bestFor: {
    kicker: "Ideali per",
    title: "A chi sono adatte le camere al piano terra?",
    items: [
      "A chi preferisce evitare le scale o viaggia con bagagli pesanti.",
      "A viaggiatori anziani e ospiti con mobilità ridotta (senza gradini, ma non specificamente attrezzate per sedie a rotelle).",
      "Alle coppie che vogliono più spazio di una camera economica, con il giardino davanti alla porta.",
      "A genitori con un bambino o a tre amici in una camera.",
    ],
  },
  booking: {
    kicker: "Prenotazione diretta",
    title: "Vuoi una camera al piano terra per le tue date?",
    text: "Prenota online la categoria piano terra con il codice WELCOME10, oppure scrivici date e numero di ospiti e verificheremo per te le camere 5 e 7.",
    phoneLabel: "Chiamaci",
    whatsappLabel: "WhatsApp",
    whatsappText: "Buongiorno! Vorrei una camera al piano terra (5 o 7) a Voulamandis House. Le mie date sono:",
    note: "Le prenotazioni dirette hanno il 10% di sconto con il codice WELCOME10. Colazione facoltativa (12 € per adulto al giorno).",
  },
  faq: [
    {
      question: "Le camere al piano terra sono davvero senza scale?",
      answer:
        "Sì. Le camere 5 e 7 non hanno gradini all’ingresso: si entra direttamente dal cortile e il giardino è appena fuori dalla porta. Sono le uniche doppie / triple di Voulamandis House senza scale.",
    },
    {
      question: "Le camere sono accessibili in sedia a rotelle?",
      answer:
        "Sono senza gradini, ma non sono specificamente attrezzate per utenti in sedia a rotelle. Se hai mobilità ridotta contattaci: ti descriveremo accesso e bagno prima della prenotazione. Aiuto con i bagagli su richiesta.",
    },
    {
      question: "Quanti ospiti possono dormire nella camera 5 o 7?",
      answer:
        "Fino a 3 ospiti. Le camere 5 e 7 hanno entrambe un matrimoniale e un divano letto. Il terzo ospite costa 15 € a notte. Culla gratuita su richiesta.",
    },
    {
      question: "Qual è la differenza tra camera 5 e camera 7?",
      answer:
        "Entrambe misurano circa 30–35 m², sono open space e si aprono su cortile e giardino. Entrambe hanno un matrimoniale e un divano letto: sono praticamente equivalenti.",
    },
    {
      question: "Posso prenotare una camera specifica al piano terra?",
      answer:
        "Il sistema online prenota la categoria piano terra. Se desideri proprio la camera 5 o 7, comunicacelo dopo la prenotazione o tramite l’AI Room Finder; la confermiamo per iscritto se disponibile.",
    },
    {
      question: "C’è un’opzione più economica al piano terra?",
      answer:
        "Sì. La camera economica 6 è anch’essa al piano terra, senza scale e con accesso al giardino. È più piccola (circa 16 m²) e ospita 2 persone in un letto matrimoniale.",
    },
    {
      question: "Le camere al piano terra hanno una cucina?",
      answer:
        "No. Hanno frigobar, bollitore e caffè e tè omaggio. Per cucinare, le camere 3 e 4 hanno un angolo cottura e gli appartamenti familiari una cucina completa.",
    },
  ],
  related: {
    kicker: "Altre opzioni",
    title: "Confronta con le altre camere",
    first: ["Camere al primo piano", "Camere 1, 3 e 4 con terrazza o balcone, alcune con angolo cottura."],
    economy: ["Camere doppie economiche", "Camere 2 e 6, 16 m², la scelta più conveniente per due."],
    family: ["Appartamenti familiari", "Appartamenti 8–10 con camera separata e cucina completa."],
    all: ["Tutte le camere e gli appartamenti", "Confronta tutte le categorie con i prezzi live."],
  },
});

/* ------------------------------------------------------------------ ES -- */

export const groundFloorRoomsEs = build("es", {
  seo: {
    title: "Habitaciones en planta baja en Quíos sin escaleras | Voulamandis House",
    description:
      "Habitaciones 5 y 7 en planta baja en Kambos, Quíos: sin escaleras, acceso directo al patio y al jardín, 30–35 m², hasta 3 personas. Reserva directa con 10% dto.",
  },
  hero: {
    kicker: "Habitaciones en planta baja en Quíos",
    title: "Habitaciones en planta baja con acceso al jardín",
    subtitle: "Habitaciones 5 y 7 · sin escaleras · hasta 3 personas",
    description:
      "Dos amplias habitaciones dobles / triples a pie de calle en nuestra finca histórica de Kambos. Sales por la puerta directamente al patio y al jardín de cítricos, sin ningún escalón en la entrada.",
    imageAlt: "Habitación doble / triple en planta baja en Quíos con pared de piedra y vigas de madera, Voulamandis House, Kambos",
    badges: ["Sin escaleras", "Acceso al jardín", "30–35 m²", "Hasta 3 personas"],
    bookLabel: "Reservar directo",
    askLabel: "Consultar disponibilidad",
  },
  overview: {
    kicker: "De un vistazo",
    title: "Habitaciones sin escalones en una tranquila finca de cítricos",
    paragraphs: [
      "Las habitaciones 5 y 7 son las dobles / triples de la planta baja de Voulamandis House. No hay escalones en la entrada: se entra directamente desde el patio, con el jardín y la pérgola con sombra justo delante de la puerta.",
      "Cada habitación tiene unos 30–35 m², espacio abierto con paredes de piedra tradicionales de Quíos, baño privado con ducha y sitio para una tercera persona. Las dos habitaciones tienen una cama doble y un sofá cama.",
      "Son ideales para parejas que quieren más espacio que en una habitación económica, amigos, padres con un niño, viajeros mayores y cualquiera con equipaje pesado o que prefiera evitar escaleras.",
    ],
    highlights: [
      { label: "Personas", value: "2–3" },
      { label: "Superficie", value: "30–35 m²" },
      { label: "Escalones", value: "0" },
      { label: "En la puerta", value: "Patio y jardín" },
    ],
  },
  gallery: {
    kicker: "Fotos",
    title: "Dentro de las habitaciones en planta baja",
    alts: [
      "Habitación 7 en planta baja de Voulamandis House en Quíos con pared de piedra y vigas",
      "Habitación 5 en planta baja en Kambos, Quíos, con zona de estar",
      "Pared de piedra tradicional en una habitación en planta baja en Quíos",
      "Jardín con sombra frente a las habitaciones en planta baja",
      "Baño privado con ducha en una habitación en planta baja en Quíos",
      "Pérgola y mesas del jardín a pocos pasos de las habitaciones",
    ],
  },
  amenities: {
    kicker: "En cada habitación",
    title: "Qué incluyen las habitaciones en planta baja",
    items: [
      { icon: "🪜", label: "Sin escaleras", text: "Entrada sin escalones desde el patio." },
      { icon: "🌿", label: "Acceso al jardín", text: "Patio, jardín y pérgola justo fuera." },
      { icon: "❄️", label: "Aire acondicionado", text: "Y calefacción en primavera y otoño." },
      { icon: "📶", label: "WiFi gratis", text: "En la habitación y en el jardín." },
      { icon: "📺", label: "Smart TV", text: "Con apps como Netflix y YouTube." },
      { icon: "🧊", label: "Mininevera y hervidor", text: "Café y té gratis, repuestos a diario." },
      { icon: "🚿", label: "Baño privado", text: "Ducha, secador y artículos de aseo." },
      { icon: "🅿️", label: "Aparcamiento gratis", text: "Privado en el alojamiento, sin reserva." },
    ],
  },
  individual: {
    kicker: "Elige tu habitación",
    title: "Habitación 5 y habitación 7",
    description:
      "Las dos habitaciones están en planta baja con acceso directo al patio y al jardín. Tienen la misma distribución: una cama doble y un sofá cama para la tercera persona.",
  },
  comparison: {
    kicker: "Lado a lado",
    title: "¿Habitación 5 o habitación 7?",
    note: "La reserva online bloquea la categoría planta baja; si prefieres una habitación concreta, dínoslo y la confirmaremos por escrito si está disponible.",
    columns: ["Habitación 5", "Habitación 7"],
    rows: [
      { label: "Superficie", values: ["≈ 30–35 m²", "≈ 30–35 m²"] },
      { label: "Máx. personas", values: ["3", "3"] },
      { label: "Camas", values: ["1 doble + 1 sofá cama", "1 doble + 1 sofá cama"] },
      { label: "Distribución", values: ["Espacio abierto", "Espacio abierto"] },
      { label: "Acceso", values: ["0 escalones", "0 escalones"] },
      { label: "Exterior", values: ["Patio y jardín", "Patio y jardín"] },
      { label: "Cocina", values: ["Mininevera y hervidor", "Mininevera y hervidor"] },
      { label: "3.ª persona", values: ["+15 € / noche", "+15 € / noche"] },
    ],
  },
  outdoor: {
    kicker: "Justo delante de tu puerta",
    title: "El patio, la pérgola y el jardín de cítricos",
    paragraphs: [
      "Las habitaciones en planta baja dan al patio común de la finca. A pocos pasos están la pérgola con sombra, mesas de madera y sofás, donde se sirve el desayuno, y el jardín con cítricos y frutales.",
      "Puedes usar el jardín en cualquier momento, traer tu propia comida y bebida y disfrutar de las noches tranquilas de Kambos, respetando las horas de descanso.",
    ],
    alts: [
      "Pérgola con sombra y jardín en Voulamandis House en Kambos, Quíos",
      "Mesas de jardín bajo la parra junto a las habitaciones en planta baja",
      "Zona de estar con sofás en el patio de Voulamandis House",
      "Salón exterior en el patio de un alojamiento tradicional en Quíos",
    ],
  },
  bestFor: {
    kicker: "Ideales para",
    title: "¿Para quién son las habitaciones en planta baja?",
    items: [
      "Para quienes prefieren evitar escaleras o viajan con equipaje pesado.",
      "Para viajeros mayores y personas con movilidad reducida (sin escalones, pero no adaptadas específicamente para silla de ruedas).",
      "Para parejas que quieren más espacio que en una habitación económica, con el jardín en la puerta.",
      "Para padres con un niño o tres amigos en una misma habitación.",
    ],
  },
  booking: {
    kicker: "Reserva directa",
    title: "¿Quieres una habitación en planta baja para tus fechas?",
    text: "Reserva online la categoría planta baja con el código WELCOME10, o escríbenos tus fechas y número de personas y comprobaremos las habitaciones 5 y 7 por ti.",
    phoneLabel: "Llámanos",
    whatsappLabel: "WhatsApp",
    whatsappText: "¡Hola! Me gustaría una habitación en planta baja (5 o 7) en Voulamandis House. Mis fechas son:",
    note: "Las reservas directas tienen un 10% de descuento con el código WELCOME10. Desayuno opcional (12 € por adulto y día).",
  },
  faq: [
    {
      question: "¿Las habitaciones en planta baja no tienen ninguna escalera?",
      answer:
        "Así es. Las habitaciones 5 y 7 no tienen escalones de entrada: se entra directamente desde el patio y el jardín está justo delante de la puerta. Son las únicas dobles / triples de Voulamandis House sin escaleras.",
    },
    {
      question: "¿Son accesibles en silla de ruedas?",
      answer:
        "No tienen escalones, pero no están adaptadas específicamente para usuarios de silla de ruedas. Si tienes movilidad reducida, contáctanos y te describiremos el acceso y el baño antes de reservar. Ayuda con el equipaje bajo petición.",
    },
    {
      question: "¿Cuántas personas caben en la habitación 5 o 7?",
      answer:
        "Hasta 3 personas. Las habitaciones 5 y 7 tienen cama doble y sofá cama. La tercera persona paga 15 € por noche. Cuna gratis bajo petición.",
    },
    {
      question: "¿Qué diferencia hay entre la habitación 5 y la 7?",
      answer:
        "Ambas tienen unos 30–35 m², espacio abierto y salida al patio y al jardín. Las dos tienen cama doble y sofá cama, así que son prácticamente equivalentes.",
    },
    {
      question: "¿Puedo reservar una habitación concreta?",
      answer:
        "El sistema online reserva la categoría planta baja. Si quieres específicamente la habitación 5 o la 7, indícalo tras reservar o pídelo con el AI Room Finder; la confirmamos por escrito si está disponible.",
    },
    {
      question: "¿Hay una opción más económica en planta baja?",
      answer:
        "Sí. La habitación económica 6 también está en planta baja, sin escaleras y con acceso al jardín. Es más pequeña (unos 16 m²) y aloja a 2 personas en una cama doble.",
    },
    {
      question: "¿Tienen cocina las habitaciones en planta baja?",
      answer:
        "No. Tienen mininevera, hervidor y café y té gratis. Para cocinar, las habitaciones 3 y 4 tienen kitchenette y los apartamentos familiares cocina completa.",
    },
  ],
  related: {
    kicker: "Otras opciones",
    title: "Compara con nuestras otras habitaciones",
    first: ["Habitaciones en primera planta", "Habitaciones 1, 3 y 4 con terraza o balcón, algunas con kitchenette."],
    economy: ["Habitaciones dobles económicas", "Habitaciones 2 y 6, 16 m², lo más económico para dos."],
    family: ["Apartamentos familiares", "Apartamentos 8–10 con dormitorio aparte y cocina completa."],
    all: ["Todas las habitaciones", "Compara todas las categorías con precios en directo."],
  },
});

/* ------------------------------------------------------------------ TR -- */

export const groundFloorRoomsTr = build("tr", {
  seo: {
    title: "Sakız Adası Merdivensiz Zemin Kat Odaları | Voulamandis House",
    description:
      "Kambos, Sakız Adası’nda zemin kat odaları 5 ve 7: merdivensiz, avlu ve bahçeye doğrudan erişim, 30–35 m², 3 kişiye kadar. Direkt rezervasyonda %10 indirim.",
  },
  hero: {
    kicker: "Sakız Adası zemin kat odaları",
    title: "Bahçeye açılan zemin kat odaları",
    subtitle: "Oda 5 ve 7 · merdivensiz · 3 kişiye kadar",
    description:
      "Kambos’taki tarihi çiftliğimizin zemin katında iki geniş çift / üç kişilik oda. Kapınızdan doğrudan avluya ve narenciye bahçesine çıkarsınız; girişte hiç basamak yoktur.",
    imageAlt: "Sakız Adası’nda taş duvarlı ve ahşap kirişli zemin kat çift / üç kişilik oda, Voulamandis House, Kambos",
    badges: ["Merdivensiz", "Bahçe erişimi", "30–35 m²", "3 kişiye kadar"],
    bookLabel: "Direkt rezervasyon",
    askLabel: "Müsaitlik sorun",
  },
  overview: {
    kicker: "Kısaca",
    title: "Sakin bir narenciye çiftliğinde basamaksız odalar",
    paragraphs: [
      "Oda 5 ve 7, Voulamandis House’un zemin kattaki çift / üç kişilik odalarıdır. Girişte basamak yoktur: odaya doğrudan avludan girersiniz; bahçe ve gölgeli pergola kapınızın hemen önündedir.",
      "Her oda yaklaşık 30–35 m², açık planlı, geleneksel Sakız taş duvarlı, duşlu özel banyolu ve üçüncü kişi için yeterince geniştir. İki odada da bir çift kişilik yatak ve bir çekyat bulunur.",
      "Ekonomik odadan daha fazla alan isteyen çiftler, arkadaş grupları, bir çocuklu aileler, yaşlı misafirler ve ağır bavulu olan ya da merdivenden kaçınmak isteyen herkes için idealdir.",
    ],
    highlights: [
      { label: "Misafir", value: "2–3" },
      { label: "Büyüklük", value: "30–35 m²" },
      { label: "Giriş basamağı", value: "0" },
      { label: "Kapının önünde", value: "Avlu ve bahçe" },
    ],
  },
  gallery: {
    kicker: "Fotoğraflar",
    title: "Zemin kat odalarından görüntüler",
    alts: [
      "Sakız Adası Voulamandis House zemin kat Oda 7, taş duvar ve ahşap kirişler",
      "Kambos, Sakız Adası’nda oturma alanlı zemin kat Oda 5",
      "Sakız Adası’nda zemin kat odasında geleneksel taş duvar",
      "Zemin kat odalarının önündeki gölgeli bahçe",
      "Sakız Adası’nda zemin kat odasında duşlu özel banyo",
      "Odalara birkaç adım mesafede pergola ve bahçe masaları",
    ],
  },
  amenities: {
    kicker: "Her odada",
    title: "Zemin kat odalarında neler var?",
    items: [
      { icon: "🪜", label: "Merdivensiz", text: "Avludan basamaksız giriş." },
      { icon: "🌿", label: "Bahçe erişimi", text: "Avlu, bahçe ve pergola hemen kapının önünde." },
      { icon: "❄️", label: "Klima", text: "İlkbahar ve sonbahar için ısıtma da var." },
      { icon: "📶", label: "Ücretsiz WiFi", text: "Odada ve bahçede." },
      { icon: "📺", label: "Smart TV", text: "Netflix ve YouTube gibi uygulamalarla." },
      { icon: "🧊", label: "Mini buzdolabı ve su ısıtıcı", text: "Ücretsiz kahve ve çay, her gün yenilenir." },
      { icon: "🚿", label: "Özel banyo", text: "Duş, saç kurutma makinesi ve banyo ürünleri." },
      { icon: "🅿️", label: "Ücretsiz otopark", text: "Tesiste özel otopark, rezervasyon gerekmez." },
    ],
  },
  individual: {
    kicker: "Odanızı seçin",
    title: "Oda 5 ve Oda 7",
    description:
      "İki oda da zemin kattadır ve avlu ile bahçeye doğrudan açılır. Yatak düzenleri aynıdır: bir çift kişilik yatak ve üçüncü kişi için bir çekyat.",
  },
  comparison: {
    kicker: "Yan yana",
    title: "Oda 5 mi, Oda 7 mi?",
    note: "Online rezervasyon zemin kat kategorisini ayırır; belirli bir odayı tercih ediyorsanız bize yazın, müsaitse yazılı olarak onaylayalım.",
    columns: ["Oda 5", "Oda 7"],
    rows: [
      { label: "Büyüklük", values: ["≈ 30–35 m²", "≈ 30–35 m²"] },
      { label: "Maks. misafir", values: ["3", "3"] },
      { label: "Yataklar", values: ["1 çift + 1 çekyat", "1 çift + 1 çekyat"] },
      { label: "Düzen", values: ["Açık plan", "Açık plan"] },
      { label: "Erişim", values: ["0 basamak", "0 basamak"] },
      { label: "Dış alan", values: ["Avlu ve bahçe", "Avlu ve bahçe"] },
      { label: "Mutfak", values: ["Mini buzdolabı ve su ısıtıcı", "Mini buzdolabı ve su ısıtıcı"] },
      { label: "3. kişi", values: ["+15 € / gece", "+15 € / gece"] },
    ],
  },
  outdoor: {
    kicker: "Kapınızın hemen önünde",
    title: "Avlu, pergola ve narenciye bahçesi",
    paragraphs: [
      "Zemin kat odaları çiftliğin ortak avlusuna açılır. Birkaç adım ötede kahvaltının servis edildiği ahşap masalı ve kanepeli gölgeli pergola ile narenciye ve meyve ağaçlarıyla dolu bahçe bulunur.",
      "Bahçeyi dilediğiniz zaman kullanabilir, kendi yiyecek ve içeceklerinizi getirebilir ve sessizlik saatlerine uyarak Kambos’un sakin akşamlarının tadını çıkarabilirsiniz.",
    ],
    alts: [
      "Kambos, Sakız Adası’ndaki Voulamandis House’ta gölgeli pergola ve bahçe",
      "Zemin kat odalarının yanında asma altında bahçe masaları",
      "Voulamandis House avlusunda kanepeli oturma alanı",
      "Sakız Adası’nda geleneksel bir konukevinin avlusunda dış mekân salonu",
    ],
  },
  bestFor: {
    kicker: "Kimler için ideal?",
    title: "Zemin kat odaları kimlere uygun?",
    items: [
      "Merdivenden kaçınmak isteyen veya ağır bavulla seyahat edenlere.",
      "Yaşlı misafirlere ve hareket kısıtlılığı olanlara (basamaksız, ancak tekerlekli sandalyeye özel uyarlanmamıştır).",
      "Ekonomik odadan daha fazla alan ve kapısında bahçe isteyen çiftlere.",
      "Bir çocuklu ailelere veya aynı odada kalacak üç arkadaşa.",
    ],
  },
  booking: {
    kicker: "Direkt rezervasyon",
    title: "Tarihleriniz için zemin kat odası mı istiyorsunuz?",
    text: "Zemin kat kategorisini WELCOME10 koduyla online rezerve edin ya da tarihlerinizi ve kişi sayısını bize yazın; Oda 5 ve 7’yi sizin için kontrol edelim.",
    phoneLabel: "Bizi arayın",
    whatsappLabel: "WhatsApp",
    whatsappText: "Merhaba! Voulamandis House’ta zemin kat odası (5 veya 7) istiyorum. Tarihlerim:",
    note: "Direkt rezervasyonlarda WELCOME10 koduyla %10 indirim. Kahvaltı isteğe bağlıdır (yetişkin başına günlük 12 €).",
  },
  faq: [
    {
      question: "Zemin kat odalarında gerçekten hiç merdiven yok mu?",
      answer:
        "Evet. Oda 5 ve 7’nin girişinde basamak yoktur: odaya doğrudan avludan girilir ve bahçe kapının hemen önündedir. Voulamandis House’un merdivensiz tek çift / üç kişilik odalarıdır.",
    },
    {
      question: "Zemin kat odaları tekerlekli sandalyeye uygun mu?",
      answer:
        "Basamaksızdır ancak tekerlekli sandalye kullanıcıları için özel olarak uyarlanmamıştır. Hareket kısıtlılığınız varsa bize ulaşın; rezervasyondan önce girişi ve banyoyu ayrıntılı anlatalım. İstek üzerine bavul yardımı sağlanır.",
    },
    {
      question: "Oda 5 veya Oda 7’de kaç kişi kalabilir?",
      answer:
        "3 kişiye kadar. Oda 5 ve Oda 7’de çift kişilik yatak ve çekyat vardır. Üçüncü kişi için gecelik 15 € ücret alınır. Bebek yatağı istek üzerine ücretsizdir.",
    },
    {
      question: "Oda 5 ile Oda 7 arasındaki fark nedir?",
      answer:
        "İkisi de yaklaşık 30–35 m², açık planlıdır ve avlu ile bahçeye açılır. İkisinde de çift kişilik yatak ve çekyat vardır; pratikte eşdeğerdir.",
    },
    {
      question: "Belirli bir zemin kat odasını rezerve edebilir miyim?",
      answer:
        "Online sistem zemin kat kategorisini rezerve eder. Özellikle Oda 5 veya 7’yi istiyorsanız rezervasyondan sonra bize bildirin veya AI Room Finder üzerinden talep edin; müsaitse yazılı olarak onaylarız.",
    },
    {
      question: "Daha uygun fiyatlı bir zemin kat seçeneği var mı?",
      answer:
        "Evet. Ekonomik Oda 6 da zemin kattadır, merdivensizdir ve bahçeye erişimi vardır. Daha küçüktür (yaklaşık 16 m²) ve tek çift kişilik yatakta 2 kişi kalır.",
    },
    {
      question: "Zemin kat odalarında mutfak var mı?",
      answer:
        "Hayır. Mini buzdolabı, su ısıtıcı ve ücretsiz kahve ve çay vardır. Yemek yapmak isterseniz Oda 3 ve 4’te mini mutfak, aile apartlarında tam mutfak bulunur.",
    },
  ],
  related: {
    kicker: "Diğer seçenekler",
    title: "Diğer odalarımızla karşılaştırın",
    first: ["Üst kat odaları", "Teraslı veya balkonlu Oda 1, 3 ve 4; bazılarında mini mutfak."],
    economy: ["Ekonomik çift kişilik odalar", "Oda 2 ve 6, 16 m², iki kişi için en uygun seçenek."],
    family: ["Aile apartları", "Ayrı yatak odalı ve tam mutfaklı Apart 8–10."],
    all: ["Tüm odalar ve apartlar", "Tüm kategorileri canlı fiyatlarla karşılaştırın."],
  },
});

export const groundFloorRoomsByLanguage: Record<Lang, RoomDetailData> = {
  en: groundFloorRoomsEn,
  el: groundFloorRoomsEl,
  fr: groundFloorRoomsFr,
  de: groundFloorRoomsDe,
  it: groundFloorRoomsIt,
  es: groundFloorRoomsEs,
  tr: groundFloorRoomsTr,
};
