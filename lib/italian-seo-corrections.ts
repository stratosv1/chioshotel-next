import { localizedBeachDetails, type BeachDetailData } from "../content/beach-details";
import { chiosBeachesPageIt } from "../content/chios-beaches";
import { beachLoversPages } from "../content/beach-lovers";
import { contactPageIt } from "../content/contact";
import { dealsPageIt } from "../content/deals";
import { familyBeachesPages } from "../content/family-beaches";
import { kamposChiosPageIt } from "../content/kampos-chios";
import { localizedMuseumDetails, type MuseumDetailData } from "../content/museum-details";
import { chiosMuseumsPageIt } from "../content/chios-museums";
import { chiosQuizSchemaPages } from "../content/chios-quiz-schema";
import { ratesPageIt } from "../content/rates";
import {
  economyDoubleRoomsIt,
  familyChiosApartmentsIt,
  standardDoubleRoomIt,
  type RoomDetailData,
} from "../content/room-details";
import { roomsCategoryIt } from "../content/rooms";
import { localizedVillageDetails, type VillageDetailData } from "../content/village-details";
import { chiosVillagesPageIt } from "../content/chios-villages";
import { seoSnippetOverrides } from "./seo-snippet-overrides";

type SeoCorrection = { title: string; description: string };
type DetailCorrection = SeoCorrection & { heroTitle: string; heroDescription: string };
type LocalizedDetail = BeachDetailData | VillageDetailData | MuseumDetailData;

