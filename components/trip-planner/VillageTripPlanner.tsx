"use client";

import { useMemo, useState } from "react";
import type { VillageMaster } from "@/content/trip-planner/villages";
import {
  villageRoutingById,
  villageRouteClusterLabels,
  type VillageRouteCluster,
} from "@/content/trip-planner/village-routing";

const FILTERS = [
  { id: "all", label: "Όλα" },
  { id: "mastic", label: "Μαστιχοχώρια" },
  { id: "medieval", label: "Μεσαιωνικά" },
  { id: "food", label: "Φαγητό" },
  { id: "sunset", label: "Sunset" },
  { id: "family", label: "Οικογένεια" },
  { id: "quiet", label: "Ήσυχα" },
] as const;

const EMPTY_CLUSTER_HINTS: VillageRouteCluster[] = [
  "south-mastic",
  "west-central-medieval",
  "northwest-volissos",
];

type Props = { villages: VillageMaster[] };

export function VillageTripPlanner({ villages }: Props) {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return villages;
    return villages.filter((village) => {
      const tags = new Set(village.tags);
      if (activeFilter === "family") return tags.has("family") || village.visitorFit.includes("οικογένειες");
      if (activeFilter === "quiet") return tags.has("quiet") || village.character.includes("ήσυχο");
      return tags.has(activeFilter);
    });
  }, [activeFilter, villages]);

  const selected = useMemo(
    () => selectedIds.map((id) => villages.find((village) => village.id === id)).filter(Boolean) as VillageMaster[],
    [selectedIds, villages],
  );

  const clusters = useMemo(
    () => Array.from(new Set(selected.map((v) => villageRoutingById[v.id]?.routeCluster).filter(Boolean) as VillageRouteCluster[])),
    [selected],
  );

  const toggle = (id: string) =>
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const routeMessage = selected.length === 0
    ? "Διάλεξε 2–4 χωριά και θα σου δείξουμε αν ανήκουν στην ίδια λογική ημερήσια διαδρομή."
    : clusters.length <= 1
      ? "Οι επιλογές σου είναι στην ίδια γεωγραφική ζώνη — καλός συνδυασμός για μία ημέρα."
      : `Οι επιλογές σου απλώνονται σε ${clusters.length} διαφορετικές ζώνες. Καλύτερα να τις χωρίσεις σε περισσότερες ημέρες.`;

  return (
    <div className="bg-[#f7f4ee] text-[#3d342c]">
      <section className="border-b border-[#e8dfd3] bg-gradient-to-b from-[#efe8dc] to-[#f7f4ee]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-7 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-[#d8c8b5] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a6654]">
              Village Trip Planner
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#352d27] sm:text-4xl lg:text-5xl">
              Διάλεξε τα χωριά σου στη Χίο
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d6258] sm:text-base">
              Φίλτραρε τα χωριά που σου ταιριάζουν, πρόσθεσέ τα στην ημέρα σου και δες ποια συνδυάζονται καλύτερα στην ίδια γεωγραφική διαδρομή.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7">
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${active ? "border-[#6e5b49] bg-[#6e5b49] text-white" : "border-[#ded3c6] bg-white text-[#5f5348] hover:border-[#bda995] hover:bg-[#fbf9f5]"}`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="mb-4">
              <p className="text-sm font-semibold text-[#4f443a]">{filtered.length} χωριά</p>
              <p className="mt-1 text-xs text-[#887a6d]">Χρησιμοποιούμε τις υπάρχουσες φωτογραφίες του site όπου υπάρχουν. Τα υπόλοιπα χωριά έχουν προσωρινό συνεπές fallback.</p>
            </div>

            <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((village) => {
                const routing = villageRoutingById[village.id];
                const isSelected = selectedIds.includes(village.id);
                return (
                  <article
                    key={village.id}
                    className={`flex h-full min-h-[390px] flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_8px_30px_rgba(88,71,54,0.06)] transition ${isSelected ? "border-[#8f775f] ring-2 ring-[#d9c7b2]" : "border-[#e5ddd3] hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(88,71,54,0.10)]"}`}
                  >
                    <div className="relative h-36 shrink-0 bg-gradient-to-br from-[#d6c3a9] via-[#b9b7a5] to-[#7d9288]">
                      {village.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={village.image} alt={village.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center">
                          <span className="rounded-full border border-white/50 bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#67594d] backdrop-blur">
                            Φωτογραφία σύντομα
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-3 pt-10">
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#5d5045]">{village.character[0]}</span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight text-[#3d342c]">{village.name}</h2>
                        {routing && (
                          <p className="mt-1 text-xs font-medium text-[#877769]">
                            {routing.distanceFromVoulamandisKm} km · ~{routing.driveTimeFromVoulamandisMin} min
                          </p>
                        )}
                      </div>

                      <div className="mt-3 min-h-[62px] space-y-1.5 text-sm leading-5 text-[#70645a]">
                        <p><span className="font-semibold text-[#53483e]">Ώρα:</span> {village.bestTime}</p>
                        <p><span className="font-semibold text-[#53483e]">Διάρκεια:</span> {village.recommendedDuration}</p>
                      </div>

                      <div className="mt-3 flex min-h-[54px] flex-wrap content-start gap-1.5">
                        {village.character.slice(0, 3).map((item) => (
                          <span key={item} className="rounded-full bg-[#f2ede6] px-2.5 py-1 text-[11px] font-medium text-[#6b5d50]">
                            {item}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggle(village.id)}
                        className={`mt-auto min-h-11 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] ${isSelected ? "bg-[#ede4d8] text-[#5d4c3e] hover:bg-[#e4d8ca]" : "bg-[#6e5b49] text-white hover:bg-[#5f4e3f]"}`}
                      >
                        {isSelected ? "✓ Προστέθηκε — αφαίρεση" : "+ Προσθήκη στην ημέρα"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside id="village-day-plan" className="scroll-mt-24">
            <div className="rounded-2xl border border-[#dfd4c7] bg-white p-5 shadow-[0_12px_36px_rgba(88,71,54,0.08)] lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7969]">Η ημέρα μου</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#3c332b]">{selected.length} επιλεγμένα χωριά</h2>
                </div>
                {selected.length > 0 && (
                  <button type="button" onClick={() => setSelectedIds([])} className="rounded-lg px-3 py-2 text-xs font-semibold text-[#8a6e59] hover:bg-[#f6f1eb]">
                    Καθαρισμός
                  </button>
                )}
              </div>

              <div className={`mt-4 rounded-xl border p-3 text-sm leading-5 ${clusters.length <= 1 ? "border-[#d7dfd4] bg-[#f2f7f0] text-[#52654e]" : "border-[#ead7bd] bg-[#fff7e8] text-[#7b623f]"}`}>
                {routeMessage}
              </div>

              {selected.length === 0 && (
                <div className="mt-4 rounded-xl border border-dashed border-[#ddd2c5] bg-[#fbf9f6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b7a6b]">Παραδείγματα ζωνών</p>
                  <div className="mt-3 space-y-2">
                    {EMPTY_CLUSTER_HINTS.map((cluster) => (
                      <div key={cluster} className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#6a5d52] shadow-sm ring-1 ring-[#eee5da]">
                        {villageRouteClusterLabels[cluster]}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {clusters.length > 0 && (
                <div className="mt-4 space-y-2">
                  {clusters.map((cluster) => (
                    <div key={cluster} className="rounded-xl bg-[#f8f5f1] px-3 py-2.5 text-xs font-medium text-[#6a5d52]">
                      {villageRouteClusterLabels[cluster]}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-2">
                {selected.map((village) => (
                  <div key={village.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#eee6dc] p-3">
                    <div>
                      <p className="text-sm font-semibold text-[#4b4036]">{village.name}</p>
                      <p className="mt-0.5 text-xs text-[#8a7b6d]">{village.recommendedDuration}</p>
                    </div>
                    <button type="button" onClick={() => toggle(village.id)} className="text-xs font-semibold text-[#9a7258]">Αφαίρεση</button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {selected.length > 0 && (
          <a href="#village-day-plan" className="fixed inset-x-4 bottom-4 z-30 flex min-h-14 items-center justify-between rounded-2xl bg-[#58483b] px-5 text-sm font-semibold text-white shadow-2xl lg:hidden">
            <span>Η ημέρα μου</span><span>{selected.length} χωριά ↑</span>
          </a>
        )}
      </div>
    </div>
  );
}
