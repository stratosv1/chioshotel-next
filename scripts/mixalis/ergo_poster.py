#!/usr/bin/env python3
"""Generates the work-energy-power formula poster for /mixalis/ergo.

  python3 scripts/mixalis/ergo_poster.py

Writes two SVGs into public/mixalis/:
  ergo-typologio.svg     5 cells per row, one row per section (screen; the page puts clickable areas over the cells)
  ergo-typologio-A4.svg  one column per section, sized for an A4 portrait page (print; converted to PDF)

Cell geometry of the screen poster must match `cells` in app/mixalis/(private)/ergo/page.tsx.
"""

from __future__ import annotations

import math
import re
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / "public" / "mixalis"

INK = "#1c2433"
MUTED = "#5b6577"
FAINT = "#9aa3b2"
F_RED = "#d9342b"
V_BLUE = "#1f6fd1"
K_ORANGE = "#e08a1e"
U_GREEN = "#1f9d55"
Q_HEAT = "#b04a3c"
GROUND = "#8a8f99"
BOX = "#f2c46d"
WOOD = "#c8a27a"

SECTIONS = [
    ("1. ΕΡΓΟ ΔΥΝΑΜΗΣ", "#1e5fb4", "#eaf2fd"),
    ("2. ΕΝΕΡΓΕΙΑ", "#0f7d8c", "#e6f6f8"),
    ("3. ΘΜΚΕ – ΑΔΜΕ – ΑΠΩΛΕΙΕΣ", "#6b3fa0", "#f3edfa"),
    ("4. ΙΣΧΥΣ – ΑΠΟΔΟΣΗ", "#2e7d32", "#ebf6ec"),
]

CELL_W, CELL_H = 226, 212


# ───────────────────────── svg helpers ─────────────────────────

def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rich(s: str, size: float = 11) -> str:
    """'U_{ελ} = ½kx^2' → tspans with real sub/superscripts (dy shifts, so every renderer agrees)."""
    out, last = [], 0
    for m in re.finditer(r"_\{([^}]*)\}|_(\S)|\^\{([^}]*)\}|\^(\S)", s):
        out.append(esc(s[last : m.start()]))
        sub = m.group(1) if m.group(1) is not None else m.group(2)
        sup = m.group(3) if m.group(3) is not None else m.group(4)
        d = size * (0.3 if sub is not None else -0.4)
        txt = sub if sub is not None else sup
        out.append(f'<tspan dy="{d:.1f}" font-size="{size * 0.7:.1f}">{esc(txt)}</tspan><tspan dy="{-d:.1f}">\u200b</tspan>')
        last = m.end()
    out.append(esc(s[last:]))
    return "".join(out)


def f(v: float) -> str:
    return f"{v:.1f}"


