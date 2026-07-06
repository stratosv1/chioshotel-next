import type { LanguageCode } from "@/lib/languages";

export type WelcomeButton = {
  label: string;
  href: string;
  variant?: "gold" | "green" | "blue" | "dark";
  external?: boolean;
};

export type WelcomeItem = {
  title: string;
  text: string[];
  button?: WelcomeButton;
};

export type WelcomePageCopy = {
  locale: LanguageCode;
  seo: {
    canonicalPath: string;
    title: string;
    description: string;
    ogImage: string;
  };
  nav: {
    languageLabel: string;
    homeLabel: string;
  };
  hero: {
    badge: string;
    title: string;
    text: string;
  };
  quick: {
    title: string;
    text: string;
    whatsapp: string;
    call: string;
    wifi: string;
    breakfast: string;
    delivery: string;
    rules: string;
  };
  sections: {
    welcome: { title: string; paragraphs: string[]; highlight: string; hashtags: string; instagram: string; offers: string };
    wifi: { title: string; intro: string; cards: WelcomeItem[] };
    breakfast: { title: string; intro: string; paragraphs: string[]; highlight: string; button: string };
    delivery: { title: string; intro: string; important: string[]; accountIntro: string; items: WelcomeItem[] };
    nearby: { title: string; intro: string; paragraphs: string[]; items: WelcomeItem[]; tip: string };
    podcast: { title: string; paragraphs: string[]; highlight: string };
    marmalade: { title: string; paragraphs: string[]; highlight: string; items: WelcomeItem[]; thanks: string; button: string; localProducts: string };
    rules: { title: string; intro: string; items: WelcomeItem[]; thanks: string };
    contact: { title: string; intro: string; whatsapp: string; call: string; email: string; note: string };
  };
  footer: string;
};

export const welcomeImages = {
  hero: "/images/welcome/voulamandis-welcome-hero.svg",
  breakfast: "/images/welcome/voulamandis-breakfast.svg",
};

export const welcomeContact = {
  phoneDisplay: "+30 694 447 4226",
  phoneHref: "tel:+306944474226",
  whatsappDisplay: "+30 694 447 4226",
  whatsappBase: "https://wa.me/306944474226",
  email: "info@chioshotel.gr",
  emailHref: "mailto:info@chioshotel.gr",
};

const breakfastApp: WelcomeItem = {
  title: "📱 Download the App",
  text: ["Download the Fagi app and use the login details above to place your order."],
  button: {
    label: "📱 Download Fagi App",
    href: "https://play.google.com/store/apps/details?id=com.fagi.fagi.gr&hl=el",
    external: true,
  },
};

const coffeeKafemania: WelcomeItem = {
  title: "☕ Coffee Orders",
  text: ["For coffee delivery, you can call KAFEMANIA.", "Phone: 2271 033417"],
  button: { label: "📞 Call KAFEMANIA", href: "tel:+302271033417", variant: "blue" },
};

const coffeeStasi: WelcomeItem = {
  title: "🥪 Coffee & Sandwiches",
  text: ["For coffee and sandwiches, you can contact STASI.", "Phone: 2271 021256"],
  button: { label: "📞 Call STASI", href: "tel:+302271021256", variant: "blue" },
};

