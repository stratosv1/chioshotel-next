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

type TextSet = {
  locale: LanguageCode;
  path: string;
  seoTitle: string;
  seoDescription: string;
  languageLabel: string;
  homeLabel: string;
  badge: string;
  heroTitle: string;
  heroText: string;
  quickTitle: string;
  quickText: string;
  callUs: string;
  breakfastQuick: string;
  deliveryQuick: string;
  rulesQuick: string;
  welcomeTitle: string;
  welcomeParagraphs: string[];
  welcomeHighlight: string;
  instagram: string;
  offers: string;
  wifiTitle: string;
  wifiIntro: string;
  network: string;
  accessKey: string;
  accessKeyText: string;
  needHelp: string;
  needHelpText: string;
  breakfastTitle: string;
  breakfastIntro: string;
  breakfastParagraphs: string[];
  breakfastHighlight: string;
  breakfastButton: string;
  deliveryTitle: string;
  deliveryIntro: string;
  deliveryImportant: string[];
  accountIntro: string;
  appAccessTitle: string;
  appAccessText: string;
  appDownloadTitle: string;
  appDownloadText: string;
  appDownloadButton: string;
  coffeeOrdersTitle: string;
  coffeeOrdersText: string;
  coffeeSandwichesTitle: string;
  coffeeSandwichesText: string;
  nearbyTitle: string;
  nearbyIntro: string;
  nearbyParagraphs: string[];
  tavernsTitle: string;
  tavernsText: string;
  essentialsTitle: string;
  essentialsText: string;
  nearbyTip: string;
  podcastTitle: string;
  podcastParagraphs: string[];
  podcastHighlight: string;
  marmaladeTitle: string;
  marmaladeParagraphs: string[];
  marmaladeHighlight: string;
  mandarinTitle: string;
  mandarinText: string;
  bergamotTitle: string;
  bergamotText: string;
  lemonTitle: string;
  lemonText: string;
  tasteTitle: string;
  tasteText: string;
  marmaladeThanks: string;
  marmaladeButton: string;
  localProducts: string;
  rulesTitle: string;
  rulesIntro: string;
  acTitle: string;
  acText: string;
  appliancesTitle: string;
  appliancesText: string;
  doorTitle: string;
  doorText: string;
  toiletTitle: string;
  toiletText: string;
  parkingTitle: string;
  parkingText: string;
  towelsTitle: string;
  towelsText: string;
  beachTowelsTitle: string;
  beachTowelsText: string;
  thankYouTitle: string;
  thankYouText: string;
  rulesThanks: string;
  contactTitle: string;
  contactIntro: string;
  call: string;
  email: string;
  contactNote: string;
  footer: string;
};

function makeCopy(t: TextSet): WelcomePageCopy {
  const deliveryItems: WelcomeItem[] = [
    { title: t.appAccessTitle, text: [t.appAccessText] },
    {
      title: t.appDownloadTitle,
      text: [t.appDownloadText],
      button: { label: t.appDownloadButton, href: "https://play.google.com/store/apps/details?id=com.fagi.fagi.gr&hl=el", external: true },
    },
    { title: t.coffeeOrdersTitle, text: [t.coffeeOrdersText, "Phone: 2271 033417"], button: { label: "KAFEMANIA", href: "tel:+302271033417", variant: "blue" } },
    { title: t.coffeeSandwichesTitle, text: [t.coffeeSandwichesText, "Phone: 2271 021256"], button: { label: "STASI", href: "tel:+302271021256", variant: "blue" } },
  ];

  return {
    locale: t.locale,
    seo: { canonicalPath: t.path, title: t.seoTitle, description: t.seoDescription, ogImage: welcomeImages.hero },
    nav: { languageLabel: t.languageLabel, homeLabel: t.homeLabel },
    hero: { badge: t.badge, title: t.heroTitle, text: t.heroText },
    quick: { title: t.quickTitle, text: t.quickText, whatsapp: "WhatsApp", call: t.callUs, wifi: "WiFi", breakfast: t.breakfastQuick, delivery: t.deliveryQuick, rules: t.rulesQuick },
    sections: {
      welcome: { title: t.welcomeTitle, paragraphs: t.welcomeParagraphs, highlight: t.welcomeHighlight, hashtags: "#voulamandishouse - #voulamandis - #chioshotels", instagram: t.instagram, offers: t.offers },
      wifi: { title: t.wifiTitle, intro: t.wifiIntro, cards: [{ title: t.network, text: ["VH"] }, { title: t.accessKey, text: [t.accessKeyText] }, { title: t.needHelp, text: [t.needHelpText] }] },
      breakfast: { title: t.breakfastTitle, intro: t.breakfastIntro, paragraphs: t.breakfastParagraphs, highlight: t.breakfastHighlight, button: t.breakfastButton },
      delivery: { title: t.deliveryTitle, intro: t.deliveryIntro, important: t.deliveryImportant, accountIntro: t.accountIntro, items: deliveryItems },
      nearby: { title: t.nearbyTitle, intro: t.nearbyIntro, paragraphs: t.nearbyParagraphs, items: [{ title: t.tavernsTitle, text: [t.tavernsText] }, { title: t.essentialsTitle, text: [t.essentialsText] }], tip: t.nearbyTip },
      podcast: { title: t.podcastTitle, paragraphs: t.podcastParagraphs, highlight: t.podcastHighlight },
      marmalade: { title: t.marmaladeTitle, paragraphs: t.marmaladeParagraphs, highlight: t.marmaladeHighlight, items: [{ title: t.mandarinTitle, text: [t.mandarinText] }, { title: t.bergamotTitle, text: [t.bergamotText] }, { title: t.lemonTitle, text: [t.lemonText] }, { title: t.tasteTitle, text: [t.tasteText] }], thanks: t.marmaladeThanks, button: t.marmaladeButton, localProducts: t.localProducts },
      rules: { title: t.rulesTitle, intro: t.rulesIntro, items: [{ title: t.acTitle, text: [t.acText] }, { title: t.appliancesTitle, text: [t.appliancesText] }, { title: t.doorTitle, text: [t.doorText] }, { title: t.toiletTitle, text: [t.toiletText] }, { title: t.parkingTitle, text: [t.parkingText] }, { title: t.towelsTitle, text: [t.towelsText] }, { title: t.beachTowelsTitle, text: [t.beachTowelsText] }, { title: t.thankYouTitle, text: [t.thankYouText] }], thanks: t.rulesThanks },
      contact: { title: t.contactTitle, intro: t.contactIntro, whatsapp: "WhatsApp", call: t.call, email: t.email, note: t.contactNote },
    },
    footer: t.footer,
  };
}

