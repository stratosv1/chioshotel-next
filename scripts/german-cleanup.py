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


# 1. Exact German legacy redirects.
replace_once(
    "proxy.ts",
    '  "/chios-rooms/double-triple-rooms": "/chios-rooms/standard-double-room/",\n',
    '  "/chios-rooms/double-triple-rooms": "/chios-rooms/standard-double-room/",\n'
    '  "/de/uncategorized-de/economy-zimmer-auf-chios":\n'
    '    "/de/zimmer-chios/economy-zimmer-auf-chios/",\n'
    '  "/de/uncategorized-de/standard-doppelzimmer-auf-chios":\n'
    '    "/de/zimmer-chios/standard-doppelzimmer-auf-chios/",\n'
    '  "/de/uncategorized-de/familienapartments-in-chios":\n'
    '    "/de/zimmer-chios/familienapartments-in-chios/",\n'
    '  "/de/zimmer-chios": "/de/chios-zimmer/",\n',
)
replace_once(
    "proxy.ts",
    '  "/de/chios-ist-die-beste-insel-griechenlands": "/de/chios/",\n  "/de/chios.html": "/de/chios/",',
    '  "/de/chios-ist-die-beste-insel-griechenlands": "/de/chios-insel/",\n  "/de/chios.html": "/de/chios-insel/",',
)

# 2. Preserve Kambos page intent instead of collapsing it into the general island hub.
replace_once(
    "next.config.ts",
    '        "source":  "/de/chios-insel/kambos-auf-chios",\n        "destination":  "/de/chios-insel",',
    '        "source":  "/de/chios-insel/kambos-auf-chios",\n        "destination":  "/de/chios/kampos-chios/",',
)

# 3. Breadcrumb parent is the actual KEEP rooms hub.
replace_once(
    "content/room-detail-schema.ts",
    '    roomsBreadcrumbPath: "/de/zimmer-chios/",',
    '    roomsBreadcrumbPath: "/de/chios-zimmer/",',
)

# 4. Natural German room-category CTA.
replace_once(
    "components/rooms/RoomsCategoryPage.tsx",
    '    "economy-double": "Economy Double Rooms ansehen",',
    '    "economy-double": "Economy-Doppelzimmer ansehen",',
)

# 5. Contact H1 alignment.
replace_once(
    "components/contact/ContactPage.tsx",
    '  el: "Επικοινωνία με το Voulamandis House στη Χίο",\n  tr: "Voulamandis House ile İletişim – Sakız Adası",',
    '  el: "Επικοινωνία με το Voulamandis House στη Χίο",\n  de: "Kontakt zum Voulamandis House auf Chios",\n  tr: "Voulamandis House ile İletişim – Sakız Adası",',
)

# 6. Footer language purity.
replace_once(
    "components/VoulamandisFooterTailwind.tsx",
    '  const locationLabel = language === "tr" ? "Kambos, Sakız Adası" : language === "el" ? "Κάμπος, Χίος" : "Kampos, Chios";\n'
    '  const footerTagline = language === "tr" ? "Sakız Adası odaları & daireleri · Doğrudan konaklama" : language === "el" ? "Δωμάτια & διαμερίσματα στη Χίο · Απευθείας διαμονή" : "Chios rooms & apartments · Direct stay";\n'
    '  const footerNavLabel = language === "tr" ? "Alt bilgi menüsü" : language === "el" ? "Πλοήγηση υποσέλιδου" : "Footer navigation";',
    '  const locationLabel = language === "tr" ? "Kambos, Sakız Adası" : language === "el" ? "Κάμπος, Χίος" : language === "de" ? "Kambos, Chios" : "Kampos, Chios";\n'
    '  const footerTagline = language === "tr" ? "Sakız Adası odaları & daireleri · Doğrudan konaklama" : language === "el" ? "Δωμάτια & διαμερίσματα στη Χίο · Απευθείας διαμονή" : language === "de" ? "Zimmer & Apartments auf Chios · Direkt buchen" : "Chios rooms & apartments · Direct stay";\n'
    '  const footerNavLabel = language === "tr" ? "Alt bilgi menüsü" : language === "el" ? "Πλοήγηση υποσέλιδου" : language === "de" ? "Fußzeilennavigation" : "Footer navigation";',
)