const common = {
  deliveryItems: [
    {
      title: "👤 Fagi Login Details",
      text: ["Username: vhouse.reservations@gmail.com", "Password: chioshotel.gr"],
    },
    breakfastApp,
    coffeeKafemania,
    coffeeStasi,
  ],
  nearbyItems: [
    {
      title: "🍽️ Taverns",
      text: ["In Thymiana, you will find two lovely taverns, Karouli and Kapilio, where you can enjoy a relaxed lunch or dinner."],
    },
    {
      title: "🛒 Everyday Essentials",
      text: ["The village also has two pharmacies, a bakery, and a local grocery store."],
    },
  ],
  marmaladeItems: [
    { title: "🍊 Mandarin Marmalade", text: ["Made from Chios mandarins collected from our estate, with a sweet and authentic citrus flavor."] },
    { title: "🌿 Bergamot Marmalade", text: ["An exceptional marmalade with a unique, elegant aroma and a distinctive Chios character."] },
    { title: "🍋 Lemon Marmalade", text: ["Fresh, bright, and aromatic, perfect for those who love the taste of lemon."] },
    { title: "🎁 A Taste of Chios", text: ["A lovely gift or souvenir to take home and remember your stay at Voulamandis House."] },
  ],
  ruleItems: [
    { title: "❄️ Air Conditioning", text: ["Please switch off the air conditioner before leaving your room."] },
    { title: "🔌 Electrical Appliances", text: ["Please make sure all electrical appliances are turned off before leaving the room."] },
    { title: "🚪 External Door", text: ["When leaving the premises, please securely close the external door of the guesthouse."] },
    { title: "🚽 Toilet Use", text: ["Please do not dispose of paper or other items in the toilet. Use the bin provided."] },
    { title: "🚗 Parking", text: ["When parking, please keep a distance of at least 2 meters from the DEI / Public Power Corporation column."] },
    { title: "🧴 Makeup & Towels", text: ["Please avoid removing makeup with the guest towels, as makeup products can permanently damage the fabric."] },
    { title: "🏖️ Beach Towels", text: ["The room towels are intended for use inside the guesthouse only and should not be taken to the beach."] },
    { title: "🙏 Thank You", text: ["We sincerely appreciate your cooperation, understanding, and care during your stay."] },
  ],
};