const enText: TextSet = {
  locale: "en",
  path: "/welcome/",
  seoTitle: "Guest Welcome Guide | Voulamandis House",
  seoDescription: "Private welcome guide for guests of Voulamandis House in Kampos, Chios, with WiFi, breakfast, delivery, local tips and house rules.",
  languageLabel: "Languages",
  homeLabel: "Back to homepage",
  badge: "Voulamandis House - Kampos, Chios",
  heroTitle: "Welcome to Voulamandis House",
  heroText: "Your online stay guide with WiFi, breakfast, food delivery, house rules, local tips, podcasts, and easy ways to contact us during your stay.",
  quickTitle: "Quick Access",
  quickText: "Find the most useful information for your stay quickly.",
  callUs: "Call Us",
  breakfastQuick: "Breakfast",
  deliveryQuick: "Delivery",
  rulesQuick: "House Rules",
  welcomeTitle: "Welcome to Voulamandis House",
  welcomeParagraphs: ["Welcome to Voulamandis House, located in the beautiful and unique area of Kampos, Chios. It is a great pleasure for us to host you during your stay.", "We are always here to listen, help, and assist you with anything you may need while staying with us. Please feel free to contact us through social media or reception."],
  welcomeHighlight: "We would love to see your beautiful photos from our garden or from your morning breakfast moments. Share them with us using the hashtags:",
  instagram: "We would also be very happy if you followed our Instagram account: @chioshotels.",
  offers: "Throughout the year, we share special offers, seasonal deals, and small gifts for our guests and returning visitors.",
  wifiTitle: "WiFi Information",
  wifiIntro: "You can connect to our WiFi network using the details below.",
  network: "Network",
  accessKey: "Access key",
  accessKeyText: "Available in your room guide or from reception.",
  needHelp: "Need help?",
  needHelpText: "If you have any trouble connecting, please contact us.",
  breakfastTitle: "Breakfast at Voulamandis House",
  breakfastIntro: "Enjoy our homemade breakfast experience for 12 EUR per person, per day.",
  breakfastParagraphs: ["Taste authentic flavors from our citrus farm, including homemade mandarin and bergamot marmalades, lemon creations, fresh homemade juice, cakes, and pies.", "Every bite is inspired by the traditions, hospitality, and natural flavors of Chios."],
  breakfastHighlight: "Start your day with a breakfast full of local taste, homemade care, and island character.",
  breakfastButton: "Book Breakfast via WhatsApp",
  deliveryTitle: "Online Delivery",
  deliveryIntro: "If you would like to order food or drinks for delivery to Voulamandis House, you can use the Fagi app, which works in a similar way to efood.",
  deliveryImportant: ["Important: Please choose the area THYMIANA when placing your order.", "If you select Chios Town, your order may take longer to arrive."],
  accountIntro: "To make things easier for you, Voulamandis House can help you order through Fagi.",
  appAccessTitle: "Fagi app access",
  appAccessText: "For Fagi login details, please ask reception or contact us on WhatsApp.",
  appDownloadTitle: "Download the Fagi app",
  appDownloadText: "Download the Fagi app and use the access details provided by reception to place your order.",
  appDownloadButton: "Download Fagi App",
  coffeeOrdersTitle: "Coffee orders",
  coffeeOrdersText: "For coffee delivery, you can call KAFEMANIA.",
  coffeeSandwichesTitle: "Coffee and sandwiches",
  coffeeSandwichesText: "For coffee and sandwiches, you can contact STASI.",
  nearbyTitle: "Nearby Taverns and Essentials in Thymiana",
  nearbyIntro: "Very close to Voulamandis House, you will find the village of Thymiana, just 800 meters away.",
  nearbyParagraphs: ["You can easily reach the village by car or on foot. It is a convenient place for lunch, dinner, coffee, or anything you may need during your stay.", "For more information about Chios and ideas for exploring the island, please feel free to ask us. We will be happy to share local recommendations."],
  tavernsTitle: "Taverns",
  tavernsText: "In Thymiana, you will find Karouli and Kapilio, where you can enjoy a relaxed lunch or dinner.",
  essentialsTitle: "Everyday essentials",
  essentialsText: "The village also has pharmacies, a bakery, and a local grocery store.",
  nearbyTip: "Tip: Thymiana is only about 800 meters from Voulamandis House, making it an easy walk for food, coffee, or daily essentials.",
  podcastTitle: "Podcast: The History of Kampos",
  podcastParagraphs: ["Discover the history of the beautiful and unique area of Kampos, Chios through our special podcast experience.", "On the chest and in the courtyard, near the pitchfork, you will find QR codes for three podcasts available in Greek, English, and French.", "These podcasts share unique information about the history of Kampos, our local area, and the estate where you are staying."],
  podcastHighlight: "We would be delighted if you scanned the QR code in your preferred language and enjoyed listening during your stay.",
  marmaladeTitle: "Buy Our Homemade Marmalade",
  marmaladeParagraphs: ["The Chios mandarin marmalade served at our breakfast is homemade with mandarins collected from our own property every January.", "It is lovingly prepared by Angeliki, without preservatives, using traditional care and the natural aroma of Chios citrus fruits."],
  marmaladeHighlight: "If you would like to purchase our marmalade for yourself or as a special souvenir from Chios, please feel free to ask Angeliki.",
  mandarinTitle: "Mandarin marmalade",
  mandarinText: "Made from Chios mandarins collected from our estate, with a sweet and authentic citrus flavor.",
  bergamotTitle: "Bergamot marmalade",
  bergamotText: "An aromatic marmalade with a distinctive Chios character.",
  lemonTitle: "Lemon marmalade",
  lemonText: "Fresh, bright, and aromatic, perfect for those who love the taste of lemon.",
  tasteTitle: "A taste of Chios",
  tasteText: "A lovely gift or souvenir to take home and remember your stay at Voulamandis House.",
  marmaladeThanks: "Thank you very much for supporting our homemade products and local Chios flavors.",
  marmaladeButton: "Ask About Marmalades",
  localProducts: "You can also discover more local Chios products here:",
  rulesTitle: "House Rules",
  rulesIntro: "To ensure a comfortable stay for everyone and to help us take good care of the property, we kindly ask you to observe the following guidelines during your stay.",
  acTitle: "Air conditioning",
  acText: "Please switch off the air conditioner before leaving your room.",
  appliancesTitle: "Electrical appliances",
  appliancesText: "Please make sure all electrical appliances are turned off before leaving the room.",
  doorTitle: "External door",
  doorText: "When leaving the premises, please securely close the external door of the guesthouse.",
  toiletTitle: "Toilet use",
  toiletText: "Please do not dispose of paper or other items in the toilet. Use the bin provided.",
  parkingTitle: "Parking",
  parkingText: "When parking, please keep a distance of at least 2 meters from the DEI / Public Power Corporation column.",
  towelsTitle: "Makeup and towels",
  towelsText: "Please avoid removing makeup with the guest towels, as makeup products can permanently damage the fabric.",
  beachTowelsTitle: "Beach towels",
  beachTowelsText: "The room towels are intended for use inside the guesthouse only and should not be taken to the beach.",
  thankYouTitle: "Thank you",
  thankYouText: "We sincerely appreciate your cooperation, understanding, and care during your stay.",
  rulesThanks: "Thank you for helping us keep Voulamandis House clean, comfortable, and welcoming for all our guests.",
  contactTitle: "Contact Us",
  contactIntro: "If you need anything during your stay, please contact us. We are happy to help.",
  call: "Call",
  email: "Email",
  contactNote: "For faster communication, WhatsApp is usually the easiest way to reach us.",
  footer: "Thank you for staying with us. We wish you a wonderful time in Chios.",
};

