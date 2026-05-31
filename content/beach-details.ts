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
        "https://chioshotel.gr/wp-content/uploads/2021/12/691-e1645969589226.webp",
    },
    hero: {
      kicker: "Southern Chios • Near Olympoi",
      title: "Agia Dynami Beach: The Emerald Paradise",
      description:
        "A small, dreamy beach in southern Chios with incredible clarity and waters of a unique emerald color. The picturesque chapel completes the ultimate Greek landscape.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/691-e1645969589226.webp",
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
        "Starting from Voulamandis House in Kampos, you have the strategic advantage to start early in the morning for Agia Dynami and enjoy the whole day in its crystal-clear waters.",
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
        "https://chioshotel.gr/wp-content/uploads/2021/12/2017-06-28-1024x768.webp",
    },
    hero: {
      kicker: "Western Chios • Family friendly",
      title: "Lithi Beach: Family Sandy Beach & Fresh Fish",
      description:
        "A beautiful natural harbor in western Chios. Enjoy shallow waters, golden sand and authentic fish taverns right on the waves.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/2017-06-28-1024x768.webp",
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
        "Lithi Beach is about 40 minutes away from the historic Kampos area. Make Voulamandis House your base to explore western beaches and medieval villages.",
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
      ogImage: "https://chioshotel.gr/wp-content/uploads/2026/03/lefkathia-2.jpg",
    },
    hero: {
      kicker: "Northwestern Chios • Volissos",
      title: "Lefkathia Beach: Crystal Waters in Volissos",
      description:
        "A beautiful enclosed bay in northwestern Chios. Its semi-circular shape, crystal-clear waters and stunning sunsets will enchant you.",
      image: "https://chioshotel.gr/wp-content/uploads/2026/03/lefkathia-2.jpg",
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
        "Organize an unforgettable day trip to northern Chios, including Volissos, Agia Markella and Lefkathia, starting from Kampos.",
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
        "https://chioshotel.gr/wp-content/uploads/2021/12/nagos-e1645969566121.webp",
    },
    hero: {
      kicker: "Northern Chios • Kardamyla",
      title: "Nagos Beach: The Green Landscape of Northern Chios",
      description:
        "A unique setting where running spring waters and century-old plane trees meet the crystal-clear waters and colorful pebbles of the Aegean.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/nagos-e1645969566121.webp",
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
        "Starting from the lush Kampos area, you can plan your day trip to northern Chios. Make Voulamandis House your base and let us recommend the best routes.",
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
        "https://chioshotel.gr/wp-content/uploads/2021/12/avlonia-1024x768.webp",
    },
    hero: {
      kicker: "Southern Chios • Pyrgousiki Avlonia",
      title: "Avlonia Beach: The Hidden Gem of the South",
      description:
        "A magical, isolated bay in southern Chios with wild beauty, turquoise crystal-clear waters and an impressive seabed waiting to be explored.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/avlonia-1024x768.webp",
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
        "Avlonia is perfectly combined with a trip to the Mastichochoria. Starting from Voulamandis House in Kampos, you are ideally placed for medieval villages and hidden southern beaches.",
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
        "https://chioshotel.gr/wp-content/uploads/2021/12/salagona-e1645969502155.webp",
    },
    hero: {
      kicker: "Southwestern Chios • Quiet beach",
      title: "Salagona Beach: The Hidden Turquoise Treasure",
      description:
        "Avoid the crowds in this magical southwestern bay with crystal-clear turquoise waters and fine pebbles, ideal for relaxation and seabed exploration.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/salagona-e1645969502155.webp",
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
        "Salagona is easily accessible by car. Make Voulamandis House in historic Kampos your base to explore both the southern and western beaches of Chios with local guidance.",
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
        "Discover Agia Fotia Beach in Chios, a lively organized pebble beach near Kampos with crystal-clear waters, taverns, cafes and views toward Asia Minor.",
      ogImage: "https://chioshotel.gr/wp-content/uploads/2026/02/agia-fotia.jpg",
    },
    hero: {
      kicker: "East Chios • Cosmopolitan beach",
      title: "Agia Fotia Beach: The Cosmopolitan Choice of Chios",
      description:
        "One of the most beautiful and lively beaches of Chios, with crystal-clear waters, a pebbled seabed and a magical view toward the Asia Minor coast.",
      image: "https://chioshotel.gr/wp-content/uploads/2026/02/agia-fotia.jpg",
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
        "Agia Fotia is just 15-20 minutes away from Kampos. Make Voulamandis House your base, enjoy the tranquility of the orchards and easily visit the island’s cosmopolitan beaches.",
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
        "https://chioshotel.gr/wp-content/uploads/2021/12/42ba5ae2ff96d99dfb12b1e06fa90b45-e1703437426681.webp",
    },
    hero: {
      kicker: "Southeast Chios • Golden sand",
      title: "Komi Beach: The Endless Golden Sand",
      description:
        "One of the most popular and fully organized beaches in Chios, with endless sand, shallow crystal waters and excellent options for dining and entertainment by the waves.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/42ba5ae2ff96d99dfb12b1e06fa90b45-e1703437426681.webp",
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
        "Cosmopolitan Komi is at an ideal distance from Kampos, just a 30-minute drive. Make Voulamandis House your base and enjoy easy access to the best sandy beaches of southern Chios.",
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
        "https://chioshotel.gr/wp-content/uploads/2021/12/emporios3-e1702727598897.webp",
    },
    hero: {
      kicker: "Emporios • Volcanic beach",
      title: "Emporios Mavra Volia Beach: The Ultimate Volcanic Landscape",
      description:
        "The most iconic and impressive beach of Chios: three consecutive bays with deep dark waters and breathtaking black volcanic pebbles.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2021/12/emporios3-e1702727598897.webp",
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
        "Kampos is the ideal starting point to discover the southern beaches and the Mastichochoria. Make Voulamandis House your base and enjoy comfort, hospitality and daily local tips.",
      linkLabel: "Stay with those who know best.",
      href: "/chios-rooms/",
    },
    relatedTitle: "Discover More Beaches",
    relatedText:
      "Starting from Voulamandis House, explore the hidden treasures of the island.",
  },
];

