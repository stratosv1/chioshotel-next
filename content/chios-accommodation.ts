export type ChiosAccommodationCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  facts: string[];
};

export type ChiosAccommodationPageData = {
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
    ogImageAlt: string;
  };
  hero: {
    kicker: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    aiCta: { label: string; href: string };
  };
  highlights: { label: string; value: string }[];
  intro: {
    kicker: string;
    title: string;
    paragraphs: string[];
    factsTitle: string;
    facts: string[];
  };
  rooms: {
    kicker: string;
    title: string;
    description: string;
    cards: ChiosAccommodationCard[];
  };
  location: {
    kicker: string;
    title: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
    distances: { label: string; value: string; note: string }[];
    mapCta: { label: string; href: string };
    guideCta: { label: string; href: string };
  };
  reasons: {
    kicker: string;
    title: string;
    description: string;
    items: { icon: string; title: string; text: string }[];
  };
  travelerTypes: {
    kicker: string;
    title: string;
    items: { title: string; text: string }[];
  };
  directBooking: {
    kicker: string;
    title: string;
    paragraphs: string[];
    benefits: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    whatsappCta: { label: string; href: string };
  };
  explore: {
    kicker: string;
    title: string;
    description: string;
    links: { title: string; text: string; href: string }[];
  };
  faq: {
    kicker: string;
    title: string;
    items: { question: string; answer: string }[];
  };
  finalCta: {
    kicker: string;
    title: string;
    text: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
};

const heroImage =
  "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

