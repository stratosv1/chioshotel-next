"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { RoomWizardRoom } from "@/content/rooms";

type WizardLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type RoomWizardTailwindProps = {
  rooms: RoomWizardRoom[];
  whatsappPhone: string;
  language?: WizardLanguage;
};

type LeadData = {
  firstName: string;
  lastName: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
};

type WizardPrefs = {
  guests?: number;
  budget?: boolean;
  noStairs?: boolean;
  upperView?: boolean;
  gardenView?: boolean;
  kitchen?: boolean;
};

type Question = {
  id: keyof WizardPrefs;
  question: string;
  options: Array<{
    title: string;
    hint: string;
    icon: string;
    value: WizardPrefs[keyof WizardPrefs];
  }>;
};

type WizardCopy = {
  title: string;
  text: string;
  firstName: string;
  lastName: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
  consent: string;
  start: string;
  back: string;
  step: string;
  bestMatch: string;
  alternatives: string;
  startOver: string;
  whatsapp: string;
  emailCta: string;
  alert: string;
  perfect: string;
  room: string;
  guests: string;
  beds: string;
  why: string;
  same: string;
  more: string;
  less: string;
  questions: Question[];
};

const enCopy: WizardCopy = {
  title: "Find the room that fits you",
  text: "Answer a few quick questions and we’ll suggest the best room or apartment for your stay in Chios.",
  firstName: "First name",
  lastName: "Last name",
  checkin: "Check-in",
  checkout: "Check-out",
  email: "Email",
  phone: "Phone",
  consent: "I consent to the processing of my personal data for accommodation suggestions.",
  start: "Start room finder",
  back: "Back",
  step: "Step",
  bestMatch: "Best match",
  alternatives: "Alternative options",
  startOver: "Start over",
  whatsapp: "WhatsApp",
  emailCta: "Email",
  alert: "Check-out must be after check-in.",
  perfect: "This option matches your criteria and gives you the best balance of comfort, access and value.",
  room: "Room",
  guests: "Guests",
  beds: "Beds",
  why: "Why it fits",
  same: "Same price category",
  more: "Higher price category",
  less: "Lower price category",
  questions: [
    { id: "guests", question: "How many guests?", options: [
      { title: "2 guests", hint: "Couple or two adults", icon: "👥", value: 2 },
      { title: "3 guests", hint: "Family or friends", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 guests", hint: "Maximum comfort", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Which price level do you prefer?", options: [
      { title: "Economy", hint: "More budget-friendly", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "More comfort and options", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Access & stairs?", options: [
      { title: "No stairs", hint: "Ground floor or stand-alone apartment", icon: "🧳", value: true },
      { title: "Stairs are OK", hint: "Includes first-floor options", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Preferred view?", options: [
      { title: "Upper view", hint: "A more premium feel", icon: "👁️", value: true },
      { title: "Garden view", hint: "Peaceful and relaxed", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Do you need a kitchen?", options: [
      { title: "Yes", hint: "Full kitchen or kitchenette", icon: "🍳", value: true },
      { title: "No", hint: "A simpler room is fine", icon: "🍽️", value: false },
    ]},
  ],
};

const elCopy: WizardCopy = {
  ...enCopy,
  title: "Βρες το δωμάτιο που σου ταιριάζει",
  text: "Απάντησε σε λίγες γρήγορες ερωτήσεις και θα σου προτείνουμε το καλύτερο δωμάτιο ή διαμέρισμα για τη διαμονή σου στη Χίο.",
  firstName: "Όνομα",
  lastName: "Επώνυμο",
  checkin: "Άφιξη",
  checkout: "Αναχώρηση",
  email: "Email",
  phone: "Τηλέφωνο",
  consent: "Συναινώ στην επεξεργασία των προσωπικών μου δεδομένων για να λάβω πρόταση διαμονής.",
  start: "Ξεκίνα",
  back: "Πίσω",
  step: "Βήμα",
  bestMatch: "Καλύτερη επιλογή",
  alternatives: "Εναλλακτικές επιλογές",
  startOver: "Ξεκίνα ξανά",
  alert: "Η αναχώρηση πρέπει να είναι μετά την άφιξη.",
  perfect: "Αυτή η επιλογή ταιριάζει καλύτερα στα κριτήριά σου, με καλή ισορροπία άνεσης, πρόσβασης και τιμής.",
  room: "Δωμάτιο",
  guests: "Άτομα",
  beds: "Κρεβάτια",
  why: "Γιατί ταιριάζει",
  same: "Ίδια κατηγορία τιμής",
  more: "Υψηλότερη κατηγορία τιμής",
  less: "Χαμηλότερη κατηγορία τιμής",
  questions: [
    { id: "guests", question: "Πόσα άτομα είστε;", options: [
      { title: "2 άτομα", hint: "Ζευγάρι ή δύο ενήλικες", icon: "👥", value: 2 },
      { title: "3 άτομα", hint: "Οικογένεια ή φίλοι", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 άτομα", hint: "Μέγιστη άνεση", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Ποια κατηγορία τιμής προτιμάς;", options: [
      { title: "Οικονομικό", hint: "Πιο budget επιλογή", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "Περισσότερη άνεση", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Πρόσβαση και σκάλες;", options: [
      { title: "Χωρίς σκάλες", hint: "Ισόγειο ή αυτόνομο διαμέρισμα", icon: "🧳", value: true },
      { title: "Οι σκάλες είναι ΟΚ", hint: "Περιλαμβάνει επιλογές ορόφου", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Τι θέα προτιμάς;", options: [
      { title: "Θέα από ψηλά", hint: "Πιο premium αίσθηση", icon: "👁️", value: true },
      { title: "Θέα στον κήπο", hint: "Ήρεμη ατμόσφαιρα", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Χρειάζεσαι κουζίνα;", options: [
      { title: "Ναι", hint: "Πλήρης κουζίνα ή kitchenette", icon: "🍳", value: true },
      { title: "Όχι", hint: "Ένα πιο απλό δωμάτιο είναι ΟΚ", icon: "🍽️", value: false },
    ]},
  ],
};


const frCopy: WizardCopy = {
  ...enCopy,
  title: "Trouvez la chambre qui vous convient",
  text: "Répondez à quelques questions rapides et nous vous proposerons la chambre ou l’appartement le plus adapté à votre séjour à Chios.",
  firstName: "Prénom",
  lastName: "Nom",
  checkin: "Arrivée",
  checkout: "Départ",
  email: "E-mail",
  phone: "Téléphone",
  consent: "J’accepte le traitement de mes données personnelles afin de recevoir une proposition d’hébergement adaptée.",
  start: "Commencer la sélection",
  back: "Retour",
  step: "Étape",
  bestMatch: "Meilleure option",
  alternatives: "Autres options adaptées",
  startOver: "Recommencer",
  whatsapp: "WhatsApp",
  emailCta: "E-mail",
  alert: "La date de départ doit être postérieure à la date d’arrivée.",
  perfect: "Cette option correspond le mieux à vos critères et offre un bon équilibre entre confort, accès et prix.",
  room: "Chambre",
  guests: "Personnes",
  beds: "Lits",
  why: "Pourquoi elle convient",
  same: "Même catégorie de prix",
  more: "Catégorie de prix supérieure",
  less: "Catégorie de prix inférieure",
  questions: [
    { id: "guests", question: "Combien de personnes séjourneront ?", options: [
      { title: "2 personnes", hint: "Couple ou deux adultes", icon: "👥", value: 2 },
      { title: "3 personnes", hint: "Famille ou amis", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 personnes", hint: "Davantage d’espace pour une famille", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Quelle catégorie de prix préférez-vous ?", options: [
      { title: "Économique", hint: "Option plus avantageuse", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "Davantage de confort et de choix", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Accès et escaliers ?", options: [
      { title: "Sans escaliers", hint: "Rez-de-chaussée ou appartement indépendant", icon: "🧳", value: true },
      { title: "Les escaliers conviennent", hint: "Inclut les options à l’étage", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Quel emplacement préférez-vous ?", options: [
      { title: "Étage / vue", hint: "Une atmosphère plus lumineuse et ouverte", icon: "👁️", value: true },
      { title: "Vue jardin", hint: "Une ambiance calme et reposante", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Avez-vous besoin d’une cuisine ?", options: [
      { title: "Oui", hint: "Cuisine complète ou kitchenette", icon: "🍳", value: true },
      { title: "Non", hint: "Une chambre standard suffit", icon: "🍽️", value: false },
    ]},
  ],
};


const deCopy: WizardCopy = {
  ...enCopy,
  title: "Finden Sie das passende Zimmer",
  text: "Beantworten Sie ein paar kurze Fragen und wir empfehlen Ihnen das passende Zimmer oder Apartment für Ihren Aufenthalt auf Chios.",
  firstName: "Vorname",
  lastName: "Nachname",
  checkin: "Anreise",
  checkout: "Abreise",
  email: "E-Mail",
  phone: "Telefon",
  consent: "Ich stimme der Verarbeitung meiner personenbezogenen Daten zu, damit mir eine passende Unterkunft vorgeschlagen werden kann.",
  start: "Zimmerauswahl starten",
  back: "Zurück",
  step: "Schritt",
  bestMatch: "Beste Übereinstimmung",
  alternatives: "Weitere passende Optionen",
  startOver: "Neu starten",
  whatsapp: "WhatsApp",
  emailCta: "E-Mail",
  alert: "Das Abreisedatum muss nach dem Anreisedatum liegen.",
  perfect: "Diese Option passt am besten zu Ihren Kriterien und bietet eine gute Balance aus Komfort, Zugang und Preis.",
  room: "Zimmer",
  guests: "Gäste",
  beds: "Betten",
  why: "Warum es passt",
  same: "Gleiche Preiskategorie",
  more: "Höhere Preiskategorie",
  less: "Niedrigere Preiskategorie",
  questions: [
    { id: "guests", question: "Wie viele Gäste übernachten?", options: [
      { title: "2 Gäste", hint: "Paar oder zwei Erwachsene", icon: "👥", value: 2 },
      { title: "3 Gäste", hint: "Familie oder Freunde", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 Gäste", hint: "Mehr Platz für Familien", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Welche Preiskategorie bevorzugen Sie?", options: [
      { title: "Economy", hint: "Preisbewusste Option", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "Mehr Komfort und Auswahl", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Zugang und Treppen?", options: [
      { title: "Ohne Treppen", hint: "Erdgeschoss oder eigenständiges Apartment", icon: "🧳", value: true },
      { title: "Treppen sind in Ordnung", hint: "Optionen im Obergeschoss werden berücksichtigt", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Welche Lage bevorzugen Sie?", options: [
      { title: "Obergeschoss / Aussicht", hint: "Helleres, offeneres Raumgefühl", icon: "👁️", value: true },
      { title: "Gartenblick", hint: "Ruhige, entspannte Atmosphäre", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Benötigen Sie eine Küche?", options: [
      { title: "Ja", hint: "Küche oder Kochnische", icon: "🍳", value: true },
      { title: "Nein", hint: "Ein Standardzimmer ist ausreichend", icon: "🍽️", value: false },
    ]},
  ],
};


const itCopy: WizardCopy = {
  ...enCopy,
  title: "Trova la camera giusta per il tuo soggiorno",
  text: "Rispondi a poche domande e ti consiglieremo la camera o l’appartamento più adatto al tuo soggiorno a Chios.",
  firstName: "Nome",
  lastName: "Cognome",
  checkin: "Arrivo",
  checkout: "Partenza",
  email: "Email",
  phone: "Telefono",
  consent: "Acconsento al trattamento dei miei dati personali per ricevere una proposta di soggiorno adatta.",
  start: "Inizia la scelta della camera",
  back: "Indietro",
  step: "Passaggio",
  bestMatch: "Scelta migliore",
  alternatives: "Altre opzioni adatte",
  startOver: "Ricomincia",
  whatsapp: "WhatsApp",
  emailCta: "Email",
  alert: "La data di partenza deve essere successiva alla data di arrivo.",
  perfect: "Questa opzione corrisponde meglio ai tuoi criteri e offre un buon equilibrio tra comfort, accesso e prezzo.",
  room: "Camera",
  guests: "Ospiti",
  beds: "Letti",
  why: "Perché è adatta",
  same: "Stessa fascia di prezzo",
  more: "Fascia di prezzo superiore",
  less: "Fascia di prezzo inferiore",
  questions: [
    { id: "guests", question: "Quanti ospiti soggiorneranno?", options: [
      { title: "2 ospiti", hint: "Coppia o due adulti", icon: "👥", value: 2 },
      { title: "3 ospiti", hint: "Famiglia o amici", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 ospiti", hint: "Più spazio per la famiglia", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Quale fascia di prezzo preferisci?", options: [
      { title: "Economy", hint: "Opzione più conveniente", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "Più comfort e scelta", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Accesso e scale?", options: [
      { title: "Senza scale", hint: "Piano terra o appartamento indipendente", icon: "🧳", value: true },
      { title: "Le scale vanno bene", hint: "Include anche le opzioni al piano superiore", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Quale posizione preferisci?", options: [
      { title: "Piano superiore / vista", hint: "Atmosfera più luminosa e aperta", icon: "👁️", value: true },
      { title: "Vista giardino", hint: "Atmosfera tranquilla e rilassante", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Hai bisogno della cucina?", options: [
      { title: "Sì", hint: "Cucina completa o angolo cottura", icon: "🍳", value: true },
      { title: "No", hint: "È sufficiente una camera standard", icon: "🍽️", value: false },
    ]},
  ],
};

const esCopy: WizardCopy = {
  ...enCopy,
  title: "Encuentra la habitación ideal para tu estancia",
  text: "Responde a unas preguntas rápidas y te recomendaremos la habitación o el apartamento que mejor encaje con tu estancia en Quíos.",
  firstName: "Nombre",
  lastName: "Apellidos",
  checkin: "Llegada",
  checkout: "Salida",
  email: "Email",
  phone: "Teléfono",
  consent: "Acepto el tratamiento de mis datos personales para recibir una propuesta de alojamiento adecuada.",
  start: "Empezar selección de habitación",
  back: "Atrás",
  step: "Paso",
  bestMatch: "Mejor opción",
  alternatives: "Otras opciones adecuadas",
  startOver: "Empezar de nuevo",
  whatsapp: "WhatsApp",
  emailCta: "Email",
  alert: "La fecha de salida debe ser posterior a la fecha de llegada.",
  perfect: "Esta opción es la que mejor encaja con tus criterios y ofrece un buen equilibrio entre comodidad, acceso y precio.",
  room: "Habitación",
  guests: "Huéspedes",
  beds: "Camas",
  why: "Por qué encaja",
  same: "Misma categoría de precio",
  more: "Categoría de precio superior",
  less: "Categoría de precio inferior",
  questions: [
    { id: "guests", question: "¿Cuántos huéspedes se alojarán?", options: [
      { title: "2 huéspedes", hint: "Pareja o dos adultos", icon: "👥", value: 2 },
      { title: "3 huéspedes", hint: "Familia o amigos", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 huéspedes", hint: "Más espacio para la familia", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "¿Qué categoría de precio prefieres?", options: [
      { title: "Económica", hint: "Opción más asequible", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "Más comodidad y opciones", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "¿Acceso y escaleras?", options: [
      { title: "Sin escaleras", hint: "Planta baja o apartamento independiente", icon: "🧳", value: true },
      { title: "Las escaleras están bien", hint: "Incluye opciones en la primera planta", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "¿Qué ubicación prefieres?", options: [
      { title: "Planta superior / vistas", hint: "Ambiente más luminoso y abierto", icon: "👁️", value: true },
      { title: "Vista al jardín", hint: "Ambiente tranquilo y relajado", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "¿Necesitas cocina?", options: [
      { title: "Sí", hint: "Cocina completa o cocina pequeña", icon: "🍳", value: true },
      { title: "No", hint: "Una habitación estándar es suficiente", icon: "🍽️", value: false },
    ]},
  ],
};

const trCopy: WizardCopy = {
  ...enCopy,
  title: "Size uygun odayı bulun",
  text: "Birkaç kısa soruyu yanıtlayın; Sakız Adası’ndaki konaklamanız için size en uygun oda veya daireyi önerelim.",
  firstName: "Ad",
  lastName: "Soyad",
  checkin: "Giriş",
  checkout: "Çıkış",
  email: "E-posta",
  phone: "Telefon",
  consent: "Konaklama önerisi sunabilmemiz için kişisel verilerimin işlenmesini kabul ediyorum.",
  start: "Oda seçimini başlat",
  back: "Geri",
  step: "Adım",
  bestMatch: "En uygun seçenek",
  alternatives: "Alternatif seçenekler",
  startOver: "Baştan başla",
  whatsapp: "WhatsApp",
  emailCta: "E-posta",
  alert: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
  perfect: "Bu seçenek kriterlerinize en iyi şekilde uyuyor ve konfor, erişim ve fiyat açısından dengeli bir tercih sunuyor.",
  room: "Oda",
  guests: "Misafir",
  beds: "Yataklar",
  why: "Neden uygun",
  same: "Aynı fiyat kategorisi",
  more: "Daha yüksek fiyat kategorisi",
  less: "Daha düşük fiyat kategorisi",
  questions: [
    { id: "guests", question: "Kaç misafir konaklayacak?", options: [
      { title: "2 misafir", hint: "Çift veya iki yetişkin", icon: "👥", value: 2 },
      { title: "3 misafir", hint: "Aile veya arkadaşlar", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 misafir", hint: "Aileler için daha fazla alan", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Hangi fiyat kategorisini tercih edersiniz?", options: [
      { title: "Ekonomik", hint: "Daha uygun fiyatlı seçenek", icon: "💶", value: true },
      { title: "Standart / Premium", hint: "Daha fazla konfor ve seçenek", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Erişim ve merdiven tercihiniz?", options: [
      { title: "Merdivensiz", hint: "Zemin kat veya bağımsız daire", icon: "🧳", value: true },
      { title: "Merdiven uygun", hint: "Üst kat seçenekleri de dahil", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Hangi konumu tercih edersiniz?", options: [
      { title: "Üst kat", hint: "Daha aydınlık ve açık bir his", icon: "👁️", value: true },
      { title: "Bahçe manzarası", hint: "Sakin ve huzurlu atmosfer", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Mutfak ihtiyacınız var mı?", options: [
      { title: "Evet", hint: "Tam mutfak veya mini mutfak", icon: "🍳", value: true },
      { title: "Hayır", hint: "Standart bir oda yeterli", icon: "🍽️", value: false },
    ]},
  ],
};

const plCopy: WizardCopy = {
  ...enCopy,
  title: "Znajdź pokój dopasowany do Twojego pobytu",
  text: "Odpowiedz na kilka krótkich pytań, a podpowiemy pokój lub apartament najlepiej dopasowany do Twojego pobytu na Chios.",
  firstName: "Imię",
  lastName: "Nazwisko",
  checkin: "Przyjazd",
  checkout: "Wyjazd",
  email: "Email",
  phone: "Telefon",
  consent: "Wyrażam zgodę na przetwarzanie moich danych w celu przygotowania propozycji zakwaterowania.",
  start: "Rozpocznij wybór pokoju",
  back: "Wstecz",
  step: "Krok",
  bestMatch: "Najlepsze dopasowanie",
  alternatives: "Inne pasujące opcje",
  startOver: "Zacznij od nowa",
  alert: "Data wyjazdu musi być późniejsza niż data przyjazdu.",
  perfect: "Ta opcja najlepiej odpowiada wybranym kryteriom pod względem wygody, dostępu i kategorii cenowej.",
  room: "Pokój",
  guests: "Goście",
  beds: "Łóżka",
  why: "Dlaczego pasuje",
  same: "Ta sama kategoria cenowa",
  more: "Wyższa kategoria cenowa",
  less: "Niższa kategoria cenowa",
  questions: [
    { id: "guests", question: "Ilu gości będzie nocować?", options: [
      { title: "2 osoby", hint: "Para lub dwóch dorosłych", icon: "👥", value: 2 },
      { title: "3 osoby", hint: "Rodzina lub przyjaciele", icon: "👨‍👩‍👦", value: 3 },
      { title: "4 osoby", hint: "Więcej przestrzeni dla rodziny", icon: "👨‍👩‍👧‍👦", value: 4 },
    ]},
    { id: "budget", question: "Jaką kategorię cenową preferujesz?", options: [
      { title: "Economy", hint: "Bardziej ekonomiczna opcja", icon: "💶", value: true },
      { title: "Standard / Premium", hint: "Więcej komfortu i możliwości", icon: "✨", value: false },
    ]},
    { id: "noStairs", question: "Dostęp i schody?", options: [
      { title: "Bez schodów", hint: "Parter lub niezależny apartament", icon: "🧳", value: true },
      { title: "Schody są w porządku", hint: "Uwzględnia pokoje na piętrze", icon: "🪜", value: false },
    ]},
    { id: "upperView", question: "Jakie położenie wolisz?", options: [
      { title: "Piętro i widok", hint: "Jaśniejsza, bardziej otwarta atmosfera", icon: "👁️", value: true },
      { title: "Ogród i parter", hint: "Spokojny dostęp do otoczenia", icon: "🌿", value: false },
    ]},
    { id: "kitchen", question: "Czy potrzebujesz kuchni?", options: [
      { title: "Tak", hint: "Pełna kuchnia lub aneks kuchenny", icon: "🍳", value: true },
      { title: "Nie", hint: "Wystarczy standardowy pokój", icon: "🍽️", value: false },
    ]},
  ],
};

const copyByLanguage: Record<WizardLanguage, WizardCopy> = {
  en: enCopy,
  el: elCopy,
  fr: frCopy,
  de: deCopy,
  it: itCopy,
  es: esCopy,
  tr: trCopy,
};

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function scoreRoom(room: RoomWizardRoom, prefs: WizardPrefs) {
  let score = 0;
  if (prefs.guests) score += room.maxGuests >= prefs.guests ? 34 : -1000;
  if (prefs.budget !== undefined) score += room.budget === prefs.budget ? 22 : -8;
  if (prefs.noStairs !== undefined) score += prefs.noStairs ? (!room.stairs ? 20 : -18) : 8;
  if (prefs.upperView !== undefined) score += prefs.upperView ? (room.upperView ? 14 : -6) : room.gardenView ? 14 : 0;
  if (prefs.kitchen !== undefined) score += prefs.kitchen ? (room.fullKitchen || room.kitchenette ? 16 : -10) : 4;
  score -= room.priceLevel * 0.4;
  return score;
}

function isPolishCopy(copy: WizardCopy) {
  return copy === plCopy;
}

function isFrenchCopy(copy: WizardCopy) {
  return copy === frCopy;
}

function isItalianCopy(copy: WizardCopy) {
  return copy === itCopy;
}

function isSpanishCopy(copy: WizardCopy) {
  return copy === esCopy;
}

function isGermanCopy(copy: WizardCopy) {
  return copy === deCopy;
}

function isTurkishCopy(copy: WizardCopy) {
  return copy === trCopy;
}

function localizeRoomName(name: string, copy: WizardCopy) {
  if (isFrenchCopy(copy)) {
    return name.replace(/^Room\s+(\d+)$/i, "Chambre $1").replace(/^Apartment\s+(\d+)$/i, "Appartement $1");
  }
  if (isItalianCopy(copy)) {
    return name.replace(/^Room\s+(\d+)$/i, "Camera $1").replace(/^Apartment\s+(\d+)$/i, "Appartamento $1");
  }
  if (isSpanishCopy(copy)) {
    return name.replace(/^Room\s+(\d+)$/i, "Habitación $1").replace(/^Apartment\s+(\d+)$/i, "Apartamento $1");
  }
  if (isGermanCopy(copy)) {
    return name.replace(/^Room\s+(\d+)$/i, "Zimmer $1").replace(/^Apartment\s+(\d+)$/i, "Apartment $1");
  }
  if (isTurkishCopy(copy)) {
    return name.replace(/^Room\s+(\d+)$/i, "Oda $1").replace(/^Apartment\s+(\d+)$/i, "Daire $1");
  }
  return name;
}

function localizeRoomType(type: string, copy: WizardCopy) {
  if (isFrenchCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Chambre double / triple à l’étage",
      "Ground Floor Double/Triple room": "Chambre double / triple au rez-de-chaussée",
      "Economy double": "Chambre double économique",
      Apartment: "Appartement familial",
    };
    return values[type] || type;
  }
  if (isItalianCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Camera doppia / tripla al primo piano",
      "Ground Floor Double/Triple room": "Camera doppia / tripla al piano terra",
      "Economy double": "Camera doppia economy",
      Apartment: "Appartamento familiare",
    };
    return values[type] || type;
  }
  if (isSpanishCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Habitación doble / triple en primera planta",
      "Ground Floor Double/Triple room": "Habitación doble / triple en planta baja",
      "Economy double": "Habitación doble económica",
      Apartment: "Apartamento familiar",
    };
    return values[type] || type;
  }
  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Doppel-/Dreibettzimmer im Obergeschoss",
      "Ground Floor Double/Triple room": "Doppel-/Dreibettzimmer im Erdgeschoss",
      "Economy double": "Economy-Doppelzimmer",
      Apartment: "Familienapartment",
    };
    return values[type] || type;
  }
  if (!isTurkishCopy(copy)) return type;
  const values: Record<string, string> = {
    "First Floor Double/Triple room": "Üst kat çift / üç kişilik oda",
    "Ground Floor Double/Triple room": "Zemin kat çift / üç kişilik oda",
    "Economy double": "Ekonomik çift kişilik oda",
    Apartment: "Aile dairesi",
  };
  return values[type] || type;
}

function localizeRoomLocation(location: string, copy: WizardCopy) {
  if (isFrenchCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Étage",
      "Ground Floor": "Rez-de-chaussée",
      "Stand Alone": "Unité indépendante",
    };
    return values[location] || location;
  }
  if (isItalianCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Primo piano",
      "Ground Floor": "Piano terra",
      "Stand Alone": "Unità indipendente",
    };
    return values[location] || location;
  }
  if (isSpanishCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Primera planta",
      "Ground Floor": "Planta baja",
      "Stand Alone": "Unidad independiente",
    };
    return values[location] || location;
  }
  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Obergeschoss",
      "Ground Floor": "Erdgeschoss",
      "Stand Alone": "Eigenständige Einheit",
    };
    return values[location] || location;
  }
  if (!isTurkishCopy(copy)) return location;
  const values: Record<string, string> = {
    "First Floor": "Üst kat",
    "Ground Floor": "Zemin kat",
    "Stand Alone": "Bağımsız birim",
  };
  return values[location] || location;
}

function getTags(room: RoomWizardRoom, prefs: WizardPrefs, copy: WizardCopy) {
  const tags: Array<{ text: string; good: boolean }> = [];
  const polish = isPolishCopy(copy);
  const french = isFrenchCopy(copy);
  const italian = isItalianCopy(copy);
  const spanish = isSpanishCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  if (prefs.guests) tags.push({ text: `${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} ${copy.guests}`, good: room.maxGuests >= prefs.guests });
  if (prefs.budget !== undefined) tags.push({ text: room.budget ? (french ? "Économique" : spanish ? "Económica" : turkish ? "Ekonomik" : "Economy") : (french ? "Standard" : turkish ? "Standart" : "Standard"), good: room.budget === prefs.budget });
  if (prefs.noStairs) tags.push({ text: room.stairs ? (polish ? "Schody" : french ? "Escaliers" : italian ? "Scale" : spanish ? "Escaleras" : german ? "Treppen" : turkish ? "Merdiven var" : "Stairs") : (polish ? "Bez schodów" : french ? "Sans escaliers" : italian ? "Senza scale" : spanish ? "Sin escaleras" : german ? "Ohne Treppen" : turkish ? "Merdivensiz" : "No stairs"), good: !room.stairs });
  if (prefs.upperView !== undefined) tags.push({ text: prefs.upperView ? (polish ? "Piętro / widok" : french ? "Étage / vue" : italian ? "Piano superiore / vista" : spanish ? "Planta superior / vistas" : german ? "Obergeschoss / Aussicht" : turkish ? "Üst kat / manzara" : "Upper view") : (polish ? "Widok na ogród" : french ? "Vue jardin" : italian ? "Vista giardino" : spanish ? "Vista al jardín" : german ? "Gartenblick" : turkish ? "Bahçe manzarası" : "Garden view"), good: prefs.upperView ? room.upperView : room.gardenView });
  if (prefs.kitchen) tags.push({ text: room.fullKitchen ? (polish ? "Pełna kuchnia" : french ? "Cuisine complète" : italian ? "Cucina completa" : spanish ? "Cocina completa" : german ? "Küche" : turkish ? "Tam mutfak" : "Full kitchen") : room.kitchenette ? (polish ? "Aneks kuchenny" : french ? "Kitchenette" : italian ? "Angolo cottura" : spanish ? "Cocina pequeña" : german ? "Kochnische" : turkish ? "Mini mutfak" : "Kitchenette") : (polish ? "Bez kuchni" : french ? "Sans cuisine" : italian ? "Senza cucina" : spanish ? "Sin cocina" : german ? "Keine Küche" : turkish ? "Mutfak yok" : "No kitchen"), good: room.fullKitchen || room.kitchenette });
  return tags;
}

function getWhatsAppUrl(room: RoomWizardRoom, lead: LeadData, prefs: WizardPrefs, phone: string, copy: WizardCopy) {
  const intro = isPolishCopy(copy)
    ? `Dzień dobry! Nazywam się ${lead.firstName} ${lead.lastName} i chcę zapytać o:`
    : isFrenchCopy(copy)
      ? `Bonjour ! Je m’appelle ${lead.firstName} ${lead.lastName} et je souhaite obtenir des informations sur :`
      : isItalianCopy(copy)
        ? `Ciao! Mi chiamo ${lead.firstName} ${lead.lastName} e vorrei informazioni su:`
        : isSpanishCopy(copy)
          ? `¡Hola! Me llamo ${lead.firstName} ${lead.lastName} y quisiera información sobre:`
          : isGermanCopy(copy)
          ? `Guten Tag! Ich bin ${lead.firstName} ${lead.lastName} und möchte mich nach folgender Unterkunft erkundigen:`
          : isTurkishCopy(copy)
            ? `Merhaba! Ben ${lead.firstName} ${lead.lastName}. Şu konaklama seçeneği hakkında bilgi almak istiyorum:`
            : `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to ask about:`;
  const text = `${intro}\n\n${copy.room}: ${localizeRoomName(room.name, copy)}\n${copy.checkin}: ${lead.checkin}\n${copy.checkout}: ${lead.checkout}\n${copy.guests}: ${prefs.guests || "-"}\n${copy.email}: ${lead.email}\n${copy.phone}: ${lead.phone}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function RoomGallery({ room, copy }: { room: RoomWizardRoom; copy: WizardCopy }) {
  const [activeImage, setActiveImage] = useState(room.images[0] || "");
  if (!room.images.length) return null;
  const roomName = localizeRoomName(room.name, copy);
  const photoLabel = isPolishCopy(copy) ? "zdjęcie" : isItalianCopy(copy) ? "foto" : isSpanishCopy(copy) ? "foto" : isGermanCopy(copy) ? "Foto" : isTurkishCopy(copy) ? "fotoğraf" : "photo";
  return (
    <div className="my-5 overflow-hidden rounded-3xl border border-[#6f7f3f]/20 bg-white">
      <img className="h-[240px] w-full object-cover md:h-[300px]" src={activeImage} alt={roomName} loading="lazy" />
      <div className="grid grid-cols-4 gap-2 p-2">
        {room.images.slice(0, 4).map((image, index) => (
          <button type="button" className={`aspect-square overflow-hidden rounded-2xl border-2 ${activeImage === image ? "border-[#3f4f2f]" : "border-transparent"}`} key={image} onClick={() => setActiveImage(image)} aria-label={`${roomName} ${photoLabel} ${index + 1}`}>
            <img className="h-full w-full object-cover" src={image} alt={`${roomName} ${index + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

function RoomCard({ room, bestRoom, lead, prefs, whatsappPhone, copy, label }: { room: RoomWizardRoom; bestRoom: RoomWizardRoom; lead: LeadData; prefs: WizardPrefs; whatsappPhone: string; copy: WizardCopy; label: string }) {
  const tags = getTags(room, prefs, copy);
  const priceText = room.priceLevel > bestRoom.priceLevel ? copy.more : room.priceLevel < bestRoom.priceLevel ? copy.less : copy.same;
  const polish = isPolishCopy(copy);
  const french = isFrenchCopy(copy);
  const italian = isItalianCopy(copy);
  const spanish = isSpanishCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  const roomName = localizeRoomName(room.name, copy);
  const doubleBed = polish ? "Podwójne" : french ? "Lit double" : italian ? "Letto matrimoniale" : spanish ? "Cama doble" : german ? "Doppelbett" : turkish ? "Çift kişilik" : "Double";
  const singleBed = polish ? "Pojedyncze" : french ? "Lit simple" : italian ? "Letto singolo" : spanish ? "Cama individual" : german ? "Einzelbett" : turkish ? "Tek kişilik" : "Single";
  const sofaBed = polish ? "Sofa" : french ? "Canapé-lit" : italian ? "Divano letto" : spanish ? "Sofá cama" : german ? "Schlafsofa" : turkish ? "Çekyat" : "Sofa";
  return (
    <article className="w-[86vw] max-w-[430px] flex-none snap-start rounded-[2rem] border border-[#6f7f3f]/20 bg-white p-5 shadow-xl shadow-stone-900/5 md:w-[560px] md:max-w-[560px] md:p-7">
      <span className="inline-flex rounded-full bg-[#3f4f2f] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-white">{label}</span>
      <h3 className="mt-4 text-3xl font-black leading-none tracking-[-0.04em] text-[#2f261f] md:text-4xl">{roomName}</h3>
      <p className="mt-2 text-sm italic text-stone-600">{localizeRoomType(room.type, copy)} • {localizeRoomLocation(room.location, copy)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex rounded-full border border-[#6f7f3f]/20 bg-[#eef3e5] px-3 py-1.5 text-xs font-black text-[#3f4f2f]">{priceText}</span>
        {tags.map((tag) => <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${tag.good ? "bg-[#eef3e5] text-[#3f4f2f]" : "bg-rose-50 text-rose-800"}`} key={tag.text}>{tag.text}</span>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label={copy.beds}>
        {room.beds.double > 0 && <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛏️ {doubleBed} x{room.beds.double}</span>}
        {room.beds.single > 0 && <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛌 {singleBed} x{room.beds.single}</span>}
        {room.beds.sofa > 0 && <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold">🛋️ {sofaBed} x{room.beds.sofa}</span>}
      </div>
      <RoomGallery room={room} copy={copy} />
      <div className="rounded-3xl border border-[#6f7f3f]/20 bg-[#f7f9f1] p-4">
        <h4 className="text-xs font-black uppercase tracking-[0.12em] text-[#3f4f2f]">{copy.why}</h4>
        <p className="mt-2 text-sm leading-6 text-stone-600">{copy.perfect}</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-5 text-xs font-black uppercase tracking-[0.1em] text-white" href={getWhatsAppUrl(room, lead, prefs, whatsappPhone, copy)} target="_blank" rel="noopener noreferrer">{copy.whatsapp}</a>
        <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#6f7f3f]/25 bg-[#efe6d8] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#3f4f2f]" href={`mailto:chioshotel@gmail.com?subject=${encodeURIComponent(`${copy.room} - ${lead.firstName} ${lead.lastName} - ${roomName}`)}`}>{copy.emailCta}</a>
      </div>
    </article>
  );
}

export function RoomWizardTailwind({ rooms, whatsappPhone, language = "en" }: RoomWizardTailwindProps) {
  const isPolishRooms = rooms.some((room) => /^Pokój\s+\d+/i.test(room.name) || /^Apartament\s+\d+/i.test(room.name));
  const copy = isPolishRooms ? plCopy : copyByLanguage[language] ?? copyByLanguage.en;
  const minDate = getTomorrowDate();
  const [lead, setLead] = useState<LeadData>({ firstName: "", lastName: "", checkin: "", checkout: "", email: "", phone: "" });
  const [prefs, setPrefs] = useState<WizardPrefs>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const currentQuestion = copy.questions[step];
  const isFinished = hasStarted && step >= copy.questions.length;
  const results = useMemo(() => rooms.map((room) => ({ room, score: scoreRoom(room, prefs) })).filter((item) => item.score > -999).sort((a, b) => b.score - a.score).map((item) => item.room), [prefs, rooms]);
  const bestRoom = results[0];
  const alternativeRooms = results.slice(1, 3);

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lead.checkin || !lead.checkout || lead.checkout <= lead.checkin) {
      alert(copy.alert);
      return;
    }
    setHasStarted(true);
    setStep(0);
  }

  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isItalianCopy(copy) ? "Scorri" : isSpanishCopy(copy) ? "Desliza" : isGermanCopy(copy) ? "Wischen" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";

  return (
    <section className="mx-auto mb-12 w-[min(780px,100%)] scroll-mt-20" id="room-wizard-app" aria-labelledby="rw-main-title">
      <div className="overflow-hidden rounded-[2rem] border border-[#6f7f3f]/20 bg-[radial-gradient(circle_at_top_left,rgba(111,127,63,.16),transparent_22rem),linear-gradient(180deg,#fffdfa,#f7f9f1)] p-[clamp(24px,5vw,46px)] shadow-2xl shadow-stone-900/10">
        {hasStarted && !isFinished ? (
          <header className="mb-8">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div className="text-xl font-black text-[#2f261f]">🏠 {copy.title}</div>
              <div className="text-xs font-black uppercase tracking-[0.12em] text-[#3f4f2f]">{copy.step} {Math.min(step + 1, copy.questions.length)}/{copy.questions.length}</div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#6f7f3f]/15"><div className="h-full rounded-full bg-gradient-to-r from-[#3f4f2f] to-[#6f7f3f] transition-all" style={{ width: `${((step + 1) / copy.questions.length) * 100}%` }} /></div>
          </header>
        ) : null}

        {!hasStarted ? (
          <>
            <header className="mb-8 text-center">
              <h3 className="m-0 text-[clamp(28px,4vw,42px)] font-black leading-none tracking-[-0.045em] text-[#2f261f]" id="rw-main-title">{copy.title}</h3>
              <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-stone-600">{copy.text}</p>
            </header>
            <form onSubmit={handleLeadSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["firstName", copy.firstName, "given-name", "text"],
                  ["lastName", copy.lastName, "family-name", "text"],
                  ["checkin", copy.checkin, undefined, "date"],
                  ["checkout", copy.checkout, undefined, "date"],
                  ["email", copy.email, "email", "email"],
                  ["phone", copy.phone, "tel", "tel"],
                ].map(([key, label, autoComplete, type]) => (
                  <label className="grid gap-2" key={key}>
                    <span className="ml-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#3f4f2f]">{label}</span>
                    <input className="min-h-[58px] rounded-full border-2 border-[#6f7f3f]/20 bg-white px-5 text-base text-[#2f261f] outline-none transition focus:border-[#3f4f2f] focus:ring-4 focus:ring-[#6f7f3f]/15" type={type} min={type === "date" ? minDate : undefined} required autoComplete={autoComplete} value={lead[key as keyof LeadData]} onChange={(event) => setLead((current) => ({ ...current, [key]: event.target.value }))} />
                  </label>
                ))}
                <label className="flex items-start gap-3 px-2 text-sm leading-6 text-stone-600 md:col-span-2"><input className="mt-1 h-5 w-5 accent-[#3f4f2f]" type="checkbox" required />{copy.consent}</label>
              </div>
              <button type="submit" className="mt-7 w-full rounded-full bg-[#3f4f2f] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-stone-900/15 transition hover:-translate-y-0.5 hover:bg-[#53683b]">{copy.start}</button>
            </form>
          </>
        ) : null}

        {hasStarted && !isFinished && currentQuestion ? (
          <div>
            <h3 className="text-[clamp(26px,4vw,40px)] font-black leading-none tracking-[-0.045em] text-[#2f261f]">{currentQuestion.question}</h3>
            <div className="mt-6 grid gap-4">
              {currentQuestion.options.map((option) => (
                <button type="button" className="group flex w-full items-center gap-4 rounded-3xl border-2 border-transparent bg-white p-4 text-left shadow-lg shadow-stone-900/5 transition hover:-translate-y-0.5 hover:border-[#3f4f2f]/40 hover:shadow-xl" key={option.title} onClick={() => { setPrefs((current) => ({ ...current, [currentQuestion.id]: option.value })); setStep((current) => current + 1); }}>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef3e5] text-3xl ring-1 ring-[#6f7f3f]/20">{option.icon}</span>
                  <span><strong className="block text-lg font-black text-[#2f261f]">{option.title}</strong><small className="mt-1 block text-sm leading-6 text-stone-600">{option.hint}</small></span>
                </button>
              ))}
            </div>
            <button type="button" className="mt-5 rounded-full border border-[#6f7f3f]/20 bg-white px-5 py-3 text-sm font-black text-[#3f4f2f]" onClick={() => setStep((current) => Math.max(0, current - 1))}>{copy.back}</button>
          </div>
        ) : null}

        {isFinished && bestRoom ? (
          <div className="relative -mx-2 md:-mx-4">
            <div className="mb-4 flex items-center justify-between gap-3 px-2 md:px-4">
              <h3 className="text-2xl font-black tracking-[-0.04em] text-[#2f261f]">{copy.bestMatch}</h3>
              <span className="rounded-full bg-[#eef3e5] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#3f4f2f]">{swipeLabel} →</span>
            </div>

            <div aria-hidden="true" className="pointer-events-none absolute right-1 top-[46%] z-20 flex h-12 w-12 items-center justify-center rounded-full bg-[#3f4f2f] text-2xl font-black text-white shadow-2xl md:right-3">
              →
            </div>

            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-5 pr-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5 md:px-4 md:pr-20">
              <RoomCard room={bestRoom} bestRoom={bestRoom} lead={lead} prefs={prefs} whatsappPhone={whatsappPhone} copy={copy} label={copy.bestMatch} />
              {alternativeRooms.map((room) => <RoomCard key={room.id} room={room} bestRoom={bestRoom} lead={lead} prefs={prefs} whatsappPhone={whatsappPhone} copy={copy} label={copy.alternatives} />)}
            </div>

            <div className="px-2 md:px-4">
              <button type="button" className="mt-2 w-full rounded-full border border-[#6f7f3f]/20 bg-[#eef3e5] px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#3f4f2f]" onClick={() => { setHasStarted(false); setStep(0); setPrefs({}); }}>{copy.startOver}</button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
