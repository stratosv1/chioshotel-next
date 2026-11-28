#!/usr/bin/env python3
"""Adds section 12 «Διαγράμματα δυνάμεων στην κρούση» (boxes 54–64) to the ormi formula poster.

  python3 scripts/mixalis/ormi_poster_fbd.py

The original ormi poster has no generator in the repo, so this script patches
public/mixalis/ormi-typologio.svg in place: everything between the FBD markers is
replaced, so it is safe to run again. It also rebuilds page 3 of the A4 PDF
(public/mixalis/ormi-typologio-A4.pdf) from the same drawings.

Cell geometry must match `cells` in app/mixalis/(private)/ormi/page.tsx:
boxes 54–64 sit in rows 12–14 (y = 146 + 256·11, ·12, ·13); row 14 also holds a rules panel.
"""

from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ergo_poster import F_RED, GROUND, INK, MUTED, V_BLUE, Svg  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
SVG_PATH = ROOT / "public" / "mixalis" / "ormi-typologio.svg"
PDF_PATH = ROOT / "public" / "mixalis" / "ormi-typologio-A4.pdf"

START, END = "<!-- fbd-start -->", "<!-- fbd-end -->"
OLD_H = 3000  # height of the poster before section 12
SEC_Y = 2928  # frame top of section 12
COLOR, BG = "#455a64", "#eef2f4"
TITLE = "12. ΔΙΑΓΡΑΜΜΑΤΑ ΔΥΝΑΜΩΝ ΣΤΗΝ ΚΡΟΥΣΗ: ΑΠΟΜΟΝΩΝΩ ΤΟ ΣΩΜΑ"
P_GREEN = "#1f9d55"
K_ORANGE = "#e08a1e"
BALL = "#f4a261"
EDGE = "#4a5568"
B1, B2 = "#9fb3c8", "#f2c46d"
CELL_W, CELL_H = 226, 212


class S(Svg):
    """Svg with the poster's ball / wall / divider vocabulary, drawn relative to a cell origin."""

    def __init__(self) -> None:
        super().__init__()
        self.ox = 0.0
        self.oy = 0.0

    # local → absolute
    def at(self, x: float, y: float) -> tuple[float, float]:
        return self.ox + x, self.oy + y

    def T(self, x, y, s, size=11, color=INK, anchor="middle", bold=True, italic=False):
        X, Y = self.at(x, y)
        self.text(X, Y, s, size, color, anchor, bold, italic)

    def A(self, x, y, dx, dy, color, w=2.6, label=None, lx=0, ly=-8, size=11.5):
        X, Y = self.at(x, y)
        self.arrow(X, Y, dx, dy, color, w, label, lx, ly, size)

    def ball(self, x, y, r=9, fill=BALL):
        X, Y = self.at(x, y)
        self.circle(X, Y, r, fill, EDGE, 1.2)

    def box(self, x, y, w, h, fill, label=None, size=11):
        X, Y = self.at(x, y)
        self.rect(X, Y, w, h, fill, EDGE, 1.2, 3)
        if label:
            self.text(X + w / 2, Y + h / 2 + size * 0.36, label, size, INK, italic=True)

    def floor(self, x1, x2, y):
        X1, Y = self.at(x1, y)
        X2, _ = self.at(x2, y)
        self.ground(X1, X2, Y)

    def wall(self, x, y1, y2):
        X, Y1 = self.at(x, y1)
        _, Y2 = self.at(x, y2)
        self.line(X, Y1, X, Y2, GROUND, 2)
        k = 0
        while Y1 + 6 + k * 8 <= Y2:
            yy = Y1 + 6 + k * 8
            self.line(X + 1, yy, X + 6, yy - 5, GROUND, 0.9)
            k += 1

    def L(self, x1, y1, x2, y2, color=MUTED, w=1, dash=None):
        X1, Y1 = self.at(x1, y1)
        X2, Y2 = self.at(x2, y2)
        self.line(X1, Y1, X2, Y2, color, w, dash)

    def split(self, left_caption=True, right_caption="μόνο το σώμα"):
        """Left half: the setup. Right half: the isolated body with only its forces."""
        self.L(120, 32, 120, 120, "#c5cbd3", 1, "3 3")
        if left_caption:
            self.T(62, 41, "σχήμα", 9, MUTED, bold=False)
        self.T(172, 41, right_caption, 9, F_RED if right_caption == "μόνο το σώμα" else K_ORANGE, bold=True)

    def plus(self, x, y, dx=18, dy=0, label="+"):
        self.A(x, y, dx, dy, MUTED, 1, None)
        self.T(x + dx / 2 + (0 if dx else 7), y + dy / 2 + (-4 if dx else 3), label, 9, MUTED, bold=False)


# ───────────────────────── the 10 cells ─────────────────────────
# Local coordinates: cell 226×212, drawing area y 32..122, text from y 134.


def c54(s: S):  # ball hits a wall and bounces back slower
    s.split()
    s.wall(104, 48, 114)
    s.T(14, 62, "πριν", 9, MUTED, "start", bold=False)
    s.ball(52, 72)
    s.A(63, 72, 30, 0, V_BLUE, label="υ", ly=-7)
    s.T(14, 92, "μετά", 9, MUTED, "start", bold=False)
    s.ball(90, 104)
    s.A(79, 104, -20, 0, V_BLUE, label="υ′", ly=-7)
    s.ball(190, 82, 11)
    s.A(178, 82, -40, 0, F_RED, 3.2, "C", ly=-8, size=13)
    s.T(172, 112, "μόνο οριζόντια", 9.5, MUTED, bold=False)


def c55(s: S):  # bounces back with the same speed
    s.split()
    s.wall(104, 48, 114)
    s.ball(52, 72)
    s.A(63, 72, 30, 0, V_BLUE, label="+υ", ly=-7)
    s.ball(90, 104)
    s.A(79, 104, -30, 0, V_BLUE, label="−υ", ly=-7)
    s.ball(196, 82, 11)
    s.A(184, 82, -54, 0, F_RED, 3.6, "C", ly=-8, size=13)
    s.T(172, 112, "διπλάσια Δp", 9.5, P_GREEN)


