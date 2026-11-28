"use client";

import { AnimCard } from "../AnimCard";
import { Fragment } from "react";
import { BounceDeep } from "./BounceDeep";
import { SINTHETA_CASES } from "./all";
import { SINTHETA_STEPS } from "./solutions";

const ACCENT = "#6b4fa0";

export function SinthetaPresentations() {
  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      {SINTHETA_CASES.map((c) => (
        <Fragment key={c.n}>
          <AnimCard data={SINTHETA_STEPS[c.n] ? { ...c, steps: SINTHETA_STEPS[c.n] } : c} accent={ACCENT} idPrefix="s" study={{ lesson: "ormi", path: "/mixalis/ormi2" }} />
          {/* Σύνθετη 5: το «πάμε παραπέρα» μπαίνει ακριβώς κάτω από την κάρτα της (owner, 2026-11-21). */}
          {c.n === 5 ? (
            <div className="lg:col-span-2">
              <BounceDeep />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
