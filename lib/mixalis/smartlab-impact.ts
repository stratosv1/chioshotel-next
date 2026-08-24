import type {
  SmartLabControl,
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

function controlsOf(widget: SmartLabWidget) {
  return Array.isArray(widget.controls) ? widget.controls : [];
}

function controlForRole(widget: SmartLabWidget, role: SmartLabControl["role"]) {
  return controlsOf(widget).find((control) => control.role === role);
}

function valueForRole(widget: SmartLabWidget, values: Values, role: SmartLabControl["role"], fallback: number) {
  const control = controlForRole(widget, role);
  return control ? Number(values[control.id] ?? control.defaultValue) : fallback;
}

function defaults(widget: SmartLabWidget): Values {
  return Object.fromEntries(controlsOf(widget).map((control) => [control.id, control.defaultValue]));
}

function alternateValue(control: SmartLabControl) {
  const minDistance = Math.abs(control.defaultValue - control.min);
  const maxDistance = Math.abs(control.max - control.defaultValue);
  return maxDistance >= minDistance ? control.max : control.min;
}

function horizontalValues(widget: SmartLabWidget, values: Values, absoluteTime: number): RoleValues {
  const state = calculateHorizontalProjectilePhysics({
    v0: valueForRole(widget, values, "initial_speed", 12),
    h: valueForRole(widget, values, "height", 20),
    g: valueForRole(widget, values, "gravity", 9.81),
    time: absoluteTime,
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

function circularValues(widget: SmartLabWidget, values: Values, angle: number): RoleValues {
  const angular = controlForRole(widget, "angular_speed");
  const frequency = controlForRole(widget, "frequency");
  const linear = controlForRole(widget, "linear_speed");
  const state = calculateCircularMotionPhysics({
    radius: valueForRole(widget, values, "radius", 2),
    angle,
    angularSpeed: angular ? Number(values[angular.id] ?? angular.defaultValue) : undefined,
    frequency: frequency ? Number(values[frequency.id] ?? frequency.defaultValue) : undefined,
    linearSpeed: linear ? Number(values[linear.id] ?? linear.defaultValue) : undefined,
    mass: valueForRole(widget, values, "mass", 1),
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

function compareRole(role: SmartLabQuantityPhysicsRole, before: RoleValues, after: RoleValues) {
  const a = before[role];
  const b = after[role];
  if (typeof a !== "number" || typeof b !== "number") return null;
  return !physicsAlmostEqual(a, b, 1e-7, 1e-8);
}

export function derivePhysicsImpactModel(widget: SmartLabWidget) {
  const base = defaults(widget);
  const baseH = valueForRole(widget, base, "height", 20);
  const baseG = valueForRole(widget, base, "gravity", 9.81);
  const baseFallTime = Math.sqrt((2 * baseH) / baseG);

  return controlsOf(widget).map((control) => {
    const next = { ...base, [control.id]: alternateValue(control) };
    const changed = new Set<string>();
    const comparable = new Set<string>();

    for (const probe of [0.17, 0.43, 0.79]) {
      let before: RoleValues;
      let after: RoleValues;
      if (widget.physicsPreset === "horizontal_projectile") {
        // Compare at the same absolute clock time. If the new flight ends earlier,
        // the new state is clamped exactly as the real widget is clamped.
        const absoluteTime = baseFallTime * probe;
        before = horizontalValues(widget, base, absoluteTime);
        after = horizontalValues(widget, next, absoluteTime);
      } else if (widget.physicsPreset === "uniform_circular_motion" || widget.physicsPreset === "centripetal_force") {
        const angle = 2 * Math.PI * probe;
        before = circularValues(widget, base, angle);
        after = circularValues(widget, next, angle);
      } else {
        before = {};
        after = {};
      }

      for (const quantity of widget.quantities) {
        if (quantity.id === control.quantityId) continue;
        const result = compareRole(quantity.physicsRole, before, after);
        if (result === null) continue;
        comparable.add(quantity.id);
        if (result) changed.add(quantity.id);
      }
    }

    return {
      controlQuantityId: control.quantityId,
      changes: [...changed],
      unchanged: [...comparable].filter((id) => !changed.has(id)),
      explanation: "Προκύπτει από πραγματική αριθμητική σύγκριση των εξισώσεων του widget.",
    };
  });
}