const pageSeo = new Map<string, SeoCorrection>([
  ["/it/", { title: "Camere e appartamenti a Chios | Voulamandis House", description: "Camere tranquille e appartamenti familiari nella storica zona di Kambos a Chios, vicino alla città, all’aeroporto e alle spiagge, con prenotazione diretta." }],
  [roomsCategoryIt.seo.canonicalPath, { title: "Camere e appartamenti a Chios | Kambos", description: "Confronta camere doppie economy, camere standard e appartamenti familiari con cucina al Voulamandis House, nella tranquilla zona di Kambos." }],
  [contactPageIt.seo.canonicalPath, { title: "Contatti Voulamandis House | Camere e disponibilità", description: "Contatta Voulamandis House a Kambos via WhatsApp o email per chiedere disponibilità, tariffe e la camera o l’appartamento più adatto al soggiorno." }],
  [ratesPageIt.seo.canonicalPath, { title: "Prenotazione diretta a Chios | Tariffe e disponibilità", description: "Controlla la disponibilità, scegli una camera o un appartamento e prenota direttamente e in sicurezza il soggiorno al Voulamandis House." }],
  [dealsPageIt.seo.canonicalPath, { title: "Offerte soggiorno a Chios | Prenotazione diretta", description: "Scopri le offerte disponibili per camere e appartamenti al Voulamandis House, copia il codice promozionale e continua alla prenotazione diretta." }],
  ["/it/trova-la-tua-camera/", { title: "Trova una camera a Chios | Disponibilità in tempo reale", description: "Inserisci date e numero di ospiti, confronta camere e appartamenti disponibili, visualizza il prezzo diretto e invia la richiesta al Voulamandis House." }],
  [chiosBeachesPageIt.seo.canonicalPath, { title: "Spiagge di Chios | Accesso, caratteristiche e consigli", description: "Confronta Mavra Volia, Komi, Lithi, Agia Dynami, Nagos e altre spiagge di Chios per accesso, fondale, servizi e atmosfera." }],
  [chiosVillagesPageIt.seo.canonicalPath, { title: "Villaggi di Chios | Borghi medievali, mastice e mare", description: "Scopri Pyrgi, Mesta, Olympoi, Armolia, Vessa, Volissos e Lagada tra vicoli medievali, cultura del mastice, castelli e porticcioli." }],
  [chiosMuseumsPageIt.seo.canonicalPath, { title: "Musei di Chios | Storia, cultura e mastice", description: "Scopri i musei di Chios dedicati ad archeologia, arte bizantina, navigazione, libri rari, folklore e cultura del mastice." }],
  [familyBeachesPages.it.seo.canonicalPath, { title: "Spiagge di Chios per bambini | Guida per famiglie", description: "Confronta Komi, Karfas, Lithi e Agia Dynami per accesso semplice, ingresso in acqua, servizi vicini e una giornata al mare con i bambini." }],
  [beachLoversPages.it.seo.canonicalPath, { title: "Chios per amanti del mare | Itinerario tra le spiagge", description: "Soggiorna a Kambos e organizza un itinerario tra Mavra Volia, Komi, Agia Fotia, Vroulidia, Salagona e Kato Fana." }],
  ["/it/villaggi-del-mastice-chios/", { title: "Villaggi del mastice a Chios | Pyrgi, Mesta e Olympoi", description: "Organizza un itinerario tra Pyrgi, Mesta, Olympoi, Armolia e Vessa, con architettura medievale, xysta, ceramica e cultura del mastice." }],
  ["/it/villaggi-medievali-chios/", { title: "Villaggi medievali di Chios | Mesta, Pyrgi e Volissos", description: "Esplora i vicoli in pietra, le fortificazioni e l’architettura tradizionale di Mesta, Pyrgi, Olympoi, Vessa e Volissos." }],
  ["/it/villaggi-sul-mare-chios/", { title: "Villaggi sul mare a Chios | Lagada e Volissos", description: "Scopri villaggi costieri, piccoli porti, taverne di pesce e percorsi panoramici tra Lagada, Limnia, Volissos e la costa di Chios." }],
  ["/it/attivita-a-chios/", { title: "Attività a Chios | Natura, cultura e tradizioni", description: "Scopri corsi di greco, trekking, terme, Festival Mostra, Guerra dei razzi e orchidee selvatiche per organizzare esperienze autentiche a Chios." }],
  ["/it/festival-mostra-chios/", { title: "Festival Mostra a Chios | Tradizione di Thymiana", description: "Scopri il Festival Mostra di Thymiana, una tradizione carnevalesca di Chios con musica, costumi, danze, storia locale e atmosfera di festa." }],
  ["/it/corsi-di-greco-a-chios/", { title: "Corsi di greco a Chios | Lingua e cultura", description: "Partecipa a corsi di lingua e cultura greca a Chios e combina lo studio con storia, tradizioni, vita locale e soggiorno nella zona di Kambos." }],
  ["/it/trekking-a-chios/", { title: "Trekking a Chios | Sentieri, villaggi e natura", description: "Scopri percorsi a piedi tra villaggi del mastice, montagne, agrumeti, gole e coste di Chios, con proposte per diversi livelli." }],
  ["/it/terme-di-chios/", { title: "Terme di Chios | Sorgenti naturali di Agiasmata", description: "Visita le sorgenti termali naturali di Agiasmata nel nord di Chios e organizza una giornata di benessere, natura e scoperta dei villaggi vicini." }],
  ["/it/guerra-dei-razzi-chios/", { title: "Guerra dei razzi di Chios | Pasqua a Vrontados", description: "Scopri il Rouketopolemos, la celebre tradizione pasquale di Vrontados, con informazioni sul significato dell’evento e sulla visita in sicurezza." }],
  ["/it/orchidee-di-chios/", { title: "Orchidee di Chios | Specie, stagione e luoghi", description: "Scopri le orchidee selvatiche e i fiori primaverili di Chios, il periodo migliore e le zone botaniche tra Kato Fana, Amani e Mastichochoria." }],
  [kamposChiosPageIt.seo.canonicalPath, { title: "Kambos di Chios | Dimore storiche e agrumeti", description: "Scopri Kambos, la storica zona di Chios con dimore in pietra, agrumeti e strade tranquille, vicina alla città e all’aeroporto." }],
  [chiosQuizSchemaPages.it.path, { title: "Quiz vacanze a Chios | Trova l’esperienza ideale", description: "Fai il quiz di viaggio, scopri quali spiagge, villaggi ed esperienze di Chios si adattano al tuo stile e ottieni un codice sconto per il soggiorno." }],
  ["/it/esplora-chios/", { title: "Esplora Chios | Spiagge, villaggi e itinerari", description: "Organizza il viaggio a Chios con idee per spiagge, villaggi medievali, musei, gastronomia, natura e itinerari giornalieri da Kambos." }],
  ["/it/alloggio-chios/", { title: "Alloggio a Chios | Camere e appartamenti a Kambos", description: "Scopri camere e appartamenti a gestione familiare nella storica zona di Kambos, una base tranquilla vicino alla città, all’aeroporto e alle spiagge." }],
]);

