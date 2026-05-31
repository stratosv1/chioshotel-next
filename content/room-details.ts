export type RoomDetailData = {
  id: string;
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    imageAlt: string;
    badges: string[];
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  overview: {
    kicker: string;
    title: string;
    paragraphs: string[];
    highlights: {
      label: string;
      value: string;
    }[];
  };
  gallery: {
    kicker: string;
    title: string;
    images: {
      src: string;
      alt: string;
    }[];
  };
  amenities: {
    kicker: string;
    title: string;
    items: {
      icon: string;
      label: string;
      text: string;
    }[];
  };
  bestFor: {
    kicker: string;
    title: string;
    items: string[];
  };
  booking: {
    kicker: string;
    title: string;
    text: string;
    phoneHref: string;
    phoneLabel: string;
    whatsappHref: string;
    whatsappLabel: string;
    note: string;
  };
  faq: {
    question: string;
    answer: string;
  }[];
};

export const standardDoubleRoom: RoomDetailData = {
  id: "standard-double-room",
  seo: {
    canonicalPath: "/chios-rooms/standard-double-room/",
    title: "Standard Double & Triple Rooms in Chios | Voulamandis House",
    description:
      "Standard double and triple rooms in Chios at Voulamandis House in Kampos. Choose ground floor garden-access rooms or first floor rooms with terrace feel.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
  },
  hero: {
    kicker: "Standard rooms in Chios",
    title: "Double & triple rooms in Chios",
    subtitle: "Ground floor or first floor comfort in Kampos",
    description:
      "Comfortable double and triple rooms for couples, friends and small families. Choose easy garden access on the ground floor or a brighter first-floor stay with a more premium feel.",
    image:
      "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
    imageAlt: "Standard double and triple room in Chios at Voulamandis House",
    badges: ["2–4 guests", "Garden or terrace feel", "Free WiFi", "Air conditioning"],
    primaryCta: {
      label: "Book direct",
      href: "https://www.viber.com/en/",
    },
    secondaryCta: {
      label: "Ask availability",
      href: "tel:+302271031733",
    },
  },
  overview: {
    kicker: "Room overview",
    title: "Flexible rooms for couples, friends and small families",
    paragraphs: [
      "The standard double and triple rooms at Voulamandis House are designed for guests who want more comfort, more space and a calm Kampos atmosphere.",
      "Ground floor rooms are ideal if you prefer easy access to the courtyard and garden. First floor rooms offer a brighter stay and a more elevated feeling, with access to the shared terrace area.",
      "They are a practical choice for couples, friends and small families looking for accommodation in Chios close to the airport, Chios Town and the beaches of the island.",
    ],
    highlights: [
      { label: "Guests", value: "2–4" },
      { label: "Room type", value: "Double / Triple" },
      { label: "Location", value: "Ground & first floor" },
      { label: "Style", value: "Traditional Kampos" },
    ],
  },
  gallery: {
    kicker: "Room photos",
    title: "See the room atmosphere",
    images: [
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
        alt: "Ground floor double and triple room in Chios",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
        alt: "First floor double and triple room in Chios",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07867-1.webp",
        alt: "Bright standard room at Voulamandis House",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-rooms.webp",
        alt: "Standard room with traditional stone wall in Chios",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/view-double-room-chios-hotels.webp",
        alt: "Double room view at Voulamandis House",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/double-room-bathroom.webp",
        alt: "Bathroom in standard room at Voulamandis House",
      },
    ],
  },
  amenities: {
    kicker: "Amenities",
    title: "Everything you need for a comfortable stay",
    items: [
      {
        icon: "📶",
        label: "Free WiFi",
        text: "Stay connected throughout your visit.",
      },
      {
        icon: "❄️",
        label: "Air conditioning",
        text: "Comfort during the warm Chios summer.",
      },
      {
        icon: "📺",
        label: "LCD TV",
        text: "Simple in-room entertainment.",
      },
      {
        icon: "🧊",
        label: "Refrigerator",
        text: "Useful for drinks, snacks and fruit.",
      },
      {
        icon: "☕",
        label: "Kettle",
        text: "Prepare coffee or tea in your room.",
      },
      {
        icon: "🚿",
        label: "Private bathroom",
        text: "Clean, practical bathroom facilities.",
      },
      {
        icon: "🌿",
        label: "Garden atmosphere",
        text: "Enjoy the calm Kampos estate feeling.",
      },
      {
        icon: "🅿️",
        label: "Parking",
        text: "Convenient for guests exploring Chios by car.",
      },
    ],
  },
  bestFor: {
    kicker: "Best for",
    title: "Who should choose this room category?",
    items: [
      "Couples who want more comfort than the economy category.",
      "Friends travelling together who need flexible sleeping arrangements.",
      "Small families looking for practical accommodation in Kampos.",
      "Guests who want the choice between garden access and first-floor feel.",
    ],
  },
  booking: {
    kicker: "Direct booking",
    title: "Ask us which standard room fits your stay",
    text: "Tell us your dates, number of guests and whether you prefer ground floor or first floor. We will suggest the most suitable available option.",
    phoneHref: "tel:+302271031733",
    phoneLabel: "Call us",
    whatsappHref:
      "https://wa.me/306944474226?text=Hello!%20I%20am%20interested%20in%20the%20standard%20double%20or%20triple%20rooms%20in%20Chios.",
    whatsappLabel: "WhatsApp",
    note: "Direct booking may unlock better communication, flexible suggestions and available discount codes.",
  },
  faq: [
    {
      question: "Are the standard rooms suitable for 3 guests?",
      answer:
        "Yes. Several standard rooms can host 2 or 3 guests, and selected rooms can accommodate up to 4 depending on the layout.",
    },
    {
      question: "Can I choose ground floor or first floor?",
      answer:
        "You can request your preference. Final allocation depends on availability for your dates.",
    },
    {
      question: "Do the rooms have kitchen facilities?",
      answer:
        "Some selected first-floor rooms may include a kitchenette. If you need a full kitchen, the family apartments are usually the better choice.",
    },
  ],
};