# 7. Render-time cleanup of inherited German homepage fragments.
home_path = "components/home/HomePageTailwindV3.tsx"
home = read(home_path)
home = home.replace("function localizeInheritedTurkishCopy(data: HomePageData): HomePageData {", "function localizeInheritedCopy(data: HomePageData): HomePageData {", 1)
needle = '''  if (data.seo.canonicalPath !== "/tr/") {
    return data;
  }

  return {
'''
replacement = '''  if (data.seo.canonicalPath === "/de/") {
    return {
      ...data,
      intro: {
        ...data.intro,
        right: {
          ...data.intro.right,
          cards: data.intro.right.cards.map((card) =>
            card.title.includes("Room Wizard")
              ? { ...card, title: "🧭 Zimmerfinder" }
              : card,
          ),
        },
      },
      location: {
        ...data.location,
        infoCard: {
          ...data.location.infoCard,
          emailLabel: "E-Mail:",
        },
      },
      roomsPreview: {
        ...data.roomsPreview,
        primaryCta: {
          ...data.roomsPreview.primaryCta,
          label: "Zimmerfinder",
        },
        rooms: data.roomsPreview.rooms.map((room) => ({
          ...room,
          title: room.title === "Economy Doppelzimmer" ? "Economy-Doppelzimmer" : room.title,
          meta: room.meta.map((item) => item === "🏡 Apt" ? "🏡 Apartment" : item),
        })),
      },
    };
  }

  if (data.seo.canonicalPath !== "/tr/") {
    return data;
  }

  return {
'''
if home.count(needle) != 1:
    raise RuntimeError("HomePageTailwindV3.tsx: Turkish guard block not found exactly once")
home = home.replace(needle, replacement, 1)
if home.count("localizeInheritedTurkishCopy(dataWithAccommodationLink)") != 1:
    raise RuntimeError("HomePageTailwindV3.tsx: old render helper call not found")
home = home.replace("localizeInheritedTurkishCopy(dataWithAccommodationLink)", "localizeInheritedCopy(dataWithAccommodationLink)", 1)
write(home_path, home)
print(f"updated {home_path}")

# 8. German Room Wizard.
wizard_path = "components/rooms/RoomWizardTailwind.tsx"
wizard = read(wizard_path)
de_copy = '''
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
'''
marker = "\nconst trCopy: WizardCopy = {"
if wizard.count(marker) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: Turkish copy marker not unique")
wizard = wizard.replace(marker, "\n" + de_copy + marker, 1)
if wizard.count("  de: enCopy,") != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: de: enCopy mapping not found")
wizard = wizard.replace("  de: enCopy,", "  de: deCopy,", 1)

replace_pairs = [
    (
        '''function isTurkishCopy(copy: WizardCopy) {
  return copy === trCopy;
}
''',
        '''function isGermanCopy(copy: WizardCopy) {
  return copy === deCopy;
}

function isTurkishCopy(copy: WizardCopy) {
  return copy === trCopy;
}
''',
    ),
    (
        '''function localizeRoomName(name: string, copy: WizardCopy) {
  if (isTurkishCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Oda $1").replace(/^Apartment\\s+(\\d+)$/i, "Daire $1");
  }
  return name;
}
''',
        '''function localizeRoomName(name: string, copy: WizardCopy) {
  if (isGermanCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Zimmer $1").replace(/^Apartment\\s+(\\d+)$/i, "Apartment $1");
  }
  if (isTurkishCopy(copy)) {
    return name.replace(/^Room\\s+(\\d+)$/i, "Oda $1").replace(/^Apartment\\s+(\\d+)$/i, "Daire $1");
  }
  return name;
}
''',
    ),
    (
        '''function localizeRoomType(type: string, copy: WizardCopy) {
  if (!isTurkishCopy(copy)) return type;
  const values: Record<string, string> = {
    "First Floor Double/Triple room": "Üst kat çift / üç kişilik oda",
    "Ground Floor Double/Triple room": "Zemin kat çift / üç kişilik oda",
    "Economy double": "Ekonomik çift kişilik oda",
    Apartment: "Aile dairesi",
  };
  return values[type] || type;
}
''',
        '''function localizeRoomType(type: string, copy: WizardCopy) {
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
''',
    ),
    (
        '''function localizeRoomLocation(location: string, copy: WizardCopy) {
  if (!isTurkishCopy(copy)) return location;
  const values: Record<string, string> = {
    "First Floor": "Üst kat",
    "Ground Floor": "Zemin kat",
    "Stand Alone": "Bağımsız birim",
  };
  return values[location] || location;
}
''',
        '''function localizeRoomLocation(location: string, copy: WizardCopy) {
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
''',
    ),
]
for old, new in replace_pairs:
    count = wizard.count(old)
    if count != 1:
        raise RuntimeError(f"RoomWizardTailwind.tsx: helper replacement matched {count}; starts {old[:80]!r}")
    wizard = wizard.replace(old, new, 1)