const roomCorrections = new Map<string, DetailCorrection>([
  [economyDoubleRoomsIt.seo.canonicalPath, { title: "Camera doppia economy a Chios | Kambos", description: "Camera doppia economy per due ospiti a Kambos, con aria condizionata, Wi‑Fi, frigorifero e bagno privato per un soggiorno semplice e conveniente.", heroTitle: "Camera doppia economy a Chios", heroDescription: "Una camera semplice, tranquilla e conveniente per due ospiti che desiderano una base pratica a Kambos per esplorare l’isola." }],
  [standardDoubleRoomIt.seo.canonicalPath, { title: "Camere doppie e triple a Chios | Kambos", description: "Camere standard per 2–4 ospiti a Kambos, al piano terra con accesso al giardino o al primo piano con atmosfera da terrazza.", heroTitle: "Camere doppie e triple a Chios", heroDescription: "Camere confortevoli per coppie, amici e piccole famiglie, con scelta tra facile accesso al giardino e sistemazioni più luminose al primo piano." }],
  [familyChiosApartmentsIt.seo.canonicalPath, { title: "Appartamenti familiari a Chios | Cucina e spazio", description: "Appartamenti familiari di 40–45 m² a Kambos con cucina completa, camera separata, soggiorno e spazio per un massimo di quattro persone.", heroTitle: "Appartamenti familiari con cucina a Chios", heroDescription: "Appartamenti indipendenti con camera separata, cucina completa e soggiorno, ideali per famiglie e permanenze più lunghe." }],
]);

