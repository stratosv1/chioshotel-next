"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, FlaskConical, Lightbulb, Pause, Play, RotateCcw, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  SmartLabContent,
  SmartLabControl,
  SmartLabQuantity,
  SmartLabWidget as Widget,
} from "@/lib/mixalis/smartlab-types";

type Values = Record<string, number>;

function controlsOf(widget: Widget) {
  return Array.isArray(widget.controls) ? widget.controls : [];
}

function quantitiesOf(widget: Widget): SmartLabQuantity[] {
  return Array.isArray(widget.quantities) ? widget.quantities : [];
}

function initialValues(widget: Widget): Values {
  return Object.fromEntries(controlsOf(widget).map((control) => [control.id, control.defaultValue]));
}

function roleValue(widget: Widget, values: Values, role: SmartLabControl["role"], fallback: number) {
  const control = controlsOf(widget).find((item) => item.role === role);
  return control ? Number(values[control.id] ?? control.defaultValue) : fallback;
}

function roleMax(widget: Widget, role: SmartLabControl["role"], fallback: number) {
  return controlsOf(widget).find((item) => item.role === role)?.max ?? fallback;
}

function roleMin(widget: Widget, role: SmartLabControl["role"], fallback: number) {
  return controlsOf(widget).find((item) => item.role === role)?.min ?? fallback;
}

function number(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("el-GR", { maximumFractionDigits: digits }).format(value);
}

function scopeLabel(scope: Widget["scopeRelation"]) {
  if (scope === "official_core") return "Σχολικός πυρήνας";
  if (scope === "within_official_scope") return "Εμβάθυνση";
  if (scope === "exercise_extension") return "Επέκταση ασκήσεων";
  if (scope === "boundary_only") return "Όριο μοντέλου";
  return "Βάθος SMART";
}

function quantityRoleLabel(role: SmartLabQuantity["role"]) {
  if (role === "controllable") return "Το μεταβάλλεις";
  if (role === "time_state") return "Χρονική κατάσταση";
  if (role === "fixed") return "Μένει σταθερό";
  if (role === "model_assumption") return "Υπόθεση μοντέλου";
  return "Προκύπτει από τη Φυσική";
}

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-stone-900">
        {value} {unit ? <span className="text-xs font-medium text-stone-500">{unit}</span> : null}
      </p>
    </div>
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="smartlab-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L7,3 z" fill="currentColor" />
      </marker>
    </defs>
  );
}

function horizontalFallTime(widget: Widget, values: Values) {
  const h = Math.max(0.001, roleValue(widget, values, "height", 20));
  const g = Math.max(0.001, roleValue(widget, values, "gravity", 9.81));
  return Math.sqrt((2 * h) / g);
}

