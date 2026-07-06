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
  seo: { canonicalPath: string; title: string; description: string; ogImage: string };
  nav: { languageLabel: string; homeLabel: string };
  hero: { badge: string; title: string; text: string };
  quick: { title: string; text: string; whatsapp: string; call: string; wifi: string; breakfast: string; delivery: string; rules: string };
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
  hero: "/images/welcome/voulamandis-welcome-hero.webp",
  breakfast: "/images/welcome/voulamandis-breakfast.jpg",
};

export const welcomeContact = {
  phoneDisplay: "+30 694 447 4226",
  phoneHref: "tel:+306944474226",
  whatsappDisplay: "+30 694 447 4226",
  whatsappBase: "https://wa.me/306944474226",
  email: "info@chioshotel.gr",
  emailHref: "mailto:info@chioshotel.gr",
};

const deliveryItems: WelcomeItem[] = [
  { title: "Fagi app access", text: ["For Fagi login details, please ask reception or contact us on WhatsApp."] },
  {
    title: "Download the Fagi app",
    text: ["Download the Fagi app and use the access details provided by reception to place your order."],
    button: { label: "Download Fagi App", href: "https://play.google.com/store/apps/details?id=com.fagi.fagi.gr&hl=el", external: true },
  },
  { title: "Coffee orders", text: ["For coffee delivery, you can call KAFEMANIA.", "Phone: 2271 033417"], button: { label: "Call KAFEMANIA", href: "tel:+302271033417", variant: "blue" } },
  { title: "Coffee and sandwiches", text: ["For coffee and sandwiches, you can contact STASI.", "Phone: 2271 021256"], button: { label: "Call STASI", href: "tel:+302271021256", variant: "blue" } },
];

const nearbyItems: WelcomeItem[] = [
  { title: "Taverns", text: ["In Thymiana, you will find two taverns, Karouli and Kapilio, where you can enjoy a relaxed lunch or dinner."] },
  { title: "Everyday essentials", text: ["The village also has two pharmacies, a bakery, and a local grocery store."] },
];

const marmaladeItems: WelcomeItem[] = [
  { title: "Mandarin marmalade", text: ["Made from Chios mandarins collected from our estate, with a sweet and authentic citrus flavor."] },
  { title: "Bergamot marmalade", text: ["An aromatic marmalade with a distinctive Chios character."] },
  { title: "Lemon marmalade", text: ["Fresh, bright, and aromatic, perfect for those who love the taste of lemon."] },
  { title: "A taste of Chios", text: ["A lovely gift or souvenir to take home and remember your stay at Voulamandis House."] },
];

const ruleItems: WelcomeItem[] = [
  { title: "Air conditioning", text: ["Please switch off the air conditioner before leaving your room."] },
  { title: "Electrical appliances", text: ["Please make sure all electrical appliances are turned off before leaving the room."] },
  { title: "External door", text: ["When leaving the premises, please securely close the external door of the guesthouse."] },
  { title: "Toilet use", text: ["Please do not dispose of paper or other items in the toilet. Use the bin provided."] },
  { title: "Parking", text: ["When parking, please keep a distance of at least 2 meters from the DEI / Public Power Corporation column."] },
  { title: "Makeup and towels", text: ["Please avoid removing makeup with the guest towels, as makeup products can permanently damage the fabric."] },
  { title: "Beach towels", text: ["The room towels are intended for use inside the guesthouse only and should not be taken to the beach."] },
  { title: "Thank you", text: ["We sincerely appreciate your cooperation, understanding, and care during your stay."] },
];