const beachCorrections: ReadonlyArray<readonly [string, DetailCorrection]> = [
  ["agia-dynami", { title: "Spiaggia di Agia Dynami | Baia turchese e accesso", description: "Scopri Agia Dynami nel sud di Chios: acqua turchese, piccola baia naturale, indicazioni di accesso e consigli per una giornata tranquilla al mare.", heroTitle: "Agia Dynami: una baia turchese nel sud di Chios", heroDescription: "Una piccola baia naturale vicino ai villaggi del mastice, amata per l’acqua limpida, i colori turchesi e l’atmosfera incontaminata." }],
  ["agia-fotia", { title: "Spiaggia di Agia Fotia | Acqua limpida e servizi", description: "Scopri Agia Fotia vicino a Kambos: costa di ciottoli, acqua limpida, lettini, caffè, taverne e accesso semplice dalla città di Chios.", heroTitle: "Agia Fotia: acqua limpida e atmosfera vivace", heroDescription: "Una spiaggia organizzata e molto amata, con ciottoli, acqua trasparente, lettini, caffè e taverne vicino a Kambos." }],
  ["avlonia", { title: "Spiaggia di Avlonia | Baia tranquilla nel sud di Chios", description: "Scopri Avlonia vicino a Pyrgi: costa naturale, acqua limpida, atmosfera tranquilla e una sosta lontana dalle spiagge più affollate.", heroTitle: "Avlonia: una piccola baia tranquilla", heroDescription: "Una baia naturale vicino a Pyrgi, adatta a chi cerca acqua limpida, silenzio e una giornata di mare più appartata." }],
  ["kato-fana", { title: "Spiaggia di Kato Fana | Natura e tranquillità", description: "Scopri Kato Fana nel sud-ovest di Chios: ambiente naturale, orizzonte aperto, zona archeologica vicina e una sosta tranquilla per il bagno.", heroTitle: "Kato Fana: natura, storia e mare aperto", heroDescription: "Una spiaggia tranquilla vicino all’area storica di Fana, con paesaggio naturale e ampi orizzonti sul mare Egeo." }],
  ["komi", { title: "Spiaggia di Komi | Sabbia, acqua bassa e ristoranti", description: "Scopri Komi nel sud-est di Chios: spiaggia sabbiosa, ingresso graduale in acqua, lettini, caffè, ristoranti e facile accesso per famiglie.", heroTitle: "Komi: sabbia, acqua bassa e atmosfera estiva", heroDescription: "Una delle spiagge organizzate più popolari del sud di Chios, con sabbia, acqua bassa, lettini, ristoranti e caffè sul mare." }],
  ["lefkathia", { title: "Spiaggia di Lefkathia | Acqua limpida vicino a Volissos", description: "Scopri Lefkathia vicino a Volissos e Limnia: acqua limpida, servizi organizzati, ombra dei tamerici e tramonti sulla costa nord-occidentale.", heroTitle: "Lefkathia: acqua limpida e tramonti vicino a Volissos", heroDescription: "Una bella baia della costa nord-occidentale, con acqua trasparente, tamerici, servizi e tramonti memorabili vicino a Volissos." }],
  ["lithi", { title: "Spiaggia di Lithi | Sabbia, famiglie e taverne di pesce", description: "Scopri Lithi nella parte occidentale di Chios: baia riparata, sabbia, acqua bassa, atmosfera familiare e taverne di pesce sul mare.", heroTitle: "Lithi: sabbia, acqua bassa e taverne di pesce", heroDescription: "Una baia riparata della costa occidentale, con spiaggia sabbiosa, acqua bassa e taverne di pesce a pochi passi dal mare." }],
  ["mavra-volia", { title: "Mavra Volia | Ciottoli vulcanici neri a Chios", description: "Scopri Mavra Volia vicino a Emporios: ciottoli vulcanici neri, acqua profonda e blu, tre baie e uno dei paesaggi costieri più iconici di Chios.", heroTitle: "Mavra Volia: ciottoli vulcanici neri e acqua profonda", heroDescription: "La spiaggia simbolo di Chios, famosa per i ciottoli vulcanici neri, l’acqua fresca e profonda e il paesaggio roccioso vicino a Emporios." }],
  ["emporios", { title: "Mavra Volia | Ciottoli vulcanici neri a Chios", description: "Scopri Mavra Volia vicino a Emporios: ciottoli vulcanici neri, acqua profonda e blu, tre baie e uno dei paesaggi costieri più iconici di Chios.", heroTitle: "Mavra Volia: ciottoli vulcanici neri e acqua profonda", heroDescription: "La spiaggia simbolo di Chios, famosa per i ciottoli vulcanici neri, l’acqua fresca e profonda e il paesaggio roccioso vicino a Emporios." }],
  ["nagos", { title: "Spiaggia di Nagos | Sorgenti, alberi e ciottoli", description: "Scopri Nagos vicino a Kardamyla: sorgenti d’acqua, platani, ciottoli colorati e un paesaggio fresco e verde sulla costa settentrionale di Chios.", heroTitle: "Nagos: la costa verde del nord di Chios", heroDescription: "Una spiaggia fresca e verde vicino a Kardamyla, dove sorgenti, platani, ciottoli colorati e mare limpido si incontrano." }],
  ["salagona", { title: "Spiaggia di Salagona | Baia turchese e tranquilla", description: "Scopri Salagona nel sud-ovest di Chios: acqua turchese, piccoli ciottoli, ambiente naturale e una baia tranquilla vicino ai villaggi medievali.", heroTitle: "Salagona: una baia turchese e appartata", heroDescription: "Una baia naturale del sud-ovest con acqua turchese, piccoli ciottoli e un’atmosfera tranquilla per nuotare e fare snorkeling." }],
  ["vroulidia", { title: "Spiaggia di Vroulidia | Piccola baia turchese", description: "Scopri Vroulidia vicino a Emporios: acqua turchese, vista sul mare aperto, costa naturale e una piccola baia per un bagno tranquillo.", heroTitle: "Vroulidia: una piccola baia turchese nel sud", heroDescription: "Una piccola spiaggia naturale vicino a Emporios, con acqua turchese, vista sul mare aperto e un’autentica sensazione di fuga." }],
];

