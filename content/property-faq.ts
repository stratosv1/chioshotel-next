import { normalizePath, type LanguageCode } from "@/lib/languages";

export type PropertyFaqScope = "all" | "home" | "rooms" | "rates" | "kambos";
export type PropertyFaqStatus = "published" | "needs-verification";
export type PropertyFaqCategory = "general" | "location" | "rooms" | "booking" | "arrival";
export type PropertyFaqLinkKey = "rooms" | "rates" | "kambos" | "contact" | "faq";

type LocalizedFaqText = {
  question: string;
  answer: string;
};

type PropertyFaqRecord = {
  id: string;
  category: PropertyFaqCategory;
  scopes: readonly PropertyFaqScope[];
  status: PropertyFaqStatus;
  translations?: Record<LanguageCode, LocalizedFaqText>;
  relatedLink?: PropertyFaqLinkKey;
  legacySourceSummary?: string;
};

export type PropertyFaqItem = LocalizedFaqText & {
  id: string;
  category: PropertyFaqCategory;
  relatedLink?: {
    href: string;
    label: string;
  };
};

export type PropertyFaqPageData = {
  language: LanguageCode;
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
  };
  intro: string;
  categories: Array<{
    id: PropertyFaqCategory;
    title: string;
    description: string;
    items: PropertyFaqItem[];
  }>;
  cta: {
    title: string;
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export const propertyFaqPaths: Record<LanguageCode, string> = {
  en: "/frequently-asked-questions/",
  el: "/el/syxnes-erotiseis/",
  fr: "/fr/questions-frequentes/",
  de: "/de/haeufige-fragen/",
  it: "/it/domande-frequenti/",
  es: "/es/preguntas-frecuentes/",
  tr: "/tr/sik-sorulan-sorular/",
};

const relatedPaths: Record<PropertyFaqLinkKey, Record<LanguageCode, string>> = {
  rooms: {
    en: "/chios-rooms/",
    el: "/el/domatia-xios/",
    fr: "/fr/chambres-a-chios/",
    de: "/de/chios-zimmer/",
    it: "/it/camere-a-chios/",
    es: "/es/habitaciones-en-chios/",
    tr: "/tr/sakiz-adasi-odalari/",
  },
  rates: {
    en: "/chios-hotels-rates/",
    el: "/el/amesi-kratisi-voulamandis-house/",
    fr: "/fr/tarifs-des-hotels-a-chios/",
    de: "/de/hotelpreise-auf-der-insel-chios/",
    it: "/it/prezzi-hotel-chios/",
    es: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
    tr: "/tr/sakiz-adasi-rezervasyon/",
  },
  kambos: {
    en: "/chios/kampos-chios/",
    el: "/el/chios/kampos-chios/",
    fr: "/fr/chios/kampos-chios/",
    de: "/de/chios/kampos-chios/",
    it: "/it/chios/kampos-chios/",
    es: "/es/chios/kampos-chios/",
    tr: "/tr/chios/kampos-chios/",
  },
  contact: {
    en: "/voulamandis-house-contact-us-form-fill-in-the-form/",
    el: "/el/epikoinonia-voulamandis-house/",
    fr: "/fr/contactez-nous/",
    de: "/de/kontaktieren-voulamandis-house/",
    it: "/it/contattaci-voulamandis-house/",
    es: "/es/contacta-con-voulamandis-house/",
    tr: "/tr/sakiz-adasi-otelleri-ile-iletisim/",
  },
  faq: propertyFaqPaths,
};

const relatedLabels: Record<PropertyFaqLinkKey, Record<LanguageCode, string>> = {
  rooms: { en: "See rooms", el: "Δείτε τα δωμάτια", fr: "Voir les chambres", de: "Zimmer ansehen", it: "Vedi le camere", es: "Ver habitaciones", tr: "Odaları görün" },
  rates: { en: "Check availability", el: "Δείτε διαθεσιμότητα", fr: "Voir les disponibilités", de: "Verfügbarkeit prüfen", it: "Verifica disponibilità", es: "Ver disponibilidad", tr: "Müsaitliği kontrol edin" },
  kambos: { en: "Explore Kambos", el: "Δείτε τον Κάμπο", fr: "Découvrir Kambos", de: "Kambos entdecken", it: "Scopri Kambos", es: "Descubre Kambos", tr: "Kambos'u keşfedin" },
  contact: { en: "Contact us", el: "Επικοινωνήστε μαζί μας", fr: "Nous contacter", de: "Kontakt", it: "Contattaci", es: "Contacta con nosotros", tr: "Bize ulaşın" },
  faq: { en: "All frequently asked questions", el: "Όλες οι συχνές ερωτήσεις", fr: "Toutes les questions fréquentes", de: "Alle häufigen Fragen", it: "Tutte le domande frequenti", es: "Todas las preguntas frecuentes", tr: "Tüm sık sorulan sorular" },
};

const categoryCopy: Record<LanguageCode, Record<PropertyFaqCategory, { title: string; description: string }>> = {
  en: {
    general: { title: "About your stay", description: "Essential information about Voulamandis House and everyday services." },
    location: { title: "Location & getting around", description: "Distances, nearby areas and practical transport guidance for Chios." },
    rooms: { title: "Rooms & apartments", description: "Choose the room category that best matches your guests, comfort and kitchen needs." },
    booking: { title: "Booking & availability", description: "How direct booking works and what to know before confirming your stay." },
    arrival: { title: "Before arrival", description: "Information that is best confirmed close to your arrival date." },
  },
  el: {
    general: { title: "Για τη διαμονή σας", description: "Βασικές πληροφορίες για το Voulamandis House και τις καθημερινές παροχές." },
    location: { title: "Τοποθεσία & μετακινήσεις", description: "Αποστάσεις, κοντινές περιοχές και πρακτικές συμβουλές μετακίνησης στη Χίο." },
    rooms: { title: "Δωμάτια & διαμερίσματα", description: "Επιλέξτε κατηγορία ανάλογα με τα άτομα, την άνεση και την ανάγκη για κουζίνα." },
    booking: { title: "Κράτηση & διαθεσιμότητα", description: "Πώς λειτουργεί η απευθείας κράτηση και τι χρειάζεται να γνωρίζετε πριν την επιβεβαίωση." },
    arrival: { title: "Πριν από την άφιξη", description: "Πληροφορίες που είναι καλύτερο να επιβεβαιώνονται κοντά στην ημερομηνία άφιξης." },
  },
  fr: {
    general: { title: "Votre séjour", description: "Informations essentielles sur Voulamandis House et les services du quotidien." },
    location: { title: "Emplacement & déplacements", description: "Distances, environs et conseils pratiques pour se déplacer à Chios." },
    rooms: { title: "Chambres & appartements", description: "Choisissez la catégorie adaptée au nombre de personnes, au confort et aux besoins de cuisine." },
    booking: { title: "Réservation & disponibilités", description: "Comment fonctionne la réservation directe et ce qu'il faut savoir avant de confirmer." },
    arrival: { title: "Avant l'arrivée", description: "Informations qu'il vaut mieux confirmer à l'approche de votre arrivée." },
  },
  de: {
    general: { title: "Ihr Aufenthalt", description: "Wichtige Informationen zum Voulamandis House und zu alltäglichen Leistungen." },
    location: { title: "Lage & Mobilität", description: "Entfernungen, Umgebung und praktische Hinweise für Ihre Wege auf Chios." },
    rooms: { title: "Zimmer & Apartments", description: "Wählen Sie die passende Kategorie nach Personenzahl, Komfort und Küchenbedarf." },
    booking: { title: "Buchung & Verfügbarkeit", description: "So funktioniert die Direktbuchung und was Sie vor der Bestätigung wissen sollten." },
    arrival: { title: "Vor der Anreise", description: "Informationen, die am besten kurz vor der Anreise bestätigt werden." },
  },
  it: {
    general: { title: "Il vostro soggiorno", description: "Informazioni essenziali su Voulamandis House e sui servizi quotidiani." },
    location: { title: "Posizione & spostamenti", description: "Distanze, dintorni e consigli pratici per muoversi a Chios." },
    rooms: { title: "Camere & appartamenti", description: "Scegliete la categoria in base al numero di ospiti, al comfort e alla necessità di una cucina." },
    booking: { title: "Prenotazione & disponibilità", description: "Come funziona la prenotazione diretta e cosa sapere prima della conferma." },
    arrival: { title: "Prima dell'arrivo", description: "Informazioni da confermare preferibilmente in prossimità dell'arrivo." },
  },
  es: {
    general: { title: "Tu estancia", description: "Información esencial sobre Voulamandis House y los servicios cotidianos." },
    location: { title: "Ubicación & desplazamientos", description: "Distancias, alrededores y consejos prácticos para moverse por Quíos." },
    rooms: { title: "Habitaciones & apartamentos", description: "Elige la categoría según el número de huéspedes, el confort y la necesidad de cocina." },
    booking: { title: "Reserva & disponibilidad", description: "Cómo funciona la reserva directa y qué conviene saber antes de confirmar." },
    arrival: { title: "Antes de llegar", description: "Información que conviene confirmar cerca de la fecha de llegada." },
  },
  tr: {
    general: { title: "Konaklamanız hakkında", description: "Voulamandis House ve günlük hizmetler hakkında temel bilgiler." },
    location: { title: "Konum & ulaşım", description: "Mesafeler, yakın çevre ve Sakız Adası'nda ulaşım için pratik bilgiler." },
    rooms: { title: "Odalar & daireler", description: "Kişi sayısına, konfora ve mutfak ihtiyacına göre uygun kategoriyi seçin." },
    booking: { title: "Rezervasyon & müsaitlik", description: "Doğrudan rezervasyonun nasıl çalıştığı ve onaydan önce bilinmesi gerekenler." },
    arrival: { title: "Varıştan önce", description: "Varış tarihine yakın doğrulanması daha doğru olan bilgiler." },
  },
};

const pageCopy: Record<LanguageCode, Omit<PropertyFaqPageData, "language" | "categories">> = {
  en: {
    seo: { canonicalPath: propertyFaqPaths.en, title: "Frequently Asked Questions | Voulamandis House Chios", description: "Practical answers about Voulamandis House in Kambos, Chios: rooms, apartments, breakfast, parking, location, direct booking and getting around.", ogImage: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp" },
    hero: { kicker: "Voulamandis House • Kambos, Chios", title: "Frequently asked questions", description: "Useful answers before you choose a room, book your stay or plan your arrival in Chios." },
    intro: "This page brings together the practical information guests ask most often. Room details, location and booking guidance are kept concise and linked to the relevant pages so you can verify the option that suits your trip.",
    cta: { title: "Still need help?", text: "If your question depends on dates, availability or a specific room, contact us and we will check it for you.", primaryLabel: "Check availability", primaryHref: relatedPaths.rates.en, secondaryLabel: "Contact us", secondaryHref: relatedPaths.contact.en },
  },
  el: {
    seo: { canonicalPath: propertyFaqPaths.el, title: "Συχνές Ερωτήσεις | Voulamandis House Χίος", description: "Χρήσιμες απαντήσεις για το Voulamandis House στον Κάμπο Χίου: δωμάτια, διαμερίσματα, πρωινό, parking, τοποθεσία και απευθείας κράτηση.", ogImage: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp" },
    hero: { kicker: "Voulamandis House • Κάμπος Χίου", title: "Συχνές ερωτήσεις για τη διαμονή σας", description: "Χρήσιμες απαντήσεις πριν επιλέξετε δωμάτιο, κάνετε κράτηση ή οργανώσετε την άφιξή σας στη Χίο." },
    intro: "Συγκεντρώσαμε εδώ τις πρακτικές πληροφορίες που ζητούν συχνότερα οι επισκέπτες μας. Οι απαντήσεις παραμένουν σύντομες και συνδέονται με τις σχετικές σελίδες, ώστε να βρίσκετε γρήγορα την πληροφορία που χρειάζεστε.",
    cta: { title: "Χρειάζεστε ακόμη βοήθεια;", text: "Αν η ερώτησή σας εξαρτάται από ημερομηνίες, διαθεσιμότητα ή συγκεκριμένο δωμάτιο, επικοινωνήστε μαζί μας για να το ελέγξουμε.", primaryLabel: "Δείτε διαθεσιμότητα", primaryHref: relatedPaths.rates.el, secondaryLabel: "Επικοινωνία", secondaryHref: relatedPaths.contact.el },
  },
  fr: {
    seo: { canonicalPath: propertyFaqPaths.fr, title: "Questions fréquentes | Voulamandis House Chios", description: "Réponses pratiques sur Voulamandis House à Kambos, Chios : chambres, appartements, petit-déjeuner, parking, emplacement et réservation directe.", ogImage: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp" },
    hero: { kicker: "Voulamandis House • Kambos, Chios", title: "Questions fréquentes", description: "Des réponses utiles avant de choisir une chambre, réserver votre séjour ou préparer votre arrivée à Chios." },
    intro: "Cette page regroupe les informations pratiques les plus demandées par nos hôtes. Les réponses restent concises et renvoient vers les pages concernées pour vous aider à choisir et organiser votre séjour.",
    cta: { title: "Encore une question ?", text: "Si votre question dépend des dates, des disponibilités ou d'une chambre précise, contactez-nous et nous vérifierons pour vous.", primaryLabel: "Voir les disponibilités", primaryHref: relatedPaths.rates.fr, secondaryLabel: "Nous contacter", secondaryHref: relatedPaths.contact.fr },
  },
  de: {
    seo: { canonicalPath: propertyFaqPaths.de, title: "Häufige Fragen | Voulamandis House Chios", description: "Praktische Antworten zum Voulamandis House in Kambos, Chios: Zimmer, Apartments, Frühstück, Parken, Lage und Direktbuchung.", ogImage: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp" },
    hero: { kicker: "Voulamandis House • Kambos, Chios", title: "Häufig gestellte Fragen", description: "Hilfreiche Antworten, bevor Sie ein Zimmer wählen, Ihren Aufenthalt buchen oder Ihre Anreise planen." },
    intro: "Hier finden Sie die praktischen Informationen, nach denen Gäste am häufigsten fragen. Die Antworten sind bewusst kompakt und führen zu den passenden Seiten für weitere Details.",
    cta: { title: "Noch eine Frage?", text: "Wenn Ihre Frage von Reisedaten, Verfügbarkeit oder einem bestimmten Zimmer abhängt, kontaktieren Sie uns und wir prüfen es für Sie.", primaryLabel: "Verfügbarkeit prüfen", primaryHref: relatedPaths.rates.de, secondaryLabel: "Kontakt", secondaryHref: relatedPaths.contact.de },
  },
  it: {
    seo: { canonicalPath: propertyFaqPaths.it, title: "Domande frequenti | Voulamandis House Chios", description: "Risposte pratiche su Voulamandis House a Kambos, Chios: camere, appartamenti, colazione, parcheggio, posizione e prenotazione diretta.", ogImage: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp" },
    hero: { kicker: "Voulamandis House • Kambos, Chios", title: "Domande frequenti", description: "Risposte utili prima di scegliere una camera, prenotare il soggiorno o organizzare l'arrivo a Chios." },
    intro: "Qui trovate le informazioni pratiche che gli ospiti chiedono più spesso. Le risposte sono concise e collegate alle pagine pertinenti per approfondire ciò che serve al vostro viaggio.",
    cta: { title: "Serve ancora aiuto?", text: "Se la domanda dipende da date, disponibilità o da una camera specifica, contattateci e verificheremo per voi.", primaryLabel: "Verifica disponibilità", primaryHref: relatedPaths.rates.it, secondaryLabel: "Contattaci", secondaryHref: relatedPaths.contact.it },
  },
  es: {
    seo: { canonicalPath: propertyFaqPaths.es, title: "Preguntas frecuentes | Voulamandis House Quíos", description: "Respuestas prácticas sobre Voulamandis House en Kambos, Quíos: habitaciones, apartamentos, desayuno, aparcamiento, ubicación y reserva directa.", ogImage: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp" },
    hero: { kicker: "Voulamandis House • Kambos, Quíos", title: "Preguntas frecuentes", description: "Respuestas útiles antes de elegir una habitación, reservar tu estancia u organizar tu llegada a Quíos." },
    intro: "Aquí reunimos la información práctica que más suelen preguntar nuestros huéspedes. Las respuestas son breves y enlazan con las páginas correspondientes para ampliar los detalles necesarios.",
    cta: { title: "¿Necesitas más ayuda?", text: "Si tu pregunta depende de las fechas, la disponibilidad o una habitación concreta, contáctanos y lo comprobaremos.", primaryLabel: "Ver disponibilidad", primaryHref: relatedPaths.rates.es, secondaryLabel: "Contacto", secondaryHref: relatedPaths.contact.es },
  },
  tr: {
    seo: { canonicalPath: propertyFaqPaths.tr, title: "Sık Sorulan Sorular | Voulamandis House Sakız", description: "Kambos, Sakız Adası'ndaki Voulamandis House hakkında pratik yanıtlar: odalar, daireler, kahvaltı, otopark, konum ve doğrudan rezervasyon.", ogImage: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp" },
    hero: { kicker: "Voulamandis House • Kambos, Sakız Adası", title: "Sık sorulan sorular", description: "Oda seçmeden, rezervasyon yapmadan veya Sakız Adası'na varışınızı planlamadan önce yararlı yanıtlar." },
    intro: "Misafirlerimizin en sık sorduğu pratik bilgileri burada topladık. Yanıtlar kısa tutulur ve gerektiğinde ilgili sayfalara yönlendirir.",
    cta: { title: "Başka bir sorunuz mu var?", text: "Sorunuz tarihlere, müsaitliğe veya belirli bir odaya bağlıysa bizimle iletişime geçin; sizin için kontrol edelim.", primaryLabel: "Müsaitliği kontrol edin", primaryHref: relatedPaths.rates.tr, secondaryLabel: "Bize ulaşın", secondaryHref: relatedPaths.contact.tr },
  },
};

const publishedFaqRecords: readonly PropertyFaqRecord[] = [
  {
    id: "property-type",
    category: "general",
    scopes: ["all", "home"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "What is Voulamandis House?", answer: "Voulamandis House is a family-run accommodation in the historic Kambos area of Chios, offering rooms and family apartments in a citrus-estate setting. It is not a conventional hotel." },
      el: { question: "Τι είναι το Voulamandis House;", answer: "Το Voulamandis House είναι οικογενειακό κατάλυμα στον ιστορικό Κάμπο της Χίου, με δωμάτια και οικογενειακά διαμερίσματα μέσα σε κτήμα με εσπεριδοειδή. Δεν είναι συμβατικό ξενοδοχείο." },
      fr: { question: "Qu'est-ce que Voulamandis House ?", answer: "Voulamandis House est un hébergement familial dans le quartier historique de Kambos à Chios, avec des chambres et des appartements familiaux au cœur d'un domaine d'agrumes. Ce n'est pas un hôtel traditionnel." },
      de: { question: "Was ist das Voulamandis House?", answer: "Das Voulamandis House ist eine familiengeführte Unterkunft im historischen Kambos auf Chios mit Zimmern und Familienapartments in einem Zitrusgut. Es ist kein klassisches Hotel." },
      it: { question: "Che cos'è Voulamandis House?", answer: "Voulamandis House è un alloggio a conduzione familiare nella storica zona di Kambos a Chios, con camere e appartamenti familiari in una tenuta di agrumi. Non è un hotel tradizionale." },
      es: { question: "¿Qué es Voulamandis House?", answer: "Voulamandis House es un alojamiento familiar en la histórica zona de Kambos, en Quíos, con habitaciones y apartamentos familiares en una finca de cítricos. No es un hotel convencional." },
      tr: { question: "Voulamandis House nedir?", answer: "Voulamandis House, Sakız Adası'nın tarihi Kambos bölgesinde narenciye bahçesi içinde odalar ve aile daireleri sunan aile işletmesi bir konaklama tesisidir. Klasik bir otel değildir." },
    },
  },
  {
    id: "breakfast",
    category: "general",
    scopes: ["all", "home"],
    status: "published",
    translations: {
      en: { question: "Is breakfast available at Voulamandis House?", answer: "Yes. Breakfast is optional and costs €12 per person. It is not automatically included in every room rate, so please arrange it with reception in advance, preferably by the previous day." },
      el: { question: "Παρέχεται πρωινό στο Voulamandis House;", answer: "Ναι. Το πρωινό είναι προαιρετικό και κοστίζει €12 ανά άτομο. Δεν περιλαμβάνεται αυτόματα σε κάθε τιμή δωματίου, γι' αυτό παρακαλούμε να το κανονίζετε με τη reception εγκαίρως, ιδανικά από την προηγούμενη ημέρα." },
      fr: { question: "Le petit-déjeuner est-il disponible ?", answer: "Oui. Le petit-déjeuner est optionnel et coûte 12 € par personne. Il n'est pas automatiquement inclus dans tous les tarifs ; merci de le demander à la réception à l'avance, idéalement la veille." },
      de: { question: "Gibt es Frühstück im Voulamandis House?", answer: "Ja. Das Frühstück ist optional und kostet 12 € pro Person. Es ist nicht automatisch in jedem Zimmerpreis enthalten; bitte vereinbaren Sie es rechtzeitig mit der Rezeption, möglichst am Vortag." },
      it: { question: "È disponibile la colazione?", answer: "Sì. La colazione è facoltativa e costa 12 € a persona. Non è inclusa automaticamente in tutte le tariffe; chiedetela alla reception in anticipo, preferibilmente il giorno precedente." },
      es: { question: "¿Hay desayuno en Voulamandis House?", answer: "Sí. El desayuno es opcional y cuesta 12 € por persona. No está incluido automáticamente en todas las tarifas; solicítalo en recepción con antelación, preferiblemente el día anterior." },
      tr: { question: "Voulamandis House'ta kahvaltı var mı?", answer: "Evet. Kahvaltı isteğe bağlıdır ve kişi başı 12 €'dur. Her oda fiyatına otomatik olarak dahil değildir; tercihen bir gün önceden resepsiyonla ayarlayın." },
    },
  },
  {
    id: "parking",
    category: "general",
    scopes: ["all", "home", "kambos"],
    status: "published",
    relatedLink: "kambos",
    translations: {
      en: { question: "Is parking available?", answer: "Yes. Parking is available for guests at the property, and the surrounding Kambos area is quiet and practical for travelers using a car." },
      el: { question: "Υπάρχει parking στο Voulamandis House;", answer: "Ναι. Υπάρχει διαθέσιμος χώρος στάθμευσης για τους επισκέπτες και η περιοχή του Κάμπου είναι ήσυχη και πρακτική για όσους μετακινούνται με αυτοκίνητο." },
      fr: { question: "Y a-t-il un parking ?", answer: "Oui. Un stationnement est disponible pour les hôtes et le secteur calme de Kambos est pratique pour les voyageurs en voiture." },
      de: { question: "Gibt es Parkmöglichkeiten?", answer: "Ja. Für Gäste stehen Parkmöglichkeiten zur Verfügung; die ruhige Umgebung von Kambos ist zudem praktisch für Reisende mit Auto." },
      it: { question: "È disponibile il parcheggio?", answer: "Sì. È disponibile un parcheggio per gli ospiti e la tranquilla zona di Kambos è pratica per chi viaggia in auto." },
      es: { question: "¿Hay aparcamiento?", answer: "Sí. Hay aparcamiento disponible para los huéspedes y la tranquila zona de Kambos resulta práctica para quienes viajan en coche." },
      tr: { question: "Otopark var mı?", answer: "Evet. Misafirler için otopark mevcuttur; sakin Kambos çevresi de araçla seyahat edenler için pratiktir." },
    },
  },
  {
    id: "location",
    category: "location",
    scopes: ["all", "kambos"],
    status: "published",
    relatedLink: "kambos",
    translations: {
      en: { question: "Where is Voulamandis House located in Chios?", answer: "Voulamandis House is in Kambos, on the eastern side of Chios, close to Chios Town while retaining the quieter atmosphere of the historic citrus-estate area." },
      el: { question: "Πού βρίσκεται το Voulamandis House στη Χίο;", answer: "Το Voulamandis House βρίσκεται στον Κάμπο, στην ανατολική πλευρά της Χίου, κοντά στην πόλη αλλά μέσα στο πιο ήσυχο περιβάλλον της ιστορικής περιοχής με τα περιβόλια." },
      fr: { question: "Où se trouve Voulamandis House à Chios ?", answer: "Voulamandis House se trouve à Kambos, sur la côte est de Chios, près de la ville tout en conservant l'atmosphère paisible de ce quartier historique d'agrumes." },
      de: { question: "Wo liegt das Voulamandis House auf Chios?", answer: "Das Voulamandis House liegt in Kambos an der Ostseite von Chios, nahe der Stadt Chios und zugleich in der ruhigeren historischen Landschaft der Zitrusgüter." },
      it: { question: "Dove si trova Voulamandis House a Chios?", answer: "Voulamandis House si trova a Kambos, sul lato orientale di Chios, vicino alla città ma nell'atmosfera più tranquilla della storica zona degli agrumeti." },
      es: { question: "¿Dónde está Voulamandis House en Quíos?", answer: "Voulamandis House está en Kambos, en la parte oriental de Quíos, cerca de la ciudad pero dentro del ambiente más tranquilo de la histórica zona de fincas de cítricos." },
      tr: { question: "Voulamandis House Sakız Adası'nda nerede?", answer: "Voulamandis House, Sakız Adası'nın doğusundaki Kambos bölgesindedir; Sakız şehir merkezine yakın, tarihi narenciye bahçelerinin daha sakin atmosferindedir." },
    },
  },
  {
    id: "airport-port",
    category: "location",
    scopes: ["all", "kambos"],
    status: "published",
    translations: {
      en: { question: "How far are the airport and Chios port?", answer: "Chios Airport is about 3 km from Voulamandis House. Chios Town and the main port are about 6 km away, so both transfers are relatively short by car or taxi." },
      el: { question: "Πόσο απέχουν το αεροδρόμιο και το λιμάνι της Χίου;", answer: "Το αεροδρόμιο της Χίου απέχει περίπου 3 χλμ. από το Voulamandis House. Η πόλη και το κεντρικό λιμάνι απέχουν περίπου 6 χλμ., επομένως οι μετακινήσεις με αυτοκίνητο ή ταξί είναι σχετικά σύντομες." },
      fr: { question: "À quelle distance sont l'aéroport et le port de Chios ?", answer: "L'aéroport de Chios se trouve à environ 3 km. La ville de Chios et le port principal sont à environ 6 km, ce qui rend les transferts en voiture ou taxi assez courts." },
      de: { question: "Wie weit sind Flughafen und Hafen von Chios entfernt?", answer: "Der Flughafen Chios liegt etwa 3 km vom Voulamandis House entfernt. Die Stadt Chios und der Haupthafen sind ungefähr 6 km entfernt; die Transfers mit Auto oder Taxi sind daher relativ kurz." },
      it: { question: "Quanto distano l'aeroporto e il porto di Chios?", answer: "L'aeroporto di Chios dista circa 3 km. La città e il porto principale distano circa 6 km, quindi i trasferimenti in auto o taxi sono relativamente brevi." },
      es: { question: "¿A qué distancia están el aeropuerto y el puerto de Quíos?", answer: "El aeropuerto de Quíos está a unos 3 km. La ciudad y el puerto principal están a unos 6 km, por lo que los traslados en coche o taxi son relativamente cortos." },
      tr: { question: "Sakız Havalimanı ve liman ne kadar uzakta?", answer: "Sakız Havalimanı Voulamandis House'a yaklaşık 3 km, Sakız şehir merkezi ve ana liman ise yaklaşık 6 km uzaklıktadır. Araç veya taksiyle transferler görece kısadır." },
    },
  },
  {
    id: "getting-around",
    category: "location",
    scopes: ["all", "kambos"],
    status: "published",
    relatedLink: "kambos",
    translations: {
      en: { question: "Do I need a car to explore Chios?", answer: "A car or taxi is the most practical option if you want to visit several beaches, villages and attractions. Voulamandis House is close to town and the airport, but many of Chios's best places are spread around the island." },
      el: { question: "Χρειάζομαι αυτοκίνητο για να εξερευνήσω τη Χίο;", answer: "Αυτοκίνητο ή ταξί είναι η πιο πρακτική επιλογή αν θέλετε να επισκεφθείτε πολλές παραλίες, χωριά και αξιοθέατα. Το Voulamandis House είναι κοντά στην πόλη και στο αεροδρόμιο, αλλά πολλά σημεία ενδιαφέροντος είναι διάσπαρτα στο νησί." },
      fr: { question: "Faut-il une voiture pour découvrir Chios ?", answer: "Une voiture ou un taxi est la solution la plus pratique pour visiter plusieurs plages, villages et sites. Voulamandis House est proche de la ville et de l'aéroport, mais de nombreux lieux intéressants sont répartis sur l'île." },
      de: { question: "Brauche ich ein Auto, um Chios zu erkunden?", answer: "Ein Auto oder Taxi ist am praktischsten, wenn Sie mehrere Strände, Dörfer und Sehenswürdigkeiten besuchen möchten. Das Voulamandis House liegt nahe Stadt und Flughafen, viele Ziele verteilen sich jedoch über die Insel." },
      it: { question: "Serve un'auto per esplorare Chios?", answer: "Un'auto o un taxi è la soluzione più pratica per visitare più spiagge, villaggi e attrazioni. Voulamandis House è vicino alla città e all'aeroporto, ma molti luoghi di Chios sono distribuiti sull'isola." },
      es: { question: "¿Necesito coche para recorrer Quíos?", answer: "Un coche o taxi es la opción más práctica para visitar varias playas, pueblos y lugares de interés. Voulamandis House está cerca de la ciudad y del aeropuerto, pero muchos sitios están repartidos por la isla." },
      tr: { question: "Sakız Adası'nı gezmek için araç gerekir mi?", answer: "Birden fazla plaj, köy ve turistik noktayı görmek istiyorsanız araç veya taksi en pratik seçenektir. Voulamandis House şehir ve havalimanına yakındır, ancak adadaki birçok yer farklı bölgelere yayılmıştır." },
    },
  },
  {
    id: "nearby-beach",
    category: "location",
    scopes: ["all", "kambos"],
    status: "published",
    translations: {
      en: { question: "Is there a beach near Voulamandis House?", answer: "Yes. The nearest coastal options are roughly 1.5 km from the property, and Karfas is one of the practical nearby beach choices. For exploring more of Chios's coastline, a vehicle is recommended." },
      el: { question: "Υπάρχει παραλία κοντά στο Voulamandis House;", answer: "Ναι. Οι κοντινότερες επιλογές στη θάλασσα βρίσκονται περίπου 1,5 χλμ. από το κατάλυμα και ο Καρφάς είναι μία από τις πρακτικές κοντινές παραλίες. Για περισσότερες παραλίες της Χίου προτείνεται όχημα." },
      fr: { question: "Y a-t-il une plage près de Voulamandis House ?", answer: "Oui. Les options côtières les plus proches se trouvent à environ 1,5 km et Karfas est l'une des plages pratiques à proximité. Un véhicule est conseillé pour découvrir davantage le littoral de Chios." },
      de: { question: "Gibt es einen Strand in der Nähe?", answer: "Ja. Die nächstgelegenen Küstenbereiche liegen etwa 1,5 km entfernt; Karfas gehört zu den praktischen Strandoptionen in der Nähe. Für weitere Strände auf Chios ist ein Fahrzeug empfehlenswert." },
      it: { question: "C'è una spiaggia vicino a Voulamandis House?", answer: "Sì. Le opzioni costiere più vicine si trovano a circa 1,5 km e Karfas è una delle spiagge pratiche nei dintorni. Per esplorare altre spiagge di Chios è consigliato un veicolo." },
      es: { question: "¿Hay una playa cerca de Voulamandis House?", answer: "Sí. Las opciones de costa más cercanas están a unos 1,5 km y Karfas es una de las playas prácticas de la zona. Para conocer más playas de Quíos se recomienda disponer de vehículo." },
      tr: { question: "Voulamandis House yakınında plaj var mı?", answer: "Evet. En yakın sahil seçenekleri tesise yaklaşık 1,5 km mesafededir; Karfas yakın ve pratik plaj seçeneklerinden biridir. Sakız'ın daha fazla plajını görmek için araç önerilir." },
    },
  },
  {
    id: "specific-room-photos",
    category: "rooms",
    scopes: ["all", "rooms"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "Can I see photos of specific rooms?", answer: "Yes. The room pages show the individual room numbers, key features and photos where available, so you can compare the actual layouts within each category before sending a request." },
      el: { question: "Μπορώ να δω φωτογραφίες συγκεκριμένου δωματίου;", answer: "Ναι. Οι σελίδες δωματίων εμφανίζουν τους επιμέρους αριθμούς δωματίων, βασικά χαρακτηριστικά και φωτογραφίες όπου υπάρχουν, ώστε να συγκρίνετε τις πραγματικές επιλογές κάθε κατηγορίας." },
      fr: { question: "Puis-je voir des photos de chambres précises ?", answer: "Oui. Les pages des chambres présentent les numéros de chambre, les principales caractéristiques et les photos disponibles pour comparer les configurations réelles de chaque catégorie." },
      de: { question: "Kann ich Fotos bestimmter Zimmer sehen?", answer: "Ja. Auf den Zimmerseiten finden Sie einzelne Zimmernummern, wichtige Merkmale und verfügbare Fotos, damit Sie die tatsächlichen Varianten jeder Kategorie vergleichen können." },
      it: { question: "Posso vedere foto di camere specifiche?", answer: "Sì. Le pagine delle camere mostrano i singoli numeri, le caratteristiche principali e le foto disponibili, così potete confrontare le configurazioni reali di ogni categoria." },
      es: { question: "¿Puedo ver fotos de habitaciones concretas?", answer: "Sí. Las páginas de habitaciones muestran números concretos, características principales y fotos disponibles para comparar las distribuciones reales de cada categoría." },
      tr: { question: "Belirli odaların fotoğraflarını görebilir miyim?", answer: "Evet. Oda sayfalarında ayrı oda numaraları, temel özellikler ve mevcut fotoğraflar gösterilir; böylece her kategorideki gerçek seçenekleri karşılaştırabilirsiniz." },
    },
  },
  {
    id: "couples",
    category: "rooms",
    scopes: ["all", "rooms"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "Which room is a good choice for a couple?", answer: "For two guests, Economy Double is the more budget-focused option, while the Standard Double/Triple category offers more space and a wider choice of room layouts. The better option depends on budget, length of stay and preferred floor." },
      el: { question: "Ποιο δωμάτιο είναι καλή επιλογή για ζευγάρι;", answer: "Για δύο άτομα, το Economy Double είναι η πιο οικονομική επιλογή, ενώ τα Standard Δίκλινα/Τρίκλινα προσφέρουν περισσότερο χώρο και περισσότερες επιλογές διάταξης. Η καλύτερη επιλογή εξαρτάται από το budget, τη διάρκεια διαμονής και τον όροφο που προτιμάτε." },
      fr: { question: "Quelle chambre choisir pour un couple ?", answer: "Pour deux personnes, l'Economy Double privilégie le budget, tandis que la catégorie Standard Double/Triple offre plus d'espace et davantage de configurations. Le choix dépend du budget, de la durée du séjour et de l'étage souhaité." },
      de: { question: "Welches Zimmer eignet sich für ein Paar?", answer: "Für zwei Gäste ist das Economy Double die preisorientierte Wahl; Standard Doppel-/Dreibettzimmer bieten mehr Platz und verschiedene Grundrisse. Entscheidend sind Budget, Aufenthaltsdauer und gewünschte Etage." },
      it: { question: "Quale camera scegliere per una coppia?", answer: "Per due ospiti, l'Economy Double è l'opzione più orientata al risparmio, mentre le Standard Doppie/Triple offrono più spazio e configurazioni diverse. La scelta dipende da budget, durata e piano preferito." },
      es: { question: "¿Qué habitación conviene a una pareja?", answer: "Para dos huéspedes, la Economy Double es la opción más económica, mientras que la categoría Standard Doble/Triple ofrece más espacio y distribuciones diferentes. La elección depende del presupuesto, la duración y la planta preferida." },
      tr: { question: "Çiftler için hangi oda uygundur?", answer: "İki kişi için Economy Double daha bütçe odaklı seçenektir; Standard Çift/Üç Kişilik odalar ise daha fazla alan ve farklı düzen seçenekleri sunar. Tercih bütçeye, konaklama süresine ve kata bağlıdır." },
    },
  },
  {
    id: "solo",
    category: "rooms",
    scopes: ["all", "rooms"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "Which room is suitable for one guest?", answer: "The Economy Double category is usually the most practical value choice for one guest, while still providing the core in-room amenities offered by the property." },
      el: { question: "Ποιο δωμάτιο είναι κατάλληλο για ένα άτομο;", answer: "Το Economy Double είναι συνήθως η πιο πρακτική και οικονομική επιλογή για έναν επισκέπτη, διατηρώντας τις βασικές παροχές που προσφέρει το κατάλυμα στα δωμάτια." },
      fr: { question: "Quelle chambre convient à une personne ?", answer: "L'Economy Double est généralement le choix le plus pratique et économique pour une personne, tout en conservant les principaux équipements proposés dans les chambres." },
      de: { question: "Welches Zimmer eignet sich für eine Person?", answer: "Das Economy Double ist für Alleinreisende meist die praktischste und preisbewussteste Wahl und bietet dennoch die wesentlichen Zimmerausstattungen." },
      it: { question: "Quale camera è adatta a una persona?", answer: "L'Economy Double è in genere la scelta più pratica e conveniente per un ospite, mantenendo i principali servizi in camera della struttura." },
      es: { question: "¿Qué habitación es adecuada para una persona?", answer: "La Economy Double suele ser la opción más práctica y económica para una persona, manteniendo los principales servicios de la habitación." },
      tr: { question: "Tek kişi için hangi oda uygundur?", answer: "Economy Double, tek misafir için genellikle en pratik ve ekonomik seçenektir ve tesisteki temel oda olanaklarını sunmaya devam eder." },
    },
  },
  {
    id: "three-guests",
    category: "rooms",
    scopes: ["all", "rooms"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "Which options work for three guests?", answer: "Choose a Standard Double/Triple room or a Family Apartment, depending on the space and kitchen setup you prefer. Economy Double rooms are intended for two guests." },
      el: { question: "Ποιες επιλογές είναι κατάλληλες για 3 άτομα;", answer: "Επιλέξτε Standard Δίκλινο/Τρίκλινο ή Οικογενειακό Διαμέρισμα, ανάλογα με τον χώρο και την κουζίνα που χρειάζεστε. Τα Economy Double προορίζονται για δύο άτομα." },
      fr: { question: "Quelles options conviennent à trois personnes ?", answer: "Choisissez une chambre Standard Double/Triple ou un Appartement Familial selon l'espace et le type de cuisine souhaités. Les Economy Double sont prévues pour deux personnes." },
      de: { question: "Welche Optionen passen für drei Gäste?", answer: "Wählen Sie je nach gewünschtem Platz und Küchenausstattung ein Standard Doppel-/Dreibettzimmer oder ein Familienapartment. Economy Double Zimmer sind für zwei Gäste vorgesehen." },
      it: { question: "Quali opzioni vanno bene per tre ospiti?", answer: "Scegliete una Standard Doppia/Tripla o un Appartamento Familiare in base allo spazio e alla cucina desiderati. Le Economy Double sono pensate per due ospiti." },
      es: { question: "¿Qué opciones sirven para tres huéspedes?", answer: "Elige una Standard Doble/Triple o un Apartamento Familiar según el espacio y la cocina que prefieras. Las Economy Double están pensadas para dos huéspedes." },
      tr: { question: "Üç kişi için hangi seçenekler uygundur?", answer: "İhtiyacınız olan alan ve mutfak düzenine göre Standard Çift/Üç Kişilik oda veya Aile Dairesi seçin. Economy Double odalar iki kişi içindir." },
    },
  },
  {
    id: "family-four",
    category: "rooms",
    scopes: ["all", "rooms"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "What is the best option for a family of four?", answer: "The Family Apartments are designed for families and longer stays, with more living space and a kitchen. Some Standard rooms can also accommodate more guests, so compare the exact room layout before booking." },
      el: { question: "Ποια επιλογή ταιριάζει σε οικογένεια 4 ατόμων;", answer: "Τα Οικογενειακά Διαμερίσματα είναι σχεδιασμένα για οικογένειες και μεγαλύτερες διαμονές, με περισσότερο χώρο και κουζίνα. Ορισμένα Standard δωμάτια φιλοξενούν επίσης περισσότερα άτομα, γι' αυτό συγκρίνετε τη συγκεκριμένη διάταξη πριν την κράτηση." },
      fr: { question: "Quelle option pour une famille de quatre personnes ?", answer: "Les Appartements Familiaux sont conçus pour les familles et les séjours plus longs, avec davantage d'espace et une cuisine. Certaines chambres Standard peuvent aussi accueillir plus de personnes ; comparez la configuration exacte avant de réserver." },
      de: { question: "Welche Option eignet sich für eine vierköpfige Familie?", answer: "Die Familienapartments sind für Familien und längere Aufenthalte ausgelegt und bieten mehr Wohnraum sowie eine Küche. Einige Standardzimmer können ebenfalls mehr Gäste aufnehmen; vergleichen Sie daher vor der Buchung den genauen Grundriss." },
      it: { question: "Qual è l'opzione migliore per una famiglia di quattro persone?", answer: "Gli Appartamenti Familiari sono pensati per famiglie e soggiorni più lunghi, con più spazio e cucina. Anche alcune camere Standard possono ospitare più persone; confrontate la configurazione esatta prima di prenotare." },
      es: { question: "¿Qué opción conviene a una familia de cuatro?", answer: "Los Apartamentos Familiares están pensados para familias y estancias más largas, con más espacio y cocina. Algunas habitaciones Standard también admiten más huéspedes; compara la distribución exacta antes de reservar." },
      tr: { question: "Dört kişilik aile için en uygun seçenek nedir?", answer: "Aile Daireleri, daha geniş alan ve mutfakla aileler ve uzun konaklamalar için tasarlanmıştır. Bazı Standard odalar da daha fazla kişiyi ağırlayabilir; rezervasyondan önce oda düzenini karşılaştırın." },
    },
  },
  {
    id: "kitchenette",
    category: "rooms",
    scopes: ["all", "rooms"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "Do all rooms have a kitchenette?", answer: "No. Kitchen facilities depend on the room. Selected first-floor Standard rooms, including rooms 3 and 4, have a kitchenette, while the Family Apartments include a fuller kitchen setup. Check the individual room details before booking." },
      el: { question: "Έχουν όλα τα δωμάτια kitchenette;", answer: "Όχι. Η κουζίνα εξαρτάται από το συγκεκριμένο δωμάτιο. Επιλεγμένα Standard δωμάτια ορόφου, όπως τα 3 και 4, διαθέτουν μικρή κουζίνα, ενώ τα Οικογενειακά Διαμερίσματα έχουν πληρέστερη κουζίνα. Ελέγξτε τα χαρακτηριστικά του συγκεκριμένου δωματίου πριν την κράτηση." },
      fr: { question: "Toutes les chambres ont-elles une kitchenette ?", answer: "Non. Les équipements de cuisine dépendent de la chambre. Certaines chambres Standard au premier étage, notamment les chambres 3 et 4, ont une kitchenette, tandis que les Appartements Familiaux disposent d'une cuisine plus complète." },
      de: { question: "Haben alle Zimmer eine Kitchenette?", answer: "Nein. Die Küchenausstattung hängt vom Zimmer ab. Ausgewählte Standardzimmer im Obergeschoss, darunter Zimmer 3 und 4, verfügen über eine Kitchenette; die Familienapartments bieten eine umfassendere Küche." },
      it: { question: "Tutte le camere hanno un angolo cottura?", answer: "No. La cucina dipende dalla camera. Alcune Standard al primo piano, tra cui le camere 3 e 4, hanno un angolo cottura, mentre gli Appartamenti Familiari dispongono di una cucina più completa." },
      es: { question: "¿Todas las habitaciones tienen cocina?", answer: "No. El equipamiento de cocina depende de la habitación. Algunas Standard de la primera planta, incluidas las habitaciones 3 y 4, tienen kitchenette, mientras que los Apartamentos Familiares disponen de una cocina más completa." },
      tr: { question: "Tüm odalarda mini mutfak var mı?", answer: "Hayır. Mutfak olanakları odaya göre değişir. 3 ve 4 numaralı bazı üst kat Standard odalarda mini mutfak bulunurken Aile Dairelerinde daha kapsamlı mutfak vardır." },
    },
  },
  {
    id: "no-stairs",
    category: "rooms",
    scopes: ["all", "rooms"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "Are there rooms without stairs?", answer: "Yes. Ground-floor Standard rooms 5 and 7 have direct courtyard and garden access without stairs. If avoiding stairs matters to you, mention it when choosing or requesting a room." },
      el: { question: "Υπάρχουν δωμάτια χωρίς σκάλες;", answer: "Ναι. Τα Standard δωμάτια ισογείου 5 και 7 έχουν άμεση πρόσβαση στην αυλή και στον κήπο χωρίς σκάλες. Αν η αποφυγή σκάλας είναι σημαντική, αναφέρετέ το όταν επιλέγετε ή ζητάτε δωμάτιο." },
      fr: { question: "Y a-t-il des chambres sans escaliers ?", answer: "Oui. Les chambres Standard 5 et 7 au rez-de-chaussée donnent directement sur la cour et le jardin sans escalier. Si ce point est important, précisez-le lors de votre choix ou demande." },
      de: { question: "Gibt es Zimmer ohne Treppen?", answer: "Ja. Die Standardzimmer 5 und 7 im Erdgeschoss haben direkten Zugang zu Hof und Garten ohne Treppen. Wenn Treppen vermieden werden sollen, geben Sie dies bei der Zimmerwahl oder Anfrage an." },
      it: { question: "Ci sono camere senza scale?", answer: "Sì. Le camere Standard 5 e 7 al piano terra hanno accesso diretto al cortile e al giardino senza scale. Se è importante evitare le scale, indicatelo nella scelta o richiesta della camera." },
      es: { question: "¿Hay habitaciones sin escaleras?", answer: "Sí. Las habitaciones Standard 5 y 7 de planta baja tienen acceso directo al patio y jardín sin escaleras. Si evitar escaleras es importante, indícalo al elegir o solicitar habitación." },
      tr: { question: "Merdivensiz oda var mı?", answer: "Evet. Zemin kattaki Standard 5 ve 7 numaralı odalar avlu ve bahçeye merdivensiz doğrudan erişime sahiptir. Merdivenden kaçınmanız gerekiyorsa oda seçerken veya talep ederken belirtin." },
    },
  },
  {
    id: "direct-booking",
    category: "booking",
    scopes: ["all", "rates", "home"],
    status: "published",
    relatedLink: "rates",
    translations: {
      en: { question: "Can I book directly with Voulamandis House?", answer: "Yes. The direct booking page shows live availability through Beds24. Direct online bookings can use the current website discount code when its conditions apply." },
      el: { question: "Μπορώ να κάνω απευθείας κράτηση στο Voulamandis House;", answer: "Ναι. Η σελίδα απευθείας κράτησης εμφανίζει ζωντανή διαθεσιμότητα μέσω Beds24. Στις απευθείας online κρατήσεις μπορείτε να χρησιμοποιήσετε τον τρέχοντα εκπτωτικό κωδικό του site όταν ισχύουν οι όροι του." },
      fr: { question: "Puis-je réserver directement avec Voulamandis House ?", answer: "Oui. La page de réservation directe affiche les disponibilités en temps réel via Beds24. Les réservations directes en ligne peuvent utiliser le code de réduction actuel du site lorsque ses conditions s'appliquent." },
      de: { question: "Kann ich direkt beim Voulamandis House buchen?", answer: "Ja. Auf der Direktbuchungsseite sehen Sie die Live-Verfügbarkeit über Beds24. Für direkte Online-Buchungen kann der aktuelle Website-Rabattcode genutzt werden, sofern dessen Bedingungen erfüllt sind." },
      it: { question: "Posso prenotare direttamente con Voulamandis House?", answer: "Sì. La pagina di prenotazione diretta mostra la disponibilità in tempo reale tramite Beds24. Le prenotazioni online dirette possono utilizzare il codice sconto attuale del sito quando si applicano le relative condizioni." },
      es: { question: "¿Puedo reservar directamente con Voulamandis House?", answer: "Sí. La página de reserva directa muestra disponibilidad en tiempo real mediante Beds24. Las reservas directas online pueden utilizar el código de descuento actual de la web cuando se cumplan sus condiciones." },
      tr: { question: "Voulamandis House üzerinden doğrudan rezervasyon yapabilir miyim?", answer: "Evet. Doğrudan rezervasyon sayfasında Beds24 üzerinden canlı müsaitlik gösterilir. Koşulları uygunsa doğrudan online rezervasyonlarda sitedeki güncel indirim kodu kullanılabilir." },
    },
  },
  {
    id: "booking-details",
    category: "booking",
    scopes: ["all", "rates"],
    status: "published",
    relatedLink: "rates",
    translations: {
      en: { question: "What information do I need before booking?", answer: "Have your check-in and check-out dates, the number of adults and children, and your contact details ready. The booking system will show the room categories available for those dates." },
      el: { question: "Τι στοιχεία χρειάζομαι πριν κάνω κράτηση;", answer: "Έχετε έτοιμες τις ημερομηνίες άφιξης και αναχώρησης, τον αριθμό ενηλίκων και παιδιών και τα στοιχεία επικοινωνίας σας. Το σύστημα κράτησης θα εμφανίσει τις διαθέσιμες κατηγορίες για τις ημερομηνίες σας." },
      fr: { question: "Quelles informations faut-il avant de réserver ?", answer: "Préparez vos dates d'arrivée et de départ, le nombre d'adultes et d'enfants ainsi que vos coordonnées. Le système affichera les catégories disponibles pour ces dates." },
      de: { question: "Welche Angaben brauche ich vor der Buchung?", answer: "Halten Sie An- und Abreisedatum, die Zahl der Erwachsenen und Kinder sowie Ihre Kontaktdaten bereit. Das Buchungssystem zeigt die für diese Daten verfügbaren Zimmerkategorien." },
      it: { question: "Quali informazioni servono prima di prenotare?", answer: "Tenete pronti data di arrivo e partenza, numero di adulti e bambini e dati di contatto. Il sistema mostrerà le categorie disponibili per le vostre date." },
      es: { question: "¿Qué información necesito antes de reservar?", answer: "Ten preparadas las fechas de entrada y salida, el número de adultos y niños y tus datos de contacto. El sistema mostrará las categorías disponibles para esas fechas." },
      tr: { question: "Rezervasyondan önce hangi bilgilere ihtiyacım var?", answer: "Giriş-çıkış tarihlerinizi, yetişkin ve çocuk sayısını ve iletişim bilgilerinizi hazır bulundurun. Rezervasyon sistemi bu tarihlerde müsait oda kategorilerini gösterecektir." },
    },
  },
  {
    id: "specific-room-request",
    category: "booking",
    scopes: ["all", "rates", "rooms"],
    status: "published",
    relatedLink: "rooms",
    translations: {
      en: { question: "Can I request a specific room number?", answer: "Yes, you can request a specific room, but direct online booking is made by room category and a particular room number remains subject to availability. Use the room pages to identify the option you prefer." },
      el: { question: "Μπορώ να ζητήσω συγκεκριμένο αριθμό δωματίου;", answer: "Ναι, μπορείτε να ζητήσετε συγκεκριμένο δωμάτιο, αλλά η online κράτηση γίνεται ανά κατηγορία και ο συγκεκριμένος αριθμός εξαρτάται από τη διαθεσιμότητα. Χρησιμοποιήστε τις σελίδες δωματίων για να εντοπίσετε ποιο προτιμάτε." },
      fr: { question: "Puis-je demander un numéro de chambre précis ?", answer: "Oui, vous pouvez en faire la demande, mais la réservation directe en ligne se fait par catégorie et un numéro précis reste soumis aux disponibilités. Consultez les pages des chambres pour identifier votre préférence." },
      de: { question: "Kann ich eine bestimmte Zimmernummer anfragen?", answer: "Ja. Sie können ein bestimmtes Zimmer wünschen; die Online-Buchung erfolgt jedoch nach Kategorie und eine konkrete Zimmernummer hängt von der Verfügbarkeit ab. Nutzen Sie die Zimmerseiten, um Ihre Präferenz zu finden." },
      it: { question: "Posso richiedere un numero di camera specifico?", answer: "Sì. Potete richiedere una camera specifica, ma la prenotazione online avviene per categoria e il numero preciso dipende dalla disponibilità. Usate le pagine delle camere per indicare la vostra preferenza." },
      es: { question: "¿Puedo solicitar un número de habitación concreto?", answer: "Sí. Puedes pedir una habitación concreta, pero la reserva online se realiza por categoría y el número exacto depende de la disponibilidad. Usa las páginas de habitaciones para identificar tu preferencia." },
      tr: { question: "Belirli bir oda numarası isteyebilir miyim?", answer: "Evet, belirli bir oda talep edebilirsiniz; ancak online rezervasyon oda kategorisi üzerinden yapılır ve belirli numara müsaitliğe bağlıdır. Tercihinizi belirlemek için oda sayfalarını kullanın." },
    },
  },
  {
    id: "booking-confirmation",
    category: "booking",
    scopes: ["all", "rates"],
    status: "published",
    translations: {
      en: { question: "When is my booking confirmed?", answer: "Treat the reservation as confirmed only after you receive the confirmation generated by the booking system or a direct confirmation from Voulamandis House. An availability request or message by itself is not a completed booking." },
      el: { question: "Πότε θεωρείται επιβεβαιωμένη η κράτησή μου;", answer: "Θεωρήστε την κράτηση επιβεβαιωμένη μόνο όταν λάβετε την επιβεβαίωση από το σύστημα κράτησης ή άμεση επιβεβαίωση από το Voulamandis House. Ένα αίτημα διαθεσιμότητας ή μήνυμα από μόνο του δεν αποτελεί ολοκληρωμένη κράτηση." },
      fr: { question: "Quand ma réservation est-elle confirmée ?", answer: "Considérez la réservation comme confirmée uniquement après réception de la confirmation du système de réservation ou d'une confirmation directe de Voulamandis House. Une simple demande de disponibilité n'est pas une réservation finalisée." },
      de: { question: "Wann ist meine Buchung bestätigt?", answer: "Betrachten Sie die Buchung erst als bestätigt, wenn Sie die Bestätigung des Buchungssystems oder eine direkte Bestätigung vom Voulamandis House erhalten. Eine Verfügbarkeitsanfrage oder Nachricht allein ist noch keine abgeschlossene Buchung." },
      it: { question: "Quando è confermata la mia prenotazione?", answer: "Considerate la prenotazione confermata solo dopo aver ricevuto la conferma dal sistema di prenotazione o una conferma diretta da Voulamandis House. Una semplice richiesta di disponibilità non costituisce una prenotazione completata." },
      es: { question: "¿Cuándo está confirmada mi reserva?", answer: "Considera la reserva confirmada solo después de recibir la confirmación del sistema de reservas o una confirmación directa de Voulamandis House. Una solicitud de disponibilidad o un mensaje por sí solos no completan una reserva." },
      tr: { question: "Rezervasyonum ne zaman onaylanmış sayılır?", answer: "Rezervasyonunuzu yalnızca rezervasyon sisteminden onay aldığınızda veya Voulamandis House doğrudan onayladığında kesinleşmiş kabul edin. Müsaitlik talebi veya mesaj tek başına tamamlanmış rezervasyon değildir." },
    },
  },
];

