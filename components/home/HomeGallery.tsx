import Image from "next/image";

export type HomeGalleryLocale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type GalleryCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  swipeHint: string;
};

const galleryCopy: Record<HomeGalleryLocale, GalleryCopy> = {
  en: {
    kicker: "Voulamandis House gallery",
    title: "Life in the garden",
    subtitle: "Stone courtyards, citrus trees and quiet corners in Kampos, Chios.",
    swipeHint: "Swipe to explore",
  },
  el: {
    kicker: "Φωτογραφίες από το Voulamandis House",
    title: "Η ζωή στον κήπο",
    subtitle: "Πέτρινες αυλές, εσπεριδοειδή και ήσυχες γωνιές στον Κάμπο Χίου.",
    swipeHint: "Σύρετε για να δείτε",
  },
  fr: {
    kicker: "Galerie du Voulamandis House",
    title: "La vie dans le jardin",
    subtitle: "Cours en pierre, agrumes et coins paisibles à Kampos, Chios.",
    swipeHint: "Faites glisser",
  },
  de: {
    kicker: "Galerie des Voulamandis House",
    title: "Leben im Garten",
    subtitle: "Steinhöfe, Zitrusbäume und ruhige Ecken in Kampos auf Chios.",
    swipeHint: "Zum Entdecken wischen",
  },
  it: {
    kicker: "Galleria del Voulamandis House",
    title: "La vita in giardino",
    subtitle: "Cortili in pietra, agrumi e angoli tranquilli nel Kampos di Chios.",
    swipeHint: "Scorri per esplorare",
  },
  es: {
    kicker: "Galería de Voulamandis House",
    title: "La vida en el jardín",
    subtitle: "Patios de piedra, cítricos y rincones tranquilos en Kampos, Quíos.",
    swipeHint: "Desliza para explorar",
  },
  tr: {
    kicker: "Voulamandis House galerisi",
    title: "Bahçede yaşam",
    subtitle: "Sakız Adası Kampos'ta taş avlular, narenciye ağaçları ve huzurlu köşeler.",
    swipeHint: "Keşfetmek için kaydırın",
  },
};

