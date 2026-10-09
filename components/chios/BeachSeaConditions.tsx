import type { MarineDirection } from "@/content/trip-planner/marine-exposure";
import {
  beachName,
  beachPagePath,
  beachRegionById,
  beachesHubSeaPath,
  directionFromDegrees,
  exposedDirections,
  exposureFor,
  greekInBeachPhrase,
  meltemiFit,
  shelteredBeachesByWind,
  shelteredDirections,
  type SeaLanguage,
} from "@/lib/beach-conditions/beach-meta";
import { seaCopyFor } from "@/lib/beach-conditions/copy";
import {
  getBeachSeaOutlook,
  type BeachDayCondition,
  type BeachOutlookDay,
  type BeachSeaOutlook,
  type SeaState,
} from "@/lib/beach-conditions/outlook";

/*
 * Server-rendered sea-condition blocks for the public beach guide.
 * Intentionally no link to internal planning tools.
 */

const greekFacing: Record<MarineDirection, string> = {
  N: "Βόρεια", NE: "Βορειοανατολικά", E: "Ανατολικά", SE: "Νοτιοανατολικά",
  S: "Νότια", SW: "Νοτιοδυτικά", W: "Δυτικά", NW: "Βορειοδυτικά",
};

const stateStyles: Record<SeaState, { chip: string; dot: string; panel: string }> = {
  calm: {
    chip: "bg-emerald-100 text-emerald-900 ring-emerald-700/20",
    dot: "bg-emerald-500",
    panel: "bg-emerald-50 ring-emerald-800/15",
  },
  "some-waves": {
    chip: "bg-amber-100 text-amber-900 ring-amber-700/20",
    dot: "bg-amber-500",
    panel: "bg-amber-50 ring-amber-800/15",
  },
  wavy: {
    chip: "bg-rose-100 text-rose-900 ring-rose-700/20",
    dot: "bg-rose-500",
    panel: "bg-rose-50 ring-rose-800/15",
  },
};

function formatNumber(language: SeaLanguage, value: number | null, digits = 1) {
  if (value === null || !Number.isFinite(value)) return "–";
  return new Intl.NumberFormat(seaCopyFor(language).intlLocale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function dayLabel(language: SeaLanguage, day: BeachOutlookDay, withRelative = true) {
  const copy = seaCopyFor(language);
  const [year, month, date] = day.date.split("-").map(Number);
  const formatted = new Intl.DateTimeFormat(copy.intlLocale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, date)));
  if (!withRelative) return formatted;
  if (day.offsetFromToday === 0) return `${copy.today}, ${formatted}`;
  if (day.offsetFromToday === 1) return `${copy.tomorrow}, ${formatted}`;
  return formatted;
}

function shortDayLabel(language: SeaLanguage, day: BeachOutlookDay) {
  const copy = seaCopyFor(language);
  if (day.offsetFromToday === 0) return copy.today;
  if (day.offsetFromToday === 1) return copy.tomorrow;
  const [year, month, date] = day.date.split("-").map(Number);
  return new Intl.DateTimeFormat(copy.intlLocale, { weekday: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, date)),
  );
}

function updatedLabel(language: SeaLanguage, outlook: BeachSeaOutlook) {
  const copy = seaCopyFor(language);
  const time = new Intl.DateTimeFormat(copy.intlLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Europe/Athens",
  }).format(new Date(outlook.generatedAt));
  return copy.updated(time);
}

function windText(
  language: SeaLanguage,
  directionDeg: number | null,
  beaufort: number | null,
  label: "title" | "lower" | "none" = "title",
) {
  const copy = seaCopyFor(language);
  const direction = directionFromDegrees(directionDeg);
  const parts: string[] = [];
  if (label === "title") parts.push(copy.wind);
  if (label === "lower") parts.push(language === "de" ? copy.wind : copy.wind.toLocaleLowerCase(copy.intlLocale));
  if (direction) parts.push(copy.directionShort[direction]);
  if (beaufort !== null) parts.push(`${beaufort} ${copy.beaufortUnit}`);
  return parts.join(" ");
}

