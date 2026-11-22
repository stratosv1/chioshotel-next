"use client";

import { useEffect, useMemo, useState } from "react";
import { StudyMark } from "@/components/mixalis/study/StudyMark";
import { EXTRA_SCENARIOS } from "./sintheta/extra-quiz";

/**
 * Quiz «Σπάσε το σε φάσεις» (owner, 2026-11-20).
 * Σύνθετα φαινόμενα γραμμένα από την αρχή, πάνω στους τύπους ασκήσεων
 * του Καρατζίκου, του Σαββάλα, της Τράπεζας Θεμάτων και του Τριπολίτη.
 * Ο μαθητής: 1) κόβει την εκφώνηση σε φάσεις, 2) διαλέγει εργαλεία ανά φάση,
 * 3) διαλέγει από ποια φάση ξεκινά τη λύση.
 */

export type Tool = "ado" | "dpdt" | "q" | "thmke" | "adme" | "kin" | "bolh" | "kentro" | "rate";

const TOOLS: { id: Tool; label: string; hint: string }[] = [
  { id: "ado", label: "ΑΔΟ", hint: "Κρούση / έκρηξη / πήδημα: p_ολ πριν = p_ολ μετά" },
  { id: "dpdt", label: "ΣF = Δp/Δt", hint: "Δύναμη ή χρόνος σε ΕΝΑ σώμα" },
  { id: "q", label: "Κινητική πριν/μετά", hint: "Θερμότητα, απώλεια %, Q = F·d, ενέργεια έκρηξης/ελατηρίου" },
  { id: "thmke", label: "ΘΜΚΕ", hint: "Απόσταση με τριβή (ή κεκλιμένο με τριβή)" },
  { id: "adme", label: "ΑΔΜΕ", hint: "Ύψος / γωνία νήματος, χωρίς τριβή" },
  { id: "kin", label: "Κινηματική / Δp = ΣF·Δt", hint: "Χρόνος, ή κίνηση με σταθερή επιτάχυνση" },
  { id: "bolh", label: "Οριζόντια βολή", hint: "Φεύγει οριζόντια από ύψος: t = √(2H/g), x = V·t" },
  { id: "kentro", label: "Κεντρομόλος", hint: "Τάση νήματος, κυκλική, ανακύκλωση" },
  { id: "rate", label: "Ρυθμός μεταβολής", hint: "Σε μια θέση: dp/dt = ΣF, dK/dt = ΣF·υ" },
];

export type QPhase = { label: string; best: Tool[]; ok?: Tool[]; why: string; eq: string };
export type Scenario = {
  id: string;
  title: string;
  /** Κομμάτια της εκφώνησης· οι τομές μπαίνουν ανάμεσά τους. */
  segs: string[];
  /** Σωστές τομές: i σημαίνει «τομή μετά το κομμάτι i». */
  cuts: number[];
  ask: string;
  phases: QPhase[];
  /** Σωστές φάσεις εκκίνησης (index). */
  start: number[];
  startWhy: string;
  like: string;
};

