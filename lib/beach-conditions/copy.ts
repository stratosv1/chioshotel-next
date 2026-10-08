import type { BeachRegion } from "@/content/trip-planner/beaches";
import type { MarineDirection } from "@/content/trip-planner/marine-exposure";
import type { SeaState } from "./outlook";
import type { MeltemiFit, SeaLanguage } from "./beach-meta";

type SeaCopy = {
  intlLocale: string;
  today: string;
  tomorrow: string;
  states: Record<SeaState, string>;
  directionShort: Record<MarineDirection, string>;
  directionLong: Record<MarineDirection, string>;
  regions: Record<BeachRegion, string>;
  beaufortUnit: string;
  waveUnit: string;
  wave: string;
  wind: string;
  gusts: string;
  upTo: string;
  hours: string;
  updated: (time: string) => string;
  source: string;
  disclaimer: string;
  // Hub
  hubKicker: string;
  hubTitle: string;
  hubIntro: string;
  hubAnswer: (day: string, wind: string, calmest: string) => string;
  hubCalmestTitle: (day: string) => string;
  hubAllTitle: string;
  hubMore: (count: number) => string;
  hubColumnBeach: string;
  // Evergreen wind guide
  windGuideTitle: string;
  windGuideIntro: string;
  windNorth: string;
  windSouth: string;
  windWest: string;
  shelteredLink: { label: string; href: string };
  // Beach page
  beachKicker: string;
  beachTitle: (name: string, inPhrase: string) => string;
  beachAnswer: (day: string, state: string, wave: string, wind: string) => string;
  beachOutlookTitle: string;
  beachAlternativesTitle: (day: string, isCalm: boolean) => string;
  orientationTitle: string;
  faces: string;
  shelteredFrom: string;
  exposedTo: string;
  none: string;
  meltemi: Record<MeltemiFit, string>;
  viewBeach: string;
};

const dirShortLatin: Record<MarineDirection, string> = {
  N: "N", NE: "NE", E: "E", SE: "SE", S: "S", SW: "SW", W: "W", NW: "NW",
};

const dirShortRomance: Record<MarineDirection, string> = {
  N: "N", NE: "NE", E: "E", SE: "SE", S: "S", SW: "SO", W: "O", NW: "NO",
};

