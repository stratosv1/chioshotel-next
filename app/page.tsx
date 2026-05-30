"use client";

import { useEffect, useMemo, useState } from "react";

type DealRoom = {
  roomId: number;
  unitId: number;
  totalPrice?: number;
  available?: boolean;
};

type DealDay = {
  checkin: string;
  results: Record<string, DealRoom>;
};

type DealsData = {
  ok?: boolean;
  rooms?: DealRoom[];
  days?: DealDay[];
  generatedAt?: string;
  servedAt?: string;
  wordpressCache?: {
    lastSuccessAt?: string;
  };
};

type RoomMeta = {
  id: number;
  roomId: number;
  unitId: number;
  displayName: string;
  type: string;
  location: string;
  maxGuests: number;
  budget: boolean;
  stairs: boolean;
  ground: boolean;
  floor: boolean;
  gardenView: boolean;
  kitchen: boolean;
  kitchenette: boolean;
  images: string[];
};

type FullRoom = RoomMeta & DealRoom;

const HERO_IMAGE =
  "https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp";

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

const ROOM_META: RoomMeta[] = [
  {
    id: 1,
    roomId: 267788,
    unitId: 1,
    displayName: "Room 1",
    type: "Δίκλινο / Τρίκλινο Ορόφου",
    location: "όροφος",
    maxGuests: 4,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07776-2-e1675109942622.webp",
    ],
  },
  {
    id: 2,
    roomId: 268803,
    unitId: 1,
    displayName: "Room 2",
    type: "Οικονομικό Δίκλινο",
    location: "όροφος",
    maxGuests: 2,
    budget: true,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    kitchen: false,
    kitchenette: false,
    images: ["https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp"],
  },
  {
    id: 3,
    roomId: 267788,
    unitId: 2,
    displayName: "Room 3",
    type: "Δίκλινο / Τρίκλινο Ορόφου",
    location: "όροφος",
    maxGuests: 3,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    kitchen: false,
    kitchenette: true,
    images: ["https://chioshotel.gr/wp-content/uploads/2022/12/DSC07867-1.webp"],
  },
  {
    id: 4,
    roomId: 267788,
    unitId: 3,
    displayName: "Room 4",
    type: "Δίκλινο / Τρίκλινο Ορόφου",
    location: "όροφος",
    maxGuests: 3,
    budget: false,
    stairs: true,
    ground: false,
    floor: true,
    gardenView: false,
    kitchen: false,
    kitchenette: true,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1748354861920234.webp",
    ],
  },
  {
    id: 5,
    roomId: 626129,
    unitId: 1,
    displayName: "Room 5",
    type: "Δίκλινο / Τρίκλινο Ισογείου",
    location: "Ισόγειο",
    maxGuests: 3,
    budget: false,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/voulamandis-house-rooms.webp",
    ],
  },
  {
    id: 6,
    roomId: 268803,
    unitId: 2,
    displayName: "Room 6",
    type: "Οικονομικό Δίκλινο",
    location: "Ισόγειο",
    maxGuests: 2,
    budget: true,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/received_1753964631359257.webp",
    ],
  },
  {
    id: 7,
    roomId: 626129,
    unitId: 2,
    displayName: "Room 7",
    type: "Δίκλινο / Τρίκλινο Ισογείου",
    location: "Ισόγειο",
    maxGuests: 3,
    budget: false,
    stairs: false,
    ground: true,
    floor: false,
    gardenView: true,
    kitchen: false,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
    ],
  },
  {
    id: 8,
    roomId: 265595,
    unitId: 1,
    displayName: "Apartment 8",
    type: "Διαμέρισμα",
    location: "Ανεξάρτητο",
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    kitchen: true,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
    ],
  },
  {
    id: 9,
    roomId: 265595,
    unitId: 2,
    displayName: "Apartment 9",
    type: "Διαμέρισμα",
    location: "Ανεξάρτητο",
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    kitchen: true,
    kitchenette: false,
    images: [
      "https://chioshotel.gr/wp-content/uploads/2022/12/chios-apartments-voulamandis.webp",
    ],
  },
  {
    id: 10,
    roomId: 265595,
    unitId: 3,
    displayName: "Apartment 10",
    type: "Διαμέρισμα",
    location: "Ανεξάρτητο",
    maxGuests: 4,
    budget: false,
    stairs: false,
    ground: false,
    floor: false,
    gardenView: true,
    kitchen: true,
    kitchenette: false,
    images: ["https://chioshotel.gr/wp-content/uploads/2022/12/DSC07899.webp"],
  },
];

const FILTERS = [
  { key: "budget", icon: "💸", label: "Οικονομικό" },
  { key: "stairs", icon: "🪜", label: "Σκάλες" },
  { key: "upperFloor", icon: "🏛️", label: "Όροφος" },
  { key: "ground", icon: "🌿", label: "Ισόγειο" },
  { key: "gardenView", icon: "🌳", label: "Θέα Ισογείου" },
  { key: "upperFloorView", icon: "🌾", label: "Θέα Ορόφου" },
  { key: "kitchen", icon: "🍳", label: "Κουζίνα" },
  { key: "noKitchen", icon: "🚫🍳", label: "Χωρίς κουζίνα" },
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://chioshotel.gr/#website",
      url: "https://chioshotel.gr/",
      name: "Voulamandis House",
      inLanguage: "el-GR",
    },
    {
      "@type": "WebPage",
      "@id": "https://chioshotel.gr/#webpage",
      url: "https://chioshotel.gr/",
      name: "Voulamandis House | Ενοικιαζόμενα Δωμάτια στη Χίο στον Κάμπο",
      isPartOf: { "@id": "https://chioshotel.gr/#website" },
      about: { "@id": "https://chioshotel.gr/#lodging" },
      description:
        "Αυθεντική διαμονή στον Κάμπο της Χίου με ενοικιαζόμενα δωμάτια και διαμερίσματα.",
      inLanguage: "el-GR",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: HERO_IMAGE,
      },
    },
    {
      "@type": ["LodgingBusiness", "LocalBusiness"],
      "@id": "https://chioshotel.gr/#lodging",
      name: "Voulamandis House",
      url: "https://chioshotel.gr/",
      telephone: "+302271031733",
      email: "info@chioshotel.gr",
      image: [HERO_IMAGE],
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Δημάρχου Καλβοκορέση 117",
        addressLocality: "Χίος",
        addressRegion: "Βόρειο Αιγαίο",
        postalCode: "82100",
        addressCountry: "GR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 38.3370954,
        longitude: 26.1360051,
      },
      checkinTime: "15:00",
      checkoutTime: "11:00",
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
        { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
        {
          "@type": "LocationFeatureSpecification",
          name: "Air Conditioning",
          value: true,
        },
        { "@type": "LocationFeatureSpecification", name: "Garden", value: true },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://chioshotel.gr/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Το Voulamandis House είναι ξενοδοχείο;",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Όχι. Το Voulamandis House είναι κατάλυμα με ενοικιαζόμενα δωμάτια και διαμερίσματα στον Κάμπο της Χίου.",
          },
        },
        {
          "@type": "Question",
          name: "Πού βρίσκεται το Voulamandis House;",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Βρίσκεται στον ιστορικό Κάμπο της Χίου, στη διεύθυνση Δημάρχου Καλβοκορέση 117.",
          },
        },
      ],
    },
  ],
};

