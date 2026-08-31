"use client";

import { useMemo, useState } from "react";
import { FlaskConical, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SmartLabContent, SmartLabControl, SmartLabQuantity, SmartLabWidget } from "@/lib/mixalis/smartlab-types";

type Values = Record<string, number>;

function number(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(value);
}

function initialValues(widget: SmartLabWidget): Values {
  return Object.fromEntries((widget.controls || []).map((control) => [control.id, control.defaultValue]));
}

function quantityById(widget: SmartLabWidget, id: string) {
  return (widget.quantities || []).find((quantity) => quantity.id === id);
}

function studentText(widget: SmartLabWidget, text: string | null | undefined) {
  let output = String(text || "");
  const quantities = [...(widget.quantities || [])].sort((a, b) => b.id.length - a.id.length);
  for (const quantity of quantities) output = output.split(quantity.id).join(quantity.symbol || quantity.name);
  return output;
}

function looksLikeSystemForces(widget: SmartLabWidget) {
  const text = `${widget.title} ${widget.concept} ${widget.scene?.description || ""}`.toLocaleLowerCase("el-GR");
  return text.includes("σύστημα") && text.includes("εσωτερ") && text.includes("εξωτερ");
}

function externalForceControl(widget: SmartLabWidget) {
  return (widget.controls || []).find((control) => {
    const quantity = quantityById(widget, control.quantityId);
    const text = `${quantity?.name || ""} ${quantity?.symbol || ""} ${control.label || ""}`.toLocaleLowerCase("el-GR");
    return text.includes("εξωτερ") || text.includes("σf") || text.includes("σfεξ") || text.includes("σfεξ");
  }) || widget.controls?.[0];
}

function SystemForcesDiagram({ widget, values }: { widget: SmartLabWidget; values: Values }) {
  const control = externalForceControl(widget);
  const quantity = control ? quantityById(widget, control.quantityId) : undefined;
  const value = control ? Number(values[control.id] ?? control.defaultValue) : 0;
  const maxAbs = control ? Math.max(Math.abs(control.min), Math.abs(control.max), 1) : 1;
  const magnitude = Math.min(1, Math.abs(value) / maxAbs);
  const arrowLength = value === 0 ? 0 : 42 + magnitude * 92;
  const positive = value >= 0;
  const arrowId = `generic-system-arrow-${widget.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const internalId = `${arrowId}-internal`;
  const unit = quantity?.unit || control?.unit || "";
  const symbol = quantity?.symbol || control?.symbol || "ΣFεξ";

  return (
    <div className="min-w-0">
      <svg viewBox="0 0 680 360" className="w-full" role="img" aria-label="Διαδραστικό διάγραμμα συστήματος, εσωτερικών και εξωτερικών δυνάμεων">
        <defs>
          <marker id={arrowId} markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,7 L8,3.5 z" fill="context-stroke" />
          </marker>
          <marker id={internalId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L7,3 z" fill="context-stroke" />
          </marker>
        </defs>

        <text x="340" y="28" textAnchor="middle" className="fill-stone-600" fontSize="13">όριο του συστήματος</text>
        <rect x="150" y="52" width="380" height="230" rx="28" fill="none" stroke="currentColor" className="text-stone-400" strokeWidth="2.5" strokeDasharray="10 8" />
        <text x="340" y="82" textAnchor="middle" className="fill-stone-500" fontSize="12">ΣΥΣΤΗΜΑ</text>

        <circle cx="265" cy="166" r="34" className="fill-stone-200 stroke-stone-500" strokeWidth="2" />
        <circle cx="415" cy="166" r="34" className="fill-stone-200 stroke-stone-500" strokeWidth="2" />
        <text x="265" y="172" textAnchor="middle" className="fill-stone-800" fontSize="15">1</text>
        <text x="415" y="172" textAnchor="middle" className="fill-stone-800" fontSize="15">2</text>

        <g className="text-sky-700">
          <line x1="300" y1="145" x2="365" y2="145" stroke="currentColor" strokeWidth="3" markerEnd={`url(#${internalId})`} />
          <line x1="380" y1="188" x2="315" y2="188" stroke="currentColor" strokeWidth="3" markerEnd={`url(#${internalId})`} />
          <text x="340" y="126" textAnchor="middle" fill="currentColor" fontSize="12">εσωτερικές δυνάμεις</text>
          <text x="340" y="216" textAnchor="middle" fill="currentColor" fontSize="11">ίσα και αντίθετα ζεύγη → δεν αλλάζουν τη συνολική ορμή του συστήματος</text>
        </g>

        <text x="340" y="260" textAnchor="middle" className="fill-stone-500" fontSize="11">Οι εσωτερικές δυνάμεις είναι μέσα στο διακεκομμένο όριο.</text>

        {value !== 0 ? (
          <g className="text-rose-700">
            {positive ? (
              <line x1={120 - arrowLength} y1="166" x2="140" y2="166" stroke="currentColor" strokeWidth="5" markerEnd={`url(#${arrowId})`} />
            ) : (
              <line x1={560 + arrowLength} y1="166" x2="540" y2="166" stroke="currentColor" strokeWidth="5" markerEnd={`url(#${arrowId})`} />
            )}
            <text x={positive ? 84 : 596} y="140" textAnchor="middle" fill="currentColor" fontSize="13">εξωτερική επίδραση</text>
          </g>
        ) : (
          <g>
            <circle cx="110" cy="166" r="5" className="fill-emerald-700" />
            <text x="82" y="140" textAnchor="middle" className="fill-emerald-700" fontSize="12">καμία συνισταμένη</text>
            <text x="82" y="156" textAnchor="middle" className="fill-emerald-700" fontSize="12">εξωτερική δύναμη</text>
          </g>
        )}

        <rect x="220" y="304" width="240" height="38" rx="18" className="fill-stone-100 stroke-stone-200" />
        <text x="340" y="328" textAnchor="middle" className="fill-stone-900" fontSize="14" fontWeight="600">{symbol} = {number(value)} {unit}</text>
      </svg>
      <div className="border-t border-stone-200 pt-4 text-sm leading-6 text-stone-600">
        {value === 0
          ? "Με μηδενική συνισταμένη εξωτερικών δυνάμεων, οι εσωτερικές αλληλεπιδράσεις μπορούν να αλλάζουν τις ορμές των μερών, όχι όμως τη συνολική ορμή του συστήματος."
          : `Η μη μηδενική ${symbol} δείχνει ότι το περιβάλλον ασκεί καθαρή εξωτερική επίδραση στο σύστημα. Το βέλος δείχνει τη φορά και το μήκος του μεταβάλλεται με το μέτρο της δύναμης.`}
      </div>
    </div>
  );
}

