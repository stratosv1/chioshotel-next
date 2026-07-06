"use client";

import { useEffect, useMemo, useState } from "react";
import type { HomePageData } from "@/content/home";

type LastMinuteData = HomePageData["lastMinute"];
type Locale = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

type DealRoom = {
  id?: number;
  roomId: number;
  unitId: number;
  displayName?: string;
  type?: string;
  location?: string;
  maxGuests?: number;
  images?: string[];
  budget?: boolean;
  stairs?: boolean;
  ground?: boolean;
  floor?: boolean;
  gardenView?: boolean;
  kitchen?: boolean;
  kitchenette?: boolean;
};

type DealDayResult = {
  available?: boolean;
  totalPrice?: number | string;
};

type DealDay = {
  checkin: string;
  results?: Record<string, DealDayResult>;
};

type DealsResponse = {
  rooms?: DealRoom[];
  days?: DealDay[];
  updatedAt?: string;
  updated_at?: string;
};

type RoomMeta = Required<
  Pick<
    DealRoom,
    | "id"
    | "roomId"
    | "unitId"
    | "displayName"
    | "type"
    | "location"
    | "maxGuests"
    | "budget"
    | "stairs"
    | "ground"
    | "floor"
    | "gardenView"
    | "kitchen"
    | "kitchenette"
    | "images"
  >
>;

type FilterKey =
  | "budget"
  | "stairs"
  | "upperFloor"
  | "ground"
  | "gardenView"
  | "upperFloorView"
  | "kitchen"
  | "noKitchen";

type FilterItem = {
  key: FilterKey;
  icon: string;
  label: string;
};

type Copy = {
  localeTag: string;
  filters: FilterItem[];
  rooms: Omit<RoomMeta, "roomId" | "unitId" | "maxGuests" | "budget" | "stairs" | "ground" | "floor" | "gardenView" | "kitchen" | "kitchenette" | "images">[];
  badges: Record<string, { cls: string; icon: string; text: string }[]>;
  labels: {
    resultsInitial: string;
    emptyInitial: string;
    foundPrefix: string;
    foundMiddle: string;
    foundSuffix: string;
    emptyFiltered: string;
    calendarTitle: string;
    availableLegend: string;
    bestPrice: string;
    directPerNight: string;
    checkin: string;
    checkout: string;
    nights: string;
    guests: string;
    totalLabel: string;
    saved: string;
    sendWhatsapp: string;
    clear: string;
    updated: string;
    loadingFallback: string;
    error: string;
    noData: string;
    lowDirectPrice: string;
    noCommissions: string;
    chooseRoom: string;
    noCreditCard: string;
    bestToday: string;
    popular: string;
    booking: string;
    recommended: string;
    available: string;
    unavailable: string;
  };
  features: {
    economy: string;
    ground: string;
    upperFloor: string;
    otherLocation: string;
    gardenView: string;
    noGardenView: string;
    upperView: string;
    kitchen: string;
    kitchenette: string;
    noKitchen: string;
    stairs: string;
    noStairs: string;
  };
  whatsapp: {
    intro: string;
    room: string;
    type: string;
    location: string;
    guests: string;
    checkin: string;
    checkout: string;
    nights: string;
    standardTotal: string;
    directTotal: string;
    outro: string;
  };
};

const CONFIG = {
  DEALS_ENDPOINT: "/api/deals",
  WHATSAPP_NUMBER: "306944474226",
  DIRECT_DISCOUNT_PERCENT: 15,
  CLIMATE_FEE_PER_NIGHT: 2,
};

const ROOM_EXTRA_PER_NIGHT: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
};

const ROOM_META_BASE = [
  {
    id: 1,
    roomId: 267788,
    unitId: 1,
    maxGuests: 4,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    kitchen: false,
    kitchenette: false,
    images: ["/images/rooms/DSC07776-2-e1675109942622.webp"],
  },
  {
    id: 2,
    roomId: 268803,
    unitId: 1,
    maxGuests: 2,
    budget: true,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    kitchen: false,
    kitchenette: false,
    images: ["/images/rooms/DSC07803-1.webp"],
  },
  {
    id: 3,
    roomId: 267788,
    unitId: 2,
    maxGuests: 3,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    kitchen: false,
    kitchenette: true,
    images: ["/images/rooms/DSC07867-1.webp"],
  },
  {
    id: 4,
    roomId: 267788,
    unitId: 3,
    maxGuests: 3,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    kitchen: false,
    kitchenette: true,
    images: ["/images/rooms/received_1748354861920234.webp"],
  },
  {
    id: 5,
    roomId: 626129,
    unitId: 1,
    maxGuests: 3,
    budget: false,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    kitchen: false,
    kitchenette: false,
    images: ["/images/rooms/voulamandis-house-rooms.webp"],
  },
  {
    id: 6,
    roomId: 268803,
    unitId: 2,
    maxGuests: 2,
    budget: true,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    kitchen: false,
    kitchenette: false,
    images: ["/images/rooms/received_1753964631359257.webp"],
  },
  {
    id: 7,
    roomId: 626129,
    unitId: 2,
    maxGuests: 3,
    budget: false,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    kitchen: false,
    kitchenette: false,
    images: ["/images/rooms/double-triple-room.jpg"],
  },
  {
    id: 8,
    roomId: 265595,
    unitId: 1,
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    kitchen: true,
    kitchenette: false,
    images: ["/images/rooms/chios-apartments-voulamandis.webp"],
  },
  {
    id: 9,
    roomId: 265595,
    unitId: 2,
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    kitchen: true,
    kitchenette: false,
    images: ["/images/rooms/chios-apartments-voulamandis.webp"],
  },
  {
    id: 10,
    roomId: 265595,
    unitId: 3,
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    kitchen: true,
    kitchenette: false,
    images: ["/images/rooms/DSC07899.webp"],
  },
] as const;

