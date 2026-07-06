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

type LocalizedText = {
  locale: LanguageCode;
  canonicalPath: string;
  seoTitle: string;
  seoDescription: string;
  languageLabel: string;
  homeLabel: string;
  badge: string;
  heroTitle: string;
  heroText: string;
  quickTitle: string;
  quickText: string;
  quickCall: string;
  quickBreakfast: string;
  quickDelivery: string;
  quickRules: string;
  welcomeTitle: string;
  welcomeParagraphs: string[];
  welcomeHighlight: string;
  welcomeInstagram: string;
  welcomeOffers: string;
  wifiTitle: string;
  wifiIntro: string;
  wifiNetwork: string;
  wifiPassword: string;
  wifiHelp: string;
  wifiHelpText: string;
  breakfastTitle: string;
  breakfastIntro: string;
  breakfastParagraphs: string[];
  breakfastHighlight: string;
  breakfastButton: string;
  deliveryTitle: string;
  deliveryIntro: string;
  deliveryImportant: string[];
  deliveryAccountIntro: string;
  fagiLoginTitle: string;
  fagiAppTitle: string;
  fagiAppText: string;
  fagiAppButton: string;
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
  contactCall: string;
  contactEmail: string;
  contactNote: string;
  footer: string;
};

function buildWelcomeCopy(copy: LocalizedText): WelcomePageCopy {
  return {
    locale: copy.locale,
    seo: {
      canonicalPath: copy.canonicalPath,
      title: copy.seoTitle,
      description: copy.seoDescription,
      ogImage: welcomeImages.hero,
    },
    nav: { languageLabel: copy.languageLabel, homeLabel: copy.homeLabel },
    hero: { badge: copy.badge, title: copy.heroTitle, text: copy.heroText },
    quick: {
      title: copy.quickTitle,
      text: copy.quickText,
      whatsapp: "WhatsApp",
      call: copy.quickCall,
      wifi: "WiFi",
      breakfast: copy.quickBreakfast,
      delivery: copy.quickDelivery,
      rules: copy.quickRules,
    },
    sections: {
      welcome: {
        title: copy.welcomeTitle,
        paragraphs: copy.welcomeParagraphs,
        highlight: copy.welcomeHighlight,
        hashtags: "#voulamandishouse - #voulamandis - #chioshotels",
        instagram: copy.welcomeInstagram,
        offers: copy.welcomeOffers,
      },
      wifi: {
        title: copy.wifiTitle,
        intro: copy.wifiIntro,
        cards: [
          { title: copy.wifiNetwork, text: ["VH"] },
          { title: copy.wifiPassword, text: ["a12345678"] },
          { title: copy.wifiHelp, text: [copy.wifiHelpText] },
        ],
      },
      breakfast: {
        title: copy.breakfastTitle,
        intro: copy.breakfastIntro,
        paragraphs: copy.breakfastParagraphs,
        highlight: copy.breakfastHighlight,
        button: copy.breakfastButton,
      },
      delivery: {
        title: copy.deliveryTitle,
        intro: copy.deliveryIntro,
        important: copy.deliveryImportant,
        accountIntro: copy.deliveryAccountIntro,
        items: [
          { title: copy.fagiLoginTitle, text: ["Username: vhouse.reservations@gmail.com", "Password: chioshotel.gr"] },
          {
            title: copy.fagiAppTitle,
            text: [copy.fagiAppText],
            button: {
              label: copy.fagiAppButton,
              href: "https://play.google.com/store/apps/details?id=com.fagi.fagi.gr&hl=el",
              external: true,
            },
          },
          {
            title: copy.coffeeOrdersTitle,
            text: [copy.coffeeOrdersText, "Phone: 2271 033417"],
            button: { label: "Call KAFEMANIA", href: "tel:+302271033417", variant: "blue" },
          },
          {
            title: copy.coffeeSandwichesTitle,
            text: [copy.coffeeSandwichesText, "Phone: 2271 021256"],
            button: { label: "Call STASI", href: "tel:+302271021256", variant: "blue" },
          },
        ],
      },
      nearby: {
        title: copy.nearbyTitle,
        intro: copy.nearbyIntro,
        paragraphs: copy.nearbyParagraphs,
        items: [
          { title: copy.tavernsTitle, text: [copy.tavernsText] },
          { title: copy.essentialsTitle, text: [copy.essentialsText] },
        ],
        tip: copy.nearbyTip,
      },
      podcast: {
        title: copy.podcastTitle,
        paragraphs: copy.podcastParagraphs,
        highlight: copy.podcastHighlight,
      },
      marmalade: {
        title: copy.marmaladeTitle,
        paragraphs: copy.marmaladeParagraphs,
        highlight: copy.marmaladeHighlight,
        items: [
          { title: copy.mandarinTitle, text: [copy.mandarinText] },
          { title: copy.bergamotTitle, text: [copy.bergamotText] },
          { title: copy.lemonTitle, text: [copy.lemonText] },
          { title: copy.tasteTitle, text: [copy.tasteText] },
        ],
        thanks: copy.marmaladeThanks,
        button: copy.marmaladeButton,
        localProducts: copy.localProducts,
      },
      rules: {
        title: copy.rulesTitle,
        intro: copy.rulesIntro,
        items: [
          { title: copy.acTitle, text: [copy.acText] },
          { title: copy.appliancesTitle, text: [copy.appliancesText] },
          { title: copy.doorTitle, text: [copy.doorText] },
          { title: copy.toiletTitle, text: [copy.toiletText] },
          { title: copy.parkingTitle, text: [copy.parkingText] },
          { title: copy.towelsTitle, text: [copy.towelsText] },
          { title: copy.beachTowelsTitle, text: [copy.beachTowelsText] },
          { title: copy.thankYouTitle, text: [copy.thankYouText] },
        ],
        thanks: copy.rulesThanks,
      },
      contact: {
        title: copy.contactTitle,
        intro: copy.contactIntro,
        whatsapp: "WhatsApp",
        call: copy.contactCall,
        email: copy.contactEmail,
        note: copy.contactNote,
      },
    },
    footer: copy.footer,
  };
}

