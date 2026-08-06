import type { Metadata } from "next";
import { BeachDetailPageTailwind } from "@/components/chios/BeachDetailPageTailwind";
import { JsonLd } from "@/components/seo/JsonLd";
import type { BeachDetailData } from "@/content/beach-details";
import { karfasBeachEl } from "@/content/karfas-beach-el";
import { buildKarfasBeachSchema } from "@/content/karfas-beach-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const path = karfasBeachEl.seo.canonicalPath;

const karfasBeachDetail: BeachDetailData = {
  slug: "paralia-karfas",
  seo: {
    canonicalPath: karfasBeachEl.seo.canonicalPath,
    title: karfasBeachEl.seo.title,
    description: karfasBeachEl.seo.description,
    ogImage: karfasBeachEl.seo.ogImage,
  },
  hero: {
    kicker: karfasBeachEl.hero.kicker,
    title: karfasBeachEl.hero.title,
    description: karfasBeachEl.hero.description,
    image: karfasBeachEl.hero.image,
    tags: karfasBeachEl.hero.tags.map((tag) => `#${tag.replaceAll(" ", "_")}`),
  },
  details: karfasBeachEl.details.map((detail) => ({
    icon: detail.icon,
    title: detail.title,
    text: detail.text,
  })),
  media: {
    video: {
      title: "Ο Καρφάς από ψηλά",
      embedUrl: "https://www.youtube.com/embed/XhtMzR0k0lE",
      creditText: "Ευχαριστούμε τον δημιουργό για το όμορφο εναέριο βίντεο.",
      creditLabel: "Nikos",
      creditHref: "https://www.youtube.com/watch?v=XhtMzR0k0lE",
    },
    map: {
      title: karfasBeachEl.map.title,
      embedUrl: karfasBeachEl.map.embedUrl,
      distance: "~7 χλμ.",
      time: "~12-15 λεπτά",
      gpsHref: karfasBeachEl.map.gpsHref,
    },
  },
  baseTip: {
    icon: "🗺️",
    title: "Η βάση σας κοντά στον Καρφά",
    text: karfasBeachEl.cta.text,
    linkLabel: karfasBeachEl.cta.roomsLabel,
    href: karfasBeachEl.cta.roomsHref,
  },
  relatedTitle: "Ανακαλύψτε περισσότερες παραλίες",
  relatedText:
    "Με αφετηρία το Voulamandis House, γνωρίστε τον Καρφά και τις υπόλοιπες παραλίες της Χίου.",
};

export const metadata: Metadata = {
  ...buildPageMetadata({
    path,
    title: karfasBeachEl.seo.title,
    description: karfasBeachEl.seo.description,
    image: karfasBeachEl.seo.ogImage,
    imageAlt: karfasBeachEl.seo.imageAlt,
  }),
  alternates: {
    canonical: absoluteUrl(path),
    languages: {
      el: absoluteUrl(path),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildKarfasBeachSchema()} />
      <BeachDetailPageTailwind beach={karfasBeachDetail} />
    </>
  );
}
