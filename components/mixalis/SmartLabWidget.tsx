"use client";

import { useEffect, useMemo, useState } from "react";
import { FlaskConical, Lightbulb, Pause, Play, RotateCcw, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SmartLabContent, SmartLabControl, SmartLabWidget as Widget } from "@/lib/mixalis/smartlab-types";

type Values = Record<string, number>;

function initialValues(widget: Widget): Values {
  return Object.fromEntries(widget.controls.map((control) => [control.id, control.defaultValue]));
}

function roleValue(widget: Widget, values: Values, role: SmartLabControl["role"], fallback: number) {
  const control = widget.controls.find((item) => item.role === role);
  return control ? Number(values[control.id] ?? control.defaultValue) : fallback;
}

function roleMax(widget: Widget, role: SmartLabControl["role"], fallback: number) {
  return widget.controls.find((item) => item.role === role)?.max ?? fallback;
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
      <marker id="lab-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L7,3 z" fill="currentColor" />
      </marker>
    </defs>
  );
}

function HorizontalProjectile({ widget, values, progress }: { widget: Widget; values: Values; progress: number }) {
  const v0 = Math.max(0.1, roleValue(widget, values, "initial_speed", 12));
  const h = Math.max(0.1, roleValue(widget, values, "height", 20));
  const g = Math.max(0.1, roleValue(widget, values, "gravity", 9.81));
  const tFall = Math.sqrt((2 * h) / g);
  const range = v0 * tFall;
  const t = progress * tFall;
  const x = v0 * t;
  const y = 0.5 * g * t * t;
  const vy = g * t;
  const speed = Math.hypot(v0, vy);
  const maxV = Math.max(roleMax(widget, "initial_speed", v0), v0);
  const maxH = Math.max(roleMax(widget, "height", h), h);
  const minG = Math.max(widget.controls.find((item) => item.role === "gravity")?.min ?? g, 0.1);
  const maxRange = Math.max(maxV * Math.sqrt((2 * maxH) / minG), range, 1);
  const groundY = 235;
  const launchX = 72;
  const heightRatio = Math.min(1, h / maxH);
  const visualHeight = 90 + heightRatio * 95;
  const launchY = groundY - visualHeight;
  const xScale = 390 / maxRange;
  const yScale = visualHeight / h;
  const px = launchX + x * xScale;
  const py = launchY + y * yScale;
  const points = Array.from({ length: 45 }, (_, index) => {
    const q = index / 44;
    const qt = q * tFall;
    const qx = v0 * qt;
    const qy = 0.5 * g * qt * qt;
    return `${launchX + qx * xScale},${launchY + qy * yScale}`;
  }).join(" ");
  const labelT = 0.56 * tFall;
  const trajectoryLabelX = launchX + v0 * labelT * xScale;
  const trajectoryLabelY = launchY + 0.5 * g * labelT * labelT * yScale;
  const vectorScale = 2.2;
  const currentY = Math.min(py, groundY);
  const showVerticalVelocity = vy > 0.2;

  return (
    <div>
      <svg viewBox="0 0 520 285" className="w-full" role="img" aria-label="Προσομοίωση οριζόντιας βολής">
        <ArrowDefs />
        <line x1="20" y1={groundY} x2="500" y2={groundY} stroke="currentColor" className="text-stone-300" strokeWidth="2" />
        <rect x="43" y={launchY - 8} width="28" height={groundY - launchY + 8} rx="4" className="fill-stone-200" />

        <g className="text-sky-700">
          <line x1="29" y1={launchY} x2="29" y2={groundY} stroke="currentColor" strokeWidth="2" />
          <line x1="23" y1={launchY} x2="35" y2={launchY} stroke="currentColor" strokeWidth="2" />
          <line x1="23" y1={groundY} x2="35" y2={groundY} stroke="currentColor" strokeWidth="2" />
          <text x="36" y={(launchY + groundY) / 2 - 4} fontSize="12" fill="currentColor">h = {number(h, 0)} m</text>
        </g>

        <polyline points={points} fill="none" stroke="currentColor" className="text-stone-400" strokeWidth="2.5" />
        <text x={trajectoryLabelX + 8} y={trajectoryLabelY - 8} fontSize="12" className="fill-stone-500">τροχιά</text>
        <circle cx={px} cy={currentY} r="8" className="fill-stone-900" />

        <g className="text-emerald-700">
          <line x1={px} y1={currentY} x2={px + v0 * vectorScale} y2={currentY} stroke="currentColor" strokeWidth="3" markerEnd="url(#lab-arrow)" />
          <text x={px + 8} y={currentY - 9} fontSize="12" fill="currentColor">υx</text>
        </g>

        {showVerticalVelocity ? (
          <g className="text-amber-700">
            <line x1={px} y1={currentY} x2={px} y2={Math.min(groundY, currentY + vy * vectorScale)} stroke="currentColor" strokeWidth="3" markerEnd="url(#lab-arrow)" />
            <text x={px + 8} y={Math.min(228, currentY + 24)} fontSize="12" fill="currentColor">υy</text>
          </g>
        ) : (
          <text x={px + 8} y={currentY + 21} fontSize="12" className="fill-amber-700">υy = 0</text>
        )}

        <text x="40" y="260" fontSize="12" className="fill-stone-500">h: κατακόρυφο ύψος · τροχιά: καμπύλη κίνησης</text>
      </svg>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="χρόνος πτώσης" value={number(tFall)} unit="s" />
        <Metric label="οριζόντια απόσταση" value={number(range)} unit="m" />
        <Metric label="υx" value={number(v0)} unit="m/s" />
        <Metric label="|υ| τώρα" value={number(speed)} unit="m/s" />
      </div>
    </div>
  );
}

