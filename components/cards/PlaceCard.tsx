import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Google-Travel style card for places (villages, beaches, sights). Visual
 * sibling of components/rooms/RoomCard.tsx: inset photo, white badge top-left,
 * dark badge bottom-left, compact body and a tonal CTA.
 */
type PlaceCardProps = {
  href: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  topBadge?: string;
  bottomBadge?: string;
  tags?: string[];
  ctaLabel: string;
  /** Visible short CTA; ctaLabel is then read by screen readers only. */
  ctaShort?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Optional live element shown above the title (e.g. sea conditions). */
  extra?: ReactNode;
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

export function PlaceCard({
  href,
  title,
  description,
  image,
  imageAlt,
  topBadge,
  bottomBadge,
  tags = [],
  ctaLabel,
  ctaShort,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 84vw",
  className = "",
  priority,
  extra,
}: PlaceCardProps) {
  return (
    <a
      href={href}
      className={`group flex flex-col rounded-3xl border border-[#eadfce] bg-white p-2.5 shadow-[0_1px_2px_rgba(47,38,31,0.06)] transition duration-200 hover:shadow-[0_10px_30px_rgba(47,38,31,0.12)] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-700/25 ${className}`}
    >
      <div className="relative h-[196px] overflow-hidden rounded-[18px] bg-[#e8dccb] sm:h-[210px]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {topBadge ? (
          <span className="absolute left-3 top-3 inline-flex min-h-7 items-center rounded-full bg-white px-3 text-xs font-semibold text-[#2f261f] shadow-sm">
            {topBadge}
          </span>
        ) : null}
        {bottomBadge ? (
          <span className="absolute bottom-3 left-3 inline-flex min-h-8 max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-2xl bg-[#2f261f]/90 px-3 py-1 text-[13px] font-semibold leading-tight text-white">
            <svg {...iconProps} width="15" height="15" className="shrink-0">
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {bottomBadge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1.5 pt-3.5">
        {extra ? <div className="mb-2 empty:hidden">{extra}</div> : null}
        <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] text-[#2f261f]">
          {title}
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-[1.5] text-[#5f4e41]">{description}</p>

        {tags.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex min-h-7 items-center gap-1 rounded-full bg-[#f7f1e8] px-2.5 text-xs text-[#4a3b30]"
              >
                <svg {...iconProps} width="13" height="13" className="text-[#9a3412]">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-end border-t border-[#f0e7da] pt-3">
            <span className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[#fbeee0] px-4 text-sm font-semibold text-[#7c2d12] transition group-hover:bg-[#f7e0c8]">
              {ctaShort ? (
                <>
                  <span aria-hidden="true">{ctaShort}</span>
                  <span className="sr-only">{ctaLabel}</span>
                </>
              ) : (
                ctaLabel
              )}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