const en: WelcomePageCopy = {
  locale: "en",
  seo: {
    canonicalPath: "/welcome/",
    title: "Guest Welcome Guide | Voulamandis House",
    description: "Private welcome guide for guests of Voulamandis House in Kampos, Chios, with WiFi, breakfast, delivery, local tips and house rules.",
    ogImage: welcomeImages.hero,
  },
  nav: { languageLabel: "Languages", homeLabel: "Back to homepage" },
  hero: {
    badge: "🏡 Voulamandis House · Kampos, Chios",
    title: "Welcome to Voulamandis House",
    text: "Your online stay guide with WiFi, breakfast, food delivery, house rules, local tips, podcasts, and easy ways to contact us during your stay.",
  },
  quick: { title: "Quick Access", text: "Find the most useful information for your stay quickly.", whatsapp: "💬 WhatsApp", call: "📞 Call Us", wifi: "📶 WiFi", breakfast: "🍳 Breakfast", delivery: "🛵 Delivery", rules: "🏡 House Rules" },
  sections: {
    welcome: {
      title: "🌿 Welcome to Voulamandis House",
      paragraphs: [
        "Welcome to Voulamandis House, located in the beautiful and unique area of Kampos, Chios. It is a great pleasure for us to host you during your stay.",
        "We are always here to listen, help, and assist you with anything you may need while staying with us. Please feel free to contact us through our social media accounts listed below, or through reception.",
      ],
      highlight: "📸 We would love to see your beautiful photos from our garden or from your morning breakfast moments. Share them with us using the hashtags:",
      hashtags: "#voulamandishouse · #voulamandis · #chioshotels",
      instagram: "We would also be very happy if you followed our Instagram account: @chioshotels.",
      offers: "Throughout the year, we share special offers, seasonal deals, and small gifts for our guests and returning visitors.",
    },
    wifi: { title: "📶 WiFi Information", intro: "You can connect to our WiFi network using the details below.", cards: [{ title: "📡 Network", text: ["VH"] }, { title: "🔐 Password", text: ["a12345678"] }, { title: "💬 Need help?", text: ["If you have any trouble connecting, please contact us."] }] },
    breakfast: { title: "🍳 Breakfast at Voulamandis House", intro: "Enjoy our homemade breakfast experience for just 12€ per person, per day.", paragraphs: ["Taste authentic flavors from our citrus farm, including homemade mandarin and bergamot marmalades, lemon creations, fresh homemade juice, cakes, and pies.", "Every bite is inspired by the traditions, hospitality, and natural flavors of Chios."], highlight: "🍊 Start your day with a breakfast full of local taste, homemade care, and island character.", button: "🍳 Book Breakfast via WhatsApp" },
    delivery: { title: "🛵 Online Delivery", intro: "If you would like to order food or drinks for delivery to Voulamandis House, you can use the Fagi app, which works in a similar way to efood.", important: ["📍 Important: Please choose the area THYMIANA when placing your order.", "If you select Chios Town, your order may take longer to arrive."], accountIntro: "To make things easier for you, Voulamandis House has its own Fagi account, so you do not need to create a new one.", items: common.deliveryItems },
    nearby: { title: "🍽️ Nearby Taverns & Essentials in Thymiana", intro: "Very close to Voulamandis House, you will find the village of Thymiana, just 800 meters away.", paragraphs: ["You can easily reach the village by car or on foot. It is a convenient place for lunch, dinner, coffee, or anything you may need during your stay.", "For more information about Chios and ideas for exploring the island, please feel free to ask us. We will be happy to share local recommendations."], items: common.nearbyItems, tip: "📍 Tip: Thymiana is only about 800 meters from Voulamandis House, making it an easy walk for food, coffee, or daily essentials." },
    podcast: { title: "🎧 Podcast: The History of Kampos", paragraphs: ["Discover the history of the beautiful and unique area of Kampos, Chios through our special podcast experience.", "On the chest and in the courtyard, near the pitchfork, you will find QR codes for three wonderful podcasts available in Greek, English, and French.", "These podcasts share unique information about the history of Kampos, our local area, and the estate where you are staying."], highlight: "📱 We would be delighted if you scanned the QR code in your preferred language and enjoyed listening during your stay." },
    marmalade: { title: "🍊 Buy Our Homemade Marmalade", paragraphs: ["The Chios mandarin marmalade served at our breakfast is homemade with mandarins collected from our own property every January.", "It is lovingly prepared by Angeliki, without any preservatives, using traditional care and the natural aroma of Chios citrus fruits."], highlight: "🍊 If you would like to purchase our marmalade for yourself or as a special souvenir from Chios, please feel free to ask Angeliki.", items: common.marmaladeItems, thanks: "Thank you very much for supporting our homemade products and local Chios flavors.", button: "🍊 Ask About Marmalades", localProducts: "You can also discover more local Chios products here:" },
    rules: { title: "🏡 House Rules", intro: "To ensure a comfortable stay for everyone and to help us take good care of the property, we kindly ask you to observe the following guidelines during your stay.", items: common.ruleItems, thanks: "Thank you for helping us keep Voulamandis House clean, comfortable, and welcoming for all our guests." },
    contact: { title: "💬 Contact Us", intro: "If you need anything during your stay, please contact us. We are happy to help.", whatsapp: "💬 WhatsApp", call: "📞 Call", email: "✉️ Email", note: "For faster communication, WhatsApp is usually the easiest way to reach us." },
  },
  footer: "Thank you for staying with us. We wish you a wonderful time in Chios.",
};