function CircularMotion({ widget, values, phase, forceMode = false }: { widget: Widget; values: Values; phase: number; forceMode?: boolean }) {
  const radius = Math.max(0.05, roleValue(widget, values, "radius", 1));
  const frequency = roleValue(widget, values, "frequency", 0);
  const linearInput = roleValue(widget, values, "linear_speed", 0);
  let omega = roleValue(widget, values, "angular_speed", 0);
  if (omega <= 0 && frequency > 0) omega = 2 * Math.PI * frequency;
  if (omega <= 0 && linearInput > 0) omega = linearInput / radius;
  if (omega <= 0) omega = 2;
  const speed = linearInput > 0 ? linearInput : omega * radius;
  const acceleration = speed * speed / radius;
  const mass = Math.max(0.01, roleValue(widget, values, "mass", 1));
  const force = mass * acceleration;
  const period = 2 * Math.PI / omega;
  const f = omega / (2 * Math.PI);
  const maxR = Math.max(roleMax(widget, "radius", radius), radius);
  const rPx = 45 + (radius / maxR) * 65;
  const cx = 260;
  const cy = 142;
  const angle = phase;
  const px = cx + rPx * Math.cos(angle);
  const py = cy + rPx * Math.sin(angle);
  const tangentX = -Math.sin(angle);
  const tangentY = Math.cos(angle);
  const radialX = -Math.cos(angle);
  const radialY = -Math.sin(angle);
  const vLen = Math.min(78, 30 + speed * 3);
  const aLen = Math.min(70, 24 + acceleration * 1.3);

  return (
    <div>
      <svg viewBox="0 0 520 285" className="w-full" role="img" aria-label="Προσομοίωση κυκλικής κίνησης">
        <ArrowDefs />
        <circle cx={cx} cy={cy} r={rPx} fill="none" stroke="currentColor" className="text-stone-300" strokeWidth="2" strokeDasharray="5 5" />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="currentColor" className="text-stone-400" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="5" className="fill-stone-500" />
        <circle cx={px} cy={py} r="9" className="fill-stone-900" />
        <g className="text-emerald-700">
          <line x1={px} y1={py} x2={px + tangentX * vLen} y2={py + tangentY * vLen} stroke="currentColor" strokeWidth="3" markerEnd="url(#lab-arrow)" />
          <text x={px + tangentX * (vLen + 7)} y={py + tangentY * (vLen + 7)} fontSize="13" fill="currentColor">υ</text>
        </g>
        <g className={forceMode ? "text-rose-700" : "text-amber-700"}>
          <line x1={px} y1={py} x2={px + radialX * aLen} y2={py + radialY * aLen} stroke="currentColor" strokeWidth="3" markerEnd="url(#lab-arrow)" />
          <text x={px + radialX * (aLen + 10)} y={py + radialY * (aLen + 10)} fontSize="13" fill="currentColor">{forceMode ? "Fκ" : "aκ"}</text>
        </g>
        <text x="28" y="266" fontSize="12" className="fill-stone-500">η υ είναι εφαπτομενική · η {forceMode ? "Fκ" : "aκ"} δείχνει προς το κέντρο</text>
      </svg>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="γραμμική υ" value={number(speed)} unit="m/s" />
        <Metric label="ω" value={number(omega)} unit="rad/s" />
        {forceMode ? <Metric label="Fκ" value={number(force)} unit="N" /> : <Metric label="aκ" value={number(acceleration)} unit="m/s²" />}
        <Metric label="T" value={number(period)} unit="s" />
      </div>
      <p className="mt-2 text-xs text-stone-500">f = {number(f)} Hz{forceMode ? ` · aκ = ${number(acceleration)} m/s²` : ""}</p>
    </div>
  );
}

