"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SmartLabControl, SmartLabQuantity, SmartLabWidget } from "@/lib/mixalis/smartlab-types";

type Values = Record<string, number>;

function number(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(value);
}

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

function quantityText(quantity: SmartLabQuantity | undefined) {
  return `${quantity?.name || ""} ${cleanSymbol(quantity?.symbol)}`.toLocaleLowerCase("el-GR");
}

function findControl(widget: SmartLabWidget, predicate: (control: SmartLabControl, quantity: SmartLabQuantity | undefined) => boolean) {
  return (widget.controls || []).find((control) => predicate(control, quantityById(widget, control.quantityId)));
}

function massControl(widget: SmartLabWidget) {
  return findControl(widget, (control, quantity) => control.role === "mass" || quantityText(quantity).includes("μάζ"));
}

function speedControl(widget: SmartLabWidget) {
  return findControl(widget, (control, quantity) => {
    if (control.role === "initial_speed" || control.role === "linear_speed") return true;
    const text = quantityText(quantity);
    return (text.includes("ταχύτητα") || text.includes("speed")) && !text.includes("μεταβολ");
  });
}

function controlValue(values: Values, control: SmartLabControl | undefined, fallback: number) {
  return control ? Number(values[control.id] ?? control.defaultValue) : fallback;
}

