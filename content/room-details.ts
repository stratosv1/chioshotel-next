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

/* ==========================================================================
   STANDARD DOUBLE / TRIPLE ROOMS — EN
   ========================================================================== */

export const standardDoubleRoomEn: RoomDetailData = {
  id: "standard-double-room",
  seo: {
    canonicalPath: "/chios-rooms/standard-double-room/",
    title: "Standard Double & Triple Rooms in Chios | Voulamandis House",
    description:
      "Standard double and triple rooms in Chios at Voulamandis House in Kambos. Choose ground floor garden-access rooms or first floor rooms with terrace feel.",
    ogImage:
      "/images/rooms/double-triple-room.jpg",
  },
  hero: {
    kicker: "Standard rooms in Chios",
    title: "Double & triple rooms in Chios",
    subtitle: "Ground floor or first floor comfort in Kambos",
    description:
      "Comfortable double and triple rooms for couples, friends and small families. Choose easy garden access on the ground floor or a brighter first-floor stay with a more premium feel.",
    image:
      "/images/rooms/double-triple-room.jpg",
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
      "The standard double and triple rooms at Voulamandis House are designed for guests who want more comfort, more space and a calm Kambos atmosphere.",
      "Ground floor rooms are ideal if you prefer easy access to the courtyard and garden. First floor rooms offer a brighter stay and a more elevated feeling, with access to the shared terrace area.",
      "They are a practical choice for couples, friends and small families looking for accommodation in Chios close to the airport, Chios Town and the beaches of the island.",
    ],
    highlights: [
      { label: "Guests", value: "2–4" },
      { label: "Room type", value: "Double / Triple" },
      { label: "Location", value: "Ground & first floor" },
      { label: "Style", value: "Traditional Kambos" },
    ],
  },
  gallery: {
    kicker: "Room photos",
    title: "See the room atmosphere",
    images: [
      {
        src: "/images/rooms/double-triple-room.jpg",
        alt: "Ground floor double and triple room in Chios",
      },
      {
        src: "/images/rooms/DSC07776-2-e1675109942622.webp",
        alt: "First floor double and triple room in Chios",
      },
      {
        src: "/images/rooms/DSC07867-1.webp",
        alt: "Bright standard room at Voulamandis House",
      },
      {
        src: "/images/rooms/voulamandis-house-rooms.webp",
        alt: "Standard room with traditional stone wall in Chios",
      },
      {
        src: "/images/rooms/view-double-room-chios-hotels.webp",
        alt: "Double room view at Voulamandis House",
      },
      {
        src: "/images/rooms/double-room-bathroom.webp",
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
      { icon: "🌿", label: "Garden atmosphere", text: "Enjoy the calm Kambos estate feeling." },
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
            src: "/images/rooms/voulamandis-house-rooms.webp",
            alt: "Standard triple room 5 on the ground floor in Chios - bedroom - Voulamandis House",
            caption: "Bedroom",
          },
          {
            src: "/images/rooms/chios-hotels-triple-rooms_1646x1080.webp",
            alt: "Standard triple room 5 in Chios - traditional Kambos interior decoration - Voulamandis House",
            caption: "Traditional interior",
          },
          {
            src: "/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp",
            alt: "Standard triple room 5 in Chios - large renovated bathroom - Voulamandis House",
            caption: "Bathroom",
          },
          {
            src: "/images/rooms/hotels-chios-voulamandis_1620x1080.webp",
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
            src: "/images/rooms/double-triple-room.jpg",
            alt: "Standard double room 7 on the ground floor in Chios with sofa bed - Voulamandis House",
            caption: "Room layout",
          },
          {
            src: "/images/rooms/view-double-room-chios-hotels.webp",
            alt: "Standard double room 7 in Chios - interior with traditional stone wall - Voulamandis House",
            caption: "Stone wall interior",
          },
          {
            src: "/images/rooms/double-room-bathroom.webp",
            alt: "Standard double room 7 in Chios - modern shower bathroom - Voulamandis House",
            caption: "Bathroom",
          },
          {
            src: "/images/rooms/voulamandis-stone-bathroom.webp",
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
            src: "/images/rooms/DSC07776-2-e1675109942622.webp",
            alt: "Standard first-floor room 1 in Chios for up to 4 guests - Voulamandis House",
            caption: "Bedroom",
          },
          {
            src: "/images/rooms/DSC07769-1.webp",
            alt: "Standard room 1 in Chios - spacious room with double and single beds - Voulamandis House",
            caption: "Spacious layout",
          },
          {
            src: "/images/rooms/----1-1.webp",
            alt: "Standard room 1 in Kambos Chios - traditional details and decoration - Voulamandis House",
            caption: "Traditional details",
          },
          {
            src: "/images/rooms/voulamandis-house-bathrooms-1.webp",
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
            src: "/images/rooms/DSC07867-1.webp",
            alt: "Standard triple room 3 on the first floor in Chios with kitchenette - bedroom - Voulamandis House",
            caption: "Bedroom",
          },
          {
            src: "/images/rooms/DSC07860-1.webp",
            alt: "Standard room 3 in Chios - comfortable bedroom with stone walls - Voulamandis House",
            caption: "Stone wall interior",
          },
          {
            src: "/images/rooms/DSC07849-1.webp",
            alt: "Standard room 3 in Chios - interior equipment and terrace access - Voulamandis House",
            caption: "Terrace access",
          },
          {
            src: "/images/rooms/DSC07891-1.webp",
            alt: "Standard room 3 in Kambos Chios - equipped kitchenette - Voulamandis House",
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
            src: "/images/rooms/received_1748354861920234.webp",
            alt: "Standard triple room 4 on the first floor in Chios with sofa bed and kitchenette - Voulamandis House",
            caption: "Room layout",
          },
          {
            src: "/images/rooms/received_1748358935253160.webp",
            alt: "Standard room 4 in Chios - bright living space with kitchenette - Voulamandis House",
            caption: "Kitchenette area",
          },
          {
            src: "/images/rooms/received_1748356725253381.webp",
            alt: "Standard room 4 in Chios - traditional decoration and comfort - Voulamandis House",
            caption: "Traditional decoration",
          },
          {
            src: "/images/rooms/received_1748356718586715.webp",
            alt: "Standard room 4 in Kambos Chios - balcony view - Voulamandis House",
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
      "Small families looking for practical accommodation in Kambos.",
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

/* ==========================================================================
   STANDARD DOUBLE / TRIPLE ROOMS — EL
   ========================================================================== */

export const standardDoubleRoomEl: RoomDetailData = {
  ...standardDoubleRoomEn,
  seo: {
    ...standardDoubleRoomEn.seo,
    canonicalPath: "/el/domatia-xios/diklina-triklina-domatia/",
    title: "Δίκλινα & Τρίκλινα Δωμάτια στη Χίο | Voulamandis House",
    description:
      "Δίκλινα και τρίκλινα δωμάτια στη Χίο στο Voulamandis House στον Κάμπο. Επιλέξτε ισόγεια δωμάτια με πρόσβαση στον κήπο ή δωμάτια πρώτου ορόφου με πιο φωτεινή αίσθηση.",
  },
  hero: {
    ...standardDoubleRoomEn.hero,
    kicker: "Standard δωμάτια στη Χίο",
    title: "Δίκλινα και τρίκλινα δωμάτια στη Χίο",
    subtitle: "Άνεση στο ισόγειο ή στον πρώτο όροφο στον Κάμπο",
    description:
      "Άνετα δίκλινα και τρίκλινα δωμάτια για ζευγάρια, φίλους και μικρές οικογένειες. Επιλέξτε εύκολη πρόσβαση στον κήπο στο ισόγειο ή πιο φωτεινή διαμονή στον πρώτο όροφο.",
    imageAlt: "Standard δίκλινο και τρίκλινο δωμάτιο στη Χίο στο Voulamandis House",
    badges: ["2–4 άτομα", "Κήπος ή βεράντα", "Δωρεάν WiFi", "Κλιματισμός"],
    primaryCta: { ...standardDoubleRoomEn.hero.primaryCta, label: "Κάντε κράτηση" },
    secondaryCta: { ...standardDoubleRoomEn.hero.secondaryCta, label: "Ρωτήστε διαθεσιμότητα" },
  },
  overview: {
    kicker: "Περιγραφή δωματίου",
    title: "Ευέλικτα δωμάτια για ζευγάρια, φίλους και μικρές οικογένειες",
    paragraphs: [
      "Τα standard δίκλινα και τρίκλινα δωμάτια στο Voulamandis House είναι για επισκέπτες που θέλουν περισσότερη άνεση, πρακτικό χώρο και την ήρεμη ατμόσφαιρα του Κάμπου.",
      "Τα ισόγεια δωμάτια είναι ιδανικά αν προτιμάτε εύκολη πρόσβαση στην αυλή και στον κήπο. Τα δωμάτια του πρώτου ορόφου προσφέρουν πιο φωτεινή αίσθηση και πρόσβαση στην κοινόχρηστη βεράντα.",
      "Είναι πρακτική επιλογή για ζευγάρια, φίλους και μικρές οικογένειες που αναζητούν διαμονή στη Χίο κοντά στο αεροδρόμιο, την πόλη και τις παραλίες.",
    ],
    highlights: [
      { label: "Άτομα", value: "2–4" },
      { label: "Τύπος", value: "Δίκλινο / Τρίκλινο" },
      { label: "Θέση", value: "Ισόγειο & πρώτος όροφος" },
      { label: "Στυλ", value: "Παραδοσιακός Κάμπος" },
    ],
  },
  gallery: {
    ...standardDoubleRoomEn.gallery,
    kicker: "Φωτογραφίες δωματίων",
    title: "Δείτε την ατμόσφαιρα των δωματίων",
  },
  amenities: {
    kicker: "Παροχές",
    title: "Όλα όσα χρειάζεστε για άνετη διαμονή",
    items: [
      { icon: "📶", label: "Δωρεάν WiFi", text: "Μείνετε συνδεδεμένοι σε όλη τη διαμονή σας." },
      { icon: "❄️", label: "Κλιματισμός", text: "Άνεση τους ζεστούς καλοκαιρινούς μήνες." },
      { icon: "📺", label: "LCD TV", text: "Απλή ψυχαγωγία μέσα στο δωμάτιο." },
      { icon: "🧊", label: "Ψυγείο", text: "Χρήσιμο για ποτά, σνακ και φρούτα." },
      { icon: "☕", label: "Βραστήρας", text: "Για καφέ ή τσάι στο δωμάτιο." },
      { icon: "🚿", label: "Ιδιωτικό μπάνιο", text: "Καθαρές και πρακτικές παροχές μπάνιου." },
      { icon: "🌿", label: "Ατμόσφαιρα κήπου", text: "Απολαύστε την ήρεμη αίσθηση του κτήματος στον Κάμπο." },
      { icon: "🍽️", label: "Kitchenette", text: "Διαθέσιμο σε επιλεγμένα δωμάτια πρώτου ορόφου." },
    ],
  },
  individualRooms: {
    ...standardDoubleRoomEn.individualRooms,
    kicker: "Διαθέσιμα δωμάτια",
    title: "Επιλέξτε το standard δωμάτιο που σας ταιριάζει",
    description:
      "Η κατηγορία περιλαμβάνει ισόγεια δωμάτια με άμεση πρόσβαση στον κήπο και δωμάτια πρώτου ορόφου με αίσθηση βεράντας. Ορισμένα δωμάτια πρώτου ορόφου διαθέτουν και kitchenette.",
    rooms: [
      {
        ...standardDoubleRoomEn.individualRooms.rooms[0],
        name: "Δωμάτιο 5",
        type: "Ισόγειο δίκλινο / τρίκλινο",
        location: "Ισόγειο",
        description:
          "Το Δωμάτιο 5 είναι ισόγειο δίκλινο / τρίκλινο με άμεση πρόσβαση στην αυλή και στον κήπο. Είναι ιδανικό για επισκέπτες που προτιμούν χωρίς σκάλες και εύκολη σύνδεση με τον εξωτερικό χώρο.",
        badges: ["Ισόγειο", "Πρόσβαση στον κήπο", "Χωρίς σκάλες", "Έως 3 άτομα"],
        beds: ["1 διπλό κρεβάτι", "1 μονό κρεβάτι"],
      },
      {
        ...standardDoubleRoomEn.individualRooms.rooms[1],
        name: "Δωμάτιο 7",
        type: "Ισόγειο δίκλινο / τρίκλινο",
        location: "Ισόγειο",
        description:
          "Το Δωμάτιο 7 είναι ισόγειο δίκλινο / τρίκλινο με πρόσβαση στον κήπο και ευέλικτη διαρρύθμιση με καναπέ-κρεβάτι.",
        badges: ["Ισόγειο", "Πρόσβαση στον κήπο", "Χωρίς σκάλες", "Καναπές-κρεβάτι"],
        beds: ["1 διπλό κρεβάτι", "1 καναπές-κρεβάτι"],
      },
      {
        ...standardDoubleRoomEn.individualRooms.rooms[2],
        name: "Δωμάτιο 1",
        type: "Δίκλινο / τρίκλινο πρώτου ορόφου",
        location: "Πρώτος όροφος",
        description:
          "Το Δωμάτιο 1 βρίσκεται στον πρώτο όροφο και μπορεί να φιλοξενήσει έως 4 άτομα, με θέα από ψηλά, αίσθηση ιδιωτικού μπαλκονιού και δύο χώρους ύπνου χωρίς ενδιάμεση πόρτα.",
        badges: ["Πρώτος όροφος", "Θέα από ψηλά", "Ιδιωτικό μπαλκόνι", "Έως 4 άτομα"],
        beds: ["1 διπλό κρεβάτι", "2 μονά κρεβάτια"],
      },
      {
        ...standardDoubleRoomEn.individualRooms.rooms[3],
        name: "Δωμάτιο 3",
        type: "Δίκλινο / τρίκλινο πρώτου ορόφου",
        location: "Πρώτος όροφος",
        description:
          "Το Δωμάτιο 3 είναι δίκλινο / τρίκλινο πρώτου ορόφου με kitchenette, θέα από ψηλά και πρόσβαση με σκάλες.",
        badges: ["Πρώτος όροφος", "Kitchenette", "Θέα από ψηλά", "Έως 3 άτομα"],
        beds: ["1 διπλό κρεβάτι", "1 μονό κρεβάτι"],
      },
      {
        ...standardDoubleRoomEn.individualRooms.rooms[4],
        name: "Δωμάτιο 4",
        type: "Δίκλινο / τρίκλινο πρώτου ορόφου",
        location: "Πρώτος όροφος",
        description:
          "Το Δωμάτιο 4 είναι δίκλινο / τρίκλινο πρώτου ορόφου με kitchenette, καναπέ-κρεβάτι και θέα από ψηλά.",
        badges: ["Πρώτος όροφος", "Kitchenette", "Καναπές-κρεβάτι", "Έως 3 άτομα"],
        beds: ["1 διπλό κρεβάτι", "1 καναπές-κρεβάτι"],
      },
    ],
  },
  bestFor: {
    kicker: "Ιδανικό για",
    title: "Ποιοι πρέπει να επιλέξουν αυτή την κατηγορία;",
    items: [
      "Ζευγάρια που θέλουν περισσότερη άνεση από την οικονομική κατηγορία.",
      "Φίλους που ταξιδεύουν μαζί και χρειάζονται ευέλικτη διάταξη ύπνου.",
      "Μικρές οικογένειες που αναζητούν πρακτική διαμονή στον Κάμπο.",
      "Επισκέπτες που θέλουν επιλογή ανάμεσα σε πρόσβαση στον κήπο και πρώτο όροφο.",
    ],
  },
  booking: {
    ...standardDoubleRoomEn.booking,
    kicker: "Απευθείας κράτηση",
    title: "Ρωτήστε μας ποιο standard δωμάτιο ταιριάζει στη διαμονή σας",
    text: "Πείτε μας ημερομηνίες, αριθμό ατόμων και αν προτιμάτε ισόγειο ή πρώτο όροφο. Θα σας προτείνουμε την πιο κατάλληλη διαθέσιμη επιλογή.",
    phoneLabel: "Καλέστε μας",
    whatsappHref:
      "https://wa.me/306944474226?text=Γεια%20σας!%20Ενδιαφέρομαι%20για%20τα%20standard%20δίκλινα%20ή%20τρίκλινα%20δωμάτια%20στη%20Χίο.",
    note: "Η απευθείας κράτηση βοηθά στην καλύτερη επικοινωνία, σε πιο ευέλικτες προτάσεις και σε διαθέσιμους κωδικούς έκπτωσης.",
  },
  faq: [
    {
      question: "Είναι τα standard δωμάτια κατάλληλα για 3 άτομα;",
      answer:
        "Ναι. Αρκετά standard δωμάτια φιλοξενούν 2 ή 3 άτομα, ενώ επιλεγμένα δωμάτια μπορούν να φιλοξενήσουν έως 4 άτομα ανάλογα με τη διαρρύθμιση.",
    },
    {
      question: "Μπορώ να επιλέξω ισόγειο ή πρώτο όροφο;",
      answer:
        "Μπορείτε να δηλώσετε την προτίμησή σας. Η τελική κατανομή εξαρτάται από τη διαθεσιμότητα στις ημερομηνίες σας.",
    },
    {
      question: "Έχουν τα δωμάτια κουζίνα;",
      answer:
        "Ορισμένα δωμάτια πρώτου ορόφου μπορεί να διαθέτουν kitchenette. Αν χρειάζεστε πλήρη κουζίνα, τα οικογενειακά διαμερίσματα είναι συνήθως καλύτερη επιλογή.",
    },
  ],
};

/* ==========================================================================
   STANDARD DOUBLE / TRIPLE ROOMS — FR
   ========================================================================== */

export const standardDoubleRoomFr: RoomDetailData = {
  ...standardDoubleRoomEn,
  seo: {
    ...standardDoubleRoomEn.seo,
    canonicalPath: "/fr/chambres-a-chios/chambres-doubles-standard/",
    title: "Chambres Doubles & Triples Standard à Chios | Voulamandis House",
    description:
      "Chambres doubles et triples standard à Chios au Voulamandis House à Kambos. Choisissez le rez-de-chaussée avec accès au jardin ou le premier étage avec terrasse.",
  },
  hero: {
    ...standardDoubleRoomEn.hero,
    kicker: "Chambres standard à Chios",
    title: "Chambres doubles et triples à Chios",
    subtitle: "Confort au rez-de-chaussée ou au premier étage à Kambos",
    description:
      "Chambres doubles et triples confortables pour couples, amis et petites familles. Choisissez un accès facile au jardin au rez-de-chaussée ou un séjour plus lumineux au premier étage.",
    imageAlt: "Chambre double et triple standard à Chios au Voulamandis House",
    badges: ["2–4 personnes", "Jardin ou terrasse", "WiFi gratuit", "Climatisation"],
    primaryCta: { ...standardDoubleRoomEn.hero.primaryCta, label: "Réserver en direct" },
    secondaryCta: { ...standardDoubleRoomEn.hero.secondaryCta, label: "Demander la disponibilité" },
  },
  overview: {
    kicker: "Aperçu de la chambre",
    title: "Des chambres flexibles pour couples, amis et petites familles",
    paragraphs: [
      "Les chambres doubles et triples standard du Voulamandis House sont conçues pour les voyageurs qui souhaitent plus de confort, plus d’espace et l’atmosphère paisible de Kambos.",
      "Les chambres au rez-de-chaussée sont idéales si vous préférez un accès facile à la cour et au jardin. Les chambres au premier étage offrent un séjour plus lumineux et l’accès à la terrasse commune.",
      "C’est un choix pratique pour les couples, amis et petites familles cherchant un hébergement à Chios proche de l’aéroport, de la ville et des plages.",
    ],
    highlights: [
      { label: "Personnes", value: "2–4" },
      { label: "Type", value: "Double / Triple" },
      { label: "Emplacement", value: "Rez-de-chaussée & premier étage" },
      { label: "Style", value: "Kambos traditionnel" },
    ],
  },
  gallery: { ...standardDoubleRoomEn.gallery, kicker: "Photos des chambres", title: "Découvrez l’atmosphère des chambres" },
  amenities: {
    kicker: "Équipements",
    title: "Tout le nécessaire pour un séjour confortable",
    items: [
      { icon: "📶", label: "WiFi gratuit", text: "Restez connecté pendant votre séjour." },
      { icon: "❄️", label: "Climatisation", text: "Confort pendant l’été à Chios." },
      { icon: "📺", label: "TV LCD", text: "Divertissement simple dans la chambre." },
      { icon: "🧊", label: "Réfrigérateur", text: "Pratique pour boissons, snacks et fruits." },
      { icon: "☕", label: "Bouilloire", text: "Préparez café ou thé dans la chambre." },
      { icon: "🚿", label: "Salle de bain privée", text: "Installations propres et pratiques." },
      { icon: "🌿", label: "Atmosphère jardin", text: "Profitez du calme du domaine de Kambos." },
      { icon: "🍽️", label: "Kitchenette", text: "Disponible dans certaines chambres du premier étage." },
    ],
  },
  individualRooms: {
    ...standardDoubleRoomEn.individualRooms,
    kicker: "Chambres disponibles",
    title: "Choisissez votre chambre standard",
    description:
      "Cette catégorie comprend des chambres au rez-de-chaussée avec accès direct au jardin et des chambres au premier étage avec une atmosphère de terrasse. Certaines chambres du premier étage disposent aussi d’une kitchenette.",
  },
  bestFor: {
    kicker: "Idéal pour",
    title: "À qui convient cette catégorie ?",
    items: [
      "Les couples qui souhaitent plus de confort que la catégorie économique.",
      "Les amis voyageant ensemble qui ont besoin de couchages flexibles.",
      "Les petites familles recherchant un hébergement pratique à Kambos.",
      "Les voyageurs qui veulent choisir entre accès au jardin et premier étage.",
    ],
  },
  booking: {
    ...standardDoubleRoomEn.booking,
    kicker: "Réservation directe",
    title: "Demandez-nous quelle chambre standard convient à votre séjour",
    text: "Indiquez vos dates, le nombre de personnes et votre préférence entre rez-de-chaussée et premier étage. Nous vous proposerons l’option disponible la plus adaptée.",
    phoneLabel: "Appelez-nous",
    whatsappHref:
      "https://wa.me/306944474226?text=Bonjour!%20Je%20suis%20intéressé(e)%20par%20les%20chambres%20doubles%20ou%20triples%20standard%20à%20Chios.",
    note: "La réservation directe peut faciliter la communication, les suggestions flexibles et les codes de réduction disponibles.",
  },
  faq: [
    {
      question: "Les chambres standard conviennent-elles à 3 personnes ?",
      answer:
        "Oui. Plusieurs chambres standard accueillent 2 ou 3 personnes, et certaines peuvent accueillir jusqu’à 4 personnes selon la configuration.",
    },
    {
      question: "Puis-je choisir le rez-de-chaussée ou le premier étage ?",
      answer:
        "Vous pouvez indiquer votre préférence. L’attribution finale dépend de la disponibilité à vos dates.",
    },
    {
      question: "Les chambres ont-elles une cuisine ?",
      answer:
        "Certaines chambres du premier étage peuvent inclure une kitchenette. Si vous avez besoin d’une cuisine complète, les appartements familiaux sont généralement plus adaptés.",
    },
  ],
};

/* ==========================================================================
   STANDARD DOUBLE / TRIPLE ROOMS — DE
   ========================================================================== */

export const standardDoubleRoomDe: RoomDetailData = {
  ...standardDoubleRoomEn,
  seo: {
    ...standardDoubleRoomEn.seo,
    canonicalPath: "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",
    title: "Standard Doppel- & Dreibettzimmer auf Chios | Voulamandis House",
    description:
      "Standard Doppel- und Dreibettzimmer auf Chios im Voulamandis House in Kambos. Wählen Sie Erdgeschoss mit Gartenzugang oder erste Etage mit Terrassengefühl.",
  },
  hero: {
    ...standardDoubleRoomEn.hero,
    kicker: "Standardzimmer auf Chios",
    title: "Doppel- und Dreibettzimmer auf Chios",
    subtitle: "Komfort im Erdgeschoss oder in der ersten Etage in Kambos",
    description:
      "Komfortable Doppel- und Dreibettzimmer für Paare, Freunde und kleine Familien. Wählen Sie leichten Gartenzugang im Erdgeschoss oder einen helleren Aufenthalt in der ersten Etage.",
    imageAlt: "Standard Doppel- und Dreibettzimmer auf Chios im Voulamandis House",
    badges: ["2–4 Gäste", "Garten oder Terrasse", "Kostenloses WiFi", "Klimaanlage"],
    primaryCta: { ...standardDoubleRoomEn.hero.primaryCta, label: "Direkt buchen" },
    secondaryCta: { ...standardDoubleRoomEn.hero.secondaryCta, label: "Verfügbarkeit anfragen" },
  },
  overview: {
    kicker: "Zimmerüberblick",
    title: "Flexible Zimmer für Paare, Freunde und kleine Familien",
    paragraphs: [
      "Die Standard Doppel- und Dreibettzimmer im Voulamandis House sind für Gäste gedacht, die mehr Komfort, mehr Platz und die ruhige Atmosphäre von Kambos wünschen.",
      "Die Zimmer im Erdgeschoss sind ideal, wenn Sie einfachen Zugang zum Hof und Garten bevorzugen. Die Zimmer in der ersten Etage bieten einen helleren Aufenthalt und Zugang zur gemeinschaftlichen Terrasse.",
      "Sie sind eine praktische Wahl für Paare, Freunde und kleine Familien, die eine Unterkunft auf Chios in der Nähe von Flughafen, Stadt und Stränden suchen.",
    ],
    highlights: [
      { label: "Gäste", value: "2–4" },
      { label: "Zimmertyp", value: "Doppel / Dreibett" },
      { label: "Lage", value: "Erdgeschoss & erste Etage" },
      { label: "Stil", value: "Traditionelles Kambos" },
    ],
  },
  gallery: { ...standardDoubleRoomEn.gallery, kicker: "Zimmerfotos", title: "Sehen Sie die Zimmeratmosphäre" },
  amenities: {
    kicker: "Ausstattung",
    title: "Alles, was Sie für einen komfortablen Aufenthalt brauchen",
    items: [
      { icon: "📶", label: "Kostenloses WiFi", text: "Bleiben Sie während Ihres Aufenthalts verbunden." },
      { icon: "❄️", label: "Klimaanlage", text: "Komfort während des warmen Chios-Sommers." },
      { icon: "📺", label: "LCD-TV", text: "Einfache Unterhaltung im Zimmer." },
      { icon: "🧊", label: "Kühlschrank", text: "Praktisch für Getränke, Snacks und Obst." },
      { icon: "☕", label: "Wasserkocher", text: "Kaffee oder Tee im Zimmer zubereiten." },
      { icon: "🚿", label: "Eigenes Bad", text: "Saubere und praktische Badezimmereinrichtung." },
      { icon: "🌿", label: "Gartenatmosphäre", text: "Genießen Sie die ruhige Stimmung des Kambos-Anwesens." },
      { icon: "🍽️", label: "Kitchenette", text: "In ausgewählten Zimmern der ersten Etage verfügbar." },
    ],
  },
  individualRooms: {
    ...standardDoubleRoomEn.individualRooms,
    kicker: "Verfügbare Zimmer",
    title: "Wählen Sie Ihr Standardzimmer",
    description:
      "Diese Kategorie umfasst Zimmer im Erdgeschoss mit direktem Gartenzugang und Zimmer in der ersten Etage mit Terrassengefühl. Einige Zimmer in der ersten Etage verfügen auch über eine Kitchenette.",
  },
  bestFor: {
    kicker: "Ideal für",
    title: "Für wen eignet sich diese Zimmerkategorie?",
    items: [
      "Paare, die mehr Komfort als in der Economy-Kategorie wünschen.",
      "Freunde, die gemeinsam reisen und flexible Schlafmöglichkeiten benötigen.",
      "Kleine Familien, die eine praktische Unterkunft in Kambos suchen.",
      "Gäste, die zwischen Gartenzugang und erster Etage wählen möchten.",
    ],
  },
  booking: {
    ...standardDoubleRoomEn.booking,
    kicker: "Direktbuchung",
    title: "Fragen Sie uns, welches Standardzimmer zu Ihrem Aufenthalt passt",
    text: "Teilen Sie uns Ihre Daten, Gästezahl und Ihre Präferenz für Erdgeschoss oder erste Etage mit. Wir schlagen Ihnen die passendste verfügbare Option vor.",
    phoneLabel: "Anrufen",
    whatsappHref:
      "https://wa.me/306944474226?text=Hallo!%20Ich%20interessiere%20mich%20für%20die%20Standard%20Doppel-%20oder%20Dreibettzimmer%20auf%20Chios.",
    note: "Direktbuchung kann bessere Kommunikation, flexible Vorschläge und verfügbare Rabattcodes ermöglichen.",
  },
  faq: [
    {
      question: "Sind die Standardzimmer für 3 Gäste geeignet?",
      answer:
        "Ja. Mehrere Standardzimmer können 2 oder 3 Gäste aufnehmen, ausgewählte Zimmer je nach Aufteilung auch bis zu 4 Gäste.",
    },
    {
      question: "Kann ich Erdgeschoss oder erste Etage wählen?",
      answer:
        "Sie können Ihre Präferenz angeben. Die endgültige Zuteilung hängt von der Verfügbarkeit für Ihre Daten ab.",
    },
    {
      question: "Haben die Zimmer Kochmöglichkeiten?",
      answer:
        "Einige ausgewählte Zimmer in der ersten Etage können eine Kitchenette haben. Wenn Sie eine vollständige Küche benötigen, sind die Familienapartments meist die bessere Wahl.",
    },
  ],
};

/* ==========================================================================
   STANDARD DOUBLE / TRIPLE ROOMS — IT
   ========================================================================== */

export const standardDoubleRoomIt: RoomDetailData = {
  ...standardDoubleRoomEn,
  seo: {
    ...standardDoubleRoomEn.seo,
    canonicalPath: "/it/stanze-a-chios/camere-doppie-standard-chios/",
    title: "Camere Doppie e Triple Standard a Chios | Voulamandis House",
    description:
      "Camere doppie e triple standard a Chios presso Voulamandis House a Kambos. Scegli il piano terra con accesso al giardino o il primo piano con atmosfera da terrazza.",
  },
  hero: {
    ...standardDoubleRoomEn.hero,
    kicker: "Camere standard a Chios",
    title: "Camere doppie e triple a Chios",
    subtitle: "Comfort al piano terra o al primo piano a Kambos",
    description:
      "Camere doppie e triple confortevoli per coppie, amici e piccole famiglie. Scegli l’accesso facile al giardino al piano terra o un soggiorno più luminoso al primo piano.",
    imageAlt: "Camera doppia e tripla standard a Chios presso Voulamandis House",
    badges: ["2–4 ospiti", "Giardino o terrazza", "WiFi gratuito", "Aria condizionata"],
    primaryCta: { ...standardDoubleRoomEn.hero.primaryCta, label: "Prenota direttamente" },
    secondaryCta: { ...standardDoubleRoomEn.hero.secondaryCta, label: "Chiedi disponibilità" },
  },
  overview: {
    kicker: "Panoramica camera",
    title: "Camere flessibili per coppie, amici e piccole famiglie",
    paragraphs: [
      "Le camere doppie e triple standard di Voulamandis House sono pensate per chi desidera più comfort, più spazio e la tranquilla atmosfera di Kambos.",
      "Le camere al piano terra sono ideali se preferisci un accesso facile al cortile e al giardino. Le camere al primo piano offrono un soggiorno più luminoso e accesso alla terrazza comune.",
      "Sono una scelta pratica per coppie, amici e piccole famiglie che cercano un alloggio a Chios vicino all’aeroporto, alla città e alle spiagge.",
    ],
    highlights: [
      { label: "Ospiti", value: "2–4" },
      { label: "Tipo", value: "Doppia / Tripla" },
      { label: "Posizione", value: "Piano terra & primo piano" },
      { label: "Stile", value: "Kambos tradizionale" },
    ],
  },
  gallery: { ...standardDoubleRoomEn.gallery, kicker: "Foto delle camere", title: "Scopri l’atmosfera delle camere" },
  amenities: {
    kicker: "Servizi",
    title: "Tutto il necessario per un soggiorno confortevole",
    items: [
      { icon: "📶", label: "WiFi gratuito", text: "Resta connesso durante il soggiorno." },
      { icon: "❄️", label: "Aria condizionata", text: "Comfort durante l’estate a Chios." },
      { icon: "📺", label: "TV LCD", text: "Intrattenimento semplice in camera." },
      { icon: "🧊", label: "Frigorifero", text: "Utile per bevande, snack e frutta." },
      { icon: "☕", label: "Bollitore", text: "Prepara caffè o tè in camera." },
      { icon: "🚿", label: "Bagno privato", text: "Servizi bagno puliti e pratici." },
      { icon: "🌿", label: "Atmosfera giardino", text: "Goditi la calma della tenuta di Kambos." },
      { icon: "🍽️", label: "Angolo cottura", text: "Disponibile in alcune camere al primo piano." },
    ],
  },
  individualRooms: {
    ...standardDoubleRoomEn.individualRooms,
    kicker: "Camere disponibili",
    title: "Scegli la tua camera standard",
    description:
      "Questa categoria include camere al piano terra con accesso diretto al giardino e camere al primo piano con atmosfera da terrazza. Alcune camere al primo piano includono anche un angolo cottura.",
  },
  bestFor: {
    kicker: "Ideale per",
    title: "A chi consigliamo questa categoria?",
    items: [
      "Coppie che desiderano più comfort rispetto alla categoria economy.",
      "Amici in viaggio insieme che hanno bisogno di soluzioni letto flessibili.",
      "Piccole famiglie che cercano un alloggio pratico a Kambos.",
      "Ospiti che vogliono scegliere tra accesso al giardino e primo piano.",
    ],
  },
  booking: {
    ...standardDoubleRoomEn.booking,
    kicker: "Prenotazione diretta",
    title: "Chiedici quale camera standard è più adatta al tuo soggiorno",
    text: "Indicaci le date, il numero di ospiti e se preferisci piano terra o primo piano. Ti suggeriremo l’opzione disponibile più adatta.",
    phoneLabel: "Chiamaci",
    whatsappHref:
      "https://wa.me/306944474226?text=Buongiorno!%20Sono%20interessato%20alle%20camere%20doppie%20o%20triple%20standard%20a%20Chios.",
    note: "La prenotazione diretta può offrire comunicazione migliore, suggerimenti flessibili e codici sconto disponibili.",
  },
  faq: [
    {
      question: "Le camere standard sono adatte a 3 ospiti?",
      answer:
        "Sì. Diverse camere standard possono ospitare 2 o 3 persone, e alcune fino a 4 in base alla disposizione.",
    },
    {
      question: "Posso scegliere piano terra o primo piano?",
      answer:
        "Puoi indicare la tua preferenza. L’assegnazione finale dipende dalla disponibilità per le tue date.",
    },
    {
      question: "Le camere hanno una cucina?",
      answer:
        "Alcune camere al primo piano possono includere un angolo cottura. Se hai bisogno di una cucina completa, gli appartamenti familiari sono di solito la scelta migliore.",
    },
  ],
};

/* ==========================================================================
   STANDARD DOUBLE / TRIPLE ROOMS — ES
   ========================================================================== */

export const standardDoubleRoomEs: RoomDetailData = {
  ...standardDoubleRoomEn,
  seo: {
    ...standardDoubleRoomEn.seo,
    canonicalPath: "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
    title: "Habitaciones Dobles y Triples Estándar en Quíos | Voulamandis House",
    description:
      "Habitaciones dobles y triples estándar en Quíos en Voulamandis House, Kambos. Elige planta baja con acceso al jardín o primera planta con ambiente de terraza.",
  },
  hero: {
    ...standardDoubleRoomEn.hero,
    kicker: "Habitaciones estándar en Quíos",
    title: "Habitaciones dobles y triples en Quíos",
    subtitle: "Comodidad en planta baja o primera planta en Kambos",
    description:
      "Habitaciones dobles y triples cómodas para parejas, amigos y familias pequeñas. Elige acceso fácil al jardín en planta baja o una estancia más luminosa en primera planta.",
    imageAlt: "Habitación doble y triple estándar en Quíos en Voulamandis House",
    badges: ["2–4 personas", "Jardín o terraza", "WiFi gratis", "Aire acondicionado"],
    primaryCta: { ...standardDoubleRoomEn.hero.primaryCta, label: "Reservar directo" },
    secondaryCta: { ...standardDoubleRoomEn.hero.secondaryCta, label: "Consultar disponibilidad" },
  },
  overview: {
    kicker: "Resumen de la habitación",
    title: "Habitaciones flexibles para parejas, amigos y familias pequeñas",
    paragraphs: [
      "Las habitaciones dobles y triples estándar de Voulamandis House están pensadas para huéspedes que desean más comodidad, más espacio y el ambiente tranquilo de Kambos.",
      "Las habitaciones de planta baja son ideales si prefieres acceso fácil al patio y al jardín. Las de primera planta ofrecen una estancia más luminosa y acceso a la terraza compartida.",
      "Son una opción práctica para parejas, amigos y familias pequeñas que buscan alojamiento en Quíos cerca del aeropuerto, la ciudad y las playas.",
    ],
    highlights: [
      { label: "Personas", value: "2–4" },
      { label: "Tipo", value: "Doble / Triple" },
      { label: "Ubicación", value: "Planta baja & primera planta" },
      { label: "Estilo", value: "Kambos tradicional" },
    ],
  },
  gallery: { ...standardDoubleRoomEn.gallery, kicker: "Fotos de las habitaciones", title: "Descubre el ambiente de las habitaciones" },
  amenities: {
    kicker: "Servicios",
    title: "Todo lo necesario para una estancia cómoda",
    items: [
      { icon: "📶", label: "WiFi gratis", text: "Mantente conectado durante la estancia." },
      { icon: "❄️", label: "Aire acondicionado", text: "Confort durante el verano en Quíos." },
      { icon: "📺", label: "TV LCD", text: "Entretenimiento sencillo en la habitación." },
      { icon: "🧊", label: "Nevera", text: "Útil para bebidas, aperitivos y fruta." },
      { icon: "☕", label: "Hervidor", text: "Prepara café o té en la habitación." },
      { icon: "🚿", label: "Baño privado", text: "Instalaciones limpias y prácticas." },
      { icon: "🌿", label: "Ambiente de jardín", text: "Disfruta de la calma de la finca de Kambos." },
      { icon: "🍽️", label: "Kitchenette", text: "Disponible en algunas habitaciones de primera planta." },
    ],
  },
  individualRooms: {
    ...standardDoubleRoomEn.individualRooms,
    kicker: "Habitaciones disponibles",
    title: "Elige tu habitación estándar",
    description:
      "Esta categoría incluye habitaciones de planta baja con acceso directo al jardín y habitaciones de primera planta con ambiente de terraza. Algunas habitaciones de primera planta también incluyen kitchenette.",
  },
  bestFor: {
    kicker: "Ideal para",
    title: "¿Para quién es esta categoría?",
    items: [
      "Parejas que quieren más comodidad que en la categoría económica.",
      "Amigos que viajan juntos y necesitan camas flexibles.",
      "Familias pequeñas que buscan alojamiento práctico en Kambos.",
      "Huéspedes que desean elegir entre acceso al jardín y primera planta.",
    ],
  },
  booking: {
    ...standardDoubleRoomEn.booking,
    kicker: "Reserva directa",
    title: "Pregúntanos qué habitación estándar encaja con tu estancia",
    text: "Indícanos tus fechas, número de huéspedes y si prefieres planta baja o primera planta. Te sugeriremos la opción disponible más adecuada.",
    phoneLabel: "Llámanos",
    whatsappHref:
      "https://wa.me/306944474226?text=Hola!%20Estoy%20interesado%20en%20las%20habitaciones%20dobles%20o%20triples%20estándar%20en%20Quíos.",
    note: "La reserva directa puede facilitar mejor comunicación, sugerencias flexibles y códigos de descuento disponibles.",
  },
  faq: [
    {
      question: "¿Las habitaciones estándar son adecuadas para 3 personas?",
      answer:
        "Sí. Varias habitaciones estándar pueden alojar a 2 o 3 personas, y algunas hasta 4 según la distribución.",
    },
    {
      question: "¿Puedo elegir planta baja o primera planta?",
      answer:
        "Puedes indicar tu preferencia. La asignación final depende de la disponibilidad para tus fechas.",
    },
    {
      question: "¿Las habitaciones tienen cocina?",
      answer:
        "Algunas habitaciones de primera planta pueden incluir kitchenette. Si necesitas una cocina completa, los apartamentos familiares suelen ser mejor opción.",
    },
  ],
};

/* ==========================================================================
   STANDARD DOUBLE / TRIPLE ROOMS — TR
   ========================================================================== */

export const standardDoubleRoomTr: RoomDetailData = {
  ...standardDoubleRoomEn,
  seo: {
    ...standardDoubleRoomEn.seo,
    canonicalPath: "/tr/chios-odalari/standart-cift-kisilik-odalar/",
    title: "Sakız Adası Standart Çift & Üç Kişilik Odalar | Voulamandis House",
    description:
      "Sakız Adası Kambos’ta Voulamandis House standart çift ve üç kişilik odalar. Bahçe erişimli zemin kat veya teras hissi veren birinci kat seçenekleri.",
  },
  hero: {
    ...standardDoubleRoomEn.hero,
    kicker: "Sakız Adası standart odaları",
    title: "Sakız Adası çift ve üç kişilik odalar",
    subtitle: "Kambos’ta zemin kat veya birinci katta konfor",
    description:
      "Çiftler, arkadaşlar ve küçük aileler için konforlu çift ve üç kişilik odalar. Zemin katta kolay bahçe erişimini veya birinci katta daha aydınlık bir konaklamayı seçin.",
    imageAlt: "Sakız Adası Voulamandis House standart çift ve üç kişilik oda",
    badges: ["2–4 kişi", "Bahçe veya teras hissi", "Ücretsiz WiFi", "Klima"],
    primaryCta: { ...standardDoubleRoomEn.hero.primaryCta, label: "Doğrudan rezervasyon" },
    secondaryCta: { ...standardDoubleRoomEn.hero.secondaryCta, label: "Müsaitlik sor" },
  },
  overview: {
    kicker: "Oda özeti",
    title: "Çiftler, arkadaşlar ve küçük aileler için esnek odalar",
    paragraphs: [
      "Voulamandis House standart çift ve üç kişilik odaları, daha fazla konfor, pratik alan ve Kambos’un sakin atmosferini isteyen misafirler için tasarlanmıştır.",
      "Zemin kat odalar avlu ve bahçeye kolay erişim isteyenler için idealdir. Birinci kat odalar daha aydınlık bir konaklama ve ortak teras alanına erişim sunar.",
      "Havalimanına, Sakız şehir merkezine ve adanın plajlarına yakın konaklama arayan çiftler, arkadaşlar ve küçük aileler için pratik bir seçenektir.",
    ],
    highlights: [
      { label: "Kişi", value: "2–4" },
      { label: "Oda tipi", value: "Çift / Üç kişilik" },
      { label: "Konum", value: "Zemin kat & birinci kat" },
      { label: "Stil", value: "Geleneksel Kambos" },
    ],
  },
  gallery: { ...standardDoubleRoomEn.gallery, kicker: "Oda fotoğrafları", title: "Oda atmosferini görün" },
  amenities: {
    kicker: "Olanaklar",
    title: "Konforlu bir konaklama için ihtiyacınız olanlar",
    items: [
      { icon: "📶", label: "Ücretsiz WiFi", text: "Konaklamanız boyunca bağlantıda kalın." },
      { icon: "❄️", label: "Klima", text: "Sakız yazında konfor sağlar." },
      { icon: "📺", label: "LCD TV", text: "Odada basit eğlence imkânı." },
      { icon: "🧊", label: "Buzdolabı", text: "İçecekler, atıştırmalıklar ve meyveler için kullanışlıdır." },
      { icon: "☕", label: "Su ısıtıcısı", text: "Odada kahve veya çay hazırlayın." },
      { icon: "🚿", label: "Özel banyo", text: "Temiz ve pratik banyo olanakları." },
      { icon: "🌿", label: "Bahçe atmosferi", text: "Kambos arazisinin sakin hissini yaşayın." },
      { icon: "🍽️", label: "Kitchenette", text: "Bazı birinci kat odalarda mevcuttur." },
    ],
  },
  individualRooms: {
    ...standardDoubleRoomEn.individualRooms,
    kicker: "Mevcut odalar",
    title: "Size uygun standart odayı seçin",
    description:
      "Bu kategori doğrudan bahçe erişimli zemin kat odalar ve teras hissi veren birinci kat odaları içerir. Bazı birinci kat odalarda kitchenette de bulunur.",
  },
  bestFor: {
    kicker: "Kimler için ideal",
    title: "Bu oda kategorisi kimler için uygun?",
    items: [
      "Economy kategorisine göre daha fazla konfor isteyen çiftler.",
      "Birlikte seyahat eden ve esnek yatak düzeni isteyen arkadaşlar.",
      "Kambos’ta pratik konaklama arayan küçük aileler.",
      "Bahçe erişimi ile birinci kat hissi arasında seçim yapmak isteyen misafirler.",
    ],
  },
  booking: {
    ...standardDoubleRoomEn.booking,
    kicker: "Doğrudan rezervasyon",
    title: "Konaklamanıza hangi standart oda uygun, bize sorun",
    text: "Tarihlerinizi, kişi sayısını ve zemin kat mı birinci kat mı tercih ettiğinizi söyleyin. Size en uygun müsait seçeneği önerelim.",
    phoneLabel: "Bizi arayın",
    whatsappHref:
      "https://wa.me/306944474226?text=Merhaba!%20Sakız%20Adası'ndaki%20standart%20çift%20veya%20üç%20kişilik%20odalar%20ile%20ilgileniyorum.",
    note: "Doğrudan rezervasyon daha iyi iletişim, esnek öneriler ve mevcut indirim kodları sağlayabilir.",
  },
  faq: [
    {
      question: "Standart odalar 3 kişi için uygun mu?",
      answer:
        "Evet. Birçok standart oda 2 veya 3 kişi ağırlayabilir; bazı odalar yerleşime göre 4 kişiye kadar uygundur.",
    },
    {
      question: "Zemin kat veya birinci kat seçebilir miyim?",
      answer:
        "Tercihinizi belirtebilirsiniz. Son oda tahsisi, tarihlerinize göre müsaitliğe bağlıdır.",
    },
    {
      question: "Odalarda mutfak imkânı var mı?",
      answer:
        "Bazı birinci kat odalarda kitchenette bulunabilir. Tam mutfağa ihtiyacınız varsa aile apartları genellikle daha iyi seçimdir.",
    },
  ],
};

export const standardDoubleRoom = standardDoubleRoomEn;

/* ==========================================================================
   ECONOMY DOUBLE ROOMS — EN
   ========================================================================== */

export const economyDoubleRoomsEn: RoomDetailData = {
  id: "economy-double-rooms",
  seo: {
    canonicalPath: "/chios-rooms/economy-double-rooms/",
    title: "Economy Double Rooms in Chios | Voulamandis House",
    description:
      "Economy double rooms in Chios at Voulamandis House. A value-for-money option for 2 guests in the peaceful Kambos area.",
    ogImage:
      "/images/rooms/received_1753964631359257.webp",
  },
  hero: {
    kicker: "Economy rooms in Chios",
    title: "Economy double rooms in Chios",
    subtitle: "Best value option for 2 guests",
    description:
      "Simple, comfortable and value-focused double rooms for guests who want to enjoy Chios while keeping accommodation practical and affordable.",
    image:
      "/images/rooms/received_1753964631359257.webp",
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
    title: "A practical value-for-money stay in Kambos",
    paragraphs: [
      "The economy double rooms are ideal for guests who want a simple and comfortable base in Chios without paying for extra space they may not need.",
      "They are suitable for couples, solo travellers or two friends who plan to explore the island during the day and return to a peaceful Kambos setting.",
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
        src: "/images/rooms/received_1753964631359257.webp",
        alt: "Economy double room at Voulamandis House",
      },
      {
        src: "/images/rooms/received_1753964581359262.webp",
        alt: "Economy room bed in Chios",
      },
      {
        src: "/images/rooms/received_1753968691358851.webp",
        alt: "Economy room interior at Voulamandis House",
      },
      {
        src: "/images/rooms/received_1753969201358800.webp",
        alt: "Economy room bathroom and interior details",
      },
      {
        src: "/images/rooms/DSC07803-1.webp",
        alt: "Economy double room in Chios",
      },
      {
        src: "/images/rooms/DSC07839.webp",
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
      "The economy category includes two renovated 16m² double rooms: Room 6 on the ground floor with direct garden access, and Room 2 on the first floor with Kambos view.",
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
            src: "/images/rooms/received_1753964631359257.webp",
            alt: "Economy double room in Chios No. 6 on the ground floor with garden access - Voulamandis House",
            caption: "Room",
          },
          {
            src: "/images/rooms/received_1753964581359262.webp",
            alt: "Workspace and small desk in economy double room No. 6 in Chios",
            caption: "Double bed",
          },
          {
            src: "/images/rooms/received_1753968691358851.webp",
            alt: "Renovated bathroom of economy double room No. 6 in Chios",
            caption: "Desk",
          },
          {
            src: "/images/rooms/received_1753969201358800.webp",
            alt: "Interior and decoration of economy double room No. 6 in Kambos Chios",
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
          "Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kambos.",
        badges: ["First floor", "Kambos view", "Access by stairs", "Economy"],
        beds: ["1 double bed"],
        amenities: [
          { icon: "📶", label: "Wi-Fi" },
          { icon: "☕", label: "Coffee and tea kettle" },
          { icon: "🪜", label: "Access by stairs" },
          { icon: "📐", label: "Open-plan space" },
        ],
        images: [
          {
            src: "/images/rooms/DSC07803-1.webp",
            alt: "Economy double room No. 2 in Chios on the first floor with a view - Voulamandis House",
            caption: "Room view",
          },
          {
            src: "/images/rooms/DSC07839.webp",
            alt: "Lighting and atmosphere in economy double room No. 2 on the first floor",
            caption: "Layout",
          },
          {
            src: "/images/rooms/DSC07832.webp",
            alt: "Stone wall detail in economy double room No. 2 in Chios",
            caption: "Detail",
          },
          {
            src: "/images/rooms/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp",
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
/* ==========================================================================
   ECONOMY DOUBLE ROOMS — EL
   ========================================================================== */

export const economyDoubleRoomsEl: RoomDetailData = {
  ...economyDoubleRoomsEn,
  seo: {
    ...economyDoubleRoomsEn.seo,
    canonicalPath: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    title: "Οικονομικό Δίκλινο Δωμάτιο στη Χίο | Voulamandis House",
    description:
      "Οικονομικά δίκλινα δωμάτια στη Χίο στο Voulamandis House. Μια πρακτική και προσιτή επιλογή για 2 άτομα στην ήσυχη περιοχή του Κάμπου.",
  },
  hero: {
    ...economyDoubleRoomsEn.hero,
    kicker: "Οικονομικά δωμάτια στη Χίο",
    title: "Οικονομικό δίκλινο δωμάτιο στη Χίο",
    subtitle: "Η πιο προσιτή επιλογή για 2 άτομα",
    description:
      "Απλά, άνετα και οικονομικά δίκλινα δωμάτια για επισκέπτες που θέλουν να απολαύσουν τη Χίο με πρακτική και προσιτή διαμονή.",
    imageAlt: "Οικονομικό δίκλινο δωμάτιο στη Χίο στο Voulamandis House",
    badges: ["2 άτομα", "Οικονομική επιλογή", "Δωρεάν WiFi", "Κλιματισμός"],
    primaryCta: {
      ...economyDoubleRoomsEn.hero.primaryCta,
      label: "Κάντε κράτηση",
    },
    secondaryCta: {
      ...economyDoubleRoomsEn.hero.secondaryCta,
      label: "Ρωτήστε διαθεσιμότητα",
    },
  },
  overview: {
    kicker: "Περιγραφή δωματίου",
    title: "Πρακτική και οικονομική διαμονή στον Κάμπο",
    paragraphs: [
      "Τα οικονομικά δίκλινα δωμάτια είναι ιδανικά για επισκέπτες που θέλουν μια απλή και άνετη βάση στη Χίο, χωρίς να πληρώνουν για επιπλέον χώρο που ίσως δεν χρειάζονται.",
      "Είναι κατάλληλα για ζευγάρια, solo ταξιδιώτες ή δύο φίλους που σκοπεύουν να εξερευνήσουν το νησί μέσα στην ημέρα και να επιστρέψουν σε ένα ήσυχο περιβάλλον στον Κάμπο.",
      "Είναι η καλύτερη κατηγορία αν προτεραιότητά σας είναι η τιμή, η τοποθεσία και η βασική άνεση.",
    ],
    highlights: [
      { label: "Άτομα", value: "2" },
      { label: "Τύπος", value: "Οικονομικό δίκλινο" },
      { label: "Μέγεθος", value: "Περ. 16m²" },
      { label: "Στυλ", value: "Απλή άνεση" },
    ],
  },
  gallery: {
    ...economyDoubleRoomsEn.gallery,
    kicker: "Φωτογραφίες δωματίου",
    title: "Μια απλή και πρακτική βάση διαμονής",
  },
  amenities: {
    kicker: "Παροχές",
    title: "Βασική άνεση για τη διαμονή σας",
    items: [
      { icon: "📶", label: "Δωρεάν WiFi", text: "Πρόσβαση στο internet κατά τη διαμονή σας." },
      { icon: "❄️", label: "Κλιματισμός", text: "Άνεση τις ζεστές ημέρες του καλοκαιριού." },
      { icon: "🧊", label: "Ψυγείο", text: "Χρήσιμο για νερά, ποτά και σνακ." },
      { icon: "☕", label: "Βραστήρας", text: "Για καφέ ή τσάι μέσα στο δωμάτιο." },
      { icon: "💨", label: "Πιστολάκι μαλλιών", text: "Πρακτική παροχή μπάνιου." },
      { icon: "🪑", label: "Μικρό γραφείο", text: "Χρήσιμο για ελαφριά εργασία ή οργάνωση της ημέρας." },
    ],
  },
  individualRooms: {
    ...economyDoubleRoomsEn.individualRooms,
    kicker: "Διαθέσιμα δωμάτια",
    title: "Επιλέξτε το οικονομικό δωμάτιο που σας ταιριάζει",
    description:
      "Η οικονομική κατηγορία περιλαμβάνει δύο ανακαινισμένα δίκλινα δωμάτια περίπου 16m²: το Δωμάτιο 6 στο ισόγειο με άμεση πρόσβαση στον κήπο και το Δωμάτιο 2 στον πρώτο όροφο με θέα στον Κάμπο.",
  },
  bestFor: {
    kicker: "Ιδανικό για",
    title: "Ποιοι πρέπει να επιλέξουν τα οικονομικά δίκλινα;",
    items: [
      "Ζευγάρια που αναζητούν την πιο οικονομική κατηγορία δωματίου.",
      "Solo ταξιδιώτες που θέλουν ήσυχη και πρακτική διαμονή.",
      "Επισκέπτες που σκοπεύουν να περνούν την ημέρα τους εξερευνώντας τη Χίο.",
      "Ταξιδιώτες που δίνουν προτεραιότητα στην τοποθεσία και την τιμή αντί για επιπλέον χώρο.",
    ],
  },
  booking: {
    ...economyDoubleRoomsEn.booking,
    kicker: "Απευθείας κράτηση",
    title: "Ρωτήστε μας για την καλύτερη διαθέσιμη οικονομική επιλογή",
    text: "Πείτε μας τις ημερομηνίες σας και θα σας ενημερώσουμε ποιο οικονομικό δίκλινο είναι διαθέσιμο για τη διαμονή σας.",
    phoneLabel: "Καλέστε μας",
    whatsappHref:
      "https://wa.me/306944474226?text=Γεια%20σας!%20Ενδιαφέρομαι%20για%20το%20οικονομικό%20δίκλινο%20δωμάτιο%20στη%20Χίο.",
    note: "Τα οικονομικά δωμάτια είναι περιορισμένα, οπότε η διαθεσιμότητα αλλάζει γρήγορα στην υψηλή περίοδο.",
  },
  faq: [
    {
      question: "Πόσα άτομα μπορούν να μείνουν σε οικονομικό δίκλινο δωμάτιο;",
      answer: "Τα οικονομικά δίκλινα δωμάτια είναι σχεδιασμένα για έως 2 άτομα.",
    },
    {
      question: "Είναι τα οικονομικά δωμάτια η πιο προσιτή κατηγορία;",
      answer:
        "Ναι, είναι συνήθως η πιο οικονομική επιλογή διαμονής στο Voulamandis House.",
    },
    {
      question: "Έχουν τα οικονομικά δωμάτια κλιματισμό;",
      answer:
        "Ναι, τα δωμάτια περιλαμβάνουν βασικές παροχές όπως κλιματισμό, WiFi, ψυγείο και ιδιωτικό μπάνιο.",
    },
  ],
};

/* ==========================================================================
   ECONOMY DOUBLE ROOMS — FR
   ========================================================================== */

export const economyDoubleRoomsFr: RoomDetailData = {
  ...economyDoubleRoomsEn,
  seo: {
    ...economyDoubleRoomsEn.seo,
    canonicalPath: "/fr/chambres-a-chios/chambres-doubles-economiques/",
    title: "Chambre Double Économique à Chios | Voulamandis House",
    description:
      "Chambres doubles économiques à Chios au Voulamandis House. Une option pratique et abordable pour 2 personnes dans le quartier paisible de Kambos.",
  },
  hero: {
    ...economyDoubleRoomsEn.hero,
    kicker: "Chambres économiques à Chios",
    title: "Chambre double économique à Chios",
    subtitle: "Le meilleur rapport qualité-prix pour 2 personnes",
    description:
      "Des chambres doubles simples, confortables et abordables pour profiter de Chios avec une solution d’hébergement pratique.",
    imageAlt: "Chambre double économique à Chios au Voulamandis House",
    badges: ["2 personnes", "Choix économique", "WiFi gratuit", "Climatisation"],
    primaryCta: { ...economyDoubleRoomsEn.hero.primaryCta, label: "Réserver en direct" },
    secondaryCta: { ...economyDoubleRoomsEn.hero.secondaryCta, label: "Demander la disponibilité" },
  },
  overview: {
    kicker: "Aperçu de la chambre",
    title: "Un séjour pratique et économique à Kambos",
    paragraphs: [
      "Les chambres doubles économiques sont idéales pour les voyageurs qui souhaitent une base simple et confortable à Chios, sans payer pour un espace supplémentaire dont ils n’ont pas forcément besoin.",
      "Elles conviennent aux couples, aux voyageurs seuls ou à deux amis qui souhaitent explorer l’île pendant la journée et revenir dans un environnement calme à Kambos.",
      "C’est la meilleure catégorie si vos priorités sont le prix, l’emplacement et le confort essentiel.",
    ],
    highlights: [
      { label: "Personnes", value: "2" },
      { label: "Type", value: "Double économique" },
      { label: "Surface", value: "Env. 16m²" },
      { label: "Style", value: "Confort simple" },
    ],
  },
  gallery: {
    ...economyDoubleRoomsEn.gallery,
    kicker: "Photos de la chambre",
    title: "Une base simple et pratique",
  },
  amenities: {
    kicker: "Équipements",
    title: "Le confort essentiel pour votre séjour",
    items: [
      { icon: "📶", label: "WiFi gratuit", text: "Accès internet pendant votre séjour." },
      { icon: "❄️", label: "Climatisation", text: "Confort pendant l’été à Chios." },
      { icon: "🧊", label: "Réfrigérateur", text: "Pratique pour les boissons et les snacks." },
      { icon: "☕", label: "Bouilloire", text: "Préparez café ou thé dans la chambre." },
      { icon: "💨", label: "Sèche-cheveux", text: "Équipement pratique dans la salle de bain." },
      { icon: "🪑", label: "Petit bureau", text: "Utile pour travailler légèrement ou organiser votre journée." },
    ],
  },
  individualRooms: {
    ...economyDoubleRoomsEn.individualRooms,
    kicker: "Chambres disponibles",
    title: "Choisissez votre chambre économique",
    description:
      "Cette catégorie comprend deux chambres doubles rénovées d’environ 16m² : la chambre 6 au rez-de-chaussée avec accès direct au jardin et la chambre 2 au premier étage avec vue sur Kambos.",
  },
  bestFor: {
    kicker: "Idéal pour",
    title: "À qui conviennent les chambres doubles économiques ?",
    items: [
      "Les couples qui recherchent la catégorie la plus abordable.",
      "Les voyageurs seuls qui souhaitent un séjour calme et pratique.",
      "Les hôtes qui passent la journée à explorer Chios.",
      "Les voyageurs qui privilégient l’emplacement et le prix plutôt que l’espace supplémentaire.",
    ],
  },
  booking: {
    ...economyDoubleRoomsEn.booking,
    kicker: "Réservation directe",
    title: "Demandez la meilleure option économique disponible",
    text: "Envoyez-nous vos dates et nous vous indiquerons quelle chambre double économique est disponible.",
    phoneLabel: "Appelez-nous",
    whatsappHref:
      "https://wa.me/306944474226?text=Bonjour!%20Je%20suis%20intéressé(e)%20par%20la%20chambre%20double%20économique%20à%20Chios.",
    note: "Les chambres économiques sont limitées, donc la disponibilité peut changer rapidement en haute saison.",
  },
  faq: [
    {
      question: "Combien de personnes peuvent séjourner dans une chambre double économique ?",
      answer: "Les chambres doubles économiques sont conçues pour accueillir jusqu’à 2 personnes.",
    },
    {
      question: "Les chambres économiques sont-elles la catégorie la moins chère ?",
      answer:
        "Oui, elles sont généralement l’option la plus abordable au Voulamandis House.",
    },
    {
      question: "Les chambres économiques disposent-elles de la climatisation ?",
      answer:
        "Oui, elles incluent les équipements essentiels comme la climatisation, le WiFi, un réfrigérateur et une salle de bain privée.",
    },
  ],
};

/* ==========================================================================
   ECONOMY DOUBLE ROOMS — DE
   ========================================================================== */

export const economyDoubleRoomsDe: RoomDetailData = {
  ...economyDoubleRoomsEn,
  seo: {
    ...economyDoubleRoomsEn.seo,
    canonicalPath: "/de/zimmer-chios/economy-zimmer-auf-chios/",
    title: "Economy Doppelzimmer auf Chios | Voulamandis House",
    description:
      "Economy Doppelzimmer auf Chios im Voulamandis House. Eine praktische und preiswerte Option für 2 Gäste im ruhigen Kambos.",
  },
  hero: {
    ...economyDoubleRoomsEn.hero,
    kicker: "Economy Zimmer auf Chios",
    title: "Economy Doppelzimmer auf Chios",
    subtitle: "Die beste Preis-Leistungs-Option für 2 Gäste",
    description:
      "Einfache, komfortable und preiswerte Doppelzimmer für Gäste, die Chios praktisch und erschwinglich erleben möchten.",
    imageAlt: "Economy Doppelzimmer auf Chios im Voulamandis House",
    badges: ["2 Gäste", "Economy Auswahl", "Kostenloses WiFi", "Klimaanlage"],
    primaryCta: { ...economyDoubleRoomsEn.hero.primaryCta, label: "Direkt buchen" },
    secondaryCta: { ...economyDoubleRoomsEn.hero.secondaryCta, label: "Verfügbarkeit anfragen" },
  },
  overview: {
    kicker: "Zimmerüberblick",
    title: "Praktischer und preiswerter Aufenthalt in Kambos",
    paragraphs: [
      "Die Economy Doppelzimmer sind ideal für Gäste, die eine einfache und komfortable Basis auf Chios suchen, ohne für zusätzlichen Platz zu zahlen.",
      "Sie eignen sich für Paare, Alleinreisende oder zwei Freunde, die tagsüber die Insel erkunden und abends in eine ruhige Umgebung in Kambos zurückkehren möchten.",
      "Diese Kategorie ist die beste Wahl, wenn Preis, Lage und grundlegender Komfort im Vordergrund stehen.",
    ],
    highlights: [
      { label: "Gäste", value: "2" },
      { label: "Zimmertyp", value: "Economy Doppelzimmer" },
      { label: "Größe", value: "Ca. 16m²" },
      { label: "Stil", value: "Einfacher Komfort" },
    ],
  },
  gallery: {
    ...economyDoubleRoomsEn.gallery,
    kicker: "Zimmerfotos",
    title: "Eine einfache und praktische Unterkunftsbasis",
  },
  amenities: {
    kicker: "Ausstattung",
    title: "Wesentlicher Komfort für Ihren Aufenthalt",
    items: [
      { icon: "📶", label: "Kostenloses WiFi", text: "Internet während Ihres Aufenthalts." },
      { icon: "❄️", label: "Klimaanlage", text: "Komfort an warmen Sommertagen." },
      { icon: "🧊", label: "Kühlschrank", text: "Praktisch für Getränke und Snacks." },
      { icon: "☕", label: "Wasserkocher", text: "Kaffee oder Tee direkt im Zimmer." },
      { icon: "💨", label: "Haartrockner", text: "Praktische Badezimmereinrichtung." },
      { icon: "🪑", label: "Kleiner Schreibtisch", text: "Nützlich für leichte Arbeit oder Tagesplanung." },
    ],
  },
  individualRooms: {
    ...economyDoubleRoomsEn.individualRooms,
    kicker: "Verfügbare Zimmer",
    title: "Wählen Sie Ihr Economy Zimmer",
    description:
      "Die Economy Kategorie umfasst zwei renovierte Doppelzimmer von etwa 16m²: Zimmer 6 im Erdgeschoss mit direktem Gartenzugang und Zimmer 2 im ersten Stock mit Blick auf Kambos.",
  },
  bestFor: {
    kicker: "Ideal für",
    title: "Für wen sind die Economy Doppelzimmer geeignet?",
    items: [
      "Paare, die die preiswerteste Zimmerkategorie suchen.",
      "Alleinreisende, die ruhig und praktisch wohnen möchten.",
      "Gäste, die den Tag hauptsächlich mit der Erkundung von Chios verbringen.",
      "Reisende, denen Lage und Preis wichtiger sind als zusätzlicher Platz.",
    ],
  },
  booking: {
    ...economyDoubleRoomsEn.booking,
    kicker: "Direktbuchung",
    title: "Fragen Sie nach der besten verfügbaren Economy Option",
    text: "Teilen Sie uns Ihre Daten mit und wir sagen Ihnen, welches Economy Doppelzimmer verfügbar ist.",
    phoneLabel: "Anrufen",
    whatsappHref:
      "https://wa.me/306944474226?text=Hallo!%20Ich%20interessiere%20mich%20für%20das%20Economy%20Doppelzimmer%20auf%20Chios.",
    note: "Economy Zimmer sind begrenzt, daher kann sich die Verfügbarkeit in der Hochsaison schnell ändern.",
  },
  faq: [
    {
      question: "Wie viele Gäste können in einem Economy Doppelzimmer übernachten?",
      answer: "Die Economy Doppelzimmer sind für bis zu 2 Gäste ausgelegt.",
    },
    {
      question: "Sind die Economy Zimmer die günstigste Kategorie?",
      answer:
        "Ja, sie sind normalerweise die preiswerteste Option im Voulamandis House.",
    },
    {
      question: "Haben die Economy Zimmer eine Klimaanlage?",
      answer:
        "Ja, die Zimmer verfügen über wichtige Ausstattungen wie Klimaanlage, WiFi, Kühlschrank und eigenes Bad.",
    },
  ],
};

/* ==========================================================================
   ECONOMY DOUBLE ROOMS — IT
   ========================================================================== */

export const economyDoubleRoomsIt: RoomDetailData = {
  ...economyDoubleRoomsEn,
  seo: {
    ...economyDoubleRoomsEn.seo,
    canonicalPath: "/it/stanze-a-chios/camera-doppia-economica-chios/",
    title: "Camera Doppia Economy a Chios | Voulamandis House",
    description:
      "Camera doppia economy a Chios presso Voulamandis House. Una soluzione pratica e conveniente per 2 ospiti nella tranquilla zona di Kambos.",
  },
  hero: {
    ...economyDoubleRoomsEn.hero,
    kicker: "Camere economy a Chios",
    title: "Camera doppia economy a Chios",
    subtitle: "La soluzione con il miglior rapporto qualità-prezzo per 2 ospiti",
    description:
      "Camere doppie semplici, confortevoli e convenienti per vivere Chios con un alloggio pratico e accessibile.",
    imageAlt: "Camera doppia economy a Chios presso Voulamandis House",
    badges: ["2 ospiti", "Scelta economy", "WiFi gratuito", "Aria condizionata"],
    primaryCta: { ...economyDoubleRoomsEn.hero.primaryCta, label: "Prenota direttamente" },
    secondaryCta: { ...economyDoubleRoomsEn.hero.secondaryCta, label: "Chiedi disponibilità" },
  },
  overview: {
    kicker: "Panoramica camera",
    title: "Un soggiorno pratico e conveniente a Kambos",
    paragraphs: [
      "Le camere doppie economy sono ideali per chi cerca una base semplice e confortevole a Chios, senza pagare per spazio extra non necessario.",
      "Sono adatte a coppie, viaggiatori singoli o due amici che desiderano esplorare l’isola durante il giorno e tornare in un ambiente tranquillo a Kambos.",
      "È la categoria migliore se le tue priorità sono prezzo, posizione e comfort essenziale.",
    ],
    highlights: [
      { label: "Ospiti", value: "2" },
      { label: "Tipo", value: "Doppia economy" },
      { label: "Dimensione", value: "Circa 16m²" },
      { label: "Stile", value: "Comfort semplice" },
    ],
  },
  gallery: {
    ...economyDoubleRoomsEn.gallery,
    kicker: "Foto della camera",
    title: "Una base semplice e pratica",
  },
  amenities: {
    kicker: "Servizi",
    title: "Comfort essenziale per il tuo soggiorno",
    items: [
      { icon: "📶", label: "WiFi gratuito", text: "Accesso internet durante il soggiorno." },
      { icon: "❄️", label: "Aria condizionata", text: "Comfort durante l’estate a Chios." },
      { icon: "🧊", label: "Frigorifero", text: "Utile per bevande e snack." },
      { icon: "☕", label: "Bollitore", text: "Per preparare caffè o tè in camera." },
      { icon: "💨", label: "Asciugacapelli", text: "Comodo servizio bagno." },
      { icon: "🪑", label: "Piccola scrivania", text: "Utile per lavorare leggermente o pianificare la giornata." },
    ],
  },
  individualRooms: {
    ...economyDoubleRoomsEn.individualRooms,
    kicker: "Camere disponibili",
    title: "Scegli la tua camera economy",
    description:
      "La categoria economy comprende due camere doppie rinnovate di circa 16m²: la Camera 6 al piano terra con accesso diretto al giardino e la Camera 2 al primo piano con vista su Kambos.",
  },
  bestFor: {
    kicker: "Ideale per",
    title: "A chi consigliamo le camere doppie economy?",
    items: [
      "Coppie che cercano la categoria più conveniente.",
      "Viaggiatori singoli che desiderano un soggiorno tranquillo e pratico.",
      "Ospiti che passeranno gran parte della giornata a esplorare Chios.",
      "Viaggiatori che danno più importanza a posizione e prezzo che allo spazio extra.",
    ],
  },
  booking: {
    ...economyDoubleRoomsEn.booking,
    kicker: "Prenotazione diretta",
    title: "Chiedici la migliore opzione economy disponibile",
    text: "Indicaci le date del tuo soggiorno e ti diremo quale camera doppia economy è disponibile.",
    phoneLabel: "Chiamaci",
    whatsappHref:
      "https://wa.me/306944474226?text=Buongiorno!%20Sono%20interessato%20alla%20camera%20doppia%20economy%20a%20Chios.",
    note: "Le camere economy sono limitate, quindi la disponibilità può cambiare rapidamente in alta stagione.",
  },
  faq: [
    {
      question: "Quanti ospiti possono soggiornare in una camera doppia economy?",
      answer: "Le camere doppie economy sono pensate per un massimo di 2 ospiti.",
    },
    {
      question: "Le camere economy sono la categoria più economica?",
      answer:
        "Sì, sono di solito l’opzione più conveniente presso Voulamandis House.",
    },
    {
      question: "Le camere economy hanno l’aria condizionata?",
      answer:
        "Sì, includono servizi essenziali come aria condizionata, WiFi, frigorifero e bagno privato.",
    },
  ],
};

/* ==========================================================================
   ECONOMY DOUBLE ROOMS — ES
   ========================================================================== */

export const economyDoubleRoomsEs: RoomDetailData = {
  ...economyDoubleRoomsEn,
  seo: {
    ...economyDoubleRoomsEn.seo,
    canonicalPath: "/es/habitaciones-en-chios/economicas-habitaciones-en-chios/",
    title: "Habitación Doble Económica en Quíos | Voulamandis House",
    description:
      "Habitación doble económica en Quíos en Voulamandis House. Una opción práctica y asequible para 2 personas en la tranquila zona de Kambos.",
  },
  hero: {
    ...economyDoubleRoomsEn.hero,
    kicker: "Habitaciones económicas en Quíos",
    title: "Habitación doble económica en Quíos",
    subtitle: "La mejor opción calidad-precio para 2 personas",
    description:
      "Habitaciones dobles sencillas, cómodas y asequibles para disfrutar de Quíos con una estancia práctica.",
    imageAlt: "Habitación doble económica en Quíos en Voulamandis House",
    badges: ["2 personas", "Opción económica", "WiFi gratis", "Aire acondicionado"],
    primaryCta: { ...economyDoubleRoomsEn.hero.primaryCta, label: "Reservar directo" },
    secondaryCta: { ...economyDoubleRoomsEn.hero.secondaryCta, label: "Consultar disponibilidad" },
  },
  overview: {
    kicker: "Resumen de la habitación",
    title: "Una estancia práctica y económica en Kambos",
    paragraphs: [
      "Las habitaciones dobles económicas son ideales para huéspedes que buscan una base sencilla y cómoda en Quíos sin pagar por espacio adicional que quizá no necesiten.",
      "Son adecuadas para parejas, viajeros solos o dos amigos que desean explorar la isla durante el día y volver a un entorno tranquilo en Kambos.",
      "Es la mejor categoría si tus prioridades son precio, ubicación y comodidad esencial.",
    ],
    highlights: [
      { label: "Personas", value: "2" },
      { label: "Tipo", value: "Doble económica" },
      { label: "Tamaño", value: "Aprox. 16m²" },
      { label: "Estilo", value: "Comodidad sencilla" },
    ],
  },
  gallery: {
    ...economyDoubleRoomsEn.gallery,
    kicker: "Fotos de la habitación",
    title: "Una base sencilla y práctica",
  },
  amenities: {
    kicker: "Servicios",
    title: "Comodidad esencial para tu estancia",
    items: [
      { icon: "📶", label: "WiFi gratis", text: "Acceso a internet durante la estancia." },
      { icon: "❄️", label: "Aire acondicionado", text: "Confort durante el verano en Quíos." },
      { icon: "🧊", label: "Nevera", text: "Útil para bebidas y aperitivos." },
      { icon: "☕", label: "Hervidor", text: "Para preparar café o té en la habitación." },
      { icon: "💨", label: "Secador de pelo", text: "Servicio práctico de baño." },
      { icon: "🪑", label: "Pequeño escritorio", text: "Útil para trabajar un poco o planificar el día." },
    ],
  },
  individualRooms: {
    ...economyDoubleRoomsEn.individualRooms,
    kicker: "Habitaciones disponibles",
    title: "Elige tu habitación económica",
    description:
      "La categoría económica incluye dos habitaciones dobles renovadas de unos 16m²: la Habitación 6 en planta baja con acceso directo al jardín y la Habitación 2 en primera planta con vistas a Kambos.",
  },
  bestFor: {
    kicker: "Ideal para",
    title: "¿Para quién son las habitaciones dobles económicas?",
    items: [
      "Parejas que buscan la categoría más económica.",
      "Viajeros solos que quieren una estancia tranquila y práctica.",
      "Huéspedes que pasarán la mayor parte del día explorando Quíos.",
      "Viajeros que valoran más la ubicación y el precio que el espacio adicional.",
    ],
  },
  booking: {
    ...economyDoubleRoomsEn.booking,
    kicker: "Reserva directa",
    title: "Pregúntanos por la mejor opción económica disponible",
    text: "Indícanos tus fechas y te diremos qué habitación doble económica está disponible.",
    phoneLabel: "Llámanos",
    whatsappHref:
      "https://wa.me/306944474226?text=Hola!%20Estoy%20interesado%20en%20la%20habitación%20doble%20económica%20en%20Quíos.",
    note: "Las habitaciones económicas son limitadas, por lo que la disponibilidad puede cambiar rápidamente en temporada alta.",
  },
  faq: [
    {
      question: "¿Cuántas personas pueden alojarse en una habitación doble económica?",
      answer: "Las habitaciones dobles económicas están diseñadas para hasta 2 personas.",
    },
    {
      question: "¿Son las habitaciones económicas la categoría más barata?",
      answer:
        "Sí, normalmente son la opción más asequible en Voulamandis House.",
    },
    {
      question: "¿Las habitaciones económicas tienen aire acondicionado?",
      answer:
        "Sí, incluyen servicios esenciales como aire acondicionado, WiFi, nevera y baño privado.",
    },
  ],
};

/* ==========================================================================
   ECONOMY DOUBLE ROOMS — TR
   ========================================================================== */

export const economyDoubleRoomsTr: RoomDetailData = {
  ...economyDoubleRoomsEn,
  seo: {
    ...economyDoubleRoomsEn.seo,
    canonicalPath: "/tr/chios-odalari/sakiz-adasindaki-ekonomi-cift-kisilik-oda/",
    title: "Sakız Adası Ekonomi Çift Kişilik Oda | Voulamandis House",
    description:
      "Sakız Adası’nda Voulamandis House’ta ekonomi çift kişilik oda. Kambos’un sakin bölgesinde 2 kişi için pratik ve uygun fiyatlı bir seçenek.",
  },
  hero: {
    ...economyDoubleRoomsEn.hero,
    kicker: "Sakız Adası ekonomi odaları",
    title: "Sakız Adası ekonomi çift kişilik oda",
    subtitle: "2 kişi için en uygun fiyatlı seçenek",
    description:
      "Sakız Adası’nı keşfetmek isteyen misafirler için sade, konforlu ve ekonomik çift kişilik odalar.",
    imageAlt: "Sakız Adası Voulamandis House ekonomi çift kişilik oda",
    badges: ["2 kişi", "Ekonomik seçenek", "Ücretsiz WiFi", "Klima"],
    primaryCta: { ...economyDoubleRoomsEn.hero.primaryCta, label: "Doğrudan rezervasyon" },
    secondaryCta: { ...economyDoubleRoomsEn.hero.secondaryCta, label: "Müsaitlik sor" },
  },
  overview: {
    kicker: "Oda özeti",
    title: "Kambos’ta pratik ve ekonomik konaklama",
    paragraphs: [
      "Ekonomi çift kişilik odalar, Sakız Adası’nda sade ve konforlu bir konaklama arayan, ekstra alana ihtiyaç duymayan misafirler için idealdir.",
      "Gün içinde adayı keşfedip akşam Kambos’un sakin atmosferine dönmek isteyen çiftler, tek seyahat edenler veya iki arkadaş için uygundur.",
      "Önceliğiniz fiyat, konum ve temel konfor ise bu kategori en doğru seçimdir.",
    ],
    highlights: [
      { label: "Kişi", value: "2" },
      { label: "Oda tipi", value: "Ekonomi çift kişilik" },
      { label: "Büyüklük", value: "Yaklaşık 16m²" },
      { label: "Stil", value: "Sade konfor" },
    ],
  },
  gallery: {
    ...economyDoubleRoomsEn.gallery,
    kicker: "Oda fotoğrafları",
    title: "Sade ve pratik bir konaklama alanı",
  },
  amenities: {
    kicker: "Olanaklar",
    title: "Konaklamanız için temel konfor",
    items: [
      { icon: "📶", label: "Ücretsiz WiFi", text: "Konaklamanız boyunca internet erişimi." },
      { icon: "❄️", label: "Klima", text: "Sakız yazında rahatlık sağlar." },
      { icon: "🧊", label: "Buzdolabı", text: "İçecekler ve atıştırmalıklar için kullanışlıdır." },
      { icon: "☕", label: "Su ısıtıcısı", text: "Odada kahve veya çay hazırlayın." },
      { icon: "💨", label: "Saç kurutma makinesi", text: "Pratik banyo olanağı." },
      { icon: "🪑", label: "Küçük çalışma masası", text: "Hafif çalışma veya gün planı için kullanışlıdır." },
    ],
  },
  individualRooms: {
    ...economyDoubleRoomsEn.individualRooms,
    kicker: "Mevcut odalar",
    title: "Size uygun ekonomi odayı seçin",
    description:
      "Ekonomi kategorisinde yaklaşık 16m² büyüklüğünde iki yenilenmiş çift kişilik oda bulunur: bahçeye doğrudan erişimi olan zemin kattaki Oda 6 ve Kambos manzaralı birinci kattaki Oda 2.",
  },
  bestFor: {
    kicker: "Kimler için ideal",
    title: "Ekonomi çift kişilik odalar kimler için uygun?",
    items: [
      "En uygun fiyatlı oda kategorisini arayan çiftler.",
      "Sakin ve pratik bir konaklama isteyen tek seyahat edenler.",
      "Günün çoğunu Sakız Adası’nı keşfederek geçirecek misafirler.",
      "Ekstra alandan çok konum ve fiyatı önemseyen gezginler.",
    ],
  },
  booking: {
    ...economyDoubleRoomsEn.booking,
    kicker: "Doğrudan rezervasyon",
    title: "En uygun ekonomi seçeneği için bize sorun",
    text: "Tarihlerinizi bize gönderin, sizin için hangi ekonomi çift kişilik odanın müsait olduğunu bildirelim.",
    phoneLabel: "Bizi arayın",
    whatsappHref:
      "https://wa.me/306944474226?text=Merhaba!%20Sakız%20Adası'ndaki%20ekonomi%20çift%20kişilik%20oda%20ile%20ilgileniyorum.",
    note: "Ekonomi odalar sınırlıdır, bu yüzden yoğun sezonda müsaitlik hızlı değişebilir.",
  },
  faq: [
    {
      question: "Ekonomi çift kişilik odada kaç kişi konaklayabilir?",
      answer: "Ekonomi çift kişilik odalar en fazla 2 kişi için tasarlanmıştır.",
    },
    {
      question: "Ekonomi odalar en uygun fiyatlı kategori mi?",
      answer:
        "Evet, genellikle Voulamandis House’taki en uygun fiyatlı seçenektir.",
    },
    {
      question: "Ekonomi odalarda klima var mı?",
      answer:
        "Evet, odalarda klima, WiFi, buzdolabı ve özel banyo gibi temel olanaklar bulunur.",
    },
  ],
};

export const economyDoubleRooms = economyDoubleRoomsEn;

/* ==========================================================================
   FAMILY CHIOS APARTMENTS — EN
   ========================================================================== */

export const familyChiosApartmentsEn: RoomDetailData = {
  id: "family-chios-apartments",
  seo: {
    canonicalPath: "/chios-rooms/family-chios-apartments/",
    title: "Family Apartments in Chios | Voulamandis House",
    description:
      "Family apartments in Chios at Voulamandis House in Kambos. Spacious 40–45m² apartments with kitchen, bedroom and living area.",
    ogImage:
      "/images/rooms/chios-apartments-voulamandis.webp",
  },
  hero: {
    kicker: "Family apartments in Chios",
    title: "Family Chios apartments",
    subtitle: "More space, kitchen and home-like comfort",
    description:
      "Spacious family apartments with separate bedroom, kitchen and living area. Ideal for families or guests who want more independence during their stay in Chios.",
    image:
      "/images/rooms/chios-apartments-voulamandis.webp",
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
        src: "/images/rooms/chios-apartments-voulamandis.webp",
        alt: "Family apartment in Chios at Voulamandis House",
      },
      {
        src: "/images/rooms/chios-hotels-family-apartments.webp",
        alt: "Family apartment living area in Chios",
      },
      {
        src: "/images/rooms/family-room.webp",
        alt: "Family room bedroom at Voulamandis House",
      },
      {
        src: "/images/rooms/voulamandis-apartment-bathroom..webp",
        alt: "Family apartment bathroom in Chios",
      },
      {
        src: "/images/rooms/DSC07899.webp",
        alt: "Apartment room at Voulamandis House",
      },
      {
        src: "/images/rooms/DSC07909.webp",
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
      { icon: "🌿", label: "Garden view", text: "A peaceful Kambos setting around the property." },
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
            src: "/images/rooms/chios-apartments-voulamandis.webp",
            alt: "Family Apartment 8 - living room and kitchen - Voulamandis House Chios",
            caption: "Living Room & Kitchen",
          },
          {
            src: "/images/rooms/chios-hotels-family-apartments.webp",
            alt: "Family Apartment 8 - kitchen area - Voulamandis House Chios",
            caption: "Kitchen",
          },
          {
            src: "/images/rooms/family-room.webp",
            alt: "Family Apartment 8 - bedroom - Voulamandis House Chios",
            caption: "Bedroom",
          },
          {
            src: "/images/rooms/voulamandis-apartment-bathroom..webp",
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
            src: "/images/rooms/chios-apartments-voulamandis.webp",
            alt: "Family Apartment 9 - living room and kitchen - Voulamandis House Chios",
            caption: "Living Room & Kitchen",
          },
          {
            src: "/images/rooms/chios-hotels-family-apartments.webp",
            alt: "Family Apartment 9 - kitchen area - Voulamandis House Chios",
            caption: "Kitchen",
          },
          {
            src: "/images/rooms/family-room.webp",
            alt: "Family Apartment 9 - bedroom - Voulamandis House Chios",
            caption: "Bedroom",
          },
          {
            src: "/images/rooms/voulamandis-apartment-bathroom..webp",
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
            src: "/images/rooms/DSC07899.webp",
            alt: "Family Apartment 10 - living room and kitchen - Voulamandis House Chios",
            caption: "Living Room & Kitchen",
          },
          {
            src: "/images/rooms/DSC07909.webp",
            alt: "Family Apartment 10 - kitchen area - Voulamandis House Chios",
            caption: "Kitchen",
          },
          {
            src: "/images/rooms/DSC07940.webp",
            alt: "Family Apartment 10 - bedroom - Voulamandis House Chios",
            caption: "Bedroom",
          },
          {
            src: "/images/rooms/DSC07943.webp",
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

/* ==========================================================================
   FAMILY CHIOS APARTMENTS — EL
   ========================================================================== */

export const familyChiosApartmentsEl: RoomDetailData = {
  ...familyChiosApartmentsEn,
  seo: {
    ...familyChiosApartmentsEn.seo,
    canonicalPath: "/el/domatia-xios/oikogeneiako-diamerisma/",
    title: "Οικογενειακά Διαμερίσματα στη Χίο | Voulamandis House",
    description:
      "Οικογενειακά διαμερίσματα στη Χίο στο Voulamandis House στον Κάμπο. Ευρύχωρα διαμερίσματα 40–45m² με κουζίνα, υπνοδωμάτιο και καθιστικό.",
  },
  hero: {
    ...familyChiosApartmentsEn.hero,
    kicker: "Οικογενειακά διαμερίσματα στη Χίο",
    title: "Οικογενειακά διαμερίσματα στη Χίο",
    subtitle: "Περισσότερος χώρος, κουζίνα και άνεση σαν στο σπίτι",
    description:
      "Ευρύχωρα οικογενειακά διαμερίσματα με ξεχωριστό υπνοδωμάτιο, κουζίνα και καθιστικό. Ιδανικά για οικογένειες ή επισκέπτες που θέλουν περισσότερη ανεξαρτησία στη διαμονή τους στη Χίο.",
    imageAlt: "Οικογενειακό διαμέρισμα στη Χίο στο Voulamandis House",
    badges: ["Έως 4 άτομα", "40–45m²", "Κουζίνα", "Καθιστικό"],
    primaryCta: { ...familyChiosApartmentsEn.hero.primaryCta, label: "Κάντε κράτηση" },
    secondaryCta: { ...familyChiosApartmentsEn.hero.secondaryCta, label: "Ρωτήστε διαθεσιμότητα" },
  },
  overview: {
    kicker: "Περιγραφή διαμερίσματος",
    title: "Ευρύχωρη επιλογή για οικογένειες και μεγαλύτερες διαμονές",
    paragraphs: [
      "Τα οικογενειακά διαμερίσματα στο Voulamandis House είναι σχεδιασμένα για επισκέπτες που θέλουν περισσότερο χώρο και την πρακτικότητα μιας κουζίνας κατά τη διαμονή τους στη Χίο.",
      "Κάθε διαμέρισμα προσφέρει πιο ανεξάρτητη εμπειρία διαμονής, με ξεχωριστό υπνοδωμάτιο, καθιστικό και πρακτικές παροχές για οικογένειες.",
      "Είναι δυνατή επιλογή για οικογένειες με παιδιά, επισκέπτες που μένουν περισσότερες νύχτες ή ταξιδιώτες που προτιμούν την ευελιξία να ετοιμάζουν απλά γεύματα.",
    ],
    highlights: [
      { label: "Άτομα", value: "Έως 4" },
      { label: "Μέγεθος", value: "40–45m²" },
      { label: "Κουζίνα", value: "Πλήρης κουζίνα" },
      { label: "Διαρρύθμιση", value: "Υπνοδωμάτιο + καθιστικό" },
    ],
  },
  gallery: {
    ...familyChiosApartmentsEn.gallery,
    kicker: "Φωτογραφίες διαμερίσματος",
    title: "Χώρος για πιο ανεξάρτητη διαμονή",
  },
  amenities: {
    kicker: "Παροχές",
    title: "Άνεση διαμερίσματος και πρακτικές εγκαταστάσεις",
    items: [
      { icon: "📶", label: "Δωρεάν WiFi", text: "Πρόσβαση στο internet για όλη την οικογένεια." },
      { icon: "❄️", label: "Κλιματισμός", text: "Άνετη θερμοκρασία κατά τους καλοκαιρινούς μήνες." },
      { icon: "🍳", label: "Πλήρης κουζίνα", text: "Ετοιμάστε απλά γεύματα κατά τη διαμονή σας." },
      { icon: "🛋️", label: "Καθιστικό", text: "Επιπλέον χώρος για χαλάρωση μέσα στο διαμέρισμα." },
      { icon: "🛏️", label: "Ξεχωριστό υπνοδωμάτιο", text: "Περισσότερη ιδιωτικότητα και άνεση για οικογένειες." },
      { icon: "🌿", label: "Θέα στον κήπο", text: "Ήρεμο περιβάλλον στον Κάμπο γύρω από το κατάλυμα." },
      { icon: "🌞", label: "Ιδιωτικό μπαλκόνι", text: "Εξωτερικός χώρος για τη διαμονή σας." },
      { icon: "🚿", label: "Ιδιωτικό μπάνιο", text: "Πρακτικές παροχές μπάνιου." },
    ],
  },
  individualRooms: {
    ...familyChiosApartmentsEn.individualRooms,
    kicker: "Διαθέσιμα διαμερίσματα",
    title: "Επιλέξτε το οικογενειακό διαμέρισμα που σας ταιριάζει",
    description:
      "Η κατηγορία οικογενειακών διαμερισμάτων περιλαμβάνει τρεις ανεξάρτητες μονάδες για έως 4 άτομα, με κουζίνα, καθιστικό και επιπλέον χώρο για οικογένειες ή μεγαλύτερες διαμονές.",
    rooms: [
      {
        ...familyChiosApartmentsEn.individualRooms.rooms[0],
        name: "Διαμέρισμα 8",
        type: "Διαμέρισμα",
        location: "Ανεξάρτητη μονάδα",
        description:
          "Το Διαμέρισμα 8 είναι οικογενειακό διαμέρισμα με καθιστικό και κουζίνα, ξεχωριστό υπνοδωμάτιο και μπάνιο. Είναι κατάλληλο για έως 4 άτομα.",
        badges: ["Ανεξάρτητη μονάδα", "Πλήρης κουζίνα", "Θέα στον κήπο", "Έως 4 άτομα"],
        beds: ["1 διπλό κρεβάτι", "2 μονά κρεβάτια"],
      },
      {
        ...familyChiosApartmentsEn.individualRooms.rooms[1],
        name: "Διαμέρισμα 9",
        type: "Διαμέρισμα",
        location: "Ανεξάρτητη μονάδα",
        description:
          "Το Διαμέρισμα 9 προσφέρει την ίδια οικογενειακή διαρρύθμιση με κουζίνα, καθιστικό, υπνοδωμάτιο και μπάνιο, κατάλληλο για έως 4 άτομα.",
        badges: ["Ανεξάρτητη μονάδα", "Πλήρης κουζίνα", "Θέα στον κήπο", "Έως 4 άτομα"],
        beds: ["1 διπλό κρεβάτι", "2 μονά κρεβάτια"],
      },
      {
        ...familyChiosApartmentsEn.individualRooms.rooms[2],
        name: "Διαμέρισμα 10",
        type: "Διαμέρισμα",
        location: "Ανεξάρτητη μονάδα",
        description:
          "Το Διαμέρισμα 10 είναι οικογενειακό διαμέρισμα με καθιστικό και κουζίνα, υπνοδωμάτιο και ευέλικτη διαρρύθμιση με καναπέδες-κρεβάτια.",
        badges: ["Ανεξάρτητη μονάδα", "Πλήρης κουζίνα", "Θέα στον κήπο", "Καναπέδες-κρεβάτια"],
        beds: ["1 διπλό κρεβάτι", "2 καναπέδες-κρεβάτια"],
      },
    ],
  },
  bestFor: {
    kicker: "Ιδανικό για",
    title: "Ποιοι πρέπει να επιλέξουν τα οικογενειακά διαμερίσματα;",
    items: [
      "Οικογένειες που χρειάζονται περισσότερο χώρο από ένα standard δωμάτιο.",
      "Επισκέπτες που θέλουν κουζίνα στις διακοπές τους.",
      "Μεγαλύτερες διαμονές όπου η άνεση και η ευελιξία έχουν σημασία.",
      "Ταξιδιώτες που προτιμούν μια πιο σπιτική επιλογή διαμονής.",
    ],
  },
  booking: {
    ...familyChiosApartmentsEn.booking,
    kicker: "Απευθείας κράτηση",
    title: "Ρωτήστε μας ποιο διαμέρισμα είναι διαθέσιμο",
    text: "Πείτε μας ημερομηνίες και αριθμό ατόμων και θα σας προτείνουμε το πιο κατάλληλο διαθέσιμο οικογενειακό διαμέρισμα.",
    phoneLabel: "Καλέστε μας",
    whatsappHref:
      "https://wa.me/306944474226?text=Γεια%20σας!%20Ενδιαφέρομαι%20για%20τα%20οικογενειακά%20διαμερίσματα%20στη%20Χίο.",
    note: "Τα οικογενειακά διαμερίσματα είναι ιδιαίτερα χρήσιμα για οικογένειες και μεγαλύτερες διαμονές, οπότε προτείνεται έγκαιρη επικοινωνία.",
  },
  faq: [
    {
      question: "Πόσα άτομα μπορούν να μείνουν σε οικογενειακό διαμέρισμα;",
      answer:
        "Τα οικογενειακά διαμερίσματα μπορούν να φιλοξενήσουν έως 4 άτομα, ανάλογα με τη διαρρύθμιση.",
    },
    {
      question: "Έχουν τα διαμερίσματα κουζίνα;",
      answer:
        "Ναι, τα οικογενειακά διαμερίσματα περιλαμβάνουν κουζίνα για πιο ανεξάρτητη διαμονή.",
    },
    {
      question: "Είναι κατάλληλα για μεγαλύτερες διαμονές;",
      answer:
        "Ναι, ο επιπλέον χώρος, η κουζίνα και το καθιστικό τα κάνουν καλή επιλογή για μεγαλύτερες διαμονές στη Χίο.",
    },
  ],
};

/* ==========================================================================
   FAMILY CHIOS APARTMENTS — FR
   ========================================================================== */

export const familyChiosApartmentsFr: RoomDetailData = {
  ...familyChiosApartmentsEn,
  seo: {
    ...familyChiosApartmentsEn.seo,
    canonicalPath: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    title: "Appartements Familiaux à Chios | Voulamandis House",
    description:
      "Appartements familiaux à Chios au Voulamandis House à Kambos. Appartements spacieux de 40–45m² avec cuisine, chambre et salon.",
  },
  hero: {
    ...familyChiosApartmentsEn.hero,
    kicker: "Appartements familiaux à Chios",
    title: "Appartements familiaux à Chios",
    subtitle: "Plus d’espace, une cuisine et un confort comme à la maison",
    description:
      "Appartements familiaux spacieux avec chambre séparée, cuisine et salon. Idéal pour les familles ou les hôtes qui souhaitent plus d’indépendance pendant leur séjour à Chios.",
    imageAlt: "Appartement familial à Chios au Voulamandis House",
    badges: ["Jusqu’à 4 personnes", "40–45m²", "Cuisine", "Salon"],
    primaryCta: { ...familyChiosApartmentsEn.hero.primaryCta, label: "Réserver en direct" },
    secondaryCta: { ...familyChiosApartmentsEn.hero.secondaryCta, label: "Demander la disponibilité" },
  },
  overview: {
    kicker: "Aperçu de l’appartement",
    title: "Une option spacieuse pour les familles et les longs séjours",
    paragraphs: [
      "Les appartements familiaux du Voulamandis House sont conçus pour les hôtes qui souhaitent plus d’espace et la commodité d’une cuisine pendant leur séjour à Chios.",
      "Chaque appartement offre une expérience plus indépendante, proche d’un petit chez-soi, avec chambre séparée, salon et équipements pratiques pour les familles.",
      "C’est un choix fort pour les familles avec enfants, les séjours de plusieurs nuits ou les voyageurs qui préfèrent préparer des repas simples.",
    ],
    highlights: [
      { label: "Personnes", value: "Jusqu’à 4" },
      { label: "Surface", value: "40–45m²" },
      { label: "Cuisine", value: "Cuisine complète" },
      { label: "Disposition", value: "Chambre + salon" },
    ],
  },
  gallery: { ...familyChiosApartmentsEn.gallery, kicker: "Photos de l’appartement", title: "De l’espace pour un séjour plus indépendant" },
  amenities: {
    kicker: "Équipements",
    title: "Confort d’appartement et équipements pratiques",
    items: [
      { icon: "📶", label: "WiFi gratuit", text: "Accès internet pour toute la famille." },
      { icon: "❄️", label: "Climatisation", text: "Température confortable pendant l’été." },
      { icon: "🍳", label: "Cuisine complète", text: "Préparez des repas simples pendant votre séjour." },
      { icon: "🛋️", label: "Salon", text: "Espace supplémentaire pour se détendre dans l’appartement." },
      { icon: "🛏️", label: "Chambre séparée", text: "Plus d’intimité et de confort pour les familles." },
      { icon: "🌿", label: "Vue jardin", text: "Un cadre paisible de Kambos autour de la propriété." },
      { icon: "🌞", label: "Balcon privé", text: "Espace extérieur pendant votre séjour." },
      { icon: "🚿", label: "Salle de bain privée", text: "Installations de salle de bain pratiques." },
    ],
  },
  individualRooms: {
    ...familyChiosApartmentsEn.individualRooms,
    kicker: "Appartements disponibles",
    title: "Choisissez votre appartement familial",
    description:
      "La catégorie des appartements familiaux comprend trois unités indépendantes pour jusqu’à 4 personnes, avec cuisine, salon et plus d’espace pour les familles ou les longs séjours.",
  },
  bestFor: {
    kicker: "Idéal pour",
    title: "À qui conviennent les appartements familiaux ?",
    items: [
      "Les familles qui ont besoin de plus d’espace qu’une chambre standard.",
      "Les hôtes qui souhaitent une cuisine pendant leurs vacances.",
      "Les longs séjours où le confort et la flexibilité comptent.",
      "Les voyageurs qui préfèrent un hébergement plus proche de la maison.",
    ],
  },
  booking: {
    ...familyChiosApartmentsEn.booking,
    kicker: "Réservation directe",
    title: "Demandez-nous quel appartement est disponible",
    text: "Indiquez vos dates et le nombre de personnes, et nous vous proposerons l’appartement familial disponible le plus adapté.",
    phoneLabel: "Appelez-nous",
    whatsappHref:
      "https://wa.me/306944474226?text=Bonjour!%20Je%20suis%20intéressé(e)%20par%20les%20appartements%20familiaux%20à%20Chios.",
    note: "Les appartements familiaux sont particulièrement utiles pour les familles et les longs séjours, un contact anticipé est donc recommandé.",
  },
  faq: [
    {
      question: "Combien de personnes peuvent séjourner dans un appartement familial ?",
      answer:
        "Les appartements familiaux peuvent accueillir jusqu’à 4 personnes, selon la disposition de l’appartement.",
    },
    {
      question: "Les appartements ont-ils une cuisine ?",
      answer:
        "Oui, les appartements familiaux incluent des équipements de cuisine pour un séjour plus indépendant.",
    },
    {
      question: "Les appartements conviennent-ils aux longs séjours ?",
      answer:
        "Oui, l’espace supplémentaire, la cuisine et le salon en font un bon choix pour les longs séjours à Chios.",
    },
  ],
};

/* ==========================================================================
   FAMILY CHIOS APARTMENTS — DE
   ========================================================================== */

export const familyChiosApartmentsDe: RoomDetailData = {
  ...familyChiosApartmentsEn,
  seo: {
    ...familyChiosApartmentsEn.seo,
    canonicalPath: "/de/zimmer-chios/familienapartments-in-chios/",
    title: "Familienapartments auf Chios | Voulamandis House",
    description:
      "Familienapartments auf Chios im Voulamandis House in Kambos. Geräumige Apartments mit 40–45m², Küche, Schlafzimmer und Wohnbereich.",
  },
  hero: {
    ...familyChiosApartmentsEn.hero,
    kicker: "Familienapartments auf Chios",
    title: "Familien-Apartments",
    subtitle: "Mehr Platz, Küche und wohnlicher Komfort",
    description:
      "Geräumige Familienapartments mit separatem Schlafzimmer, Küche und Wohnbereich. Ideal für Familien oder Gäste, die während ihres Aufenthalts auf Chios mehr Unabhängigkeit wünschen.",
    imageAlt: "Familienapartment auf Chios im Voulamandis House",
    badges: ["Bis zu 4 Gäste", "40–45m²", "Küche", "Wohnbereich"],
    primaryCta: { ...familyChiosApartmentsEn.hero.primaryCta, label: "Direkt buchen" },
    secondaryCta: { ...familyChiosApartmentsEn.hero.secondaryCta, label: "Verfügbarkeit anfragen" },
  },
  overview: {
    kicker: "Apartmentüberblick",
    title: "Eine geräumige Option für Familien und längere Aufenthalte",
    paragraphs: [
      "Die Familienapartments im Voulamandis House sind für Gäste gedacht, die während ihres Aufenthalts auf Chios mehr Platz und den Komfort einer Küche wünschen.",
      "Jedes Apartment bietet ein unabhängigeres, wohnliches Erlebnis mit separatem Schlafzimmer, Wohnbereich und praktischen Einrichtungen für Familien.",
      "Sie sind eine starke Wahl für Familien mit Kindern, längere Aufenthalte oder Reisende, die einfache Mahlzeiten selbst zubereiten möchten.",
    ],
    highlights: [
      { label: "Gäste", value: "Bis zu 4" },
      { label: "Größe", value: "40–45m²" },
      { label: "Küche", value: "Voll ausgestattete Küche" },
      { label: "Aufteilung", value: "Schlafzimmer + Wohnbereich" },
    ],
  },
  gallery: { ...familyChiosApartmentsEn.gallery, kicker: "Apartmentfotos", title: "Platz für einen unabhängigeren Aufenthalt" },
  amenities: {
    kicker: "Ausstattung",
    title: "Apartmentkomfort und praktische Einrichtungen",
    items: [
      { icon: "📶", label: "Kostenloses WiFi", text: "Internetzugang für die ganze Familie." },
      { icon: "❄️", label: "Klimaanlage", text: "Angenehme Temperatur im Sommer." },
      { icon: "🍳", label: "Voll ausgestattete Küche", text: "Bereiten Sie einfache Mahlzeiten während Ihres Aufenthalts zu." },
      { icon: "🛋️", label: "Wohnbereich", text: "Zusätzlicher Platz zum Entspannen im Apartment." },
      { icon: "🛏️", label: "Separates Schlafzimmer", text: "Mehr Privatsphäre und Komfort für Familien." },
      { icon: "🌿", label: "Gartenblick", text: "Eine ruhige Kambos-Umgebung rund um das Anwesen." },
      { icon: "🌞", label: "Privater Balkon", text: "Außenbereich für Ihren Aufenthalt." },
      { icon: "🚿", label: "Eigenes Bad", text: "Praktische Badezimmereinrichtungen." },
    ],
  },
  individualRooms: {
    ...familyChiosApartmentsEn.individualRooms,
    kicker: "Verfügbare Apartments",
    title: "Wählen Sie Ihr Familienapartment",
    description:
      "Die Familienapartment-Kategorie umfasst drei unabhängige Einheiten für bis zu 4 Gäste, mit Küche, Wohnbereich und zusätzlichem Platz für Familien oder längere Aufenthalte.",
  },
  bestFor: {
    kicker: "Ideal für",
    title: "Für wen sind die Familienapartments geeignet?",
    items: [
      "Familien, die mehr Platz als in einem Standardzimmer benötigen.",
      "Gäste, die während ihres Urlaubs eine Küche wünschen.",
      "Längere Aufenthalte, bei denen Komfort und Flexibilität wichtig sind.",
      "Reisende, die eine wohnlichere Unterkunft bevorzugen.",
    ],
  },
  booking: {
    ...familyChiosApartmentsEn.booking,
    kicker: "Direktbuchung",
    title: "Fragen Sie uns, welches Apartment verfügbar ist",
    text: "Teilen Sie uns Ihre Daten und die Gästezahl mit, und wir schlagen Ihnen das passendste verfügbare Familienapartment vor.",
    phoneLabel: "Anrufen",
    whatsappHref:
      "https://wa.me/306944474226?text=Hallo!%20Ich%20interessiere%20mich%20für%20die%20Familienapartments%20auf%20Chios.",
    note: "Familienapartments sind besonders nützlich für Familien und längere Aufenthalte, daher empfehlen wir eine frühzeitige Anfrage.",
  },
  faq: [
    {
      question: "Wie viele Gäste können in einem Familienapartment übernachten?",
      answer:
        "Die Familienapartments können je nach Aufteilung bis zu 4 Gäste aufnehmen.",
    },
    {
      question: "Haben die Apartments eine Küche?",
      answer:
        "Ja, die Familienapartments verfügen über Kücheneinrichtungen für einen unabhängigeren Aufenthalt.",
    },
    {
      question: "Sind die Apartments für längere Aufenthalte geeignet?",
      answer:
        "Ja, der zusätzliche Platz, die Küche und der Wohnbereich machen sie zu einer guten Wahl für längere Aufenthalte auf Chios.",
    },
  ],
};

/* ==========================================================================
   FAMILY CHIOS APARTMENTS — IT
   ========================================================================== */

export const familyChiosApartmentsIt: RoomDetailData = {
  ...familyChiosApartmentsEn,
  seo: {
    ...familyChiosApartmentsEn.seo,
    canonicalPath: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
    title: "Appartamenti Familiari a Chios | Voulamandis House",
    description:
      "Appartamenti familiari a Chios presso Voulamandis House a Kambos. Ampi appartamenti di 40–45m² con cucina, camera da letto e zona giorno.",
  },
  hero: {
    ...familyChiosApartmentsEn.hero,
    kicker: "Appartamenti familiari a Chios",
    title: "Appartamenti familiari a Chios",
    subtitle: "Più spazio, cucina e comfort come a casa",
    description:
      "Spaziosi appartamenti familiari con camera separata, cucina e zona giorno. Ideali per famiglie o ospiti che desiderano più indipendenza durante il soggiorno a Chios.",
    imageAlt: "Appartamento familiare a Chios presso Voulamandis House",
    badges: ["Fino a 4 ospiti", "40–45m²", "Cucina", "Zona giorno"],
    primaryCta: { ...familyChiosApartmentsEn.hero.primaryCta, label: "Prenota direttamente" },
    secondaryCta: { ...familyChiosApartmentsEn.hero.secondaryCta, label: "Chiedi disponibilità" },
  },
  overview: {
    kicker: "Panoramica appartamento",
    title: "Una soluzione spaziosa per famiglie e soggiorni più lunghi",
    paragraphs: [
      "Gli appartamenti familiari di Voulamandis House sono pensati per chi desidera più spazio e la comodità di una cucina durante il soggiorno a Chios.",
      "Ogni appartamento offre un’esperienza più indipendente e simile a casa, con camera separata, zona giorno e servizi pratici per famiglie.",
      "Sono una scelta forte per famiglie con bambini, ospiti che soggiornano più notti o viaggiatori che preferiscono preparare pasti semplici.",
    ],
    highlights: [
      { label: "Ospiti", value: "Fino a 4" },
      { label: "Dimensione", value: "40–45m²" },
      { label: "Cucina", value: "Cucina completa" },
      { label: "Layout", value: "Camera + zona giorno" },
    ],
  },
  gallery: { ...familyChiosApartmentsEn.gallery, kicker: "Foto appartamento", title: "Spazio per un soggiorno più indipendente" },
  amenities: {
    kicker: "Servizi",
    title: "Comfort da appartamento e servizi pratici",
    items: [
      { icon: "📶", label: "WiFi gratuito", text: "Accesso internet per tutta la famiglia." },
      { icon: "❄️", label: "Aria condizionata", text: "Temperatura confortevole durante l’estate." },
      { icon: "🍳", label: "Cucina completa", text: "Prepara pasti semplici durante il soggiorno." },
      { icon: "🛋️", label: "Zona giorno", text: "Spazio extra per rilassarsi nell’appartamento." },
      { icon: "🛏️", label: "Camera separata", text: "Più privacy e comfort per le famiglie." },
      { icon: "🌿", label: "Vista giardino", text: "Un ambiente tranquillo di Kambos intorno alla struttura." },
      { icon: "🌞", label: "Balcone privato", text: "Spazio esterno durante il soggiorno." },
      { icon: "🚿", label: "Bagno privato", text: "Servizi bagno pratici." },
    ],
  },
  individualRooms: {
    ...familyChiosApartmentsEn.individualRooms,
    kicker: "Appartamenti disponibili",
    title: "Scegli il tuo appartamento familiare",
    description:
      "La categoria appartamenti familiari comprende tre unità indipendenti per un massimo di 4 ospiti, con cucina, zona giorno e spazio extra per famiglie o soggiorni più lunghi.",
  },
  bestFor: {
    kicker: "Ideale per",
    title: "A chi consigliamo gli appartamenti familiari?",
    items: [
      "Famiglie che hanno bisogno di più spazio rispetto a una camera standard.",
      "Ospiti che desiderano una cucina durante le vacanze.",
      "Soggiorni più lunghi dove comfort e flessibilità contano.",
      "Viaggiatori che preferiscono una soluzione più simile a casa.",
    ],
  },
  booking: {
    ...familyChiosApartmentsEn.booking,
    kicker: "Prenotazione diretta",
    title: "Chiedici quale appartamento è disponibile",
    text: "Indicaci le date e il numero di ospiti, e ti suggeriremo l’appartamento familiare disponibile più adatto.",
    phoneLabel: "Chiamaci",
    whatsappHref:
      "https://wa.me/306944474226?text=Buongiorno!%20Sono%20interessato%20agli%20appartamenti%20familiari%20a%20Chios.",
    note: "Gli appartamenti familiari sono particolarmente utili per famiglie e soggiorni più lunghi, quindi è consigliato contattarci in anticipo.",
  },
  faq: [
    {
      question: "Quanti ospiti possono soggiornare in un appartamento familiare?",
      answer:
        "Gli appartamenti familiari possono ospitare fino a 4 persone, in base alla disposizione.",
    },
    {
      question: "Gli appartamenti hanno una cucina?",
      answer:
        "Sì, gli appartamenti familiari includono servizi cucina per un soggiorno più indipendente.",
    },
    {
      question: "Gli appartamenti sono adatti a soggiorni più lunghi?",
      answer:
        "Sì, lo spazio extra, la cucina e la zona giorno li rendono una buona scelta per soggiorni più lunghi a Chios.",
    },
  ],
};

/* ==========================================================================
   FAMILY CHIOS APARTMENTS — ES
   ========================================================================== */

export const familyChiosApartmentsEs: RoomDetailData = {
  ...familyChiosApartmentsEn,
  seo: {
    ...familyChiosApartmentsEn.seo,
    canonicalPath: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    title: "Apartamentos Familiares en Quíos | Voulamandis House",
    description:
      "Apartamentos familiares en Quíos en Voulamandis House, Kambos. Amplios apartamentos de 40–45m² con cocina, dormitorio y zona de estar.",
  },
  hero: {
    ...familyChiosApartmentsEn.hero,
    kicker: "Apartamentos familiares en Quíos",
    title: "Apartamentos familiares en Quíos",
    subtitle: "Más espacio, cocina y comodidad como en casa",
    description:
      "Apartamentos familiares espaciosos con dormitorio separado, cocina y zona de estar. Ideales para familias o huéspedes que desean más independencia durante su estancia en Quíos.",
    imageAlt: "Apartamento familiar en Quíos en Voulamandis House",
    badges: ["Hasta 4 personas", "40–45m²", "Cocina", "Zona de estar"],
    primaryCta: { ...familyChiosApartmentsEn.hero.primaryCta, label: "Reservar directo" },
    secondaryCta: { ...familyChiosApartmentsEn.hero.secondaryCta, label: "Consultar disponibilidad" },
  },
  overview: {
    kicker: "Resumen del apartamento",
    title: "Una opción espaciosa para familias y estancias más largas",
    paragraphs: [
      "Los apartamentos familiares de Voulamandis House están pensados para huéspedes que desean más espacio y la comodidad de una cocina durante su estancia en Quíos.",
      "Cada apartamento ofrece una experiencia más independiente, similar a estar en casa, con dormitorio separado, zona de estar y servicios prácticos para familias.",
      "Son una opción sólida para familias con niños, huéspedes que se quedan más noches o viajeros que prefieren preparar comidas sencillas.",
    ],
    highlights: [
      { label: "Personas", value: "Hasta 4" },
      { label: "Tamaño", value: "40–45m²" },
      { label: "Cocina", value: "Cocina completa" },
      { label: "Distribución", value: "Dormitorio + salón" },
    ],
  },
  gallery: { ...familyChiosApartmentsEn.gallery, kicker: "Fotos del apartamento", title: "Espacio para una estancia más independiente" },
  amenities: {
    kicker: "Servicios",
    title: "Comodidad de apartamento y servicios prácticos",
    items: [
      { icon: "📶", label: "WiFi gratis", text: "Acceso a internet para toda la familia." },
      { icon: "❄️", label: "Aire acondicionado", text: "Temperatura cómoda durante el verano." },
      { icon: "🍳", label: "Cocina completa", text: "Prepara comidas sencillas durante la estancia." },
      { icon: "🛋️", label: "Zona de estar", text: "Espacio extra para relajarse dentro del apartamento." },
      { icon: "🛏️", label: "Dormitorio separado", text: "Más privacidad y comodidad para familias." },
      { icon: "🌿", label: "Vista al jardín", text: "Un entorno tranquilo de Kambos alrededor de la propiedad." },
      { icon: "🌞", label: "Balcón privado", text: "Espacio exterior durante tu estancia." },
      { icon: "🚿", label: "Baño privado", text: "Instalaciones prácticas de baño." },
    ],
  },
  individualRooms: {
    ...familyChiosApartmentsEn.individualRooms,
    kicker: "Apartamentos disponibles",
    title: "Elige tu apartamento familiar",
    description:
      "La categoría de apartamentos familiares incluye tres unidades independientes para hasta 4 personas, con cocina, zona de estar y espacio extra para familias o estancias más largas.",
  },
  bestFor: {
    kicker: "Ideal para",
    title: "¿Para quién son los apartamentos familiares?",
    items: [
      "Familias que necesitan más espacio que una habitación estándar.",
      "Huéspedes que desean cocina durante sus vacaciones.",
      "Estancias más largas donde importan la comodidad y la flexibilidad.",
      "Viajeros que prefieren una opción de alojamiento más parecida a casa.",
    ],
  },
  booking: {
    ...familyChiosApartmentsEn.booking,
    kicker: "Reserva directa",
    title: "Pregúntanos qué apartamento está disponible",
    text: "Indícanos tus fechas y número de huéspedes, y te sugeriremos el apartamento familiar disponible más adecuado.",
    phoneLabel: "Llámanos",
    whatsappHref:
      "https://wa.me/306944474226?text=Hola!%20Estoy%20interesado%20en%20los%20apartamentos%20familiares%20en%20Quíos.",
    note: "Los apartamentos familiares son especialmente útiles para familias y estancias más largas, por lo que se recomienda contactar con antelación.",
  },
  faq: [
    {
      question: "¿Cuántas personas pueden alojarse en un apartamento familiar?",
      answer:
        "Los apartamentos familiares pueden alojar hasta 4 personas, según la distribución del apartamento.",
    },
    {
      question: "¿Los apartamentos tienen cocina?",
      answer:
        "Sí, los apartamentos familiares incluyen cocina para una estancia más independiente.",
    },
    {
      question: "¿Los apartamentos son adecuados para estancias más largas?",
      answer:
        "Sí, el espacio extra, la cocina y la zona de estar los convierten en una buena opción para estancias más largas en Quíos.",
    },
  ],
};

/* ==========================================================================
   FAMILY CHIOS APARTMENTS — TR
   ========================================================================== */

export const familyChiosApartmentsTr: RoomDetailData = {
  ...familyChiosApartmentsEn,
  seo: {
    ...familyChiosApartmentsEn.seo,
    canonicalPath: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    title: "Sakız Adası Aile Apartları | Voulamandis House",
    description:
      "Sakız Adası Kambos’ta Voulamandis House aile apartları. Mutfak, yatak odası ve oturma alanı bulunan geniş 40–45m² daireler.",
  },
  hero: {
    ...familyChiosApartmentsEn.hero,
    kicker: "Sakız Adası aile apartları",
    title: "Sakız Adası aile apartları",
    subtitle: "Daha fazla alan, mutfak ve ev konforu",
    description:
      "Ayrı yatak odası, mutfak ve oturma alanına sahip geniş aile apartları. Sakız Adası’nda daha bağımsız bir konaklama isteyen aileler veya misafirler için idealdir.",
    imageAlt: "Sakız Adası Voulamandis House aile apartı",
    badges: ["4 kişiye kadar", "40–45m²", "Mutfak", "Oturma alanı"],
    primaryCta: { ...familyChiosApartmentsEn.hero.primaryCta, label: "Doğrudan rezervasyon" },
    secondaryCta: { ...familyChiosApartmentsEn.hero.secondaryCta, label: "Müsaitlik sor" },
  },
  overview: {
    kicker: "Apart özeti",
    title: "Aileler ve uzun konaklamalar için geniş bir seçenek",
    paragraphs: [
      "Voulamandis House aile apartları, Sakız Adası’nda daha fazla alan ve mutfak rahatlığı isteyen misafirler için tasarlanmıştır.",
      "Her apart ayrı yatak odası, oturma alanı ve aileler için pratik olanaklarla daha bağımsız, ev benzeri bir deneyim sunar.",
      "Çocuklu aileler, daha uzun süre kalan misafirler veya basit yemekler hazırlama esnekliği isteyen gezginler için güçlü bir seçimdir.",
    ],
    highlights: [
      { label: "Kişi", value: "4 kişiye kadar" },
      { label: "Büyüklük", value: "40–45m²" },
      { label: "Mutfak", value: "Tam mutfak" },
      { label: "Plan", value: "Yatak odası + oturma alanı" },
    ],
  },
  gallery: { ...familyChiosApartmentsEn.gallery, kicker: "Apart fotoğrafları", title: "Daha bağımsız bir konaklama için alan" },
  amenities: {
    kicker: "Olanaklar",
    title: "Apart konforu ve pratik imkânlar",
    items: [
      { icon: "📶", label: "Ücretsiz WiFi", text: "Tüm aile için internet erişimi." },
      { icon: "❄️", label: "Klima", text: "Yaz aylarında konforlu sıcaklık." },
      { icon: "🍳", label: "Tam mutfak", text: "Konaklamanız sırasında basit yemekler hazırlayın." },
      { icon: "🛋️", label: "Oturma alanı", text: "Apart içinde dinlenmek için ekstra alan." },
      { icon: "🛏️", label: "Ayrı yatak odası", text: "Aileler için daha fazla mahremiyet ve konfor." },
      { icon: "🌿", label: "Bahçe manzarası", text: "Tesis çevresinde sakin Kambos atmosferi." },
      { icon: "🌞", label: "Özel balkon", text: "Konaklamanız için açık alan." },
      { icon: "🚿", label: "Özel banyo", text: "Pratik banyo olanakları." },
    ],
  },
  individualRooms: {
    ...familyChiosApartmentsEn.individualRooms,
    kicker: "Mevcut apartlar",
    title: "Size uygun aile apartını seçin",
    description:
      "Aile apartları kategorisi, 4 kişiye kadar konaklama için üç bağımsız birim içerir; mutfak, oturma alanı ve aileler ya da uzun konaklamalar için ekstra alan sunar.",
  },
  bestFor: {
    kicker: "Kimler için ideal",
    title: "Aile apartları kimler için uygun?",
    items: [
      "Standart odadan daha fazla alana ihtiyaç duyan aileler.",
      "Tatil sırasında mutfak isteyen misafirler.",
      "Konfor ve esnekliğin önemli olduğu uzun konaklamalar.",
      "Daha ev benzeri bir konaklama seçeneğini tercih eden gezginler.",
    ],
  },
  booking: {
    ...familyChiosApartmentsEn.booking,
    kicker: "Doğrudan rezervasyon",
    title: "Hangi apartın müsait olduğunu bize sorun",
    text: "Tarihlerinizi ve kişi sayınızı bize gönderin; size en uygun müsait aile apartını önerelim.",
    phoneLabel: "Bizi arayın",
    whatsappHref:
      "https://wa.me/306944474226?text=Merhaba!%20Sakız%20Adası'ndaki%20aile%20apartları%20ile%20ilgileniyorum.",
    note: "Aile apartları özellikle aileler ve uzun konaklamalar için kullanışlıdır, bu nedenle erken iletişim önerilir.",
  },
  faq: [
    {
      question: "Bir aile apartında kaç kişi konaklayabilir?",
      answer:
        "Aile apartları, apartın düzenine bağlı olarak 4 kişiye kadar konaklama sağlayabilir.",
    },
    {
      question: "Apartlarda mutfak var mı?",
      answer:
        "Evet, aile apartlarında daha bağımsız bir konaklama için mutfak olanakları bulunur.",
    },
    {
      question: "Apartlar uzun konaklamalar için uygun mu?",
      answer:
        "Evet, ekstra alan, mutfak ve oturma alanı onları Sakız Adası’nda uzun konaklamalar için iyi bir seçenek yapar.",
    },
  ],
};

export const familyChiosApartments = familyChiosApartmentsEn;

export const roomDetailsBySlug = {
  "standard-double-room": standardDoubleRoomEn,
  "economy-double-rooms": economyDoubleRoomsEn,
  "family-chios-apartments": familyChiosApartmentsEn,
} satisfies Record<string, RoomDetailData>;