def c56(s: S):  # stops without rebound (clay)
    s.split()
    s.wall(104, 48, 114)
    s.ball(44, 70, 9, "#b08968")
    s.A(55, 70, 30, 0, V_BLUE, label="υ", ly=-7)
    X, Y = s.at(98, 102)
    s.add(f'<ellipse cx="{X:.1f}" cy="{Y:.1f}" rx="5" ry="10" fill="#b08968" stroke="{EDGE}" stroke-width="1.2"/>')
    s.T(70, 106, "υ′ = 0", 10, V_BLUE, italic=True)
    s.ball(190, 82, 11, "#b08968")
    s.A(178, 82, -27, 0, F_RED, 3, "C", ly=-8, size=13)
    s.T(172, 112, "μισή από το 55", 9.5, MUTED, bold=False)


def c57(s: S):  # longer stopping time: cushion
    s.split()
    s.wall(108, 48, 114)
    X, Y = s.at(92, 52)
    s.add(
        f'<path d="M{X:.1f},{Y:.1f} q-6,7 0,14 q-6,7 0,14 q-6,7 0,14 q-6,7 0,14 l16,0 l0,-56 z" '
        f'fill="#cfe3c8" stroke="{EDGE}" stroke-width="1"/>'
    )
    s.T(84, 122, "μαξιλάρι", 9, MUTED, bold=False)
    s.ball(44, 80)
    s.A(55, 80, 26, 0, V_BLUE, label="υ", ly=-7)
    s.T(204, 57, "σκληρό", 9, MUTED, bold=False)
    s.ball(204, 70, 9)
    s.A(194, 70, -48, 0, F_RED, 3.4, "C", ly=-7, size=12)
    s.T(204, 95, "μαλακό", 9, MUTED, bold=False)
    s.ball(204, 108, 9)
    s.A(194, 108, -14, 0, F_RED, 3, "C", ly=12, size=12)


def c58(s: S):  # two blocks: action–reaction contact pair
    s.split()
    s.floor(10, 112, 104)
    s.box(18, 82, 26, 22, B1, "A")
    s.A(46, 76, 22, 0, V_BLUE, label="υ", ly=-6)
    s.box(78, 82, 26, 22, B2, "B")
    s.box(150, 56, 24, 20, B1, "A", 10.5)
    s.A(150, 66, -24, 0, F_RED, 3, "C", ly=-7, size=12)
    s.box(164, 90, 24, 20, B2, "B", 10.5)
    s.A(188, 100, 24, 0, F_RED, 3, "C", ly=-7, size=12)
    s.T(172, 122, "ίσες και αντίθετες", 9, MUTED, bold=False)


def c59(s: S):  # unequal masses, equal contact force
    s.split()
    s.floor(10, 112, 104)
    s.box(20, 88, 18, 16, B1, "m", 10)
    s.A(40, 80, 22, 0, V_BLUE, label="υ", ly=-6)
    s.box(70, 72, 38, 32, B2, "M", 12)
    s.box(186, 50, 18, 16, B1, "m", 10)
    s.A(186, 58, -28, 0, F_RED, 3, "C", ly=-7, size=12)
    s.A(206, 76, -36, 0, MUTED, 1.4, "μεγάλη α", ly=11, size=9)
    s.box(140, 92, 34, 22, B2, "M", 12)
    s.A(174, 103, 26, 0, F_RED, 3, "C", ly=-7, size=12)
    s.A(150, 118, 10, 0, MUTED, 1.4)
    s.T(188, 121, "μικρή α", 9, MUTED, bold=False)


def c60(s: S):  # ball strikes the floor (weight included)
    s.split()
    s.floor(14, 112, 110)
    s.ball(52, 101)
    s.A(80, 52, 0, 34, V_BLUE, label="υ", lx=10, ly=4)
    s.A(98, 88, 0, -26, V_BLUE, label="υ′", lx=10, ly=4)
    s.ball(172, 86, 11)
    s.A(172, 75, 0, -32, F_RED, 3.4, "N", lx=10, ly=-6, size=13)
    s.A(172, 97, 0, 18, F_RED, 2.4, "mg", lx=14, ly=8, size=11)
    s.plus(204, 104, 0, -18, "+")


def c61(s: S):  # steady braking by friction
    s.split()
    X1, Y = s.at(10, 104)
    X2, _ = s.at(112, 104)
    s.line(X1, Y, X2, Y, GROUND, 2.4)
    s.ground(X1, X2, Y)
    s.box(38, 80, 32, 24, B2, "m")
    s.A(74, 74, 26, 0, V_BLUE, label="υ", ly=-6)
    s.T(62, 120, "τραχύ, μ", 9, MUTED, bold=False)
    s.box(158, 70, 30, 24, B2, "m", 11)
    s.A(173, 70, 0, -24, F_RED, 2.6, "N", lx=9, ly=-4, size=11)
    s.A(173, 94, 0, 24, F_RED, 2.6, "mg", lx=13, ly=6, size=11)
    s.A(158, 88, -26, 0, K_ORANGE, 3, "T", ly=-7, size=12)


def c62(s: S):  # catching a falling ball
    s.split()
    X, Y = s.at(34, 98)
    s.add(
        f'<path d="M{X:.1f},{Y:.1f} q20,14 52,0 l4,-6 q3,-4 -2,-5 l-6,4 q-20,9 -44,1 z" '
        f'fill="#f1c9a5" stroke="{EDGE}" stroke-width="1.1"/>'
    )
    s.ball(60, 84)
    s.A(84, 46, 0, 30, V_BLUE, label="υ", lx=10, ly=4)
    s.T(60, 118, "τελική υ = 0", 9, MUTED, bold=False)
    s.ball(170, 84, 11)
    s.A(170, 73, 0, -28, F_RED, 3.4, "C", lx=10, ly=-6, size=13)
    s.A(170, 95, 0, 18, F_RED, 2.4, "mg", lx=14, ly=8, size=11)
    s.plus(204, 104, 0, -18, "+")


