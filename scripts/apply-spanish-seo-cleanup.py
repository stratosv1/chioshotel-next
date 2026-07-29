from pathlib import Path
import re


def read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def write(path: str, text: str) -> None:
    Path(path).write_text(text, encoding="utf-8")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly 1 occurrence, found {count}")
    return text.replace(old, new, 1)


def add_es_to_entry(text: str, key_literal: str, translation: str, label: str) -> str:
    pattern = re.compile(rf'(?m)^(\s*{re.escape(key_literal)}: \{{)([^}}]*)(\}},)$')
    match = pattern.search(text)
    if not match:
        raise RuntimeError(f"{label}: dictionary entry not found")
    if re.search(r'\bes\s*:', match.group(2)):
        return text
    escaped = translation.replace('\\', '\\\\').replace('"', '\\"')
    middle = match.group(2).rstrip()
    if middle and not middle.rstrip().endswith(','):
        middle += ','
    middle += f' es: "{escaped}"'
    return text[:match.start()] + match.group(1) + middle + match.group(3) + text[match.end():]


# 1) Full Spanish Room Wizard localization.
path = "components/rooms/RoomWizardTailwind.tsx"
text = read(path)

es_copy = '''const esCopy: WizardCopy = {
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

'''
text = replace_once(text, "const trCopy: WizardCopy = {", es_copy + "const trCopy: WizardCopy = {", "RoomWizard: insert esCopy")
text = replace_once(text, "  es: enCopy,", "  es: esCopy,", "RoomWizard: map esCopy")
text = replace_once(text, '''function isItalianCopy(copy: WizardCopy) {
  return copy === itCopy;
}

function isGermanCopy''', '''function isItalianCopy(copy: WizardCopy) {
  return copy === itCopy;
}

function isSpanishCopy(copy: WizardCopy) {
  return copy === esCopy;
}

function isGermanCopy''', "RoomWizard: Spanish predicate")
text = replace_once(text, '''  if (isItalianCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Camera $1").replace(/^Apartment\\s+(\\d+)$/i, "Appartamento $1");
  }
  if (isGermanCopy(copy)) {''', '''  if (isItalianCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Camera $1").replace(/^Apartment\\s+(\\d+)$/i, "Appartamento $1");
  }
  if (isSpanishCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Habitación $1").replace(/^Apartment\\s+(\\d+)$/i, "Apartamento $1");
  }
  if (isGermanCopy(copy)) {''', "RoomWizard: Spanish room names")
text = replace_once(text, '''  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor Double/Triple room": "Doppel-/Dreibettzimmer im Obergeschoss",''', '''  if (isSpanishCopy(copy)) {
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
      "First Floor Double/Triple room": "Doppel-/Dreibettzimmer im Obergeschoss",''', "RoomWizard: Spanish room types")
text = replace_once(text, '''  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Obergeschoss",''', '''  if (isSpanishCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Primera planta",
      "Ground Floor": "Planta baja",
      "Stand Alone": "Unidad independiente",
    };
    return values[location] || location;
  }
  if (isGermanCopy(copy)) {
    const values: Record<string, string> = {
      "First Floor": "Obergeschoss",''', "RoomWizard: Spanish locations")
text = replace_once(text, '''  const italian = isItalianCopy(copy);
  const german = isGermanCopy(copy);''', '''  const italian = isItalianCopy(copy);
  const spanish = isSpanishCopy(copy);
  const german = isGermanCopy(copy);''', "RoomWizard: Spanish tag flag")
