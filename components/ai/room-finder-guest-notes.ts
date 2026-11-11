import type { ChildrenInfo } from "@/lib/ai-assistant/children";
import type { SmallTalk } from "@/lib/ai-assistant/small-talk";
import type { RoomFinderLanguage } from "./room-finder-copy";

/**
 * Ref 14 (children) and ref 16 (thanks / greetings / goodbye) texts. The
 * children rule comes from the verified children-extra-beds knowledge.
 */

type Copy = {
  childrenLabel: string;
  years: string;
  infant: string;
  childrenNoted: (summary: string) => string;
  childrenNotedPlain: string;
  childrenRule: string;
  cot: string;
  extraBed: string;
  small: Record<SmallTalk, string>;
};

const COPY: Record<RoomFinderLanguage, Copy> = {
  el: {
    childrenLabel: "Παιδιά",
    years: "ετών",
    infant: "βρέφος",
    childrenNoted: summary => `Σημείωσα: ${summary}. Θα το δει η reception μαζί με το αίτημά σας.`,
    childrenNotedPlain: "Σημείωσα ότι ταξιδεύετε με παιδιά. Θα το δει η reception μαζί με το αίτημά σας.",
    childrenRule: "Τα παιδιά είναι ευπρόσδεκτα σε όλες τις ηλικίες· όσα χρειάζονται κρεβάτι μετρούν στα άτομα του δωματίου.",
    cot: "Για μωρό διατίθεται δωρεάν βρεφική κούνια κατόπιν αιτήματος, και το μωρό στην κούνια δεν μετρά στη χωρητικότητα.",
    extraBed: "Αν χρειάζεστε επιπλέον κρεβάτι, η reception θα το επιβεβαιώσει μαζί σας.",
    small: {
      thanks: "Παρακαλώ, χαρά μου! 😊 Αν χρειαστείτε κάτι ακόμα, είμαι εδώ.",
      greeting: "Γεια σας! 😊",
      goodbye: "Καλή συνέχεια! 😊 Όποτε θέλετε, είμαι εδώ για να βρούμε δωμάτιο στο Voulamandis House.",
    },
  },
  en: {
    childrenLabel: "Children",
    years: "years",
    infant: "infant",
    childrenNoted: summary => `Noted: ${summary}. Reception will see it with your request.`,
    childrenNotedPlain: "Noted that you’re travelling with children. Reception will see it with your request.",
    childrenRule: "Children of all ages are welcome; children who need a bed count towards the room’s guests.",
    cot: "For a baby, a free cot is available on request, and a baby in the cot does not count towards capacity.",
    extraBed: "If you need an extra bed, reception will confirm it with you.",
    small: {
      thanks: "You’re welcome, my pleasure! 😊 If you need anything else, I’m here.",
      greeting: "Hello! 😊",
      goodbye: "Have a lovely day! 😊 Whenever you like, I’m here to find you a room at Voulamandis House.",
    },
  },
  de: {
    childrenLabel: "Kinder",
    years: "Jahre",
    infant: "Baby",
    childrenNoted: summary => `Vermerkt: ${summary}. Die Rezeption sieht das mit Ihrer Anfrage.`,
    childrenNotedPlain: "Vermerkt, dass Sie mit Kindern reisen. Die Rezeption sieht das mit Ihrer Anfrage.",
    childrenRule: "Kinder jeden Alters sind willkommen; Kinder mit eigenem Bett zählen zur Zimmerbelegung.",
    cot: "Für ein Baby gibt es auf Anfrage kostenlos ein Babybett; ein Baby im Babybett zählt nicht zur Belegung.",
    extraBed: "Wenn Sie ein Zustellbett brauchen, bestätigt die Rezeption das mit Ihnen.",
    small: {
      thanks: "Sehr gern! 😊 Wenn Sie noch etwas brauchen, bin ich da.",
      greeting: "Hallo! 😊",
      goodbye: "Einen schönen Tag noch! 😊 Ich bin jederzeit da, um ein Zimmer im Voulamandis House zu finden.",
    },
  },
  fr: {
    childrenLabel: "Enfants",
    years: "ans",
    infant: "bébé",
    childrenNoted: summary => `C’est noté : ${summary}. La réception le verra avec votre demande.`,
    childrenNotedPlain: "C’est noté, vous voyagez avec des enfants. La réception le verra avec votre demande.",
    childrenRule: "Les enfants de tout âge sont bienvenus ; ceux qui ont besoin d’un lit comptent dans la capacité.",
    cot: "Pour un bébé, un lit bébé gratuit est disponible sur demande ; le bébé ne compte pas dans la capacité.",
    extraBed: "Si vous avez besoin d’un lit supplémentaire, la réception le confirmera avec vous.",
    small: {
      thanks: "Avec plaisir ! 😊 Si vous avez besoin d’autre chose, je suis là.",
      greeting: "Bonjour ! 😊",
      goodbye: "Bonne journée ! 😊 Je suis là quand vous voulez pour trouver une chambre à Voulamandis House.",
    },
  },
  it: {
    childrenLabel: "Bambini",
    years: "anni",
    infant: "neonato",
    childrenNoted: summary => `Annotato: ${summary}. La reception lo vedrà con la vostra richiesta.`,
    childrenNotedPlain: "Annotato che viaggiate con bambini. La reception lo vedrà con la vostra richiesta.",
    childrenRule: "I bambini di tutte le età sono benvenuti; quelli che necessitano di un letto contano nella capienza.",
    cot: "Per un neonato è disponibile gratuitamente una culla su richiesta; il neonato nella culla non conta nella capienza.",
    extraBed: "Se vi serve un letto extra, la reception lo confermerà con voi.",
    small: {
      thanks: "Prego, è un piacere! 😊 Se vi serve altro, sono qui.",
      greeting: "Salve! 😊",
      goodbye: "Buona giornata! 😊 Quando volete, sono qui per trovare una camera a Voulamandis House.",
    },
  },
  es: {
    childrenLabel: "Niños",
    years: "años",
    infant: "bebé",
    childrenNoted: summary => `Anotado: ${summary}. Recepción lo verá con su solicitud.`,
    childrenNotedPlain: "Anotado que viajan con niños. Recepción lo verá con su solicitud.",
    childrenRule: "Los niños de todas las edades son bienvenidos; los que necesitan cama cuentan en la capacidad.",
    cot: "Para un bebé hay una cuna gratuita bajo petición, y el bebé en la cuna no cuenta en la capacidad.",
    extraBed: "Si necesitan una cama extra, recepción la confirmará con ustedes.",
    small: {
      thanks: "¡De nada, es un placer! 😊 Si necesitan algo más, aquí estoy.",
      greeting: "¡Hola! 😊",
      goodbye: "¡Que tengan un buen día! 😊 Cuando quieran, estoy aquí para encontrarles habitación en Voulamandis House.",
    },
  },
  tr: {
    childrenLabel: "Çocuklar",
    years: "yaş",
    infant: "bebek",
    childrenNoted: summary => `Not ettim: ${summary}. Resepsiyon bunu talebinizle birlikte görecek.`,
    childrenNotedPlain: "Çocuklarla seyahat ettiğinizi not ettim. Resepsiyon bunu talebinizle birlikte görecek.",
    childrenRule: "Her yaştan çocuk kabul edilir; yatak gereken çocuklar oda kapasitesine sayılır.",
    cot: "Bebek için talep üzerine ücretsiz bebek yatağı vardır; bebek yatağındaki bebek kapasiteye sayılmaz.",
    extraBed: "İlave yatak gerekirse resepsiyon sizinle teyit edecektir.",
    small: {
      thanks: "Rica ederim! 😊 Başka bir şeye ihtiyacınız olursa buradayım.",
      greeting: "Merhaba! 😊",
      goodbye: "İyi günler! 😊 Voulamandis House’ta oda bulmak için her zaman buradayım.",
    },
  },
};