const villageCorrections: ReadonlyArray<readonly [string, DetailCorrection]> = [
  ["pyrgi", { title: "Pyrgi a Chios | Xysta e vicoli medievali", description: "Scopri Pyrgi, il villaggio dipinto di Chios, con facciate decorate a xysta, vicoli medievali, una piazza vivace e una forte cultura del mastice.", heroTitle: "Pyrgi: il villaggio dipinto di Chios", heroDescription: "Uno dei villaggi più riconoscibili dell’isola, famoso per le decorazioni geometriche in bianco e nero, i vicoli medievali e la tradizione del mastice." }],
  ["mesta", { title: "Mesta a Chios | Villaggio medievale fortificato", description: "Scopri Mesta, uno dei villaggi medievali meglio conservati di Chios, con vicoli in pietra, passaggi ad arco e struttura difensiva compatta.", heroTitle: "Mesta: villaggio medievale fortificato", heroDescription: "Un labirinto di vicoli in pietra, archi e passaggi coperti all’interno di uno dei borghi fortificati meglio conservati di Chios." }],
  ["olympoi", { title: "Olympoi a Chios | Villaggio medievale del mastice", description: "Scopri Olympoi, un tranquillo villaggio del mastice vicino a Mesta, con vicoli in pietra, architettura tradizionale e struttura medievale.", heroTitle: "Olympoi: un tranquillo villaggio medievale", heroDescription: "Un autentico villaggio del mastice nel sud di Chios, con case in pietra, vicoli stretti e un’atmosfera più calma rispetto ai borghi più visitati." }],
  ["armolia", { title: "Armolia a Chios | Ceramica e artigianato locale", description: "Scopri Armolia, il villaggio della ceramica di Chios, con laboratori, oggetti fatti a mano, negozi locali e una posizione comoda nei Mastichochoria.", heroTitle: "Armolia: ceramica e artigianato di Chios", heroDescription: "Un villaggio del sud conosciuto per la tradizione della ceramica, i laboratori artigiani e la posizione strategica lungo l’itinerario del mastice." }],
  ["lagada", { title: "Lagada a Chios | Porto e taverne di pesce", description: "Scopri Lagada, un tranquillo villaggio costiero di Chios con piccolo porto, barche da pesca, vista sul mare e taverne di pesce sul lungomare.", heroTitle: "Lagada: porto, barche e taverne di pesce", heroDescription: "Un villaggio sul mare con piccolo porto, barche da pesca e taverne, ideale per una passeggiata e un pasto rilassante vicino all’acqua." }],
  ["vessa", { title: "Vessa a Chios | Tranquillo villaggio medievale", description: "Scopri Vessa, un tranquillo villaggio del mastice con vicoli in pietra, architettura tradizionale, atmosfera autentica e facile accesso verso Lithi.", heroTitle: "Vessa: un tranquillo villaggio medievale", heroDescription: "Un borgo del mastice con vicoli in pietra, architettura tradizionale e un ritmo locale tranquillo nel sud di Chios." }],
  ["volissos", { title: "Volissos a Chios | Castello, Amani e costa nord-occidentale", description: "Scopri Volissos, il principale villaggio del nord-ovest di Chios, con castello, vicoli tradizionali, panorami di Amani e accesso alle spiagge vicine.", heroTitle: "Volissos: castello, Amani e nord-ovest di Chios", heroDescription: "Il principale centro del nord-ovest, con un castello dominante, quartieri tradizionali e collegamenti verso Limnia, Managros e le spiagge di Amani." }],
];