text = replace_once(text, 'room.budget ? (french ? "Économique" : turkish ? "Ekonomik" : "Economy")', 'room.budget ? (french ? "Économique" : spanish ? "Económica" : turkish ? "Ekonomik" : "Economy")', "RoomWizard: Spanish economy tag")
text = replace_once(text, 'french ? "Escaliers" : italian ? "Scale" : german ?', 'french ? "Escaliers" : italian ? "Scale" : spanish ? "Escaleras" : german ?', "RoomWizard: Spanish stairs tag")
text = replace_once(text, 'french ? "Sans escaliers" : italian ? "Senza scale" : german ?', 'french ? "Sans escaliers" : italian ? "Senza scale" : spanish ? "Sin escaleras" : german ?', "RoomWizard: Spanish no-stairs tag")
text = replace_once(text, 'french ? "Étage / vue" : italian ? "Piano superiore / vista" : german ?', 'french ? "Étage / vue" : italian ? "Piano superiore / vista" : spanish ? "Planta superior / vistas" : german ?', "RoomWizard: Spanish upper-view tag")
text = replace_once(text, 'french ? "Vue jardin" : italian ? "Vista giardino" : german ?', 'french ? "Vue jardin" : italian ? "Vista giardino" : spanish ? "Vista al jardín" : german ?', "RoomWizard: Spanish garden-view tag")
text = replace_once(text, 'french ? "Cuisine complète" : italian ? "Cucina completa" : german ?', 'french ? "Cuisine complète" : italian ? "Cucina completa" : spanish ? "Cocina completa" : german ?', "RoomWizard: Spanish full-kitchen tag")
text = replace_once(text, 'french ? "Kitchenette" : italian ? "Angolo cottura" : german ?', 'french ? "Kitchenette" : italian ? "Angolo cottura" : spanish ? "Cocina pequeña" : german ?', "RoomWizard: Spanish kitchenette tag")
text = replace_once(text, 'french ? "Sans cuisine" : italian ? "Senza cucina" : german ?', 'french ? "Sans cuisine" : italian ? "Senza cucina" : spanish ? "Sin cocina" : german ?', "RoomWizard: Spanish no-kitchen tag")
text = replace_once(text, ''': isItalianCopy(copy)
        ? `Ciao! Mi chiamo ${lead.firstName} ${lead.lastName} e vorrei informazioni su:`
        : isGermanCopy(copy)''', ''': isItalianCopy(copy)
        ? `Ciao! Mi chiamo ${lead.firstName} ${lead.lastName} e vorrei informazioni su:`
        : isSpanishCopy(copy)
          ? `¡Hola! Me llamo ${lead.firstName} ${lead.lastName} y quisiera información sobre:`
          : isGermanCopy(copy)''', "RoomWizard: Spanish WhatsApp intro")
text = replace_once(text, 'isPolishCopy(copy) ? "zdjęcie" : isItalianCopy(copy) ? "foto" : isGermanCopy(copy)', 'isPolishCopy(copy) ? "zdjęcie" : isItalianCopy(copy) ? "foto" : isSpanishCopy(copy) ? "foto" : isGermanCopy(copy)', "RoomWizard: Spanish gallery label")
text = replace_once(text, '''  const italian = isItalianCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  const roomName = localizeRoomName(room.name, copy);
  const doubleBed = polish ? "Podwójne" : french ? "Lit double" : italian ? "Letto matrimoniale" : german ? "Doppelbett"''', '''  const italian = isItalianCopy(copy);
  const spanish = isSpanishCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  const roomName = localizeRoomName(room.name, copy);
  const doubleBed = polish ? "Podwójne" : french ? "Lit double" : italian ? "Letto matrimoniale" : spanish ? "Cama doble" : german ? "Doppelbett"''', "RoomWizard: Spanish bed flag/double")
text = replace_once(text, 'french ? "Lit simple" : italian ? "Letto singolo" : german ?', 'french ? "Lit simple" : italian ? "Letto singolo" : spanish ? "Cama individual" : german ?', "RoomWizard: Spanish single bed")
text = replace_once(text, 'french ? "Canapé-lit" : italian ? "Divano letto" : german ?', 'french ? "Canapé-lit" : italian ? "Divano letto" : spanish ? "Sofá cama" : german ?', "RoomWizard: Spanish sofa bed")
text = replace_once(text, 'isFrenchCopy(copy) ? "Balayez" : isItalianCopy(copy) ? "Scorri" : isGermanCopy(copy)', 'isFrenchCopy(copy) ? "Balayez" : isItalianCopy(copy) ? "Scorri" : isSpanishCopy(copy) ? "Desliza" : isGermanCopy(copy)', "RoomWizard: Spanish swipe")
write(path, text)