class Svg:
    def __init__(self) -> None:
        self.parts: list[str] = []

    def add(self, s: str) -> None:
        self.parts.append(s)

    def text(self, x, y, s, size=11, color=INK, anchor="middle", bold=True, italic=False, opacity=None):
        st = ' font-style="italic"' if italic else ""
        op = f' opacity="{opacity}"' if opacity is not None else ""
        self.add(
            f'<text x="{f(x)}" y="{f(y)}" font-size="{size}" fill="{color}" text-anchor="{anchor}" '
            f'font-weight="{"bold" if bold else "normal"}"{st}{op}>{rich(s, size)}</text>'
        )

    def line(self, x1, y1, x2, y2, color=INK, w=1.2, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{color}" stroke-width="{w}" stroke-linecap="round"{d}/>')

    def rect(self, x, y, w, h, fill, stroke=None, sw=1, rx=0, opacity=None):
        s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        r = f' rx="{rx}"' if rx else ""
        o = f' opacity="{opacity}"' if opacity is not None else ""
        self.add(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{fill}"{s}{r}{o}/>')

    def circle(self, x, y, r, fill, stroke=None, sw=1):
        s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
        self.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="{fill}"{s}/>')

    def path(self, d, color=INK, w=1.4, fill="none", dash=None):
        ds = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<path d="{d}" fill="{fill}" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"{ds}/>')

    def poly(self, pts, fill, opacity=None, stroke=None):
        o = f' opacity="{opacity}"' if opacity is not None else ""
        s = f' stroke="{stroke}" stroke-width="1"' if stroke else ""
        self.add(f'<polygon points="{" ".join(f"{f(a)},{f(b)}" for a, b in pts)}" fill="{fill}"{o}{s}/>')

    def arrow(self, x, y, dx, dy, color, w=3, label=None, lx=0, ly=-8, size=12, dash=None):
        L = math.hypot(dx, dy)
        if L < 2:
            return
        ux, uy = dx / L, dy / L
        head = 9
        ex, ey = x + dx - ux * head, y + dy - uy * head
        self.line(x, y, ex, ey, color, w, dash)
        px, py = -uy, ux
        tip = (x + dx, y + dy)
        self.poly([tip, (ex + px * 4.5, ey + py * 4.5), (ex - px * 4.5, ey - py * 4.5)], color)
        if label:
            self.text(x + dx / 2 + lx, y + dy / 2 + ly, label, size, color, italic=True)

    def ground(self, x1, x2, y):
        self.line(x1, y, x2, y, GROUND, 1.6)
        for i in range(int((x2 - x1) // 10)):
            xx = x1 + 6 + i * 10
            self.line(xx, y + 1, xx - 5, y + 6, GROUND, 0.9)

    def block(self, x, y, w=30, h=22, fill=BOX, label=None):
        self.rect(x, y, w, h, fill, "#4a5568", 1, 3)
        if label:
            self.text(x + w / 2, y + h / 2 + 4, label, 11, INK, italic=True)

    def dim(self, x1, x2, y, label, color=MUTED):
        self.line(x1, y - 4, x1, y + 4, color, 0.9)
        self.line(x2, y - 4, x2, y + 4, color, 0.9)
        self.arrow(x1, y, x2 - x1, 0, color, 1, None)
        self.text((x1 + x2) / 2, y + 13, label, 10.5, color, italic=True)

    def bar(self, x, y_bottom, w, h, color, label, value=None):
        self.rect(x, y_bottom - h, w, h, color, opacity=0.85)
        self.text(x + w / 2, y_bottom + 11, label, 10, color, italic=True)
        if value:
            self.text(x + w / 2, y_bottom - h - 4, value, 9.5, color, bold=True)


# ───────────────────────── the 20 cells ─────────────────────────
# Each drawer receives the svg and the cell origin (x, y). Drawing area ≈ (x+8..x+218, y+32..y+140).

def c1(s: Svg, x, y):
    s.ground(x + 14, x + 212, y + 112)
    s.block(x + 40, y + 88, 34, 24, label="m")
    s.block(x + 140, y + 88, 34, 24, label="m")
    s.arrow(x + 74, y + 100, 40, 0, F_RED, 3, "F", 0, -9)
    s.arrow(x + 174, y + 100, 32, 0, F_RED, 3, "F", 0, -9)
    s.dim(x + 57, x + 157, y + 128, "s")
    s.text(x + 113, y + 158, "W = F·s", 14, SECTIONS[0][1], italic=True)
    s.text(x + 113, y + 176, "1 J = 1 N·m", 12, SECTIONS[0][1])
    s.text(x + 113, y + 204, "Η F έχει τη φορά της μετατόπισης.", 10, MUTED, bold=False)


def c2(s: Svg, x, y):
    s.ground(x + 14, x + 212, y + 116)
    bx, by = x + 46, y + 92
    s.block(bx, by, 34, 24, label="m")
    ox, oy = bx + 34, by + 12
    ang = math.radians(35)
    L = 82
    s.arrow(ox, oy, L * math.cos(ang), -L * math.sin(ang), F_RED, 3, None)
    s.text(ox + L * math.cos(ang) + 6, oy - L * math.sin(ang) - 2, "F", 12, F_RED, italic=True)
    s.arrow(ox, oy, L * math.cos(ang), 0, F_RED, 1.8, None, dash="4 3")
    s.line(ox + L * math.cos(ang), oy, ox + L * math.cos(ang), oy - L * math.sin(ang), FAINT, 0.9, "3 3")
    s.text(ox + L * math.cos(ang) / 2 + 6, oy + 13, "F·συνθ", 10.5, F_RED, italic=True)
    s.path(f"M {f(ox + 24)} {f(oy)} A 24 24 0 0 0 {f(ox + 24 * math.cos(ang))} {f(oy - 24 * math.sin(ang))}", MUTED, 1)
    s.text(ox + 31, oy - 6, "θ", 11, MUTED, italic=True)
    s.arrow(x + 150, y + 56, 52, 0, MUTED, 1.4, "s", 0, -7, 11)
    s.text(x + 113, y + 158, "W = F·s·συνθ", 14, SECTIONS[0][1], italic=True)
    s.text(x + 113, y + 176, "θ: γωνία F και s", 11.5, SECTIONS[0][1])
    s.text(x + 113, y + 204, "Έργο κάνει μόνο η συνιστώσα κατά την s.", 10, MUTED, bold=False)


def c3(s: Svg, x, y):
    rows = [
        ("θ < 90°", 0, "W > 0", U_GREEN),
        ("θ = 90°", 90, "W = 0", MUTED),
        ("θ > 90°", 180, "W < 0", F_RED),
    ]
    for i, (lab, a, res, col) in enumerate(rows):
        yy = y + 52 + i * 32
        s.text(x + 14, yy + 4, lab, 10.5, INK, "start")
        s.block(x + 92, yy - 8, 18, 16)
        rad = math.radians({0: 30, 90: 90, 180: 150}[a])
        s.arrow(x + 101, yy, 26 * math.cos(rad), -26 * math.sin(rad), F_RED, 2.4, None)
        s.arrow(x + 134, yy + 1, 26, 0, MUTED, 1.2, None)
        s.text(x + 147, yy - 5, "s", 9.5, MUTED, italic=True)
        s.text(x + 200, yy + 4, res, 11.5, col)
    s.text(x + 113, y + 158, "θ = 180°: W = −F·s", 13, SECTIONS[0][1], italic=True)
    s.text(x + 113, y + 176, "θ = 90°: W = 0", 12, SECTIONS[0][1], italic=True)
    s.text(x + 113, y + 204, "Τριβή: αρνητικό · κάθετη N: μηδέν.", 10, MUTED, bold=False)


def c4(s: Svg, x, y):
    ax, ay = x + 42, y + 44
    bx, by = x + 150, y + 118
    s.ground(x + 14, x + 212, by + 2)
    s.line(ax, ay, bx, by, V_BLUE, 1.6, "5 3")
    s.path(f"M {f(ax)} {f(ay)} C {f(ax + 10)} {f(ay + 70)}, {f(bx - 80)} {f(by - 70)}, {f(bx)} {f(by)}", V_BLUE, 1.6)
    s.circle(ax, ay, 4, INK)
    s.circle(bx, by, 4, INK)
    s.text(ax - 9, ay - 6, "A", 11, INK)
    s.text(bx + 9, by - 6, "B", 11, INK)
    s.line(x + 190, ay, x + 190, by, MUTED, 0.9)
    s.line(x + 185, ay, x + 195, ay, MUTED, 0.9)
    s.line(x + 185, by, x + 195, by, MUTED, 0.9)
    s.text(x + 201, (ay + by) / 2 + 4, "h", 11, MUTED, italic=True)
    s.arrow(x + 166, y + 46, 0, 30, F_RED, 2.6, "mg", -14, 4, 11)
    s.text(x + 113, y + 158, "W_B = +m·g·h (κάθοδος)", 12.5, SECTIONS[0][1], italic=True)
    s.text(x + 113, y + 176, "W_B = −m·g·h (άνοδος)", 12.5, SECTIONS[0][1], italic=True)
    s.text(x + 113, y + 204, "Ίδιο για κάθε δρόμο από A σε B.", 10, MUTED, bold=False)


def c5(s: Svg, x, y):
    s.ground(x + 14, x + 212, y + 110)
    bx, by = x + 86, y + 84
    s.block(bx, by, 40, 26, label="m")
    s.arrow(bx + 20, by, 0, -30, U_GREEN, 2.4, "N", 11, 4, 11)
    s.arrow(bx + 20, by + 26, 0, 30, F_RED, 2.4, None)
    s.text(bx + 34, by + 54, "mg", 11, F_RED, italic=True)
    s.arrow(bx, by + 22, -40, 0, Q_HEAT, 2.8, "T", 0, -7, 11)
    s.arrow(bx + 40, by + 13, 40, 0, F_RED, 2.8, "F", 0, -8, 11)
    s.arrow(x + 150, y + 46, 48, 0, V_BLUE, 1.6, "υ", 0, -7, 11)
    s.text(x + 113, y + 158, "T = μ·N", 13.5, SECTIONS[0][1], italic=True)
    s.text(x + 113, y + 176, "W_T = −T·s", 13.5, SECTIONS[0][1], italic=True)
    s.text(x + 113, y + 204, "Οριζόντιο δάπεδο, F οριζόντια: N = mg.", 10, MUTED, bold=False)


def c6(s: Svg, x, y):
    s.ground(x + 14, x + 120, y + 114)
    s.block(x + 28, y + 88, 40, 24, label="m")
    s.circle(x + 38, y + 114, 3.5, "#4a5568")
    s.circle(x + 58, y + 114, 3.5, "#4a5568")
    s.arrow(x + 72, y + 98, 38, 0, V_BLUE, 2.8, "υ", 0, -8, 12)
    bx = x + 136
    s.bar(bx, y + 118, 22, 18, K_ORANGE, "υ", "K")
    s.bar(bx + 40, y + 118, 22, 72, K_ORANGE, "2υ", "4K")
    s.text(x + 113, y + 158, "K = ½·m·υ^2", 14, SECTIONS[1][1], italic=True)
    s.text(x + 113, y + 176, "πάντα K ≥ 0 (J)", 11.5, SECTIONS[1][1])
    s.text(x + 113, y + 204, "Διπλάσια υ ⇒ τετραπλάσια K.", 10, MUTED, bold=False)


def c7(s: Svg, x, y):
    s.ground(x + 14, x + 212, y + 120)
    s.line(x + 14, y + 120, x + 140, y + 120, U_GREEN, 1, "5 3")
    s.text(x + 30, y + 114, "U = 0", 9.5, U_GREEN, "start")
    s.rect(x + 54, y + 62, 40, 6, "#8a8f99")
    s.line(x + 74, y + 68, x + 74, y + 120, "#8a8f99", 3)
    s.circle(x + 74, y + 52, 10, "#f4a261", "#4a5568")
    s.text(x + 74, y + 56, "m", 10, INK, italic=True)
    s.line(x + 116, y + 52, x + 116, y + 120, MUTED, 0.9)
    s.line(x + 111, y + 52, x + 121, y + 52, MUTED, 0.9)
    s.text(x + 126, y + 90, "h", 11, MUTED, "start", italic=True)
    s.bar(x + 170, y + 118, 22, 66, U_GREEN, "U", "mgh")
    s.text(x + 113, y + 158, "U = m·g·h", 14, SECTIONS[1][1], italic=True)
    s.text(x + 113, y + 176, "W_B = −ΔU", 12.5, SECTIONS[1][1], italic=True)
    s.text(x + 113, y + 204, "Το επίπεδο U = 0 το διαλέγουμε εμείς.", 10, MUTED, bold=False)


def graph_axes(s: Svg, ox, oy, w, h, xl, yl):
    s.arrow(ox, oy, w, 0, INK, 1.2)
    s.arrow(ox, oy, 0, -h, INK, 1.2)
    s.text(ox + w - 2, oy + 13, xl, 10, INK, italic=True)
    s.text(ox - 2, oy - h - 4, yl, 10, INK, italic=True)


def c8(s: Svg, x, y):
    ox, oy = x + 40, y + 124
    graph_axes(s, ox, oy, 160, 80, "x", "F")
    s.poly([(ox, oy), (ox + 120, oy - 62), (ox + 120, oy)], "#9dc7e5", 0.85)
    s.line(ox, oy, ox + 120, oy - 62, V_BLUE, 2)
    s.line(ox + 120, oy - 62, ox + 120, oy, V_BLUE, 0.9, "3 3")
    s.text(ox + 80, oy - 16, "W", 14, "#244d72", italic=True)
    s.text(ox + 120, oy + 12, "x_1", 10, MUTED, italic=True)
    s.text(x + 113, y + 158, "W = εμβαδόν (F–x)", 13, SECTIONS[1][1], italic=True)
    s.text(x + 113, y + 176, "τρίγωνο: W = ½·x_1·F_1", 12, SECTIONS[1][1], italic=True)
    s.text(x + 113, y + 204, "Κάτω από τον άξονα x: αρνητικό έργο.", 10, MUTED, bold=False)


def spring(s: Svg, x1, x2, y, coils=9, amp=7, color=V_BLUE):
    pts = [(x1, y)]
    n = coils * 2
    for i in range(1, n):
        pts.append((x1 + (x2 - x1) * i / n, y + (amp if i % 2 else -amp)))
    pts.append((x2, y))
    s.path("M " + " L ".join(f"{f(a)} {f(b)}" for a, b in pts), color, 1.6)


def c9(s: Svg, x, y):
    s.rect(x + 16, y + 44, 8, 74, "#9c8c7d")
    s.ground(x + 16, x + 212, y + 118)
    s.line(x + 120, y + 40, x + 120, y + 124, FAINT, 0.9, "3 3")
    s.text(x + 120, y + 36, "x = 0", 9, MUTED)
    spring(s, x + 24, x + 152, y + 100, 9)
    s.block(x + 152, y + 88, 30, 24, label="m")
    s.dim(x + 120, x + 152, y + 52, "x")
    s.arrow(x + 167, y + 82, -40, 0, F_RED, 2.6, None)
    s.text(x + 122, y + 86, "F_{ελ}", 10.5, F_RED, "end", italic=True)
    s.text(x + 113, y + 158, "F_{ελ} = −k·x", 13, SECTIONS[1][1], italic=True)
    s.text(x + 113, y + 176, "U_{ελ} = ½·k·x^2", 13, SECTIONS[1][1], italic=True)
    s.text(x + 113, y + 204, "Διπλάσια x ⇒ τετραπλάσια U_{ελ}.", 10, MUTED, bold=False)


def c10(s: Svg, x, y):
    ox, oy = x + 22, y + 120
    graph_axes(s, ox, oy, 78, 74, "x", "F")
    s.rect(ox, oy - 46, 58, 46, "#9dc7e5", opacity=0.85)
    s.line(ox, oy - 46, ox + 58, oy - 46, V_BLUE, 2)
    s.text(ox + 29, oy - 18, "W (J)", 11, "#244d72")
    ox2 = x + 122
    graph_axes(s, ox2, oy, 78, 74, "t", "F")
    s.rect(ox2, oy - 46, 58, 46, "#eed0a1", opacity=0.9)
    s.line(ox2, oy - 46, ox2 + 58, oy - 46, "#a46b29", 2)
    s.text(ox2 + 29, oy - 18, "Δp (N·s)", 10.5, "#805522")
    s.text(x + 113, y + 158, "F–x: εμβαδόν = έργο", 12.5, SECTIONS[1][1])
    s.text(x + 113, y + 176, "F–t: εμβαδόν = ώθηση", 12.5, SECTIONS[1][1])
    s.text(x + 113, y + 204, "Κοίτα πρώτα τι έχει ο οριζόντιος άξονας.", 10, MUTED, bold=False)


def c11(s: Svg, x, y):
    s.ground(x + 14, x + 212, y + 112)
    s.block(x + 26, y + 88, 30, 24, "#d6e4f5", "m")
    s.block(x + 150, y + 88, 30, 24, label="m")
    s.arrow(x + 41, y + 80, 22, 0, V_BLUE, 2.4, "υ_{αρχ}", 6, -7, 10)
    s.arrow(x + 165, y + 80, 44, 0, V_BLUE, 2.4, "υ_{τελ}", 0, -7, 10)
    s.dim(x + 41, x + 165, y + 128, "s")
    s.text(x + 103, y + 60, "W_1 + W_2 + … = ΣW", 10.5, F_RED, italic=True)
    s.text(x + 113, y + 158, "ΣW = K_{τελ} − K_{αρχ}", 13.5, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 176, "ΣW = ΔK", 12.5, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 204, "Βάλε τα έργα ΟΛΩΝ των δυνάμεων.", 10, MUTED, bold=False)


def c12(s: Svg, x, y):
    s.ground(x + 14, x + 120, y + 122)
    s.path(f"M {f(x + 24)} {f(y + 50)} Q {f(x + 70)} {f(y + 50)} {f(x + 100)} {f(y + 122)}", FAINT, 1.2, dash="4 3")
    s.circle(x + 50, y + 54, 9, "#f4a261", "#4a5568")
    s.arrow(x + 60, y + 54, 28, 6, V_BLUE, 2.2, "υ", 0, -8, 11)
    s.line(x + 30, y + 54, x + 30, y + 122, MUTED, 0.9)
    s.text(x + 22, y + 92, "h", 11, MUTED, italic=True)
    bx, base = x + 150, y + 122
    s.rect(bx, base - 46, 30, 46, U_GREEN, opacity=0.85)
    s.rect(bx, base - 66, 30, 20, K_ORANGE, opacity=0.85)
    s.text(bx + 15, base - 19, "U", 11, "#ffffff", italic=True)
    s.text(bx + 15, base - 52, "K", 11, "#ffffff", italic=True)
    s.text(bx + 15, base - 72, "E_{μηχ}", 10.5, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 158, "E_{μηχ} = K + U", 14, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 176, "με ελατήριο: + U_{ελ}", 11.5, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 204, "Άθροισμα κινητικής και δυναμικών.", 10, MUTED, bold=False)


def c13(s: Svg, x, y):
    s.ground(x + 14, x + 120, y + 124)
    s.circle(x + 50, y + 44, 8, "#f4a261", "#4a5568")
    s.line(x + 50, y + 54, x + 50, y + 106, FAINT, 1, "3 4")
    s.circle(x + 50, y + 114, 8, "#f4a261", "#4a5568")
    s.arrow(x + 62, y + 104, 0, 18, V_BLUE, 2.4, None)
    s.text(x + 72, y + 116, "υ", 11, V_BLUE, "start", italic=True)
    s.text(x + 30, y + 80, "h", 11, MUTED, italic=True)
    for i, (u, k, lab) in enumerate([(60, 0, "πάνω"), (30, 30, "μέση"), (0, 60, "κάτω")]):
        bx = x + 126 + i * 30
        base = y + 122
        s.rect(bx, base - u, 20, u, U_GREEN, opacity=0.85)
        s.rect(bx, base - u - k, 20, k, K_ORANGE, opacity=0.85)
        s.text(bx + 10, base + 11, lab, 8.5, MUTED, bold=False)
    s.text(x + 113, y + 158, "K_{αρχ} + U_{αρχ} = K_{τελ} + U_{τελ}", 11.5, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 178, "πτώση: υ = √(2·g·h)", 12.5, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 204, "Ισχύει όταν έργο κάνουν μόνο βάρος/ελατήριο.", 9.5, MUTED, bold=False)


def c14(s: Svg, x, y):
    ax, ay = x + 26, y + 92
    bx, by = x + 120, y + 92
    s.path(f"M {f(ax)} {f(ay)} Q {f((ax + bx) / 2)} {f(ay - 64)} {f(bx)} {f(by)}", V_BLUE, 1.6)
    s.path(f"M {f(ax)} {f(ay)} C {f(ax + 30)} {f(ay + 40)}, {f(bx - 40)} {f(by - 20)}, {f(bx)} {f(by)}", V_BLUE, 1.6, dash="5 3")
    s.circle(ax, ay, 3.5, INK)
    s.circle(bx, by, 3.5, INK)
    s.text(ax - 8, ay + 4, "A", 11)
    s.text(bx + 8, by + 4, "B", 11)
    s.text((ax + bx) / 2, y + 48, "W_1 = W_2", 10.5, V_BLUE, italic=True)
    cx, cy = x + 178, y + 80
    s.path(f"M {f(cx + 24)} {f(cy)} A 24 24 0 1 1 {f(cx + 23.9)} {f(cy - 2)}", U_GREEN, 1.6)
    s.poly([(cx + 24, cy - 6), (cx + 19, cy + 2), (cx + 29, cy + 2)], U_GREEN)
    s.text(cx, cy + 4, "W = 0", 10, U_GREEN)
    s.text(cx, cy + 40, "κλειστή", 9.5, MUTED, bold=False)
    s.text(x + 113, y + 158, "Συντηρητική: W ανεξάρτητο", 11.5, SECTIONS[2][1])
    s.text(x + 113, y + 176, "της διαδρομής (βάρος, ελατήριο)", 11, SECTIONS[2][1])
    s.text(x + 113, y + 204, "Τριβή: μη συντηρητική, W εξαρτάται.", 10, MUTED, bold=False)


def c15(s: Svg, x, y):
    s.ground(x + 14, x + 120, y + 112)
    s.block(x + 46, y + 88, 30, 24, label="m")
    s.arrow(x + 46, y + 106, -28, 0, Q_HEAT, 2.6, "T", 0, -7, 11)
    s.arrow(x + 80, y + 78, 34, 0, V_BLUE, 2.2, "υ", 0, -7, 11)
    for i in range(3):
        xx = x + 54 + i * 8
        s.path(f"M {f(xx)} {f(y + 84)} q 3 -5 0 -10 q -3 -5 0 -10", Q_HEAT, 1)
    base = y + 122
    s.rect(x + 140, base - 64, 24, 64, "#7a5bb4", opacity=0.85)
    s.text(x + 152, base + 11, "E_{αρχ}", 9.5, "#6b3fa0", italic=True)
    s.rect(x + 178, base - 42, 24, 42, "#7a5bb4", opacity=0.85)
    s.rect(x + 178, base - 64, 24, 22, Q_HEAT, opacity=0.8)
    s.text(x + 190, base - 49, "Q", 10.5, "#ffffff", italic=True)
    s.text(x + 190, base + 11, "E_{τελ}", 9.5, "#6b3fa0", italic=True)
    s.text(x + 113, y + 158, "W_T = E_{τελ} − E_{αρχ}", 13, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 176, "Q = |W_T| = T·s", 12.5, SECTIONS[2][1], italic=True)
    s.text(x + 113, y + 204, "Η E_{μηχ} μειώνεται, η ολική διατηρείται.", 10, MUTED, bold=False)


def crane(s: Svg, x, y, hook_y, mass_label="m", mast=74):
    s.rect(x, y, 6, mast, "#846b58")
    s.rect(x, y, 50, 5, "#846b58")
    s.circle(x + 50, y + 4, 4.5, "#e7d7c6", "#846b58", 1.4)
    s.line(x + 50, y + 8, x + 50, hook_y, "#7a7068", 1.2)
    s.block(x + 38, hook_y, 24, 18, label=mass_label)


def c16(s: Svg, x, y):
    s.ground(x + 14, x + 212, y + 122)
    crane(s, x + 22, y + 48, y + 66)
    s.text(x + 66, y + 44, "Δt = 2 s", 10, F_RED, bold=True)
    crane(s, x + 120, y + 48, y + 66)
    s.text(x + 164, y + 44, "Δt = 4 s", 10, V_BLUE, bold=True)
    s.text(x + 60, y + 112, "2P", 12, F_RED, italic=True)
    s.text(x + 158, y + 112, "P", 12, V_BLUE, italic=True)
    s.text(x + 113, y + 158, "P_μ = W/Δt", 14, SECTIONS[3][1], italic=True)
    s.text(x + 113, y + 176, "1 W = 1 J/s", 12, SECTIONS[3][1])
    s.text(x + 113, y + 204, "Ίδιο έργο σε μισό χρόνο ⇒ διπλάσια ισχύς.", 10, MUTED, bold=False)


def c17(s: Svg, x, y):
    s.ground(x + 14, x + 212, y + 116)
    s.path(
        f"M {f(x + 50)} {f(y + 108)} L {f(x + 50)} {f(y + 92)} L {f(x + 72)} {f(y + 92)} L {f(x + 84)} {f(y + 80)} "
        f"L {f(x + 116)} {f(y + 80)} L {f(x + 128)} {f(y + 92)} L {f(x + 140)} {f(y + 94)} L {f(x + 140)} {f(y + 108)} Z",
        "#4a5568", 1.2, "#9fc3ef",
    )
    s.circle(x + 70, y + 109, 7, "#2b3545")
    s.circle(x + 122, y + 109, 7, "#2b3545")
    s.arrow(x + 140, y + 100, 46, 0, F_RED, 3, "F", 0, -8, 12)
    s.arrow(x + 96, y + 64, 50, 0, V_BLUE, 2.4, "υ", 0, -7, 12)
    s.text(x + 113, y + 158, "P = F·υ", 14, SECTIONS[3][1], italic=True)
    s.text(x + 113, y + 176, "πλάγια F: P = F·υ·συνθ", 11.5, SECTIONS[3][1], italic=True)
    s.text(x + 113, y + 204, "Ισχύς τη στιγμή που η ταχύτητα είναι υ.", 10, MUTED, bold=False)


def c18(s: Svg, x, y):
    yy = y + 70
    s.poly([(x + 18, yy - 20), (x + 96, yy - 20), (x + 96, yy + 20), (x + 18, yy + 20)], "#c9b3e6", 0.9)
    s.text(x + 52, yy + 4, "E_{εισ}", 11.5, "#4b2c7a", italic=True)
    s.poly([(x + 96, yy - 20), (x + 196, yy - 20), (x + 208, yy - 6), (x + 196, yy + 8), (x + 96, yy + 8)], "#8fd1a6", 0.95)
    s.text(x + 150, yy - 3, "E_{ωφ}", 11.5, "#1d6b3c", italic=True)
    s.path(
        f"M {f(x + 96)} {f(yy + 8)} L {f(x + 110)} {f(yy + 8)} Q {f(x + 130)} {f(yy + 10)} {f(x + 132)} {f(yy + 40)} "
        f"L {f(x + 138)} {f(yy + 40)} L {f(x + 124)} {f(yy + 56)} L {f(x + 110)} {f(yy + 40)} L {f(x + 116)} {f(yy + 40)} "
        f"Q {f(x + 114)} {f(yy + 22)} {f(x + 96)} {f(yy + 20)} Z",
        Q_HEAT, 0.8, "#f1b3a8",
    )
    s.text(x + 160, yy + 48, "απώλειες", 10, Q_HEAT, bold=True)
    s.text(x + 113, y + 158, "η = E_{ωφ}/E_{εισ} = P_{ωφ}/P_{εισ}", 12, SECTIONS[3][1], italic=True)
    s.text(x + 113, y + 176, "E_{εισ} = E_{ωφ} + απώλειες", 11.5, SECTIONS[3][1], italic=True)
    s.text(x + 113, y + 204, "Πάντα η < 1, δηλαδή κάτω από 100%.", 10, MUTED, bold=False)


def c19(s: Svg, x, y):
    s.ground(x + 14, x + 212, y + 124)
    s.rect(x + 40, y + 34, 8, 90, "#846b58")
    s.rect(x + 40, y + 34, 90, 6, "#846b58")
    s.circle(x + 128, y + 38, 5, "#e7d7c6", "#846b58", 1.4)
    s.line(x + 128, y + 43, x + 128, y + 66, "#7a7068", 1.2)
    s.block(x + 114, y + 66, 28, 22, label="m")
    s.line(x + 114, y + 102, x + 142, y + 102, FAINT, 1, "3 3")
    s.arrow(x + 154, y + 100, 0, -34, V_BLUE, 2.4, "υ", 9, 0, 11)
    s.arrow(x + 102, y + 68, 0, -26, F_RED, 2.4, "F", -9, 0, 11)
    s.arrow(x + 102, y + 88, 0, 26, F_RED, 2.4, None)
    s.text(x + 88, y + 112, "mg", 10.5, F_RED, italic=True)
    s.line(x + 190, y + 66, x + 190, y + 124, MUTED, 0.9)
    s.text(x + 198, y + 98, "h", 11, MUTED, "start", italic=True)
    s.text(x + 113, y + 158, "W_{ωφ} = m·g·h", 13, SECTIONS[3][1], italic=True)
    s.text(x + 113, y + 176, "P = m·g·h/Δt = m·g·υ", 12, SECTIONS[3][1], italic=True)
    s.text(x + 113, y + 204, "Σταθερή υ ⇒ F = mg.", 10, MUTED, bold=False)


def c20(s: Svg, x, y):
    cx, cy = x + 62, y + 72
    s.circle(cx, cy, 20, "#fff4c2", "#c9a227", 1.4)
    s.path(f"M {f(cx - 7)} {f(cy + 6)} q 3 -10 7 0 q 4 -10 7 0", "#c9a227", 1.2)
    s.rect(cx - 9, cy + 19, 18, 12, "#9aa3b2", "#4a5568", 1, 2)
    for a in range(-60, 241, 50):
        r = math.radians(a)
        s.line(cx + 26 * math.cos(r), cy - 26 * math.sin(r), cx + 34 * math.cos(r), cy - 34 * math.sin(r), "#e3b23c", 1.3)
    s.text(cx, cy + 50, "100 W · 5 h", 10.5, INK)
    s.text(x + 162, y + 62, "0,1 kW × 5 h", 11, MUTED, bold=False)
    s.text(x + 162, y + 80, "= 0,5 kWh", 12, K_ORANGE)
    s.text(x + 162, y + 98, "= 1,8·10^6 J", 11, K_ORANGE)
    s.text(x + 113, y + 158, "P = V·I · E = P·t", 13, SECTIONS[3][1], italic=True)
    s.text(x + 113, y + 176, "1 kWh = 3,6·10^6 J", 12, SECTIONS[3][1])
    s.text(x + 113, y + 204, "kW: μονάδα ισχύος · kWh: ενέργειας.", 10, MUTED, bold=False)


CELLS = [
    ("Έργο σταθερής δύναμης", c1),
    ("Πλάγια δύναμη", c2),
    ("Πρόσημο του έργου", c3),
    ("Έργο του βάρους", c4),
    ("Έργο της τριβής", c5),
    ("Κινητική ενέργεια", c6),
    ("Βαρυτική δυναμική", c7),
    ("Μεταβλητή δύναμη", c8),
    ("Ελατήριο", c9),
    ("Διάγραμμα F–x ή F–t;", c10),
    ("ΘΜΚΕ", c11),
    ("Μηχανική ενέργεια", c12),
    ("ΑΔΜΕ – ελεύθερη πτώση", c13),
    ("Συντηρητικές δυνάμεις", c14),
    ("Απώλειες με τριβή", c15),
    ("Μέση ισχύς", c16),
    ("Στιγμιαία ισχύς", c17),
    ("Βαθμός απόδοσης", c18),
    ("Ανύψωση με γερανό", c19),
    ("Ηλεκτρική ενέργεια", c20),
]


def cell(s: Svg, n: int, x: float, y: float, color: str):
    title, draw = CELLS[n - 1]
    s.rect(x, y, CELL_W, CELL_H, "#ffffff", "#d6dae1", 1, 7)
    s.circle(x + 15, y + 15, 10, color)
    s.text(x + 15, y + 19.5, str(n), 12, "#ffffff")
    s.text(x + 30, y + 20, title, 13.5, INK, "start")
    draw(s, x, y)


def section_frame(s: Svg, x, y, w, h, title, color, bg, size=16):
    s.rect(x, y, w, h, bg, color, 1.5, 10)
    s.rect(x, y, w, 30, color, rx=10)
    s.rect(x, y + 20, w, 10, color)
    s.text(x + 12, y + 21, title, size, "#ffffff", "start")


FOOT_1 = "Σύμβολα: W έργο (J) • K κινητική • U δυναμική • E_{μηχ} = K + U • T τριβή • N κάθετη αντίδραση • Q θερμότητα • P ισχύς (W) • η απόδοση • g = 10 m/s^2"
FOOT_2 = "Πριν από κάθε άσκηση: ποιες δυνάμεις κάνουν έργο; Μόνο βάρος/ελατήριο ⇒ ΑΔΜΕ. Υπάρχει τριβή ⇒ ΘΜΚΕ ή W_T = ΔE_{μηχ}."


def header(s: Svg, w: float):
    s.text(w / 2, 52, "ΕΡΓΟ – ΕΝΕΡΓΕΙΑ – ΙΣΧΥΣ · ΤΥΠΟΛΟΓΙΟ", 38, "#14306b", bold=True)
    s.text(w / 2, 84, "20 περιπτώσεις • σχολικό βιβλίο και τα 20 διαγράμματα • Φυσική Β΄ Λυκείου", 18, "#1e5fb4")
    s.text(w / 2, 104, "Βήματα: σχήμα με δυνάμεις → έργο κάθε δύναμης (W = F·s·συνθ) → ΘΜΚΕ ή ΑΔΜΕ → ισχύς P = W/Δt", 13, MUTED, bold=False)


def screen_poster() -> tuple[str, int, int]:
    W = 1212
    s = Svg()
    header(s, W)
    for i, (title, color, bg) in enumerate(SECTIONS):
        y0 = 112 + 256 * i
        section_frame(s, 14, y0, 1184, 250, title, color, bg)
        for col in range(5):
            n = i * 5 + col + 1
            cell(s, n, 17 + 238 * col, 146 + 256 * i, color)
    y = 112 + 256 * 4
    s.text(W / 2, y + 22, FOOT_1, 13, MUTED, bold=False)
    s.text(W / 2, y + 44, FOOT_2, 13, INK)
    s.text(W / 2, y + 72, "Physics Workspace • Μιχάλης", 11, FAINT, bold=False)
    H = y + 82
    return wrap(s, W, H), W, H


def a4_poster() -> tuple[str, int, int]:
    """One column per section: 4 columns × 5 cells, close to the A4 portrait ratio."""
    colw = CELL_W + 12
    W = 14 * 2 + colw * 4 + 6 * 3
    s = Svg()
    s.text(W / 2, 46, "ΕΡΓΟ – ΕΝΕΡΓΕΙΑ – ΙΣΧΥΣ · ΤΥΠΟΛΟΓΙΟ", 34, "#14306b", bold=True)
    s.text(W / 2, 74, "20 περιπτώσεις • Φυσική Β΄ Λυκείου • g = 10 m/s^2", 16, "#1e5fb4")
    s.text(W / 2, 94, "σχήμα με δυνάμεις → έργο κάθε δύναμης → ΘΜΚΕ ή ΑΔΜΕ → ισχύς", 12.5, MUTED, bold=False)
    top = 108
    for i, (title, color, bg) in enumerate(SECTIONS):
        x0 = 14 + i * (colw + 6)
        h = 36 + 5 * (CELL_H + 6) + 2
        section_frame(s, x0, top, colw, h, title, color, bg, 13.5)
        for r in range(5):
            n = i * 5 + r + 1
            cell(s, n, x0 + 6, top + 36 + r * (CELL_H + 6), color)
    y = top + 36 + 5 * (CELL_H + 6) + 2
    s.text(W / 2, y + 22, "W έργο (J) • K κινητική • U δυναμική • E_{μηχ} = K + U • T τριβή • N κάθετη αντίδραση • Q θερμότητα • P ισχύς (W) • η απόδοση", 11.5, MUTED, bold=False)
    s.text(W / 2, y + 42, FOOT_2, 11.5, INK)
    H = y + 56
    return wrap(s, W, H), W, H


def wrap(s: Svg, W: int, H: int) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        f"font-family=\"Inter, 'Segoe UI', Roboto, Arial, sans-serif\">\n"
        f'<rect width="{W}" height="{H}" fill="#fbfaf7"/>\n' + "\n".join(p for p in s.parts if p) + "\n</svg>\n"
    )


if __name__ == "__main__":
    svg, w, h = screen_poster()
    (OUT / "ergo-typologio.svg").write_text(svg, encoding="utf-8")
    print("screen", w, h)
    svg, w, h = a4_poster()
    (OUT / "ergo-typologio-A4.svg").write_text(svg, encoding="utf-8")
    print("a4", w, h, round(h / w, 3))