const elText: TextSet = {
  ...enText,
  locale: "el",
  path: "/el/welcome/",
  seoTitle: "Οδηγός Διαμονής | Voulamandis House",
  seoDescription: "Ιδιωτικός οδηγός διαμονής για τους επισκέπτες του Voulamandis House στον Κάμπο Χίου, με WiFi, πρωινό, delivery, τοπικές προτάσεις και κανόνες διαμονής.",
  languageLabel: "Γλώσσες",
  homeLabel: "Επιστροφή στην αρχική",
  badge: "Voulamandis House - Κάμπος, Χίος",
  heroTitle: "Καλώς ήρθατε στο Voulamandis House",
  heroText: "Ο online οδηγός διαμονής σας με WiFi, πρωινό, delivery, κανόνες διαμονής, τοπικές προτάσεις, podcasts και εύκολους τρόπους επικοινωνίας μαζί μας.",
  quickTitle: "Γρήγορη πρόσβαση",
  quickText: "Βρείτε γρήγορα τις πιο χρήσιμες πληροφορίες για τη διαμονή σας.",
  callUs: "Καλέστε μας",
  breakfastQuick: "Πρωινό",
  deliveryQuick: "Delivery",
  rulesQuick: "Κανόνες διαμονής",
  welcomeTitle: "Καλώς ήρθατε στο Voulamandis House",
  welcomeParagraphs: ["Καλώς ήρθατε στο Voulamandis House, στην όμορφη και ξεχωριστή περιοχή του Κάμπου της Χίου. Είναι μεγάλη μας χαρά να σας φιλοξενούμε κατά τη διαμονή σας.", "Είμαστε πάντα εδώ για να σας ακούσουμε, να σας βοηθήσουμε και να σας εξυπηρετήσουμε σε ό,τι χρειαστείτε. Μπορείτε να επικοινωνήσετε μαζί μας μέσω social media ή reception."],
  welcomeHighlight: "Θα χαρούμε πολύ να δούμε όμορφες φωτογραφίες σας από τον κήπο ή από τις στιγμές του πρωινού σας. Μοιραστείτε τις μαζί μας με τα hashtags:",
  instagram: "Θα χαρούμε επίσης αν ακολουθήσετε τον λογαριασμό μας στο Instagram: @chioshotels.",
  offers: "Κατά τη διάρκεια της χρονιάς μοιραζόμαστε ειδικές προσφορές, εποχιακά deals και μικρά δώρα για τους επισκέπτες μας.",
  wifiTitle: "Πληροφορίες WiFi",
  wifiIntro: "Μπορείτε να συνδεθείτε στο WiFi με τα παρακάτω στοιχεία.",
  network: "Δίκτυο",
  accessKey: "Κωδικός πρόσβασης",
  accessKeyText: "Διατίθεται στον οδηγό του δωματίου σας ή από τη reception.",
  needHelp: "Χρειάζεστε βοήθεια;",
  needHelpText: "Αν έχετε δυσκολία στη σύνδεση, επικοινωνήστε μαζί μας.",
  breakfastTitle: "Πρωινό στο Voulamandis House",
  breakfastIntro: "Απολαύστε το σπιτικό μας πρωινό με 12 EUR ανά άτομο, ανά ημέρα.",
  breakfastParagraphs: ["Δοκιμάστε αυθεντικές γεύσεις από το περιβόλι μας, όπως σπιτικές μαρμελάδες μανταρίνι και περγαμόντο, δημιουργίες λεμονιού, φρέσκο σπιτικό χυμό, κέικ και πίτες.", "Κάθε γεύση είναι εμπνευσμένη από την παράδοση, τη φιλοξενία και τα φυσικά αρώματα της Χίου."],
  breakfastHighlight: "Ξεκινήστε τη μέρα σας με ένα πρωινό γεμάτο τοπική γεύση, σπιτική φροντίδα και χαρακτήρα Χίου.",
  breakfastButton: "Κράτηση πρωινού μέσω WhatsApp",
  deliveryTitle: "Online Delivery",
  deliveryIntro: "Αν θέλετε να παραγγείλετε φαγητό ή ροφήματα στο Voulamandis House, μπορείτε να χρησιμοποιήσετε την εφαρμογή Fagi.",
  deliveryImportant: ["Σημαντικό: Επιλέξτε περιοχή ΘΥΜΙΑΝΑ όταν κάνετε την παραγγελία.", "Αν επιλέξετε Χώρα Χίου, η παραγγελία μπορεί να καθυστερήσει."],
  accountIntro: "Για ευκολία, το Voulamandis House μπορεί να σας βοηθήσει να παραγγείλετε μέσω Fagi.",
  appAccessTitle: "Πρόσβαση στην εφαρμογή Fagi",
  appAccessText: "Για τα στοιχεία σύνδεσης στο Fagi, ρωτήστε τη reception ή επικοινωνήστε μαζί μας στο WhatsApp.",
  appDownloadTitle: "Λήψη εφαρμογής Fagi",
  appDownloadText: "Κατεβάστε την εφαρμογή Fagi και χρησιμοποιήστε τα στοιχεία πρόσβασης που θα σας δώσει η reception.",
  appDownloadButton: "Λήψη Fagi App",
  coffeeOrdersTitle: "Παραγγελίες καφέ",
  coffeeOrdersText: "Για delivery καφέ μπορείτε να καλέσετε το KAFEMANIA.",
  coffeeSandwichesTitle: "Καφές και σάντουιτς",
  coffeeSandwichesText: "Για καφέ και σάντουιτς μπορείτε να επικοινωνήσετε με το STASI.",
  nearbyTitle: "Κοντινές ταβέρνες και χρήσιμα στα Θυμιανά",
  nearbyIntro: "Πολύ κοντά στο Voulamandis House θα βρείτε το χωριό Θυμιανά, περίπου 800 μέτρα μακριά.",
  nearbyParagraphs: ["Μπορείτε να πάτε εύκολα με αυτοκίνητο ή με τα πόδια. Είναι βολικό σημείο για φαγητό, καφέ ή καθημερινές ανάγκες.", "Για περισσότερες πληροφορίες για τη Χίο και ιδέες εξερεύνησης, ρωτήστε μας. Θα χαρούμε να σας δώσουμε τοπικές προτάσεις."],
  tavernsTitle: "Ταβέρνες",
  tavernsText: "Στα Θυμιανά θα βρείτε το Καρούλι και το Καπηλειό για χαλαρό μεσημεριανό ή βραδινό.",
  essentialsTitle: "Καθημερινές ανάγκες",
  essentialsText: "Στο χωριό υπάρχουν επίσης φαρμακεία, φούρνος και τοπικό μίνι μάρκετ.",
  nearbyTip: "Συμβουλή: Τα Θυμιανά απέχουν περίπου 800 μέτρα από το Voulamandis House, ιδανικά για σύντομη βόλτα για φαγητό, καφέ ή καθημερινές ανάγκες.",
  podcastTitle: "Podcast: Η ιστορία του Κάμπου",
  podcastParagraphs: ["Ανακαλύψτε την ιστορία του όμορφου και μοναδικού Κάμπου της Χίου μέσα από την ειδική podcast εμπειρία μας.", "Στο μπαούλο και στην αυλή, κοντά στη δικέλα, θα βρείτε QR codes για τρία podcasts στα ελληνικά, αγγλικά και γαλλικά.", "Τα podcasts μοιράζονται ξεχωριστές πληροφορίες για την ιστορία του Κάμπου, την περιοχή και το κτήμα όπου διαμένετε."],
  podcastHighlight: "Θα χαρούμε να σαρώσετε το QR code στη γλώσσα που προτιμάτε και να το απολαύσετε κατά τη διαμονή σας.",
  marmaladeTitle: "Αγοράστε τη σπιτική μας μαρμελάδα",
  marmaladeParagraphs: ["Η μαρμελάδα μανταρίνι Χίου που σερβίρεται στο πρωινό μας είναι σπιτική, από μανταρίνια του κτήματός μας που συλλέγονται κάθε Ιανουάριο.", "Παρασκευάζεται με φροντίδα από την Αγγελική, χωρίς συντηρητικά, με το φυσικό άρωμα των εσπεριδοειδών της Χίου."],
  marmaladeHighlight: "Αν θέλετε να αγοράσετε μαρμελάδα για εσάς ή ως αναμνηστικό από τη Χίο, ρωτήστε την Αγγελική.",
  mandarinTitle: "Μαρμελάδα μανταρίνι",
  mandarinText: "Φτιαγμένη από μανταρίνια Χίου του κτήματός μας, με γλυκιά και αυθεντική γεύση εσπεριδοειδών.",
  bergamotTitle: "Μαρμελάδα περγαμόντο",
  bergamotText: "Αρωματική μαρμελάδα με ξεχωριστό χιώτικο χαρακτήρα.",
  lemonTitle: "Μαρμελάδα λεμόνι",
  lemonText: "Φρέσκια και αρωματική, ιδανική για όσους αγαπούν τη γεύση λεμονιού.",
  tasteTitle: "Μια γεύση από τη Χίο",
  tasteText: "Ένα όμορφο δώρο ή αναμνηστικό για να θυμάστε τη διαμονή σας στο Voulamandis House.",
  marmaladeThanks: "Σας ευχαριστούμε πολύ που στηρίζετε τα σπιτικά προϊόντα και τις τοπικές γεύσεις της Χίου.",
  marmaladeButton: "Ρωτήστε για τις μαρμελάδες",
  localProducts: "Μπορείτε επίσης να ανακαλύψετε περισσότερα τοπικά προϊόντα Χίου εδώ:",
  rulesTitle: "Κανόνες διαμονής",
  rulesIntro: "Για μια άνετη διαμονή για όλους και για τη σωστή φροντίδα του χώρου, σας παρακαλούμε να τηρείτε τις παρακάτω οδηγίες.",
  acTitle: "Κλιματισμός",
  acText: "Παρακαλούμε σβήνετε το κλιματιστικό πριν φύγετε από το δωμάτιο.",
  appliancesTitle: "Ηλεκτρικές συσκευές",
  appliancesText: "Παρακαλούμε βεβαιωθείτε ότι όλες οι ηλεκτρικές συσκευές είναι κλειστές πριν φύγετε από το δωμάτιο.",
  doorTitle: "Εξωτερική πόρτα",
  doorText: "Όταν φεύγετε από τον χώρο, παρακαλούμε κλείνετε καλά την εξωτερική πόρτα του καταλύματος.",
  toiletTitle: "Χρήση τουαλέτας",
  toiletText: "Παρακαλούμε μην πετάτε χαρτιά ή άλλα αντικείμενα στην τουαλέτα. Χρησιμοποιήστε τον κάδο.",
  parkingTitle: "Στάθμευση",
  parkingText: "Κατά τη στάθμευση, παρακαλούμε κρατήστε απόσταση τουλάχιστον 2 μέτρων από την κολώνα της ΔΕΗ.",
  towelsTitle: "Μακιγιάζ και πετσέτες",
  towelsText: "Παρακαλούμε αποφύγετε την αφαίρεση μακιγιάζ με τις πετσέτες, καθώς μπορεί να προκληθούν μόνιμοι λεκέδες.",
  beachTowelsTitle: "Πετσέτες παραλίας",
  beachTowelsText: "Οι πετσέτες δωματίου είναι μόνο για χρήση μέσα στο κατάλυμα και δεν πρέπει να μεταφέρονται στην παραλία.",
  thankYouTitle: "Ευχαριστούμε",
  thankYouText: "Σας ευχαριστούμε για τη συνεργασία, την κατανόηση και τη φροντίδα κατά τη διαμονή σας.",
  rulesThanks: "Σας ευχαριστούμε που μας βοηθάτε να διατηρούμε το Voulamandis House καθαρό, άνετο και φιλόξενο.",
  contactTitle: "Επικοινωνία",
  contactIntro: "Αν χρειαστείτε οτιδήποτε κατά τη διαμονή σας, επικοινωνήστε μαζί μας. Θα χαρούμε να βοηθήσουμε.",
  call: "Κλήση",
  email: "Email",
  contactNote: "Για πιο άμεση επικοινωνία, το WhatsApp είναι συνήθως ο ευκολότερος τρόπος.",
  footer: "Σας ευχαριστούμε που μένετε μαζί μας. Σας ευχόμαστε υπέροχο χρόνο στη Χίο.",
};