const enText: LocalizedText = {
  locale: "en",
  canonicalPath: "/welcome/",
  seoTitle: "Guest Welcome Guide | Voulamandis House",
  seoDescription: "Private welcome guide for guests of Voulamandis House in Kampos, Chios, with WiFi, breakfast, delivery, local tips and house rules.",
  languageLabel: "Languages",
  homeLabel: "Back to homepage",
  badge: "Voulamandis House - Kampos, Chios",
  heroTitle: "Welcome to Voulamandis House",
  heroText: "Your online stay guide with WiFi, breakfast, food delivery, house rules, local tips, podcasts, and easy ways to contact us during your stay.",
  quickTitle: "Quick Access",
  quickText: "Find the most useful information for your stay quickly.",
  quickCall: "Call Us",
  quickBreakfast: "Breakfast",
  quickDelivery: "Delivery",
  quickRules: "House Rules",
  welcomeTitle: "Welcome to Voulamandis House",
  welcomeParagraphs: [
    "Welcome to Voulamandis House, located in the beautiful and unique area of Kampos, Chios. It is a great pleasure for us to host you during your stay.",
    "We are always here to listen, help, and assist you with anything you may need while staying with us. Please feel free to contact us through our social media accounts listed below, or through reception.",
  ],
  welcomeHighlight: "We would love to see your beautiful photos from our garden or from your morning breakfast moments. Share them with us using the hashtags:",
  welcomeInstagram: "We would also be very happy if you followed our Instagram account: @chioshotels.",
  welcomeOffers: "Throughout the year, we share special offers, seasonal deals, and small gifts for our guests and returning visitors.",
  wifiTitle: "WiFi Information",
  wifiIntro: "You can connect to our WiFi network using the details below.",
  wifiNetwork: "Network",
  wifiPassword: "Password",
  wifiHelp: "Need help?",
  wifiHelpText: "If you have any trouble connecting, please contact us.",
  breakfastTitle: "Breakfast at Voulamandis House",
  breakfastIntro: "Enjoy our homemade breakfast experience for just 12 EUR per person, per day.",
  breakfastParagraphs: ["Taste authentic flavors from our citrus farm, including homemade mandarin and bergamot marmalades, lemon creations, fresh homemade juice, cakes, and pies.", "Every bite is inspired by the traditions, hospitality, and natural flavors of Chios."],
  breakfastHighlight: "Start your day with a breakfast full of local taste, homemade care, and island character.",
  breakfastButton: "Book Breakfast via WhatsApp",
  deliveryTitle: "Online Delivery",
  deliveryIntro: "If you would like to order food or drinks for delivery to Voulamandis House, you can use the Fagi app, which works in a similar way to efood.",
  deliveryImportant: ["Important: Please choose the area THYMIANA when placing your order.", "If you select Chios Town, your order may take longer to arrive."],
  deliveryAccountIntro: "To make things easier for you, Voulamandis House has its own Fagi account, so you do not need to create a new one.",
  fagiLoginTitle: "Fagi Login Details",
  fagiAppTitle: "Download the App",
  fagiAppText: "Download the Fagi app and use the login details above to place your order.",
  fagiAppButton: "Download Fagi App",
  coffeeOrdersTitle: "Coffee Orders",
  coffeeOrdersText: "For coffee delivery, you can call KAFEMANIA.",
  coffeeSandwichesTitle: "Coffee and Sandwiches",
  coffeeSandwichesText: "For coffee and sandwiches, you can contact STASI.",
  nearbyTitle: "Nearby Taverns and Essentials in Thymiana",
  nearbyIntro: "Very close to Voulamandis House, you will find the village of Thymiana, just 800 meters away.",
  nearbyParagraphs: ["You can easily reach the village by car or on foot. It is a convenient place for lunch, dinner, coffee, or anything you may need during your stay.", "For more information about Chios and ideas for exploring the island, please feel free to ask us. We will be happy to share local recommendations."],
  tavernsTitle: "Taverns",
  tavernsText: "In Thymiana, you will find two lovely taverns, Karouli and Kapilio, where you can enjoy a relaxed lunch or dinner.",
  essentialsTitle: "Everyday Essentials",
  essentialsText: "The village also has two pharmacies, a bakery, and a local grocery store.",
  nearbyTip: "Tip: Thymiana is only about 800 meters from Voulamandis House, making it an easy walk for food, coffee, or daily essentials.",
  podcastTitle: "Podcast: The History of Kampos",
  podcastParagraphs: ["Discover the history of the beautiful and unique area of Kampos, Chios through our special podcast experience.", "On the chest and in the courtyard, near the pitchfork, you will find QR codes for three wonderful podcasts available in Greek, English, and French.", "These podcasts share unique information about the history of Kampos, our local area, and the estate where you are staying."],
  podcastHighlight: "We would be delighted if you scanned the QR code in your preferred language and enjoyed listening during your stay.",
  marmaladeTitle: "Buy Our Homemade Marmalade",
  marmaladeParagraphs: ["The Chios mandarin marmalade served at our breakfast is homemade with mandarins collected from our own property every January.", "It is lovingly prepared by Angeliki, without any preservatives, using traditional care and the natural aroma of Chios citrus fruits."],
  marmaladeHighlight: "If you would like to purchase our marmalade for yourself or as a special souvenir from Chios, please feel free to ask Angeliki.",
  mandarinTitle: "Mandarin Marmalade",
  mandarinText: "Made from Chios mandarins collected from our estate, with a sweet and authentic citrus flavor.",
  bergamotTitle: "Bergamot Marmalade",
  bergamotText: "An exceptional marmalade with a unique, elegant aroma and a distinctive Chios character.",
  lemonTitle: "Lemon Marmalade",
  lemonText: "Fresh, bright, and aromatic, perfect for those who love the taste of lemon.",
  tasteTitle: "A Taste of Chios",
  tasteText: "A lovely gift or souvenir to take home and remember your stay at Voulamandis House.",
  marmaladeThanks: "Thank you very much for supporting our homemade products and local Chios flavors.",
  marmaladeButton: "Ask About Marmalades",
  localProducts: "You can also discover more local Chios products here:",
  rulesTitle: "House Rules",
  rulesIntro: "To ensure a comfortable stay for everyone and to help us take good care of the property, we kindly ask you to observe the following guidelines during your stay.",
  acTitle: "Air Conditioning",
  acText: "Please switch off the air conditioner before leaving your room.",
  appliancesTitle: "Electrical Appliances",
  appliancesText: "Please make sure all electrical appliances are turned off before leaving the room.",
  doorTitle: "External Door",
  doorText: "When leaving the premises, please securely close the external door of the guesthouse.",
  toiletTitle: "Toilet Use",
  toiletText: "Please do not dispose of paper or other items in the toilet. Use the bin provided.",
  parkingTitle: "Parking",
  parkingText: "When parking, please keep a distance of at least 2 meters from the DEI / Public Power Corporation column.",
  towelsTitle: "Makeup and Towels",
  towelsText: "Please avoid removing makeup with the guest towels, as makeup products can permanently damage the fabric.",
  beachTowelsTitle: "Beach Towels",
  beachTowelsText: "The room towels are intended for use inside the guesthouse only and should not be taken to the beach.",
  thankYouTitle: "Thank You",
  thankYouText: "We sincerely appreciate your cooperation, understanding, and care during your stay.",
  rulesThanks: "Thank you for helping us keep Voulamandis House clean, comfortable, and welcoming for all our guests.",
  contactTitle: "Contact Us",
  contactIntro: "If you need anything during your stay, please contact us. We are happy to help.",
  contactCall: "Call",
  contactEmail: "Email",
  contactNote: "For faster communication, WhatsApp is usually the easiest way to reach us.",
  footer: "Thank you for staying with us. We wish you a wonderful time in Chios.",
};

