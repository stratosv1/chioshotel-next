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

const breakfastApp: WelcomeItem = {
  title: "π“± Download the App",
  text: ["Download the Fagi app and use the login details above to place your order."],
  button: {
    label: "π“± Download Fagi App",
    href: "https://play.google.com/store/apps/details?id=com.fagi.fagi.gr&hl=el",
    external: true,
  },
};

const coffeeKafemania: WelcomeItem = {
  title: "β• Coffee Orders",
  text: ["For coffee delivery, you can call KAFEMANIA.", "Phone: 2271 033417"],
  button: { label: "π“ Call KAFEMANIA", href: "tel:+302271033417", variant: "blue" },
};

const coffeeStasi: WelcomeItem = {
  title: "π¥ Coffee & Sandwiches",
  text: ["For coffee and sandwiches, you can contact STASI.", "Phone: 2271 021256"],
  button: { label: "π“ Call STASI", href: "tel:+302271021256", variant: "blue" },
};

const common = {
  deliveryItems: [
    {
      title: "π‘¤ Fagi Login Details",
      text: ["Username: vhouse.reservations@gmail.com", "Password: chioshotel.gr"],
    },
    breakfastApp,
    coffeeKafemania,
    coffeeStasi,
  ],
  nearbyItems: [
    {
      title: "π½οΈ Taverns",
      text: ["In Thymiana, you will find two lovely taverns, Karouli and Kapilio, where you can enjoy a relaxed lunch or dinner."],
    },
    {
      title: "π›’ Everyday Essentials",
      text: ["The village also has two pharmacies, a bakery, and a local grocery store."],
    },
  ],
  marmaladeItems: [
    { title: "π Mandarin Marmalade", text: ["Made from Chios mandarins collected from our estate, with a sweet and authentic citrus flavor."] },
    { title: "πΏ Bergamot Marmalade", text: ["An exceptional marmalade with a unique, elegant aroma and a distinctive Chios character."] },
    { title: "π‹ Lemon Marmalade", text: ["Fresh, bright, and aromatic, perfect for those who love the taste of lemon."] },
    { title: "π A Taste of Chios", text: ["A lovely gift or souvenir to take home and remember your stay at Voulamandis House."] },
  ],
  ruleItems: [
    { title: "β„οΈ Air Conditioning", text: ["Please switch off the air conditioner before leaving your room."] },
    { title: "π” Electrical Appliances", text: ["Please make sure all electrical appliances are turned off before leaving the room."] },
    { title: "π External Door", text: ["When leaving the premises, please securely close the external door of the guesthouse."] },
    { title: "π½ Toilet Use", text: ["Please do not dispose of paper or other items in the toilet. Use the bin provided."] },
    { title: "π— Parking", text: ["When parking, please keep a distance of at least 2 meters from the DEI / Public Power Corporation column."] },
    { title: "π§΄ Makeup & Towels", text: ["Please avoid removing makeup with the guest towels, as makeup products can permanently damage the fabric."] },
    { title: "π–οΈ Beach Towels", text: ["The room towels are intended for use inside the guesthouse only and should not be taken to the beach."] },
    { title: "π™ Thank You", text: ["We sincerely appreciate your cooperation, understanding, and care during your stay."] },
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
    badge: "π΅ Voulamandis House Β· Kampos, Chios",
    title: "Welcome to Voulamandis House",
    text: "Your online stay guide with WiFi, breakfast, food delivery, house rules, local tips, podcasts, and easy ways to contact us during your stay.",
  },
  quick: { title: "Quick Access", text: "Find the most useful information for your stay quickly.", whatsapp: "π’¬ WhatsApp", call: "π“ Call Us", wifi: "π“¶ WiFi", breakfast: "π³ Breakfast", delivery: "π›µ Delivery", rules: "π΅ House Rules" },
  sections: {
    welcome: {
      title: "πΏ Welcome to Voulamandis House",
      paragraphs: [
        "Welcome to Voulamandis House, located in the beautiful and unique area of Kampos, Chios. It is a great pleasure for us to host you during your stay.",
        "We are always here to listen, help, and assist you with anything you may need while staying with us. Please feel free to contact us through our social media accounts listed below, or through reception.",
      ],
      highlight: "π“Έ We would love to see your beautiful photos from our garden or from your morning breakfast moments. Share them with us using the hashtags:",
      hashtags: "#voulamandishouse Β· #voulamandis Β· #chioshotels",
      instagram: "We would also be very happy if you followed our Instagram account: @chioshotels.",
      offers: "Throughout the year, we share special offers, seasonal deals, and small gifts for our guests and returning visitors.",
    },
    wifi: { title: "π“¶ WiFi Information", intro: "You can connect to our WiFi network using the details below.", cards: [{ title: "π“΅ Network", text: ["VH"] }, { title: "π” Password", text: ["a12345678"] }, { title: "π’¬ Need help?", text: ["If you have any trouble connecting, please contact us."] }] },
    breakfast: { title: "π³ Breakfast at Voulamandis House", intro: "Enjoy our homemade breakfast experience for just 12β‚¬ per person, per day.", paragraphs: ["Taste authentic flavors from our citrus farm, including homemade mandarin and bergamot marmalades, lemon creations, fresh homemade juice, cakes, and pies.", "Every bite is inspired by the traditions, hospitality, and natural flavors of Chios."], highlight: "π Start your day with a breakfast full of local taste, homemade care, and island character.", button: "π³ Book Breakfast via WhatsApp" },
    delivery: { title: "π›µ Online Delivery", intro: "If you would like to order food or drinks for delivery to Voulamandis House, you can use the Fagi app, which works in a similar way to efood.", important: ["π“ Important: Please choose the area THYMIANA when placing your order.", "If you select Chios Town, your order may take longer to arrive."], accountIntro: "To make things easier for you, Voulamandis House has its own Fagi account, so you do not need to create a new one.", items: common.deliveryItems },
    nearby: { title: "π½οΈ Nearby Taverns & Essentials in Thymiana", intro: "Very close to Voulamandis House, you will find the village of Thymiana, just 800 meters away.", paragraphs: ["You can easily reach the village by car or on foot. It is a convenient place for lunch, dinner, coffee, or anything you may need during your stay.", "For more information about Chios and ideas for exploring the island, please feel free to ask us. We will be happy to share local recommendations."], items: common.nearbyItems, tip: "π“ Tip: Thymiana is only about 800 meters from Voulamandis House, making it an easy walk for food, coffee, or daily essentials." },
    podcast: { title: "π§ Podcast: The History of Kampos", paragraphs: ["Discover the history of the beautiful and unique area of Kampos, Chios through our special podcast experience.", "On the chest and in the courtyard, near the pitchfork, you will find QR codes for three wonderful podcasts available in Greek, English, and French.", "These podcasts share unique information about the history of Kampos, our local area, and the estate where you are staying."], highlight: "π“± We would be delighted if you scanned the QR code in your preferred language and enjoyed listening during your stay." },
    marmalade: { title: "π Buy Our Homemade Marmalade", paragraphs: ["The Chios mandarin marmalade served at our breakfast is homemade with mandarins collected from our own property every January.", "It is lovingly prepared by Angeliki, without any preservatives, using traditional care and the natural aroma of Chios citrus fruits."], highlight: "π If you would like to purchase our marmalade for yourself or as a special souvenir from Chios, please feel free to ask Angeliki.", items: common.marmaladeItems, thanks: "Thank you very much for supporting our homemade products and local Chios flavors.", button: "π Ask About Marmalades", localProducts: "You can also discover more local Chios products here:" },
    rules: { title: "π΅ House Rules", intro: "To ensure a comfortable stay for everyone and to help us take good care of the property, we kindly ask you to observe the following guidelines during your stay.", items: common.ruleItems, thanks: "Thank you for helping us keep Voulamandis House clean, comfortable, and welcoming for all our guests." },
    contact: { title: "π’¬ Contact Us", intro: "If you need anything during your stay, please contact us. We are happy to help.", whatsapp: "π’¬ WhatsApp", call: "π“ Call", email: "β‰οΈ Email", note: "For faster communication, WhatsApp is usually the easiest way to reach us." },
  },
  footer: "Thank you for staying with us. We wish you a wonderful time in Chios.",
};

