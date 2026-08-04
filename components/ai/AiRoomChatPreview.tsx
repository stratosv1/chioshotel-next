"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Language = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";
type Step = "checkin" | "checkout" | "rooms" | "guests" | "preferences" | "searching" | "selecting" | "breakfast" | "complete" | "unavailable";
type Filter = "economy" | "noStairs" | "ground" | "first" | "kitchen" | "garden" | "balcony" | "family";
type Message = { id: string; role: "assistant" | "user"; content: string };
type Offer = {
  roomId: string;
  unitId: string;
  name: string;
  category: string;
  floor: string;
  maxGuests: number;
  features: string[];
  image: string;
  gallery?: string[];
  nights: number;
  originalTotal: number;
  directTotal: number;
  saving: number;
  recommendationRole?: "recommended" | "budget" | "comfort" | "alternative";
  recommendationTitle?: string;
  recommendationReason?: string;
};
type Choice = { group: number; guests: number; offer: Offer };
type Copy = {
  welcome: string;
  checkout: string;
  rooms: string;
  guests: (room: number) => string;
  preferences: string;
  searching: string;
  choose: (group: number, guests: number) => string;
  breakfast: string;
  summary: string;
  unavailable: string;
  placeholder: string;
  chooseAbove: string;
  invalidDate: string;
  invalidCheckout: string;
  invalidRooms: string;
  invalidGuests: string;
  online: string;
  live: string;
  details: string;
  select: string;
  selected: string;
  saving: string;
  total: string;
  perNight: string;
  noPreference: string;
  showRooms: string;
  yesBreakfast: string;
  noBreakfast: string;
  newSearch: string;
  back: string;
  roomWord: string;
  peopleWord: string;
  contactTitle: string;
  contactHelp: string;
  name: string;
  phone: string;
  email: string;
  send: string;
  sent: string;
  sendError: string;
  whatsapp: string;
  filters: Record<Filter, string>;
};

const LANGUAGES: Array<[Language, string]> = [
  ["el", "Ελληνικά"], ["en", "English"], ["de", "Deutsch"], ["fr", "Français"],
  ["it", "Italiano"], ["es", "Español"], ["tr", "Türkçe"],
];

const EN: Copy = {
  welcome: "Welcome to Voulamandis House 👋\nTell me when you would like to arrive in Chios and I’ll check live availability for you.",
  checkout: "Great. What date would you like to check out?",
  rooms: "How many rooms do you need?",
  guests: room => `How many guests will stay in room ${room}?`,
  preferences: "Anything important for your stay? Choose as many preferences as you like.",
  searching: "Checking live availability and the best direct prices…",
  choose: (group, guests) => `I found these options for group ${group} · ${guests} guests.`,
  breakfast: "Would you like to add homemade breakfast for €12 per guest, per day?",
  summary: "Everything is ready. Here is your stay request.",
  unavailable: "I couldn’t find a different available room for this part of your request. You can start again or ask reception to check manually.",
  placeholder: "Type a date or answer…",
  chooseAbove: "Choose one of the options above",
  invalidDate: "I couldn’t understand that date. Try “20 July” or “20/07”.",
  invalidCheckout: "Check-out must be after check-in.",
  invalidRooms: "Choose 1, 2 or 3 rooms.",
  invalidGuests: "Choose between 1 and 5 guests.",
  online: "Online now",
  live: "Live availability",
  details: "View details",
  select: "Choose room",
  selected: "Selected",
  saving: "You save",
  total: "Total",
  perNight: "per night",
  noPreference: "No preference",
  showRooms: "Show rooms",
  yesBreakfast: "Yes, add breakfast",
  noBreakfast: "No, thank you",
  newSearch: "New search",
  back: "Back to site",
  roomWord: "room",
  peopleWord: "guests",
  contactTitle: "Send this request to our team",
  contactHelp: "Enter your name and either a phone number or email.",
  name: "Name",
  phone: "Phone",
  email: "Email",
  send: "Send request",
  sent: "Your request was sent. We’ll contact you as soon as possible.",
  sendError: "The request could not be sent. Please try WhatsApp.",
  whatsapp: "WhatsApp",
  filters: { economy: "Economy", noStairs: "No stairs", ground: "Ground floor", first: "First floor", kitchen: "Kitchen", garden: "Garden", balcony: "Balcony", family: "Family" },
};