def c63(s: S):  # system A+B: internal forces drop out
    s.split()
    s.floor(10, 112, 104)
    X, Y = s.at(12, 66)
    s.rect(X, Y, 98, 34, "none", MUTED, 1, 4)
    s.T(61, 60, "σύστημα", 9, MUTED, bold=False)
    s.box(20, 80, 24, 22, B1, "A", 10.5)
    s.A(46, 74, 18, 0, V_BLUE, 2.2, None)
    s.box(76, 80, 24, 22, B2, "B", 10.5)
    s.box(150, 70, 44, 24, "#d9c9a3", "A+B", 10.5)
    s.A(172, 70, 0, -22, F_RED, 2.6, "N_{ολ}", lx=14, ly=-2, size=10.5)
    s.A(172, 94, 0, 18, F_RED, 2.6, "m_{ολ}g", lx=19, ly=4, size=10.5)
    s.T(172, 122, "καμία οριζόντια", 9, MUTED, bold=False)


def c64(s: S):  # hammer hits the knife, the potato "climbs" the blade
    s.split(left_caption=False)
    # hammer head and the blow
    s.box(40, 30, 34, 12, "#9aa3b2")
    s.A(57, 42, 0, 12, F_RED, 3, None)
    s.T(90, 40, "σφυρί", 9, F_RED, bold=True)
    # knife: handle on top, blade pointing down
    X, Y = s.at(52, 56)
    s.rect(X, Y, 10, 22, "#7a5a3a", EDGE, 1, 2)
    bx, by = s.at(52, 78)
    s.poly([(bx, by), (bx + 10, by), (bx + 8, by + 38), (bx + 2, by + 44)], "#d6dae1", stroke=EDGE)
    # potato on the blade
    X, Y = s.at(57, 102)
    s.add(f'<ellipse cx="{X:.1f}" cy="{Y:.1f}" rx="21" ry="10" fill="#c9a06a" stroke="{EDGE}" stroke-width="1.2"/>')
    s.A(96, 64, 0, 36, V_BLUE, 2.6, "3 m/s", lx=18, ly=2, size=9.5)
    s.T(96, 118, "μαχαίρι", 9, MUTED, bold=False)
    # isolated potato: weight and friction, both down; nothing from the hammer
    X, Y = s.at(172, 70)
    s.add(f'<ellipse cx="{X:.1f}" cy="{Y:.1f}" rx="22" ry="11" fill="#c9a06a" stroke="{EDGE}" stroke-width="1.2"/>')
    s.A(162, 81, 0, 18, F_RED, 2.4, "mg", lx=-13, ly=8, size=10.5)
    s.A(182, 81, 0, 24, K_ORANGE, 3, "T", lx=10, ly=6, size=11.5)
    s.T(172, 118, "όχι δύναμη σφυριού", 8.5, MUTED, bold=False)


def fish(s: S, x, y, rx, ry, fill, label=None, size=10):
    """Fish facing right: body ellipse, tail on the left, an eye."""
    X, Y = s.at(x, y)
    s.poly([(X - rx + 2, Y), (X - rx - ry * 1.1, Y - ry), (X - rx - ry * 1.1, Y + ry)], fill, stroke=EDGE)
    s.add(f'<ellipse cx="{X:.1f}" cy="{Y:.1f}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{EDGE}" stroke-width="1.2"/>')
    s.circle(X + rx * 0.55, Y - ry * 0.3, 1.6, INK)
    if label:
        s.text(X - rx * 0.15, Y + size * 0.36, label, size, INK, italic=True)


def c65(s: S):  # the big fish swallows the small one (Τριπολίτης)
    s.split()
    X, Y = s.at(6, 50)
    s.rect(X, Y, 110, 66, "#e8f3fb", "none", 0, 6)
    fish(s, 44, 90, 22, 11, "#7fa7c9", "M", 11)
    s.A(36, 70, 26, 0, V_BLUE, 2.4, "0,6", ly=-5, size=9.5)
    fish(s, 96, 90, 9, 5, "#f2c46d")
    s.A(92, 76, 6, 0, V_BLUE, 2, "0,1", ly=-5, size=9.5)
    s.T(60, 112, "ίδια φορά", 9, MUTED, bold=False)
    # each fish alone, during the 2 s of swallowing
    fish(s, 150, 58, 9, 5, "#f2c46d")
    s.A(160, 58, 26, 0, F_RED, 2.8, "F", ly=-6, size=11.5)
    fish(s, 192, 98, 20, 10, "#7fa7c9", "M", 10.5)
    s.A(170, 98 - 14, -26, 0, F_RED, 2.8, "F", ly=-6, size=11.5)
    s.T(156, 120, "ίσες, αντίθετες", 8.5, MUTED, bold=False)


def c66(s: S):  # friction, plastic collision, then up a rough quarter circle (Τριπολίτης)
    s.split()
    gy = 104
    X1, Y = s.at(8, gy)
    X2, _ = s.at(56, gy)
    s.line(X1, Y, X2, Y, GROUND, 2.4)
    s.ground(X1, X2, Y)
    s.L(56, gy, 86, gy, GROUND, 1.6)
    X, Y = s.at(86, gy - 26)
    s.add(f'<path d="M{X:.1f},{Y + 26:.1f} A26,26 0 0 0 {X + 26:.1f},{Y:.1f}" fill="none" stroke="{GROUND}" stroke-width="2"/>')
    s.box(14, 90, 14, 14, B1, "A", 9.5)
    s.A(30, 84, 13, 0, V_BLUE, 2, "10", ly=-5, size=9)
    s.box(46, 92, 12, 12, B2, "B", 9)
    s.A(72, 98, -11, 0, V_BLUE, 2, "1", ly=-6, size=9)
    s.T(32, 118, "μ = 0,2", 8.5, MUTED, bold=False)
    s.T(76, 118, "λείο", 8.5, MUTED, bold=False)
    s.T(106, 72, "R", 9.5, MUTED, bold=True)
    s.A(112, 64, 0, -14, V_BLUE, 1.8, "√2", lx=-9, ly=0, size=8.5)
    # isolated block on the quarter circle (centre at 136,50, R = 62, block at 45°)
    cx, cy, R = 136, 50, 62
    X, Y = s.at(cx, cy)
    s.add(f'<path d="M{X:.1f},{Y + R:.1f} A{R},{R} 0 0 0 {X + R:.1f},{Y:.1f}" fill="none" stroke="#c5cbd3" stroke-width="1.4" stroke-dasharray="4 3"/>')
    bx, by = cx + R * 0.707, cy + R * 0.707
    X, Y = s.at(bx, by)
    s.add(f'<rect x="{X - 8:.1f}" y="{Y - 8:.1f}" width="16" height="16" fill="#d9c9a3" stroke="{EDGE}" stroke-width="1.2" transform="rotate(-45 {X:.1f} {Y:.1f})"/>')
    s.A(bx - 8, by - 8, -17, -17, F_RED, 2.6, "N", lx=-6, ly=-2, size=11)
    s.A(bx, by + 10, 0, 20, F_RED, 2.4, "mg", lx=13, ly=6, size=10)
    s.A(bx - 10, by + 10, -14, 14, K_ORANGE, 2.8, "T", lx=-6, ly=8, size=11)


