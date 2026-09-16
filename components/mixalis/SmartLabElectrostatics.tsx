"use client";

import { Badge } from "@/components/ui/badge";
import {
  calculateCoulombPair,
  calculatePointChargeField,
  COULOMB_CONSTANT,
  electrostaticsMode,
  parseFixedCharge,
} from "@/lib/mixalis/smartlab-electrostatics";
import type { SmartLabControl, SmartLabQuantity, SmartLabWidget } from "@/lib/mixalis/smartlab-types";

type Values = Record<string, number>;

function cleanSymbol(value: string | null | undefined) {
  return String(value || "")
    .normalize("NFC")
    .replace(/[\u20d0-\u20ff]/g, "")
    .replace(/⃗/g, "")
    .trim();
}

function quantityById(widget: SmartLabWidget, id: string) {
  return (widget.quantities || []).find((quantity) => quantity.id === id);
}

function controlText(widget: SmartLabWidget, control: SmartLabControl) {
  const quantity = quantityById(widget, control.quantityId);
  return `${quantity?.name || ""} ${cleanSymbol(quantity?.symbol || control.symbol)} ${control.label || ""}`
    .normalize("NFC")
    .toLocaleLowerCase("el-GR");
}

function isChargeControl(widget: SmartLabWidget, control: SmartLabControl) {
  const text = controlText(widget, control);
  return text.includes("φορτί") || text.includes("charge") || /(^|\s)[qQ](\s|$)/.test(`${control.symbol} ${quantityById(widget, control.quantityId)?.symbol || ""}`);
}

function sourceChargeControl(widget: SmartLabWidget) {
  const chargeControls = (widget.controls || []).filter((control) => isChargeControl(widget, control));
  return chargeControls.find((control) => {
    const text = controlText(widget, control);
    const symbol = cleanSymbol(quantityById(widget, control.quantityId)?.symbol || control.symbol);
    return text.includes("πηγή") || text.includes("source") || symbol === "Q";
  });
}

function testChargeControl(widget: SmartLabWidget) {
  const source = sourceChargeControl(widget);
  const chargeControls = (widget.controls || []).filter((control) => isChargeControl(widget, control));
  return chargeControls.find((control) => {
    if (control.id === source?.id) return false;
    const text = controlText(widget, control);
    const symbol = cleanSymbol(quantityById(widget, control.quantityId)?.symbol || control.symbol);
    return text.includes("δοκιμασ") || text.includes("μετακινούμεν") || text.includes("test") || symbol === "q";
  }) || chargeControls.find((control) => control.id !== source?.id) || chargeControls[0];
}

function distanceControl(widget: SmartLabWidget) {
  return (widget.controls || []).find((control) => {
    const text = controlText(widget, control);
    const symbol = cleanSymbol(quantityById(widget, control.quantityId)?.symbol || control.symbol).toLocaleLowerCase("el-GR");
    return text.includes("απόστα") || text.includes("distance") || symbol === "r";
  });
}

function valueOf(values: Values, control: SmartLabControl | undefined, fallback: number) {
  return control ? Number(values[control.id] ?? control.defaultValue) : fallback;
}

function rangeFraction(value: number, control: SmartLabControl | undefined) {
  if (!control || control.max === control.min) return 0.5;
  return Math.max(0, Math.min(1, (value - control.min) / (control.max - control.min)));
}

function maxAbs(control: SmartLabControl | undefined, fallback: number) {
  return control ? Math.max(Math.abs(control.min), Math.abs(control.max), Math.abs(fallback), 1e-12) : Math.max(Math.abs(fallback), 1e-12);
}

function minPositiveDistance(control: SmartLabControl | undefined, fallback: number) {
  if (!control) return Math.max(Math.abs(fallback), 1e-6);
  const candidates = [control.min, control.max, control.step].map(Math.abs).filter((value) => value > 0);
  return Math.max(Math.min(...candidates), 1e-6);
}

const superscript: Record<string, string> = {
  "-": "⁻", "+": "⁺", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const magnitude = Math.abs(value);
  if (magnitude >= 0.01 && magnitude < 10_000) {
    return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(value);
  }
  const [coefficient, exponent] = value.toExponential(digits).split("e");
  const trimmed = coefficient.replace(/\.?0+$/, "").replace(".", ",");
  return `${trimmed} × 10${[...exponent].map((character) => superscript[character] || character).join("")}`;
}

function chargeSign(value: number) {
  return value > 0 ? "+" : value < 0 ? "−" : "0";
}