old_tags = '''  const polish = isPolishCopy(copy);
  const turkish = isTurkishCopy(copy);
  if (prefs.guests) tags.push({ text: `${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} ${copy.guests}`, good: room.maxGuests >= prefs.guests });
  if (prefs.budget !== undefined) tags.push({ text: room.budget ? (turkish ? "Ekonomik" : "Economy") : (turkish ? "Standart" : "Standard"), good: room.budget === prefs.budget });
  if (prefs.noStairs) tags.push({ text: room.stairs ? (polish ? "Schody" : turkish ? "Merdiven var" : "Stairs") : (polish ? "Bez schodów" : turkish ? "Merdivensiz" : "No stairs"), good: !room.stairs });
  if (prefs.upperView !== undefined) tags.push({ text: prefs.upperView ? (polish ? "Piętro / widok" : turkish ? "Üst kat / manzara" : "Upper view") : (polish ? "Widok na ogród" : turkish ? "Bahçe manzarası" : "Garden view"), good: prefs.upperView ? room.upperView : room.gardenView });
  if (prefs.kitchen) tags.push({ text: room.fullKitchen ? (polish ? "Pełna kuchnia" : turkish ? "Tam mutfak" : "Full kitchen") : room.kitchenette ? (polish ? "Aneks kuchenny" : turkish ? "Mini mutfak" : "Kitchenette") : (polish ? "Bez kuchni" : turkish ? "Mutfak yok" : "No kitchen"), good: room.fullKitchen || room.kitchenette });
'''
new_tags = '''  const polish = isPolishCopy(copy);
  const german = isGermanCopy(copy);
  const turkish = isTurkishCopy(copy);
  if (prefs.guests) tags.push({ text: `${room.maxGuests >= prefs.guests ? "✓" : "✕"} ${prefs.guests} ${copy.guests}`, good: room.maxGuests >= prefs.guests });
  if (prefs.budget !== undefined) tags.push({ text: room.budget ? (turkish ? "Ekonomik" : "Economy") : (turkish ? "Standart" : "Standard"), good: room.budget === prefs.budget });
  if (prefs.noStairs) tags.push({ text: room.stairs ? (polish ? "Schody" : german ? "Treppen" : turkish ? "Merdiven var" : "Stairs") : (polish ? "Bez schodów" : german ? "Ohne Treppen" : turkish ? "Merdivensiz" : "No stairs"), good: !room.stairs });
  if (prefs.upperView !== undefined) tags.push({ text: prefs.upperView ? (polish ? "Piętro / widok" : german ? "Obergeschoss / Aussicht" : turkish ? "Üst kat / manzara" : "Upper view") : (polish ? "Widok na ogród" : german ? "Gartenblick" : turkish ? "Bahçe manzarası" : "Garden view"), good: prefs.upperView ? room.upperView : room.gardenView });
  if (prefs.kitchen) tags.push({ text: room.fullKitchen ? (polish ? "Pełna kuchnia" : german ? "Küche" : turkish ? "Tam mutfak" : "Full kitchen") : room.kitchenette ? (polish ? "Aneks kuchenny" : german ? "Kochnische" : turkish ? "Mini mutfak" : "Kitchenette") : (polish ? "Bez kuchni" : german ? "Keine Küche" : turkish ? "Mutfak yok" : "No kitchen"), good: room.fullKitchen || room.kitchenette });
'''
if wizard.count(old_tags) != 1:
    raise RuntimeError(f"RoomWizardTailwind.tsx: tag block match count {wizard.count(old_tags)}")
wizard = wizard.replace(old_tags, new_tags, 1)

