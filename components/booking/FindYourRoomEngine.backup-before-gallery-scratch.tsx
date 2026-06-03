"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FindYourRoomPageData } from "@/content/find-your-room";

type FindYourRoomEngineProps = {
  data: FindYourRoomPageData;
};

type Step = "basics" | "filters" | "results" | "breakfast" | "services" | "contact";

type RoomAmenity = {
  key: string;
  icon: string;
  fallback: string;
};

type RoomOption = {
  id: number;
  roomId: number;
  unitId: number;
  name: string;
  displayName: string;
  type: "room" | "apartment";
  description: string;
  location: string;
  maxGuests: number;
  budget: boolean;
  stairs: boolean;
  ground: boolean;
  floor: boolean;
  gardenView: boolean;
  farmView: boolean;
  kitchen: boolean;
  kitchenette: boolean;
  images: string[];
  amenities: RoomAmenity[];
  basePrice: number;
};

type GuestRoom = {
  id: number;
  guests: number;
};

type LiveAvailabilityItem = {
  roomId: number;
  unitId: number;
  totalPrice: number;
  currency?: string;
};

type RoomResult = {
  room: RoomOption;
  guests: number;
  liveTotal: number;
  systemTotal: number;
  directTotal: number;
  save: number;
};

type ServiceKey = "car" | "tickets";

type FilterKey =
  | "all"
  | "budget"
  | "stairs"
  | "upperFloor"
  | "ground"
  | "gardenView"
  | "upperFloorView"
  | "kitchen"
  | "noKitchen";

const CONFIG = {
  endpoint: "https://chioshotel.gr/wp-json/booking-engine/v1/search-range",
  directDiscountPercent: 15,
  climateFeePerNight: 2,
  breakfastPerPersonPerNight: 12,
  whatsapp: "306944474226",
  phone: "+306944764654",
};

const ROOM_EXTRA_PER_NIGHT: Record<number, number> = {
  1: 10,
  2: 5,
  3: 7,
  4: 0,
  5: 0,
  6: 0,
  7: 10,
  8: 0,
  9: 0,
  10: 5,
};

const filters: { key: FilterKey; icon: string }[] = [
  { key: "all", icon: "✨" },
  { key: "budget", icon: "💸" },
  { key: "stairs", icon: "🪜" },
  { key: "upperFloor", icon: "🏛️" },
  { key: "ground", icon: "🌿" },
  { key: "gardenView", icon: "🌳" },
  { key: "upperFloorView", icon: "🌾" },
  { key: "kitchen", icon: "🍳" },
  { key: "noKitchen", icon: "🚫" },
];

