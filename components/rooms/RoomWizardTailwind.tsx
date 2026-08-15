import type { RoomWizardRoom } from "@/content/rooms";
import { roomFinderHrefForLanguage } from "@/lib/room-finder-cta-routing";

type WizardLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type RoomWizardTailwindProps = {
  rooms: RoomWizardRoom[];
  whatsappPhone: string;
  language?: WizardLanguage;
};

type RoomFinderCtaCopy = {
  aiEyebrow: string;
  aiTitle: string;
  aiText: string;
  aiCta: string;
  bookingEyebrow: string;
  bookingTitle: string;
  bookingText: string;
  bookingCta: string;
  bookingHref: string;
};

const copyByLanguage: Record<WizardLanguage, RoomFinderCtaCopy> = {
  en: {
    aiEyebrow: "AI Room Finder",
    aiTitle: "Find the specific room that fits you",
    aiText:
      "Tell us your dates and number of guests. The AI Room Finder checks individual rooms that may suit you, shows the options and lets you send an availability enquiry to Voulamandis House. No booking or card payment is completed here.",
    aiCta: "Find your room with AI",
    bookingEyebrow: "Online booking",
    bookingTitle: "Ready to book a room category?",
    bookingText:
      "Use our Beds24 booking engine to choose an available room category, enter your card details and complete your reservation online.",
    bookingCta: "Book Now",
    bookingHref: "/chios-hotels-rates/",
  },
  el: {
    aiEyebrow: "AI Room Finder",
    aiTitle: "Βρείτε το συγκεκριμένο δωμάτιο που σας ταιριάζει",
    aiText:
      "Πείτε μας τις ημερομηνίες και τον αριθμό επισκεπτών. Το AI Room Finder ελέγχει ποια συγκεκριμένα δωμάτια μπορεί να σας ταιριάζουν, σας δείχνει τις επιλογές και σας επιτρέπει να στείλετε αίτημα διαθεσιμότητας στο Voulamandis House. Εδώ δεν ολοκληρώνεται κράτηση ούτε πληρωμή με κάρτα.",
    aiCta: "Βρείτε το δωμάτιό σας με AI",
    bookingEyebrow: "Online κράτηση",
    bookingTitle: "Θέλετε να κάνετε άμεση online κράτηση;",
    bookingText:
      "Χρησιμοποιήστε το booking engine της Beds24 για να επιλέξετε διαθέσιμη κατηγορία δωματίου, να βάλετε τα στοιχεία της κάρτας σας και να ολοκληρώσετε την κράτηση online.",
    bookingCta: "Κράτηση τώρα",
    bookingHref: "/el/amesi-kratisi-voulamandis-house/",
  },
  fr: {
    aiEyebrow: "AI Room Finder",
    aiTitle: "Trouvez la chambre précise qui vous convient",
    aiText:
      "Indiquez vos dates et le nombre de personnes. L’AI Room Finder vérifie quelles chambres précises peuvent vous convenir, affiche les options et vous permet d’envoyer une demande de disponibilité au Voulamandis House. Aucune réservation ni aucun paiement par carte n’est finalisé ici.",
    aiCta: "Trouver votre chambre avec l’IA",
    bookingEyebrow: "Réservation en ligne",
    bookingTitle: "Prêt à réserver une catégorie de chambre ?",
    bookingText:
      "Utilisez notre moteur Beds24 pour choisir une catégorie disponible, saisir les informations de votre carte et finaliser votre réservation en ligne.",
    bookingCta: "Réserver",
    bookingHref: "/fr/tarifs-des-hotels-a-chios/",
  },
  de: {
    aiEyebrow: "AI Room Finder",
    aiTitle: "Finden Sie das konkrete Zimmer, das zu Ihnen passt",
    aiText:
      "Geben Sie Ihre Reisedaten und die Gästezahl an. Der AI Room Finder prüft, welche konkreten Zimmer zu Ihnen passen könnten, zeigt die Optionen und ermöglicht eine Verfügbarkeitsanfrage an Voulamandis House. Hier wird keine Buchung oder Kartenzahlung abgeschlossen.",
    aiCta: "Zimmer mit AI finden",
    bookingEyebrow: "Online-Buchung",
    bookingTitle: "Möchten Sie eine Zimmerkategorie direkt buchen?",
    bookingText:
      "Nutzen Sie unsere Beds24-Buchungsmaschine, wählen Sie eine verfügbare Zimmerkategorie, geben Sie Ihre Kartendaten ein und schließen Sie die Buchung online ab.",
    bookingCta: "Jetzt buchen",
    bookingHref: "/de/hotelpreise-auf-der-insel-chios/",
  },
  it: {
    aiEyebrow: "AI Room Finder",
    aiTitle: "Trova la camera specifica più adatta a te",
    aiText:
      "Indica le date e il numero di ospiti. L’AI Room Finder verifica quali camere specifiche potrebbero essere adatte, mostra le opzioni e ti permette di inviare una richiesta di disponibilità a Voulamandis House. Qui non viene completata alcuna prenotazione né alcun pagamento con carta.",
    aiCta: "Trova la tua camera con l’AI",
    bookingEyebrow: "Prenotazione online",
    bookingTitle: "Vuoi prenotare subito una categoria di camera?",
    bookingText:
      "Usa il motore Beds24 per scegliere una categoria disponibile, inserire i dati della carta e completare la prenotazione online.",
    bookingCta: "Prenota ora",
    bookingHref: "/it/prezzi-hotel-chios/",
  },
  es: {
    aiEyebrow: "AI Room Finder",
    aiTitle: "Encuentra la habitación concreta que mejor encaja contigo",
    aiText:
      "Indica las fechas y el número de huéspedes. AI Room Finder comprueba qué habitaciones concretas pueden encajar mejor, muestra las opciones y te permite enviar una consulta de disponibilidad a Voulamandis House. Aquí no se completa ninguna reserva ni ningún pago con tarjeta.",
    aiCta: "Encuentra tu habitación con IA",
    bookingEyebrow: "Reserva online",
    bookingTitle: "¿Quieres reservar ahora una categoría de habitación?",
    bookingText:
      "Usa nuestro motor Beds24 para elegir una categoría disponible, introducir los datos de tu tarjeta y completar la reserva online.",
    bookingCta: "Reservar ahora",
    bookingHref: "/es/los-mejores-precios-de-hotel-en-la-isla-chios/",
  },
  tr: {
    aiEyebrow: "AI Room Finder",
    aiTitle: "Size uygun belirli odayı bulun",
    aiText:
      "Tarihlerinizi ve misafir sayısını belirtin. AI Room Finder size uygun olabilecek belirli odaları kontrol eder, seçenekleri gösterir ve Voulamandis House’a müsaitlik talebi göndermenizi sağlar. Burada rezervasyon veya kartla ödeme tamamlanmaz.",
    aiCta: "AI ile odanızı bulun",
    bookingEyebrow: "Online rezervasyon",
    bookingTitle: "Bir oda kategorisini hemen rezerve etmek ister misiniz?",
    bookingText:
      "Beds24 rezervasyon motorumuzu kullanarak müsait bir oda kategorisi seçin, kart bilgilerinizi girin ve rezervasyonunuzu online tamamlayın.",
    bookingCta: "Şimdi rezervasyon yap",
    bookingHref: "/tr/sakiz-adasi-rezervasyon/",
  },
};