const frText: TextSet = {
  ...enText,
  locale: "fr",
  path: "/fr/welcome/",
  seoTitle: "Guide de séjour | Voulamandis House",
  seoDescription: "Guide privé pour les clients de Voulamandis House à Kampos, Chios, avec WiFi, petit-déjeuner, livraison, conseils locaux et règles de séjour.",
  languageLabel: "Langues",
  homeLabel: "Retour à l'accueil",
  heroTitle: "Bienvenue à Voulamandis House",
  heroText: "Votre guide de séjour en ligne avec WiFi, petit-déjeuner, livraison, règles de séjour, conseils locaux, podcasts et moyens simples de nous contacter.",
  quickTitle: "Accès rapide",
  quickText: "Retrouvez rapidement les informations les plus utiles pour votre séjour.",
  callUs: "Nous appeler",
  breakfastQuick: "Petit-déjeuner",
  deliveryQuick: "Livraison",
  rulesQuick: "Règles de séjour",
  welcomeTitle: "Bienvenue à Voulamandis House",
  welcomeParagraphs: ["Bienvenue à Voulamandis House, situé dans la belle et unique région de Kampos, à Chios. Nous sommes très heureux de vous accueillir pendant votre séjour.", "Nous sommes toujours là pour vous écouter, vous aider et vous assister pour tout ce dont vous pourriez avoir besoin."],
  welcomeHighlight: "Nous serions ravis de voir vos belles photos du jardin ou de vos moments de petit-déjeuner. Partagez-les avec nous en utilisant les hashtags :",
  instagram: "Nous serions également très heureux si vous suiviez notre compte Instagram : @chioshotels.",
  offers: "Tout au long de l'année, nous partageons des offres spéciales, des offres saisonnières et de petits cadeaux pour nos clients.",
  wifiTitle: "Informations WiFi",
  wifiIntro: "Vous pouvez vous connecter à notre réseau WiFi avec les informations ci-dessous.",
  network: "Réseau",
  accessKey: "Code d'accès",
  accessKeyText: "Disponible dans le guide de votre chambre ou auprès de la réception.",
  needHelp: "Besoin d'aide ?",
  needHelpText: "Si vous avez des difficultés de connexion, veuillez nous contacter.",
  breakfastTitle: "Petit-déjeuner à Voulamandis House",
  breakfastIntro: "Profitez de notre petit-déjeuner maison pour 12 EUR par personne et par jour.",
  breakfastParagraphs: ["Goûtez des saveurs authentiques de notre ferme d'agrumes, avec des confitures maison de mandarine et de bergamote, des créations au citron, du jus frais, des gâteaux et des tartes.", "Chaque bouchée est inspirée par les traditions, l'hospitalité et les saveurs naturelles de Chios."],
  breakfastHighlight: "Commencez votre journée avec un petit-déjeuner plein de goût local, de soin maison et de caractère insulaire.",
  breakfastButton: "Réserver le petit-déjeuner via WhatsApp",
  deliveryTitle: "Livraison en ligne",
  deliveryIntro: "Si vous souhaitez commander de la nourriture ou des boissons à Voulamandis House, vous pouvez utiliser l'application Fagi.",
  deliveryImportant: ["Important : choisissez la zone THYMIANA lors de votre commande.", "Si vous choisissez Chios Town, votre commande peut prendre plus de temps."],
  accountIntro: "Pour vous faciliter la tâche, Voulamandis House peut vous aider à commander via Fagi.",
  appAccessTitle: "Accès à l'application Fagi",
  appAccessText: "Pour les identifiants Fagi, veuillez demander à la réception ou nous contacter sur WhatsApp.",
  appDownloadTitle: "Télécharger l'application Fagi",
  appDownloadText: "Téléchargez l'application Fagi et utilisez les informations d'accès fournies par la réception.",
  appDownloadButton: "Télécharger Fagi App",
  coffeeOrdersTitle: "Commandes de café",
  coffeeOrdersText: "Pour une livraison de café, vous pouvez appeler KAFEMANIA.",
  coffeeSandwichesTitle: "Café et sandwichs",
  coffeeSandwichesText: "Pour du café et des sandwichs, vous pouvez contacter STASI.",
  nearbyTitle: "Tavernes et services utiles à Thymiana",
  nearbyIntro: "Tout près de Voulamandis House, vous trouverez le village de Thymiana, à seulement 800 mètres.",
  nearbyParagraphs: ["Vous pouvez facilement rejoindre le village en voiture ou à pied. C'est un endroit pratique pour déjeuner, dîner, prendre un café ou trouver ce dont vous avez besoin.", "Pour plus d'informations sur Chios et des idées d'exploration, n'hésitez pas à nous demander."],
  tavernsTitle: "Tavernes",
  tavernsText: "À Thymiana, vous trouverez Karouli et Kapilio pour un déjeuner ou un dîner détendu.",
  essentialsTitle: "Services quotidiens",
  essentialsText: "Le village dispose aussi de pharmacies, d'une boulangerie et d'une petite épicerie.",
  nearbyTip: "Conseil : Thymiana se trouve à environ 800 mètres de Voulamandis House, idéal pour une courte promenade.",
  podcastTitle: "Podcast : l'histoire de Kampos",
  podcastParagraphs: ["Découvrez l'histoire de la belle et unique région de Kampos, à Chios, grâce à notre expérience podcast.", "Dans le coffre et dans la cour, près de la fourche, vous trouverez des QR codes pour trois podcasts disponibles en grec, anglais et français.", "Ces podcasts partagent des informations uniques sur l'histoire de Kampos, notre région et le domaine où vous séjournez."],
  podcastHighlight: "Nous serions ravis que vous scanniez le QR code dans la langue de votre choix et que vous l'écoutiez pendant votre séjour.",
  marmaladeTitle: "Achetez notre confiture maison",
  marmaladeParagraphs: ["La confiture de mandarine de Chios servie au petit-déjeuner est faite maison avec des mandarines cueillies dans notre propriété chaque janvier.", "Elle est préparée avec soin par Angeliki, sans conservateurs, avec l'arôme naturel des agrumes de Chios."],
  marmaladeHighlight: "Si vous souhaitez acheter notre confiture pour vous ou comme souvenir de Chios, demandez à Angeliki.",
  mandarinTitle: "Confiture de mandarine",
  mandarinText: "Préparée avec des mandarines de Chios de notre propriété, au goût doux et authentique.",
  bergamotTitle: "Confiture de bergamote",
  bergamotText: "Une confiture aromatique au caractère distinctif de Chios.",
  lemonTitle: "Confiture de citron",
  lemonText: "Fraîche, vive et parfumée, parfaite pour les amateurs de citron.",
  tasteTitle: "Un goût de Chios",
  tasteText: "Un joli cadeau ou souvenir pour vous rappeler votre séjour à Voulamandis House.",
  marmaladeThanks: "Merci beaucoup de soutenir nos produits maison et les saveurs locales de Chios.",
  marmaladeButton: "Demander les confitures",
  localProducts: "Vous pouvez également découvrir d'autres produits locaux de Chios ici :",
  rulesTitle: "Règles de séjour",
  rulesIntro: "Pour assurer un séjour confortable à tous et prendre soin de la propriété, nous vous demandons de respecter les consignes suivantes.",
  acTitle: "Climatisation",
  acText: "Veuillez éteindre la climatisation avant de quitter votre chambre.",
  appliancesTitle: "Appareils électriques",
  appliancesText: "Veuillez vérifier que tous les appareils électriques sont éteints avant de quitter la chambre.",
  doorTitle: "Porte extérieure",
  doorText: "Lorsque vous quittez les lieux, veuillez bien fermer la porte extérieure de l'hébergement.",
  toiletTitle: "Utilisation des toilettes",
  toiletText: "Veuillez ne pas jeter de papier ou d'autres objets dans les toilettes. Utilisez la poubelle prévue.",
  parkingTitle: "Stationnement",
  parkingText: "Lors du stationnement, veuillez garder au moins 2 mètres de distance avec le poteau électrique.",
  towelsTitle: "Maquillage et serviettes",
  towelsText: "Veuillez éviter de vous démaquiller avec les serviettes, car cela peut laisser des taches permanentes.",
  beachTowelsTitle: "Serviettes de plage",
  beachTowelsText: "Les serviettes de chambre sont destinées à un usage intérieur uniquement et ne doivent pas être emportées à la plage.",
  thankYouTitle: "Merci",
  thankYouText: "Nous vous remercions sincèrement pour votre coopération, votre compréhension et votre attention pendant votre séjour.",
  rulesThanks: "Merci de nous aider à garder Voulamandis House propre, confortable et accueillant.",
  contactTitle: "Contactez-nous",
  contactIntro: "Si vous avez besoin de quoi que ce soit pendant votre séjour, contactez-nous. Nous serons heureux de vous aider.",
  call: "Appeler",
  email: "Email",
  contactNote: "Pour une communication plus rapide, WhatsApp est généralement le moyen le plus simple.",
  footer: "Merci de séjourner chez nous. Nous vous souhaitons un merveilleux séjour à Chios.",
};

