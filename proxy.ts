import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const wordpressGonePrefixes = [
  "/wp-admin",
  "/wp-login.php",
  "/wp-comments-post.php",
  "/xmlrpc.php",
  "/wp-json",
  "/wp-content/plugins",
  "/wp-content/themes",
  "/wp-includes",
  "/wp-sitemap.xml",
  "/elementor-landing-page-4251",
  "/.cloud/rum",
  "/web-stories",
];

const wordpressArchiveGonePrefixes = [
  "/topics",
  "/tag",
  "/comments",

  "/el/topics",
  "/el/tag",
  "/el/comments",

  "/fr/topics",
  "/fr/tag",
  "/fr/comments",

  "/de/topics",
  "/de/tag",
  "/de/comments",

  "/it/topics",
  "/it/tag",
  "/it/comments",

  "/es/topics",
  "/es/tag",
  "/es/comments",

  "/tr/topics",
  "/tr/tag",
  "/tr/comments",
];

const legacyRedirects: Record<string, string> = {
  "/en": "/",
  "/book the room you like": "/find-your-room/",

  // Rooms / booking / contact / deals
  "/fr/chios-rooms": "/fr/chambres-a-chios/",
  "/our-rooms": "/chios-rooms/",
  "/chios-rooms/ground-floor-rooms": "/chios-rooms/standard-double-room/",
  "/chios-rooms/economy-double-room": "/chios-rooms/economy-double-rooms/",
  "/chios-rooms/double-triple-rooms": "/chios-rooms/standard-double-room/",
  "/domatia-xios/oikogeneiako-diamerisma":
    "/el/domatia-xios/oikogeneiako-diamerisma/",
  "/el/domatia-xios/chios-family-apartments":
    "/el/domatia-xios/oikogeneiako-diamerisma/",
  "/en/contact-voulamandis-house":
    "/voulamandis-house-contact-us-form-fill-in-the-form/",
  "/el/epikoinonia": "/el/epikoinonia-voulamandis-house/",
  "/best-room-selection-wizard": "/find-your-room/",
  "/language/el/ΞΊΟΞ±Ο„Ξ·ΟƒΞ·": "/el/amesi-kratisi-voulamandis-house/",
  "/el/amesi-kratisi-voulamandis-house":
    "/el/amesi-kratisi-voulamandis-house/",
  "/el/direct-booking-to-voulamandis-house":
    "/el/amesi-kratisi-voulamandis-house/",
  "/best-travel-deals-for-chios-hotels":
    "/best-chios-travel-deals-for-chios-hotels/",
  "/tr/sakiz-adasindaki-otel-firsatlari":
    "/tr/sakiz-adasi-otel-firsatlari/",

  // Beaches
  "/chios/chios-beaches/agia-dynami":
    "/chios/chios-beaches/agia-dynami-beach-chios/",
  "/chios/chios-beaches/agia-dynami-beach":
    "/chios/chios-beaches/agia-dynami-beach-chios/",
  "/chios/chios-beaches/agia-dynami-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/agia-dynami-beach-chios/",
  "/language/el/Ο€Ξ±ΟΞ±Ξ»Ξ―ΞµΟ‚-Ο‡Ξ―ΞΏΟ…/Ο€Ξ±ΟΞ±Ξ»Ξ―Ξ±-Ξ±Ξ³Ξ―Ξ±-Ξ΄ΟΞ½Ξ±ΞΌΞ·":
    "/el/paralies-xios/paralia-agia-dynami/",

  "/chios/chios-beaches/avlonia-beach":
    "/chios/chios-beaches/avlonia-beach2/",
  "/de/chios-insel/Ο€Ξ±ΟΞ±Ξ»Ξ―ΞµΟ‚-Ο‡Ξ―ΞΏΟ‚/avlonia-strand":
    "/de/straende-chios/avlonia-strand/",

  "/chios/chios-beaches/the-authentic-beach-agia-fotini":
    "/chios/chios-beaches/agia-fotia-beach/",
  "/chios-el/chios-beaches-el/chios-beach-agia-fotia":
    "/el/paralies-xios/paralia-agia-fotia/",

  "/chios/chios-beaches/komi-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/komi-beach/",

  "/chios/chios-beaches/lefkathia-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/lefkathia-beach/",
  "/chios/chios-beaches/the-promising-lefkathia-beach":
    "/chios/chios-beaches/lefkathia-beach/",
  "/language/el/Ο€Ξ±ΟΞ±Ξ»Ξ―ΞµΟ‚-Ο‡Ξ―ΞΏΟ…/Ξ»ΞµΟ…ΞΊΞ¬ΞΈΞΉΞ±":
    "/el/paralies-xios/paralia-lefkathia/",

  "/chios/chios-beaches/mavra-volia":
    "/chios/chios-beaches/emporios-beach/",
  "/chios/chios-beaches/mavra-volia-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/emporios-beach/",

  // Villages hubs
  "/language/el/Ο‡Ο‰ΟΞΉΞ±-Ο‡ΞΉΞΏΟ‚": "/el/xoria-xios/",
  "/chios/the-eye-caching-chios-villages": "/chios/chios-villages/",
  "/fr/chios/villages-de-chios": "/fr/villages-de-chios/",
  "/de/uncategorized-de/dorfer-von-chios": "/de/doerfer-chios/",
  "/tr/uncategorized-tr/sakiz-adasi-koylerini":
    "/tr/sakiz-adasi-koyleri/",

  // Pyrgi
  "/chios/chios-villages/the-village-of-pyrgi":
    "/chios/chios-villages/chios-pyrgi/",
  "/chios/chios-villages/pyrgi-voulamandis-house-chios-hotels":
    "/chios/chios-villages/chios-pyrgi/",
  "/language/el/Ο‡Ξ―ΞΏΟ‚/Ο‡Ο‰ΟΞΉΞ¬-Ο‡Ξ―ΞΏΟ‚/Ο€Ο…ΟΞ³Ξ―": "/el/xoria-xios/pyrgi-xios/",
  "/el/chios-el/chios-pyrgi-village": "/el/xoria-xios/pyrgi-xios/",
  "/de/chios-insel/pyrgi-chios": "/de/doerfer-chios/pyrgi-dorf/",
  "/tr/chios-odalari/pyrgi-sakiz-adasi-koyu":
    "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",

  // Mesta
  "/el/chios-el/chios-mesta-village": "/el/xoria-xios/mesta-xios/",
  "/de/chios-insel/mesta-chios-2": "/de/doerfer-chios/mesta-dorf/",
  "/tr/chios-odalari/mesta-koyu-chios":
    "/tr/sakiz-adasi-koyleri/mesta-koyu/",

  // Vessa
  "/chios/chios-villages/vessa-voulamandis-house-chios-hotels":
    "/chios/chios-villages/vessa-chios/",
  "/chios/chios-villages/vessa-vilage":
    "/chios/chios-villages/vessa-chios/",
  "/el/chios-el/chios-vessa-village": "/el/xoria-xios/vessa-xios/",
  "/de/chios-insel/vessa-chios-2": "/de/doerfer-chios/vessa-dorf/",
  "/tr/chios-odalari/vessa-koyu-chios":
    "/tr/sakiz-adasi-koyleri/vessa-koyu/",

  // Olympoi
  "/el/chios-el/chios-olympoi-village": "/el/xoria-xios/olympoi-xios/",
  "/de/chios-insel/olympi-chios-2": "/de/doerfer-chios/olympoi-dorf/",
  "/tr/chios-odalari/olympoi-koyu-chios":
    "/tr/sakiz-adasi-koyleri/olympoi-koyu/",

  // Volissos
  "/chios/chios-villages/the-village-of-volissos":
    "/chios/chios-villages/volissos-chios/",
  "/tr/chios-odalari/volissos-koyu-chios":
    "/tr/sakiz-adasi-koyleri/volissos-koyu/",

  // Armolia
  "/chios/chios-villages/the-village-of-armolia":
    "/chios/chios-villages/armolia-chios/",
  "/language/el/Ο‡Ξ―ΞΏΟ‚/Ο‡Ο‰ΟΞΉΞ¬-Ο‡Ξ―ΞΏΟ‚/Ξ±ΟΞΌΟΞ»ΞΉΞ±":
    "/el/xoria-xios/armolia-xios/",
  "/el/chios-el/chios-armolia-village": "/el/xoria-xios/armolia-xios/",
  "/el/chios-el/chios-villages-el/armolia-xios/Ξ±ΟΞΌΟΞ»ΞΉΞ± Ο‡Ξ―ΞΏΟ‚":
    "/el/xoria-xios/armolia-xios/",
  "/chios-el/chios-villages-el/chios-armolia-village":
    "/el/xoria-xios/armolia-xios/",
  "/tr/chios-el/chios-villages-el/chios-armolia-village":
    "/tr/sakiz-adasi-koyleri/armolia-koyu/",
  "/it/chios-it/chios-villages-it/chios-armolia-village":
    "/it/villaggi-chios/villaggio-armolia/",

  // Lagada
  "/chios-el/chios-villages-el/lagada-chios":
    "/el/xoria-xios/lagada-xios/",
  "/el/chios-el/lagada-chios": "/el/xoria-xios/lagada-xios/",
  "/de/chios-insel/lagada-chios-3": "/de/doerfer-chios/lagada-dorf/",
  "/fr/ile-de-chios/lagada-chios-2":
    "/fr/villages-de-chios/village-lagada/",

  // Museums hubs
  "/fr/chios/musees-de-chios": "/fr/musees-de-chios/",
  "/chios-el/chios-museums-2": "/el/mouseia-xios/",
  "/tr/chios-el/chios-museums-2": "/tr/sakiz-adasi-muzeleri/",
  "/tr/uncategorized-tr/heyecan-verici-sakiz-adasi-muzeleri":
    "/tr/sakiz-adasi-muzeleri/",

  // Museums detail
  "/chios/mastic-gum": "/chios/chios-museums/the-mastic-museum-chios/",
  "/language/el/Ο‡Ξ―ΞΏΟ‚/ΞΌΞΏΟ…ΟƒΞµΞ―Ξ±-Ο‡Ξ―ΞΏΟ‚/ΞΌΞΏΟ…ΟƒΞµΞ―ΞΏ-ΞΌΞ±ΟƒΟ„Ξ―Ο‡Ξ±Ο‚":
    "/el/mouseia-xios/mouseio-mastichas-xios/",
  "/language/el/chios-el/chios-museums-el/chios-archaeological-museum":
    "/el/mouseia-xios/arxaiologiko-mouseio-xios/",
  "/language/el/chios-el/chios-museums-el/chios-byzantine-museum-2":
    "/el/mouseia-xios/vyzantino-mouseio-xios/",
  "/chios/chios-museums/archaeological-museum-chios-voulamandis-house-chios-hotels":
    "/chios/chios-museums/archaeological-museum-chios/",
  "/chios/chios-museums/the-kallimasia-folklore-museum":
    "/chios/chios-museums/kallimasia-folklore-museum/",
  "/tr/chios-el/chios-museums-el/chios-folklore-museum":
    "/tr/sakiz-adasi-muzeleri/kallimasia-folklor-muzesi/",

  // Activities
  "/chios/chios-activities/the-chios-thermal-baths/chios":
    "/chios-thermal-baths/",
  "/chios/chios-activities/chios-thermal-baths": "/chios-thermal-baths/",
  "/fr/chios/activites/les-thermes-de-chios":
    "/fr/sources-thermales-de-chios/",
  "/chios/chios-activities/rocket-war-of-chios": "/rocket-war-chios/",
  "/chios/chios-orchids-voulamandis-house-chios-hotels": "/chios-orchids/",
  "/fr/chios/orchidees-de-chios": "/fr/orchidees-de-chios/",

  // Final safe legacy redirects from last GSC sample - museums
  "/chios/chios-museums/koraes-library-voulamandis-house-chios-hotels":
    "/chios/chios-museums/koraes-library-chios/",
  "/chios/chios-museums/chios-mastic-museum-voulamandis-house-chios-hotels":
    "/chios/chios-museums/the-mastic-museum-chios/",
  "/chios/chios-museums/chios-byzantine-museum-voulamandis-house-chios-hotels":
    "/chios/chios-museums/chios-byzantine-museum/",
  "/chios/chios-museums/chios-maritime-museum-voulamandis-house-chios-hotels":
    "/chios/chios-museums/chios-maritime-museum/",
  "/language/en/chios/chios-museums": "/chios/chios-museums/",
  "/en/chios/chios-museums/the-mastic-museum-chios":
    "/chios/chios-museums/the-mastic-museum-chios/",
  "/el/chios-el/chios-mastic-museum-2":
    "/el/mouseia-xios/mouseio-mastichas-xios/",
  "/language/el/Ο‡Ξ―ΞΏΟ‚/ΞΌΞΏΟ…ΟƒΞµΞ―ΞΏ-ΞΌΞ±ΟƒΟ„Ξ―Ο‡Ξ±Ο‚":
    "/el/mouseia-xios/mouseio-mastichas-xios/",
  "/language/el/Ο‡Ξ―ΞΏΟ‚/Ξ±ΟΟ‡Ξ±ΞΉΞΏΞ»ΞΏΞ³ΞΉΞΊΟ-ΞΌΞΏΟ…ΟƒΞµΞ―ΞΏ":
    "/el/mouseia-xios/arxaiologiko-mouseio-xios/",
  "/el/chios-el/chios-archaeological":
    "/el/mouseia-xios/arxaiologiko-mouseio-xios/",
  "/el/chios-el/chios-byzantine":
    "/el/mouseia-xios/vyzantino-mouseio-xios/",
  "/chios-el/chios-museums-el/chios-byzantine":
    "/el/mouseia-xios/vyzantino-mouseio-xios/",
  "/el/chios-el/chios-korais-library":
    "/el/mouseia-xios/vivliothiki-korai-xios/",
  "/chios-el/chios-museums-el/chios-korais-library":
    "/el/mouseia-xios/vivliothiki-korai-xios/",
  "/el/chios-el/chios-nautical-museum":
    "/el/mouseia-xios/naftiko-mouseio-xios/",
  "/chios-el/chios-museums-el/chios-nautical-museum":
    "/el/mouseia-xios/naftiko-mouseio-xios/",
  "/el/chios-el/chios-folklore-museum":
    "/el/mouseia-xios/laografiko-mouseio-kallimasias/",
  "/chios-el/chios-museums-el/chios-folklore-museum":
    "/el/mouseia-xios/laografiko-mouseio-kallimasias/",

  // Final safe legacy redirects from last GSC sample - activities
  "/chios/chios-activities/the-chios-thermal-baths":
    "/chios-thermal-baths/",
  "/chios/chios-activities/chios-greek-language-courses":
    "/greek-language-courses-chios/",
  "/chios/chios-activities/chios-hiking-voulamandis-house-chios-hotels":
    "/chios-hiking/",
  "/en/chios/chios-activities/mostra-carnival-fiesta-chios":
    "/chios-festival-mostra/",
  "/chios-el/chios-activities-el/chios-hiking-2": "/chios-hiking/",
  "/chios-el/chios-activities-el/greek-language-2":
    "/greek-language-courses-chios/",
  "/el/chios-el/greek-language-2": "/greek-language-courses-chios/",
  "/chios-el/chios-activities-el/chios-orchids-2": "/el/orchidees-xiou/",
  "/el/chios-el/chios-orchids-2": "/el/orchidees-xiou/",
  "/fr/uncategorized-fr/orchidees-de-chios": "/fr/orchidees-de-chios/",
  "/es/uncategorized-es/las-orquideas-de-chios": "/es/orquideas-de-quios/",

  // Final safe legacy redirects from last GSC sample - villages
  "/language/el/Ο‡Ξ―ΞΏΟ‚/Ο‡Ο‰ΟΞΉΞ¬-Ο‡Ξ―ΞΏΟ‚/Ξ²ΞΏΞ»ΞΉΟƒΟƒΟΟ‚":
    "/el/xoria-xios/volissos-xios/",
  "/el/chios-el/chios-volissos": "/el/xoria-xios/volissos-xios/",
  "/chios/chios-villages/volissos-voulamandis-house-chios-hotels":
    "/chios/chios-villages/volissos-chios/",
  "/de/chios-insel/volissos-chios-2": "/de/doerfer-chios/volissos-dorf/",
  "/language/el/Ο‡Ξ―ΞΏΟ‚/Ο‡Ο‰ΟΞΉΞ¬-Ο‡Ξ―ΞΏΟ‚/ΞΏΞ»ΟΞΌΟ€ΞΏΞΉ":
    "/el/xoria-xios/olympoi-xios/",
  "/chios/chios-villages/olympoi-voulamandis-house-chios-hotels":
    "/chios/chios-villages/olympoi-chios/",
  "/chios/chios-villages/the-hospitable-village-olympoi":
    "/chios/chios-villages/olympoi-chios/",
  "/language/el/Ο‡Ξ―ΞΏΟ‚/Ο‡Ο‰ΟΞΉΞ¬-Ο‡Ξ―ΞΏΟ‚/ΞΌΞµΟƒΟ„Ξ¬": "/el/xoria-xios/mesta-xios/",
  "/chios/chios-villages/mesta-voulamandis-house-chios-hotels":
    "/chios/chios-villages/mesta-chios/",
  "/chios/chios-villages/the-village-of-mesta":
    "/chios/chios-villages/mesta-chios/",
  "/language/el/Ο‡Ξ―ΞΏΟ‚/Ο‡Ο‰ΟΞΉΞ¬-Ο‡Ξ―ΞΏΟ‚/Ξ²Ξ­ΟƒΟƒΞ±": "/el/xoria-xios/vessa-xios/",
  "/chios/chios-villages/the-village-of-lagada":
    "/chios/chios-villages/lagada-chios/",
  "/tr/chios-el/chios-villages-el/lagada-chios":
    "/tr/sakiz-adasi-koyleri/lagada-koyu/",
  "/en/chios/chios-villages": "/chios/chios-villages/",
  "/language/en/chios/chios-villages": "/chios/chios-villages/",
  "/chios/chios-villages/chios-villages": "/chios/chios-villages/",
  "/de/chios-insel/armolia-chios-2": "/de/doerfer-chios/armolia-dorf/",
  "/fr/ile-de-chios/pyrgi-chios": "/fr/villages-de-chios/village-pyrgi/",
  "/it/uncategorized-it/di-villaggi-di-chios": "/it/villaggi-chios/",
  "/es/uncategorized-es/pueblos-de-chios": "/es/pueblos-chios/",

  // Final safe legacy redirects from last GSC sample - beaches
  "/language/en/chios/chios-beaches": "/chios/chios-beaches/",
  "/chios-el/chios-beaches-el/agia-dynami-beach-2":
    "/el/paralies-xios/paralia-agia-dynami/",
  "/language/el/Ο€Ξ±ΟΞ±Ξ»Ξ―ΞµΟ‚-Ο‡Ξ―ΞΏΟ…/Ξ»ΞΉΞΈΞ―": "/el/paralies-xios/paralia-lithi/",
  "/language/el/Ο€Ξ±ΟΞ±Ξ»Ξ―ΞµΟ‚-Ο‡Ξ―ΞΏΟ…/Ξ½Ξ±Ξ³ΟΟ‚": "/el/paralies-xios/paralia-nagos/",
  "/chios-el/chios-beaches-el/chios-beach-nagos":
    "/el/paralies-xios/paralia-nagos/",
  "/el/chios-el/chios-beaches-el/chios-beach-komi":
    "/el/paralies-xios/paralia-komi/",
  "/chios-el/chios-beaches-el/komi-beach-2":
    "/el/paralies-xios/paralia-komi/",
  "/el/chios-el/chios-beaches-el/chios-beach-avlonia":
    "/el/paralies-xios/paralia-avlonia/",
  "/chios-el/chios-beaches-el/mavra-volia-2":
    "/el/paralies-xios/paralia-mavra-volia/",
  "/language/en/chios/mavra-volia": "/chios/chios-beaches/emporios-beach/",
  "/chios/chios-beaches/nagos-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/nagos-beach/",
  "/chios/chios-beaches/salagona-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/salagona-beach/",
  "/chios/chios-beaches/the-attractive-salagona-beach":
    "/chios/chios-beaches/salagona-beach/",
  "/chios/chios-beaches/lithi-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/lithi-beach/",
  "/chios/chios-beaches/agia-fotini-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/agia-fotia-beach/",
  "/chios/chios-beaches/avlonia-beach-voulamandis-house-chios-hotels":
    "/chios/chios-beaches/avlonia-beach2/",

  // Final safe legacy redirects from last GSC sample - rooms / rates / contact
  "/chios-rooms/family-chios-apartments-voulamandis-house-chios-hotels":
    "/chios-rooms/family-chios-apartments/",
  "/chios-rooms/double-trible-rooms-voulamandis-house-chios-hotels":
    "/chios-rooms/standard-double-room/",
  "/domatia-xios": "/el/domatia-xios/",
  "/el/chios-rooms-2": "/el/domatia-xios/",
  "/domatia-xios/diklina-triklina-domatia":
    "/el/domatia-xios/diklina-triklina-domatia/",
  "/domatia-xios/oikonomiko-diklino-domatio":
    "/el/domatia-xios/oikonomiko-diklino-domatio/",
  "/el/domatia-xios/chios-rooms-double-trible-rooms":
    "/el/domatia-xios/diklina-triklina-domatia/",
  "/el/domatia-xios/chios-rooms-economy-double":
    "/el/domatia-xios/oikonomiko-diklino-domatio/",
  "/best-rates-chios-hotels-voulamandis-house": "/chios-hotels-rates/",
  "/en/chios-hotels-rates": "/chios-hotels-rates/",
  "/en/best-chios-travel-deals-for-chios-hotels":
    "/best-chios-travel-deals-for-chios-hotels/",
  "/crazy-travel-deals-for-chios-hotels":
    "/best-chios-travel-deals-for-chios-hotels/",
  "/reservations": "/find-your-room/",
  "/voulamandis-house-contact-form":
    "/voulamandis-house-contact-us-form-fill-in-the-form/",
  "/el/ΞµΟ€ΞΉΞΊΞΏΞΉΞ½Ο‰Ξ½Ξ―Ξ±": "/el/epikoinonia-voulamandis-house/",

  // Final safe legacy redirects from last GSC sample - island / Kampos / home
  "/chios": "/chios-island/",
  "/chios/chios-kambos-voulamandis-house-chios-hotels":
    "/chios/kampos-chios/",
  "/es/uncategorized-es/kambos-en-chios": "/es/chios/kampos-chios/",
  "/tr/uncategorized-tr/kambos-sakiz-adasi": "/tr/chios/kampos-chios/",
  "/language/el/Ξ±ΟΟ‡ΞΉΞΊΞ®": "/el/",

  // Old static URLs
  "/de/chios-ist-die-beste-insel-griechenlands": "/de/chios/",
  "/de/chios.html": "/de/chios/",
  "/voulamandis-house.html": "/",

  // Italian old special route
  "/it/esplorare-chio": "/it/esplora-chios/",
};

