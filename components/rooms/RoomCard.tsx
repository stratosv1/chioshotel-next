import Image from "next/image";
import type { RoomCategoryCard } from "@/content/rooms";
import {
  amenityLabels,
  bedLabels,
  roomCardUi,
  roomCategoryFacts,
  toRoomCategoryId,
  type AmenityKey,
  type RoomFactsLocale,
} from "@/lib/room-category-facts";

type RoomCardProps = {
  card: RoomCategoryCard;
  locale: RoomFactsLocale;
  price?: number | null;
  priority?: boolean;
  /** Full, descriptive CTA text for screen readers (visible label stays short). */
  ctaLabel?: string;
};

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  viewBox: "0 0 24 24",
};

function BedIcon() {
  return (
    <svg {...iconProps} width="16" height="16">
      <path d="M2 18V7" />
      <path d="M2 11h18a2 2 0 0 1 2 2v5" />
      <path d="M2 15h20" />
      <path d="M6 11V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function GuestsIcon() {
  return (
    <svg {...iconProps} width="15" height="15">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...iconProps} width="15" height="15">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function AmenityIcon({ amenity }: { amenity: AmenityKey }) {
  switch (amenity) {
    case "ac":
      return (
        <svg {...iconProps} width="14" height="14">
          <path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9" />
        </svg>
      );
    case "wifi":
      return (
        <svg {...iconProps} width="14" height="14">
          <path d="M5 12.5a10 10 0 0 1 14 0" />
          <path d="M8.5 16a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19.5" r="0.8" />
        </svg>
      );
    case "bathroom":
      return (
        <svg {...iconProps} width="14" height="14">
          <path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
          <path d="M6 12V5a2 2 0 0 1 4 0" />
        </svg>
      );
    case "fridge":
      return (
        <svg {...iconProps} width="14" height="14">
          <rect x="6" y="2" width="12" height="20" rx="2" />
          <path d="M6 10h12M9 5v2M9 13v3" />
        </svg>
      );
    case "kitchen":
      return (
        <svg {...iconProps} width="14" height="14">
          <path d="M3 11h18v2a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7z" />
          <path d="M9 7c0-1.5 1-1.5 1-3M14 7c0-1.5 1-1.5 1-3" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} width="14" height="14">
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8" />
        </svg>
      );
  }
}

export function RoomCard({ card, locale, price, priority, ctaLabel }: RoomCardProps) {
  const categoryId = toRoomCategoryId(card.id);
  const facts = categoryId ? roomCategoryFacts[categoryId] : null;
  const bed = categoryId ? bedLabels[categoryId][locale] : null;
  const ui = roomCardUi[locale];
  const hasPrice = typeof price === "number" && Number.isFinite(price);

  return (
    <a
      href={card.href}
      id={`room-${card.id}`}
      className="group flex scroll-mt-28 flex-col rounded-3xl border border-[#eadfce] bg-white p-2.5 shadow-[0_1px_2px_rgba(47,38,31,0.06)] transition duration-200 hover:shadow-[0_10px_30px_rgba(47,38,31,0.12)] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-700/25 target:ring-4 target:ring-amber-600/50"
    >
      <div className="relative h-[196px] overflow-hidden rounded-[18px] bg-[#e8dccb] sm:h-[210px]">
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 inline-flex min-h-7 items-center rounded-full bg-white px-3 text-xs font-semibold text-[#2f261f] shadow-sm">
          {card.badge}
        </span>
        {bed ? (
          <span
            className="absolute bottom-3 left-3 inline-flex min-h-8 max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-2xl bg-[#2f261f]/90 px-3 py-1 text-[13px] font-semibold leading-tight text-white"
            aria-label={`${ui.bedAria}: ${bed}`}
          >
            <span className="shrink-0"><BedIcon /></span>
            {bed}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1.5 pt-3.5">
        <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] text-[#2f261f]">
          {card.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-[1.5] text-[#5f4e41]">
          {card.description}
        </p>

        {card.meta.length ? (
          <ul className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[13px] font-medium text-[#4a3b30]">
            {card.meta.map((item, i) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <span className="text-[#9a3412]">{i === 0 ? <GuestsIcon /> : <CheckIcon />}</span>
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {facts ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {facts.amenities
              .filter((amenity) => !card.meta.some((m) => m.toLowerCase().includes(amenityLabels[amenity][locale].split(" ").pop()!.toLowerCase().slice(0, 5))))
              .map((amenity) => (
              <li
                key={amenity}
                className="inline-flex min-h-7 items-center gap-1 rounded-full bg-[#f7f1e8] px-2.5 text-xs text-[#4a3b30]"
              >
                <span className="text-[#7a5f4b]">
                  <AmenityIcon amenity={amenity} />
                </span>
                {amenityLabels[amenity][locale]}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-4">
        <div className="flex items-end justify-between gap-3 border-t border-[#f0e7da] pt-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#166534]">{ui.direct}</p>
            {hasPrice ? (
              <p className="mt-0.5 text-[#2f261f]">
                {ui.from ? <span className="text-xs text-[#7a5f4b]">{ui.from} </span> : null}
                <span className="text-lg font-bold">€{price}</span>
                <span className="text-xs text-[#7a5f4b]"> {ui.perNight}</span>
              </p>
            ) : null}
          </div>
          <span className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-[#fbeee0] px-4 text-sm font-semibold text-[#7c2d12] transition group-hover:bg-[#f7e0c8]">
            <span aria-hidden={ctaLabel ? true : undefined}>{ui.view}</span>
            {ctaLabel ? <span className="sr-only">{ctaLabel}</span> : null}
            <span aria-hidden="true">→</span>
          </span>
        </div>
        </div>
      </div>
    </a>
  );
}
