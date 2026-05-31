export type ContactPageData = {
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
  form: {
    kicker: string;
    title: string;
    subtitle: string;
    roomOptions: {
      label: string;
      value: string;
    }[];
    whatsappPhone: string;
    email: string;
    emailSubjectPrefix: string;
  };
  contactInfo: {
    title: string;
    text: string;
    items: {
      icon: string;
      label: string;
      value: string;
      href: string;
    }[];
  };
  trust: {
    title: string;
    items: {
      icon: string;
      title: string;
      text: string;
    }[];
  };
};

export const contactPageEn: ContactPageData = {
  seo: {
    canonicalPath: "/voulamandis-house-contact-us-form-fill-in-the-form/",
    title: "Contact Voulamandis House in Chios | Room Inquiry",
    description:
      "Contact Voulamandis House in Kampos, Chios. Send a room inquiry by WhatsApp or email for availability, rates and direct booking information.",
    ogImage:
      "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
  },
  hero: {
    kicker: "Contact Voulamandis House",
    title: "Send us your room inquiry",
    description:
      "Tell us your dates, room preference and travel details. We will help you choose the most suitable room or apartment for your stay in Chios.",
    image:
      "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp",
  },
  form: {
    kicker: "Voulamandis House • Chios",
    title: "Smart Inquiry Form",
    subtitle: "Send your inquiry by WhatsApp or email.",
    whatsappPhone: "306944474226",
    email: "info@chioshotel.gr",
    emailSubjectPrefix: "English Inquiry",
    roomOptions: [
      {
        label: "Economy Double Room",
        value: "Economy Double Room",
      },
      {
        label: "Ground Floor Double Room",
        value: "Ground Floor Double Room",
      },
      {
        label: "First Floor Double Room",
        value: "First Floor Double Room",
      },
      {
        label: "Family Apartment",
        value: "Family Apartment",
      },
      {
        label: "Group Booking",
        value: "Group Booking",
      },
    ],
  },
  contactInfo: {
    title: "Prefer direct contact?",
    text:
      "You can also call us directly or send your inquiry through WhatsApp. Direct communication helps us suggest the most suitable available option.",
    items: [
      {
        icon: "☎️",
        label: "Landline",
        value: "+30 22710 31733",
        href: "tel:+302271031733",
      },
      {
        icon: "📱",
        label: "Mobile",
        value: "+30 6944 474226",
        href: "tel:+306944474226",
      },
      {
        icon: "💬",
        label: "WhatsApp",
        value: "+30 6944 474226",
        href: "https://wa.me/306944474226",
      },
      {
        icon: "✉️",
        label: "Email",
        value: "info@chioshotel.gr",
        href: "mailto:info@chioshotel.gr",
      },
    ],
  },
  trust: {
    title: "Why contact us directly?",
    items: [
      {
        icon: "🏡",
        title: "Local advice",
        text: "We know the rooms, apartments and layouts, so we can guide you personally.",
      },
      {
        icon: "💶",
        title: "Direct booking clarity",
        text: "Ask about availability, rates and discount options before confirming your stay.",
      },
      {
        icon: "🌿",
        title: "Better room matching",
        text: "Tell us if you prefer ground floor, first floor, garden access or a kitchen.",
      },
    ],
  },
};