# 2) Spanish room structured-data descriptions.
path = "content/room-detail-schema.ts"
text = read(path)
schema_es = {
    '"Room 6 is ideal for guests who love nature. Located on the ground floor, it opens directly to the peaceful courtyard and garden."': "La habitación 6 está en planta baja y se abre directamente al tranquilo patio y al jardín.",
    '"Room 2 is located on the first floor and offers access to a shared terrace with views over the estate and the citrus trees of Kambos."': "La habitación 2 está en la primera planta y ofrece acceso a una terraza compartida con vistas a la finca y a los cítricos de Kambos.",
    '"Room 5 is a ground-floor double / triple room with direct courtyard and garden access. It is ideal for guests who prefer no stairs and an easy outdoor connection."': "La habitación 5 es una doble / triple en planta baja con acceso directo al patio y al jardín, ideal para quienes prefieren evitar las escaleras.",
    '"Room 7 is a ground-floor double / triple room with garden access and a flexible layout with a sofa bed."': "La habitación 7 es una doble / triple en planta baja con acceso al jardín y una distribución flexible con sofá cama.",
    '"Room 1 is a first-floor room for up to 4 guests, with upper-floor view, private balcony feel and two sleeping spaces without a connecting door."': "La habitación 1 está en la primera planta y aloja hasta 4 personas, con vistas desde la planta superior y dos zonas de descanso sin puerta comunicante.",
    '"Room 3 is a first-floor double / triple room with kitchenette, upper-floor view and access by stairs."': "La habitación 3 es una doble / triple en primera planta con cocina pequeña, vistas desde la planta superior y acceso por escaleras.",
    '"Room 4 is a first-floor double / triple room with kitchenette, sofa bed and upper-floor view."': "La habitación 4 es una doble / triple en primera planta con cocina pequeña, sofá cama y vistas desde la planta superior.",
    '"Apartment 8 is a family apartment with living room and kitchen, separate bedroom and bathroom. It is suitable for up to 4 guests."': "El apartamento 8 es un apartamento familiar con sala de estar y cocina, dormitorio independiente y baño, adecuado para hasta 4 huéspedes.",
    '"Apartment 9 offers the same family-friendly layout with kitchen, living area, bedroom and bathroom, suitable for up to 4 guests."': "El apartamento 9 ofrece una distribución familiar con cocina, sala de estar, dormitorio y baño, adecuada para hasta 4 huéspedes.",
    '"Apartment 10 is a family apartment with living room and kitchen, bedroom and flexible sofa-bed layout."': "El apartamento 10 es un apartamento familiar con sala de estar y cocina, dormitorio y una distribución flexible con sofás cama.",
}
for key, value in schema_es.items():
    text = add_es_to_entry(text, key, value, f"Schema Spanish: {key[:28]}")
write(path, text)

# 3) Spanish homepage language purity and accommodation semantics.
path = "content/home.ts"
text = read(path)
start = text.index("export const homePageEs: HomePageData = {")
end = text.index("export const homePageTr: HomePageData = {", start)
section = text[start:end]
replacements = {
    'title: "Hotel y apartamentos en Chios, en Kambos"': 'title: "Habitaciones y apartamentos en Quíos, en Kambos"',
    'imageAlt: "Hotel y apartamentos en Chios - Voulamandis House en Kambos"': 'imageAlt: "Habitaciones y apartamentos en Chios - Voulamandis House en Kambos"',
    'liveLabel: "Código descuento live"': 'liveLabel: "Código de descuento en directo"',
    'title: "🧭 Room Wizard"': 'title: "🧭 Encuentra tu habitación"',
    'badge: "Oferta live • Recibe tu código"': 'badge: "Oferta directa • Recibe tu código"',
    'label: "Room Wizard"': 'label: "Encuentra tu habitación"',
    '"🏡 Apt"': '"🏡 Apartamento"',
    'timerLabel: "Los precios last minute se actualizan en:"': 'timerLabel: "Los precios de última hora se actualizan en:"',
}
for old, new in replacements.items():
    if old not in section:
        raise RuntimeError(f"homePageEs: missing {old}")
    section = section.replace(old, new)