def c67(s: S):  # bullet embeds in a block on a smooth floor (Τριπολίτης)
    s.split()
    s.floor(8, 114, 104)
    s.box(66, 78, 40, 26, "#c9a06a", "M", 11)
    X, Y = s.at(20, 89)
    s.rect(X, Y, 12, 5, "#5d6470", EDGE, 1, 2)
    s.A(36, 91, 22, 0, V_BLUE, 2.2, "200 m/s", ly=-6, size=9)
    s.T(86, 118, "λείο", 8.5, MUTED, bold=False)
    # each body alone during the penetration
    X, Y = s.at(150, 58)
    s.rect(X, Y, 14, 6, "#5d6470", EDGE, 1, 2)
    s.A(148, 61, -24, 0, F_RED, 2.8, "F", ly=-6, size=11.5)
    s.box(168, 80, 34, 24, "#c9a06a", "M", 10.5)
    s.A(202, 92, 18, 0, F_RED, 2.8, "F", ly=-6, size=11.5)
    s.T(172, 118, "ίσες, αντίθετες", 8.5, MUTED, bold=False)


def c68(s: S):  # bullet passes through a block and loses 75 % of its K (Τριπολίτης)
    s.split()
    s.floor(8, 114, 104)
    s.box(50, 78, 26, 26, "#c9a06a", "M", 11)
    X, Y = s.at(12, 89)
    s.rect(X, Y, 10, 4, "#5d6470", EDGE, 1, 2)
    s.A(24, 91, 20, 0, V_BLUE, 2.2, "100", ly=-6, size=9)
    X, Y = s.at(84, 89)
    s.rect(X, Y, 10, 4, "#5d6470", EDGE, 1, 2)
    s.A(96, 91, 12, 0, V_BLUE, 2.2, "50", ly=-6, size=9)
    s.A(63, 70, 8, 0, V_BLUE, 1.8, "V", ly=-5, size=9)
    s.T(62, 118, "βγαίνει από την άλλη", 8.5, MUTED, bold=False)
    X, Y = s.at(150, 58)
    s.rect(X, Y, 14, 6, "#5d6470", EDGE, 1, 2)
    s.A(148, 61, -24, 0, F_RED, 2.8, "F", ly=-6, size=11.5)
    s.box(168, 80, 34, 24, "#c9a06a", "M", 10.5)
    s.A(202, 92, 18, 0, F_RED, 2.8, "F", ly=-6, size=11.5)
    s.T(172, 118, "όσο διαρκεί η διέλευση", 8.5, MUTED, bold=False)


def c69(s: S):  # plastic collision with a body at rest: how much K becomes heat (Τριπολίτης)
    s.split(right_caption="ενέργεια")
    s.floor(8, 114, 104)
    s.box(16, 86, 18, 18, B1, "m", 10)
    s.A(38, 80, 22, 0, V_BLUE, 2.2, "u", ly=-6, size=10.5)
    s.box(70, 74, 34, 30, B2, "M", 11)
    s.T(87, 68, "ακίνητο", 8.5, MUTED, bold=False)
    s.T(60, 118, "κολλάνε", 8.5, MUTED, bold=False)
    # K before vs after for M = 3m: 25 % stays as motion, 75 % becomes heat
    X, Y = s.at(132, 54)
    s.text(X, Y + 8, "πριν", 9, MUTED, "start", bold=False)
    s.rect(X + 26, Y, 60, 11, P_GREEN, rx=2)
    X, Y = s.at(132, 76)
    s.text(X, Y + 8, "μετά", 9, MUTED, "start", bold=False)
    s.rect(X + 26, Y, 15, 11, P_GREEN, rx=2)
    s.rect(X + 41, Y, 45, 11, K_ORANGE, rx=2)
    s.T(172, 104, "M = 3m: 75 % → Q", 9.5, K_ORANGE, bold=True)
    s.T(172, 118, "πράσινο K, πορτοκαλί Q", 8, MUTED, bold=False)


def c70(s: S):  # ball hits a wall (loses 36 % of K), then sticks to m2 and both stop (Τριπολίτης)
    s.split()
    s.floor(8, 104, 104)
    s.wall(104, 56, 104)
    s.T(14, 64, "1", 9, MUTED, "start", bold=False)
    s.ball(70, 70, 8)
    s.A(80, 70, 16, 0, V_BLUE, 2, "υ₁", ly=-6, size=9.5)
    s.T(14, 90, "2", 9, MUTED, "start", bold=False)
    s.box(22, 88, 18, 16, B2, "m₂", 9)
    s.A(42, 96, 14, 0, V_BLUE, 2, "υ₂", ly=-6, size=9.5)
    s.ball(80, 95, 8)
    s.A(70, 95, -12, 0, V_BLUE, 2, None)
    s.T(84, 80, "υ₁′", 9, V_BLUE, bold=True)
    s.T(60, 118, "μετά: όλα ακίνητα", 8.5, MUTED, bold=False)
    s.ball(190, 82, 11)
    s.A(178, 82, -40, 0, F_RED, 3.2, "F = 180 N", ly=-9, size=10)
    s.T(172, 112, "από τον τοίχο", 9, MUTED, bold=False)


def c71(s: S):  # drop from 20 m, bounces with 8 m/s, contact 0.1 s (Τριπολίτης)
    s.split()
    s.floor(14, 112, 110)
    s.ball(46, 101)
    s.L(46, 48, 46, 90, MUTED, 1, "2 3")
    s.T(30, 66, "20 m", 9, MUTED, bold=False)
    s.A(72, 60, 0, 30, V_BLUE, 2.4, "20", lx=10, ly=4, size=9.5)
    s.A(92, 92, 0, -16, V_BLUE, 2.4, "8", lx=9, ly=0, size=9.5)
    s.ball(172, 86, 11)
    s.A(172, 75, 0, -26, F_RED, 3.4, "N", lx=10, ly=-2, size=13)
    s.A(172, 97, 0, 14, F_RED, 2.4, "mg", lx=14, ly=6, size=11)
    s.T(172, 122, "πρόσημο στο υ′!", 8.5, F_RED, bold=True)


