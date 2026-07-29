from pathlib import Path


def read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8-sig")


def write(path: str, text: str) -> None:
    Path(path).write_text(text, encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one match, found {count}: {old[:160]!r}")
    write(path, text.replace(old, new, 1))
    print(f"updated {path}")


# 1. Full French Room Wizard copy and result localization.
wizard_path = "components/rooms/RoomWizardTailwind.tsx"
wizard = read(wizard_path)
fr_copy = '''
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
'''
marker = "\n\nconst deCopy: WizardCopy = {"
if wizard.count(marker) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: German copy marker not unique")
wizard = wizard.replace(marker, "\n" + fr_copy + marker, 1)
if wizard.count("  fr: enCopy,") != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: French copy mapping not found")
wizard = wizard.replace("  fr: enCopy,", "  fr: frCopy,", 1)

old = '''function isGermanCopy(copy: WizardCopy) {
  return copy === deCopy;
}
'''
new = '''function isFrenchCopy(copy: WizardCopy) {
  return copy === frCopy;
}

function isGermanCopy(copy: WizardCopy) {
  return copy === deCopy;
}
'''
if wizard.count(old) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: German helper not found")
wizard = wizard.replace(old, new, 1)

old = '''function localizeRoomName(name: string, copy: WizardCopy) {
  if (isGermanCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Zimmer $1").replace(/^Apartment\\s+(\\d+)$/i, "Apartment $1");
  }
'''
new = '''function localizeRoomName(name: string, copy: WizardCopy) {
  if (isFrenchCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Chambre $1").replace(/^Apartment\\s+(\\d+)$/i, "Appartement $1");
  }
  if (isGermanCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Zimmer $1").replace(/^Apartment\\s+(\\d+)$/i, "Apartment $1");
  }
'''
if wizard.count(old) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: room name helper not found")
wizard = wizard.replace(old, new, 1)

old = '''function localizeRoomType(type: string, copy: WizardCopy) {
  if (isGermanCopy(copy)) {
'''
new = '''function localizeRoomType(type: string, copy: WizardCopy) {
  if (isFrenchCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Chambre double / triple à l’étage",
      "Ground Floor Double/Triple room": "Chambre double / triple au rez-de-chaussée",
      "Economy double": "Chambre double économique",
      Apartment: "Appartement familial",
    };
    return values[type] || type;
  }
  if (isGermanCopy(copy)) {
'''
if wizard.count(old) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: room type helper not found")
wizard = wizard.replace(old, new, 1)

old = '''function localizeRoomLocation(location: string, copy: WizardCopy) {
  if (isGermanCopy(copy)) {
'''
new = '''function localizeRoomLocation(location: string, copy: WizardCopy) {
  if (isFrenchCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Étage",
      "Ground Floor": "Rez-de-chaussée",
      "Stand Alone": "Unité indépendante",
    };
    return values[location] || location;
  }
  if (isGermanCopy(copy)) {
'''
if wizard.count(old) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: room location helper not found")
wizard = wizard.replace(old, new, 1)

old_tags = '''  const polish = isPolishCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  if (prefs.guests) tags.push({ text: `${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} ${copy.guests}`, good: room.maxGuests >= prefs.guests });
  if (prefs.budget !== undefined) tags.push({ text: room.budget ? (turkish ? "Ekonomik" : "Economy") : (turkish ? "Standart" : "Standard"), good: room.budget === prefs.budget });
  if (prefs.noStairs) tags.push({ text: room.stairs ? (polish ? "Schody" : german ? "Treppen" : turkish ? "Merdiven var" : "Stairs") : (polish ? "Bez schodów" : german ? "Ohne Treppen" : turkish ? "Merdivensiz" : "No stairs"), good: !room.stairs });
  if (prefs.upperView !== undefined) tags.push({ text: prefs.upperView ? (polish ? "Piętro / widok" : german ? "Obergeschoss / Aussicht" : turkish ? "Üst kat / manzara" : "Upper view") : (polish ? "Widok na ogród" : german ? "Gartenblick" : turkish ? "Bahçe manzarası" : "Garden view"), good: prefs.upperView ? room.upperView : room.gardenView });
  if (prefs.kitchen) tags.push({ text: room.fullKitchen ? (polish ? "Pełna kuchnia" : german ? "Küche" : turkish ? "Tam mutfak" : "Full kitchen") : room.kitchenette ? (polish ? "Aneks kuchenny" : german ? "Kochnische" : turkish ? "Mini mutfak" : "Kitchenette") : (polish ? "Bez kuchni" : german ? "Keine Küche" : turkish ? "Mutfak yok" : "No kitchen"), good: room.fullKitchen || room.kitchenette });
'''
new_tags = '''  const polish = isPolishCopy(copy);
  const french = isFrenchCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  if (prefs.guests) tags.push({ text: `${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} ${copy.guests}`, good: room.maxGuests >= prefs.guests });
  if (prefs.budget !== undefined) tags.push({ text: room.budget ? (french ? "Économique" : turkish ? "Ekonomik" : "Economy") : (french ? "Standard" : turkish ? "Standart" : "Standard"), good: room.budget === prefs.budget });
  if (prefs.noStairs) tags.push({ text: room.stairs ? (polish ? "Schody" : french ? "Escaliers" : german ? "Treppen" : turkish ? "Merdiven var" : "Stairs") : (polish ? "Bez schodów" : french ? "Sans escaliers" : german ? "Ohne Treppen" : turkish ? "Merdivensiz" : "No stairs"), good: !room.stairs });
  if (prefs.upperView !== undefined) tags.push({ text: prefs.upperView ? (polish ? "Piętro / widok" : french ? "Étage / vue" : german ? "Obergeschoss / Aussicht" : turkish ? "Üst kat / manzara" : "Upper view") : (polish ? "Widok na ogród" : french ? "Vue jardin" : german ? "Gartenblick" : turkish ? "Bahçe manzarası" : "Garden view"), good: prefs.upperView ? room.upperView : room.gardenView });
  if (prefs.kitchen) tags.push({ text: room.fullKitchen ? (polish ? "Pełna kuchnia" : french ? "Cuisine complète" : german ? "Küche" : turkish ? "Tam mutfak" : "Full kitchen") : room.kitchenette ? (polish ? "Aneks kuchenny" : french ? "Kitchenette" : german ? "Kochnische" : turkish ? "Mini mutfak" : "Kitchenette") : (polish ? "Bez kuchni" : french ? "Sans cuisine" : german ? "Keine Küche" : turkish ? "Mutfak yok" : "No kitchen"), good: room.fullKitchen || room.kitchenette });
'''
if wizard.count(old_tags) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: tags block not found")
wizard = wizard.replace(old_tags, new_tags, 1)

old_intro = '''  const intro = isPolishCopy(copy)
    ? `Dzień dobry! Nazywam się ${lead.firstName} ${lead.lastName} i chcę zapytać o:`
    : isGermanCopy(copy)
      ? `Guten Tag! Ich bin ${lead.firstName} ${lead.lastName} und möchte mich nach folgender Unterkunft erkundigen:`
      : isTurkishCopy(copy)
        ? `Merhaba! Ben ${lead.firstName} ${lead.lastName}. Şu konaklama seçeneği hakkında bilgi almak istiyorum:`
        : `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to ask about:`;
'''
new_intro = '''  const intro = isPolishCopy(copy)
    ? `Dzień dobry! Nazywam się ${lead.firstName} ${lead.lastName} i chcę zapytać o:`
    : isFrenchCopy(copy)
      ? `Bonjour ! Je m’appelle ${lead.firstName} ${lead.lastName} et je souhaite obtenir des informations sur :`
      : isGermanCopy(copy)
        ? `Guten Tag! Ich bin ${lead.firstName} ${lead.lastName} und möchte mich nach folgender Unterkunft erkundigen:`
        : isTurkishCopy(copy)
          ? `Merhaba! Ben ${lead.firstName} ${lead.lastName}. Şu konaklama seçeneği hakkında bilgi almak istiyorum:`
          : `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to ask about:`;
'''
if wizard.count(old_intro) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: WhatsApp intro block not found")
wizard = wizard.replace(old_intro, new_intro, 1)

old_beds = '''  const polish = isPolishCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  const roomName = localizeRoomName(room.name, copy);
  const doubleBed = polish ? "Podwójne" : german ? "Doppelbett" : turkish ? "Çift kişilik" : "Double";
  const singleBed = polish ? "Pojedyncze" : german ? "Einzelbett" : turkish ? "Tek kişilik" : "Single";
  const sofaBed = polish ? "Sofa" : german ? "Schlafsofa" : turkish ? "Çekyat" : "Sofa";
'''
new_beds = '''  const polish = isPolishCopy(copy);
  const french = isFrenchCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  const roomName = localizeRoomName(room.name, copy);
  const doubleBed = polish ? "Podwójne" : french ? "Lit double" : german ? "Doppelbett" : turkish ? "Çift kişilik" : "Double";
  const singleBed = polish ? "Pojedyncze" : french ? "Lit simple" : german ? "Einzelbett" : turkish ? "Tek kişilik" : "Single";
  const sofaBed = polish ? "Sofa" : french ? "Canapé-lit" : german ? "Schlafsofa" : turkish ? "Çekyat" : "Sofa";
'''
if wizard.count(old_beds) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: bed labels block not found")
wizard = wizard.replace(old_beds, new_beds, 1)

old_swipe = '  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isGermanCopy(copy) ? "Wischen" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";'
new_swipe = '  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isFrenchCopy(copy) ? "Balayez" : isGermanCopy(copy) ? "Wischen" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";'
if wizard.count(old_swipe) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: swipe label not found")
wizard = wizard.replace(old_swipe, new_swipe, 1)

write(wizard_path, wizard)
print(f"updated {wizard_path}")


# 2. French room structured-data descriptions must not fall back to English.
schema_path = "content/room-detail-schema.ts"
schema = read(schema_path)
schema_replacements = {
    '"Room 6 is ideal for guests who love nature. Located on the ground floor, it opens directly to the peaceful courtyard and garden.": { tr: "Oda 6 zemin kattadır ve huzurlu avlu ile bahçeye doğrudan açılır." },': '"Room 6 is ideal for guests who love nature. Located on the ground floor, it opens directly to the peaceful courtyard and garden.": { fr: "La chambre 6 est au rez-de-chaussée et s’ouvre directement sur la cour paisible et le jardin.", tr: "Oda 6 zemin kattadır ve huzurlu avlu ile bahçeye doğrudan açılır." },',
    '"Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kambos.": { tr: "Oda 2 üst katta yer alır ve narenciye bahçelerine bakan ortak terasa erişim sunar." },': '"Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kambos.": { fr: "La chambre 2 se trouve au premier étage et donne accès à une terrasse partagée avec vue sur le domaine et les agrumes de Kambos.", tr: "Oda 2 üst katta yer alır ve narenciye bahçelerine bakan ortak terasa erişim sunar." },',
    '"Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection.": { tr: "Oda 5, avlu ve bahçeye doğrudan erişimi olan zemin kat çift / üç kişilik odadır." },': '"Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection.": { fr: "La chambre 5 est une chambre double / triple au rez-de-chaussée avec accès direct à la cour et au jardin, idéale si vous préférez éviter les escaliers.", tr: "Oda 5, avlu ve bahçeye doğrudan erişimi olan zemin kat çift / üç kişilik odadır." },',
    '"Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed.": { tr: "Oda 7, bahçe erişimi ve çekyatlı zemin kat çift / üç kişilik odadır." },': '"Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed.": { fr: "La chambre 7 est une chambre double / triple au rez-de-chaussée avec accès au jardin et un agencement flexible avec canapé-lit.", tr: "Oda 7, bahçe erişimi ve çekyatlı zemin kat çift / üç kişilik odadır." },',
    '"Room 1 is a first-floor room for up to 4 guests, with upper-floor view, private balcony feel and two sleeping spaces without a connecting door.": { tr: "Oda 1 üst katta yer alır ve iki uyku alanıyla 4 kişiye kadar konaklama sunar." },': '"Room 1 is a first-floor room for up to 4 guests, with upper-floor view, private balcony feel and two sleeping spaces without a connecting door.": { fr: "La chambre 1 se trouve au premier étage et accueille jusqu’à 4 personnes, avec vue depuis l’étage, ambiance de balcon privé et deux espaces de couchage sans porte communicante.", tr: "Oda 1 üst katta yer alır ve iki uyku alanıyla 4 kişiye kadar konaklama sunar." },',
    '"Room 3 is a first-floor double / triple room with kitchenette, upper-floor view and access by stairs.": { tr: "Oda 3, mini mutfak ve merdiven erişimi olan üst kat çift / üç kişilik odadır." },': '"Room 3 is a first-floor double / triple room with kitchenette, upper-floor view and access by stairs.": { fr: "La chambre 3 est une chambre double / triple au premier étage avec kitchenette, vue depuis l’étage et accès par escalier.", tr: "Oda 3, mini mutfak ve merdiven erişimi olan üst kat çift / üç kişilik odadır." },',
    '"Room 4 is a first-floor double / triple room with kitchenette, sofa bed and upper-floor view.": { tr: "Oda 4, mini mutfak, çekyat ve üst kat manzarası sunan çift / üç kişilik odadır." },': '"Room 4 is a first-floor double / triple room with kitchenette, sofa bed and upper-floor view.": { fr: "La chambre 4 est une chambre double / triple au premier étage avec kitchenette, canapé-lit et vue depuis l’étage.", tr: "Oda 4, mini mutfak, çekyat ve üst kat manzarası sunan çift / üç kişilik odadır." },',
    '"Apartment 8 is a family apartment with living room and kitchen, separate bedroom and bathroom. It is suitable for up to 4 guests.": { tr: "Daire 8, mutfaklı oturma alanı, ayrı yatak odası ve banyoya sahiptir; 4 kişiye kadar uygundur." },': '"Apartment 8 is a family apartment with living room and kitchen, separate bedroom and bathroom. It is suitable for up to 4 guests.": { fr: "L’appartement 8 est un appartement familial avec salon et cuisine, chambre séparée et salle de bain, adapté à un séjour jusqu’à 4 personnes.", tr: "Daire 8, mutfaklı oturma alanı, ayrı yatak odası ve banyoya sahiptir; 4 kişiye kadar uygundur." },',
    '"Apartment 9 offers the same family-friendly layout with kitchen, living area, bedroom and bathroom, suitable for up to 4 guests.": { tr: "Daire 9, mutfak, oturma alanı, yatak odası ve banyodan oluşan aile dostu bir düzene sahiptir; 4 kişiye kadar uygundur." },': '"Apartment 9 offers the same family-friendly layout with kitchen, living area, bedroom and bathroom, suitable for up to 4 guests.": { fr: "L’appartement 9 offre un agencement adapté aux familles avec cuisine, salon, chambre et salle de bain, pour jusqu’à 4 personnes.", tr: "Daire 9, mutfak, oturma alanı, yatak odası ve banyodan oluşan aile dostu bir düzene sahiptir; 4 kişiye kadar uygundur." },',
    '"Apartment 10 is a family apartment with living room and kitchen, bedroom and flexible sofa-bed layout.": { tr: "Daire 10, mutfaklı oturma alanı, yatak odası ve esnek çekyat düzenine sahip bir aile dairesidir." },': '"Apartment 10 is a family apartment with living room and kitchen, bedroom and flexible sofa-bed layout.": { fr: "L’appartement 10 est un appartement familial avec salon et cuisine, chambre et agencement flexible avec canapés-lits.", tr: "Daire 10, mutfaklı oturma alanı, yatak odası ve esnek çekyat düzenine sahip bir aile dairesidir." },',
}
for old, new in schema_replacements.items():
    count = schema.count(old)
    if count != 1:
        raise RuntimeError(f"{schema_path}: schema description match count {count}: {old[:100]!r}")
    schema = schema.replace(old, new, 1)
write(schema_path, schema)
print(f"updated {schema_path}")


# 3. French homepage: remove inherited English labels while keeping the hotel keyword in SEO/supporting copy.
home_path = "content/home.ts"
home = read(home_path)
home_replacements = [
    ('    title: "Hôtel et appartements à Chios, au cœur de Kambos",', '    title: "Chambres et appartements à Chios, au cœur de Kambos",'),
    ('          title: "🧭 Room Wizard",\n          text: "Un assistant pratique pour trouver la chambre la plus adaptée à votre voyage.",', '          title: "🧭 Trouver votre chambre",\n          text: "Un assistant pratique pour trouver la chambre la plus adaptée à votre voyage.",'),
    ('      badge: "Offre live • Recevez votre code",', '      badge: "Offre en direct • Recevez votre code",'),
    ('      label: "Room Wizard",\n      href: "/fr/chambres-a-chios/",', '      label: "Trouver votre chambre",\n      href: "/fr/chambres-a-chios/",'),
    ('        meta: ["👤 ×4", "Espace", "🏡 Apt"],', '        meta: ["👤 ×4", "Espace", "🏡 Appartement"],'),
    ('      liveLabel: "Code réduction live",', '      liveLabel: "Code de réduction en direct",'),
]
for old, new in home_replacements:
    count = home.count(old)
    if count != 1:
        raise RuntimeError(f"{home_path}: homepage replacement matched {count}: {old[:100]!r}")
    home = home.replace(old, new, 1)

# Add a French live badge to each of the four French room cards.
for title in ["Chambre double économique", "Chambres rez-de-chaussée", "Chambres à l’étage", "Appartement familial"]:
    old = f'        title: "{title}",\n'
    new = f'        title: "{title}",\n        liveBadge: "EN DIRECT",\n'
    count = home.count(old)
    if count != 1:
        raise RuntimeError(f"{home_path}: French room title match count {count}: {title}")
    home = home.replace(old, new, 1)
write(home_path, home)
print(f"updated {home_path}")


# 4. Make DiscountReveal SSR language-safe by passing the locale from the page data instead of detecting it after hydration.
discount_path = "components/home/DiscountReveal.tsx"
discount = read(discount_path)
old_props = '''type DiscountRevealProps = {
  submitLabel: string;
  successText: string;
  code: string;
};
'''
new_props = '''type DiscountRevealProps = {
  submitLabel: string;
  successText: string;
  code: string;
  locale?: Locale;
};
'''
if discount.count(old_props) != 1:
    raise RuntimeError("DiscountReveal.tsx: props block not found")
discount = discount.replace(old_props, new_props, 1)
start = discount.find("function getLocaleFromPath(): Locale {")
end = discount.find("\nexport function DiscountReveal", start)
if start == -1 or end == -1:
    raise RuntimeError("DiscountReveal.tsx: getLocaleFromPath block not found")
discount = discount[:start] + discount[end + 1:]
old_fn = '''export function DiscountReveal({ successText, code }: DiscountRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const checkCounterRef = useRef(0);

  const [isRevealed, setIsRevealed] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(getLocaleFromPath());
  }, []);

  const text = COPY[locale];
'''
new_fn = '''export function DiscountReveal({ successText, code, locale = "en" }: DiscountRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const checkCounterRef = useRef(0);

  const [isRevealed, setIsRevealed] = useState(false);
  const text = COPY[locale];
'''
if discount.count(old_fn) != 1:
    raise RuntimeError("DiscountReveal.tsx: component state block not found")
discount = discount.replace(old_fn, new_fn, 1)
write(discount_path, discount)
print(f"updated {discount_path}")

home_component_path = "components/home/HomePageTailwind.tsx"
home_component = read(home_component_path)
old_direct = '''function DirectBookingBox({ data }: { data: HomePageData }) {
  return (
'''
new_direct = '''function DirectBookingBox({ data }: { data: HomePageData }) {
  const locale = getLocale(data.seo.canonicalPath);

  return (
'''
if home_component.count(old_direct) != 1:
    raise RuntimeError("HomePageTailwind.tsx: DirectBookingBox start not found")
home_component = home_component.replace(old_direct, new_direct, 1)
old_discount_call = '<DiscountReveal submitLabel={data.location.discount.submitLabel} successText={data.location.discount.successText} code={data.location.discount.defaultCode || "WELCOME10"} />'
new_discount_call = '<DiscountReveal submitLabel={data.location.discount.submitLabel} successText={data.location.discount.successText} code={data.location.discount.defaultCode || "WELCOME10"} locale={locale} />'
if home_component.count(old_discount_call) != 1:
    raise RuntimeError("HomePageTailwind.tsx: DiscountReveal call not found")
home_component = home_component.replace(old_discount_call, new_discount_call, 1)
write(home_component_path, home_component)
print(f"updated {home_component_path}")


# 5. French footer shared microcopy and accessibility label.
replace_once(
    "components/VoulamandisFooterTailwind.tsx",
    '  const locationLabel = language === "tr" ? "Kambos, Sakız Adası" : language === "el" ? "Κάμπος, Χίος" : language === "de" ? "Kambos, Chios" : "Kampos, Chios";\n'
    '  const footerTagline = language === "tr" ? "Sakız Adası odaları & daireleri · Doğrudan konaklama" : language === "el" ? "Δωμάτια & διαμερίσματα στη Χίο · Απευθείας διαμονή" : language === "de" ? "Zimmer & Apartments auf Chios · Direkt buchen" : "Chios rooms & apartments · Direct stay";\n'
    '  const footerNavLabel = language === "tr" ? "Alt bilgi menüsü" : language === "el" ? "Πλοήγηση υποσέλιδου" : language === "de" ? "Fußzeilennavigation" : "Footer navigation";',
    '  const locationLabel = language === "tr" ? "Kambos, Sakız Adası" : language === "el" ? "Κάμπος, Χίος" : language === "fr" ? "Kambos, Chios" : language === "de" ? "Kambos, Chios" : "Kampos, Chios";\n'
    '  const footerTagline = language === "tr" ? "Sakız Adası odaları & daireleri · Doğrudan konaklama" : language === "el" ? "Δωμάτια & διαμερίσματα στη Χίο · Απευθείας διαμονή" : language === "fr" ? "Chambres & appartements à Chios · Réservation directe" : language === "de" ? "Zimmer & Apartments auf Chios · Direkt buchen" : "Chios rooms & apartments · Direct stay";\n'
    '  const footerNavLabel = language === "tr" ? "Alt bilgi menüsü" : language === "el" ? "Πλοήγηση υποσέλιδου" : language === "fr" ? "Navigation du pied de page" : language === "de" ? "Fußzeilennavigation" : "Footer navigation";',
)


# 6. French rooms landing copy.
replace_once(
    "components/rooms/RoomsCategoryPage.tsx",
    '    "economy-double": "Voir les economy double rooms",',
    '    "economy-double": "Voir les chambres doubles économiques",',
)
replace_once(
    "content/rooms.ts",
    '        "Le meilleur choix value pour 2 personnes. Chambres rénovées de 16m² avec les essentiels et une atmosphère paisible à Kambos.",',
    '        "Le meilleur rapport qualité-prix pour 2 personnes. Chambres rénovées de 16m² avec les essentiels et une atmosphère paisible à Kambos.",',
)


# 7. French room-card captions used to generate visible captions and localized image alts.
room_detail_path = "components/rooms/RoomDetailPage.tsx"
room_detail = read(room_detail_path)
caption_replacements = {
    '  Layout: { tr: "Yerleşim" },': '  Layout: { fr: "Disposition", tr: "Yerleşim" },',
    '  Detail: { tr: "Detay" },': '  Detail: { fr: "Détail", tr: "Detay" },',
    '  Desk: { tr: "Çalışma masası" },': '  Desk: { fr: "Bureau", tr: "Çalışma masası" },',
    '  "Traditional interior": { tr: "Geleneksel iç mekân" },': '  "Traditional interior": { fr: "Intérieur traditionnel", tr: "Geleneksel iç mekân" },',
    '  "Courtyard access": { tr: "Avlu erişimi" },': '  "Courtyard access": { fr: "Accès à la cour", tr: "Avlu erişimi" },',
    '  "Room layout": { tr: "Oda düzeni" },': '  "Room layout": { fr: "Agencement de la chambre", tr: "Oda düzeni" },',
    '  "Stone wall interior": { tr: "Taş duvarlı iç mekân" },': '  "Stone wall interior": { fr: "Intérieur avec mur en pierre", tr: "Taş duvarlı iç mekân" },',
    '  "Stone bathroom details": { tr: "Taş banyo detayları" },': '  "Stone bathroom details": { fr: "Détails en pierre de la salle de bain", tr: "Taş banyo detayları" },',
    '  "Spacious layout": { tr: "Geniş yerleşim" },': '  "Spacious layout": { fr: "Agencement spacieux", tr: "Geniş yerleşim" },',
    '  "Traditional details": { tr: "Geleneksel detaylar" },': '  "Traditional details": { fr: "Détails traditionnels", tr: "Geleneksel detaylar" },',
}
for old, new in caption_replacements.items():
    count = room_detail.count(old)
    if count != 1:
        raise RuntimeError(f"{room_detail_path}: caption term match count {count}: {old}")
    room_detail = room_detail.replace(old, new, 1)

# Add missing English captions used by standard rooms.
anchor = '  "Traditional details": { fr: "Détails traditionnels", tr: "Geleneksel detaylar" },\n'
extra = (
    anchor
    + '  "Terrace access": { fr: "Accès à la terrasse" },\n'
    + '  "Kitchenette area": { fr: "Espace kitchenette" },\n'
    + '  "Traditional decoration": { fr: "Décoration traditionnelle" },\n'
    + '  "Balcony view": { fr: "Vue depuis le balcon" },\n'
)
if room_detail.count(anchor) != 1:
    raise RuntimeError("RoomDetailPage.tsx: translated caption anchor not unique")
room_detail = room_detail.replace(anchor, extra, 1)
write(room_detail_path, room_detail)
print(f"updated {room_detail_path}")


# 8. Contact page H1 alignment for branded French sitelinks.
replace_once(
    "components/contact/ContactPage.tsx",
    '  el: "Επικοινωνία με το Voulamandis House στη Χίο",\n  de: "Kontakt zum Voulamandis House auf Chios",',
    '  el: "Επικοινωνία με το Voulamandis House στη Χίο",\n  fr: "Contactez Voulamandis House à Chios",\n  de: "Kontakt zum Voulamandis House auf Chios",',
)


# 9. Keep the legacy LastMinute component French-safe in case it is reused.
legacy_deals_path = "components/home/LastMinuteDeals.tsx"
legacy = read(legacy_deals_path)
legacy_fr_names = {
    '{ id: 1, displayName: "Room 1", type: "Chambre Double / Triple à l’étage", location: "Étage" }': '{ id: 1, displayName: "Chambre 1", type: "Chambre Double / Triple à l’étage", location: "Étage" }',
    '{ id: 2, displayName: "Room 2", type: "Chambre Double Économique", location: "Étage" }': '{ id: 2, displayName: "Chambre 2", type: "Chambre Double Économique", location: "Étage" }',
    '{ id: 3, displayName: "Room 3", type: "Chambre Double / Triple à l’étage", location: "Étage" }': '{ id: 3, displayName: "Chambre 3", type: "Chambre Double / Triple à l’étage", location: "Étage" }',
    '{ id: 4, displayName: "Room 4", type: "Chambre Double / Triple à l’étage", location: "Étage" }': '{ id: 4, displayName: "Chambre 4", type: "Chambre Double / Triple à l’étage", location: "Étage" }',
    '{ id: 5, displayName: "Room 5", type: "Chambre Double / Triple au rez-de-chaussée", location: "Rez-de-chaussée" }': '{ id: 5, displayName: "Chambre 5", type: "Chambre Double / Triple au rez-de-chaussée", location: "Rez-de-chaussée" }',
    '{ id: 6, displayName: "Room 6", type: "Chambre Double Économique", location: "Rez-de-chaussée" }': '{ id: 6, displayName: "Chambre 6", type: "Chambre Double Économique", location: "Rez-de-chaussée" }',
    '{ id: 7, displayName: "Room 7", type: "Chambre Double / Triple au rez-de-chaussée", location: "Rez-de-chaussée" }': '{ id: 7, displayName: "Chambre 7", type: "Chambre Double / Triple au rez-de-chaussée", location: "Rez-de-chaussée" }',
    '{ id: 8, displayName: "Apartment 8", type: "Appartement", location: "Indépendant" }': '{ id: 8, displayName: "Appartement 8", type: "Appartement", location: "Indépendant" }',
    '{ id: 9, displayName: "Apartment 9", type: "Appartement", location: "Indépendant" }': '{ id: 9, displayName: "Appartement 9", type: "Appartement", location: "Indépendant" }',
    '{ id: 10, displayName: "Apartment 10", type: "Appartement", location: "Indépendant" }': '{ id: 10, displayName: "Appartement 10", type: "Appartement", location: "Indépendant" }',
}
for old, new in legacy_fr_names.items():
    count = legacy.count(old)
    if count != 1:
        raise RuntimeError(f"{legacy_deals_path}: legacy French room name match count {count}: {old}")
    legacy = legacy.replace(old, new, 1)
write(legacy_deals_path, legacy)
print(f"updated {legacy_deals_path}")


# 10. Targeted assertions: no known French language-signal regressions.
assert "fr: frCopy" in read(wizard_path)
assert "fr: enCopy" not in read(wizard_path)
assert "Trouvez la chambre qui vous convient" in read(wizard_path)
assert "Contactez Voulamandis House à Chios" in read("components/contact/ContactPage.tsx")
assert "Voir les chambres doubles économiques" in read("components/rooms/RoomsCategoryPage.tsx")
assert "Le meilleur rapport qualité-prix pour 2 personnes" in read("content/rooms.ts")
assert "Chambres & appartements à Chios · Réservation directe" in read("components/VoulamandisFooterTailwind.tsx")
assert 'title: "Chambres et appartements à Chios, au cœur de Kambos"' in read(home_path)
assert "🧭 Room Wizard" not in read(home_path).split("export const homePageFr: HomePageData =", 1)[1].split("export const homePageDe: HomePageData =", 1)[0]
assert "🏡 Apt" not in read(home_path).split("export const homePageFr: HomePageData =", 1)[1].split("export const homePageDe: HomePageData =", 1)[0]
assert "getLocaleFromPath" not in read(discount_path)
assert "locale={locale}" in read(home_component_path)
assert '"Room layout": { fr: "Agencement de la chambre"' in read(room_detail_path)
assert '"Apartment 10 is a family apartment with living room and kitchen, bedroom and flexible sofa-bed layout.": { fr:' in read(schema_path)

print("French SEO and language cleanup patch completed successfully")