if section.count('directBadge: "🎁 -10% Descuento",') != 4:
    raise RuntimeError("homePageEs: expected four Spanish room badges")
section = section.replace('directBadge: "🎁 -10% Descuento",', 'directBadge: "🎁 -10% Descuento",\n        liveBadge: "EN DIRECTO",')
text = text[:start] + section + text[end:]
write(path, text)

# 4) Spanish footer shared microcopy.
path = "components/VoulamandisFooterTailwind.tsx"
text = read(path)
text = replace_once(text, 'language === "it" ? "Kambos, Chios" : "Kampos, Chios";', 'language === "it" ? "Kambos, Chios" : language === "es" ? "Kambos, Quíos" : "Kampos, Chios";', "Footer ES location")
text = replace_once(text, 'language === "it" ? "Camere & appartamenti a Chios · Prenotazione diretta" : "Chios rooms & apartments · Direct stay";', 'language === "it" ? "Camere & appartamenti a Chios · Prenotazione diretta" : language === "es" ? "Habitaciones & apartamentos en Quíos · Reserva directa" : "Chios rooms & apartments · Direct stay";', "Footer ES tagline")
text = replace_once(text, 'language === "it" ? "Navigazione a piè di pagina" : "Footer navigation";', 'language === "it" ? "Navigazione a piè di pagina" : language === "es" ? "Navegación del pie de página" : "Footer navigation";', "Footer ES aria")
write(path, text)

# 5) Natural Spanish economy-room CTA.
path = "components/rooms/RoomsCategoryPage.tsx"
text = read(path)
text = replace_once(text, '"economy-double": "Ver economy double rooms",', '"economy-double": "Ver habitaciones dobles económicas",', "RoomsCategory ES economy CTA")
write(path, text)

# 6) Spanish room image captions / alt vocabulary.
path = "components/rooms/RoomDetailPage.tsx"
text = read(path)
caption_es = {
    "Layout": "Distribución",
    "Detail": "Detalle",
    "Desk": "Escritorio",
    '"Traditional interior"': "Interior tradicional",
    '"Courtyard access"': "Acceso al patio",
    '"Room layout"': "Distribución de la habitación",
    '"Stone wall interior"': "Interior con pared de piedra",
    '"Stone bathroom details"': "Detalles de piedra en el baño",
    '"Spacious layout"': "Distribución amplia",
    '"Traditional details"': "Detalles tradicionales",
    '"Terrace access"': "Acceso a la terraza",
    '"Kitchenette area"': "Zona de cocina pequeña",
    '"Traditional decoration"': "Decoración tradicional",
    '"Balcony view"': "Vista desde el balcón",
}
for key, value in caption_es.items():
    text = add_es_to_entry(text, key, value, f"RoomDetail ES caption: {key}")
write(path, text)

# 7) Branded Spanish Contact H1.
path = "components/contact/ContactPage.tsx"
text = read(path)
text = replace_once(text, '  it: "Contatta Voulamandis House a Chios",\n  tr:', '  it: "Contatta Voulamandis House a Chios",\n  es: "Contacta con Voulamandis House en Quíos",\n  tr:', "Contact ES H1")
write(path, text)

# 8) Spanish family-travel image SEO.
path = "content/family-travel.ts"
text = read(path)
start = text.index("  es: {")
end = text.index("  tr: {", start)
section = text[start:end]
family_replacements = {
    "image: familyTravelImages.hero,": 'image: { ...familyTravelImages.hero, alt: "Vacaciones en familia en Quíos con niños durante un día soleado en la isla" },',
    "image: familyTravelImages.sandyBeach,": 'image: { ...familyTravelImages.sandyBeach, alt: "Playa de arena de Komi en Quíos, ideal para un día de mar en familia" },',
    "image: familyTravelImages.museum,": 'image: { ...familyTravelImages.museum, alt: "Museo de la Mastiha de Quíos, visita cultural para familias" },',
    "image: familyTravelImages.koraisLibrary,": 'image: { ...familyTravelImages.koraisLibrary, alt: "Biblioteca Korais en Quíos, visita cultural para familias" },',
    "image: familyTravelImages.playground,": 'image: { ...familyTravelImages.playground, alt: "Parque infantil de Daskalopetra en Quíos para niños y familias" },',
    "image: familyTravelImages.paintball,": 'image: { ...familyTravelImages.paintball, alt: "Actividad de paintball al aire libre en Quíos para jóvenes y familias" },',
    "image: familyTravelImages.pizza,": 'image: { ...familyTravelImages.pizza, alt: "Parada gastronómica familiar en Quíos con pasta y platos sencillos" },',
    "image: familyTravelImages.garden,": 'image: { ...familyTravelImages.garden, alt: "El tranquilo jardín de Voulamandis House en Kambos, Quíos" },',
}
for old, new in family_replacements.items():
    if old not in section:
        raise RuntimeError(f"familyTravel ES: missing {old}")
    section = section.replace(old, new, 1)