function GenericRelation({ widget, values }: { widget: Widget; values: Values }) {
  return (
    <div className="space-y-3">
      <div className="flex min-h-56 items-end gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-5">
        {widget.controls.map((control) => {
          const raw = Number(values[control.id] ?? control.defaultValue);
          const normalized = (raw - control.min) / Math.max(control.max - control.min, 0.0001);
          return (
            <div key={control.id} className="flex flex-1 flex-col items-center justify-end gap-2">
              <div className="w-full max-w-20 rounded-t-xl bg-stone-700 transition-all" style={{ height: `${Math.max(12, normalized * 150)}px` }} />
              <span className="text-center text-xs font-semibold text-stone-700">{control.symbol || control.label}</span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {widget.controls.map((control) => <Metric key={control.id} label={control.label} value={number(values[control.id] ?? control.defaultValue)} unit={control.unit} />)}
      </div>
    </div>
  );
}

function ControlPanel({ widget, values, onChange }: { widget: Widget; values: Values; onChange: (id: string, value: number) => void }) {
  return (
    <div className="space-y-5">
      {widget.controls.map((control) => {
        const value = Number(values[control.id] ?? control.defaultValue);
        return (
          <label key={control.id} className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-stone-800">{control.label} {control.symbol ? `(${control.symbol})` : ""}</span>
              <Badge variant="outline" className="bg-white font-mono text-stone-700">{number(value)} {control.unit}</Badge>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={value}
              onChange={(event) => onChange(control.id, Number(event.target.value))}
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

export function SmartLabWidget({ widget }: { widget: Widget }) {
  const [values, setValues] = useState<Values>(() => initialValues(widget));
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (widget.physicsPreset === "horizontal_projectile") {
        setProgress((current) => current >= 0.995 ? 0 : Math.min(1, current + 0.015));
      } else {
        const omega = Math.max(0.2, roleValue(widget, values, "angular_speed", roleValue(widget, values, "frequency", 0) * 2 * Math.PI || 2));
        setPhase((current) => (current + omega * 0.035) % (2 * Math.PI));
      }
    }, 35);
    return () => window.clearInterval(timer);
  }, [playing, values, widget]);

  const visual = useMemo(() => {
    if (widget.physicsPreset === "horizontal_projectile") return <HorizontalProjectile widget={widget} values={values} progress={progress} />;
    if (widget.physicsPreset === "uniform_circular_motion") return <CircularMotion widget={widget} values={values} phase={phase} />;
    if (widget.physicsPreset === "centripetal_force") return <CircularMotion widget={widget} values={values} phase={phase} forceMode />;
    return <GenericRelation widget={widget} values={values} />;
  }, [phase, progress, values, widget]);

  function reset() {
    setValues(initialValues(widget));
    setProgress(0);
    setPhase(0);
    setPlaying(false);
    setReveal(false);
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-stone-200 shadow-sm">
      <CardHeader className="border-b border-stone-100 bg-[#fbfaf8]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="gap-1.5 bg-[#334f39] text-white hover:bg-[#334f39]"><FlaskConical className="h-3.5 w-3.5" /> Εικονικό Εργαστήριο</Badge>
          <Badge variant="outline">{scopeLabel(widget.scopeRelation)}</Badge>
          {widget.importance === "core" ? <Badge variant="secondary">Core</Badge> : null}
        </div>
        <CardTitle className="pt-2 text-xl sm:text-2xl">{widget.title}</CardTitle>
        <CardDescription className="max-w-3xl text-sm leading-6">{widget.scene.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="rounded-2xl border border-[#ded8cf] bg-[#f6f3ee] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#766a5e]">Η ερώτηση</p>
          <p className="mt-1 text-base font-semibold leading-6 text-stone-900">{widget.question}</p>
          <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm leading-6 text-stone-700">
            <span className="font-semibold">Πριν αγγίξεις τα χειριστήρια:</span> {widget.prediction}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
          <div className="rounded-2xl border border-stone-200 bg-white p-3 sm:p-4">
            {visual}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" onClick={() => setPlaying((value) => !value)} className="bg-[#334f39] hover:bg-[#29412f]">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Παύση" : "Έναρξη"}
              </Button>
              <Button type="button" variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</Button>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-[#fcfbf9] p-4 sm:p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Τα χειριστήρια</p>
            <ControlPanel widget={widget} values={values} onChange={(id, value) => setValues((current) => ({ ...current, [id]: value }))} />
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
            ) : (
              <Button type="button" variant="outline" className="mt-3 bg-white" onClick={() => setReveal(true)}>Δείξε μου τι ανακάλυψα</Button>
            )}
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