export const economyDoubleRooms: RoomDetailData = {
  id: "economy-double-rooms",
  seo: {
    canonicalPath: "/chios-rooms/economy-double-rooms/",
    title: "Economy Double Rooms in Chios | Voulamandis House",
    description:
      "Economy double rooms in Chios at Voulamandis House. A value-for-money option for 2 guests in the peaceful Kampos area.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
  },
  hero: {
    kicker: "Economy rooms in Chios",
    title: "Economy double rooms in Chios",
    subtitle: "Best value option for 2 guests",
    description:
      "Simple, comfortable and value-focused double rooms for guests who want to enjoy Chios while keeping accommodation practical and affordable.",
    image:
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
    imageAlt: "Economy double room in Chios at Voulamandis House",
    badges: ["2 guests", "Economy choice", "Free WiFi", "Air conditioning"],
    primaryCta: {
      label: "Book direct",
      href: "https://www.viber.com/en/",
    },
    secondaryCta: {
      label: "Ask availability",
      href: "tel:+302271031733",
    },
  },
  overview: {
    kicker: "Room overview",
    title: "A practical value-for-money stay in Kampos",
    paragraphs: [
      "The economy double rooms are ideal for guests who want a simple and comfortable base in Chios without paying for extra space they may not need.",
      "They are suitable for couples, solo travellers or two friends who plan to explore the island during the day and return to a peaceful Kampos setting.",
      "This is the best category if your priority is price, location and essential comfort.",
    ],
    highlights: [
      { label: "Guests", value: "2" },
      { label: "Room type", value: "Economy double" },
      { label: "Size", value: "Approx. 16m²" },
      { label: "Style", value: "Simple comfort" },
    ],
  },
  gallery: {
    kicker: "Room photos",
    title: "A simple and practical room base",
    images: [
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
        alt: "Economy double room at Voulamandis House",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964581359262.webp",
        alt: "Economy room bed in Chios",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753968691358851.webp",
        alt: "Economy room interior at Voulamandis House",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753969201358800.webp",
        alt: "Economy room bathroom and interior details",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp",
        alt: "Economy double room in Chios",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07839.webp",
        alt: "Economy double room detail",
      },
    ],
  },
  amenities: {
    kicker: "Amenities",
    title: "Essential comfort for your stay",
    items: [
      {
        icon: "📶",
        label: "Free WiFi",
        text: "Internet access during your stay.",
      },
      {
        icon: "❄️",
        label: "Air conditioning",
        text: "Comfort in summer weather.",
      },
      {
        icon: "📺",
        label: "LCD TV",
        text: "Basic in-room entertainment.",
      },
      {
        icon: "🧊",
        label: "Refrigerator",
        text: "Useful for drinks and snacks.",
      },
      {
        icon: "☕",
        label: "Kettle",
        text: "Make coffee or tea in the room.",
      },
      {
        icon: "🚿",
        label: "Private bathroom",
        text: "Private bathroom facilities.",
      },
      {
        icon: "🌿",
        label: "Kampos setting",
        text: "A quiet base in the traditional Kampos area.",
      },
      {
        icon: "🅿️",
        label: "Parking",
        text: "Helpful if you rent a car in Chios.",
      },
    ],
  },
  bestFor: {
    kicker: "Best for",
    title: "Who should choose the economy double rooms?",
    items: [
      "Couples looking for the most budget-friendly room category.",
      "Solo travellers who want a quiet and practical stay.",
      "Guests who plan to spend most of the day exploring Chios.",
      "Travellers who care more about location and value than extra space.",
    ],
  },
  booking: {
    kicker: "Direct booking",
    title: "Ask for the best available economy option",
    text: "Tell us your dates and we will let you know which economy double room is available for your stay.",
    phoneHref: "tel:+302271031733",
    phoneLabel: "Call us",
    whatsappHref:
      "https://wa.me/306944474226?text=Hello!%20I%20am%20interested%20in%20the%20economy%20double%20rooms%20in%20Chios.",
    whatsappLabel: "WhatsApp",
    note: "Economy rooms are limited, so availability can change quickly in high season.",
  },
  faq: [
    {
      question: "How many guests can stay in an economy double room?",
      answer: "The economy double rooms are designed for up to 2 guests.",
    },
    {
      question: "Are economy rooms the cheapest room category?",
      answer:
        "Yes, they are usually the most budget-friendly option at Voulamandis House.",
    },
    {
      question: "Do economy rooms have air conditioning?",
      answer:
        "Yes, the rooms include essential amenities such as air conditioning, WiFi, refrigerator and private bathroom.",
    },
  ],
};

