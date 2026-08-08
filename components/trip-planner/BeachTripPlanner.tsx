"use client";

import { useMemo, useState } from "react";
import type { BeachMaster } from "@/content/trip-planner/beaches";
import {
  beachRoutingById,
  routeClusterLabels,
  type RouteCluster,
} from "@/content/trip-planner/beach-routing";

const FILTERS = [
  { id: "all", labelEl: "Όλες", labelEn: "All" },
  { id: "family", labelEl: "Οικογένεια", labelEn: "Family" },
  { id: "organized", labelEl: "Οργανωμένη", labelEn: "Organized" },
  { id: "quiet", labelEl: "Ήσυχη", labelEn: "Quiet" },
  { id: "sand", labelEl: "Άμμος", labelEn: "Sand" },
  { id: "sunset", labelEl: "Ηλιοβασίλεμα", labelEn: "Sunset" },
  { id: "snorkeling", labelEl: "Snorkeling", labelEn: "Snorkeling" },
  { id: "nearby", labelEl: "Κοντά", labelEn: "Nearby" },
] as const;

const REGION_LABELS: Record<string, { el: string; en: string }> = {
  "near-city": { el: "Κοντά στην πόλη", en: "Near Chios Town" },
  south: { el: "Νότια Χίος", en: "South Chios" },
  west: { el: "Δυτική Χίος", en: "West Chios" },
  northwest: { el: "Βορειοδυτική Χίος", en: "Northwest Chios" },
  northeast: { el: "Βορειοανατολική Χίος", en: "Northeast Chios" },
};

type Props = {
  beaches: BeachMaster[];
  locale: string;
};