const en: WelcomePageCopy = {
  locale: "en",
  seo: { canonicalPath: "/welcome/", title: "Guest Welcome Guide | Voulamandis House", description: "Private welcome guide for guests of Voulamandis House in Kampos, Chios, with WiFi, breakfast, delivery, local tips and house rules.", ogImage: welcomeImages.hero },
  nav: { languageLabel: "Languages", homeLabel: "Back to homepage" },
  hero: { badge: "Voulamandis House - Kampos, Chios", title: "Welcome to Voulamandis House", text: "Your online stay guide with WiFi, breakfast, food delivery, house rules, local tips, podcasts, and easy ways to contact us during your stay." },
  quick: { title: "Quick Access", text: "Find the most useful information for your stay quickly.", whatsapp: "WhatsApp", call: "Call Us", wifi: "WiFi", breakfast: "Breakfast", delivery: "Delivery", rules: "House Rules" },
  sections: {
    welcome: { title: "Welcome to Voulamandis House", paragraphs: ["Welcome to Voulamandis House, located in the beautiful and unique area of Kampos, Chios. It is a great pleasure for us to host you during your stay.", "We are always here to listen, help, and assist you with anything you may need while staying with us. Please feel free to contact us through social media or reception."], highlight: "We would love to see your beautiful photos from our garden or from your morning breakfast moments. Share them with us using the hashtags:", hashtags: "#voulamandishouse - #voulamandis - #chioshotels", instagram: "We would also be very happy if you followed our Instagram account: @chioshotels.", offers: "Throughout the year, we share special offers, seasonal deals, and small gifts for our guests and returning visitors." },
    wifi: { title: "WiFi Information", intro: "You can connect to our WiFi network using the details below.", cards: [{ title: "Network", text: ["VH"] }, { title: "Access key", text: ["Available in your room guide or from reception."] }, { title: "Need help?", text: ["If you have any trouble connecting, please contact us."] }] },
    breakfast: { title: "Breakfast at Voulamandis House", intro: "Enjoy our homemade breakfast experience for just 12 EUR per person, per day.", paragraphs: ["Taste authentic flavors from our citrus farm, including homemade mandarin and bergamot marmalades, lemon creations, fresh homemade juice, cakes, and pies.", "Every bite is inspired by the traditions, hospitality, and natural flavors of Chios."], highlight: "Start your day with a breakfast full of local taste, homemade care, and island character.", button: "Book Breakfast via WhatsApp" },
    delivery: { title: "Online Delivery", intro: "If you would like to order food or drinks for delivery to Voulamandis House, you can use the Fagi app, which works in a similar way to efood.", important: ["Important: Please choose the area THYMIANA when placing your order.", "If you select Chios Town, your order may take longer to arrive."], accountIntro: "To make things easier for you, Voulamandis House can help you order through Fagi.", items: deliveryItems },
    nearby: { title: "Nearby Taverns and Essentials in Thymiana", intro: "Very close to Voulamandis House, you will find the village of Thymiana, just 800 meters away.", paragraphs: ["You can easily reach the village by car or on foot. It is a convenient place for lunch, dinner, coffee, or anything you may need during your stay.", "For more information about Chios and ideas for exploring the island, please feel free to ask us. We will be happy to share local recommendations."], items: nearbyItems, tip: "Tip: Thymiana is only about 800 meters from Voulamandis House, making it an easy walk for food, coffee, or daily essentials." },
    podcast: { title: "Podcast: The History of Kampos", paragraphs: ["Discover the history of the beautiful and unique area of Kampos, Chios through our special podcast experience.", "On the chest and in the courtyard, near the pitchfork, you will find QR codes for three podcasts available in Greek, English, and French.", "These podcasts share unique information about the history of Kampos, our local area, and the estate where you are staying."], highlight: "We would be delighted if you scanned the QR code in your preferred language and enjoyed listening during your stay." },
    marmalade: { title: "Buy Our Homemade Marmalade", paragraphs: ["The Chios mandarin marmalade served at our breakfast is homemade with mandarins collected from our own property every January.", "It is lovingly prepared by Angeliki, without preservatives, using traditional care and the natural aroma of Chios citrus fruits."], highlight: "If you would like to purchase our marmalade for yourself or as a special souvenir from Chios, please feel free to ask Angeliki.", items: marmaladeItems, thanks: "Thank you very much for supporting our homemade products and local Chios flavors.", button: "Ask About Marmalades", localProducts: "You can also discover more local Chios products here:" },
    rules: { title: "House Rules", intro: "To ensure a comfortable stay for everyone and to help us take good care of the property, we kindly ask you to observe the following guidelines during your stay.", items: ruleItems, thanks: "Thank you for helping us keep Voulamandis House clean, comfortable, and welcoming for all our guests." },
    contact: { title: "Contact Us", intro: "If you need anything during your stay, please contact us. We are happy to help.", whatsapp: "WhatsApp", call: "Call", email: "Email", note: "For faster communication, WhatsApp is usually the easiest way to reach us." },
  },
  footer: "Thank you for staying with us. We wish you a wonderful time in Chios.",
};

function localize(locale: LanguageCode, path: string, title: string, homeLabel: string, heroTitle: string, quickTitle: string): WelcomePageCopy {
  return {
    ...en,
    locale,
    seo: { ...en.seo, canonicalPath: path, title, description: en.seo.description },
    nav: { ...en.nav, homeLabel },
    hero: { ...en.hero, title: heroTitle },
    quick: { ...en.quick, title: quickTitle },
    sections: { ...en.sections, welcome: { ...en.sections.welcome, title: heroTitle } },
  };
}

const el = localize("el", "/el/welcome/", "Odigios Diamonis | Voulamandis House", "Epistrofi stin arxiki", "Kalos irthate sto Voulamandis House", "Grigori prosbasi");
const fr = localize("fr", "/fr/welcome/", "Guide de sejour | Voulamandis House", "Retour a l'accueil", "Bienvenue a Voulamandis House", "Acces rapide");
const de = localize("de", "/de/welcome/", "Aufenthaltsguide | Voulamandis House", "Zur Startseite", "Willkommen im Voulamandis House", "Schnellzugriff");
const it = localize("it", "/it/welcome/", "Guida al soggiorno | Voulamandis House", "Torna alla homepage", "Benvenuti a Voulamandis House", "Accesso rapido");
const es = localize("es", "/es/welcome/", "Guia de estancia | Voulamandis House", "Volver al inicio", "Bienvenidos a Voulamandis House", "Acceso rapido");
const tr = localize("tr", "/tr/welcome/", "Konaklama Rehberi | Voulamandis House", "Ana sayfaya don", "Voulamandis House'a hos geldiniz", "Hizli erisim");

const welcomeCopyByLocale: Record<LanguageCode, WelcomePageCopy> = { en, el, fr, de, it, es, tr };

export function getWelcomeCopy(locale: LanguageCode): WelcomePageCopy {
  return welcomeCopyByLocale[locale] ?? welcomeCopyByLocale.en;
}