const museumCorrections: ReadonlyArray<readonly [string, DetailCorrection]> = [
  ["mastice", { title: "Museo del Mastice di Chios | Produzione, storia e cultura", description: "Visita il Museo del Mastice di Chios e scopri l’albero, la coltivazione, la raccolta, la lavorazione e il ruolo culturale del mastice nell’isola.", heroTitle: "Museo del Mastice di Chios", heroDescription: "Un museo moderno dedicato alla coltivazione, alla produzione e all’identità culturale del mastice, il prodotto più caratteristico di Chios." }],
  ["mastic", { title: "Museo del Mastice di Chios | Produzione, storia e cultura", description: "Visita il Museo del Mastice di Chios e scopri l’albero, la coltivazione, la raccolta, la lavorazione e il ruolo culturale del mastice nell’isola.", heroTitle: "Museo del Mastice di Chios", heroDescription: "Un museo moderno dedicato alla coltivazione, alla produzione e all’identità culturale del mastice, il prodotto più caratteristico di Chios." }],
  ["archeologico", { title: "Museo Archeologico di Chios | Collezioni e storia antica", description: "Visita il Museo Archeologico di Chios e scopri reperti dell’isola dalla preistoria all’antichità, tra ceramiche, sculture e vita quotidiana.", heroTitle: "Museo Archeologico di Chios", heroDescription: "Una tappa culturale nella città di Chios per conoscere la storia antica dell’isola attraverso ceramiche, sculture e reperti archeologici." }],
  ["bizantin", { title: "Museo Bizantino di Chios | Arte e storia", description: "Visita il Museo Bizantino di Chios e scopri icone, sculture, affreschi e opere che raccontano la storia bizantina e post-bizantina dell’isola.", heroTitle: "Museo Bizantino di Chios", heroDescription: "Un museo nel centro di Chios dedicato all’arte bizantina e post-bizantina, con icone, sculture e testimonianze della storia religiosa dell’isola." }],
  ["korais", { title: "Biblioteca Korais a Chios | Libri rari e storia", description: "Visita la Biblioteca Korais di Chios e scopri libri rari, manoscritti, collezioni storiche e il patrimonio culturale legato ad Adamantios Korais.", heroTitle: "Biblioteca Korais di Chios", heroDescription: "Una delle biblioteche storiche più importanti della Grecia, con libri rari, manoscritti e collezioni legate alla cultura e all’istruzione di Chios." }],
  ["marittim", { title: "Museo Marittimo di Chios | Navigazione e storia navale", description: "Visita il Museo Marittimo di Chios e scopri modelli di navi, fotografie, strumenti e storie della lunga tradizione marinara dell’isola.", heroTitle: "Museo Marittimo di Chios", heroDescription: "Un museo dedicato alla forte identità marinara di Chios, con modelli di navi, fotografie, strumenti e testimonianze di famiglie di naviganti." }],
  ["folklore", { title: "Museo del Folklore di Kallimasia | Vita e tradizioni locali", description: "Visita il Museo del Folklore di Kallimasia e scopri oggetti, strumenti, abiti, mestieri e tradizioni della vita quotidiana nei villaggi di Chios.", heroTitle: "Museo del Folklore di Kallimasia", heroDescription: "Un museo locale che racconta la vita quotidiana dei villaggi di Chios attraverso strumenti, abiti, oggetti domestici e memoria culturale." }],
  ["kallimasia", { title: "Museo del Folklore di Kallimasia | Vita e tradizioni locali", description: "Visita il Museo del Folklore di Kallimasia e scopri oggetti, strumenti, abiti, mestieri e tradizioni della vita quotidiana nei villaggi di Chios.", heroTitle: "Museo del Folklore di Kallimasia", heroDescription: "Un museo locale che racconta la vita quotidiana dei villaggi di Chios attraverso strumenti, abiti, oggetti domestici e memoria culturale." }],
];

