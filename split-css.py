import argparse
import os

SECTIONS = [
    ("at", ":root{", "base/tokens.css"),
    ("at", "*{\n  box-sizing:border-box;\n}", "base/base.css"),
    ("at", "/* HERO */", "pages/home.css"),
    ("comment", "MOBILE EXACT PATCH", "pages/home-mobile-patch.css"),
    ("comment", "ROOMS CATEGORY PAGE TEMPLATE", "pages/rooms-category.css"),
    ("comment", "ROOM WIZARD", "pages/room-wizard.css"),
    ("comment", "ROOM DETAIL PAGE TEMPLATE", "pages/room-detail.css"),
    ("comment", "INDIVIDUAL ROOM CARDS PATCH", "pages/room-detail-cards.css"),
    ("comment", "RATES / DIRECT BOOKING PAGE", "pages/rates.css"),
    ("comment", "CONTACT PAGE", "pages/contact.css"),
    ("comment", "DEALS / OFFERS PAGE", "pages/deals.css"),
    ("comment", "CHIOS ISLAND LANDING PAGE", "pages/chios-island.css"),
    ("comment", "CHIOS BEACHES LANDING PAGE", "pages/chios-beaches.css"),
    ("comment", "CHIOS VILLAGES LANDING PAGE", "pages/chios-villages.css"),
    ("comment", "CHIOS MUSEUMS LANDING PAGE", "pages/chios-museums.css"),
    ("comment", "BEACH DETAIL PAGES", "pages/beach-detail.css"),
    ("comment", "VILLAGE DETAIL PAGES", "pages/village-detail.css"),
    ("comment", "MUSEUM DETAIL PAGES", "pages/museum-detail.css"),
    ("comment", "VOULAMANDIS PREMIUM HEADER", "components/header.css"),
    ("comment", "VOULAMANDIS PREMIUM FOOTER", "components/footer.css"),
    ("at", ".vh-language-switcher {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;", "components/language-switcher.css"),
    ("comment", "Room detail multilingual text overflow fixes", "pages/room-detail-i18n-fix.css"),
    ("at", "/* Chios Holiday Quiz */", "components/holiday-quiz.css"),
    ("comment", "LAST MINUTE DEALS WIDGET", "components/last-minute-widget.css"),
    ("at", "/* Beach Lovers Landing Page */", "landing/beach-lovers.css"),
    ("at", "/* Family Travel landing page */", "landing/family-travel.css"),
    ("at", "/* Taste Lover landing page */", "landing/taste-lover.css"),
    ("at", "/* Chios Explorer landing page */", "landing/chios-explorer.css"),
    ("at", "/* Chios Activities pages */", "landing/chios-activities.css"),
    ("at", "/* Mobile footer: show navigation groups in two columns */", "components/footer-mobile-patch.css"),
    ("at", ".find-room-page {", "pages/find-room.css"),
    ("comment", "Smooth premium hero quiz animation", "overrides/overrides.css"),
    ("at", "/* Kampos Chios page */", "pages/kampos.css"),
]

TW_MARKER = '@import "tailwindcss";'


def find_cut(body, kind, needle, search_from):
    hit = body.find(needle, search_from)

    if hit == -1:
        raise SystemExit("[ERROR] Anchor not found: " + repr(needle))

    if kind == "at":
        return hit

    opener = body.rfind("/*", search_from, hit)

    if opener == -1:
        raise SystemExit("[ERROR] Comment opener not found for: " + repr(needle))

    return opener


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", help="Path to app/globals.css")
    parser.add_argument("-o", "--out", default="css-split", help="Output directory")
    args = parser.parse_args()

    with open(args.source, "r", encoding="utf-8") as f:
        src = f.read()

    idx = src.find(TW_MARKER)

    if idx == -1:
        raise SystemExit('[ERROR] Tailwind import not found: ' + TW_MARKER)

    prefix = src[: idx + len(TW_MARKER)]
    body = src[idx + len(TW_MARKER):]

    cuts = []
    search_from = 0

    for kind, needle, fname in SECTIONS:
        cut = find_cut(body, kind, needle, search_from)
        cuts.append((cut, fname))
        search_from = cut + 1

    positions = [cut for cut, fname in cuts]

    if positions != sorted(positions) or len(set(positions)) != len(positions):
        raise SystemExit("[ERROR] Anchors are not in correct order.")

    parts = []

    for i, item in enumerate(cuts):
        cut, fname = item
        end = cuts[i + 1][0] if i + 1 < len(cuts) else len(body)

        if i == 0:
            text = body[:end]
        else:
            text = body[cut:end]

        parts.append((fname, text))

    rebuilt = "".join(text for fname, text in parts)

    if rebuilt != body:
        raise SystemExit("[ERROR] Round-trip mismatch. Nothing was written.")

    out = args.out

    for fname, text in parts:
        path = os.path.join(out, fname)
        folder = os.path.dirname(path)

        os.makedirs(folder, exist_ok=True)

        with open(path, "w", encoding="utf-8") as f:
            f.write(text)

    lines = [prefix, ""]
    last_group = None

    for fname, text in parts:
        group = fname.split("/")[0]

        if group != last_group:
            lines.append("")
            lines.append("/* ---- " + group + " ---- */")
            last_group = group

        lines.append('@import "./' + fname + '";')

    index = "\n".join(lines) + "\n"

    with open(os.path.join(out, "globals.css"), "w", encoding="utf-8") as f:
        f.write(index)

    print("VERIFIED OK - concat(parts) == original body")
    print("")
    print("Output: " + out + "/")
    print("  globals.css   new index, " + str(len(parts)) + " imports")

    for fname, text in parts:
        print(
            "  "
            + fname.ljust(42)
            + str(len(text)).rjust(8)
            + " chars  "
            + str(text.count(chr(10))).rjust(5)
            + " lines"
        )


if __name__ == "__main__":
    main()