function normalizeLegacyPathname(pathname: string) {
  const withoutDuplicateSlashes = pathname.replace(/\/{2,}/g, "/");

  try {
    return decodeURIComponent(withoutDuplicateSlashes).replace(/\/+$/, "") || "/";
  } catch {
    return withoutDuplicateSlashes.replace(/\/+$/, "") || "/";
  }
}

function getLegacyRedirectTarget(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);
  const target = legacyRedirects[normalizedPathname] || null;

  if (!target) {
    return null;
  }

  if (normalizeLegacyPathname(target) === normalizedPathname) {
    return null;
  }

  return target;
}

function shouldReturnGone(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  return wordpressGonePrefixes.some((prefix) => {
    return (
      normalizedPathname === prefix ||
      normalizedPathname.startsWith(`${prefix}/`)
    );
  });
}

function isWordPressArchivePath(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  return wordpressArchiveGonePrefixes.some((prefix) => {
    return (
      normalizedPathname === prefix ||
      normalizedPathname.startsWith(`${prefix}/`)
    );
  });
}

function isWordPressFeedPath(pathname: string) {
  const normalizedPathname = normalizeLegacyPathname(pathname);

  return normalizedPathname === "/feed" || normalizedPathname.endsWith("/feed");
}

function isStaffPath(pathname: string) {
  return (
    pathname === "/staff" ||
    pathname.startsWith("/staff/") ||
    pathname === "/api/staff" ||
    pathname.startsWith("/api/staff/")
  );
}

