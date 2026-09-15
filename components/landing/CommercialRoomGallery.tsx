import Image from "next/image";
import {
  getCommercialRoomGalleryImages,
  getCommercialRoomGalleryLabel,
} from "@/lib/commercial-room-images";

export function CommercialRoomGallery({ path }: { path: string }) {
  const images = getCommercialRoomGalleryImages(path);

  return (
    <section
      className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      aria-label={getCommercialRoomGalleryLabel(path)}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 overflow-hidden rounded-[1.5rem] bg-stone-200 p-2 shadow-xl shadow-stone-900/10 sm:gap-3 sm:rounded-[2rem] sm:p-3 lg:grid-cols-4">
        {images.map((image) => (
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-stone-100 sm:rounded-[1.4rem]"
            key={image.src}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1023px) 50vw, 25vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