export const seaCopy: Record<SeaLanguage, SeaCopy> = {
  el: {
    intlLocale: "el-GR",
    today: "Σήμερα",
    tomorrow: "Αύριο",
    states: { calm: "Ήρεμη θάλασσα", "some-waves": "Λίγο κύμα", wavy: "Κύμα" },
    directionShort: { N: "Β", NE: "ΒΑ", E: "Α", SE: "ΝΑ", S: "Ν", SW: "ΝΔ", W: "Δ", NW: "ΒΔ" },
    directionLong: {
      N: "Βόρειος", NE: "Βορειοανατολικός", E: "Ανατολικός", SE: "Νοτιοανατολικός",
      S: "Νότιος", SW: "Νοτιοδυτικός", W: "Δυτικός", NW: "Βορειοδυτικός",
    },
    regions: {
      "near-city": "Κοντά στην πόλη", northwest: "Βορειοδυτική Χίος", northeast: "Βορειοανατολική Χίος",
      west: "Δυτική Χίος", south: "Νότια Χίος",
    },
    beaufortUnit: "Μποφόρ",
    waveUnit: "μ.",
    wave: "Κύμα ανοιχτά",
    wind: "Άνεμος",
    gusts: "ριπές",
    upTo: "έως",
    hours: "10:00–18:00",
    updated: (time) => `Ενημέρωση ${time} (ώρα Χίου)`,
    source: "Πρόγνωση κύματος και ανέμου: Open-Meteo.com (CC BY 4.0)",
    disclaimer:
      "Εκτίμηση για τις ώρες μπάνιου, με βάση την πρόγνωση κύματος και ανέμου και τον προσανατολισμό κάθε ακτής. Δεν είναι μέτρηση στην παραλία ούτε εγγύηση ασφάλειας — κρίνετε πάντα επί τόπου. Το ύψος κύματος αφορά την ανοιχτή θάλασσα κοντά στην παραλία· η ένδειξη (ήρεμη/κύμα) υπολογίζει πόσο προστατευμένος είναι ο κόλπος.",
    hubKicker: "Θάλασσα & αέρας σήμερα",
    hubTitle: "Πού έχει κύμα σήμερα στη Χίο;",
    hubIntro:
      "Η θάλασσα σε 26 παραλίες της Χίου για τις ώρες μπάνιου, από την πιο ήρεμη στην πιο ταραγμένη. Συνδυάζουμε την πρόγνωση κύματος και ανέμου με το προς τα πού «βλέπει» κάθε παραλία, γιατί με τον ίδιο αέρα μια ακτή μπορεί να είναι λάδι και η απέναντι να έχει κύμα.",
    hubAnswer: (day, wind, calmest) => `${day}: ${wind}. Πιο ήρεμες παραλίες: ${calmest}.`,
    hubCalmestTitle: (day) => `Οι πιο ήρεμες παραλίες · ${day}`,
    hubAllTitle: "Όλες οι παραλίες, από την πιο ήρεμη",
    hubMore: (count) => `Δείτε και τις υπόλοιπες ${count} παραλίες`,
    hubColumnBeach: "Παραλία",
    windGuideTitle: "Ποιες παραλίες της Χίου είναι απάνεμες, ανάλογα με τον αέρα;",
    windGuideIntro:
      "Το καλοκαίρι στη Χίο φυσάει συχνά βοριάς (μελτέμι). Τότε οι παραλίες που βλέπουν νότια και νοτιοδυτικά έχουν συνήθως την πιο ήσυχη θάλασσα, ενώ οι ανατολικές και βόρειες ακτές σηκώνουν κύμα. Με νοτιά ή δυτικό αέρα ισχύει το αντίστροφο.",
    windNorth: "Με βοριά / μελτέμι",
    windSouth: "Με νοτιά",
    windWest: "Με δυτικό αέρα",
    shelteredLink: { label: "Οδηγός για απάνεμες παραλίες →", href: "/el/apanemes-paralies-xios/" },
    beachKicker: "Θάλασσα & αέρας",
    beachTitle: (_name, inPhrase) => `Έχει κύμα σήμερα ${inPhrase};`,
    beachAnswer: (day, state, wave, wind) => `${day}, 10:00–18:00: ${state.toLowerCase()}. ${wave}, ${wind}.`,
    beachOutlookTitle: "Πρόγνωση 3 ημερών για τις ώρες μπάνιου",
    beachAlternativesTitle: (day, isCalm) =>
      isCalm ? `Άλλες ήρεμες παραλίες · ${day}` : `Πιο ήρεμες εναλλακτικές · ${day}`,
    orientationTitle: "Προσανατολισμός και αέρας",
    faces: "Βλέπει προς",
    shelteredFrom: "Απάνεμη όταν φυσάει",
    exposedTo: "Σηκώνει κύμα όταν φυσάει",
    none: "—",
    meltemi: {
      sheltered: "Με το καλοκαιρινό μελτέμι (βοριά) η θάλασσα εδώ μένει συνήθως ήρεμη — καλή επιλογή για μέρες με αέρα.",
      partly: "Με μελτέμι είναι σχετικά προστατευμένη· όταν ο βοριάς δυναμώνει μπορεί να έχει λίγο κύμα.",
      exposed: "Με μελτέμι (βοριά) εδώ συνήθως σηκώνει κύμα — κρατήστε την για μέρες με νηνεμία ή νότιο αέρα.",
    },
    viewBeach: "Δείτε την παραλία",
  },
  en: {
    intlLocale: "en-GB",
    today: "Today",
    tomorrow: "Tomorrow",
    states: { calm: "Calm sea", "some-waves": "Some waves", wavy: "Wavy" },
    directionShort: dirShortLatin,
    directionLong: {
      N: "North", NE: "North-east", E: "East", SE: "South-east",
      S: "South", SW: "South-west", W: "West", NW: "North-west",
    },
    regions: {
      "near-city": "Near Chios Town", northwest: "North-west Chios", northeast: "North-east Chios",
      west: "West Chios", south: "South Chios",
    },
    beaufortUnit: "Bft",
    waveUnit: "m",
    wave: "Offshore waves",
    wind: "Wind",
    gusts: "gusts",
    upTo: "up to",
    hours: "10:00–18:00",
    updated: (time) => `Updated ${time} (Chios time)`,
    source: "Wave and wind forecast: Open-Meteo.com (CC BY 4.0)",
    disclaimer:
      "An estimate for beach hours, based on the wave and wind forecast and the orientation of each beach. It is not a measurement at the beach and not a safety guarantee — always judge conditions on site. Wave height is the open-sea forecast near the beach; the status (calm/wavy) accounts for how sheltered the cove is.",
    hubKicker: "Sea & wind today",
    hubTitle: "Where are the waves in Chios today?",
    hubIntro:
      "Sea conditions at 26 Chios beaches for beach hours, ranked from calmest to roughest. We combine the wave and wind forecast with the direction each beach faces, because with the same wind one coast can be flat calm while the opposite one has waves.",
    hubAnswer: (day, wind, calmest) => `${day}: ${wind}. Calmest beaches: ${calmest}.`,
    hubCalmestTitle: (day) => `Calmest beaches · ${day}`,
    hubAllTitle: "All beaches, calmest first",
    hubMore: (count) => `Show the other ${count} beaches`,
    hubColumnBeach: "Beach",
    windGuideTitle: "Which Chios beaches are sheltered from the wind?",
    windGuideIntro:
      "In summer Chios often gets a north wind (the meltemi). On those days beaches facing south and south-west usually have the calmest water, while the east and north coasts get waves. With a south or west wind it is the other way round.",
    windNorth: "With north wind / meltemi",
    windSouth: "With south wind",
    windWest: "With west wind",
    shelteredLink: { label: "Guide to sheltered beaches →", href: "/chios-sheltered-beaches/" },
    beachKicker: "Sea & wind",
    beachTitle: (name) => `Are there waves at ${name} today?`,
    beachAnswer: (day, state, wave, wind) => `${day}, 10:00–18:00: ${state.toLowerCase()}. ${wave}, ${wind}.`,
    beachOutlookTitle: "3-day forecast for beach hours",
    beachAlternativesTitle: (day, isCalm) =>
      isCalm ? `Other calm beaches · ${day}` : `Calmer alternatives · ${day}`,
    orientationTitle: "Orientation and wind",
    faces: "Faces",
    shelteredFrom: "Sheltered from",
    exposedTo: "Exposed to",
    none: "—",
    meltemi: {
      sheltered: "With the summer meltemi (north wind) the sea here usually stays calm — a good choice on windy days.",
      partly: "Fairly sheltered from the meltemi; when the north wind picks up there can be some waves.",
      exposed: "With the meltemi (north wind) this beach usually gets waves — keep it for still days or a south wind.",
    },
    viewBeach: "View beach",
  },
  fr: {
    intlLocale: "fr-FR",
    today: "Aujourd’hui",
    tomorrow: "Demain",
    states: { calm: "Mer calme", "some-waves": "Quelques vagues", wavy: "Vagues" },
    directionShort: dirShortRomance,
    directionLong: {
      N: "Nord", NE: "Nord-est", E: "Est", SE: "Sud-est",
      S: "Sud", SW: "Sud-ouest", W: "Ouest", NW: "Nord-ouest",
    },
    regions: {
      "near-city": "Près de la ville", northwest: "Nord-ouest de Chios", northeast: "Nord-est de Chios",
      west: "Ouest de Chios", south: "Sud de Chios",
    },
    beaufortUnit: "Bft",
    waveUnit: "m",
    wave: "Vagues au large",
    wind: "Vent",
    gusts: "rafales",
    upTo: "jusqu’à",
    hours: "10h–18h",
    updated: (time) => `Mis à jour à ${time} (heure de Chios)`,
    source: "Prévision vagues et vent : Open-Meteo.com (CC BY 4.0)",
    disclaimer:
      "Estimation pour les heures de plage, d’après la prévision de vagues et de vent et l’orientation de chaque plage. Ce n’est ni une mesure sur place ni une garantie de sécurité — jugez toujours sur place. La hauteur des vagues est la prévision au large près de la plage ; l’indication (calme/vagues) tient compte de l’abri de la crique.",
    hubKicker: "Mer et vent aujourd’hui",
    hubTitle: "Où y a-t-il des vagues à Chios aujourd’hui ?",
    hubIntro:
      "L’état de la mer sur 26 plages de Chios pour les heures de baignade, de la plus calme à la plus agitée. Nous combinons la prévision de vagues et de vent avec l’orientation de chaque plage : avec le même vent, une côte peut être d’huile et la côte opposée agitée.",
    hubAnswer: (day, wind, calmest) => `${day} : ${wind}. Plages les plus calmes : ${calmest}.`,
    hubCalmestTitle: (day) => `Plages les plus calmes · ${day}`,
    hubAllTitle: "Toutes les plages, de la plus calme",
    hubMore: (count) => `Voir les ${count} autres plages`,
    hubColumnBeach: "Plage",
    windGuideTitle: "Quelles plages de Chios sont abritées selon le vent ?",
    windGuideIntro:
      "En été, Chios connaît souvent un vent du nord (le meltem). Ces jours-là, les plages orientées sud et sud-ouest ont en général la mer la plus calme, tandis que les côtes est et nord ont des vagues. Avec un vent du sud ou d’ouest, c’est l’inverse.",
    windNorth: "Par vent du nord / meltem",
    windSouth: "Par vent du sud",
    windWest: "Par vent d’ouest",
    shelteredLink: { label: "Guide des plages abritées →", href: "/fr/plages-abritees-chios/" },
    beachKicker: "Mer et vent",
    beachTitle: (name) => `Y a-t-il des vagues à ${name} aujourd’hui ?`,
    beachAnswer: (day, state, wave, wind) => `${day}, 10h–18h : ${state.toLowerCase()}. ${wave}, ${wind}.`,
    beachOutlookTitle: "Prévision sur 3 jours pour les heures de plage",
    beachAlternativesTitle: (day, isCalm) =>
      isCalm ? `Autres plages calmes · ${day}` : `Alternatives plus calmes · ${day}`,
    orientationTitle: "Orientation et vent",
    faces: "Orientée vers",
    shelteredFrom: "Abritée du vent",
    exposedTo: "Exposée au vent",
    none: "—",
    meltemi: {
      sheltered: "Avec le meltem d’été (vent du nord), la mer reste en général calme ici — un bon choix les jours de vent.",
      partly: "Assez abritée du meltem ; quand le vent du nord forcit, il peut y avoir quelques vagues.",
      exposed: "Avec le meltem (vent du nord), cette plage a souvent des vagues — gardez-la pour les jours sans vent ou de vent du sud.",
    },
    viewBeach: "Voir la plage",
  },
  de: {
    intlLocale: "de-DE",
    today: "Heute",
    tomorrow: "Morgen",
    states: { calm: "Ruhiges Meer", "some-waves": "Leichte Wellen", wavy: "Wellen" },
    directionShort: { N: "N", NE: "NO", E: "O", SE: "SO", S: "S", SW: "SW", W: "W", NW: "NW" },
    directionLong: {
      N: "Nord", NE: "Nordost", E: "Ost", SE: "Südost",
      S: "Süd", SW: "Südwest", W: "West", NW: "Nordwest",
    },
    regions: {
      "near-city": "Nahe Chios-Stadt", northwest: "Nordwest-Chios", northeast: "Nordost-Chios",
      west: "West-Chios", south: "Süd-Chios",
    },
    beaufortUnit: "Bft",
    waveUnit: "m",
    wave: "Wellen auf See",
    wind: "Wind",
    gusts: "Böen",
    upTo: "bis",
    hours: "10–18 Uhr",
    updated: (time) => `Aktualisiert ${time} Uhr (Ortszeit Chios)`,
    source: "Wellen- und Windprognose: Open-Meteo.com (CC BY 4.0)",
    disclaimer:
      "Eine Einschätzung für die Badezeit, basierend auf Wellen- und Windprognose und der Ausrichtung jedes Strandes. Keine Messung am Strand und keine Sicherheitsgarantie — beurteilen Sie die Lage immer vor Ort. Die Wellenhöhe ist die Prognose für die offene See vor dem Strand; die Einstufung (ruhig/Wellen) berücksichtigt, wie geschützt die Bucht ist.",
    hubKicker: "Meer & Wind heute",
    hubTitle: "Wo gibt es heute Wellen auf Chios?",
    hubIntro:
      "Die Meeresbedingungen an 26 Stränden auf Chios für die Badezeit, vom ruhigsten bis zum unruhigsten. Wir verbinden die Wellen- und Windprognose mit der Ausrichtung jedes Strandes – denn beim gleichen Wind kann eine Küste spiegelglatt sein und die gegenüberliegende Wellen haben.",
    hubAnswer: (day, wind, calmest) => `${day}: ${wind}. Ruhigste Strände: ${calmest}.`,
    hubCalmestTitle: (day) => `Ruhigste Strände · ${day}`,
    hubAllTitle: "Alle Strände, die ruhigsten zuerst",
    hubMore: (count) => `Die übrigen ${count} Strände anzeigen`,
    hubColumnBeach: "Strand",
    windGuideTitle: "Welche Strände auf Chios sind bei welchem Wind geschützt?",
    windGuideIntro:
      "Im Sommer weht auf Chios oft Nordwind (der Meltemi). Dann haben Strände mit Ausrichtung nach Süden und Südwesten meist das ruhigste Wasser, während Ost- und Nordküste Wellen bekommen. Bei Süd- oder Westwind ist es umgekehrt.",
    windNorth: "Bei Nordwind / Meltemi",
    windSouth: "Bei Südwind",
    windWest: "Bei Westwind",
    shelteredLink: { label: "Guide zu geschützten Stränden →", href: "/de/geschuetzte-straende-chios/" },
    beachKicker: "Meer & Wind",
    beachTitle: (name) => `Gibt es heute Wellen am Strand ${name}?`,
    beachAnswer: (day, state, wave, wind) => `${day}, 10–18 Uhr: ${state}. ${wave}, ${wind}.`,
    beachOutlookTitle: "3-Tage-Prognose für die Badezeit",
    beachAlternativesTitle: (day, isCalm) =>
      isCalm ? `Weitere ruhige Strände · ${day}` : `Ruhigere Alternativen · ${day}`,
    orientationTitle: "Ausrichtung und Wind",
    faces: "Ausgerichtet nach",
    shelteredFrom: "Geschützt vor Wind aus",
    exposedTo: "Offen für Wind aus",
    none: "—",
    meltemi: {
      sheltered: "Beim sommerlichen Meltemi (Nordwind) bleibt das Meer hier meist ruhig – eine gute Wahl an windigen Tagen.",
      partly: "Recht gut vor dem Meltemi geschützt; frischt der Nordwind auf, kann es leichte Wellen geben.",
      exposed: "Beim Meltemi (Nordwind) gibt es hier meist Wellen – besser für windstille Tage oder Südwind.",
    },
    viewBeach: "Strand ansehen",
  },
  it: {
    intlLocale: "it-IT",
    today: "Oggi",
    tomorrow: "Domani",
    states: { calm: "Mare calmo", "some-waves": "Poche onde", wavy: "Mare mosso" },
    directionShort: dirShortRomance,
    directionLong: {
      N: "Nord", NE: "Nord-est", E: "Est", SE: "Sud-est",
      S: "Sud", SW: "Sud-ovest", W: "Ovest", NW: "Nord-ovest",
    },
    regions: {
      "near-city": "Vicino alla città", northwest: "Chios nord-ovest", northeast: "Chios nord-est",
      west: "Chios ovest", south: "Chios sud",
    },
    beaufortUnit: "Bft",
    waveUnit: "m",
    wave: "Onde al largo",
    wind: "Vento",
    gusts: "raffiche",
    upTo: "fino a",
    hours: "10:00–18:00",
    updated: (time) => `Aggiornato alle ${time} (ora di Chios)`,
    source: "Previsioni onde e vento: Open-Meteo.com (CC BY 4.0)",
    disclaimer:
      "Una stima per le ore di spiaggia, basata sulle previsioni di onde e vento e sull’esposizione di ogni spiaggia. Non è una misura sul posto né una garanzia di sicurezza: valutate sempre sul posto. L’altezza delle onde è la previsione al largo vicino alla spiaggia; l’indicazione (calmo/mosso) tiene conto di quanto è riparata la baia.",
    hubKicker: "Mare e vento oggi",
    hubTitle: "Dove c’è mare mosso oggi a Chios?",
    hubIntro:
      "Lo stato del mare in 26 spiagge di Chios per le ore di balneazione, dalla più calma alla più mossa. Combiniamo le previsioni di onde e vento con l’esposizione di ogni spiaggia: con lo stesso vento una costa può essere una tavola e quella opposta avere onde.",
    hubAnswer: (day, wind, calmest) => `${day}: ${wind}. Spiagge più calme: ${calmest}.`,
    hubCalmestTitle: (day) => `Spiagge più calme · ${day}`,
    hubAllTitle: "Tutte le spiagge, dalla più calma",
    hubMore: (count) => `Mostra le altre ${count} spiagge`,
    hubColumnBeach: "Spiaggia",
    windGuideTitle: "Quali spiagge di Chios sono riparate, a seconda del vento?",
    windGuideIntro:
      "In estate a Chios soffia spesso il vento da nord (il meltemi). In quei giorni le spiagge esposte a sud e sud-ovest hanno di solito il mare più calmo, mentre le coste est e nord hanno onde. Con vento da sud o da ovest vale il contrario.",
    windNorth: "Con vento da nord / meltemi",
    windSouth: "Con vento da sud",
    windWest: "Con vento da ovest",
    shelteredLink: { label: "Guida alle spiagge riparate →", href: "/it/spiagge-riparate-chios/" },
    beachKicker: "Mare e vento",
    beachTitle: (name) => `C’è mare mosso oggi a ${name}?`,
    beachAnswer: (day, state, wave, wind) => `${day}, 10:00–18:00: ${state.toLowerCase()}. ${wave}, ${wind}.`,
    beachOutlookTitle: "Previsioni a 3 giorni per le ore di spiaggia",
    beachAlternativesTitle: (day, isCalm) =>
      isCalm ? `Altre spiagge calme · ${day}` : `Alternative più calme · ${day}`,
    orientationTitle: "Esposizione e vento",
    faces: "Esposta verso",
    shelteredFrom: "Riparata dal vento da",
    exposedTo: "Esposta al vento da",
    none: "—",
    meltemi: {
      sheltered: "Con il meltemi estivo (vento da nord) qui il mare resta di solito calmo: una buona scelta nei giorni ventosi.",
      partly: "Abbastanza riparata dal meltemi; quando il vento da nord rinforza possono esserci poche onde.",
      exposed: "Con il meltemi (vento da nord) qui di solito c’è onda: meglio nei giorni senza vento o con vento da sud.",
    },
    viewBeach: "Vedi la spiaggia",
  },
  es: {
    intlLocale: "es-ES",
    today: "Hoy",
    tomorrow: "Mañana",
    states: { calm: "Mar en calma", "some-waves": "Algo de oleaje", wavy: "Oleaje" },
    directionShort: dirShortRomance,
    directionLong: {
      N: "Norte", NE: "Noreste", E: "Este", SE: "Sureste",
      S: "Sur", SW: "Suroeste", W: "Oeste", NW: "Noroeste",
    },
    regions: {
      "near-city": "Cerca de la ciudad", northwest: "Noroeste de Quíos", northeast: "Noreste de Quíos",
      west: "Oeste de Quíos", south: "Sur de Quíos",
    },
    beaufortUnit: "Bft",
    waveUnit: "m",
    wave: "Olas mar adentro",
    wind: "Viento",
    gusts: "rachas",
    upTo: "hasta",
    hours: "10:00–18:00",
    updated: (time) => `Actualizado a las ${time} (hora de Quíos)`,
    source: "Previsión de olas y viento: Open-Meteo.com (CC BY 4.0)",
    disclaimer:
      "Una estimación para las horas de playa, basada en la previsión de olas y viento y la orientación de cada playa. No es una medición en la playa ni una garantía de seguridad: valore siempre in situ. La altura de las olas es la previsión mar adentro cerca de la playa; el estado (calma/oleaje) tiene en cuenta lo resguardada que está la cala.",
    hubKicker: "Mar y viento hoy",
    hubTitle: "¿Dónde hay olas hoy en Quíos?",
    hubIntro:
      "El estado del mar en 26 playas de Quíos para las horas de baño, de la más tranquila a la más movida. Combinamos la previsión de olas y viento con la orientación de cada playa: con el mismo viento una costa puede estar como un plato y la opuesta tener olas.",
    hubAnswer: (day, wind, calmest) => `${day}: ${wind}. Playas más tranquilas: ${calmest}.`,
    hubCalmestTitle: (day) => `Playas más tranquilas · ${day}`,
    hubAllTitle: "Todas las playas, de la más tranquila",
    hubMore: (count) => `Ver las otras ${count} playas`,
    hubColumnBeach: "Playa",
    windGuideTitle: "¿Qué playas de Quíos están resguardadas según el viento?",
    windGuideIntro:
      "En verano en Quíos sopla a menudo viento del norte (el meltemi). Esos días las playas orientadas al sur y suroeste suelen tener el mar más tranquilo, mientras que las costas este y norte tienen olas. Con viento del sur o del oeste ocurre lo contrario.",
    windNorth: "Con viento del norte / meltemi",
    windSouth: "Con viento del sur",
    windWest: "Con viento del oeste",
    shelteredLink: { label: "Guía de playas resguardadas →", href: "/es/playas-resguardadas-quios/" },
    beachKicker: "Mar y viento",
    beachTitle: (name) => `¿Hay olas hoy en la playa de ${name}?`,
    beachAnswer: (day, state, wave, wind) => `${day}, 10:00–18:00: ${state.toLowerCase()}. ${wave}, ${wind}.`,
    beachOutlookTitle: "Previsión de 3 días para las horas de playa",
    beachAlternativesTitle: (day, isCalm) =>
      isCalm ? `Otras playas tranquilas · ${day}` : `Alternativas más tranquilas · ${day}`,
    orientationTitle: "Orientación y viento",
    faces: "Orientada al",
    shelteredFrom: "Resguardada del viento",
    exposedTo: "Expuesta al viento",
    none: "—",
    meltemi: {
      sheltered: "Con el meltemi de verano (viento del norte) aquí el mar suele estar en calma: buena opción los días de viento.",
      partly: "Bastante resguardada del meltemi; cuando el viento del norte arrecia puede haber algo de oleaje.",
      exposed: "Con el meltemi (viento del norte) aquí suele haber olas: mejor para días sin viento o con viento del sur.",
    },
    viewBeach: "Ver la playa",
  },
  tr: {
    intlLocale: "tr-TR",
    today: "Bugün",
    tomorrow: "Yarın",
    states: { calm: "Sakin deniz", "some-waves": "Hafif dalga", wavy: "Dalgalı" },
    directionShort: { N: "K", NE: "KD", E: "D", SE: "GD", S: "G", SW: "GB", W: "B", NW: "KB" },
    directionLong: {
      N: "Kuzey", NE: "Kuzeydoğu", E: "Doğu", SE: "Güneydoğu",
      S: "Güney", SW: "Güneybatı", W: "Batı", NW: "Kuzeybatı",
    },
    regions: {
      "near-city": "Şehre yakın", northwest: "Kuzeybatı Sakız", northeast: "Kuzeydoğu Sakız",
      west: "Batı Sakız", south: "Güney Sakız",
    },
    beaufortUnit: "Bofor",
    waveUnit: "m",
    wave: "Açıkta dalga",
    wind: "Rüzgâr",
    gusts: "hamle",
    upTo: "en çok",
    hours: "10:00–18:00",
    updated: (time) => `Güncelleme ${time} (Sakız saati)`,
    source: "Dalga ve rüzgâr tahmini: Open-Meteo.com (CC BY 4.0)",
    disclaimer:
      "Plaj saatleri için bir tahmindir; dalga ve rüzgâr tahmini ile her plajın yönüne dayanır. Plajda yapılmış bir ölçüm ya da güvenlik garantisi değildir — koşulları her zaman yerinde değerlendirin. Dalga yüksekliği plaja yakın açık deniz tahminidir; durum göstergesi (sakin/dalgalı) koyun ne kadar korunaklı olduğunu hesaba katar.",
    hubKicker: "Bugün deniz ve rüzgâr",
    hubTitle: "Sakız Adası’nda bugün nerede dalga var?",
    hubIntro:
      "Sakız Adası’ndaki 26 plajda deniz durumu, en sakinden en dalgalıya. Dalga ve rüzgâr tahminini her plajın baktığı yönle birleştiriyoruz; çünkü aynı rüzgârda bir kıyı çarşaf gibi, karşı kıyı ise dalgalı olabilir.",
    hubAnswer: (day, wind, calmest) => `${day}: ${wind}. En sakin plajlar: ${calmest}.`,
    hubCalmestTitle: (day) => `En sakin plajlar · ${day}`,
    hubAllTitle: "Tüm plajlar, en sakinden başlayarak",
    hubMore: (count) => `Diğer ${count} plajı göster`,
    hubColumnBeach: "Plaj",
    windGuideTitle: "Rüzgâra göre Sakız Adası’nın korunaklı plajları hangileri?",
    windGuideIntro:
      "Yazın Sakız Adası’nda sık sık kuzey rüzgârı (meltem/poyraz) eser. O günlerde güneye ve güneybatıya bakan plajlarda deniz genellikle en sakindir; doğu ve kuzey kıyıları ise dalgalanır. Güney veya batı rüzgârında durum tam tersidir.",
    windNorth: "Kuzey rüzgârı / meltemde",
    windSouth: "Güney rüzgârında",
    windWest: "Batı rüzgârında",
    shelteredLink: { label: "Korunaklı plajlar rehberi →", href: "/tr/sakiz-adasi-korunakli-plajlar/" },
    beachKicker: "Deniz ve rüzgâr",
    beachTitle: (name) => `${name} plajında bugün dalga var mı?`,
    beachAnswer: (day, state, wave, wind) => `${day}, 10:00–18:00: ${state.toLowerCase()}. ${wave}, ${wind}.`,
    beachOutlookTitle: "Plaj saatleri için 3 günlük tahmin",
    beachAlternativesTitle: (day, isCalm) =>
      isCalm ? `Diğer sakin plajlar · ${day}` : `Daha sakin alternatifler · ${day}`,
    orientationTitle: "Yön ve rüzgâr",
    faces: "Baktığı yön",
    shelteredFrom: "Korunaklı olduğu rüzgârlar",
    exposedTo: "Açık olduğu rüzgârlar",
    none: "—",
    meltemi: {
      sheltered: "Yaz meltemi (kuzey rüzgârı) estiğinde burada deniz genellikle sakin kalır — rüzgârlı günler için iyi bir seçim.",
      partly: "Meltemden oldukça korunaklı; kuzey rüzgârı sertleştiğinde hafif dalga olabilir.",
      exposed: "Meltemde (kuzey rüzgârı) burada genellikle dalga olur — rüzgârsız ya da güney rüzgârlı günleri tercih edin.",
    },
    viewBeach: "Plajı gör",
  },
};

export function seaCopyFor(language: SeaLanguage) {
  return seaCopy[language] ?? seaCopy.en;
}
