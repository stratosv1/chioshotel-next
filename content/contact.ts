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

const contactHeroImage =
  "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

const whatsappPhone = "306944474226";
const contactEmail = "info@chioshotel.gr";

export const contactPageEn: ContactPageData = {
  seo: {
    canonicalPath: "/voulamandis-house-contact-us-form-fill-in-the-form/",
    title: "Contact Voulamandis House in Chios | Room Inquiry",
    description:
      "Contact Voulamandis House in Kambos, Chios. Send a room inquiry by WhatsApp or email for availability, rates and direct booking information.",
    ogImage: contactHeroImage,
  },
  hero: {
    kicker: "Contact Voulamandis House",
    title: "Send us your room inquiry",
    description:
      "Tell us your dates, room preference and travel details. We will help you choose the most suitable room or apartment for your stay in Chios.",
    image: contactHeroImage,
  },
  form: {
    kicker: "Voulamandis House • Chios",
    title: "Smart Inquiry Form",
    subtitle: "Send your inquiry by WhatsApp or email.",
    whatsappPhone,
    email: contactEmail,
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
        value: contactEmail,
        href: `mailto:${contactEmail}`,
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

export const contactPageEl: ContactPageData = {
  seo: {
    canonicalPath: "/el/epikoinonia-voulamandis-house/",
    title: "Επικοινωνία Voulamandis House Χίος | Αίτημα",
    description:
      "Επικοινωνήστε με το Voulamandis House στον Κάμπο της Χίου. Στείλτε αίτημα διαμονής μέσω WhatsApp ή email για διαθεσιμότητα, τιμές και απευθείας κράτηση.",
    ogImage: contactHeroImage,
  },
  hero: {
    kicker: "Επικοινωνία με το Voulamandis House",
    title: "Στείλτε μας το αίτημα διαμονής σας",
    description:
      "Πείτε μας τις ημερομηνίες, την προτίμηση δωματίου και τις λεπτομέρειες του ταξιδιού σας. Θα σας βοηθήσουμε να επιλέξετε το πιο κατάλληλο δωμάτιο ή διαμέρισμα για τη διαμονή σας στη Χίο.",
    image: contactHeroImage,
  },
  form: {
    kicker: "Voulamandis House • Χίος",
    title: "Έξυπνη φόρμα ενδιαφέροντος",
    subtitle: "Στείλτε το αίτημά σας μέσω WhatsApp ή email.",
    whatsappPhone,
    email: contactEmail,
    emailSubjectPrefix: "Greek Inquiry",
    roomOptions: [
      {
        label: "Οικονομικό δίκλινο δωμάτιο",
        value: "Οικονομικό δίκλινο δωμάτιο",
      },
      {
        label: "Δίκλινο δωμάτιο ισογείου",
        value: "Δίκλινο δωμάτιο ισογείου",
      },
      {
        label: "Δίκλινο δωμάτιο πρώτου ορόφου",
        value: "Δίκλινο δωμάτιο πρώτου ορόφου",
      },
      {
        label: "Οικογενειακό διαμέρισμα",
        value: "Οικογενειακό διαμέρισμα",
      },
      {
        label: "Ομαδική κράτηση",
        value: "Ομαδική κράτηση",
      },
    ],
  },
  contactInfo: {
    title: "Προτιμάτε άμεση επικοινωνία;",
    text:
      "Μπορείτε επίσης να μας καλέσετε απευθείας ή να στείλετε το αίτημά σας μέσω WhatsApp. Η άμεση επικοινωνία μας βοηθά να σας προτείνουμε την πιο κατάλληλη διαθέσιμη επιλογή.",
    items: [
      {
        icon: "☎️",
        label: "Σταθερό",
        value: "+30 22710 31733",
        href: "tel:+302271031733",
      },
      {
        icon: "📱",
        label: "Κινητό",
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
        value: contactEmail,
        href: `mailto:${contactEmail}`,
      },
    ],
  },
  trust: {
    title: "Γιατί να επικοινωνήσετε απευθείας μαζί μας;",
    items: [
      {
        icon: "🏡",
        title: "Τοπική καθοδήγηση",
        text: "Γνωρίζουμε τα δωμάτια, τα διαμερίσματα και τη διαρρύθμισή τους, ώστε να σας καθοδηγήσουμε προσωπικά.",
      },
      {
        icon: "💶",
        title: "Ξεκάθαρη απευθείας κράτηση",
        text: "Ρωτήστε μας για διαθεσιμότητα, τιμές και επιλογές έκπτωσης πριν επιβεβαιώσετε τη διαμονή σας.",
      },
      {
        icon: "🌿",
        title: "Καλύτερη επιλογή δωματίου",
        text: "Πείτε μας αν προτιμάτε ισόγειο, πρώτο όροφο, πρόσβαση στον κήπο ή κουζίνα.",
      },
    ],
  },
};

export const contactPageFr: ContactPageData = {
  seo: {
    canonicalPath: "/fr/contactez-nous/",
    title: "Contactez Voulamandis House à Chios | Demande de séjour",
    description:
      "Contactez Voulamandis House à Kambos, Chios. Demandez disponibilité, tarifs et réservation directe par WhatsApp ou email.",
    ogImage: contactHeroImage,
  },
  hero: {
    kicker: "Contactez Voulamandis House",
    title: "Envoyez-nous votre demande de séjour",
    description:
      "Indiquez-nous vos dates, votre préférence de chambre et les détails de votre voyage. Nous vous aiderons à choisir la chambre ou l’appartement le plus adapté à votre séjour à Chios.",
    image: contactHeroImage,
  },
  form: {
    kicker: "Voulamandis House • Chios",
    title: "Formulaire de demande intelligent",
    subtitle: "Envoyez votre demande par WhatsApp ou par email.",
    whatsappPhone,
    email: contactEmail,
    emailSubjectPrefix: "French Inquiry",
    roomOptions: [
      {
        label: "Chambre double économique",
        value: "Chambre double économique",
      },
      {
        label: "Chambre double au rez-de-chaussée",
        value: "Chambre double au rez-de-chaussée",
      },
      {
        label: "Chambre double au premier étage",
        value: "Chambre double au premier étage",
      },
      {
        label: "Appartement familial",
        value: "Appartement familial",
      },
      {
        label: "Réservation de groupe",
        value: "Réservation de groupe",
      },
    ],
  },
  contactInfo: {
    title: "Vous préférez un contact direct ?",
    text:
      "Vous pouvez aussi nous appeler directement ou envoyer votre demande via WhatsApp. Un contact direct nous aide à vous proposer l’option disponible la plus adaptée.",
    items: [
      {
        icon: "☎️",
        label: "Téléphone fixe",
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
        value: contactEmail,
        href: `mailto:${contactEmail}`,
      },
    ],
  },
  trust: {
    title: "Pourquoi nous contacter directement ?",
    items: [
      {
        icon: "🏡",
        title: "Conseils locaux",
        text: "Nous connaissons les chambres, les appartements et leur disposition, ce qui nous permet de vous guider personnellement.",
      },
      {
        icon: "💶",
        title: "Réservation directe claire",
        text: "Demandez les disponibilités, les tarifs et les options de réduction avant de confirmer votre séjour.",
      },
      {
        icon: "🌿",
        title: "Meilleur choix de chambre",
        text: "Dites-nous si vous préférez le rez-de-chaussée, le premier étage, l’accès au jardin ou une cuisine.",
      },
    ],
  },
};

export const contactPageDe: ContactPageData = {
  seo: {
    canonicalPath: "/de/kontaktieren-voulamandis-house/",
    title: "Kontakt zum Voulamandis House auf Chios | Zimmeranfrage",
    description:
      "Kontaktieren Sie Voulamandis House in Kambos, Chios. Fragen Sie per WhatsApp oder E-Mail nach Verfügbarkeit, Preisen und Direktbuchung.",
    ogImage: contactHeroImage,
  },
  hero: {
    kicker: "Kontakt zum Voulamandis House",
    title: "Senden Sie uns Ihre Zimmeranfrage",
    description:
      "Teilen Sie uns Ihre Reisedaten, Zimmerwünsche und weitere Details mit. Wir helfen Ihnen, das passende Zimmer oder Apartment für Ihren Aufenthalt auf Chios zu wählen.",
    image: contactHeroImage,
  },
  form: {
    kicker: "Voulamandis House • Chios",
    title: "Intelligentes Anfrageformular",
    subtitle: "Senden Sie Ihre Anfrage per WhatsApp oder E-Mail.",
    whatsappPhone,
    email: contactEmail,
    emailSubjectPrefix: "German Inquiry",
    roomOptions: [
      {
        label: "Economy Doppelzimmer",
        value: "Economy Doppelzimmer",
      },
      {
        label: "Doppelzimmer im Erdgeschoss",
        value: "Doppelzimmer im Erdgeschoss",
      },
      {
        label: "Doppelzimmer im ersten Stock",
        value: "Doppelzimmer im ersten Stock",
      },
      {
        label: "Familienapartment",
        value: "Familienapartment",
      },
      {
        label: "Gruppenbuchung",
        value: "Gruppenbuchung",
      },
    ],
  },
  contactInfo: {
    title: "Bevorzugen Sie direkten Kontakt?",
    text:
      "Sie können uns auch direkt anrufen oder Ihre Anfrage über WhatsApp senden. Direkte Kommunikation hilft uns, Ihnen die passendste verfügbare Option vorzuschlagen.",
    items: [
      {
        icon: "☎️",
        label: "Festnetz",
        value: "+30 22710 31733",
        href: "tel:+302271031733",
      },
      {
        icon: "📱",
        label: "Mobil",
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
        label: "E-Mail",
        value: contactEmail,
        href: `mailto:${contactEmail}`,
      },
    ],
  },
  trust: {
    title: "Warum direkt mit uns Kontakt aufnehmen?",
    items: [
      {
        icon: "🏡",
        title: "Lokale Beratung",
        text: "Wir kennen die Zimmer, Apartments und Grundrisse und können Sie persönlich beraten.",
      },
      {
        icon: "💶",
        title: "Klare Direktbuchung",
        text: "Fragen Sie nach Verfügbarkeit, Preisen und Rabattmöglichkeiten, bevor Sie Ihren Aufenthalt bestätigen.",
      },
      {
        icon: "🌿",
        title: "Bessere Zimmerauswahl",
        text: "Sagen Sie uns, ob Sie Erdgeschoss, ersten Stock, Gartenzugang oder eine Küche bevorzugen.",
      },
    ],
  },
};

export const contactPageIt: ContactPageData = {
  seo: {
    canonicalPath: "/it/contattaci-voulamandis-house/",
    title: "Contatta Voulamandis House a Chios | Richiesta camera",
    description:
      "Contatta Voulamandis House a Kambos, Chios. Invia una richiesta via WhatsApp o email per disponibilità, tariffe e informazioni sulla prenotazione diretta.",
    ogImage: contactHeroImage,
  },
  hero: {
    kicker: "Contatta Voulamandis House",
    title: "Inviaci la tua richiesta di soggiorno",
    description:
      "Indicaci le date, la camera preferita e i dettagli del viaggio. Ti aiuteremo a scegliere la camera o l’appartamento più adatto al tuo soggiorno a Chios.",
    image: contactHeroImage,
  },
  form: {
    kicker: "Voulamandis House • Chios",
    title: "Modulo di richiesta intelligente",
    subtitle: "Invia la tua richiesta via WhatsApp o email.",
    whatsappPhone,
    email: contactEmail,
    emailSubjectPrefix: "Italian Inquiry",
    roomOptions: [
      {
        label: "Camera doppia economy",
        value: "Camera doppia economy",
      },
      {
        label: "Camera doppia al piano terra",
        value: "Camera doppia al piano terra",
      },
      {
        label: "Camera doppia al primo piano",
        value: "Camera doppia al primo piano",
      },
      {
        label: "Appartamento familiare",
        value: "Appartamento familiare",
      },
      {
        label: "Prenotazione di gruppo",
        value: "Prenotazione di gruppo",
      },
    ],
  },
  contactInfo: {
    title: "Preferisci un contatto diretto?",
    text:
      "Puoi anche chiamarci direttamente o inviare la tua richiesta tramite WhatsApp. La comunicazione diretta ci aiuta a suggerirti l’opzione disponibile più adatta.",
    items: [
      {
        icon: "☎️",
        label: "Telefono fisso",
        value: "+30 22710 31733",
        href: "tel:+302271031733",
      },
      {
        icon: "📱",
        label: "Cellulare",
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
        value: contactEmail,
        href: `mailto:${contactEmail}`,
      },
    ],
  },
  trust: {
    title: "Perché contattarci direttamente?",
    items: [
      {
        icon: "🏡",
        title: "Consigli locali",
        text: "Conosciamo le camere, gli appartamenti e le disposizioni, quindi possiamo guidarti personalmente.",
      },
      {
        icon: "💶",
        title: "Chiarezza sulla prenotazione diretta",
        text: "Chiedi disponibilità, tariffe e opzioni di sconto prima di confermare il soggiorno.",
      },
      {
        icon: "🌿",
        title: "Migliore scelta della camera",
        text: "Dicci se preferisci piano terra, primo piano, accesso al giardino o cucina.",
      },
    ],
  },
};

export const contactPageEs: ContactPageData = {
  seo: {
    canonicalPath: "/es/contacta-con-voulamandis-house/",
    title: "Contacto Voulamandis House Chios | Consulta",
    description:
      "Contacta con Voulamandis House en Kambos, Chios. Envía una consulta por WhatsApp o email para disponibilidad, tarifas e información de reserva directa.",
    ogImage: contactHeroImage,
  },
  hero: {
    kicker: "Contacta con Voulamandis House",
    title: "Envíanos tu consulta de alojamiento",
    description:
      "Cuéntanos tus fechas, preferencia de habitación y detalles del viaje. Te ayudaremos a elegir la habitación o apartamento más adecuado para tu estancia en Chios.",
    image: contactHeroImage,
  },
  form: {
    kicker: "Voulamandis House • Chios",
    title: "Formulario inteligente de consulta",
    subtitle: "Envía tu consulta por WhatsApp o email.",
    whatsappPhone,
    email: contactEmail,
    emailSubjectPrefix: "Spanish Inquiry",
    roomOptions: [
      {
        label: "Habitación doble económica",
        value: "Habitación doble económica",
      },
      {
        label: "Habitación doble en planta baja",
        value: "Habitación doble en planta baja",
      },
      {
        label: "Habitación doble en primera planta",
        value: "Habitación doble en primera planta",
      },
      {
        label: "Apartamento familiar",
        value: "Apartamento familiar",
      },
      {
        label: "Reserva de grupo",
        value: "Reserva de grupo",
      },
    ],
  },
  contactInfo: {
    title: "¿Prefieres contacto directo?",
    text:
      "También puedes llamarnos directamente o enviar tu consulta por WhatsApp. La comunicación directa nos ayuda a sugerirte la opción disponible más adecuada.",
    items: [
      {
        icon: "☎️",
        label: "Teléfono fijo",
        value: "+30 22710 31733",
        href: "tel:+302271031733",
      },
      {
        icon: "📱",
        label: "Móvil",
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
        value: contactEmail,
        href: `mailto:${contactEmail}`,
      },
    ],
  },
  trust: {
    title: "¿Por qué contactarnos directamente?",
    items: [
      {
        icon: "🏡",
        title: "Consejos locales",
        text: "Conocemos las habitaciones, apartamentos y distribuciones, por eso podemos orientarte personalmente.",
      },
      {
        icon: "💶",
        title: "Claridad en la reserva directa",
        text: "Pregunta por disponibilidad, tarifas y opciones de descuento antes de confirmar tu estancia.",
      },
      {
        icon: "🌿",
        title: "Mejor elección de habitación",
        text: "Dinos si prefieres planta baja, primera planta, acceso al jardín o cocina.",
      },
    ],
  },
};

export const contactPageTr: ContactPageData = {
  seo: {
    canonicalPath: "/tr/sakiz-adasi-otelleri-ile-iletisim/",
    title: "Sakız Adası Voulamandis House İletişim | Oda Talebi",
    description:
      "Kambos, Sakız Adası’ndaki Voulamandis House ile iletişime geçin. Müsaitlik, fiyatlar ve direkt rezervasyon için WhatsApp veya e-posta kullanın.",
    ogImage: contactHeroImage,
  },
  hero: {
    kicker: "Voulamandis House iletişim",
    title: "Konaklama talebinizi bize gönderin",
    description:
      "Tarihlerinizi, oda tercihinizi ve seyahat detaylarınızı bize iletin. Sakız Adası konaklamanız için en uygun oda veya daireyi seçmenize yardımcı olalım.",
    image: contactHeroImage,
  },
  form: {
    kicker: "Voulamandis House • Sakız Adası",
    title: "Akıllı talep formu",
    subtitle: "Talebinizi WhatsApp veya e-posta ile gönderin.",
    whatsappPhone,
    email: contactEmail,
    emailSubjectPrefix: "Turkish Inquiry",
    roomOptions: [
      {
        label: "Ekonomi çift kişilik oda",
        value: "Ekonomi çift kişilik oda",
      },
      {
        label: "Zemin kat çift kişilik oda",
        value: "Zemin kat çift kişilik oda",
      },
      {
        label: "Birinci kat çift kişilik oda",
        value: "Birinci kat çift kişilik oda",
      },
      {
        label: "Aile dairesi",
        value: "Aile dairesi",
      },
      {
        label: "Grup rezervasyonu",
        value: "Grup rezervasyonu",
      },
    ],
  },
  contactInfo: {
    title: "Doğrudan iletişim mi tercih edersiniz?",
    text:
      "Bizi doğrudan arayabilir veya talebinizi WhatsApp üzerinden gönderebilirsiniz. Doğrudan iletişim, size en uygun müsait seçeneği önermemize yardımcı olur.",
    items: [
      {
        icon: "☎️",
        label: "Sabit telefon",
        value: "+30 22710 31733",
        href: "tel:+302271031733",
      },
      {
        icon: "📱",
        label: "Mobil",
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
        label: "E-posta",
        value: contactEmail,
        href: `mailto:${contactEmail}`,
      },
    ],
  },
  trust: {
    title: "Neden doğrudan bizimle iletişime geçmelisiniz?",
    items: [
      {
        icon: "🏡",
        title: "Yerel tavsiye",
        text: "Odaları, daireleri ve yerleşimlerini biliyoruz; bu yüzden size kişisel olarak yardımcı olabiliriz.",
      },
      {
        icon: "💶",
        title: "Net direkt rezervasyon",
        text: "Konaklamanızı onaylamadan önce müsaitlik, fiyatlar ve indirim seçenekleri hakkında bilgi alın.",
      },
      {
        icon: "🌿",
        title: "Daha uygun oda seçimi",
        text: "Zemin kat, birinci kat, bahçe erişimi veya mutfak tercihlerinizi bize söyleyin.",
      },
    ],
  },
};

export const localizedContactPages = [
  contactPageEn,
  contactPageEl,
  contactPageFr,
  contactPageDe,
  contactPageIt,
  contactPageEs,
  contactPageTr,
];

export function getLocalizedContactPageByPath(
  path: string,
): ContactPageData | undefined {
  return localizedContactPages.find((page) => page.seo.canonicalPath === path);
}