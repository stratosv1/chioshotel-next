/**
 * 360° panoramas per individual room/apartment, keyed by room id
 * (the `id` used in content/room-details.ts, content/ground-floor-rooms.ts
 * and content/first-floor-rooms.ts, e.g. "room-6", "apartment-8").
 *
 * Each panorama must be an equirectangular (2:1) JPG/WebP, as exported from an
 * Insta360 camera/app. Recommended size: 4096×2048 (wider images are scaled
 * down in the browser to the device's WebGL texture limit).
 *
 * Put the files in public/images/panoramas/ and add an entry here.
 * Rooms without an entry simply don't show the 360° button.
 *
 * initialYawDeg: optional starting direction in degrees
 * (0 = centre of the image, positive = turn right).
 */
export type RoomPanorama = {
  src: string;
  initialYawDeg?: number;
};

export const roomPanoramas: Record<string, RoomPanorama> = {
  // "room-6": { src: "/images/panoramas/room-6.jpg" },
};