text = text[:start] + section + text[end:]
write(path, text)

# 9) Keep Spanish WhatsApp live requests fully Spanish.
path = "components/home/LiveDirectRequest.tsx"
text = read(path)
old = '''  const text = [
    copy.messageTitle,
    "",
    `Room: ${room ? `${room.displayName} - ${room.type}` : "-"}`,
    `Guests: ${guests}`,
    `Dates: ${dates.length ? dates.join(", ") : "-"}`,
    totals ? `Nights: ${totals.nights}` : null,
    totals ? `Original price: ${money(totals.original)}` : null,
    totals ? `Direct offer: ${money(totals.direct)}` : null,
    "",
    copy.messageConfirm,
  ]'''
new = '''  const spanish = copy === LIVE_REQUEST_COPY.es;
  const roomText = room
    ? `${spanish ? localizeRoomName(room.displayName, copy) : room.displayName} - ${spanish ? localizeRoomType(room.type, copy) : room.type}`
    : "-";
  const text = [
    copy.messageTitle,
    "",
    `${spanish ? "Habitación" : "Room"}: ${roomText}`,
    `${spanish ? "Huéspedes" : "Guests"}: ${guests}`,
    `${spanish ? "Fechas" : "Dates"}: ${dates.length ? dates.join(", ") : "-"}`,
    totals ? `${spanish ? "Noches" : "Nights"}: ${totals.nights}` : null,
    totals ? `${spanish ? "Precio inicial" : "Original price"}: ${money(totals.original)}` : null,
    totals ? `${spanish ? "Oferta directa" : "Direct offer"}: ${money(totals.direct)}` : null,
    "",
    copy.messageConfirm,
  ]'''
text = replace_once(text, old, new, "LiveDirectRequest ES message")
write(path, text)

# Targeted assertions: only audited Spanish signals, while preserving URL architecture.
checks = {
    "components/rooms/RoomWizardTailwind.tsx": ["const esCopy: WizardCopy", "es: esCopy", "Habitación $1", "¡Hola! Me llamo", "Desliza"],
    "content/room-detail-schema.ts": ['roomsBreadcrumbPath: "/es/habitaciones-en-chios/"', 'es: "La habitación 6', 'es: "El apartamento 10'],
    "content/home.ts": ["Habitaciones y apartamentos en Quíos, en Kambos", "Código de descuento en directo", "Oferta directa • Recibe tu código", "EN DIRECTO", "🏡 Apartamento"],
    "components/VoulamandisFooterTailwind.tsx": ["Habitaciones & apartamentos en Quíos · Reserva directa", "Navegación del pie de página"],
    "components/rooms/RoomsCategoryPage.tsx": ["Ver habitaciones dobles económicas"],
    "components/contact/ContactPage.tsx": ["Contacta con Voulamandis House en Quíos"],
    "content/family-travel.ts": ["Vacaciones en familia en Quíos con niños", "El tranquilo jardín de Voulamandis House en Kambos, Quíos"],
    "components/home/LiveDirectRequest.tsx": ['spanish ? "Huéspedes" : "Guests"', 'spanish ? "Precio inicial" : "Original price"'],
}
for file, needles in checks.items():
    body = read(file)
    for needle in needles:
        if needle not in body:
            raise RuntimeError(f"assertion failed: {needle} missing from {file}")

print("Spanish SEO/language cleanup patch completed successfully")