const roomOptions: RoomOption[] = [
  {
    id: 1,
    roomId: 267788,
    unitId: 1,
    name: "Room 1",
    displayName: "Room 1",
    type: "room",
    description: "First-floor double / triple",
    location: "First floor",
    maxGuests: 4,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    farmView: true,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07769-1.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/%CF%87%CE%B9%CE%BF%CF%82-%CE%B4%CF%89%CE%BC%CE%B1%CF%84%CE%B9%CE%B1-1-1.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-bathrooms-1.webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "privateBalcony", icon: "🌤️", fallback: "Private balcony" },
      { key: "upperFloorView", icon: "🌾", fallback: "Upper-floor view" },
      { key: "accessByStairs", icon: "🪜", fallback: "Access by stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "singleBeds2", icon: "🛏️", fallback: "2 single beds" },
      { key: "twoSpacesNoDoor", icon: "🚪", fallback: "Two spaces, no connecting door" },
    ],
    basePrice: 78,
  },
  {
    id: 2,
    roomId: 268803,
    unitId: 1,
    name: "Room 2",
    displayName: "Room 2",
    type: "room",
    description: "Budget double room",
    location: "First floor",
    maxGuests: 2,
    budget: true,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    farmView: false,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07839.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07832.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "accessByStairs", icon: "🪜", fallback: "Access by stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "openPlanSpace", icon: "📐", fallback: "Open-plan space" },
    ],
    basePrice: 55,
  },
  {
    id: 3,
    roomId: 267788,
    unitId: 2,
    name: "Room 3",
    displayName: "Room 3",
    type: "room",
    description: "First-floor double / triple",
    location: "First floor",
    maxGuests: 3,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    farmView: true,
    kitchen: false,
    kitchenette: true,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07867-1.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07860-1.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07849-1.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07891-1.webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "privateBalcony", icon: "🌤️", fallback: "Private balcony" },
      { key: "upperFloorView", icon: "🌾", fallback: "Upper-floor view" },
      { key: "kitchenette", icon: "🥣", fallback: "Kitchenette" },
      { key: "accessByStairs", icon: "🪜", fallback: "Access by stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "singleBed", icon: "🛏️", fallback: "1 single bed" },
      { key: "twoSpacesNoDoor", icon: "🚪", fallback: "Two spaces, no connecting door" },
    ],
    basePrice: 70,
  },
  {
    id: 4,
    roomId: 267788,
    unitId: 3,
    name: "Room 4",
    displayName: "Room 4",
    type: "room",
    description: "First-floor double / triple",
    location: "First floor",
    maxGuests: 3,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    farmView: true,
    kitchen: false,
    kitchenette: true,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748354861920234.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748358935253160.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748356725253381.webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "privateBalcony", icon: "🌤️", fallback: "Private balcony" },
      { key: "upperFloorView", icon: "🌾", fallback: "Upper-floor view" },
      { key: "kitchenette", icon: "🥣", fallback: "Kitchenette" },
      { key: "accessByStairs", icon: "🪜", fallback: "Access by stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "sofaBed", icon: "🛋️", fallback: "1 sofa bed" },
      { key: "openPlanSpace", icon: "📐", fallback: "Open-plan space" },
    ],
    basePrice: 70,
  },
  {
    id: 5,
    roomId: 626129,
    unitId: 1,
    name: "Room 5",
    displayName: "Room 5",
    type: "room",
    description: "Ground-floor double / triple",
    location: "Ground floor",
    maxGuests: 3,
    budget: false,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    farmView: false,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-rooms.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-triple-rooms_1646x1080.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-double-room-bathroom_1620x1080.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/hotels-chios-voulamandis_1620x1080.webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "gardenView", icon: "🌿", fallback: "Ground-floor view" },
      { key: "noStairs", icon: "🪜", fallback: "No stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "singleBed", icon: "🛏️", fallback: "1 single bed" },
      { key: "openPlanSpace", icon: "📐", fallback: "Open-plan space" },
    ],
    basePrice: 70,
  },
  {
    id: 6,
    roomId: 268803,
    unitId: 2,
    name: "Room 6",
    displayName: "Room 6",
    type: "room",
    description: "Budget double room",
    location: "Ground floor",
    maxGuests: 2,
    budget: true,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    farmView: false,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964581359262.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753968691358851.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753969201358800.webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "gardenView", icon: "🌿", fallback: "Ground-floor view" },
      { key: "noStairs", icon: "🪜", fallback: "No stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "openPlanSpace", icon: "📐", fallback: "Open-plan space" },
    ],
    basePrice: 55,
  },
  {
    id: 7,
    roomId: 626129,
    unitId: 2,
    name: "Room 7",
    displayName: "Room 7",
    type: "room",
    description: "Ground-floor double / triple",
    location: "Ground floor",
    maxGuests: 3,
    budget: false,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    farmView: false,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
      "https://chioshotel.gr/wp-content/uploads/2022/12/view-double-room-chios-hotels.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/double-room-bathroom.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-stone-bathroom.webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "gardenView", icon: "🌿", fallback: "Ground-floor view" },
      { key: "noStairs", icon: "🪜", fallback: "No stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "sofaBed", icon: "🛋️", fallback: "1 sofa bed" },
      { key: "openPlanSpace", icon: "📐", fallback: "Open-plan space" },
    ],
    basePrice: 72,
  },
  {
    id: 8,
    roomId: 265595,
    unitId: 1,
    name: "Apartment 8",
    displayName: "Apartment 8",
    type: "apartment",
    description: "Apartment",
    location: "Independent unit",
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    farmView: false,
    kitchen: true,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/family-room.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-apartment-bathroom..webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "privateBalcony", icon: "🌤️", fallback: "Private balcony" },
      { key: "gardenView", icon: "🌿", fallback: "Ground-floor view" },
      { key: "kitchen", icon: "🍳", fallback: "Kitchen" },
      { key: "noStairs", icon: "🪜", fallback: "No stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "singleBeds2", icon: "🛏️", fallback: "2 single beds" },
      { key: "twoSpaces", icon: "🧩", fallback: "Two spaces" },
    ],
    basePrice: 92,
  },
  {
    id: 9,
    roomId: 265595,
    unitId: 2,
    name: "Apartment 9",
    displayName: "Apartment 9",
    type: "apartment",
    description: "Apartment",
    location: "Independent unit",
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    farmView: false,
    kitchen: true,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/family-room.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-apartment-bathroom..webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "privateBalcony", icon: "🌤️", fallback: "Private balcony" },
      { key: "gardenView", icon: "🌿", fallback: "Ground-floor view" },
      { key: "kitchen", icon: "🍳", fallback: "Kitchen" },
      { key: "noStairs", icon: "🪜", fallback: "No stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "singleBeds2", icon: "🛏️", fallback: "2 single beds" },
      { key: "twoSpaces", icon: "🧩", fallback: "Two spaces" },
    ],
    basePrice: 92,
  },
  {
    id: 10,
    roomId: 265595,
    unitId: 3,
    name: "Apartment 10",
    displayName: "Apartment 10",
    type: "apartment",
    description: "Apartment",
    location: "Independent unit",
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    farmView: false,
    kitchen: true,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07899.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07909.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07940.webp",
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07943.webp",
    ],
    amenities: [
      { key: "wifi", icon: "📶", fallback: "Wi-Fi" },
      { key: "kettle", icon: "☕", fallback: "Coffee and tea kettle" },
      { key: "privateBalcony", icon: "🌤️", fallback: "Private balcony" },
      { key: "gardenView", icon: "🌿", fallback: "Ground-floor view" },
      { key: "kitchen", icon: "🍳", fallback: "Kitchen" },
      { key: "noStairs", icon: "🪜", fallback: "No stairs" },
      { key: "doubleBed", icon: "🛏️", fallback: "1 double bed" },
      { key: "sofaBeds2", icon: "🛋️", fallback: "2 sofa beds" },
      { key: "twoSpaces", icon: "🧩", fallback: "Two spaces" },
    ],
    basePrice: 98,
  },
];

const breakfastReviews: Record<string, string[]> = {
  en: [
    "“The breakfast was very good, definitely worth the price.”",
    "“The breakfast was fantastic, the garden on the premises was heavenly.”",
    "“The homemade breakfast was one of the best parts of our stay.”",
    "“Delicious homemade breakfast.”",
  ],
  el: [
    "“Το πρωινό ήταν πολύ καλό και άξιζε σίγουρα την τιμή.”",
    "“Το πρωινό ήταν φανταστικό και ο κήπος ήταν υπέροχος.”",
    "“Το σπιτικό πρωινό ήταν από τα καλύτερα σημεία της διαμονής μας.”",
    "“Νόστιμο σπιτικό πρωινό.”",
  ],
  fr: [
    "“Le petit-déjeuner était très bon, il valait vraiment le prix.”",
    "“Le petit-déjeuner était fantastique, le jardin était magnifique.”",
    "“Petit déjeuner fait maison délicieux.”",
  ],
  de: [
    "“Das Frühstück war sehr gut und den Preis wirklich wert.”",
    "“Das Frühstück war fantastisch und der Garten war wunderschön.”",
    "“Köstliches hausgemachtes Frühstück.”",
  ],
  it: [
    "“La colazione era molto buona e valeva davvero il prezzo.”",
    "“La colazione era fantastica e il giardino meraviglioso.”",
    "“Colazione fatta in casa deliziosa.”",
  ],
  es: [
    "“El desayuno era muy bueno y valía la pena.”",
    "“El desayuno fue fantástico y el jardín era precioso.”",
    "“Delicioso desayuno casero.”",
  ],
  tr: [
    "“Kahvaltı çok iyiydi ve kesinlikle değerdi.”",
    "“Kahvaltı harikaydı, bahçe de çok güzeldi.”",
    "“Lezzetli ev yapımı kahvaltı.”",
  ],
};

