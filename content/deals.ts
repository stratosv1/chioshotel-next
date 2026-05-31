export type DealsPageData = {
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
    phoneLabel: string;
    phoneHref: string;
  };
  countdown: {
    label: string;
    targetIso: string;
    expiredText: string;
  };
  intro: {
    kicker: string;
    title: string;
    description: string;
  };
  offers: {
    id: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    tags: string[];
    tip: string;
    couponCode: string;
    discountLabel: string;
    bookingHref: string;
    roomPageHref: string;
  }[];
};

export const dealsPageEn: DealsPageData = {
  seo: {
    canonicalPath: "/best-chios-travel-deals-for-chios-hotels/",
    title: "Best Chios Travel Deals for Chios Hotels 2026 | Voulamandis House",
    description:
      "Looking for the best Chios travel deals for Chios hotels? Discover exclusive Chios travel packages and Chios hotel offers at Voulamandis House for 2026.",
    ogImage: "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
  },
  hero: {
    kicker: "Voulamandis House • Kampos, Chios",
    title: "Best Chios Travel Deals for Chios Hotels",
    description:
      "Discover exclusive Chios travel packages, room offers and direct booking coupon codes for your stay at Voulamandis House.",
    image: "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
    phoneLabel: "Bookings: +30 22710 31733",
    phoneHref: "tel:+302271031733",
  },
  countdown: {
    label: "Offer ends in",
    targetIso: "2026-09-30T23:59:59+03:00",
    expiredText: "Offer expired",
  },
  intro: {
    kicker: "Chios hotel offers 2026",
    title: "Discover Chios travel packages & hotel offers",
    description:
      "Choose your preferred room category, copy the coupon code and continue to the secure booking page to unlock your direct booking offer.",
  },
  offers: [
    {
      id: "economy-double",
      title: "Economy Double",
      description:
        "A value-focused Chios hotel offer for guests who want a simple, comfortable and budget-friendly stay in Kampos.",
      image: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp",
      imageAlt: "Best Chios travel deal for economy double room at Voulamandis House",
      tags: ["Chios travel deals", "Chios travel packages", "Chios hotels offers", "Best price"],
      tip: "Copy the coupon code for the next step.",
      couponCode: "ECOMAY10",
      discountLabel: "Economy offer",
      bookingHref: "https://beds24.com/booking.php?propid=117813&roomid=268803&lang=en",
      roomPageHref: "/chios-rooms/economy-double-rooms/",
    },
    {
      id: "ground-floor-double",
      title: "Ground Floor Double",
      description:
        "A comfortable ground-floor room offer with easy access to the courtyard and garden atmosphere of Voulamandis House.",
      image: "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
      imageAlt: "Chios hotel offer for ground floor double room at Voulamandis House",
      tags: ["Chios travel deals", "Chios travel packages", "Chios hotels offers", "Garden view"],
      tip: "Copy the code to save on your booking.",
      couponCode: "MAY10",
      discountLabel: "Garden access offer",
      bookingHref: "https://beds24.com/booking.php?propid=117813&roomid=626129&lang=en",
      roomPageHref: "/chios-rooms/standard-double-room/",
    },
    {
      id: "first-floor-double",
      title: "First Floor Double",
      description:
        "A first-floor room offer for guests who prefer a brighter stay, upper-floor feel and traditional Kampos atmosphere.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
      imageAlt: "Chios travel package for first floor double room at Voulamandis House",
      tags: ["Chios travel deals", "Chios travel packages", "Chios hotels offers", "Kampos view"],
      tip: "Use this code at the checkout stage.",
      couponCode: "MAY10",
      discountLabel: "First floor offer",
      bookingHref: "https://beds24.com/booking.php?propid=117813&roomid=267788&lang=en",
      roomPageHref: "/chios-rooms/standard-double-room/",
    },
    {
      id: "family-apartment",
      title: "Family Apartment",
      description:
        "A family-friendly Chios hotel offer for guests who need more space, kitchen facilities and apartment-style comfort.",
      image:
        "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
      imageAlt: "Chios hotels offer for family apartment at Voulamandis House",
      tags: ["Chios travel deals", "Chios travel packages", "Chios hotels offers", "Full kitchen"],
      tip: "Copy the code to unlock your family apartment discount.",
      couponCode: "FMAY10",
      discountLabel: "Family apartment offer",
      bookingHref:
        "https://beds24.com/booking.php?propid=117813&referer=BookingLink&roomid=265595",
      roomPageHref: "/chios-rooms/family-chios-apartments/",
    },
  ],
};