function chargeStyle(value: number) {
  if (value > 0) return "fill-rose-100 stroke-rose-700";
  if (value < 0) return "fill-sky-100 stroke-sky-700";
  return "fill-stone-100 stroke-stone-500";
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-stone-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-500">{detail}</p>
    </div>
  );
}

function markerId(widget: SmartLabWidget, suffix: string) {
  return `electrostatic-${suffix}-${widget.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function CoulombPairDiagram({ widget, values }: { widget: SmartLabWidget; values: Values }) {
  const sourceControl = sourceChargeControl(widget);
  const testControl = testChargeControl(widget);
  const rControl = distanceControl(widget);
  const testCharge = valueOf(values, testControl, 1e-6);
  const sourceFallback = Math.max(maxAbs(testControl, 1e-6), 1e-6);
  const sourceCharge = valueOf(values, sourceControl, parseFixedCharge(widget.scene?.description, sourceFallback));
  const distance = valueOf(values, rControl, 1);
  const state = calculateCoulombPair(sourceCharge, testCharge, distance);

  const leftX = 160;
  const rightX = 405 + 180 * rangeFraction(distance, rControl);
  const centerY = 190;
  const maximumForce = COULOMB_CONSTANT * maxAbs(sourceControl, sourceCharge) * maxAbs(testControl, testCharge)
    / (minPositiveDistance(rControl, distance) ** 2);
  const forceRatio = maximumForce > 0 ? Math.min(1, state.forceMagnitude / maximumForce) : 0;
  const arrowLength = state.interaction === "none" ? 0 : 48 + 92 * (forceRatio ** 0.25);
  const forceMarker = markerId(widget, "pair-force");
  const dimensionMarker = markerId(widget, "pair-distance");
  const interactionLabel = state.interaction === "repulsion" ? "Άπωση" : state.interaction === "attraction" ? "Έλξη" : "Μηδενική δύναμη";

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Badge variant="outline" className="bg-white text-stone-700">{interactionLabel}</Badge>
        <p className="text-xs text-stone-500">F = k |Qq| / r² · δράση και αντίδραση</p>
      </div>

      <svg viewBox="0 0 760 390" className="w-full rounded-2xl border border-stone-200 bg-[#fcfbf9]" role="img" aria-label="Διαδραστική απεικόνιση του νόμου του Coulomb με δύο φορτία">
        <defs>
          <marker id={forceMarker} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,7 L8,3.5 z" fill="context-stroke" />
          </marker>
          <marker id={dimensionMarker} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
            <path d="M0,4 L8,0 L8,8 z" className="fill-stone-500" />
          </marker>
        </defs>

        <text x="380" y="34" textAnchor="middle" className="fill-stone-500" fontSize="13">Μετακίνησε τα ρυθμιστικά: η απόσταση και τα βέλη δύναμης αλλάζουν άμεσα.</text>
        <line x1="70" y1={centerY + 48} x2="690" y2={centerY + 48} className="stroke-stone-200" strokeWidth="2" />

        <g className="transition-transform duration-300 motion-reduce:transition-none" transform={`translate(${leftX} ${centerY})`}>
          <circle r="39" className={chargeStyle(sourceCharge)} strokeWidth="3" />
          <text x="0" y="8" textAnchor="middle" className="fill-stone-900" fontSize="27" fontWeight="700">{chargeSign(sourceCharge)}</text>
          <text x="0" y="68" textAnchor="middle" className="fill-stone-700" fontSize="13">Q = {formatNumber(sourceCharge)} C</text>
        </g>

        <g className="transition-transform duration-300 motion-reduce:transition-none" transform={`translate(${rightX} ${centerY})`}>
          <circle r="39" className={chargeStyle(testCharge)} strokeWidth="3" />
          <text x="0" y="8" textAnchor="middle" className="fill-stone-900" fontSize="27" fontWeight="700">{chargeSign(testCharge)}</text>
          <text x="0" y="68" textAnchor="middle" className="fill-stone-700" fontSize="13">q = {formatNumber(testCharge)} C</text>
        </g>

        {state.interaction !== "none" ? (
          <g className="text-violet-700">
            <line
              x1={state.interaction === "repulsion" ? leftX - 50 : leftX + 50}
              y1={centerY - 69}
              x2={state.interaction === "repulsion" ? leftX - 50 - arrowLength : leftX + 50 + arrowLength}
              y2={centerY - 69}
              stroke="currentColor"
              strokeWidth="4"
              markerEnd={`url(#${forceMarker})`}
              className="transition-all duration-300 motion-reduce:transition-none"
            />
            <line
              x1={state.interaction === "repulsion" ? rightX + 50 : rightX - 50}
              y1={centerY - 69}
              x2={state.interaction === "repulsion" ? rightX + 50 + arrowLength : rightX - 50 - arrowLength}
              y2={centerY - 69}
              stroke="currentColor"
              strokeWidth="4"
              markerEnd={`url(#${forceMarker})`}
              className="transition-all duration-300 motion-reduce:transition-none"
            />
            <text x={(leftX + rightX) / 2} y="92" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">|F| = {formatNumber(state.forceMagnitude)} N</text>
          </g>
        ) : (
          <text x={(leftX + rightX) / 2} y="92" textAnchor="middle" className="fill-stone-500" fontSize="13">q = 0 → δεν ασκείται ηλεκτρική δύναμη</text>
        )}

        <line x1={leftX + 44} y1="315" x2={rightX - 44} y2="315" className="stroke-stone-500 transition-all duration-300 motion-reduce:transition-none" strokeWidth="1.5" markerStart={`url(#${dimensionMarker})`} markerEnd={`url(#${dimensionMarker})`} />
        <text x={(leftX + rightX) / 2} y="345" textAnchor="middle" className="fill-stone-700" fontSize="14">r = {formatNumber(state.distance)} m</text>
      </svg>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Φορτίο Q" value={`${formatNumber(sourceCharge)} C`} detail="πρώτο σημειακό φορτίο" />
        <Metric label="Φορτίο q" value={`${formatNumber(testCharge)} C`} detail="το πρόσημο αλλάζει έλξη/άπωση" />
        <Metric label="Απόσταση r" value={`${formatNumber(state.distance)} m`} detail="αν διπλασιαστεί, η δύναμη γίνεται 1/4" />
        <Metric label="Δύναμη Coulomb" value={`${formatNumber(state.forceMagnitude)} N`} detail={interactionLabel.toLocaleLowerCase("el-GR")} />
      </div>
    </div>
  );
}