const ROOM_NAMES: Record<Locale, Copy["rooms"]> = {
  en: [
    { id: 1, displayName: "Room 1", type: "Upper Floor Double / Triple Room", location: "Upper floor" },
    { id: 2, displayName: "Room 2", type: "Economy Double Room", location: "Upper floor" },
    { id: 3, displayName: "Room 3", type: "Upper Floor Double / Triple Room", location: "Upper floor" },
    { id: 4, displayName: "Room 4", type: "Upper Floor Double / Triple Room", location: "Upper floor" },
    { id: 5, displayName: "Room 5", type: "Ground Floor Double / Triple Room", location: "Ground floor" },
    { id: 6, displayName: "Room 6", type: "Economy Double Room", location: "Ground floor" },
    { id: 7, displayName: "Room 7", type: "Ground Floor Double / Triple Room", location: "Ground floor" },
    { id: 8, displayName: "Apartment 8", type: "Apartment", location: "Independent" },
    { id: 9, displayName: "Apartment 9", type: "Apartment", location: "Independent" },
    { id: 10, displayName: "Apartment 10", type: "Apartment", location: "Independent" },
  ],
  el: [
    { id: 1, displayName: "Room 1", type: "Δίκλινο / Τρίκλινο στον επάνω όροφο", location: "Επάνω όροφος" },
    { id: 2, displayName: "Room 2", type: "Economy δίκλινο δωμάτιο", location: "Επάνω όροφος" },
    { id: 3, displayName: "Room 3", type: "Δίκλινο / Τρίκλινο στον επάνω όροφο", location: "Επάνω όροφος" },
    { id: 4, displayName: "Room 4", type: "Δίκλινο / Τρίκλινο στον επάνω όροφο", location: "Επάνω όροφος" },
    { id: 5, displayName: "Room 5", type: "Δίκλινο / Τρίκλινο ισογείου", location: "Ισόγειο" },
    { id: 6, displayName: "Room 6", type: "Economy δίκλινο δωμάτιο", location: "Ισόγειο" },
    { id: 7, displayName: "Room 7", type: "Δίκλινο / Τρίκλινο ισογείου", location: "Ισόγειο" },
    { id: 8, displayName: "Apartment 8", type: "Διαμέρισμα", location: "Ανεξάρτητο" },
    { id: 9, displayName: "Apartment 9", type: "Διαμέρισμα", location: "Ανεξάρτητο" },
    { id: 10, displayName: "Apartment 10", type: "Διαμέρισμα", location: "Ανεξάρτητο" },
  ],
  fr: [
    { id: 1, displayName: "Room 1", type: "Chambre Double / Triple à l’étage", location: "Étage" },
    { id: 2, displayName: "Room 2", type: "Chambre Double Économique", location: "Étage" },
    { id: 3, displayName: "Room 3", type: "Chambre Double / Triple à l’étage", location: "Étage" },
    { id: 4, displayName: "Room 4", type: "Chambre Double / Triple à l’étage", location: "Étage" },
    { id: 5, displayName: "Room 5", type: "Chambre Double / Triple au rez-de-chaussée", location: "Rez-de-chaussée" },
    { id: 6, displayName: "Room 6", type: "Chambre Double Économique", location: "Rez-de-chaussée" },
    { id: 7, displayName: "Room 7", type: "Chambre Double / Triple au rez-de-chaussée", location: "Rez-de-chaussée" },
    { id: 8, displayName: "Apartment 8", type: "Appartement", location: "Indépendant" },
    { id: 9, displayName: "Apartment 9", type: "Appartement", location: "Indépendant" },
    { id: 10, displayName: "Apartment 10", type: "Appartement", location: "Indépendant" },
  ],
  de: [
    { id: 1, displayName: "Room 1", type: "Doppel- / Dreibettzimmer im Obergeschoss", location: "Obergeschoss" },
    { id: 2, displayName: "Room 2", type: "Economy Doppelzimmer", location: "Obergeschoss" },
    { id: 3, displayName: "Room 3", type: "Doppel- / Dreibettzimmer im Obergeschoss", location: "Obergeschoss" },
    { id: 4, displayName: "Room 4", type: "Doppel- / Dreibettzimmer im Obergeschoss", location: "Obergeschoss" },
    { id: 5, displayName: "Room 5", type: "Doppel- / Dreibettzimmer im Erdgeschoss", location: "Erdgeschoss" },
    { id: 6, displayName: "Room 6", type: "Economy Doppelzimmer", location: "Erdgeschoss" },
    { id: 7, displayName: "Room 7", type: "Doppel- / Dreibettzimmer im Erdgeschoss", location: "Erdgeschoss" },
    { id: 8, displayName: "Apartment 8", type: "Apartment", location: "Unabhängig" },
    { id: 9, displayName: "Apartment 9", type: "Apartment", location: "Unabhängig" },
    { id: 10, displayName: "Apartment 10", type: "Apartment", location: "Unabhängig" },
  ],
  it: [
    { id: 1, displayName: "Room 1", type: "Camera Doppia / Tripla al Piano Superiore", location: "Piano superiore" },
    { id: 2, displayName: "Room 2", type: "Camera Doppia Economy", location: "Piano superiore" },
    { id: 3, displayName: "Room 3", type: "Camera Doppia / Tripla al Piano Superiore", location: "Piano superiore" },
    { id: 4, displayName: "Room 4", type: "Camera Doppia / Tripla al Piano Superiore", location: "Piano superiore" },
    { id: 5, displayName: "Room 5", type: "Camera Doppia / Tripla al Piano Terra", location: "Piano terra" },
    { id: 6, displayName: "Room 6", type: "Camera Doppia Economy", location: "Piano terra" },
    { id: 7, displayName: "Room 7", type: "Camera Doppia / Tripla al Piano Terra", location: "Piano terra" },
    { id: 8, displayName: "Apartment 8", type: "Appartamento", location: "Indipendente" },
    { id: 9, displayName: "Apartment 9", type: "Appartamento", location: "Indipendente" },
    { id: 10, displayName: "Apartment 10", type: "Appartamento", location: "Indipendente" },
  ],
  es: [
    { id: 1, displayName: "Room 1", type: "Habitación Doble / Triple en Planta Alta", location: "Planta alta" },
    { id: 2, displayName: "Room 2", type: "Habitación Doble Económica", location: "Planta alta" },
    { id: 3, displayName: "Room 3", type: "Habitación Doble / Triple en Planta Alta", location: "Planta alta" },
    { id: 4, displayName: "Room 4", type: "Habitación Doble / Triple en Planta Alta", location: "Planta alta" },
    { id: 5, displayName: "Room 5", type: "Habitación Doble / Triple en Planta Baja", location: "Planta baja" },
    { id: 6, displayName: "Room 6", type: "Habitación Doble Económica", location: "Planta baja" },
    { id: 7, displayName: "Room 7", type: "Habitación Doble / Triple en Planta Baja", location: "Planta baja" },
    { id: 8, displayName: "Apartment 8", type: "Apartamento", location: "Independiente" },
    { id: 9, displayName: "Apartment 9", type: "Apartamento", location: "Independiente" },
    { id: 10, displayName: "Apartment 10", type: "Apartamento", location: "Independiente" },
  ],
  tr: [
    { id: 1, displayName: "Room 1", type: "Üst Kat Çift / Üç Kişilik Oda", location: "Üst kat" },
    { id: 2, displayName: "Room 2", type: "Ekonomi Çift Kişilik Oda", location: "Üst kat" },
    { id: 3, displayName: "Room 3", type: "Üst Kat Çift / Üç Kişilik Oda", location: "Üst kat" },
    { id: 4, displayName: "Room 4", type: "Üst Kat Çift / Üç Kişilik Oda", location: "Üst kat" },
    { id: 5, displayName: "Room 5", type: "Zemin Kat Çift / Üç Kişilik Oda", location: "Zemin kat" },
    { id: 6, displayName: "Room 6", type: "Ekonomi Çift Kişilik Oda", location: "Zemin kat" },
    { id: 7, displayName: "Room 7", type: "Zemin Kat Çift / Üç Kişilik Oda", location: "Zemin kat" },
    { id: 8, displayName: "Apartment 8", type: "Daire", location: "Bağımsız" },
    { id: 9, displayName: "Apartment 9", type: "Daire", location: "Bağımsız" },
    { id: 10, displayName: "Apartment 10", type: "Daire", location: "Bağımsız" },
  ],
};

