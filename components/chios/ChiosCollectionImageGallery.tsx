import Image from "next/image";

type CollectionLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type CollectionKind = "beaches" | "villages";

type CollectionImageItem = {
  image: string;
  imageAlt: string;
  title: string;
  href: string;
};

const galleryLabels: Record<
  CollectionLanguage,
  Record<CollectionKind, string>
> = {
  en: { beaches: "Featured Chios beaches", villages: "Featured Chios villages" },
  el: { beaches: "Επιλεγμένες παραλίες της Χίου", villages: "Επιλεγμένα χωριά της Χίου" },
  fr: { beaches: "Plages incontournables de Chios", villages: "Villages incontournables de Chios" },
  de: { beaches: "Ausgewählte Strände auf Chios", villages: "Ausgewählte Dörfer auf Chios" },
  it: { beaches: "Spiagge da non perdere a Chios", villages: "Villaggi da non perdere a Chios" },
  es: { beaches: "Playas destacadas de Quíos", villages: "Pueblos destacados de Quíos" },
  tr: { beaches: "Sakız Adası’nın öne çıkan plajları", villages: "Sakız Adası’nın öne çıkan köyleri" },
};

function getUniqueImages(items: readonly CollectionImageItem[]) {
  const imagePaths = new Set<string>();

  return items.filter((item) => {
    if (imagePaths.has(item.image)) return false;
    imagePaths.add(item.image);
    return true;
  });
}

export function ChiosCollectionImageGallery({
  items,
  kind,
  language,
}: {
  items: readonly CollectionImageItem[];
  kind: CollectionKind;
  language: CollectionLanguage;
}) {
  const featuredImages = getUniqueImages(items).slice(0, 3);

  if (featuredImages.length < 3) return null;

  const title = galleryLabels[language][kind];
  const labelClass =
    kind === "beaches"
      ? "bg-teal-950/78 ring-teal-100/30"
      : "bg-stone-950/78 ring-amber-100/30";

  return (
    <section
      className="px-4 pt-4 md:px-6 md:pt-6"
      aria-labelledby={`${kind}-featured-images-title`}
      data-search-image-gallery={kind}
    >
      <h2 id={`${kind}-featured-images-title`} className="sr-only">
        {title}
      </h2>
      <div className="mx-auto grid h-[220px] max-w-[1180px] grid-cols-[1.45fr_1fr] grid-rows-2 gap-2 overflow-hidden rounded-[26px] bg-white p-2 shadow-xl shadow-black/5 ring-1 ring-black/5 sm:h-[300px] md:h-[360px] md:gap-3 md:rounded-[34px] md:p-3">
        {featuredImages.map((item, index) => (
          <a
            href={item.href}
            key={item.image}
            className={`group relative min-h-0 overflow-hidden rounded-[18px] md:rounded-[24px] ${
              index === 0 ? "row-span-2" : ""
            }`}
            aria-label={item.title}
          >
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes={
                index === 0
                  ? "(max-width: 767px) 58vw, 700px"
                  : "(max-width: 767px) 38vw, 460px"
              }
              quality={78}
              className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
            />
            <span
              className={`absolute inset-x-2 bottom-2 truncate rounded-full px-3 py-1.5 text-[10px] font-black text-white shadow-lg ring-1 backdrop-blur-sm sm:text-xs ${labelClass}`}
            >
              {item.title}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
