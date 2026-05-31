export type IndividualRoomData = {
  id: string;
  name: string;
  type: string;
  location: string;
  maxGuests: number;
  description: string;
  badges: string[];
  beds: string[];
  amenities: {
    icon: string;
    label: string;
  }[];
  images: {
    src: string;
    alt: string;
    caption: string;
  }[];
};

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
  individualRooms: {
    kicker: string;
    title: string;
    description: string;
    rooms: IndividualRoomData[];
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
      href: "https://chioshotel.gr/chios-hotels-rates/",
    },
    secondaryCta: {
      label: "Ask availability",
      href: "tel:+306944764654",
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
      { icon: "📶", label: "Free WiFi", text: "Stay connected throughout your visit." },
      { icon: "❄️", label: "Air conditioning", text: "Comfort during the warm Chios summer." },
      { icon: "📺", label: "LCD TV", text: "Simple in-room entertainment." },
      { icon: "🧊", label: "Refrigerator", text: "Useful for drinks, snacks and fruit." },
      { icon: "☕", label: "Kettle", text: "Prepare coffee or tea in your room." },
      { icon: "🚿", label: "Private bathroom", text: "Clean, practical bathroom facilities." },
      { icon: "🌿", label: "Garden atmosphere", text: "Enjoy the calm Kampos estate feeling." },
      { icon: "🍽️", label: "Kitchenette", text: "Available in selected first-floor rooms." },
    ],
  },
  individualRooms: {
    kicker: "Available rooms",
    title: "Choose your specific standard room",
    description:
      "This category includes ground floor rooms with direct garden access and first floor rooms with terrace feel. Some first floor rooms also include a kitchenette.",
    rooms: [
      {
        id: "room-5",
        name: "Room 5",
        type: "Ground-floor double / triple",
        location: "Ground floor",
        maxGuests: 3,
        description:
          "Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection.",
        badges: ["Ground floor", "Garden access", "No stairs", "Up to 3 guests"],
        beds: ["1 double bed", "1 single bed"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌿", label: "Ground-floor view" },
          { icon: "🪜❌", label: "No stairs" },
          { icon: "📐", label: "Open-plan space" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-rooms.webp",
            alt: "Standard triple room 5 on the ground floor in Chios - bedroom - Voulamandis House",
            caption: "Bedroom",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-triple-rooms_1646x1080.webp",
            alt: "Standard triple room 5 in Chios - traditional Kampos interior decoration - Voulamandis House",
            caption: "Traditional interior",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-double-room-bathroom_1620x1080.webp",
            alt: "Standard triple room 5 in Chios - large renovated bathroom - Voulamandis House",
            caption: "Bathroom",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/hotels-chios-voulamandis_1620x1080.webp",
            alt: "Ground floor standard room 5 in Chios - courtyard access - Voulamandis House",
            caption: "Courtyard access",
          },
        ],
      },
      {
        id: "room-7",
        name: "Room 7",
        type: "Ground-floor double / triple",
        location: "Ground floor",
        maxGuests: 3,
        description:
          "Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed.",
        badges: ["Ground floor", "Garden access", "No stairs", "Sofa bed"],
        beds: ["1 double bed", "1 sofa bed"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌿", label: "Ground-floor view" },
          { icon: "🪜❌", label: "No stairs" },
          { icon: "📐", label: "Open-plan space" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
            alt: "Standard double room 7 on the ground floor in Chios with sofa bed - Voulamandis House",
            caption: "Room layout",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/view-double-room-chios-hotels.webp",
            alt: "Standard double room 7 in Chios - interior with traditional stone wall - Voulamandis House",
            caption: "Stone wall interior",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/double-room-bathroom.webp",
            alt: "Standard double room 7 in Chios - modern shower bathroom - Voulamandis House",
            caption: "Bathroom",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-stone-bathroom.webp",
            alt: "Standard double room 7 in Chios - traditional stone bathroom details - Voulamandis House",
            caption: "Stone bathroom details",
          },
        ],
      },
      {
        id: "room-1",
        name: "Room 1",
        type: "First-floor double / triple",
        location: "First floor",
        maxGuests: 4,
        description:
          "Room 1 is a first-floor room for up to 4 guests, with upper-floor view, private balcony feel and two sleeping spaces without a connecting door.",
        badges: ["First floor", "Upper-floor view", "Private balcony", "Up to 4 guests"],
        beds: ["1 double bed", "2 single beds"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌤️", label: "Private balcony" },
          { icon: "🌾", label: "Upper-floor view" },
          { icon: "🪜", label: "Access by stairs" },
          { icon: "🚪", label: "Two spaces, no connecting door" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
            alt: "Standard first-floor room 1 in Chios for up to 4 guests - Voulamandis House",
            caption: "Bedroom",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07769-1.webp",
            alt: "Standard room 1 in Chios - spacious room with double and single beds - Voulamandis House",
            caption: "Spacious layout",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/%CF%87%CE%B9%CE%BF%CF%82-%CE%B4%CF%89%CE%BC%CE%B1%CF%84%CE%B9%CE%B1-1-1.webp",
            alt: "Standard room 1 in Kampos Chios - traditional details and decoration - Voulamandis House",
            caption: "Traditional details",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-bathrooms-1.webp",
            alt: "Standard room 1 in Chios - large private renovated bathroom - Voulamandis House",
            caption: "Bathroom",
          },
        ],
      },
      {
        id: "room-3",
        name: "Room 3",
        type: "First-floor double / triple",
        location: "First floor",
        maxGuests: 3,
        description:
          "Room 3 is a first-floor double / triple room with kitchenette, upper-floor view and access by stairs.",
        badges: ["First floor", "Kitchenette", "Upper-floor view", "Up to 3 guests"],
        beds: ["1 double bed", "1 single bed"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌤️", label: "Private balcony" },
          { icon: "🌾", label: "Upper-floor view" },
          { icon: "🥣", label: "Kitchenette" },
          { icon: "🪜", label: "Access by stairs" },
          { icon: "🚪", label: "Two spaces, no connecting door" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07867-1.webp",
            alt: "Standard triple room 3 on the first floor in Chios with kitchenette - bedroom - Voulamandis House",
            caption: "Bedroom",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07860-1.webp",
            alt: "Standard room 3 in Chios - comfortable bedroom with stone walls - Voulamandis House",
            caption: "Stone wall interior",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07849-1.webp",
            alt: "Standard room 3 in Chios - interior equipment and terrace access - Voulamandis House",
            caption: "Terrace access",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07891-1.webp",
            alt: "Standard room 3 in Kampos Chios - equipped kitchenette - Voulamandis House",
            caption: "Kitchenette",
          },
        ],
      },
      {
        id: "room-4",
        name: "Room 4",
        type: "First-floor double / triple",
        location: "First floor",
        maxGuests: 3,
        description:
          "Room 4 is a first-floor double / triple room with kitchenette, sofa bed and upper-floor view.",
        badges: ["First floor", "Kitchenette", "Sofa bed", "Up to 3 guests"],
        beds: ["1 double bed", "1 sofa bed"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌤️", label: "Private balcony" },
          { icon: "🌾", label: "Upper-floor view" },
          { icon: "🥣", label: "Kitchenette" },
          { icon: "🪜", label: "Access by stairs" },
          { icon: "📐", label: "Open-plan space" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748354861920234.webp",
            alt: "Standard triple room 4 on the first floor in Chios with sofa bed and kitchenette - Voulamandis House",
            caption: "Room layout",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748358935253160.webp",
            alt: "Standard room 4 in Chios - bright living space with kitchenette - Voulamandis House",
            caption: "Kitchenette area",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748356725253381.webp",
            alt: "Standard room 4 in Chios - traditional decoration and comfort - Voulamandis House",
            caption: "Traditional decoration",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748356718586715.webp",
            alt: "Standard room 4 in Kampos Chios - balcony view - Voulamandis House",
            caption: "Balcony view",
          },
        ],
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
    phoneHref: "tel:+306944764654",
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
      href: "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=268803&lang=en&booking=723an9sb8hfukvhvbj6c7bmnni",
    },
    secondaryCta: {
      label: "Ask availability",
      href: "tel:+306944764654",
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
      { icon: "📶", label: "Free WiFi", text: "Internet access during your stay." },
      { icon: "❄️", label: "Air conditioning", text: "Comfort in summer weather." },
      { icon: "🧊", label: "Refrigerator", text: "Useful for drinks and snacks." },
      { icon: "☕", label: "Kettle", text: "Make coffee or tea in the room." },
      { icon: "💨", label: "Hairdryer", text: "Practical bathroom amenity." },
      { icon: "🪑", label: "Small desk", text: "Useful for light work or planning your day." },
    ],
  },
  individualRooms: {
    kicker: "Available rooms",
    title: "Choose your specific economy room",
    description:
      "The economy category includes two renovated 16m² double rooms: Room 6 on the ground floor with direct garden access, and Room 2 on the first floor with Kampos view.",
    rooms: [
      {
        id: "room-6",
        name: "Room 6",
        type: "Budget double room",
        location: "Ground floor",
        maxGuests: 2,
        description:
          "Room 6 is ideal for guests who love nature. Located on the ground floor, it opens directly to the peaceful courtyard and garden.",
        badges: ["Ground floor", "Garden access", "No stairs", "Economy"],
        beds: ["1 double bed"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌿", label: "Ground-floor view" },
          { icon: "🪜❌", label: "No stairs" },
          { icon: "📐", label: "Open-plan space" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
            alt: "Economy double room in Chios No. 6 on the ground floor with garden access - Voulamandis House",
            caption: "Room",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964581359262.webp",
            alt: "Workspace and small desk in economy double room No. 6 in Chios",
            caption: "Double bed",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753968691358851.webp",
            alt: "Renovated bathroom of economy double room No. 6 in Chios",
            caption: "Desk",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753969201358800.webp",
            alt: "Interior and decoration of economy double room No. 6 in Kampos Chios",
            caption: "Bathroom",
          },
        ],
      },
      {
        id: "room-2",
        name: "Room 2",
        type: "Budget double room",
        location: "First floor",
        maxGuests: 2,
        description:
          "Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kampos.",
        badges: ["First floor", "Kampos view", "Access by stairs", "Economy"],
        beds: ["1 double bed"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🪜", label: "Access by stairs" },
          { icon: "📐", label: "Open-plan space" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp",
            alt: "Economy double room No. 2 in Chios on the first floor with a view - Voulamandis House",
            caption: "Room view",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07839.webp",
            alt: "Lighting and atmosphere in economy double room No. 2 on the first floor",
            caption: "Layout",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07832.webp",
            alt: "Stone wall detail in economy double room No. 2 in Chios",
            caption: "Detail",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp",
            alt: "Bed and room layout in economy double room No. 2 in Chios",
            caption: "Bathroom",
          },
        ],
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
    phoneHref: "tel:+306944764654",
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
      href: "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595&lang=en",
    },
    secondaryCta: {
      label: "Ask availability",
      href: "tel:+306944764654",
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
      { icon: "📶", label: "Free WiFi", text: "Internet access for the whole family." },
      { icon: "❄️", label: "Air conditioning", text: "Comfortable temperature during summer." },
      { icon: "🍳", label: "Full kitchen", text: "Prepare simple meals during your stay." },
      { icon: "🛋️", label: "Living area", text: "Extra space to relax inside the apartment." },
      { icon: "🛏️", label: "Separate bedroom", text: "More privacy and comfort for families." },
      { icon: "🌿", label: "Garden view", text: "A peaceful Kampos setting around the property." },
      { icon: "🌞", label: "Private balcony", text: "Outdoor space for your stay." },
      { icon: "🚿", label: "Private bathroom", text: "Practical bathroom facilities." },
    ],
  },
  individualRooms: {
    kicker: "Available apartments",
    title: "Choose your specific family apartment",
    description:
      "The family apartment category includes three independent units for up to 4 guests, with kitchen facilities, living area and extra space for families or longer stays.",
    rooms: [
      {
        id: "apartment-8",
        name: "Apartment 8",
        type: "Apartment",
        location: "Independent unit",
        maxGuests: 4,
        description:
          "Apartment 8 is a family apartment with living room and kitchen, separate bedroom and bathroom. It is suitable for up to 4 guests.",
        badges: ["Independent unit", "Full kitchen", "Garden view", "Up to 4 guests"],
        beds: ["1 double bed", "2 single beds"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌤️", label: "Private balcony" },
          { icon: "🌿", label: "Garden view" },
          { icon: "🍳", label: "Kitchen" },
          { icon: "🪜❌", label: "No stairs" },
          { icon: "🧩", label: "Two spaces" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
            alt: "Family Apartment 8 - living room and kitchen - Voulamandis House Chios",
            caption: "Living Room & Kitchen",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
            alt: "Family Apartment 8 - kitchen area - Voulamandis House Chios",
            caption: "Kitchen",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/family-room.webp",
            alt: "Family Apartment 8 - bedroom - Voulamandis House Chios",
            caption: "Bedroom",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-apartment-bathroom..webp",
            alt: "Family Apartment 8 - bathroom - Voulamandis House Chios",
            caption: "Bathroom",
          },
        ],
      },
      {
        id: "apartment-9",
        name: "Apartment 9",
        type: "Apartment",
        location: "Independent unit",
        maxGuests: 4,
        description:
          "Apartment 9 offers the same family-friendly layout with kitchen, living area, bedroom and bathroom, suitable for up to 4 guests.",
        badges: ["Independent unit", "Full kitchen", "Garden view", "Up to 4 guests"],
        beds: ["1 double bed", "2 single beds"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌤️", label: "Private balcony" },
          { icon: "🌿", label: "Garden view" },
          { icon: "🍳", label: "Kitchen" },
          { icon: "🪜❌", label: "No stairs" },
          { icon: "🧩", label: "Two spaces" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
            alt: "Family Apartment 9 - living room and kitchen - Voulamandis House Chios",
            caption: "Living Room & Kitchen",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
            alt: "Family Apartment 9 - kitchen area - Voulamandis House Chios",
            caption: "Kitchen",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/family-room.webp",
            alt: "Family Apartment 9 - bedroom - Voulamandis House Chios",
            caption: "Bedroom",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-apartment-bathroom..webp",
            alt: "Family Apartment 9 - bathroom - Voulamandis House Chios",
            caption: "Bathroom",
          },
        ],
      },
      {
        id: "apartment-10",
        name: "Apartment 10",
        type: "Apartment",
        location: "Independent unit",
        maxGuests: 4,
        description:
          "Apartment 10 is a family apartment with living room and kitchen, bedroom and flexible sofa-bed layout.",
        badges: ["Independent unit", "Full kitchen", "Garden view", "Sofa beds"],
        beds: ["1 double bed", "2 sofa beds"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🌤️", label: "Private balcony" },
          { icon: "🌿", label: "Garden view" },
          { icon: "🍳", label: "Kitchen" },
          { icon: "🪜❌", label: "No stairs" },
          { icon: "🧩", label: "Two spaces" },
        ],
        images: [
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07899.webp",
            alt: "Family Apartment 10 - living room and kitchen - Voulamandis House Chios",
            caption: "Living Room & Kitchen",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07909.webp",
            alt: "Family Apartment 10 - kitchen area - Voulamandis House Chios",
            caption: "Kitchen",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07940.webp",
            alt: "Family Apartment 10 - bedroom - Voulamandis House Chios",
            caption: "Bedroom",
          },
          {
            src: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07943.webp",
            alt: "Family Apartment 10 - interior detail - Voulamandis House Chios",
            caption: "Detail",
          },
        ],
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
    phoneHref: "tel:+306944764654",
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