def c72(s: S):  # 4.107: m1 stops, m2 leaves with 5 m/s (Τριπολίτης)
    s.split()
    s.floor(8, 114, 104)
    s.box(22, 82, 20, 22, B1, "1", 10)
    s.A(44, 76, 22, 0, V_BLUE, 2.2, "10", ly=-6, size=9.5)
    s.box(84, 82, 26, 22, B2, "2", 10)
    s.T(62, 118, "μετά: 0 και 5 m/s", 8.5, MUTED, bold=False)
    s.box(150, 56, 20, 18, B1, "1", 10)
    s.A(150, 65, -24, 0, F_RED, 2.8, "C", ly=-6, size=11.5)
    s.box(176, 92, 26, 22, B2, "2", 10)
    s.A(202, 103, 18, 0, F_RED, 2.8, "C", ly=-6, size=11.5)


def _fbd_block(s: S, x, y, label, fill=B2, friction=True, w=30, h=20):
    s.box(x - w / 2, y - h / 2, w, h, fill, label, 10)
    s.A(x, y - h / 2, 0, -16, F_RED, 2.2, "N", lx=9, ly=-2, size=10)
    s.A(x, y + h / 2, 0, 16, F_RED, 2.2, "mg", lx=13, ly=6, size=10)
    if friction:
        s.A(x - w / 2, y + 2, -22, 0, K_ORANGE, 2.8, "T", ly=-6, size=11)


def c73(s: S):  # 4.108: rebound with equal speeds after
    s.split()
    s.floor(8, 114, 104)
    s.ball(26, 94, 9)
    s.A(38, 94, 20, 0, V_BLUE, 2.2, "12", ly=-6, size=9.5)
    s.ball(88, 91, 12, B2)
    s.T(26, 80, "2 kg", 8.5, MUTED, bold=False)
    s.T(88, 72, "5 kg", 8.5, MUTED, bold=False)
    s.T(60, 118, "μετά: ±8 m/s", 8.5, MUTED, bold=False)
    s.ball(146, 62, 9)
    s.A(136, 62, -20, 0, F_RED, 2.8, "C", ly=-6, size=11)
    s.ball(188, 96, 12, B2)
    s.A(201, 96, 20, 0, F_RED, 2.8, "C", ly=-6, size=11)


def c74(s: S):  # 4.109: plastic, then friction stops it in 4 s
    s.split()
    X1, Y = s.at(8, 104)
    X2, _ = s.at(114, 104)
    s.line(X1, Y, X2, Y, GROUND, 2.4)
    s.ground(X1, X2, Y)
    s.box(18, 86, 16, 18, B1, "1", 9)
    s.A(36, 80, 16, 0, V_BLUE, 2, "υ₀", ly=-6, size=9.5)
    s.box(62, 80, 24, 24, B2, "3 kg", 8.5)
    s.T(60, 118, "μ = 0,1 · σταματά σε 4 s", 8.5, MUTED, bold=False)
    _fbd_block(s, 176, 82, "1+2")


def c75(s: S):  # 4.113: equal speeds opposite, plastic, stops after 0.5 m
    s.split()
    X1, Y = s.at(8, 104)
    X2, _ = s.at(114, 104)
    s.line(X1, Y, X2, Y, GROUND, 2.4)
    s.ground(X1, X2, Y)
    s.box(14, 84, 20, 20, B1, "4", 9.5)
    s.A(36, 78, 16, 0, V_BLUE, 2, "υ", ly=-6, size=9.5)
    s.box(84, 80, 24, 24, B2, "6", 9.5)
    s.A(80, 74, -16, 0, V_BLUE, 2, "υ", ly=-6, size=9.5)
    s.T(60, 118, "κολλάνε · s = 0,5 m", 8.5, MUTED, bold=False)
    _fbd_block(s, 184, 82, "10 kg")


def c76(s: S):  # 4.115: rough floor, no sticking, distance when each stops
    s.split()
    X1, Y = s.at(8, 104)
    X2, _ = s.at(114, 104)
    s.line(X1, Y, X2, Y, GROUND, 2.4)
    s.ground(X1, X2, Y)
    s.box(20, 80, 24, 24, B1, "4", 9.5)
    s.A(46, 74, 10, 0, V_BLUE, 2, "2", ly=-6, size=9.5)
    s.box(84, 86, 18, 18, B2, "1", 9.5)
    s.A(80, 74, -22, 0, V_BLUE, 2, "10", ly=-6, size=9.5)
    s.T(60, 118, "μ = 0,2 · δεν κολλάνε", 8.5, MUTED, bold=False)
    s.box(136, 54, 22, 18, B1, "4", 9.5)
    s.A(158, 63, 16, 0, K_ORANGE, 2.6, "T", ly=-6, size=10.5)
    s.A(136, 50, -14, 0, V_BLUE, 1.8, "1", ly=-5, size=9)
    s.box(178, 92, 18, 16, B2, "1", 9.5)
    s.A(178, 100, -16, 0, K_ORANGE, 2.6, "T", ly=-6, size=10.5)
    s.A(196, 86, 14, 0, V_BLUE, 1.8, "2", ly=-5, size=9)


def c77(s: S):  # 4.117: circular motion on a string, plastic collision
    s.split()
    X, Y = s.at(56, 82)
    s.add(f'<circle cx="{X:.1f}" cy="{Y:.1f}" r="30" fill="none" stroke="#c5cbd3" stroke-width="1.3" stroke-dasharray="4 3"/>')
    s.circle(X, Y, 2.5, INK)
    s.L(56, 82, 86, 82, INK, 1.2)
    s.ball(86, 82, 7)
    s.A(86, 74, 0, -18, V_BLUE, 2, "5", lx=9, ly=0, size=9.5)
    s.ball(100, 50, 6, B2)
    s.A(100, 58, 0, 12, V_BLUE, 2, "16", lx=-10, ly=2, size=9)
    s.T(56, 120, "κάτοψη · l = 2 m", 8.5, MUTED, bold=False)
    s.ball(196, 82, 10)
    s.A(184, 82, -36, 0, F_RED, 3, "T", ly=-7, size=12)
    s.T(160, 104, "προς το κέντρο", 8.5, MUTED, bold=False)