function HorizontalProjectile({ widget, values, time }: { widget: Widget; values: Values; time: number }) {
  const v0 = Math.max(0, roleValue(widget, values, "initial_speed", 12));
  const h = Math.max(0.001, roleValue(widget, values, "height", 20));
  const g = Math.max(0.001, roleValue(widget, values, "gravity", 9.81));
  const tFall = Math.sqrt((2 * h) / g);
  const t = Math.min(Math.max(time, 0), tFall);
  const range = v0 * tFall;
  const x = v0 * t;
  const y = Math.min(h, 0.5 * g * t * t);
  const vx = v0;
  const vy = g * t;
  const speed = Math.hypot(vx, vy);

  const maxV = Math.max(roleMax(widget, "initial_speed", v0), v0, 0.001);
  const maxH = Math.max(roleMax(widget, "height", h), h, 0.001);
  const minG = Math.max(roleMin(widget, "gravity", g), 0.001);
  const maxG = Math.max(roleMax(widget, "gravity", g), g, 0.001);
  const maxRange = Math.max(maxV * Math.sqrt((2 * maxH) / minG), 1);
  const maxVerticalSpeed = Math.sqrt(2 * maxG * maxH);
  const maxSpeed = Math.max(Math.hypot(maxV, maxVerticalSpeed), 1);

  const groundY = 245;
  const launchX = 90;
  const yScale = 180 / maxH;
  const xScale = 400 / maxRange;
  const launchY = groundY - h * yScale;
  const px = launchX + x * xScale;
  const py = launchY + y * yScale;
  const landingX = launchX + range * xScale;
  const vectorScale = 72 / maxSpeed;

  const points = Array.from({ length: 60 }, (_, index) => {
    const q = index / 59;
    const qt = q * tFall;
    const qx = v0 * qt;
    const qy = 0.5 * g * qt * qt;
    return `${launchX + qx * xScale},${launchY + qy * yScale}`;
  }).join(" ");

  return (
    <div>
      <svg viewBox="0 0 620 335" className="w-full" role="img" aria-label="Διάγραμμα οριζόντιας βολής με ύψος, μετατοπίσεις και διανύσματα ταχύτητας">
        <ArrowDefs />
        <line x1="24" y1={groundY} x2="590" y2={groundY} stroke="currentColor" className="text-stone-300" strokeWidth="2" />
        <rect x="60" y={launchY - 8} width="30" height={groundY - launchY + 8} rx="4" className="fill-stone-200" />

        <g className="text-sky-700">
          <line x1="42" y1={launchY} x2="42" y2={groundY} stroke="currentColor" strokeWidth="2" />
          <line x1="36" y1={launchY} x2="48" y2={launchY} stroke="currentColor" strokeWidth="2" />
          <line x1="36" y1={groundY} x2="48" y2={groundY} stroke="currentColor" strokeWidth="2" />
          <text x="18" y={(launchY + groundY) / 2} fontSize="12" fill="currentColor">h={number(h)} m</text>
        </g>

        <polyline points={points} fill="none" stroke="currentColor" className="text-stone-500" strokeWidth="2.5" />
        <text x={Math.min(landingX - 40, launchX + (landingX - launchX) * 0.55)} y={launchY + (groundY - launchY) * 0.35} fontSize="12" className="fill-stone-500">τροχιά</text>

        <g className="text-cyan-700">
          <line x1={launchX} y1="274" x2={px} y2="274" stroke="currentColor" strokeWidth="2" />
          <line x1={launchX} y1="268" x2={launchX} y2="280" stroke="currentColor" strokeWidth="2" />
          <line x1={px} y1="268" x2={px} y2="280" stroke="currentColor" strokeWidth="2" />
          <text x={(launchX + px) / 2 - 10} y="292" fontSize="12" fill="currentColor">x={number(x)} m</text>
        </g>

        <g className="text-blue-700">
          <line x1={Math.max(54, px - 18)} y1={launchY} x2={Math.max(54, px - 18)} y2={py} stroke="currentColor" strokeWidth="2" />
          <text x={Math.max(58, px - 13)} y={(launchY + py) / 2} fontSize="12" fill="currentColor">y={number(y)} m</text>
        </g>

        <g className="text-violet-700">
          <line x1={launchX} y1="310" x2={landingX} y2="310" stroke="currentColor" strokeWidth="2" />
          <line x1={launchX} y1="304" x2={launchX} y2="316" stroke="currentColor" strokeWidth="2" />
          <line x1={landingX} y1="304" x2={landingX} y2="316" stroke="currentColor" strokeWidth="2" />
          <text x={(launchX + landingX) / 2 - 22} y="328" fontSize="12" fill="currentColor">R={number(range)} m</text>
        </g>

        <circle cx={px} cy={py} r="8" className="fill-stone-900" />

        <g className="text-emerald-700">
          <line x1={px} y1={py} x2={px + vx * vectorScale} y2={py} stroke="currentColor" strokeWidth="3" markerEnd="url(#smartlab-arrow)" />
          <text x={px + 8} y={py - 9} fontSize="12" fill="currentColor">υx</text>
        </g>

        {vy > 0.001 ? (
          <g className="text-amber-700">
            <line x1={px} y1={py} x2={px} y2={py + vy * vectorScale} stroke="currentColor" strokeWidth="3" markerEnd="url(#smartlab-arrow)" />
            <text x={px + 8} y={py + Math.min(25, vy * vectorScale)} fontSize="12" fill="currentColor">υy</text>
          </g>
        ) : <text x={px + 8} y={py + 21} fontSize="12" className="fill-amber-700">υy=0</text>}

        <g className="text-violet-700">
          <line x1={px} y1={py} x2={px + vx * vectorScale} y2={py + vy * vectorScale} stroke="currentColor" strokeWidth="2.5" markerEnd="url(#smartlab-arrow)" />
          <text x={px + vx * vectorScale + 5} y={py + vy * vectorScale} fontSize="12" fill="currentColor">υ</text>
        </g>

        <text x="500" y="28" fontSize="13" className="fill-stone-700">t={number(t)} s</text>
      </svg>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="t τώρα" value={number(t)} unit="s" />
        <Metric label="x τώρα" value={number(x)} unit="m" />
        <Metric label="y τώρα" value={number(y)} unit="m" />
        <Metric label="υx" value={number(vx)} unit="m/s" />
        <Metric label="υy" value={number(vy)} unit="m/s" />
        <Metric label="|υ| τώρα" value={number(speed)} unit="m/s" />
        <Metric label="χρόνος πτώσης" value={number(tFall)} unit="s" />
        <Metric label="εμβέλεια R" value={number(range)} unit="m" />
      </div>
    </div>
  );
}