const el: WelcomePageCopy = {
  ...en,
  locale: "el",
  seo: { ...en.seo, canonicalPath: "/el/welcome/", title: "Οδηγός Διαμονής | Voulamandis House", description: "Ιδιωτικός οδηγός διαμονής για τους επισκέπτες του Voulamandis House στον Κάμπο Χίου, με WiFi, πρωινό, delivery, τοπικές προτάσεις και κανόνες διαμονής." },
  nav: { languageLabel: "Γλώσσες", homeLabel: "Επιστροφή στην αρχική" },
  hero: { badge: "🏡 Voulamandis House · Κάμπος, Χίος", title: "Καλώς ήρθατε στο Voulamandis House", text: "Ο online οδηγός διαμονής σας με WiFi, πρωινό, delivery, κανόνες διαμονής, τοπικές προτάσεις, podcasts και εύκολους τρόπους επικοινωνίας μαζί μας." },
  quick: { title: "Γρήγορη πρόσβαση", text: "Βρείτε γρήγορα τις πιο χρήσιμες πληροφορίες για τη διαμονή σας.", whatsapp: "💬 WhatsApp", call: "📞 Καλέστε μας", wifi: "📶 WiFi", breakfast: "🍳 Πρωινό", delivery: "🛵 Delivery", rules: "🏡 Κανόνες" },
  sections: {
    ...en.sections,
    welcome: { ...en.sections.welcome, title: "🌿 Καλώς ήρθατε στο Voulamandis House", paragraphs: ["Καλώς ήρθατε στο Voulamandis House, που βρίσκεται στην όμορφη και μοναδική περιοχή του Κάμπου στη Χίο. Είναι μεγάλη μας χαρά να σας φιλοξενούμε.", "Είμαστε πάντα εδώ για να σας ακούσουμε, να σας βοηθήσουμε και να σας εξυπηρετήσουμε σε ό,τι χρειαστείτε κατά τη διαμονή σας."], highlight: "📸 Θα χαρούμε πολύ να δούμε όμορφες φωτογραφίες σας από τον κήπο μας ή από τις πρωινές στιγμές σας στο πρωινό. Μοιραστείτε τις με τα hashtags:", instagram: "Θα χαρούμε επίσης πολύ αν ακολουθήσετε τον λογαριασμό μας στο Instagram: @chioshotels.", offers: "Κατά τη διάρκεια της χρονιάς μοιραζόμαστε ειδικές προσφορές, εποχιακά deals και μικρά δώρα για τους επισκέπτες μας." },
    wifi: { title: "📶 Πληροφορίες WiFi", intro: "Μπορείτε να συνδεθείτε στο WiFi με τα παρακάτω στοιχεία.", cards: [{ title: "📡 Δίκτυο", text: ["VH"] }, { title: "🔐 Κωδικός", text: ["a12345678"] }, { title: "💬 Χρειάζεστε βοήθεια;", text: ["Αν έχετε δυσκολία στη σύνδεση, επικοινωνήστε μαζί μας."] }] },
    breakfast: { ...en.sections.breakfast, title: "🍳 Πρωινό στο Voulamandis House", intro: "Απολαύστε το σπιτικό μας πρωινό με 12€ ανά άτομο, ανά ημέρα.", button: "🍳 Κράτηση πρωινού μέσω WhatsApp" },
    contact: { title: "💬 Επικοινωνία", intro: "Αν χρειαστείτε οτιδήποτε κατά τη διαμονή σας, επικοινωνήστε μαζί μας. Θα χαρούμε να σας βοηθήσουμε.", whatsapp: "💬 WhatsApp", call: "📞 Κλήση", email: "✉️ Email", note: "Για πιο άμεση επικοινωνία, το WhatsApp είναι συνήθως ο ευκολότερος τρόπος." },
  },
  footer: "Σας ευχαριστούμε που μένετε μαζί μας. Σας ευχόμαστε υπέροχες στιγμές στη Χίο.",
};

function translated(locale: LanguageCode, canonicalPath: string, title: string, description: string, nav: WelcomePageCopy["nav"], hero: WelcomePageCopy["hero"], quickTitle: string, quickText: string, footer: string): WelcomePageCopy {
  return {
    ...en,
    locale,
    seo: { ...en.seo, canonicalPath, title, description },
    nav,
    hero,
    quick: { ...en.quick, title: quickTitle, text: quickText },
    footer,
  };
}