const deText: TextSet = {
  ...enText,
  locale: "de",
  path: "/de/welcome/",
  seoTitle: "Aufenthaltsguide | Voulamandis House",
  seoDescription: "Privater Aufenthaltsguide für Gäste von Voulamandis House in Kampos, Chios, mit WiFi, Frühstück, Lieferung, lokalen Tipps und Hausregeln.",
  languageLabel: "Sprachen",
  homeLabel: "Zur Startseite",
  heroTitle: "Willkommen im Voulamandis House",
  heroText: "Ihr Online-Guide mit WiFi, Frühstück, Lieferung, Hausregeln, lokalen Tipps, Podcasts und einfachen Kontaktmöglichkeiten.",
  quickTitle: "Schnellzugriff",
  quickText: "Finden Sie schnell die wichtigsten Informationen für Ihren Aufenthalt.",
  callUs: "Anrufen",
  breakfastQuick: "Frühstück",
  deliveryQuick: "Lieferung",
  rulesQuick: "Hausregeln",
  welcomeTitle: "Willkommen im Voulamandis House",
  welcomeParagraphs: ["Willkommen im Voulamandis House in der schönen und einzigartigen Gegend Kampos auf Chios. Es ist uns eine große Freude, Sie während Ihres Aufenthalts zu begrüßen.", "Wir sind immer für Sie da, um zuzuhören, zu helfen und Sie bei allem zu unterstützen, was Sie benötigen."],
  welcomeHighlight: "Wir freuen uns über schöne Fotos aus unserem Garten oder von Ihrem Frühstück. Teilen Sie sie gerne mit den Hashtags:",
  instagram: "Wir freuen uns auch, wenn Sie unserem Instagram-Konto folgen: @chioshotels.",
  offers: "Im Laufe des Jahres teilen wir Sonderangebote, saisonale Deals und kleine Geschenke für unsere Gäste.",
  wifiTitle: "WiFi-Informationen",
  wifiIntro: "Sie können sich mit den folgenden Angaben mit unserem WiFi verbinden.",
  network: "Netzwerk",
  accessKey: "Zugangscode",
  accessKeyText: "Verfügbar in Ihrem Zimmerguide oder an der Rezeption.",
  needHelp: "Brauchen Sie Hilfe?",
  needHelpText: "Wenn Sie Verbindungsprobleme haben, kontaktieren Sie uns bitte.",
  breakfastTitle: "Frühstück im Voulamandis House",
  breakfastIntro: "Genießen Sie unser hausgemachtes Frühstück für 12 EUR pro Person und Tag.",
  breakfastParagraphs: ["Probieren Sie authentische Aromen von unserer Zitrusfarm, darunter hausgemachte Mandarinen- und Bergamottenmarmelade, Zitronenkreationen, frischen Saft, Kuchen und Pasteten.", "Jeder Bissen ist von den Traditionen, der Gastfreundschaft und den natürlichen Aromen von Chios inspiriert."],
  breakfastHighlight: "Beginnen Sie Ihren Tag mit einem Frühstück voller lokaler Aromen, hausgemachter Sorgfalt und Inselcharakter.",
  breakfastButton: "Frühstück über WhatsApp buchen",
  deliveryTitle: "Online-Lieferung",
  deliveryIntro: "Wenn Sie Speisen oder Getränke zum Voulamandis House bestellen möchten, können Sie die Fagi-App verwenden.",
  deliveryImportant: ["Wichtig: Wählen Sie bei Ihrer Bestellung den Bereich THYMIANA.", "Wenn Sie Chios Town wählen, kann Ihre Bestellung länger dauern."],
  accountIntro: "Um es Ihnen leichter zu machen, kann Voulamandis House Ihnen bei der Bestellung über Fagi helfen.",
  appAccessTitle: "Zugang zur Fagi-App",
  appAccessText: "Für die Fagi-Zugangsdaten fragen Sie bitte an der Rezeption oder kontaktieren Sie uns über WhatsApp.",
  appDownloadTitle: "Fagi-App herunterladen",
  appDownloadText: "Laden Sie die Fagi-App herunter und verwenden Sie die von der Rezeption bereitgestellten Zugangsdaten.",
  appDownloadButton: "Fagi App herunterladen",
  coffeeOrdersTitle: "Kaffeebestellungen",
  coffeeOrdersText: "Für Kaffee-Lieferung können Sie KAFEMANIA anrufen.",
  coffeeSandwichesTitle: "Kaffee und Sandwiches",
  coffeeSandwichesText: "Für Kaffee und Sandwiches können Sie STASI kontaktieren.",
  nearbyTitle: "Nahegelegene Tavernen und Nützliches in Thymiana",
  nearbyIntro: "Ganz in der Nähe von Voulamandis House liegt das Dorf Thymiana, nur etwa 800 Meter entfernt.",
  nearbyParagraphs: ["Sie erreichen das Dorf leicht mit dem Auto oder zu Fuß. Es ist praktisch für Mittagessen, Abendessen, Kaffee oder tägliche Besorgungen.", "Für weitere Informationen über Chios und Ideen zur Erkundung fragen Sie uns gerne."],
  tavernsTitle: "Tavernen",
  tavernsText: "In Thymiana finden Sie Karouli und Kapilio für ein entspanntes Mittag- oder Abendessen.",
  essentialsTitle: "Alltägliches",
  essentialsText: "Im Dorf gibt es auch Apotheken, eine Bäckerei und ein kleines Lebensmittelgeschäft.",
  nearbyTip: "Tipp: Thymiana liegt etwa 800 Meter von Voulamandis House entfernt und eignet sich gut für einen kurzen Spaziergang.",
  podcastTitle: "Podcast: Die Geschichte von Kampos",
  podcastParagraphs: ["Entdecken Sie die Geschichte der schönen und einzigartigen Gegend Kampos auf Chios durch unser Podcast-Erlebnis.", "Auf der Truhe und im Innenhof, nahe der Mistgabel, finden Sie QR-Codes für drei Podcasts auf Griechisch, Englisch und Französisch.", "Diese Podcasts teilen besondere Informationen über die Geschichte von Kampos, unsere Gegend und das Anwesen, in dem Sie wohnen."],
  podcastHighlight: "Wir würden uns freuen, wenn Sie den QR-Code in Ihrer bevorzugten Sprache scannen und während Ihres Aufenthalts anhören.",
  marmaladeTitle: "Kaufen Sie unsere hausgemachte Marmelade",
  marmaladeParagraphs: ["Die Chios-Mandarinenmarmelade, die wir zum Frühstück servieren, ist hausgemacht und wird aus Mandarinen unseres Anwesens hergestellt, die jeden Januar geerntet werden.", "Sie wird von Angeliki liebevoll und ohne Konservierungsstoffe zubereitet."],
  marmaladeHighlight: "Wenn Sie unsere Marmelade für sich selbst oder als Souvenir aus Chios kaufen möchten, fragen Sie bitte Angeliki.",
  mandarinTitle: "Mandarinenmarmelade",
  mandarinText: "Hergestellt aus Chios-Mandarinen von unserem Anwesen, mit süßem und authentischem Zitrusgeschmack.",
  bergamotTitle: "Bergamottenmarmelade",
  bergamotText: "Eine aromatische Marmelade mit unverwechselbarem Chios-Charakter.",
  lemonTitle: "Zitronenmarmelade",
  lemonText: "Frisch, hell und aromatisch, perfekt für Zitronenliebhaber.",
  tasteTitle: "Ein Geschmack von Chios",
  tasteText: "Ein schönes Geschenk oder Souvenir, um sich an Ihren Aufenthalt im Voulamandis House zu erinnern.",
  marmaladeThanks: "Vielen Dank, dass Sie unsere hausgemachten Produkte und lokalen Aromen von Chios unterstützen.",
  marmaladeButton: "Nach Marmeladen fragen",
  localProducts: "Weitere lokale Produkte aus Chios finden Sie hier:",
  rulesTitle: "Hausregeln",
  rulesIntro: "Für einen angenehmen Aufenthalt für alle und zum Schutz der Unterkunft bitten wir Sie, die folgenden Hinweise zu beachten.",
  acTitle: "Klimaanlage",
  acText: "Bitte schalten Sie die Klimaanlage aus, bevor Sie Ihr Zimmer verlassen.",
  appliancesTitle: "Elektrische Geräte",
  appliancesText: "Bitte stellen Sie sicher, dass alle elektrischen Geräte ausgeschaltet sind, bevor Sie das Zimmer verlassen.",
  doorTitle: "Außentür",
  doorText: "Wenn Sie das Gelände verlassen, schließen Sie bitte die Außentür der Unterkunft sorgfältig.",
  toiletTitle: "Toilettennutzung",
  toiletText: "Bitte werfen Sie kein Papier oder andere Gegenstände in die Toilette. Nutzen Sie den bereitgestellten Mülleimer.",
  parkingTitle: "Parken",
  parkingText: "Bitte halten Sie beim Parken mindestens 2 Meter Abstand zur Stromsäule.",
  towelsTitle: "Make-up und Handtücher",
  towelsText: "Bitte entfernen Sie Make-up nicht mit den Handtüchern, da dies dauerhafte Flecken verursachen kann.",
  beachTowelsTitle: "Strandtücher",
  beachTowelsText: "Die Zimmerhandtücher sind nur für die Nutzung in der Unterkunft bestimmt und sollten nicht zum Strand mitgenommen werden.",
  thankYouTitle: "Danke",
  thankYouText: "Wir danken Ihnen herzlich für Ihre Kooperation, Ihr Verständnis und Ihre Sorgfalt während Ihres Aufenthalts.",
  rulesThanks: "Vielen Dank, dass Sie uns helfen, Voulamandis House sauber, komfortabel und einladend zu halten.",
  contactTitle: "Kontakt",
  contactIntro: "Wenn Sie während Ihres Aufenthalts etwas benötigen, kontaktieren Sie uns bitte. Wir helfen Ihnen gerne.",
  call: "Anrufen",
  email: "Email",
  contactNote: "Für eine schnellere Kommunikation ist WhatsApp normalerweise der einfachste Weg.",
  footer: "Vielen Dank für Ihren Aufenthalt. Wir wünschen Ihnen eine wunderbare Zeit auf Chios.",
};