function islandWindText(language: SeaLanguage, day: BeachOutlookDay) {
  const copy = seaCopyFor(language);
  const direction = directionFromDegrees(day.islandWind.directionDeg);
  const name = direction ? copy.directionLong[direction] : "";
  const base = [copy.wind.toLowerCase(), name.toLowerCase()].filter(Boolean).join(" ");
  const beaufort = day.islandWind.beaufort !== null ? ` ~${day.islandWind.beaufort} ${copy.beaufortUnit}` : "";
  const text = `${base}${beaufort}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function BeachNameLink({
  id,
  language,
  className = "",
}: {
  id: string;
  language: SeaLanguage;
  className?: string;
}) {
  const href = beachPagePath(id, language);
  const name = beachName(id, language);
  if (!href) return <span className={className}>{name}</span>;
  return (
    <a className={`${className} underline decoration-teal-700/30 underline-offset-4 hover:decoration-teal-700`} href={href}>
      {name}
    </a>
  );
}

function StateChip({ language, state, compact = false }: { language: SeaLanguage; state: SeaState; compact?: boolean }) {
  const copy = seaCopyFor(language);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-black ring-1 ${stateStyles[state].chip} ${compact ? "text-[11px]" : "text-xs"}`}
    >
      <span className={`h-2 w-2 rounded-full ${stateStyles[state].dot}`} aria-hidden="true" />
      {copy.states[state]}
    </span>
  );
}

function SourceNote({ language, outlook }: { language: SeaLanguage; outlook: BeachSeaOutlook | null }) {
  const copy = seaCopyFor(language);
  return (
    <div className="mt-6 space-y-1 text-[12px] leading-5 text-slate-500">
      <p>{copy.disclaimer}</p>
      <p>
        {outlook ? <span>{updatedLabel(language, outlook)} · </span> : null}
        <a className="underline underline-offset-2" href="https://open-meteo.com/" rel="noopener" target="_blank">
          {copy.source}
        </a>
      </p>
    </div>
  );
}