const fr = translated("fr", "/fr/welcome/", "Guide de Séjour | Voulamandis House", "Guide privé pour les clients de Voulamandis House à Kampos, Chios, avec WiFi, petit-déjeuner, livraison, conseils locaux et règles de séjour.", { languageLabel: "Langues", homeLabel: "Retour à l’accueil" }, { badge: "🏡 Voulamandis House · Kampos, Chios", title: "Bienvenue à Voulamandis House", text: "Votre guide de séjour en ligne avec WiFi, petit-déjeuner, livraison, règles de la maison, conseils locaux, podcasts et moyens faciles de nous contacter." }, "Accès rapide", "Trouvez rapidement les informations les plus utiles pour votre séjour.", "Merci de séjourner chez nous. Nous vous souhaitons un merveilleux séjour à Chios.");
const de = translated("de", "/de/welcome/", "Gäste-Willkommensguide | Voulamandis House", "Privater Gäste-Guide für Voulamandis House in Kampos, Chios, mit WLAN, Frühstück, Lieferdiensten, lokalen Tipps und Hausregeln.", { languageLabel: "Sprachen", homeLabel: "Zur Startseite" }, { badge: "🏡 Voulamandis House · Kampos, Chios", title: "Willkommen im Voulamandis House", text: "Ihr Online-Guide für den Aufenthalt mit WLAN, Frühstück, Essenslieferung, Hausregeln, lokalen Tipps, Podcasts und einfachen Kontaktmöglichkeiten." }, "Schneller Zugriff", "Finden Sie schnell die wichtigsten Informationen für Ihren Aufenthalt.", "Vielen Dank für Ihren Aufenthalt bei uns. Wir wünschen Ihnen eine wunderbare Zeit auf Chios.");
const it = translated("it", "/it/welcome/", "Guida di Benvenuto | Voulamandis House", "Guida privata per gli ospiti di Voulamandis House a Kampos, Chios, con WiFi, colazione, delivery, consigli locali e regole del soggiorno.", { languageLabel: "Lingue", homeLabel: "Torna alla homepage" }, { badge: "🏡 Voulamandis House · Kampos, Chios", title: "Benvenuti a Voulamandis House", text: "La vostra guida online con WiFi, colazione, delivery, regole della struttura, consigli locali, podcast e modi semplici per contattarci." }, "Accesso rapido", "Trova rapidamente le informazioni più utili per il tuo soggiorno.", "Grazie per aver scelto di soggiornare con noi. Vi auguriamo un meraviglioso soggiorno a Chios.");
const es = translated("es", "/es/welcome/", "Guía de Bienvenida | Voulamandis House", "Guía privada para huéspedes de Voulamandis House en Kampos, Chios, con WiFi, desayuno, delivery, consejos locales y normas de estancia.", { languageLabel: "Idiomas", homeLabel: "Volver a la página principal" }, { badge: "🏡 Voulamandis House · Kampos, Chios", title: "Bienvenido a Voulamandis House", text: "Su guía online de estancia con WiFi, desayuno, comida a domicilio, normas, consejos locales, podcasts y formas sencillas de contactarnos." }, "Acceso rápido", "Encuentre rápidamente la información más útil para su estancia.", "Gracias por alojarse con nosotros. Le deseamos una maravillosa estancia en Chios.");
const tr = translated("tr", "/tr/welcome/", "Misafir Karşılama Rehberi | Voulamandis House", "Kampos, Chios’taki Voulamandis House misafirleri için WiFi, kahvaltı, yemek teslimatı, yerel öneriler ve konaklama kuralları içeren özel rehber.", { languageLabel: "Diller", homeLabel: "Ana sayfaya dön" }, { badge: "🏡 Voulamandis House · Kampos, Chios", title: "Voulamandis House’a hoş geldiniz", text: "WiFi, kahvaltı, yemek teslimatı, konaklama kuralları, yerel öneriler, podcastler ve bizimle kolay iletişim yollarını içeren online konaklama rehberiniz." }, "Hızlı Erişim", "Konaklamanız için en faydalı bilgileri hızlıca bulun.", "Bizde konakladığınız için teşekkür ederiz. Chios’ta harika zaman geçirmenizi dileriz.");

export const welcomePages: Record<LanguageCode, WelcomePageCopy> = { en, el, fr, de, it, es, tr };

export function getWelcomePageByLocale(locale: LanguageCode): WelcomePageCopy {
  return welcomePages[locale] ?? welcomePages.en;
}