const galleryImages = [
  {
    src: "/images/homepage-gallery/voulamandis-house-garden.webp",
    alt: {
      en: "Shaded garden dining area beneath trees and vines at Voulamandis House in Chios",
      el: "Σκιερός κήπος με τραπέζια κάτω από δέντρα και κληματαριές στο Voulamandis House στη Χίο",
      fr: "Espace repas ombragé sous les arbres et les vignes dans le jardin du Voulamandis House à Chios",
      de: "Schattiger Garten mit Tischen unter Bäumen und Weinreben im Voulamandis House auf Chios",
      it: "Giardino ombreggiato con tavoli sotto alberi e viti al Voulamandis House di Chios",
      es: "Jardín sombreado con mesas bajo árboles y parras en Voulamandis House, Quíos",
      tr: "Sakız Adası Voulamandis House'ta ağaçlar ve asmalar altında gölgeli bahçe yemek alanı",
    },
  },
  {
    src: "/images/homepage-gallery/voulamandis-house-outdoor-lounge.webp",
    alt: {
      en: "Outdoor courtyard lounge with sofas at Voulamandis House in Kampos, Chios",
      el: "Υπαίθριο καθιστικό με καναπέδες στην αυλή του Voulamandis House στον Κάμπο Χίου",
      fr: "Salon extérieur avec canapés dans la cour du Voulamandis House à Kampos, Chios",
      de: "Loungebereich mit Sofas im Innenhof des Voulamandis House in Kampos auf Chios",
      it: "Salotto esterno con divani nel cortile del Voulamandis House nel Kampos di Chios",
      es: "Zona de descanso con sofás en el patio de Voulamandis House, Kampos de Quíos",
      tr: "Sakız Adası Kampos'taki Voulamandis House avlusunda kanepeli açık hava dinlenme alanı",
    },
  },
  {
    src: "/images/homepage-gallery/voulamandis-house-stone-terrace.webp",
    alt: {
      en: "Stone terrace with outdoor seating at Voulamandis House in Kampos, Chios",
      el: "Πέτρινη βεράντα με υπαίθριο καθιστικό στο Voulamandis House στον Κάμπο Χίου",
      fr: "Terrasse en pierre avec salon extérieur au Voulamandis House à Kampos, Chios",
      de: "Steinterrasse mit Sitzbereich im Freien im Voulamandis House in Kampos auf Chios",
      it: "Terrazza in pietra con salotto esterno al Voulamandis House nel Kampos di Chios",
      es: "Terraza de piedra con zona de descanso exterior en Voulamandis House, Kampos de Quíos",
      tr: "Sakız Adası Kampos'taki Voulamandis House'ta açık hava oturma alanına sahip taş teras",
    },
  },
  {
    src: "/images/homepage-gallery/voulamandis-house-shaded-garden.webp",
    alt: {
      en: "Shaded garden courtyard with tables at Voulamandis House in Kampos, Chios",
      el: "Σκιερή αυλή με τραπέζια μέσα στον καταπράσινο κήπο του Voulamandis House στον Κάμπο Χίου",
      fr: "Cour ombragée avec tables dans le jardin verdoyant du Voulamandis House à Kampos, Chios",
      de: "Schattiger Innenhof mit Tischen im grünen Garten des Voulamandis House in Kampos auf Chios",
      it: "Cortile ombreggiato con tavoli nel verde giardino del Voulamandis House nel Kampos di Chios",
      es: "Patio sombreado con mesas en el frondoso jardín de Voulamandis House, Kampos de Quíos",
      tr: "Sakız Adası Kampos'taki Voulamandis House'un yemyeşil bahçesinde masalı gölgeli avlu",
    },
  },
  {
    src: "/images/homepage-gallery/chios-guesthouse-courtyard-lounge.webp",
    alt: {
      en: "Outdoor lounge with stone walls and flowering oleanders at Voulamandis House in Kampos, Chios",
      el: "Υπαίθριο καθιστικό με πέτρινους τοίχους και ανθισμένες πικροδάφνες στο Voulamandis House στον Κάμπο Χίου",
      fr: "Salon extérieur avec murs en pierre et lauriers-roses fleuris au Voulamandis House à Kampos, Chios",
      de: "Sitzbereich im Freien mit Steinmauern und blühendem Oleander im Voulamandis House in Kampos auf Chios",
      it: "Salotto esterno con muri in pietra e oleandri in fiore al Voulamandis House nel Kampos di Chios",
      es: "Zona de descanso exterior con muros de piedra y adelfas en flor en Voulamandis House, Kampos de Quíos",
      tr: "Sakız Adası Kampos'taki Voulamandis House'ta taş duvarlı ve çiçekli zakkumlarla çevrili açık hava oturma alanı",
    },
  },
  {
    src: "/images/homepage-gallery/kampos-chios-courtyard.webp",
    alt: {
      en: "Shaded courtyard seating beneath stone arches at Voulamandis House in Kampos, Chios",
      el: "Σκιερό καθιστικό κάτω από πέτρινες καμάρες στην αυλή του Voulamandis House στον Κάμπο Χίου",
      fr: "Coin salon ombragé sous des arches en pierre dans la cour du Voulamandis House à Kampos, Chios",
      de: "Schattiger Sitzbereich unter Steinbögen im Innenhof des Voulamandis House in Kampos auf Chios",
      it: "Zona relax ombreggiata sotto archi in pietra nel cortile del Voulamandis House nel Kampos di Chios",
      es: "Zona de descanso sombreada bajo arcos de piedra en el patio de Voulamandis House, Kampos de Quíos",
      tr: "Sakız Adası Kampos'taki Voulamandis House avlusunda taş kemerlerin altında gölgeli oturma alanı",
    },
  },
  {
    src: "/images/homepage-gallery/voulamandis-house-courtyard-seating.webp",
    alt: {
      en: "Courtyard sofa and table in the garden of Voulamandis House in Chios",
      el: "Καναπές και τραπέζι στην περιποιημένη αυλή του Voulamandis House στη Χίο",
      fr: "Canapé et table dans la cour paysagée du Voulamandis House à Chios",
      de: "Sofa und Tisch im gepflegten Innenhof des Voulamandis House auf Chios",
      it: "Divano e tavolo nel cortile curato del Voulamandis House a Chios",
      es: "Sofá y mesa en el cuidado patio de Voulamandis House en Quíos",
      tr: "Sakız Adası Voulamandis House'un bakımlı avlusunda kanepe ve masa",
    },
  },
  {
    src: "/images/homepage-gallery/voulamandis-house-balcony.webp",
    alt: {
      en: "Bougainvillea-covered balcony overlooking Kampos at Voulamandis House, Chios",
      el: "Μπαλκόνι με ανθισμένες βουκαμβίλιες και θέα στον Κάμπο στο Voulamandis House στη Χίο",
      fr: "Balcon couvert de bougainvilliers avec vue sur Kampos au Voulamandis House à Chios",
      de: "Mit Bougainvillea bewachsener Balkon mit Blick auf Kampos im Voulamandis House auf Chios",
      it: "Balcone fiorito di bouganville con vista sul Kampos al Voulamandis House di Chios",
      es: "Balcón cubierto de buganvillas con vistas a Kampos en Voulamandis House, Quíos",
      tr: "Sakız Adası Voulamandis House'ta begonvillerle çevrili ve Kampos manzaralı balkon",
    },
  },
  {
    src: "/images/homepage-gallery/kampos-chios-view.webp",
    alt: {
      en: "View over the citrus orchards and historic mansions of Kampos, Chios",
      el: "Θέα στους εσπεριδοειδώνες και στα ιστορικά αρχοντικά του Κάμπου Χίου",
      fr: "Vue sur les vergers d'agrumes et les demeures historiques de Kampos à Chios",
      de: "Blick auf die Zitrushaine und historischen Herrenhäuser von Kampos auf Chios",
      it: "Vista sugli agrumeti e sulle dimore storiche del Kampos di Chios",
      es: "Vista de los huertos de cítricos y las mansiones históricas de Kampos en Quíos",
      tr: "Sakız Adası Kampos'un narenciye bahçeleri ve tarihi konaklarının manzarası",
    },
  },
] as const;

