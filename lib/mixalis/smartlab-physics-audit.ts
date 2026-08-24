import type { LessonFormula } from "@/lib/mixalis/start-lesson";
import type {
  SmartLabControl,
  SmartLabQuantity,
  SmartLabQuantityPhysicsRole,
  SmartLabWidget,
} from "@/lib/mixalis/smartlab-types";
import {
  calculateCircularMotionPhysics,
  calculateHorizontalProjectilePhysics,
  physicsAlmostEqual,
} from "@/lib/mixalis/smartlab-physics";

type Values = Record<string, number>;
type RoleValues = Partial<Record<SmartLabQuantityPhysicsRole, number>>;

function normalizeFormula(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("el-GR")
    .replace(/\s+/g, "")
    .replace(/[·⋅]/g, "")
    .replace(/\*+/g, "")
    .replace(/−/g, "-")
    .replace(/⇔/g, "=");
}

function lessonFormulaText(formulas: LessonFormula[]) {
  return formulas.map((formula) => normalizeFormula(formula.expression)).join("\n");
}

function requireFormula(text: string, alternatives: string[], label: string, errors: string[]) {
  if (!alternatives.some((alternative) => text.includes(normalizeFormula(alternative)))) {
    errors.push(`lesson formula missing '${label}'`);
  }
}

export function assertLessonFormulaContract(subchapterTitle: string, formulas: LessonFormula[]) {
  const errors: string[] = [];
  const text = lessonFormulaText(formulas);
  const title = subchapterTitle.toLocaleLowerCase("el-GR");

  if (title.includes("οριζόντια βολή")) {
    requireFormula(text, ["υx=υ₀"], "υx=υ₀", errors);
    requireFormula(text, ["x=υ₀t"], "x=υ₀t", errors);
    requireFormula(text, ["υy=gt"], "υy=gt", errors);
    requireFormula(text, ["y=(1/2)gt²", "y=1/2gt²"], "y=(1/2)gt²", errors);
    requireFormula(text, ["tπτ=√(2h/g)"], "tπτ=√(2h/g)", errors);
    requireFormula(text, ["υ=√(υx²+υy²)"], "υ=√(υx²+υy²)", errors);
    requireFormula(text, ["tanθ=υy/υx"], "tanθ=υy/υx", errors);
    requireFormula(text, ["y=(g/2υ₀²)x²"], "y=(g/2υ₀²)x²", errors);
  }

  if (title.includes("ομαλή κυκλική κίνηση")) {
    requireFormula(text, ["s=rφ", "φ=s/r"], "s=rφ", errors);
    requireFormula(text, ["f=1/t", "f=1/T"], "f=1/T", errors);
    requireFormula(text, ["φ=ωt"], "φ=ωt", errors);
    requireFormula(text, ["υ=ωr"], "υ=ωr", errors);
    requireFormula(text, ["ω=2πf", "2πf"], "ω=2πf", errors);
    requireFormula(text, ["αₖ=υ²/r", "ακ=υ²/r"], "αₖ=υ²/r", errors);
    requireFormula(text, ["αₖ=ω²r", "ακ=ω²r"], "αₖ=ω²r", errors);
  }

  if (errors.length) {
    throw new Error(`SMARTLAB lesson-formula audit failed for '${subchapterTitle}': ${errors.join("; ")}`);
  }
}

function controlsOf(widget: SmartLabWidget) {
  return Array.isArray(widget.controls) ? widget.controls : [];
}

function controlForRole(widget: SmartLabWidget, role: SmartLabControl["role"]) {
  return controlsOf(widget).find((control) => control.role === role);
}

function controlValue(widget: SmartLabWidget, values: Values, role: SmartLabControl["role"], fallback: number) {
  const control = controlForRole(widget, role);
  return control ? Number(values[control.id] ?? control.defaultValue) : fallback;
}

function defaults(widget: SmartLabWidget): Values {
  return Object.fromEntries(controlsOf(widget).map((control) => [control.id, control.defaultValue]));
}

function alternateControlValue(control: SmartLabControl) {
  const distanceToMin = Math.abs(control.defaultValue - control.min);
  const distanceToMax = Math.abs(control.max - control.defaultValue);
  return distanceToMax >= distanceToMin ? control.max : control.min;
}