const BASE_SCENARIOS: Scenario[] = [
  {
    id: "bullet-floor",
    title: "Βλήμα σε ξύλο που γλιστράει",
    segs: [
      "Βλήμα 20 g κινείται οριζόντια με άγνωστη ταχύτητα υ₀.",
      "Σφηνώνεται ακαριαία σε ξύλο 1,98 kg που ηρεμεί σε τραχύ δάπεδο (μ = 0,2).",
      "Το συσσωμάτωμα ολισθαίνει",
      "και σταματά αφού διανύσει 4 m.",
    ],
    cuts: [1],
    ask: "Ζητούνται η υ₀ και η θερμότητα που έγινε στην κρούση.",
    phases: [
      {
        label: "Κρούση (σφήνωμα)",
        best: ["ado", "q"],
        why: "Στιγμιαία κρούση → ΑΔΟ για βλήμα + ξύλο. Ζητείται και η θερμότητα της κρούσης → κινητική πριν − μετά.",
        eq: "m·υ₀ = (m+M)·V   ·   Q = ½mυ₀² − ½(m+M)V²",
      },
      {
        label: "Ολίσθηση με τριβή",
        best: ["thmke"],
        ok: ["kin"],
        why: "Δίνεται απόσταση με τριβή → ΘΜΚΕ. Από εδώ βγαίνει η V (γέφυρα).",
        eq: "0 − ½(m+M)V² = −μ(m+M)g·s",
      },
    ],
    start: [1],
    startWhy: "Η ολίσθηση έχει μόνο άγνωστο τη V. Ξεκινάς από το τέλος και γυρνάς πίσω στην ΑΔΟ («ανάποδη» άσκηση).",
    like: "Καρατζίκος 3.138 · Τριπολίτης 4.100",
  },
  {
    id: "ballistic",
    title: "Βαλλιστικό εκκρεμές",
    segs: [
      "Βλήμα 50 g κινείται οριζόντια με υ₀.",
      "Σφηνώνεται σε ξύλινο κύβο 1,95 kg που κρέμεται ακίνητος από νήμα.",
      "Το συσσωμάτωμα εκτρέπεται",
      "και ανεβαίνει μέχρι ύψος 0,45 m πάνω από την αρχική του θέση.",
    ],
    cuts: [1],
    ask: "Ζητούνται η υ₀ και το ποσοστό της κινητικής ενέργειας που χάθηκε στην κρούση.",
    phases: [
      {
        label: "Κρούση",
        best: ["ado", "q"],
        why: "ΑΔΟ για βλήμα + κύβο. Το ποσοστό απώλειας θέλει κινητικές πριν και μετά: Π% = Q / Κ_πριν.",
        eq: "m·υ₀ = (m+M)·V   ·   Π% = (Κ_πριν − Κ_μετά)/Κ_πριν",
      },
      {
        label: "Άνοδος",
        best: ["adme"],
        why: "Χωρίς τριβές, δίνεται ύψος → ΑΔΜΕ. ΠΡΟΣΟΧΗ: όχι ΑΔΜΕ από το βλήμα ως το ύψος, στην κρούση χάνεται ενέργεια.",
        eq: "½(m+M)V² = (m+M)g·h",
      },
    ],
    start: [1],
    startWhy: "Από το ύψος βγαίνει η V. Μετά ΑΔΟ για την υ₀.",
    like: "Τυπολόγιο 24 · Σαββάλας 6.89, 6.101",
  },
  {
    id: "pendulum-hit",
    title: "Εκκρεμές που χτυπά άλλη σφαίρα",
    segs: [
      "Σφαίρα 1 kg είναι δεμένη σε νήμα 0,8 m. Την αφήνουμε με το νήμα οριζόντιο.",
      "Στο κατώτατο σημείο συγκρούεται πλαστικά με σφαίρα 3 kg που κρέμεται ακίνητη από το ίδιο σημείο.",
      "Αμέσως μετά την κρούση το συσσωμάτωμα κινείται κυκλικά στο νήμα.",
    ],
    cuts: [0, 1],
    ask: "Ζητούνται η ταχύτητα πριν την κρούση, η κοινή ταχύτητα και η τάση του νήματος αμέσως μετά.",
    phases: [
      {
        label: "Κάθοδος",
        best: ["adme"],
        why: "Πέφτει από ύψος ℓ χωρίς τριβές → ΑΔΜΕ.",
        eq: "m·g·ℓ = ½m·υ₁²",
      },
      {
        label: "Κρούση",
        best: ["ado"],
        why: "Στιγμιαία, πλαστική → ΑΔΟ.",
        eq: "m·υ₁ = (m+M)·V",
      },
      {
        label: "Αμέσως μετά",
        best: ["kentro"],
        why: "«Αμέσως μετά» με νήμα = ΣΤΙΓΜΗ στο κατώτατο σημείο, όχι κίνηση → κεντρομόλος.",
        eq: "T − (m+M)g = (m+M)V²/ℓ",
      },
    ],
    start: [0],
    startWhy: "Η άσκηση πάει «κανονικά»: ξεκινάς από την κάθοδο και προχωράς φάση φάση.",
    like: "Καρατζίκος 3.148, 3.162 · Τυπολόγιο 25",
  },
  {
    id: "table-edge",
    title: "Πλαστελίνη στην άκρη τραπεζιού",
    segs: [
      "Κομμάτι πλαστελίνης 10 g κινείται οριζόντια πάνω σε λείο τραπέζι ύψους 0,8 m.",
      "Χτυπά και κολλάει σε κύβο 30 g που ηρεμεί στην άκρη του τραπεζιού.",
      "Το συσσωμάτωμα φεύγει από την άκρη",
      "και πέφτει στο πάτωμα 0,8 m πιο πέρα (οριζόντια).",
    ],
    cuts: [1],
    ask: "Ζητείται η ταχύτητα της πλαστελίνης πριν την κρούση.",
    phases: [
      {
        label: "Κρούση",
        best: ["ado"],
        why: "Πλαστική κρούση → ΑΔΟ.",
        eq: "m·υ = (m+M)·V",
      },
      {
        label: "Πτώση από την άκρη",
        best: ["bolh"],
        why: "Φεύγει οριζόντια από ύψος → οριζόντια βολή. Ο χρόνος βγαίνει ΜΟΝΟ από το ύψος.",
        eq: "t = √(2H/g)   ·   S = V·t",
      },
    ],
    start: [1],
    startWhy: "Δίνουν πού έπεσε → ξεκινάς από τη βολή, βγάζεις V, και γυρνάς στην ΑΔΟ.",
    like: "Καρατζίκος 3.160 · Τυπολόγιο 29",
  },
  {
    id: "bounce",
    title: "Μπάλα που αναπηδά",
    segs: [
      "Μπάλα 0,2 kg αφήνεται από ύψος 1,8 m.",
      "Χτυπά στο έδαφος· η επαφή κρατά 0,05 s.",
      "Αναπηδά και ανεβαίνει μέχρι 0,8 m.",
    ],
    cuts: [0, 1],
    ask: "Ζητείται η μέση δύναμη που ασκεί το έδαφος στη μπάλα.",
    phases: [
      {
        label: "Πτώση",
        best: ["adme"],
        ok: ["kin"],
        why: "Ελεύθερη πτώση από ύψος → ΑΔΜΕ (ή κινηματική) για την ταχύτητα πριν.",
        eq: "υ₁ = √(2g·h₁)",
      },
      {
        label: "Επαφή με το έδαφος",
        best: ["dpdt"],
        why: "Δύναμη σε ΕΝΑ σώμα κατά την επαφή → ΣF = Δp/Δt. Η δύναμη του εδάφους είναι N = ΣF + mg.",
        eq: "Δp = m(υ₁ + υ₂)  ·  N = Δp/Δt + mg",
      },
      {
        label: "Άνοδος",
        best: ["adme"],
        ok: ["kin"],
        why: "Ανεβαίνει σε ύψος → ΑΔΜΕ για την ταχύτητα αμέσως μετά.",
        eq: "υ₂ = √(2g·h₂)",
      },
    ],
    start: [0, 2],
    startWhy: "Η πτώση και η άνοδος έχουν από έναν άγνωστο → τις λύνεις πρώτες. Η επαφή είναι η τελευταία.",
    like: "Καρατζίκος 3.132–3.134 · Τριπολίτης 4.104",
  },
  {
    id: "two-pendulums",
    title: "Βλήμα σε δύο ξύλα",
    segs: [
      "Βλήμα 0,1 kg κινείται οριζόντια.",
      "Διαπερνά ξύλο 1 kg που κρέμεται από νήμα",
      "και αμέσως μετά σφηνώνεται σε δεύτερο ξύλο 0,9 kg που κρέμεται ακριβώς πίσω.",
      "Τα δύο ξύλα ανεβαίνουν σε ύψη 0,8 m και 1,8 m αντίστοιχα.",
    ],
    cuts: [1, 2],
    ask: "Ζητούνται η αρχική ταχύτητα του βλήματος και η απώλεια ενέργειας σε κάθε κρούση.",
    phases: [
      {
        label: "1η κρούση (διαπερνά)",
        best: ["ado", "q"],
        why: "ΑΔΟ για βλήμα + ξύλο 1. Δεν κολλάνε: δύο διαφορετικές ταχύτητες μετά.",
        eq: "m·υ₀ = m·u + M₁·V₁   ·   Q₁ = Κ_πριν − Κ_μετά",
      },
      {
        label: "2η κρούση (σφήνωμα)",
        best: ["ado", "q"],
        why: "Δύο κρούσεις = δύο ΑΔΟ με ΔΙΑΦΟΡΕΤΙΚΟ σύστημα: τώρα βλήμα + ξύλο 2.",
        eq: "m·u = (m+M₂)·V₂   ·   Q₂ = Κ_πριν − Κ_μετά",
      },
      {
        label: "Άνοδοι των ξύλων",
        best: ["adme"],
        why: "Κάθε ξύλο ανεβαίνει σε ύψος → ΑΔΜΕ, από εκεί βγαίνουν V₁ και V₂.",
        eq: "V = √(2g·h)",
      },
    ],
    start: [2],
    startWhy: "Από τα ύψη βγαίνουν V₁, V₂. Μετά γυρνάς: η 2η κρούση δίνει την u, η 1η δίνει την υ₀.",
    like: "Σαββάλας 6.81, 6.82, 6.86",
  },
  {
    id: "slide-hit-slide",
    title: "Γλιστράει, χτυπά, ξαναγλιστράει",
    segs: [
      "Κιβώτιο 2 kg εκτοξεύεται με 6 m/s σε τραχύ δάπεδο (μ = 0,2).",
      "Αφού διανύσει 5 m,",
      "χτυπά ακίνητο κιβώτιο 2 kg και κολλάνε.",
      "Το συσσωμάτωμα ολισθαίνει μέχρι να σταματήσει.",
    ],
    cuts: [1, 2],
    ask: "Ζητείται πόση απόσταση διανύει το συσσωμάτωμα.",
    phases: [
      {
        label: "Ολίσθηση πριν την κρούση",
        best: ["thmke"],
        ok: ["kin"],
        why: "Απόσταση με τριβή → ΘΜΚΕ για την ταχύτητα αμέσως πριν. Εδώ ΔΕΝ ισχύει ΑΔΟ: η τριβή αλλάζει την ορμή.",
        eq: "½mυ₁² − ½mυ₀² = −μmg·d",
      },
      {
        label: "Κρούση",
        best: ["ado"],
        why: "Στιγμιαία, η τριβή δεν προλαβαίνει → ΑΔΟ.",
        eq: "m·υ₁ = (m+M)·V",
      },
      {
        label: "Ολίσθηση μετά",
        best: ["thmke"],
        ok: ["kin"],
        why: "Ζητείται απόσταση με τριβή → ΘΜΚΕ.",
        eq: "0 − ½(m+M)V² = −μ(m+M)g·s",
      },
    ],
    start: [0],
    startWhy: "Τα δεδομένα είναι στην αρχή → λύνεις «κανονικά», φάση φάση.",
    like: "Τυπολόγιο 22 · Τριπολίτης 4.113",
  },
  {
    id: "shell-top",
    title: "Οβίδα που σπάει στο ψηλότερο σημείο",
    segs: [
      "Οβίδα 3 kg εκτοξεύεται κατακόρυφα προς τα πάνω με 20 m/s.",
      "Στο ψηλότερο σημείο σπάει σε δύο κομμάτια 1 kg και 2 kg που φεύγουν οριζόντια.",
      "Το κομμάτι 1 kg πέφτει 16 m μακριά από την κατακόρυφο.",
    ],
    cuts: [0, 1],
    ask: "Ζητούνται το ύψος της έκρηξης, η ταχύτητα κάθε κομματιού και η ενέργεια που ελευθερώθηκε.",
    phases: [
      {
        label: "Άνοδος",
        best: ["adme"],
        ok: ["kin"],
        why: "Κατακόρυφη βολή ως το ψηλότερο σημείο (υ = 0) → ΑΔΜΕ ή κινηματική για το ύψος.",
        eq: "H = υ₀²/(2g)",
      },
      {
        label: "Έκρηξη",
        best: ["ado", "q"],
        why: "Πριν την έκρηξη p = 0 → ΑΔΟ. Η ενέργεια που ελευθερώθηκε = Κ_μετά − Κ_πριν (εδώ η κινητική ΑΥΞΑΝΕΤΑΙ).",
        eq: "0 = m₁υ₁ − m₂υ₂   ·   E = ½m₁υ₁² + ½m₂υ₂²",
      },
      {
        label: "Πτώση των κομματιών",
        best: ["bolh"],
        why: "Φεύγουν οριζόντια από ύψος H → οριζόντια βολή, ίδιος χρόνος για τα δύο.",
        eq: "t = √(2H/g)   ·   x = υ·t",
      },
    ],
    start: [0],
    startWhy: "Πρώτα το ύψος (άνοδος) → χρόνος πτώσης → από τα 16 m η υ₁ → ΑΔΟ για την υ₂. Η σειρά λύσης είναι 1 → 3 → 2.",
    like: "Καρατζίκος 3.153 · Τριπολίτης 4.116 · Τυπολόγιο 28",
  },
  {
    id: "loop",
    title: "Οριακή ανακύκλωση",
    segs: [
      "Βλήμα 0,1 kg σφηνώνεται ακαριαία σε ξύλο 0,9 kg που κρέμεται από νήμα 0,5 m.",
      "Το συσσωμάτωμα ανεβαίνει κυκλικά",
      "και μόλις που ολοκληρώνει την ανακύκλωση (στο ψηλότερο σημείο το νήμα μόλις μένει τεντωμένο).",
    ],
    cuts: [0, 1],
    ask: "Ζητείται η ταχύτητα του βλήματος.",
    phases: [
      {
        label: "Κρούση",
        best: ["ado"],
        why: "Σφήνωμα → ΑΔΟ.",
        eq: "m·υ₀ = (m+M)·V",
      },
      {
        label: "Άνοδος ως την κορυφή",
        best: ["adme"],
        why: "Χωρίς τριβές, ανεβαίνει 2ℓ → ΑΔΜΕ.",
        eq: "½(m+M)V² = ½(m+M)υ_κ² + (m+M)g·2ℓ",
      },
      {
        label: "Στην κορυφή",
        best: ["kentro"],
        why: "«Οριακή» ανακύκλωση με νήμα: T = 0 στην κορυφή → μόνο το βάρος δίνει κεντρομόλο.",
        eq: "(m+M)g = (m+M)υ_κ²/ℓ  ⇒  υ_κ = √(gℓ)",
      },
    ],
    start: [2],
    startWhy: "Η κορυφή δίνει την υ_κ χωρίς άγνωστους → ΑΔΜΕ προς τα κάτω για τη V → ΑΔΟ για την υ₀.",
    like: "Σαββάλας 6.99, 6.100",
  },
  {
    id: "incline",
    title: "Βλήμα σε σώμα πάνω σε κεκλιμένο",
    segs: [
      "Βλήμα 0,4 kg κινείται παράλληλα σε κεκλιμένο επίπεδο γωνίας φ με γνωστή ταχύτητα.",
      "Σφηνώνεται σε ακίνητο σώμα 4,6 kg πάνω στο κεκλιμένο.",
      "Το συσσωμάτωμα ανεβαίνει το κεκλιμένο με τριβή (μ = 0,5) και σταματά.",
    ],
    cuts: [1],
    ask: "Ζητείται πόσο ανεβαίνει το συσσωμάτωμα πάνω στο κεκλιμένο.",
    phases: [
      {
        label: "Κρούση",
        best: ["ado"],
        why: "Στιγμιαία, κατά μήκος του κεκλιμένου → ΑΔΟ.",
        eq: "m·υ = (m+M)·V",
      },
      {
        label: "Άνοδος με τριβή",
        best: ["thmke"],
        ok: ["kin"],
        why: "Τριβή + απόσταση → ΘΜΚΕ. Στο έργο μπαίνουν βάρος (Mg·ημφ·s) ΚΑΙ τριβή (μMg·συνφ·s). Όχι ΑΔΜΕ: υπάρχει τριβή.",
        eq: "0 − ½(m+M)V² = −(m+M)g(ημφ + μσυνφ)·s",
      },
    ],
    start: [0],
    startWhy: "Η ταχύτητα του βλήματος δίνεται → ξεκινάς από την κρούση.",
    like: "Τριπολίτης 4.114",
  },
  {
    id: "spring-ramp",
    title: "Ελατήριο και ράμπα",
    segs: [
      "Δύο αμαξάκια 1 kg και 2 kg, ακίνητα σε λείο δάπεδο, κρατούν ανάμεσά τους συμπιεσμένο ελατήριο με ένα νήμα.",
      "Κόβουμε το νήμα και τα αμαξάκια απομακρύνονται.",
      "Το αμαξάκι 1 kg ανεβαίνει σε λεία ράμπα μέχρι ύψος 0,8 m.",
    ],
    cuts: [1],
    ask: "Ζητούνται η ταχύτητα του αμαξιού 2 kg και η ενέργεια που είχε το ελατήριο.",
    phases: [
      {
        label: "Εκτόνωση ελατηρίου",
        best: ["ado", "q"],
        ok: ["adme"],
        why: "Σαν έκρηξη: αρχικά p = 0 → ΑΔΟ. Η ενέργεια του ελατηρίου γίνεται κινητική των δύο.",
        eq: "0 = m₁υ₁ − m₂υ₂   ·   U = ½m₁υ₁² + ½m₂υ₂²",
      },
      {
        label: "Ράμπα",
        best: ["adme"],
        why: "Λεία ράμπα, δίνεται ύψος → ΑΔΜΕ για την υ₁.",
        eq: "½m₁υ₁² = m₁g·h",
      },
    ],
    start: [1],
    startWhy: "Από το ύψος βγαίνει η υ₁ → ΑΔΟ για την υ₂ → ενέργεια ελατηρίου.",
    like: "Τυπολόγιο 36 · Καρατζίκος 3.124",
  },
  {
    id: "depth-slide",
    title: "Βάθος εισχώρησης και ολίσθηση",
    segs: [
      "Βλήμα 0,2 kg με 200 m/s σφηνώνεται σε κιβώτιο 1,8 kg πάνω σε τραχύ δάπεδο.",
      "Κατά την εισχώρηση η αντίσταση του ξύλου είναι σταθερή, 14 400 N.",
      "Μετά το κιβώτιο ολισθαίνει (μ = 0,5) μέχρι να σταματήσει.",
    ],
    cuts: [1],
    ask: "Ζητούνται το βάθος εισχώρησης και η απόσταση ολίσθησης.",
    phases: [
      {
        label: "Κρούση (εισχώρηση)",
        best: ["ado", "q"],
        why: "ΑΔΟ για τη V. Η θερμότητα της κρούσης είναι Q = F·d, με d το βάθος ΜΕΣΑ στο ξύλο.",
        eq: "m·υ₀ = (m+M)·V   ·   F·d = Κ_πριν − Κ_μετά",
      },
      {
        label: "Ολίσθηση",
        best: ["thmke"],
        ok: ["kin"],
        why: "Απόσταση με τριβή → ΘΜΚΕ.",
        eq: "0 − ½(m+M)V² = −μ(m+M)g·s",
      },
    ],
    start: [0],
    startWhy: "Η ταχύτητα του βλήματος δίνεται → ξεκινάς από την κρούση.",
    like: "Καρατζίκος 3.163 · Τυπολόγιο 34",
  },
  {
    id: "car-wall",
    title: "Φρενάρισμα και τοίχος",
    segs: [
      "Αυτοκίνητο 1000 kg κινείται με 20 m/s και φρενάρει (μ = 0,5) για 30 m.",
      "Τότε χτυπά σε τοίχο",
      "και σταματά μέσα σε 0,1 s.",
    ],
    cuts: [0],
    ask: "Ζητείται η μέση δύναμη που δέχεται το αυτοκίνητο από τον τοίχο.",
    phases: [
      {
        label: "Φρενάρισμα",
        best: ["thmke"],
        ok: ["kin"],
        why: "Απόσταση με τριβή → ΘΜΚΕ για την ταχύτητα τη στιγμή της πρόσκρουσης.",
        eq: "½mυ₁² − ½mυ₀² = −μmg·d",
      },
      {
        label: "Πρόσκρουση στον τοίχο",
        best: ["dpdt"],
        why: "Δύναμη σε ΕΝΑ σώμα με γνωστό Δt → ΣF = Δp/Δt. Δεν είναι ΑΔΟ: ο τοίχος είναι εξωτερικός.",
        eq: "F = (0 − mυ₁)/Δt",
      },
    ],
    start: [0],
    startWhy: "Δίνεται η αρχική ταχύτητα → ξεκινάς από το φρενάρισμα.",
    like: "Τριπολίτης 4.103 · Τυπολόγιο 7",
  },
  {
    id: "circle-table",
    title: "Κρούση σε κυκλική κίνηση",
    segs: [
      "Σώμα 4 kg κάνει ομαλή κυκλική κίνηση σε λείο οριζόντιο τραπέζι, δεμένο σε νήμα 2 m. Η τάση του νήματος είναι 50 N.",
      "Συγκρούεται πλαστικά με μπίλια 2 kg που έρχεται αντίθετα με 16 m/s.",
      "Το συσσωμάτωμα συνεχίζει κυκλική κίνηση στο ίδιο νήμα.",
    ],
    cuts: [0, 1],
    ask: "Ζητείται η νέα τάση του νήματος.",
    phases: [
      {
        label: "Κυκλική πριν",
        best: ["kentro"],
        why: "Σε οριζόντιο τραπέζι η τάση είναι όλη κεντρομόλος → δίνει την ταχύτητα πριν.",
        eq: "T = m·υ²/ℓ",
      },
      {
        label: "Κρούση",
        best: ["ado"],
        why: "Πλαστική, αντίθετες φορές → ΑΔΟ με πρόσημα.",
        eq: "m·υ − m₂·υ₂ = (m+m₂)·V",
      },
      {
        label: "Κυκλική μετά",
        best: ["kentro"],
        why: "Νέα μάζα, νέα ταχύτητα → νέα κεντρομόλος = νέα τάση.",
        eq: "T′ = (m+m₂)·V²/ℓ",
      },
    ],
    start: [0],
    startWhy: "Από την τάση πριν βγαίνει η υ → ΑΔΟ → νέα τάση.",
    like: "Τριπολίτης 4.117 · Καρατζίκος 3.157",
  },
  {
    id: "cart-jump",
    title: "Άλμα από κινούμενο καρότσι",
    segs: [
      "Παιδί 50 kg στέκεται σε καρότσι 100 kg που κινείται με 4 m/s.",
      "Το παιδί πηδά μπροστά οριζόντια με 8 m/s ως προς το έδαφος.",
      "Μετά το καρότσι κινείται σε τραχύ δρόμο (μ = 0,1) μέχρι να σταματήσει.",
    ],
    cuts: [1],
    ask: "Ζητούνται η ταχύτητα του καροτσιού αμέσως μετά και ο χρόνος μέχρι να σταματήσει.",
    phases: [
      {
        label: "Πήδημα",
        best: ["ado"],
        why: "ΑΔΟ, αλλά η αρχική ορμή ΔΕΝ είναι 0: το σύστημα ήδη κινείται.",
        eq: "(M+m)·u = M·V + m·υ",
      },
      {
        label: "Φρενάρισμα",
        best: ["kin"],
        why: "Ζητείται ΧΡΟΝΟΣ με τριβή → Δp = −T·Δt (ή κινηματική). Το ΘΜΚΕ δίνει απόσταση, όχι χρόνο.",
        eq: "0 − M·V = −μMg·Δt",
      },
    ],
    start: [0],
    startWhy: "Δίνονται όλες οι ταχύτητες πριν → ξεκινάς από το πήδημα.",
    like: "Τυπολόγιο 43 · Τριπολίτης 4.119",
  },
  {
    id: "air-collision",
    title: "Σύγκρουση στον αέρα",
    segs: [
      "Τη στιγμή 0 αφήνουμε μια μπάλα 0,1 kg από ύψος 40 m",
      "και ταυτόχρονα ρίχνουμε από το έδαφος, στην ίδια κατακόρυφο, μπάλα 0,4 kg προς τα πάνω με 40 m/s.",
      "Τη στιγμή 1 s συγκρούονται και κολλάνε.",
      "Το συσσωμάτωμα συνεχίζει μέχρι το ψηλότερο σημείο του.",
    ],
    cuts: [1, 2],
    ask: "Ζητούνται οι ταχύτητες πριν την κρούση, η κοινή ταχύτητα και το μέγιστο ύψος.",
    phases: [
      {
        label: "Κινήσεις πριν",
        best: ["kin"],
        ok: ["adme"],
        why: "Δίνεται χρόνος (1 s) → κινηματική: ελεύθερη πτώση και κατακόρυφη βολή.",
        eq: "υ = g·t (πάνω μπάλα)  ·  υ = υ₀ − g·t (κάτω μπάλα)",
      },
      {
        label: "Κρούση",
        best: ["ado"],
        why: "Υπάρχει βάρος, αλλά η κρούση είναι στιγμιαία → ΑΔΟ, με πρόσημα (αντίθετες φορές).",
        eq: "m₁υ₁ − m₂υ₂ = (m₁+m₂)·V",
      },
      {
        label: "Άνοδος",
        best: ["adme"],
        ok: ["kin"],
        why: "Ζητείται ύψος → ΑΔΜΕ (ή κινηματική) από το σημείο της κρούσης.",
        eq: "Δh = V²/(2g)",
      },
    ],
    start: [0],
    startWhy: "Με τον χρόνο βρίσκεις τις ταχύτητες πριν → ΑΔΟ → ύψος.",
    like: "Σαββάλας 6.90 · Καρατζίκος 3.150",
  },
  {
    id: "hanging-explosion",
    title: "Έκρηξη σε σώμα που κρέμεται",
    segs: [
      "Σώμα 9 kg κρέμεται ακίνητο από νήμα 2 m, σε ύψος 1,8 m από το έδαφος.",
      "Εκρήγνυται σε δύο κομμάτια: τα 6 kg μένουν δεμένα στο νήμα, τα 3 kg φεύγουν οριζόντια.",
      "Το κομμάτι 3 kg πέφτει στο έδαφος 6 m πιο πέρα.",
      "Το κομμάτι 6 kg ξεκινά κυκλική κίνηση στο νήμα.",
    ],
    cuts: [1, 2],
    ask: "Ζητούνται οι ταχύτητες των κομματιών αμέσως μετά και η τάση του νήματος αμέσως μετά.",
    phases: [
      {
        label: "Έκρηξη",
        best: ["ado"],
        ok: ["q"],
        why: "Αρχικά ακίνητο → p = 0 → ΑΔΟ: τα κομμάτια φεύγουν αντίθετα.",
        eq: "0 = m₁υ₁ − m₂υ₂",
      },
      {
        label: "Πτώση του 3 kg",
        best: ["bolh"],
        why: "Φεύγει οριζόντια από ύψος → οριζόντια βολή, δίνει την ταχύτητά του.",
        eq: "t = √(2H/g)  ·  S = υ·t",
      },
      {
        label: "Το 6 kg αμέσως μετά",
        best: ["kentro"],
        why: "«Αμέσως μετά» στο νήμα → κεντρομόλος στο κατώτατο σημείο.",
        eq: "T − m₁g = m₁υ₁²/ℓ",
      },
    ],
    start: [1],
    startWhy: "Από το πού έπεσε → ταχύτητα 3 kg → ΑΔΟ για το 6 kg → τάση.",
    like: "Καρατζίκος 3.149",
  },
];