function unauthorizedStaffResponse() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "www-authenticate": 'Basic realm="Staff Area", charset="UTF-8"',
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}

function isAuthorizedStaffRequest(request: NextRequest) {
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.startsWith("Basic ")) {
    return false;
  }

  try {
    const encodedCredentials = authorization.slice("Basic ".length);
    const decodedCredentials = atob(encodedCredentials);
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
      return false;
    }

    const providedUsername = decodedCredentials.slice(0, separatorIndex);
    const providedPassword = decodedCredentials.slice(separatorIndex + 1);

    return providedUsername === username && providedPassword === password;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === "www.chioshotel.gr") {
    const url = request.nextUrl.clone();
    url.hostname = "chioshotel.gr";
    return NextResponse.redirect(url, 308);
  }
  const { pathname } = request.nextUrl;

  const legacyRedirectTarget = getLegacyRedirectTarget(pathname);

  if (legacyRedirectTarget) {
    const url = request.nextUrl.clone();
    url.pathname = legacyRedirectTarget;
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  if (
    shouldReturnGone(pathname) ||
    isWordPressFeedPath(pathname) ||
    isWordPressArchivePath(pathname)
  ) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  if (isStaffPath(pathname) && !isAuthorizedStaffRequest(request)) {
    return unauthorizedStaffResponse();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (isStaffPath(pathname)) {
    response.headers.set("x-robots-tag", "noindex, nofollow");
    response.headers.set("cache-control", "no-store");
  }

  return response;
}

export const config = {
  matcher: [
    "/wp-admin/:path*",
    "/wp-login.php",
    "/wp-comments-post.php",
    "/xmlrpc.php",
    "/wp-json/:path*",
    "/wp-content/plugins/:path*",
    "/wp-content/themes/:path*",
    "/wp-includes/:path*",
    "/wp-sitemap.xml",
    "/elementor-landing-page-4251/:path*",
    "/.cloud/rum/:path*",
    "/web-stories/:path*",
    "/staff/:path*",
    "/api/staff/:path*",
    "/((?!api|_next/static|_next/image|favicon|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