const elText: LocalizedText = {
  ...enText,
  locale: "el",
  canonicalPath: "/el/welcome/",
  seoTitle: "Οδηγός Διαμονής | Voulamandis House",
  seoDescription: "Ιδιωτικός οδηγός διαμονής για τους επισκέπτες του Voulamandis House στον Κάμπο Χίου, με WiFi, πρωινό, delivery, τοπικές προτάσεις και κανόνες διαμονής.",
  languageLabel: "Γλώσσες",
  homeLabel: "Επιστροφή στην αρχική",
  badge: "Voulamandis House - Κάμπος, Χίος",
  heroTitle: "Καλώς ήρθατε στο Voulamandis House",
  heroText: "Ο online οδηγός διαμονής σας με WiFi, πρωινό, delivery, κανόνες, τοπικές προτάσεις, podcasts και εύκολη επικοινωνία μαζί μας.",
  quickTitle: "Γρήγορη πρόσβαση",
  quickText: "Βρείτε γρήγορα τις πιο χρήσιμες πληροφορίες για τη διαμονή σας.",
  quickCall: "Καλέστε μας",
  quickBreakfast: "Πρωινό",
  quickDelivery: "Delivery",
  quickRules: "Κανόνες",
  welcomeTitle: "Καλώς ήρθατε στο Voulamandis House",
  welcomeParagraphs: ["Καλώς ήρθατε στο Voulamandis House, στην όμορφη και ξεχωριστή περιοχή του Κάμπου στη Χίο. Είναι μεγάλη μας χαρά να σας φιλοξενούμε.", "Είμαστε πάντα διαθέσιμοι να σας ακούσουμε, να σας βοηθήσουμε και να σας εξυπηρετήσουμε σε ό,τι χρειαστείτε κατά τη διαμονή σας."],
  welcomeHighlight: "Θα χαρούμε πολύ να δούμε όμορφες φωτογραφίες σας από τον κήπο ή από το πρωινό σας. Μοιραστείτε τις με τα hashtags:",
  welcomeInstagram: "Θα χαρούμε επίσης αν ακολουθήσετε τον λογαριασμό μας στο Instagram: @chioshotels.",
  welcomeOffers: "Κατά τη διάρκεια της χρονιάς μοιραζόμαστε ειδικές προσφορές, εποχιακά deals και μικρά δώρα για τους επισκέπτες μας.",
  wifiTitle: "Πληροφορίες WiFi",
  wifiIntro: "Μπορείτε να συνδεθείτε στο WiFi με τα παρακάτω στοιχεία.",
  wifiNetwork: "Δίκτυο",
  wifiPassword: "Κωδικός",
  wifiHelp: "Χρειάζεστε βοήθεια;",
  wifiHelpText: "Αν έχετε δυσκολία στη σύνδεση, επικοινωνήστε μαζί μας.",
  breakfastTitle: "Πρωινό στο Voulamandis House",
  breakfastIntro: "Απολαύστε το σπιτικό μας πρωινό με 12 EUR ανά άτομο, ανά ημέρα.",
  breakfastParagraphs: ["Δοκιμάστε αυθεντικές γεύσεις από το περιβόλι μας, όπως σπιτικές μαρμελάδες μανταρίνι και περγαμόντο, δημιουργίες λεμονιού, φρέσκο σπιτικό χυμό, κέικ και πίτες.", "Κάθε γεύση είναι εμπνευσμένη από την παράδοση, τη φιλοξενία και τα φυσικά αρώματα της Χίου."],
  breakfastHighlight: "Ξεκινήστε τη μέρα σας με ένα πρωινό γεμάτο τοπική γεύση και σπιτική φροντίδα.",
  breakfastButton: "Κράτηση πρωινού μέσω WhatsApp",
  deliveryTitle: "Online Delivery",
  deliveryIntro: "Αν θέλετε να παραγγείλετε φαγητό ή ροφήματα στο Voulamandis House, μπορείτε να χρησιμοποιήσετε την εφαρμογή Fagi.",
  deliveryImportant: ["Σημαντικό: Επιλέξτε περιοχή ΘΥΜΙΑΝΑ όταν κάνετε την παραγγελία.", "Αν επιλέξετε Χώρα Χίου, η παραγγελία μπορεί να καθυστερήσει."],
  deliveryAccountIntro: "Για ευκολία, το Voulamandis House διαθέτει δικό του λογαριασμό Fagi, ώστε να μην χρειάζεται να δημιουργήσετε νέο.",
  fagiLoginTitle: "Στοιχεία σύνδεσης Fagi",
  fagiAppTitle: "Λήψη εφαρμογής",
  fagiAppText: "Κατεβάστε την εφαρμογή Fagi και χρησιμοποιήστε τα παραπάνω στοιχεία σύνδεσης για την παραγγελία σας.",
  fagiAppButton: "Λήψη Fagi App",
  coffeeOrdersTitle: "Παραγγελίες καφέ",
  coffeeOrdersText: "Για delivery καφέ μπορείτε να καλέσετε το KAFEMANIA.",
  coffeeSandwichesTitle: "Καφές και σάντουιτς",
  coffeeSandwichesText: "Για καφέ και σάντουιτς μπορείτε να επικοινωνήσετε με το STASI.",
  nearbyTitle: "Κοντινές ταβέρνες και χρήσιμα στα Θυμιανά",
  nearbyIntro: "Πολύ κοντά στο Voulamandis House βρίσκεται το χωριό Θυμιανά, περίπου 800 μέτρα μακριά.",
  nearbyParagraphs: ["Μπορείτε να πάτε εύκολα με αυτοκίνητο ή με τα πόδια. Είναι βολικό σημείο για φαγητό, καφέ ή καθημερινές ανάγκες.", "Για περισσότερες πληροφορίες για τη Χίο και ιδέες εξερεύνησης, ρωτήστε μας. Θα χαρούμε να σας προτείνουμε τοπικές επιλογές."],
  tavernsTitle: "Ταβέρνες",
  tavernsText: "Στα Θυμιανά θα βρείτε τις ταβέρνες Καρούλι και Καπηλειό για χαλαρό φαγητό.",
  essentialsTitle: "Καθημερινές ανάγκες",
  essentialsText: "Στο χωριό υπάρχουν επίσης φαρμακεία, φούρνος και μίνι μάρκετ.",
  nearbyTip: "Συμβουλή: Τα Θυμιανά απέχουν περίπου 800 μέτρα από το Voulamandis House.",
  podcastTitle: "Podcast: Η ιστορία του Κάμπου",
  podcastParagraphs: ["Ανακαλύψτε την ιστορία του όμορφου και μοναδικού Κάμπου της Χίου μέσα από την ειδική podcast εμπειρία μας.", "Στο μπαούλο και στην αυλή, κοντά στη δικέλα, θα βρείτε QR codes για τρία podcasts στα ελληνικά, αγγλικά και γαλλικά.", "Τα podcasts μοιράζονται ξεχωριστές πληροφορίες για την ιστορία του Κάμπου, την περιοχή και το κτήμα όπου διαμένετε."],
  podcastHighlight: "Θα χαρούμε να σαρώσετε το QR code στη γλώσσα που προτιμάτε και να το απολαύσετε κατά τη διαμονή σας.",
  marmaladeTitle: "Αγοράστε τη σπιτική μας μαρμελάδα",
  marmaladeParagraphs: ["Η μαρμελάδα μανταρίνι Χίου που σερβίρεται στο πρωινό μας είναι σπιτική, από μανταρίνια του κτήματός μας.", "Παρασκευάζεται με φροντίδα από την Αγγελική, χωρίς συντηρητικά, με το φυσικό άρωμα των εσπεριδοειδών της Χίου."],
  marmaladeHighlight: "Αν θέλετε να αγοράσετε μαρμελάδα για εσάς ή ως αναμνηστικό από τη Χίο, ρωτήστε την Αγγελική.",
  mandarinTitle: "Μαρμελάδα μανταρίνι",
  mandarinText: "Φτιαγμένη από μανταρίνια Χίου του κτήματός μας, με αυθεντική γεύση εσπεριδοειδών.",
  bergamotTitle: "Μαρμελάδα περγαμόντο",
  bergamotText: "Ξεχωριστή μαρμελάδα με ιδιαίτερο άρωμα και χιώτικο χαρακτήρα.",
  lemonTitle: "Μαρμελάδα λεμόνι",
  lemonText: "Φρέσκια και αρωματική, ιδανική για όσους αγαπούν τη γεύση λεμονιού.",
  tasteTitle: "Μια γεύση από τη Χίο",
  tasteText: "Όμορφο δώρο ή αναμνηστικό για να θυμάστε τη διαμονή σας στο Voulamandis House.",
  marmaladeThanks: "Σας ευχαριστούμε που στηρίζετε τα σπιτικά προϊόντα και τις τοπικές γεύσεις της Χίου.",
  marmaladeButton: "Ρωτήστε για τις μαρμελάδες",
  localProducts: "Μπορείτε επίσης να ανακαλύψετε περισσότερα τοπικά προϊόντα Χίου εδώ:",
  rulesTitle: "Κανόνες διαμονής",
  rulesIntro: "Για μια άνετη διαμονή για όλους και για τη σωστή φροντίδα του χώρου, σας παρακαλούμε να τηρείτε τις παρακάτω οδηγίες.",
  acTitle: "Κλιματισμός",
  acText: "Παρακαλούμε σβήνετε το κλιματιστικό πριν φύγετε από το δωμάτιο.",
  appliancesTitle: "Ηλεκτρικές συσκευές",
  appliancesText: "Παρακαλούμε βεβαιωθείτε ότι όλες οι ηλεκτρικές συσκευές είναι κλειστές πριν φύγετε.",
  doorTitle: "Εξωτερική πόρτα",
  doorText: "Όταν φεύγετε από τον χώρο, παρακαλούμε κλείνετε καλά την εξωτερική πόρτα.",
  toiletTitle: "Χρήση τουαλέτας",
  toiletText: "Παρακαλούμε μην πετάτε χαρτιά ή άλλα αντικείμενα στην τουαλέτα. Χρησιμοποιήστε τον κάδο.",
  parkingTitle: "Στάθμευση",
  parkingText: "Κατά τη στάθμευση, κρατήστε απόσταση τουλάχιστον 2 μέτρων από την κολώνα της ΔΕΗ.",
  towelsTitle: "Μακιγιάζ και πετσέτες",
  towelsText: "Παρακαλούμε αποφύγετε την αφαίρεση μακιγιάζ με τις πετσέτες, γιατί μπορεί να προκληθούν μόνιμοι λεκέδες.",
  beachTowelsTitle: "Πετσέτες παραλίας",
  beachTowelsText: "Οι πετσέτες δωματίου είναι μόνο για χρήση μέσα στο κατάλυμα και δεν πρέπει να μεταφέρονται στην παραλία.",
  thankYouTitle: "Ευχαριστούμε",
  thankYouText: "Σας ευχαριστούμε για τη συνεργασία, την κατανόηση και τη φροντίδα κατά τη διαμονή σας.",
  rulesThanks: "Σας ευχαριστούμε που μας βοηθάτε να διατηρούμε το Voulamandis House καθαρό και φιλόξενο.",
  contactTitle: "Επικοινωνία",
  contactIntro: "Αν χρειαστείτε οτιδήποτε κατά τη διαμονή σας, επικοινωνήστε μαζί μας. Θα χαρούμε να βοηθήσουμε.",
  contactCall: "Κλήση",
  contactEmail: "Email",
  contactNote: "Για πιο άμεση επικοινωνία, το WhatsApp είναι συνήθως ο ευκολότερος τρόπος.",
  footer: "Σας ευχαριστούμε που μένετε μαζί μας. Σας ευχόμαστε υπέροχο χρόνο στη Χίο.",
};