export const relatedBeachCards = [
  {
    slug: "emporios-beach",
    title: "Mavra Volia",
    description: "The most imposing beach in Chios with unique volcanic beauty.",
    href: "/chios/chios-beaches/emporios-beach/",
    image:
      "https://chioshotel.gr/wp-content/uploads/2021/12/emporios3-e1702727598897.webp",
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
      "https://chioshotel.gr/wp-content/uploads/2021/12/691-e1645969589226.webp",
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
      "https://chioshotel.gr/wp-content/uploads/2021/12/2017-06-28-1024x768.webp",
    imageAlt: "Lithi beach in Chios with shallow sandy waters",
    badge: "Family",
    size: "normal",
  },
  {
    slug: "agia-fotia-beach",
    title: "Agia Fotia",
    description: "A cosmopolitan organized beach close to Kampos.",
    href: "/chios/chios-beaches/agia-fotia-beach/",
    image: "https://chioshotel.gr/wp-content/uploads/2026/02/agia-fotia.jpg",
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
      "https://chioshotel.gr/wp-content/uploads/2021/12/42ba5ae2ff96d99dfb12b1e06fa90b45-e1703437426681.webp",
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
      "https://chioshotel.gr/wp-content/uploads/2021/12/salagona-e1645969502155.webp",
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
      "https://chioshotel.gr/wp-content/uploads/2021/12/avlonia-1024x768.webp",
    imageAlt: "Avlonia beach in southern Chios",
    badge: "Wild",
    size: "normal",
  },
  {
    slug: "lefkathia-beach",
    title: "Lefkathia",
    description: "Crystal waters and sunset views near Volissos.",
    href: "/chios/chios-beaches/lefkathia-beach/",
    image: "https://chioshotel.gr/wp-content/uploads/2026/03/lefkathia-2.jpg",
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
      "https://chioshotel.gr/wp-content/uploads/2021/12/nagos-e1645969566121.webp",
    imageAlt: "Nagos beach in northern Chios",
    badge: "Nature",
    size: "normal",
  },
] as const;

export function getBeachDetailBySlug(slug: string) {
  return beachDetails.find((beach) => beach.slug === slug);
}

export function getRelatedBeachCards(currentSlug: string) {
  return relatedBeachCards.filter((beach) => beach.slug !== currentSlug);
}

export function getBeachSlugs() {
  return beachDetails.map((beach) => beach.slug);
}