export const chiosAccommodationPageEn: ChiosAccommodationPageData = {
  seo: {
    canonicalPath: "/chios-accommodation/",
    title: "Chios Accommodation | Rooms & Apartments in Kambos",
    description:
      "Stay at Voulamandis House in Kambos, Chios: peaceful rooms and family apartments near Chios Town, the airport and beaches. Check direct availability.",
    ogImage: heroImage,
    ogImageAlt:
      "Voulamandis House accommodation among citrus gardens in Kambos, Chios",
  },
  hero: {
    kicker: "FAMILY-RUN ACCOMMODATION • KAMBOS CHIOS",
    title: "Chios accommodation with the calm and character of Kambos",
    description:
      "Voulamandis House offers peaceful rooms and family apartments in the historic citrus-growing area of Kambos. Stay close to Chios Town, the airport and the port while enjoying a quieter base with gardens, personal hospitality and practical room choices for couples and families.",
    image: heroImage,
    imageAlt:
      "Voulamandis House rooms and apartments in the citrus estate area of Kambos, Chios",
    primaryCta: {
      label: "Explore rooms & apartments",
      href: "/chios-rooms/",
    },
    secondaryCta: {
      label: "Check direct availability",
      href: "/chios-hotels-rates/",
    },
    aiCta: {
      label: "Find the right room with AI",
      href: "/ai-assistant/?lang=en",
    },
  },
  highlights: [
    { label: "Setting", value: "Historic Kambos" },
    { label: "Airport", value: "3 km" },
    { label: "Chios port", value: "6 km" },
    { label: "Stay options", value: "Rooms & apartments" },
    { label: "For", value: "Couples & families" },
    { label: "Atmosphere", value: "Garden & citrus estate" },
  ],
  intro: {
    kicker: "A PERSONAL PLACE TO STAY",
    title: "A smaller, more personal alternative for your stay in Chios",
    paragraphs: [
      "Choosing accommodation in Chios is not only about finding a bed for the night. The location you choose shapes the pace of your holiday, the routes you take each day and the way you experience the island. Voulamandis House is based in Kambos, a historic residential area of citrus estates, stone walls and old mansions just outside Chios Town. It gives guests a peaceful place to return to without placing them far from the island’s main transport connections.",
      "Voulamandis House is a family-run guest accommodation, not a large resort or city hotel. The property offers a small collection of economy double rooms, ground-floor rooms, first-floor rooms and family apartments. This makes it possible to choose according to budget, number of guests, preferred floor, need for easy access and whether a kitchen or extra living space matters to your stay.",
      "The experience is deliberately straightforward and personal. Guests have direct contact with the people who know the property, the room layouts and Chios itself. You can ask which room is most suitable, check current availability, arrange breakfast on request and receive local suggestions for beaches, villages and routes around the island.",
    ],
    factsTitle: "Voulamandis House at a glance",
    facts: [
      "Family-run rooms and apartments in Kambos, Chios",
      "Economy, ground-floor and first-floor room choices",
      "Family apartments with a full kitchen and living area",
      "Free Wi-Fi, air conditioning, private bathroom, TV and fridge",
      "Garden, terrace areas and parking available for guests",
      "Breakfast in the garden available on request",
      "Direct contact by phone, WhatsApp or email",
    ],
  },
  rooms: {
    kicker: "ROOMS & APARTMENTS",
    title: "Choose the Chios accommodation that fits your trip",
    description:
      "The accommodation is organised into clear categories, so you can compare space, access, floor and facilities before checking availability. The room pages show the individual layouts and photographs in more detail.",
    cards: [
      {
        id: "economy-double",
        eyebrow: "BEST VALUE FOR TWO",
        title: "Economy double rooms",
        description:
          "A practical choice for two guests who want a comfortable base in Kambos at the lowest room category. The renovated rooms are approximately 16 m² and include the essentials for a relaxed stay, including air conditioning, Wi-Fi, a private bathroom, television and fridge.",
        href: "/chios-rooms/economy-double-rooms/",
        image: "/images/rooms/received_1753964631359257.webp",
        imageAlt:
          "Economy double room at Voulamandis House accommodation in Chios",
        facts: ["2 guests", "Approx. 16 m²", "Double bed", "Value choice"],
      },
      {
        id: "ground-floor",
        eyebrow: "EASY ACCESS & COURTYARD",
        title: "Ground-floor double and triple rooms",
        description:
          "These rooms suit couples, friends or a small family who prefer to avoid stairs and enjoy direct access towards the courtyard and garden. Depending on the room, they can accommodate two or three guests and provide a calm outdoor connection that works especially well during the warmer months.",
        href: "/chios-rooms/standard-double-room/",
        image: "/images/rooms/double-triple-room.jpg",
        imageAlt:
          "Ground-floor room with garden access at Voulamandis House in Kambos",
        facts: ["2–3 guests", "No stairs", "Garden access", "Fridge & A/C"],
      },
      {
        id: "first-floor",
        eyebrow: "LIGHT, TERRACE & VIEWS",
        title: "First-floor double and triple rooms",
        description:
          "The first-floor rooms are a good match for guests who prefer a brighter upper-floor setting and access to the shared terrace overlooking the citrus estate. Capacity varies by room, and selected rooms include a small kitchenette for added flexibility during the stay.",
        href: "/chios-rooms/standard-double-room/",
        image: "/images/rooms/DSC07776-2-e1675109942622.webp",
        imageAlt:
          "First-floor room with citrus estate view at Voulamandis House Chios",
        facts: ["2–4 guests", "First floor", "Shared terrace", "Selected kitchenettes"],
      },
      {
        id: "family-apartments",
        eyebrow: "MORE SPACE FOR FAMILIES",
        title: "Family apartments in Chios",
        description:
          "The 40–45 m² apartments are the most spacious option at Voulamandis House. They include a separate bedroom, living area and full kitchen, giving families or small groups room to organise meals, rest between outings and settle into a more home-like rhythm for several nights.",
        href: "/chios-rooms/family-chios-apartments/",
        image: "/images/rooms/chios-apartments-voulamandis.webp",
        imageAlt:
          "Family apartment with kitchen at Voulamandis House in Chios",
        facts: ["Up to 4 guests", "40–45 m²", "Full kitchen", "Living area"],
      },
    ],
  },
  location: {
    kicker: "WHY STAY IN KAMBOS",
    title: "Peaceful accommodation close to Chios Town and the airport",
    paragraphs: [
      "Kambos—also commonly written Kampos—is one of the most distinctive areas of Chios. Behind its high stone walls are citrus orchards, courtyards, wells and historic mansions that reflect an important part of the island’s architectural and agricultural history. Staying here feels different from staying in a busy town-centre street or a remote beach resort.",
      "The area works well as a base because it combines atmosphere with practical access. Voulamandis House is about 3 km from Chios Airport and 6 km from the port. Chios Town is within easy reach for restaurants, shopping, the waterfront and ferry connections, while roads from Kambos lead naturally towards the southern beaches and the medieval mastic villages.",
      "This location is particularly useful for travelers who plan to explore different parts of the island rather than remain in one resort. You can start the morning in the garden, drive to a beach or village for the day and return to a quieter environment in the evening.",
    ],
    image: "/images/kampos/kampos-chios-mansion-garden.webp",
    imageAlt:
      "Traditional mansion and citrus garden in Kambos near Voulamandis House",
    distances: [
      {
        label: "Chios Airport",
        value: "3 km",
        note: "Convenient for early arrivals and short island stays.",
      },
      {
        label: "Chios Port",
        value: "6 km",
        note: "Easy access for ferry passengers and Chios Town.",
      },
      {
        label: "Nearby beach",
        value: "1.5 km",
        note: "A quick option before longer beach excursions.",
      },
    ],
    mapCta: {
      label: "Open Voulamandis House on Google Maps",
      href: "https://www.google.com/maps/search/?api=1&query=Voulamandis+House+Chios",
    },
    guideCta: {
      label: "Discover Kambos Chios",
      href: "/chios/kampos-chios/",
    },
  },
  reasons: {
    kicker: "WHAT THE STAY INCLUDES",
    title: "Practical comfort without losing the character of the place",
    description:
      "The appeal of Voulamandis House comes from the combination of a historic setting, useful everyday facilities and direct local hospitality. It is designed for travelers who value calm, cleanliness and a genuine base for exploring Chios.",
    items: [
      {
        icon: "🌿",
        title: "Garden and citrus-estate atmosphere",
        text: "Outdoor areas, greenery and the historic Kambos environment create space to slow down before or after a day around the island.",
      },
      {
        icon: "🛏️",
        title: "A real choice of room layouts",
        text: "Choose value, ground-floor access, an upper-floor terrace or a family apartment instead of forcing every traveler into one standard room type.",
      },
      {
        icon: "❄️",
        title: "Useful in-room essentials",
        text: "The accommodation includes Wi-Fi, air conditioning, private bathrooms, television and a fridge, with kitchen facilities in selected rooms and apartments.",
      },
      {
        icon: "🥐",
        title: "Breakfast available on request",
        text: "Guests can request breakfast and enjoy it in the garden, adding an easy and personal start to the day without turning the stay into a rigid package.",
      },
      {
        icon: "🚗",
        title: "Parking and a practical island base",
        text: "Parking is available, and the location makes it straightforward to organise daily routes towards Chios Town, beaches and southern villages.",
      },
      {
        icon: "💬",
        title: "Direct help from people who know the rooms",
        text: "Questions about floor, beds, capacity, kitchen facilities or the best option for your dates can be answered directly before you decide.",
      },
    ],
  },
  travelerTypes: {
    kicker: "WHO IT SUITS",
    title: "A flexible base for different kinds of Chios holidays",
    items: [
      {
        title: "Couples looking for calm",
        text: "Economy and standard double rooms provide a peaceful base for couples who want to spend their days exploring and return somewhere quieter than the town centre.",
      },
      {
        title: "Families who need useful space",
        text: "Family apartments offer a bedroom, living area and full kitchen, while selected triple rooms can suit a smaller family planning a shorter stay.",
      },
      {
        title: "Independent island explorers",
        text: "The position near the main town connections and routes to southern Chios is suitable for guests who want a different beach, village or museum each day.",
      },
      {
        title: "Travelers arriving by air or ferry",
        text: "Being about 3 km from the airport and 6 km from the port reduces unnecessary travel time at the beginning and end of the holiday.",
      },
    ],
  },
  directBooking: {
    kicker: "DIRECT AVAILABILITY",
    title: "Check the right room before you book",
    paragraphs: [
      "Direct booking should make the decision clearer, not more complicated. The Voulamandis House booking pages show the accommodation categories and current availability, while the AI Room Finder can narrow the options using your dates and number of guests.",
      "Because the property has different floors, capacities and kitchen arrangements, speaking directly with the accommodation can be useful. You can confirm whether you need a ground-floor room, a family apartment, a specific bed arrangement or the most economical available option before completing your plans.",
    ],
    benefits: [
      "Current room availability and direct rates",
      "Help matching the room to your guests and preferences",
      "Direct communication with Voulamandis House",
      "Access to any direct-booking offer available for your dates",
    ],
    primaryCta: {
      label: "Check direct rates",
      href: "/chios-hotels-rates/",
    },
    secondaryCta: {
      label: "Use the AI Room Finder",
      href: "/ai-assistant/?lang=en",
    },
    whatsappCta: {
      label: "Ask on WhatsApp",
      href: "https://wa.me/306944474226",
    },
  },
  explore: {
    kicker: "PLAN THE REST OF YOUR STAY",
    title: "Use Kambos as your starting point for Chios",
    description:
      "The island rewards travelers who explore beyond one area. These guides help you plan days around beaches, villages, local history and the special landscape surrounding the accommodation.",
    links: [
      {
        title: "Discover Chios Island",
        text: "Start with the main island guide and choose the experiences that match your trip.",
        href: "/chios-island/",
      },
      {
        title: "Explore the beaches of Chios",
        text: "Compare organised beaches, quieter coves, family choices and the volcanic coast of southern Chios.",
        href: "/chios/chios-beaches/",
      },
      {
        title: "Visit the villages of Chios",
        text: "Plan routes through medieval mastic villages, seaside settlements and mountain communities.",
        href: "/chios/chios-villages/",
      },
      {
        title: "Learn more about Kambos",
        text: "Understand the citrus estates, mansions and stone-walled landscape around Voulamandis House.",
        href: "/chios/kampos-chios/",
      },
    ],
  },
  faq: {
    kicker: "FREQUENTLY ASKED QUESTIONS",
    title: "What to know before choosing your accommodation in Chios",
    items: [
      {
        question: "Is Voulamandis House a hotel?",
        answer:
          "Voulamandis House is a family-run guest accommodation offering rooms and apartments in Kambos, Chios. It is a smaller and more personal alternative to a large hotel or resort.",
      },
      {
        question: "Where is Voulamandis House located?",
        answer:
          "The property is at Dimarchou Kalvokoressi 117 in Kambos, Chios. Kambos is the historic citrus-estate area close to Chios Town and the airport.",
      },
      {
        question: "How far is the accommodation from Chios Airport and the port?",
        answer:
          "Voulamandis House is approximately 3 km from Chios Airport and 6 km from Chios Port, making it convenient for guests arriving by plane or ferry.",
      },
      {
        question: "Which accommodation is best for a family?",
        answer:
          "The family apartments are the most spacious choice, with capacity for up to four guests, a separate bedroom, living area and full kitchen. Some standard rooms can also accommodate three or four guests, depending on the individual room.",
      },
      {
        question: "Are there ground-floor rooms without stairs?",
        answer:
          "Yes. Voulamandis House has ground-floor economy and standard rooms. The room finder and room pages show which options have no stairs and direct access towards the courtyard or garden.",
      },
      {
        question: "Do the rooms have kitchens?",
        answer:
          "The family apartments have a full kitchen, while selected first-floor rooms include a kitchenette. All accommodation options include a fridge.",
      },
      {
        question: "Is breakfast available?",
        answer:
          "Breakfast is available on request and can be enjoyed in the garden. Contact the property or check the current stay information for details.",
      },
      {
        question: "How can I check direct availability?",
        answer:
          "Use the direct rates page, the AI Room Finder or contact Voulamandis House through WhatsApp, phone or email with your dates and number of guests.",
      },
    ],
  },
  finalCta: {
    kicker: "YOUR CHIOS STAY STARTS HERE",
    title: "Find a peaceful room or apartment in Kambos",
    text: "Compare the accommodation categories, enter your travel dates and choose the option that suits your guests, preferred floor and need for kitchen facilities.",
    primaryCta: {
      label: "Check availability",
      href: "/chios-hotels-rates/",
    },
    secondaryCta: {
      label: "Explore all rooms",
      href: "/chios-rooms/",
    },
  },
};