export const legacyFaqArchive: readonly PropertyFaqRecord[] = [
  { id: "wake-up-service", category: "general", scopes: ["all"], status: "needs-verification", legacySourceSummary: "Legacy FAQ said a wake-up service was available." },
  { id: "laundry-service", category: "general", scopes: ["all"], status: "needs-verification", legacySourceSummary: "Legacy FAQ listed laundry at €10 per load." },
  { id: "group-bookings-events", category: "general", scopes: ["all"], status: "needs-verification", legacySourceSummary: "Legacy FAQ accepted group/wedding-room bookings but said events could not be hosted at the property." },
  { id: "activity-groups", category: "general", scopes: ["all"], status: "needs-verification", legacySourceSummary: "Legacy FAQ invited enquiries for activity groups such as painting or hiking." },
  { id: "bus-frequency", category: "location", scopes: ["all", "kambos"], status: "needs-verification", legacySourceSummary: "Legacy FAQ described a bus passing in front of the property twice daily and another nearby stop with more frequent service." },
  { id: "nearby-tavern", category: "location", scopes: ["all", "kambos"], status: "needs-verification", legacySourceSummary: "Legacy FAQ named a traditional tavern in Thymiana at about a 16-minute walk." },
  { id: "nearby-supermarket", category: "location", scopes: ["all", "kambos"], status: "needs-verification", legacySourceSummary: "Legacy FAQ said Thymiana had a supermarket, convenience store and bakery around a 14-minute walk away." },
  { id: "nearby-pharmacy", category: "location", scopes: ["all", "kambos"], status: "needs-verification", legacySourceSummary: "Legacy FAQ said there were two pharmacies in Thymiana around a 14-minute walk away." },
  { id: "baby-cot", category: "rooms", scopes: ["all", "rooms"], status: "needs-verification", legacySourceSummary: "Legacy FAQ said a baby cot was available free of charge if requested at booking." },
  { id: "shared-kitchen", category: "rooms", scopes: ["all", "rooms"], status: "needs-verification", legacySourceSummary: "Legacy FAQ said guests without an in-room kitchen could occasionally use a shared kitchen." },
  { id: "connecting-rooms", category: "rooms", scopes: ["all", "rooms"], status: "needs-verification", legacySourceSummary: "Legacy FAQ described limited connecting-room combinations involving rooms 1/2 or 3/2." },
  { id: "pets", category: "rooms", scopes: ["all", "rooms"], status: "needs-verification", legacySourceSummary: "Legacy FAQ said pets were not allowed." },
  { id: "kitchenette-extra-charge", category: "rooms", scopes: ["all", "rooms"], status: "needs-verification", legacySourceSummary: "Legacy FAQ mentioned an extra charge for kitchenette availability; current room content no longer states this, so it must not be published without confirmation." },
  { id: "phone-booking-deposit", category: "booking", scopes: ["all", "rates"], status: "needs-verification", legacySourceSummary: "Legacy FAQ said phone bookings required a 20% deposit while online bookings did not." },
  { id: "cancellation-policy", category: "booking", scopes: ["all", "rates"], status: "needs-verification", legacySourceSummary: "Legacy FAQ described all bookings as non-refundable with no date changes. This must be checked against current rate-plan conditions." },
  { id: "payment-methods", category: "booking", scopes: ["all", "rates"], status: "needs-verification", legacySourceSummary: "Legacy FAQ listed cards except AMEX, bank transfer, cash and IRIS, plus a 2% cash/bank-transfer discount." },
  { id: "check-in-out", category: "arrival", scopes: ["all"], status: "needs-verification", legacySourceSummary: "Legacy FAQ listed check-in at 13:00 and check-out at 11:00, with possible flexibility around ferry arrivals if arranged in advance." },
];