function horizontalRoleValues(widget: SmartLabWidget, values: Values, time: number): RoleValues {
  const state = calculateHorizontalProjectilePhysics({
    v0: controlValue(widget, values, "initial_speed", 12),
    h: controlValue(widget, values, "height", 20),
    g: controlValue(widget, values, "gravity", 9.81),
    time,
  });
  return {
    initial_speed: state.v0,
    height: state.h,
    gravity: state.g,
    time: state.t,
    horizontal_position: state.x,
    vertical_displacement: state.y,
    horizontal_velocity: state.vx,
    vertical_velocity: state.vy,
    speed: state.speed,
    velocity_angle: state.theta,
    range: state.range,
  };
}

function circularRoleValues(widget: SmartLabWidget, values: Values, angle: number): RoleValues {
  const angularControl = controlForRole(widget, "angular_speed");
  const frequencyControl = controlForRole(widget, "frequency");
  const linearControl = controlForRole(widget, "linear_speed");
  const state = calculateCircularMotionPhysics({
    radius: controlValue(widget, values, "radius", 2),
    angle,
    angularSpeed: angularControl ? Number(values[angularControl.id] ?? angularControl.defaultValue) : undefined,
    frequency: frequencyControl ? Number(values[frequencyControl.id] ?? frequencyControl.defaultValue) : undefined,
    linearSpeed: linearControl ? Number(values[linearControl.id] ?? linearControl.defaultValue) : undefined,
    mass: controlValue(widget, values, "mass", 1),
  });
  return {
    radius: state.radius,
    arc_length: state.arcLength,
    angular_displacement: state.angle,
    revolution_count: state.revolutions,
    angular_speed: state.omega,
    linear_speed: state.speed,
    frequency: state.frequency,
    period: state.period,
    centripetal_acceleration: state.acceleration,
    mass: state.mass,
    centripetal_force: state.force,
  };
}

function assertClose(actual: number, expected: number, label: string, errors: string[]) {
  if (!physicsAlmostEqual(actual, expected, 1e-8, 1e-8)) {
    errors.push(`${label}: expected ${expected}, got ${actual}`);
  }
}

function verifyHorizontalRuntime(widget: SmartLabWidget, errors: string[]) {
  const values = defaults(widget);
  const v0Control = controlForRole(widget, "initial_speed");
  const hControl = controlForRole(widget, "height");
  const gControl = controlForRole(widget, "gravity");
  const v0Samples = v0Control ? [v0Control.min, v0Control.defaultValue, v0Control.max] : [12];
  const hSamples = hControl ? [hControl.min, hControl.defaultValue, hControl.max] : [20];
  const gSamples = gControl ? [gControl.min, gControl.defaultValue, gControl.max] : [9.81];

  for (const v0 of v0Samples) for (const h of hSamples) for (const g of gSamples) {
    if (v0Control) values[v0Control.id] = v0;
    if (hControl) values[hControl.id] = h;
    if (gControl) values[gControl.id] = g;
    const tFall = Math.sqrt((2 * h) / g);
    for (const fraction of [0, 0.23, 0.61, 1]) {
      const t = tFall * fraction;
      const state = calculateHorizontalProjectilePhysics({ v0, h, g, time: t });
      assertClose(state.x, v0 * state.t, "x=υ₀t", errors);
      assertClose(state.y, 0.5 * g * state.t * state.t, "y=(1/2)gt²", errors);
      assertClose(state.vx, v0, "υx=υ₀", errors);
      assertClose(state.vy, g * state.t, "υy=gt", errors);
      assertClose(state.speed * state.speed, state.vx * state.vx + state.vy * state.vy, "υ²=υx²+υy²", errors);
      if (state.vx > 1e-10) assertClose(Math.tan(state.theta * Math.PI / 180), state.vy / state.vx, "tanθ=υy/υx", errors);
      if (v0 > 1e-10) assertClose(state.y, (g / (2 * v0 * v0)) * state.x * state.x, "y=(g/2υ₀²)x²", errors);
      assertClose(state.tFall * state.tFall, (2 * h) / g, "tπτ²=2h/g", errors);
      assertClose(state.range, v0 * state.tFall, "R=υ₀tπτ", errors);
      if (fraction === 1) assertClose(state.y, h, "y(tπτ)=h", errors);
    }
  }
}