const el: WelcomePageCopy = {
  ...en,
  locale: "el",
  seo: { ...en.seo, canonicalPath: "/el/welcome/", title: "ΞΞ΄Ξ·Ξ³ΟΟ‚ Ξ”ΞΉΞ±ΞΌΞΏΞ½Ξ®Ο‚ | Voulamandis House", description: "Ξ™Ξ΄ΞΉΟ‰Ο„ΞΉΞΊΟΟ‚ ΞΏΞ΄Ξ·Ξ³ΟΟ‚ Ξ΄ΞΉΞ±ΞΌΞΏΞ½Ξ®Ο‚ Ξ³ΞΉΞ± Ο„ΞΏΟ…Ο‚ ΞµΟ€ΞΉΟƒΞΊΞ­Ο€Ο„ΞµΟ‚ Ο„ΞΏΟ… Voulamandis House ΟƒΟ„ΞΏΞ½ ΞΞ¬ΞΌΟ€ΞΏ Ξ§Ξ―ΞΏΟ…, ΞΌΞµ WiFi, Ο€ΟΟ‰ΞΉΞ½Ο, delivery, Ο„ΞΏΟ€ΞΉΞΊΞ­Ο‚ Ο€ΟΞΏΟ„Ξ¬ΟƒΞµΞΉΟ‚ ΞΊΞ±ΞΉ ΞΊΞ±Ξ½ΟΞ½ΞµΟ‚ Ξ΄ΞΉΞ±ΞΌΞΏΞ½Ξ®Ο‚." },
  nav: { languageLabel: "Ξ“Ξ»ΟΟƒΟƒΞµΟ‚", homeLabel: "Ξ•Ο€ΞΉΟƒΟ„ΟΞΏΟ†Ξ® ΟƒΟ„Ξ·Ξ½ Ξ±ΟΟ‡ΞΉΞΊΞ®" },
  hero: { badge: "π΅ Voulamandis House Β· ΞΞ¬ΞΌΟ€ΞΏΟ‚, Ξ§Ξ―ΞΏΟ‚", title: "ΞΞ±Ξ»ΟΟ‚ Ξ®ΟΞΈΞ±Ο„Ξµ ΟƒΟ„ΞΏ Voulamandis House", text: "Ξ online ΞΏΞ΄Ξ·Ξ³ΟΟ‚ Ξ΄ΞΉΞ±ΞΌΞΏΞ½Ξ®Ο‚ ΟƒΞ±Ο‚ ΞΌΞµ WiFi, Ο€ΟΟ‰ΞΉΞ½Ο, delivery, ΞΊΞ±Ξ½ΟΞ½ΞµΟ‚ Ξ΄ΞΉΞ±ΞΌΞΏΞ½Ξ®Ο‚, Ο„ΞΏΟ€ΞΉΞΊΞ­Ο‚ Ο€ΟΞΏΟ„Ξ¬ΟƒΞµΞΉΟ‚, podcasts ΞΊΞ±ΞΉ ΞµΟΞΊΞΏΞ»ΞΏΟ…Ο‚ Ο„ΟΟΟ€ΞΏΟ…Ο‚ ΞµΟ€ΞΉΞΊΞΏΞΉΞ½Ο‰Ξ½Ξ―Ξ±Ο‚ ΞΌΞ±Ξ¶Ξ― ΞΌΞ±Ο‚." },
  quick: { title: "Ξ“ΟΞ®Ξ³ΞΏΟΞ· Ο€ΟΟΟƒΞ²Ξ±ΟƒΞ·", text: "Ξ’ΟΞµΞ―Ο„Ξµ Ξ³ΟΞ®Ξ³ΞΏΟΞ± Ο„ΞΉΟ‚ Ο€ΞΉΞΏ Ο‡ΟΞ®ΟƒΞΉΞΌΞµΟ‚ Ο€Ξ»Ξ·ΟΞΏΟ†ΞΏΟΞ―ΞµΟ‚ Ξ³ΞΉΞ± Ο„Ξ· Ξ΄ΞΉΞ±ΞΌΞΏΞ½Ξ® ΟƒΞ±Ο‚.", whatsapp: "π’¬ WhatsApp", call: "π“ ΞΞ±Ξ»Ξ­ΟƒΟ„Ξµ ΞΌΞ±Ο‚", wifi: "π“¶ WiFi", breakfast: "π³ Ξ ΟΟ‰ΞΉΞ½Ο", delivery: "π›µ Delivery", rules: "π΅ ΞΞ±Ξ½ΟΞ½ΞµΟ‚" },
  sections: {
    ...en.sections,
    welcome: { ...en.sections.welcome, title: "πΏ ΞΞ±Ξ»ΟΟ‚ Ξ®ΟΞΈΞ±Ο„Ξµ ΟƒΟ„ΞΏ Voulamandis House", paragraphs: ["ΞΞ±Ξ»ΟΟ‚ Ξ®ΟΞΈΞ±Ο„Ξµ ΟƒΟ„ΞΏ Voulamandis House, Ο€ΞΏΟ… Ξ²ΟΞ―ΟƒΞΊΞµΟ„Ξ±ΞΉ ΟƒΟ„Ξ·Ξ½ ΟΞΌΞΏΟΟ†Ξ· ΞΊΞ±ΞΉ ΞΌΞΏΞ½Ξ±Ξ΄ΞΉΞΊΞ® Ο€ΞµΟΞΉΞΏΟ‡Ξ® Ο„ΞΏΟ… ΞΞ¬ΞΌΟ€ΞΏΟ… ΟƒΟ„Ξ· Ξ§Ξ―ΞΏ. Ξ•Ξ―Ξ½Ξ±ΞΉ ΞΌΞµΞ³Ξ¬Ξ»Ξ· ΞΌΞ±Ο‚ Ο‡Ξ±ΟΞ¬ Ξ½Ξ± ΟƒΞ±Ο‚ Ο†ΞΉΞ»ΞΏΞΎΞµΞ½ΞΏΟΞΌΞµ.", "Ξ•Ξ―ΞΌΞ±ΟƒΟ„Ξµ Ο€Ξ¬Ξ½Ο„Ξ± ΞµΞ΄Ο Ξ³ΞΉΞ± Ξ½Ξ± ΟƒΞ±Ο‚ Ξ±ΞΊΞΏΟΟƒΞΏΟ…ΞΌΞµ, Ξ½Ξ± ΟƒΞ±Ο‚ Ξ²ΞΏΞ·ΞΈΞ®ΟƒΞΏΟ…ΞΌΞµ ΞΊΞ±ΞΉ Ξ½Ξ± ΟƒΞ±Ο‚ ΞµΞΎΟ…Ο€Ξ·ΟΞµΟ„Ξ®ΟƒΞΏΟ…ΞΌΞµ ΟƒΞµ Ο,Ο„ΞΉ Ο‡ΟΞµΞΉΞ±ΟƒΟ„ΞµΞ―Ο„Ξµ ΞΊΞ±Ο„Ξ¬ Ο„Ξ· Ξ΄ΞΉΞ±ΞΌΞΏΞ½Ξ® ΟƒΞ±Ο‚."], highlight: "π“Έ ΞΞ± Ο‡Ξ±ΟΞΏΟΞΌΞµ Ο€ΞΏΞ»Ο Ξ½Ξ± Ξ΄ΞΏΟΞΌΞµ ΟΞΌΞΏΟΟ†ΞµΟ‚ Ο†Ο‰Ο„ΞΏΞ³ΟΞ±Ο†Ξ―ΞµΟ‚ ΟƒΞ±Ο‚ Ξ±Ο€Ο Ο„ΞΏΞ½ ΞΊΞ®Ο€ΞΏ ΞΌΞ±Ο‚ Ξ® Ξ±Ο€Ο Ο„ΞΉΟ‚ Ο€ΟΟ‰ΞΉΞ½Ξ­Ο‚ ΟƒΟ„ΞΉΞ³ΞΌΞ­Ο‚ ΟƒΞ±Ο‚ ΟƒΟ„ΞΏ Ο€ΟΟ‰ΞΉΞ½Ο. ΞΞΏΞΉΟΞ±ΟƒΟ„ΞµΞ―Ο„Ξµ Ο„ΞΉΟ‚ ΞΌΞµ Ο„Ξ± hashtags:", instagram: "ΞΞ± Ο‡Ξ±ΟΞΏΟΞΌΞµ ΞµΟ€Ξ―ΟƒΞ·Ο‚ Ο€ΞΏΞ»Ο Ξ±Ξ½ Ξ±ΞΊΞΏΞ»ΞΏΟ…ΞΈΞ®ΟƒΞµΟ„Ξµ Ο„ΞΏΞ½ Ξ»ΞΏΞ³Ξ±ΟΞΉΞ±ΟƒΞΌΟ ΞΌΞ±Ο‚ ΟƒΟ„ΞΏ Instagram: @chioshotels.", offers: "ΞΞ±Ο„Ξ¬ Ο„Ξ· Ξ΄ΞΉΞ¬ΟΞΊΞµΞΉΞ± Ο„Ξ·Ο‚ Ο‡ΟΞΏΞ½ΞΉΞ¬Ο‚ ΞΌΞΏΞΉΟΞ±Ξ¶ΟΞΌΞ±ΟƒΟ„Ξµ ΞµΞΉΞ΄ΞΉΞΊΞ­Ο‚ Ο€ΟΞΏΟƒΟ†ΞΏΟΞ­Ο‚, ΞµΟ€ΞΏΟ‡ΞΉΞ±ΞΊΞ¬ deals ΞΊΞ±ΞΉ ΞΌΞΉΞΊΟΞ¬ Ξ΄ΟΟΞ± Ξ³ΞΉΞ± Ο„ΞΏΟ…Ο‚ ΞµΟ€ΞΉΟƒΞΊΞ­Ο€Ο„ΞµΟ‚ ΞΌΞ±Ο‚." },
    wifi: { title: "π“¶ Ξ Ξ»Ξ·ΟΞΏΟ†ΞΏΟΞ―ΞµΟ‚ WiFi", intro: "ΞΟ€ΞΏΟΞµΞ―Ο„Ξµ Ξ½Ξ± ΟƒΟ…Ξ½Ξ΄ΞµΞΈΞµΞ―Ο„Ξµ ΟƒΟ„ΞΏ WiFi ΞΌΞµ Ο„Ξ± Ο€Ξ±ΟΞ±ΞΊΞ¬Ο„Ο‰ ΟƒΟ„ΞΏΞΉΟ‡ΞµΞ―Ξ±.", cards: [{ title: "π“΅ Ξ”Ξ―ΞΊΟ„Ο…ΞΏ", text: ["VH"] }, { title: "π” ΞΟ‰Ξ΄ΞΉΞΊΟΟ‚", text: ["a12345678"] }, { title: "π’¬ Ξ§ΟΞµΞΉΞ¬Ξ¶ΞµΟƒΟ„Ξµ Ξ²ΞΏΞ®ΞΈΞµΞΉΞ±;", text: ["Ξ‘Ξ½ Ξ­Ο‡ΞµΟ„Ξµ Ξ΄Ο…ΟƒΞΊΞΏΞ»Ξ―Ξ± ΟƒΟ„Ξ· ΟƒΟΞ½Ξ΄ΞµΟƒΞ·, ΞµΟ€ΞΉΞΊΞΏΞΉΞ½Ο‰Ξ½Ξ®ΟƒΟ„Ξµ ΞΌΞ±Ξ¶Ξ― ΞΌΞ±Ο‚."] }] },
    breakfast: { ...en.sections.breakfast, title: "π³ Ξ ΟΟ‰ΞΉΞ½Ο ΟƒΟ„ΞΏ Voulamandis House", intro: "Ξ‘Ο€ΞΏΞ»Ξ±ΟΟƒΟ„Ξµ Ο„ΞΏ ΟƒΟ€ΞΉΟ„ΞΉΞΊΟ ΞΌΞ±Ο‚ Ο€ΟΟ‰ΞΉΞ½Ο ΞΌΞµ 12β‚¬ Ξ±Ξ½Ξ¬ Ξ¬Ο„ΞΏΞΌΞΏ, Ξ±Ξ½Ξ¬ Ξ·ΞΌΞ­ΟΞ±.", button: "π³ ΞΟΞ¬Ο„Ξ·ΟƒΞ· Ο€ΟΟ‰ΞΉΞ½ΞΏΟ ΞΌΞ­ΟƒΟ‰ WhatsApp" },
    contact: { title: "π’¬ Ξ•Ο€ΞΉΞΊΞΏΞΉΞ½Ο‰Ξ½Ξ―Ξ±", intro: "Ξ‘Ξ½ Ο‡ΟΞµΞΉΞ±ΟƒΟ„ΞµΞ―Ο„Ξµ ΞΏΟ„ΞΉΞ΄Ξ®Ο€ΞΏΟ„Ξµ ΞΊΞ±Ο„Ξ¬ Ο„Ξ· Ξ΄ΞΉΞ±ΞΌΞΏΞ½Ξ® ΟƒΞ±Ο‚, ΞµΟ€ΞΉΞΊΞΏΞΉΞ½Ο‰Ξ½Ξ®ΟƒΟ„Ξµ ΞΌΞ±Ξ¶Ξ― ΞΌΞ±Ο‚. ΞΞ± Ο‡Ξ±ΟΞΏΟΞΌΞµ Ξ½Ξ± ΟƒΞ±Ο‚ Ξ²ΞΏΞ·ΞΈΞ®ΟƒΞΏΟ…ΞΌΞµ.", whatsapp: "π’¬ WhatsApp", call: "π“ ΞΞ»Ξ®ΟƒΞ·", email: "β‰οΈ Email", note: "Ξ“ΞΉΞ± Ο€ΞΉΞΏ Ξ¬ΞΌΞµΟƒΞ· ΞµΟ€ΞΉΞΊΞΏΞΉΞ½Ο‰Ξ½Ξ―Ξ±, Ο„ΞΏ WhatsApp ΞµΞ―Ξ½Ξ±ΞΉ ΟƒΟ…Ξ½Ξ®ΞΈΟ‰Ο‚ ΞΏ ΞµΟ…ΞΊΞΏΞ»ΟΟ„ΞµΟΞΏΟ‚ Ο„ΟΟΟ€ΞΏΟ‚." },
  },
  footer: "Ξ£Ξ±Ο‚ ΞµΟ…Ο‡Ξ±ΟΞΉΟƒΟ„ΞΏΟΞΌΞµ Ο€ΞΏΟ… ΞΌΞ­Ξ½ΞµΟ„Ξµ ΞΌΞ±Ξ¶Ξ― ΞΌΞ±Ο‚. Ξ£Ξ±Ο‚ ΞµΟ…Ο‡ΟΞΌΞ±ΟƒΟ„Ξµ Ο…Ο€Ξ­ΟΞΏΟ‡ΞµΟ‚ ΟƒΟ„ΞΉΞ³ΞΌΞ­Ο‚ ΟƒΟ„Ξ· Ξ§Ξ―ΞΏ.",
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

const fr = translated("fr", "/fr/welcome/", "Guide de SΓ©jour | Voulamandis House", "Guide privΓ© pour les clients de Voulamandis House Γ  Kampos, Chios, avec WiFi, petit-dΓ©jeuner, livraison, conseils locaux et rΓ¨gles de sΓ©jour.", { languageLabel: "Langues", homeLabel: "Retour Γ  lβ€™accueil" }, { badge: "π΅ Voulamandis House Β· Kampos, Chios", title: "Bienvenue Γ  Voulamandis House", text: "Votre guide de sΓ©jour en ligne avec WiFi, petit-dΓ©jeuner, livraison, rΓ¨gles de la maison, conseils locaux, podcasts et moyens faciles de nous contacter." }, "AccΓ¨s rapide", "Trouvez rapidement les informations les plus utiles pour votre sΓ©jour.", "Merci de sΓ©journer chez nous. Nous vous souhaitons un merveilleux sΓ©jour Γ  Chios.");
const de = translated("de", "/de/welcome/", "GΓ¤ste-Willkommensguide | Voulamandis House", "Privater GΓ¤ste-Guide fΓΌr Voulamandis House in Kampos, Chios, mit WLAN, FrΓΌhstΓΌck, Lieferdiensten, lokalen Tipps und Hausregeln.", { languageLabel: "Sprachen", homeLabel: "Zur Startseite" }, { badge: "π΅ Voulamandis House Β· Kampos, Chios", title: "Willkommen im Voulamandis House", text: "Ihr Online-Guide fΓΌr den Aufenthalt mit WLAN, FrΓΌhstΓΌck, Essenslieferung, Hausregeln, lokalen Tipps, Podcasts und einfachen KontaktmΓ¶glichkeiten." }, "Schneller Zugriff", "Finden Sie schnell die wichtigsten Informationen fΓΌr Ihren Aufenthalt.", "Vielen Dank fΓΌr Ihren Aufenthalt bei uns. Wir wΓΌnschen Ihnen eine wunderbare Zeit auf Chios.");
const it = translated("it", "/it/welcome/", "Guida di Benvenuto | Voulamandis House", "Guida privata per gli ospiti di Voulamandis House a Kampos, Chios, con WiFi, colazione, delivery, consigli locali e regole del soggiorno.", { languageLabel: "Lingue", homeLabel: "Torna alla homepage" }, { badge: "π΅ Voulamandis House Β· Kampos, Chios", title: "Benvenuti a Voulamandis House", text: "La vostra guida online con WiFi, colazione, delivery, regole della struttura, consigli locali, podcast e modi semplici per contattarci." }, "Accesso rapido", "Trova rapidamente le informazioni piΓΉ utili per il tuo soggiorno.", "Grazie per aver scelto di soggiornare con noi. Vi auguriamo un meraviglioso soggiorno a Chios.");
const es = translated("es", "/es/welcome/", "GuΓ­a de Bienvenida | Voulamandis House", "GuΓ­a privada para huΓ©spedes de Voulamandis House en Kampos, Chios, con WiFi, desayuno, delivery, consejos locales y normas de estancia.", { languageLabel: "Idiomas", homeLabel: "Volver a la pΓ΅gina principal" }, { badge: "π΅ Voulamandis House Β· Kampos, Chios", title: "Bienvenido a Voulamandis House", text: "Su guΓ­a online de estancia con WiFi, desayuno, comida a domicilio, normas, consejos locales, podcasts y formas sencillas de contactarnos." }, "Acceso rΓ΅pido", "Encuentre rΓ΅pidamente la informaciΓ³n mΓ΅s ΓΊtil para su estancia.", "Gracias por alojarse con nosotros. Le deseamos una maravillosa estancia en Chios.");
const tr = translated("tr", "/tr/welcome/", "Misafir KarΕΔ±lama Rehberi | Voulamandis House", "Kampos, Chiosβ€™taki Voulamandis House misafirleri iΓ§in WiFi, kahvaltΔ±, yemek teslimatΔ±, yerel Γ¶neriler ve konaklama kurallarΔ± iΓ§eren Γ¶zel rehber.", { languageLabel: "Diller", homeLabel: "Ana sayfaya dΓ¶n" }, { badge: "π΅ Voulamandis House Β· Kampos, Chios", title: "Voulamandis Houseβ€™a hoΕ geldiniz", text: "WiFi, kahvaltΔ±, yemek teslimatΔ±, konaklama kurallarΔ±, yerel Γ¶neriler, podcastler ve bizimle kolay iletiΕim yollarΔ±nΔ± iΓ§eren online konaklama rehberiniz." }, "HΔ±zlΔ± EriΕim", "KonaklamanΔ±z iΓ§in en faydalΔ± bilgileri hΔ±zlΔ±ca bulun.", "Bizde konakladΔ±ΔΔ±nΔ±z iΓ§in teΕekkΓΌr ederiz. Chiosβ€™ta harika zaman geΓ§irmenizi dileriz.");

export const welcomePages: Record<LanguageCode, WelcomePageCopy> = { en, el, fr, de, it, es, tr };

export function getWelcomePageByLocale(locale: LanguageCode): WelcomePageCopy {
  return welcomePages[locale] ?? welcomePages.en;
}