export function RoomWizardTailwind({ language = "en" }: RoomWizardTailwindProps) {
  const copy = copyByLanguage[language] ?? copyByLanguage.en;
  const aiHref = roomFinderHrefForLanguage(language);

  return (
    <div
      id="room-wizard-app"
      className="mx-auto grid max-w-5xl gap-4 rounded-[30px] border border-amber-900/10 bg-white p-4 shadow-[0_24px_65px_rgba(47,38,31,0.10)] sm:p-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-6"
    >
      <section className="rounded-[24px] bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,.16),transparent_18rem),linear-gradient(135deg,#fffaf0,#fff)] p-5 ring-1 ring-amber-900/10 sm:p-7">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-900">
          {copy.aiEyebrow}
        </span>
        <h3 className="mt-4 text-balance text-2xl font-black tracking-[-0.035em] text-[#2f261f] sm:text-3xl">
          {copy.aiTitle}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#574b3f] sm:text-[15px]">
          {copy.aiText}
        </p>
        <a
          href={aiHref}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#2f261f] px-5 text-center text-xs font-black uppercase tracking-[0.1em] !text-white shadow-lg shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-amber-800 sm:w-auto"
        >
          {copy.aiCta} <span className="ml-2" aria-hidden="true">→</span>
        </a>
      </section>

      <section className="flex flex-col justify-center rounded-[24px] border border-stone-200 bg-[#fbf8f3] p-5 sm:p-7">
        <span className="inline-flex w-fit rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-stone-600">
          {copy.bookingEyebrow}
        </span>
        <h3 className="mt-4 text-xl font-black tracking-[-0.025em] text-[#2f261f]">
          {copy.bookingTitle}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#665b50]">
          {copy.bookingText}
        </p>
        <a
          href={copy.bookingHref}
          data-booking-cta="true"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-amber-900/20 bg-white px-5 text-center text-xs font-black uppercase tracking-[0.1em] text-amber-900 transition hover:bg-amber-50"
        >
          {copy.bookingCta}
        </a>
      </section>
    </div>
  );
}