function WindGuide({ language }: { language: SeaLanguage }) {
  const copy = seaCopyFor(language);
  const groups = [
    { title: copy.windNorth, ids: shelteredBeachesByWind.north, icon: "⬇️" },
    { title: copy.windSouth, ids: shelteredBeachesByWind.south, icon: "⬆️" },
    { title: copy.windWest, ids: shelteredBeachesByWind.west, icon: "➡️" },
  ];
  return (
    <div className="mt-8 rounded-[26px] bg-teal-50 p-5 ring-1 ring-teal-900/10 md:p-7">
      <h3 className="text-xl font-black leading-tight tracking-[-0.03em] text-[#102b2d] md:text-2xl">
        {copy.windGuideTitle}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">{copy.windGuideIntro}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {groups.map((group) => (
          <div className="rounded-2xl bg-white p-4 ring-1 ring-teal-900/10" key={group.title}>
            <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.08em] text-teal-800">
              <span aria-hidden="true">{group.icon}</span>
              {group.title}
            </h4>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-sm font-semibold text-slate-800">
              {group.ids.map((id) => (
                <li key={id}>
                  <BeachNameLink id={id} language={language} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <a className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.08em] text-teal-800" href={copy.shelteredLink.href}>
        {copy.shelteredLink.label}
      </a>
    </div>
  );
}

function OutlookRow({
  id,
  language,
  outlook,
  rank,
}: {
  id: string;
  language: SeaLanguage;
  outlook: BeachSeaOutlook;
  rank: number;
}) {
  const copy = seaCopyFor(language);
  const [first, ...rest] = outlook.days;
  const today = first.byId[id];
  if (!today) return null;
  const region = beachRegionById[id];
  return (
    <li className="grid gap-3 border-t border-teal-900/10 py-3.5 first:border-t-0 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1fr)] md:items-center md:gap-5">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="w-6 shrink-0 text-right text-xs font-black text-slate-400">{rank}</span>
        <div className="min-w-0">
          <BeachNameLink id={id} language={language} className="text-base font-black text-[#102b2d]" />
          {region ? <p className="text-xs font-semibold text-slate-500">{copy.regions[region]}</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-9 md:pl-0">
        <StateChip language={language} state={today.state} />
        <span className="text-sm font-semibold text-slate-700">
          {copy.wave} {formatNumber(language, today.waveHeightM)} {copy.waveUnit}
        </span>
        <span className="text-sm font-semibold text-slate-700">
          {windText(language, today.windDirectionDeg, today.beaufort)}
        </span>
      </div>
      <div className="flex gap-2 pl-9 md:pl-0">
        {rest.map((day) => {
          const condition = day.byId[id];
          if (!condition) return null;
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${stateStyles[condition.state].chip}`}
              key={day.date}
              title={`${dayLabel(language, day)}: ${copy.states[condition.state]}`}
            >
              <span className={`h-2 w-2 rounded-full ${stateStyles[condition.state].dot}`} aria-hidden="true" />
              {shortDayLabel(language, day)} · {formatNumber(language, condition.waveHeightM)} {copy.waveUnit}
            </span>
          );
        })}
      </div>
    </li>
  );
}

function CalmestCards({
  language,
  day,
  ids,
}: {
  language: SeaLanguage;
  day: BeachOutlookDay;
  ids: string[];
}) {
  const copy = seaCopyFor(language);
  return (
    <ol className="grid gap-3 md:grid-cols-3">
      {ids.map((id) => {
        const condition = day.byId[id];
        if (!condition) return null;
        const href = beachPagePath(id, language);
        const region = beachRegionById[id];
        const body = (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-black leading-tight text-[#102b2d]">{beachName(id, language)}</h4>
                {region ? <p className="mt-0.5 text-xs font-semibold text-slate-500">{copy.regions[region]}</p> : null}
              </div>
              <StateChip language={language} state={condition.state} compact />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              {copy.wave} {formatNumber(language, condition.waveHeightM)} {copy.waveUnit} ·{" "}
              {windText(language, condition.windDirectionDeg, condition.beaufort)}
            </p>
            {href ? (
              <span className="mt-3 inline-flex text-xs font-black uppercase tracking-[0.08em] text-teal-800">
                {copy.viewBeach} →
              </span>
            ) : null}
          </>
        );
        return (
          <li key={id}>
            {href ? (
              <a className={`block h-full rounded-2xl p-4 ring-1 transition hover:-translate-y-0.5 hover:shadow-lg ${stateStyles[condition.state].panel}`} href={href}>
                {body}
              </a>
            ) : (
              <div className={`h-full rounded-2xl p-4 ring-1 ${stateStyles[condition.state].panel}`}>{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

const HUB_VISIBLE_ROWS = 10;

/** Beaches hub: where is it calm today, island-wide ranking, evergreen wind guide. */
export async function BeachSeaConditionsHub({ language }: { language: SeaLanguage }) {
  const copy = seaCopyFor(language);
  const outlook = await getBeachSeaOutlook();
  const first = outlook?.days[0] ?? null;
  const rankedIds = first ? first.ranked.map((row) => row.beachId) : [];
  const calmest = rankedIds.slice(0, 3);

  return (
    <section className="px-4 py-10 md:px-6 md:py-14" id="sea-today" aria-labelledby="sea-today-title">
      <div className="mx-auto max-w-[1180px] rounded-[34px] border border-teal-900/10 bg-white p-5 shadow-xl shadow-black/5 md:p-10">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-teal-800">{copy.hubKicker}</span>
        <h2
          id="sea-today-title"
          className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em] text-[#102b2d] md:text-5xl"
        >
          {copy.hubTitle}
        </h2>
        <p className="mt-4 max-w-[860px] text-base leading-8 text-slate-700">{copy.hubIntro}</p>

        {outlook && first ? (
          <>
            <p className="mt-5 rounded-2xl bg-[#102b2d] px-5 py-4 text-base font-bold leading-7 text-white md:text-lg">
              {copy.hubAnswer(
                dayLabel(language, first),
                islandWindText(language, first),
                calmest.map((id) => beachName(id, language)).join(", "),
              )}
            </p>

            <h3 className="mb-3 mt-8 text-lg font-black text-[#102b2d] md:text-xl">
              {copy.hubCalmestTitle(dayLabel(language, first))}
            </h3>
            <CalmestCards language={language} day={first} ids={calmest} />

            <h3 className="mb-1 mt-9 text-lg font-black text-[#102b2d] md:text-xl">{copy.hubAllTitle}</h3>
            <p className="mb-2 text-xs font-semibold text-slate-500">
              {dayLabel(language, first)} · {copy.hours}
            </p>
            <ol className="list-none">
              {rankedIds.slice(0, HUB_VISIBLE_ROWS).map((id, index) => (
                <OutlookRow id={id} key={id} language={language} outlook={outlook} rank={index + 1} />
              ))}
            </ol>
            {rankedIds.length > HUB_VISIBLE_ROWS ? (
              <details className="group mt-1">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full bg-teal-50 px-4 py-3 text-sm font-black text-teal-900 ring-1 ring-teal-900/10 [&::-webkit-details-marker]:hidden">
                  <span className="transition group-open:rotate-45" aria-hidden="true">+</span>
                  {copy.hubMore(rankedIds.length - HUB_VISIBLE_ROWS)}
                </summary>
                <ol className="mt-2 list-none" start={HUB_VISIBLE_ROWS + 1}>
                  {rankedIds.slice(HUB_VISIBLE_ROWS).map((id, index) => (
                    <OutlookRow
                      id={id}
                      key={id}
                      language={language}
                      outlook={outlook}
                      rank={HUB_VISIBLE_ROWS + index + 1}
                    />
                  ))}
                </ol>
              </details>
            ) : null}
          </>
        ) : null}

        <WindGuide language={language} />
        <SourceNote language={language} outlook={outlook} />
      </div>
    </section>
  );
}

function OutlookDayCard({
  language,
  day,
  condition,
}: {
  language: SeaLanguage;
  day: BeachOutlookDay;
  condition: BeachDayCondition;
}) {
  const copy = seaCopyFor(language);
  return (
    <li className={`rounded-2xl p-4 ring-1 ${stateStyles[condition.state].panel}`}>
      <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-600">{dayLabel(language, day)}</p>
      <div className="mt-2">
        <StateChip language={language} state={condition.state} />
      </div>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-slate-700">
        <dt className="font-bold">{copy.wave}</dt>
        <dd>
          {formatNumber(language, condition.waveHeightM)} {copy.waveUnit}
          {condition.waveHeightMaxM !== null && condition.waveHeightM !== null && condition.waveHeightMaxM - condition.waveHeightM >= 0.1 ? ` (${copy.upTo} ${formatNumber(language, condition.waveHeightMaxM)})` : ""}
        </dd>
        <dt className="font-bold">{copy.wind}</dt>
        <dd>
          {windText(language, condition.windDirectionDeg, condition.beaufort, "none")}
          {condition.windGustsKmh !== null ? `, ${copy.gusts} ${Math.round(condition.windGustsKmh)} km/h` : ""}
        </dd>
      </dl>
    </li>
  );
}

/** Beach page: "are there waves here today?", 3-day outlook, orientation, calmer alternatives. */
export async function BeachSeaConditionsDetail({
  language,
  beachId,
}: {
  language: SeaLanguage;
  beachId: string | null;
}) {
  if (!beachId) return null;
  const exposure = exposureFor(beachId);
  if (!exposure) return null;

  const copy = seaCopyFor(language);
  const name = beachName(beachId, language);
  const title = copy.beachTitle(name, language === "el" ? greekInBeachPhrase(beachId) : name);
  const outlook = await getBeachSeaOutlook();
  const first = outlook?.days[0] ?? null;
  const today = first?.byId[beachId] ?? null;
  const facing = directionFromDegrees(exposure.facingDeg);
  const sheltered = shelteredDirections(exposure);
  const exposed = exposedDirections(exposure);
  const alternatives = first
    ? first.ranked
        .filter((row) => row.beachId !== beachId)
        .slice(0, 3)
        .map((row) => row.beachId)
    : [];

  const directionList = (directions: MarineDirection[]) =>
    directions.length ? directions.map((direction) => copy.directionLong[direction]).join(", ") : copy.none;

  return (
    <section className="px-3 py-8 md:px-5 md:py-10" id="sea-today" aria-labelledby="sea-today-title">
      <div className="mx-auto max-w-[1180px] rounded-[28px] bg-white p-5 shadow-xl shadow-black/5 ring-1 ring-cyan-900/10 md:rounded-[32px] md:p-8">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-800 md:text-xs">{copy.beachKicker}</span>
        <h2 id="sea-today-title" className="mt-3 tracking-[-0.02em] text-[1.9rem] font-extrabold leading-tight text-slate-950 md:text-5xl">
          {title}
        </h2>

        {outlook && first && today ? (
          <>
            <p className={`mt-5 rounded-2xl px-5 py-4 text-base font-bold leading-7 ring-1 md:text-lg ${stateStyles[today.state].panel}`}>
              {copy.beachAnswer(
                dayLabel(language, first),
                copy.states[today.state],
                `${copy.wave} ~${formatNumber(language, today.waveHeightM)} ${copy.waveUnit}`,
                windText(language, today.windDirectionDeg, today.beaufort, "lower"),
              )}
            </p>

            <h3 className="mb-3 mt-7 text-lg font-black text-slate-950 md:text-xl">{copy.beachOutlookTitle}</h3>
            <ol className="grid gap-3 md:grid-cols-3">
              {outlook.days.map((day) => {
                const condition = day.byId[beachId];
                return condition ? (
                  <OutlookDayCard condition={condition} day={day} key={day.date} language={language} />
                ) : null;
              })}
            </ol>
          </>
        ) : null}

        <div className="mt-7 rounded-2xl bg-cyan-50 p-5 ring-1 ring-cyan-900/10">
          <h3 className="text-lg font-black text-slate-950 md:text-xl">{copy.orientationTitle}</h3>
          <dl className="mt-3 grid gap-2 text-sm leading-6 text-slate-800 md:grid-cols-3 md:gap-4">
            <div>
              <dt className="font-black">{copy.faces}</dt>
              <dd>{facing ? (language === "el" ? greekFacing[facing] : copy.directionLong[facing]) : copy.none}</dd>
            </div>
            <div>
              <dt className="font-black">{copy.shelteredFrom}</dt>
              <dd>{directionList(sheltered)}</dd>
            </div>
            <div>
              <dt className="font-black">{copy.exposedTo}</dt>
              <dd>{directionList(exposed)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-700 md:text-base">{copy.meltemi[meltemiFit(exposure)]}</p>
        </div>

        {first && alternatives.length ? (
          <>
            <h3 className="mb-3 mt-7 text-lg font-black text-slate-950 md:text-xl">
              {copy.beachAlternativesTitle(dayLabel(language, first), today?.state === "calm")}
            </h3>
            <CalmestCards language={language} day={first} ids={alternatives} />
          </>
        ) : null}

        <SourceNote language={language} outlook={outlook} />
      </div>
    </section>
  );
}

/** Small "today" sea-state chip for beach cards (renders nothing without forecast). */
export async function BeachSeaTodayBadge({
  language,
  beachId,
}: {
  language: SeaLanguage;
  beachId: string | null;
}) {
  if (!beachId) return null;
  const outlook = await getBeachSeaOutlook();
  const day = outlook?.days[0];
  const condition = day?.byId[beachId];
  if (!day || !condition) return null;
  const copy = seaCopyFor(language);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${stateStyles[condition.state].chip}`}
    >
      <span className={`h-2 w-2 rounded-full ${stateStyles[condition.state].dot}`} aria-hidden="true" />
      {shortDayLabel(language, day)}: {copy.states[condition.state]}
    </span>
  );
}

/** Sea outlook for a hand-picked set of beaches (e.g. the beach-lovers page). */
export async function BeachSeaShortlist({
  language,
  beachIds,
}: {
  language: SeaLanguage;
  beachIds: string[];
}) {
  const outlook = await getBeachSeaOutlook();
  const first = outlook?.days[0];
  if (!outlook || !first) return null;
  const copy = seaCopyFor(language);
  const ids = first.ranked.map((row) => row.beachId).filter((id) => beachIds.includes(id));
  if (!ids.length) return null;
  const bestScore = first.byId[ids[0]].score;
  const best = ids.filter((id) => first.byId[id].score >= bestScore - 3).slice(0, 2);

  return (
    <section className="px-4 py-12 md:px-6 md:py-16" id="sea-today" aria-labelledby="sea-today-title">
      <div className="mx-auto max-w-[1100px] rounded-[32px] border border-cyan-100 bg-white p-5 shadow-[0_20px_44px_rgba(15,23,42,0.08)] md:p-10">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">{copy.shortlistKicker}</span>
        <h2 id="sea-today-title" className="mt-3 text-3xl font-[950] leading-tight tracking-[-0.04em] text-slate-950 md:text-5xl">
          {copy.shortlistTitle}
        </h2>
        <p className="mt-4 max-w-[760px] text-base leading-8 text-slate-600">{copy.shortlistIntro}</p>
        <p className={`mt-5 rounded-2xl px-5 py-4 text-base font-bold leading-7 ring-1 md:text-lg ${stateStyles[first.byId[ids[0]].state].panel}`}>
          {copy.shortlistBest(
            dayLabel(language, first),
            best.map((id) => beachName(id, language)).join(" & "),
          )}{" "}
          {islandWindText(language, first)}.
        </p>
        <ol className="mt-4 list-none">
          {ids.map((id, index) => (
            <OutlookRow id={id} key={id} language={language} outlook={outlook} rank={index + 1} />
          ))}
        </ol>
        <a className="mt-5 inline-flex text-sm font-black uppercase tracking-[0.08em] text-cyan-800" href={beachesHubSeaPath(language)}>
          {copy.shortlistHubLink}
        </a>
        <SourceNote language={language} outlook={outlook} />
      </div>
    </section>
  );
}
