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

const bookingIframeSrc =
  "https://beds24.com/booking2.php?propid=117813&referer=iframe";

const ratesHeroImage =
  "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

export const ratesPageEn: RatesPageData = {
  seo: {
    canonicalPath: "/chios-hotels-rates/",
    title: "Direct Booking in Chios | Voulamandis House Rates",
    description:
      "Book directly at Voulamandis House in Chios. Check live availability, secure your room or apartment, and enjoy direct booking benefits.",
    ogImage: ratesHeroImage,
  },
  hero: {
    kicker: "Kambos, Chios • Voulamandis House",
    title: "Direct Booking at the Best Rate",
    description:
      "Book your stay directly at Voulamandis House and enjoy the lowest available rates, exclusive perks, and a secure online booking experience in Chios.",
    image: ratesHeroImage,
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
    iframeTitle: "Direct booking at Voulamandis House, Kambos Chios",
    iframeSrc: bookingIframeSrc,
    fallbackHref: bookingIframeSrc,
  },
  seoCopy: {
    paragraphs: [
      "If you are looking for direct booking in Chios, rooms in Kambos Chios, or a traditional and welcoming place to stay with excellent value for money, Voulamandis House is one of the most authentic accommodation choices for your stay on the island.",
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

export const ratesPageEl: RatesPageData = {
  seo: {
    canonicalPath: "/el/amesi-kratisi-voulamandis-house/",
    title: "Άμεση Κράτηση στη Χίο | Τιμές Voulamandis House",
    description:
      "Κάντε απευθείας κράτηση στο Voulamandis House στη Χίο. Δείτε διαθεσιμότητα, επιλέξτε δωμάτιο και κερδίστε direct booking πλεονεκτήματα.",
    ogImage: ratesHeroImage,
  },
  hero: {
    kicker: "Κάμπος, Χίος • Voulamandis House",
    title: "Άμεση κράτηση στην καλύτερη διαθέσιμη τιμή",
    description:
      "Κλείστε απευθείας τη διαμονή σας στο Voulamandis House και απολαύστε τις καλύτερες διαθέσιμες τιμές, αποκλειστικά προνόμια και ασφαλή online κράτηση στη Χίο.",
    image: ratesHeroImage,
  },
  benefits: {
    kicker: "Πλεονεκτήματα άμεσης κράτησης",
    title: "Κερδίστε από την απευθείας κράτηση!",
    text:
      "Κάνοντας κράτηση απευθείας από την ιστοσελίδα μας, αποφεύγετε επιπλέον χρεώσεις τρίτων πλατφορμών και εξασφαλίζετε μια πιο συμφέρουσα επιλογή για τη διαμονή σας.",
    items: [
      {
        icon: "🛡️",
        title: "Καλύτερη τιμή",
        text: "Χωρίς επιπλέον προμήθειες τρίτων πλατφορμών.",
      },
      {
        icon: "⚡",
        title: "Ειδικές προσφορές",
        text: "Πρόσβαση σε αποκλειστικές προσφορές.",
      },
      {
        icon: "🥐",
        title: "Πρωινό",
        text: "Εύκολη επιλογή για προσθήκη πρωινού στη διαμονή σας.",
      },
      {
        icon: "💬",
        title: "Επικοινωνία",
        text: "Άμεση και προσωπική εξυπηρέτηση.",
      },
    ],
  },
  discount: {
    kicker: "Προσφορά",
    title: "Ξεκλειδώστε την έκπτωσή σας!",
    text:
      "Χρησιμοποιήστε τον εκπτωτικό κωδικό άμεσης κράτησης για επιπλέον όφελος στην online κράτησή σας, ανάλογα με τη διαθεσιμότητα.",
    code: "WELCOME10",
    value: "10% ΕΚΠΤΩΣΗ",
    note:
      "Ο κωδικός ισχύει για απευθείας online κρατήσεις, ανάλογα με τη διαθεσιμότητα και τους όρους κράτησης.",
  },
  booking: {
    kicker: "Ασφαλής κράτηση",
    title: "Ολοκληρώστε την κράτησή σας",
    text:
      "Ελέγξτε τη διαθεσιμότητα σε πραγματικό χρόνο, επιλέξτε το ιδανικό δωμάτιο και κάντε γρήγορα και με ασφάλεια την κράτησή σας στο Voulamandis House.",
    iframeTitle: "Άμεση κράτηση στο Voulamandis House, Κάμπος Χίου",
    iframeSrc: bookingIframeSrc,
    fallbackHref: bookingIframeSrc,
  },
  seoCopy: {
    paragraphs: [
      "Αν αναζητάτε άμεση κράτηση στη Χίο, δωμάτια στον Κάμπο Χίου ή έναν παραδοσιακό και φιλόξενο χώρο διαμονής με πολύ καλή σχέση ποιότητας και τιμής, το Voulamandis House είναι μια αυθεντική επιλογή για τη διαμονή σας στο νησί.",
      "Μπορείτε επίσης να δείτε διαθέσιμες προσφορές, να μάθετε περισσότερα για τα δωμάτια του Voulamandis House ή να επικοινωνήσετε μαζί μας για οποιαδήποτε πληροφορία σχετικά με τη διαδικασία κράτησης.",
    ],
    links: [
      {
        label: "προσφορές διαμονής",
        href: "/el/crazy-travel-deals-for-chios-hotels/",
      },
      {
        label: "τα δωμάτια του Voulamandis House",
        href: "/el/domatia-xios/",
      },
      {
        label: "επικοινωνήστε μαζί μας",
        href: "/el/epikoinonia-voulamandis-house/",
      },
    ],
  },
};

export const ratesPageFr: RatesPageData = {
  seo: {
    canonicalPath: "/fr/tarifs-des-hotels-a-chios/",
    title: "Réservation directe à Chios | Tarifs Voulamandis House",
    description:
      "Réservez en direct à Voulamandis House à Chios. Consultez les disponibilités, choisissez votre chambre et profitez des avantages de réservation directe.",
    ogImage: ratesHeroImage,
  },
  hero: {
    kicker: "Kambos, Chios • Voulamandis House",
    title: "Réservez directement au meilleur tarif",
    description:
      "Réservez votre séjour directement à Voulamandis House et profitez des meilleurs tarifs disponibles, d’avantages exclusifs et d’une réservation en ligne sécurisée à Chios.",
    image: ratesHeroImage,
  },
  benefits: {
    kicker: "Avantages de la réservation directe",
    title: "Économisez sur les frais des plateformes !",
    text:
      "En réservant directement sur notre site, vous évitez les frais cachés des plateformes intermédiaires et choisissez une option plus avantageuse pour votre séjour.",
    items: [
      {
        icon: "🛡️",
        title: "Meilleur tarif",
        text: "Aucune commission supplémentaire de plateforme tierce.",
      },
      {
        icon: "⚡",
        title: "Offres spéciales",
        text: "Accès à des offres exclusives.",
      },
      {
        icon: "🥐",
        title: "Petit-déjeuner",
        text: "Possibilité simple d’ajouter le petit-déjeuner à votre séjour.",
      },
      {
        icon: "💬",
        title: "Communication",
        text: "Assistance directe et personnalisée.",
      },
    ],
  },
  discount: {
    kicker: "Offre spéciale",
    title: "Débloquez votre réduction !",
    text:
      "Utilisez votre code de réduction pour bénéficier d’économies supplémentaires sur votre réservation en ligne, selon disponibilité.",
    code: "WELCOME10",
    value: "10% DE RÉDUCTION",
    note:
      "Le code est valable pour les réservations directes en ligne, sous réserve de disponibilité et des conditions de réservation.",
  },
  booking: {
    kicker: "Réservation sécurisée",
    title: "Finalisez votre réservation",
    text:
      "Consultez les disponibilités en temps réel, choisissez la chambre idéale et réservez votre séjour à Voulamandis House rapidement et en toute sécurité.",
    iframeTitle: "Réservation directe à Voulamandis House, Kambos Chios",
    iframeSrc: bookingIframeSrc,
    fallbackHref: bookingIframeSrc,
  },
  seoCopy: {
    paragraphs: [
      "Si vous recherchez une réservation directe à Chios, des chambres à Kambos Chios ou un lieu de séjour traditionnel et accueillant avec un excellent rapport qualité-prix, Voulamandis House est l’un des choix d’hébergement les plus authentiques de l’île.",
      "Vous pouvez également découvrir nos offres de voyage, en savoir plus sur les chambres de Voulamandis House ou nous contacter pour toute information complémentaire concernant la réservation.",
    ],
    links: [
      {
        label: "offres de voyage et promotions",
        href: "/fr/offres-de-voyage-pour-les-hotels-a-chios/",
      },
      {
        label: "les chambres de Voulamandis House",
        href: "/fr/chambres-a-chios/",
      },
      {
        label: "nous contacter",
        href: "/fr/contactez-nous/",
      },
    ],
  },
};

export const ratesPageDe: RatesPageData = {
  seo: {
    canonicalPath: "/de/hotelpreise-auf-der-insel-chios/",
    title: "Direktbuchung auf Chios | Preise Voulamandis House",
    description:
      "Buchen Sie direkt im Voulamandis House auf Chios. Prüfen Sie Verfügbarkeit, wählen Sie Ihr Zimmer und nutzen Sie Direktbuchungsvorteile.",
    ogImage: ratesHeroImage,
  },
  hero: {
    kicker: "Kambos, Chios • Voulamandis House",
    title: "Direkt zum besten verfügbaren Preis buchen",
    description:
      "Buchen Sie Ihren Aufenthalt direkt im Voulamandis House und profitieren Sie von den besten verfügbaren Preisen, exklusiven Vorteilen und einer sicheren Online-Buchung auf Chios.",
    image: ratesHeroImage,
  },
  benefits: {
    kicker: "Vorteile der Direktbuchung",
    title: "Sparen Sie Gebühren von Drittanbietern!",
    text:
      "Wenn Sie direkt über unsere Website buchen, vermeiden Sie zusätzliche Gebühren von Vermittlungsplattformen und sichern sich eine kostengünstigere Option für Ihren Aufenthalt.",
    items: [
      {
        icon: "🛡️",
        title: "Bester Preis",
        text: "Keine zusätzlichen Provisionen von Drittanbietern.",
      },
      {
        icon: "⚡",
        title: "Sonderangebote",
        text: "Zugang zu exklusiven Angeboten.",
      },
      {
        icon: "🥐",
        title: "Frühstück",
        text: "Einfache Möglichkeit, Frühstück zu Ihrem Aufenthalt hinzuzufügen.",
      },
      {
        icon: "💬",
        title: "Kommunikation",
        text: "Direkte und persönliche Unterstützung.",
      },
    ],
  },
  discount: {
    kicker: "Sonderangebot",
    title: "Schalten Sie Ihren Rabatt frei!",
    text:
      "Verwenden Sie Ihren Direktbuchungs-Rabattcode für zusätzliche Ersparnisse bei Ihrer Online-Reservierung, je nach Verfügbarkeit.",
    code: "WELCOME10",
    value: "10% RABATT",
    note:
      "Der Code gilt für direkte Online-Buchungen, vorbehaltlich Verfügbarkeit und Buchungsbedingungen.",
  },
  booking: {
    kicker: "Sichere Buchung",
    title: "Schließen Sie Ihre Buchung ab",
    text:
      "Prüfen Sie die Verfügbarkeit in Echtzeit, wählen Sie Ihr ideales Zimmer und buchen Sie Ihren Aufenthalt im Voulamandis House schnell und sicher.",
    iframeTitle: "Direktbuchung im Voulamandis House, Kambos Chios",
    iframeSrc: bookingIframeSrc,
    fallbackHref: bookingIframeSrc,
  },
  seoCopy: {
    paragraphs: [
      "Wenn Sie eine Direktbuchung auf Chios, Zimmer in Kambos Chios oder eine traditionelle und gastfreundliche Unterkunft mit sehr gutem Preis-Leistungs-Verhältnis suchen, ist Voulamandis House eine der authentischsten Unterkünfte für Ihren Aufenthalt auf der Insel.",
      "Sie können außerdem verfügbare Reiseangebote entdecken, mehr über die Zimmer im Voulamandis House erfahren oder uns für weitere Informationen zum Buchungsprozess kontaktieren.",
    ],
    links: [
      {
        label: "Reiseangebote und Sonderaktionen",
        href: "/de/beste-reiseangebote-fur-chios-hotels-auf-chios/",
      },
      {
        label: "die Zimmer im Voulamandis House",
        href: "/de/chios-zimmer/",
      },
      {
        label: "Kontakt aufnehmen",
        href: "/de/kontaktieren-voulamandis-house/",
      },
    ],
  },
};

export const ratesPageIt: RatesPageData = {
  seo: {
    canonicalPath: "/it/prezzi-hotel-chios/",
    title: "Prenotazione diretta a Chios | Tariffe Voulamandis House",
    description:
      "Prenota direttamente al Voulamandis House a Chios. Controlla la disponibilità, scegli la camera e approfitta dei vantaggi della prenotazione diretta.",
    ogImage: ratesHeroImage,
  },
  hero: {
    kicker: "Kambos, Chios • Voulamandis House",
    title: "Prenota direttamente alla migliore tariffa",
    description:
      "Prenota il tuo soggiorno direttamente al Voulamandis House e approfitta delle migliori tariffe disponibili, di vantaggi esclusivi e di una prenotazione online sicura a Chios.",
    image: ratesHeroImage,
  },
  benefits: {
    kicker: "Vantaggi della prenotazione diretta",
    title: "Risparmia sulle commissioni delle piattaforme!",
    text:
      "Prenotando direttamente dal nostro sito, eviti costi nascosti delle piattaforme intermediarie e ottieni una soluzione più conveniente per il tuo soggiorno.",
    items: [
      {
        icon: "🛡️",
        title: "Migliore tariffa",
        text: "Nessuna commissione aggiuntiva di terze parti.",
      },
      {
        icon: "⚡",
        title: "Offerte speciali",
        text: "Accesso a promozioni esclusive.",
      },
      {
        icon: "🥐",
        title: "Colazione",
        text: "Possibilità semplice di aggiungere la colazione al soggiorno.",
      },
      {
        icon: "💬",
        title: "Comunicazione",
        text: "Assistenza diretta e personale.",
      },
    ],
  },
  discount: {
    kicker: "Offerta speciale",
    title: "Sblocca il tuo sconto!",
    text:
      "Usa il codice sconto per la prenotazione diretta e risparmia sulla tua prenotazione online, in base alla disponibilità.",
    code: "WELCOME10",
    value: "10% DI SCONTO",
    note:
      "Il codice è valido per le prenotazioni dirette online, soggette a disponibilità e condizioni di prenotazione.",
  },
  booking: {
    kicker: "Prenotazione sicura",
    title: "Completa la tua prenotazione",
    text:
      "Controlla la disponibilità in tempo reale, scegli la camera ideale e prenota il tuo soggiorno al Voulamandis House in modo rapido e sicuro.",
    iframeTitle: "Prenotazione diretta al Voulamandis House, Kambos Chios",
    iframeSrc: bookingIframeSrc,
    fallbackHref: bookingIframeSrc,
  },
  seoCopy: {
    paragraphs: [
      "Se cerchi una prenotazione diretta a Chios, camere a Kambos Chios o un luogo tradizionale e accogliente dove soggiornare con un ottimo rapporto qualità-prezzo, Voulamandis House è una delle scelte più autentiche dell’isola.",
      "Puoi anche scoprire offerte di viaggio e promozioni, conoscere meglio le camere del Voulamandis House o contattarci per qualsiasi informazione sulla procedura di prenotazione.",
    ],
    links: [
      {
        label: "offerte di viaggio e promozioni",
        href: "/it/offerte-di-viaggio-hotels-chios/",
      },
      {
        label: "le camere del Voulamandis House",
        href: "/it/camere-a-chios/",
      },
      {
        label: "contattaci",
        href: "/it/contattaci-voulamandis-house/",
      },
    ],
  },
};

export const ratesPageEs: RatesPageData = {
  seo: {
    canonicalPath: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    title: "Reserva directa en Chios | Tarifas Voulamandis House",
    description:
      "Reserva directamente en Voulamandis House en Chios. Consulta disponibilidad, elige tu habitación y disfruta ventajas de reserva directa.",
    ogImage: ratesHeroImage,
  },
  hero: {
    kicker: "Kambos, Chios • Voulamandis House",
    title: "Reserva directa al mejor precio",
    description:
      "Reserva tu estancia directamente en Voulamandis House y disfruta de las mejores tarifas disponibles, ventajas exclusivas y una reserva online segura en Chios.",
    image: ratesHeroImage,
  },
  benefits: {
    kicker: "Ventajas de reservar directamente",
    title: "Ahorra en comisiones de plataformas externas",
    text:
      "Al reservar directamente desde nuestra web, evitas cargos ocultos de plataformas intermediarias y consigues una opción más rentable para tu estancia.",
    items: [
      {
        icon: "🛡️",
        title: "Mejor tarifa",
        text: "Sin comisiones adicionales de terceros.",
      },
      {
        icon: "⚡",
        title: "Ofertas especiales",
        text: "Acceso a promociones exclusivas.",
      },
      {
        icon: "🥐",
        title: "Desayuno",
        text: "Opción sencilla para añadir desayuno a tu estancia.",
      },
      {
        icon: "💬",
        title: "Comunicación",
        text: "Asistencia directa y personalizada.",
      },
    ],
  },
  discount: {
    kicker: "Oferta especial",
    title: "Desbloquea tu descuento",
    text:
      "Usa tu código de descuento de reserva directa para ahorrar más en tu reserva online, según disponibilidad.",
    code: "WELCOME10",
    value: "10% DE DESCUENTO",
    note:
      "El código es válido para reservas directas online, sujeto a disponibilidad y condiciones de reserva.",
  },
  booking: {
    kicker: "Reserva segura",
    title: "Completa tu reserva",
    text:
      "Consulta la disponibilidad en tiempo real, elige la habitación ideal y reserva tu estancia en Voulamandis House de forma rápida y segura.",
    iframeTitle: "Reserva directa en Voulamandis House, Kambos Chios",
    iframeSrc: bookingIframeSrc,
    fallbackHref: bookingIframeSrc,
  },
  seoCopy: {
    paragraphs: [
      "Si buscas reserva directa en Chios, habitaciones en Kambos Chios o un alojamiento tradicional y acogedor con una excelente relación calidad-precio, Voulamandis House es una de las opciones más auténticas para tu estancia en la isla.",
      "También puedes explorar ofertas de viaje y promociones, conocer mejor las habitaciones de Voulamandis House o contactarnos para cualquier información adicional sobre el proceso de reserva.",
    ],
    links: [
      {
        label: "ofertas de viaje y promociones",
        href: "/es/mejores-ofertas-de-viaje-a-quios-para-hoteles-en-quios/",
      },
      {
        label: "las habitaciones de Voulamandis House",
        href: "/es/habitaciones-en-chios/",
      },
      {
        label: "contacta con nosotros",
        href: "/es/contacta-con-voulamandis-house/",
      },
    ],
  },
};

export const ratesPageTr: RatesPageData = {
  seo: {
    canonicalPath: "/tr/sakiz-adasi-rezervasyon/",
    title: "Sakız Adası Direkt Rezervasyon | Voulamandis House Fiyatları",
    description:
      "Sakız Adası’ndaki Voulamandis House için direkt rezervasyon yapın. Müsaitliği kontrol edin, odanızı seçin ve avantajlardan yararlanın.",
    ogImage: ratesHeroImage,
  },
  hero: {
    kicker: "Kambos, Sakız Adası • Voulamandis House",
    title: "En iyi fiyatla doğrudan rezervasyon",
    description:
      "Voulamandis House konaklamanızı doğrudan rezerve edin; en iyi mevcut fiyatlardan, özel avantajlardan ve Sakız Adası’nda güvenli online rezervasyondan yararlanın.",
    image: ratesHeroImage,
  },
  benefits: {
    kicker: "Direkt rezervasyon avantajları",
    title: "Aracı platform ücretlerinden tasarruf edin!",
    text:
      "Web sitemiz üzerinden doğrudan rezervasyon yaptığınızda, aracı platformların ek ücretlerinden kaçınır ve konaklamanız için daha ekonomik bir seçenek elde edersiniz.",
    items: [
      {
        icon: "🛡️",
        title: "En iyi fiyat",
        text: "Üçüncü taraf komisyonu yok.",
      },
      {
        icon: "⚡",
        title: "Özel fırsatlar",
        text: "Özel kampanyalara erişim.",
      },
      {
        icon: "🥐",
        title: "Kahvaltı",
        text: "Konaklamanıza kolayca kahvaltı ekleme seçeneği.",
      },
      {
        icon: "💬",
        title: "İletişim",
        text: "Doğrudan ve kişisel destek.",
      },
    ],
  },
  discount: {
    kicker: "Özel fırsat",
    title: "İndiriminizi kullanın!",
    text:
      "Müsaitliğe bağlı olarak online rezervasyonunuzda ekstra tasarruf için direkt rezervasyon indirim kodunuzu kullanın.",
    code: "WELCOME10",
    value: "%10 İNDİRİM",
    note:
      "Kod, müsaitlik ve rezervasyon koşullarına bağlı olarak doğrudan online rezervasyonlarda geçerlidir.",
  },
  booking: {
    kicker: "Güvenli rezervasyon",
    title: "Rezervasyonunuzu tamamlayın",
    text:
      "Canlı müsaitliği kontrol edin, size en uygun odayı seçin ve Voulamandis House konaklamanızı hızlı ve güvenli şekilde rezerve edin.",
    iframeTitle: "Voulamandis House, Kambos Sakız Adası direkt rezervasyon",
    iframeSrc: bookingIframeSrc,
    fallbackHref: bookingIframeSrc,
  },
  seoCopy: {
    paragraphs: [
      "Sakız Adası’nda direkt rezervasyon, Kambos bölgesinde odalar veya iyi fiyat-performans sunan geleneksel ve samimi bir konaklama arıyorsanız, Voulamandis House adadaki en otantik konaklama seçeneklerinden biridir.",
      "Ayrıca seyahat fırsatlarını ve özel teklifleri inceleyebilir, Voulamandis House odaları hakkında daha fazla bilgi alabilir veya rezervasyon süreciyle ilgili ek bilgi için bizimle iletişime geçebilirsiniz.",
    ],
    links: [
      {
        label: "seyahat fırsatları ve özel teklifler",
        href: "/tr/sakiz-adasi-otel-firsatlari/",
      },
      {
        label: "Voulamandis House odaları",
        href: "/tr/sakiz-adasi-odalari/",
      },
      {
        label: "bizimle iletişime geçin",
        href: "/tr/sakiz-adasi-otelleri-ile-iletisim/",
      },
    ],
  },
};

export const localizedRatesPages = [
  ratesPageEn,
  ratesPageEl,
  ratesPageFr,
  ratesPageDe,
  ratesPageIt,
  ratesPageEs,
  ratesPageTr,
];

export function getLocalizedRatesPageByPath(
  path: string,
): RatesPageData | undefined {
  return localizedRatesPages.find((page) => page.seo.canonicalPath === path);
}