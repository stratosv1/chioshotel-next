"use client";

import { useEffect, useMemo, useState } from "react";
import { FlaskConical, Pause, Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  SmartLabContent,
  SmartLabControl,
  SmartLabQuantity,
  SmartLabQuantityPhysicsRole,
  SmartLabWidget as Widget,
} from "@/lib/mixalis/smartlab-types";

type Values = Record<string, number>;
type NumericState = Partial<Record<SmartLabQuantityPhysicsRole, number>>;

function controlsOf(widget: Widget) {
  return Array.isArray(widget.controls) ? widget.controls : [];
}

function quantitiesOf(widget: Widget) {
  return Array.isArray(widget.quantities) ? widget.quantities : [];
}

function initialValues(widget: Widget): Values {
  return Object.fromEntries(controlsOf(widget).map((control) => [control.id, control.defaultValue]));
}

function quantityForRole(widget: Widget, role: SmartLabQuantityPhysicsRole) {
  return quantitiesOf(widget).find((quantity) => quantity.physicsRole === role);
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

function displayUnit(quantity: SmartLabQuantity | undefined) {
  if (!quantity) return "";
  if (quantity.physicsRole === "velocity_angle") return "°";
  return quantity.unit;
}

function quantityDisplay(quantity: SmartLabQuantity | undefined, fallbackSymbol: string, fallbackName: string) {
  return {
    symbol: quantity?.symbol || fallbackSymbol,
    name: quantity?.name || fallbackName,
    unit: displayUnit(quantity),
  };
}

function studentText(widget: Widget, text: string | null | undefined) {
  let output = String(text || "");
  const replacements = quantitiesOf(widget)
    .filter((quantity) => quantity.id)
    .sort((a, b) => b.id.length - a.id.length);
  for (const quantity of replacements) {
    output = output.split(quantity.id).join(quantity.symbol || quantity.name);
  }
  return output;
}

function Metric({ quantity, value }: { quantity: SmartLabQuantity; value: number }) {
  const unit = displayUnit(quantity);
  return (
    <div className="min-w-0 border-l border-stone-200 pl-3 first:border-l-0 first:pl-0 sm:first:border-l">
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-semibold text-stone-950">{quantity.symbol}</span>
        <span className="text-sm font-semibold text-stone-900">{number(value)}</span>
        <span className="text-[11px] text-stone-500">{unit}</span>
      </div>
      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-stone-500">{quantity.name}</p>
    </div>
  );
}

function markerId(widget: Widget) {
  return `smartlab-arrow-${widget.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L7,3 z" fill="context-stroke" />
      </marker>
    </defs>
  );
}

function horizontalFallTime(widget: Widget, values: Values) {
  const h = Math.max(0.001, roleValue(widget, values, "height", 20));
  const g = Math.max(0.001, roleValue(widget, values, "gravity", 9.81));
  return Math.sqrt((2 * h) / g);
}

function horizontalState(widget: Widget, values: Values, time: number) {
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
  const theta = Math.atan2(vy, vx) * 180 / Math.PI;
  return { v0, h, g, tFall, t, range, x, y, vx, vy, speed, theta };
}

function HorizontalProjectile({ widget, values, time }: { widget: Widget; values: Values; time: number }) {
  const state = horizontalState(widget, values, time);
  const { v0, h, g, tFall, t, range, x, y, vx, vy, speed, theta } = state;
  const arrow = markerId(widget);

  const maxV = Math.max(roleMax(widget, "initial_speed", v0), v0, 0.001);
  const maxH = Math.max(roleMax(widget, "height", h), h, 0.001);
  const minG = Math.max(roleMin(widget, "gravity", g), 0.001);
  const maxG = Math.max(roleMax(widget, "gravity", g), g, 0.001);
  const maxRange = Math.max(maxV * Math.sqrt((2 * maxH) / minG), 1);
  const maxVerticalSpeed = Math.sqrt(2 * maxG * maxH);
  const maxSpeed = Math.max(Math.hypot(maxV, maxVerticalSpeed), 1);

  const groundY = 246;
  const launchX = 88;
  const yScale = 176 / maxH;
  const xScale = 398 / maxRange;
  const launchY = groundY - h * yScale;
  const px = launchX + x * xScale;
  const py = launchY + y * yScale;
  const vectorScale = 64 / maxSpeed;

  const trajectory = Array.from({ length: 64 }, (_, index) => {
    const q = index / 63;
    const qt = q * tFall;
    return `${launchX + v0 * qt * xScale},${launchY + 0.5 * g * qt * qt * yScale}`;
  }).join(" ");

  const hQ = quantityForRole(widget, "height");
  const xQ = quantityForRole(widget, "horizontal_position");
  const yQ = quantityForRole(widget, "vertical_displacement");
  const vxQ = quantityForRole(widget, "horizontal_velocity");
  const vyQ = quantityForRole(widget, "vertical_velocity");
  const speedQ = quantityForRole(widget, "speed");
  const timeQ = quantityForRole(widget, "time");
  const gravityQ = quantityForRole(widget, "gravity");
  const thetaQ = quantityForRole(widget, "velocity_angle");
  const rangeQ = quantityForRole(widget, "range");

  const hD = quantityDisplay(hQ, "h", "ύψος");
  const xD = quantityDisplay(xQ, "x", "οριζόντια μετατόπιση");
  const yD = quantityDisplay(yQ, "y", "κατακόρυφη κάθοδος");
  const vxD = quantityDisplay(vxQ, "υx", "οριζόντια συνιστώσα της ταχύτητας");
  const vyD = quantityDisplay(vyQ, "υy", "κατακόρυφη συνιστώσα της ταχύτητας");
  const speedD = quantityDisplay(speedQ, "υ", "μέτρο της συνολικής ταχύτητας");
  const gravityD = quantityDisplay(gravityQ, "g", "επιτάχυνση της βαρύτητας");
  const thetaD = quantityDisplay(thetaQ, "θ", "γωνία της ταχύτητας από την οριζόντια");

  const numeric: NumericState = {
    initial_speed: v0,
    height: h,
    gravity: g,
    time: t,
    horizontal_position: x,
    vertical_displacement: y,
    horizontal_velocity: vx,
    vertical_velocity: vy,
    speed,
    velocity_angle: theta,
    range,
  };

  const liveIds = new Set(widget.liveMeasurements || []);
  const measurementQuantities = quantitiesOf(widget).filter((quantity) => liveIds.has(quantity.id));

  const angleR = 24;
  const angleRad = theta * Math.PI / 180;
  const angleEndX = px + Math.cos(angleRad) * angleR;
  const angleEndY = py + Math.sin(angleRad) * angleR;

  const gravityX = Math.min(560, Math.max(116, px + 54));
  const gravityStartY = Math.max(34, Math.min(groundY - 58, py - 52));
  const gravityEndY = Math.min(groundY - 8, gravityStartY + 42);

  return (
    <div className="min-w-0">
      <svg viewBox="0 0 620 322" className="w-full" role="img" aria-label="Διαδραστικό σχεδιάγραμμα οριζόντιας βολής">
        <ArrowDefs id={arrow} />
        <line x1="22" y1={groundY} x2="592" y2={groundY} stroke="currentColor" className="text-stone-300" strokeWidth="2" />
        <rect x="58" y={launchY - 8} width="30" height={groundY - launchY + 8} rx="5" className="fill-stone-200" />

        <g className="text-sky-700">
          <line x1="40" y1={launchY} x2="40" y2={groundY} stroke="currentColor" strokeWidth="2" />
          <line x1="34" y1={launchY} x2="46" y2={launchY} stroke="currentColor" strokeWidth="2" />
          <line x1="34" y1={groundY} x2="46" y2={groundY} stroke="currentColor" strokeWidth="2" />
          <text x="10" y={(launchY + groundY) / 2} fontSize="12" fill="currentColor">{hD.symbol}={number(h)} {hD.unit}</text>
        </g>

        <polyline points={trajectory} fill="none" stroke="currentColor" className="text-stone-400" strokeWidth="2.5" />

        <g className="text-cyan-700">
          <line x1={launchX} y1="274" x2={px} y2="274" stroke="currentColor" strokeWidth="2" />
          <line x1={launchX} y1="269" x2={launchX} y2="279" stroke="currentColor" strokeWidth="2" />
          <line x1={px} y1="269" x2={px} y2="279" stroke="currentColor" strokeWidth="2" />
          <text x={(launchX + px) / 2 - 16} y="294" fontSize="12" fill="currentColor">{xD.symbol}={number(x)} {xD.unit}</text>
        </g>

        <g className="text-blue-700">
          <line x1={Math.max(52, px - 21)} y1={launchY} x2={Math.max(52, px - 21)} y2={py} stroke="currentColor" strokeWidth="2" />
          <text x={Math.max(56, px - 16)} y={(launchY + py) / 2} fontSize="12" fill="currentColor">{yD.symbol}={number(y)} {yD.unit}</text>
        </g>

        {rangeQ ? (
          <text x="450" y="300" fontSize="11" className="fill-stone-500">{rangeQ.symbol}={number(range)} {rangeQ.unit}</text>
        ) : null}

        <circle cx={px} cy={py} r="8" className="fill-stone-950" />

        <g className="text-emerald-700">
          <line x1={px} y1={py} x2={px + vx * vectorScale} y2={py} stroke="currentColor" strokeWidth="3" markerEnd={`url(#${arrow})`} />
          <text x={px + Math.max(16, vx * vectorScale * 0.55)} y={py - 11} fontSize="12" fill="currentColor">{vxD.symbol}</text>
        </g>

        {vy > 0.001 ? (
          <g className="text-amber-700">
            <line x1={px} y1={py} x2={px} y2={py + vy * vectorScale} stroke="currentColor" strokeWidth="3" markerEnd={`url(#${arrow})`} />
            <text x={px - 29} y={py + Math.max(24, vy * vectorScale * 0.62)} fontSize="12" fill="currentColor">{vyD.symbol}</text>
          </g>
        ) : null}

        {speed > 0.001 ? (
          <g className="text-violet-700">
            <line x1={px} y1={py} x2={px + vx * vectorScale} y2={py + vy * vectorScale} stroke="currentColor" strokeWidth="2.5" markerEnd={`url(#${arrow})`} />
            <text x={px + vx * vectorScale + 10} y={Math.min(groundY - 5, py + vy * vectorScale - 4)} fontSize="12" fill="currentColor">{speedD.symbol}</text>
          </g>
        ) : null}

        {thetaQ && speed > 0.001 ? (
          <g className="text-fuchsia-700">
            <path d={`M ${px + angleR} ${py} A ${angleR} ${angleR} 0 0 1 ${angleEndX} ${angleEndY}`} fill="none" stroke="currentColor" strokeWidth="2" />
            <text x={px + 31} y={Math.min(groundY - 8, py + 27)} fontSize="12" fill="currentColor">{thetaD.symbol}={number(theta, 1)}°</text>
          </g>
        ) : null}

        {gravityQ ? (
          <g className="text-rose-700">
            <line x1={gravityX} y1={gravityStartY} x2={gravityX} y2={gravityEndY} stroke="currentColor" strokeWidth="3" markerEnd={`url(#${arrow})`} />
            <text x={gravityX + 10} y={(gravityStartY + gravityEndY) / 2 + 4} fontSize="12" fill="currentColor">{gravityD.symbol}</text>
          </g>
        ) : null}

        {timeQ ? <text x="488" y="24" fontSize="12" className="fill-stone-600">{timeQ.symbol}={number(t)} {timeQ.unit}</text> : null}
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-stone-200 pt-4 sm:grid-cols-3 xl:grid-cols-4">
        {measurementQuantities.map((quantity) => {
          const value = numeric[quantity.physicsRole];
          return typeof value === "number" ? <Metric key={quantity.id} quantity={quantity} value={value} /> : null;
        })}
      </div>
    </div>
  );
}

function circularState(widget: Widget, values: Values, angle: number) {
  const radius = Math.max(0.001, roleValue(widget, values, "radius", 2));
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
  const arcLength = radius * angle;
  const revolutions = angle / (2 * Math.PI);
  return { radius, omega, speed, frequency, period, acceleration, mass, force, angle, arcLength, revolutions };
}

function circularArcPath(cx: number, cy: number, radius: number, angle: number) {
  const clamped = Math.max(0, Math.min(2 * Math.PI, angle));
  if (clamped < 0.001) return "";
  if (clamped >= 2 * Math.PI - 0.001) {
    return `M ${cx + radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx - radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx + radius} ${cy}`;
  }
  const endX = cx + radius * Math.cos(clamped);
  const endY = cy - radius * Math.sin(clamped);
  const largeArc = clamped > Math.PI ? 1 : 0;
  return `M ${cx + radius} ${cy} A ${radius} ${radius} 0 ${largeArc} 0 ${endX} ${endY}`;
}

function CircularMotion({ widget, values, angle, forceMode = false }: { widget: Widget; values: Values; angle: number; forceMode?: boolean }) {
  const state = circularState(widget, values, angle);
  const { radius, omega, speed, frequency, period, acceleration, mass, force, arcLength, revolutions } = state;
  const arrow = markerId(widget);
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
  const rPx = Math.max(34, 108 * radius / maxR);
  const cx = 300;
  const cy = 150;

  // Positive angular displacement is shown in the conventional counter-clockwise direction.
  const px = cx + rPx * Math.cos(angle);
  const py = cy - rPx * Math.sin(angle);
  const tangentX = -Math.sin(angle);
  const tangentY = -Math.cos(angle);
  const radialX = -Math.cos(angle);
  const radialY = Math.sin(angle);
  const outwardX = Math.cos(angle);
  const outwardY = -Math.sin(angle);

  const vLen = Math.max(18, 72 * speed / Math.max(maxSpeed, 0.001));
  const radialMagnitude = forceMode ? force : acceleration;
  const radialMax = forceMode ? maxForce : Math.max(maxAcceleration, 0.001);
  const radialLen = Math.max(18, 66 * radialMagnitude / radialMax);

  const numeric: NumericState = {
    radius,
    arc_length: arcLength,
    angular_displacement: angle,
    revolution_count: revolutions,
    angular_speed: omega,
    linear_speed: speed,
    frequency,
    period,
    centripetal_acceleration: acceleration,
    mass,
    centripetal_force: force,
  };

  const liveIds = new Set(widget.liveMeasurements || []);
  const measurements = quantitiesOf(widget).filter((quantity) => liveIds.has(quantity.id));

  const radiusQ = quantityForRole(widget, "radius");
  const angleQ = quantityForRole(widget, "angular_displacement");
  const arcQ = quantityForRole(widget, "arc_length");
  const speedQ = quantityForRole(widget, "linear_speed");
  const radialQ = quantityForRole(widget, forceMode ? "centripetal_force" : "centripetal_acceleration");
  const radiusD = quantityDisplay(radiusQ, "r", "ακτίνα");
  const angleD = quantityDisplay(angleQ, "φ", "γωνιακή μετατόπιση");
  const arcD = quantityDisplay(arcQ, "s", "μήκος τόξου");
  const speedD = quantityDisplay(speedQ, "υ", "γραμμική ταχύτητα");
  const radialD = quantityDisplay(radialQ, forceMode ? "Fκ" : "ακ", forceMode ? "κεντρομόλος δύναμη" : "κεντρομόλος επιτάχυνση");

  const radiusLabelX = (cx + px) / 2 - tangentX * 18;
  const radiusLabelY = (cy + py) / 2 - tangentY * 18;
  const velocityEndX = px + tangentX * vLen;
  const velocityEndY = py + tangentY * vLen;
  const velocityLabelX = velocityEndX + outwardX * 16 + 4;
  const velocityLabelY = velocityEndY + outwardY * 16 + 4;
  const radialEndX = px + radialX * radialLen;
  const radialEndY = py + radialY * radialLen;
  const radialLabelX = px + radialX * radialLen * 0.55 + tangentX * 20;
  const radialLabelY = py + radialY * radialLen * 0.55 + tangentY * 20;
  const arcPath = circularArcPath(cx, cy, rPx, angle);

  return (
    <div className="min-w-0">
      <svg viewBox="0 0 620 320" className="w-full" role="img" aria-label="Διαδραστικό σχεδιάγραμμα ομαλής κυκλικής κίνησης">
        <ArrowDefs id={arrow} />
        <circle cx={cx} cy={cy} r={rPx} fill="none" stroke="currentColor" className="text-stone-300" strokeWidth="2" />
        {arcPath ? <path d={arcPath} fill="none" stroke="currentColor" className="text-cyan-600" strokeWidth="4" strokeLinecap="round" /> : null}

        <line x1={cx} y1={cy} x2={px} y2={py} stroke="currentColor" className="text-sky-700" strokeWidth="2" />
        <text x={radiusLabelX} y={radiusLabelY} fontSize="12" textAnchor="middle" className="fill-sky-700">{radiusD.symbol}={number(radius)} {radiusD.unit}</text>
        <circle cx={cx} cy={cy} r="5" className="fill-stone-500" />
        <circle cx={px} cy={py} r="9" className="fill-stone-950" />

        <g className="text-emerald-700">
          <line x1={px} y1={py} x2={velocityEndX} y2={velocityEndY} stroke="currentColor" strokeWidth="3" markerEnd={`url(#${arrow})`} />
          <text x={velocityLabelX} y={velocityLabelY} fontSize="13" textAnchor="middle" fill="currentColor">{speedD.symbol}</text>
        </g>

        <g className={forceMode ? "text-rose-700" : "text-amber-700"}>
          <line x1={px} y1={py} x2={radialEndX} y2={radialEndY} stroke="currentColor" strokeWidth="3" markerEnd={`url(#${arrow})`} />
          <text x={radialLabelX} y={radialLabelY} fontSize="13" textAnchor="middle" fill="currentColor">{radialD.symbol}</text>
        </g>

        {angleQ ? <text x="30" y="28" fontSize="12" className="fill-stone-600">{angleD.symbol}={number(angle)} {angleD.unit}</text> : null}
        {arcQ ? <text x="30" y="48" fontSize="12" className="fill-cyan-700">{arcD.symbol}={number(arcLength)} {arcD.unit}</text> : null}
        <text x="26" y="300" fontSize="12" className="fill-stone-500">Η {speedD.symbol} είναι εφαπτομενική · η {radialD.symbol} δείχνει προς το κέντρο.</text>
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-stone-200 pt-4 sm:grid-cols-3 xl:grid-cols-4">
        {measurements.map((quantity) => {
          const value = numeric[quantity.physicsRole];
          return typeof value === "number" ? <Metric key={quantity.id} quantity={quantity} value={value} /> : null;
        })}
      </div>
    </div>
  );
}

function UnsupportedDiagram() {
  return (
    <div className="flex min-h-64 items-center justify-center border-y border-stone-200 px-6 py-10 text-center">
      <div className="max-w-lg">
        <p className="text-sm font-semibold text-stone-900">Το φυσικό σχεδιάγραμμα δεν υποστηρίζεται ακόμη από τον renderer.</p>
        <p className="mt-2 text-sm leading-6 text-stone-500">Δεν εμφανίζεται generic διάγραμμα ώστε να μη δημιουργηθεί λανθασμένη φυσική εντύπωση.</p>
      </div>
    </div>
  );
}

function ControlPanel({ widget, values, onChange }: {
  widget: Widget;
  values: Values;
  onChange: (control: SmartLabControl, value: number) => void;
}) {
  const quantities = quantitiesOf(widget);
  return (
    <div className="space-y-6">
      {controlsOf(widget).map((control) => {
        const value = Number(values[control.id] ?? control.defaultValue);
        const quantity = quantities.find((item) => item.id === control.quantityId);
        const label = quantity?.name || control.label;
        const symbol = quantity?.symbol || control.symbol;
        const unit = quantity ? displayUnit(quantity) : control.unit;

        if (control.type === "toggle") {
          const checked = value > (control.min + control.max) / 2;
          return (
            <label key={control.id} className="flex min-h-12 items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <span className="text-sm font-semibold text-stone-900">{symbol ? `${symbol} — ` : ""}{label}</span>
              <input type="checkbox" checked={checked} onChange={(event) => onChange(control, event.target.checked ? control.max : control.min)} className="h-5 w-5 accent-stone-900" />
            </label>
          );
        }

        return (
          <label key={control.id} className="block">
            <div className="mb-2.5 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold leading-5 text-stone-900">{label}</p>
                {symbol ? <p className="mt-0.5 text-xs text-stone-500">{symbol}</p> : null}
              </div>
              <Badge variant="outline" className="shrink-0 bg-white font-mono text-stone-700">{number(value)} {unit}</Badge>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={value}
              aria-label={label}
              onChange={(event) => onChange(control, Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-[#334f39]"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-stone-400">
              <span>{number(control.min)} {unit}</span>
              <span>{number(control.max)} {unit}</span>
            </div>
          </label>
        );
      })}
    </div>
  );
}

function ImpactPanel({ widget, quantityId }: { widget: Widget; quantityId: string | null }) {
  if (!quantityId) return null;
  const quantities = quantitiesOf(widget);
  const impact = (widget.impactModel || []).find((item) => item.controlQuantityId === quantityId);
  const changed = quantities.find((item) => item.id === quantityId);
  if (!impact || !changed) return null;

  const names = (ids: string[]) => ids.map((id) => {
    const quantity = quantities.find((item) => item.id === id);
    return quantity ? `${quantity.symbol ? `${quantity.symbol} — ` : ""}${quantity.name}` : "";
  }).filter(Boolean);

  return (
    <div className="border-t border-stone-200 pt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-stone-500">Τι άλλαξε</p>
      <p className="mt-2 text-sm font-semibold text-stone-900">Άλλαξες: {changed.symbol ? `${changed.symbol} — ` : ""}{changed.name}</p>
      {impact.changes.length ? <p className="mt-2 text-xs leading-5 text-stone-600"><strong className="text-stone-800">Επηρεάστηκαν:</strong> {names(impact.changes).join(" · ")}</p> : null}
      {impact.unchanged.length ? <p className="mt-1 text-xs leading-5 text-stone-600"><strong className="text-stone-800">Παρέμειναν ίδια:</strong> {names(impact.unchanged).join(" · ")}</p> : null}
      {impact.explanation ? <p className="mt-2 text-xs leading-5 text-stone-500">{studentText(widget, impact.explanation)}</p> : null}
    </div>
  );
}

export function SmartLabWidget({ widget }: { widget: Widget }) {
  const [values, setValues] = useState<Values>(() => initialValues(widget));
  const [playing, setPlaying] = useState(false);
  const [stateValue, setStateValue] = useState(0);
  const [lastChangedQuantityId, setLastChangedQuantityId] = useState<string | null>(null);

  const isHorizontal = widget.physicsPreset === "horizontal_projectile";
  const isCircular = widget.physicsPreset === "uniform_circular_motion" || widget.physicsPreset === "centripetal_force";
  const tFall = isHorizontal ? horizontalFallTime(widget, values) : 0;
  const stateQuantity = isHorizontal
    ? quantityForRole(widget, "time")
    : isCircular ? quantityForRole(widget, "angular_displacement") : undefined;
  const stateMax = isHorizontal ? Math.max(tFall, 0.001) : isCircular ? 2 * Math.PI : 1;

  useEffect(() => {
    setStateValue((current) => Math.min(current, stateMax));
  }, [stateMax]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStateValue((current) => {
        if (isHorizontal) return current >= stateMax - 0.001 ? 0 : Math.min(stateMax, current + 0.035);
        if (isCircular) {
          const omega = circularState(widget, values, current).omega;
          const next = current + omega * 0.035;
          return next >= stateMax ? 0 : next;
        }
        return current;
      });
    }, 35);
    return () => window.clearInterval(timer);
  }, [isCircular, isHorizontal, playing, stateMax, values, widget]);

  const visual = useMemo(() => {
    if (widget.physicsPreset === "horizontal_projectile") return <HorizontalProjectile widget={widget} values={values} time={stateValue} />;
    if (widget.physicsPreset === "uniform_circular_motion") return <CircularMotion widget={widget} values={values} angle={stateValue} />;
    if (widget.physicsPreset === "centripetal_force") return <CircularMotion widget={widget} values={values} angle={stateValue} forceMode />;
    return <UnsupportedDiagram />;
  }, [stateValue, values, widget]);

  function reset() {
    setValues(initialValues(widget));
    setStateValue(0);
    setPlaying(false);
    setLastChangedQuantityId(null);
  }

  const stateUnit = stateQuantity ? displayUnit(stateQuantity) : "";

  return (
    <Card className="overflow-hidden rounded-3xl border-stone-200 bg-white shadow-sm">
      <CardHeader className="space-y-2 border-b border-stone-100 px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <Badge className="gap-1.5 bg-[#334f39] text-white hover:bg-[#334f39]"><FlaskConical className="h-3.5 w-3.5" /> SMARTLAB</Badge>
          <span className="text-xs text-stone-500">Άλλαξε μία παράμετρο και δες τη Φυσική να αλλάζει.</span>
        </div>
        <div>
          <CardTitle className="text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">{studentText(widget, widget.title)}</CardTitle>
          {widget.scene?.description ? <p className="mt-1 max-w-3xl text-sm leading-6 text-stone-600">{studentText(widget, widget.scene.description)}</p> : null}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(290px,.7fr)]">
          <div className="min-w-0 px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
            {visual}

            {stateQuantity && (isHorizontal || isCircular) ? (
              <div className="mt-5 border-t border-stone-200 pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{stateQuantity.name}</p>
                    <p className="text-xs text-stone-500">{stateQuantity.symbol}</p>
                  </div>
                  <Badge variant="outline" className="bg-white font-mono text-stone-700">{number(stateValue)} {stateUnit}</Badge>
                </div>
                <input
                  type="range"
                  min={0}
                  max={stateMax}
                  step={isHorizontal ? Math.max(stateMax / 200, 0.005) : 0.01}
                  value={Math.min(stateValue, stateMax)}
                  aria-label={stateQuantity.name}
                  onChange={(event) => {
                    setPlaying(false);
                    setStateValue(Number(event.target.value));
                  }}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-200 accent-[#334f39]"
                />
                <div className="mt-1.5 flex justify-between text-[11px] text-stone-400"><span>0 {stateUnit}</span><span>{number(stateMax)} {stateUnit}</span></div>
              </div>
            ) : null}

            {(isHorizontal || isCircular) ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" onClick={() => setPlaying((value) => !value)} className="min-h-10 bg-[#334f39] hover:bg-[#29412f]">
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Παύση" : "Έναρξη"}
                </Button>
                <Button type="button" variant="outline" onClick={reset} className="min-h-10"><RotateCcw className="h-4 w-4" /> Επαναφορά</Button>
              </div>
            ) : null}
          </div>

          <aside className="border-t border-stone-200 bg-[#fcfbf9] px-4 py-5 sm:px-6 lg:border-l lg:border-t-0">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Τι μπορείς να αλλάξεις</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">Πείραξε πρώτα μία παράμετρο. Μετά συνδύασέ τες.</p>
            </div>
            <ControlPanel widget={widget} values={values} onChange={(control, value) => {
              setValues((current) => ({ ...current, [control.id]: value }));
              setLastChangedQuantityId(control.quantityId);
            }} />
            <ImpactPanel widget={widget} quantityId={lastChangedQuantityId} />
          </aside>
        </div>
      </CardContent>
    </Card>
  );
}

export function SmartLabExperience({ content }: { content: SmartLabContent }) {
  return (
    <div className="space-y-8">
      {content.subchapters.map((section) => section.widgets.length ? (
        <section key={section.subchapterId} className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">{section.subchapterLabel}</p>
            <h2 className="mt-1 text-xl font-semibold text-stone-950 sm:text-2xl">{section.subchapterTitle}</h2>
          </div>
          <SmartLabWidget widget={section.widgets[0]} />
        </section>
      ) : null)}
    </div>
  );
}
