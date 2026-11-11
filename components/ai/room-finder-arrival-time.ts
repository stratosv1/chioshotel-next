import type { RoomFinderLanguage } from "./room-finder-copy";

/**
 * Ref 12: confirming the arrival time the guest mentioned. Facts come from
 * the verified arrival-departure knowledge (check-in from 14:00, late
 * arrival with advance notice, free luggage storage).
 */

type ArrivalCopy = {
  label: string;
  noted: (time: string) => string;
  late: string;
  beforeCheckin: string;
};

const COPY: Record<RoomFinderLanguage, ArrivalCopy> = {
  el: {
    label: "Ώρα άφιξης",
    noted: time => `Σημείωσα ώρα άφιξης περίπου ${time}. Θα τη δει η reception μαζί με το αίτημά σας.`,
    late: "Η άφιξη αργά το βράδυ γίνεται κανονικά με προηγούμενη ενημέρωση, οπότε είστε εντάξει.",
    beforeCheckin: "Το check-in είναι από τις 14:00. Αν φτάσετε νωρίτερα, early check-in γίνεται μόνο αν το δωμάτιο είναι έτοιμο, και οι αποσκευές σας φυλάσσονται δωρεάν.",
  },
  en: {
    label: "Arrival time",
    noted: time => `Noted: arrival around ${time}. Reception will see it with your request.`,
    late: "Late-evening arrival is fine with advance notice, so you’re all set.",
    beforeCheckin: "Check-in is from 14:00. If you arrive earlier, early check-in is possible only if the room is ready, and we store your luggage free of charge.",
  },
  de: {
    label: "Ankunftszeit",
    noted: time => `Vermerkt: Ankunft gegen ${time}. Die Rezeption sieht das mit Ihrer Anfrage.`,
    late: "Eine späte Ankunft am Abend ist mit vorheriger Ankündigung kein Problem.",
    beforeCheckin: "Check-in ist ab 14:00 Uhr. Bei früherer Ankunft ist ein Early Check-in nur möglich, wenn das Zimmer fertig ist; Ihr Gepäck bewahren wir kostenlos auf.",
  },
  fr: {
    label: "Heure d’arrivée",
    noted: time => `C’est noté : arrivée vers ${time}. La réception le verra avec votre demande.`,
    late: "Une arrivée tard le soir se fait sans problème en nous prévenant, c’est donc en ordre.",
    beforeCheckin: "L’arrivée se fait à partir de 14h00. Si vous arrivez plus tôt, un early check-in n’est possible que si la chambre est prête ; nous gardons vos bagages gratuitement.",
  },
  it: {
    label: "Orario di arrivo",
    noted: time => `Annotato: arrivo verso le ${time}. La reception lo vedrà con la vostra richiesta.`,
    late: "L’arrivo in tarda serata va benissimo con preavviso, quindi è tutto a posto.",
    beforeCheckin: "Il check-in è dalle 14:00. Se arrivate prima, l’early check-in è possibile solo se la camera è pronta; i bagagli si possono lasciare gratuitamente.",
  },
  es: {
    label: "Hora de llegada",
    noted: time => `Anotado: llegada hacia las ${time}. Recepción lo verá con su solicitud.`,
    late: "Llegar tarde por la noche no es problema avisando con antelación, así que todo bien.",
    beforeCheckin: "El check-in es a partir de las 14:00. Si llegan antes, el early check-in solo es posible si la habitación está lista; guardamos el equipaje gratis.",
  },
  tr: {
    label: "Varış saati",
    noted: time => `Not ettim: varış yaklaşık ${time}. Resepsiyon bunu talebinizle birlikte görecek.`,
    late: "Önceden haber verildiğinde akşam geç varış sorun değildir.",
    beforeCheckin: "Giriş 14:00’ten itibarendir. Daha erken gelirseniz erken giriş yalnızca oda hazırsa mümkündür; bavullarınızı ücretsiz saklarız.",
  },
};

export function arrivalTimeLabel(language: RoomFinderLanguage) {
  return (COPY[language] || COPY.en).label;
}

/** Confirmation for a stated arrival time ("HH:MM"). */
export function arrivalTimeMessage(language: RoomFinderLanguage, time: string) {
  const copy = COPY[language] || COPY.en;
  const hours = Number(time.slice(0, 2));
  const lines = [copy.noted(time)];
  if (hours >= 21) lines.push(copy.late);
  // 07:00–13:59 is before check-in; earlier hours get the early-arrival
  // question (night before) from the booking flow instead.
  else if (hours >= 7 && hours < 14) lines.push(copy.beforeCheckin);
  return lines.join(" ");
}