const frText: LocalizedText = {
  ...enText,
  locale: "fr",
  canonicalPath: "/fr/welcome/",
  seoTitle: "Guide de séjour | Voulamandis House",
  seoDescription: "Guide privé pour les clients de Voulamandis House à Kampos, Chios, avec WiFi, petit-déjeuner, livraison, conseils locaux et règles de séjour.",
  languageLabel: "Langues",
  homeLabel: "Retour à l'accueil",
  badge: "Voulamandis House - Kampos, Chios",
  heroTitle: "Bienvenue à Voulamandis House",
  heroText: "Votre guide de séjour en ligne avec WiFi, petit-déjeuner, livraison, règles de séjour, conseils locaux, podcasts et contacts utiles.",
  quickTitle: "Accès rapide",
  quickText: "Retrouvez rapidement les informations les plus utiles pour votre séjour.",
  quickCall: "Nous appeler",
  quickBreakfast: "Petit-déjeuner",
  quickDelivery: "Livraison",
  quickRules: "Règles de séjour",
  welcomeTitle: "Bienvenue à Voulamandis House",
  welcomeParagraphs: ["Bienvenue à Voulamandis House, dans la belle région de Kampos à Chios. Nous sommes ravis de vous accueillir.", "Nous sommes toujours disponibles pour vous aider pendant votre séjour."],
  welcomeHighlight: "Nous serions heureux de voir vos photos du jardin ou de votre petit-déjeuner. Partagez-les avec les hashtags :",
  welcomeInstagram: "Nous serions également heureux si vous suiviez notre compte Instagram : @chioshotels.",
  welcomeOffers: "Tout au long de l'année, nous partageons des offres spéciales et de petits cadeaux pour nos clients.",
  wifiTitle: "Informations WiFi",
  wifiIntro: "Vous pouvez vous connecter au WiFi avec les informations ci-dessous.",
  wifiNetwork: "Réseau",
  wifiPassword: "Mot de passe",
  wifiHelp: "Besoin d'aide ?",
  wifiHelpText: "Si vous avez des difficultés de connexion, contactez-nous.",
  breakfastTitle: "Petit-déjeuner à Voulamandis House",
  breakfastIntro: "Profitez de notre petit-déjeuner maison pour 12 EUR par personne et par jour.",
  breakfastButton: "Réserver le petit-déjeuner via WhatsApp",
  deliveryTitle: "Livraison en ligne",
  deliveryIntro: "Pour commander de la nourriture ou des boissons, vous pouvez utiliser l'application Fagi.",
  deliveryImportant: ["Important : choisissez la zone THYMIANA lors de votre commande.", "Si vous choisissez Chios Town, la commande peut prendre plus de temps."],
  fagiLoginTitle: "Identifiants Fagi",
  fagiAppTitle: "Télécharger l'application",
  fagiAppText: "Téléchargez l'application Fagi et utilisez les identifiants ci-dessus pour commander.",
  fagiAppButton: "Télécharger Fagi App",
  contactTitle: "Contact",
  contactCall: "Appeler",
  contactEmail: "Email",
  footer: "Merci de séjourner chez nous. Nous vous souhaitons un merveilleux séjour à Chios.",
};