function verifyCircularRuntime(widget: SmartLabWidget, errors: string[]) {
  const radiusControl = controlForRole(widget, "radius");
  const driver = controlForRole(widget, "angular_speed") || controlForRole(widget, "frequency") || controlForRole(widget, "linear_speed");
  const radiusSamples = radiusControl ? [radiusControl.min, radiusControl.defaultValue, radiusControl.max] : [2];
  const driverSamples = driver ? [driver.min, driver.defaultValue, driver.max] : [2];

  for (const radius of radiusSamples) for (const driverValue of driverSamples) for (const angle of [0, 0.79, 2.4, 2 * Math.PI]) {
    const state = calculateCircularMotionPhysics({
      radius,
      angle,
      angularSpeed: driver?.role === "angular_speed" ? driverValue : undefined,
      frequency: driver?.role === "frequency" ? driverValue : undefined,
      linearSpeed: driver?.role === "linear_speed" ? driverValue : undefined,
    });
    assertClose(state.arcLength, radius * angle, "s=rφ", errors);
    assertClose(state.revolutions, angle / (2 * Math.PI), "N=φ/2π", errors);
    assertClose(state.frequency, state.omega / (2 * Math.PI), "f=ω/2π", errors);
    assertClose(state.period, 1 / state.frequency, "T=1/f", errors);
    assertClose(state.speed, state.omega * radius, "υ=ωr", errors);
    assertClose(state.acceleration, state.speed * state.speed / radius, "αₖ=υ²/r", errors);
    assertClose(state.acceleration, state.omega * state.omega * radius, "αₖ=ω²r", errors);
  }
}

export function assertRuntimePhysicsFormulas(widget: SmartLabWidget) {
  const errors: string[] = [];
  if (widget.physicsPreset === "horizontal_projectile") verifyHorizontalRuntime(widget, errors);
  if (widget.physicsPreset === "uniform_circular_motion") verifyCircularRuntime(widget, errors);
  if (errors.length) {
    throw new Error(`SMARTLAB numerical formula verification failed for '${widget.title}': ${errors.slice(0, 8).join("; ")}`);
  }
}

function numericRolesAtProbe(widget: SmartLabWidget, values: Values, probe: number) {
  if (widget.physicsPreset === "horizontal_projectile") {
    const h = controlValue(widget, values, "height", 20);
    const g = controlValue(widget, values, "gravity", 9.81);
    const tFall = Math.sqrt((2 * h) / g);
    return horizontalRoleValues(widget, values, Math.min(tFall * probe, tFall));
  }
  if (widget.physicsPreset === "uniform_circular_motion" || widget.physicsPreset === "centripetal_force") {
    return circularRoleValues(widget, values, Math.min(2 * Math.PI, 2 * Math.PI * probe));
  }
  return {} as RoleValues;
}

function quantityChanged(quantity: SmartLabQuantity, before: RoleValues, after: RoleValues) {
  const a = before[quantity.physicsRole];
  const b = after[quantity.physicsRole];
  if (typeof a !== "number" || typeof b !== "number") return false;
  return !physicsAlmostEqual(a, b, 1e-7, 1e-8);
}

export function deriveVerifiedImpactModel(widget: SmartLabWidget) {
  const base = defaults(widget);
  return controlsOf(widget).map((control) => {
    const changed = new Set<string>();
    const comparable = new Set<string>();
    const nextValues = { ...base, [control.id]: alternateControlValue(control) };

    for (const probe of [0.17, 0.43, 0.79]) {
      const before = numericRolesAtProbe(widget, base, probe);
      const after = numericRolesAtProbe(widget, nextValues, probe);
      for (const quantity of widget.quantities) {
        if (quantity.id === control.quantityId) continue;
        const a = before[quantity.physicsRole];
        const b = after[quantity.physicsRole];
        if (typeof a !== "number" || typeof b !== "number") continue;
        comparable.add(quantity.id);
        if (quantityChanged(quantity, before, after)) changed.add(quantity.id);
      }
    }

    return {
      controlQuantityId: control.quantityId,
      changes: [...changed],
      unchanged: [...comparable].filter((id) => !changed.has(id)),
      explanation: "Υπολογισμένο και επαληθευμένο από τις εξισώσεις του SMARTLAB.",
    };
  });
}