const allFaqRecords: readonly PropertyFaqRecord[] = [...publishedFaqRecords, ...legacyFaqArchive];

function buildRelatedLink(language: LanguageCode, key?: PropertyFaqLinkKey) {
  if (!key) return undefined;
  return {
    href: relatedPaths[key][language],
    label: relatedLabels[key][language],
  };
}

export function getPropertyFaqItems(language: LanguageCode, scope: PropertyFaqScope = "all"): PropertyFaqItem[] {
  return allFaqRecords
    .filter((record) => record.status === "published")
    .filter((record) => scope === "all" || record.scopes.includes(scope) || record.scopes.includes("all"))
    .flatMap((record) => {
      const translation = record.translations?.[language];
      if (!translation) return [];
      return [{ ...translation, id: record.id, category: record.category, relatedLink: buildRelatedLink(language, record.relatedLink) }];
    });
}

export function getPropertyFaqPage(language: LanguageCode): PropertyFaqPageData {
  const copy = pageCopy[language];
  const items = getPropertyFaqItems(language, "all");
  const categories = (Object.keys(categoryCopy[language]) as PropertyFaqCategory[])
    .map((id) => ({ id, ...categoryCopy[language][id], items: items.filter((item) => item.category === id) }))
    .filter((category) => category.items.length > 0);

  return { language, ...copy, categories };
}

export function getPropertyFaqPageByPath(path: string): PropertyFaqPageData | undefined {
  const normalized = normalizePath(path);
  const language = (Object.keys(propertyFaqPaths) as LanguageCode[]).find(
    (code) => normalizePath(propertyFaqPaths[code]) === normalized,
  );
  return language ? getPropertyFaqPage(language) : undefined;
}
