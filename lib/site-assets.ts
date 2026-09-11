export type SiteImageAsset = {
  src: string;
  width: number;
  height: number;
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
