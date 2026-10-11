"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight 360° viewer for equirectangular (2:1) panoramas, e.g. Insta360 exports.
 * Dependency-free WebGL: one full-screen quad, the fragment shader maps each pixel to a
 * viewing direction and samples the panorama. Loaded on demand via next/dynamic, so it
 * adds nothing to the room page until a guest opens it.
 */

export type RoomPanoramaViewerLabels = {
  title: string;
  hint: string;
  close: string;
  loading: string;
  unsupported: string;
};

type RoomPanoramaViewerProps = {
  src: string;
  initialYawDeg?: number;
  labels: RoomPanoramaViewerLabels;
  onClose: () => void;
};

const VERTEX_SHADER = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uYaw;
uniform float uPitch;
uniform float uTanHalfFov;
const float PI = 3.14159265358979;
void main() {
  vec2 p = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  vec3 d = normalize(vec3(p.x * uTanHalfFov * (uRes.x / uRes.y), p.y * uTanHalfFov, -1.0));
  float cp = cos(uPitch); float sp = sin(uPitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
  float cy = cos(uYaw); float sy = sin(uYaw);
  d = vec3(d.x * cy - d.z * sy, d.y, d.x * sy + d.z * cy);
  float lon = atan(d.x, -d.z);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  vec2 uv = vec2(fract(lon / (2.0 * PI) + 0.5), 0.5 - lat / PI);
  gl_FragColor = texture2D(uTex, uv);
}
`;

const MIN_FOV = (35 * Math.PI) / 180;
const MAX_FOV = (100 * Math.PI) / 180;
const MAX_PITCH = (85 * Math.PI) / 180;
const AUTO_ROTATE_SPEED = 0.06; // radians per second

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function fitImageToTexture(image: HTMLImageElement, maxSize: number): TexImageSource {
  const scale = Math.min(1, maxSize / image.naturalWidth, maxSize / image.naturalHeight);
  if (scale >= 1) return image;
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(image.naturalWidth * scale);
  canvas.height = Math.floor(image.naturalHeight * scale);
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export default function RoomPanoramaViewer({ src, initialYawDeg = 0, labels, onClose }: RoomPanoramaViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unsupported">("loading");
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl || gl.isContextLost()) {
      setStatus("unsupported");
      return;
    }

    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      setStatus("unsupported");
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setStatus("unsupported");
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLocation = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uYaw = gl.getUniformLocation(program, "uYaw");
    const uPitch = gl.getUniformLocation(program, "uPitch");
    const uTanHalfFov = gl.getUniformLocation(program, "uTanHalfFov");

    const view = {
      yaw: (initialYawDeg * Math.PI) / 180,
      pitch: 0,
      fov: canvas.clientWidth < canvas.clientHeight ? (95 * Math.PI) / 180 : (75 * Math.PI) / 180,
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let autoRotate = !reducedMotion;
    let textureReady = false;
    let texture: WebGLTexture | null = null;
    let frame = 0;
    let lastTime = 0;
    let disposed = false;

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    }

    function draw(time: number) {
      if (disposed || !gl || !canvas) return;
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      if (autoRotate) view.yaw += AUTO_ROTATE_SPEED * delta;
      resize();
      if (textureReady) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uYaw, view.yaw);
        gl.uniform1f(uPitch, view.pitch);
        gl.uniform1f(uTanHalfFov, Math.tan(view.fov / 2));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      frame = requestAnimationFrame(draw);
    }

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (disposed) return;
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      const maxSize = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE) as number, 8192);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, fitImageToTexture(image, maxSize));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      textureReady = true;
      setStatus("ready");
    };
    image.onerror = () => {
      if (!disposed) setStatus("unsupported");
    };
    image.src = src;
    frame = requestAnimationFrame(draw);

    // Interaction: drag to look around, wheel / pinch to zoom, arrow keys and +/- for keyboard users.
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDistance = 0;

    function stopAutoRotate() {
      autoRotate = false;
      setHintVisible(false);
    }

    function radiansPerPixel() {
      return view.fov / Math.max(1, canvas?.clientHeight ?? 1);
    }

    function onPointerDown(event: PointerEvent) {
      stopAutoRotate();
      canvas?.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    }

    function onPointerMove(event: PointerEvent) {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const current = { x: event.clientX, y: event.clientY };
      pointers.set(event.pointerId, current);
      if (pointers.size === 1) {
        const k = radiansPerPixel();
        view.yaw -= (current.x - previous.x) * k;
        view.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, view.pitch + (current.y - previous.y) * k));
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance > 0) view.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, view.fov * (pinchDistance / distance)));
        pinchDistance = distance;
      }
    }

    function onPointerUp(event: PointerEvent) {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinchDistance = 0;
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      stopAutoRotate();
      view.fov = Math.max(MIN_FOV, Math.min(MAX_FOV, view.fov * Math.exp(event.deltaY * 0.001)));
    }

    function onKeyDown(event: KeyboardEvent) {
      const step = 0.15;
      if (event.key === "ArrowLeft") view.yaw -= step;
      else if (event.key === "ArrowRight") view.yaw += step;
      else if (event.key === "ArrowUp") view.pitch = Math.min(MAX_PITCH, view.pitch + step);
      else if (event.key === "ArrowDown") view.pitch = Math.max(-MAX_PITCH, view.pitch - step);
      else if (event.key === "+" || event.key === "=") view.fov = Math.max(MIN_FOV, view.fov * 0.9);
      else if (event.key === "-") view.fov = Math.min(MAX_FOV, view.fov / 0.9);
      else return;
      event.preventDefault();
      stopAutoRotate();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("keydown", onKeyDown);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      image.onload = null;
      image.onerror = null;
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("keydown", onKeyDown);
      // Free GPU resources but keep the context: React may re-run this effect on the same canvas.
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [src, initialYawDeg]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={labels.title}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-[#1c1611] p-0 text-white backdrop:bg-black/80"
    >
      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label={`${labels.title}. ${labels.hint}`}
        className="block h-full w-full bg-[#1c1611] cursor-grab touch-none select-none outline-none active:cursor-grabbing focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-amber-400"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/60 to-transparent p-4 pb-10">
        <p className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-amber-900 shadow-sm">{labels.title}</p>
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/95 text-[#2f261f] shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400"
          aria-label={labels.close}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      {status === "loading" ? (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold text-white/85" role="status">{labels.loading}</p>
      ) : null}
      {status === "unsupported" ? (
        <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm font-bold text-white/85" role="alert">{labels.unsupported}</p>
      ) : null}
      {status === "ready" && hintVisible ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto w-fit rounded-full bg-black/55 px-4 py-2 text-xs font-bold text-white">
          <span aria-hidden="true">↔ </span>{labels.hint}
        </p>
      ) : null}
    </dialog>
  );
}