function RelationDiagram({ widget, values }: { widget: SmartLabWidget; values: Values }) {
  const controls = widget.controls || [];
  const quantities = widget.quantities || [];
  const controlIds = new Set(controls.map((control) => control.quantityId));
  const impacted = new Set((widget.impactModel || []).flatMap((rule) => rule.changes || []));

  return (
    <div className="min-h-72 rounded-2xl border border-stone-200 bg-[#fcfbf9] p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Χάρτης φυσικών σχέσεων</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
        Το LAB δεν επινοεί αριθμητικό τύπο που δεν έχει επαληθευτεί. Δείχνει ποια μεγέθη ελέγχεις και ποια επηρεάζονται σύμφωνα με το verified impact model.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {quantities.map((quantity) => {
          const control = controls.find((item) => item.quantityId === quantity.id);
          const value = control ? Number(values[control.id] ?? control.defaultValue) : null;
          const kind = controlIds.has(quantity.id) ? "ΑΝΕΞΑΡΤΗΤΟ" : impacted.has(quantity.id) ? "ΕΠΗΡΕΑΖΕΤΑΙ" : "ΠΑΡΑΜΕΝΕΙ / ΠΑΡΑΤΗΡΕΙΤΑΙ";
          return (
            <div key={quantity.id} className="rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-stone-950">{quantity.symbol || quantity.name}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">{quantity.name}</p>
                </div>
                <Badge variant="outline" className="shrink-0 bg-stone-50 text-[10px]">{kind}</Badge>
              </div>
              {value !== null ? <p className="mt-3 font-mono text-sm text-stone-800">{number(value)} {quantity.unit}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ControlPanel({ widget, values, onChange }: { widget: SmartLabWidget; values: Values; onChange: (control: SmartLabControl, value: number) => void }) {
  return (
    <div className="space-y-6">
      {(widget.controls || []).map((control) => {
        const quantity = quantityById(widget, control.quantityId);
        const value = Number(values[control.id] ?? control.defaultValue);
        const label = quantity?.name || control.label;
        const symbol = quantity?.symbol || control.symbol;
        const unit = quantity?.unit || control.unit;
        if (control.type === "toggle") {
          const checked = value > (control.min + control.max) / 2;
          return (
            <label key={control.id} className="flex items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <span className="text-sm font-semibold text-stone-900">{symbol ? `${symbol} — ` : ""}{label}</span>
              <input type="checkbox" checked={checked} onChange={(event) => onChange(control, event.target.checked ? control.max : control.min)} className="h-5 w-5 accent-[#334f39]" />
            </label>
          );
        }
        return (
          <label key={control.id} className="block">
            <div className="mb-2.5 flex items-start justify-between gap-3">
              <div><p className="text-sm font-semibold leading-5 text-stone-900">{label}</p><p className="mt-0.5 text-xs text-stone-500">{symbol}</p></div>
              <Badge variant="outline" className="shrink-0 bg-white font-mono text-stone-700">{number(value)} {unit}</Badge>
            </div>
            <input type="range" min={control.min} max={control.max} step={control.step} value={value} onChange={(event) => onChange(control, Number(event.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-[#334f39]" />
            <div className="mt-1.5 flex justify-between text-[11px] text-stone-400"><span>{number(control.min)} {unit}</span><span>{number(control.max)} {unit}</span></div>
          </label>
        );
      })}
    </div>
  );
}

function GenericWidget({ widget }: { widget: SmartLabWidget }) {
  const [values, setValues] = useState<Values>(() => initialValues(widget));
  const [changedId, setChangedId] = useState<string | null>(null);
  const impact = useMemo(() => (widget.impactModel || []).find((item) => item.controlQuantityId === changedId) || null, [changedId, widget]);
  const visual = looksLikeSystemForces(widget)
    ? <SystemForcesDiagram widget={widget} values={values} />
    : <RelationDiagram widget={widget} values={values} />;

  return (
    <Card className="overflow-hidden rounded-3xl border-stone-200 bg-white shadow-sm">
      <CardHeader className="space-y-2 border-b border-stone-100 px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2"><Badge className="gap-1.5 bg-[#334f39] text-white hover:bg-[#334f39]"><FlaskConical className="h-3.5 w-3.5" /> SMARTLAB</Badge><span className="text-xs text-stone-500">Άλλαξε μία παράμετρο και δες τι αλλάζει στο σύστημα.</span></div>
        <CardTitle className="text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">{studentText(widget, widget.title)}</CardTitle>
        {widget.scene?.description ? <p className="max-w-3xl text-sm leading-6 text-stone-600">{studentText(widget, widget.scene.description)}</p> : null}
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(290px,.7fr)]">
          <div className="min-w-0 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">{visual}</div>
          <aside className="border-t border-stone-200 bg-[#fcfbf9] px-4 py-5 sm:px-6 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Τι μπορείς να αλλάξεις</p>
            <p className="mt-1 text-xs leading-5 text-stone-500">Μετακίνησε μία παράμετρο και παρατήρησε τη φυσική συνέπεια.</p>
            <div className="mt-5"><ControlPanel widget={widget} values={values} onChange={(control, value) => { setValues((current) => ({ ...current, [control.id]: value })); setChangedId(control.quantityId); }} /></div>
            {impact ? <div className="mt-6 border-t border-stone-200 pt-5"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">Τι αλλάζει</p><p className="mt-2 text-xs leading-5 text-stone-600">{studentText(widget, impact.explanation)}</p></div> : null}
            <Button type="button" variant="outline" onClick={() => { setValues(initialValues(widget)); setChangedId(null); }} className="mt-6 min-h-10"><RotateCcw className="h-4 w-4" /> Επαναφορά</Button>
          </aside>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SmartLabGenericExperience({ content }: { content: SmartLabContent }) {
  return (
    <div className="space-y-8">
      {content.subchapters.map((section) => section.widgets.length ? (
        <section key={section.subchapterId} className="space-y-3">
          <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">{section.subchapterLabel}</p><h2 className="mt-1 text-xl font-semibold text-stone-950 sm:text-2xl">{section.subchapterTitle}</h2></div>
          {section.widgets[0].physicsPreset === "generic_relation"
            ? <GenericWidget widget={section.widgets[0]} />
            : null}
        </section>
      ) : null)}
    </div>
  );
}