# (title, drawer, [(text, color, bold)], ref)
CELLS = [
    (54, "Μπάλα χτυπά τοίχο", c54, [
        ("Δp = −mυ′ − mυ = −m(υ + υ′)", P_GREEN, True),
        ("C = m(υ + υ′)/Δt (μέτρο)", F_RED, True),
        ("Ο τοίχος ασκεί μόνο τη C", INK, True),
        ("Θετική φορά: προς τον τοίχο", MUTED, False),
    ], "→ δες και 3, 7"),
    (55, "Γυρίζει με ίδια ταχύτητα", c55, [
        ("Δp = −mυ − mυ = −2mυ", P_GREEN, True),
        ("ΔK = 0, αλλά Δp ≠ 0", K_ORANGE, True),
        ("C = 2mυ/Δt", F_RED, True),
        ("Η ορμή είναι διάνυσμα", MUTED, False),
    ], "→ δες και 3"),
    (56, "Σταματά, δεν αναπηδά", c56, [
        ("Δp = 0 − mυ = −mυ", P_GREEN, True),
        ("C = mυ/Δt", F_RED, True),
        ("Αναπήδηση ⇒ διπλή Δp και C", INK, True),
        ("(για τον ίδιο χρόνο Δt)", MUTED, False),
    ], "→ σύγκρινε με 55"),
    (57, "Μαξιλάρι: πιο πολύς χρόνος", c57, [
        ("Ίδια Δp = mυ και στα δύο", P_GREEN, True),
        ("C_{μ} = mυ/Δt", F_RED, True),
        ("Δt ×10 ⇒ C : 10", INK, True),
        ("αερόσακος, ζώνη, στρώμα", MUTED, False),
    ], "→ δες και 35"),
    (58, "Ζεύγος δυνάμεων επαφής", c58, [
        ("C στο A = −C στο B", F_RED, True),
        ("Δp_{A} = −Δp_{B}", P_GREEN, True),
        ("Ίδιος χρόνος επαφής Δt", INK, True),
        ("Δράση–αντίδραση (3ος νόμος)", MUTED, False),
    ], "→ δες και 11"),
    (59, "Άνισες μάζες, ίδια C", c59, [
        ("Ίδιο μέτρο C στα δύο", F_RED, True),
        ("α_{m} = C/m, α_{M} = C/M", INK, True),
        ("Ίδια |Δp|, άνισες |Δυ|", P_GREEN, True),
        ("Το ελαφρύ αλλάζει πιο πολύ υ", MUTED, False),
    ], "→ δες και 41"),
    (60, "Μπάλα χτυπά το δάπεδο", c60, [
        ("(N − mg)·Δt = Δp", F_RED, True),
        ("Δp = m(υ′ + υ), θετικά ↑", P_GREEN, True),
        ("N = mg + m(υ + υ′)/Δt", F_RED, True),
        ("Εδώ μπαίνει και το βάρος", MUTED, False),
    ], "→ δες και 4, 33"),
    (61, "Φρενάρει με τριβή", c61, [
        ("T = μN = μmg (σταθερή)", K_ORANGE, True),
        ("−T·Δt = 0 − mυ", P_GREEN, True),
        ("Δt = υ/(μg)", INK, True),
        ("N και mg αλληλοαναιρούνται", MUTED, False),
    ], "→ δες και 22"),
    (62, "Πιάνω μπάλα που πέφτει", c62, [
        ("C − mg = mυ/Δt (θετικά ↑)", F_RED, True),
        ("C = mg + mυ/Δt", F_RED, True),
        ("Λυγίζω το χέρι ⇒ μεγάλο Δt", INK, True),
        ("μεγάλο Δt ⇒ μικρή C", MUTED, False),
    ], "→ δες και 35, 57"),
    (63, "Σύστημα A + B", c63, [
        ("Οι C είναι εσωτερικές: φεύγουν", COLOR, True),
        ("Οριζόντια: ΣF_{εξ} = 0", INK, True),
        ("Δ(p_{A} + p_{B}) = 0 ⇒ ΑΔΟ", P_GREEN, True),
        ("Κατακόρυφα: N_{ολ} = m_{ολ}g", MUTED, False),
    ], "→ δες και 12"),
    (64, "Σφυρί, μαχαίρι, πατάτα", c64, [
        ("Στην πατάτα: μόνο mg και T", INK, True),
        ("Θα ήθελε F = mΔυ/Δt = 120 N", F_RED, True),
        ("Όμως T ≤ μN = 4 N", K_ORANGE, True),
        ("Δυ_{πατ} ≈ 0,15 m/s ≪ 3 m/s", P_GREEN, True),
    ], "→ αντίθετο του 57, 62"),
    (65, "Ψάρι τρώει ψάρι", c65, [
        ("8·0,6 + 2·0,1 = 10V ⇒ V = 0,5 m/s", P_GREEN, True),
        ("Q = 1,45 − 1,25 = 0,2 J", K_ORANGE, True),
        ("Δp_{μικ} = 2·0,5 − 2·0,1 = 0,8", P_GREEN, True),
        ("F_{μεγ} = −0,8 / 2 = −0,4 N", F_RED, True),
    ], "Τριπολίτης · → δες και 16, 58"),
    (66, "Κρούση και τεταρτοκύκλιο", c66, [
        ("υ_{A} = 10 − 2·2 = 6 m/s (τριβή)", INK, True),
        ("5·6 − 2·1 = 7V ⇒ V = 4 m/s", P_GREEN, True),
        ("ΘΜΚΕ: 7 − 56 = W_{T} − 14", K_ORANGE, True),
        ("W_{T} = −35 J (T όχι σταθερή)", F_RED, True),
    ], "Τριπολίτης · → δες και 16, 61"),
    (67, "Βλήμα σφηνώνεται σε ξύλο", c67, [
        ("0,04·200 = 1·V ⇒ V = 8 m/s", P_GREEN, True),
        ("Q = 800 − 32 = 768 J (96 %)", K_ORANGE, True),
        ("Q = F·d_{σχ} ⇒ F = 10⁴ N", F_RED, True),
        ("Δt = MV/F = 7,68·10⁻⁴ s", INK, True),
    ], "Τριπολίτης · → δες και 16"),
    (68, "Βλήμα διαπερνά ξύλο", c68, [
        ("K′ = 25 %·1000 = 250 J ⇒ υ′ = 50", K_ORANGE, True),
        ("0,2·100 = 5V + 0,2·50 ⇒ V = 2 m/s", P_GREEN, True),
        ("K_{M} = 10 J ⇒ 1 % της αρχικής", INK, True),
        ("F = Δp/Δt = 10/0,01 = 1000 N", F_RED, True),
    ], "Τριπολίτης · → σύγκρινε με 67"),
    (69, "Πόσο γίνεται θερμότητα", c69, [
        ("Q / K_{αρχ} = M / (m + M)", K_ORANGE, True),
        ("m = M ⇒ 50 % (σωστό: γ)", INK, True),
        ("M = 3m: V = u/4, Δp_{ολ} = 0", P_GREEN, True),
        ("ΔK = −3mu²/8 ⇒ 75 % θερμότητα", F_RED, True),
    ], "Τριπολίτης · → δες και 19"),
    (70, "Τοίχος, μετά πλαστική", c70, [
        ("K′ = 64 %·K ⇒ υ₁′ = 0,8·υ₁", K_ORANGE, True),
        ("F·Δt = m(υ₁ + υ₁′) ⇒ 18 = 1,8υ₁", F_RED, True),
        ("υ₁ = 10 m/s, υ₁′ = 8 m/s", P_GREEN, True),
        ("Σταματούν: m₁υ₁′ = m₂υ₂ ⇒ υ₂ = 8", P_GREEN, True),
    ], "Τριπολίτης · m₂ = 1 kg · → δες και 54"),
    (71, "Πέφτει από 20 m, αναπηδά", c71, [
        ("ΑΔΜΕ: υ₁ = √(2gh) = 20 m/s", INK, True),
        ("Q = 400 − 64 = 336 J ⇒ ανελαστική", K_ORANGE, True),
        ("+ κάτω: Δp = 2(−8) − 2·20 = −56", P_GREEN, True),
        ("mg − N = −560 ⇒ N = 580 N", F_RED, True),
    ], "Τριπολίτης · → δες και 60"),
    (72, "4.107: το 1 σταματά", c72, [
        ("1·10 + 0 = 1·0 + 2·υ₂′", P_GREEN, True),
        ("υ₂′ = 5 m/s", P_GREEN, True),
        ("Q = 50 − 25 = 25 J", K_ORANGE, True),
        ("Q ≠ 0 ⇒ όχι ελαστική", INK, True),
    ], "Τριπολίτης 4.107 · → δες και 58"),
    (73, "4.108: αντίθετες ταχύτητες", c73, [
        ("2·12 = 2(−υ) + 5υ", P_GREEN, True),
        ("24 = 3υ ⇒ υ = 8 m/s", P_GREEN, True),
        ("Δp₁ = 2(−8 − 12) = −40", F_RED, True),
        ("|Δp₁| = 40 kg·m/s", INK, True),
    ], "Τριπολίτης 4.108 · λυμένη στις ασκήσεις"),
    (74, "4.109: τριπλάσια ορμή", c74, [
        ("α = μg = 1 ⇒ V = 1·4 = 4 m/s", K_ORANGE, True),
        ("p₂′ = 3·4 = 12 ⇒ p₁ = 36", P_GREEN, True),
        ("36 = (m₁ + 3)·4 ⇒ m₁ = 6 kg", P_GREEN, True),
        ("υ₀ = 36/6 = 6 m/s", INK, True),
    ], "Τριπολίτης 4.109 · λυμένη στις ασκήσεις"),
    (75, "4.113: πλαστική, μετά τριβή", c75, [
        ("V² = 2μgs = 1 ⇒ V = 1 m/s", K_ORANGE, True),
        ("p = 10·1 = 10 kg·m/s", P_GREEN, True),
        ("6υ − 4υ = 10 ⇒ υ = 5 m/s", P_GREEN, True),
        ("όχι 10·10: p ήδη = (m₁+m₂)V", F_RED, True),
    ], "Τριπολίτης 4.113 · λυμένη στις ασκήσεις"),
    (76, "4.115: απόσταση με τριβή", c76, [
        ("8 − 10 = −4 + υ₂′ ⇒ υ₂′ = 2 m/s", P_GREEN, True),
        ("α = μg = 2 m/s² και στα δύο", K_ORANGE, True),
        ("σταματά το 1: 0,25 + 0,75 = 1 m", INK, True),
        ("σταματά το 2: 1 + 0,25 = 1,25 m", INK, True),
    ], "Τριπολίτης 4.115 · λυμένη στις ασκήσεις"),
    (77, "4.117: κρούση σε κύκλο", c77, [
        ("T = mυ²/l ⇒ υ = 5, p = 20", F_RED, True),
        ("20 − 32 = 6u′ ⇒ u′ = −2 m/s", P_GREEN, True),
        ("T′ = 6·4/2 = 12 ⇒ |ΔT| = 38 N", F_RED, True),
        ("ω: 2,5 → −1 ⇒ Δω = −3,5 rad/s", INK, True),
    ], "Τριπολίτης 4.117 · λυμένη στις ασκήσεις"),
]

