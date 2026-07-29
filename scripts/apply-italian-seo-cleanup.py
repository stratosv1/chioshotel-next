from pathlib import Path
import re


def read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8-sig")


def write(path: str, text: str) -> None:
    Path(path).write_text(text, encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected 1 match, found {count}: {old[:140]!r}")
    write(path, text.replace(old, new, 1))
    print(f"updated {path}")


def replace_count(path: str, old: str, new: str, expected: int) -> None:
    text = read(path)
    count = text.count(old)
    if count != expected:
        raise RuntimeError(f"{path}: expected {expected} matches, found {count}: {old[:140]!r}")
    write(path, text.replace(old, new))
    print(f"updated {path} ({expected} replacements)")


def replace_section(path: str, start: str, end: str, replacements: list[tuple[str, str, int]]) -> None:
    text = read(path)
    start_i = text.find(start)
    end_i = text.find(end, start_i + len(start))
    if start_i < 0 or end_i < 0:
        raise RuntimeError(f"{path}: section markers not found")
    section = text[start_i:end_i]
    for old, new, expected in replacements:
        count = section.count(old)
        if count != expected:
            raise RuntimeError(f"{path}: section expected {expected}, found {count}: {old!r}")
        section = section.replace(old, new)
    write(path, text[:start_i] + section + text[end_i:])
    print(f"updated section in {path}")


# 1) Italian Room Wizard: dedicated copy and result-card language purity.
wizard_path = "components/rooms/RoomWizardTailwind.tsx"
wizard = read(wizard_path)
marker = "\nconst trCopy: WizardCopy = {"
if wizard.count(marker) != 1:
    raise RuntimeError("RoomWizardTailwind: Turkish copy marker not unique")

it_copy = '''
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
'''
wizard = wizard.replace(marker, "\n" + it_copy + marker, 1)
if wizard.count("  it: enCopy,") != 1:
    raise RuntimeError("RoomWizardTailwind: it: enCopy mapping missing")
wizard = wizard.replace("  it: enCopy,", "  it: itCopy,", 1)

old_helpers = '''function isFrenchCopy(copy: WizardCopy) {
  return copy === frCopy;
}

function isGermanCopy(copy: WizardCopy) {
  return copy === deCopy;
}
'''
new_helpers = '''function isFrenchCopy(copy: WizardCopy) {
  return copy === frCopy;
}

function isItalianCopy(copy: WizardCopy) {
  return copy === itCopy;
}

function isGermanCopy(copy: WizardCopy) {
  return copy === deCopy;
}
'''
if wizard.count(old_helpers) != 1:
    raise RuntimeError("RoomWizardTailwind: helper insertion point missing")
wizard = wizard.replace(old_helpers, new_helpers, 1)

old_name = '''function localizeRoomName(name: string, copy: WizardCopy) {
  if (isFrenchCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Chambre $1").replace(/^Apartment\\s+(\\d+)$/i, "Appartement $1");
  }
  if (isGermanCopy(copy)) {
'''
new_name = '''function localizeRoomName(name: string, copy: WizardCopy) {
  if (isFrenchCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Chambre $1").replace(/^Apartment\\s+(\\d+)$/i, "Appartement $1");
  }
  if (isItalianCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Camera $1").replace(/^Apartment\\s+(\\d+)$/i, "Appartamento $1");
  }
  if (isGermanCopy(copy)) {
'''
if wizard.count(old_name) != 1:
    raise RuntimeError("RoomWizardTailwind: room-name block missing")
wizard = wizard.replace(old_name, new_name, 1)

old_type = '''  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Doppel-/Dreibettzimmer im Obergeschoss",
'''
new_type = '''  if (isItalianCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Camera doppia / tripla al primo piano",
      "Ground Floor Double/Triple room": "Camera doppia / tripla al piano terra",
      "Economy double": "Camera doppia economy",
      Apartment: "Appartamento familiare",
    };
    return values[type] || type;
  }
  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Doppel-/Dreibettzimmer im Obergeschoss",
'''
if wizard.count(old_type) != 1:
    raise RuntimeError("RoomWizardTailwind: room-type German marker missing")
wizard = wizard.replace(old_type, new_type, 1)

old_location = '''  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Obergeschoss",
'''
new_location = '''  if (isItalianCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Primo piano",
      "Ground Floor": "Piano terra",
      "Stand Alone": "Unità indipendente",
    };
    return values[location] || location;
  }
  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Obergeschoss",
'''
if wizard.count(old_location) != 1:
    raise RuntimeError("RoomWizardTailwind: room-location German marker missing")
wizard = wizard.replace(old_location, new_location, 1)

old_tags = '''  const polish = isPolishCopy(copy);
  const french = isFrenchCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  if (prefs.guests) tags.push({ text: `${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} ${copy.guests}`, good: room.maxGuests >= prefs.guests });
  if (prefs.budget !== undefined) tags.push({ text: room.budget ? (french ? "Économique" : turkish ? "Ekonomik" : "Economy") : (french ? "Standard" : turkish ? "Standart" : "Standard"), good: room.budget === prefs.budget });
  if (prefs.noStairs) tags.push({ text: room.stairs ? (polish ? "Schody" : french ? "Escaliers" : german ? "Treppen" : turkish ? "Merdiven var" : "Stairs") : (polish ? "Bez schodów" : french ? "Sans escaliers" : german ? "Ohne Treppen" : turkish ? "Merdivensiz" : "No stairs"), good: !room.stairs });
  if (prefs.upperView !== undefined) tags.push({ text: prefs.upperView ? (polish ? "Piętro / widok" : french ? "Étage / vue" : german ? "Obergeschoss / Aussicht" : turkish ? "Üst kat / manzara" : "Upper view") : (polish ? "Widok na ogród" : french ? "Vue jardin" : german ? "Gartenblick" : turkish ? "Bahçe manzarası" : "Garden view"), good: prefs.upperView ? room.upperView : room.gardenView });
  if (prefs.kitchen) tags.push({ text: room.fullKitchen ? (polish ? "Pełna kuchnia" : french ? "Cuisine complète" : german ? "Küche" : turkish ? "Tam mutfak" : "Full kitchen") : room.kitchenette ? (polish ? "Aneks kuchenny" : french ? "Kitchenette" : german ? "Kochnische" : turkish ? "Mini mutfak" : "Kitchenette") : (polish ? "Bez kuchni" : french ? "Sans cuisine" : german ? "Keine Küche" : turkish ? "Mutfak yok" : "No kitchen"), good: room.fullKitchen || room.kitchenette });
'''
new_tags = '''  const polish = isPolishCopy(copy);
  const french = isFrenchCopy(copy);
  const italian = isItalianCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  if (prefs.guests) tags.push({ text: `${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} ${copy.guests}`, good: room.maxGuests >= prefs.guests });
  if (prefs.budget !== undefined) tags.push({ text: room.budget ? (french ? "Économique" : turkish ? "Ekonomik" : "Economy") : (french ? "Standard" : turkish ? "Standart" : "Standard"), good: room.budget === prefs.budget });
  if (prefs.noStairs) tags.push({ text: room.stairs ? (polish ? "Schody" : french ? "Escaliers" : italian ? "Scale" : german ? "Treppen" : turkish ? "Merdiven var" : "Stairs") : (polish ? "Bez schodów" : french ? "Sans escaliers" : italian ? "Senza scale" : german ? "Ohne Treppen" : turkish ? "Merdivensiz" : "No stairs"), good: !room.stairs });
  if (prefs.upperView !== undefined) tags.push({ text: prefs.upperView ? (polish ? "Piętro / widok" : french ? "Étage / vue" : italian ? "Piano superiore / vista" : german ? "Obergeschoss / Aussicht" : turkish ? "Üst kat / manzara" : "Upper view") : (polish ? "Widok na ogród" : french ? "Vue jardin" : italian ? "Vista giardino" : german ? "Gartenblick" : turkish ? "Bahçe manzarası" : "Garden view"), good: prefs.upperView ? room.upperView : room.gardenView });
  if (prefs.kitchen) tags.push({ text: room.fullKitchen ? (polish ? "Pełna kuchnia" : french ? "Cuisine complète" : italian ? "Cucina completa" : german ? "Küche" : turkish ? "Tam mutfak" : "Full kitchen") : room.kitchenette ? (polish ? "Aneks kuchenny" : french ? "Kitchenette" : italian ? "Angolo cottura" : german ? "Kochnische" : turkish ? "Mini mutfak" : "Kitchenette") : (polish ? "Bez kuchni" : french ? "Sans cuisine" : italian ? "Senza cucina" : german ? "Keine Küche" : turkish ? "Mutfak yok" : "No kitchen"), good: room.fullKitchen || room.kitchenette });
'''
if wizard.count(old_tags) != 1:
    raise RuntimeError("RoomWizardTailwind: tags block missing")
wizard = wizard.replace(old_tags, new_tags, 1)

old_whatsapp = '''    : isFrenchCopy(copy)
      ? `Bonjour ! Je m’appelle ${lead.firstName} ${lead.lastName} et je souhaite obtenir des informations sur :`
      : isGermanCopy(copy)
        ? `Guten Tag! Ich bin ${lead.firstName} ${lead.lastName} und möchte mich nach folgender Unterkunft erkundigen:`
'''
new_whatsapp = '''    : isFrenchCopy(copy)
      ? `Bonjour ! Je m’appelle ${lead.firstName} ${lead.lastName} et je souhaite obtenir des informations sur :`
      : isItalianCopy(copy)
        ? `Ciao! Mi chiamo ${lead.firstName} ${lead.lastName} e vorrei informazioni su:`
        : isGermanCopy(copy)
          ? `Guten Tag! Ich bin ${lead.firstName} ${lead.lastName} und möchte mich nach folgender Unterkunft erkundigen:`
'''
if wizard.count(old_whatsapp) != 1:
    raise RuntimeError("RoomWizardTailwind: WhatsApp chain missing")
wizard = wizard.replace(old_whatsapp, new_whatsapp, 1)
# The Italian branch adds one nesting level, so indent the following Turkish/English fallback branch.
wizard = wizard.replace(
'''        : isTurkishCopy(copy)
          ? `Merhaba! Ben ${lead.firstName} ${lead.lastName}. Şu konaklama seçeneği hakkında bilgi almak istiyorum:`
          : `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to ask about:`;''',
'''          : isTurkishCopy(copy)
            ? `Merhaba! Ben ${lead.firstName} ${lead.lastName}. Şu konaklama seçeneği hakkında bilgi almak istiyorum:`
            : `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to ask about:`;''',
1,
)

old_photo = '  const photoLabel = isPolishCopy(copy) ? "zdjęcie" : isGermanCopy(copy) ? "Foto" : isTurkishCopy(copy) ? "fotoğraf" : "photo";'
new_photo = '  const photoLabel = isPolishCopy(copy) ? "zdjęcie" : isItalianCopy(copy) ? "foto" : isGermanCopy(copy) ? "Foto" : isTurkishCopy(copy) ? "fotoğraf" : "photo";'
if wizard.count(old_photo) != 1:
    raise RuntimeError("RoomWizardTailwind: photo label missing")
wizard = wizard.replace(old_photo, new_photo, 1)

old_beds = '''  const polish = isPolishCopy(copy);
  const french = isFrenchCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  const roomName = localizeRoomName(room.name, copy);
  const doubleBed = polish ? "Podwójne" : french ? "Lit double" : german ? "Doppelbett" : turkish ? "Çift kişilik" : "Double";
  const singleBed = polish ? "Pojedyncze" : french ? "Lit simple" : german ? "Einzelbett" : turkish ? "Tek kişilik" : "Single";
  const sofaBed = polish ? "Sofa" : french ? "Canapé-lit" : german ? "Schlafsofa" : turkish ? "Çekyat" : "Sofa";
'''
new_beds = '''  const polish = isPolishCopy(copy);
  const french = isFrenchCopy(copy);
  const italian = isItalianCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  const roomName = localizeRoomName(room.name, copy);
  const doubleBed = polish ? "Podwójne" : french ? "Lit double" : italian ? "Letto matrimoniale" : german ? "Doppelbett" : turkish ? "Çift kişilik" : "Double";
  const singleBed = polish ? "Pojedyncze" : french ? "Lit simple" : italian ? "Letto singolo" : german ? "Einzelbett" : turkish ? "Tek kişilik" : "Single";
  const sofaBed = polish ? "Sofa" : french ? "Canapé-lit" : italian ? "Divano letto" : german ? "Schlafsofa" : turkish ? "Çekyat" : "Sofa";
'''
if wizard.count(old_beds) != 1:
    raise RuntimeError("RoomWizardTailwind: bed block missing")
wizard = wizard.replace(old_beds, new_beds, 1)

old_swipe = '  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isGermanCopy(copy) ? "Wischen" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";'
new_swipe = '  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isItalianCopy(copy) ? "Scorri" : isGermanCopy(copy) ? "Wischen" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";'
if wizard.count(old_swipe) != 1:
    raise RuntimeError("RoomWizardTailwind: swipe label missing")
wizard = wizard.replace(old_swipe, new_swipe, 1)
write(wizard_path, wizard)
print(f"updated {wizard_path}")

# 2) Canonical breadcrumb parent for Italian room details.
replace_once(
    "content/room-detail-schema.ts",
    '    roomsBreadcrumbPath: "/it/stanze-a-chios/",',
    '    roomsBreadcrumbPath: "/it/camere-a-chios/",',
)

# 3) Add Italian full room descriptions to JSON-LD localization.
schema_path = "content/room-detail-schema.ts"
schema = read(schema_path)
schema_translations = {
    "Room 6 is ideal for guests who love nature. Located on the ground floor, it opens directly to the peaceful courtyard and garden.": "La camera 6 è al piano terra e si apre direttamente sul cortile tranquillo e sul giardino.",
    "Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kambos.": "La camera 2 si trova al primo piano e offre accesso a una terrazza condivisa con vista sulla tenuta e sugli agrumeti di Kambos.",
    "Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection.": "La camera 5 è una doppia / tripla al piano terra con accesso diretto al cortile e al giardino, ideale per chi preferisce evitare le scale.",
    "Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed.": "La camera 7 è una doppia / tripla al piano terra con accesso al giardino e una disposizione flessibile con divano letto.",
    "Room 1 is a first-floor room for up to 4 guests, with upper-floor view, private balcony feel and two sleeping spaces without a connecting door.": "La camera 1 si trova al primo piano e ospita fino a 4 persone, con vista dal piano superiore e due zone notte senza porta comunicante.",
    "Room 3 is a first-floor double / triple room with kitchenette, upper-floor view and access by stairs.": "La camera 3 è una doppia / tripla al primo piano con angolo cottura, vista dal piano superiore e accesso tramite scale.",
    "Room 4 is a first-floor double / triple room with kitchenette, sofa bed and upper-floor view.": "La camera 4 è una doppia / tripla al primo piano con angolo cottura, divano letto e vista dal piano superiore.",
    "Apartment 8 is a family apartment with living room and kitchen, separate bedroom and bathroom. It is suitable for up to 4 guests.": "L’appartamento 8 è una soluzione familiare con soggiorno e cucina, camera separata e bagno, adatta fino a 4 ospiti.",
    "Apartment 9 offers the same family-friendly layout with kitchen, living area, bedroom and bathroom, suitable for up to 4 guests.": "L’appartamento 9 offre una disposizione adatta alle famiglie con cucina, soggiorno, camera e bagno, fino a 4 ospiti.",
    "Apartment 10 is a family apartment with living room and kitchen, bedroom and flexible sofa-bed layout.": "L’appartamento 10 è una soluzione familiare con soggiorno e cucina, camera e una disposizione flessibile con divani letto.",
}
for source, italian in schema_translations.items():
    pattern = re.compile(r'(^\s*"' + re.escape(source) + r'": \{\s*fr: "([^"]*)",\s*tr: "([^"]*)"\s*\},?$)', re.MULTILINE)
    match = pattern.search(schema)
    if not match:
        raise RuntimeError(f"Schema description entry not found for: {source[:60]}")
    old_line = match.group(1)
    # Preserve indentation and trailing comma.
    indent = re.match(r'^(\s*)', old_line).group(1)
    trailing = "," if old_line.rstrip().endswith("},") else ""
    fr = match.group(2)
    tr = match.group(3)
    new_line = f'{indent}"{source}": {{ fr: "{fr}", it: "{italian}", tr: "{tr}" }}{trailing}'
    schema = schema.replace(old_line, new_line, 1)
write(schema_path, schema)
print(f"updated {schema_path} descriptions")

# 4) Homepage: semantic H1 + Italian-only visible labels.
replace_section(
    "content/home.ts",
    "export const homePageIt: HomePageData = {",
    "export const homePageEs: HomePageData = {",
    [
        ('title: "Hotel e appartamenti a Chios, nel cuore di Kambos"', 'title: "Camere e appartamenti a Chios, nel cuore di Kambos"', 1),
        ('imageAlt: "Hotel e appartamenti a Chios - Voulamandis House a Kambos"', 'imageAlt: "Camere e appartamenti a Chios - Voulamandis House a Kambos"', 1),
        ('title: "🧭 Room Wizard"', 'title: "🧭 Trova la tua camera"', 1),
        ('label: "Room Wizard"', 'label: "Trova la tua camera"', 1),
        ('liveLabel: "Codice sconto live"', 'liveLabel: "Codice sconto in diretta"', 1),
        ('badge: "Offerta live • Ricevi il codice"', 'badge: "Offerta in diretta • Ricevi il codice"', 1),
        ('meta: ["👤 ×4", "Spazio", "🏡 Apt"]', 'meta: ["👤 ×4", "Spazio", "🏡 Appartamento"]', 1),
        ('label: "Prenota diretto"', 'label: "Prenota direttamente"', 1),
        ('directBadge: "🎁 -10% Sconto",', 'directBadge: "🎁 -10% Sconto",\n        liveBadge: "IN DIRETTA",', 4),
    ],
)

# 5) Footer shared Italian strings.
replace_once(
    "components/VoulamandisFooterTailwind.tsx",
    '  const locationLabel = language === "tr" ? "Kambos, Sakız Adası" : language === "el" ? "Κάμπος, Χίος" : language === "fr" ? "Kambos, Chios" : language === "de" ? "Kambos, Chios" : "Kampos, Chios";\n'
    '  const footerTagline = language === "tr" ? "Sakız Adası odaları & daireleri · Doğrudan konaklama" : language === "el" ? "Δωμάτια & διαμερίσματα στη Χίο · Απευθείας διαμονή" : language === "fr" ? "Chambres & appartements à Chios · Réservation directe" : language === "de" ? "Zimmer & Apartments auf Chios · Direkt buchen" : "Chios rooms & apartments · Direct stay";\n'
    '  const footerNavLabel = language === "tr" ? "Alt bilgi menüsü" : language === "el" ? "Πλοήγηση υποσέλιδου" : language === "fr" ? "Navigation du pied de page" : language === "de" ? "Fußzeilennavigation" : "Footer navigation";',
    '  const locationLabel = language === "tr" ? "Kambos, Sakız Adası" : language === "el" ? "Κάμπος, Χίος" : language === "fr" ? "Kambos, Chios" : language === "de" ? "Kambos, Chios" : language === "it" ? "Kambos, Chios" : "Kampos, Chios";\n'
    '  const footerTagline = language === "tr" ? "Sakız Adası odaları & daireleri · Doğrudan konaklama" : language === "el" ? "Δωμάτια & διαμερίσματα στη Χίο · Απευθείας διαμονή" : language === "fr" ? "Chambres & appartements à Chios · Réservation directe" : language === "de" ? "Zimmer & Apartments auf Chios · Direkt buchen" : language === "it" ? "Camere & appartamenti a Chios · Prenotazione diretta" : "Chios rooms & apartments · Direct stay";\n'
    '  const footerNavLabel = language === "tr" ? "Alt bilgi menüsü" : language === "el" ? "Πλοήγηση υποσέλιδου" : language === "fr" ? "Navigation du pied de page" : language === "de" ? "Fußzeilennavigation" : language === "it" ? "Navigazione a piè di pagina" : "Footer navigation";',
)

# 6) Rooms hub CTA and intro copy.
replace_once(
    "components/rooms/RoomsCategoryPage.tsx",
    '    "economy-double": "Vedi economy double rooms",',
    '    "economy-double": "Vedi le camere doppie economiche",',
)
replace_section(
    "content/rooms.ts",
    "export const roomsCategoryIt: RoomsCategoryPageData = {",
    "export const roomsCategoryEs: RoomsCategoryPageData = {",
    [
        ('badge: "Miglior valore"', 'badge: "Miglior rapporto qualità-prezzo"', 1),
        ('"Usa il nostro Room Wizard intelligente e trova la soluzione migliore per il tuo soggiorno in circa 30 secondi."', '"Usa il nostro assistente per trovare la camera più adatta al tuo soggiorno in circa 30 secondi."', 1),
    ],
)

# 7) Italian room image captions / generated alts.
caption_path = "components/rooms/RoomDetailPage.tsx"
caption_text = read(caption_path)
caption_replacements = {
    '  Layout: { fr: "Disposition", tr: "Yerleşim" },': '  Layout: { fr: "Disposition", it: "Disposizione", tr: "Yerleşim" },',
    '  Detail: { fr: "Détail", tr: "Detay" },': '  Detail: { fr: "Détail", it: "Dettaglio", tr: "Detay" },',
    '  Desk: { fr: "Bureau", tr: "Çalışma masası" },': '  Desk: { fr: "Bureau", it: "Scrivania", tr: "Çalışma masası" },',
    '  "Traditional interior": { fr: "Intérieur traditionnel", tr: "Geleneksel iç mekân" },': '  "Traditional interior": { fr: "Intérieur traditionnel", it: "Interni tradizionali", tr: "Geleneksel iç mekân" },',
    '  "Courtyard access": { fr: "Accès à la cour", tr: "Avlu erişimi" },': '  "Courtyard access": { fr: "Accès à la cour", it: "Accesso al cortile", tr: "Avlu erişimi" },',
    '  "Room layout": { fr: "Agencement de la chambre", tr: "Oda düzeni" },': '  "Room layout": { fr: "Agencement de la chambre", it: "Disposizione della camera", tr: "Oda düzeni" },',
    '  "Stone wall interior": { fr: "Intérieur avec mur en pierre", tr: "Taş duvarlı iç mekân" },': '  "Stone wall interior": { fr: "Intérieur avec mur en pierre", it: "Interni con parete in pietra", tr: "Taş duvarlı iç mekân" },',
    '  "Stone bathroom details": { fr: "Détails en pierre de la salle de bain", tr: "Taş banyo detayları" },': '  "Stone bathroom details": { fr: "Détails en pierre de la salle de bain", it: "Dettagli in pietra del bagno", tr: "Taş banyo detayları" },',
    '  "Spacious layout": { fr: "Agencement spacieux", tr: "Geniş yerleşim" },': '  "Spacious layout": { fr: "Agencement spacieux", it: "Disposizione spaziosa", tr: "Geniş yerleşim" },',
    '  "Traditional details": { fr: "Détails traditionnels", tr: "Geleneksel detaylar" },': '  "Traditional details": { fr: "Détails traditionnels", it: "Dettagli tradizionali", tr: "Geleneksel detaylar" },',
    '  "Terrace access": { fr: "Accès à la terrasse" },': '  "Terrace access": { fr: "Accès à la terrasse", it: "Accesso alla terrazza" },',
    '  "Kitchenette area": { fr: "Espace kitchenette" },': '  "Kitchenette area": { fr: "Espace kitchenette", it: "Area angolo cottura" },',
    '  "Traditional decoration": { fr: "Décoration traditionnelle" },': '  "Traditional decoration": { fr: "Décoration traditionnelle", it: "Arredi tradizionali" },',
    '  "Balcony view": { fr: "Vue depuis le balcon" },': '  "Balcony view": { fr: "Vue depuis le balcon", it: "Vista dal balcone" },',
}
for old, new in caption_replacements.items():
    if caption_text.count(old) != 1:
        raise RuntimeError(f"RoomDetailPage caption marker mismatch: {old}")
    caption_text = caption_text.replace(old, new, 1)
write(caption_path, caption_text)
print(f"updated {caption_path}")

# 8) Contact H1 aligned with branded contact intent.
replace_once(
    "components/contact/ContactPage.tsx",
    '  fr: "Contactez Voulamandis House à Chios",\n  de: "Kontakt zum Voulamandis House auf Chios",',
    '  fr: "Contactez Voulamandis House à Chios",\n  de: "Kontakt zum Voulamandis House auf Chios",\n  it: "Contatta Voulamandis House a Chios",',
)

# 9) Italian family-travel image alt text: localize every shared image used on the IT page.
replace_section(
    "content/family-travel.ts",
    '  it: {\n    locale: "it",',
    '  es: {\n    locale: "es",',
    [
        ('image: familyTravelImages.hero,', 'image: { ...familyTravelImages.hero, alt: "Vacanze in famiglia a Chios con bambini durante una giornata soleggiata sull’isola" },', 1),
        ('image: familyTravelImages.sandyBeach,', 'image: { ...familyTravelImages.sandyBeach, alt: "Spiaggia sabbiosa di Komi a Chios, ideale per una giornata al mare in famiglia" },', 1),
        ('image: familyTravelImages.museum,', 'image: { ...familyTravelImages.museum, alt: "Museo del Mastice di Chios, tappa culturale adatta alle famiglie" },', 1),
        ('image: familyTravelImages.koraisLibrary,', 'image: { ...familyTravelImages.koraisLibrary, alt: "Biblioteca Korais a Chios, visita culturale per famiglie" },', 1),
        ('image: familyTravelImages.playground,', 'image: { ...familyTravelImages.playground, alt: "Parco giochi di Daskalopetra a Chios per bambini e famiglie" },', 1),
        ('image: familyTravelImages.paintball,', 'image: { ...familyTravelImages.paintball, alt: "Attività di paintball all’aperto a Chios per ragazzi e famiglie" },', 1),
        ('image: familyTravelImages.pizza,', 'image: { ...familyTravelImages.pizza, alt: "Sosta gastronomica adatta alle famiglie a Chios con pasta e piatti semplici" },', 1),
        ('image: familyTravelImages.garden,', 'image: { ...familyTravelImages.garden, alt: "Il tranquillo giardino del Voulamandis House a Kambos, Chios" },', 1),
    ],
)

# 10) Assert that three stale-crawl findings are already fixed in current source and stay fixed.
activities = read("components/landing/ChiosActivitiesPage.tsx")
assert 'it: {\n    cardsKicker: "Attività a Chios"' in activities
assert "Scopri tradizioni locali, natura, benessere, cultura ed esperienze stagionali consigliate da Voulamandis House." in activities
beach = read("components/landing/BeachLoversPage.tsx")
assert 'heroNoteTitle: "Kambos e giornate al mare"' in beach
assert 'introKicker: "Esperienza per amanti del mare"' in beach
it_kambos_route = read("app/it/chios/kampos-chios/page.tsx")
assert "LocalizedKamposLandingPage" in it_kambos_route
localized_kambos = read("components/chios/LocalizedKamposLandingPage.tsx")
assert 'whyEyebrow: "Vacanze con un ritmo diverso"' in localized_kambos

# 11) Final guardrails.
assert "  it: enCopy," not in read(wizard_path)
assert "  it: itCopy," in read(wizard_path)
assert 'roomsBreadcrumbPath: "/it/camere-a-chios/"' in read(schema_path)
assert 'it: "L’appartamento 10 è una soluzione familiare' in read(schema_path)
home = read("content/home.ts")
it_start = home.index("export const homePageIt: HomePageData = {")
it_end = home.index("export const homePageEs: HomePageData = {", it_start)
it_home = home[it_start:it_end]
for forbidden in ["Room Wizard", '🏡 Apt', 'Codice sconto live', 'Offerta live']:
    if forbidden in it_home:
        raise RuntimeError(f"Italian homepage still contains: {forbidden}")
assert it_home.count('liveBadge: "IN DIRETTA"') == 4
assert 'title: "Camere e appartamenti a Chios, nel cuore di Kambos"' in it_home
assert 'Camere & appartamenti a Chios · Prenotazione diretta' in read("components/VoulamandisFooterTailwind.tsx")
assert '"economy-double": "Vedi le camere doppie economiche"' in read("components/rooms/RoomsCategoryPage.tsx")
assert 'it: "Contatta Voulamandis House a Chios"' in read("components/contact/ContactPage.tsx")
assert 'alt: "Il tranquillo giardino del Voulamandis House a Kambos, Chios"' in read("content/family-travel.ts")

print("Italian SEO/language cleanup patch completed successfully")
