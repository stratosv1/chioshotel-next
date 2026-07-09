"use client";

import { useEffect } from "react";

const languageLabels = {
  en: "EN",
  el: "EL",
  fr: "FR",
  de: "DE",
  it: "IT",
  es: "ES",
  tr: "TR",
} as const;

type LanguageCode = keyof typeof languageLabels;

type LanguagePathGroup = Record<LanguageCode, string>;

const beachCategoryPathGroups: LanguagePathGroup[] = [
  {
    en: "/chios-organized-beaches/",
    el: "/el/organomenes-paralies-xios/",
    fr: "/fr/plages-organisees-chios/",
    de: "/de/organisierte-straende-chios/",
    it: "/it/spiagge-attrezzate-chios/",
    es: "/es/playas-organizadas-quios/",
    tr: "/tr/sakiz-adasi-duzenli-plajlar/",
  },
  {
    en: "/chios-family-beaches/",
    el: "/el/paralies-xios-gia-paidia/",
    fr: "/fr/plages-de-chios-pour-enfants/",
    de: "/de/chios-straende-fuer-kinder/",
    it: "/it/spiagge-chios-per-bambini/",
    es: "/es/playas-de-quios-para-ninos/",
    tr: "/tr/cocuklar-icin-sakiz-adasi-plajlari/",
  },
  {
    en: "/chios-sheltered-beaches/",
    el: "/el/apanemes-paralies-xios/",
    fr: "/fr/plages-abritees-chios/",
    de: "/de/geschuetzte-straende-chios/",
    it: "/it/spiagge-riparate-chios/",
    es: "/es/playas-resguardadas-quios/",
    tr: "/tr/sakiz-adasi-korunakli-plajlar/",
  },
  {
    en: "/chios-sandy-beaches/",
    el: "/el/paralies-me-ammo-xios/",
    fr: "/fr/plages-de-sable-chios/",
    de: "/de/sandstraende-chios/",
    it: "/it/spiagge-di-sabbia-chios/",
    es: "/es/playas-de-arena-quios/",
    tr: "/tr/sakiz-adasi-kumlu-plajlar/",
  },
  {
    en: "/chios-quiet-beaches/",
    el: "/el/isixes-paralies-xios/",
    fr: "/fr/plages-calmes-chios/",
    de: "/de/ruhige-straende-chios/",
    it: "/it/spiagge-tranquille-chios/",
    es: "/es/playas-tranquilas-quios/",
    tr: "/tr/sakiz-adasi-sakin-plajlar/",
  },
  {
    en: "/beaches-near-voulamandis-house/",
    el: "/el/kontines-paralies-voulamandis-house/",
    fr: "/fr/plages-proches-voulamandis-house/",
    de: "/de/straende-nahe-voulamandis-house/",
    it: "/it/spiagge-vicine-voulamandis-house/",
    es: "/es/playas-cerca-voulamandis-house/",
    tr: "/tr/voulamandis-house-yakin-plajlar/",
  },
];

const villageCategoryPathGroups: LanguagePathGroup[] = [
  {
    en: "/chios-mastic-villages/",
    el: "/el/mastichochoria-xios/",
    fr: "/fr/villages-du-mastic-chios/",
    de: "/de/mastixdoerfer-chios/",
    it: "/it/villaggi-del-mastice-chios/",
    es: "/es/pueblos-del-mastiha-quios/",
    tr: "/tr/sakiz-adasi-mastik-koyleri/",
  },
  {
    en: "/chios-medieval-villages/",
    el: "/el/mesaionika-xoria-xios/",
    fr: "/fr/villages-medievaux-chios/",
    de: "/de/mittelalterliche-doerfer-chios/",
    it: "/it/villaggi-medievali-chios/",
    es: "/es/pueblos-medievales-quios/",
    tr: "/tr/sakiz-adasi-orta-cag-koyleri/",
  },
  {
    en: "/chios-seaside-villages/",
    el: "/el/parathalassia-xoria-xios/",
    fr: "/fr/villages-en-bord-de-mer-chios/",
    de: "/de/kuestendoerfer-chios/",
    it: "/it/villaggi-sul-mare-chios/",
    es: "/es/pueblos-costeros-quios/",
    tr: "/tr/sakiz-adasi-sahil-koyleri/",
  },
];

const translatedPathGroups = [
  ...beachCategoryPathGroups,
  ...villageCategoryPathGroups,
];

function normalizePath(path: string) {
  if (!path) {
    return "/";
  }

  const cleanPath = path.split("?")[0].split("#")[0];
  const withLeadingSlash = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  if (withLeadingSlash === "/") {
    return "/";
  }

  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function getMatchingPathGroup(pathname: string) {
  const normalizedPath = normalizePath(pathname);

  return translatedPathGroups.find((group) =>
    Object.values(group).includes(normalizedPath),
  );
}

function updateLanguageLinks(pathGroup: LanguagePathGroup) {
  const header = document.querySelector("header");

  if (!header) {
    return;
  }

  const links = Array.from(header.querySelectorAll<HTMLAnchorElement>("a[href]"));

  for (const [language, label] of Object.entries(languageLabels) as Array<[
    LanguageCode,
    string,
  ]>) {
    const languageLinks = links.filter((link) => link.textContent?.trim() === label);

    for (const link of languageLinks) {
      link.href = pathGroup[language];
    }
  }
}

export function BeachCategoryLanguageLinksHydrator() {
  useEffect(() => {
    function hydrate() {
      const pathGroup = getMatchingPathGroup(window.location.pathname);

      if (!pathGroup) {
        return;
      }

      updateLanguageLinks(pathGroup);
    }

    hydrate();

    const observer = new MutationObserver(() => {
      hydrate();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("popstate", hydrate);

    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", hydrate);
    };
  }, []);

  return null;
}