old_intro = '''  const intro = isPolishCopy(copy)
    ? `Dzień dobry! Nazywam się ${lead.firstName} ${lead.lastName} i chcę zapytać o:`
    : isTurkishCopy(copy)
      ? `Merhaba! Ben ${lead.firstName} ${lead.lastName}. Şu konaklama seçeneği hakkında bilgi almak istiyorum:`
      : `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to ask about:`;
'''
new_intro = '''  const intro = isPolishCopy(copy)
    ? `Dzień dobry! Nazywam się ${lead.firstName} ${lead.lastName} i chcę zapytać o:`
    : isGermanCopy(copy)
      ? `Guten Tag! Ich bin ${lead.firstName} ${lead.lastName} und möchte mich nach folgender Unterkunft erkundigen:`
      : isTurkishCopy(copy)
        ? `Merhaba! Ben ${lead.firstName} ${lead.lastName}. Şu konaklama seçeneği hakkında bilgi almak istiyorum:`
        : `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to ask about:`;
'''
if wizard.count(old_intro) != 1:
    raise RuntimeError("RoomWizardTailwind.tsx: WhatsApp intro block not found")
wizard = wizard.replace(old_intro, new_intro, 1)

inline_pairs = [
    (
        '  const photoLabel = isPolishCopy(copy) ? "zdjęcie" : isTurkishCopy(copy) ? "fotoğraf" : "photo";',
        '  const photoLabel = isPolishCopy(copy) ? "zdjęcie" : isGermanCopy(copy) ? "Foto" : isTurkishCopy(copy) ? "fotoğraf" : "photo";',
    ),
    (
        '  const polish = isPolishCopy(copy);\n  const turkish = isTurkishCopy(copy);\n  const roomName = localizeRoomName(room.name, copy);\n  const doubleBed = polish ? "Podwójne" : turkish ? "Çift kişilik" : "Double";\n  const singleBed = polish ? "Pojedyncze" : turkish ? "Tek kişilik" : "Single";\n  const sofaBed = polish ? "Sofa" : turkish ? "Çekyat" : "Sofa";',
        '  const polish = isPolishCopy(copy);\n  const german = isGermanCopy(copy);\n  const turkish = isTurkishCopy(copy);\n  const roomName = localizeRoomName(room.name, copy);\n  const doubleBed = polish ? "Podwójne" : german ? "Doppelbett" : turkish ? "Çift kişilik" : "Double";\n  const singleBed = polish ? "Pojedyncze" : german ? "Einzelbett" : turkish ? "Tek kişilik" : "Single";\n  const sofaBed = polish ? "Sofa" : german ? "Schlafsofa" : turkish ? "Çekyat" : "Sofa";',
    ),
    (
        '  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";',
        '  const swipeLabel = isPolishCopy(copy) ? "Przesuń" : isGermanCopy(copy) ? "Wischen" : isTurkishCopy(copy) ? "Kaydırın" : "Swipe";',
    ),
]
for old, new in inline_pairs:
    count = wizard.count(old)
    if count != 1:
        raise RuntimeError(f"RoomWizardTailwind.tsx: inline replacement matched {count}: {old[:80]!r}")
    wizard = wizard.replace(old, new, 1)

write(wizard_path, wizard)
print(f"updated {wizard_path}")

# 9. Stale-crawl findings are already localized; assert no regression.
family = read("components/landing/FamilyTravelPage.tsx")
assert 'de: "Familienerlebnisse"' in family
kambos = read("components/chios/LocalizedKamposLandingPage.tsx")
assert 'whyEyebrow: "Urlaub in einem anderen Rhythmus"' in kambos
assert 'whyTitle: "Ruhe, Charakter und kurze Wege"' in kambos

# 10. Targeted final assertions.
assert '"/de/zimmer-chios": "/de/chios-zimmer/"' in read("proxy.ts")
assert '"/de/chios.html": "/de/chios-insel/"' in read("proxy.ts")
assert '"destination":  "/de/chios/kampos-chios/"' in read("next.config.ts")
assert 'roomsBreadcrumbPath: "/de/chios-zimmer/"' in read("content/room-detail-schema.ts")
assert 'de: "Kontakt zum Voulamandis House auf Chios"' in read("components/contact/ContactPage.tsx")
assert 'Zimmer & Apartments auf Chios · Direkt buchen' in read("components/VoulamandisFooterTailwind.tsx")
final_wizard = read(wizard_path)
for signal in ["const deCopy: WizardCopy", "de: deCopy", "Finden Sie das passende Zimmer", "Doppelbett", "Kochnische", "Wischen", "Foto"]:
    assert signal in final_wizard, signal

print("German SEO cleanup patch completed successfully")
