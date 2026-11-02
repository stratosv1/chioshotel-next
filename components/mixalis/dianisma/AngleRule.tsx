"use client";

import type { ReactNode } from "react";
import { Formula } from "../omali/shared";
import { Sb } from "./figures";
import { ResolveFig } from "./ResolveFig";

const cases: {
  title: string;
  when: ReactNode;
  fig: ReactNode;
  result: ReactNode;
  tip: ReactNode;
}[] = [
  {
    title: "1. Γωνία με τον οριζόντιο",
    when: "Βαλίτσα, έλκηθρο, σχοινί που τραβάει υπό γωνία «με το έδαφος».",
    fig: (
      <ResolveFig
        phi={35}
        refDeg={0}
        angleLabel="θ"
        forceLabel="F"
        adjLabel="F·συνθ"
        oppLabel="F·ημθ"
        ariaLabel="Δύναμη με γωνία θ από τον οριζόντιο άξονα"
      />
    ),
    result: (
      <>
        <Formula>F<sub>x</sub> = F·συνθ</Formula>
        <Formula>F<sub>y</sub> = F·ημθ</Formula>
      </>
    ),
    tip: "Η γωνία ακουμπάει τον x, άρα ο x παίρνει το συν.",
  },
  {
    title: "2. Γωνία με τον κατακόρυφο",
    when: "Νήμα εκκρεμούς, σχοινί από το ταβάνι, δύναμη «με την κατακόρυφο».",
    fig: (
      <ResolveFig
        phi={55}
        refDeg={90}
        angleLabel="φ"
        forceLabel="F"
        adjLabel="F·συνφ"
        oppLabel="F·ημφ"
        ariaLabel="Δύναμη με γωνία φ από τον κατακόρυφο άξονα"
      />
    ),
    result: (
      <>
        <Formula>F<sub>x</sub> = F·ημφ</Formula>
        <Formula>F<sub>y</sub> = F·συνφ</Formula>
      </>
    ),
    tip: "Τώρα η γωνία ακουμπάει τον y, άρα ο y παίρνει το συν. Οι τύποι «αλλάζουν θέση».",
  },
  {
    title: "3. Δύναμη προς τα αριστερά ή κάτω",
    when: "Οποιαδήποτε δύναμη που δεν είναι στο 1ο τεταρτημόριο.",
    fig: (
      <ResolveFig
        phi={215}
        refDeg={180}
        angleLabel="θ"
        forceLabel="F"
        adjLabel="F·συνθ"
        oppLabel="F·ημθ"
        ariaLabel="Δύναμη προς τα αριστερά και κάτω, με γωνία θ από τον αρνητικό ημιάξονα x"
      />
    ),
    result: (
      <>
        <Formula>F<sub>x</sub> = −F·συνθ</Formula>
        <Formula>F<sub>y</sub> = −F·ημθ</Formula>
      </>
    ),
    tip: "Βρίσκεις τα μέτρα με την οξεία γωνία του σχήματος. Το πρόσημο το βάζεις κοιτώντας το βέλος: αριστερά ή κάτω ⇒ «−».",
  },
  {
    title: "4. Βάρος σε κεκλιμένο",
    when: "Σώμα πάνω σε κεκλιμένο επίπεδο γωνίας θ. Οι άξονες στρίβουν: x παράλληλα, y κάθετα στο επίπεδο.",
    fig: (
      <ResolveFig
        phi={270}
        refDeg={300}
        axisRot={30}
        incline
        angleLabel="θ"
        forceLabel="W"
        adjLabel={<>W<Sb>y</Sb></>}
        oppLabel={<>W<Sb>x</Sb></>}
        ariaLabel="Βάρος σώματος σε κεκλιμένο: η γωνία ανάμεσα στο βάρος και στον κάθετο άξονα είναι ίση με τη γωνία θ του κεκλιμένου"
      />
    ),
    result: (
      <>
        <Formula>W<sub>x</sub> = mg·ημθ</Formula>
        <Formula>W<sub>y</sub> = mg·συνθ</Formula>
      </>
    ),
    tip: (
      <>
        Η γωνία του κεκλιμένου ξαναεμφανίζεται ανάμεσα στο W και στον κάθετο άξονα (γωνίες με πλευρές κάθετες). Ακουμπάει τον κάθετο άξονα, άρα η
        κάθετη W<sub>y</sub> παίρνει το συν και η παράλληλη W<sub>x</sub> το ημ.
      </>
    ),
  },
];

export function AngleRule() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border-2 border-[#0f8b8d]/40 bg-[#eef8f8] px-5 py-4">
        <p className="text-lg font-semibold text-[#0b5f60]">
          Η συνιστώσα που <u>ακουμπάει</u> τη γωνία παίρνει <b>συν</b>. Η άλλη παίρνει <b>ημ</b>.
        </p>
        <p className="mt-1 text-[14px] leading-6 text-[#3d4452]">
          Γιατί: η πλευρά που σχηματίζει τη γωνία είναι η <b>προσκείμενη</b>, και προσκείμενη = υποτείνουσα·συν. Δεν έχει σημασία αν ο άξονας είναι ο x ή ο y.
          Γι' αυτό, πριν γράψεις οτιδήποτε, ρώτα: <b>«ποιον άξονα ακουμπάει η γωνία;»</b>
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cases.map((c) => (
          <div key={c.title} className="rounded-2xl border border-black/10 bg-[#fbf8f3] p-4">
            <p className="font-semibold">{c.title}</p>
            <p className="mt-1 text-[13px] leading-5 text-[#6b625b]">{c.when}</p>
            <div className="mx-auto mt-2 max-w-[300px] rounded-xl bg-white p-1">{c.fig}</div>
            <div className="mt-3 flex flex-wrap gap-2">{c.result}</div>
            <p className="mt-2 text-[14px] leading-6 text-[#3d4452]">{c.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
