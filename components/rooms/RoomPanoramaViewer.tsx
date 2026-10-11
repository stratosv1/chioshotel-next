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
  /** Text on the slider handle, e.g. "360° view". */
  open: string;
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
const TWO_PI = Math.PI * 2;
const SLIDER_KEY_STEP = (10 * Math.PI) / 180;

type ViewerControls = {
  /** Set the horizontal direction from a 0–1 slider position (0 = starting view, 1 = full turn). */
  setTurn: (fraction: number) => void;
  /** Rotate by a number of radians (keyboard on the slider). */
  turnBy: (radians: number) => void;
};

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
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<ViewerControls | null>(null);
  const thumbGrabOffsetRef = useRef<number | null>(null);

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
    const startYaw = view.yaw;
    let lastSliderDegrees = -1;

    // Keep the slider handle in step with the view (auto-rotate, dragging the photo, keyboard).
    function syncSlider() {
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;
      const fraction = ((((view.yaw - startYaw) % TWO_PI) + TWO_PI) % TWO_PI) / TWO_PI;
      const travel = Math.max(0, track.clientWidth - thumb.offsetWidth - 12);
      thumb.style.transform = `translateX(${fraction * travel}px)`;
      const degrees = Math.round(fraction * 360) % 360;
      if (degrees !== lastSliderDegrees) {
        lastSliderDegrees = degrees;
        thumb.setAttribute("aria-valuenow", String(degrees));
        thumb.setAttribute("aria-valuetext", `${degrees}°`);
      }
    }

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
      syncSlider();
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
    }

    controlsRef.current = {
      setTurn(fraction) {
        stopAutoRotate();
        view.yaw = startYaw + Math.min(1, Math.max(0, fraction)) * TWO_PI;
      },
      turnBy(radians) {
        stopAutoRotate();
        view.yaw += radians;
      },
    };

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
      controlsRef.current = null;
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

  function sliderFractionAt(clientX: number) {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return 0;
    const rect = track.getBoundingClientRect();
    const grab = thumbGrabOffsetRef.current ?? thumb.offsetWidth / 2;
    const travel = Math.max(1, rect.width - thumb.offsetWidth - 12);
    return (clientX - rect.left - 6 - grab) / travel;
  }

  function onSliderPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const thumb = thumbRef.current;
    if (!thumb) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const thumbRect = thumb.getBoundingClientRect();
    const onThumb = event.clientX >= thumbRect.left && event.clientX <= thumbRect.right;
    thumbGrabOffsetRef.current = onThumb ? event.clientX - thumbRect.left : null;
    controlsRef.current?.setTurn(sliderFractionAt(event.clientX));
    if (!onThumb) thumbGrabOffsetRef.current = thumb.offsetWidth / 2;
    thumb.focus({ preventScroll: true });
  }

  function onSliderPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (thumbGrabOffsetRef.current === null || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    controlsRef.current?.setTurn(sliderFractionAt(event.clientX));
  }

  function onSliderPointerUp() {
    thumbGrabOffsetRef.current = null;
  }

  function onSliderKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") controlsRef.current?.turnBy(-SLIDER_KEY_STEP);
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") controlsRef.current?.turnBy(SLIDER_KEY_STEP);
    else if (event.key === "Home") controlsRef.current?.setTurn(0);
    else if (event.key === "End") controlsRef.current?.setTurn(359 / 360);
    else return;
    event.preventDefault();
  }

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
      {status === "ready" ? (
        <div className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex justify-center px-4">
          <div
            ref={trackRef}
            onPointerDown={onSliderPointerDown}
            onPointerMove={onSliderPointerMove}
            onPointerUp={onSliderPointerUp}
            onPointerCancel={onSliderPointerUp}
            className="relative w-full max-w-[420px] cursor-pointer touch-none select-none rounded-full bg-[#efe6d9]/95 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-[#2f261f]/20" />
            <div
              ref={thumbRef}
              role="slider"
              tabIndex={0}
              aria-label={`${labels.title}. ${labels.hint}`}
              aria-valuemin={0}
              aria-valuemax={359}
              aria-valuenow={0}
              aria-valuetext="0°"
              onKeyDown={onSliderKeyDown}
              className="relative inline-flex h-11 cursor-grab items-center gap-3 rounded-full bg-white px-4 text-[15px] font-bold text-[#2f261f] shadow-[0_2px_8px_rgba(47,38,31,0.18)] will-change-transform active:cursor-grabbing focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
              <span className="whitespace-nowrap">{labels.open}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