function circularState(widget: Widget, values: Values) {
  const radius = Math.max(0.001, roleValue(widget, values, "radius", 1));
  const angularControl = controlsOf(widget).find((control) => control.role === "angular_speed");
  const frequencyControl = controlsOf(widget).find((control) => control.role === "frequency");
  const linearControl = controlsOf(widget).find((control) => control.role === "linear_speed");

  let omega: number;
  let speed: number;
  if (angularControl) {
    omega = Math.max(0.001, Number(values[angularControl.id] ?? angularControl.defaultValue));
    speed = omega * radius;
  } else if (frequencyControl) {
    const frequency = Math.max(0.001, Number(values[frequencyControl.id] ?? frequencyControl.defaultValue));
    omega = 2 * Math.PI * frequency;
    speed = omega * radius;
  } else if (linearControl) {
    speed = Math.max(0.001, Number(values[linearControl.id] ?? linearControl.defaultValue));
    omega = speed / radius;
  } else {
    omega = 2;
    speed = omega * radius;
  }

  const frequency = omega / (2 * Math.PI);
  const period = 1 / frequency;
  const acceleration = speed * speed / radius;
  const mass = Math.max(0.001, roleValue(widget, values, "mass", 1));
  const force = mass * acceleration;
  return { radius, omega, speed, frequency, period, acceleration, mass, force };
}

