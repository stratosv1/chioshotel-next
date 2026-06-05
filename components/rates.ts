export type RatesPageData = {
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
  };
  benefits: {
    kicker: string;
    title: string;
    text: string;
    items: {
      icon: string;
      title: string;
      text: string;
    }[];
  };
  discount: {
    kicker: string;
    title: string;
    text: string;
    code: string;
    value: string;
    note: string;
  };
  booking: {
    kicker: string;
    title: string;
    text: string;
    iframeTitle: string;
    iframeSrc: string;
    fallbackHref: string;
  };
  seoCopy: {
    paragraphs: string[];
    links: {
      label: string;
      href: string;
    }[];
  };
};

export const ratesPageEn: RatesPageData = {
  seo: {
    canonicalPath: "/chios-hotels-rates/",
    title: "Direct Booking in Chios | Voulamandis House Rates",
    description:
      "Book directly at Voulamandis House in Chios. Check live availability, secure your room or apartment, and enjoy direct booking benefits.",
    ogImage:
      "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
  },
  hero: {
    kicker: "Kampos, Chios • Voulamandis House",
    title: "Direct Booking at the Best Rate",
    description:
      "Book your stay directly at Voulamandis House and enjoy the lowest available rates, exclusive perks, and a secure online booking experience in Chios.",
    image:
      "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
  },
  benefits: {
    kicker: "Direct Booking Benefits",
    title: "Save on third-party fees!",
    text:
      "By booking directly through our website, you avoid hidden intermediary platform charges and secure a more cost-effective option for your stay.",
    items: [
      {
        icon: "🛡️",
        title: "Best Rate",
        text: "No extra third-party commissions.",
      },
      {
        icon: "⚡",
        title: "Flash Deals",
        text: "Access to exclusive special offers.",
      },
      {
        icon: "🥐",
        title: "Breakfast",
        text: "Easy option to add breakfast to your stay.",
      },
      {
        icon: "💬",
        title: "Communication",
        text: "Direct and personal assistance.",
      },
    ],
  },
  discount: {
    kicker: "Flash Deal",
    title: "Unlock your discount!",
    text:
      "Use your direct booking discount code for extra savings on your online reservation, subject to availability.",
    code: "WELCOME10",
    value: "10% OFF",
    note:
      "The code is valid for direct online bookings, subject to availability and booking conditions.",
  },
  booking: {
    kicker: "Secure Booking",
    title: "Complete Your Booking",
    text:
      "Check real-time availability, choose your ideal room, and book your stay at Voulamandis House quickly and securely.",
    iframeTitle: "Direct booking at Voulamandis House, Kampos Chios",
    iframeSrc: "https://beds24.com/booking2.php?propid=117813&referer=iframe",
    fallbackHref: "https://beds24.com/booking2.php?propid=117813&referer=iframe",
  },
  seoCopy: {
    paragraphs: [
      "If you are looking for direct booking in Chios, rooms in Kampos Chios, or a traditional and welcoming place to stay with excellent value for money, Voulamandis House is one of the most authentic accommodation choices for your stay on the island.",
      "You can also explore available travel deals and special offers, learn more about the rooms at Voulamandis House, or contact us for any additional information regarding the booking process.",
    ],
    links: [
      {
        label: "travel deals and special offers",
        href: "/best-chios-travel-deals-for-chios-hotels/",
      },
      {
        label: "the rooms at Voulamandis House",
        href: "/chios-rooms/",
      },
      {
        label: "contact us",
        href: "/voulamandis-house-contact-us-form-fill-in-the-form/",
      },
    ],
  },
};