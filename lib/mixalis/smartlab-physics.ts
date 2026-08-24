export type HorizontalProjectilePhysicsState = {
  v0: number;
  h: number;
  g: number;
  tFall: number;
  t: number;
  range: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  theta: number;
};

export function calculateHorizontalProjectilePhysics(input: {
  v0: number;
  h: number;
  g: number;
  time: number;
}): HorizontalProjectilePhysicsState {
  const v0 = Math.max(0, input.v0);
  const h = Math.max(0.001, input.h);
  const g = Math.max(0.001, input.g);
  const tFall = Math.sqrt((2 * h) / g);
  const t = Math.min(Math.max(input.time, 0), tFall);
  const range = v0 * tFall;
  const x = v0 * t;
  const y = Math.min(h, 0.5 * g * t * t);
  const vx = v0;
  const vy = g * t;
  const speed = Math.hypot(vx, vy);
  const theta = Math.atan2(vy, vx) * 180 / Math.PI;
  return { v0, h, g, tFall, t, range, x, y, vx, vy, speed, theta };
}

export type CircularMotionPhysicsState = {
  radius: number;
  omega: number;
  speed: number;
  frequency: number;
  period: number;
  acceleration: number;
  mass: number;
  force: number;
  angle: number;
  arcLength: number;
  revolutions: number;
};

export function calculateCircularMotionPhysics(input: {
  radius: number;
  angle: number;
  angularSpeed?: number;
  frequency?: number;
  linearSpeed?: number;
  mass?: number;
}): CircularMotionPhysicsState {
  const radius = Math.max(0.001, input.radius);
  const angle = Math.max(0, input.angle);

  let omega: number;
  let speed: number;
  if (Number.isFinite(input.angularSpeed)) {
    omega = Math.max(0.001, Number(input.angularSpeed));
    speed = omega * radius;
  } else if (Number.isFinite(input.frequency)) {
    const frequencyInput = Math.max(0.001, Number(input.frequency));
    omega = 2 * Math.PI * frequencyInput;
    speed = omega * radius;
  } else if (Number.isFinite(input.linearSpeed)) {
    speed = Math.max(0.001, Number(input.linearSpeed));
    omega = speed / radius;
  } else {
    omega = 2;
    speed = omega * radius;
  }

  const frequency = omega / (2 * Math.PI);
  const period = 1 / frequency;
  const acceleration = speed * speed / radius;
  const mass = Math.max(0.001, input.mass ?? 1);
  const force = mass * acceleration;
  const arcLength = radius * angle;
  const revolutions = angle / (2 * Math.PI);

  return { radius, omega, speed, frequency, period, acceleration, mass, force, angle, arcLength, revolutions };
}

export function physicsAlmostEqual(a: number, b: number, relativeTolerance = 1e-9, absoluteTolerance = 1e-9) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= Math.max(absoluteTolerance, relativeTolerance * scale);
}