const serviceCopy: Record<
  string,
  {
    title: string;
    subtitle: string;
    car: string;
    carText: string;
    tickets: string;
    ticketsText: string;
    noThanks: string;
    continue: string;
    selected: string;
  }
> = {
  en: {
    title: "Would you like help with anything else?",
    subtitle: "Tell us what you need and we will include it in your direct request.",
    car: "Car",
    carText: "I would like help with car rental.",
    tickets: "Tickets",
    ticketsText: "I would like help with tickets.",
    noThanks: "No, thanks",
    continue: "Continue",
    selected: "Selected services",
  },
  el: {
    title: "Θες να σε βοηθήσουμε και με τα υπόλοιπα;",
    subtitle: "Διάλεξε τι χρειάζεσαι και θα το βάλουμε στο μήνυμα επικοινωνίας.",
    car: "Αυτοκίνητο",
    carText: "Θα ήθελα βοήθεια για ενοικίαση αυτοκινήτου.",
    tickets: "Εισιτήρια",
    ticketsText: "Θα ήθελα βοήθεια για εισιτήρια.",
    noThanks: "Όχι, ευχαριστώ",
    continue: "Συνέχεια",
    selected: "Επιλεγμένες υπηρεσίες",
  },
  fr: {
    title: "Souhaitez-vous de l’aide pour autre chose ?",
    subtitle: "Dites-nous ce dont vous avez besoin et nous l’ajouterons à votre demande.",
    car: "Voiture",
    carText: "Je souhaite de l’aide pour une location de voiture.",
    tickets: "Billets",
    ticketsText: "Je souhaite de l’aide pour les billets.",
    noThanks: "Non merci",
    continue: "Continuer",
    selected: "Services sélectionnés",
  },
  de: {
    title: "Möchtest du Hilfe bei etwas anderem?",
    subtitle: "Sag uns, was du brauchst, und wir nehmen es in deine Anfrage auf.",
    car: "Auto",
    carText: "Ich möchte Hilfe bei der Autovermietung.",
    tickets: "Tickets",
    ticketsText: "Ich möchte Hilfe bei Tickets.",
    noThanks: "Nein, danke",
    continue: "Weiter",
    selected: "Ausgewählte Services",
  },
  it: {
    title: "Vuoi aiuto con qualcos’altro?",
    subtitle: "Dicci cosa ti serve e lo aggiungeremo alla tua richiesta.",
    car: "Auto",
    carText: "Vorrei aiuto per il noleggio auto.",
    tickets: "Biglietti",
    ticketsText: "Vorrei aiuto per i biglietti.",
    noThanks: "No, grazie",
    continue: "Continua",
    selected: "Servizi selezionati",
  },
  es: {
    title: "¿Quieres ayuda con algo más?",
    subtitle: "Dinos qué necesitas y lo añadiremos a tu solicitud.",
    car: "Coche",
    carText: "Quisiera ayuda con el alquiler de coche.",
    tickets: "Billetes",
    ticketsText: "Quisiera ayuda con billetes.",
    noThanks: "No, gracias",
    continue: "Continuar",
    selected: "Servicios seleccionados",
  },
  tr: {
    title: "Başka bir konuda yardım ister misin?",
    subtitle: "Neye ihtiyacın olduğunu söyle, talebine ekleyelim.",
    car: "Araba",
    carText: "Araç kiralama konusunda yardım istiyorum.",
    tickets: "Biletler",
    ticketsText: "Biletler konusunda yardım istiyorum.",
    noThanks: "Hayır, teşekkürler",
    continue: "Devam et",
    selected: "Seçilen hizmetler",
  },
};

function replaceTokens(text: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    text,
  );
}

function getNights(checkin: string, checkout: string) {
  const start = new Date(`${checkin}T12:00:00`);
  const end = new Date(`${checkout}T12:00:00`);
  const diff = end.getTime() - start.getTime();

  if (!Number.isFinite(diff)) {
    return 0;
  }

  return Math.max(0, Math.round(diff / 86400000));
}