const deText: LocalizedText = {
  ...enText,
  locale: "de",
  canonicalPath: "/de/welcome/",
  seoTitle: "Aufenthaltsguide | Voulamandis House",
  seoDescription: "Privater Aufenthaltsguide für Gäste von Voulamandis House in Kampos, Chios, mit WiFi, Frühstück, Lieferung, lokalen Tipps und Hausregeln.",
  languageLabel: "Sprachen",
  homeLabel: "Zur Startseite",
  badge: "Voulamandis House - Kampos, Chios",
  heroTitle: "Willkommen im Voulamandis House",
  heroText: "Ihr Online-Guide mit WiFi, Frühstück, Lieferung, Hausregeln, lokalen Tipps, Podcasts und Kontaktmöglichkeiten.",
  quickTitle: "Schnellzugriff",
  quickText: "Finden Sie schnell die wichtigsten Informationen für Ihren Aufenthalt.",
  quickCall: "Anrufen",
  quickBreakfast: "Frühstück",
  quickDelivery: "Lieferung",
  quickRules: "Hausregeln",
  welcomeTitle: "Willkommen im Voulamandis House",
  welcomeParagraphs: ["Willkommen im Voulamandis House in der schönen Gegend Kampos auf Chios. Wir freuen uns, Sie begrüßen zu dürfen.", "Wir sind jederzeit für Sie da, wenn Sie während Ihres Aufenthalts Hilfe benötigen."],
  welcomeHighlight: "Wir freuen uns über schöne Fotos aus unserem Garten oder von Ihrem Frühstück. Teilen Sie sie mit den Hashtags:",
  welcomeInstagram: "Wir freuen uns auch, wenn Sie unserem Instagram-Konto folgen: @chioshotels.",
  welcomeOffers: "Im Laufe des Jahres teilen wir Sonderangebote und kleine Geschenke für unsere Gäste.",
  wifiTitle: "WiFi-Informationen",
  wifiIntro: "Sie können sich mit den folgenden Daten mit unserem WiFi verbinden.",
  wifiNetwork: "Netzwerk",
  wifiPassword: "Passwort",
  wifiHelp: "Brauchen Sie Hilfe?",
  wifiHelpText: "Wenn Sie Probleme mit der Verbindung haben, kontaktieren Sie uns bitte.",
  breakfastTitle: "Frühstück im Voulamandis House",
  breakfastIntro: "Genießen Sie unser hausgemachtes Frühstück für 12 EUR pro Person und Tag.",
  breakfastButton: "Frühstück über WhatsApp buchen",
  deliveryTitle: "Online-Lieferung",
  deliveryIntro: "Wenn Sie Essen oder Getränke bestellen möchten, können Sie die Fagi-App verwenden.",
  deliveryImportant: ["Wichtig: Wählen Sie bei der Bestellung den Bereich THYMIANA.", "Wenn Sie Chios Town wählen, kann die Bestellung länger dauern."],
  fagiLoginTitle: "Fagi-Zugangsdaten",
  fagiAppTitle: "App herunterladen",
  fagiAppText: "Laden Sie die Fagi-App herunter und verwenden Sie die oben genannten Zugangsdaten.",
  fagiAppButton: "Fagi App herunterladen",
  contactTitle: "Kontakt",
  contactCall: "Anrufen",
  contactEmail: "Email",
  footer: "Vielen Dank für Ihren Aufenthalt. Wir wünschen Ihnen eine wunderbare Zeit auf Chios.",
};

