export const homePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Hotel",
      "@id": "https://chioshotel.gr/#hotel",
      name: "Voulamandis House",
      url: "https://chioshotel.gr/",
      image:
        "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
      telephone: "+302271031733",
      priceRange: "€70-€90",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Dimarchou Kalvokoressi 117",
        addressLocality: "Chios",
        addressRegion: "North Aegean",
        postalCode: "82100",
        addressCountry: "GR",
      },
      containsPlace: [
        {
          "@id": "https://chioshotel.gr/chios-rooms/standard-double-room/#hotelroom",
        },
        {
          "@id": "https://chioshotel.gr/chios-rooms/economy-double-rooms/#hotelroom",
        },
        {
          "@id": "https://chioshotel.gr/chios-rooms/family-chios-apartments/#hotelroom",
        },
      ],
    },
    {
      "@type": "HotelRoom",
      "@id": "https://chioshotel.gr/chios-rooms/standard-double-room/#hotelroom",
      name: "Double Rooms in Chios & Triple Rooms in Chios - Voulamandis House",
      description:
        "Fully renovated double rooms in Chios and triple rooms in Chios at Voulamandis House, in Kampos. Bright, air-conditioned rooms with traditional stone walls, large bathrooms, LCD TV, free WiFi, refrigerator and kettle. Comfortable accommodation for up to 4 guests.",
      url: "https://chioshotel.gr/chios-rooms/standard-double-room/",
      image: [
        "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-rooms.webp",
        "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
        "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
        "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07867-1.webp",
        "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748354861920234.webp",
      ],
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: 4,
        unitText: "guests",
      },
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Free WiFi",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Refrigerator",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Kettle",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "LCD TV",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Air Conditioning",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Large Bathroom",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Kitchenette",
          value: true,
          description: "Available in selected rooms, Rooms 3 and 4",
        },
      ],
      containedInPlace: {
        "@id": "https://chioshotel.gr/#hotel",
      },
    },
    {
      "@type": "HotelRoom",
      "@id": "https://chioshotel.gr/chios-rooms/economy-double-rooms/#hotelroom",
      name: "Economy Double Rooms in Chios - Voulamandis House",
      description:
        "Economy double rooms in Chios at Voulamandis House, in Kampos. Comfortable ground floor and first floor rooms with traditional character, ideal for couples or two guests looking for value-for-money accommodation in Chios.",
      url: "https://chioshotel.gr/chios-rooms/economy-double-rooms/",
      image: [
        "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-rooms.webp",
        "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
      ],
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: 2,
        unitText: "guests",
      },
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Free WiFi",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Air Conditioning",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "LCD TV",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Refrigerator",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Kettle",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Private bathroom",
          value: true,
        },
      ],
      containedInPlace: {
        "@id": "https://chioshotel.gr/#hotel",
      },
    },
    {
      "@type": "HotelRoom",
      "@id": "https://chioshotel.gr/chios-rooms/family-chios-apartments/#hotelroom",
      name: "Family Chios Apartments - Voulamandis House",
      description:
        "Family Chios Apartments at Voulamandis House in Kampos, Chios. Spacious apartments ideal for families, with a separate bedroom, fully equipped kitchen and comfortable living area.",
      url: "https://chioshotel.gr/chios-rooms/family-chios-apartments/",
      image: [
        "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
      ],
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: 4,
        unitText: "guests",
      },
      floorSize: {
        "@type": "QuantitativeValue",
        minValue: 40,
        maxValue: 45,
        unitCode: "MTK",
        unitText: "square meters",
      },
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Free WiFi",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Air Conditioning",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "LCD TV",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Private bathroom",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Fully equipped kitchen",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Separate bedroom",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Living area",
          value: true,
        },
      ],
      containedInPlace: {
        "@id": "https://chioshotel.gr/#hotel",
      },
    },
  ],
};