export const SCENARIOS: Scenario[] = [...BASE_SCENARIOS, ...EXTRA_SCENARIOS];

type Record_ = { cuts: boolean; tools: boolean; start: boolean };
const KEY = "mixalis-ormi-phase-quiz-v1";

function load(): Record<string, Record_> {
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function phasesOf(s: Scenario) {
  const groups: number[][] = [[]];
  s.segs.forEach((_, i) => {
    groups[groups.length - 1].push(i);
    if (s.cuts.includes(i) && i < s.segs.length - 1) groups.push([]);
  });
  return groups;
}

function toolOk(phase: QPhase, picked: Set<Tool>) {
  const allowed = new Set([...phase.best, ...(phase.ok ?? [])]);
  return phase.best.every((t) => picked.has(t)) && [...picked].every((t) => allowed.has(t));
}

const toolLabel = (id: Tool) => TOOLS.find((t) => t.id === id)?.label ?? id;

export function OrmiPhaseQuiz() {
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<Record<string, Record_>>({});
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<"cut" | "tools" | "start" | "done">("cut");
  const [cuts, setCuts] = useState<Set<number>>(new Set());
  const [picked, setPicked] = useState<Record<number, Set<Tool>>>({});
  const [startPick, setStartPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    setRecords(load());
    setReady(true);
  }, []);

  const s = SCENARIOS[index];
  const groups = useMemo(() => phasesOf(s), [s]);

  const reset = (next: number) => {
    setIndex(next);
    setStep("cut");
    setCuts(new Set());
    setPicked({});
    setStartPick(null);
    setChecked(false);
  };

  const save = (patch: Partial<Record_>) => {
    setRecords((prev) => {
      const current = prev[s.id] ?? { cuts: false, tools: false, start: false };
      const next = { ...prev, [s.id]: { ...current, ...patch } };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage blocked: practice still works */
      }
      return next;
    });
  };

  const cutsRight = cuts.size === s.cuts.length && s.cuts.every((c) => cuts.has(c));
  const toolsResult = s.phases.map((p, i) => toolOk(p, picked[i] ?? new Set()));
  const toolsRight = toolsResult.every(Boolean);
  const startRight = startPick !== null && s.start.includes(startPick);

  const done = SCENARIOS.filter((x) => records[x.id]).length;
  const perfect = SCENARIOS.filter((x) => {
    const r = records[x.id];
    return r && r.cuts && r.tools && r.start;
  }).length;

  const check = () => {
    setChecked(true);
    if (step === "cut") save({ cuts: cutsRight });
    if (step === "tools") save({ tools: toolsRight });
    if (step === "start") save({ start: startRight });
  };

  const next = () => {
    setChecked(false);
    if (step === "cut") setStep("tools");
    else if (step === "tools") setStep("start");
    else if (step === "start") setStep("done");
  };

  const btn = "rounded-full px-4 py-2 text-sm font-bold disabled:opacity-40";

  return (
    <section id="fases" className="scroll-mt-24 space-y-5 rounded-3xl border border-[#6b4fa0]/30 bg-white p-4 shadow-sm sm:p-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b4fa0]">Σύνθετες ασκήσεις · Θέμα Γ & Δ</p>
        <h2 className="mt-2 text-2xl font-bold text-[#1c2433] sm:text-3xl">Σπάσε το σε φάσεις · Ποιο εργαλείο;</h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-[#3d4452]">
          {SCENARIOS.length} φαινόμενα σαν αυτά του Καρατζίκου, του Σαββάλα και της Τράπεζας. Δεν λύνεις με αριθμούς: κάνεις μόνο το <b>σχέδιο</b>, όπως
          πρέπει να το κάνεις στο περιθώριο πριν από κάθε σύνθετη άσκηση. <b>1.</b> Κόψε την εκφώνηση σε φάσεις (πάτα ✂ εκεί που αλλάζει κάτι).{" "}
          <b>2.</b> Διάλεξε εργαλείο για κάθε φάση. <b>3.</b> Πες από ποια φάση ξεκινάς.
        </p>
        <button type="button" onClick={() => setShowTips((v) => !v)} className="mt-3 text-sm font-bold text-[#6b4fa0] underline underline-offset-2">
          {showTips ? "Κρύψε τα σήματα" : "Δες τα σήματα: πώς καταλαβαίνω ποιο εργαλείο"}
        </button>
        {showTips ? (
          <div className="mt-3 grid gap-3 text-sm leading-6 text-[#3d4452] sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f6f3fb] p-4">
              <p className="font-bold text-[#1c2433]">Πού κόβω;</p>
              <p className="mt-1">
                Σε κάθε ρήμα που αλλάζει την κατάσταση: <i>συγκρούεται, σφηνώνεται, διαπερνά, κολλάει, εκρήγνυται, πηδά, κόβουμε το νήμα</i> —{" "}
                και <i>ολισθαίνει, ανεβαίνει, εκτρέπεται, φεύγει από την άκρη, πέφτει</i>. Στην τομή γράφεις «υ αμέσως πριν» και «V αμέσως μετά».
              </p>
            </div>
            <div className="rounded-2xl bg-[#f6f3fb] p-4">
              <p className="font-bold text-[#1c2433]">Από πού ξεκινάω;</p>
              <p className="mt-1">
                Από τη φάση με <b>έναν άγνωστο</b>. Αν δίνουν το τέλος (πόσο γλίστρησε, πόσο ανέβηκε, πού έπεσε), ξεκινάς από το τέλος και γυρνάς
                πίσω με τη V.
              </p>
            </div>
            <ul className="space-y-1 rounded-2xl bg-[#f6f3fb] p-4 sm:col-span-2">
              <li>• «αμέσως πριν/μετά», κρούση, έκρηξη → <b>ΑΔΟ</b> (μόνο τη στιγμή της κρούσης)</li>
              <li>• δύναμη ή χρόνος ΜΕΣΑ στην κρούση για ΕΝΑ σώμα → <b>ΣF = Δp/Δt</b> (έδαφος: N = Δp/Δt + mg)</li>
              <li>• θερμότητα, απώλεια %, βάθος d, ενέργεια έκρηξης/ελατηρίου → <b>κινητική πριν/μετά</b></li>
              <li>• απόσταση με τριβή → <b>ΘΜΚΕ</b> · χρόνος με τριβή → <b>Δp = −T·Δt</b> ή κινηματική</li>
              <li>• ύψος / γωνία νήματος χωρίς τριβή → <b>ΑΔΜΕ</b> (ποτέ μέσα από πλαστική κρούση!)</li>
              <li>• φεύγει οριζόντια από ύψος → <b>οριζόντια βολή</b> (ο χρόνος μόνο από το ύψος)</li>
              <li>• τάση νήματος, «αμέσως μετά» σε νήμα, ανακύκλωση → <b>κεντρομόλος</b> (οριακή με νήμα: υ_κορ = √(gℓ), με ράβδο: υ_κορ = 0)</li>
              <li>• «ρυθμός μεταβολής ορμής / κινητικής» σε μια θέση → <b>dp/dt = ΣF</b>, <b>dK/dt = ΣF·υ</b> εκεί</li>
            </ul>
          </div>
        ) : null}
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-[#f6f3fb] px-3 py-1.5 text-sm font-semibold text-[#6b4fa0]">
          {ready ? `${perfect} τέλεια · ${done}/${SCENARIOS.length} δοκιμασμένα` : "Φόρτωση…"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5" aria-label="Μετάβαση σε φαινόμενο">
        {SCENARIOS.map((item, i) => {
          const r = records[item.id];
          const good = r && r.cuts && r.tools && r.start;
          const bg = !r ? "border-black/15 bg-white text-[#3d4452]" : good ? "border-[#1f6f5c] bg-[#e6f5ed] text-[#1f6f5c]" : "border-[#ae583a] bg-[#fff1e9] text-[#9e4a2a]";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => reset(i)}
              aria-label={`Φαινόμενο ${i + 1}`}
              aria-current={index === i ? "step" : undefined}
              className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-semibold ${bg} ${index === i ? "ring-2 ring-[#1c2433] ring-offset-2" : ""}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-[#f7f8fb] p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#857261]">
            Φαινόμενο {index + 1} από {SCENARIOS.length} · {s.title}
          </p>
          <p className="text-xs text-[#857261]">
            Μοιάζει με: {s.like} ·{" "}
            <a href={`#s${index + 1}`} className="font-bold text-[#6b4fa0] underline underline-offset-2">
              ▶ Δες την παρουσίαση
            </a>
            {s.id === "bounce" ? (
              <>
                {" · "}
                <a href="#anapidisi" className="font-bold text-[#6b4fa0] underline underline-offset-2">
                  Πάμε παραπέρα: 3 αναπηδήσεις
                </a>
              </>
            ) : null}
          </p>
        </div>

        {/* Step indicator */}
        <ol className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
          {[
            ["cut", "1. Φάσεις"],
            ["tools", "2. Εργαλεία"],
            ["start", "3. Από πού ξεκινάς"],
          ].map(([key, label]) => (
            <li
              key={key}
              className={`rounded-full px-3 py-1 ${step === key ? "bg-[#6b4fa0] text-white" : "bg-white text-[#5b6577] ring-1 ring-black/10"}`}
            >
              {label}
            </li>
          ))}
        </ol>

        {/* Statement with cuts */}
        <div className="mt-4 rounded-xl border border-black/10 bg-white p-4 text-base leading-8 text-[#1c2433]">
          {s.segs.map((seg, i) => {
            const isLast = i === s.segs.length - 1;
            const mine = cuts.has(i);
            const right = s.cuts.includes(i);
            const showRight = step !== "cut" || checked;
            let style = "border-black/15 bg-[#f7f8fb] text-[#857261] hover:bg-[#f6f3fb]";
            if (step === "cut" && !checked && mine) style = "border-[#6b4fa0] bg-[#6b4fa0] text-white";
            if (showRight && right) style = "border-[#1f6f5c] bg-[#1f6f5c] text-white";
            if (showRight && mine && !right) style = "border-[#ae583a] bg-[#fff1e9] text-[#9e4a2a] line-through";
            return (
              <span key={i}>
                <span>{seg} </span>
                {!isLast ? (
                  <button
                    type="button"
                    disabled={step !== "cut" || checked}
                    onClick={() =>
                      setCuts((prev) => {
                        const nextCuts = new Set(prev);
                        if (nextCuts.has(i)) nextCuts.delete(i);
                        else nextCuts.add(i);
                        return nextCuts;
                      })
                    }
                    aria-label={`Τομή μετά το κομμάτι ${i + 1}`}
                    aria-pressed={mine}
                    className={`mx-1 inline-flex h-7 min-w-7 items-center justify-center rounded-md border px-1 align-middle text-sm font-bold ${style}`}
                  >
                    ✂
                  </button>
                ) : null}
              </span>
            );
          })}
          <p className="mt-2 text-sm font-bold text-[#1c2433]">{s.ask}</p>
        </div>

        {/* Step 1 feedback */}
        {step === "cut" && checked ? (
          <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${cutsRight ? "border-[#1f6f5c]/30 bg-[#e6f5ed]" : "border-[#ae583a]/30 bg-[#fff1e9]"}`} role="status">
            <p className="font-bold">
              {cutsRight ? `Σωστά: ${s.phases.length} φάσεις.` : `Όχι ακριβώς. Οι σωστές τομές είναι με πράσινο: ${s.phases.length} φάσεις.`}
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              {s.phases.map((p, i) => (
                <li key={i}>
                  <b>{p.label}</b>
                </li>
              ))}
            </ol>
            {!cutsRight ? (
              <p className="mt-2">Τομή μπαίνει εκεί που αλλάζει το σύστημα ή οι δυνάμεις: αρχή/τέλος κρούσης, αρχή τριβής, βολής, κυκλικής.</p>
            ) : null}
          </div>
        ) : null}

        {/* Step 2: tools per phase */}
        {step !== "cut" ? (
          <div className="mt-4 space-y-3">
            {s.phases.map((p, i) => {
              const sel = picked[i] ?? new Set<Tool>();
              const reveal = step !== "tools" || checked;
              const good = toolsResult[i];
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 ${reveal ? (good ? "border-[#1f6f5c]/40 bg-[#f0faf4]" : "border-[#ae583a]/40 bg-[#fff6f0]") : "border-black/10 bg-white"}`}
                >
                  <p className="text-sm font-bold text-[#1c2433]">
                    Φάση {i + 1}: {p.label}
                  </p>
                  <p className="text-xs text-[#5b6577]">{groups[i]?.map((g) => s.segs[g]).join(" ")}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {TOOLS.map((t) => {
                      const on = sel.has(t.id);
                      const isBest = p.best.includes(t.id);
                      let style = on ? "border-[#6b4fa0] bg-[#6b4fa0] text-white" : "border-black/15 bg-white text-[#3d4452] hover:bg-[#f6f3fb]";
                      if (reveal && isBest) style = "border-[#1f6f5c] bg-[#1f6f5c] text-white";
                      else if (reveal && on && !(p.ok ?? []).includes(t.id)) style = "border-[#ae583a] bg-[#fff1e9] text-[#9e4a2a] line-through";
                      else if (reveal && on) style = "border-[#1f6f5c] bg-[#e6f5ed] text-[#1f6f5c]";
                      return (
                        <button
                          key={t.id}
                          type="button"
                          title={t.hint}
                          disabled={step !== "tools" || checked}
                          aria-pressed={on}
                          onClick={() =>
                            setPicked((prev) => {
                              const set = new Set(prev[i] ?? []);
                              if (set.has(t.id)) set.delete(t.id);
                              else set.add(t.id);
                              return { ...prev, [i]: set };
                            })
                          }
                          className={`min-h-9 rounded-full border px-3 text-xs font-bold ${style}`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                  {reveal ? (
                    <div className="mt-2 text-sm leading-6 text-[#3d4452]">
                      <p>
                        {good ? "✓ " : "✗ "}
                        {p.why}
                        {p.ok?.length ? <span className="text-[#5b6577]"> (Δεκτό και: {p.ok.map(toolLabel).join(", ")}.)</span> : null}
                      </p>
                      <p className="mt-1 rounded-lg bg-white/80 px-3 py-1.5 font-mono text-[13px] text-[#1c2433]">{p.eq}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Step 3: where to start */}
        {step === "start" || step === "done" ? (
          <div className="mt-4 rounded-xl border border-black/10 bg-white p-3">
            <p className="text-sm font-bold text-[#1c2433]">Από ποια φάση ξεκινάς τη λύση;</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {s.phases.map((p, i) => {
                const on = startPick === i;
                const reveal = step === "done" || checked;
                let style = on ? "border-[#6b4fa0] bg-[#6b4fa0] text-white" : "border-black/15 bg-white text-[#3d4452] hover:bg-[#f6f3fb]";
                if (reveal && s.start.includes(i)) style = "border-[#1f6f5c] bg-[#1f6f5c] text-white";
                else if (reveal && on) style = "border-[#ae583a] bg-[#fff1e9] text-[#9e4a2a] line-through";
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={step !== "start" || checked}
                    onClick={() => setStartPick(i)}
                    className={`min-h-9 rounded-full border px-3 text-sm font-bold ${style}`}
                  >
                    {i + 1}. {p.label}
                  </button>
                );
              })}
            </div>
            {step === "done" || checked ? (
              <p className={`mt-2 text-sm leading-6 ${startRight ? "text-[#1f6f5c]" : "text-[#9e4a2a]"}`}>
                {startRight ? "✓ " : "✗ "}
                {s.startWhy}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {step !== "done" && !checked ? (
            <button
              type="button"
              onClick={check}
              disabled={(step === "cut" && cuts.size === 0) || (step === "tools" && s.phases.some((_, i) => !(picked[i]?.size)) ) || (step === "start" && startPick === null)}
              className={`${btn} bg-[#6b4fa0] text-white`}
            >
              Έλεγχος
            </button>
          ) : null}
          {step !== "done" && checked ? (
            <button type="button" onClick={next} className={`${btn} bg-[#1c2433] text-white`}>
              {step === "start" ? "Τέλος φαινομένου" : "Επόμενο βήμα →"}
            </button>
          ) : null}
          {step === "done" ? (
            <>
              <p className="w-full text-sm font-bold text-[#1c2433]">
                Αποτέλεσμα: φάσεις {records[s.id]?.cuts ? "✓" : "✗"} · εργαλεία {records[s.id]?.tools ? "✓" : "✗"} · εκκίνηση {records[s.id]?.start ? "✓" : "✗"}
              </p>
              <a href={`#s${index + 1}`} className={`${btn} border border-[#6b4fa0] text-[#6b4fa0]`}>
                ▶ Δες την παρουσίαση με κίνηση
              </a>
              <button type="button" onClick={() => reset(index)} className={`${btn} border border-black/10 text-[#3d4452]`}>
                Ξανά αυτό
              </button>
              <button
                type="button"
                disabled={index === SCENARIOS.length - 1}
                onClick={() => reset(index + 1)}
                className={`${btn} bg-[#6b4fa0] text-white`}
              >
                Επόμενο φαινόμενο →
              </button>
            </>
          ) : null}
          {step === "cut" && !checked ? (
            <p className="text-xs text-[#857261]">Πάτα ✂ σε όσα σημεία θες (ξαναπάτα για να το βγάλεις).</p>
          ) : null}
        </div>
      </div>

      {done > 0 ? (
        <button
          type="button"
          className="text-xs font-semibold text-[#857261] underline underline-offset-2"
          onClick={() => {
            if (!window.confirm("Να διαγραφούν τα αποτελέσματα από αυτή τη συσκευή;")) return;
            setRecords({});
            reset(0);
            try {
              window.localStorage.removeItem(KEY);
            } catch {
              /* ignore */
            }
          }}
        >
          Μηδενισμός αποτελεσμάτων
        </button>
      ) : null}
      <StudyMark lesson="ormi" id="fases" title="Σύνθετες: φάσεις & εργαλεία (quiz)" path="/mixalis/ormi" />
    </section>
  );
}