const desktopLayout = [
  "sm:col-span-2 sm:aspect-[16/9] lg:col-span-6 lg:row-span-2 lg:aspect-auto",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
] as const;

export function HomeGallery({ locale }: { locale: HomeGalleryLocale }) {
  const copy = galleryCopy[locale];

  return (
    <section
      className="order-2 min-w-0 py-2 lg:order-3 lg:col-span-2 lg:pt-6"
      aria-labelledby="home-gallery-title"
      data-gallery="homepage"
    >
      <header className="mb-5 md:mb-6">
        <div className="max-w-3xl">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.20em] text-amber-700">
            {copy.kicker}
          </p>
          <h2
            id="home-gallery-title"
            className="text-balance font-serif text-[2rem] font-bold leading-tight text-stone-900 md:text-[2.625rem]"
          >
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600 md:text-base md:leading-7">
            {copy.subtitle}
          </p>
        </div>
        <span className="mt-3 inline-flex text-xs font-bold uppercase tracking-[0.08em] text-amber-800 sm:hidden">
          {copy.swipeHint} <span className="ml-2" aria-hidden="true">→</span>
        </span>
      </header>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 pr-12 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 sm:pr-0 lg:auto-rows-[155px] lg:grid-cols-12 [&::-webkit-scrollbar]:hidden">
        {galleryImages.map((image, index) => (
          <figure
            key={image.src}
            className={`group relative aspect-[4/3] w-[78vw] max-w-[330px] shrink-0 snap-center overflow-hidden rounded-[1.35rem] bg-stone-200 sm:w-auto sm:max-w-none sm:rounded-[1.6rem] ${desktopLayout[index]}`}
          >
            <Image
              src={image.src}
              alt={image.alt[locale]}
              fill
              sizes={
                index === 0
                  ? "(max-width: 639px) 78vw, (max-width: 1023px) 100vw, 50vw"
                  : "(max-width: 639px) 78vw, (max-width: 1023px) 50vw, 25vw"
              }
              className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
              quality={72}
              loading="lazy"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