function CircularMotion({ widget, values, time, forceMode = false }: { widget: Widget; values: Values; time: number; forceMode?: boolean }) {
  const state = circularState(widget, values);
  const { radius, omega, speed, frequency, period, acceleration, mass, force } = state;
  const maxR = Math.max(roleMax(widget, "radius", radius), radius, 0.001);
  const minR = Math.max(roleMin(widget, "radius", radius), 0.001);
  const angularControl = controlsOf(widget).find((control) => control.role === "angular_speed");
  const frequencyControl = controlsOf(widget).find((control) => control.role === "frequency");
  const linearControl = controlsOf(widget).find((control) => control.role === "linear_speed");
  let maxSpeed = speed;
  let maxAcceleration = acceleration;
  if (angularControl) {
    maxSpeed = Math.max(maxSpeed, angularControl.max * maxR);
    maxAcceleration = Math.max(maxAcceleration, angularControl.max * angularControl.max * maxR);
  } else if (frequencyControl) {
    const maxOmega = 2 * Math.PI * frequencyControl.max;
    maxSpeed = Math.max(maxSpeed, maxOmega * maxR);
    maxAcceleration = Math.max(maxAcceleration, maxOmega * maxOmega * maxR);
  } else if (linearControl) {
    maxSpeed = Math.max(maxSpeed, linearControl.max);
    maxAcceleration = Math.max(maxAcceleration, linearControl.max * linearControl.max / minR);
  }
  const maxMass = Math.max(roleMax(widget, "mass", mass), mass);
  const maxForce = Math.max(0.001, maxMass * maxAcceleration);

  const rPx = Math.max(18, 105 * radius / maxR);
  const cx = 300;
  const cy = 150;
  const angle = omega * time;
  const px = cx + rPx * Math.cos(angle);
  const py = cy + rPx * Math.sin(angle);
  const tangentX = -Math.sin(angle);
  const tangentY = Math.cos(angle);
  const radialX = -Math.cos(angle);
  const radialY = -Math.sin(angle);
  const vLen = 75 * speed / Math.max(maxSpeed, 0.001);
  const radialMagnitude = forceMode ? force : acceleration;
  const radialMax = forceMode ? maxForce : Math.max(maxAcceleration, 0.001);
  const radialLen = 68 * radialMagnitude / radialMax;

  return (
    <div>
      <svg viewBox="0 0 620 330" className="w-full" role="img" aria-label="Διάγραμμα ομαλής κυκλικής κίνησης με ακτίνα και διανύσματα">
        <ArrowDefs />
        <circle cx={cx} cy={cy} r={rPx} fill="none" stroke="currentColor" className="text-stone-300" strokeWidth="2" />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="currentColor" className="text-sky-700" strokeWidth="2" />
        <text x={(cx + px) / 2 + 7} y={(cy + py) / 2 - 5} fontSize="12" className="fill-sky-700">r={number(radius)} m</text>
        <circle cx={cx} cy={cy} r="5" className="fill-stone-500" />
        <circle cx={px} cy={py} r="9" className="fill-stone-900" />

        <g className="text-emerald-700">
          <line x1={px} y1={py} x2={px + tangentX * vLen} y2={py + tangentY * vLen} stroke="currentColor" strokeWidth="3" markerEnd="url(#smartlab-arrow)" />
          <text x={px + tangentX * (vLen + 12)} y={py + tangentY * (vLen + 12)} fontSize="13" fill="currentColor">υ</text>
        </g>
        <g className={forceMode ? "text-rose-700" : "text-amber-700"}>
          <line x1={px} y1={py} x2={px + radialX * radialLen} y2={py + radialY * radialLen} stroke="currentColor" strokeWidth="3" markerEnd="url(#smartlab-arrow)" />
          <text x={px + radialX * (radialLen + 14)} y={py + radialY * (radialLen + 14)} fontSize="13" fill="currentColor">{forceMode ? "Fκ" : "aκ"}</text>
        </g>
        <text x="26" y="302" fontSize="12" className="fill-stone-500">Η υ είναι εφαπτομενική · η {forceMode ? "Fκ" : "aκ"} κατευθύνεται πάντα προς το κέντρο.</text>
      </svg>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Metric label="r" value={number(radius)} unit="m" />
        <Metric label="υ" value={number(speed)} unit="m/s" />
        <Metric label="ω" value={number(omega)} unit="rad/s" />
        <Metric label="f" value={number(frequency)} unit="Hz" />
        <Metric label="T" value={number(period)} unit="s" />
        <Metric label="aκ" value={number(acceleration)} unit="m/s²" />
        {forceMode ? <Metric label="m" value={number(mass)} unit="kg" /> : null}
        {forceMode ? <Metric label="Fκ" value={number(force)} unit="N" /> : null}
      </div>
    </div>
  );
}

