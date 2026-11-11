import type { RoomFinderLanguage } from "./room-finder-copy";

/**
 * Ref 6: the Room Finder never sends the same question twice in a row.
 * When the next assistant message would repeat the previous one, it is
 * replaced by a different, more helpful wording for that question; the third
 * time the guest also gets the call/WhatsApp buttons.
 */

export type PromptType = "checkin" | "checkout" | "rooms" | "guests" | "other";

export type RepeatInfo = {
  /** The message as the flow wanted to send it, used to spot repeats. */
  promptKey: string;
  /** How many times in a row this same message has been asked again. */
  repeat: number;
};

type HelpCopy = Record<Exclude<PromptType, "other">, string> & {
  other: string;
  contact: string;
  /** Short, patient reminder used between the longer rephrasings. */
  later: string;
};

const HELP: Record<RoomFinderLanguage, HelpCopy> = {
  el: {
    checkin: "Για να ελέγξω διαθεσιμότητα χρειάζομαι την ημερομηνία άφιξης, π.χ. «15/6» ή «15 Ιουνίου». Αν δεν έχετε αποφασίσει ημερομηνίες, γράψτε «δεν ξέρω ακόμα» και θα σας δείξω τα δωμάτια.",
    checkout: "Για να ολοκληρώσω την αναζήτηση χρειάζομαι και την αναχώρηση: γράψτε την ημερομηνία, π.χ. «18/6», ή πόσες νύχτες θα μείνετε, π.χ. «3 νύχτες».",
    rooms: "Πατήστε έναν αριθμό παρακάτω (1–3) ή γράψτε πόσα δωμάτια χρειάζεστε, π.χ. «1».",
    guests: "Πατήστε έναν αριθμό παρακάτω (1–5) ή γράψτε πόσα άτομα θα μείνουν, π.χ. «2».",
    other: "Ίσως δεν κατάλαβα σωστά τι χρειάζεστε. Γράψτε μου με άλλα λόγια ή ρωτήστε τη reception.",
    contact: "Αν προτιμάτε, η reception σας εξυπηρετεί αμέσως στο τηλέφωνο ή στο WhatsApp.",
    later: "Δεν βιάζομαι 😊 Όποτε είστε έτοιμοι, γράψτε μου τα στοιχεία που λείπουν. Μέχρι τότε, ρωτήστε με ό,τι θέλετε για τα δωμάτια ή το Voulamandis House.",
  },
  en: {
    checkin: "To check availability I need your arrival date, e.g. “15/6” or “15 June”. If you haven’t decided on dates, write “don’t know yet” and I’ll show you the rooms.",
    checkout: "To finish the search I also need your departure: write the date, e.g. “18/6”, or how many nights you’ll stay, e.g. “3 nights”.",
    rooms: "Tap a number below (1–3) or write how many rooms you need, e.g. “1”.",
    guests: "Tap a number below (1–5) or write how many guests will stay, e.g. “2”.",
    other: "I may not have understood what you need. Try telling me in other words, or ask our reception.",
    contact: "If you prefer, our reception can help you right away by phone or WhatsApp.",
    later: "No rush 😊 Whenever you’re ready, tell me the missing detail. Meanwhile, ask me anything about the rooms or Voulamandis House.",
  },
  de: {
    checkin: "Für die Verfügbarkeit brauche ich Ihr Anreisedatum, z. B. „15/6“ oder „15. Juni“. Wenn Sie noch keine Daten haben, schreiben Sie „weiß noch nicht“ und ich zeige Ihnen die Zimmer.",
    checkout: "Für die Suche brauche ich noch Ihre Abreise: Schreiben Sie das Datum, z. B. „18/6“, oder wie viele Nächte Sie bleiben, z. B. „3 Nächte“.",
    rooms: "Tippen Sie unten auf eine Zahl (1–3) oder schreiben Sie, wie viele Zimmer Sie brauchen, z. B. „1“.",
    guests: "Tippen Sie unten auf eine Zahl (1–5) oder schreiben Sie, wie viele Gäste übernachten, z. B. „2“.",
    other: "Vielleicht habe ich Sie nicht richtig verstanden. Formulieren Sie es gern anders oder fragen Sie unsere Rezeption.",
    contact: "Wenn Sie möchten, hilft Ihnen unsere Rezeption sofort telefonisch oder per WhatsApp.",
    later: "Kein Problem 😊 Sobald Sie bereit sind, nennen Sie mir die fehlende Angabe. Bis dahin beantworte ich gern Fragen zu den Zimmern oder zum Voulamandis House.",
  },
  fr: {
    checkin: "Pour vérifier les disponibilités, j’ai besoin de votre date d’arrivée, par ex. « 15/6 » ou « 15 juin ». Si vous n’avez pas encore de dates, écrivez « je ne sais pas encore » et je vous montrerai les chambres.",
    checkout: "Pour terminer la recherche, il me faut aussi votre départ : écrivez la date, par ex. « 18/6 », ou le nombre de nuits, par ex. « 3 nuits ».",
    rooms: "Touchez un chiffre ci-dessous (1–3) ou écrivez le nombre de chambres, par ex. « 1 ».",
    guests: "Touchez un chiffre ci-dessous (1–5) ou écrivez le nombre de personnes, par ex. « 2 ».",
    other: "Je n’ai peut-être pas bien compris votre demande. Reformulez-la ou demandez à notre réception.",
    contact: "Si vous préférez, notre réception vous aide tout de suite par téléphone ou WhatsApp.",
    later: "Prenez votre temps 😊 Quand vous serez prêt, indiquez-moi l’information manquante. En attendant, posez-moi vos questions sur les chambres ou Voulamandis House.",
  },
  it: {
    checkin: "Per verificare la disponibilità mi serve la data di arrivo, ad es. «15/6» o «15 giugno». Se non avete ancora deciso le date, scrivete «non so ancora» e vi mostrerò le camere.",
    checkout: "Per completare la ricerca mi serve anche la partenza: scrivete la data, ad es. «18/6», o quante notti, ad es. «3 notti».",
    rooms: "Toccate un numero qui sotto (1–3) o scrivete quante camere vi servono, ad es. «1».",
    guests: "Toccate un numero qui sotto (1–5) o scrivete quante persone soggiorneranno, ad es. «2».",
    other: "Forse non ho capito bene di cosa avete bisogno. Riprovate con altre parole o chiedete alla reception.",
    contact: "Se preferite, la reception vi aiuta subito per telefono o WhatsApp.",
    later: "Nessuna fretta 😊 Quando siete pronti, scrivetemi il dato mancante. Nel frattempo chiedetemi pure qualsiasi cosa sulle camere o su Voulamandis House.",
  },
  es: {
    checkin: "Para comprobar la disponibilidad necesito la fecha de llegada, p. ej. «15/6» o «15 de junio». Si aún no tienen fechas, escriban «aún no lo sé» y les mostraré las habitaciones.",
    checkout: "Para terminar la búsqueda necesito también la salida: escriban la fecha, p. ej. «18/6», o cuántas noches, p. ej. «3 noches».",
    rooms: "Toquen un número abajo (1–3) o escriban cuántas habitaciones necesitan, p. ej. «1».",
    guests: "Toquen un número abajo (1–5) o escriban cuántas personas se alojarán, p. ej. «2».",
    other: "Puede que no haya entendido bien lo que necesitan. Díganmelo con otras palabras o pregunten a recepción.",
    contact: "Si lo prefieren, nuestra recepción les ayuda enseguida por teléfono o WhatsApp.",
    later: "Sin prisa 😊 Cuando estén listos, díganme el dato que falta. Mientras tanto, pregúntenme lo que quieran sobre las habitaciones o Voulamandis House.",
  },
  tr: {
    checkin: "Müsaitliği kontrol etmek için varış tarihinize ihtiyacım var, ör. “15/6” veya “15 Haziran”. Tarihlere henüz karar vermediyseniz “henüz bilmiyorum” yazın, size odaları göstereyim.",
    checkout: "Aramayı tamamlamak için çıkış tarihine de ihtiyacım var: tarihi yazın, ör. “18/6”, ya da kaç gece kalacağınızı, ör. “3 gece”.",
    rooms: "Aşağıdan bir sayıya dokunun (1–3) veya kaç oda istediğinizi yazın, ör. “1”.",
    guests: "Aşağıdan bir sayıya dokunun (1–5) veya kaç kişi kalacağını yazın, ör. “2”.",
    other: "Ne istediğinizi tam anlayamamış olabilirim. Başka kelimelerle yazın veya resepsiyonumuza sorun.",
    contact: "Dilerseniz resepsiyonumuz size telefonla veya WhatsApp üzerinden hemen yardımcı olur.",
    later: "Acele yok 😊 Hazır olduğunuzda eksik bilgiyi yazın. Bu arada odalar veya Voulamandis House hakkında istediğinizi sorabilirsiniz.",
  },
};