export function BeachTripPlanner({ beaches, locale }: Props) {
  const isEl = locale === "el";
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredBeaches = useMemo(() => {
    if (activeFilter === "all") return beaches;

    return beaches.filter((beach) => {
      const tags = new Set(beach.tags);
      if (activeFilter === "family") return Boolean(beach.familyFit && beach.familyFit !== "not-recommended");
      if (activeFilter === "organized") return tags.has("organized") || Boolean(beach.organization?.toLowerCase().includes("οργαν"));
      if (activeFilter === "quiet") return tags.has("quiet") || tags.has("remote");
      if (activeFilter === "sand") return tags.has("sand") || Boolean(beach.surface?.some((item) => item.toLowerCase().includes("άμ")));
      if (activeFilter === "sunset") return tags.has("sunset") || tags.has("sunset-pairing");
      if (activeFilter === "snorkeling") return tags.has("snorkeling");
      if (activeFilter === "nearby") return tags.has("nearby") || beach.region === "near-city";
      return true;
    });
  }, [activeFilter, beaches]);

  const selectedBeaches = useMemo(
    () => selectedIds.map((id) => beaches.find((beach) => beach.id === id)).filter(Boolean) as BeachMaster[],
    [beaches, selectedIds],
  );

  const selectedClusters = useMemo(() => {
    return Array.from(
      new Set(
        selectedBeaches
          .map((beach) => beachRoutingById[beach.id]?.routeCluster)
          .filter(Boolean) as RouteCluster[],
      ),
    );
  }, [selectedBeaches]);

  const toggleBeach = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const routeMessage = (() => {
    if (selectedBeaches.length === 0) {
      return isEl
        ? "Πρόσθεσε παραλίες για να δεις αν συνδυάζονται σωστά την ίδια μέρα."
        : "Add beaches to see whether they make sense in the same day.";
    }
    if (selectedClusters.length <= 1) {
      return isEl
        ? "Οι επιλογές σου είναι στην ίδια γεωγραφική ζώνη — καλός συνδυασμός για μία ημέρα."
        : "Your picks are in the same area — a good combination for one day.";
    }
    return isEl
      ? `Οι επιλογές σου απλώνονται σε ${selectedClusters.length} διαφορετικές ζώνες. Καλύτερα να τις χωρίσεις σε περισσότερες ημέρες.`
      : `Your picks span ${selectedClusters.length} different areas. It is better to split them across more than one day.`;
  })();

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#3d342c]">
      <section className="border-b border-[#e8dfd3] bg-gradient-to-b from-[#efe8dc] to-[#f7f4ee]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-7 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-[#d8c8b5] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a6654]">
              {isEl ? "Beach Trip Planner" : "Beach Trip Planner"}
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#352d27] sm:text-4xl lg:text-5xl">
              {isEl ? "Διάλεξε τις παραλίες σου στη Χίο" : "Choose your Chios beaches"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d6258] sm:text-base">
              {isEl
                ? "Φίλτραρε, πρόσθεσε τις παραλίες που σου ταιριάζουν και δες αν μπορούν να γίνουν μια λογική ημερήσια διαδρομή."
                : "Filter, add the beaches you like and see whether they form a sensible day route."}
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
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-[#6e5b49] bg-[#6e5b49] text-white shadow-sm"
                    : "border-[#ded3c6] bg-white text-[#5f5348] hover:border-[#bda995] hover:bg-[#fbf9f5]"
                }`}
              >
                {isEl ? filter.labelEl : filter.labelEn}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#4f443a]">
                  {filteredBeaches.length} {isEl ? "παραλίες" : "beaches"}
                </p>
                <p className="mt-1 text-xs text-[#887a6d]">
                  {isEl ? "Οι φωτογραφίες θα προστεθούν στο επόμενο στάδιο." : "Photos will be added in the next stage."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBeaches.map((beach) => {
                const routing = beachRoutingById[beach.id];
                const selected = selectedIds.includes(beach.id);
                const region = REGION_LABELS[beach.region];
                return (
                  <article
                    key={beach.id}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-[0_8px_30px_rgba(88,71,54,0.06)] transition ${
                      selected ? "border-[#8f775f] ring-2 ring-[#d9c7b2]" : "border-[#e5ddd3] hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(88,71,54,0.10)]"
                    }`}
                  >
                    <div className="flex h-28 items-end bg-gradient-to-br from-[#d8c5ad] via-[#b8c4bd] to-[#7fa1a2] p-4 sm:h-32">
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#5d5045] backdrop-blur">
                        {region ? (isEl ? region.el : region.en) : beach.region}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold leading-tight text-[#3d342c]">{beach.name}</h2>
                          {routing && (
                            <p className="mt-1 text-xs font-medium text-[#877769]">
                              {routing.distanceFromVoulamandisKm} km · ~{routing.driveTimeFromVoulamandisMin} min
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 min-h-16 space-y-1.5 text-sm leading-5 text-[#70645a]">
                        {beach.bestTime && <p><span className="font-semibold text-[#53483e]">{isEl ? "Ώρα:" : "Best time:"}</span> {beach.bestTime}</p>}
                        {beach.recommendedDuration && <p><span className="font-semibold text-[#53483e]">{isEl ? "Διάρκεια:" : "Duration:"}</span> {beach.recommendedDuration}</p>}
                      </div>

                      <div className="mt-3 flex min-h-12 flex-wrap content-start gap-1.5">
                        {beach.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="rounded-full bg-[#f2ede6] px-2.5 py-1 text-[11px] font-medium text-[#6b5d50]">
                            {tag.replaceAll("-", " ")}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBeach(beach.id)}
                        className={`mt-4 min-h-11 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] ${
                          selected
                            ? "bg-[#ede4d8] text-[#5d4c3e] hover:bg-[#e4d8ca]"
                            : "bg-[#6e5b49] text-white hover:bg-[#5f4e3f]"
                        }`}
                      >
                        {selected ? (isEl ? "✓ Προστέθηκε — αφαίρεση" : "✓ Added — remove") : (isEl ? "+ Προσθήκη στην ημέρα" : "+ Add to my day")}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside id="day-plan" className="scroll-mt-6 lg:block">
            <div className="rounded-2xl border border-[#dfd4c7] bg-white p-5 shadow-[0_12px_36px_rgba(88,71,54,0.08)] lg:sticky lg:top-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7969]">
                    {isEl ? "Η ημέρα μου" : "My day"}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-[#3c332b]">
                    {selectedBeaches.length} {isEl ? "επιλεγμένες" : "selected"}
                  </h2>
                </div>
                {selectedBeaches.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-[#8a6e59] hover:bg-[#f6f1eb]"
                  >
                    {isEl ? "Καθαρισμός" : "Clear"}
                  </button>
                )}
              </div>

              <div className={`mt-4 rounded-xl border p-3 text-sm leading-5 ${selectedClusters.length <= 1 ? "border-[#d7dfd4] bg-[#f2f7f0] text-[#52654e]" : "border-[#ead7bd] bg-[#fff7e8] text-[#7b623f]"}`}>
                {routeMessage}
              </div>

              {selectedClusters.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedClusters.map((cluster) => (
                    <div key={cluster} className="rounded-xl bg-[#f8f5f1] px-3 py-2.5 text-xs font-medium text-[#6a5d52]">
                      {routeClusterLabels[cluster]}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-2">
                {selectedBeaches.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#ddd2c5] p-5 text-center text-sm text-[#948679]">
                    {isEl ? "Οι παραλίες που προσθέτεις θα εμφανίζονται εδώ." : "Beaches you add will appear here."}
                  </div>
                ) : (
                  selectedBeaches.map((beach, index) => {
                    const routing = beachRoutingById[beach.id];
                    return (
                      <div key={beach.id} className="flex items-center gap-3 rounded-xl border border-[#eee6dd] p-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ede4d8] text-xs font-bold text-[#6a594b]">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#493e35]">{beach.name}</p>
                          {routing && <p className="text-xs text-[#8c7d70]">~{routing.driveTimeFromVoulamandisMin} min {isEl ? "από τη βάση" : "from base"}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleBeach(beach.id)}
                          aria-label={isEl ? `Αφαίρεση ${beach.name}` : `Remove ${beach.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#8b796a] hover:bg-[#f4efe9]"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {selectedBeaches.length > 0 && (
                <div className="mt-5 rounded-xl bg-[#514437] p-4 text-white">
                  <p className="text-sm font-semibold">{isEl ? "Επόμενο στάδιο" : "Next stage"}</p>
                  <p className="mt-1 text-xs leading-5 text-white/75">
                    {isEl
                      ? "Στο επόμενο βήμα ο planner θα οργανώνει αυτόματα σειρά στάσεων και ημέρες."
                      : "Next, the planner will automatically arrange stop order and days."}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ddd2c5] bg-white/95 p-3 backdrop-blur lg:hidden">
        <a
          href="#day-plan"
          className="mx-auto flex min-h-12 max-w-lg items-center justify-between rounded-xl bg-[#514437] px-4 py-3 text-white shadow-lg"
        >
          <span className="text-sm font-semibold">{isEl ? "Η ημέρα μου" : "My day"}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{selectedBeaches.length}</span>
        </a>
      </div>
    </main>
  );
}