RULES = [
    "1. Διαλέγω τι εξετάζω: ένα σώμα ή όλο το σύστημα A + B.",
    "2. Ζωγραφίζω μόνο αυτό, χωρίς τοίχους, πατώματα, άλλα σώματα.",
    "3. Βάζω κάθε δύναμη που δέχεται: C ή N, mg, T. Όχι ταχύτητες.",
    "4. Θετική φορά, και σε κάθε άξονα: ΣF·Δt = Δp.",
    "5. Μικρό Δt, τεράστια C ⇒ το mg αμελείται. Αν δίνεται Δt, μπαίνει.",
    "6. Σύστημα: οι C είναι εσωτερικές ⇒ ΑΔΟ (63, 65–69).",
    "7. Πολύ μικρό Δt: μια μικρή τριβή δεν προλαβαίνει (64).",
]

_COL = len(CELLS) % 5
RULES_ROW = len(CELLS) // 5 + (1 if _COL == 4 else 0)  # the rules panel needs at least two columns
RULES_COL = 0 if _COL == 4 else _COL
ROWS = RULES_ROW + 1
FRAME_H = 250 + 256 * (ROWS - 1)
SHIFT = 256 * ROWS  # how far the footer moves down


def draw_cell(s: S, entry, x: float, y: float):
    n, title, drawer, lines, ref = entry
    s.ox, s.oy = x, y
    s.rect(x, y, CELL_W, CELL_H, "#ffffff", "#d6dae1", 1, 7)
    s.circle(x + 15, y + 15, 10, COLOR)
    s.text(x + 15, y + 19.5, str(n), 12, "#ffffff")
    s.text(x + 30, y + 20, title, 13.5, INK, "start")
    drawer(s)
    for i, (txt, color, bold) in enumerate(lines):
        s.text(x + 12, y + 134 + 15.5 * i, txt, 11, color, "start", bold)
    s.text(x + 214, y + 206, ref, 9.5, MUTED, "end", bold=False, italic=True)