function cleanTags(tags: string[]): string[] {
  return tags.map((tag) => tag.replace(/^#/, "").replaceAll("_", " ").trim());
}

function applySeo(path: string, correction: SeoCorrection): void {
  seoSnippetOverrides.set(path, correction);
}

function findCorrection(path: string, corrections: ReadonlyArray<readonly [string, DetailCorrection]>): DetailCorrection | undefined {
  return corrections.find(([fragment]) => path.includes(fragment))?.[1];
}

function updateDetail(detail: LocalizedDetail, correction: DetailCorrection): void {
  Object.assign(detail.seo, { title: correction.title, description: correction.description });
  Object.assign(detail.hero, { title: correction.heroTitle, description: correction.heroDescription, tags: cleanTags(detail.hero.tags) });
  applySeo(detail.seo.canonicalPath, correction);
}

function updateRoom(data: RoomDetailData): void {
  const correction = roomCorrections.get(data.seo.canonicalPath);
  if (!correction) return;
  Object.assign(data.seo, { title: correction.title, description: correction.description });
  Object.assign(data.hero, { title: correction.heroTitle, description: correction.heroDescription });
  applySeo(data.seo.canonicalPath, correction);
}

function updatePageSeo(target: { seo: object }, path: string): void {
  const correction = pageSeo.get(path);
  if (correction) Object.assign(target.seo, correction);
}

export function applyItalianSeoCorrections(): void {
  for (const [path, correction] of pageSeo) applySeo(path, correction);

  updatePageSeo(roomsCategoryIt, roomsCategoryIt.seo.canonicalPath);
  updatePageSeo(contactPageIt, contactPageIt.seo.canonicalPath);
  updatePageSeo(ratesPageIt, ratesPageIt.seo.canonicalPath);
  updatePageSeo(dealsPageIt, dealsPageIt.seo.canonicalPath);
  updatePageSeo(chiosBeachesPageIt, chiosBeachesPageIt.seo.canonicalPath);
  updatePageSeo(chiosVillagesPageIt, chiosVillagesPageIt.seo.canonicalPath);
  updatePageSeo(chiosMuseumsPageIt, chiosMuseumsPageIt.seo.canonicalPath);
  updatePageSeo(familyBeachesPages.it, familyBeachesPages.it.seo.canonicalPath);
  updatePageSeo(beachLoversPages.it, beachLoversPages.it.seo.canonicalPath);
  updatePageSeo(kamposChiosPageIt, kamposChiosPageIt.seo.canonicalPath);

  const quizCorrection = pageSeo.get(chiosQuizSchemaPages.it.path);
  if (quizCorrection) Object.assign(chiosQuizSchemaPages.it, quizCorrection);

  updateRoom(economyDoubleRoomsIt);
  updateRoom(standardDoubleRoomIt);
  updateRoom(familyChiosApartmentsIt);

  for (const beach of localizedBeachDetails) {
    if (!beach.seo.canonicalPath.startsWith("/it/")) continue;
    const correction = findCorrection(beach.seo.canonicalPath, beachCorrections);
    if (correction) updateDetail(beach, correction);
    else beach.hero.tags = cleanTags(beach.hero.tags);
  }

  for (const village of localizedVillageDetails) {
    if (!village.seo.canonicalPath.startsWith("/it/")) continue;
    const correction = findCorrection(village.seo.canonicalPath, villageCorrections);
    if (correction) updateDetail(village, correction);
    else village.hero.tags = cleanTags(village.hero.tags);
  }

  for (const museum of localizedMuseumDetails) {
    if (!museum.seo.canonicalPath.startsWith("/it/")) continue;
    const correction = findCorrection(museum.seo.canonicalPath, museumCorrections);
    if (correction) updateDetail(museum, correction);
    else museum.hero.tags = cleanTags(museum.hero.tags);
  }
}
