export type ChiosIslandPageData = {
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  hero: {
    kicker: string;
    title: string;
    description: string;
    image: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  intro: {
    title: string;
    paragraphs: string[];
    highlights: {
      label: string;
      value: string;
    }[];
  };
  experiences: {
    kicker: string;
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
      href: string;
      ctaLabel: string;
      tags: string[];
    }[];
  };
  quiz: {
    title: string;
    text: string;
    ctaLabel: string;
    href: string;
  };
  stay: {
    kicker: string;
    title: string;
    text: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  sticky: {
    whatsappHref: string;
    bookingHref: string;
  };
};

export const chiosIslandPageEn: ChiosIslandPageData = {
  seo: {
    canonicalPath: "/chios-island/",
    title: "Chios Island Guide | Beaches, Villages & Mastic Culture",
    description:
      "Explore Chios Island through its beaches, medieval villages, mastic culture and authentic local experiences. Plan your stay from Voulamandis House in Kampos.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
  },
  hero: {
    kicker: "Discover Chios",
    title: "Explore Chios Island",
    description:
      "Discover medieval villages, crystal-clear beaches and the unique mastic culture that makes Chios unlike any other Greek island.",
    image:
      "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
    primaryCta: {
      label: "Explore Chios",
      href: "#discover",
    },
    secondaryCta: {
      label: "Check rates",
      href: "/chios-hotels-rates/",
    },
  },
  intro: {
    title: "A Greek island with real character",
    paragraphs: [
      "Chios Island is a distinctive destination in the northeastern Aegean Sea, known for its fortified villages, scenic coastline and the world-famous mastic resin that is cultivated only here.",
      "It offers an authentic Greek island experience, rich in history, local tradition, natural beauty and quieter travel away from the crowds.",
      "From the citrus estates of Kampos to the southern mastic villages and the dramatic coastlines of the island, Chios reveals a different side of Greece.",
    ],
    highlights: [
      {
        label: "Known for",
        value: "Mastic culture",
      },
      {
        label: "Best for",
        value: "Authentic travel",
      },
      {
        label: "Base area",
        value: "Kampos",
      },
      {
        label: "Experience",
        value: "Beaches & villages",
      },
    ],
  },
  experiences: {
    kicker: "Top experiences",
    title: "What to discover in Chios",
    description:
      "Start with the essentials and explore the island through its beaches, villages and unique mastic heritage.",
    items: [
      {
        title: "Pristine Beaches",
        description:
          "Explore the coast of Chios through organized beaches, hidden coves and memorable landscapes, from volcanic pebbles to crystal turquoise waters.",
        image: "https://chioshotel.gr/wp-content/uploads/2026/03/sakiz-agia-dynami.jpg",
        imageAlt: "Agia Dynami beach in Chios with turquoise water",
        href: "/chios/chios-beaches/",
        ctaLabel: "View beaches",
        tags: ["Crystal waters", "Hidden coves", "Summer days"],
      },
      {
        title: "Medieval Villages",
        description:
          "Explore Mesta, Pyrgi and other fortress villages of southern Chios, where stone alleys and traditional architecture preserve the island’s rich past.",
        image: "https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp",
        imageAlt: "Traditional village and coastal scenery in Chios",
        href: "/chios/chios-villages/",
        ctaLabel: "Explore villages",
        tags: ["Mesta", "Pyrgi", "Stone alleys"],
      },
      {
        title: "Mastic Culture",
        description:
          "Learn the story of Chios mastic, a unique product cultivated only on this island and one of the strongest symbols of its cultural identity.",
        image: "https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp",
        imageAlt: "Chios Mastic Museum and mastic culture experience",
        href: "/chios/chios-museums/the-mastic-museum-chios/",
        ctaLabel: "View museum",
        tags: ["Mastic", "Culture", "Local heritage"],
      },
    ],
  },
  quiz: {
    title: "Want to discover Chios in a fun way?",
    text:
      "Take the quiz created by Voulamandis House especially for its guests. Discover which side of Chios matches your style and get to know the island in a more personal way.",
    ctaLabel: "Start quiz",
    href: "/chios-holidays-quiz/",
  },
  stay: {
    kicker: "Stay in Kampos",
    title: "Use Voulamandis House as your Chios base",
    text:
      "Experience authentic hospitality in the historic Kampos area and stay close to Chios Town, the airport and the routes that lead to beaches, villages and cultural landmarks.",
    primaryCta: {
      label: "Book your stay",
      href: "/chios-hotels-rates/",
    },
    secondaryCta: {
      label: "View rooms",
      href: "/chios-rooms/",
    },
  },
  sticky: {
    whatsappHref: "https://wa.me/306944474226",
    bookingHref: "/chios-hotels-rates/",
  },
};