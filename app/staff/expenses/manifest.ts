import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Έξοδα · Voulamandis House",
    short_name: "Έξοδα",
    description: "Καταχώρηση και παρακολούθηση εξόδων Voulamandis House.",
    start_url: "/staff/expenses/",
    scope: "/staff/expenses/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f4efe8",
    theme_color: "#805536",
    lang: "el",
    categories: ["finance", "business", "productivity"],
    icons: [
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