const itText: LocalizedText = {
  ...enText,
  locale: "it",
  canonicalPath: "/it/welcome/",
  seoTitle: "Guida al soggiorno | Voulamandis House",
  seoDescription: "Guida privata per gli ospiti di Voulamandis House a Kampos, Chios, con WiFi, colazione, consegne, consigli locali e regole della casa.",
  languageLabel: "Lingue",
  homeLabel: "Torna alla homepage",
  badge: "Voulamandis House - Kampos, Chios",
  heroTitle: "Benvenuti a Voulamandis House",
  heroText: "La vostra guida online con WiFi, colazione, consegne, regole della casa, consigli locali, podcast e contatti utili.",
  quickTitle: "Accesso rapido",
  quickText: "Trovate rapidamente le informazioni più utili per il vostro soggiorno.",
  quickCall: "Chiamaci",
  quickBreakfast: "Colazione",
  quickDelivery: "Consegna",
  quickRules: "Regole",
  welcomeTitle: "Benvenuti a Voulamandis House",
  welcomeParagraphs: ["Benvenuti a Voulamandis House, nella splendida zona di Kampos a Chios. Siamo felici di ospitarvi.", "Siamo sempre disponibili ad aiutarvi durante il soggiorno."],
  welcomeHighlight: "Ci farebbe piacere vedere le vostre foto del giardino o della colazione. Condividetele con gli hashtag:",
  welcomeInstagram: "Saremmo felici anche se seguiste il nostro account Instagram: @chioshotels.",
  welcomeOffers: "Durante l'anno condividiamo offerte speciali e piccoli regali per i nostri ospiti.",
  wifiTitle: "Informazioni WiFi",
  wifiIntro: "Potete collegarvi al WiFi con i dati qui sotto.",
  wifiNetwork: "Rete",
  wifiPassword: "Password",
  wifiHelp: "Serve aiuto?",
  wifiHelpText: "Se avete problemi di connessione, contattateci.",
  breakfastTitle: "Colazione a Voulamandis House",
  breakfastIntro: "Godetevi la nostra colazione fatta in casa per 12 EUR a persona al giorno.",
  breakfastButton: "Prenota la colazione via WhatsApp",
  deliveryTitle: "Consegna online",
  deliveryIntro: "Per ordinare cibo o bevande potete usare l'app Fagi.",
  deliveryImportant: ["Importante: scegliete l'area THYMIANA quando effettuate l'ordine.", "Se scegliete Chios Town, l'ordine potrebbe richiedere più tempo."],
  fagiLoginTitle: "Dati di accesso Fagi",
  fagiAppTitle: "Scarica l'app",
  fagiAppText: "Scaricate l'app Fagi e usate i dati di accesso sopra indicati.",
  fagiAppButton: "Scarica Fagi App",
  contactTitle: "Contatti",
  contactCall: "Chiama",
  contactEmail: "Email",
  footer: "Grazie per aver soggiornato da noi. Vi auguriamo un meraviglioso soggiorno a Chios.",
};