function copyFor(language: RoomFinderLanguage) {
  return COPY[language] || COPY.en;
}

/** "2 (4, 6 ετών)" style summary of the stated children. */
export function childrenSummary(language: RoomFinderLanguage, info: ChildrenInfo) {
  const copy = copyFor(language);
  const ages = info.ages.map(age => (age === 0 ? copy.infant : String(age)));
  const agesText = ages.length
    ? ` (${ages.join(", ")}${info.ages.some(age => age > 0) ? ` ${copy.years}` : ""})`
    : "";
  const count = info.count ?? (info.ages.length || null);
  return count ? `${count}${agesText}` : agesText.replace(/^ \(|\)$/g, "");
}

export function childrenLabel(language: RoomFinderLanguage) {
  return copyFor(language).childrenLabel;
}

/** The guest-facing confirmation for children. */
export function childrenMessage(language: RoomFinderLanguage, info: ChildrenInfo) {
  const copy = copyFor(language);
  const summary = childrenSummary(language, info);
  const count = info.count ?? (info.ages.length || null);
  const ages = info.ages.map(age => (age === 0 ? copy.infant : String(age)));
  const agesText = ages.length
    ? ` (${ages.join(", ")}${info.ages.some(age => age > 0) ? ` ${copy.years}` : ""})`
    : "";
  // "2 παιδιά (4, 6 ετών)", "2 children (4, 6 years)".
  const spoken = count ? `${count} ${copy.childrenLabel.toLowerCase()}${agesText}` : "";
  return [
    spoken ? copy.childrenNoted(spoken) : summary ? copy.childrenNoted(summary) : copy.childrenNotedPlain,
    copy.childrenRule,
    info.infant ? copy.cot : "",
    copy.extraBed,
  ].filter(Boolean).join(" ");
}

export function smallTalkMessage(language: RoomFinderLanguage, kind: SmallTalk) {
  return copyFor(language).small[kind];
}
