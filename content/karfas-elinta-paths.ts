import type { LanguageCode } from "@/lib/languages";

export type LocalizedBeachPaths = Readonly<Record<LanguageCode, string>>;

export const karfasBeachPaths: LocalizedBeachPaths = {
  "en": "/chios/chios-beaches/karfas-beach/",
  "el": "/el/paralies-xios/paralia-karfas/",
  "fr": "/fr/plages-de-chios/plage-karfas/",
  "de": "/de/straende-chios/karfas-strand/",
  "it": "/it/spiagge-chios/spiaggia-karfas/",
  "es": "/es/playas-chios/playa-karfas/",
  "tr": "/tr/sakiz-adasi-plajlari/karfas-plaji/"
};

export const elintaBeachPaths: LocalizedBeachPaths = {
  "en": "/chios/chios-beaches/elinta-beach/",
  "el": "/el/paralies-xios/paralia-elinta/",
  "fr": "/fr/plages-de-chios/plage-elinta/",
  "de": "/de/straende-chios/elinta-strand/",
  "it": "/it/spiagge-chios/spiaggia-elinta/",
  "es": "/es/playas-chios/playa-elinta/",
  "tr": "/tr/sakiz-adasi-plajlari/elinta-plaji/"
};
