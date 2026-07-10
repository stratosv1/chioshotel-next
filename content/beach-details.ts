export type BeachDetailData = {
  slug: string;
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
    tags: string[];
  };
  details: {
    icon: string;
    title: string;
    text: string;
  }[];
  media: {
    video: {
      title: string;
      embedUrl: string;
      creditText: string;
      creditLabel: string;
      creditHref: string;
    };
    map: {
      title: string;
      embedUrl: string;
      distance: string;
      time: string;
      gpsHref: string;
    };
  };
  baseTip: {
    icon: string;
    title: string;
    text: string;
    linkLabel: string;
    href: string;
  };
  relatedTitle: string;
  relatedText: string;
};

export const beachDetails: BeachDetailData[] = [
  {
    slug: "agia-dynami-beach-chios",
    seo: {
      canonicalPath: "/chios/chios-beaches/agia-dynami-beach-chios/",
      title: "Agia Dynami Beach Chios | Emerald Waters & Hidden Cove",
      description:
        "Discover Agia Dynami Beach in southern Chios, a small dreamy beach near Olympoi with emerald waters, fine sand, small pebbles and natural shade.",
      ogImage:
        "/images/beaches/agia-dynami-beach-chios.webp",
    },
    hero: {
      kicker: "Southern Chios • Near Olympoi",
      title: "Agia Dynami Beach: The Emerald Paradise",
      description:
        "A small, dreamy beach in southern Chios with incredible clarity and waters of a unique emerald color. The picturesque chapel completes the ultimate Greek landscape.",
      image:
        "/images/beaches/agia-dynami-beach-chios.webp",
      tags: ["#agia_dynami", "#emerald_waters", "#olympoi", "#hidden_treasure"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located in southern Chios, near the medieval village of Olympoi, also known as the bay of Agia Theodosia. It pairs perfectly with a visit to the Mastichochoria.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "The beach features turquoise waters, fine sand with small pebbles and natural shade from a few trees. It is not organized, offering a more authentic natural experience.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "Recently, it has become very popular. Because the bay is small, start early in the morning to find a good spot and secure the precious natural shade.",
      },
    ],
    media: {
      video: {
        title: "The magic of Agia Dynami",
        embedUrl: "https://www.youtube.com/embed/__8C0AGL0HA",
        creditText: "Special thanks to the channel for the wonderful video.",
        creditLabel: "@dehaakil4432",
        creditHref: "https://www.youtube.com/@dehaakil4432",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Agia+Dynami+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~35-40 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Dynami+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Starting from Voulamandis House in Kambos, you have the strategic advantage to start early in the morning for Agia Dynami and enjoy the whole day in its crystal-clear waters.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "lithi-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/lithi-beach/",
      title: "Lithi Beach Chios | Family Sandy Beach & Fresh Fish",
      description:
        "Discover Lithi Beach in western Chios, a natural harbor with shallow waters, golden sand and authentic fish taverns by the sea.",
      ogImage:
        "/images/beaches/lithi-beach-chios.webp",
    },
    hero: {
      kicker: "Western Chios • Family friendly",
      title: "Lithi Beach: Family Sandy Beach & Fresh Fish",
      description:
        "A beautiful natural harbor in western Chios. Enjoy shallow waters, golden sand and authentic fish taverns right on the waves.",
      image:
        "/images/beaches/lithi-beach-chios.webp",
      tags: ["#western_chios", "#sandy_beach", "#family_friendly", "#taverns"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located in the center of the western side, about 25 km from Chios Town and 7 km from Vessa. Combine the route with Anavatos and Avgonyma.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "A picturesque natural harbor with a shallow sandy beach, fully organized. An ideal choice for families with children and for those who love good food.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "Visit on weekdays if you are looking for more tranquility. On weekends, it is a favorite destination for locals and full of life.",
      },
    ],
    media: {
      video: {
        title: "Get a taste of Lithi",
        embedUrl: "https://www.youtube.com/embed/iM7lSt9OdG8",
        creditText: "Special thanks for the wonderful footage.",
        creditLabel: "chiosphotos.gr",
        creditHref: "https://chiosphotos.gr",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lithi+Beach,+Chios&output=embed",
        distance: "~22 km",
        time: "~35-40 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lithi+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Lithi Beach is about 40 minutes away from the historic Kambos area. Make Voulamandis House your base to explore western beaches and medieval villages.",
      linkLabel: "Stay with the locals who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "lefkathia-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/lefkathia-beach/",
      title: "Lefkathia Beach Chios | Crystal Waters in Volissos",
      description:
        "Discover Lefkathia Beach in northwestern Chios, a beautiful enclosed bay near Volissos and Limnia with crystal waters, tamarisk trees and sunset views.",
      ogImage: "/images/beaches/lefkathia-2.jpg",
    },
    hero: {
      kicker: "Northwestern Chios • Volissos",
      title: "Lefkathia Beach: Crystal Waters in Volissos",
      description:
        "A beautiful enclosed bay in northwestern Chios. Its semi-circular shape, crystal-clear waters and stunning sunsets will enchant you.",
      image: "/images/beaches/lefkathia-2.jpg",
      tags: ["#northwest_chios", "#volissos", "#youth_vibe", "#sunset_spot"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located in the northwestern part of the island, next to the picturesque harbor of Limnia and very close to historic Volissos. Access is easy by car.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "A fully organized beach with umbrellas, sunbeds and a vibrant youthful pulse. Large tamarisk trees along the shore offer natural shade.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "It is worth staying late. The bay’s western orientation offers one of the most romantic sunsets you can experience in Chios.",
      },
    ],
    media: {
      video: {
        title: "The Magic of Lefkathia",
        embedUrl: "https://www.youtube.com/embed/EV3nSOTvngQ",
        creditText: "Special thanks for the wonderful footage.",
        creditLabel: "@TYSON409",
        creditHref: "https://www.youtube.com/@TYSON409",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lefkathia+Beach,+Chios&output=embed",
        distance: "~40 km",
        time: "~55-60 mins",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lefkathia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Organize an unforgettable day trip to northern Chios, including Volissos, Agia Markella and Lefkathia, starting from Kambos.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "nagos-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/nagos-beach/",
      title: "Nagos Beach Chios | Green Landscape of Northern Chios",
      description:
        "Discover Nagos Beach in northern Chios near Kardamyla, where springs, plane trees, colorful pebbles and crystal-clear waters create a refreshing landscape.",
      ogImage:
        "/images/beaches/nagos-beach-chios.webp",
    },
    hero: {
      kicker: "Northern Chios • Kardamyla",
      title: "Nagos Beach: The Green Landscape of Northern Chios",
      description:
        "A unique setting where running spring waters and century-old plane trees meet the crystal-clear waters and colorful pebbles of the Aegean.",
      image:
        "/images/beaches/nagos-beach-chios.webp",
      tags: ["#northern_chios", "#kardamyla", "#springs", "#plane_trees"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located in northern Chios, just 5 km from the historic naval village of Kardamyla. The route offers excellent views of the Aegean Sea.",
      },
      {
        icon: "🌿",
        title: "Characteristics",
        text:
          "Rich vegetation, spring waters, plane trees and small streams offer generous coolness even on the hottest summer days.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "Visit during the week if you want absolute peace and tranquility. On weekends it becomes full of life with locals.",
      },
    ],
    media: {
      video: {
        title: "The beauty of Nagos from above",
        embedUrl: "https://www.youtube.com/embed/33224Rv5TPU",
        creditText: "Special thanks to the channel for the wonderful video.",
        creditLabel: "@nmilonass",
        creditHref: "https://www.youtube.com/@nmilonass",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Nagos+Beach,+Chios&output=embed",
        distance: "~33 km",
        time: "~50-55 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Nagos+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Starting from the lush Kambos area, you can plan your day trip to northern Chios. Make Voulamandis House your base and let us recommend the best routes.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "avlonia-beach2",
    seo: {
      canonicalPath: "/chios/chios-beaches/avlonia-beach2/",
      title: "Avlonia Beach Chios | Hidden Gem of Southern Chios",
      description:
        "Discover Avlonia Beach in southern Chios, an isolated bay near Pyrgi with turquoise waters, wild beauty, small pebbles and a seabed ideal for snorkeling.",
      ogImage:
        "/images/beaches/avlonia-1024x768.webp",
    },
    hero: {
      kicker: "Southern Chios • Pyrgousiki Avlonia",
      title: "Avlonia Beach: The Hidden Gem of the South",
      description:
        "A magical, isolated bay in southern Chios with wild beauty, turquoise crystal-clear waters and an impressive seabed waiting to be explored.",
      image:
        "/images/beaches/avlonia-1024x768.webp",
      tags: ["#southern_chios", "#pyrgousiki_avlonia", "#hidden_beach", "#seabed_exploration"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located on the southern side of Chios, about 9 km from the medieval village of Pyrgi. A 700-meter path leads to the bay, adding a sense of adventure.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "Known locally as Pyrgousiki Avlonia, it features small pebbles and coarse sand. The crystal-clear waters and seabed make it ideal for snorkeling.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "The beach is not organized. Bring an umbrella, plenty of water and snacks. It is worth staying late to enjoy the magical sunset.",
      },
    ],
    media: {
      video: {
        title: "The wild beauty of Avlonia",
        embedUrl: "https://www.youtube.com/embed/fRkgQeg8j0I",
        creditText: "Special thanks to the channel for the wonderful video.",
        creditLabel: "@GeorgeNito",
        creditHref: "https://www.youtube.com/@GeorgeNito",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Avlonia+Beach,+Chios&output=embed",
        distance: "~32 km",
        time: "~45-50 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Avlonia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Avlonia is perfectly combined with a trip to the Mastichochoria. Starting from Voulamandis House in Kambos, you are ideally placed for medieval villages and hidden southern beaches.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "salagona-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/salagona-beach/",
      title: "Salagona Beach Chios | Hidden Turquoise Treasure",
      description:
        "Discover Salagona Beach in southwestern Chios, a quiet bay near the medieval villages with turquoise waters, fine pebbles and excellent snorkeling.",
      ogImage:
        "/images/beaches/salagona-beach-chios.webp",
    },
    hero: {
      kicker: "Southwestern Chios • Quiet beach",
      title: "Salagona Beach: The Hidden Turquoise Treasure",
      description:
        "Avoid the crowds in this magical southwestern bay with crystal-clear turquoise waters and fine pebbles, ideal for relaxation and seabed exploration.",
      image:
        "/images/beaches/salagona-beach-chios.webp",
      tags: ["#southwestern_chios", "#quiet_beach", "#fine_pebbles", "#seabed_exploration"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located in southwestern Chios, close to the medieval villages. Combine your swim with Mesta, Olympoi or the impressive Cave of Olympoi.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "A quiet, relatively isolated beach with coarse sand and fine pebbles. The waters are spotless, with beautiful shades of blue and green.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "Perfect for snorkeling. Bring an umbrella, water and snacks, as it is often not organized.",
      },
    ],
    media: {
      video: {
        title: "Get a taste of Salagona",
        embedUrl: "https://www.youtube.com/embed/QqdqKW1X_oo",
        creditText: "Special thanks for the wonderful footage.",
        creditLabel: "@loukasvasalos",
        creditHref: "https://www.youtube.com/@loukasvasalos",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Salagona+Beach,+Chios&t=m&z=11&output=embed",
        distance: "~32 km",
        time: "~40-45 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Salagona+Beach,+Chios",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Salagona is easily accessible by car. Make Voulamandis House in historic Kambos your base to explore both the southern and western beaches of Chios with local guidance.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "agia-fotia-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/agia-fotia-beach/",
      title: "Agia Fotia Beach Chios | Cosmopolitan Organized Beach",
      description:
        "Discover Agia Fotia Beach in Chios, a lively organized pebble beach near Kambos with crystal-clear waters, taverns, cafes and views toward Asia Minor.",
      ogImage: "/images/beaches/agia-fotia-beach-chios.webp",
    },
    hero: {
      kicker: "East Chios • Cosmopolitan beach",
      title: "Agia Fotia Beach: The Cosmopolitan Choice of Chios",
      description:
        "One of the most beautiful and lively beaches of Chios, with crystal-clear waters, a pebbled seabed and a magical view toward the Asia Minor coast.",
      image: "/images/beaches/agia-fotia-beach-chios.webp",
      tags: ["#agia_fotia", "#youth", "#cosmopolitan_beach", "#organized"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located just 11 km from Chios Town. The seaside settlement, named after the homonymous church, offers a wonderful view toward the coast of Asia Minor.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "A cosmopolitan and fully organized pebble beach with spotless cool waters. Cafes, taverns, restaurants and a mini-market are found right by the sea.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "A favorite hangout for the island’s youth. Ideal if you want liveliness, good food and fun by the sea from morning until late at night.",
      },
    ],
    media: {
      video: {
        title: "The liveliness of Agia Fotia",
        embedUrl: "https://www.youtube.com/embed/9KK20t1-p48",
        creditText: "Special thanks to the channel for the wonderful video.",
        creditLabel: "@FotisDeligiannis",
        creditHref: "https://www.youtube.com/@FotisDeligiannis",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?f=d&source=s_d&saddr=Voulamandis+House,+Chios&daddr=Agia+Fotia+Beach,+Chios&hl=en&output=embed",
        distance: "~10 km",
        time: "~15-20 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Fotia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Agia Fotia is just 15-20 minutes away from Kambos. Make Voulamandis House your base, enjoy the tranquility of the orchards and easily visit the island’s cosmopolitan beaches.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "komi-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/komi-beach/",
      title: "Komi Beach Chios | Endless Golden Sand & Organized Beach Life",
      description:
        "Discover Komi Beach in southeastern Chios, one of the island’s most popular organized sandy beaches with shallow waters, restaurants, cafe-bars and beach activities.",
      ogImage:
        "/images/beaches/komi-sandy-beach-chios.webp",
    },
    hero: {
      kicker: "Southeast Chios • Golden sand",
      title: "Komi Beach: The Endless Golden Sand",
      description:
        "One of the most popular and fully organized beaches in Chios, with endless sand, shallow crystal waters and excellent options for dining and entertainment by the waves.",
      image:
        "/images/beaches/komi-sandy-beach-chios.webp",
      tags: ["#southeast_chios", "#golden_sand", "#organized_beach", "#family_friendly"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located in southeastern Chios, just 6 km from the traditional mastic village of Kalamoti. The drive is comfortable and easy.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "A vast sandy shore ranked among the most beautiful in Greece. Fully organized with umbrellas, sunbeds, pedal boats and water games.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "Walk along the main paved pedestrian street to find restaurants for fresh fish and local appetizers, plus stylish cafe-bars.",
      },
    ],
    media: {
      video: {
        title: "A walk on Komi beach",
        embedUrl: "https://www.youtube.com/embed/lxiDYYNJLto",
        creditText: "Special thanks for the wonderful footage.",
        creditLabel: "@Travellingchannel16",
        creditHref: "https://www.youtube.com/@Travellingchannel16",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Komi,+Chios&output=embed",
        distance: "~24 km",
        time: "~30 mins",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Dimarchou+Kalvokoresi+117,+Chios/Komi,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Outpost",
      text:
        "Cosmopolitan Komi is at an ideal distance from Kambos, just a 30-minute drive. Make Voulamandis House your base and enjoy easy access to the best sandy beaches of southern Chios.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "emporios-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/emporios-beach/",
      title: "Emporios Mavra Volia Beach Chios | Ultimate Volcanic Landscape",
      description:
        "Explore Emporios Mavra Volia Beach in southern Chios, the island’s iconic volcanic beach with black pebbles, three bays, deep cool waters and wild cliffs.",
      ogImage:
        "/images/beaches/mavra-volia-beach-chios.webp",
    },
    hero: {
      kicker: "Emporios • Volcanic beach",
      title: "Emporios Mavra Volia Beach: The Ultimate Volcanic Landscape",
      description:
        "The most iconic and impressive beach of Chios: three consecutive bays with deep dark waters and breathtaking black volcanic pebbles.",
      image:
        "/images/beaches/mavra-volia-beach-chios.webp",
      tags: ["#mavra_volia", "#emporios", "#volcanic_beach", "#mavros_gialos"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Located in southern Chios, past the medieval village of Pyrgi, in the seaside settlement of Emporios. On your way there, the Mastic Museum is definitely worth a stop.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "Its unusual beauty comes from the eruption of an ancient volcano, Psaronas. Wild cliffs embrace the black pebbles, creating deep, dark and cool waters.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "A visit to Mavra Volia is not complete without food. In the picturesque harbor of Emporios nearby, you will find fish taverns with fresh seafood and local specialties.",
      },
    ],
    media: {
      video: {
        title: "The magic of Mavros Gialos from above",
        embedUrl: "https://www.youtube.com/embed/uIeLfDCVcGs",
        creditText: "Special thanks to the channel for the wonderful video.",
        creditLabel: "@flying-vp",
        creditHref: "https://www.youtube.com/@flying-vp",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Mavra+Volia,+Chios&t=m&z=11&output=embed",
        distance: "~25 km",
        time: "~35 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Mavra+Volia,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Kambos is the ideal starting point to discover the southern beaches and the Mastichochoria. Make Voulamandis House your base and enjoy comfort, hospitality and daily local tips.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
  {
    slug: "vroulidia-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/vroulidia-beach/",
      title: "Vroulidia Beach Chios | Turquoise South Chios Cove",
      description:
        "Discover Vroulidia Beach in southern Chios, a small turquoise cove near Emporios and the Mastichochoria, ideal for quiet swimming and sea views.",
      ogImage: "/images/beaches/vroulidia-2-1.jpg",
    },
    hero: {
      kicker: "Southern Chios • Near Emporios",
      title: "Vroulidia Beach: A Turquoise Cove in South Chios",
      description:
        "A small southern beach with clear turquoise water, dramatic sea views and a quiet feeling of escape, perfect for a relaxed beach-hopping day in Chios.",
      image: "/images/beaches/vroulidia-2-1.jpg",
      tags: ["#vroulidia", "#south_chios", "#turquoise_waters", "#quiet_beach"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Vroulidia is located in southern Chios, close to Emporios and the Mastichochoria. It is a rewarding stop when exploring Mavra Volia, Pyrgi, Olympoi and the south of the island.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "The beach is known for its turquoise waters, open sea views and peaceful atmosphere. It is best for travellers who enjoy smaller, more natural beaches rather than busy organized spots.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "Combine Vroulidia with Mavra Volia and Komi for a full South Chios beach day. Start early, bring water and keep time for a relaxed meal by the sea afterwards.",
      },
    ],
    media: {
      video: {
        title: "Vroulidia Beach in South Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Vroulidia%20Beach%20Chios",
        creditText: "Video search results may vary depending on availability.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Vroulidia+Beach+Chios",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Vroulidia+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~40 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Vroulidia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "From Voulamandis House in Kambos, you can plan an easy South Chios route that combines Vroulidia with Mavra Volia, Komi and the Mastichochoria.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the beaches, villages and hidden corners of South Chios.",
  },
  {
    slug: "kato-fana-beach",
    seo: {
      canonicalPath: "/chios/chios-beaches/kato-fana-beach/",
      title: "Kato Fana Beach Chios | Quiet Southern Beach Escape",
      description:
        "Discover Kato Fana Beach in southern Chios, a peaceful beach near the ancient Fana area, with open sea views and a calm off-the-beaten-path feeling.",
      ogImage: "/images/beaches/kato-fana-beach-chios.webp",
    },
    hero: {
      kicker: "Southern Chios • Fana area",
      title: "Kato Fana Beach: A Quiet Southern Chios Escape",
      description:
        "A peaceful beach idea for travellers who love open horizons, quiet corners and a more local side of South Chios.",
      image: "/images/beaches/kato-fana-beach-chios.webp",
      tags: ["#kato_fana", "#south_chios", "#quiet_escape", "#open_sea"],
    },
    details: [
      {
        icon: "📍",
        title: "Location & Access",
        text:
          "Kato Fana is in southern Chios, near the historic Fana area and within reach of Pyrgi, Olympoi and the Mastichochoria. It works well as part of a slow South Chios route.",
      },
      {
        icon: "🌊",
        title: "Characteristics",
        text:
          "This beach has a calm, open feeling and is better suited to travellers looking for space, quiet and simple natural scenery rather than a busy organized beach.",
      },
      {
        icon: "💡",
        title: "Insider Tip",
        text:
          "Visit Kato Fana when you want a quieter stop between villages and beaches. Bring essentials with you, especially water, shade and anything you need for a relaxed swim.",
      },
    ],
    media: {
      video: {
        title: "Kato Fana Beach in South Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Kato%20Fana%20Beach%20Chios",
        creditText: "Video search results may vary depending on availability.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Kato+Fana+Beach+Chios",
      },
      map: {
        title: "Route from Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Kato+Fana,+Chios&output=embed",
        distance: "~27 km",
        time: "~35-40 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Kato+Fana,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Your Strategic Base",
      text:
        "Voulamandis House in Kambos is a calm base for exploring South Chios beaches like Kato Fana, Vroulidia, Komi and Mavra Volia without changing accommodation.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Use Voulamandis House as your base and discover the beaches and villages of southern Chios at your own pace.",
  },];

export const localizedBeachDetails: BeachDetailData[] = [
  {
    slug: "paralia-agia-dynami",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-agia-dynami/",
      title: "Παραλία Αγία Δύναμη Χίος | Σμαραγδένια νερά & κρυφός όρμος",
      description:
        "Ανακαλύψτε την παραλία Αγία Δύναμη στη νότια Χίο, έναν μικρό ονειρικό όρμο κοντά στους Ολύμπους με σμαραγδένια νερά, ψιλή άμμο, βότσαλο και φυσική σκιά.",
      ogImage:
        "/images/beaches/agia-dynami-beach-chios.webp",
    },
    hero: {
      kicker: "Νότια Χίος • Κοντά στους Ολύμπους",
      title: "Παραλία Αγία Δύναμη: ο σμαραγδένιος παράδεισος",
      description:
        "Μια μικρή, ονειρική παραλία στη νότια Χίο με απίστευτη διαύγεια και νερά σε μοναδικό σμαραγδένιο χρώμα. Το γραφικό εκκλησάκι συμπληρώνει ένα αυθεντικό ελληνικό τοπίο.",
      image:
        "/images/beaches/agia-dynami-beach-chios.webp",
      tags: ["#αγία_δύναμη", "#σμαραγδένια_νερά", "#ολύμποι", "#κρυμμένος_θησαυρός"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται στη νότια Χίο, κοντά στο μεσαιωνικό χωριό Ολύμποι, στον κόλπο της Αγίας Θεοδοσίας. Συνδυάζεται ιδανικά με μια επίσκεψη στα Μαστιχοχώρια.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Η παραλία έχει γαλαζοπράσινα νερά, ψιλή άμμο με μικρό βότσαλο και φυσική σκιά από λίγα δέντρα. Δεν είναι οργανωμένη, προσφέροντας μια πιο αυθεντική φυσική εμπειρία.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Τα τελευταία χρόνια έχει γίνει αρκετά δημοφιλής. Επειδή ο κόλπος είναι μικρός, ξεκινήστε νωρίς το πρωί για να βρείτε καλό σημείο και φυσική σκιά.",
      },
    ],
    media: {
      video: {
        title: "Η μαγεία της Αγίας Δύναμης",
        embedUrl: "https://www.youtube.com/embed/__8C0AGL0HA",
        creditText: "Ευχαριστούμε το κανάλι για το υπέροχο βίντεο.",
        creditLabel: "@dehaakil4432",
        creditHref: "https://www.youtube.com/@dehaakil4432",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Agia+Dynami+Beach,+Chios&output=embed",
        distance: "~30 χλμ.",
        time: "~35-40 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Dynami+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Ξεκινώντας από το Voulamandis House στον Κάμπο, έχετε το πλεονέκτημα να φύγετε νωρίς για την Αγία Δύναμη και να απολαύσετε όλη τη μέρα στα κρυστάλλινα νερά της.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τους κρυμμένους θησαυρούς της Χίου.",
  },
  {
    slug: "plage-agia-dynami",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-agia-dynami/",
      title: "Plage Agia Dynami à Chios | Eaux émeraude & crique cachée",
      description:
        "Découvrez la plage d’Agia Dynami au sud de Chios, une petite crique de rêve près d’Olympoi avec des eaux émeraude, du sable fin, de petits galets et de l’ombre naturelle.",
      ogImage:
        "/images/beaches/agia-dynami-beach-chios.webp",
    },
    hero: {
      kicker: "Sud de Chios • Près d’Olympoi",
      title: "Plage Agia Dynami : le paradis émeraude",
      description:
        "Une petite plage de rêve au sud de Chios, avec une clarté exceptionnelle et des eaux d’une couleur émeraude unique. La petite chapelle pittoresque complète ce paysage grec authentique.",
      image:
        "/images/beaches/agia-dynami-beach-chios.webp",
      tags: ["#agia_dynami", "#eaux_emeraude", "#olympoi", "#tresor_cache"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située au sud de Chios, près du village médiéval d’Olympoi, dans la baie d’Agia Theodosia. Elle se combine parfaitement avec une visite des villages du mastic.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "La plage offre des eaux turquoise, du sable fin avec de petits galets et de l’ombre naturelle grâce à quelques arbres. Elle n’est pas organisée, ce qui préserve une atmosphère naturelle et authentique.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Elle est devenue très populaire récemment. Comme la baie est petite, partez tôt le matin pour trouver une bonne place et profiter de l’ombre naturelle.",
      },
    ],
    media: {
      video: {
        title: "La magie d’Agia Dynami",
        embedUrl: "https://www.youtube.com/embed/__8C0AGL0HA",
        creditText: "Merci à la chaîne pour cette superbe vidéo.",
        creditLabel: "@dehaakil4432",
        creditHref: "https://www.youtube.com/@dehaakil4432",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Agia+Dynami+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~35-40 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Dynami+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text:
        "Depuis Voulamandis House à Kambos, vous pouvez partir tôt vers Agia Dynami et profiter pleinement de la journée dans ses eaux cristallines.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les trésors cachés de l’île.",
  },
  {
    slug: "agia-dynami-strand",
    seo: {
      canonicalPath: "/de/straende-chios/agia-dynami-strand/",
      title: "Agia Dynami Strand Chios | Smaragdgrünes Wasser & versteckte Bucht",
      description:
        "Entdecken Sie den Agia Dynami Strand im Süden von Chios, eine kleine traumhafte Bucht nahe Olympoi mit smaragdgrünem Wasser, feinem Sand, kleinen Kieseln und natürlichem Schatten.",
      ogImage:
        "/images/beaches/agia-dynami-beach-chios.webp",
    },
    hero: {
      kicker: "Süd-Chios • Nahe Olympoi",
      title: "Agia Dynami Strand: das smaragdgrüne Paradies",
      description:
        "Ein kleiner Traumstrand im Süden von Chios mit außergewöhnlich klarem Wasser in einzigartigem Smaragdton. Die malerische Kapelle ergänzt die authentische griechische Landschaft.",
      image:
        "/images/beaches/agia-dynami-beach-chios.webp",
      tags: ["#agia_dynami", "#smaragdgruenes_wasser", "#olympoi", "#versteckter_schatz"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Der Strand liegt im Süden von Chios, nahe dem mittelalterlichen Dorf Olympoi, in der Bucht von Agia Theodosia. Er lässt sich ideal mit einem Besuch der Mastixdörfer verbinden.",
      },
      {
        icon: "🌊",
        title: "Merkmale",
        text:
          "Der Strand bietet türkisfarbenes Wasser, feinen Sand mit kleinen Kieseln und natürlichen Schatten durch einige Bäume. Er ist nicht organisiert und bewahrt so ein authentisches Naturgefühl.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "In den letzten Jahren ist der Strand sehr beliebt geworden. Da die Bucht klein ist, lohnt es sich, früh am Morgen zu starten, um einen guten Platz und natürlichen Schatten zu finden.",
      },
    ],
    media: {
      video: {
        title: "Die Magie von Agia Dynami",
        embedUrl: "https://www.youtube.com/embed/__8C0AGL0HA",
        creditText: "Vielen Dank an den Kanal für das wunderschöne Video.",
        creditLabel: "@dehaakil4432",
        creditHref: "https://www.youtube.com/@dehaakil4432",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Agia+Dynami+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~35-40 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Dynami+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Von Voulamandis House in Kambos aus können Sie früh nach Agia Dynami starten und den ganzen Tag das kristallklare Wasser genießen.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die versteckten Schätze der Insel.",
  },
  {
    slug: "spiaggia-agia-dynami",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-agia-dynami/",
      title: "Spiaggia Agia Dynami Chios | Acque smeraldo & baia nascosta",
      description:
        "Scopri la spiaggia di Agia Dynami nel sud di Chios, una piccola baia da sogno vicino a Olympoi con acque color smeraldo, sabbia fine, piccoli ciottoli e ombra naturale.",
      ogImage:
        "/images/beaches/agia-dynami-beach-chios.webp",
    },
    hero: {
      kicker: "Chios meridionale • Vicino a Olympoi",
      title: "Spiaggia Agia Dynami: il paradiso smeraldo",
      description:
        "Una piccola spiaggia da sogno nel sud di Chios, con una trasparenza incredibile e acque di un colore smeraldo unico. La pittoresca cappella completa un paesaggio greco autentico.",
      image:
        "/images/beaches/agia-dynami-beach-chios.webp",
      tags: ["#agia_dynami", "#acque_smeraldo", "#olympoi", "#tesoro_nascosto"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova nel sud di Chios, vicino al villaggio medievale di Olympoi, nella baia di Agia Theodosia. È perfetta da combinare con una visita ai villaggi del mastice.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "La spiaggia offre acque turchesi, sabbia fine con piccoli ciottoli e ombra naturale grazie ad alcuni alberi. Non è organizzata, quindi conserva un’atmosfera naturale e autentica.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Negli ultimi anni è diventata molto popolare. Poiché la baia è piccola, parti presto al mattino per trovare un buon posto e un po’ di ombra naturale.",
      },
    ],
    media: {
      video: {
        title: "La magia di Agia Dynami",
        embedUrl: "https://www.youtube.com/embed/__8C0AGL0HA",
        creditText: "Un ringraziamento speciale al canale per il bellissimo video.",
        creditLabel: "@dehaakil4432",
        creditHref: "https://www.youtube.com/@dehaakil4432",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Agia+Dynami+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~35-40 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Dynami+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Partendo da Voulamandis House a Kambos, puoi raggiungere presto Agia Dynami e goderti tutta la giornata nelle sue acque cristalline.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora i tesori nascosti dell’isola.",
  },
  {
    slug: "playa-agia-dynami",
    seo: {
      canonicalPath: "/es/playas-chios/playa-agia-dynami/",
      title: "Playa Agia Dynami Chios | Aguas esmeralda y cala escondida",
      description:
        "Descubre la playa de Agia Dynami en el sur de Chios, una pequeña cala de ensueño cerca de Olympoi con aguas esmeralda, arena fina, pequeños guijarros y sombra natural.",
      ogImage:
        "/images/beaches/agia-dynami-beach-chios.webp",
    },
    hero: {
      kicker: "Sur de Chios • Cerca de Olympoi",
      title: "Playa Agia Dynami: el paraíso esmeralda",
      description:
        "Una pequeña playa de ensueño en el sur de Chios, con una claridad increíble y aguas de un color esmeralda único. La pintoresca capilla completa este auténtico paisaje griego.",
      image:
        "/images/beaches/agia-dynami-beach-chios.webp",
      tags: ["#agia_dynami", "#aguas_esmeralda", "#olympoi", "#tesoro_escondido"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada en el sur de Chios, cerca del pueblo medieval de Olympoi, en la bahía de Agia Theodosia. Combina perfectamente con una visita a los pueblos del mastiha.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "La playa tiene aguas turquesas, arena fina con pequeños guijarros y sombra natural de algunos árboles. No está organizada, lo que ofrece una experiencia más natural y auténtica.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "En los últimos años se ha vuelto bastante popular. Como la cala es pequeña, sal temprano por la mañana para encontrar un buen lugar y disfrutar de sombra natural.",
      },
    ],
    media: {
      video: {
        title: "La magia de Agia Dynami",
        embedUrl: "https://www.youtube.com/embed/__8C0AGL0HA",
        creditText: "Gracias al canal por este maravilloso vídeo.",
        creditLabel: "@dehaakil4432",
        creditHref: "https://www.youtube.com/@dehaakil4432",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Agia+Dynami+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~35-40 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Dynami+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Desde Voulamandis House en Kambos, puedes salir temprano hacia Agia Dynami y disfrutar de todo el día en sus aguas cristalinas.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora los tesoros escondidos de la isla.",
  },
  {
    slug: "agia-dynami-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/agia-dynami-plaji/",
      title: "Agia Dynami Plajı Sakız Adası | Zümrüt sular ve gizli koy",
      description:
        "Sakız Adası’nın güneyindeki Agia Dynami Plajı’nı keşfedin: Olympoi yakınlarında zümrüt renkli suları, ince kumu, küçük çakılları ve doğal gölgesiyle küçük bir rüya koyu.",
      ogImage:
        "/images/beaches/agia-dynami-beach-chios.webp",
    },
    hero: {
      kicker: "Güney Sakız • Olympoi yakınında",
      title: "Agia Dynami Plajı: zümrüt cennet",
      description:
        "Sakız Adası’nın güneyinde, olağanüstü berraklığa ve benzersiz zümrüt tonlarında sulara sahip küçük bir rüya plajı. Pitoresk şapel bu otantik Yunan manzarasını tamamlar.",
      image:
        "/images/beaches/agia-dynami-beach-chios.webp",
      tags: ["#agia_dynami", "#zumrut_sular", "#olympoi", "#gizli_hazine"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Sakız Adası’nın güneyinde, Orta Çağ köyü Olympoi yakınında, Agia Theodosia koyunda yer alır. Mastik köyleri ziyaretiyle mükemmel şekilde birleştirilebilir.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Plaj turkuaz sulara, ince kuma, küçük çakıllara ve birkaç ağaçtan gelen doğal gölgeye sahiptir. Organize değildir; bu da daha doğal ve otantik bir deneyim sunar.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Son yıllarda oldukça popüler hale geldi. Koy küçük olduğu için iyi bir yer ve doğal gölge bulmak adına sabah erken yola çıkın.",
      },
    ],
    media: {
      video: {
        title: "Agia Dynami’nin büyüsü",
        embedUrl: "https://www.youtube.com/embed/__8C0AGL0HA",
        creditText: "Bu güzel video için kanala özel teşekkürler.",
        creditLabel: "@dehaakil4432",
        creditHref: "https://www.youtube.com/@dehaakil4432",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Agia+Dynami+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~35-40 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Dynami+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text:
        "Kambos’taki Voulamandis House’tan erken çıkarak Agia Dynami’ye ulaşabilir ve kristal berraklığındaki sularında tüm günün tadını çıkarabilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak adanın gizli hazinelerini keşfedin.",
  },


// Add these objects inside `localizedBeachDetails`, after the Agia Dynami localized objects.
// This file contains translations for the remaining 8 beaches in:
// el, fr, de, it, es, tr.
//
// Beaches included:
// Lithi, Lefkathia, Nagos, Avlonia, Salagona, Agia Fotia, Komi, Emporios / Mavra Volia.

/* =========================
   LITHI BEACH
========================= */

  {
    slug: "paralia-lithi",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-lithi/",
      title: "Παραλία Λιθί Χίος | Αμμώδης οικογενειακή παραλία & ψαροταβέρνες",
      description:
        "Ανακαλύψτε την παραλία Λιθί στη δυτική Χίο, ένα φυσικό λιμανάκι με ρηχά νερά, χρυσή άμμο και αυθεντικές ψαροταβέρνες δίπλα στη θάλασσα.",
      ogImage:
        "/images/beaches/lithi-beach-chios.webp",
    },
    hero: {
      kicker: "Δυτική Χίος • Ιδανική για οικογένειες",
      title: "Παραλία Λιθί: άμμος, ρηχά νερά και φρέσκο ψάρι",
      description:
        "Ένα όμορφο φυσικό λιμανάκι στη δυτική Χίο με ρηχά νερά, χρυσή άμμο και αυθεντικές ψαροταβέρνες σχεδόν πάνω στο κύμα.",
      image:
        "/images/beaches/lithi-beach-chios.webp",
      tags: ["#δυτική_χίος", "#αμμώδης_παραλία", "#οικογενειακή", "#ταβέρνες"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται στο κέντρο της δυτικής πλευράς της Χίου, περίπου 25 χλμ. από την πόλη και 7 χλμ. από τη Βέσσα. Συνδυάζεται όμορφα με Ανάβατο και Αυγώνυμα.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Γραφικό φυσικό λιμανάκι με ρηχή αμμώδη παραλία, ιδανική για παιδιά. Είναι οργανωμένη και αποτελεί εξαιρετική επιλογή για οικογένειες και για όσους αγαπούν το καλό φαγητό.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Προτιμήστε καθημερινές αν θέλετε περισσότερη ησυχία. Τα Σαββατοκύριακα είναι αγαπημένος προορισμός των ντόπιων και έχει περισσότερη ζωή.",
      },
    ],
    media: {
      video: {
        title: "Μια γεύση από το Λιθί",
        embedUrl: "https://www.youtube.com/embed/iM7lSt9OdG8",
        creditText: "Ευχαριστούμε για το όμορφο υλικό.",
        creditLabel: "chiosphotos.gr",
        creditHref: "https://chiosphotos.gr",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lithi+Beach,+Chios&output=embed",
        distance: "~22 χλμ.",
        time: "~35-40 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lithi+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Η παραλία Λιθί απέχει περίπου 40 λεπτά από τον ιστορικό Κάμπο. Κάντε το Voulamandis House τη βάση σας για να γνωρίσετε τις δυτικές παραλίες και τα μεσαιωνικά χωριά.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τις παραλίες και τους κρυμμένους θησαυρούς της Χίου.",
  },
  {
    slug: "plage-lithi",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-lithi/",
      title: "Plage de Lithi à Chios | Sable familial & poisson frais",
      description:
        "Découvrez la plage de Lithi à l’ouest de Chios, un port naturel avec des eaux peu profondes, du sable doré et des tavernes de poisson authentiques au bord de la mer.",
      ogImage:
        "/images/beaches/lithi-beach-chios.webp",
    },
    hero: {
      kicker: "Ouest de Chios • Idéale pour les familles",
      title: "Plage de Lithi : sable, eaux peu profondes et poisson frais",
      description:
        "Un joli port naturel à l’ouest de Chios avec des eaux peu profondes, du sable doré et des tavernes de poisson authentiques presque au bord des vagues.",
      image:
        "/images/beaches/lithi-beach-chios.webp",
      tags: ["#ouest_de_chios", "#plage_de_sable", "#famille", "#tavernes"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située au centre de la côte ouest, à environ 25 km de la ville de Chios et 7 km de Vessa. Elle se combine très bien avec Anavatos et Avgonyma.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "Un port naturel pittoresque avec une plage de sable peu profonde, entièrement organisée. Un excellent choix pour les familles avec enfants et les amateurs de bonne cuisine.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Visitez-la en semaine si vous recherchez plus de calme. Le week-end, c’est une destination très appréciée des habitants et pleine de vie.",
      },
    ],
    media: {
      video: {
        title: "Un aperçu de Lithi",
        embedUrl: "https://www.youtube.com/embed/iM7lSt9OdG8",
        creditText: "Merci pour ces belles images.",
        creditLabel: "chiosphotos.gr",
        creditHref: "https://chiosphotos.gr",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lithi+Beach,+Chios&output=embed",
        distance: "~22 km",
        time: "~35-40 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lithi+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text:
        "La plage de Lithi se trouve à environ 40 minutes de Kambos. Faites de Voulamandis House votre base pour explorer les plages de l’ouest et les villages médiévaux.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les plages et les trésors cachés de Chios.",
  },
  {
    slug: "lithi-strand",
    seo: {
      canonicalPath: "/de/straende-chios/lithi-strand/",
      title: "Lithi Strand Chios | Familienfreundlicher Sandstrand & frischer Fisch",
      description:
        "Entdecken Sie den Lithi Strand im Westen von Chios, einen natürlichen Hafen mit flachem Wasser, goldenem Sand und authentischen Fischtavernen direkt am Meer.",
      ogImage:
        "/images/beaches/lithi-beach-chios.webp",
    },
    hero: {
      kicker: "West-Chios • Familienfreundlich",
      title: "Lithi Strand: Sand, flaches Wasser und frischer Fisch",
      description:
        "Ein schöner natürlicher Hafen im Westen von Chios mit flachem Wasser, goldenem Sand und authentischen Fischtavernen direkt an den Wellen.",
      image:
        "/images/beaches/lithi-beach-chios.webp",
      tags: ["#west_chios", "#sandstrand", "#familienfreundlich", "#tavernen"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Der Strand liegt an der Westküste, etwa 25 km von Chios-Stadt und 7 km von Vessa entfernt. Er lässt sich gut mit Anavatos und Avgonyma verbinden.",
      },
      {
        icon: "🌊",
        title: "Merkmale",
        text:
          "Ein malerischer natürlicher Hafen mit flachem Sandstrand, vollständig organisiert. Ideal für Familien mit Kindern und für alle, die gutes Essen lieben.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Besuchen Sie Lithi unter der Woche, wenn Sie mehr Ruhe suchen. Am Wochenende ist der Strand bei Einheimischen sehr beliebt und voller Leben.",
      },
    ],
    media: {
      video: {
        title: "Ein Eindruck von Lithi",
        embedUrl: "https://www.youtube.com/embed/iM7lSt9OdG8",
        creditText: "Vielen Dank für das schöne Filmmaterial.",
        creditLabel: "chiosphotos.gr",
        creditHref: "https://chiosphotos.gr",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lithi+Beach,+Chios&output=embed",
        distance: "~22 km",
        time: "~35-40 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lithi+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Lithi Beach liegt etwa 40 Minuten vom historischen Kambos entfernt. Nutzen Sie Voulamandis House als Basis, um westliche Strände und mittelalterliche Dörfer zu entdecken.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die Strände und versteckten Schätze von Chios.",
  },
  {
    slug: "spiaggia-lithi",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-lithi/",
      title: "Spiaggia di Lithi Chios | Sabbia per famiglie & pesce fresco",
      description:
        "Scopri la spiaggia di Lithi nella parte occidentale di Chios, un porto naturale con acque basse, sabbia dorata e autentiche taverne di pesce sul mare.",
      ogImage:
        "/images/beaches/lithi-beach-chios.webp",
    },
    hero: {
      kicker: "Chios occidentale • Ideale per famiglie",
      title: "Spiaggia di Lithi: sabbia, acque basse e pesce fresco",
      description:
        "Un bellissimo porto naturale nella parte occidentale di Chios, con acque basse, sabbia dorata e autentiche taverne di pesce quasi sul mare.",
      image:
        "/images/beaches/lithi-beach-chios.webp",
      tags: ["#chios_occidentale", "#spiaggia_sabbiosa", "#famiglie", "#taverne"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova al centro della costa occidentale, a circa 25 km dalla città di Chios e 7 km da Vessa. Si abbina bene a una visita ad Anavatos e Avgonyma.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "Un pittoresco porto naturale con spiaggia sabbiosa e acque basse, completamente organizzato. Ideale per famiglie con bambini e per chi ama il buon cibo.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Visitala nei giorni feriali se cerchi più tranquillità. Nei fine settimana è molto amata dagli abitanti del posto e piena di vita.",
      },
    ],
    media: {
      video: {
        title: "Un assaggio di Lithi",
        embedUrl: "https://www.youtube.com/embed/iM7lSt9OdG8",
        creditText: "Grazie per le splendide immagini.",
        creditLabel: "chiosphotos.gr",
        creditHref: "https://chiosphotos.gr",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lithi+Beach,+Chios&output=embed",
        distance: "~22 km",
        time: "~35-40 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lithi+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "La spiaggia di Lithi dista circa 40 minuti dalla storica zona di Kambos. Scegli Voulamandis House come base per esplorare le spiagge occidentali e i villaggi medievali.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora le spiagge e i tesori nascosti di Chios.",
  },
  {
    slug: "playa-lithi",
    seo: {
      canonicalPath: "/es/playas-chios/playa-lithi/",
      title: "Playa de Lithi Chios | Arena familiar y pescado fresco",
      description:
        "Descubre la playa de Lithi en el oeste de Chios, un puerto natural con aguas poco profundas, arena dorada y auténticas tabernas de pescado junto al mar.",
      ogImage:
        "/images/beaches/lithi-beach-chios.webp",
    },
    hero: {
      kicker: "Oeste de Chios • Ideal para familias",
      title: "Playa de Lithi: arena, aguas poco profundas y pescado fresco",
      description:
        "Un hermoso puerto natural en el oeste de Chios, con aguas poco profundas, arena dorada y auténticas tabernas de pescado casi sobre las olas.",
      image:
        "/images/beaches/lithi-beach-chios.webp",
      tags: ["#oeste_de_chios", "#playa_de_arena", "#familias", "#tabernas"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada en el centro de la costa oeste, a unos 25 km de la ciudad de Chios y 7 km de Vessa. Combina muy bien con Anavatos y Avgonyma.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "Un pintoresco puerto natural con una playa de arena poco profunda, totalmente organizada. Ideal para familias con niños y para quienes aman la buena comida.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Visítala entre semana si buscas más tranquilidad. Los fines de semana es un destino muy querido por los locales y lleno de vida.",
      },
    ],
    media: {
      video: {
        title: "Un vistazo a Lithi",
        embedUrl: "https://www.youtube.com/embed/iM7lSt9OdG8",
        creditText: "Gracias por las bonitas imágenes.",
        creditLabel: "chiosphotos.gr",
        creditHref: "https://chiosphotos.gr",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lithi+Beach,+Chios&output=embed",
        distance: "~22 km",
        time: "~35-40 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lithi+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "La playa de Lithi está a unos 40 minutos de la histórica zona de Kambos. Haz de Voulamandis House tu base para explorar las playas occidentales y los pueblos medievales.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora las playas y los tesoros escondidos de Chios.",
  },
  {
    slug: "lithi-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/lithi-plaji/",
      title: "Lithi Plajı Sakız Adası | Aile dostu kum plajı ve taze balık",
      description:
        "Sakız Adası’nın batısındaki Lithi Plajı’nı keşfedin: sığ suları, altın rengi kumu ve deniz kenarındaki otantik balık tavernalarıyla doğal bir liman.",
      ogImage:
        "/images/beaches/lithi-beach-chios.webp",
    },
    hero: {
      kicker: "Batı Sakız • Aileler için ideal",
      title: "Lithi Plajı: kum, sığ sular ve taze balık",
      description:
        "Sakız Adası’nın batısında, sığ suları, altın rengi kumu ve dalgaların hemen yanında otantik balık tavernalarıyla güzel bir doğal liman.",
      image:
        "/images/beaches/lithi-beach-chios.webp",
      tags: ["#bati_sakiz", "#kum_plaji", "#aile_dostu", "#tavernalar"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Adanın batı kıyısının orta bölümünde, Sakız şehir merkezine yaklaşık 25 km ve Vessa’ya 7 km uzaklıktadır. Anavatos ve Avgonyma ile güzelce birleştirilebilir.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Sığ kum plajına sahip pitoresk bir doğal liman ve tamamen organize bir plajdır. Çocuklu aileler ve iyi yemek sevenler için ideal bir seçimdir.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Daha sakin bir deneyim istiyorsanız hafta içi ziyaret edin. Hafta sonları yerel halkın sevdiği, canlı bir destinasyona dönüşür.",
      },
    ],
    media: {
      video: {
        title: "Lithi’den bir görüntü",
        embedUrl: "https://www.youtube.com/embed/iM7lSt9OdG8",
        creditText: "Güzel görüntüler için teşekkürler.",
        creditLabel: "chiosphotos.gr",
        creditHref: "https://chiosphotos.gr",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lithi+Beach,+Chios&output=embed",
        distance: "~22 km",
        time: "~35-40 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lithi+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text:
        "Lithi Plajı, tarihi Kambos bölgesinden yaklaşık 40 dakika uzaklıktadır. Batı plajlarını ve Orta Çağ köylerini keşfetmek için Voulamandis House’u üssünüz yapın.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak Sakız Adası’nın plajlarını ve gizli hazinelerini keşfedin.",
  },

/* =========================
   LEFKATHIA BEACH
========================= */

  {
    slug: "paralia-lefkathia",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-lefkathia/",
      title: "Παραλία Λευκάθια Χίος | Κρυστάλλινα νερά στη Βολισσό",
      description:
        "Ανακαλύψτε την παραλία Λευκάθια στη βορειοδυτική Χίο, έναν όμορφο κλειστό κόλπο κοντά στη Βολισσό και τα Λημνιά με κρυστάλλινα νερά, αρμυρίκια και υπέροχο ηλιοβασίλεμα.",
      ogImage: "/images/beaches/lefkathia-2.jpg",
    },
    hero: {
      kicker: "Βορειοδυτική Χίος • Βολισσός",
      title: "Παραλία Λευκάθια: κρυστάλλινα νερά στη Βολισσό",
      description:
        "Ένας όμορφος κλειστός κόλπος στη βορειοδυτική Χίο. Το ημικυκλικό σχήμα, τα καθαρά νερά και τα μαγικά ηλιοβασιλέματα δημιουργούν μια ξεχωριστή εμπειρία.",
      image: "/images/beaches/lefkathia-2.jpg",
      tags: ["#βορειοδυτική_χίος", "#βολισσός", "#νεανική_ατμόσφαιρα", "#ηλιοβασίλεμα"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται στο βορειοδυτικό τμήμα του νησιού, δίπλα στο γραφικό λιμανάκι των Λημνιών και πολύ κοντά στην ιστορική Βολισσό. Η πρόσβαση γίνεται εύκολα με αυτοκίνητο.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Πλήρως οργανωμένη παραλία με ομπρέλες, ξαπλώστρες και ζωντανή νεανική ατμόσφαιρα. Τα μεγάλα αρμυρίκια κατά μήκος της ακτής προσφέρουν φυσική σκιά.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Αξίζει να μείνετε μέχρι αργά. Ο δυτικός προσανατολισμός του κόλπου προσφέρει ένα από τα πιο ρομαντικά ηλιοβασιλέματα στη Χίο.",
      },
    ],
    media: {
      video: {
        title: "Η μαγεία των Λευκαθιών",
        embedUrl: "https://www.youtube.com/embed/EV3nSOTvngQ",
        creditText: "Ευχαριστούμε για το υπέροχο βίντεο.",
        creditLabel: "@TYSON409",
        creditHref: "https://www.youtube.com/@TYSON409",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lefkathia+Beach,+Chios&output=embed",
        distance: "~40 χλμ.",
        time: "~55-60 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lefkathia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Οργανώστε μια αξέχαστη ημερήσια εκδρομή στη βόρεια Χίο με Βολισσό, Αγία Μαρκέλλα και Λευκάθια, ξεκινώντας από τον Κάμπο.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τους κρυμμένους θησαυρούς του νησιού.",
  },
  {
    slug: "plage-lefkathia",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-lefkathia/",
      title: "Plage de Lefkathia à Chios | Eaux cristallines à Volissos",
      description:
        "Découvrez la plage de Lefkathia au nord-ouest de Chios, une belle baie fermée près de Volissos et Limnia avec des eaux cristallines, des tamaris et une vue sur le coucher du soleil.",
      ogImage: "/images/beaches/lefkathia-2.jpg",
    },
    hero: {
      kicker: "Nord-ouest de Chios • Volissos",
      title: "Plage de Lefkathia : eaux cristallines à Volissos",
      description:
        "Une belle baie fermée au nord-ouest de Chios. Sa forme semi-circulaire, ses eaux limpides et ses superbes couchers de soleil créent une atmosphère unique.",
      image: "/images/beaches/lefkathia-2.jpg",
      tags: ["#nord_ouest_chios", "#volissos", "#ambiance_jeune", "#coucher_de_soleil"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située dans la partie nord-ouest de l’île, près du port pittoresque de Limnia et tout près de Volissos. L’accès est facile en voiture.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "Plage entièrement organisée avec parasols, transats et une ambiance jeune et animée. Les grands tamaris le long du rivage offrent une ombre naturelle.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Cela vaut la peine de rester jusqu’au soir. L’orientation ouest de la baie offre l’un des couchers de soleil les plus romantiques de Chios.",
      },
    ],
    media: {
      video: {
        title: "La magie de Lefkathia",
        embedUrl: "https://www.youtube.com/embed/EV3nSOTvngQ",
        creditText: "Merci pour cette superbe vidéo.",
        creditLabel: "@TYSON409",
        creditHref: "https://www.youtube.com/@TYSON409",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lefkathia+Beach,+Chios&output=embed",
        distance: "~40 km",
        time: "~55-60 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lefkathia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text:
        "Organisez une journée inoubliable dans le nord de Chios avec Volissos, Agia Markella et Lefkathia, en partant de Kambos.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les trésors cachés de l’île.",
  },
  {
    slug: "lefkathia-strand",
    seo: {
      canonicalPath: "/de/straende-chios/lefkathia-strand/",
      title: "Lefkathia Strand Chios | Kristallklares Wasser bei Volissos",
      description:
        "Entdecken Sie den Lefkathia Strand im Nordwesten von Chios, eine schöne geschlossene Bucht nahe Volissos und Limnia mit kristallklarem Wasser, Tamarisken und Sonnenuntergangsblick.",
      ogImage: "/images/beaches/lefkathia-2.jpg",
    },
    hero: {
      kicker: "Nordwest-Chios • Volissos",
      title: "Lefkathia Strand: kristallklares Wasser bei Volissos",
      description:
        "Eine schöne geschlossene Bucht im Nordwesten von Chios. Die halbkreisförmige Bucht, das klare Wasser und die Sonnenuntergänge schaffen eine besondere Atmosphäre.",
      image: "/images/beaches/lefkathia-2.jpg",
      tags: ["#nordwest_chios", "#volissos", "#junge_atmosphaere", "#sonnenuntergang"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Der Strand liegt im Nordwesten der Insel, neben dem kleinen Hafen von Limnia und sehr nahe bei Volissos. Die Anfahrt mit dem Auto ist einfach.",
      },
      {
        icon: "🌊",
        title: "Merkmale",
        text:
          "Ein vollständig organisierter Strand mit Sonnenschirmen, Liegen und lebendiger Atmosphäre. Große Tamarisken entlang der Küste bieten natürlichen Schatten.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Bleiben Sie bis zum Abend. Die westliche Ausrichtung der Bucht bietet einen der romantischsten Sonnenuntergänge auf Chios.",
      },
    ],
    media: {
      video: {
        title: "Die Magie von Lefkathia",
        embedUrl: "https://www.youtube.com/embed/EV3nSOTvngQ",
        creditText: "Vielen Dank für das wunderschöne Video.",
        creditLabel: "@TYSON409",
        creditHref: "https://www.youtube.com/@TYSON409",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lefkathia+Beach,+Chios&output=embed",
        distance: "~40 km",
        time: "~55-60 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lefkathia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Planen Sie einen unvergesslichen Tagesausflug in den Norden von Chios mit Volissos, Agia Markella und Lefkathia, ausgehend von Kambos.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die versteckten Schätze der Insel.",
  },
  {
    slug: "spiaggia-lefkathia",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-lefkathia/",
      title: "Spiaggia di Lefkathia Chios | Acque cristalline a Volissos",
      description:
        "Scopri la spiaggia di Lefkathia nel nord-ovest di Chios, una splendida baia chiusa vicino a Volissos e Limnia con acque cristalline, tamerici e tramonti suggestivi.",
      ogImage: "/images/beaches/lefkathia-2.jpg",
    },
    hero: {
      kicker: "Nord-ovest di Chios • Volissos",
      title: "Spiaggia di Lefkathia: acque cristalline a Volissos",
      description:
        "Una splendida baia chiusa nel nord-ovest di Chios. La sua forma semicircolare, le acque limpide e i tramonti creano un’atmosfera speciale.",
      image: "/images/beaches/lefkathia-2.jpg",
      tags: ["#nord_ovest_chios", "#volissos", "#atmosfera_giovane", "#tramonto"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova nella parte nord-occidentale dell’isola, accanto al pittoresco porto di Limnia e molto vicino a Volissos. L’accesso in auto è semplice.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "Spiaggia completamente organizzata con ombrelloni, lettini e un’atmosfera vivace. Le grandi tamerici lungo la riva offrono ombra naturale.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Vale la pena restare fino a tardi. L’orientamento a ovest della baia regala uno dei tramonti più romantici di Chios.",
      },
    ],
    media: {
      video: {
        title: "La magia di Lefkathia",
        embedUrl: "https://www.youtube.com/embed/EV3nSOTvngQ",
        creditText: "Grazie per il bellissimo video.",
        creditLabel: "@TYSON409",
        creditHref: "https://www.youtube.com/@TYSON409",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lefkathia+Beach,+Chios&output=embed",
        distance: "~40 km",
        time: "~55-60 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lefkathia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Organizza una gita indimenticabile nel nord di Chios con Volissos, Agia Markella e Lefkathia, partendo da Kambos.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora i tesori nascosti dell’isola.",
  },
  {
    slug: "playa-lefkathia",
    seo: {
      canonicalPath: "/es/playas-chios/playa-lefkathia/",
      title: "Playa de Lefkathia Chios | Aguas cristalinas en Volissos",
      description:
        "Descubre la playa de Lefkathia en el noroeste de Chios, una hermosa bahía cerrada cerca de Volissos y Limnia con aguas cristalinas, tamariscos y vistas al atardecer.",
      ogImage: "/images/beaches/lefkathia-2.jpg",
    },
    hero: {
      kicker: "Noroeste de Chios • Volissos",
      title: "Playa de Lefkathia: aguas cristalinas en Volissos",
      description:
        "Una hermosa bahía cerrada en el noroeste de Chios. Su forma semicircular, sus aguas claras y sus atardeceres crean una atmósfera muy especial.",
      image: "/images/beaches/lefkathia-2.jpg",
      tags: ["#noroeste_de_chios", "#volissos", "#ambiente_joven", "#atardecer"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada en la parte noroeste de la isla, junto al pintoresco puerto de Limnia y muy cerca de Volissos. El acceso en coche es sencillo.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "Playa totalmente organizada con sombrillas, tumbonas y un ambiente joven y animado. Los grandes tamariscos de la orilla ofrecen sombra natural.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Vale la pena quedarse hasta tarde. La orientación occidental de la bahía ofrece uno de los atardeceres más románticos de Chios.",
      },
    ],
    media: {
      video: {
        title: "La magia de Lefkathia",
        embedUrl: "https://www.youtube.com/embed/EV3nSOTvngQ",
        creditText: "Gracias por este bonito vídeo.",
        creditLabel: "@TYSON409",
        creditHref: "https://www.youtube.com/@TYSON409",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lefkathia+Beach,+Chios&output=embed",
        distance: "~40 km",
        time: "~55-60 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lefkathia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Organiza una excursión inolvidable al norte de Chios con Volissos, Agia Markella y Lefkathia, saliendo desde Kambos.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora los tesoros escondidos de la isla.",
  },
  {
    slug: "lefkathia-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/lefkathia-plaji/",
      title: "Lefkathia Plajı Sakız Adası | Volissos’ta kristal sular",
      description:
        "Sakız Adası’nın kuzeybatısındaki Lefkathia Plajı’nı keşfedin: Volissos ve Limnia yakınında kristal suları, ılgın ağaçları ve gün batımı manzarasıyla güzel bir kapalı koy.",
      ogImage: "/images/beaches/lefkathia-2.jpg",
    },
    hero: {
      kicker: "Kuzeybatı Sakız • Volissos",
      title: "Lefkathia Plajı: Volissos’ta kristal sular",
      description:
        "Sakız Adası’nın kuzeybatısında güzel bir kapalı koy. Yarım daire şekli, berrak suları ve gün batımı manzarası özel bir atmosfer yaratır.",
      image: "/images/beaches/lefkathia-2.jpg",
      tags: ["#kuzeybati_sakiz", "#volissos", "#genç_atmosfer", "#gun_batimi"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Adanın kuzeybatısında, Limnia’nın küçük limanının yanında ve Volissos’a çok yakın konumdadır. Arabayla ulaşım kolaydır.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Şemsiyeler, şezlonglar ve canlı bir atmosferle tamamen organize bir plajdır. Kıyı boyunca uzanan büyük ılgın ağaçları doğal gölge sağlar.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Akşama kadar kalmaya değer. Koyun batıya bakması, Sakız Adası’nın en romantik gün batımlarından birini sunar.",
      },
    ],
    media: {
      video: {
        title: "Lefkathia’nın büyüsü",
        embedUrl: "https://www.youtube.com/embed/EV3nSOTvngQ",
        creditText: "Bu güzel video için teşekkürler.",
        creditLabel: "@TYSON409",
        creditHref: "https://www.youtube.com/@TYSON409",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Lefkathia+Beach,+Chios&output=embed",
        distance: "~40 km",
        time: "~55-60 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Lefkathia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text:
        "Kambos’tan başlayarak Volissos, Agia Markella ve Lefkathia’yı içeren unutulmaz bir kuzey Sakız rotası planlayabilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak adanın gizli hazinelerini keşfedin.",
  },

/* =========================
   NAGOS BEACH
========================= */

  {
    slug: "paralia-nagos",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-nagos/",
      title: "Παραλία Ναγός Χίος | Πράσινο τοπίο στη βόρεια Χίο",
      description:
        "Ανακαλύψτε την παραλία Ναγός στη βόρεια Χίο κοντά στα Καρδάμυλα, όπου πηγές, πλατάνια, πολύχρωμα βότσαλα και κρυστάλλινα νερά δημιουργούν ένα δροσερό τοπίο.",
      ogImage:
        "/images/beaches/nagos-beach-chios.webp",
    },
    hero: {
      kicker: "Βόρεια Χίος • Καρδάμυλα",
      title: "Παραλία Ναγός: το πράσινο τοπίο της βόρειας Χίου",
      description:
        "Ένα μοναδικό σκηνικό όπου τα τρεχούμενα νερά από τις πηγές και τα αιωνόβια πλατάνια συναντούν τα κρυστάλλινα νερά και τα πολύχρωμα βότσαλα του Αιγαίου.",
      image:
        "/images/beaches/nagos-beach-chios.webp",
      tags: ["#βόρεια_χίος", "#καρδάμυλα", "#πηγές", "#πλατάνια"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται στη βόρεια Χίο, μόλις 5 χλμ. από το ιστορικό ναυτικό χωριό Καρδάμυλα. Η διαδρομή προσφέρει όμορφη θέα προς το Αιγαίο.",
      },
      {
        icon: "🌿",
        title: "Χαρακτηριστικά",
        text:
          "Πλούσια βλάστηση, πηγές, πλατάνια και μικρά ρυάκια προσφέρουν δροσιά ακόμη και τις πιο ζεστές ημέρες του καλοκαιριού.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Επισκεφθείτε την καθημερινή αν θέλετε απόλυτη ηρεμία. Τα Σαββατοκύριακα γεμίζει ζωή με ντόπιους επισκέπτες.",
      },
    ],
    media: {
      video: {
        title: "Η ομορφιά του Ναγού από ψηλά",
        embedUrl: "https://www.youtube.com/embed/33224Rv5TPU",
        creditText: "Ευχαριστούμε το κανάλι για το όμορφο βίντεο.",
        creditLabel: "@nmilonass",
        creditHref: "https://www.youtube.com/@nmilonass",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Nagos+Beach,+Chios&output=embed",
        distance: "~33 χλμ.",
        time: "~50-55 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Nagos+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Ξεκινώντας από τον καταπράσινο Κάμπο, μπορείτε να οργανώσετε την ημερήσια εκδρομή σας στη βόρεια Χίο. Κάντε το Voulamandis House τη βάση σας και αφήστε μας να σας προτείνουμε τις καλύτερες διαδρομές.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τους κρυμμένους θησαυρούς του νησιού.",
  },
  {
    slug: "plage-nagos",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-nagos/",
      title: "Plage de Nagos à Chios | Paysage vert du nord de Chios",
      description:
        "Découvrez la plage de Nagos au nord de Chios près de Kardamyla, où sources, platanes, galets colorés et eaux cristallines créent un paysage rafraîchissant.",
      ogImage:
        "/images/beaches/nagos-beach-chios.webp",
    },
    hero: {
      kicker: "Nord de Chios • Kardamyla",
      title: "Plage de Nagos : le paysage vert du nord de Chios",
      description:
        "Un décor unique où les eaux des sources et les platanes centenaires rencontrent les eaux cristallines et les galets colorés de la mer Égée.",
      image:
        "/images/beaches/nagos-beach-chios.webp",
      tags: ["#nord_de_chios", "#kardamyla", "#sources", "#platanes"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située au nord de Chios, à seulement 5 km du village maritime historique de Kardamyla. La route offre de belles vues sur la mer Égée.",
      },
      {
        icon: "🌿",
        title: "Caractéristiques",
        text:
          "Une végétation riche, des sources, des platanes et de petits ruisseaux offrent une fraîcheur bienvenue même pendant les journées les plus chaudes de l’été.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Visitez-la en semaine si vous recherchez le calme absolu. Le week-end, elle devient plus animée avec les habitants.",
      },
    ],
    media: {
      video: {
        title: "La beauté de Nagos vue d’en haut",
        embedUrl: "https://www.youtube.com/embed/33224Rv5TPU",
        creditText: "Merci à la chaîne pour cette belle vidéo.",
        creditLabel: "@nmilonass",
        creditHref: "https://www.youtube.com/@nmilonass",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Nagos+Beach,+Chios&output=embed",
        distance: "~33 km",
        time: "~50-55 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Nagos+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text:
        "Depuis le quartier verdoyant de Kambos, vous pouvez organiser votre excursion vers le nord de Chios. Faites de Voulamandis House votre base et laissez-nous vous recommander les meilleurs itinéraires.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les trésors cachés de l’île.",
  },
  {
    slug: "nagos-strand",
    seo: {
      canonicalPath: "/de/straende-chios/nagos-strand/",
      title: "Nagos Strand Chios | Grüne Landschaft im Norden von Chios",
      description:
        "Entdecken Sie den Nagos Strand im Norden von Chios nahe Kardamyla, wo Quellen, Platanen, bunte Kiesel und kristallklares Wasser eine erfrischende Landschaft schaffen.",
      ogImage:
        "/images/beaches/nagos-beach-chios.webp",
    },
    hero: {
      kicker: "Nord-Chios • Kardamyla",
      title: "Nagos Strand: die grüne Landschaft im Norden von Chios",
      description:
        "Eine einzigartige Kulisse, in der Quellwasser und jahrhundertealte Platanen auf kristallklares Wasser und farbige Kiesel der Ägäis treffen.",
      image:
        "/images/beaches/nagos-beach-chios.webp",
      tags: ["#nord_chios", "#kardamyla", "#quellen", "#platanen"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Der Strand liegt im Norden von Chios, nur 5 km vom historischen Seefahrerdorf Kardamyla entfernt. Die Route bietet schöne Ausblicke auf die Ägäis.",
      },
      {
        icon: "🌿",
        title: "Merkmale",
        text:
          "Üppige Vegetation, Quellen, Platanen und kleine Bäche sorgen selbst an den heißesten Sommertagen für angenehme Kühle.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Besuchen Sie Nagos unter der Woche, wenn Sie absolute Ruhe suchen. Am Wochenende ist der Strand bei Einheimischen lebendiger.",
      },
    ],
    media: {
      video: {
        title: "Die Schönheit von Nagos von oben",
        embedUrl: "https://www.youtube.com/embed/33224Rv5TPU",
        creditText: "Vielen Dank an den Kanal für das schöne Video.",
        creditLabel: "@nmilonass",
        creditHref: "https://www.youtube.com/@nmilonass",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Nagos+Beach,+Chios&output=embed",
        distance: "~33 km",
        time: "~50-55 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Nagos+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Vom grünen Kambos aus können Sie Ihren Tagesausflug in den Norden von Chios planen. Nutzen Sie Voulamandis House als Basis und lassen Sie sich die besten Routen empfehlen.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die versteckten Schätze der Insel.",
  },
  {
    slug: "spiaggia-nagos",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-nagos/",
      title: "Spiaggia di Nagos Chios | Paesaggio verde del nord di Chios",
      description:
        "Scopri la spiaggia di Nagos nel nord di Chios vicino a Kardamyla, dove sorgenti, platani, ciottoli colorati e acque cristalline creano un paesaggio rinfrescante.",
      ogImage:
        "/images/beaches/nagos-beach-chios.webp",
    },
    hero: {
      kicker: "Chios settentrionale • Kardamyla",
      title: "Spiaggia di Nagos: il paesaggio verde del nord di Chios",
      description:
        "Uno scenario unico dove le acque delle sorgenti e i platani secolari incontrano le acque cristalline e i ciottoli colorati dell’Egeo.",
      image:
        "/images/beaches/nagos-beach-chios.webp",
      tags: ["#chios_settentrionale", "#kardamyla", "#sorgenti", "#platani"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova nel nord di Chios, a soli 5 km dallo storico villaggio marinaro di Kardamyla. Il percorso offre splendide viste sul Mar Egeo.",
      },
      {
        icon: "🌿",
        title: "Caratteristiche",
        text:
          "Vegetazione ricca, sorgenti, platani e piccoli ruscelli offrono freschezza anche nelle giornate più calde dell’estate.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Visitala durante la settimana se cerchi tranquillità assoluta. Nei fine settimana si riempie di vita con i residenti locali.",
      },
    ],
    media: {
      video: {
        title: "La bellezza di Nagos dall’alto",
        embedUrl: "https://www.youtube.com/embed/33224Rv5TPU",
        creditText: "Grazie al canale per il bellissimo video.",
        creditLabel: "@nmilonass",
        creditHref: "https://www.youtube.com/@nmilonass",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Nagos+Beach,+Chios&output=embed",
        distance: "~33 km",
        time: "~50-55 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Nagos+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Partendo dalla verde zona di Kambos, puoi organizzare la tua gita nel nord di Chios. Scegli Voulamandis House come base e lasciati consigliare i migliori itinerari.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora i tesori nascosti dell’isola.",
  },
  {
    slug: "playa-nagos",
    seo: {
      canonicalPath: "/es/playas-chios/playa-nagos/",
      title: "Playa de Nagos Chios | Paisaje verde del norte de Chios",
      description:
        "Descubre la playa de Nagos en el norte de Chios, cerca de Kardamyla, donde manantiales, plátanos, guijarros coloridos y aguas cristalinas crean un paisaje refrescante.",
      ogImage:
        "/images/beaches/nagos-beach-chios.webp",
    },
    hero: {
      kicker: "Norte de Chios • Kardamyla",
      title: "Playa de Nagos: el paisaje verde del norte de Chios",
      description:
        "Un entorno único donde las aguas de los manantiales y los plátanos centenarios se encuentran con aguas cristalinas y guijarros coloridos del Egeo.",
      image:
        "/images/beaches/nagos-beach-chios.webp",
      tags: ["#norte_de_chios", "#kardamyla", "#manantiales", "#platanos"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada en el norte de Chios, a solo 5 km del histórico pueblo marinero de Kardamyla. La ruta ofrece bonitas vistas al mar Egeo.",
      },
      {
        icon: "🌿",
        title: "Características",
        text:
          "Vegetación abundante, manantiales, plátanos y pequeños arroyos aportan frescor incluso en los días más calurosos del verano.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Visítala entre semana si quieres tranquilidad absoluta. Los fines de semana se llena de vida con visitantes locales.",
      },
    ],
    media: {
      video: {
        title: "La belleza de Nagos desde arriba",
        embedUrl: "https://www.youtube.com/embed/33224Rv5TPU",
        creditText: "Gracias al canal por este bonito vídeo.",
        creditLabel: "@nmilonass",
        creditHref: "https://www.youtube.com/@nmilonass",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Nagos+Beach,+Chios&output=embed",
        distance: "~33 km",
        time: "~50-55 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Nagos+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Desde la verde zona de Kambos, puedes organizar tu excursión al norte de Chios. Haz de Voulamandis House tu base y deja que te recomendemos las mejores rutas.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora los tesoros escondidos de la isla.",
  },
  {
    slug: "nagos-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/nagos-plaji/",
      title: "Nagos Plajı Sakız Adası | Kuzey Sakız’ın yeşil manzarası",
      description:
        "Kardamyla yakınındaki Nagos Plajı’nı keşfedin: kaynaklar, çınar ağaçları, renkli çakıllar ve kristal suların serin bir manzara yarattığı kuzey Sakız plajı.",
      ogImage:
        "/images/beaches/nagos-beach-chios.webp",
    },
    hero: {
      kicker: "Kuzey Sakız • Kardamyla",
      title: "Nagos Plajı: Kuzey Sakız’ın yeşil manzarası",
      description:
        "Kaynak sularının ve asırlık çınarların, Ege’nin kristal suları ve renkli çakıllarıyla buluştuğu benzersiz bir manzara.",
      image:
        "/images/beaches/nagos-beach-chios.webp",
      tags: ["#kuzey_sakiz", "#kardamyla", "#kaynaklar", "#cinarlar"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Sakız Adası’nın kuzeyinde, tarihi denizci köyü Kardamyla’ya sadece 5 km uzaklıktadır. Yol boyunca Ege Denizi’ne güzel manzaralar eşlik eder.",
      },
      {
        icon: "🌿",
        title: "Özellikler",
        text:
          "Zengin bitki örtüsü, kaynaklar, çınar ağaçları ve küçük dereler, yazın en sıcak günlerinde bile serinlik sağlar.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Mutlak huzur istiyorsanız hafta içi ziyaret edin. Hafta sonları yerel ziyaretçilerle daha canlı hale gelir.",
      },
    ],
    media: {
      video: {
        title: "Nagos’un havadan güzelliği",
        embedUrl: "https://www.youtube.com/embed/33224Rv5TPU",
        creditText: "Bu güzel video için kanala teşekkürler.",
        creditLabel: "@nmilonass",
        creditHref: "https://www.youtube.com/@nmilonass",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Nagos+Beach,+Chios&output=embed",
        distance: "~33 km",
        time: "~50-55 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Nagos+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text:
        "Yeşil Kambos bölgesinden başlayarak kuzey Sakız’a günlük gezi planlayabilirsiniz. Voulamandis House’u üssünüz yapın ve en iyi rotalar için bizden öneri alın.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak adanın gizli hazinelerini keşfedin.",
  },

/* =========================
   AVLONIA BEACH
========================= */

  {
    slug: "paralia-avlonia",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-avlonia/",
      title: "Παραλία Αυλωνιά Χίος | Κρυμμένος θησαυρός της νότιας Χίου",
      description:
        "Ανακαλύψτε την παραλία Αυλωνιά στη νότια Χίο, έναν απομονωμένο κόλπο κοντά στο Πυργί με τιρκουάζ νερά, άγρια ομορφιά, μικρά βότσαλα και βυθό ιδανικό για snorkeling.",
      ogImage:
        "/images/beaches/avlonia-1024x768.webp",
    },
    hero: {
      kicker: "Νότια Χίος • Πυργούσικη Αυλωνιά",
      title: "Παραλία Αυλωνιά: ο κρυμμένος θησαυρός του νότου",
      description:
        "Ένας μαγικός, απομονωμένος κόλπος στη νότια Χίο με άγρια ομορφιά, τιρκουάζ κρυστάλλινα νερά και εντυπωσιακό βυθό που αξίζει να εξερευνήσετε.",
      image:
        "/images/beaches/avlonia-1024x768.webp",
      tags: ["#νότια_χίος", "#πυργούσικη_αυλωνιά", "#κρυφή_παραλία", "#snorkeling"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται στη νότια πλευρά της Χίου, περίπου 9 χλμ. από το μεσαιωνικό Πυργί. Ένα μονοπάτι περίπου 700 μέτρων οδηγεί στον κόλπο και προσθέτει αίσθηση περιπέτειας.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Γνωστή και ως Πυργούσικη Αυλωνιά, έχει μικρά βότσαλα και χοντρή άμμο. Τα καθαρά νερά και ο βυθός την κάνουν ιδανική για snorkeling.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Η παραλία δεν είναι οργανωμένη. Πάρτε ομπρέλα, αρκετό νερό και κάτι για φαγητό. Αξίζει να μείνετε μέχρι αργά για το μαγικό ηλιοβασίλεμα.",
      },
    ],
    media: {
      video: {
        title: "Η άγρια ομορφιά της Αυλωνιάς",
        embedUrl: "https://www.youtube.com/embed/fRkgQeg8j0I",
        creditText: "Ευχαριστούμε το κανάλι για το υπέροχο βίντεο.",
        creditLabel: "@GeorgeNito",
        creditHref: "https://www.youtube.com/@GeorgeNito",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Avlonia+Beach,+Chios&output=embed",
        distance: "~32 χλμ.",
        time: "~45-50 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Avlonia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Η Αυλωνιά συνδυάζεται ιδανικά με εκδρομή στα Μαστιχοχώρια. Ξεκινώντας από το Voulamandis House στον Κάμπο, βρίσκεστε σε πολύ καλή θέση για χωριά και κρυφές νότιες παραλίες.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τους κρυμμένους θησαυρούς του νησιού.",
  },
  {
    slug: "plage-avlonia",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-avlonia/",
      title: "Plage d’Avlonia à Chios | Joyau caché du sud de Chios",
      description:
        "Découvrez la plage d’Avlonia au sud de Chios, une baie isolée près de Pyrgi avec des eaux turquoise, une beauté sauvage, de petits galets et un fond marin idéal pour le snorkeling.",
      ogImage:
        "/images/beaches/avlonia-1024x768.webp",
    },
    hero: {
      kicker: "Sud de Chios • Avlonia de Pyrgi",
      title: "Plage d’Avlonia : le joyau caché du sud",
      description:
        "Une baie magique et isolée au sud de Chios, avec une beauté sauvage, des eaux turquoise cristallines et un fond marin impressionnant à explorer.",
      image:
        "/images/beaches/avlonia-1024x768.webp",
      tags: ["#sud_de_chios", "#avlonia", "#plage_cachee", "#snorkeling"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située au sud de Chios, à environ 9 km du village médiéval de Pyrgi. Un sentier d’environ 700 mètres mène à la baie et ajoute une touche d’aventure.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "Connue localement comme l’Avlonia de Pyrgi, elle présente de petits galets et du sable grossier. Ses eaux limpides et son fond marin sont parfaits pour le snorkeling.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "La plage n’est pas organisée. Apportez un parasol, beaucoup d’eau et de quoi manger. Restez jusqu’à tard pour profiter du coucher de soleil.",
      },
    ],
    media: {
      video: {
        title: "La beauté sauvage d’Avlonia",
        embedUrl: "https://www.youtube.com/embed/fRkgQeg8j0I",
        creditText: "Merci à la chaîne pour cette superbe vidéo.",
        creditLabel: "@GeorgeNito",
        creditHref: "https://www.youtube.com/@GeorgeNito",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Avlonia+Beach,+Chios&output=embed",
        distance: "~32 km",
        time: "~45-50 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Avlonia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text:
        "Avlonia se combine parfaitement avec une excursion dans les villages du mastic. Depuis Voulamandis House à Kambos, vous êtes idéalement placé pour explorer villages médiévaux et plages cachées du sud.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les trésors cachés de l’île.",
  },
  {
    slug: "avlonia-strand",
    seo: {
      canonicalPath: "/de/straende-chios/avlonia-strand/",
      title: "Avlonia Strand Chios | Verstecktes Juwel im Süden von Chios",
      description:
        "Entdecken Sie den Avlonia Strand im Süden von Chios, eine abgelegene Bucht nahe Pyrgi mit türkisfarbenem Wasser, wilder Schönheit, kleinen Kieseln und idealem Meeresgrund zum Schnorcheln.",
      ogImage:
        "/images/beaches/avlonia-1024x768.webp",
    },
    hero: {
      kicker: "Süd-Chios • Avlonia bei Pyrgi",
      title: "Avlonia Strand: das versteckte Juwel des Südens",
      description:
        "Eine magische, abgelegene Bucht im Süden von Chios mit wilder Schönheit, türkisfarbenem kristallklarem Wasser und einem beeindruckenden Meeresboden.",
      image:
        "/images/beaches/avlonia-1024x768.webp",
      tags: ["#sued_chios", "#avlonia", "#versteckter_strand", "#schnorcheln"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Der Strand liegt im Süden von Chios, etwa 9 km vom mittelalterlichen Dorf Pyrgi entfernt. Ein etwa 700 Meter langer Weg führt zur Bucht und sorgt für ein kleines Abenteuer.",
      },
      {
        icon: "🌊",
        title: "Merkmale",
        text:
          "Lokal als Pyrgousiki Avlonia bekannt, bietet der Strand kleine Kiesel und groben Sand. Das klare Wasser und der Meeresboden sind ideal zum Schnorcheln.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Der Strand ist nicht organisiert. Bringen Sie Sonnenschirm, ausreichend Wasser und Snacks mit. Bleiben Sie bis zum Abend, um den Sonnenuntergang zu genießen.",
      },
    ],
    media: {
      video: {
        title: "Die wilde Schönheit von Avlonia",
        embedUrl: "https://www.youtube.com/embed/fRkgQeg8j0I",
        creditText: "Vielen Dank an den Kanal für das wunderschöne Video.",
        creditLabel: "@GeorgeNito",
        creditHref: "https://www.youtube.com/@GeorgeNito",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Avlonia+Beach,+Chios&output=embed",
        distance: "~32 km",
        time: "~45-50 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Avlonia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Avlonia lässt sich perfekt mit den Mastixdörfern verbinden. Von Voulamandis House in Kambos aus sind mittelalterliche Dörfer und versteckte Südstrände gut erreichbar.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die versteckten Schätze der Insel.",
  },
  {
    slug: "spiaggia-avlonia",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-avlonia/",
      title: "Spiaggia di Avlonia Chios | Gemma nascosta del sud di Chios",
      description:
        "Scopri la spiaggia di Avlonia nel sud di Chios, una baia isolata vicino a Pyrgi con acque turchesi, bellezza selvaggia, piccoli ciottoli e fondale ideale per lo snorkeling.",
      ogImage:
        "/images/beaches/avlonia-1024x768.webp",
    },
    hero: {
      kicker: "Chios meridionale • Avlonia di Pyrgi",
      title: "Spiaggia di Avlonia: la gemma nascosta del sud",
      description:
        "Una baia magica e isolata nel sud di Chios con bellezza selvaggia, acque turchesi cristalline e un fondale impressionante da esplorare.",
      image:
        "/images/beaches/avlonia-1024x768.webp",
      tags: ["#chios_meridionale", "#avlonia", "#spiaggia_nascosta", "#snorkeling"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova nella parte meridionale di Chios, a circa 9 km dal villaggio medievale di Pyrgi. Un sentiero di circa 700 metri conduce alla baia e aggiunge un senso di avventura.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "Conosciuta localmente come Pyrgousiki Avlonia, presenta piccoli ciottoli e sabbia grossa. Le acque limpide e il fondale la rendono ideale per lo snorkeling.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "La spiaggia non è organizzata. Porta ombrellone, acqua e snack. Vale la pena restare fino a tardi per godersi il tramonto.",
      },
    ],
    media: {
      video: {
        title: "La bellezza selvaggia di Avlonia",
        embedUrl: "https://www.youtube.com/embed/fRkgQeg8j0I",
        creditText: "Grazie al canale per il bellissimo video.",
        creditLabel: "@GeorgeNito",
        creditHref: "https://www.youtube.com/@GeorgeNito",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Avlonia+Beach,+Chios&output=embed",
        distance: "~32 km",
        time: "~45-50 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Avlonia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Avlonia si combina perfettamente con un’escursione nei villaggi del mastice. Da Voulamandis House a Kambos sei in una posizione ideale per villaggi medievali e spiagge nascoste del sud.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora i tesori nascosti dell’isola.",
  },
  {
    slug: "playa-avlonia",
    seo: {
      canonicalPath: "/es/playas-chios/playa-avlonia/",
      title: "Playa de Avlonia Chios | Joya escondida del sur de Chios",
      description:
        "Descubre la playa de Avlonia en el sur de Chios, una bahía aislada cerca de Pyrgi con aguas turquesas, belleza salvaje, pequeños guijarros y fondo marino ideal para snorkel.",
      ogImage:
        "/images/beaches/avlonia-1024x768.webp",
    },
    hero: {
      kicker: "Sur de Chios • Avlonia de Pyrgi",
      title: "Playa de Avlonia: la joya escondida del sur",
      description:
        "Una bahía mágica y aislada en el sur de Chios, con belleza salvaje, aguas turquesas cristalinas y un fondo marino impresionante para explorar.",
      image:
        "/images/beaches/avlonia-1024x768.webp",
      tags: ["#sur_de_chios", "#avlonia", "#playa_escondida", "#snorkel"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada en el sur de Chios, a unos 9 km del pueblo medieval de Pyrgi. Un sendero de unos 700 metros conduce a la bahía y añade un toque de aventura.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "Conocida localmente como Pyrgousiki Avlonia, tiene pequeños guijarros y arena gruesa. Sus aguas limpias y su fondo marino son ideales para hacer snorkel.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "La playa no está organizada. Lleva sombrilla, bastante agua y algo de comida. Merece la pena quedarse hasta tarde para disfrutar del atardecer.",
      },
    ],
    media: {
      video: {
        title: "La belleza salvaje de Avlonia",
        embedUrl: "https://www.youtube.com/embed/fRkgQeg8j0I",
        creditText: "Gracias al canal por este maravilloso vídeo.",
        creditLabel: "@GeorgeNito",
        creditHref: "https://www.youtube.com/@GeorgeNito",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Avlonia+Beach,+Chios&output=embed",
        distance: "~32 km",
        time: "~45-50 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Avlonia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Avlonia combina perfectamente con una visita a los pueblos del mastiha. Desde Voulamandis House en Kambos estás bien situado para pueblos medievales y playas escondidas del sur.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora los tesoros escondidos de la isla.",
  },
  {
    slug: "avlonia-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/avlonia-plaji/",
      title: "Avlonia Plajı Sakız Adası | Güney Sakız’ın gizli güzelliği",
      description:
        "Sakız Adası’nın güneyindeki Avlonia Plajı’nı keşfedin: Pyrgi yakınında turkuaz suları, vahşi güzelliği, küçük çakılları ve şnorkel için ideal deniz tabanıyla izole bir koy.",
      ogImage:
        "/images/beaches/avlonia-1024x768.webp",
    },
    hero: {
      kicker: "Güney Sakız • Pyrgi Avlonia",
      title: "Avlonia Plajı: güneyin gizli hazinesi",
      description:
        "Sakız Adası’nın güneyinde, vahşi güzelliği, turkuaz kristal suları ve keşfedilmeyi bekleyen etkileyici deniz tabanıyla büyülü ve izole bir koy.",
      image:
        "/images/beaches/avlonia-1024x768.webp",
      tags: ["#guney_sakiz", "#avlonia", "#gizli_plaj", "#snorkel"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Sakız Adası’nın güneyinde, Orta Çağ köyü Pyrgi’ye yaklaşık 9 km uzaklıktadır. Koya ulaşan yaklaşık 700 metrelik patika, küçük bir macera hissi katar.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Yerel olarak Pyrgousiki Avlonia diye bilinir; küçük çakıllar ve iri kum bulunur. Berrak suları ve deniz tabanı şnorkel için idealdir.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Plaj organize değildir. Şemsiye, bol su ve atıştırmalık alın. Gün batımını görmek için geç saate kadar kalmaya değer.",
      },
    ],
    media: {
      video: {
        title: "Avlonia’nın vahşi güzelliği",
        embedUrl: "https://www.youtube.com/embed/fRkgQeg8j0I",
        creditText: "Bu güzel video için kanala teşekkürler.",
        creditLabel: "@GeorgeNito",
        creditHref: "https://www.youtube.com/@GeorgeNito",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Avlonia+Beach,+Chios&output=embed",
        distance: "~32 km",
        time: "~45-50 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Avlonia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text:
        "Avlonia, mastik köyleri gezisiyle mükemmel şekilde birleşir. Kambos’taki Voulamandis House’tan Orta Çağ köylerine ve gizli güney plajlarına kolayca ulaşabilirsiniz.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak adanın gizli hazinelerini keşfedin.",
  },

/* =========================
   SALAGONA BEACH
========================= */

  {
    slug: "paralia-salagona",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-salagona/",
      title: "Παραλία Σαλάγωνα Χίος | Κρυμμένος τιρκουάζ θησαυρός",
      description:
        "Ανακαλύψτε την παραλία Σαλάγωνα στη νοτιοδυτική Χίο, έναν ήσυχο κόλπο κοντά στα μεσαιωνικά χωριά με τιρκουάζ νερά, ψιλό βότσαλο και εξαιρετικό βυθό για snorkeling.",
      ogImage:
        "/images/beaches/salagona-beach-chios.webp",
    },
    hero: {
      kicker: "Νοτιοδυτική Χίος • Ήσυχη παραλία",
      title: "Παραλία Σαλάγωνα: ο κρυμμένος τιρκουάζ θησαυρός",
      description:
        "Αποφύγετε την πολυκοσμία σε αυτόν τον μαγικό νοτιοδυτικό κόλπο με πεντακάθαρα τιρκουάζ νερά και ψιλό βότσαλο, ιδανικό για χαλάρωση και εξερεύνηση του βυθού.",
      image:
        "/images/beaches/salagona-beach-chios.webp",
      tags: ["#νοτιοδυτική_χίος", "#ήσυχη_παραλία", "#ψιλό_βότσαλο", "#snorkeling"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται στη νοτιοδυτική Χίο, κοντά στα μεσαιωνικά χωριά. Συνδυάστε το μπάνιο σας με επίσκεψη στα Μεστά, στους Ολύμπους ή στο εντυπωσιακό Σπήλαιο των Ολύμπων.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Ήσυχη και σχετικά απομονωμένη παραλία με χοντρή άμμο και ψιλό βότσαλο. Τα νερά είναι πεντακάθαρα, με όμορφες μπλε και πράσινες αποχρώσεις.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Είναι ιδανική για snorkeling. Πάρτε ομπρέλα, νερό και κάτι για φαγητό, γιατί συχνά δεν είναι οργανωμένη.",
      },
    ],
    media: {
      video: {
        title: "Μια γεύση από τη Σαλάγωνα",
        embedUrl: "https://www.youtube.com/embed/QqdqKW1X_oo",
        creditText: "Ευχαριστούμε για το όμορφο υλικό.",
        creditLabel: "@loukasvasalos",
        creditHref: "https://www.youtube.com/@loukasvasalos",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Salagona+Beach,+Chios&t=m&z=11&output=embed",
        distance: "~32 χλμ.",
        time: "~40-45 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Salagona+Beach,+Chios",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Η Σαλάγωνα είναι εύκολα προσβάσιμη με αυτοκίνητο. Κάντε το Voulamandis House στον ιστορικό Κάμπο τη βάση σας για να εξερευνήσετε νότιες και δυτικές παραλίες με τοπικές συμβουλές.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τους κρυμμένους θησαυρούς του νησιού.",
  },
  {
    slug: "plage-salagona",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-salagona/",
      title: "Plage de Salagona à Chios | Trésor turquoise caché",
      description:
        "Découvrez la plage de Salagona au sud-ouest de Chios, une baie tranquille près des villages médiévaux avec des eaux turquoise, de fins galets et un excellent fond marin pour le snorkeling.",
      ogImage:
        "/images/beaches/salagona-beach-chios.webp",
    },
    hero: {
      kicker: "Sud-ouest de Chios • Plage tranquille",
      title: "Plage de Salagona : le trésor turquoise caché",
      description:
        "Évitez la foule dans cette baie magique du sud-ouest, aux eaux turquoise cristallines et aux fins galets, idéale pour la détente et l’exploration du fond marin.",
      image:
        "/images/beaches/salagona-beach-chios.webp",
      tags: ["#sud_ouest_chios", "#plage_tranquille", "#galets_fins", "#snorkeling"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située au sud-ouest de Chios, près des villages médiévaux. Combinez votre baignade avec Mesta, Olympoi ou l’impressionnante grotte d’Olympoi.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "Une plage calme et relativement isolée avec du sable grossier et de fins galets. Les eaux sont impeccables, avec de belles nuances de bleu et de vert.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Parfaite pour le snorkeling. Apportez un parasol, de l’eau et des snacks, car elle est souvent non organisée.",
      },
    ],
    media: {
      video: {
        title: "Un aperçu de Salagona",
        embedUrl: "https://www.youtube.com/embed/QqdqKW1X_oo",
        creditText: "Merci pour ces belles images.",
        creditLabel: "@loukasvasalos",
        creditHref: "https://www.youtube.com/@loukasvasalos",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Salagona+Beach,+Chios&t=m&z=11&output=embed",
        distance: "~32 km",
        time: "~40-45 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Salagona+Beach,+Chios",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text:
        "Salagona est facilement accessible en voiture. Faites de Voulamandis House à Kambos votre base pour explorer les plages du sud et de l’ouest de Chios avec des conseils locaux.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les trésors cachés de l’île.",
  },
  {
    slug: "salagona-strand",
    seo: {
      canonicalPath: "/de/straende-chios/salagona-strand/",
      title: "Salagona Strand Chios | Versteckter türkisfarbener Schatz",
      description:
        "Entdecken Sie den Salagona Strand im Südwesten von Chios, eine ruhige Bucht nahe den mittelalterlichen Dörfern mit türkisfarbenem Wasser, feinen Kieseln und idealem Meeresboden zum Schnorcheln.",
      ogImage:
        "/images/beaches/salagona-beach-chios.webp",
    },
    hero: {
      kicker: "Südwest-Chios • Ruhiger Strand",
      title: "Salagona Strand: der versteckte türkisfarbene Schatz",
      description:
        "Meiden Sie die Menschenmassen in dieser magischen südwestlichen Bucht mit kristallklarem türkisfarbenem Wasser und feinen Kieseln, ideal zum Entspannen und Schnorcheln.",
      image:
        "/images/beaches/salagona-beach-chios.webp",
      tags: ["#suedwest_chios", "#ruhiger_strand", "#feine_kiesel", "#schnorcheln"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Der Strand liegt im Südwesten von Chios, nahe den mittelalterlichen Dörfern. Kombinieren Sie den Badetag mit Mesta, Olympoi oder der beeindruckenden Höhle von Olympoi.",
      },
      {
        icon: "🌊",
        title: "Merkmale",
        text:
          "Ein ruhiger, relativ abgelegener Strand mit grobem Sand und feinen Kieseln. Das Wasser ist makellos und zeigt schöne Blau- und Grüntöne.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Perfekt zum Schnorcheln. Bringen Sie Sonnenschirm, Wasser und Snacks mit, da der Strand oft nicht organisiert ist.",
      },
    ],
    media: {
      video: {
        title: "Ein Eindruck von Salagona",
        embedUrl: "https://www.youtube.com/embed/QqdqKW1X_oo",
        creditText: "Vielen Dank für das schöne Filmmaterial.",
        creditLabel: "@loukasvasalos",
        creditHref: "https://www.youtube.com/@loukasvasalos",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Salagona+Beach,+Chios&t=m&z=11&output=embed",
        distance: "~32 km",
        time: "~40-45 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Salagona+Beach,+Chios",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Salagona ist mit dem Auto gut erreichbar. Nutzen Sie Voulamandis House im historischen Kambos als Basis, um südliche und westliche Strände mit lokalen Tipps zu erkunden.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die versteckten Schätze der Insel.",
  },
  {
    slug: "spiaggia-salagona",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-salagona/",
      title: "Spiaggia di Salagona Chios | Tesoro turchese nascosto",
      description:
        "Scopri la spiaggia di Salagona nel sud-ovest di Chios, una baia tranquilla vicino ai villaggi medievali con acque turchesi, piccoli ciottoli e fondale ideale per lo snorkeling.",
      ogImage:
        "/images/beaches/salagona-beach-chios.webp",
    },
    hero: {
      kicker: "Sud-ovest di Chios • Spiaggia tranquilla",
      title: "Spiaggia di Salagona: il tesoro turchese nascosto",
      description:
        "Evita la folla in questa magica baia sud-occidentale con acque turchesi cristalline e piccoli ciottoli, ideale per il relax e l’esplorazione del fondale.",
      image:
        "/images/beaches/salagona-beach-chios.webp",
      tags: ["#sud_ovest_chios", "#spiaggia_tranquilla", "#piccoli_ciottoli", "#snorkeling"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova nel sud-ovest di Chios, vicino ai villaggi medievali. Abbina il bagno a una visita a Mesta, Olympoi o alla spettacolare Grotta di Olympoi.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "Una spiaggia tranquilla e relativamente isolata con sabbia grossa e piccoli ciottoli. Le acque sono limpide, con splendide tonalità di blu e verde.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Perfetta per lo snorkeling. Porta ombrellone, acqua e snack, perché spesso non è organizzata.",
      },
    ],
    media: {
      video: {
        title: "Un assaggio di Salagona",
        embedUrl: "https://www.youtube.com/embed/QqdqKW1X_oo",
        creditText: "Grazie per le splendide immagini.",
        creditLabel: "@loukasvasalos",
        creditHref: "https://www.youtube.com/@loukasvasalos",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Salagona+Beach,+Chios&t=m&z=11&output=embed",
        distance: "~32 km",
        time: "~40-45 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Salagona+Beach,+Chios",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Salagona è facilmente raggiungibile in auto. Scegli Voulamandis House nello storico Kambos come base per esplorare le spiagge meridionali e occidentali di Chios con consigli locali.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora i tesori nascosti dell’isola.",
  },
  {
    slug: "playa-salagona",
    seo: {
      canonicalPath: "/es/playas-chios/playa-salagona/",
      title: "Playa de Salagona Chios | Tesoro turquesa escondido",
      description:
        "Descubre la playa de Salagona en el suroeste de Chios, una bahía tranquila cerca de los pueblos medievales con aguas turquesas, guijarros finos y excelente fondo marino para snorkel.",
      ogImage:
        "/images/beaches/salagona-beach-chios.webp",
    },
    hero: {
      kicker: "Suroeste de Chios • Playa tranquila",
      title: "Playa de Salagona: el tesoro turquesa escondido",
      description:
        "Evita las multitudes en esta mágica bahía del suroeste con aguas turquesas cristalinas y guijarros finos, ideal para relajarse y explorar el fondo marino.",
      image:
        "/images/beaches/salagona-beach-chios.webp",
      tags: ["#suroeste_de_chios", "#playa_tranquila", "#guijarros_finos", "#snorkel"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada en el suroeste de Chios, cerca de los pueblos medievales. Combina el baño con Mesta, Olympoi o la impresionante Cueva de Olympoi.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "Una playa tranquila y relativamente aislada con arena gruesa y guijarros finos. Sus aguas son limpias, con preciosos tonos azules y verdes.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Perfecta para hacer snorkel. Lleva sombrilla, agua y algo de comida, ya que a menudo no está organizada.",
      },
    ],
    media: {
      video: {
        title: "Un vistazo a Salagona",
        embedUrl: "https://www.youtube.com/embed/QqdqKW1X_oo",
        creditText: "Gracias por las bonitas imágenes.",
        creditLabel: "@loukasvasalos",
        creditHref: "https://www.youtube.com/@loukasvasalos",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Salagona+Beach,+Chios&t=m&z=11&output=embed",
        distance: "~32 km",
        time: "~40-45 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Salagona+Beach,+Chios",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Salagona es fácilmente accesible en coche. Haz de Voulamandis House, en el histórico Kambos, tu base para explorar las playas del sur y oeste de Chios con consejos locales.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora los tesoros escondidos de la isla.",
  },
  {
    slug: "salagona-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/salagona-plaji/",
      title: "Salagona Plajı Sakız Adası | Gizli turkuaz hazine",
      description:
        "Sakız Adası’nın güneybatısındaki Salagona Plajı’nı keşfedin: Orta Çağ köyleri yakınında turkuaz suları, ince çakılları ve şnorkel için harika deniz tabanıyla sakin bir koy.",
      ogImage:
        "/images/beaches/salagona-beach-chios.webp",
    },
    hero: {
      kicker: "Güneybatı Sakız • Sakin plaj",
      title: "Salagona Plajı: gizli turkuaz hazine",
      description:
        "Kalabalıktan uzak, kristal turkuaz suları ve ince çakıllarıyla dinlenmek ve deniz tabanını keşfetmek için ideal büyülü bir güneybatı koyu.",
      image:
        "/images/beaches/salagona-beach-chios.webp",
      tags: ["#guneybati_sakiz", "#sakin_plaj", "#ince_cakil", "#snorkel"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Sakız Adası’nın güneybatısında, Orta Çağ köylerine yakın konumdadır. Yüzmeyi Mesta, Olympoi veya etkileyici Olympoi Mağarası ziyaretiyle birleştirin.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "İri kum ve ince çakıllara sahip sakin, nispeten izole bir plajdır. Suları tertemizdir ve mavi-yeşil tonlarıyla dikkat çeker.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Şnorkel için mükemmeldir. Genellikle organize olmadığı için şemsiye, su ve atıştırmalık getirin.",
      },
    ],
    media: {
      video: {
        title: "Salagona’dan bir görüntü",
        embedUrl: "https://www.youtube.com/embed/QqdqKW1X_oo",
        creditText: "Güzel görüntüler için teşekkürler.",
        creditLabel: "@loukasvasalos",
        creditHref: "https://www.youtube.com/@loukasvasalos",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Salagona+Beach,+Chios&t=m&z=11&output=embed",
        distance: "~32 km",
        time: "~40-45 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Salagona+Beach,+Chios",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text:
        "Salagona’ya arabayla kolayca ulaşılır. Güney ve batı plajlarını yerel önerilerle keşfetmek için tarihi Kambos’taki Voulamandis House’u üssünüz yapın.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak adanın gizli hazinelerini keşfedin.",
  },

/* =========================
   AGIA FOTIA BEACH
========================= */

  {
    slug: "paralia-agia-fotia",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-agia-fotia/",
      title: "Παραλία Αγία Φωτιά Χίος | Κοσμοπολίτικη οργανωμένη παραλία",
      description:
        "Ανακαλύψτε την Αγία Φωτιά στη Χίο, μια ζωντανή οργανωμένη παραλία με βότσαλο κοντά στον Κάμπο, κρυστάλλινα νερά, ταβέρνες, καφέ και θέα προς τα μικρασιατικά παράλια.",
      ogImage: "/images/beaches/agia-fotia-beach-chios.webp",
    },
    hero: {
      kicker: "Ανατολική Χίος • Κοσμοπολίτικη παραλία",
      title: "Παραλία Αγία Φωτιά: η κοσμοπολίτικη επιλογή της Χίου",
      description:
        "Μία από τις πιο όμορφες και ζωντανές παραλίες της Χίου, με κρυστάλλινα νερά, βοτσαλωτό βυθό και μαγική θέα προς τα μικρασιατικά παράλια.",
      image: "/images/beaches/agia-fotia-beach-chios.webp",
      tags: ["#αγία_φωτιά", "#νεανική", "#κοσμοπολίτικη", "#οργανωμένη"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται μόλις 11 χλμ. από την πόλη της Χίου. Ο παραθαλάσσιος οικισμός, που πήρε το όνομά του από το ομώνυμο εκκλησάκι, προσφέρει υπέροχη θέα προς τα μικρασιατικά παράλια.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Κοσμοπολίτικη και πλήρως οργανωμένη παραλία με βότσαλο και πεντακάθαρα δροσερά νερά. Καφέ, ταβέρνες, εστιατόρια και μίνι μάρκετ βρίσκονται δίπλα στη θάλασσα.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Αγαπημένο στέκι της νεολαίας του νησιού. Ιδανική αν θέλετε ζωντάνια, καλό φαγητό και διασκέδαση δίπλα στη θάλασσα από το πρωί μέχρι αργά.",
      },
    ],
    media: {
      video: {
        title: "Η ζωντάνια της Αγίας Φωτιάς",
        embedUrl: "https://www.youtube.com/embed/9KK20t1-p48",
        creditText: "Ευχαριστούμε το κανάλι για το όμορφο βίντεο.",
        creditLabel: "@FotisDeligiannis",
        creditHref: "https://www.youtube.com/@FotisDeligiannis",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?f=d&source=s_d&saddr=Voulamandis+House,+Chios&daddr=Agia+Fotia+Beach,+Chios&hl=en&output=embed",
        distance: "~10 χλμ.",
        time: "~15-20 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Fotia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Η Αγία Φωτιά απέχει μόλις 15-20 λεπτά από τον Κάμπο. Κάντε το Voulamandis House τη βάση σας, απολαύστε την ηρεμία των περιβολιών και επισκεφθείτε εύκολα τις κοσμοπολίτικες παραλίες του νησιού.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τους κρυμμένους θησαυρούς του νησιού.",
  },
  {
    slug: "plage-agia-fotia",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-agia-fotia/",
      title: "Plage Agia Fotia à Chios | Plage organisée et cosmopolite",
      description:
        "Découvrez Agia Fotia à Chios, une plage de galets animée et organisée près de Kambos, avec eaux cristallines, tavernes, cafés et vue vers l’Asie Mineure.",
      ogImage: "/images/beaches/agia-fotia-beach-chios.webp",
    },
    hero: {
      kicker: "Est de Chios • Plage cosmopolite",
      title: "Plage Agia Fotia : le choix cosmopolite de Chios",
      description:
        "L’une des plages les plus belles et animées de Chios, avec des eaux cristallines, un fond de galets et une vue magique vers la côte d’Asie Mineure.",
      image: "/images/beaches/agia-fotia-beach-chios.webp",
      tags: ["#agia_fotia", "#jeune", "#cosmopolite", "#organisee"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située à seulement 11 km de la ville de Chios. Le village balnéaire, nommé d’après la petite église du même nom, offre une belle vue vers la côte d’Asie Mineure.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "Plage de galets cosmopolite et entièrement organisée avec des eaux fraîches et limpides. Cafés, tavernes, restaurants et mini-marché se trouvent juste au bord de la mer.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Un lieu très apprécié des jeunes de l’île. Idéal si vous cherchez de l’animation, de la bonne cuisine et une ambiance balnéaire du matin jusqu’au soir.",
      },
    ],
    media: {
      video: {
        title: "L’ambiance d’Agia Fotia",
        embedUrl: "https://www.youtube.com/embed/9KK20t1-p48",
        creditText: "Merci à la chaîne pour cette belle vidéo.",
        creditLabel: "@FotisDeligiannis",
        creditHref: "https://www.youtube.com/@FotisDeligiannis",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?f=d&source=s_d&saddr=Voulamandis+House,+Chios&daddr=Agia+Fotia+Beach,+Chios&hl=en&output=embed",
        distance: "~10 km",
        time: "~15-20 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Fotia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text:
        "Agia Fotia se trouve à seulement 15-20 minutes de Kambos. Faites de Voulamandis House votre base, profitez du calme des vergers et rejoignez facilement les plages cosmopolites de l’île.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les trésors cachés de l’île.",
  },
  {
    slug: "agia-fotia-strand",
    seo: {
      canonicalPath: "/de/straende-chios/agia-fotia-strand/",
      title: "Agia Fotia Strand Chios | Kosmopolitischer organisierter Strand",
      description:
        "Entdecken Sie Agia Fotia auf Chios, einen lebhaften organisierten Kiesstrand nahe Kambos mit kristallklarem Wasser, Tavernen, Cafés und Blick Richtung Kleinasien.",
      ogImage: "/images/beaches/agia-fotia-beach-chios.webp",
    },
    hero: {
      kicker: "Ost-Chios • Kosmopolitischer Strand",
      title: "Agia Fotia Strand: die kosmopolitische Wahl auf Chios",
      description:
        "Einer der schönsten und lebendigsten Strände von Chios, mit kristallklarem Wasser, Kieselgrund und magischem Blick auf die kleinasiatische Küste.",
      image: "/images/beaches/agia-fotia-beach-chios.webp",
      tags: ["#agia_fotia", "#jung", "#kosmopolitisch", "#organisiert"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Nur 11 km von Chios-Stadt entfernt. Die kleine Küstensiedlung, benannt nach der gleichnamigen Kirche, bietet einen schönen Blick Richtung Kleinasien.",
      },
      {
        icon: "🌊",
        title: "Merkmale",
        text:
          "Ein kosmopolitischer, vollständig organisierter Kiesstrand mit sauberem, kühlem Wasser. Cafés, Tavernen, Restaurants und ein Mini-Markt liegen direkt am Meer.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Ein beliebter Treffpunkt der Jugend der Insel. Ideal, wenn Sie Lebendigkeit, gutes Essen und Strandatmosphäre vom Morgen bis spät am Abend suchen.",
      },
    ],
    media: {
      video: {
        title: "Die Lebendigkeit von Agia Fotia",
        embedUrl: "https://www.youtube.com/embed/9KK20t1-p48",
        creditText: "Vielen Dank an den Kanal für das schöne Video.",
        creditLabel: "@FotisDeligiannis",
        creditHref: "https://www.youtube.com/@FotisDeligiannis",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?f=d&source=s_d&saddr=Voulamandis+House,+Chios&daddr=Agia+Fotia+Beach,+Chios&hl=en&output=embed",
        distance: "~10 km",
        time: "~15-20 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Fotia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Agia Fotia liegt nur 15-20 Minuten von Kambos entfernt. Nutzen Sie Voulamandis House als Basis, genießen Sie die Ruhe der Obstgärten und erreichen Sie leicht die kosmopolitischen Strände der Insel.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die versteckten Schätze der Insel.",
  },
  {
    slug: "spiaggia-agia-fotia",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-agia-fotia/",
      title: "Spiaggia Agia Fotia Chios | Spiaggia organizzata e cosmopolita",
      description:
        "Scopri Agia Fotia a Chios, una vivace spiaggia di ciottoli organizzata vicino a Kambos con acque cristalline, taverne, caffè e vista verso l’Asia Minore.",
      ogImage: "/images/beaches/agia-fotia-beach-chios.webp",
    },
    hero: {
      kicker: "Chios orientale • Spiaggia cosmopolita",
      title: "Spiaggia Agia Fotia: la scelta cosmopolita di Chios",
      description:
        "Una delle spiagge più belle e vivaci di Chios, con acque cristalline, fondale di ciottoli e una vista magica verso la costa dell’Asia Minore.",
      image: "/images/beaches/agia-fotia-beach-chios.webp",
      tags: ["#agia_fotia", "#giovane", "#cosmopolita", "#organizzata"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova a soli 11 km dalla città di Chios. Il piccolo insediamento sul mare, chiamato come l’omonima chiesa, offre una splendida vista verso la costa dell’Asia Minore.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "Spiaggia di ciottoli cosmopolita e completamente organizzata con acque fresche e pulitissime. Caffè, taverne, ristoranti e mini-market si trovano proprio sul mare.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Ritrovo preferito dei giovani dell’isola. Ideale se cerchi vivacità, buon cibo e divertimento sul mare dalla mattina fino a tardi.",
      },
    ],
    media: {
      video: {
        title: "La vivacità di Agia Fotia",
        embedUrl: "https://www.youtube.com/embed/9KK20t1-p48",
        creditText: "Grazie al canale per il bellissimo video.",
        creditLabel: "@FotisDeligiannis",
        creditHref: "https://www.youtube.com/@FotisDeligiannis",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?f=d&source=s_d&saddr=Voulamandis+House,+Chios&daddr=Agia+Fotia+Beach,+Chios&hl=en&output=embed",
        distance: "~10 km",
        time: "~15-20 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Fotia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Agia Fotia dista solo 15-20 minuti da Kambos. Scegli Voulamandis House come base, goditi la tranquillità degli agrumeti e raggiungi facilmente le spiagge più vivaci dell’isola.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora i tesori nascosti dell’isola.",
  },
  {
    slug: "playa-agia-fotia",
    seo: {
      canonicalPath: "/es/playas-chios/playa-agia-fotia/",
      title: "Playa Agia Fotia Chios | Playa organizada y cosmopolita",
      description:
        "Descubre Agia Fotia en Chios, una animada playa organizada de guijarros cerca de Kambos con aguas cristalinas, tabernas, cafés y vistas hacia Asia Menor.",
      ogImage: "/images/beaches/agia-fotia-beach-chios.webp",
    },
    hero: {
      kicker: "Este de Chios • Playa cosmopolita",
      title: "Playa Agia Fotia: la opción cosmopolita de Chios",
      description:
        "Una de las playas más bonitas y animadas de Chios, con aguas cristalinas, fondo de guijarros y una vista mágica hacia la costa de Asia Menor.",
      image: "/images/beaches/agia-fotia-beach-chios.webp",
      tags: ["#agia_fotia", "#joven", "#cosmopolita", "#organizada"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada a solo 11 km de la ciudad de Chios. El asentamiento costero, llamado así por la iglesia homónima, ofrece una hermosa vista hacia la costa de Asia Menor.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "Playa de guijarros cosmopolita y totalmente organizada con aguas frescas y limpias. Cafés, tabernas, restaurantes y un mini-mercado se encuentran junto al mar.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Un punto de encuentro favorito para los jóvenes de la isla. Ideal si buscas ambiente, buena comida y diversión junto al mar desde la mañana hasta tarde.",
      },
    ],
    media: {
      video: {
        title: "El ambiente de Agia Fotia",
        embedUrl: "https://www.youtube.com/embed/9KK20t1-p48",
        creditText: "Gracias al canal por este bonito vídeo.",
        creditLabel: "@FotisDeligiannis",
        creditHref: "https://www.youtube.com/@FotisDeligiannis",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?f=d&source=s_d&saddr=Voulamandis+House,+Chios&daddr=Agia+Fotia+Beach,+Chios&hl=en&output=embed",
        distance: "~10 km",
        time: "~15-20 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Fotia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Agia Fotia está a solo 15-20 minutos de Kambos. Haz de Voulamandis House tu base, disfruta de la tranquilidad de los huertos y visita fácilmente las playas cosmopolitas de la isla.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora los tesoros escondidos de la isla.",
  },
  {
    slug: "agia-fotia-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/agia-fotia-plaji/",
      title: "Agia Fotia Plajı Sakız Adası | Kozmopolit organize plaj",
      description:
        "Sakız Adası’ndaki Agia Fotia Plajı’nı keşfedin: Kambos yakınında kristal suları, tavernaları, kafeleri ve Anadolu kıyılarına manzarasıyla canlı, organize bir çakıl plajı.",
      ogImage: "/images/beaches/agia-fotia-beach-chios.webp",
    },
    hero: {
      kicker: "Doğu Sakız • Kozmopolit plaj",
      title: "Agia Fotia Plajı: Sakız’ın kozmopolit seçimi",
      description:
        "Sakız Adası’nın en güzel ve canlı plajlarından biri; kristal suları, çakıllı deniz tabanı ve Anadolu kıyılarına doğru büyüleyici manzarasıyla öne çıkar.",
      image: "/images/beaches/agia-fotia-beach-chios.webp",
      tags: ["#agia_fotia", "#genç", "#kozmopolit", "#organize"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Sakız şehir merkezine sadece 11 km uzaklıktadır. Aynı isimli küçük kiliseden adını alan sahil yerleşimi, Anadolu kıyılarına güzel bir manzara sunar.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Tertemiz serin sulara sahip, kozmopolit ve tamamen organize bir çakıl plajıdır. Kafeler, tavernalar, restoranlar ve mini market denizin hemen yanındadır.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Adanın gençleri için sevilen bir buluşma noktasıdır. Sabah saatlerinden geceye kadar canlılık, iyi yemek ve deniz kenarında eğlence arayanlar için idealdir.",
      },
    ],
    media: {
      video: {
        title: "Agia Fotia’nın canlılığı",
        embedUrl: "https://www.youtube.com/embed/9KK20t1-p48",
        creditText: "Bu güzel video için kanala teşekkürler.",
        creditLabel: "@FotisDeligiannis",
        creditHref: "https://www.youtube.com/@FotisDeligiannis",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?f=d&source=s_d&saddr=Voulamandis+House,+Chios&daddr=Agia+Fotia+Beach,+Chios&hl=en&output=embed",
        distance: "~10 km",
        time: "~15-20 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Agia+Fotia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text:
        "Agia Fotia, Kambos’tan sadece 15-20 dakika uzaklıktadır. Voulamandis House’u üssünüz yapın, bahçelerin huzurunun tadını çıkarın ve adanın kozmopolit plajlarına kolayca ulaşın.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak adanın gizli hazinelerini keşfedin.",
  },

/* =========================
   KOMI BEACH
========================= */

  {
    slug: "paralia-komi",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-komi/",
      title: "Παραλία Κώμη Χίος | Ατελείωτη χρυσή άμμος & οργανωμένη ζωή",
      description:
        "Ανακαλύψτε την παραλία Κώμη στη νοτιοανατολική Χίο, μία από τις πιο δημοφιλείς οργανωμένες αμμώδεις παραλίες του νησιού με ρηχά νερά, εστιατόρια, καφέ-μπαρ και δραστηριότητες.",
      ogImage:
        "/images/beaches/komi-sandy-beach-chios.webp",
    },
    hero: {
      kicker: "Νοτιοανατολική Χίος • Χρυσή άμμος",
      title: "Παραλία Κώμη: η ατελείωτη χρυσή άμμος",
      description:
        "Μία από τις πιο δημοφιλείς και πλήρως οργανωμένες παραλίες της Χίου, με ατελείωτη άμμο, ρηχά κρυστάλλινα νερά και εξαιρετικές επιλογές για φαγητό και διασκέδαση δίπλα στο κύμα.",
      image:
        "/images/beaches/komi-sandy-beach-chios.webp",
      tags: ["#νοτιοανατολική_χίος", "#χρυσή_άμμος", "#οργανωμένη", "#οικογενειακή"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται στη νοτιοανατολική Χίο, μόλις 6 χλμ. από το παραδοσιακό μαστιχοχώρι Καλαμωτή. Η πρόσβαση είναι άνετη και εύκολη.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Μεγάλη αμμώδης ακτή που συγκαταλέγεται στις πιο όμορφες της Ελλάδας. Είναι πλήρως οργανωμένη με ομπρέλες, ξαπλώστρες, ποδήλατα θαλάσσης και θαλάσσια παιχνίδια.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Περπατήστε στον κεντρικό πεζόδρομο για να βρείτε εστιατόρια με φρέσκο ψάρι, τοπικούς μεζέδες και όμορφα καφέ-μπαρ.",
      },
    ],
    media: {
      video: {
        title: "Βόλτα στην παραλία Κώμη",
        embedUrl: "https://www.youtube.com/embed/lxiDYYNJLto",
        creditText: "Ευχαριστούμε για το όμορφο υλικό.",
        creditLabel: "@Travellingchannel16",
        creditHref: "https://www.youtube.com/@Travellingchannel16",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Komi,+Chios&output=embed",
        distance: "~24 χλμ.",
        time: "~30 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Dimarchou+Kalvokoresi+117,+Chios/Komi,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Το στρατηγικό σας σημείο εκκίνησης",
      text:
        "Η κοσμοπολίτικη Κώμη απέχει ιδανικά από τον Κάμπο, περίπου 30 λεπτά με αυτοκίνητο. Κάντε το Voulamandis House τη βάση σας και απολαύστε εύκολη πρόσβαση στις καλύτερες αμμώδεις παραλίες της νότιας Χίου.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τους κρυμμένους θησαυρούς του νησιού.",
  },
  {
    slug: "plage-komi",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-komi/",
      title: "Plage de Komi à Chios | Sable doré et vie de plage organisée",
      description:
        "Découvrez la plage de Komi au sud-est de Chios, l’une des plages de sable organisées les plus populaires de l’île avec eaux peu profondes, restaurants, cafés-bars et activités de plage.",
      ogImage:
        "/images/beaches/komi-sandy-beach-chios.webp",
    },
    hero: {
      kicker: "Sud-est de Chios • Sable doré",
      title: "Plage de Komi : l’interminable sable doré",
      description:
        "L’une des plages les plus populaires et les mieux organisées de Chios, avec du sable à perte de vue, des eaux peu profondes et cristallines, et d’excellentes options pour manger et se divertir au bord des vagues.",
      image:
        "/images/beaches/komi-sandy-beach-chios.webp",
      tags: ["#sud_est_chios", "#sable_dore", "#organisee", "#famille"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située au sud-est de Chios, à seulement 6 km du village traditionnel de Kalamoti. Le trajet est facile et confortable.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "Une vaste plage de sable considérée parmi les plus belles de Grèce. Entièrement organisée avec parasols, transats, pédalos et jeux nautiques.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Promenez-vous le long de la rue piétonne principale pour trouver des restaurants de poisson frais, des spécialités locales et des cafés-bars élégants.",
      },
    ],
    media: {
      video: {
        title: "Promenade sur la plage de Komi",
        embedUrl: "https://www.youtube.com/embed/lxiDYYNJLto",
        creditText: "Merci pour ces belles images.",
        creditLabel: "@Travellingchannel16",
        creditHref: "https://www.youtube.com/@Travellingchannel16",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Komi,+Chios&output=embed",
        distance: "~24 km",
        time: "~30 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Dimarchou+Kalvokoresi+117,+Chios/Komi,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre point de départ stratégique",
      text:
        "La cosmopolite Komi est à une distance idéale de Kambos, à environ 30 minutes en voiture. Faites de Voulamandis House votre base pour accéder facilement aux plus belles plages de sable du sud de Chios.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les trésors cachés de l’île.",
  },
  {
    slug: "komi-strand",
    seo: {
      canonicalPath: "/de/straende-chios/komi-strand/",
      title: "Komi Strand Chios | Endloser goldener Sand und organisiertes Strandleben",
      description:
        "Entdecken Sie den Komi Strand im Südosten von Chios, einen der beliebtesten organisierten Sandstrände der Insel mit flachem Wasser, Restaurants, Café-Bars und Strandaktivitäten.",
      ogImage:
        "/images/beaches/komi-sandy-beach-chios.webp",
    },
    hero: {
      kicker: "Südost-Chios • Goldener Sand",
      title: "Komi Strand: der endlose goldene Sand",
      description:
        "Einer der beliebtesten und vollständig organisierten Strände von Chios, mit endlosem Sand, flachem kristallklarem Wasser und hervorragenden Möglichkeiten zum Essen und Entspannen am Meer.",
      image:
        "/images/beaches/komi-sandy-beach-chios.webp",
      tags: ["#suedost_chios", "#goldener_sand", "#organisiert", "#familienfreundlich"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Der Strand liegt im Südosten von Chios, nur 6 km vom traditionellen Mastixdorf Kalamoti entfernt. Die Fahrt ist bequem und einfach.",
      },
      {
        icon: "🌊",
        title: "Merkmale",
        text:
          "Ein weiter Sandstrand, der zu den schönsten Griechenlands zählt. Vollständig organisiert mit Sonnenschirmen, Liegen, Tretbooten und Wasserspielen.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Spazieren Sie entlang der gepflasterten Fußgängerstraße, um Restaurants mit frischem Fisch, lokalen Vorspeisen und stilvollen Café-Bars zu finden.",
      },
    ],
    media: {
      video: {
        title: "Ein Spaziergang am Komi Strand",
        embedUrl: "https://www.youtube.com/embed/lxiDYYNJLto",
        creditText: "Vielen Dank für das schöne Filmmaterial.",
        creditLabel: "@Travellingchannel16",
        creditHref: "https://www.youtube.com/@Travellingchannel16",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Komi,+Chios&output=embed",
        distance: "~24 km",
        time: "~30 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Dimarchou+Kalvokoresi+117,+Chios/Komi,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihr strategischer Ausgangspunkt",
      text:
        "Das kosmopolitische Komi liegt ideal von Kambos entfernt, nur etwa 30 Minuten mit dem Auto. Nutzen Sie Voulamandis House als Basis für die besten Sandstrände im Süden von Chios.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die versteckten Schätze der Insel.",
  },
  {
    slug: "spiaggia-komi",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-komi/",
      title: "Spiaggia di Komi Chios | Sabbia dorata e vita da spiaggia organizzata",
      description:
        "Scopri la spiaggia di Komi nel sud-est di Chios, una delle spiagge sabbiose organizzate più popolari dell’isola, con acque basse, ristoranti, café-bar e attività sul mare.",
      ogImage:
        "/images/beaches/komi-sandy-beach-chios.webp",
    },
    hero: {
      kicker: "Sud-est di Chios • Sabbia dorata",
      title: "Spiaggia di Komi: l’infinita sabbia dorata",
      description:
        "Una delle spiagge più popolari e completamente organizzate di Chios, con sabbia infinita, acque basse e cristalline, e ottime opzioni per mangiare e divertirsi sul mare.",
      image:
        "/images/beaches/komi-sandy-beach-chios.webp",
      tags: ["#sud_est_chios", "#sabbia_dorata", "#organizzata", "#famiglie"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova nel sud-est di Chios, a soli 6 km dal tradizionale villaggio del mastice di Kalamoti. Il percorso è comodo e facile.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "Un’ampia spiaggia sabbiosa considerata tra le più belle della Grecia. Completamente organizzata con ombrelloni, lettini, pedalò e giochi acquatici.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Passeggia lungo la strada pedonale principale per trovare ristoranti con pesce fresco, specialità locali e café-bar eleganti.",
      },
    ],
    media: {
      video: {
        title: "Una passeggiata sulla spiaggia di Komi",
        embedUrl: "https://www.youtube.com/embed/lxiDYYNJLto",
        creditText: "Grazie per le splendide immagini.",
        creditLabel: "@Travellingchannel16",
        creditHref: "https://www.youtube.com/@Travellingchannel16",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Komi,+Chios&output=embed",
        distance: "~24 km",
        time: "~30 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Dimarchou+Kalvokoresi+117,+Chios/Komi,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "La cosmopolita Komi si trova a una distanza ideale da Kambos, circa 30 minuti in auto. Scegli Voulamandis House come base per accedere facilmente alle migliori spiagge sabbiose del sud di Chios.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora i tesori nascosti dell’isola.",
  },
  {
    slug: "playa-komi",
    seo: {
      canonicalPath: "/es/playas-chios/playa-komi/",
      title: "Playa de Komi Chios | Arena dorada y vida de playa organizada",
      description:
        "Descubre la playa de Komi en el sureste de Chios, una de las playas de arena organizadas más populares de la isla, con aguas poco profundas, restaurantes, cafés-bares y actividades.",
      ogImage:
        "/images/beaches/komi-sandy-beach-chios.webp",
    },
    hero: {
      kicker: "Sureste de Chios • Arena dorada",
      title: "Playa de Komi: la arena dorada interminable",
      description:
        "Una de las playas más populares y totalmente organizadas de Chios, con arena interminable, aguas poco profundas y cristalinas, y excelentes opciones para comer y divertirse junto al mar.",
      image:
        "/images/beaches/komi-sandy-beach-chios.webp",
      tags: ["#sureste_de_chios", "#arena_dorada", "#organizada", "#familias"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada en el sureste de Chios, a solo 6 km del tradicional pueblo del mastiha de Kalamoti. El trayecto es cómodo y fácil.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "Una extensa playa de arena considerada entre las más bonitas de Grecia. Totalmente organizada con sombrillas, tumbonas, hidropedales y juegos acuáticos.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Pasea por la calle peatonal principal para encontrar restaurantes con pescado fresco, aperitivos locales y cafés-bares con estilo.",
      },
    ],
    media: {
      video: {
        title: "Un paseo por la playa de Komi",
        embedUrl: "https://www.youtube.com/embed/lxiDYYNJLto",
        creditText: "Gracias por las bonitas imágenes.",
        creditLabel: "@Travellingchannel16",
        creditHref: "https://www.youtube.com/@Travellingchannel16",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Komi,+Chios&output=embed",
        distance: "~24 km",
        time: "~30 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Dimarchou+Kalvokoresi+117,+Chios/Komi,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu punto estratégico de partida",
      text:
        "La cosmopolita Komi está a una distancia ideal de Kambos, a unos 30 minutos en coche. Haz de Voulamandis House tu base y disfruta de fácil acceso a las mejores playas de arena del sur de Chios.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora los tesoros escondidos de la isla.",
  },
  {
    slug: "komi-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/komi-plaji/",
      title: "Komi Plajı Sakız Adası | Sonsuz altın kum ve organize plaj hayatı",
      description:
        "Sakız Adası’nın güneydoğusundaki Komi Plajı’nı keşfedin: sığ suları, restoranları, kafe-barları ve plaj aktiviteleriyle adanın en popüler organize kum plajlarından biri.",
      ogImage:
        "/images/beaches/komi-sandy-beach-chios.webp",
    },
    hero: {
      kicker: "Güneydoğu Sakız • Altın kum",
      title: "Komi Plajı: sonsuz altın kum",
      description:
        "Sakız Adası’nın en popüler ve tamamen organize plajlarından biri; sonsuz kumu, sığ kristal suları ve deniz kenarında yemek ve eğlence seçenekleriyle öne çıkar.",
      image:
        "/images/beaches/komi-sandy-beach-chios.webp",
      tags: ["#guneydogu_sakiz", "#altin_kum", "#organize", "#aile_dostu"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Sakız Adası’nın güneydoğusunda, geleneksel mastik köyü Kalamoti’ye sadece 6 km uzaklıktadır. Yol rahat ve kolaydır.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Yunanistan’ın en güzel plajları arasında sayılan geniş bir kum sahilidir. Şemsiyeler, şezlonglar, deniz bisikletleri ve su oyunlarıyla tamamen organizedir.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Taze balık, yerel mezeler ve şık kafe-barlar için ana yaya caddesinde yürüyüş yapın.",
      },
    ],
    media: {
      video: {
        title: "Komi plajında bir yürüyüş",
        embedUrl: "https://www.youtube.com/embed/lxiDYYNJLto",
        creditText: "Güzel görüntüler için teşekkürler.",
        creditLabel: "@Travellingchannel16",
        creditHref: "https://www.youtube.com/@Travellingchannel16",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Komi,+Chios&output=embed",
        distance: "~24 km",
        time: "~30 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Dimarchou+Kalvokoresi+117,+Chios/Komi,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik başlangıç noktanız",
      text:
        "Kozmopolit Komi, Kambos’tan ideal bir uzaklıktadır; arabayla yaklaşık 30 dakika. Güney Sakız’ın en iyi kum plajlarına kolay ulaşmak için Voulamandis House’u üssünüz yapın.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak adanın gizli hazinelerini keşfedin.",
  },

/* =========================
   EMPORIOS / MAVRA VOLIA BEACH
========================= */

  {
    slug: "paralia-mavra-volia-emporios",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-mavra-volia/",
      title: "Μαύρα Βόλια Εμπορειός Χίος | Το απόλυτο ηφαιστειακό τοπίο",
      description:
        "Εξερευνήστε την παραλία Μαύρα Βόλια στον Εμπορειό της νότιας Χίου, την εμβληματική ηφαιστειακή παραλία του νησιού με μαύρα βότσαλα, τρεις κόλπους, βαθιά δροσερά νερά και άγριους βράχους.",
      ogImage:
        "/images/beaches/mavra-volia-beach-chios.webp",
    },
    hero: {
      kicker: "Εμπορειός • Ηφαιστειακή παραλία",
      title: "Μαύρα Βόλια Εμπορειός: το απόλυτο ηφαιστειακό τοπίο",
      description:
        "Η πιο εμβληματική και εντυπωσιακή παραλία της Χίου: τρεις συνεχόμενοι κόλποι με βαθιά σκούρα νερά και μοναδικά μαύρα ηφαιστειακά βότσαλα.",
      image:
        "/images/beaches/mavra-volia-beach-chios.webp",
      tags: ["#μαύρα_βόλια", "#εμπορειός", "#ηφαιστειακή_παραλία", "#μαύρος_γιαλός"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Βρίσκεται στη νότια Χίο, μετά το μεσαιωνικό Πυργί, στον παραθαλάσσιο οικισμό του Εμπορειού. Στη διαδρομή αξίζει στάση στο Μουσείο Μαστίχας.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Η ιδιαίτερη ομορφιά της οφείλεται στην έκρηξη του αρχαίου ηφαιστείου Ψάρωνας. Άγριοι βράχοι αγκαλιάζουν τα μαύρα βότσαλα, δημιουργώντας βαθιά, σκούρα και δροσερά νερά.",
      },
      {
        icon: "💡",
        title: "Τοπική συμβουλή",
        text:
          "Η επίσκεψη στα Μαύρα Βόλια δεν ολοκληρώνεται χωρίς φαγητό. Στο γραφικό λιμανάκι του Εμπορειού θα βρείτε ψαροταβέρνες με φρέσκα θαλασσινά και τοπικές γεύσεις.",
      },
    ],
    media: {
      video: {
        title: "Η μαγεία του Μαύρου Γιαλού από ψηλά",
        embedUrl: "https://www.youtube.com/embed/uIeLfDCVcGs",
        creditText: "Ευχαριστούμε το κανάλι για το υπέροχο βίντεο.",
        creditLabel: "@flying-vp",
        creditHref: "https://www.youtube.com/@flying-vp",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Mavra+Volia,+Chios&t=m&z=11&output=embed",
        distance: "~25 χλμ.",
        time: "~35 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Mavra+Volia,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Ο Κάμπος είναι ιδανική αφετηρία για τις νότιες παραλίες και τα Μαστιχοχώρια. Κάντε το Voulamandis House τη βάση σας και απολαύστε άνεση, φιλοξενία και καθημερινές τοπικές συμβουλές.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν το νησί.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με αφετηρία το Voulamandis House, εξερευνήστε τους κρυμμένους θησαυρούς του νησιού.",
  },
  {
    slug: "plage-mavra-volia-emporios",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-mavra-volia/",
      title: "Plage Mavra Volia Emporios Chios | Paysage volcanique unique",
      description:
        "Explorez la plage de Mavra Volia à Emporios, au sud de Chios, la plage volcanique emblématique de l’île avec galets noirs, trois baies, eaux profondes et falaises sauvages.",
      ogImage:
        "/images/beaches/mavra-volia-beach-chios.webp",
    },
    hero: {
      kicker: "Emporios • Plage volcanique",
      title: "Mavra Volia Emporios : le paysage volcanique ultime",
      description:
        "La plage la plus emblématique et impressionnante de Chios : trois baies successives aux eaux profondes et sombres, avec de spectaculaires galets volcaniques noirs.",
      image:
        "/images/beaches/mavra-volia-beach-chios.webp",
      tags: ["#mavra_volia", "#emporios", "#plage_volcanique", "#mavros_gialos"],
    },
    details: [
      {
        icon: "📍",
        title: "Emplacement & accès",
        text:
          "Située au sud de Chios, après le village médiéval de Pyrgi, dans le village balnéaire d’Emporios. En route, le Musée du Mastic mérite vraiment un arrêt.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "Sa beauté inhabituelle provient de l’éruption de l’ancien volcan Psaronas. Les falaises sauvages entourent les galets noirs et créent des eaux profondes, sombres et fraîches.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Une visite à Mavra Volia n’est pas complète sans repas. Dans le port pittoresque d’Emporios, vous trouverez des tavernes de poisson avec fruits de mer frais et spécialités locales.",
      },
    ],
    media: {
      video: {
        title: "La magie de Mavros Gialos vue d’en haut",
        embedUrl: "https://www.youtube.com/embed/uIeLfDCVcGs",
        creditText: "Merci à la chaîne pour cette superbe vidéo.",
        creditLabel: "@flying-vp",
        creditHref: "https://www.youtube.com/@flying-vp",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Mavra+Volia,+Chios&t=m&z=11&output=embed",
        distance: "~25 km",
        time: "~35 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Mavra+Volia,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base stratégique",
      text:
        "Kambos est un point de départ idéal pour découvrir les plages du sud et les villages du mastic. Faites de Voulamandis House votre base et profitez du confort, de l’hospitalité et de conseils locaux quotidiens.",
      linkLabel: "Séjournez avec ceux qui connaissent le mieux l’île.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez plus de plages",
    relatedText:
      "Depuis Voulamandis House, explorez les trésors cachés de l’île.",
  },
  {
    slug: "mavra-volia-emporios-strand",
    seo: {
      canonicalPath: "/de/straende-chios/mavra-volia-strand/",
      title: "Mavra Volia Emporios Strand Chios | Einzigartige Vulkanlandschaft",
      description:
        "Entdecken Sie den Mavra Volia Strand bei Emporios im Süden von Chios, den ikonischen Vulkanstrand der Insel mit schwarzen Kieseln, drei Buchten, tiefem kühlem Wasser und wilden Klippen.",
      ogImage:
        "/images/beaches/mavra-volia-beach-chios.webp",
    },
    hero: {
      kicker: "Emporios • Vulkanstrand",
      title: "Mavra Volia Emporios: die ultimative Vulkanlandschaft",
      description:
        "Der ikonischste und beeindruckendste Strand von Chios: drei aufeinanderfolgende Buchten mit tiefem dunklem Wasser und atemberaubenden schwarzen Vulkansteinen.",
      image:
        "/images/beaches/mavra-volia-beach-chios.webp",
      tags: ["#mavra_volia", "#emporios", "#vulkanstrand", "#mavros_gialos"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Der Strand liegt im Süden von Chios, hinter dem mittelalterlichen Dorf Pyrgi, in der Küstensiedlung Emporios. Auf dem Weg dorthin lohnt sich ein Halt im Mastixmuseum.",
      },
      {
        icon: "🌊",
        title: "Merkmale",
        text:
          "Seine ungewöhnliche Schönheit stammt vom Ausbruch des antiken Vulkans Psaronas. Wilde Klippen umgeben die schwarzen Kiesel und schaffen tiefes, dunkles und kühles Wasser.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Ein Besuch in Mavra Volia ist ohne Essen nicht komplett. Im malerischen Hafen von Emporios finden Sie Fischtavernen mit frischen Meeresfrüchten und lokalen Spezialitäten.",
      },
    ],
    media: {
      video: {
        title: "Die Magie von Mavros Gialos von oben",
        embedUrl: "https://www.youtube.com/embed/uIeLfDCVcGs",
        creditText: "Vielen Dank an den Kanal für das wunderschöne Video.",
        creditLabel: "@flying-vp",
        creditHref: "https://www.youtube.com/@flying-vp",
      },
      map: {
        title: "Route ab Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Mavra+Volia,+Chios&t=m&z=11&output=embed",
        distance: "~25 km",
        time: "~35 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Mavra+Volia,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Kambos ist der ideale Ausgangspunkt, um die südlichen Strände und Mastixdörfer zu entdecken. Nutzen Sie Voulamandis House als Basis und genießen Sie Komfort, Gastfreundschaft und tägliche lokale Tipps.",
      linkLabel: "Übernachten Sie bei Menschen, die die Insel kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Starten Sie von Voulamandis House und entdecken Sie die versteckten Schätze der Insel.",
  },
  {
    slug: "spiaggia-mavra-volia-emporios",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-mavra-volia/",
      title: "Spiaggia Mavra Volia Emporios Chios | Paesaggio vulcanico unico",
      description:
        "Esplora la spiaggia Mavra Volia a Emporios, nel sud di Chios, l’iconica spiaggia vulcanica dell’isola con ciottoli neri, tre baie, acque profonde e fresche e scogliere selvagge.",
      ogImage:
        "/images/beaches/mavra-volia-beach-chios.webp",
    },
    hero: {
      kicker: "Emporios • Spiaggia vulcanica",
      title: "Mavra Volia Emporios: il paesaggio vulcanico definitivo",
      description:
        "La spiaggia più iconica e impressionante di Chios: tre baie consecutive con acque profonde e scure e spettacolari ciottoli vulcanici neri.",
      image:
        "/images/beaches/mavra-volia-beach-chios.webp",
      tags: ["#mavra_volia", "#emporios", "#spiaggia_vulcanica", "#mavros_gialos"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione & accesso",
        text:
          "Si trova nel sud di Chios, dopo il villaggio medievale di Pyrgi, nell’insediamento costiero di Emporios. Lungo il percorso vale la pena fermarsi al Museo del Mastice.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "La sua bellezza insolita deriva dall’eruzione dell’antico vulcano Psaronas. Scogliere selvagge abbracciano i ciottoli neri, creando acque profonde, scure e fresche.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Una visita a Mavra Volia non è completa senza mangiare. Nel pittoresco porto di Emporios troverai taverne di pesce con frutti di mare freschi e specialità locali.",
      },
    ],
    media: {
      video: {
        title: "La magia di Mavros Gialos dall’alto",
        embedUrl: "https://www.youtube.com/embed/uIeLfDCVcGs",
        creditText: "Grazie al canale per il bellissimo video.",
        creditLabel: "@flying-vp",
        creditHref: "https://www.youtube.com/@flying-vp",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Mavra+Volia,+Chios&t=m&z=11&output=embed",
        distance: "~25 km",
        time: "~35 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Mavra+Volia,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Kambos è il punto di partenza ideale per scoprire le spiagge del sud e i villaggi del mastice. Scegli Voulamandis House come base e goditi comfort, ospitalità e consigli locali quotidiani.",
      linkLabel: "Soggiorna con chi conosce meglio l’isola.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora i tesori nascosti dell’isola.",
  },
  {
    slug: "playa-mavra-volia-emporios",
    seo: {
      canonicalPath: "/es/playas-chios/playa-mavra-volia/",
      title: "Playa Mavra Volia Emporios Chios | Paisaje volcánico único",
      description:
        "Explora la playa Mavra Volia en Emporios, al sur de Chios, la playa volcánica icónica de la isla con guijarros negros, tres bahías, aguas profundas y frescas y acantilados salvajes.",
      ogImage:
        "/images/beaches/mavra-volia-beach-chios.webp",
    },
    hero: {
      kicker: "Emporios • Playa volcánica",
      title: "Mavra Volia Emporios: el paisaje volcánico definitivo",
      description:
        "La playa más icónica e impresionante de Chios: tres bahías consecutivas con aguas profundas y oscuras y espectaculares guijarros volcánicos negros.",
      image:
        "/images/beaches/mavra-volia-beach-chios.webp",
      tags: ["#mavra_volia", "#emporios", "#playa_volcanica", "#mavros_gialos"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Está situada en el sur de Chios, después del pueblo medieval de Pyrgi, en el asentamiento costero de Emporios. De camino, merece la pena parar en el Museo del Mastiha.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "Su belleza inusual proviene de la erupción del antiguo volcán Psaronas. Acantilados salvajes abrazan los guijarros negros, creando aguas profundas, oscuras y frescas.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Una visita a Mavra Volia no está completa sin comida. En el pintoresco puerto de Emporios encontrarás tabernas de pescado con marisco fresco y especialidades locales.",
      },
    ],
    media: {
      video: {
        title: "La magia de Mavros Gialos desde arriba",
        embedUrl: "https://www.youtube.com/embed/uIeLfDCVcGs",
        creditText: "Gracias al canal por este maravilloso vídeo.",
        creditLabel: "@flying-vp",
        creditHref: "https://www.youtube.com/@flying-vp",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Mavra+Volia,+Chios&t=m&z=11&output=embed",
        distance: "~25 km",
        time: "~35 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Mavra+Volia,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Kambos es el punto de partida ideal para descubrir las playas del sur y los pueblos del mastiha. Haz de Voulamandis House tu base y disfruta de comodidad, hospitalidad y consejos locales diarios.",
      linkLabel: "Alójate con quienes mejor conocen la isla.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora los tesoros escondidos de la isla.",
  },
  {
    slug: "mavra-volia-emporios-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/mavra-volia-plaji/",
      title: "Mavra Volia Emporios Plajı Sakız Adası | Eşsiz volkanik manzara",
      description:
        "Sakız Adası’nın güneyindeki Emporios Mavra Volia Plajı’nı keşfedin: siyah çakılları, üç koyu, derin serin suları ve vahşi kayalıklarıyla adanın ikonik volkanik plajı.",
      ogImage:
        "/images/beaches/mavra-volia-beach-chios.webp",
    },
    hero: {
      kicker: "Emporios • Volkanik plaj",
      title: "Mavra Volia Emporios: en etkileyici volkanik manzara",
      description:
        "Sakız Adası’nın en ikonik ve etkileyici plajı: derin koyu sulara ve nefes kesici siyah volkanik çakıllara sahip üç ardışık koy.",
      image:
        "/images/beaches/mavra-volia-beach-chios.webp",
      tags: ["#mavra_volia", "#emporios", "#volkanik_plaj", "#mavros_gialos"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum & ulaşım",
        text:
          "Sakız Adası’nın güneyinde, Orta Çağ köyü Pyrgi’den sonra, Emporios sahil yerleşiminde bulunur. Yol üzerinde Mastik Müzesi kesinlikle görülmeye değerdir.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Bu olağan dışı güzellik, antik Psaronas volkanının patlamasından gelir. Vahşi kayalıklar siyah çakılları sarar ve derin, koyu, serin sular oluşturur.",
      },
      {
        icon: "💡",
        title: "Yerel tavsiye",
        text:
          "Mavra Volia ziyareti yemeksiz tamamlanmaz. Yakındaki pitoresk Emporios limanında taze deniz ürünleri ve yerel lezzetler sunan balık tavernaları bulabilirsiniz.",
      },
    ],
    media: {
      video: {
        title: "Mavros Gialos’un havadan büyüsü",
        embedUrl: "https://www.youtube.com/embed/uIeLfDCVcGs",
        creditText: "Bu güzel video için kanala teşekkürler.",
        creditLabel: "@flying-vp",
        creditHref: "https://www.youtube.com/@flying-vp",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Mavra+Volia,+Chios&t=m&z=11&output=embed",
        distance: "~25 km",
        time: "~35 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Mavra+Volia,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik üssünüz",
      text:
        "Kambos, güney plajlarını ve mastik köylerini keşfetmek için ideal başlangıç noktasıdır. Voulamandis House’u üssünüz yapın; konfor, misafirperverlik ve günlük yerel önerilerin tadını çıkarın.",
      linkLabel: "Adayı en iyi bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak adanın gizli hazinelerini keşfedin.",
  },

  {
    slug: "paralia-vroulidia",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-vroulidia/",
      title: "Παραλία Βρουλίδια Χίος | Τυρκουάζ νερά στη νότια Χίο",
      description:
        "Ανακαλύψτε την παραλία Βρουλίδια στη νότια Χίο, έναν μικρό όρμο με τυρκουάζ νερά κοντά στα Μαστιχοχώρια, ιδανικό για ήρεμο μπάνιο.",
      ogImage: "/images/beaches/vroulidia-2-1.jpg",
    },
    hero: {
      kicker: "Νότια Χίος • Κοντά στον Εμπορειό",
      title: "Παραλία Βρουλίδια: ένας τυρκουάζ όρμος στη νότια Χίο",
      description:
        "Μια μικρή παραλία με καθαρά τυρκουάζ νερά, ανοιχτή θέα στη θάλασσα και ήρεμη αίσθηση απόδρασης, ιδανική για beach hopping στη νότια Χίο.",
      image: "/images/beaches/vroulidia-2-1.jpg",
      tags: ["#βρουλίδια", "#νότια_χίος", "#τυρκουάζ_νερά", "#ήρεμη_παραλία"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Τα Βρουλίδια βρίσκονται στη νότια Χίο, κοντά στον Εμπορειό και τα Μαστιχοχώρια. Είναι ιδανική στάση μαζί με τα Μαύρα Βόλια, το Πυργί και τους Ολύμπους.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Η παραλία ξεχωρίζει για τα τυρκουάζ νερά, τη θέα προς το ανοιχτό πέλαγος και την ήρεμη ατμόσφαιρα. Ταιριάζει σε ταξιδιώτες που προτιμούν μικρές φυσικές παραλίες.",
      },
      {
        icon: "💡",
        title: "Τοπικό tip",
        text:
          "Συνδυάστε τα Βρουλίδια με τα Μαύρα Βόλια και την Κώμη για μια ολοκληρωμένη beach day στη νότια Χίο. Ξεκινήστε νωρίς και πάρτε μαζί σας νερό.",
      },
    ],
    media: {
      video: {
        title: "Η παραλία Βρουλίδια στη νότια Χίο",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Vroulidia%20Beach%20Chios",
        creditText: "Τα διαθέσιμα αποτελέσματα βίντεο μπορεί να διαφέρουν.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Vroulidia+Beach+Chios",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Vroulidia+Beach,+Chios&output=embed",
        distance: "~30 χλμ.",
        time: "~40 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Vroulidia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Από το Voulamandis House στον Κάμπο μπορείτε να οργανώσετε εύκολα μια διαδρομή στη νότια Χίο με Βρουλίδια, Μαύρα Βόλια, Κώμη και Μαστιχοχώρια.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν τη Χίο.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Με βάση το Voulamandis House, εξερευνήστε τις παραλίες και τα χωριά της νότιας Χίου.",
  },
  {
    slug: "paralia-kato-fana",
    seo: {
      canonicalPath: "/el/paralies-xios/paralia-kato-fana/",
      title: "Παραλία Κάτω Φανά Χίος | Ήρεμη νότια απόδραση",
      description:
        "Ανακαλύψτε την παραλία Κάτω Φανά στη νότια Χίο, μια ήρεμη παραλία κοντά στην ιστορική περιοχή των Φανών με ανοιχτή θέα στη θάλασσα.",
      ogImage: "/images/beaches/kato-fana-beach-chios.webp",
    },
    hero: {
      kicker: "Νότια Χίος • Περιοχή Φανών",
      title: "Παραλία Κάτω Φανά: ήρεμη απόδραση στη νότια Χίο",
      description:
        "Μια ήσυχη παραλία για ταξιδιώτες που αγαπούν τους ανοιχτούς ορίζοντες, τις ήρεμες γωνιές και την πιο αυθεντική πλευρά της νότιας Χίου.",
      image: "/images/beaches/kato-fana-beach-chios.webp",
      tags: ["#κάτω_φανά", "#νότια_χίος", "#ήρεμη_απόδραση", "#ανοιχτή_θάλασσα"],
    },
    details: [
      {
        icon: "📍",
        title: "Τοποθεσία & πρόσβαση",
        text:
          "Τα Κάτω Φανά βρίσκονται στη νότια Χίο, κοντά στην ιστορική περιοχή των Φανών και σε απόσταση για συνδυασμό με Πυργί, Ολύμπους και Μαστιχοχώρια.",
      },
      {
        icon: "🌊",
        title: "Χαρακτηριστικά",
        text:
          "Η παραλία έχει ήρεμη, ανοιχτή αίσθηση και ταιριάζει σε όσους αναζητούν χώρο, ησυχία και φυσικό τοπίο αντί για πολυσύχναστες οργανωμένες παραλίες.",
      },
      {
        icon: "💡",
        title: "Τοπικό tip",
        text:
          "Επισκεφθείτε τα Κάτω Φανά ως ήρεμη στάση ανάμεσα σε χωριά και παραλίες. Πάρτε μαζί σας νερό, σκιά και ό,τι χρειάζεστε για χαλαρό μπάνιο.",
      },
    ],
    media: {
      video: {
        title: "Παραλία Κάτω Φανά στη νότια Χίο",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Kato%20Fana%20Beach%20Chios",
        creditText: "Τα διαθέσιμα αποτελέσματα βίντεο μπορεί να διαφέρουν.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Kato+Fana+Beach+Chios",
      },
      map: {
        title: "Διαδρομή από το Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Kato+Fana,+Chios&output=embed",
        distance: "~27 χλμ.",
        time: "~35-40 λεπτά",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Kato+Fana,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Η στρατηγική σας βάση",
      text:
        "Το Voulamandis House στον Κάμπο είναι ήρεμη βάση για να εξερευνήσετε παραλίες όπως Κάτω Φανά, Βρουλίδια, Κώμη και Μαύρα Βόλια.",
      linkLabel: "Μείνετε με ανθρώπους που γνωρίζουν τη Χίο.",
      href: "/el/domatia-xios/",
    },
    relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
    relatedText:
      "Χρησιμοποιήστε το Voulamandis House ως βάση και γνωρίστε τη νότια Χίο στον δικό σας ρυθμό.",
  },
  {
    slug: "plage-vroulidia",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-vroulidia/",
      title: "Plage de Vroulidia Chios | Crique turquoise du sud",
      description:
        "Découvrez la plage de Vroulidia au sud de Chios, une petite crique turquoise près d’Emporios et des villages du mastic, idéale pour nager au calme.",
      ogImage: "/images/beaches/vroulidia-2-1.jpg",
    },
    hero: {
      kicker: "Sud de Chios • Près d’Emporios",
      title: "Plage de Vroulidia : une crique turquoise au sud de Chios",
      description:
        "Une petite plage du sud avec des eaux turquoise, une vue ouverte sur la mer et une atmosphère paisible, parfaite pour une journée plage à Chios.",
      image: "/images/beaches/vroulidia-2-1.jpg",
      tags: ["#vroulidia", "#sud_chios", "#eaux_turquoise", "#plage_calme"],
    },
    details: [
      {
        icon: "📍",
        title: "Situation & accès",
        text:
          "Vroulidia se trouve au sud de Chios, près d’Emporios et des villages du mastic. Elle se combine facilement avec Mavra Volia, Pyrgi et Olympoi.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "La plage est connue pour ses eaux turquoise, ses vues vers le large et son ambiance tranquille. Elle convient aux voyageurs qui aiment les petites plages naturelles.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Combinez Vroulidia avec Mavra Volia et Komi pour une belle journée dans le sud de Chios. Partez tôt et prévoyez de l’eau.",
      },
    ],
    media: {
      video: {
        title: "La plage de Vroulidia au sud de Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Vroulidia%20Beach%20Chios",
        creditText: "Les résultats vidéo disponibles peuvent varier.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Vroulidia+Beach+Chios",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Vroulidia+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~40 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Vroulidia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base idéale",
      text:
        "Depuis Voulamandis House à Kambos, vous pouvez explorer facilement Vroulidia, Mavra Volia, Komi et les villages du mastic.",
      linkLabel: "Séjournez chez ceux qui connaissent Chios.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez d’autres plages",
    relatedText:
      "Depuis Voulamandis House, explorez les plages et villages du sud de Chios.",
  },
  {
    slug: "plage-kato-fana",
    seo: {
      canonicalPath: "/fr/plages-de-chios/plage-kato-fana/",
      title: "Plage de Kato Fana Chios | Évasion calme au sud",
      description:
        "Découvrez la plage de Kato Fana au sud de Chios, une plage paisible près de la région historique de Fana, avec vue ouverte sur la mer.",
      ogImage: "/images/beaches/kato-fana-beach-chios.webp",
    },
    hero: {
      kicker: "Sud de Chios • Région de Fana",
      title: "Plage de Kato Fana : une évasion calme au sud de Chios",
      description:
        "Une plage paisible pour les voyageurs qui aiment les horizons ouverts, les coins tranquilles et le côté plus local du sud de Chios.",
      image: "/images/beaches/kato-fana-beach-chios.webp",
      tags: ["#kato_fana", "#sud_chios", "#evasion_calme", "#mer_ouverte"],
    },
    details: [
      {
        icon: "📍",
        title: "Situation & accès",
        text:
          "Kato Fana se trouve au sud de Chios, près de la région historique de Fana et à distance raisonnable de Pyrgi, Olympoi et des villages du mastic.",
      },
      {
        icon: "🌊",
        title: "Caractéristiques",
        text:
          "Cette plage offre une sensation calme et ouverte. Elle convient aux voyageurs qui cherchent de l’espace, de la simplicité et un décor naturel.",
      },
      {
        icon: "💡",
        title: "Conseil local",
        text:
          "Visitez Kato Fana comme étape tranquille entre villages et plages. Prévoyez eau, ombre et tout le nécessaire pour nager confortablement.",
      },
    ],
    media: {
      video: {
        title: "La plage de Kato Fana au sud de Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Kato%20Fana%20Beach%20Chios",
        creditText: "Les résultats vidéo disponibles peuvent varier.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Kato+Fana+Beach+Chios",
      },
      map: {
        title: "Itinéraire depuis Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Kato+Fana,+Chios&output=embed",
        distance: "~27 km",
        time: "~35-40 minutes",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Kato+Fana,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Votre base idéale",
      text:
        "Voulamandis House à Kambos est une base calme pour explorer Kato Fana, Vroulidia, Komi et Mavra Volia.",
      linkLabel: "Séjournez chez ceux qui connaissent Chios.",
      href: "/fr/chambres-a-chios/",
    },
    relatedTitle: "Découvrez d’autres plages",
    relatedText:
      "Depuis Voulamandis House, découvrez les plages du sud de Chios à votre rythme.",
  },
  {
    slug: "vroulidia-strand",
    seo: {
      canonicalPath: "/de/straende-chios/vroulidia-strand/",
      title: "Vroulidia Strand Chios | Türkisblaue Bucht im Süden",
      description:
        "Entdecken Sie den Vroulidia Strand im Süden von Chios, eine kleine türkisfarbene Bucht nahe Emporios und den Mastixdörfern, ideal zum ruhigen Schwimmen.",
      ogImage: "/images/beaches/vroulidia-2-1.jpg",
    },
    hero: {
      kicker: "Süd-Chios • Nahe Emporios",
      title: "Vroulidia Strand: eine türkisfarbene Bucht im Süden von Chios",
      description:
        "Ein kleiner südlicher Strand mit klarem türkisfarbenem Wasser, Meerblick und ruhiger Atmosphäre, ideal für einen Strandtag auf Chios.",
      image: "/images/beaches/vroulidia-2-1.jpg",
      tags: ["#vroulidia", "#sued_chios", "#tuerkiswasser", "#ruhiger_strand"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Vroulidia liegt im Süden von Chios, nahe Emporios und den Mastixdörfern. Der Strand lässt sich gut mit Mavra Volia, Pyrgi und Olympoi kombinieren.",
      },
      {
        icon: "🌊",
        title: "Charakter",
        text:
          "Der Strand ist für türkisfarbenes Wasser, offene Meerblicke und ruhige Stimmung bekannt. Er passt zu Reisenden, die kleinere natürliche Strände mögen.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Kombinieren Sie Vroulidia mit Mavra Volia und Komi für einen kompletten Strandtag im Süden von Chios. Starten Sie früh und nehmen Sie Wasser mit.",
      },
    ],
    media: {
      video: {
        title: "Vroulidia Strand im Süden von Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Vroulidia%20Beach%20Chios",
        creditText: "Verfügbare Videoergebnisse können variieren.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Vroulidia+Beach+Chios",
      },
      map: {
        title: "Route von Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Vroulidia+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~40 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Vroulidia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Von Voulamandis House in Kambos aus können Sie Vroulidia, Mavra Volia, Komi und die Mastixdörfer bequem erkunden.",
      linkLabel: "Übernachten Sie bei Menschen, die Chios kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Von Voulamandis House aus entdecken Sie die Strände und Dörfer im Süden von Chios.",
  },
  {
    slug: "kato-fana-strand",
    seo: {
      canonicalPath: "/de/straende-chios/kato-fana-strand/",
      title: "Kato Fana Strand Chios | Ruhige Auszeit im Süden",
      description:
        "Entdecken Sie den Kato Fana Strand im Süden von Chios, einen ruhigen Strand nahe der historischen Fana-Region mit offenem Blick aufs Meer.",
      ogImage: "/images/beaches/kato-fana-beach-chios.webp",
    },
    hero: {
      kicker: "Süd-Chios • Region Fana",
      title: "Kato Fana Strand: ruhige Auszeit im Süden von Chios",
      description:
        "Ein friedlicher Strand für Reisende, die offene Horizonte, ruhige Orte und die lokale Seite von Süd-Chios lieben.",
      image: "/images/beaches/kato-fana-beach-chios.webp",
      tags: ["#kato_fana", "#sued_chios", "#ruhige_auszeit", "#offenes_meer"],
    },
    details: [
      {
        icon: "📍",
        title: "Lage & Zugang",
        text:
          "Kato Fana liegt im Süden von Chios, nahe der historischen Fana-Region und gut erreichbar von Pyrgi, Olympoi und den Mastixdörfern.",
      },
      {
        icon: "🌊",
        title: "Charakter",
        text:
          "Der Strand wirkt ruhig und offen. Er eignet sich für Reisende, die Platz, einfache Natur und weniger besuchte Orte suchen.",
      },
      {
        icon: "💡",
        title: "Lokaler Tipp",
        text:
          "Besuchen Sie Kato Fana als ruhigen Stopp zwischen Dörfern und Stränden. Nehmen Sie Wasser, Schatten und alles für ein entspanntes Bad mit.",
      },
    ],
    media: {
      video: {
        title: "Kato Fana Strand im Süden von Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Kato%20Fana%20Beach%20Chios",
        creditText: "Verfügbare Videoergebnisse können variieren.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Kato+Fana+Beach+Chios",
      },
      map: {
        title: "Route von Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Kato+Fana,+Chios&output=embed",
        distance: "~27 km",
        time: "~35-40 Minuten",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Kato+Fana,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Ihre strategische Basis",
      text:
        "Voulamandis House in Kambos ist eine ruhige Basis für Kato Fana, Vroulidia, Komi und Mavra Volia.",
      linkLabel: "Übernachten Sie bei Menschen, die Chios kennen.",
      href: "/de/chios-zimmer/",
    },
    relatedTitle: "Weitere Strände entdecken",
    relatedText:
      "Nutzen Sie Voulamandis House als Basis und entdecken Sie Süd-Chios in Ihrem eigenen Tempo.",
  },
  {
    slug: "spiaggia-vroulidia",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-vroulidia/",
      title: "Spiaggia Vroulidia Chios | Baia turchese del sud",
      description:
        "Scopri la spiaggia di Vroulidia nel sud di Chios, una piccola baia turchese vicino a Emporios e ai villaggi del mastice, ideale per nuotare in tranquillità.",
      ogImage: "/images/beaches/vroulidia-2-1.jpg",
    },
    hero: {
      kicker: "Sud di Chios • Vicino a Emporios",
      title: "Spiaggia di Vroulidia: una baia turchese nel sud di Chios",
      description:
        "Una piccola spiaggia meridionale con acque turchesi, vista aperta sul mare e un’atmosfera tranquilla, perfetta per una giornata tra le spiagge di Chios.",
      image: "/images/beaches/vroulidia-2-1.jpg",
      tags: ["#vroulidia", "#sud_chios", "#acque_turchesi", "#spiaggia_tranquilla"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione e accesso",
        text:
          "Vroulidia si trova nel sud di Chios, vicino a Emporios e ai villaggi del mastice. Si abbina bene a Mavra Volia, Pyrgi e Olympoi.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "La spiaggia è nota per le acque turchesi, la vista sul mare aperto e l’atmosfera tranquilla. È ideale per chi ama piccole spiagge naturali.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Abbina Vroulidia a Mavra Volia e Komi per una giornata completa nel sud di Chios. Parti presto e porta con te acqua.",
      },
    ],
    media: {
      video: {
        title: "Spiaggia di Vroulidia nel sud di Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Vroulidia%20Beach%20Chios",
        creditText: "I risultati video disponibili possono variare.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Vroulidia+Beach+Chios",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Vroulidia+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~40 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Vroulidia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Da Voulamandis House a Kambos puoi esplorare facilmente Vroulidia, Mavra Volia, Komi e i villaggi del mastice.",
      linkLabel: "Soggiorna con chi conosce Chios.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Partendo da Voulamandis House, esplora le spiagge e i villaggi del sud di Chios.",
  },
  {
    slug: "spiaggia-kato-fana",
    seo: {
      canonicalPath: "/it/spiagge-chios/spiaggia-kato-fana/",
      title: "Spiaggia Kato Fana Chios | Tranquilla fuga a sud",
      description:
        "Scopri la spiaggia di Kato Fana nel sud di Chios, una spiaggia tranquilla vicino alla storica zona di Fana, con vista aperta sul mare.",
      ogImage: "/images/beaches/kato-fana-beach-chios.webp",
    },
    hero: {
      kicker: "Sud di Chios • Zona di Fana",
      title: "Spiaggia di Kato Fana: una fuga tranquilla nel sud di Chios",
      description:
        "Una spiaggia pacifica per chi ama orizzonti aperti, angoli tranquilli e il lato più locale del sud di Chios.",
      image: "/images/beaches/kato-fana-beach-chios.webp",
      tags: ["#kato_fana", "#sud_chios", "#fuga_tranquilla", "#mare_aperto"],
    },
    details: [
      {
        icon: "📍",
        title: "Posizione e accesso",
        text:
          "Kato Fana si trova nel sud di Chios, vicino alla zona storica di Fana e a breve distanza da Pyrgi, Olympoi e dai villaggi del mastice.",
      },
      {
        icon: "🌊",
        title: "Caratteristiche",
        text:
          "Questa spiaggia ha un’atmosfera calma e aperta. È adatta a chi cerca spazio, semplicità e paesaggio naturale.",
      },
      {
        icon: "💡",
        title: "Consiglio locale",
        text:
          "Visita Kato Fana come tappa tranquilla tra villaggi e spiagge. Porta acqua, ombra e tutto ciò che serve per un bagno rilassato.",
      },
    ],
    media: {
      video: {
        title: "Spiaggia di Kato Fana nel sud di Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Kato%20Fana%20Beach%20Chios",
        creditText: "I risultati video disponibili possono variare.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Kato+Fana+Beach+Chios",
      },
      map: {
        title: "Percorso da Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Kato+Fana,+Chios&output=embed",
        distance: "~27 km",
        time: "~35-40 minuti",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Kato+Fana,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "La tua base strategica",
      text:
        "Voulamandis House a Kambos è una base tranquilla per Kato Fana, Vroulidia, Komi e Mavra Volia.",
      linkLabel: "Soggiorna con chi conosce Chios.",
      href: "/it/camere-a-chios/",
    },
    relatedTitle: "Scopri altre spiagge",
    relatedText:
      "Usa Voulamandis House come base e scopri il sud di Chios al tuo ritmo.",
  },
  {
    slug: "playa-vroulidia",
    seo: {
      canonicalPath: "/es/playas-chios/playa-vroulidia/",
      title: "Playa Vroulidia Chios | Cala turquesa del sur",
      description:
        "Descubre la playa de Vroulidia en el sur de Chios, una pequeña cala turquesa cerca de Emporios y los pueblos del mastiha, ideal para nadar con calma.",
      ogImage: "/images/beaches/vroulidia-2-1.jpg",
    },
    hero: {
      kicker: "Sur de Chios • Cerca de Emporios",
      title: "Playa de Vroulidia: una cala turquesa en el sur de Chios",
      description:
        "Una pequeña playa del sur con aguas turquesas, vistas abiertas al mar y una atmósfera tranquila, perfecta para un día de playa en Chios.",
      image: "/images/beaches/vroulidia-2-1.jpg",
      tags: ["#vroulidia", "#sur_chios", "#aguas_turquesas", "#playa_tranquila"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Vroulidia se encuentra en el sur de Chios, cerca de Emporios y los pueblos del mastiha. Combina bien con Mavra Volia, Pyrgi y Olympoi.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "La playa destaca por sus aguas turquesas, sus vistas al mar abierto y su ambiente tranquilo. Es ideal para quienes prefieren playas pequeñas y naturales.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Combina Vroulidia con Mavra Volia y Komi para un día completo en el sur de Chios. Sal temprano y lleva agua.",
      },
    ],
    media: {
      video: {
        title: "Playa de Vroulidia en el sur de Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Vroulidia%20Beach%20Chios",
        creditText: "Los resultados de vídeo disponibles pueden variar.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Vroulidia+Beach+Chios",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Vroulidia+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~40 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Vroulidia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Desde Voulamandis House en Kambos puedes explorar fácilmente Vroulidia, Mavra Volia, Komi y los pueblos del mastiha.",
      linkLabel: "Alójate con quienes conocen Chios.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Desde Voulamandis House, explora las playas y pueblos del sur de Chios.",
  },
  {
    slug: "playa-kato-fana",
    seo: {
      canonicalPath: "/es/playas-chios/playa-kato-fana/",
      title: "Playa Kato Fana Chios | Escapada tranquila al sur",
      description:
        "Descubre la playa de Kato Fana en el sur de Chios, una playa tranquila cerca de la zona histórica de Fana, con vistas abiertas al mar.",
      ogImage: "/images/beaches/kato-fana-beach-chios.webp",
    },
    hero: {
      kicker: "Sur de Chios • Zona de Fana",
      title: "Playa de Kato Fana: una escapada tranquila en el sur de Chios",
      description:
        "Una playa apacible para viajeros que aman los horizontes abiertos, los rincones tranquilos y el lado más local del sur de Chios.",
      image: "/images/beaches/kato-fana-beach-chios.webp",
      tags: ["#kato_fana", "#sur_chios", "#escapada_tranquila", "#mar_abierto"],
    },
    details: [
      {
        icon: "📍",
        title: "Ubicación y acceso",
        text:
          "Kato Fana se encuentra en el sur de Chios, cerca de la zona histórica de Fana y a distancia razonable de Pyrgi, Olympoi y los pueblos del mastiha.",
      },
      {
        icon: "🌊",
        title: "Características",
        text:
          "Esta playa tiene una sensación tranquila y abierta. Es adecuada para quienes buscan espacio, sencillez y paisaje natural.",
      },
      {
        icon: "💡",
        title: "Consejo local",
        text:
          "Visita Kato Fana como parada tranquila entre pueblos y playas. Lleva agua, sombra y todo lo necesario para nadar con calma.",
      },
    ],
    media: {
      video: {
        title: "Playa de Kato Fana en el sur de Chios",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Kato%20Fana%20Beach%20Chios",
        creditText: "Los resultados de vídeo disponibles pueden variar.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Kato+Fana+Beach+Chios",
      },
      map: {
        title: "Ruta desde Voulamandis House",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Kato+Fana,+Chios&output=embed",
        distance: "~27 km",
        time: "~35-40 minutos",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Kato+Fana,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Tu base estratégica",
      text:
        "Voulamandis House en Kambos es una base tranquila para Kato Fana, Vroulidia, Komi y Mavra Volia.",
      linkLabel: "Alójate con quienes conocen Chios.",
      href: "/es/habitaciones-en-chios/",
    },
    relatedTitle: "Descubre más playas",
    relatedText:
      "Usa Voulamandis House como base y descubre el sur de Chios a tu ritmo.",
  },
  {
    slug: "vroulidia-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/vroulidia-plaji/",
      title: "Vroulidia Plajı Sakız Adası | Güneyde turkuaz koy",
      description:
        "Sakız Adası’nın güneyindeki Vroulidia Plajı’nı keşfedin; Emporios ve damla sakızı köylerine yakın, sakin yüzme için ideal küçük turkuaz bir koy.",
      ogImage: "/images/beaches/vroulidia-2-1.jpg",
    },
    hero: {
      kicker: "Güney Sakız • Emporios yakınında",
      title: "Vroulidia Plajı: Sakız Adası’nın güneyinde turkuaz bir koy",
      description:
        "Turkuaz suları, açık deniz manzarası ve sakin atmosferiyle güneyde küçük bir plaj; Sakız Adası’nda huzurlu bir beach day için idealdir.",
      image: "/images/beaches/vroulidia-2-1.jpg",
      tags: ["#vroulidia", "#guney_sakiz", "#turkuaz_sular", "#sakin_plaj"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum ve ulaşım",
        text:
          "Vroulidia, Sakız Adası’nın güneyinde, Emporios ve damla sakızı köylerine yakın konumdadır. Mavra Volia, Pyrgi ve Olympoi ile kolayca birleştirilebilir.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Plaj turkuaz suları, açık deniz manzarası ve sakin atmosferiyle bilinir. Küçük ve doğal plajları seven gezginler için uygundur.",
      },
      {
        icon: "💡",
        title: "Yerel ipucu",
        text:
          "Vroulidia’yı Mavra Volia ve Komi ile birleştirerek güney Sakız’da tam bir plaj günü planlayın. Erken çıkın ve yanınıza su alın.",
      },
    ],
    media: {
      video: {
        title: "Güney Sakız’da Vroulidia Plajı",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Vroulidia%20Beach%20Chios",
        creditText: "Mevcut video sonuçları değişebilir.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Vroulidia+Beach+Chios",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Vroulidia+Beach,+Chios&output=embed",
        distance: "~30 km",
        time: "~40 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Vroulidia+Beach,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik konaklama noktanız",
      text:
        "Kambos’taki Voulamandis House’tan Vroulidia, Mavra Volia, Komi ve damla sakızı köylerini kolayca keşfedebilirsiniz.",
      linkLabel: "Sakız Adası’nı bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’tan başlayarak güney Sakız’ın plajlarını ve köylerini keşfedin.",
  },
  {
    slug: "kato-fana-plaji",
    seo: {
      canonicalPath: "/tr/sakiz-adasi-plajlari/kato-fana-plaji/",
      title: "Kato Fana Plajı Sakız Adası | Güneyde sakin kaçış",
      description:
        "Sakız Adası’nın güneyindeki Kato Fana Plajı’nı keşfedin; tarihi Fana bölgesine yakın, açık deniz manzaralı sakin bir plaj.",
      ogImage: "/images/beaches/kato-fana-beach-chios.webp",
    },
    hero: {
      kicker: "Güney Sakız • Fana bölgesi",
      title: "Kato Fana Plajı: Sakız Adası’nın güneyinde sakin kaçış",
      description:
        "Açık ufukları, sessiz köşeleri ve güney Sakız’ın daha yerel tarafını seven gezginler için huzurlu bir plaj.",
      image: "/images/beaches/kato-fana-beach-chios.webp",
      tags: ["#kato_fana", "#guney_sakiz", "#sakin_kacis", "#acik_deniz"],
    },
    details: [
      {
        icon: "📍",
        title: "Konum ve ulaşım",
        text:
          "Kato Fana, Sakız Adası’nın güneyinde, tarihi Fana bölgesine yakın ve Pyrgi, Olympoi ile damla sakızı köylerine ulaşılabilir mesafededir.",
      },
      {
        icon: "🌊",
        title: "Özellikler",
        text:
          "Bu plaj sakin ve açık bir his verir. Alan, sadelik ve doğal manzara arayan gezginler için uygundur.",
      },
      {
        icon: "💡",
        title: "Yerel ipucu",
        text:
          "Kato Fana’yı köyler ve plajlar arasında sakin bir durak olarak ziyaret edin. Su, gölge ve rahat yüzme için ihtiyaçlarınızı yanınıza alın.",
      },
    ],
    media: {
      video: {
        title: "Güney Sakız’da Kato Fana Plajı",
        embedUrl: "https://www.youtube.com/embed?listType=search&list=Kato%20Fana%20Beach%20Chios",
        creditText: "Mevcut video sonuçları değişebilir.",
        creditLabel: "YouTube",
        creditHref: "https://www.youtube.com/results?search_query=Kato+Fana+Beach+Chios",
      },
      map: {
        title: "Voulamandis House’tan rota",
        embedUrl:
          "https://maps.google.com/maps?saddr=Voulamandis+House,+Chios&daddr=Kato+Fana,+Chios&output=embed",
        distance: "~27 km",
        time: "~35-40 dakika",
        gpsHref:
          "https://www.google.com/maps/dir/Voulamandis+House,+Chios/Kato+Fana,+Chios/",
      },
    },
    baseTip: {
      icon: "🗺️",
      title: "Stratejik konaklama noktanız",
      text:
        "Kambos’taki Voulamandis House, Kato Fana, Vroulidia, Komi ve Mavra Volia’yı keşfetmek için sakin bir başlangıç noktasıdır.",
      linkLabel: "Sakız Adası’nı bilenlerle konaklayın.",
      href: "/tr/sakiz-adasi-odalari/",
    },
    relatedTitle: "Daha fazla plaj keşfedin",
    relatedText:
      "Voulamandis House’u üs alarak güney Sakız’ı kendi ritminizde keşfedin.",
  },
];

export const relatedBeachCards = [
  {
    slug: "emporios-beach",
    title: "Mavra Volia",
    description: "The most imposing beach in Chios with unique volcanic beauty.",
    href: "/chios/chios-beaches/emporios-beach/",
    image:
      "/images/beaches/mavra-volia-beach-chios.webp",
    imageAlt: "Mavra Volia beach in Chios with black volcanic pebbles",
    badge: "Top pick",
    size: "large",
  },
  {
    slug: "agia-dynami-beach-chios",
    title: "Agia Dynami",
    description: "Turquoise waters and a small hidden cove in southern Chios.",
    href: "/chios/chios-beaches/agia-dynami-beach-chios/",
    image:
      "/images/beaches/agia-dynami-beach-chios.webp",
    imageAlt: "Agia Dynami beach in Chios with emerald waters",
    badge: "Exotic",
    size: "wide",
  },
  {
    slug: "lithi-beach",
    title: "Lithi",
    description: "Shallow sandy waters and fresh fish taverns by the sea.",
    href: "/chios/chios-beaches/lithi-beach/",
    image:
      "/images/beaches/lithi-beach-chios.webp",
    imageAlt: "Lithi beach in Chios with shallow sandy waters",
    badge: "Family",
    size: "normal",
  },
  {
    slug: "agia-fotia-beach",
    title: "Agia Fotia",
    description: "A cosmopolitan organized beach close to Kambos.",
    href: "/chios/chios-beaches/agia-fotia-beach/",
    image: "/images/beaches/agia-fotia-beach-chios.webp",
    imageAlt: "Agia Fotia beach in Chios",
    badge: "Organized",
    size: "normal",
  },
  {
    slug: "komi-beach",
    title: "Komi",
    description: "Golden sand, shallow waters and summer beach life.",
    href: "/chios/chios-beaches/komi-beach/",
    image:
      "/images/beaches/komi-sandy-beach-chios.webp",
    imageAlt: "Komi beach in Chios with golden sand",
    badge: "Sandy",
    size: "normal",
  },
  {
    slug: "salagona-beach",
    title: "Salagona",
    description: "A quiet turquoise treasure for relaxation and snorkeling.",
    href: "/chios/chios-beaches/salagona-beach/",
    image:
      "/images/beaches/salagona-beach-chios.webp",
    imageAlt: "Salagona beach in Chios with turquoise waters",
    badge: "Hidden",
    size: "normal",
  },
  {
    slug: "avlonia-beach2",
    title: "Avlonia",
    description: "A wild isolated bay with an impressive seabed.",
    href: "/chios/chios-beaches/avlonia-beach2/",
    image:
      "/images/beaches/avlonia-1024x768.webp",
    imageAlt: "Avlonia beach in southern Chios",
    badge: "Wild",
    size: "normal",
  },
  {
    slug: "lefkathia-beach",
    title: "Lefkathia",
    description: "Crystal waters and sunset views near Volissos.",
    href: "/chios/chios-beaches/lefkathia-beach/",
    image: "/images/beaches/lefkathia-2.jpg",
    imageAlt: "Lefkathia beach in northwestern Chios",
    badge: "Sunset",
    size: "normal",
  },
  {
    slug: "nagos-beach",
    title: "Nagos",
    description: "Springs, plane trees and colorful pebbles in northern Chios.",
    href: "/chios/chios-beaches/nagos-beach/",
    image:
      "/images/beaches/nagos-beach-chios.webp",
    imageAlt: "Nagos beach in northern Chios",
    badge: "Nature",
    size: "normal",
  },
] as const;

export function getBeachDetailBySlug(slug: string) {
  return beachDetails.find((beach) => beach.slug === slug);
}

export function getLocalizedBeachDetailByPath(path: string) {
  return localizedBeachDetails.find((beach) => beach.seo.canonicalPath === path);
}

export function getAllBeachDetails() {
  return [...beachDetails, ...localizedBeachDetails];
}

export function getRelatedBeachCards(currentSlug: string) {
  return relatedBeachCards.filter((beach) => beach.slug !== currentSlug);
}

export function getBeachSlugs() {
  return beachDetails.map((beach) => beach.slug);
}