const COPY: Record<Locale, Omit<Copy, "rooms">> = {
  en: {
    localeTag: "en-GB",
    filters: [
      { key: "budget", icon: "💸", label: "Budget" },
      { key: "stairs", icon: "🪜", label: "Stairs" },
      { key: "upperFloor", icon: "🏛️", label: "Upper floor" },
      { key: "ground", icon: "🌿", label: "Ground floor" },
      { key: "gardenView", icon: "🌳", label: "Garden view" },
      { key: "upperFloorView", icon: "🌾", label: "Upper view" },
      { key: "kitchen", icon: "🍳", label: "Kitchen" },
      { key: "noKitchen", icon: "🚫🍳", label: "No kitchen" },
    ],
    badges: {
      "267788_1": [{ cls: "favorite", icon: "⭐", text: "Guest favorite" }],
      "626129_1": [{ cls: "popular", icon: "🔥", text: "Popular choice" }],
      "265595_1": [{ cls: "booked", icon: "⚡", text: "Top deal" }],
      "265595_3": [{ cls: "favorite", icon: "👨‍👩‍👧", text: "Family friendly" }],
    },
    labels: {
      resultsInitial: "First select guests.",
      emptyInitial: "First choose 2, 3 or 4 guests to see available deals.",
      foundPrefix: "Found",
      foundMiddle: "options for",
      foundSuffix: "guests.",
      emptyFiltered: "No deals available with the selected filters.",
      calendarTitle: "Stay deals for the next 7 days",
      availableLegend: "✓ = available · ✕ = unavailable",
      bestPrice: "BEST PRICE",
      directPerNight: "direct / night",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Nights",
      guests: "Guests",
      totalLabel: "DIRECT BOOKING COST",
      saved: "You save",
      sendWhatsapp: "Send request on WhatsApp",
      clear: "Clear selection",
      updated: "Updated:",
      loadingFallback: "Loading available deals…",
      error: "We could not load the deals. Please try again.",
      noData: "No availability data is currently available.",
      lowDirectPrice: "Lowest direct price",
      noCommissions: "No commissions",
      chooseRoom: "Choose your room",
      noCreditCard: "No credit card",
      bestToday: "Best price today",
      popular: "Popular",
      booking: "Being booked",
      recommended: "Recommended",
      available: "available",
      unavailable: "unavailable",
    },
    features: {
      economy: "💸 Budget",
      ground: "🌿 Ground floor",
      upperFloor: "🏛️ Upper floor",
      otherLocation: "📍 Other location",
      gardenView: "🌳 Garden view",
      noGardenView: "🚫🌳 No garden view",
      upperView: "🌾 Upper view",
      kitchen: "🍳 Kitchen",
      kitchenette: "🥣 Kitchenette",
      noKitchen: "🚫🍳 No kitchen",
      stairs: "🪜 Stairs",
      noStairs: "♿ No stairs",
    },
    whatsapp: {
      intro: "Hello, I am interested in a direct booking:",
      room: "Room",
      type: "Type",
      location: "Location",
      guests: "Guests",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Nights",
      standardTotal: "Standard total",
      directTotal: "Direct booking total",
      outro: "I would like to confirm availability.",
    },
  },
  el: {
    localeTag: "el-GR",
    filters: [
      { key: "budget", icon: "💸", label: "Οικονομικό" },
      { key: "stairs", icon: "🪜", label: "Σκάλες" },
      { key: "upperFloor", icon: "🏛️", label: "Επάνω όροφος" },
      { key: "ground", icon: "🌿", label: "Ισόγειο" },
      { key: "gardenView", icon: "🌳", label: "Θέα κήπου" },
      { key: "upperFloorView", icon: "🌾", label: "Θέα επάνω" },
      { key: "kitchen", icon: "🍳", label: "Κουζίνα" },
      { key: "noKitchen", icon: "🚫🍳", label: "Χωρίς κουζίνα" },
    ],
    badges: {
      "267788_1": [{ cls: "favorite", icon: "⭐", text: "Αγαπημένο" }],
      "626129_1": [{ cls: "popular", icon: "🔥", text: "Πολύ δημοφιλές" }],
      "265595_1": [{ cls: "booked", icon: "⚡", text: "Top προσφορά" }],
      "265595_3": [{ cls: "favorite", icon: "👨‍👩‍👧", text: "Ιδανικό για οικογένειες" }],
    },
    labels: {
      resultsInitial: "Επιλέξτε πρώτα αριθμό επισκεπτών.",
      emptyInitial: "Επιλέξτε πρώτα 2, 3 ή 4 άτομα για να δείτε διαθέσιμες προσφορές.",
      foundPrefix: "Βρέθηκαν",
      foundMiddle: "επιλογές για",
      foundSuffix: "άτομα.",
      emptyFiltered: "Δεν υπάρχουν διαθέσιμες προσφορές με τα επιλεγμένα φίλτρα.",
      calendarTitle: "Προσφορές διαμονής για τις επόμενες 7 ημέρες",
      availableLegend: "✓ = διαθέσιμο · ✕ = μη διαθέσιμο",
      bestPrice: "ΚΑΛΥΤΕΡΗ ΤΙΜΗ",
      directPerNight: "direct / νύχτα",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Νύχτες",
      guests: "Άτομα",
      totalLabel: "ΚΟΣΤΟΣ ΑΠΕΥΘΕΙΑΣ ΚΡΑΤΗΣΗΣ",
      saved: "Κερδίζετε",
      sendWhatsapp: "Στείλτε αίτημα στο WhatsApp",
      clear: "Καθαρισμός επιλογής",
      updated: "Ενημερώθηκε:",
      loadingFallback: "Φορτώνουμε τις διαθέσιμες προσφορές…",
      error: "Δεν μπορέσαμε να φορτώσουμε τις προσφορές. Δοκιμάστε ξανά.",
      noData: "Δεν υπάρχουν διαθέσιμα δεδομένα αυτή τη στιγμή.",
      lowDirectPrice: "Χαμηλότερη direct τιμή",
      noCommissions: "Χωρίς προμήθειες",
      chooseRoom: "Επιλέξτε δωμάτιο",
      noCreditCard: "Χωρίς πιστωτική",
      bestToday: "Καλύτερη τιμή σήμερα",
      popular: "Δημοφιλές",
      booking: "Κλείνεται",
      recommended: "Προτείνεται",
      available: "διαθέσιμο",
      unavailable: "μη διαθέσιμο",
    },
    features: {
      economy: "💸 Οικονομικό",
      ground: "🌿 Ισόγειο",
      upperFloor: "🏛️ Επάνω όροφος",
      otherLocation: "📍 Άλλη θέση",
      gardenView: "🌳 Θέα κήπου",
      noGardenView: "🚫🌳 Χωρίς θέα κήπου",
      upperView: "🌾 Θέα επάνω",
      kitchen: "🍳 Κουζίνα",
      kitchenette: "🥣 Kitchenette",
      noKitchen: "🚫🍳 Χωρίς κουζίνα",
      stairs: "🪜 Σκάλες",
      noStairs: "♿ Χωρίς σκάλες",
    },
    whatsapp: {
      intro: "Γεια σας, ενδιαφέρομαι για απευθείας κράτηση:",
      room: "Δωμάτιο",
      type: "Τύπος",
      location: "Τοποθεσία",
      guests: "Άτομα",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Νύχτες",
      standardTotal: "Κανονική τιμή",
      directTotal: "Τιμή απευθείας κράτησης",
      outro: "Θα ήθελα επιβεβαίωση διαθεσιμότητας.",
    },
  },
  fr: {
    localeTag: "fr-FR",
    filters: [
      { key: "budget", icon: "💸", label: "Économique" },
      { key: "stairs", icon: "🪜", label: "Escaliers" },
      { key: "upperFloor", icon: "🏛️", label: "Étage" },
      { key: "ground", icon: "🌿", label: "Rez-de-chaussée" },
      { key: "gardenView", icon: "🌳", label: "Vue jardin" },
      { key: "upperFloorView", icon: "🌾", label: "Vue supérieure" },
      { key: "kitchen", icon: "🍳", label: "Cuisine" },
      { key: "noKitchen", icon: "🚫🍳", label: "Sans cuisine" },
    ],
    badges: {
      "267788_1": [{ cls: "favorite", icon: "⭐", text: "Favori" }],
      "626129_1": [{ cls: "popular", icon: "🔥", text: "Très demandé" }],
      "265595_1": [{ cls: "booked", icon: "⚡", text: "Meilleure offre" }],
      "265595_3": [{ cls: "favorite", icon: "👨‍👩‍👧", text: "Idéal familles" }],
    },
    labels: {
      resultsInitial: "Choisissez d’abord le nombre de personnes.",
      emptyInitial: "Choisissez d’abord 2, 3 ou 4 personnes pour voir les offres disponibles.",
      foundPrefix: "Trouvé",
      foundMiddle: "options pour",
      foundSuffix: "personnes.",
      emptyFiltered: "Aucune offre disponible avec les filtres sélectionnés.",
      calendarTitle: "Offres de séjour pour les 7 prochains jours",
      availableLegend: "✓ = disponible · ✕ = non disponible",
      bestPrice: "MEILLEUR PRIX",
      directPerNight: "direct / nuit",
      checkin: "Arrivée",
      checkout: "Départ",
      nights: "Nuits",
      guests: "Personnes",
      totalLabel: "COÛT RÉSERVATION DIRECTE",
      saved: "Vous économisez",
      sendWhatsapp: "Envoyer une demande WhatsApp",
      clear: "Effacer la sélection",
      updated: "Mis à jour :",
      loadingFallback: "Chargement des offres disponibles…",
      error: "Impossible de charger les offres. Réessayez.",
      noData: "Aucune donnée de disponibilité n’est disponible pour le moment.",
      lowDirectPrice: "Prix direct le plus bas",
      noCommissions: "Sans commission",
      chooseRoom: "Choisissez votre chambre",
      noCreditCard: "Sans carte bancaire",
      bestToday: "Meilleur prix du jour",
      popular: "Très demandé",
      booking: "En réservation",
      recommended: "Recommandé",
      available: "disponible",
      unavailable: "non disponible",
    },
    features: {
      economy: "💸 Économique",
      ground: "🌿 Rez-de-chaussée",
      upperFloor: "🏛️ Étage",
      otherLocation: "📍 Autre emplacement",
      gardenView: "🌳 Vue jardin",
      noGardenView: "🚫🌳 Sans vue jardin",
      upperView: "🌾 Vue supérieure",
      kitchen: "🍳 Cuisine",
      kitchenette: "🥣 Kitchenette",
      noKitchen: "🚫🍳 Sans cuisine",
      stairs: "🪜 Escaliers",
      noStairs: "♿ Sans escaliers",
    },
    whatsapp: {
      intro: "Bonjour, je suis intéressé par une réservation directe :",
      room: "Chambre",
      type: "Type",
      location: "Emplacement",
      guests: "Personnes",
      checkin: "Arrivée",
      checkout: "Départ",
      nights: "Nuits",
      standardTotal: "Total standard",
      directTotal: "Total réservation directe",
      outro: "Je souhaite confirmer la disponibilité.",
    },
  },
  de: {
    localeTag: "de-DE",
    filters: [
      { key: "budget", icon: "💸", label: "Budget" },
      { key: "stairs", icon: "🪜", label: "Treppen" },
      { key: "upperFloor", icon: "🏛️", label: "Obergeschoss" },
      { key: "ground", icon: "🌿", label: "Erdgeschoss" },
      { key: "gardenView", icon: "🌳", label: "Gartenblick" },
      { key: "upperFloorView", icon: "🌾", label: "Oberer Blick" },
      { key: "kitchen", icon: "🍳", label: "Küche" },
      { key: "noKitchen", icon: "🚫🍳", label: "Ohne Küche" },
    ],
    badges: {
      "267788_1": [{ cls: "favorite", icon: "⭐", text: "Favorit" }],
      "626129_1": [{ cls: "popular", icon: "🔥", text: "Sehr gefragt" }],
      "265595_1": [{ cls: "booked", icon: "⚡", text: "Top-Angebot" }],
      "265595_3": [{ cls: "favorite", icon: "👨‍👩‍👧", text: "Ideal für Familien" }],
    },
    labels: {
      resultsInitial: "Wählen Sie zuerst die Gästezahl.",
      emptyInitial: "Wählen Sie zuerst 2, 3 oder 4 Gäste, um verfügbare Angebote zu sehen.",
      foundPrefix: "Gefunden",
      foundMiddle: "Optionen für",
      foundSuffix: "Gäste.",
      emptyFiltered: "Keine Angebote mit den ausgewählten Filtern verfügbar.",
      calendarTitle: "Aufenthaltsangebote für die nächsten 7 Tage",
      availableLegend: "✓ = verfügbar · ✕ = nicht verfügbar",
      bestPrice: "BESTER PREIS",
      directPerNight: "direkt / Nacht",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Nächte",
      guests: "Gäste",
      totalLabel: "DIREKTBUCHUNGSKOSTEN",
      saved: "Sie sparen",
      sendWhatsapp: "Anfrage per WhatsApp senden",
      clear: "Auswahl löschen",
      updated: "Aktualisiert:",
      loadingFallback: "Verfügbare Angebote werden geladen…",
      error: "Die Angebote konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
      noData: "Derzeit sind keine Verfügbarkeitsdaten verfügbar.",
      lowDirectPrice: "Niedrigster Direktpreis",
      noCommissions: "Keine Provisionen",
      chooseRoom: "Zimmer wählen",
      noCreditCard: "Keine Kreditkarte",
      bestToday: "Bester Preis heute",
      popular: "Sehr gefragt",
      booking: "Wird gebucht",
      recommended: "Empfohlen",
      available: "verfügbar",
      unavailable: "nicht verfügbar",
    },
    features: {
      economy: "💸 Budget",
      ground: "🌿 Erdgeschoss",
      upperFloor: "🏛️ Obergeschoss",
      otherLocation: "📍 Andere Lage",
      gardenView: "🌳 Gartenblick",
      noGardenView: "🚫🌳 Kein Gartenblick",
      upperView: "🌾 Oberer Blick",
      kitchen: "🍳 Küche",
      kitchenette: "🥣 Kitchenette",
      noKitchen: "🚫🍳 Ohne Küche",
      stairs: "🪜 Treppen",
      noStairs: "♿ Keine Treppen",
    },
    whatsapp: {
      intro: "Hallo, ich interessiere mich für eine Direktbuchung:",
      room: "Zimmer",
      type: "Typ",
      location: "Lage",
      guests: "Gäste",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Nächte",
      standardTotal: "Standardgesamtpreis",
      directTotal: "Direktbuchungsgesamtpreis",
      outro: "Ich möchte die Verfügbarkeit bestätigen.",
    },
  },
  it: {
    localeTag: "it-IT",
    filters: [
      { key: "budget", icon: "💸", label: "Economy" },
      { key: "stairs", icon: "🪜", label: "Scale" },
      { key: "upperFloor", icon: "🏛️", label: "Piano superiore" },
      { key: "ground", icon: "🌿", label: "Piano terra" },
      { key: "gardenView", icon: "🌳", label: "Vista giardino" },
      { key: "upperFloorView", icon: "🌾", label: "Vista superiore" },
      { key: "kitchen", icon: "🍳", label: "Cucina" },
      { key: "noKitchen", icon: "🚫🍳", label: "Senza cucina" },
    ],
    badges: {
      "267788_1": [{ cls: "favorite", icon: "⭐", text: "Preferita" }],
      "626129_1": [{ cls: "popular", icon: "🔥", text: "Molto richiesta" }],
      "265595_1": [{ cls: "booked", icon: "⚡", text: "Offerta top" }],
      "265595_3": [{ cls: "favorite", icon: "👨‍👩‍👧", text: "Ideale per famiglie" }],
    },
    labels: {
      resultsInitial: "Scegli prima il numero di ospiti.",
      emptyInitial: "Scegli prima 2, 3 o 4 ospiti per visualizzare le offerte disponibili.",
      foundPrefix: "Trovate",
      foundMiddle: "opzioni per",
      foundSuffix: "ospiti.",
      emptyFiltered: "Nessuna offerta disponibile con i filtri selezionati.",
      calendarTitle: "Offerte soggiorno per i prossimi 7 giorni",
      availableLegend: "✓ = disponibile · ✕ = non disponibile",
      bestPrice: "PREZZO MIGLIORE",
      directPerNight: "diretto / notte",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Notti",
      guests: "Ospiti",
      totalLabel: "COSTO PRENOTAZIONE DIRETTA",
      saved: "Risparmi",
      sendWhatsapp: "Invia richiesta su WhatsApp",
      clear: "Cancella selezione",
      updated: "Aggiornato:",
      loadingFallback: "Caricamento delle offerte disponibili…",
      error: "Non è stato possibile caricare le offerte. Riprova.",
      noData: "Al momento non sono disponibili dati di disponibilità.",
      lowDirectPrice: "Prezzo diretto più basso",
      noCommissions: "Nessuna commissione",
      chooseRoom: "Scegli la tua camera",
      noCreditCard: "Nessuna carta di credito",
      bestToday: "Prezzo migliore di oggi",
      popular: "Molto richiesto",
      booking: "In prenotazione",
      recommended: "Consigliato",
      available: "disponibile",
      unavailable: "non disponibile",
    },
    features: {
      economy: "💸 Economy",
      ground: "🌿 Piano terra",
      upperFloor: "🏛️ Piano superiore",
      otherLocation: "📍 Altra posizione",
      gardenView: "🌳 Vista giardino",
      noGardenView: "🚫🌳 Senza vista giardino",
      upperView: "🌾 Vista superiore",
      kitchen: "🍳 Cucina",
      kitchenette: "🥣 Angolo cottura",
      noKitchen: "🚫🍳 Senza cucina",
      stairs: "🪜 Scale",
      noStairs: "♿ Senza scale",
    },
    whatsapp: {
      intro: "Ciao, sono interessato a una prenotazione diretta:",
      room: "Camera",
      type: "Tipologia",
      location: "Posizione",
      guests: "Ospiti",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Notti",
      standardTotal: "Totale standard",
      directTotal: "Totale prenotazione diretta",
      outro: "Vorrei conferma della disponibilità.",
    },
  },
  es: {
    localeTag: "es-ES",
    filters: [
      { key: "budget", icon: "💸", label: "Económica" },
      { key: "stairs", icon: "🪜", label: "Escaleras" },
      { key: "upperFloor", icon: "🏛️", label: "Planta alta" },
      { key: "ground", icon: "🌿", label: "Planta baja" },
      { key: "gardenView", icon: "🌳", label: "Vista jardín" },
      { key: "upperFloorView", icon: "🌾", label: "Vista superior" },
      { key: "kitchen", icon: "🍳", label: "Cocina" },
      { key: "noKitchen", icon: "🚫🍳", label: "Sin cocina" },
    ],
    badges: {
      "267788_1": [{ cls: "favorite", icon: "⭐", text: "Recomendado" }],
      "626129_1": [{ cls: "popular", icon: "🔥", text: "Muy solicitado" }],
      "265595_1": [{ cls: "booked", icon: "⚡", text: "Oferta top" }],
      "265595_3": [{ cls: "favorite", icon: "👨‍👩‍👧", text: "Ideal para familias" }],
    },
    labels: {
      resultsInitial: "Elige primero el número de huéspedes.",
      emptyInitial: "Elige primero 2, 3 o 4 huéspedes para ver las ofertas disponibles.",
      foundPrefix: "Encontradas",
      foundMiddle: "opciones para",
      foundSuffix: "huéspedes.",
      emptyFiltered: "No hay ofertas disponibles con los filtros seleccionados.",
      calendarTitle: "Ofertas de alojamiento para los próximos 7 días",
      availableLegend: "✓ = disponible · ✕ = no disponible",
      bestPrice: "MEJOR PRECIO",
      directPerNight: "directo / noche",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Noches",
      guests: "Huéspedes",
      totalLabel: "COSTE DE RESERVA DIRECTA",
      saved: "Ahorras",
      sendWhatsapp: "Enviar solicitud por WhatsApp",
      clear: "Borrar selección",
      updated: "Actualizado:",
      loadingFallback: "Cargando ofertas disponibles…",
      error: "No se pudieron cargar las ofertas. Inténtalo de nuevo.",
      noData: "Actualmente no hay datos de disponibilidad.",
      lowDirectPrice: "Precio directo más bajo",
      noCommissions: "Sin comisiones",
      chooseRoom: "Elige tu habitación",
      noCreditCard: "Sin tarjeta de crédito",
      bestToday: "Mejor precio de hoy",
      popular: "Muy solicitado",
      booking: "Reservándose",
      recommended: "Recomendado",
      available: "disponible",
      unavailable: "no disponible",
    },
    features: {
      economy: "💸 Económica",
      ground: "🌿 Planta baja",
      upperFloor: "🏛️ Planta alta",
      otherLocation: "📍 Otra ubicación",
      gardenView: "🌳 Vista jardín",
      noGardenView: "🚫🌳 Sin vista jardín",
      upperView: "🌾 Vista superior",
      kitchen: "🍳 Cocina",
      kitchenette: "🥣 Kitchenette",
      noKitchen: "🚫🍳 Sin cocina",
      stairs: "🪜 Escaleras",
      noStairs: "♿ Sin escaleras",
    },
    whatsapp: {
      intro: "Hola, estoy interesado en una reserva directa:",
      room: "Habitación",
      type: "Tipo",
      location: "Ubicación",
      guests: "Huéspedes",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Noches",
      standardTotal: "Total estándar",
      directTotal: "Total reserva directa",
      outro: "Me gustaría confirmar la disponibilidad.",
    },
  },
  tr: {
    localeTag: "tr-TR",
    filters: [
      { key: "budget", icon: "💸", label: "Ekonomik" },
      { key: "stairs", icon: "🪜", label: "Merdiven" },
      { key: "upperFloor", icon: "🏛️", label: "Üst kat" },
      { key: "ground", icon: "🌿", label: "Zemin kat" },
      { key: "gardenView", icon: "🌳", label: "Bahçe manzarası" },
      { key: "upperFloorView", icon: "🌾", label: "Üst manzara" },
      { key: "kitchen", icon: "🍳", label: "Mutfak" },
      { key: "noKitchen", icon: "🚫🍳", label: "Mutfaksız" },
    ],
    badges: {
      "267788_1": [{ cls: "favorite", icon: "⭐", text: "Favori" }],
      "626129_1": [{ cls: "popular", icon: "🔥", text: "Çok tercih edilen" }],
      "265595_1": [{ cls: "booked", icon: "⚡", text: "Top fırsat" }],
      "265595_3": [{ cls: "favorite", icon: "👨‍👩‍👧", text: "Aileler için ideal" }],
    },
    labels: {
      resultsInitial: "Önce misafir sayısını seçin.",
      emptyInitial: "Müsait fırsatları görmek için önce 2, 3 veya 4 misafir seçin.",
      foundPrefix: "Bulunan",
      foundMiddle: "seçenek,",
      foundSuffix: "misafir için.",
      emptyFiltered: "Seçili filtrelerle uygun fırsat bulunamadı.",
      calendarTitle: "Önümüzdeki 7 gün için konaklama fırsatları",
      availableLegend: "✓ = müsait · ✕ = müsait değil",
      bestPrice: "EN İYİ FİYAT",
      directPerNight: "direct / gece",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Gece",
      guests: "Misafir",
      totalLabel: "DIRECT BOOKING TUTARI",
      saved: "Tasarruf",
      sendWhatsapp: "WhatsApp ile talep gönder",
      clear: "Seçimi temizle",
      updated: "Güncellendi:",
      loadingFallback: "Müsait fırsatlar yükleniyor…",
      error: "Fırsatlar yüklenemedi. Lütfen tekrar deneyin.",
      noData: "Şu anda müsaitlik verisi yok.",
      lowDirectPrice: "En düşük direct fiyat",
      noCommissions: "Komisyonsuz",
      chooseRoom: "Odanızı seçin",
      noCreditCard: "Kredi kartı yok",
      bestToday: "Bugünün en iyi fiyatı",
      popular: "Çok tercih edilen",
      booking: "Rezervasyon alıyor",
      recommended: "Önerilen",
      available: "müsait",
      unavailable: "müsait değil",
    },
    features: {
      economy: "💸 Ekonomik",
      ground: "🌿 Zemin kat",
      upperFloor: "🏛️ Üst kat",
      otherLocation: "📍 Diğer konum",
      gardenView: "🌳 Bahçe manzarası",
      noGardenView: "🚫🌳 Bahçe manzarası yok",
      upperView: "🌾 Üst manzara",
      kitchen: "🍳 Mutfak",
      kitchenette: "🥣 Mini mutfak",
      noKitchen: "🚫🍳 Mutfaksız",
      stairs: "🪜 Merdiven",
      noStairs: "♿ Merdivensiz",
    },
    whatsapp: {
      intro: "Merhaba, doğrudan rezervasyonla ilgileniyorum:",
      room: "Oda",
      type: "Tip",
      location: "Konum",
      guests: "Misafir",
      checkin: "Check-in",
      checkout: "Check-out",
      nights: "Gece",
      standardTotal: "Standart toplam",
      directTotal: "Direct booking toplam",
      outro: "Müsaitliği teyit etmek istiyorum.",
    },
  },
};

