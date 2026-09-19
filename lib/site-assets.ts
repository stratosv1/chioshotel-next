export type SiteImageAsset = {
  src: string;
  width: number;
  height: number;
};

export type PropertyShowcaseImageAsset = SiteImageAsset & {
  roomNumber: 1 | 3 | 5 | 7;
};

export const siteImageAssets = {
  homepageHero: {
    src: "/images/hero/voulamandis-house-room-kambos-chios.webp",
    width: 1536,
    height: 1152,
  },
  homepageHeroMobile: {
    src: "/images/hero/voulamandis-house-room-kambos-chios-portrait.webp",
    width: 1024,
    height: 1536,
  },
  propertyExterior: {
    src: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
    width: 1200,
    height: 800,
  },
  defaultSocial: {
    src: "/images/voulamandis-house-og.jpg",
    width: 1200,
    height: 800,
  },
  organizationLogo: {
    src: "/images/site/voula-logo.png",
    width: 1024,
    height: 1024,
  },
  agentRoomGuide: {
    src: "/images/rooms/DSC07776-2-e1675109942622.webp",
    width: 800,
    height: 534,
  },
} as const satisfies Record<string, SiteImageAsset>;

export const propertyShowcaseImageAssets = [
  {
    roomNumber: 1,
    src: "/images/rooms/DSC07776-2-e1675109942622.webp",
    width: 1200,
    height: 801,
  },
  {
    roomNumber: 3,
    src: "/images/rooms/DSC07867-1.webp",
    width: 1200,
    height: 801,
  },
  {
    roomNumber: 7,
    src: "/images/rooms/double-triple-room.jpg",
    width: 1200,
    height: 800,
  },
  {
    roomNumber: 5,
    src: "/images/rooms/voulamandis-house-rooms.webp",
    width: 1200,
    height: 800,
  },
] as const satisfies readonly PropertyShowcaseImageAsset[];
