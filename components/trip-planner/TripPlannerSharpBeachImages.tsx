"use client";

import { useEffect } from "react";

const REPO = "stratosv1/chioshotel-next";

const SHARP_BLOBS: Readonly<Record<string, string>> = {
  "/images/trip-planner/beaches/apothika.webp": "67a5c8b11d126be6cea785be0326bd2f2a7415ca",
  "/images/trip-planner/beaches/giosonas.webp": "6ff3831f73df4c351ccef5cffb8286cdfe5ec5b4",
  "/images/trip-planner/beaches/lilikas.webp": "54a39a4cb4ed7960afff820bbe2cceb93d4b6e8a",
  "/images/trip-planner/beaches/megas-limnionas.webp": "3d0b154349f66ca7df06a3cd86bba8da0a901b2d",
  "/images/trip-planner/beaches/mersinidi.webp": "390a2dbb3413318ca1a9fb94d1d2fb967eb30b88",
  "/images/trip-planner/beaches/ormos-lo.webp": "f826e7e339b44fb6a3283d44fd2b6cb904d47f5e",
};

const objectUrls = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

async function blobUrlFor(sha: string) {
  const cached = objectUrls.get(sha);
  if (cached) return cached;

  const existing = pending.get(sha);
  if (existing) return existing;

  const request = fetch(`https://api.github.com/repos/${REPO}/git/blobs/${sha}`, {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`GitHub image fetch failed: ${response.status}`);
      const data = (await response.json()) as { content?: string };
      if (!data.content) throw new Error("Missing GitHub blob content");

      const clean = data.content.replace(/\s/g, "");
      const binary = atob(clean);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      const url = URL.createObjectURL(new Blob([bytes], { type: "image/webp" }));
      objectUrls.set(sha, url);
      return url;
    })
    .finally(() => pending.delete(sha));

  pending.set(sha, request);
  return request;
}

function sourcePath(image: HTMLImageElement) {
  const raw = image.getAttribute("src");
  if (!raw || raw.startsWith("blob:") || raw.startsWith("data:")) return null;
  try {
    return new URL(raw, window.location.origin).pathname;
  } catch {
    return null;
  }
}

function upgradeImage(image: HTMLImageElement) {
  if (image.dataset.tripPlannerSharp === "ready" || image.dataset.tripPlannerSharp === "loading") return;

  const path = sourcePath(image);
  if (!path) return;
  const sha = SHARP_BLOBS[path];
  if (!sha) return;

  image.dataset.tripPlannerSharp = "loading";
  void blobUrlFor(sha)
    .then((url) => {
      image.src = url;
      image.dataset.tripPlannerSharp = "ready";
    })
    .catch(() => {
      delete image.dataset.tripPlannerSharp;
    });
}

function scan() {
  document.querySelectorAll<HTMLImageElement>("img").forEach(upgradeImage);
}

export default function TripPlannerSharpBeachImages() {
  useEffect(() => {
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