function arrowId(widget: SmartLabWidget) {
  return `collision-arrow-${widget.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

export function looksLikeCollision(widget: SmartLabWidget) {
  const text = `${widget.title} ${widget.concept} ${widget.scene?.description || ""}`.toLocaleLowerCase("el-GR");
  return text.includes("κρούσ") || text.includes("σύγκρουσ") || text.includes("collision");
}

export default function SmartLabCollision1D({ widget, values }: { widget: SmartLabWidget; values: Values }) {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);

  const mControl = useMemo(() => massControl(widget), [widget]);
  const vControl = useMemo(() => speedControl(widget), [widget]);
  const mass = Math.max(0.05, controlValue(values, mControl, 2));
  const speed = Math.max(0, controlValue(values, vControl, 8));
  const maxSpeed = Math.max(vControl?.max || speed || 1, 1);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setPhase((current) => {
        const next = current + 0.012;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
    }, 35);
    return () => window.clearInterval(timer);
  }, [playing]);

  const collisionAt = 0.48;
  const after = phase >= collisionAt;
  const collisionProgress = Math.min(1, phase / collisionAt);
  const afterProgress = Math.max(0, (phase - collisionAt) / (1 - collisionAt));

  const trackY = 190;
  const bodyRadius = 25 + Math.min(11, Math.sqrt(mass) * 2.5);
  const bodyBXBefore = 366;
  const bodyAXBefore = 92 + collisionProgress * (bodyBXBefore - 2 * bodyRadius - 92);
  const joinedCenter = bodyBXBefore - bodyRadius;
  const joinedX = joinedCenter + afterProgress * 132;
  const bodyAX = after ? joinedX - bodyRadius * 0.72 : bodyAXBefore;
  const bodyBX = after ? joinedX + bodyRadius * 0.72 : bodyBXBefore;

  const finalSpeed = speed / 2;
  const totalMomentum = mass * speed;
  const pAFinal = mass * finalSpeed;
  const pBFinal = mass * finalSpeed;
  const deltaPA = -mass * speed / 2;
  const deltaPB = mass * speed / 2;
  const kineticBefore = 0.5 * mass * speed * speed;
  const kineticAfter = 0.25 * mass * speed * speed;
  const kineticLoss = kineticBefore - kineticAfter;

  const speedRatio = Math.min(1, speed / maxSpeed);
  const beforeArrow = speed === 0 ? 0 : 48 + speedRatio * 72;
  const afterArrow = finalSpeed === 0 ? 0 : 34 + speedRatio * 44;
  const marker = arrowId(widget);
  const stageLabel = phase < collisionAt - 0.05 ? "ΠΡΙΝ ΤΗΝ ΚΡΟΥΣΗ" : phase <= collisionAt + 0.06 ? "ΣΤΙΓΜΗ ΚΡΟΥΣΗΣ" : "ΜΕΤΑ ΤΗΝ ΚΡΟΥΣΗ";

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Badge variant="outline" className="bg-white text-stone-700">{stageLabel}</Badge>
        <p className="text-xs text-stone-500">Ίσες μάζες · Β αρχικά ακίνητο · τελείως πλαστική κρούση</p>
      </div>

      <svg viewBox="0 0 720 360" className="w-full rounded-2xl border border-stone-200 bg-[#fcfbf9]" role="img" aria-label="Διαδραστική προσομοίωση μονοδιάστατης πλαστικής κρούσης">
        <defs>
          <marker id={marker} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,7 L8,3.5 z" fill="context-stroke" />
          </marker>
        </defs>

        <text x="32" y="36" fontSize="13" className="fill-stone-500">Παρατήρησε την κίνηση και σύγκρινε την ορμή πριν και μετά.</text>
        <line x1="38" y1={trackY + bodyRadius + 8} x2="682" y2={trackY + bodyRadius + 8} stroke="currentColor" className="text-stone-300" strokeWidth="3" />

        {!after && beforeArrow > 0 ? (
          <g className="text-emerald-700">
            <line x1={bodyAX} y1={trackY - bodyRadius - 24} x2={bodyAX + beforeArrow} y2={trackY - bodyRadius - 24} stroke="currentColor" strokeWidth="4" markerEnd={`url(#${marker})`} />
            <text x={bodyAX + beforeArrow / 2} y={trackY - bodyRadius - 34} textAnchor="middle" fill="currentColor" fontSize="13">vA={number(speed)} m/s</text>
          </g>
        ) : null}

        {after && afterArrow > 0 ? (
          <g className="text-emerald-700">
            <line x1={joinedX} y1={trackY - bodyRadius - 24} x2={joinedX + afterArrow} y2={trackY - bodyRadius - 24} stroke="currentColor" strokeWidth="4" markerEnd={`url(#${marker})`} />
            <text x={joinedX + afterArrow / 2} y={trackY - bodyRadius - 34} textAnchor="middle" fill="currentColor" fontSize="13">vτελ={number(finalSpeed)} m/s</text>
          </g>
        ) : null}

        <circle cx={bodyAX} cy={trackY} r={bodyRadius} className="fill-sky-100 stroke-sky-700" strokeWidth="3" />
        <circle cx={bodyBX} cy={trackY} r={bodyRadius} className="fill-amber-100 stroke-amber-700" strokeWidth="3" />
        <text x={bodyAX} y={trackY + 5} textAnchor="middle" className="fill-sky-900" fontSize="15" fontWeight="700">A</text>
        <text x={bodyBX} y={trackY + 5} textAnchor="middle" className="fill-amber-900" fontSize="15" fontWeight="700">B</text>

        {!after ? (
          <>
            <text x={bodyAX} y={trackY + bodyRadius + 35} textAnchor="middle" className="fill-stone-600" fontSize="12">m={number(mass)} kg</text>
            <text x={bodyBX} y={trackY + bodyRadius + 35} textAnchor="middle" className="fill-stone-600" fontSize="12">m={number(mass)} kg · vB=0</text>
          </>
        ) : (
          <text x={joinedX} y={trackY + bodyRadius + 35} textAnchor="middle" className="fill-stone-600" fontSize="12">κινούνται μαζί με v={number(finalSpeed)} m/s</text>
        )}

        {Math.abs(phase - collisionAt) < 0.07 ? (
          <g>
            <circle cx={joinedCenter} cy={trackY} r={bodyRadius + 16} fill="none" stroke="currentColor" className="text-rose-500" strokeWidth="4" opacity="0.65" />
            <text x={joinedCenter} y={trackY - bodyRadius - 52} textAnchor="middle" className="fill-rose-700" fontSize="13" fontWeight="700">ΚΡΟΥΣΗ</text>
          </g>
        ) : null}

        <g transform="translate(38 286)">
          <text x="0" y="0" className="fill-stone-500" fontSize="11">ΣΥΝΟΛΙΚΗ ΟΡΜΗ</text>
          <rect x="0" y="12" width="278" height="18" rx="9" className="fill-emerald-100" />
          <rect x="0" y="12" width="278" height="18" rx="9" className="fill-emerald-600" opacity="0.75" />
          <text x="290" y="26" className="fill-stone-800" fontSize="12">pολ={number(totalMomentum)} kg·m/s</text>
        </g>

        <g transform="translate(410 286)">
          <text x="0" y="0" className="fill-stone-500" fontSize="11">ΚΙΝΗΤΙΚΗ ΕΝΕΡΓΕΙΑ</text>
          <rect x="0" y="12" width="180" height="18" rx="9" className="fill-stone-200" />
          <rect x="0" y="12" width={after ? 90 : 180} height="18" rx="9" className="fill-violet-600" opacity="0.75" />
          <text x="190" y="26" className="fill-stone-800" fontSize="12">{number(after ? kineticAfter : kineticBefore)} J</text>
        </g>
      </svg>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">Ορμή συστήματος</p>
          <p className="mt-1 text-lg font-semibold text-stone-950">{number(totalMomentum)} kg·m/s</p>
          <p className="mt-1 text-xs text-emerald-700">ίδια πριν και μετά</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">Μεταβολή ορμής Α</p>
          <p className="mt-1 text-lg font-semibold text-stone-950">{number(deltaPA)} kg·m/s</p>
          <p className="mt-1 text-xs text-stone-500">χάνει όση ορμή κερδίζει το Β</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">Μεταβολή ορμής Β</p>
          <p className="mt-1 text-lg font-semibold text-stone-950">+{number(deltaPB)} kg·m/s</p>
          <p className="mt-1 text-xs text-stone-500">pAτελ=pBτελ={number(pAFinal)} kg·m/s</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">Απώλεια K</p>
          <p className="mt-1 text-lg font-semibold text-stone-950">{number(kineticLoss)} J</p>
          <p className="mt-1 text-xs text-violet-700">Kμετά={number(kineticAfter)} J · δεν διατηρείται</p>
        </div>
      </div>

      <div className="mt-5 border-t border-stone-200 pt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-stone-900">Εξέλιξη της κρούσης</p>
            <p className="text-xs text-stone-500">σύρε τον δείκτη ή πάτησε Έναρξη</p>
          </div>
          <Badge variant="outline" className="bg-white font-mono text-stone-700">{Math.round(phase * 100)}%</Badge>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={phase}
          aria-label="Εξέλιξη της κρούσης"
          onChange={(event) => {
            setPlaying(false);
            setPhase(Number(event.target.value));
          }}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-[#334f39]"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" onClick={() => {
            if (phase >= 1) setPhase(0);
            setPlaying((current) => !current);
          }} className="min-h-10 bg-[#334f39] hover:bg-[#29412f]">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Παύση" : "Έναρξη"}
          </Button>
          <Button type="button" variant="outline" onClick={() => { setPlaying(false); setPhase(0); }} className="min-h-10">
            <RotateCcw className="h-4 w-4" /> Επαναφορά κρούσης
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f3f7f1] p-4 text-sm leading-6 text-[#334f39]">
        Η συνολική ορμή μένει {number(totalMomentum)} kg·m/s επειδή θεωρούμε μηδενική εξωτερική ώθηση. Η κινητική ενέργεια όμως πέφτει από {number(kineticBefore)} J σε {number(kineticAfter)} J, επειδή η κρούση είναι τελείως πλαστική.
      </div>
    </div>
  );
}
