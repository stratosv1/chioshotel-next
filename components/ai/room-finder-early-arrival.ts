import type { RoomFinderLanguage } from "./room-finder-copy";
import { formatPickedDate } from "./room-finder-date-pick";

/** Ref 13: the question for a guest who arrives in the early hours. */
const COPY: Record<RoomFinderLanguage, (arrival: string, night: string, nightIso: string, dayIso: string) => string> = {
  el: (arrival, night, nightIso, dayIso) => `Φτάνετε νωρίς το πρωί, ${arrival}. Το check-in είναι από τις 14:00, οπότε για να σας περιμένει το δωμάτιο μόλις φτάσετε, η κράτηση πρέπει να ξεκινά από το βράδυ της ${night}.\n\nΓράψτε μου ποια άφιξη θέλετε: «${nightIso}» (δωμάτιο έτοιμο με την άφιξη) ή «${dayIso}» (check-in από τις 14:00 της ίδιας μέρας).`,
  en: (arrival, night, nightIso, dayIso) => `You arrive early in the morning, ${arrival}. Check-in is from 14:00, so to have the room ready when you arrive, the booking needs to start the night of ${night}.\n\nTell me which check-in you’d like: “${nightIso}” (room ready on arrival) or “${dayIso}” (check-in from 14:00 that day).`,
  de: (arrival, night, nightIso, dayIso) => `Sie kommen früh am Morgen an, ${arrival}. Check-in ist ab 14:00 Uhr; damit das Zimmer bei Ihrer Ankunft bereit ist, muss die Buchung in der Nacht vom ${night} beginnen.\n\nWelche Anreise möchten Sie: „${nightIso}“ (Zimmer bei Ankunft bereit) oder „${dayIso}“ (Check-in ab 14:00 Uhr an diesem Tag)?`,
  fr: (arrival, night, nightIso, dayIso) => `Vous arrivez tôt le matin, ${arrival}. L’arrivée se fait à partir de 14h00 ; pour que la chambre soit prête à votre arrivée, la réservation doit commencer la nuit du ${night}.\n\nQuelle arrivée souhaitez-vous : « ${nightIso} » (chambre prête à l’arrivée) ou « ${dayIso} » (arrivée à partir de 14h00 ce jour-là) ?`,
  it: (arrival, night, nightIso, dayIso) => `Arrivate la mattina presto, ${arrival}. Il check-in è dalle 14:00, quindi per avere la camera pronta all’arrivo la prenotazione deve iniziare la notte di ${night}.\n\nQuale arrivo preferite: «${nightIso}» (camera pronta all’arrivo) o «${dayIso}» (check-in dalle 14:00 di quel giorno)?`,
  es: (arrival, night, nightIso, dayIso) => `Llegan de madrugada, ${arrival}. El check-in es a partir de las 14:00, así que para tener la habitación lista al llegar, la reserva debe empezar la noche del ${night}.\n\n¿Qué llegada prefieren: «${nightIso}» (habitación lista al llegar) o «${dayIso}» (check-in desde las 14:00 de ese día)?`,
  tr: (arrival, night, nightIso, dayIso) => `Sabah erken saatte, ${arrival} tarihinde varıyorsunuz. Giriş saati 14:00’ten itibarendir; vardığınızda odanın hazır olması için rezervasyonun ${night} gecesinden başlaması gerekir.\n\nHangi girişi istersiniz: “${nightIso}” (varışta oda hazır) veya “${dayIso}” (o gün 14:00’ten itibaren giriş)?`,
};

function dayMonth(iso: string) {
  return `${Number(iso.slice(8, 10))}/${Number(iso.slice(5, 7))}`;
}

export function earlyArrivalMessage(language: RoomFinderLanguage, arrivalIso: string, nightIso: string) {
  return (COPY[language] || COPY.en)(
    formatPickedDate(language, arrivalIso),
    formatPickedDate(language, nightIso),
    dayMonth(nightIso),
    dayMonth(arrivalIso),
  );
}