function formatMoney(value: number, currencyLocale: string) {
  return new Intl.NumberFormat(currencyLocale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function roomKey(room: RoomOption) {
  return `${room.roomId}_${room.unitId}`;
}

function isApartment(room: RoomOption) {
  return [8, 9, 10].includes(room.id);
}

function apiBaseGuests(room: RoomOption) {
  return isApartment(room) ? 4 : 2;
}

function roomExtraPerNight(room: RoomOption) {
  return ROOM_EXTRA_PER_NIGHT[room.id] || 0;
}

function extraGuestChargePerNight(room: RoomOption, guests: number) {
  const baseGuests = apiBaseGuests(room);

  if (baseGuests >= 4) {
    return 0;
  }

  if (guests === 3) {
    return 20;
  }

  if (guests >= 4) {
    return 30;
  }

  return 0;
}

function climateFeeTotal(nights: number) {
  return CONFIG.climateFeePerNight * Math.max(nights, 0);
}

function directDiscountAmount(systemTotal: number) {
  return Number(systemTotal || 0) * (CONFIG.directDiscountPercent / 100);
}

function directTotal(systemTotal: number) {
  return Number((Number(systemTotal || 0) - directDiscountAmount(systemTotal)).toFixed(2));
}

function calculateSystemTotal(
  room: RoomOption,
  liveTotal: number,
  nights: number,
  guests: number,
) {
  return Number(
    (
      Number(liveTotal || 0) +
      roomExtraPerNight(room) * nights +
      extraGuestChargePerNight(room, guests) * nights +
      climateFeeTotal(nights)
    ).toFixed(2),
  );
}

function getFilterLabel(
  filter: FilterKey,
  labels: FindYourRoomPageData["engine"]["filters"],
) {
  switch (filter) {
    case "all":
      return labels.all;
    case "budget":
      return labels.budget;
    case "stairs":
      return labels.stairs;
    case "upperFloor":
      return labels.upperFloor;
    case "ground":
      return labels.ground;
    case "gardenView":
      return labels.gardenView;
    case "upperFloorView":
      return labels.upperFloorView;
    case "kitchen":
      return labels.kitchen;
    case "noKitchen":
      return labels.noKitchen;
    default:
      return filter;
  }
}

function getAmenityLabel(
  amenity: RoomAmenity,
  labels: FindYourRoomPageData["engine"]["roomLabels"],
) {
  return labels[amenity.key as keyof typeof labels] || amenity.fallback;
}

function getRoomDescription(
  room: RoomOption,
  labels: FindYourRoomPageData["engine"]["roomLabels"],
) {
  if (room.description === "Budget double room") {
    return labels.budgetDoubleRoom;
  }

  if (room.description === "First-floor double / triple") {
    return labels.firstFloorDoubleTriple;
  }

  if (room.description === "Ground-floor double / triple") {
    return labels.groundFloorDoubleTriple;
  }

  if (room.description === "Apartment") {
    return labels.apartmentType;
  }

  return room.description;
}

function roomMatchesFilter(room: RoomOption, filter: FilterKey) {
  switch (filter) {
    case "all":
      return true;
    case "budget":
      return room.budget;
    case "stairs":
      return room.stairs;
    case "upperFloor":
      return room.floor;
    case "ground":
      return room.ground;
    case "gardenView":
      return room.gardenView;
    case "upperFloorView":
      return room.floor && !room.gardenView;
    case "kitchen":
      return room.kitchen || room.kitchenette;
    case "noKitchen":
      return !room.kitchen && !room.kitchenette;
    default:
      return true;
  }
}

async function fetchAvailabilityForGuests({
  checkin,
  checkout,
  guests,
  nights,
}: {
  checkin: string;
  checkout: string;
  guests: number;
  nights: number;
}): Promise<RoomResult[] | undefined> {
  try {
    const url = `${CONFIG.endpoint}?checkin=${encodeURIComponent(
      checkin,
    )}&checkout=${encodeURIComponent(checkout)}&guests=${encodeURIComponent(guests)}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success || !Array.isArray(data?.rooms?.available)) {
      return undefined;
    }

    const liveItems = data.rooms.available as LiveAvailabilityItem[];

    const available = liveItems
      .map((item) => {
        const local = roomOptions.find(
          (room) => roomKey(room) === `${item.roomId}_${item.unitId}`,
        );

        if (!local || guests > local.maxGuests) {
          return null;
        }

        const systemTotal = calculateSystemTotal(
          local,
          Number(item.totalPrice || 0),
          nights,
          guests,
        );
        const direct = directTotal(systemTotal);
        const save = Number((systemTotal - direct).toFixed(2));

        return {
          room: local,
          guests,
          liveTotal: Number(item.totalPrice || 0),
          systemTotal,
          directTotal: direct,
          save,
        };
      })
      .filter(Boolean) as RoomResult[];

    const roomResults = available.filter((item) => !isApartment(item.room));
    const apartmentResults = available.filter((item) => isApartment(item.room));

    if (roomResults.length && apartmentResults.length) {
      const maxRoomTotal = Math.max(...roomResults.map((item) => item.systemTotal));
      const apartmentFloor = maxRoomTotal + 5 * nights;

      apartmentResults.forEach((item) => {
        if (item.systemTotal <= maxRoomTotal) {
          item.systemTotal = Number(apartmentFloor.toFixed(2));
          item.directTotal = directTotal(item.systemTotal);
          item.save = Number((item.systemTotal - item.directTotal).toFixed(2));
        }
      });
    }

    return available;
  } catch {
    return undefined;
  }
}

function fallbackAvailabilityForGuests(guests: number, nights: number): RoomResult[] {
  return roomOptions
    .filter((room) => guests <= room.maxGuests)
    .map((room) => {
      const liveTotal = room.basePrice * Math.max(nights, 1);
      const systemTotal = calculateSystemTotal(room, liveTotal, Math.max(nights, 1), guests);
      const direct = directTotal(systemTotal);

      return {
        room,
        guests,
        liveTotal,
        systemTotal,
        directTotal: direct,
        save: Number((systemTotal - direct).toFixed(2)),
      };
    });
}

function ScratchPriceCard({
  result,
  labels,
  currencyLocale,
  initiallyRevealed,
  onReveal,
}: {
  result: RoomResult;
  labels: FindYourRoomPageData["engine"]["results"];
  currencyLocale: string;
  initiallyRevealed: boolean;
  onReveal: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(initiallyRevealed);
  const [hasStarted, setHasStarted] = useState(false);
  const drawingRef = useRef(false);
  const revealedRef = useRef(initiallyRevealed);

  useEffect(() => {
    setIsRevealed(initiallyRevealed);
    revealedRef.current = initiallyRevealed;
  }, [initiallyRevealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;

    if (!canvas || !wrap || isRevealed) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    function resize() {
      const rect = wrap.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, rect.width, rect.height);

      const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#6f7d38");
      gradient.addColorStop(0.25, "#8f9f4e");
      gradient.addColorStop(0.5, "#eef3df");
      gradient.addColorStop(0.75, "#8f9f4e");
      gradient.addColorStop(1, "#5f6f32");

      context.fillStyle = gradient;
      context.fillRect(0, 0, rect.width, rect.height);

      const shine = context.createLinearGradient(0, 0, rect.width, 0);
      shine.addColorStop(0, "rgba(255,255,255,0)");
      shine.addColorStop(0.5, "rgba(255,255,255,.35)");
      shine.addColorStop(1, "rgba(255,255,255,0)");

      context.fillStyle = shine;
      context.beginPath();
      context.moveTo(rect.width * 0.08, 0);
      context.lineTo(rect.width * 0.42, 0);
      context.lineTo(rect.width * 0.92, rect.height);
      context.lineTo(rect.width * 0.56, rect.height);
      context.closePath();
      context.fill();

      context.fillStyle = "rgba(255,253,250,.18)";
      for (let i = 0; i < 260; i += 1) {
        context.beginPath();
        context.arc(
          Math.random() * rect.width,
          Math.random() * rect.height,
          Math.random() * 1.1,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    }

    function getPoint(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();

      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function reveal() {
      if (revealedRef.current) {
        return;
      }

      revealedRef.current = true;
      setIsRevealed(true);
      onReveal();
    }

    function checkProgress() {
      const contextData = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      let total = 0;

      for (let i = 3; i < contextData.length; i += 24) {
        total += 1;

        if (contextData[i] < 40) {
          cleared += 1;
        }
      }

      if (total && cleared / total > 0.42) {
        reveal();
      }
    }

    function scratch(event: PointerEvent) {
      if (!drawingRef.current || revealedRef.current) {
        return;
      }

      event.preventDefault();
      setHasStarted(true);

      const point = getPoint(event);
      context.globalCompositeOperation = "destination-out";

      const radius = 26;
      const brush = context.createRadialGradient(point.x, point.y, 2, point.x, point.y, radius);
      brush.addColorStop(0, "rgba(0,0,0,1)");
      brush.addColorStop(0.65, "rgba(0,0,0,.85)");
      brush.addColorStop(1, "rgba(0,0,0,0)");

      context.fillStyle = brush;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      context.fill();

      checkProgress();
    }

    function pointerDown(event: PointerEvent) {
      drawingRef.current = true;
      canvas.setPointerCapture(event.pointerId);
      scratch(event);
    }

    function pointerUp(event: PointerEvent) {
      drawingRef.current = false;

      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // pointer may already be released
      }
    }

    resize();

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", scratch);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);
    window.addEventListener("resize", resize);

    return () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", scratch);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerUp);
      window.removeEventListener("resize", resize);
    };
  }, [isRevealed, onReveal]);

  return (
    <div className={`find-room-scratch ${isRevealed ? "is-revealed" : ""}`}>
      <div className="find-room-platform-price">
        <span>{labels.onKnownPlatforms}</span>
        <strong>{formatMoney(result.systemTotal, currencyLocale)}</strong>
        <small>
          +{formatMoney(result.save, currencyLocale)} {labels.more}
        </small>
      </div>

      <div ref={wrapRef} className="find-room-direct-price" style={{ position: "relative" }}>
        <span>{isRevealed ? labels.bestPriceGuarantee : labels.scratchAndSee}</span>
        <strong>{formatMoney(result.directTotal, currencyLocale)}</strong>

        {!isRevealed ? (
          <>
            <canvas
              ref={canvasRef}
              aria-label={labels.scratchAndSee}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                width: "100%",
                height: "100%",
                cursor: "crosshair",
                touchAction: "none",
                borderRadius: "inherit",
              }}
            />

            <span
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                color: "#fffdfa",
                fontWeight: 900,
                textShadow: "0 2px 8px rgba(45,39,34,.55)",
                opacity: hasStarted ? 0.35 : 1,
              }}
            >
              🖐️ {labels.scratchAndSee}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function FindYourRoomEngine({ data }: FindYourRoomEngineProps) {
  const t = data.engine;
  const language = data.language;
  const servicesText = serviceCopy[language] || serviceCopy.en;
  const reviews = breakfastReviews[language] || breakfastReviews.en;

  const [step, setStep] = useState<Step>("basics");
  const [firstName, setFirstName] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestRooms, setGuestRooms] = useState<GuestRoom[]>([{ id: 1, guests: 2 }]);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [resultsByRoomIndex, setResultsByRoomIndex] = useState<Record<number, RoomResult[]>>({});
  const [selectedRooms, setSelectedRooms] = useState<RoomResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceKey[]>([]);
  const [revealedPrices, setRevealedPrices] = useState<string[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const nights = useMemo(() => getNights(checkin, checkout), [checkin, checkout]);

  const totalGuests = useMemo(
    () => guestRooms.reduce((sum, room) => sum + room.guests, 0),
    [guestRooms],
  );

  const currentGuests = guestRooms[currentRoomIndex]?.guests || 2;

  const currentResults = useMemo(() => {
    const results = resultsByRoomIndex[currentRoomIndex] || [];
    const selectedKeys = new Set(selectedRooms.map((item) => roomKey(item.room)));

    return results
      .filter((item) => !selectedKeys.has(roomKey(item.room)))
      .filter((item) =>
        activeFilter === "all" ? true : roomMatchesFilter(item.room, activeFilter),
      )
      .sort((a, b) => a.directTotal - b.directTotal);
  }, [activeFilter, currentRoomIndex, resultsByRoomIndex, selectedRooms]);

  const selectedRoomsTotal = useMemo(
    () => selectedRooms.reduce((sum, item) => sum + item.directTotal, 0),
    [selectedRooms],
  );

  const climateIncludedTotal = selectedRoomsTotal;

  const breakfastTotal = useMemo(() => {
    if (!breakfast) {
      return 0;
    }

    return totalGuests * Math.max(nights, 0) * CONFIG.breakfastPerPersonPerNight;
  }, [breakfast, nights, totalGuests]);

  const directTotalFinal = useMemo(
    () => climateIncludedTotal + breakfastTotal,
    [breakfastTotal, climateIncludedTotal],
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => {
      setToast("");
    }, 2400);
  }

  function clearSearchState() {
    setCurrentRoomIndex(0);
    setResultsByRoomIndex({});
    setSelectedRooms([]);
    setBreakfast(false);
    setSelectedServices([]);
    setRevealedPrices([]);
  }

  function updateRoomsCount(value: number) {
    setRoomsCount(value);
    setGuestRooms((current) => {
      const next = Array.from({ length: value }, (_, index) => {
        return current[index] || { id: index + 1, guests: 2 };
      });

      return next.map((room, index) => ({
        ...room,
        id: index + 1,
      }));
    });
    clearSearchState();
  }

  function updateGuests(roomId: number, guests: number) {
    setGuestRooms((current) =>
      current.map((room) => (room.id === roomId ? { ...room, guests } : room)),
    );
    clearSearchState();
  }

  function validateBasics() {
    setError("");

    if (!firstName.trim()) {
      setError(t.validation.firstName);
      return false;
    }

    if (!checkin || !checkout) {
      setError(t.validation.dates);
      return false;
    }

    if (checkout <= checkin) {
      setError(t.validation.checkoutAfterCheckin);
      return false;
    }

    if (nights < 1) {
      setError(t.validation.minimumStay);
      return false;
    }

    if (guestRooms.some((room) => room.guests < 1)) {
      setError(t.validation.guests);
      return false;
    }

    return true;
  }

  function handleBasicsContinue() {
    if (!validateBasics()) {
      return;
    }

    setStep("filters");
  }

  async function searchRoomStep(roomIndex: number) {
    if (!validateBasics()) {
      return;
    }

    const guests = guestRooms[roomIndex]?.guests || 2;

    setIsSearching(true);
    setError("");

    const liveResults = await fetchAvailabilityForGuests({
      checkin,
      checkout,
      guests,
      nights,
    });

    const nextResults = liveResults || fallbackAvailabilityForGuests(guests, nights);

    setResultsByRoomIndex((current) => ({
      ...current,
      [roomIndex]: nextResults,
    }));

    setCurrentRoomIndex(roomIndex);
    setIsSearching(false);
    setStep("results");

    if (!liveResults) {
      showToast(t.validation.genericSearchError);
    }
  }

  function selectRoom(result: RoomResult) {
    const alreadySelected = selectedRooms.some(
      (item) => roomKey(item.room) === roomKey(result.room),
    );

    if (alreadySelected) {
      showToast(replaceTokens(t.toasts.alreadySelected, { roomName: result.room.name }));
      return;
    }

    const scratchKey = `${currentRoomIndex}-${roomKey(result.room)}`;

    if (!revealedPrices.includes(scratchKey)) {
      showToast(t.results.scratchAndSee);
      return;
    }

    const nextSelected = [...selectedRooms];
    nextSelected[currentRoomIndex] = result;

    setSelectedRooms(nextSelected);
    showToast(replaceTokens(t.toasts.roomAdded, { roomName: result.room.name }));

    if (currentRoomIndex < roomsCount - 1) {
      const nextRoomIndex = currentRoomIndex + 1;
      void searchRoomStep(nextRoomIndex);
    } else {
      setStep("breakfast");
    }
  }

  function removeSelectedRoom(index: number) {
    const room = selectedRooms[index];

    if (!room) {
      return;
    }

    setSelectedRooms((current) => current.slice(0, index));
    setCurrentRoomIndex(index);
    setStep("results");
    showToast(replaceTokens(t.results.removed, { roomName: room.room.name }));
  }

  function chooseBreakfast(value: boolean) {
    setBreakfast(value);
    showToast(value ? t.toasts.breakfastYes : t.toasts.breakfastNo);
  }

  function toggleService(service: ServiceKey) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  }

  function buildMessage() {
    const guestSummary = guestRooms
      .map((room) => `${t.basics.room} ${room.id}: ${room.guests}`)
      .join(", ");

    const roomSummary = selectedRooms
      .map((item, index) => {
        const guests = guestRooms[index]?.guests || item.guests;

        return `${index + 1}. ${item.room.name} - ${guests} ${t.results.guests} - ${formatMoney(
          item.directTotal,
          t.currencyLocale,
        )}`;
      })
      .join("\n");

    const serviceSummary = selectedServices.length
      ? selectedServices
          .map((service) => {
            if (service === "car") {
              return `- ${servicesText.car}: ${servicesText.carText}`;
            }

            return `- ${servicesText.tickets}: ${servicesText.ticketsText}`;
          })
          .join("\n")
      : "-";

    return [
      t.contact.messageGreeting,
      "",
      `${t.contact.messageName} ${firstName} ${lastName}`.trim(),
      t.contact.messageIntro,
      "",
      `${t.contact.messageCheckin}: ${checkin}`,
      `${t.contact.messageCheckout}: ${checkout}`,
      `${t.contact.messageNights}: ${nights}`,
      `${t.contact.messageRooms}: ${roomsCount}`,
      `${t.contact.messageTotalGuests}: ${totalGuests} (${guestSummary})`,
      "",
      `${t.contact.messageRoomSelections}:`,
      roomSummary,
      "",
      `${t.contact.messageBreakfast}: ${breakfast ? t.contact.yes : t.contact.no}`,
      `${servicesText.selected}:`,
      serviceSummary,
      "",
      `${t.contact.messageDirectTotal}: ${formatMoney(directTotalFinal, t.currencyLocale)}`,
      "",
      email ? `Email: ${email}` : "",
      mobile ? `${t.contact.mobile}: ${mobile}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  const whatsappHref = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
    buildMessage(),
  )}`;

  const phoneHref = `tel:${CONFIG.phone}`;

  return (
    <div className="find-room-engine">
      <div className="find-room-card find-room-card--rich">
        <div className="find-room-topbar" aria-label="Direct booking benefits">
          <span className="find-room-live-pill">
            <span className="find-room-live-dot" />
            {t.topBenefits.live}
          </span>
          <span className="find-room-shine-pill">⚡ {t.topBenefits.directContact}</span>
          <span className="find-room-shine-pill">🎁 {t.topBenefits.discount}</span>
          <span className="find-room-shine-pill">
            💸 <span className="find-room-strike">{t.topBenefits.commissions}</span>
          </span>
        </div>

        {toast ? <div className="find-room-toast">{toast}</div> : null}
        {error ? <div className="find-room-error">{error}</div> : null}

        {step === "basics" ? (
          <section className="find-room-step">
            <h2>{t.basics.title}</h2>

            <div className="find-room-grid">
              <label>
                <span>{t.basics.firstName}</span>
                <input
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    clearSearchState();
                  }}
                  placeholder={t.basics.firstNamePlaceholder}
                />
              </label>

              <label>
                <span>{t.basics.checkin}</span>
                <input
                  type="date"
                  value={checkin}
                  onChange={(event) => {
                    setCheckin(event.target.value);
                    clearSearchState();
                  }}
                />
              </label>

              <label>
                <span>{t.basics.checkout}</span>
                <input
                  type="date"
                  value={checkout}
                  onChange={(event) => {
                    setCheckout(event.target.value);
                    clearSearchState();
                  }}
                />
              </label>

              <label>
                <span>{t.basics.roomsCount}</span>
                <select
                  value={roomsCount}
                  onChange={(event) => updateRoomsCount(Number(event.target.value))}
                >
                  {[1, 2, 3, 4].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="find-room-guests">
              {guestRooms.map((room) => (
                <label key={room.id}>
                  <span>
                    {t.basics.room} {room.id} — {t.basics.guests}
                  </span>
                  <select
                    value={room.guests}
                    onChange={(event) =>
                      updateGuests(room.id, Number(event.target.value))
                    }
                  >
                    {[1, 2, 3, 4].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <button
              className="find-room-primary"
              type="button"
              onClick={handleBasicsContinue}
            >
              {t.basics.continue}
            </button>
          </section>
        ) : null}

        {step === "filters" ? (
          <section className="find-room-step">
            <h2>
              {firstName.trim()
                ? replaceTokens(t.filters.titleWithName, {
                    name: firstName.trim(),
                  })
                : t.filters.title}
            </h2>

            <div className="find-room-filter-list find-room-filter-list--rich">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={activeFilter === filter.key ? "is-active" : ""}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  <span>{filter.icon}</span>
                  {getFilterLabel(filter.key, t.filters)}
                </button>
              ))}
            </div>

            <div className="find-room-actions">
              <button
                type="button"
                className="find-room-secondary"
                onClick={() => {
                  setActiveFilter("all");
                  showToast(t.toasts.reset);
                }}
              >
                {t.filters.clear}
              </button>

              <button
                type="button"
                className="find-room-primary"
                onClick={() => searchRoomStep(0)}
                disabled={isSearching}
              >
                {isSearching ? t.filters.checking : t.filters.search}
              </button>
            </div>
          </section>
        ) : null}

        {step === "results" ? (
          <section className="find-room-step">
            <h2>
              {firstName.trim()
                ? replaceTokens(t.results.titleWithName, {
                    name: firstName.trim(),
                  })
                : t.results.title}
            </h2>

            <div className="find-room-summary">
              <span>
                {t.basics.room} {currentRoomIndex + 1}/{roomsCount}
              </span>
              <span>
                {currentGuests} {currentGuests === 1 ? t.results.guest : t.results.guests}
              </span>
              <span>
                {nights} {nights === 1 ? t.results.night : t.results.nights}
              </span>
              <span>
                {selectedRooms.length}/{roomsCount} {t.results.selected}
              </span>
            </div>

            {selectedRooms.length ? (
              <div className="find-room-results" style={{ marginBottom: "1rem" }}>
                {selectedRooms.map((item, index) => (
                  <article
                    key={`${roomKey(item.room)}-${index}`}
                    className="find-room-result-card find-room-result-card--rich is-selected"
                  >
                    <div className="find-room-photo-wrap">
                      <div className="find-room-selected-badge">✓ {t.results.selected}</div>
                      <img src={item.room.images[0]} alt={item.room.name} />
                    </div>

                    <div className="find-room-result-card__body">
                      <div>
                        <p className="find-room-badge">
                          {item.room.type === "apartment"
                            ? t.roomLabels.apartment
                            : t.roomLabels.room}
                        </p>
                        <h3>{item.room.name}</h3>
                        <p>
                          {getRoomDescription(item.room, t.roomLabels)} ·{" "}
                          {guestRooms[index]?.guests || item.guests} {t.results.guests}
                        </p>
                      </div>

                      <div className="find-room-total-box">
                        <div>
                          <span>{t.breakfast.directPrice}</span>
                          <strong>{formatMoney(item.directTotal, t.currencyLocale)}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="find-room-secondary"
                        onClick={() => removeSelectedRoom(index)}
                      >
                        {t.results.changeSelection}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {currentResults.length === 0 ? (
              <div className="find-room-empty">
                <h3>{t.results.noPerfectMatchTitle}</h3>
                <p>{t.results.noPerfectMatchText}</p>
              </div>
            ) : (
              <div className="find-room-results find-room-results--rich">
                {currentResults.map((result, index) => {
                  const room = result.room;
                  const scratchKey = `${currentRoomIndex}-${roomKey(room)}`;
                  const selected = selectedRooms.some(
                    (item) => roomKey(item.room) === roomKey(room),
                  );

                  return (
                    <article
                      key={`${scratchKey}-${index}`}
                      className={`find-room-result-card find-room-result-card--rich ${
                        selected ? "is-selected" : ""
                      }`}
                    >
                      <div className="find-room-photo-wrap">
                        {index === 0 && !selected ? (
                          <div className="find-room-best-badge">
                            {t.results.bestChoice}
                          </div>
                        ) : null}

                        <img src={room.images[0]} alt={room.name} />

                        <div className="find-room-bed-overlay">
                          {room.amenities
                            .filter((amenity) =>
                              ["doubleBed", "singleBed", "singleBeds2", "sofaBed", "sofaBeds2"].includes(
                                amenity.key,
                              ),
                            )
                            .map((amenity) => (
                              <span key={amenity.key}>
                                {amenity.icon} {getAmenityLabel(amenity, t.roomLabels)}
                              </span>
                            ))}
                        </div>

                        <div className="find-room-gallery-hint">📷 {t.results.gallery}</div>
                      </div>

                      <div className="find-room-result-card__body">
                        <div className="find-room-result-card__top">
                          <div>
                            <p className="find-room-badge">
                              {room.type === "apartment"
                                ? t.roomLabels.apartment
                                : t.roomLabels.room}
                            </p>
                            <h3>{room.name}</h3>
                            <p>
                              {getRoomDescription(room, t.roomLabels)} · {room.location}
                            </p>
                          </div>
                        </div>

                        <div className="find-room-badge-row">
                          <span className="find-room-soft-badge">
                            🎁 {t.results.discount}
                          </span>
                          <span className="find-room-green-badge">
                            ⚡ {t.results.liveNow}
                          </span>
                        </div>

                        <ul className="find-room-amenities">
                          {room.amenities
                            .filter(
                              (amenity) =>
                                ![
                                  "doubleBed",
                                  "singleBed",
                                  "singleBeds2",
                                  "sofaBed",
                                  "sofaBeds2",
                                ].includes(amenity.key),
                            )
                            .slice(0, 6)
                            .map((amenity) => (
                              <li key={amenity.key}>
                                {amenity.icon} {getAmenityLabel(amenity, t.roomLabels)}
                              </li>
                            ))}
                        </ul>

                        <ScratchPriceCard
                          result={result}
                          labels={t.results}
                          currencyLocale={t.currencyLocale}
                          initiallyRevealed={revealedPrices.includes(scratchKey)}
                          onReveal={() => {
                            setRevealedPrices((current) =>
                              current.includes(scratchKey)
                                ? current
                                : [...current, scratchKey],
                            );
                          }}
                        />

                        <div className="find-room-result-card__footer">
                          <button
                            type="button"
                            className="find-room-primary"
                            onClick={() => selectRoom(result)}
                          >
                            {t.results.select}
                          </button>

                          <span>
                            {selectedRooms.length}/{roomsCount} {t.results.selected}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="find-room-total-box">
              <div>
                <span>{t.breakfast.directPrice}</span>
                <strong>{formatMoney(selectedRoomsTotal, t.currencyLocale)}</strong>
              </div>
              <p>
                {t.results.bestPriceGuarantee} · {t.results.discount}{" "}
                {CONFIG.directDiscountPercent}%
              </p>
            </div>
          </section>
        ) : null}

        {step === "breakfast" ? (
          <section className="find-room-step">
            <h2>
              {firstName.trim()
                ? replaceTokens(t.breakfast.titleWithName, {
                    name: firstName.trim(),
                  })
                : t.breakfast.title}
            </h2>

            <div className="find-room-breakfast-card">
              <div className="find-room-breakfast-photo-wrap">
                <img
                  src="/images/booking/breakfast.jpg"
                  alt={t.breakfast.title}
                  className="find-room-breakfast-photo"
                />
                <span>{t.breakfast.priceBadge}</span>
              </div>

              <div className="find-room-breakfast-side">
                <p>
                  {roomsCount} {roomsCount === 1 ? t.results.room : t.results.rooms} ·{" "}
                  {totalGuests} {totalGuests === 1 ? t.results.guest : t.results.guests} ·{" "}
                  {nights} {nights === 1 ? t.results.night : t.results.nights}
                </p>

                <div
                  className="find-room-breakfast-review"
                  onClick={() =>
                    setReviewIndex((current) => (current + 1) % reviews.length)
                  }
                  role="button"
                  tabIndex={0}
                >
                  <strong>{t.breakfast.reviewsTitle}</strong>
                  <span>{reviews[reviewIndex]}</span>
                  <small>
                    {reviews.map((_, index) => (index === reviewIndex ? "●" : "○")).join(" ")}
                  </small>
                </div>

                <div className="find-room-breakfast-grid">
                  <button
                    type="button"
                    className={`find-room-choice-card ${breakfast ? "is-active" : ""}`}
                    onClick={() => chooseBreakfast(true)}
                  >
                    <strong>🍳 {t.breakfast.withBreakfast}</strong>
                    <span>{t.breakfast.priceBadge}</span>
                  </button>

                  <button
                    type="button"
                    className={`find-room-choice-card ${!breakfast ? "is-active" : ""}`}
                    onClick={() => chooseBreakfast(false)}
                  >
                    <strong>— {t.breakfast.withoutBreakfast}</strong>
                    <span>{t.breakfast.notAdded}</span>
                  </button>
                </div>

                <div className="find-room-total-box">
                  <div>
                    <span>{t.breakfast.directPrice}</span>
                    <strong>{formatMoney(selectedRoomsTotal, t.currencyLocale)}</strong>
                  </div>
                  <div>
                    <span>{t.breakfast.breakfast}</span>
                    <strong>{formatMoney(breakfastTotal, t.currencyLocale)}</strong>
                  </div>
                  <div>
                    <span>{t.breakfast.total}</span>
                    <strong>{formatMoney(directTotalFinal, t.currencyLocale)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="find-room-primary"
                  onClick={() => setStep("services")}
                >
                  {t.breakfast.continue}
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {step === "services" ? (
          <section className="find-room-step">
            <h2>{servicesText.title}</h2>
            <p>{servicesText.subtitle}</p>

            <div className="find-room-services-grid">
              <button
                type="button"
                className={`find-room-service-card ${
                  selectedServices.includes("car") ? "is-active" : ""
                }`}
                onClick={() => toggleService("car")}
              >
                <strong>🚗 {servicesText.car}</strong>
                <span>{servicesText.carText}</span>
              </button>

              {language === "el" ? (
                <button
                  type="button"
                  className={`find-room-service-card ${
                    selectedServices.includes("tickets") ? "is-active" : ""
                  }`}
                  onClick={() => toggleService("tickets")}
                >
                  <strong>🎫 {servicesText.tickets}</strong>
                  <span>{servicesText.ticketsText}</span>
                </button>
              ) : null}
            </div>

            <div className="find-room-actions">
              <button
                type="button"
                className="find-room-secondary"
                onClick={() => {
                  setSelectedServices([]);
                  setStep("contact");
                }}
              >
                {servicesText.noThanks}
              </button>

              <button
                type="button"
                className="find-room-primary"
                onClick={() => setStep("contact")}
              >
                {servicesText.continue}
              </button>
            </div>
          </section>
        ) : null}

        {step === "contact" ? (
          <section className="find-room-step">
            <h2>{t.contact.title}</h2>
            <p>{t.contact.subtitle}</p>

            <div className="find-room-grid">
              <label>
                <span>{t.contact.lastName}</span>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </label>

              <label>
                <span>{t.contact.email}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label>
                <span>{t.contact.mobile}</span>
                <input
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                />
              </label>
            </div>

            <div className="find-room-final-summary">
              <div>
                <span>{t.contact.messageBreakfast}</span>
                <strong>{breakfast ? t.contact.yes : t.contact.no}</strong>
              </div>

              <div>
                <span>{servicesText.selected}</span>
                <strong>
                  {selectedServices.length
                    ? selectedServices
                        .map((service) =>
                          service === "car" ? servicesText.car : servicesText.tickets,
                        )
                        .join(", ")
                    : "-"}
                </strong>
              </div>

              <div>
                <span>{t.contact.messageDirectTotal}</span>
                <strong>{formatMoney(directTotalFinal, t.currencyLocale)}</strong>
              </div>
            </div>

            <div className="find-room-actions">
              <a className="find-room-primary" href={whatsappHref} target="_blank">
                {t.contact.whatsapp}
              </a>

              <a className="find-room-secondary" href={phoneHref}>
                {t.contact.phone}
              </a>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}