function roomKey(room: Pick<FullRoom, "roomId" | "unitId">) {
  return `${room.roomId}_${room.unitId}`;
}

function money(value: number) {
  return `${Number(value || 0).toFixed(2)}€`;
}

function round2(value: number) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function addDaysString(dateStr: string, days: number) {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("el-GR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function isConsecutive(dates: string[]) {
  const sorted = [...dates].sort();
  if (sorted.length <= 1) return true;

  for (let i = 1; i < sorted.length; i += 1) {
    if (addDaysString(sorted[i - 1], 1) !== sorted[i]) return false;
  }

  return true;
}

function apiBaseGuests(room: FullRoom) {
  return [8, 9, 10].includes(room.id) ? 4 : 2;
}

function extraGuestChargePerNight(room: FullRoom, guests: number) {
  const base = apiBaseGuests(room);
  if (base >= 4) return 0;
  if (guests === 3) return 20;
  if (guests >= 4) return 30;
  return 0;
}

function roomMatchesFilter(room: FullRoom, key: string) {
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

function featurePills(room: FullRoom) {
  const items: string[] = [];

  if (room.budget) items.push("💸 Οικονομικό");
  if (room.ground) items.push("🌿 Ισόγειο");
  if (room.floor) items.push("🏛️ Όροφος");
  if (room.gardenView) items.push("🌳 Θέα");
  if (room.kitchen) items.push("🍳 Κουζίνα");
  if (room.kitchenette) items.push("🥣 Kitchenette");
  if (room.stairs) items.push("🪜 Σκάλες");

  return items.slice(0, 3);
}

export default function HomePage() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [countdown, setCountdown] = useState("00:00:00");

  const [guests, setGuests] = useState<number | null>(null);
  const [dealsData, setDealsData] = useState<DealsData | null>(null);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [dealsError, setDealsError] = useState("");
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [serviceCar, setServiceCar] = useState(false);
  const [serviceTickets, setServiceTickets] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date();
      const next = new Date();
      next.setHours(24, 0, 0, 0);
      const diff = Math.max(0, next.getTime() - now.getTime());
      const totalSeconds = Math.floor(diff / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0",
      );
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      setCountdown(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.trustindex.io/loader.js?eee5e55655b69937bc662de8425";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const mergedRooms = useMemo<FullRoom[]>(() => {
    if (!dealsData?.rooms) return [];

    return dealsData.rooms.map((room) => {
      const meta = ROOM_META.find((item) => roomKey(item) === roomKey(room));
      return { ...(meta || ROOM_META[0]), ...room };
    });
  }, [dealsData]);

  function getNightInfo(room: FullRoom, dateStr: string) {
    if (!dealsData?.days || !guests) return null;

    const day = dealsData.days.find((item) => item.checkin === dateStr);
    const raw = day?.results?.[roomKey(room)];

    if (!raw) return null;

    const base = Number(raw.totalPrice || 0);
    const systemNight =
      base +
      Number(ROOM_EXTRA_PER_NIGHT[room.id] || 0) +
      extraGuestChargePerNight(room, guests) +
      2;

    const directNight = round2(systemNight * 0.85);

    return {
      available: Boolean(raw.available),
      systemNight,
      directNight,
    };
  }

  const visibleRooms = useMemo(() => {
    if (!dealsData?.days || !guests) return [];

    return mergedRooms
      .filter((room) => room.maxGuests >= guests)
      .filter((room) =>
        dealsData.days!.slice(0, 7).some((day) => {
          const info = getNightInfo(room, day.checkin);
          return info?.available;
        }),
      )
      .filter((room) => {
        if (!filters.size) return true;
        return Array.from(filters).every((filter) => roomMatchesFilter(room, filter));
      });
  }, [dealsData, guests, mergedRooms, filters]);

  async function loadDeals(nextGuests: number) {
    setGuests(nextGuests);
    setLoadingDeals(true);
    setDealsError("");
    setSelectedRoomKey(null);
    setSelectedDates([]);
    setServiceCar(false);
    setServiceTickets(false);

    try {
      const response = await fetch(
        `https://chioshotel.gr/wp-json/vh/v1/deals?t=${Date.now()}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        },
      );

      const data = (await response.json()) as DealsData;

      if (!response.ok || !data.ok) {
        throw new Error("Δεν φορτώθηκαν οι προσφορές.");
      }

      setDealsData(data);
    } catch (error) {
      setDealsError(
        error instanceof Error
          ? error.message
          : "Δεν φορτώθηκαν οι προσφορές.",
      );
    } finally {
      setLoadingDeals(false);
    }
  }

  function toggleFilter(key: string) {
    setFilters((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleDayClick(room: FullRoom, dateStr: string) {
    const key = roomKey(room);
    const info = getNightInfo(room, dateStr);

    if (!info?.available) return;

    if (selectedRoomKey && selectedRoomKey !== key) {
      setSelectedRoomKey(key);
      setSelectedDates([dateStr]);
      setServiceCar(false);
      setServiceTickets(false);
      return;
    }

    if (!selectedRoomKey) {
      setSelectedRoomKey(key);
      setSelectedDates([dateStr]);
      return;
    }

    let nextDates = selectedDates.includes(dateStr)
      ? selectedDates.filter((date) => date !== dateStr)
      : [...selectedDates, dateStr];

    nextDates = nextDates.sort();

    if (!nextDates.length) {
      setSelectedRoomKey(null);
      setSelectedDates([]);
      return;
    }

    if (!isConsecutive(nextDates)) {
      nextDates = [dateStr];
    }

    setSelectedRoomKey(key);
    setSelectedDates(nextDates);
  }

  function selectionTotals(room: FullRoom) {
    if (selectedRoomKey !== roomKey(room) || !selectedDates.length) return null;

    let systemTotal = 0;
    let directTotal = 0;

    selectedDates.forEach((date) => {
      const info = getNightInfo(room, date);
      if (info?.available) {
        systemTotal += info.systemNight;
        directTotal += info.directNight;
      }
    });

    const sorted = [...selectedDates].sort();

    return {
      nights: sorted.length,
      checkin: sorted[0],
      checkout: addDaysString(sorted[sorted.length - 1], 1),
      systemTotal: round2(systemTotal),
      directTotal: round2(directTotal),
      saveTotal: round2(systemTotal - directTotal),
    };
  }

  function bookingMessage(room: FullRoom) {
    const totals = selectionTotals(room);
    if (!totals) return "";

    const lines = [
      "Γεια σας, ενδιαφέρομαι για απευθείας κράτηση:",
      "",
      `Δωμάτιο: ${room.displayName}`,
      `Τύπος: ${room.type}`,
      `Άτομα: ${guests}`,
      `Check-in: ${totals.checkin}`,
      `Check-out: ${totals.checkout}`,
      `Νύχτες: ${totals.nights}`,
      `Αρχική τιμή: ${money(totals.systemTotal)}`,
      `Τελική τιμή: ${money(totals.directTotal)}`,
      `Κέρδος: ${money(totals.saveTotal)}`,
    ];

    if (serviceCar || serviceTickets) {
      lines.push("");
      lines.push("Επιπλέον ενδιαφέρον:");
      if (serviceCar) lines.push("- Ενοικίαση αυτοκινήτου");
      if (serviceTickets) lines.push("- Εισιτήρια");
    }

    lines.push("");
    lines.push("Παρακαλώ επιβεβαιώστε διαθεσιμότητα.");

    return lines.join("\n");
  }

  function handleDiscountSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDiscountError("");
    setDiscountMessage("");

    if (!email.trim()) {
      setDiscountError("Παρακαλώ εισάγετε το email σας.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setDiscountError("Παρακαλώ εισάγετε ένα έγκυρο email.");
      return;
    }

    if (!gdpr) {
      setDiscountError("Παρακαλώ αποδεχτείτε το checkbox συγκατάθεσης.");
      return;
    }

    setDiscountMessage("Ο εκπτωτικός σας κωδικός είναι:");
    setEmail("");
    setGdpr(false);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="vh-homepage">
        <section className="hero" aria-label="Ενοικιαζόμενα δωμάτια στη Χίο στον Κάμπο">
          <div className="hero-media" aria-hidden="true">
            <img
              src={HERO_IMAGE}
              alt=""
              width="1200"
              height="675"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="hero-inner">
            <div className="hero-content-box">
              <div
                className="rating-card"
                aria-label="Βαθμολογία επισκεπτών 4.8 στα 5 από 143 κριτικές"
              >
                <div>
                  <strong>4.8 / 5</strong>
                  <span>143 κριτικές</span>
                </div>
                <div className="stars" aria-hidden="true">
                  ★★★★★
                </div>
              </div>

              <div className="hero-kicker">ΚΑΜΠΟΣ ΧΙΟΥ • VOULAMANDIS HOUSE</div>

              <h1 className="hero-title">Ενοικιαζόμενα Δωμάτια στη Χίο στον Κάμπο</h1>

              <p className="hero-description">
                Ψάχνετε για <strong>ξενοδοχείο στη Χίο</strong> ή{" "}
                <strong>ενοικιαζόμενα δωμάτια Χίος</strong>; Το{" "}
                <strong>Voulamandis House</strong> είναι μια αυθεντική επιλογή
                διαμονής στον Κάμπο, με άνετα δωμάτια, ήρεμο περιβάλλον και
                εξαιρετικές κριτικές επισκεπτών.
              </p>

              <div className="hero-actions">
                <a
                  className="btn-primary"
                  href="https://chioshotel.gr/el/vre-to-domatio-pou-sou-tairiazei/"
                >
                  <span aria-hidden="true">✨</span> Βρες Δωμάτιο
                </a>

                <a className="btn-ghost" href="#vh-lastminute-title">
                  <span aria-hidden="true">🔥</span> Προσφορές
                </a>
              </div>

              <a
                className="hero-quiz-card"
                href="https://chioshotel.gr/el/diakopes-sti-chio-quiz/"
              >
                <span className="hero-quiz-icon" aria-hidden="true">
                  🧭
                </span>

                <span className="hero-quiz-copy">
                  <span className="hero-quiz-live">LIVE Κωδικός έκπτωσης</span>
                  <strong>Ανακάλυψε τη Χίο</strong>
                  <span>
                    Μάθε τα μυστικά του νησιού και πάρε κωδικό για τη διαμονή
                    σου.
                  </span>
                </span>

                <span className="hero-quiz-link">Ξεκίνα →</span>
              </a>
            </div>
          </div>
        </section>

        <a href="#vh-lastminute-title" className="vh-hero-announce">
          <span aria-hidden="true">🔥</span>
          <span>
            Ταξιδεύεις για Χίο αυτή την εβδομάδα;{" "}
            <strong>Δες διαθέσιμες προσφορές διαμονής.</strong>
          </span>
          <span className="vh-hero-announce-arrow" aria-hidden="true">
            ↓
          </span>
        </a>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-intro-title">
          <div className="vh-wrap">
            <div className="vh-intro-grid">
              <article className="vh-panel">
                <span className="vh-kicker">
                  Αυθεντική φιλοξενία στον Κάμπο της Χίου
                </span>

                <h2 id="vh-intro-title">
                  <span aria-hidden="true">🏡</span> Διαμονή στη Χίο στο
                  Voulamandis House
                </h2>

                <p>
                  Αναζητάτε <strong>δωμάτια στη Χίο</strong> ή{" "}
                  <strong>ενοικιαζόμενα δωμάτια Χίος</strong> για ήρεμη και
                  προσεγμένη διαμονή; Το Voulamandis House σας καλωσορίζει στον
                  ιστορικό Κάμπο της Χίου, προσφέροντας μια αυθεντική εμπειρία
                  φιλοξενίας σε περιβάλλον φυσικής ομορφιάς.
                </p>

                <div className="vh-pill-row" aria-label="Βασικά χαρακτηριστικά">
                  <span className="vh-pill">🌴 Διακοπές στη Χίο</span>
                  <span className="vh-pill">🍊 Κάμπος Χίου</span>
                  <span className="vh-pill">🛏️ Άνετα δωμάτια</span>
                  <span className="vh-pill">💎 Value for money</span>
                </div>
              </article>

              <article className="vh-panel">
                <span className="vh-kicker">
                  Τι κάνει το Voulamandis House ξεχωριστό
                </span>

                <h3>Έξι λόγοι που κάνουν τη διαμονή πιο άνετη και αυθεντική</h3>

                <div className="vh-unique-grid">
                  <div className="vh-unique-card">
                    <strong>🥐 Σπιτικό πρωινό</strong>
                    <span>
                      Πρωινό στον κήπο με προϊόντα από το αγρόκτημα.
                    </span>
                  </div>
                  <div className="vh-unique-card">
                    <strong>🌿 Αυλή & ηρεμία</strong>
                    <span>Ήσυχη ατμόσφαιρα, κήπος και αίσθηση Κάμπου.</span>
                  </div>
                  <div className="vh-unique-card">
                    <strong>🧭 Room Wizard</strong>
                    <span>Βοήθεια για να βρείτε το δωμάτιο που ταιριάζει.</span>
                  </div>
                  <div className="vh-unique-card">
                    <strong>📍 Σωστή τοποθεσία</strong>
                    <span>Κοντά σε πόλη, αεροδρόμιο, λιμάνι και παραλίες.</span>
                  </div>
                  <div className="vh-unique-card">
                    <strong>🛎️ -10% Απευθείας κράτηση</strong>
                    <span>Άμεση επικοινωνία με το κατάλυμα.</span>
                  </div>
                  <div className="vh-unique-card">
                    <strong>🍊 Μυστικά της Χίου</strong>
                    <span>Προτάσεις για παραλίες, χωριά και εμπειρίες.</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-bento-title">
          <div className="vh-wrap">
            <header className="vh-section-head" style={{ textAlign: "center" }}>
              <span className="vh-kicker">Τοποθεσία & απευθείας κράτηση</span>
              <h2 className="vh-title" id="vh-bento-title">
                <span aria-hidden="true">🗺️</span> Όλα όσα χρειάζεστε πριν
                οργανώσετε τη διαμονή σας
              </h2>
              <p className="vh-subtitle" style={{ margin: "0 auto" }}>
                Χάρτης, αποστάσεις, στοιχεία επικοινωνίας και πλεονεκτήματα
                απευθείας κράτησης.
              </p>
            </header>

            <div className="bento">
              <article className="b-card b7">
                {!mapLoaded ? (
                  <div className="map-preview">
                    <button
                      className="vh-btn vh-btn--primary"
                      type="button"
                      onClick={() => setMapLoaded(true)}
                    >
                      <span aria-hidden="true">📍</span> Εμφάνιση Χάρτη
                    </button>
                  </div>
                ) : (
                  <iframe
                    className="map-iframe is-visible"
                    title="Χάρτης τοποθεσίας Voulamandis House"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12648.784411135249!2d26.1360051!3d38.3370954!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bac5b2f6b8b9f1%3A0x6b8b9f1b2f6b8b9f!2sVoulamandis%20House!5e0!3m2!1sel!2sgr!4v1614241234567!5m2!1sel!2sgr"
                    loading="lazy"
                    allowFullScreen
                  />
                )}

                <div className="distance-badge">
                  <div>
                    <span>✈️ Αεροδρόμιο</span>
                    <strong>3 χλμ</strong>
                  </div>
                  <div>
                    <span>⛴️ Λιμάνι</span>
                    <strong>6 χλμ</strong>
                  </div>
                  <div>
                    <span>🏖️ Παραλία</span>
                    <strong>1.5 χλμ</strong>
                  </div>
                </div>
              </article>

              <article className="b-card b5 b-pad">
                <div className="vh-kicker">Τοπικές πληροφορίες</div>
                <h3
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: 26,
                    color: "#8e6607",
                    margin: "10px 0",
                    fontWeight: 700,
                  }}
                >
                  Voulamandis House
                </h3>

                <address
                  style={{
                    fontStyle: "normal",
                    fontSize: 15,
                    color: "var(--vh-muted)",
                    lineHeight: 1.8,
                  }}
                >
                  📍 Δημάρχου Καλβοκορέση 117
                  <br />
                  Κάμπος, Χίος 82100
                  <br />
                  📞 Τηλ:{" "}
                  <a href="tel:+302271031733" style={{ color: "#8e6607", fontWeight: 700 }}>
                    +30 22710 31733
                  </a>
                  <br />
                  ✉️ Email:{" "}
                  <a
                    href="mailto:info@chioshotel.gr"
                    style={{ color: "#8e6607", fontWeight: 700 }}
                  >
                    info@chioshotel.gr
                  </a>
                </address>

                <p style={{ margin: "18px 0 0", color: "var(--vh-muted)" }}>
                  Το κατάλυμα βρίσκεται σε σημείο που συνδυάζει ηρεμία, εύκολη
                  πρόσβαση και κοντινές αποστάσεις.
                </p>

                <div className="vh-btn-row">
                  <a
                    className="vh-btn vh-btn--primary"
                    href="https://chioshotel.gr/el/amesi-kratisi-voulamandis-house/"
                  >
                    <span aria-hidden="true">📅</span> Διαθεσιμότητα
                  </a>
                </div>
              </article>

              <article className="b-card b12 b-pad discount-box">
                <span className="discount-badge">LIVE Ευκαιρία • Πάρε κωδικό</span>

                <h3
                  style={{
                    margin: "14px 0 10px",
                    fontFamily: "Georgia,serif",
                    fontSize: 28,
                    color: "#8e6607",
                    lineHeight: 1.1,
                    fontWeight: 700,
                  }}
                >
                  Κλείστε απευθείας μαζί μας
                </h3>

                <p style={{ fontSize: 15, color: "var(--vh-muted)", margin: 0 }}>
                  Πάρε κωδικό έκπτωσης και προχώρησε σε απευθείας κράτηση χωρίς
                  προμήθειες.
                </p>

                <ul className="vh-check-list">
                  <li>✔️ Καλύτερη διαθέσιμη τιμή</li>
                  <li>✔️ Άμεση επικοινωνία με το κατάλυμα</li>
                  <li>✔️ Πρόσβαση σε διαθέσιμα δωμάτια</li>
                </ul>

                <form onSubmit={handleDiscountSubmit} noValidate>
                  <div className="form-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Το email σας"
                      required
                      className="email-input"
                      inputMode="email"
                      autoComplete="email"
                      aria-label="Το email σας"
                    />

                    <button type="submit" className="vh-btn vh-btn--primary">
                      <span aria-hidden="true">✉️</span> ΛΗΨΗ ΚΩΔΙΚΟΥ
                    </button>
                  </div>

                  <div className="discount-consent">
                    <label>
                      <input
                        type="checkbox"
                        checked={gdpr}
                        onChange={(event) => setGdpr(event.target.checked)}
                        required
                      />{" "}
                      Συμφωνώ να λαμβάνω προσφορές από το Voulamandis House.
                    </label>
                  </div>

                  {discountMessage ? (
                    <div className="discount-success" style={{ display: "block" }}>
                      <div>{discountMessage}</div>
                      <div className="discount-code-value">WELCOME10</div>
                    </div>
                  ) : null}

                  {discountError ? (
                    <div className="discount-error" style={{ display: "block" }}>
                      {discountError}
                    </div>
                  ) : null}
                </form>
              </article>
            </div>

            <div className="vh-location-copy">
              <span className="vh-kicker">Τοποθεσία – Κάμπος Χίου</span>
              <h2
                className="vh-title"
                style={{ fontSize: "clamp(28px,3vw,44px)", marginBottom: 18 }}
              >
                Μια ξεχωριστή περιοχή για αυθεντική διαμονή στη Χίο
              </h2>
              <p>
                Ο <strong>Κάμπος της Χίου</strong> είναι μία από τις πιο ιδιαίτερες
                και ιστορικές περιοχές του νησιού.
              </p>
              <p>
                Η θέση του είναι ιδανική για όσους θέλουν να συνδυάσουν χαλάρωση
                και εύκολη πρόσβαση στην πόλη, στο αεροδρόμιο και σε παραλίες.
              </p>
            </div>
          </div>
        </section>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-rooms-title">
          <div className="vh-wrap">
            <div className="vh-split-highlight">
              <article className="vh-highlight-card">
                <span className="vh-kicker">Δωμάτια & διαμονή στη Χίο</span>
                <h2
                  className="vh-title"
                  id="vh-rooms-title"
                  style={{ fontSize: "clamp(30px,3.6vw,48px)" }}
                >
                  <span aria-hidden="true">🛏️</span> Δωμάτια Χίος για ζευγάρια
                  και οικογένειες
                </h2>
                <p>
                  Τα δωμάτιά μας καθαρίζονται καθημερινά και έχουν σχεδιαστεί για
                  άνετη, ήρεμη και ποιοτική διαμονή στον Κάμπο της Χίου.
                </p>
                <div className="vh-btn-row">
                  <a
                    className="vh-btn vh-btn--primary"
                    href="https://chioshotel.gr/el/vre-to-domatio-pou-sou-tairiazei/"
                  >
                    <span aria-hidden="true">✨</span> Room Wizard
                  </a>
                  <a
                    className="vh-btn vh-btn--secondary"
                    href="https://chioshotel.gr/el/domatia-xios/"
                  >
                    <span aria-hidden="true">🗂️</span> Όλα τα δωμάτια
                  </a>
                </div>
              </article>

              <article className="vh-highlight-card">
                <span className="vh-kicker">Ενοικιαζόμενα δωμάτια Χίος</span>
                <h3>Από οικονομική διαμονή μέχρι οικογενειακές λύσεις</h3>
                <p>
                  Αν αναζητάτε ξενοδοχεία στη Χίο αλλά προτιμάτε πιο προσωπική
                  φιλοξενία, το Voulamandis House προσφέρει μια αυθεντική λύση.
                </p>
              </article>
            </div>

            <div className="vh-room-grid">
              <RoomCard
                href="https://chioshotel.gr/el/domatia-xios/oikonomiko-diklino-domatio/"
                image="https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp"
                alt="Οικονομικό Δίκλινο Δωμάτιο στο Voulamandis House"
                title="Οικονομικό Δίκλινο"
                text="Ιδανική επιλογή για δύο άτομα που θέλουν προσεγμένη διαμονή στον Κάμπο της Χίου."
                bed="🛏️ 1 διπλό ή 2 μονά"
                meta={["👥 2 άτομα", "Economy", "🍊 Κάμπος"]}
                button="Δες το δωμάτιο"
              />

              <RoomCard
                href="https://chioshotel.gr/el/domatia-xios/diklina-triklina-domatia/"
                image="https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg"
                alt="Δίκλινα και τρίκλινα δωμάτια ισογείου στη Χίο"
                title="Δίκλινα & Τρίκλινα Ισογείου"
                text="Άνετη λύση για ζευγάρια ή μικρές οικογένειες με εύκολη πρόσβαση."
                bed="🛏️ Διπλό + extra"
                meta={["👤 ×2-3", "🌿 Ισόγειο", "Εύκολα"]}
                button="Δες το δωμάτιο"
              />

              <RoomCard
                href="https://chioshotel.gr/el/domatia-xios/diklina-triklina-domatia/"
                image="https://chioshotel.gr/wp-content/uploads/2022/12/DSC07867-1.webp"
                alt="Δίκλινα και τρίκλινα δωμάτια ορόφου στη Χίο"
                title="Δίκλινα & Τρίκλινα Ορόφου"
                text="Επιλογή για επισκέπτες που αναζητούν πιο ήρεμη ατμόσφαιρα και κλασική φιλοξενία."
                bed="🛏️ Διπλό + extra"
                meta={["👤 ×2-3", "🏛️ Όροφος", "Ήσυχα"]}
                button="Δες το δωμάτιο"
              />

              <RoomCard
                href="https://chioshotel.gr/el/domatia-xios/oikogeneiako-diamerisma/"
                image="https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp"
                alt="Οικογενειακό διαμέρισμα στο Voulamandis House"
                title="Οικογενειακό Διαμέρισμα"
                text="Ιδανικό για οικογένειες ή μικρές παρέες που χρειάζονται περισσότερο χώρο."
                bed="🛏️ Family beds"
                meta={["👤 ×4", "Χώρος", "🏡 Apt"]}
                button="Δες το διαμέρισμα"
              />
            </div>
          </div>
        </section>

        <section
          className="vh-section vh-section--tight"
          aria-labelledby="vh-lastminute-title"
        >
          <div className="vh-wrap">
            <header className="vh-section-head" style={{ textAlign: "center" }}>
              <span className="vh-kicker">Last Minute Προσφορές</span>
              <h2 className="vh-title" id="vh-lastminute-title">
                <span aria-hidden="true">⚡</span> Ταξιδεύεις για Χίο αυτή την
                εβδομάδα;
              </h2>
              <p className="vh-subtitle" style={{ margin: "0 auto", maxWidth: 900 }}>
                Επίλεξε αριθμό επισκεπτών και δες διαθέσιμες προσφορές για τις
                επόμενες 7 ημέρες.
              </p>
            </header>
          </div>

          <div className="lm-widget" id="lmDealsWidget">
            <div className="lm-shell">
              <div className="lm-panel">
                <div id="deals-app">
                  <section className="rb-hero" aria-label="Προσφορές διαμονής στη Χίο">
                    <div className="rb-hero-top">
                      <div className="rb-hero-head">
                        <h2 className="rb-title">
                          Προσφορές διαμονής στη Χίο για τις επόμενες 7 ημέρες
                        </h2>
                        <p className="rb-subtitle">
                          Βρες διαθέσιμα δωμάτια ή διαμερίσματα για άμεση
                          κράτηση, χωρίς προμήθειες.
                        </p>
                        <div className="rb-trust-line">
                          🎁 Απευθείας κράτηση χωρίς προμήθειες – καλύτερη τιμή
                        </div>
                      </div>

                      <div className="rb-hero-actions">
                        <div className="rb-hero-timer">
                          <p className="rb-hero-timer-label">
                            Οι last minute τιμές ανανεώνονται σε:
                          </p>
                          <p className="rb-hero-timer-value">{countdown}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rb-search-card" aria-label="Επιλογή επισκεπτών">
                    <div className="rb-section-head">
                      <div>
                        <h3>1. Επίλεξε αριθμό επισκεπτών</h3>
                        <p>
                          Μόλις επιλέξεις πόσα άτομα θα μείνετε, θα εμφανιστούν
                          οι διαθέσιμες προσφορές.
                        </p>
                      </div>
                    </div>

                    <div className="rb-guest-row">
                      {[2, 3, 4].map((number) => (
                        <button
                          key={number}
                          className={`rb-guest-btn ${guests === number ? "is-active" : ""}`}
                          type="button"
                          onClick={() => loadDeals(number)}
                        >
                          <span aria-hidden="true">👤</span> ×{number}
                        </button>
                      ))}
                    </div>

                    <div className="rb-helper">
                      Επίλεξε πρώτα επισκέπτες για να δεις διαθέσιμα δωμάτια στη
                      Χίο.
                    </div>

                    {loadingDeals ? (
                      <div className="rb-loading">
                        🔥 Αναζητούμε τις καλύτερες διαθέσιμες προσφορές…
                      </div>
                    ) : null}
                  </section>

                  <section
                    className={`rb-results-wrap ${guests ? "is-visible" : ""}`}
                    aria-label="Αποτελέσματα προσφορών"
                  >
                    <div className="rb-section-head">
                      <div>
                        <h3>2. Διαθέσιμες προσφορές</h3>
                        <p>Χρησιμοποίησε τα φίλτρα για να περιορίσεις τις επιλογές.</p>
                      </div>
                      <div className="rb-results-meta">
                        {guests
                          ? `Βρέθηκαν ${visibleRooms.length} επιλογές για ${guests} επισκέπτες.`
                          : "Πρώτα επίλεξε επισκέπτες."}
                      </div>
                    </div>

                    {guests ? (
                      <div className="rb-filter-row" style={{ display: "flex" }}>
                        {FILTERS.map((filter) => (
                          <button
                            key={filter.key}
                            type="button"
                            className={`rb-filter-chip ${
                              filters.has(filter.key) ? "is-active" : ""
                            }`}
                            onClick={() => toggleFilter(filter.key)}
                          >
                            <span>{filter.icon}</span>
                            <span>{filter.label}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {dealsError ? <div className="rb-empty">{dealsError}</div> : null}

                    {!guests ? (
                      <div className="rb-empty">
                        Πρώτα επίλεξε 2, 3 ή 4 επισκέπτες για να εμφανιστούν οι
                        προσφορές.
                      </div>
                    ) : null}

                    {guests && !loadingDeals && !visibleRooms.length && !dealsError ? (
                      <div className="rb-empty">
                        Δεν βρέθηκαν διαθέσιμες προσφορές με τα τρέχοντα φίλτρα.
                      </div>
                    ) : null}

                    <div className="rb-room-list">
                      {visibleRooms.map((room) => {
                        const totals = selectionTotals(room);

                        return (
                          <article
                            key={roomKey(room)}
                            className="rb-room-card"
                          >
                            <div className="rb-room-main">
                              <div className="rb-room-left">
                                <div className="rb-room-media">
                                  <img
                                    src={room.images[0]}
                                    alt={`${room.displayName} - προσφορά διαμονής στη Χίο`}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </div>
                                <h4 className="rb-room-title">
                                  {room.displayName}
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      fontSize: ".85rem",
                                      color: "#6f645b",
                                    }}
                                  >
                                    {" "}
                                    · {room.type}
                                  </span>
                                </h4>
                              </div>

                              <div className="rb-room-center">
                                <div className="rb-calendar-head">
                                  <div className="rb-calendar-title-wrap">
                                    <div className="rb-calendar-title">
                                      <h4>Επόμενες 7 ημέρες</h4>
                                    </div>
                                    <div className="rb-calendar-legend">
                                      ✓ = διαθέσιμο · ✕ = μη διαθέσιμο
                                    </div>
                                    <div className="rb-calendar-badges">
                                      {featurePills(room).map((pill) => (
                                        <span className="rb-mini-pill" key={pill}>
                                          {pill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="rb-calendar">
                                  {dealsData?.days?.slice(0, 7).map((day) => {
                                    const info = getNightInfo(room, day.checkin);
                                    const selected =
                                      selectedRoomKey === roomKey(room) &&
                                      selectedDates.includes(day.checkin);

                                    if (!info?.available) {
                                      return (
                                        <div className="rb-day busy" key={day.checkin}>
                                          <div className="rb-day-date">
                                            {formatDate(day.checkin)}
                                          </div>
                                          <div className="rb-day-status">✕</div>
                                          <div className="rb-day-old">—</div>
                                        </div>
                                      );
                                    }

                                    return (
                                      <button
                                        type="button"
                                        className={`rb-day free ${selected ? "selected" : ""}`}
                                        key={day.checkin}
                                        onClick={() => handleDayClick(room, day.checkin)}
                                      >
                                        <div className="rb-day-date">
                                          {formatDate(day.checkin)}
                                        </div>
                                        <div className="rb-day-status">✓</div>
                                        <div className="rb-day-old">
                                          {money(info.systemNight)}
                                        </div>
                                        <div className="rb-day-deal">
                                          {money(info.directNight)}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <aside className="rb-booking-panel">
                                {totals ? (
                                  <div className="rb-booking-state">
                                    <div className="rb-booking-item">
                                      <span>Check-in</span>
                                      <span>{totals.checkin}</span>
                                    </div>
                                    <div className="rb-booking-item">
                                      <span>Check-out</span>
                                      <span>{totals.checkout}</span>
                                    </div>
                                    <div className="rb-booking-item">
                                      <span>Νύχτες</span>
                                      <span>{totals.nights}</span>
                                    </div>
                                    <div className="rb-booking-item">
                                      <span>Άτομα</span>
                                      <span>{guests}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="rb-booking-badges">
                                    <div className="rb-booking-badge">🔥 Καλύτερη τιμή</div>
                                    <div className="rb-booking-badge">💸 Χωρίς προμήθειες</div>
                                    <div className="rb-booking-badge">🏨 Επιλογή δωματίου</div>
                                    <div className="rb-booking-badge">💳 Χωρίς κάρτα</div>
                                  </div>
                                )}
                              </aside>

                              <div className="rb-inline-total-wrapper">
                                {totals ? (
                                  <div className="rb-inline-total-box">
                                    <div className="rb-inline-summary">
                                      <div className="rb-inline-total-label">
                                        Κόστος απευθείας κράτησης
                                      </div>
                                      <div className="rb-inline-total-price">
                                        {money(totals.directTotal)}
                                      </div>
                                      <div className="rb-inline-total-meta">
                                        {totals.nights} νύχτες · {totals.checkin} →{" "}
                                        {totals.checkout}
                                      </div>
                                      <div className="rb-inline-save">
                                        🎁 Κερδίζεις {money(totals.saveTotal)}
                                      </div>
                                    </div>

                                    <div className="rb-service-wrap">
                                      <label className="rb-service-option">
                                        <input
                                          type="checkbox"
                                          checked={serviceCar}
                                          onChange={(event) =>
                                            setServiceCar(event.target.checked)
                                          }
                                        />
                                        <span className="rb-service-icon">🚗</span>
                                        <span className="rb-service-title">
                                          Με ενδιαφέρει αυτοκίνητο
                                        </span>
                                      </label>

                                      <label className="rb-service-option">
                                        <input
                                          type="checkbox"
                                          checked={serviceTickets}
                                          onChange={(event) =>
                                            setServiceTickets(event.target.checked)
                                          }
                                        />
                                        <span className="rb-service-icon">✈️⛴️</span>
                                        <span className="rb-service-title">
                                          Με ενδιαφέρουν εισιτήρια
                                        </span>
                                      </label>
                                    </div>

                                    <div className="rb-inline-actions">
                                      <a
                                        className="rb-inline-action rb-inline-wa"
                                        href={`https://wa.me/306944474226?text=${encodeURIComponent(
                                          bookingMessage(room),
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        💬 WhatsApp
                                      </a>
                                      <a
                                        className="rb-inline-action rb-inline-viber"
                                        href={`viber://chat?number=%2B306944474226&draft=${encodeURIComponent(
                                          bookingMessage(room),
                                        )}`}
                                      >
                                        📞 Viber
                                      </a>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-reviews-title">
          <div className="vh-wrap">
            <div className="vh-reviews-shell">
              <span className="vh-kicker">Κριτικές επισκεπτών</span>
              <h2 className="vh-title" id="vh-reviews-title">
                <span aria-hidden="true">💬</span> Τι λένε οι επισκέπτες μας
              </h2>
              <div className="vh-reviews-widget" style={{ textAlign: "center" }} />
            </div>
          </div>
        </section>

        <section
          className="vh-section vh-section--tight"
          aria-labelledby="vh-amenities-title"
        >
          <div className="vh-wrap">
            <header className="vh-section-head">
              <span className="vh-kicker">Παροχές διαμονής</span>
              <h2 className="vh-title" id="vh-amenities-title">
                <span aria-hidden="true">🛋️</span> Ό,τι χρειάζεστε για άνετη
                διαμονή
              </h2>
            </header>

            <div className="vh-amenities-grid">
              {[
                ["📶", "Wi-Fi / Internet"],
                ["❄️", "Κλιματισμός"],
                ["🔥", "Θέρμανση"],
                ["📺", "Τηλεόραση"],
                ["🧊", "Ψυγείο"],
                ["☕", "Καφές / Τσάι"],
                ["🧼", "Καθημερινή καθαριότητα"],
                ["🌿", "Κήπος & καθιστικό"],
                ["🍖", "Χώρος BBQ"],
                ["🚗", "Parking"],
                ["🚕", "Μεταφορά"],
                ["🏡", "Αυθεντική φιλοξενία"],
              ].map(([icon, text]) => (
                <div className="vh-amenity" key={text}>
                  <div className="vh-amenity-icon">{icon}</div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="vh-section vh-section--tight vh-traveler-section"
          aria-labelledby="vh-traveler-title"
        >
          <div className="vh-wrap">
            <header className="vh-section-head" style={{ textAlign: "center" }}>
              <span className="vh-kicker">Discover Chios</span>
              <h2 className="vh-title" id="vh-traveler-title">
                <span aria-hidden="true">🧳</span> Ποιος τύπος ταξιδιώτη είσαι;
              </h2>
              <p className="vh-subtitle" style={{ margin: "0 auto", maxWidth: 780 }}>
                Επίλεξε την εμπειρία που σου ταιριάζει και ανακάλυψε τη Χίο.
              </p>
            </header>

            <div className="vh-traveler-grid">
              <TravelerCard
                href="https://chioshotel.gr/el/kalyteres-paralies-xiou/"
                image="https://chioshotel.gr/wp-content/uploads/2026/03/sakiz-agia-dynami.jpg"
                alt="Παραλίες της Χίου"
                title="Θάλασσα"
                text="Κρυστάλλινα νερά, μοναδικές παραλίες και χαλάρωση στο νησί."
                button="🏖️ Εξερεύνησε"
              />

              <TravelerCard
                href="https://chioshotel.gr/el/exerevnisi-chiou/"
                image="https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp"
                alt="Χωριά και εξερεύνηση στη Χίο"
                title="Εξερεύνηση"
                text="Χωριά, φύση και πολιτισμός σε κάθε γωνιά της Χίου."
                button="🧭 Εξερεύνησε"
              />

              <TravelerCard
                href="https://chioshotel.gr/el/oikogeneiakes-diakopes-sti-xio/"
                image="https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp"
                alt="Οικογενειακές διακοπές στη Χίο"
                title="Οικογένεια"
                text="Ιδέες και δραστηριότητες για οικογενειακές διακοπές."
                button="👨‍👩‍👧‍👦 Εξερεύνησε"
              />

              <TravelerCard
                href="https://chioshotel.gr/el/taste-lover-el-gastronomiko-taxidi-xios/"
                image="https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp"
                alt="Γαστρονομία και μαστίχα στη Χίο"
                title="Γαστρονομία"
                text="Αυθεντικές γεύσεις, μαστίχα και τοπικές εμπειρίες."
                button="🍽️ Εξερεύνησε"
              />
            </div>
          </div>
        </section>

        <section className="vh-section" aria-labelledby="vh-explore-more-title">
          <div className="vh-wrap">
            <header className="vh-section-head">
              <span className="vh-kicker">Περισσότερα για τη Χίο</span>
              <h2 className="vh-title" id="vh-explore-more-title">
                <span aria-hidden="true">🧭</span> Τι να δω στη Χίο;
              </h2>
              <p className="vh-subtitle">
                Συγκεντρώσαμε χρήσιμες πληροφορίες για τη Χίο ώστε να οργανώσετε
                πιο εύκολα τη διαμονή και τις εξορμήσεις σας.
              </p>
            </header>

            <div className="vh-link-grid">
              <ExploreCard
                href="https://chioshotel.gr/el/chios-el/paralies-chios/"
                image="https://chioshotel.gr/wp-content/uploads/2026/03/sakiz-agia-dynami.jpg"
                alt="Παραλίες της Χίου"
                title="Παραλίες της Χίου"
                text="Δείτε προτάσεις και οργανώστε τις καλοκαιρινές σας εξορμήσεις."
                button="🏖️ Δες περισσότερα"
              />

              <ExploreCard
                href="https://chioshotel.gr/el/chios-el/ta-10-top-xoria-xios/"
                image="https://chioshotel.gr/wp-content/uploads/2021/12/lagada_3.webp"
                alt="Χωριά της Χίου"
                title="Χωριά της Χίου"
                text="Ανακαλύψτε παραδοσιακούς οικισμούς και σημεία που αξίζει να επισκεφθείτε."
                button="🏘️ Δες περισσότερα"
              />

              <ExploreCard
                href="https://chioshotel.gr/el/chios-el/chios-kambos-2/"
                image={HERO_IMAGE}
                alt="Κάμπος της Χίου"
                title="Κάμπος της Χίου"
                text="Μάθετε περισσότερα για την περιοχή που κάνει τη διαμονή ξεχωριστή."
                button="🍊 Δες περισσότερα"
              />

              <ExploreCard
                href="https://chioshotel.gr/el/chios-el/chios-museums-2/"
                image="https://chioshotel.gr/wp-content/uploads/2022/12/mousio.mastic.webp"
                alt="Μουσεία της Χίου"
                title="Μουσεία της Χίου"
                text="Πολιτιστικές στάσεις για όσους αγαπούν την ιστορία και την τοπική ταυτότητα."
                button="🏺 Δες περισσότερα"
              />

              <ExploreCard
                href="https://chioshotel.gr/el/chios-el/chios-activities-el/chios-orchids-2/"
                image="https://chioshotel.gr/wp-content/uploads/2021/12/Ophrys_mastichorum-680x1024.webp"
                alt="Ορχιδέες της Χίου"
                title="Ορχιδέες της Χίου"
                text="Μια ιδιαίτερη δραστηριότητα για φυσιολάτρες."
                button="🌸 Δες περισσότερα"
              />

              <ExploreCard
                href="https://chioshotel.gr/el/chios-el/chios-activities-el/chios-springs/"
                image="https://chioshotel.gr/wp-content/uploads/2021/12/the-thermal-baths-center.webp"
                alt="Ιαματικές πηγές Χίου"
                title="Ιαματικές Πηγές"
                text="Επιλογές για χαλάρωση και wellness εμπειρίες."
                button="♨️ Δες περισσότερα"
              />
            </div>
          </div>
        </section>

        <section className="premium-seo-bar" aria-label="Ανακαλύψτε περισσότερα για τη Χίο">
          <div className="bar-inner">
            <div className="text-wrap">
              <span className="premium-label">ΑΝΑΚΑΛΥΨΤΕ ΤΗ ΧΙΟ</span>
              <p className="premium-text">
                Αφιέρωσε 5 λεπτά και παίξε αυτό το quiz που θα σε βοηθήσει να
                γνωρίσεις τη Χίο και να πάρεις κωδικό έκπτωσης.
              </p>
            </div>

            <div className="cta-wrap">
              <a
                href="https://chioshotel.gr/el/diakopes-sti-chio-quiz/"
                className="premium-btn-quiz"
              >
                🧭 ΞΕΚΙΝΑ ΤΗΝ ΕΜΠΕΙΡΙΑ <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="vh-section vh-section--tight" aria-labelledby="vh-faq-title">
          <div className="vh-wrap">
            <header className="vh-section-head" style={{ textAlign: "center" }}>
              <span className="vh-kicker">Συχνές Ερωτήσεις</span>
              <h2 className="vh-title" id="vh-faq-title">
                <span aria-hidden="true">❓</span> Όσα πρέπει να γνωρίζετε πριν
                κλείσετε τη διαμονή σας
              </h2>
            </header>

            <div className="vh-faq-grid">
              <FaqItem title="Το Voulamandis House είναι ξενοδοχείο;">
                Όχι. Το Voulamandis House είναι κατάλυμα με ενοικιαζόμενα δωμάτια
                και διαμερίσματα στον Κάμπο της Χίου.
              </FaqItem>

              <FaqItem title="Πού ακριβώς βρίσκεται το Voulamandis House;">
                Το κατάλυμα βρίσκεται στον ιστορικό <strong>Κάμπο της Χίου</strong>.
                Απέχει περίπου 7 λεπτά με το αυτοκίνητο από το αεροδρόμιο και
                περίπου 14 λεπτά από το λιμάνι.
              </FaqItem>

              <FaqItem title="Παρέχεται πρωινό κατά τη διαμονή;">
                Ναι, προσφέρεται σπιτικό πρωινό στην πέργκολα του κήπου, με
                προϊόντα από το αγρόκτημά μας.
              </FaqItem>

              <FaqItem title="Ποια δωμάτια είναι κατάλληλα για οικογένειες;">
                Για οικογένειες έως 4 ατόμων, προτείνουμε τα{" "}
                <strong>Οικογενειακά Διαμερίσματα</strong>.
              </FaqItem>

              <FaqItem title="Υπάρχει χώρος στάθμευσης;">
                Ναι, υπάρχει δυνατότητα στάθμευσης εντός του καταλύματος και
                εύκολη στάθμευση στον ήσυχο δρόμο έξω.
              </FaqItem>

              <FaqItem title="Πώς μπορώ να κάνω απευθείας κράτηση;">
                Μπορείτε να κάνετε άμεση κράτηση μέσα από την ιστοσελίδα μας ή να
                επικοινωνήσετε απευθείας μαζί μας.
              </FaqItem>
            </div>
          </div>
        </section>

        <section className="vh-final" aria-labelledby="vh-final-title">
          <div className="vh-wrap">
            <div className="vh-final-shell">
              <span className="vh-kicker" style={{ color: "#f0ddca" }}>
                Κλείστε τη διαμονή σας
              </span>

              <h2 id="vh-final-title">
                <span aria-hidden="true">✈️</span> Το ταξίδι σας στη Χίο ξεκινά
                εδώ
              </h2>

              <p>
                Ζεστή φιλοξενία, αυθεντική ατμόσφαιρα και ιδανική τοποθεσία στον
                Κάμπο.
              </p>

              <div className="vh-btn-row">
                <a
                  className="vh-btn vh-btn--primary"
                  href="https://chioshotel.gr/el/amesi-kratisi-voulamandis-house/"
                >
                  <span aria-hidden="true">🛎️</span> Άμεση Κράτηση
                </a>

                <a
                  className="vh-btn vh-btn--secondary"
                  href="https://chioshotel.gr/el/epikoinonia-voulamandis-house/"
                >
                  <span aria-hidden="true">✉️</span> Επικοινωνία
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="vh-mobile-sticky" aria-label="Γρήγορες ενέργειες επικοινωνίας">
        <div className="vh-mobile-sticky__inner">
          <a className="vh-btn vh-btn--secondary" href="tel:+306944764654">
            📞 ΚΛΗΣΗ
          </a>
          <a className="vh-btn vh-btn--primary" href="viber://chat?number=%2B306944474226">
            💬 VIBER
          </a>
        </div>
      </div>
    </>
  );
}

function RoomCard({
  href,
  image,
  alt,
  title,
  text,
  bed,
  meta,
  button,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  text: string;
  bed: string;
  meta: string[];
  button: string;
}) {
  return (
    <a className="vh-room-card" href={href}>
      <div className="vh-room-image">
        <img src={image} alt={alt} loading="lazy" decoding="async" />
        <div className="room-offer-stack">
          <span className="room-live-badge">LIVE</span>
          <span className="room-direct-badge">🎁 -10% Έκπτωση</span>
        </div>
        <span className="room-bed-badge">{bed}</span>
      </div>

      <div className="vh-room-body">
        <h3>{title}</h3>
        <p>{text}</p>

        <div className="vh-room-meta">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="vh-room-amenities">
          <span>❄️ A/C</span>
          <span>📶 Wi-Fi</span>
          <span>☕ Καφές</span>
          <span>🧊 Ψυγείο</span>
        </div>

        <span className="vh-btn vh-btn--secondary">
          <span aria-hidden="true">🔎</span> {button}
        </span>
      </div>
    </a>
  );
}

function TravelerCard({
  href,
  image,
  alt,
  title,
  text,
  button,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  text: string;
  button: string;
}) {
  return (
    <a href={href} className="vh-traveler-card">
      <img src={image} alt={alt} loading="lazy" decoding="async" />
      <div className="vh-traveler-overlay" />
      <div className="vh-traveler-content">
        <h3>{title}</h3>
        <p>{text}</p>
        <span className="vh-traveler-link">{button}</span>
      </div>
    </a>
  );
}

function ExploreCard({
  href,
  image,
  alt,
  title,
  text,
  button,
}: {
  href: string;
  image: string;
  alt: string;
  title: string;
  text: string;
  button: string;
}) {
  return (
    <a className="vh-link-card" href={href}>
      <div className="vh-link-image">
        <img src={image} alt={alt} loading="lazy" decoding="async" />
      </div>
      <div className="vh-link-body">
        <h3>{title}</h3>
        <p>{text}</p>
        <span className="vh-btn vh-btn--secondary">{button}</span>
      </div>
    </a>
  );
}

function FaqItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="vh-faq-item">
      <summary>{title}</summary>
      <div className="vh-faq-answer">{children}</div>
    </details>
  );
}
