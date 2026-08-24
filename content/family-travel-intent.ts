import type { FamilyTravelPageContent } from "@/content/family-travel";
import { getFamilyTravelPageByLocale } from "@/content/family-travel";
import type { LanguageCode } from "@/lib/languages";

type FamilyTravelCopy = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  apartmentHref: string;
  apartmentLabel: string;
};

const copy: Record<LanguageCode, FamilyTravelCopy> = {
  en: {
    seoTitle: "Family Holidays in Chios with Kids | Voulamandis House",
    seoDescription:
      "Plan family holidays in Chios with kids and choose family accommodation in Kambos: family apartments, practical rooms and a peaceful base at Voulamandis House.",
    heroTitle: "Family holidays in Chios with kids",
    heroSubtitle:
      "Choose family-friendly accommodation in Chios with practical rooms and family apartments in peaceful Kambos, then enjoy easy days around the island with a comfortable base to return to.",
    introText:
      "Chios works especially well for families who want an easy rhythm and a practical place to stay. Voulamandis House offers family accommodation in Kambos with rooms and family apartments for different group sizes, close to Chios Town and the airport while keeping the quieter atmosphere parents often prefer when travelling with children.",
    apartmentHref: "/chios-rooms/family-chios-apartments/",
    apartmentLabel: "See family apartments",
  },
  el: {
    seoTitle: "Οικογενειακές Διακοπές στη Χίο με Παιδιά | Voulamandis House",
    seoDescription:
      "Οργανώστε οικογενειακές διακοπές στη Χίο με παιδιά και επιλέξτε οικογενειακή διαμονή στον Κάμπο, με δωμάτια και οικογενειακά διαμερίσματα στο Voulamandis House.",
    heroTitle: "Οικογενειακές διακοπές στη Χίο με παιδιά",
    heroSubtitle:
      "Επιλέξτε κατάλυμα για οικογένεια στη Χίο με πρακτικά δωμάτια και οικογενειακά διαμερίσματα στον ήσυχο Κάμπο, ώστε να έχετε μια άνετη βάση για τις ημέρες σας στο νησί.",
    introText:
      "Η Χίος ταιριάζει ιδιαίτερα σε οικογένειες που θέλουν ήρεμο ρυθμό και πρακτική διαμονή. Το Voulamandis House προσφέρει οικογενειακή διαμονή στη Χίο με δωμάτια και οικογενειακά διαμερίσματα για διαφορετικό αριθμό ατόμων, κοντά στην πόλη και το αεροδρόμιο, αλλά μέσα στο πιο ήσυχο περιβάλλον του Κάμπου.",
    apartmentHref: "/el/domatia-xios/oikogeneiako-diamerisma/",
    apartmentLabel: "Δείτε οικογενειακά διαμερίσματα",
  },
  fr: {
    seoTitle: "Vacances en famille à Chios avec des enfants | Voulamandis House",
    seoDescription:
      "Préparez des vacances en famille à Chios et choisissez un hébergement familial à Kambos : chambres pratiques, appartements familiaux et séjour paisible.",
    heroTitle: "Vacances en famille à Chios avec des enfants",
    heroSubtitle:
      "Choisissez un hébergement familial à Chios avec des chambres pratiques et des appartements familiaux dans le calme de Kambos, pour garder une base confortable pendant votre séjour.",
    introText:
      "Chios convient particulièrement aux familles qui recherchent un rythme simple et un hébergement pratique. Voulamandis House propose des chambres et des appartements familiaux à Kambos, près de la ville de Chios et de l’aéroport, tout en conservant l’atmosphère plus calme appréciée lors d’un voyage avec des enfants.",
    apartmentHref: "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    apartmentLabel: "Voir les appartements familiaux",
  },
  de: {
    seoTitle: "Familienurlaub auf Chios mit Kindern | Voulamandis House",
    seoDescription:
      "Planen Sie Familienurlaub auf Chios und wählen Sie familienfreundliche Unterkunft in Kambos: Zimmer, Familienapartments und eine ruhige Basis.",
    heroTitle: "Familienurlaub auf Chios mit Kindern",
    heroSubtitle:
      "Wählen Sie familienfreundliche Unterkunft auf Chios mit praktischen Zimmern und Familienapartments im ruhigen Kambos und genießen Sie eine komfortable Basis für Ihre Inseltage.",
    introText:
      "Chios eignet sich besonders für Familien, die einen entspannten Rhythmus und eine praktische Unterkunft suchen. Voulamandis House bietet Zimmer und Familienapartments in Kambos, nahe Chios-Stadt und Flughafen, aber in einer ruhigeren Umgebung, die viele Eltern auf Reisen mit Kindern bevorzugen.",
    apartmentHref: "/de/zimmer-chios/familienapartments-in-chios/",
    apartmentLabel: "Familienapartments ansehen",
  },
  it: {
    seoTitle: "Vacanze in famiglia a Chios con bambini | Voulamandis House",
    seoDescription:
      "Organizza vacanze in famiglia a Chios e scegli un alloggio per famiglie a Kambos: camere pratiche, appartamenti familiari e una base tranquilla.",
    heroTitle: "Vacanze in famiglia a Chios con bambini",
    heroSubtitle:
      "Scegli un alloggio per famiglie a Chios con camere pratiche e appartamenti familiari nella tranquillità di Kambos, con una base comoda per vivere l’isola.",
    introText:
      "Chios è adatta alle famiglie che cercano ritmi semplici e un alloggio pratico. Voulamandis House offre camere e appartamenti familiari a Kambos, vicino alla città di Chios e all’aeroporto ma in un ambiente più tranquillo, particolarmente comodo quando si viaggia con bambini.",
    apartmentHref: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
    apartmentLabel: "Vedi gli appartamenti familiari",
  },
  es: {
    seoTitle: "Vacaciones en familia en Quíos con niños | Voulamandis House",
    seoDescription:
      "Organiza vacaciones en familia en Quíos y elige alojamiento familiar en Kambos: habitaciones prácticas, apartamentos familiares y una base tranquila.",
    heroTitle: "Vacaciones en familia en Quíos con niños",
    heroSubtitle:
      "Elige alojamiento para familias en Quíos con habitaciones prácticas y apartamentos familiares en el tranquilo Kambos, con una base cómoda para recorrer la isla.",
    introText:
      "Quíos funciona especialmente bien para familias que buscan un ritmo sencillo y un alojamiento práctico. Voulamandis House ofrece habitaciones y apartamentos familiares en Kambos, cerca de la ciudad de Quíos y del aeropuerto, pero en un entorno más tranquilo para viajar con niños.",
    apartmentHref: "/es/habitaciones-en-chios/apartamentos-familiares-en-chios/",
    apartmentLabel: "Ver apartamentos familiares",
  },
  tr: {
    seoTitle: "Çocuklarla Sakız Adası Aile Tatili | Voulamandis House",
    seoDescription:
      "Çocuklarla Sakız Adası aile tatilinizi planlayın ve Kambos’ta aile konaklaması seçin: kullanışlı odalar, aile daireleri ve sakin bir konaklama üssü.",
    heroTitle: "Çocuklarla Sakız Adası aile tatili",
    heroSubtitle:
      "Sakız Adası’nda aileler için uygun konaklama arıyorsanız, sakin Kambos’ta kullanışlı odalar ve aile daireleriyle ada günleriniz için rahat bir üs seçin.",
    introText:
      "Sakız Adası, sakin bir tempo ve pratik konaklama arayan aileler için uygundur. Voulamandis House, Kambos’ta farklı aile büyüklüklerine uygun odalar ve aile daireleri sunar; Sakız şehir merkezine ve havalimanına yakınken çocuklarla seyahatte tercih edilen daha sakin bir ortam sağlar.",
    apartmentHref: "/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/",
    apartmentLabel: "Aile dairelerini görün",
  },
};

export function getFamilyTravelIntentData(
  locale: LanguageCode,
): FamilyTravelPageContent {
  const base = getFamilyTravelPageByLocale(locale);
  const text = copy[locale];

  return {
    ...base,
    seo: {
      ...base.seo,
      title: text.seoTitle,
      description: text.seoDescription,
    },
    hero: {
      ...base.hero,
      title: text.heroTitle,
      subtitle: text.heroSubtitle,
      secondaryCta: {
        label: text.apartmentLabel,
        href: text.apartmentHref,
      },
    },
    intro: {
      ...base.intro,
      text: text.introText,
    },
    stay: {
      ...base.stay,
      secondaryCta: {
        label: text.apartmentLabel,
        href: text.apartmentHref,
      },
    },
  };
}
