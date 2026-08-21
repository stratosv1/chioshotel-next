import type { RoomDetailData } from "@/content/room-details";
import {
  economyDoubleRoomsDe,
  economyDoubleRoomsEl,
  economyDoubleRoomsEn,
  economyDoubleRoomsEs,
  economyDoubleRoomsFr,
  economyDoubleRoomsIt,
  economyDoubleRoomsTr,
  familyChiosApartmentsDe,
  familyChiosApartmentsEl,
  familyChiosApartmentsEn,
  familyChiosApartmentsEs,
  familyChiosApartmentsFr,
  familyChiosApartmentsIt,
  familyChiosApartmentsTr,
  standardDoubleRoomDe,
  standardDoubleRoomEl,
  standardDoubleRoomEn,
  standardDoubleRoomEs,
  standardDoubleRoomFr,
  standardDoubleRoomIt,
  standardDoubleRoomTr,
} from "@/content/room-details";
import {
  economyDoubleRoomsPl,
  familyChiosApartmentsPl,
  standardDoubleRoomPl,
} from "@/content/room-details-pl";
import { absoluteUrl } from "@/lib/seo";
import { getAllSeoImageSets } from "@/lib/seo-image-registry";
import { getSeoImagesForPath } from "@/lib/seo-image-schema";

export const dynamic = "force-static";

type ImageSitemapEntry = {
  path: string;
  images: string[];
};

const roomDetailPages: readonly RoomDetailData[] = [
  standardDoubleRoomEn,
  standardDoubleRoomEl,
  standardDoubleRoomFr,
  standardDoubleRoomDe,
  standardDoubleRoomIt,
  standardDoubleRoomEs,
  standardDoubleRoomTr,
  standardDoubleRoomPl,
  economyDoubleRoomsEn,
  economyDoubleRoomsEl,
  economyDoubleRoomsFr,
  economyDoubleRoomsDe,
  economyDoubleRoomsIt,
  economyDoubleRoomsEs,
  economyDoubleRoomsTr,
  economyDoubleRoomsPl,
  familyChiosApartmentsEn,
  familyChiosApartmentsEl,
  familyChiosApartmentsFr,
  familyChiosApartmentsDe,
  familyChiosApartmentsIt,
  familyChiosApartmentsEs,
  familyChiosApartmentsTr,
  familyChiosApartmentsPl,
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function unique(values: readonly string[]) {
  return Array.from(new Set(values));
}

function getRoomPageImages(page: RoomDetailData) {
  return unique([
    page.hero.image,
    ...page.gallery.images.map((image) => image.src),
    ...page.individualRooms.rooms.flatMap((room) =>
      room.images.map((image) => image.src),
    ),
  ]);
}

function mergeEntries(entries: readonly ImageSitemapEntry[]) {
  const byPath = new Map<string, Set<string>>();

  for (const entry of entries) {
    const images = byPath.get(entry.path) ?? new Set<string>();
    entry.images.forEach((image) => images.add(image));
    byPath.set(entry.path, images);
  }

  return Array.from(byPath, ([path, images]) => ({
    path,
    images: Array.from(images),
  }));
}

export function GET() {
  const registryEntries: ImageSitemapEntry[] = getAllSeoImageSets().map((set) => ({
    path: set.path,
    images: getSeoImagesForPath(set.path).map((image) => image.src),
  }));

  const roomEntries: ImageSitemapEntry[] = roomDetailPages.map((page) => ({
    path: page.seo.canonicalPath,
    images: getRoomPageImages(page),
  }));

  const urls = mergeEntries([...registryEntries, ...roomEntries])
    .filter((entry) => entry.images.length > 0)
    .map((entry) => {
      const images = entry.images
        .map(
          (image) => `\n    <image:image>\n      <image:loc>${escapeXml(absoluteUrl(image))}</image:loc>\n    </image:image>`,
        )
        .join("");

      return `\n  <url>\n    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>${images}\n  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