const itText: TextSet = { ...enText, locale: "it", path: "/it/welcome/", seoTitle: "Guida al soggiorno | Voulamandis House", seoDescription: "Guida privata per gli ospiti di Voulamandis House a Kampos, Chios, con WiFi, colazione, consegne, consigli locali e regole della casa.", languageLabel: "Lingue", homeLabel: "Torna alla homepage", heroTitle: "Benvenuti a Voulamandis House", heroText: "La vostra guida online con WiFi, colazione, consegne, regole della casa, consigli locali, podcast e modi semplici per contattarci.", quickTitle: "Accesso rapido", quickText: "Trovate rapidamente le informazioni più utili per il vostro soggiorno.", callUs: "Chiamaci", breakfastQuick: "Colazione", deliveryQuick: "Consegna", rulesQuick: "Regole", welcomeTitle: "Benvenuti a Voulamandis House", contactTitle: "Contatti", footer: "Grazie per aver soggiornato da noi. Vi auguriamo un meraviglioso soggiorno a Chios." };
const esText: TextSet = { ...enText, locale: "es", path: "/es/welcome/", seoTitle: "Guía de estancia | Voulamandis House", seoDescription: "Guía privada para huéspedes de Voulamandis House en Kampos, Chios, con WiFi, desayuno, delivery, consejos locales y normas de la casa.", languageLabel: "Idiomas", homeLabel: "Volver al inicio", heroTitle: "Bienvenidos a Voulamandis House", heroText: "Su guía online con WiFi, desayuno, delivery, normas de la casa, consejos locales, podcasts y formas sencillas de contactarnos.", quickTitle: "Acceso rápido", quickText: "Encuentre rápidamente la información más útil para su estancia.", callUs: "Llamar", breakfastQuick: "Desayuno", deliveryQuick: "Delivery", rulesQuick: "Normas", welcomeTitle: "Bienvenidos a Voulamandis House", contactTitle: "Contacto", footer: "Gracias por alojarse con nosotros. Le deseamos una maravillosa estancia en Chios." };
const trText: TextSet = { ...enText, locale: "tr", path: "/tr/welcome/", seoTitle: "Konaklama Rehberi | Voulamandis House", seoDescription: "Kampos, Sakız Adası'ndaki Voulamandis House misafirleri için WiFi, kahvaltı, teslimat, yerel öneriler ve ev kuralları içeren özel rehber.", languageLabel: "Diller", homeLabel: "Ana sayfaya dön", heroTitle: "Voulamandis House'a hoş geldiniz", heroText: "WiFi, kahvaltı, yemek teslimatı, ev kuralları, yerel öneriler, podcastler ve kolay iletişim yolları içeren online rehberiniz.", quickTitle: "Hızlı erişim", quickText: "Konaklamanız için en yararlı bilgilere hızlıca ulaşın.", callUs: "Bizi arayın", breakfastQuick: "Kahvaltı", deliveryQuick: "Teslimat", rulesQuick: "Ev kuralları", welcomeTitle: "Voulamandis House'a hoş geldiniz", contactTitle: "İletişim", footer: "Bizimle konakladığınız için teşekkür ederiz. Chios'ta harika zaman geçirmenizi dileriz." };

const welcomeCopyByLocale: Record<LanguageCode, WelcomePageCopy> = {
  en: makeCopy(enText),
  el: makeCopy(elText),
  fr: makeCopy(frText),
  de: makeCopy(deText),
  it: makeCopy(itText),
  es: makeCopy(esText),
  tr: makeCopy(trText),
};

export function getWelcomeCopy(locale: LanguageCode): WelcomePageCopy {
  return welcomeCopyByLocale[locale] ?? welcomeCopyByLocale.en;
}

export const getWelcomePageByLocale = getWelcomeCopy;
