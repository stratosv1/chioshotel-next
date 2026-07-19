import type { ChiosAccommodationPageData } from "@/content/chios-accommodation";

const heroImage =
  "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp";

export const alloggioChiosPageIt: ChiosAccommodationPageData = {
  seo: {
    canonicalPath: "/it/alloggio-chios/",
    title: "Alloggio a Chios | Camere & Appartamenti a Kambos",
    description:
      "Soggiorna al Voulamandis House a Kambos: camere tranquille e appartamenti familiari vicino a Chios città, aeroporto e spiagge. Verifica la disponibilità.",
    ogImage: heroImage,
    ogImageAlt:
      "Alloggio al Voulamandis House tra gli agrumeti di Kambos a Chios",
  },
  hero: {
    kicker: "ALLOGGIO A GESTIONE FAMILIARE • KAMBOS CHIOS",
    title: "Un alloggio a Chios nella quiete e nel carattere storico di Kambos",
    description:
      "Voulamandis House offre camere tranquille e appartamenti familiari nello storico quartiere degli agrumeti di Kambos. Soggiorna vicino alla città di Chios, all’aeroporto e al porto, con giardino, ospitalità personale e soluzioni pratiche per coppie e famiglie.",
    image: heroImage,
    imageAlt:
      "Camere e appartamenti del Voulamandis House a Kambos sull’isola di Chios",
    primaryCta: {
      label: "Vedi camere & appartamenti",
      href: "/it/camere-a-chios/",
    },
    secondaryCta: {
      label: "Verifica la disponibilità",
      href: "/it/prezzi-hotel-chios/",
    },
    aiCta: {
      label: "Trova la camera con l’AI",
      href: "/ai-assistant/?lang=it",
    },
  },
  highlights: [
    { label: "Zona", value: "Kambos storico" },
    { label: "Aeroporto", value: "3 km" },
    { label: "Porto di Chios", value: "6 km" },
    { label: "Soluzioni", value: "Camere & appartamenti" },
    { label: "Ideale per", value: "Coppie & famiglie" },
    { label: "Atmosfera", value: "Giardino & agrumeti" },
  ],
  intro: {
    kicker: "UN SOGGIORNO PIÙ PERSONALE",
    title: "Una scelta tranquilla e autentica per il tuo soggiorno a Chios",
    paragraphs: [
      "Scegliere dove soggiornare a Chios non significa soltanto trovare una camera per la notte. La zona in cui alloggi influenza il ritmo della vacanza, gli spostamenti quotidiani e il modo in cui vivi l’isola. Voulamandis House si trova a Kambos, un quartiere storico caratterizzato da alti muri in pietra, antiche dimore e giardini di agrumi, a pochi minuti dalla città di Chios.",
      "Voulamandis House è una piccola struttura ricettiva a gestione familiare, non un grande resort. Offre camere doppie economy, camere al piano terra, camere al piano superiore e appartamenti familiari. Puoi quindi scegliere in base al budget, al numero di ospiti, al piano preferito, alla necessità di evitare le scale e al bisogno di una cucina o di uno spazio abitativo più ampio.",
      "L’accoglienza è diretta e personale. Puoi parlare con chi conosce realmente le camere, la loro disposizione e l’isola. Prima di prenotare puoi chiedere quale categoria sia più adatta, verificare la disponibilità, organizzare la colazione su richiesta e ricevere suggerimenti locali per spiagge, villaggi, musei e itinerari.",
    ],
    factsTitle: "Voulamandis House in breve",
    facts: [
      "Camere e appartamenti a gestione familiare a Kambos, Chios",
      "Soluzioni economy, al piano terra e al piano superiore",
      "Appartamenti familiari con cucina completa e zona giorno",
      "Wi-Fi gratuito, aria condizionata, bagno privato, TV e frigorifero",
      "Giardino, terrazze e parcheggio disponibili per gli ospiti",
      "Colazione in giardino su richiesta",
      "Contatto diretto via telefono, WhatsApp o e-mail",
    ],
  },
  rooms: {
    kicker: "CAMERE E APPARTAMENTI",
    title: "Scegli l’alloggio a Chios più adatto al tuo viaggio",
    description:
      "Le categorie sono organizzate per spazio, piano, accesso e servizi, così puoi confrontare facilmente le opzioni prima di verificare disponibilità e prezzi. Le pagine delle camere mostrano fotografie e dettagli più specifici.",
    cards: [
      {
        id: "economy-double",
        eyebrow: "SCELTA CONVENIENTE PER DUE",
        title: "Camere doppie economy",
        description:
          "Una soluzione pratica per due ospiti che desiderano una base confortevole a Kambos nella categoria più conveniente. Le camere rinnovate misurano circa 16 m² e dispongono di aria condizionata, Wi-Fi, bagno privato, televisione e frigorifero.",
        href: "/it/stanze-a-chios/camera-doppia-economica-chios/",
        image: "/images/rooms/received_1753964631359257.webp",
        imageAlt:
          "Camera doppia economy al Voulamandis House a Chios",
        facts: ["2 ospiti", "Circa 16 m²", "Letto matrimoniale", "Scelta conveniente"],
      },
      {
        id: "ground-floor",
        eyebrow: "ACCESSO FACILE E GIARDINO",
        title: "Camere doppie e triple al piano terra",
        description:
          "Adatte a coppie, amici o piccole famiglie che preferiscono evitare le scale e avere accesso diretto al cortile e al giardino. A seconda della camera possono ospitare due o tre persone.",
        href: "/it/stanze-a-chios/camere-doppie-standard-chios/",
        image: "/images/rooms/double-triple-room.jpg",
        imageAlt:
          "Camera al piano terra con accesso al giardino al Voulamandis House",
        facts: ["2–3 ospiti", "Senza scale", "Accesso al giardino", "Frigorifero & A/C"],
      },
      {
        id: "first-floor",
        eyebrow: "LUCE, TERRAZZA E VISTA",
        title: "Camere doppie e triple al piano superiore",
        description:
          "Una buona scelta per chi preferisce una camera luminosa al piano superiore e l’accesso alla terrazza comune con vista sulla tenuta di agrumi. Alcune camere dispongono anche di un piccolo angolo cottura.",
        href: "/it/stanze-a-chios/camere-doppie-standard-chios/",
        image: "/images/rooms/DSC07776-2-e1675109942622.webp",
        imageAlt:
          "Camera al piano superiore con vista sugli agrumeti di Kambos",
        facts: ["2–4 ospiti", "Piano superiore", "Terrazza comune", "Alcune con angolo cottura"],
      },
      {
        id: "family-apartments",
        eyebrow: "PIÙ SPAZIO PER LE FAMIGLIE",
        title: "Appartamenti familiari a Chios",
        description:
          "Gli appartamenti di 40–45 m² sono la soluzione più spaziosa del Voulamandis House. Una camera separata, la zona giorno e la cucina completa offrono a famiglie e piccoli gruppi maggiore comfort e autonomia per soggiorni di più notti.",
        href: "/it/stanze-a-chios/appartamenti-familiari-a-chios/",
        image: "/images/rooms/chios-apartments-voulamandis.webp",
        imageAlt:
          "Appartamento familiare con cucina al Voulamandis House a Chios",
        facts: ["Fino a 4 ospiti", "40–45 m²", "Cucina completa", "Zona giorno"],
      },
    ],
  },
  location: {
    kicker: "PERCHÉ SOGGIORNARE A KAMBOS",
    title: "Un alloggio tranquillo vicino alla città di Chios e all’aeroporto",
    paragraphs: [
      "Kambos, spesso scritto anche Kampos, è una delle zone più caratteristiche di Chios. Dietro gli alti muri in pietra si trovano agrumeti, cortili, pozzi e dimore storiche. Soggiornare qui offre un’atmosfera diversa rispetto a una strada trafficata del centro o a una località balneare isolata.",
      "Voulamandis House unisce questo contesto speciale a una posizione pratica. L’aeroporto di Chios dista circa 3 km e il porto circa 6 km. La città di Chios, con ristoranti, negozi, lungomare e collegamenti in traghetto, è facilmente raggiungibile, mentre le strade da Kambos conducono verso le spiagge meridionali e i villaggi medievali del mastice.",
      "La posizione è particolarmente adatta a chi desidera esplorare diverse parti dell’isola. Puoi iniziare la giornata in giardino, visitare una spiaggia o un villaggio e tornare la sera in un ambiente più tranquillo.",
    ],
    image: "/images/beaches/voulamandis-house-courtyard-chios.webp",
    imageAlt:
      "Cortile e giardino del Voulamandis House a Kambos sull’isola di Chios",
    distances: [
      {
        label: "Aeroporto di Chios",
        value: "3 km",
        note: "Comodo per arrivi in aereo e soggiorni brevi.",
      },
      {
        label: "Porto di Chios",
        value: "6 km",
        note: "Facile accesso ai traghetti e alla città di Chios.",
      },
      {
        label: "Spiaggia vicina",
        value: "1,5 km",
        note: "Una scelta rapida prima di esplorare altre coste.",
      },
    ],
    mapCta: {
      label: "Apri Voulamandis House su Google Maps",
      href: "https://www.google.com/maps/search/?api=1&query=Voulamandis+House+Chios",
    },
    guideCta: {
      label: "Scopri Kambos a Chios",
      href: "/it/chios/kampos-chios/",
    },
  },
  reasons: {
    kicker: "COSA OFFRE IL SOGGIORNO",
    title: "Comfort pratico senza perdere il carattere di Kambos",
    description:
      "Voulamandis House combina il contesto storico di Kambos, servizi utili e un’ospitalità locale diretta. È pensato per chi apprezza tranquillità, pulizia e una base autentica da cui esplorare Chios.",
    items: [
      {
        icon: "🌿",
        title: "Giardino e atmosfera di agrumeti",
        text: "Verde, cortile e ambiente storico di Kambos offrono uno spazio tranquillo prima o dopo una giornata sull’isola.",
      },
      {
        icon: "🛏️",
        title: "Diverse configurazioni di camera",
        text: "Scegli tra categoria economy, accesso al piano terra, piano superiore con terrazza o appartamento familiare con più spazio.",
      },
      {
        icon: "❄️",
        title: "Servizi essenziali in camera",
        text: "Wi-Fi, aria condizionata, bagno privato, TV e frigorifero sono inclusi; cucina o angolo cottura sono disponibili in alcune soluzioni.",
      },
      {
        icon: "🥐",
        title: "Colazione su richiesta",
        text: "Gli ospiti possono richiedere la colazione e gustarla in giardino per iniziare la giornata in modo semplice e piacevole.",
      },
      {
        icon: "🚗",
        title: "Parcheggio e posizione pratica",
        text: "È disponibile il parcheggio e la posizione facilita gli spostamenti verso la città, le spiagge e i villaggi del sud.",
      },
      {
        icon: "💬",
        title: "Aiuto diretto nella scelta",
        text: "Puoi chiedere informazioni su piano, letti, capacità, cucina e soluzione più adatta prima di prenotare.",
      },
    ],
  },
  travelerTypes: {
    kicker: "A CHI È ADATTO",
    title: "Una base flessibile per diversi tipi di vacanza a Chios",
    items: [
      {
        title: "Coppie in cerca di tranquillità",
        text: "Le camere economy e standard offrono una base rilassante per chi vuole esplorare l’isola e rientrare in una zona più calma del centro.",
      },
      {
        title: "Famiglie che desiderano più spazio",
        text: "Gli appartamenti familiari dispongono di camera, zona giorno e cucina completa; alcune camere triple sono adatte a famiglie più piccole.",
      },
      {
        title: "Viaggiatori indipendenti",
        text: "La posizione vicino alla città e alle strade verso il sud è ideale per visitare ogni giorno una spiaggia, un villaggio o un museo diverso.",
      },
      {
        title: "Ospiti in arrivo in aereo o traghetto",
        text: "La distanza di circa 3 km dall’aeroporto e 6 km dal porto riduce gli spostamenti all’inizio e alla fine della vacanza.",
      },
    ],
  },
  directBooking: {
    kicker: "DISPONIBILITÀ DIRETTA",
    title: "Verifica la camera più adatta prima di prenotare",
    paragraphs: [
      "La prenotazione diretta deve rendere la scelta più chiara. Le pagine del Voulamandis House mostrano categorie e disponibilità, mentre l’AI Room Finder può restringere le opzioni in base alle date e al numero di ospiti.",
      "Poiché le camere differiscono per piano, capacità e presenza della cucina, il contatto diretto può essere utile. Puoi confermare la necessità di un piano terra, di un appartamento, di una disposizione specifica dei letti o dell’opzione più conveniente disponibile.",
    ],
    benefits: [
      "Disponibilità attuale e tariffe dirette",
      "Aiuto per abbinare la camera alle tue esigenze",
      "Comunicazione diretta con Voulamandis House",
      "Accesso alle offerte dirette disponibili per le date scelte",
    ],
    primaryCta: {
      label: "Verifica prezzi diretti",
      href: "/it/prezzi-hotel-chios/",
    },
    secondaryCta: {
      label: "Usa l’AI Room Finder",
      href: "/ai-assistant/?lang=it",
    },
    whatsappCta: {
      label: "Chiedi su WhatsApp",
      href: "https://wa.me/306944474226",
    },
  },
  explore: {
    kicker: "ORGANIZZA IL RESTO DEL VIAGGIO",
    title: "Usa Kambos come punto di partenza per scoprire Chios",
    description:
      "Chios premia chi esplora più di una sola zona. Queste guide aiutano a organizzare giornate tra spiagge, villaggi, storia locale e il paesaggio che circonda l’alloggio.",
    links: [
      {
        title: "Scopri l’isola di Chios",
        text: "Inizia dalla guida principale e scegli le esperienze più adatte al tuo viaggio.",
        href: "/it/chios-lisola-in-grecia/",
      },
      {
        title: "Esplora le spiagge di Chios",
        text: "Confronta spiagge organizzate, calette tranquille e coste adatte alle famiglie.",
        href: "/it/spiagge-chios/",
      },
      {
        title: "Visita i villaggi di Chios",
        text: "Organizza itinerari tra villaggi medievali del mastice, borghi costieri e comunità montane.",
        href: "/it/villaggi-chios/",
      },
      {
        title: "Conosci meglio Kambos",
        text: "Scopri agrumeti, dimore storiche e paesaggio in pietra intorno al Voulamandis House.",
        href: "/it/chios/kampos-chios/",
      },
    ],
  },
  faq: {
    kicker: "DOMANDE FREQUENTI",
    title: "Cosa sapere prima di scegliere il tuo alloggio a Chios",
    items: [
      {
        question: "Voulamandis House è un hotel?",
        answer:
          "Voulamandis House è una struttura ricettiva a gestione familiare con camere e appartamenti a Kambos, Chios. È un’alternativa più piccola e personale rispetto a un grande hotel o resort.",
      },
      {
        question: "Dove si trova Voulamandis House?",
        answer:
          "La struttura si trova in Dimarchou Kalvokoressi 117, a Kambos, Chios. Kambos è lo storico quartiere degli agrumeti vicino alla città e all’aeroporto.",
      },
      {
        question: "Quanto dista dall’aeroporto e dal porto di Chios?",
        answer:
          "Voulamandis House dista circa 3 km dall’aeroporto di Chios e 6 km dal porto, quindi è comodo sia per chi arriva in aereo sia per chi viaggia in traghetto.",
      },
      {
        question: "Qual è la soluzione migliore per una famiglia?",
        answer:
          "Gli appartamenti familiari sono la scelta più spaziosa: ospitano fino a quattro persone e dispongono di camera separata, zona giorno e cucina completa. Alcune camere standard possono ospitare tre o quattro persone.",
      },
      {
        question: "Ci sono camere al piano terra senza scale?",
        answer:
          "Sì. Voulamandis House dispone di camere economy e standard al piano terra. Le pagine delle camere indicano quali opzioni non richiedono scale e hanno accesso diretto verso il cortile o il giardino.",
      },
      {
        question: "Le camere hanno la cucina?",
        answer:
          "Gli appartamenti familiari hanno una cucina completa, mentre alcune camere al piano superiore dispongono di angolo cottura. Tutte le soluzioni includono un frigorifero.",
      },
      {
        question: "È disponibile la colazione?",
        answer:
          "La colazione è disponibile su richiesta e può essere servita in giardino. Contatta la struttura per conoscere i dettagli aggiornati per il tuo soggiorno.",
      },
      {
        question: "Come posso verificare la disponibilità diretta?",
        answer:
          "Usa la pagina delle tariffe dirette, l’AI Room Finder oppure contatta Voulamandis House via WhatsApp, telefono o e-mail indicando date e numero di ospiti.",
      },
    ],
  },
  finalCta: {
    kicker: "IL TUO SOGGIORNO A CHIOS INIZIA QUI",
    title: "Trova una camera o un appartamento tranquillo a Kambos",
    text: "Confronta le categorie, inserisci le date e scegli la soluzione adatta al numero di ospiti, al piano preferito e alla necessità di una cucina.",
    primaryCta: {
      label: "Verifica disponibilità",
      href: "/it/prezzi-hotel-chios/",
    },
    secondaryCta: {
      label: "Vedi tutte le camere",
      href: "/it/camere-a-chios/",
    },
  },
};