const esText: LocalizedText = {
  ...enText,
  locale: "es",
  canonicalPath: "/es/welcome/",
  seoTitle: "Guía de estancia | Voulamandis House",
  seoDescription: "Guía privada para huéspedes de Voulamandis House en Kampos, Chios, con WiFi, desayuno, delivery, consejos locales y normas de la casa.",
  languageLabel: "Idiomas",
  homeLabel: "Volver al inicio",
  badge: "Voulamandis House - Kampos, Chios",
  heroTitle: "Bienvenidos a Voulamandis House",
  heroText: "Su guía online con WiFi, desayuno, delivery, normas de la casa, consejos locales, podcasts y formas fáciles de contactarnos.",
  quickTitle: "Acceso rápido",
  quickText: "Encuentre rápidamente la información más útil para su estancia.",
  quickCall: "Llamar",
  quickBreakfast: "Desayuno",
  quickDelivery: "Delivery",
  quickRules: "Normas",
  welcomeTitle: "Bienvenidos a Voulamandis House",
  welcomeParagraphs: ["Bienvenidos a Voulamandis House, en la hermosa zona de Kampos, Chios. Es un placer recibirles.", "Estamos siempre disponibles para ayudarles durante su estancia."],
  welcomeHighlight: "Nos encantará ver sus fotos del jardín o del desayuno. Compártanlas con los hashtags:",
  welcomeInstagram: "También nos alegraría que siguieran nuestra cuenta de Instagram: @chioshotels.",
  welcomeOffers: "Durante el año compartimos ofertas especiales y pequeños regalos para nuestros huéspedes.",
  wifiTitle: "Información WiFi",
  wifiIntro: "Puede conectarse a nuestra red WiFi con los datos siguientes.",
  wifiNetwork: "Red",
  wifiPassword: "Contraseña",
  wifiHelp: "¿Necesita ayuda?",
  wifiHelpText: "Si tiene problemas de conexión, contáctenos.",
  breakfastTitle: "Desayuno en Voulamandis House",
  breakfastIntro: "Disfrute de nuestro desayuno casero por 12 EUR por persona y día.",
  breakfastButton: "Reservar desayuno por WhatsApp",
  deliveryTitle: "Delivery online",
  deliveryIntro: "Si desea pedir comida o bebidas, puede usar la aplicación Fagi.",
  deliveryImportant: ["Importante: elija la zona THYMIANA al hacer el pedido.", "Si elige Chios Town, el pedido puede tardar más."],
  fagiLoginTitle: "Datos de acceso Fagi",
  fagiAppTitle: "Descargar la app",
  fagiAppText: "Descargue la app Fagi y use los datos de acceso indicados arriba.",
  fagiAppButton: "Descargar Fagi App",
  contactTitle: "Contacto",
  contactCall: "Llamar",
  contactEmail: "Email",
  footer: "Gracias por alojarse con nosotros. Le deseamos una maravillosa estancia en Chios.",
};