function FieldDiagram({ widget, values }: { widget: SmartLabWidget; values: Values }) {
  const sourceControl = sourceChargeControl(widget);
  const testControl = testChargeControl(widget);
  const rControl = distanceControl(widget);
  const sourceCharge = valueOf(values, sourceControl, 1e-6);
  const testCharge = valueOf(values, testControl, 1e-6);
  const distance = valueOf(values, rControl, 1);
  const state = calculatePointChargeField(sourceCharge, testCharge, distance);

  const sourceX = 210;
  const centerY = 205;
  const testX = 430 + 180 * rangeFraction(distance, rControl);
  const fieldMarker = markerId(widget, "field");
  const vectorMarker = markerId(widget, "field-vector");
  const maxField = COULOMB_CONSTANT * maxAbs(sourceControl, sourceCharge) / (minPositiveDistance(rControl, distance) ** 2);
  const maxForce = maxField * maxAbs(testControl, testCharge);
  const fieldRatio = maxField > 0 ? Math.min(1, state.electricFieldMagnitude / maxField) : 0;
  const forceRatio = maxForce > 0 ? Math.min(1, state.forceMagnitude / maxForce) : 0;
  const fieldLength = state.fieldDirection === "none" ? 0 : 42 + 80 * (fieldRatio ** 0.25);
  const forceLength = state.interaction === "none" ? 0 : 42 + 80 * (forceRatio ** 0.25);
  const fieldDirection = sourceCharge > 0 ? 1 : -1;
  const forceDirection = sourceCharge * testCharge > 0 ? 1 : -1;
  const rays = Array.from({ length: 12 }, (_, index) => index * Math.PI / 6);

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Badge variant="outline" className="bg-white text-stone-700">Πεδίο σημειακού φορτίου</Badge>
        <p className="text-xs text-stone-500">E = k |Q| / r² · V = kQ / r · F = qE</p>
      </div>

      <svg viewBox="0 0 760 420" className="w-full rounded-2xl border border-stone-200 bg-[#fcfbf9]" role="img" aria-label="Διαδραστική απεικόνιση ηλεκτρικού πεδίου σημειακού φορτίου">
        <defs>
          <marker id={fieldMarker} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L7,3 z" fill="context-stroke" />
          </marker>
          <marker id={vectorMarker} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,7 L8,3.5 z" fill="context-stroke" />
          </marker>
        </defs>

        <text x="380" y="31" textAnchor="middle" className="fill-stone-500" fontSize="13">Οι κύκλοι είναι ισοδυναμικές· οι ακτινικές γραμμές δείχνουν τη φορά του πεδίου.</text>

        {sourceCharge !== 0 ? (
          <g className={sourceCharge > 0 ? "text-rose-500" : "text-sky-600"} opacity="0.72">
            {[62, 108, 154].map((radius) => <circle key={radius} cx={sourceX} cy={centerY} r={radius} fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="5 6" />)}
            {rays.map((angle) => {
              const innerX = sourceX + Math.cos(angle) * 46;
              const innerY = centerY + Math.sin(angle) * 46;
              const outerX = sourceX + Math.cos(angle) * 174;
              const outerY = centerY + Math.sin(angle) * 174;
              return (
                <line
                  key={angle}
                  x1={sourceCharge > 0 ? innerX : outerX}
                  y1={sourceCharge > 0 ? innerY : outerY}
                  x2={sourceCharge > 0 ? outerX : innerX}
                  y2={sourceCharge > 0 ? outerY : innerY}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  markerEnd={`url(#${fieldMarker})`}
                />
              );
            })}
          </g>
        ) : null}

        <g transform={`translate(${sourceX} ${centerY})`}>
          <circle r="39" className={chargeStyle(sourceCharge)} strokeWidth="3" />
          <text x="0" y="8" textAnchor="middle" className="fill-stone-900" fontSize="27" fontWeight="700">{chargeSign(sourceCharge)}</text>
          <text x="0" y="61" textAnchor="middle" className="fill-stone-800" fontSize="13">Q = {formatNumber(sourceCharge)} C</text>
        </g>

        <g className="transition-transform duration-300 motion-reduce:transition-none" transform={`translate(${testX} ${centerY})`}>
          <circle r="28" className={chargeStyle(testCharge)} strokeWidth="3" />
          <text x="0" y="7" textAnchor="middle" className="fill-stone-900" fontSize="21" fontWeight="700">{chargeSign(testCharge)}</text>
          <text x="0" y="51" textAnchor="middle" className="fill-stone-800" fontSize="12">q = {formatNumber(testCharge)} C</text>
        </g>

        {fieldLength > 0 ? (
          <g className="text-emerald-700">
            <line x1={testX} y1="105" x2={testX + fieldDirection * fieldLength} y2="105" stroke="currentColor" strokeWidth="4" markerEnd={`url(#${vectorMarker})`} className="transition-all duration-300 motion-reduce:transition-none" />
            <text x={testX + fieldDirection * fieldLength / 2} y="88" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">E</text>
          </g>
        ) : null}

        {forceLength > 0 ? (
          <g className="text-violet-700">
            <line x1={testX} y1="304" x2={testX + forceDirection * forceLength} y2="304" stroke="currentColor" strokeWidth="4" markerEnd={`url(#${vectorMarker})`} className="transition-all duration-300 motion-reduce:transition-none" />
            <text x={testX + forceDirection * forceLength / 2} y="328" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">F = qE</text>
          </g>
        ) : (
          <text x={testX} y="310" textAnchor="middle" className="fill-stone-500" fontSize="12">q = 0 → F = 0, αλλά E μπορεί να υπάρχει</text>
        )}

        <line x1={sourceX + 46} y1="375" x2={testX - 31} y2="375" className="stroke-stone-500 transition-all duration-300 motion-reduce:transition-none" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x={(sourceX + testX) / 2} y="401" textAnchor="middle" className="fill-stone-700" fontSize="13">r = {formatNumber(state.distance)} m</text>
      </svg>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Ένταση E" value={`${formatNumber(state.electricFieldMagnitude)} N/C`} detail="καθορίζεται από Q και r, όχι από το q" />
        <Metric label="Δύναμη F" value={`${formatNumber(state.forceMagnitude)} N`} detail="F = |q|E" />
        <Metric label="Δυναμικό V" value={`${formatNumber(state.potential)} V`} detail="το πρόσημο ακολουθεί το Q" />
        <Metric label="Δυναμική ενέργεια U" value={`${formatNumber(state.potentialEnergy)} J`} detail="U = qV" />
      </div>
    </div>
  );
}

export function looksLikeElectrostatics(widget: SmartLabWidget) {
  return electrostaticsMode(widget) !== null;
}

export default function SmartLabElectrostatics({ widget, values }: { widget: SmartLabWidget; values: Values }) {
  return electrostaticsMode(widget) === "point_charge_field"
    ? <FieldDiagram widget={widget} values={values} />
    : <CoulombPairDiagram widget={widget} values={values} />;
}