type PreviousMessage = {
  role: "assistant" | "user";
  content: string;
  promptKey?: string;
  repeat?: number;
};

/** The last assistant message, as the flow originally wanted to send it. */
function lastAssistantPrompt(messages: readonly PreviousMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "assistant") {
      return { key: (message.promptKey || message.content).trim(), repeat: message.repeat || 0 };
    }
  }
  return null;
}

/**
 * The message to send instead of `content` when it would repeat the previous
 * assistant message (a welcome that ends with the same question counts), or
 * null when it is not a repeat.
 */
export function avoidRepeatedQuestion(
  messages: readonly PreviousMessage[],
  content: string,
  promptType: PromptType,
  language: RoomFinderLanguage,
): { content: string; withContact: boolean; info: RepeatInfo } | null {
  const next = content.trim();
  const previous = lastAssistantPrompt(messages);
  if (!next || !previous || !(previous.key === next || previous.key.endsWith(next))) return null;

  const copy = HELP[language] || HELP.en;
  const repeat = previous.key === next ? previous.repeat + 1 : 1;
  // 1: rephrase with an example · 2: rephrase + call/WhatsApp · then a short
  // reminder and the full help alternate, so no two in a row are the same.
  const withContact = repeat === 2 || (repeat > 2 && repeat % 2 === 0);
  const message = repeat > 2 && repeat % 2 === 1
    ? copy.later
    : withContact
      ? `${copy[promptType]}\n\n${copy.contact}`
      : copy[promptType];
  return { content: message, withContact, info: { promptKey: next, repeat } };
}
