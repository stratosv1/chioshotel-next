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
  excellent: "border-[#b9d7b6] bg-[#eaf5e8] text-[#3f623d]",
  good: "border-[#d0d9bb] bg-[#f0f4e7] text-[#5d6848]",
  fair: "border-[#ead4aa] bg-[#fff5df] text-[#846235]",
  poor: "border-[#e7c5bc] bg-[#faeae6] text-[#8b5247]",
};

function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-[#e9e1d7]">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 py-3 text-[14px] font-semibold text-[#51463d] outline-none transition-colors hover:text-[#2e251f] [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#ddd3c7] bg-[#fffdfa] text-[17px] font-medium leading-none text-[#8b735d] transition duration-200 group-open:rotate-45">
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
            className={`absolute bottom-3 left-3 z-10 rounded-full border px-3 py-1.5 text-[11px] font-bold shadow-md backdrop-blur-sm ${ratingToneClasses[tone]}`}
          >
            {weather.ratingLabel}
          </span>
        ) : null}
      </div>

      <div className="px-4 pb-3 pt-4 md:px-5 md:pt-5">
        <div className="font-serif text-[25px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#2e251f] md:text-[24px]">
          {name}
        </div>
        <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#7a6d63]">{meta}</p>

        {weather ? (
          <div className="mt-4 rounded-2xl border border-[#ece5db] bg-[#fbfaf7] p-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              {weather.timeWindow ? (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#846d58]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9b8168]" />
                  Καλύτερα {weather.timeWindow}
                </span>
              ) : null}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-[12px] font-semibold text-[#574c43]">
              <div className="rounded-xl bg-white px-2.5 py-2 text-center shadow-[inset_0_0_0_1px_rgba(226,218,208,.85)]">
                <div className="text-[16px]">🌡</div>
                <div className="mt-0.5">{weather.temperatureC != null ? `${Math.round(weather.temperatureC)}°C` : "–"}</div>
              </div>
              <div className="rounded-xl bg-white px-2.5 py-2 text-center shadow-[inset_0_0_0_1px_rgba(226,218,208,.85)]">
                <div className="text-[16px]">🌤</div>
                <div className="mt-0.5 truncate">{weather.weatherLabel ?? "–"}</div>
              </div>
              <div className="rounded-xl bg-white px-2.5 py-2 text-center shadow-[inset_0_0_0_1px_rgba(226,218,208,.85)]">
                <div className="text-[16px]">💨</div>
                <div className="mt-0.5">{weather.windSpeedKmh != null ? `${Math.round(weather.windSpeedKmh)} km/h` : "–"}</div>
                {weather.windDirection ? <div className="mt-0.5 text-[10px] font-medium text-[#8d8177]">{weather.windDirection}</div> : null}
              </div>
            </div>

            {weather.sheltered || weather.exposed ? (
              <div
                className={`mt-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold leading-[1.45] ${
                  weather.sheltered ? "bg-[#eef5ec] text-[#4e6848]" : "bg-[#fdf1ed] text-[#865241]"
                }`}
              >
                {weather.sheltered
                  ? "✓ Προστατευμένη επιλογή για τις σημερινές συνθήκες."
                  : "△ Πιο εκτεθειμένη στον σημερινό άνεμο και κύμα."}
              </div>
            ) : null}

            <div className="mt-2">
              <Disclosure title="Γιατί αυτή η πρόταση;">
                <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-[#f5f2ec] p-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9a8d82]">Score</div>
                    <div className="mt-0.5 text-[13px] font-bold text-[#493f37]">{weather.score ?? "–"}/100</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9a8d82]">Ριπές</div>
                    <div className="mt-0.5 text-[13px] font-bold text-[#493f37]">{weather.gustsKmh != null ? `${Math.round(weather.gustsKmh)} km/h` : "–"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9a8d82]">Κύμα</div>
                    <div className="mt-0.5 text-[13px] font-bold text-[#493f37]">
                      {weather.waveHeightM != null ? `${weather.waveHeightM.toFixed(1)} m${weather.waveDirection ? ` · ${weather.waveDirection}` : ""}` : "–"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9a8d82]">Περίοδος</div>
                    <div className="mt-0.5 text-[13px] font-bold text-[#493f37]">{weather.wavePeriodS != null ? `${weather.wavePeriodS.toFixed(1)}s` : "–"}</div>
                  </div>
                </div>
              </Disclosure>
            </div>
          </div>
        ) : null}

        {details.length ? (
          <Disclosure title="Λεπτομέρειες παραλίας">
            <div className="space-y-2.5 rounded-xl bg-[#faf8f4] p-3.5 text-[13px] leading-5 text-[#665b52]">
              {details.map((detail) => (
                <p key={`${detail.label}-${detail.value}`} className="m-0">
                  <strong className="font-bold text-[#4d433b]">{detail.label}: </strong>
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