const trText: LocalizedText = {
  ...enText,
  locale: "tr",
  canonicalPath: "/tr/welcome/",
  seoTitle: "Konaklama Rehberi | Voulamandis House",
  seoDescription: "Kampos, Sakız Adası'ndaki Voulamandis House misafirleri için WiFi, kahvaltı, teslimat, yerel ipuçları ve ev kuralları içeren özel rehber.",
  languageLabel: "Diller",
  homeLabel: "Ana sayfaya dön",
  badge: "Voulamandis House - Kampos, Chios",
  heroTitle: "Voulamandis House'a hoş geldiniz",
  heroText: "WiFi, kahvaltı, yemek teslimatı, ev kuralları, yerel öneriler, podcastler ve iletişim bilgileri içeren online konaklama rehberiniz.",
  quickTitle: "Hızlı erişim",
  quickText: "Konaklamanız için en yararlı bilgilere hızlıca ulaşın.",
  quickCall: "Bizi arayın",
  quickBreakfast: "Kahvaltı",
  quickDelivery: "Teslimat",
  quickRules: "Ev kuralları",
  welcomeTitle: "Voulamandis House'a hoş geldiniz",
  welcomeParagraphs: ["Chios'taki güzel Kampos bölgesinde bulunan Voulamandis House'a hoş geldiniz. Sizi ağırlamaktan mutluluk duyuyoruz.", "Konaklamanız sırasında ihtiyaç duyduğunuz her konuda size yardımcı olmaktan memnuniyet duyarız."],
  welcomeHighlight: "Bahçemizden veya kahvaltı anlarınızdan güzel fotoğraflarınızı görmekten mutluluk duyarız. Bunları şu hashtaglerle paylaşabilirsiniz:",
  welcomeInstagram: "Instagram hesabımızı takip ederseniz de çok memnun oluruz: @chioshotels.",
  welcomeOffers: "Yıl boyunca misafirlerimiz için özel teklifler ve küçük hediyeler paylaşıyoruz.",
  wifiTitle: "WiFi bilgileri",
  wifiIntro: "Aşağıdaki bilgilerle WiFi ağımıza bağlanabilirsiniz.",
  wifiNetwork: "Ağ",
  wifiPassword: "Şifre",
  wifiHelp: "Yardıma mı ihtiyacınız var?",
  wifiHelpText: "Bağlantı sorunu yaşarsanız lütfen bizimle iletişime geçin.",
  breakfastTitle: "Voulamandis House'ta kahvaltı",
  breakfastIntro: "Kişi başı günlük 12 EUR karşılığında ev yapımı kahvaltımızın tadını çıkarın.",
  breakfastButton: "WhatsApp ile kahvaltı rezervasyonu",
  deliveryTitle: "Online teslimat",
  deliveryIntro: "Yiyecek veya içecek sipariş etmek isterseniz Fagi uygulamasını kullanabilirsiniz.",
  deliveryImportant: ["Önemli: Sipariş verirken THYMIANA bölgesini seçin.", "Chios Town seçilirse sipariş daha geç gelebilir."],
  fagiLoginTitle: "Fagi giriş bilgileri",
  fagiAppTitle: "Uygulamayı indirin",
  fagiAppText: "Fagi uygulamasını indirin ve yukarıdaki giriş bilgilerini kullanın.",
  fagiAppButton: "Fagi App indir",
  contactTitle: "İletişim",
  contactCall: "Ara",
  contactEmail: "Email",
  footer: "Bizimle konakladığınız için teşekkür ederiz. Chios'ta harika zaman geçirmenizi dileriz.",
};

const welcomeCopyByLocale: Record<LanguageCode, WelcomePageCopy> = {
  en: buildWelcomeCopy(enText),
  el: buildWelcomeCopy(elText),
  fr: buildWelcomeCopy(frText),
  de: buildWelcomeCopy(deText),
  it: buildWelcomeCopy(itText),
  es: buildWelcomeCopy(esText),
  tr: buildWelcomeCopy(trText),
};

export function getWelcomeCopy(locale: LanguageCode): WelcomePageCopy {
  return welcomeCopyByLocale[locale] ?? welcomeCopyByLocale.en;
}