def rules_panel(s: S, x: float, y: float, w: float):
    s.rect(x, y, w, CELL_H, "#ffffff", "#d6dae1", 1, 7)
    s.text(x + 14, y + 22, "Πώς φτιάχνω διάγραμμα δυνάμεων", 13.5, COLOR, "start")
    for i, t in enumerate(RULES):
        s.text(x + 14, y + 48 + 22.5 * i, t, 11.5 if w < 900 else 13, INK, "start", bold=False)


def section_block(top: float) -> str:
    s = S()
    s.rect(14, top, 1184, FRAME_H, BG, COLOR, 1.5, 10)
    s.rect(14, top, 1184, 30, COLOR, rx=10)
    s.rect(14, top + 20, 1184, 10, COLOR)
    s.text(30, top + 21, TITLE, 16, "#ffffff", "start")
    for i, entry in enumerate(CELLS):
        row, col = divmod(i, 5)
        draw_cell(s, entry, 17 + 238 * col, top + 34 + 256 * row)
    rules_panel(s, 17 + 238 * RULES_COL, top + 34 + 256 * RULES_ROW, 238 * (5 - RULES_COL) - 12)
    return "\n".join(s.parts)


def patch_svg() -> None:
    src = SVG_PATH.read_text(encoding="utf-8")
    cur_h = int(re.search(r'viewBox="0 0 1212 (\d+)"', src).group(1))
    if START in src:
        src = re.sub(re.escape(START) + r".*?" + re.escape(END) + "\n", "", src, flags=re.S)
    prev = cur_h - OLD_H
    new_h = OLD_H + SHIFT
    src = src.replace(f'viewBox="0 0 1212 {cur_h}" width="1212" height="{cur_h}"', f'viewBox="0 0 1212 {new_h}" width="1212" height="{new_h}"')
    src = src.replace(f'<rect width="1212" height="{cur_h}"', f'<rect width="1212" height="{new_h}"')
    # move the footer (symbols, rule, signature) under the new section
    for y in (2946.0, 2968.0, 2996.0):
        src = src.replace(f'<text x="606.0" y="{y + prev:.1f}"', f'<text x="606.0" y="{y + SHIFT:.1f}"')
    src = re.sub(r"\d+ περιπτώσεις •", f"{53 + len(CELLS)} περιπτώσεις •", src, count=1)
    block = section_block(SEC_Y)
    anchor = f'<text x="606.0" y="{2946.0 + SHIFT:.1f}"'
    assert anchor in src, anchor
    src = src.replace(anchor, f"{START}\n{block}\n{END}\n{anchor}", 1)
    SVG_PATH.write_text(src, encoding="utf-8")


def a4_page() -> None:
    """Page 3 of the A4 print: section 12 alone, at the same scale as pages 1–2."""
    from pypdf import PdfReader, PdfWriter

    W = 1212
    H = 1714  # A4 ratio
    s = S()
    s.text(W / 2, 56, "Ορμή και κρούσεις – τυπολόγιο (συνέχεια) · σελίδα 3", 30, "#14306b")
    s.text(W / 2, 88, "Διάγραμμα δυνάμεων: απομονώνω το σώμα και σχεδιάζω ΜΟΝΟ τις δυνάμεις που δέχεται στη διάρκεια της κρούσης", 15, MUTED, bold=False)
    body = section_block(110)
    below = 110 + FRAME_H + 40
    s.text(W / 2, below, "Κόκκινο = δύναμη • μπλε = ταχύτητα • C = δύναμη επαφής • T = τριβή • N = κάθετη δύναμη • J = ώθηση = ΣF·Δt = Δp", 14, MUTED, bold=False)
    s.text(W / 2, below + 26, "Η μέση δύναμη F_{μ} = Δp/Δt είναι μικρότερη από τη μέγιστη δύναμη της κρούσης.", 14, INK)
    s.text(W / 2, H - 24, "Physics Workspace • Μιχάλης", 12, "#9aa3b2", bold=False)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        "font-family=\"Inter, 'Segoe UI', Roboto, Arial, sans-serif\">"
        f'<rect width="{W}" height="{H}" fill="#fbfaf7"/>' + "\n".join(s.parts) + "\n" + body + "</svg>"
    )
    reader = PdfReader(str(PDF_PATH))
    page_w = float(reader.pages[0].mediabox.width)
    page_h = float(reader.pages[0].mediabox.height)
    with tempfile.TemporaryDirectory() as tmp:
        sp = Path(tmp) / "p3.svg"
        pp = Path(tmp) / "p3.pdf"
        sp.write_text(svg, encoding="utf-8")
        subprocess.run(["rsvg-convert", "-f", "pdf", "--page-width", f"{page_w}pt", "--page-height", f"{page_h}pt",
                        "--width", f"{page_w}pt", "--height", f"{page_h}pt", "-o", str(pp), str(sp)], check=True)
        writer = PdfWriter()
        for p in reader.pages[:2]:
            writer.add_page(p)
        writer.add_page(PdfReader(str(pp)).pages[0])
        out = Path(tmp) / "out.pdf"
        with open(out, "wb") as fh:
            writer.write(fh)
        PDF_PATH.write_bytes(out.read_bytes())


if __name__ == "__main__":
    patch_svg()
    a4_page()
    print("ok")