function detectLocaleFromCanonicalPath(canonicalPath: string): Locale {
  const path = canonicalPath.toLowerCase();

  if (path === "/el" || path.startsWith("/el/")) return "el";
  if (path === "/fr" || path.startsWith("/fr/")) return "fr";
  if (path === "/de" || path.startsWith("/de/")) return "de";
  if (path === "/it" || path.startsWith("/it/")) return "it";
  if (path === "/es" || path.startsWith("/es/")) return "es";
  if (path === "/tr" || path.startsWith("/tr/")) return "tr";

  return "en";
}

function getCopy(locale: Locale): Copy {
  return {
    ...COPY[locale],
    rooms: ROOM_NAMES[locale],
  };
}

function money(value: number) {
  return `€${Number(value || 0).toFixed(2)}`;
}

function round2(value: number) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function roomKey(room: Pick<DealRoom, "roomId" | "unitId">) {
  return `${room.roomId}_${room.unitId}`;
}

function addDaysString(dateStr: string, days: number) {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function sortDates(dates: string[]) {
  return [...dates].sort(
    (a, b) => new Date(`${a}T00:00:00`).getTime() - new Date(`${b}T00:00:00`).getTime()
  );
}

function isConsecutive(dates: string[]) {
  const sorted = sortDates(dates);

  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00`).getTime();
    const curr = new Date(`${sorted[i]}T00:00:00`).getTime();
    if ((curr - prev) / 86400000 !== 1) return false;
  }

  return true;
}

function formatDate(dateStr: string, localeTag: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  const weekday = date.toLocaleDateString(localeTag, { weekday: "short" });
  const month = date.toLocaleDateString(localeTag, { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");

  if (localeTag.startsWith("es")) return `${weekday}, ${day} ${month}`;
  if (localeTag.startsWith("it")) return `${weekday}, ${month} ${day}`;

  return `${weekday}, ${day} ${month}`;
}

function formatUpdatedAt(iso: string | undefined, localeTag: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(localeTag);
}

function roomExtraPerNight(room: DealRoom) {
  return Number(ROOM_EXTRA_PER_NIGHT[Number(room.id)] || 0);
}

function apiBaseGuests(room: DealRoom) {
  return [8, 9, 10].includes(Number(room.id)) ? 4 : 2;
}

function extraGuestChargePerNight(room: DealRoom, guests: number | null) {
  if (!guests) return 0;

  const base = apiBaseGuests(room);
  if (base >= 4) return 0;
  if (guests === 3) return 20;
  if (guests >= 4) return 30;

  return 0;
}

function mergeRooms(data: DealsResponse | null, copy: Copy): RoomMeta[] {
  if (!data?.rooms) return [];

  return data.rooms.map((room) => {
    const base = ROOM_META_BASE.find((item) => roomKey(item) === roomKey(room));
    const localized = copy.rooms.find((item) => item.id === base?.id);

    return {
      ...base,
      ...localized,
      ...room,
      id: base?.id || room.id || 0,
      roomId: room.roomId,
      unitId: room.unitId,
      displayName: localized?.displayName || room.displayName || `Room ${room.unitId}`,
      type: localized?.type || room.type || "",
      location: localized?.location || room.location || "",
      maxGuests: base?.maxGuests || room.maxGuests || 2,
      budget: base?.budget ?? false,
      stairs: base?.stairs ?? false,
      ground: base?.ground ?? false,
      floor: base?.floor ?? false,
      gardenView: base?.gardenView ?? false,
      kitchen: base?.kitchen ?? false,
      kitchenette: base?.kitchenette ?? false,
      images: [...(base?.images || []), ...(room.images || [])],
    };
  });
}

type NightInfo = {
  available: boolean;
  systemNight: number;
  directNight: number;
};

function getNightInfo({
  data,
  room,
  guests,
  dateStr,
}: {
  data: DealsResponse | null;
  room: DealRoom;
  guests: number | null;
  dateStr: string;
}): NightInfo | null {
  if (!data || !guests) return null;

  const day = data.days?.find((item) => item.checkin === dateStr);
  const raw = day?.results?.[roomKey(room)];

  if (!raw) return null;

  const base = Number(raw.totalPrice || 0);
  const discountableNight = base + roomExtraPerNight(room) + extraGuestChargePerNight(room, guests);
  const climateFee = Number(CONFIG.CLIMATE_FEE_PER_NIGHT || 0);

  const systemNight = discountableNight + climateFee;
  const directNight = round2(
    discountableNight * (1 - Number(CONFIG.DIRECT_DISCOUNT_PERCENT || 15) / 100) + climateFee
  );

  return {
    available: Boolean(raw.available),
    systemNight,
    directNight,
  };
}

function roomMatchesFilter(room: RoomMeta, key: FilterKey) {
  switch (key) {
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
      return false;
  }
}

function featurePills(room: RoomMeta, copy: Copy) {
  const positives: string[] = [];
  const negatives: string[] = [];

  if (room.budget) positives.push(copy.features.economy);
  if (room.ground) positives.push(copy.features.ground);
  if (room.floor) positives.push(copy.features.upperFloor);
  else if (!room.ground) negatives.push(copy.features.otherLocation);

  if (room.gardenView) positives.push(copy.features.gardenView);
  else if (room.ground) negatives.push(copy.features.noGardenView);

  if (room.floor && !room.gardenView) positives.push(copy.features.upperView);
  if (room.kitchen) positives.push(copy.features.kitchen);
  else if (room.kitchenette) positives.push(copy.features.kitchenette);
  else negatives.push(copy.features.noKitchen);

  if (room.stairs) positives.push(copy.features.stairs);
  else negatives.push(copy.features.noStairs);

  return [...new Set([...positives, ...negatives])].slice(0, 3);
}

function buildWhatsappMessage({
  copy,
  room,
  guests,
  checkin,
  checkout,
  nights,
  systemTotal,
  directTotal,
}: {
  copy: Copy;
  room: RoomMeta;
  guests: number;
  checkin: string;
  checkout: string;
  nights: number;
  systemTotal: number;
  directTotal: number;
}) {
  return [
    copy.whatsapp.intro,
    "",
    `${copy.whatsapp.room}: ${room.displayName}`,
    `${copy.whatsapp.type}: ${room.type}`,
    `${copy.whatsapp.location}: ${room.location}`,
    `${copy.whatsapp.guests}: ${guests}`,
    `${copy.whatsapp.checkin}: ${checkin}`,
    `${copy.whatsapp.checkout}: ${checkout}`,
    `${copy.whatsapp.nights}: ${nights}`,
    `${copy.whatsapp.standardTotal}: ${money(systemTotal)}`,
    `${copy.whatsapp.directTotal}: ${money(directTotal)}`,
    "",
    copy.whatsapp.outro,
  ].join("\n");
}

export function LastMinuteDeals({ data, canonicalPath }: { data: LastMinuteData; canonicalPath: string }) {
  const locale = useMemo(() => detectLocaleFromCanonicalPath(canonicalPath), [canonicalPath]);
  const [deals, setDeals] = useState<DealsResponse | null>(null);
  const [guests, setGuests] = useState<number | null>(null);
  const [filters, setFilters] = useState<Set<FilterKey>>(() => new Set());
  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState("00:00:00");

  const copy = useMemo(() => getCopy(locale), [locale]);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const next = new Date(now);
      next.setHours(now.getHours() + 1, 0, 0, 0);

      const diff = Math.max(0, next.getTime() - now.getTime());
      const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

      setCountdown(`${hours}:${minutes}:${seconds}`);
    }

    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, []);

  async function loadDeals(nextGuests: number) {
    setGuests(nextGuests);
    setSelectedRoomKey(null);
    setSelectedDates([]);
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(CONFIG.DEALS_ENDPOINT, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(copy.labels.error);
      }

      const json = (await response.json()) as DealsResponse;
      setDeals(json);
    } catch (error) {
      setDeals(null);
      setErrorMessage(error instanceof Error ? error.message : copy.labels.error);
    } finally {
      setIsLoading(false);
    }
  }

  const rooms = useMemo(() => {
    if (!deals || !guests) return [];

    let visibleRooms = mergeRooms(deals, copy).filter((room) => Number(room.maxGuests || 0) >= guests);

    visibleRooms = visibleRooms.filter((room) =>
      (deals.days || []).slice(0, 7).some((day) => {
        const info = getNightInfo({ data: deals, room, guests, dateStr: day.checkin });
        return info?.available;
      })
    );

    if (filters.size) {
      visibleRooms = visibleRooms.filter((room) =>
        [...filters].every((filter) => roomMatchesFilter(room, filter))
      );
    }

    return visibleRooms;
  }, [copy, deals, filters, guests]);

  const cheapestRoomKey = useMemo(() => {
    let cheapestKey: string | null = null;
    let cheapestValue = Infinity;

    rooms.forEach((room) => {
      let total = 0;
      let count = 0;

      (deals?.days || []).slice(0, 7).forEach((day) => {
        const info = getNightInfo({ data: deals, room, guests, dateStr: day.checkin });
        if (info?.available) {
          total += info.directNight;
          count += 1;
        }
      });

      if (count > 0 && total < cheapestValue) {
        cheapestValue = total;
        cheapestKey = roomKey(room);
      }
    });

    return cheapestKey;
  }, [deals, guests, rooms]);

  function toggleFilter(key: FilterKey) {
    setFilters((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleDayClick(room: RoomMeta, dateStr: string) {
    if (!guests) return;

    const info = getNightInfo({ data: deals, room, guests, dateStr });
    if (!info?.available) return;

    const key = roomKey(room);

    if (selectedRoomKey && selectedRoomKey !== key) {
      setSelectedRoomKey(key);
      setSelectedDates([dateStr]);
      return;
    }

    if (!selectedRoomKey) {
      setSelectedRoomKey(key);
      setSelectedDates([dateStr]);
      return;
    }

    const nextDates = selectedDates.includes(dateStr)
      ? selectedDates.filter((date) => date !== dateStr)
      : [...selectedDates, dateStr];

    if (!nextDates.length) {
      setSelectedRoomKey(null);
      setSelectedDates([]);
      return;
    }

    const sorted = sortDates(nextDates);
    setSelectedRoomKey(key);
    setSelectedDates(isConsecutive(sorted) ? sorted : [dateStr]);
  }

  function getTotals(room: RoomMeta) {
    if (!deals || !guests || selectedRoomKey !== roomKey(room) || !selectedDates.length) {
      return null;
    }

    let systemTotal = 0;
    let directTotal = 0;
    const sortedDates = sortDates(selectedDates);

    sortedDates.forEach((dateStr) => {
      const info = getNightInfo({ data: deals, room, guests, dateStr });
      if (info?.available) {
        systemTotal += info.systemNight;
        directTotal += info.directNight;
      }
    });

    return {
      nights: sortedDates.length,
      checkin: sortedDates[0],
      checkout: addDaysString(sortedDates[sortedDates.length - 1], 1),
      systemTotal: round2(systemTotal),
      directTotal: round2(directTotal),
      saveTotal: round2(systemTotal - directTotal),
    };
  }

  const updatedAt = formatUpdatedAt(deals?.updatedAt || deals?.updated_at, copy.localeTag);

  return (
    <section className="vh-section vh-section--tight" aria-labelledby="vh-lastminute-title">
      <div className="vh-wrap">
        <header className="vh-section-head" style={{ textAlign: "center" }}>
          <span className="vh-kicker">{data.kicker}</span>
          <h2 className="vh-title" id="vh-lastminute-title">
            <span aria-hidden="true" style={{ marginRight: 8 }}>
              {data.icon}
            </span>
            {data.title}
          </h2>
          <p className="vh-subtitle" style={{ margin: "0 auto", maxWidth: 900 }}>
            {data.subtitle}
          </p>
        </header>
      </div>

      <div className="lm-widget" id="lmDealsWidget">
        <div className="lm-shell">
          <div className="lm-panel">
            <div id="deals-app">
              <section className="rb-hero" aria-label="Accommodation deals in Chios">
                <div className="rb-hero-top">
                  <div className="rb-hero-head">
                    <h2 className="rb-title">{data.widget.title}</h2>
                    <p className="rb-subtitle">{data.widget.subtitle}</p>
                    <div className="rb-trust-line">{data.widget.trustLine}</div>
                  </div>

                  <div className="rb-hero-actions">
                    <div className="rb-hero-timer">
                      <p className="rb-hero-timer-label">{data.widget.timerLabel}</p>
                      <p className="rb-hero-timer-value">{countdown}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rb-search-card" aria-label="Guest selection">
                <div className="rb-section-head">
                  <div>
                    <h3>{data.widget.guestTitle}</h3>
                    <p>{data.widget.guestText}</p>
                  </div>
                </div>

                <div className="rb-guest-row">
                  {data.widget.guestButtons.map((button) => (
                    <button
                      className={`rb-guest-btn ${guests === button.value ? "is-active" : ""}`}
                      data-guests={button.value}
                      type="button"
                      key={button.value}
                      onClick={() => loadDeals(button.value)}
                    >
                      <span aria-hidden="true">👤</span> ×{button.value}
                    </button>
                  ))}
                </div>

                <div className="rb-helper">{data.widget.helper}</div>

                {isLoading ? (
                  <div className="rb-loading">{data.widget.loadingText || copy.labels.loadingFallback}</div>
                ) : null}

                {errorMessage ? <div className="rb-empty">{errorMessage}</div> : null}
              </section>

              <section
                className={`rb-results-wrap ${guests ? "is-visible" : ""}`}
                aria-label="Deal results"
              >
                <div className="rb-section-head">
                  <div>
                    <h3>{data.widget.resultsTitle}</h3>
                    <p>{data.widget.resultsText}</p>
                  </div>
                  <div className="rb-results-meta">
                    {!guests
                      ? copy.labels.resultsInitial
                      : `${copy.labels.foundPrefix} ${rooms.length} ${copy.labels.foundMiddle} ${guests} ${copy.labels.foundSuffix}`}
                  </div>
                </div>

                {guests && deals ? (
                  <div className="rb-filter-row" style={{ display: "flex" }}>
                    {copy.filters.map((filter) => (
                      <button
                        className={`rb-filter-chip ${filters.has(filter.key) ? "is-active" : ""}`}
                        data-filter={filter.key}
                        type="button"
                        key={filter.key}
                        onClick={() => toggleFilter(filter.key)}
                      >
                        <span>{filter.icon}</span>
                        <span>{filter.label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <div id="resultsGrid">
                  {!guests ? (
                    <div className="rb-empty">{data.widget.emptyText || copy.labels.emptyInitial}</div>
                  ) : !deals && !isLoading && !errorMessage ? (
                    <div className="rb-empty">{copy.labels.noData}</div>
                  ) : deals && !rooms.length ? (
                    <div className="rb-empty">{copy.labels.emptyFiltered}</div>
                  ) : (
                    <div className="rb-room-list">
                      {rooms.map((room) => {
                        const key = roomKey(room);
                        const isBest = key === cheapestRoomKey;
                        const totals = getTotals(room);

                        let minDirect = Infinity;
                        let minSystem = Infinity;

                        (deals?.days || []).slice(0, 7).forEach((day) => {
                          const info = getNightInfo({ data: deals, room, guests, dateStr: day.checkin });
                          if (info?.available) {
                            minDirect = Math.min(minDirect, info.directNight);
                            minSystem = Math.min(minSystem, info.systemNight);
                          }
                        });

                        const staticBadge = copy.badges[key]?.[0];
                        const promoBadge =
                          staticBadge ||
                          (isBest
                            ? { cls: "best", icon: "🔥", text: copy.labels.bestToday }
                            : { cls: "favorite", icon: "⭐", text: copy.labels.recommended });

                        const whatsappMessage =
                          totals && guests
                            ? buildWhatsappMessage({
                                copy,
                                room,
                                guests,
                                checkin: totals.checkin,
                                checkout: totals.checkout,
                                nights: totals.nights,
                                systemTotal: totals.systemTotal,
                                directTotal: totals.directTotal,
                              })
                            : "";

                        const whatsappHref = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          whatsappMessage
                        )}`;

                        return (
                          <article
                            className={`rb-room-card ${isBest ? "rb-room-card--best" : ""}`}
                            key={key}
                          >
                            <div className="rb-room-main">
                              <div className="rb-room-left">
                                <div className="rb-room-media">
                                  {isBest ? (
                                    <div className="rb-best-price-ribbon">
                                      {copy.labels.bestPrice}
                                    </div>
                                  ) : null}
                                  <img
                                    src={room.id === 1 ? "/images/rooms/voulamandis-house-chios-hotels-1-e1675700558710.webp" : (room.images?.[0] || "")}
                                    alt={`${room.displayName} - Chios accommodation deal`}
                                    loading="lazy"
                                  />
                                </div>

                                <div className="rb-room-card-body">
                                  <h4 className="rb-room-title">
                                    {room.displayName}{" "}
                                    <span
                                      style={{
                                        fontSize: "0.85em",
                                        fontWeight: "normal",
                                        color: "#6f645b",
                                      }}
                                    >
                                      · {room.type}
                                    </span>
                                  </h4>
                                </div>
                              </div>

                              <div className="rb-room-center">
                                <div className="rb-calendar-head">
                                  <div className="rb-calendar-title-wrap">
                                    <div className="rb-calendar-title">
                                      <h4>{copy.labels.calendarTitle}</h4>
                                    </div>
                                    <div className="rb-calendar-legend">
                                      {copy.labels.availableLegend}
                                    </div>
                                    <div className="rb-calendar-badges">
                                      {featurePills(room, copy).map((pill) => (
                                        <span className="rb-mini-pill" key={pill}>
                                          {pill}
                                        </span>
                                      ))}
                                      <span className={`rb-info-badge rb-info-badge--${promoBadge.cls}`}>
                                        {promoBadge.icon} {promoBadge.text}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="rb-price-wrap">
                                    {Number.isFinite(minSystem) ? (
                                      <div className="rb-price-old">{money(minSystem)}</div>
                                    ) : null}
                                    {Number.isFinite(minDirect) ? (
                                      <div className="rb-price">{money(minDirect)}</div>
                                    ) : null}
                                    {Number.isFinite(minDirect) ? (
                                      <div className="rb-direct-price">
                                        {copy.labels.directPerNight}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="rb-calendar">
                                  {(deals?.days || []).slice(0, 7).map((day) => {
                                    const info = getNightInfo({
                                      data: deals,
                                      room,
                                      guests,
                                      dateStr: day.checkin,
                                    });
                                    const selected =
                                      selectedRoomKey === key && selectedDates.includes(day.checkin);

                                    if (!info?.available) {
                                      return (
                                        <div className="rb-day busy" key={day.checkin}>
                                          <div className="rb-day-date">
                                            {formatDate(day.checkin, copy.localeTag)}
                                          </div>
                                          <div className="rb-day-status">✕</div>
                                          <div className="rb-day-old">—</div>
                                        </div>
                                      );
                                    }

                                    return (
                                      <button
                                        className={`rb-day free ${selected ? "selected" : ""}`}
                                        data-room-key={key}
                                        data-date={day.checkin}
                                        key={day.checkin}
                                        type="button"
                                        onClick={() => handleDayClick(room, day.checkin)}
                                        aria-label={`${formatDate(
                                          day.checkin,
                                          copy.localeTag
                                        )} ${copy.labels.available} ${money(info.directNight)}`}
                                      >
                                        <div className="rb-day-date">
                                          {formatDate(day.checkin, copy.localeTag)}
                                        </div>
                                        <div className="rb-day-status">✓</div>
                                        <div className="rb-day-old">{money(info.systemNight)}</div>
                                        <div className="rb-day-deal">{money(info.directNight)}</div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <aside className="rb-booking-panel">
                                {totals ? (
                                  <div className="rb-booking-state">
                                    <div className="rb-booking-item">
                                      <span>{copy.labels.checkin}</span>
                                      <span>{totals.checkin}</span>
                                    </div>
                                    <div className="rb-booking-item">
                                      <span>{copy.labels.checkout}</span>
                                      <span>{totals.checkout}</span>
                                    </div>
                                    <div className="rb-booking-item">
                                      <span>{copy.labels.nights}</span>
                                      <span>{totals.nights}</span>
                                    </div>
                                    <div className="rb-booking-item">
                                      <span>{copy.labels.guests}</span>
                                      <span>{guests}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="rb-booking-badges">
                                    <div className="rb-booking-badge">
                                      <span style={{ color: "#d97706" }}>🔥</span>{" "}
                                      {copy.labels.lowDirectPrice}
                                    </div>
                                    <div className="rb-booking-badge">
                                      <span style={{ color: "#16a34a" }}>💸</span>{" "}
                                      {copy.labels.noCommissions}
                                    </div>
                                    <div className="rb-booking-badge">
                                      <span style={{ color: "#2563eb" }}>🛏️</span>{" "}
                                      {copy.labels.chooseRoom}
                                    </div>
                                    <div className="rb-booking-badge">
                                      <span style={{ color: "#ea580c" }}>💳</span>{" "}
                                      {copy.labels.noCreditCard}
                                    </div>
                                  </div>
                                )}
                              </aside>

                              <div className="rb-inline-total-wrapper rb-inline-total">
                                {totals ? (
                                  <div className="rb-inline-total-box">
                                    <div className="rb-inline-summary">
                                      <div className="rb-inline-total-label">
                                        {copy.labels.totalLabel}
                                      </div>
                                      <div className="rb-inline-total-price">
                                        {money(totals.directTotal)}
                                      </div>
                                      <div className="rb-inline-total-meta">
                                        {totals.nights} {copy.labels.nights.toLowerCase()} ·{" "}
                                        {totals.checkin} → {totals.checkout}
                                      </div>
                                      {totals.saveTotal > 0 ? (
                                        <div className="rb-inline-save">
                                          ✅ {copy.labels.saved} {money(totals.saveTotal)}
                                        </div>
                                      ) : null}
                                    </div>

                                    <div className="rb-inline-actions">
                                      <a
                                        className="rb-inline-action rb-inline-wa"
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {copy.labels.sendWhatsapp}
                                      </a>
                                      <button
                                        className="rb-inline-action rb-inline-clear"
                                        type="button"
                                        onClick={() => {
                                          setSelectedRoomKey(null);
                                          setSelectedDates([]);
                                        }}
                                      >
                                        {copy.labels.clear}
                                      </button>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>

                {updatedAt ? (
                  <div className="rb-updated">
                    {copy.labels.updated} {updatedAt}
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