const COPY: Record<Language, Copy> = {
  en: EN,
  el: { ...EN,
    welcome: "Καλώς ήρθατε στο Voulamandis House 👋\nΠείτε μου πότε θέλετε να έρθετε στη Χίο και θα ελέγξω αμέσως τη διαθεσιμότητα.",
    checkout: "Τέλεια. Ποια ημέρα θα γίνει το check-out;", rooms: "Πόσα δωμάτια χρειάζεστε;", guests: room => `Πόσα άτομα θα μείνουν στο δωμάτιο ${room};`,
    preferences: "Υπάρχει κάτι σημαντικό για τη διαμονή σας; Επιλέξτε όσες προτιμήσεις θέλετε.", searching: "Ελέγχω τη live διαθεσιμότητα και τις καλύτερες direct τιμές…",
    choose: (group, guests) => `Βρήκα αυτές τις επιλογές για την ομάδα ${group} · ${guests} άτομα.`, breakfast: "Θέλετε να προσθέσετε σπιτικό πρωινό με 12€ ανά άτομο, ανά ημέρα;",
    summary: "Όλα είναι έτοιμα. Αυτή είναι η αίτηση διαμονής σας.", unavailable: "Δεν βρήκα διαφορετικό διαθέσιμο δωμάτιο για αυτό το μέρος της αναζήτησης. Μπορείτε να ξεκινήσετε ξανά ή να ζητήσετε χειροκίνητο έλεγχο.",
    placeholder: "Γράψτε ημερομηνία ή απάντηση…", chooseAbove: "Επιλέξτε μία από τις παραπάνω επιλογές", invalidDate: "Δεν κατάλαβα την ημερομηνία. Δοκιμάστε «20 Ιουλίου» ή «20/07».",
    invalidCheckout: "Το check-out πρέπει να είναι μετά το check-in.", invalidRooms: "Επιλέξτε 1, 2 ή 3 δωμάτια.", invalidGuests: "Επιλέξτε από 1 έως 5 άτομα.", online: "Online τώρα", live: "Live διαθεσιμότητα",
    details: "Λεπτομέρειες", select: "Επιλογή δωματίου", selected: "Επιλέχθηκε", saving: "Εξοικονομείτε", total: "Σύνολο", perNight: "ανά βραδιά", noPreference: "Χωρίς προτίμηση", showRooms: "Προβολή δωματίων",
    yesBreakfast: "Ναι, προσθήκη", noBreakfast: "Όχι, ευχαριστώ", newSearch: "Νέα αναζήτηση", back: "Επιστροφή στο site", roomWord: "δωμάτιο", peopleWord: "άτομα",
    contactTitle: "Στείλτε την αίτηση στην ομάδα μας", contactHelp: "Γράψτε το όνομά σας και ένα τηλέφωνο ή email.", name: "Όνομα", phone: "Τηλέφωνο", email: "Email", send: "Αποστολή αιτήματος",
    sent: "Το αίτημά σας στάλθηκε. Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.", sendError: "Δεν ήταν δυνατή η αποστολή. Χρησιμοποιήστε το WhatsApp.",
    filters: { economy: "Οικονομικό", noStairs: "Χωρίς σκάλες", ground: "Ισόγειο", first: "Πρώτος όροφος", kitchen: "Κουζίνα", garden: "Κήπος", balcony: "Μπαλκόνι", family: "Οικογενειακό" },
  },
  de: { ...EN, welcome: "Willkommen im Voulamandis House 👋\nWann möchten Sie nach Chios anreisen? Ich prüfe sofort die Live-Verfügbarkeit.", checkout: "Perfekt. Wann möchten Sie abreisen?", rooms: "Wie viele Zimmer benötigen Sie?", guests: room => `Wie viele Gäste übernachten in Zimmer ${room}?`, preferences: "Was ist für Ihren Aufenthalt wichtig?", searching: "Live-Verfügbarkeit und Direktpreise werden geprüft…", choose: (group, guests) => `Diese Optionen passen zu Gruppe ${group} · ${guests} Gäste.`, breakfast: "Möchten Sie hausgemachtes Frühstück für 12 € pro Person und Tag hinzufügen?", summary: "Alles ist bereit. Hier ist Ihre Aufenthaltsanfrage.", placeholder: "Datum oder Antwort eingeben…", chooseAbove: "Wählen Sie eine Option oben", online: "Jetzt online", live: "Live-Verfügbarkeit", details: "Details", select: "Zimmer wählen", saving: "Sie sparen", total: "Gesamt", noPreference: "Keine Präferenz", showRooms: "Zimmer anzeigen", yesBreakfast: "Ja, hinzufügen", noBreakfast: "Nein, danke", newSearch: "Neue Suche", back: "Zurück zur Website", roomWord: "Zimmer", peopleWord: "Gäste", contactTitle: "Anfrage an unser Team senden", contactHelp: "Name und Telefon oder E-Mail eingeben.", name: "Name", phone: "Telefon", email: "E-Mail", send: "Anfrage senden", sent: "Ihre Anfrage wurde gesendet.", filters: { economy: "Preisgünstig", noStairs: "Keine Treppen", ground: "Erdgeschoss", first: "Erster Stock", kitchen: "Küche", garden: "Garten", balcony: "Balkon", family: "Familie" } },
  fr: { ...EN, welcome: "Bienvenue au Voulamandis House 👋\nQuand souhaitez-vous arriver à Chios ? Je vérifie les disponibilités en direct.", checkout: "Parfait. Quelle est votre date de départ ?", rooms: "Combien de chambres souhaitez-vous ?", guests: room => `Combien de personnes dans la chambre ${room} ?`, preferences: "Qu’est-ce qui est important pour votre séjour ?", searching: "Vérification des disponibilités et des tarifs directs…", choose: (group, guests) => `Voici les options pour le groupe ${group} · ${guests} personnes.`, breakfast: "Ajouter le petit-déjeuner maison à 12 € par personne et par jour ?", summary: "Tout est prêt. Voici votre demande.", placeholder: "Écrivez une date ou une réponse…", chooseAbove: "Choisissez une option ci-dessus", online: "En ligne", live: "Disponibilités en direct", details: "Détails", select: "Choisir", saving: "Économie", total: "Total", noPreference: "Sans préférence", showRooms: "Voir les chambres", yesBreakfast: "Oui, ajouter", noBreakfast: "Non merci", newSearch: "Nouvelle recherche", back: "Retour au site", roomWord: "chambre", peopleWord: "personnes", contactTitle: "Envoyer la demande à notre équipe", contactHelp: "Indiquez votre nom et un téléphone ou e-mail.", name: "Nom", phone: "Téléphone", email: "E-mail", send: "Envoyer", sent: "Votre demande a été envoyée.", filters: { economy: "Économique", noStairs: "Sans escaliers", ground: "Rez-de-chaussée", first: "Premier étage", kitchen: "Cuisine", garden: "Jardin", balcony: "Balcon", family: "Famille" } },
  it: { ...EN, welcome: "Benvenuti a Voulamandis House 👋\nQuando desideri arrivare a Chios? Controllo subito la disponibilità live.", checkout: "Perfetto. Qual è la data di check-out?", rooms: "Quante camere ti servono?", guests: room => `Quante persone soggiorneranno nella camera ${room}?`, preferences: "Cosa è importante per il soggiorno?", searching: "Controllo disponibilità live e prezzi diretti…", choose: (group, guests) => `Ecco le opzioni per il gruppo ${group} · ${guests} persone.`, breakfast: "Vuoi aggiungere la colazione fatta in casa a 12 € a persona al giorno?", summary: "Tutto pronto. Ecco la richiesta.", placeholder: "Scrivi una data o risposta…", chooseAbove: "Scegli un’opzione qui sopra", online: "Online", live: "Disponibilità live", details: "Dettagli", select: "Scegli camera", saving: "Risparmio", total: "Totale", noPreference: "Nessuna preferenza", showRooms: "Mostra camere", yesBreakfast: "Sì, aggiungi", noBreakfast: "No, grazie", newSearch: "Nuova ricerca", back: "Torna al sito", roomWord: "camera", peopleWord: "persone", contactTitle: "Invia la richiesta al team", contactHelp: "Inserisci nome e telefono o email.", name: "Nome", phone: "Telefono", email: "Email", send: "Invia richiesta", sent: "La richiesta è stata inviata.", filters: { economy: "Economica", noStairs: "Senza scale", ground: "Piano terra", first: "Primo piano", kitchen: "Cucina", garden: "Giardino", balcony: "Balcone", family: "Famiglia" } },
  es: { ...EN, welcome: "Bienvenido a Voulamandis House 👋\n¿Cuándo quieres llegar a Chios? Comprobaré la disponibilidad en vivo.", checkout: "Perfecto. ¿Cuál es la fecha de salida?", rooms: "¿Cuántas habitaciones necesitas?", guests: room => `¿Cuántas personas estarán en la habitación ${room}?`, preferences: "¿Qué es importante para tu estancia?", searching: "Comprobando disponibilidad y precios directos…", choose: (group, guests) => `Estas son las opciones para el grupo ${group} · ${guests} personas.`, breakfast: "¿Añadir desayuno casero por 12 € por persona y día?", summary: "Todo listo. Esta es tu solicitud.", placeholder: "Escribe una fecha o respuesta…", chooseAbove: "Elige una opción arriba", online: "En línea", live: "Disponibilidad en vivo", details: "Detalles", select: "Elegir habitación", saving: "Ahorras", total: "Total", noPreference: "Sin preferencia", showRooms: "Ver habitaciones", yesBreakfast: "Sí, añadir", noBreakfast: "No, gracias", newSearch: "Nueva búsqueda", back: "Volver al sitio", roomWord: "habitación", peopleWord: "personas", contactTitle: "Envía la solicitud al equipo", contactHelp: "Escribe nombre y teléfono o email.", name: "Nombre", phone: "Teléfono", email: "Email", send: "Enviar solicitud", sent: "La solicitud fue enviada.", filters: { economy: "Económica", noStairs: "Sin escaleras", ground: "Planta baja", first: "Primera planta", kitchen: "Cocina", garden: "Jardín", balcony: "Balcón", family: "Familia" } },
  tr: { ...EN, welcome: "Voulamandis House’a hoş geldiniz 👋\nSakız Adası’na ne zaman gelmek istersiniz? Canlı müsaitliği kontrol edeyim.", checkout: "Harika. Çıkış tarihiniz nedir?", rooms: "Kaç odaya ihtiyacınız var?", guests: room => `${room}. odada kaç kişi kalacak?`, preferences: "Konaklamanız için önemli bir tercih var mı?", searching: "Canlı müsaitlik ve direkt fiyatlar kontrol ediliyor…", choose: (group, guests) => `${group}. grup · ${guests} kişi için seçenekler.`, breakfast: "Kişi başı günlük 12 € ile ev yapımı kahvaltı eklemek ister misiniz?", summary: "Her şey hazır. Talebiniz burada.", placeholder: "Tarih veya cevap yazın…", chooseAbove: "Yukarıdaki seçeneklerden birini seçin", online: "Çevrimiçi", live: "Canlı müsaitlik", details: "Detaylar", select: "Odayı seç", saving: "Tasarruf", total: "Toplam", noPreference: "Tercihim yok", showRooms: "Odaları göster", yesBreakfast: "Evet, ekle", noBreakfast: "Hayır, teşekkürler", newSearch: "Yeni arama", back: "Siteye dön", roomWord: "oda", peopleWord: "kişi", contactTitle: "Talebi ekibimize gönderin", contactHelp: "Adınızı ve telefon veya e-posta girin.", name: "Ad", phone: "Telefon", email: "E-posta", send: "Talebi gönder", sent: "Talebiniz gönderildi.", filters: { economy: "Ekonomik", noStairs: "Merdivensiz", ground: "Zemin kat", first: "Birinci kat", kitchen: "Mutfak", garden: "Bahçe", balcony: "Balkon", family: "Aile" } },
};