export const familyChiosApartments: RoomDetailData = {
  id: "family-chios-apartments",
  seo: {
    canonicalPath: "/chios-rooms/family-chios-apartments/",
    title: "Family Apartments in Chios | Voulamandis House",
    description:
      "Family apartments in Chios at Voulamandis House in Kampos. Spacious 40–45m² apartments with kitchen, bedroom and living area.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
  },
  hero: {
    kicker: "Family apartments in Chios",
    title: "Family Chios apartments",
    subtitle: "More space, kitchen and home-like comfort",
    description:
      "Spacious family apartments with separate bedroom, kitchen and living area. Ideal for families or guests who want more independence during their stay in Chios.",
    image:
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
    imageAlt: "Family apartment in Chios at Voulamandis House",
    badges: ["Up to 4 guests", "40–45m²", "Kitchen", "Living area"],
    primaryCta: {
      label: "Book direct",
      href: "https://www.viber.com/en/",
    },
    secondaryCta: {
      label: "Ask availability",
      href: "tel:+302271031733",
    },
  },
  overview: {
    kicker: "Apartment overview",
    title: "A spacious option for families and longer stays",
    paragraphs: [
      "The family apartments at Voulamandis House are designed for guests who want more space and the convenience of a kitchen during their stay in Chios.",
      "Each apartment offers a more independent, home-like experience, with a separate bedroom, living area and practical facilities for families.",
      "They are a strong choice for families with children, guests staying more nights, or travellers who prefer the flexibility of preparing simple meals.",
    ],
    highlights: [
      { label: "Guests", value: "Up to 4" },
      { label: "Size", value: "40–45m²" },
      { label: "Kitchen", value: "Full kitchen" },
      { label: "Layout", value: "Bedroom + living area" },
    ],
  },
  gallery: {
    kicker: "Apartment photos",
    title: "Space for a more independent stay",
    images: [
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
        alt: "Family apartment in Chios at Voulamandis House",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
        alt: "Family apartment living area in Chios",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/family-room.webp",
        alt: "Family room bedroom at Voulamandis House",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-apartment-bathroom..webp",
        alt: "Family apartment bathroom in Chios",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07899.webp",
        alt: "Apartment room at Voulamandis House",
      },
      {
        src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07909.webp",
        alt: "Apartment interior details at Voulamandis House",
      },
    ],
  },
  amenities: {
    kicker: "Amenities",
    title: "Apartment comfort and practical facilities",
    items: [
      {
        icon: "📶",
        label: "Free WiFi",
        text: "Internet access for the whole family.",
      },
      {
        icon: "❄️",
        label: "Air conditioning",
        text: "Comfortable temperature during summer.",
      },
      {
        icon: "🍳",
        label: "Full kitchen",
        text: "Prepare simple meals during your stay.",
      },
      {
        icon: "🛋️",
        label: "Living area",
        text: "Extra space to relax inside the apartment.",
      },
      {
        icon: "🛏️",
        label: "Separate bedroom",
        text: "More privacy and comfort for families.",
      },
      {
        icon: "🚿",
        label: "Private bathroom",
        text: "Practical bathroom facilities.",
      },
      {
        icon: "🌿",
        label: "Garden atmosphere",
        text: "A peaceful Kampos setting around the property.",
      },
      {
        icon: "🅿️",
        label: "Parking",
        text: "Convenient if you explore Chios by car.",
      },
    ],
  },
  bestFor: {
    kicker: "Best for",
    title: "Who should choose the family apartments?",
    items: [
      "Families who need more space than a standard room.",
      "Guests who want a kitchen during their holidays.",
      "Longer stays where comfort and flexibility matter.",
      "Travellers who prefer a more home-like accommodation option.",
    ],
  },
  booking: {
    kicker: "Direct booking",
    title: "Ask us which apartment is available",
    text: "Tell us your dates and number of guests, and we will suggest the most suitable available family apartment.",
    phoneHref: "tel:+302271031733",
    phoneLabel: "Call us",
    whatsappHref:
      "https://wa.me/306944474226?text=Hello!%20I%20am%20interested%20in%20the%20family%20apartments%20in%20Chios.",
    whatsappLabel: "WhatsApp",
    note: "Family apartments are especially useful for families and longer stays, so early contact is recommended.",
  },
  faq: [
    {
      question: "How many guests can stay in a family apartment?",
      answer:
        "The family apartments can host up to 4 guests, depending on the apartment layout.",
    },
    {
      question: "Do the apartments have a kitchen?",
      answer:
        "Yes, the family apartments include kitchen facilities for a more independent stay.",
    },
    {
      question: "Are the apartments suitable for longer stays?",
      answer:
        "Yes, the extra space, kitchen and living area make them a good choice for longer stays in Chios.",
    },
  ],
};

export const roomDetailsBySlug = {
  "standard-double-room": standardDoubleRoom,
  "economy-double-rooms": economyDoubleRooms,
  "family-chios-apartments": familyChiosApartments,
} satisfies Record<string, RoomDetailData>;