function GenericRelation({ widget }: { widget: Widget }) {
  const quantities = quantitiesOf(widget);
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">Χάρτης φυσικών εξαρτήσεων</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {quantities.map((quantity) => (
          <div key={quantity.id} className="rounded-xl border border-stone-200 bg-white p-3">
            <div className="flex items-baseline justify-between gap-3">
              <strong className="text-stone-900">{quantity.symbol || quantity.name}</strong>
              <span className="text-[11px] text-stone-500">{quantityRoleLabel(quantity.role)}</span>
            </div>
            {quantity.dependsOn.length ? <p className="mt-2 text-xs leading-5 text-stone-600">Εξαρτάται από: {quantity.dependsOn.map((id) => quantities.find((item) => item.id === id)?.symbol || id).join(", ")}</p> : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-stone-500">Δεν σχεδιάζεται αυθαίρετη αριθμητική καμπύλη όταν δεν υπάρχει ασφαλές physics preset. Οι εξαρτήσεις παραμένουν αυτές που όρισε το SMARTLAB.</p>
    </div>
  );
}

function QuantityGuide({ widget }: { widget: Widget }) {
  const quantities = quantitiesOf(widget);
  if (!quantities.length) return null;
  return (
    <section className="mt-5">
      <div className="mb-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-800">Τι μετράμε και γιατί μας νοιάζει</p>
        <p className="mt-1 text-sm leading-6 text-stone-600">Κάθε μέγεθος έχει συγκεκριμένο ρόλο. Άλλα τα μεταβάλλεις και άλλα προκύπτουν υποχρεωτικά από τη Φυσική.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {quantities.map((quantity) => (
          <article key={quantity.id} className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-black text-cyan-950">{quantity.symbol || quantity.name}</p>
                <p className="text-sm font-semibold text-stone-900">{quantity.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-stone-500">{quantity.unit}</span>
                <p className="mt-1 text-[11px] font-semibold text-cyan-800">{quantityRoleLabel(quantity.role)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-700"><strong className="text-stone-900">Τι μετρά:</strong> {quantity.meaning}</p>
            <p className="mt-2 text-sm leading-6 text-stone-700"><strong className="text-stone-900">Γιατί μας νοιάζει:</strong> {quantity.whyItMatters}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ControlPanel({ widget, values, onChange }: { widget: Widget; values: Values; onChange: (control: SmartLabControl, value: number) => void }) {
  return (
    <div className="space-y-5">
      {controlsOf(widget).map((control) => {
        const value = Number(values[control.id] ?? control.defaultValue);
        if (control.type === "toggle") {
          const checked = value > (control.min + control.max) / 2;
          return (
            <label key={control.id} className="flex min-h-11 items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-3 py-2">
              <span className="text-sm font-semibold text-stone-800">{control.label}</span>
              <input type="checkbox" checked={checked} onChange={(event) => onChange(control, event.target.checked ? control.max : control.min)} className="h-5 w-5 accent-stone-800" />
            </label>
          );
        }
        return (
          <label key={control.id} className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-stone-800">{control.label} {control.symbol ? `(${control.symbol})` : ""}</span>
              <Badge variant="outline" className="bg-white font-mono text-stone-700">{number(value)} {control.unit}</Badge>
            </div>
            <input
              type="range" min={control.min} max={control.max} step={control.step} value={value}
              onChange={(event) => onChange(control, Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-stone-800"
            />
            <div className="mt-1 flex justify-between text-[11px] text-stone-400">
              <span>{control.min} {control.unit}</span><span>{control.max} {control.unit}</span>
            </div>
          </label>
        );
      })}
    </div>
  );
}

function ImpactPanel({ widget, quantityId }: { widget: Widget; quantityId: string | null }) {
  const quantities = quantitiesOf(widget);
  const impact = (Array.isArray(widget.impactModel) ? widget.impactModel : []).find((item) => item.controlQuantityId === quantityId);
  if (!impact) return null;
  const names = (ids: string[]) => ids.map((id) => {
    const quantity = quantities.find((item) => item.id === id);
    return quantity?.symbol || quantity?.name || id;
  }).join(", ");
  return (
    <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-800">Impact της μεταβολής</p>
      {impact.changes.length ? <p className="mt-2 text-xs leading-5 text-stone-700"><strong>Αλλάζουν:</strong> {names(impact.changes)}</p> : null}
      {impact.unchanged.length ? <p className="mt-1 text-xs leading-5 text-stone-700"><strong>Μένουν σταθερά:</strong> {names(impact.unchanged)}</p> : null}
      <p className="mt-2 text-xs leading-5 text-stone-600">{impact.explanation}</p>
    </div>
  );
}

export function SmartLabWidget({ widget }: { widget: Widget }) {
  const [values, setValues] = useState<Values>(() => initialValues(widget));
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [lastChangedQuantityId, setLastChangedQuantityId] = useState<string | null>(() => controlsOf(widget)[0]?.quantityId || null);

  const tFall = widget.physicsPreset === "horizontal_projectile" ? horizontalFallTime(widget, values) : 0;

  useEffect(() => {
    if (widget.physicsPreset !== "horizontal_projectile") return;
    setTime((current) => Math.min(current, horizontalFallTime(widget, values)));
  }, [values, widget]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTime((current) => {
        if (widget.physicsPreset === "horizontal_projectile") {
          const end = horizontalFallTime(widget, values);
          return current >= end - 0.001 ? 0 : Math.min(end, current + 0.035);
        }
        return current + 0.035;
      });
    }, 35);
    return () => window.clearInterval(timer);
  }, [playing, values, widget]);

  const visual = useMemo(() => {
    if (widget.physicsPreset === "horizontal_projectile") return <HorizontalProjectile widget={widget} values={values} time={time} />;
    if (widget.physicsPreset === "uniform_circular_motion") return <CircularMotion widget={widget} values={values} time={time} />;
    if (widget.physicsPreset === "centripetal_force") return <CircularMotion widget={widget} values={values} time={time} forceMode />;
    return <GenericRelation widget={widget} />;
  }, [time, values, widget]);

  function reset() {
    setValues(initialValues(widget));
    setTime(0);
    setPlaying(false);
    setReveal(false);
    setLastChangedQuantityId(controlsOf(widget)[0]?.quantityId || null);
  }

  const auditCount = Array.isArray(widget.parameterAudit) ? widget.parameterAudit.length : 0;

  return (
    <Card className="overflow-hidden rounded-3xl border-stone-200 shadow-sm">
      <CardHeader className="border-b border-stone-100 bg-[#fbfaf8]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="gap-1.5 bg-[#334f39] text-white hover:bg-[#334f39]"><FlaskConical className="h-3.5 w-3.5" /> Εικονικό Εργαστήριο</Badge>
          <Badge variant="outline">{scopeLabel(widget.scopeRelation)}</Badge>
          {widget.importance === "core" ? <Badge variant="secondary">Core</Badge> : null}
          {auditCount > 0 ? <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-800"><CheckCircle2 className="h-3.5 w-3.5" /> Physics audit passed</Badge> : null}
        </div>
        <CardTitle className="pt-2 text-xl sm:text-2xl">{widget.title}</CardTitle>
        <CardDescription className="max-w-3xl text-sm leading-6">{widget.scene?.description || widget.concept}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="rounded-2xl border border-[#ded8cf] bg-[#f6f3ee] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#766a5e]">Η ερώτηση</p>
          <p className="mt-1 text-base font-semibold leading-6 text-stone-900">{widget.question}</p>
          <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm leading-6 text-stone-700">
            <span className="font-semibold">Πριν αγγίξεις τα χειριστήρια:</span> {widget.prediction}
          </div>
        </div>

        <QuantityGuide widget={widget} />

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)]">
          <div className="rounded-2xl border border-stone-200 bg-white p-3 sm:p-4">
            {visual}
            {widget.physicsPreset === "horizontal_projectile" ? (
              <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-stone-800">Χρονική στιγμή (t)</span>
                  <Badge variant="outline" className="bg-white font-mono">{number(Math.min(time, tFall))} s</Badge>
                </div>
                <input type="range" min={0} max={Math.max(tFall, 0.001)} step={Math.max(tFall / 200, 0.005)} value={Math.min(time, tFall)} onChange={(event) => { setPlaying(false); setTime(Number(event.target.value)); }} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-stone-800" />
                <div className="mt-1 flex justify-between text-[11px] text-stone-400"><span>0 s</span><span>{number(tFall)} s</span></div>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" onClick={() => setPlaying((value) => !value)} className="bg-[#334f39] hover:bg-[#29412f]">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Παύση" : "Έναρξη"}
              </Button>
              <Button type="button" variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-[#fcfbf9] p-4 sm:p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Τα ανεξάρτητα χειριστήρια</p>
            <ControlPanel widget={widget} values={values} onChange={(control, value) => {
              setValues((current) => ({ ...current, [control.id]: value }));
              setLastChangedQuantityId(control.quantityId || null);
            }} />
            <ImpactPanel widget={widget} quantityId={lastChangedQuantityId} />
            <div className="mt-5 border-t border-stone-200 pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-stone-500">Τι βλέπεις</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{widget.liveFeedback}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-[#d9cfbf] bg-[#faf5e9] p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#66543e]"><Target className="h-4 w-4" /> Η Πρόκληση</div>
            <p className="mt-2 text-sm leading-6 text-[#665c50]">{widget.challenge.instruction}</p>
            {widget.challenge.successHint ? <p className="mt-2 text-xs text-[#857767]">Στόχος: {widget.challenge.successHint}</p> : null}
          </div>
          <div className="rounded-2xl border border-[#cad7c7] bg-[#f0f6ef] p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#425d46]"><Lightbulb className="h-4 w-4" /> Η Ανακάλυψη</div>
            {reveal ? (
              <div className="mt-2 space-y-2 text-sm leading-6 text-[#526653]">
                <p>{widget.discovery}</p>
                {widget.equation ? <p className="rounded-lg bg-white/75 px-3 py-2 font-mono font-semibold text-stone-800">{widget.equation}</p> : null}
                {widget.transferCheck ? <p><strong>Δοκίμασε τώρα:</strong> {widget.transferCheck}</p> : null}
              </div>
            ) : <Button type="button" variant="outline" className="mt-3 bg-white" onClick={() => setReveal(true)}>Δείξε μου τι ανακάλυψα</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SmartLabExperience({ content }: { content: SmartLabContent }) {
  return (
    <div className="space-y-10">
      {content.subchapters.map((section) => section.widgets.length ? (
        <section key={section.subchapterId} className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#817263]">{section.subchapterLabel}</p>
            <h2 className="mt-1 text-2xl font-semibold text-stone-900">{section.subchapterTitle}</h2>
          </div>
          {section.widgets.map((widget) => <SmartLabWidget key={widget.id} widget={widget} />)}
        </section>
      ) : null)}
      {content.chapterSynthesisWidgets.length ? (
        <section className="space-y-4 border-t border-stone-200 pt-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#817263]">Σύνθεση κεφαλαίου</p>
            <h2 className="mt-1 text-2xl font-semibold">Όλα μαζί</h2>
          </div>
          {content.chapterSynthesisWidgets.map((widget) => <SmartLabWidget key={widget.id} widget={widget} />)}
        </section>
      ) : null}
    </div>
  );
}