const WHATSAPP_NUMBER = "306944474226";
const FILTER_KEYS: Filter[] = ["economy", "noStairs", "ground", "first", "kitchen", "garden", "balcony", "family"];
const RANK: Record<NonNullable<Offer["recommendationRole"]>, number> = { recommended: 0, budget: 1, comfort: 2, alternative: 3 };

function detectLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const supported = LANGUAGES.map(([value]) => value);
  const query = new URLSearchParams(window.location.search).get("lang")?.toLowerCase().split("-")[0];
  const documentLanguage = document.documentElement.lang?.toLowerCase().split("-")[0];
  return supported.includes(query as Language) ? query as Language : supported.includes(documentLanguage as Language) ? documentLanguage as Language : "en";
}
function id() { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function nightsBetween(a: string, b: string) { return Math.round((new Date(`${b}T12:00:00Z`).getTime() - new Date(`${a}T12:00:00Z`).getTime()) / 86400000); }
function money(value: number, language: Language) {
  const locale = { el: "el-GR", en: "en-GB", de: "de-DE", fr: "fr-FR", it: "it-IT", es: "es-ES", tr: "tr-TR" }[language];
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}
function preferenceScore(offer: Offer, filters: Filter[]) {
  const text = `${offer.name} ${offer.category} ${offer.floor} ${(offer.features || []).join(" ")}`.toLowerCase();
  const tests: Record<Filter, RegExp> = {
    economy: /econom|οικονομ|économ|preisgünst|ekonom/,
    noStairs: /χωρίς σκάλ|no stairs|keine treppen|sans escaliers|senza scale|sin escaleras|merdivensiz/,
    ground: /ισόγει|ground floor|erdgeschoss|rez-de-chaussée|piano terra|planta baja|zemin kat/,
    first: /πρώτ|first floor|erster stock|premier étage|primo piano|primera planta|birinci kat/,
    kitchen: /kitchen|κουζ|küche|cuisine|cucina|mutfak/,
    garden: /garden|κήπ|αυλ|garten|jardin|giardino|patio|bahçe|avlu/,
    balcony: /balcon|μπαλκόν|balkon/,
    family: /family|οικογεν|familien|familial|familiare|familiar|aile/,
  };
  return filters.reduce((total, filter) => total + (tests[filter].test(text) ? 10 : 0), 0);
}

export function AiRoomChatPreview() {
  const [language, setLanguage] = useState<Language>("en");
  const copy = COPY[language];
  const [step, setStep] = useState<Step>("checkin");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [groups, setGroups] = useState<number[]>([]);
  const [guestIndex, setGuestIndex] = useState(0);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [offers, setOffers] = useState<Offer[][]>([]);
  const [activeGroup, setActiveGroup] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [breakfast, setBreakfast] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<Offer | null>(null);
  const [photo, setPhoto] = useState(0);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const feedRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const nights = checkin && checkout ? Math.max(0, nightsBetween(checkin, checkout)) : 0;
  const chosenKeys = useMemo(() => new Set(choices.map(choice => `${choice.offer.roomId}:${choice.offer.unitId}`)), [choices]);
  const visibleOffers = useMemo(() => [...(offers[activeGroup] || [])]
    .filter(offer => !chosenKeys.has(`${offer.roomId}:${offer.unitId}`))
    .sort((a, b) => (RANK[a.recommendationRole || "alternative"] - RANK[b.recommendationRole || "alternative"]) || preferenceScore(b, filters) - preferenceScore(a, filters) || a.directTotal - b.directTotal),
  [offers, activeGroup, chosenKeys, filters]);
  const currentOffer = visibleOffers[cardIndex] || visibleOffers[0];
  const roomTotal = choices.reduce((total, choice) => total + choice.offer.directTotal, 0);
  const breakfastTotal = breakfast ? groups.reduce((total, guests) => total + guests, 0) * nights * 12 : 0;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const detected = detectLanguage();
    setLanguage(detected);
    setMessages([{ id: id(), role: "assistant", content: COPY[detected].welcome }]);
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    const sync = () => document.documentElement.style.setProperty("--ai-chat-height", `${Math.round(viewport?.height || window.innerHeight)}px`);
    sync();
    viewport?.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
    return () => { viewport?.removeEventListener("resize", sync); window.removeEventListener("resize", sync); document.documentElement.style.removeProperty("--ai-chat-height"); };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" }));
    return () => window.cancelAnimationFrame(frame);
  }, [messages, step, typing, activeGroup, cardIndex, sendStatus]);

  const addMessage = (role: Message["role"], content: string) => setMessages(current => [...current, { id: id(), role, content }]);

  function restart(nextLanguage = language) {
    setLanguage(nextLanguage);
    setStep("checkin"); setMessages([{ id: id(), role: "assistant", content: COPY[nextLanguage].welcome }]);
    setInput(""); setCheckin(""); setCheckout(""); setRoomCount(1); setGroups([]); setGuestIndex(0); setFilters([]);
    setOffers([]); setActiveGroup(0); setCardIndex(0); setChoices([]); setBreakfast(false); setError(""); setDetail(null); setSendStatus("idle");
  }

  async function interpretDate(value: string) {
    const response = await fetch("/api/ai-assistant/smart", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, { role: "user", content: value }], search: { checkin: checkin || undefined, checkout: checkout || undefined }, language }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload) throw new Error("date interpretation failed");
    return payload as { answer?: string; search?: { checkin?: string; checkout?: string } };
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || !["checkin", "checkout", "rooms", "guests"].includes(step)) return;
    setInput(""); setError(""); addMessage("user", value);

    if (step === "checkin" || step === "checkout") {
      const previous = step;
      setTyping(true);
      try {
        const result = await interpretDate(value);
        const nextCheckin = result.search?.checkin || checkin;
        const nextCheckout = result.search?.checkout || checkout;
        if (previous === "checkin" && !nextCheckin) throw new Error("missing checkin");
        if (previous === "checkout" && !nextCheckout) throw new Error("missing checkout");
        if (nextCheckin) setCheckin(nextCheckin);
        if (nextCheckout) setCheckout(nextCheckout);
        if (nextCheckin && nextCheckout) {
          if (nightsBetween(nextCheckin, nextCheckout) < 1) { setStep("checkout"); setError(copy.invalidCheckout); return; }
          setStep("rooms"); addMessage("assistant", copy.rooms);
        } else {
          setStep("checkout"); addMessage("assistant", result.answer || copy.checkout);
        }
      } catch {
        setStep(previous); setError(copy.invalidDate);
      } finally { setTyping(false); }
      return;
    }

    const number = Number(value.match(/\d+/)?.[0]);
    if (step === "rooms") {
      if (!Number.isInteger(number) || number < 1 || number > 3) { setError(copy.invalidRooms); return; }
      chooseRoomCount(number, false); return;
    }
    if (!Number.isInteger(number) || number < 1 || number > 5) { setError(copy.invalidGuests); return; }
    chooseGuestCount(number, false);
  }

  function chooseRoomCount(value: number, addUser = true) {
    if (addUser) addMessage("user", `${value} ${copy.roomWord}${value > 1 ? "s" : ""}`);
    setRoomCount(value); setGroups([]); setGuestIndex(0); setStep("guests"); addMessage("assistant", copy.guests(1));
  }

  function chooseGuestCount(value: number, addUser = true) {
    if (addUser) addMessage("user", `${value} ${copy.peopleWord}`);
    const next = [...groups, value];
    setGroups(next);
    if (guestIndex + 1 < roomCount) { setGuestIndex(index => index + 1); addMessage("assistant", copy.guests(guestIndex + 2)); }
    else { setStep("preferences"); addMessage("assistant", copy.preferences); }
  }

  async function searchRooms() {
    setStep("searching"); setTyping(true); setError("");
    try {
      const results = await Promise.all(groups.map(async guests => {
        const response = await fetch("/api/ai-assistant/smart", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: `Check live availability from ${checkin} to ${checkout} for ${guests} guests.` }], search: { checkin, checkout, guests }, language }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload) throw new Error("availability failed");
        return Array.isArray(payload.offers) ? payload.offers as Offer[] : [];
      }));
      setOffers(results); setActiveGroup(0); setCardIndex(0); setTyping(false);
      if (!(results[0] || []).length) { setStep("unavailable"); addMessage("assistant", copy.unavailable); }
      else { setStep("selecting"); addMessage("assistant", copy.choose(1, groups[0])); }
    } catch { setTyping(false); setStep("preferences"); setError(copy.sendError); }
  }

  function selectOffer(offer: Offer) {
    const nextChoices = [...choices, { group: activeGroup + 1, guests: groups[activeGroup], offer }];
    setChoices(nextChoices); setDetail(null); addMessage("user", `${copy.selected}: ${offer.name}`);
    if (activeGroup + 1 < roomCount) {
      const nextGroup = activeGroup + 1;
      const nextKeys = new Set(nextChoices.map(choice => `${choice.offer.roomId}:${choice.offer.unitId}`));
      const available = (offers[nextGroup] || []).filter(item => !nextKeys.has(`${item.roomId}:${item.unitId}`));
      if (!available.length) { setStep("unavailable"); addMessage("assistant", copy.unavailable); return; }
      setActiveGroup(nextGroup); setCardIndex(0); addMessage("assistant", copy.choose(nextGroup + 1, groups[nextGroup]));
    } else { setStep("breakfast"); addMessage("assistant", copy.breakfast); }
  }

  function chooseBreakfast(value: boolean) {
    setBreakfast(value); addMessage("user", value ? copy.yesBreakfast : copy.noBreakfast); setStep("complete"); addMessage("assistant", copy.summary);
  }

  const contactSummary = `${checkin} → ${checkout}\n${groups.reduce((total, value) => total + value, 0)} ${copy.peopleWord}\n${choices.map(choice => `${choice.offer.name}: ${money(choice.offer.directTotal, language)}`).join("\n")}\n${copy.total}: ${money(roomTotal + breakfastTotal, language)}`;
  const contactMessage = `${copy.contactTitle}\n\n${contactSummary}\n\n${copy.name}: ${contact.name}\n${copy.phone}: ${contact.phone || "—"}\n${copy.email}: ${contact.email || "—"}`;
  const canSend = Boolean(contact.name.trim() && (contact.phone.trim() || contact.email.trim()));

  async function sendRequest() {
    if (!canSend || sendStatus === "sending") return;
    setSendStatus("sending");
    try {
      const response = await fetch("/api/ai-assistant/summary-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject: `AI Room Finder — ${contact.name}`, message: contactMessage, guest: contact }) });
      if (!response.ok) throw new Error("send failed");
      setSendStatus("sent");
    } catch { setSendStatus("error"); }
  }

  const inputEnabled = ["checkin", "checkout", "rooms", "guests"].includes(step) && !typing;
  const homeHref = language === "en" ? "/" : `/${language}/`;

  return (
    <main className="flex h-[var(--ai-chat-height,100dvh)] flex-col overflow-hidden bg-[#f6f2eb] text-[#29251f]">
      <style jsx global>{`
        @keyframes ai-message-in { from { opacity: 0; transform: translateY(10px) scale(.985); } to { opacity: 1; transform: none; } }
        @keyframes ai-sheet-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes ai-dot { 0%, 60%, 100% { transform: translateY(0); opacity: .35; } 30% { transform: translateY(-4px); opacity: 1; } }
        .ai-message-in { animation: ai-message-in .24s cubic-bezier(.22,.8,.3,1) both; }
        .ai-sheet-in { animation: ai-sheet-in .3s cubic-bezier(.22,.8,.3,1) both; }
        .ai-scroll { scrollbar-width: thin; scrollbar-color: #d4c9ba transparent; }
      `}</style>

      <header className="relative z-30 shrink-0 border-b border-[#ddd4c8] bg-[#fbf8f3]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-3xl items-center gap-3 px-3 sm:px-5">
          <a href={homeHref} aria-label={copy.back} title={copy.back} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl transition hover:bg-[#eee7dc] active:scale-95">←</a>
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="Voulamandis House" fill sizes="44px" className="object-cover" /></div>
          <div className="min-w-0 flex-1"><h1 className="truncate text-[16px] font-bold">Voulamandis House</h1><div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#746b60]"><span className="h-2 w-2 rounded-full bg-[#718b52]" />{copy.online} · {copy.live}</div></div>
          <select value={language} onChange={event => restart(event.target.value as Language)} aria-label="Language" className="h-9 rounded-full border border-[#d8cec1] bg-white px-2 text-xs font-bold outline-none transition focus:border-[#697451]">
            {LANGUAGES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button type="button" onClick={() => restart()} aria-label={copy.newSearch} title={copy.newSearch} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition hover:bg-[#eee7dc] active:scale-95">↻</button>
        </div>
      </header>

      {(checkin || groups.length > 0) && <div className="relative z-20 shrink-0 border-b border-[#e5ddd2] bg-[#f9f5ef] px-3 py-2"><div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto text-xs font-semibold text-[#625b52]">
        {checkin && <span className="whitespace-nowrap rounded-full border border-[#ddd3c6] bg-white px-3 py-1.5">📅 {checkin}{checkout ? ` → ${checkout}` : ""}</span>}
        {groups.length > 0 && <span className="whitespace-nowrap rounded-full border border-[#ddd3c6] bg-white px-3 py-1.5">👥 {groups.reduce((a, b) => a + b, 0)} {copy.peopleWord}</span>}
        {roomCount > 0 && groups.length > 0 && <span className="whitespace-nowrap rounded-full border border-[#ddd3c6] bg-white px-3 py-1.5">🛏️ {roomCount} {copy.roomWord}</span>}
      </div></div>}

      <div ref={feedRef} data-ai-chat-scroll="true" className="ai-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth">
        <div data-ai-conversation-feed="true" className="mx-auto flex min-h-full max-w-3xl flex-col px-3 pb-7 pt-5 sm:px-5">
          <div className="space-y-3.5">
            {messages.map(message => <div key={message.id} className={`ai-message-in flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && <div className="relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#d7cdc0]"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="" fill sizes="32px" className="object-cover" /></div>}
              <div className={`max-w-[84%] whitespace-pre-line px-4 py-3 text-[15px] leading-6 shadow-sm sm:max-w-[72%] ${message.role === "user" ? "rounded-[20px] rounded-br-[6px] bg-[#6b604f] text-white" : "rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white text-[#302b25]"}`}>{message.content}</div>
            </div>)}

            {typing && <div className="ai-message-in flex items-end gap-2"><div className="relative mb-1 h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#d7cdc0]"><Image src="/images/welcome/voulamandis-welcome-hero.webp" alt="" fill sizes="32px" className="object-cover" /></div><div className="rounded-[20px] rounded-bl-[6px] border border-[#dfd6ca] bg-white px-4 py-3 shadow-sm"><span className="sr-only">{copy.searching}</span><div className="flex h-5 items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#746b60] [animation:ai-dot_1.1s_infinite]" /><span className="h-1.5 w-1.5 rounded-full bg-[#746b60] [animation:ai-dot_1.1s_.15s_infinite]" /><span className="h-1.5 w-1.5 rounded-full bg-[#746b60] [animation:ai-dot_1.1s_.3s_infinite]" /></div></div></div>}

            {step === "rooms" && <QuickReplies values={[1, 2, 3]} onSelect={chooseRoomCount} label={value => `${value} ${copy.roomWord}${value > 1 ? "s" : ""}`} />}
            {step === "guests" && <QuickReplies values={[1, 2, 3, 4, 5]} onSelect={chooseGuestCount} label={value => `${value} ${copy.peopleWord}`} />}

            {step === "preferences" && <section className="ai-message-in ml-10 rounded-[22px] border border-[#dfd6ca] bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">{FILTER_KEYS.map(filter => <button type="button" key={filter} onClick={() => setFilters(current => current.includes(filter) ? current.filter(item => item !== filter) : [...current, filter])} className={`rounded-full border px-3 py-2 text-xs font-bold transition duration-200 active:scale-95 ${filters.includes(filter) ? "border-[#66714f] bg-[#66714f] text-white shadow-sm" : "border-[#d9cfc2] bg-[#fbf9f6] text-[#61594f] hover:border-[#9b907f]"}`}>{copy.filters[filter]}</button>)}</div>
              <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setFilters([]); void searchRooms(); }} className="min-h-12 rounded-2xl border border-[#d9cfc2] bg-white px-3 text-sm font-bold transition active:scale-[.98]">{copy.noPreference}</button><button type="button" onClick={() => void searchRooms()} className="min-h-12 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#596244] active:scale-[.98]">{copy.showRooms}</button></div>
            </section>}

            {step === "selecting" && currentOffer && <section className="ai-message-in ml-0 sm:ml-10">
              <div className="mb-2 flex items-center justify-between px-1 text-xs font-bold text-[#6f665b]"><span>{currentOffer.recommendationTitle || copy.choose(activeGroup + 1, groups[activeGroup])}</span><span>{cardIndex + 1}/{visibleOffers.length}</span></div>
              <article className="overflow-hidden rounded-[26px] border border-[#dcd2c5] bg-white shadow-[0_16px_45px_rgba(70,55,35,.10)]">
                <div className="relative h-52 sm:h-64"><Image src={currentOffer.image} alt={currentOffer.name} fill sizes="(max-width:640px) 100vw, 700px" className="object-cover" priority={false} /><div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />{visibleOffers.length > 1 && <><button type="button" onClick={() => setCardIndex(index => (index - 1 + visibleOffers.length) % visibleOffers.length)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-2xl shadow-lg backdrop-blur transition active:scale-90">‹</button><button type="button" onClick={() => setCardIndex(index => (index + 1) % visibleOffers.length)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-2xl shadow-lg backdrop-blur transition active:scale-90">›</button></>}</div>
                <div className="p-4 sm:p-5"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="truncate text-xl font-bold">{currentOffer.name}</h2><p className="mt-1 text-sm text-[#746b60]">{currentOffer.category}</p></div><div className="shrink-0 text-right"><p className="text-xs text-[#b05252] line-through">{money(currentOffer.originalTotal, language)}</p><p className="text-xl font-black text-[#5f7448]">{money(currentOffer.directTotal, language)}</p></div></div>
                  {currentOffer.recommendationReason && <p className="mt-3 rounded-xl bg-[#f2f4ea] px-3 py-2 text-sm font-semibold leading-5 text-[#56643f]">✨ {currentOffer.recommendationReason}</p>}
                  <div className="mt-3 flex flex-wrap gap-1.5">{[currentOffer.floor, ...(currentOffer.features || []).slice(0, 3)].filter(Boolean).map(item => <span key={item} className="rounded-full bg-[#f1ede7] px-2.5 py-1 text-[11px] font-semibold text-[#665e55]">{item}</span>)}</div>
                  {currentOffer.saving > 0 && <p className="mt-3 text-sm font-bold text-[#5f7448]">{copy.saving}: {money(currentOffer.saving, language)}</p>}
                  <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setDetail(currentOffer); setPhoto(0); }} className="min-h-12 rounded-2xl border border-[#d8cec1] bg-white px-3 text-sm font-bold transition active:scale-[.98]">{copy.details}</button><button type="button" onClick={() => selectOffer(currentOffer)} className="min-h-12 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#596244] active:scale-[.98]">{copy.select}</button></div>
                </div>
              </article>
              {visibleOffers.length > 1 && <div className="mt-3 flex justify-center gap-1.5">{visibleOffers.map((_, index) => <button type="button" aria-label={`Room ${index + 1}`} key={index} onClick={() => setCardIndex(index)} className={`h-1.5 rounded-full transition-all ${index === cardIndex ? "w-6 bg-[#66714f]" : "w-1.5 bg-[#cfc5b8]"}`} />)}</div>}
            </section>}

            {step === "breakfast" && <section className="ai-message-in ml-10 flex flex-wrap gap-2"><button type="button" onClick={() => chooseBreakfast(true)} className="rounded-full bg-[#66714f] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95">{copy.yesBreakfast}</button><button type="button" onClick={() => chooseBreakfast(false)} className="rounded-full border border-[#d8cec1] bg-white px-4 py-2.5 text-sm font-bold transition active:scale-95">{copy.noBreakfast}</button></section>}

            {step === "unavailable" && <section className="ai-message-in ml-10 rounded-[22px] border border-[#dfd6ca] bg-white p-4 shadow-sm"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => restart()} className="min-h-12 rounded-2xl border border-[#d8cec1] font-bold">{copy.newSearch}</button><button type="button" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.unavailable)}`, "_blank", "noopener,noreferrer")} className="min-h-12 rounded-2xl bg-[#287d4f] font-bold text-white">{copy.whatsapp}</button></div></section>}

            {step === "complete" && <section className="ai-message-in ml-0 overflow-hidden rounded-[26px] border border-[#dcd2c5] bg-white shadow-[0_16px_45px_rgba(70,55,35,.10)] sm:ml-10">
              <div className="border-b border-[#eee7de] bg-[#faf7f2] p-4"><div className="flex items-center justify-between"><h2 className="text-lg font-black">{copy.summary}</h2><button type="button" onClick={() => restart()} className="text-xs font-bold underline underline-offset-4">{copy.newSearch}</button></div><p className="mt-2 text-sm text-[#746b60]">📅 {checkin} → {checkout} · {nights} nights</p></div>
              <div className="p-4">{choices.map(choice => <div key={choice.group} className="flex items-center gap-3 border-b border-[#eee7de] py-3 first:pt-0"><div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-xl"><Image src={choice.offer.image} alt={choice.offer.name} fill sizes="72px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate font-bold">{choice.offer.name}</p><p className="text-xs text-[#746b60]">{choice.guests} {copy.peopleWord}</p></div><strong className="text-[#5f7448]">{money(choice.offer.directTotal, language)}</strong></div>)}
                {breakfast && <div className="flex justify-between border-b border-[#eee7de] py-3 text-sm"><span>🥐 Breakfast</span><strong>{money(breakfastTotal, language)}</strong></div>}
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f1ede7] p-4 text-lg"><span className="font-bold">{copy.total}</span><strong className="text-xl text-[#5f7448]">{money(roomTotal + breakfastTotal, language)}</strong></div>
                <div className="mt-5"><h3 className="font-black">{copy.contactTitle}</h3><p className="mt-1 text-sm leading-6 text-[#746b60]">{copy.contactHelp}</p><div className="mt-3 grid gap-2 sm:grid-cols-3"><input value={contact.name} onChange={event => setContact(current => ({ ...current, name: event.target.value }))} placeholder={copy.name} className="min-h-12 rounded-xl border border-[#d8cec1] bg-white px-3 outline-none focus:border-[#66714f]" /><input value={contact.phone} onChange={event => setContact(current => ({ ...current, phone: event.target.value }))} placeholder={copy.phone} type="tel" className="min-h-12 rounded-xl border border-[#d8cec1] bg-white px-3 outline-none focus:border-[#66714f]" /><input value={contact.email} onChange={event => setContact(current => ({ ...current, email: event.target.value }))} placeholder={copy.email} type="email" className="min-h-12 rounded-xl border border-[#d8cec1] bg-white px-3 outline-none focus:border-[#66714f]" /></div>
                  <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" disabled={!canSend || sendStatus === "sending"} onClick={() => void sendRequest()} className="min-h-12 rounded-2xl bg-[#66714f] px-3 text-sm font-bold text-white disabled:opacity-40">{sendStatus === "sending" ? "…" : copy.send}</button><button type="button" disabled={!canSend} onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(contactMessage)}`, "_blank", "noopener,noreferrer")} className="min-h-12 rounded-2xl bg-[#287d4f] px-3 text-sm font-bold text-white disabled:opacity-40">{copy.whatsapp}</button></div>
                  {sendStatus === "sent" && <p className="mt-3 rounded-xl bg-[#eef5e8] p-3 text-sm font-bold text-[#53653e]">✓ {copy.sent}</p>}{sendStatus === "error" && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{copy.sendError}</p>}
                </div>
              </div>
            </section>}

            {error && <p className="ai-message-in ml-10 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          </div>
        </div>
      </div>

      <form onSubmit={submit} data-ai-chat-composer="persistent" className="relative z-30 shrink-0 border-t border-[#ddd4c8] bg-[#fbf8f3]/96 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-[24px] border border-[#d8cec1] bg-white p-1.5 shadow-[0_8px_30px_rgba(70,55,35,.08)] transition focus-within:border-[#7a8562] focus-within:shadow-[0_8px_32px_rgba(70,55,35,.13)]">
          <input value={input} onChange={event => setInput(event.target.value)} disabled={!inputEnabled} placeholder={inputEnabled ? copy.placeholder : copy.chooseAbove} className="min-h-11 min-w-0 flex-1 rounded-[18px] bg-transparent px-3 text-[15px] outline-none placeholder:text-[#9a9187] disabled:cursor-default" />
          <button type="submit" disabled={!inputEnabled || !input.trim()} aria-label="Send" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#66714f] text-lg font-black text-white shadow-sm transition hover:bg-[#596244] active:scale-90 disabled:bg-[#d8d1c7]">↑</button>
        </div>
      </form>

      {detail && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-[2px] sm:items-center sm:p-5" onClick={() => setDetail(null)}><section className="ai-sheet-in flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:rounded-[30px]" onClick={event => event.stopPropagation()}><div className="flex justify-center py-2 sm:hidden"><span className="h-1.5 w-12 rounded-full bg-[#d4cabe]" /></div><div className="relative h-64 shrink-0 sm:h-72"><Image src={(detail.gallery?.length ? detail.gallery : [detail.image])[photo] || detail.image} alt={detail.name} fill sizes="(max-width:640px) 100vw, 720px" className="object-cover" /><button type="button" onClick={() => setDetail(null)} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl shadow-lg">×</button>{(detail.gallery?.length || 0) > 1 && <><button type="button" onClick={() => setPhoto(index => (index - 1 + (detail.gallery?.length || 1)) % (detail.gallery?.length || 1))} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl shadow-lg">‹</button><button type="button" onClick={() => setPhoto(index => (index + 1) % (detail.gallery?.length || 1))} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl shadow-lg">›</button></>}</div><div className="min-h-0 overflow-y-auto p-5"><h2 className="text-2xl font-black">{detail.name}</h2><p className="mt-1 text-sm text-[#746b60]">{detail.category}</p><div className="mt-3 flex flex-wrap gap-2">{[detail.floor, ...(detail.features || [])].filter(Boolean).map(item => <span key={item} className="rounded-full bg-[#f1ede7] px-3 py-1.5 text-xs font-semibold">{item}</span>)}</div><div className="mt-5 rounded-2xl bg-[#f6f2eb] p-4"><div className="flex justify-between"><span>{nights} × {money(detail.directTotal / Math.max(1, nights), language)} {copy.perNight}</span><strong className="text-[#5f7448]">{money(detail.directTotal, language)}</strong></div>{detail.saving > 0 && <div className="mt-2 flex justify-between text-sm text-[#5f7448]"><span>{copy.saving}</span><strong>{money(detail.saving, language)}</strong></div>}</div><button type="button" onClick={() => selectOffer(detail)} className="mt-4 min-h-13 w-full rounded-2xl bg-[#66714f] px-4 py-3.5 font-black text-white shadow-sm">{copy.select}</button></div></section></div>}
    </main>
  );
}

function QuickReplies({ values, onSelect, label }: { values: number[]; onSelect: (value: number) => void; label: (value: number) => string }) {
  return <div className="ai-message-in ml-10 flex flex-wrap gap-2">{values.map(value => <button type="button" key={value} onClick={() => onSelect(value)} className="rounded-full border border-[#d8cec1] bg-white px-4 py-2.5 text-sm font-bold text-[#514a42] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#8b806f] active:scale-95">{label(value)}</button>)}</div>;
}
