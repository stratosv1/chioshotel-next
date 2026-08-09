"use client";

import { useState } from "react";

type BeachCardWeather = {
  ratingLabel: string;
  ratingTone?: "excellent" | "good" | "fair" | "poor";
  timeWindow?: string;
  temperatureC?: number | null;
  weatherLabel?: string;
  windSpeedKmh?: number | null;
  windDirection?: string;
  sheltered?: boolean;
  exposed?: boolean;
  score?: number;
  gustsKmh?: number | null;
  waveHeightM?: number | null;
  waveDirection?: string;
  wavePeriodS?: number | null;
};

type BeachDetail = {
  label: string;
  value: string;
};

type BeachCardProps = {
  name: string;
  image: string;
  meta: string;
  weather?: BeachCardWeather;
  details?: BeachDetail[];
  defaultSelected?: boolean;
};

const ratingToneClasses: Record<NonNullable<BeachCardWeather["ratingTone"]>, string> = {
  excellent: "border-[#b9d7b6] bg-[#eaf5e8] text-[#355a35]",
  good: "border-[#d0d9bb] bg-[#f0f4e7] text-[#536341]",
  fair: "border-[#ead4aa] bg-[#fff5df] text-[#795a31]",
  poor: "border-[#e7c5bc] bg-[#faeae6] text-[#7f493f]",
};

function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-[#e9e1d7]">
      <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[15px] font-bold text-[#433a33] outline-none transition-colors hover:text-[#231c18] [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d8cec2] bg-[#fffdfa] text-[19px] font-bold leading-none text-[#7f6854] transition duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

export default function BeachCard({
  name,
  image,
  meta,
  weather,
  details = [],
  defaultSelected = false,
}: BeachCardProps) {
  const [selected, setSelected] = useState(defaultSelected);
  const tone = weather?.ratingTone ?? "good";

  return (
    <article
      className={`group w-full max-w-[360px] overflow-hidden rounded-[22px] bg-white text-left transition-all duration-300 ease-out ${
        selected
          ? "border-2 border-[#9ca484] shadow-[0_18px_40px_rgba(84,88,65,.16)] ring-4 ring-[#9ca484]/12"
          : "border border-[#e5dbcf] shadow-[0_12px_30px_rgba(65,48,36,.07)] hover:border-[#cdbca8] hover:shadow-[0_20px_42px_rgba(65,48,36,.12)]"
      }`}
    >
      <div className="relative h-[214px] overflow-hidden bg-[#e9e1d7] md:h-[190px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        <button
          type="button"
          aria-pressed={selected}
          onClick={() => setSelected((value) => !value)}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold shadow-lg backdrop-blur-md transition-all ${
            selected
              ? "border-[#9ca484] bg-[#9ca484] text-white"
              : "border-white/70 bg-white/92 text-[#625548] hover:bg-white"
          }`}
          aria-label={selected ? `Αφαίρεση ${name} από την εκδρομή` : `Προσθήκη ${name} στην εκδρομή`}
        >
          {selected ? "✓" : "+"}
        </button>

        {weather ? (
          <span
            className={`absolute bottom-3 left-3 z-10 rounded-full border px-3.5 py-2 text-[12px] font-extrabold shadow-md backdrop-blur-sm ${ratingToneClasses[tone]}`}
          >
            {weather.ratingLabel}
          </span>
        ) : null}
      </div>

      <div className="px-4 pb-3 pt-4 md:px-5 md:pt-5">
        <div className="font-serif text-[27px] font-bold leading-[1.08] tracking-[-0.025em] text-[#241d19] md:text-[26px]">
          {name}
        </div>
        <p className="mt-1.5 text-[15px] font-semibold leading-6 text-[#665a51]">{meta}</p>

        {weather ? (
          <div className="mt-4 rounded-2xl border border-[#e6ddd2] bg-[#fbfaf7] p-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {weather.timeWindow ? (
                <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#725d4c]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8e745d]" />
                  Καλύτερα {weather.timeWindow}
                </span>
              ) : null}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2.5 text-[14px] font-bold text-[#453c35]">
              <div className="rounded-xl bg-white px-2.5 py-2.5 text-center shadow-[inset_0_0_0_1px_rgba(226,218,208,.95)]">
                <div className="text-[18px]">🌡</div>
                <div className="mt-1">{weather.temperatureC != null ? `${Math.round(weather.temperatureC)}°C` : "–"}</div>
              </div>
              <div className="rounded-xl bg-white px-2.5 py-2.5 text-center shadow-[inset_0_0_0_1px_rgba(226,218,208,.95)]">
                <div className="text-[18px]">🌤</div>
                <div className="mt-1 truncate">{weather.weatherLabel ?? "–"}</div>
              </div>
              <div className="rounded-xl bg-white px-2.5 py-2.5 text-center shadow-[inset_0_0_0_1px_rgba(226,218,208,.95)]">
                <div className="text-[18px]">💨</div>
                <div className="mt-1">{weather.windSpeedKmh != null ? `${Math.round(weather.windSpeedKmh)} km/h` : "–"}</div>
                {weather.windDirection ? <div className="mt-0.5 text-[12px] font-bold text-[#766a61]">{weather.windDirection}</div> : null}
              </div>
            </div>

            {weather.sheltered || weather.exposed ? (
              <div
                className={`mt-3 rounded-xl px-3 py-3 text-[14px] font-bold leading-[1.5] ${
                  weather.sheltered ? "bg-[#eef5ec] text-[#405d3c]" : "bg-[#fdf1ed] text-[#7a4638]"
                }`}
              >
                {weather.sheltered
                  ? "✓ Προστατευμένη επιλογή για τις σημερινές συνθήκες."
                  : "△ Πιο εκτεθειμένη στον σημερινό άνεμο και κύμα."}
              </div>
            ) : null}

            <div className="mt-2">
              <Disclosure title="Γιατί αυτή η πρόταση;">
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f5f2ec] p-3.5">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#7f746a]">Score</div>
                    <div className="mt-1 text-[15px] font-extrabold text-[#382f29]">{weather.score ?? "–"}/100</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#7f746a]">Ριπές</div>
                    <div className="mt-1 text-[15px] font-extrabold text-[#382f29]">{weather.gustsKmh != null ? `${Math.round(weather.gustsKmh)} km/h` : "–"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#7f746a]">Κύμα</div>
                    <div className="mt-1 text-[15px] font-extrabold text-[#382f29]">
                      {weather.waveHeightM != null ? `${weather.waveHeightM.toFixed(1)} m${weather.waveDirection ? ` · ${weather.waveDirection}` : ""}` : "–"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-[#7f746a]">Περίοδος</div>
                    <div className="mt-1 text-[15px] font-extrabold text-[#382f29]">{weather.wavePeriodS != null ? `${weather.wavePeriodS.toFixed(1)}s` : "–"}</div>
                  </div>
                </div>
              </Disclosure>
            </div>
          </div>
        ) : null}

        {details.length ? (
          <Disclosure title="Λεπτομέρειες παραλίας">
            <div className="space-y-3 rounded-xl bg-[#faf8f4] p-4 text-[15px] font-medium leading-6 text-[#544a42]">
              {details.map((detail) => (
                <p key={`${detail.label}-${detail.value}`} className="m-0">
                  <strong className="font-extrabold text-[#352d28]">{detail.label}: </strong>
                  {detail.value}
                </p>
              ))}
            </div>
          </Disclosure>
        ) : null}
      </div>
    </article>
  );
}
