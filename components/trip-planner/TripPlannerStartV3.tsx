"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import TripPlannerStartV2 from "@/components/trip-planner/TripPlannerStartV2";
import { beaches } from "@/content/trip-planner";
import type { BeachMaster } from "@/content/trip-planner/beaches-source";

const SHARP_BEACH_IMAGES: Record<string, string> = {
  "Μερσινίδι": "https://www.chios.gr/images/beaches-pages/mersinidi/mersinidi-1.jpg",
  "Γιόσωνας": "https://www.chios.gr/images/beaches-pages/giosonas/giosonas-1.jpg",
  "Όρμος Λω": "https://www.chios.gr/images/beaches-pages/ormos-lo/ormos-lo.jpg",
  "Απόθικα": "https://www.chios.gr/images/beaches-pages/apothika/apothika-1.jpg",
};

const beachByName = new Map(beaches.map((beach) => [beach.name, beach]));
const SUMMARY_CATEGORIES = new Set(["Παραλία", "Χωριό", "Αξιοθέατα", "Φαγητό", "Ποτό"]);

type LeadGroup = { category: string; names: string[] };

function familyLabel(beach: BeachMaster) {
  if (beach.familyNote) return beach.familyNote;
  if (beach.familyFit === "excellent") return "Πολύ καλή επιλογή για οικογένειες.";
  if (beach.familyFit === "yes") return "Καλή επιλογή για οικογένειες.";
  if (beach.familyFit === "yes-with-caution") return "Κατάλληλη για οικογένειες, με λίγη περισσότερη προσοχή.";
  if (beach.familyFit === "older-children") return "Ταιριάζει περισσότερο σε οικογένειες με μεγαλύτερα παιδιά.";
  if (beach.familyFit === "not-recommended") return "Δεν είναι από τις πιο εύκολες επιλογές για μικρά παιδιά.";
  return null;
}

function buildBeachDetails(beach: BeachMaster) {
  const rows: Array<{ label: string; value: string }> = [];

  if (beach.surface?.length) rows.push({ label: "Ακτή", value: beach.surface.join(", ") });
  if (beach.depth) rows.push({ label: "Νερά", value: beach.depth });
  if (beach.organization) rows.push({ label: "Οργάνωση", value: beach.organization });
  if (beach.amenities?.length) rows.push({ label: "Παροχές", value: beach.amenities.join(", ") });
  if (beach.access?.length) rows.push({ label: "Πρόσβαση", value: beach.access.join(" · ") });
  if (beach.shade) rows.push({ label: "Σκιά", value: beach.shade });
  if (beach.bestTime) rows.push({ label: "Καλύτερη ώρα", value: beach.bestTime });
  if (beach.recommendedDuration) rows.push({ label: "Χρόνος", value: beach.recommendedDuration });

  const family = familyLabel(beach);
  if (family) rows.push({ label: "Οικογένειες", value: family });
  if (beach.tip) rows.push({ label: "Tip", value: beach.tip });

  return rows;
}

function findBeachCard(button: HTMLButtonElement) {
  const heading = Array.from(button.querySelectorAll("div")).find((node) => {
    const text = node.textContent?.trim();
    return text ? beachByName.has(text) : false;
  });

  if (!heading) return null;
  const name = heading.textContent?.trim();
  if (!name) return null;

  const beach = beachByName.get(name);
  if (!beach) return null;

  return { beach, heading };
}

function improveWeatherDisclosure(button: HTMLButtonElement) {
  const summaries = Array.from(button.querySelectorAll("summary"));
  const weatherSummary = summaries.find((summary) => summary.textContent?.trim() === "Γιατί αυτή η πρόταση;");
  if (!(weatherSummary instanceof HTMLElement)) return;

  const details = weatherSummary.parentElement;
  if (!(details instanceof HTMLDetailsElement)) return;

  details.dataset.tripPlannerWeatherDetails = "true";
  weatherSummary.dataset.tripPlannerDisclosureSummary = "true";
}

function simplifyWeatherMessage(button: HTMLButtonElement) {
  const weatherBox = button.querySelector('[data-trip-planner-weather-details="true"]')?.parentElement;
  if (!weatherBox) return;
  const paragraphs = Array.from(weatherBox.querySelectorAll("p"));
  paragraphs.forEach((paragraph) => {
    const text = paragraph.textContent?.trim() ?? "";
    if (text.includes("Σχετικά προστατευμένη ακτή")) {
      paragraph.textContent = "✓ Προστατευμένη από τη σημερινή διεύθυνση κύματος.";
    } else if (text.includes("Πιο εκτεθειμένη ακτή")) {
      paragraph.textContent = "△ Εκτεθειμένη στη σημερινή διεύθυνση κύματος.";
    }
  });
}

function addBeachDetails(button: HTMLButtonElement, beach: BeachMaster) {
  if (button.dataset.beachDetailsReady === "true") return;

  const content = Array.from(button.children).find((node) =>
    node instanceof HTMLDivElement && node.className.includes("p-3.5"),
  );
  if (!(content instanceof HTMLDivElement)) return;

  const rows = buildBeachDetails(beach);
  if (!rows.length) return;

  const details = document.createElement("details");
  details.className = "trip-planner-beach-details";
  details.dataset.tripPlannerBeachDetails = "true";

  const summary = document.createElement("summary");
  summary.dataset.tripPlannerDisclosureSummary = "true";
  summary.textContent = "Λεπτομέρειες παραλίας";
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "trip-planner-beach-details-body";

  rows.forEach(({ label, value }) => {
    const row = document.createElement("p");
    row.className = "trip-planner-beach-detail-row";
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    row.appendChild(strong);
    row.appendChild(document.createTextNode(value));
    body.appendChild(row);
  });

  details.appendChild(body);
  details.addEventListener("click", (event) => event.stopPropagation());
  details.addEventListener("keydown", (event) => event.stopPropagation());
  content.appendChild(details);
  button.dataset.beachDetailsReady = "true";
}

function replaceBlurryImage(button: HTMLButtonElement, beachName: string) {
  const sharpImage = SHARP_BEACH_IMAGES[beachName];
  if (!sharpImage || button.dataset.sharpBeachImage === sharpImage) return;

  const imageArea = button.firstElementChild;
  if (!(imageArea instanceof HTMLDivElement)) return;

  imageArea.querySelectorAll("img").forEach((image) => {
    image.src = sharpImage;
    image.removeAttribute("srcset");
  });

  button.dataset.sharpBeachImage = sharpImage;
}

function enhancePlaceCards() {
  document.querySelectorAll<HTMLButtonElement>('div[class*="snap-x"] > button[aria-pressed]').forEach((button) => {
    button.dataset.tripPlannerPlaceCard = "true";
    const imageArea = button.firstElementChild;
    if (imageArea instanceof HTMLDivElement) {
      imageArea.dataset.tripPlannerPlaceImage = "true";
      const images = imageArea.querySelectorAll<HTMLImageElement>("img");
      const foreground = images.item(images.length - 1);
      if (foreground) {
        foreground.style.objectFit = "contain";
        foreground.style.objectPosition = "center center";
      }
    }

    const match = findBeachCard(button);
    if (!match) return;

    button.dataset.tripPlannerBeachCard = "true";
    improveWeatherDisclosure(button);
    simplifyWeatherMessage(button);
    addBeachDetails(button, match.beach);
    replaceBlurryImage(button, match.beach.name);
  });
}

function findRegionSection() {
  const heading = Array.from(document.querySelectorAll("h2")).find((node) => node.textContent?.includes("Προς τα πού θέλεις να κινηθείς"));
  const section = heading?.closest("section");
  if (section instanceof HTMLElement) {
    section.dataset.tripPlannerRegionStep = "true";
    return section;
  }
  return null;
}

function findPlacesSection() {
  const heading = Array.from(document.querySelectorAll("h2")).find((node) => node.textContent?.trim().startsWith("Διάλεξε"));
  const section = heading?.closest("section");
  if (!(section instanceof HTMLElement)) return null;
  section.dataset.tripPlannerPlacesStep = "true";
  const carousel = section.querySelector('div[class*="snap-x"]');
  if (carousel instanceof HTMLElement) carousel.dataset.tripPlannerPlacesGrid = "true";
  const sticky = Array.from(section.querySelectorAll("div")).find((node) => node.className.includes("sticky") && node.querySelector("button"));
  const cta = sticky?.querySelector("button");
  if (cta instanceof HTMLButtonElement) cta.dataset.tripPlannerPlacesCta = "true";
  return section;
}

function findSummarySection() {
  const heading = Array.from(document.querySelectorAll("h2")).find((node) => node.textContent?.includes("Ωραία, έχουμε τις επιλογές"));
  const section = heading?.closest("section");
  if (section instanceof HTMLElement) {
    section.dataset.tripPlannerSummary = "true";
    return section;
  }
  return null;
}

function readSummaryGroups(section: HTMLElement): LeadGroup[] {
  return Array.from(section.querySelectorAll("p"))
    .map((labelNode) => {
      const category = labelNode.textContent?.trim() ?? "";
      if (!SUMMARY_CATEGORIES.has(category)) return null;
      const card = labelNode.parentElement;
      if (!card) return null;
      const names = Array.from(card.querySelectorAll("span"))
        .map((span) => span.textContent?.trim() ?? "")
        .filter(Boolean);
      return names.length ? { category, names } : null;
    })
    .filter((item): item is LeadGroup => Boolean(item));
}

function LeadFunnel({ groups }: { groups: LeadGroup[] }) {
  const [email, setEmail] = useState("");
  const [accommodationConsent, setAccommodationConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const stopCount = groups.reduce((sum, group) => sum + group.names.length, 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/trip-planner/send-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, groups, accommodationConsent }),
      });
      const payload = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Δεν μπορέσαμε να στείλουμε το πρόγραμμα.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Δεν μπορέσαμε να στείλουμε το πρόγραμμα.");
    }
  }

  return (
    <div className="trip-planner-lead-funnel w-full text-left">
      <div className="text-center">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.17em] text-[#a47a51]">Το πλάνο σου</p>
        <h2 className="mx-auto mt-2 max-w-[680px] font-serif text-[36px] font-bold leading-[1.04] tracking-[-0.03em] text-[#2f261f] md:text-[52px]">Πάρε το προσωπικό σου Chios Trip Plan</h2>
        <p className="mx-auto mt-3 max-w-[650px] text-[16px] font-bold leading-7 text-[#655a52] md:text-[17px]">Στείλε το πλήρες πρόγραμμα στο email σου, με προτεινόμενη σειρά στάσεων, ώρες, πρακτικά tips και αναλυτικές πληροφορίες για κάθε μέρος που επέλεξες.</p>
      </div>

      <div className="mt-5 rounded-[22px] border border-[#e1d7ca] bg-[#fbf9f5] p-4 shadow-sm md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[14px] font-extrabold text-[#75685e]">Οι επιλογές σου</div>
            <div className="mt-1 text-[20px] font-extrabold text-[#342b25]">{stopCount} {stopCount === 1 ? "στάση" : "στάσεις"}</div>
          </div>
          <span className="rounded-full bg-[#e8ecdf] px-3 py-1.5 text-[13px] font-extrabold text-[#5d6848]">Προσωπικό</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.category} className="rounded-2xl bg-white p-3.5 shadow-[inset_0_0_0_1px_rgba(226,218,208,.9)]">
              <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#9b7957]">{group.category}</div>
              <div className="mt-2 flex flex-wrap gap-2">{group.names.map((name) => <span key={name} className="rounded-full bg-[#f3efe8] px-3 py-1.5 text-[14px] font-extrabold text-[#4f443b]">{name}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      {status !== "sent" ? (
        <form onSubmit={submit} className="mt-5">
          <label htmlFor="trip-planner-email" className="block text-[16px] font-extrabold text-[#433831]">Πού να σου στείλουμε το πλήρες πρόγραμμα;</label>
          <input id="trip-planner-email" value={email} onChange={(event) => setEmail(event.target.value)} required type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" className="mt-2 h-[60px] w-full rounded-2xl border border-[#cfc3b5] bg-white px-4 text-[18px] font-bold text-[#332a24] outline-none transition placeholder:font-medium placeholder:text-[#a9a096] focus:border-[#87906c] focus:ring-4 focus:ring-[#87906c]/12" />

          <label className="mt-4 flex cursor-pointer gap-3 rounded-2xl border border-[#dfc7aa] bg-[#f8ecdc] p-4 shadow-sm">
            <input checked={accommodationConsent} onChange={(event) => setAccommodationConsent(event.target.checked)} type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#7b674f]" />
            <span>
              <span className="block text-[15px] font-extrabold text-[#4a3e35]">Θέλω και προσωπική πρόταση διαμονής</span>
              <span className="mt-1 block text-[13px] font-bold leading-5 text-[#75685e]">Η reception μπορεί να μου στείλει διαθεσιμότητα και επιλογές που ταιριάζουν στο ταξίδι μου.</span>
            </span>
          </label>

          {status === "error" ? <p className="mt-3 rounded-xl bg-[#faeae6] px-3 py-2 text-[13px] font-bold text-[#7f493f]">{error}</p> : null}
          <button disabled={status === "sending"} type="submit" className="mt-5 flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-[#737d58] px-5 text-[17px] font-extrabold text-white shadow-[0_12px_28px_rgba(91,101,65,.24)] transition hover:bg-[#65704c] disabled:opacity-65">
            {status === "sending" ? "Στέλνουμε το πρόγραμμά σου…" : "Στείλε το πλήρες πρόγραμμά μου →"}
          </button>
          <p className="mt-3 text-center text-[12px] font-bold leading-5 text-[#81756b]">Το email χρησιμοποιείται για την αποστολή του itinerary. Επικοινωνία για διαμονή μόνο αν το επιλέξεις.</p>
        </form>
      ) : (
        <div className="mt-5">
          <div className="rounded-[20px] border border-[#c4d1ae] bg-[#eef3e7] p-4 text-center text-[#4e5c3e] shadow-[0_8px_20px_rgba(82,96,61,.08)]">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#72805a] text-[23px] font-black text-white shadow-sm">✓</div>
            <p className="mt-3 text-[16px] font-extrabold leading-6">Το πρόγραμμα στάλθηκε στο {email}</p>
            <p className="mt-1 text-[13px] font-bold leading-5 text-[#667255]">Έλεγξε και τον φάκελο ανεπιθύμητης αλληλογραφίας αν δεν το δεις σε λίγα λεπτά.</p>
          </div>

          <div className="mt-4 overflow-hidden rounded-[24px] border border-[#ddd3c6] bg-[#fffdfa] shadow-[0_12px_30px_rgba(65,48,36,.08)]">
            <div className="relative h-[170px] overflow-hidden bg-[#dfd5ca]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/rooms/DSC07867-1-v2.webp" alt="Voulamandis House στον Κάμπο της Χίου" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#302219]/82 via-[#302219]/8 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/85">Voulamandis House · Κάμπος Χίου</div>
                <div className="mt-1 font-serif text-[28px] font-bold leading-tight">Δεν έχεις κλείσει ακόμη διαμονή στη Χίο;</div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-[15px] font-bold leading-6 text-[#665b52]">Δες άμεσα ποιο δωμάτιο ταιριάζει στο ταξίδι σου ή μίλησε απευθείας μαζί μας στο WhatsApp.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a href="/ai-assistant/?lang=el" className="flex min-h-[58px] items-center justify-center rounded-2xl bg-[#687451] px-4 text-center text-[15px] font-extrabold text-white shadow-[0_8px_18px_rgba(88,101,65,.2)] transition hover:bg-[#596544]">Δες διαθεσιμότητα · AI Room Finder</a>
                <a href="https://wa.me/306944474226" target="_blank" rel="noreferrer" className="flex min-h-[58px] items-center justify-center rounded-2xl border-2 border-[#7fa184] bg-[#f7fbf5] px-4 text-center text-[15px] font-extrabold text-[#47634d] transition hover:bg-[#edf6ea]">WhatsApp με τη reception</a>
              </div>
              <p className="mt-4 text-center text-[13px] font-extrabold leading-5 text-[#776a60]">Έχεις ήδη κλείσει; Τέλεια — το προσωπικό σου πρόγραμμα είναι στο email σου.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TripPlannerStartV3() {
  const [summaryTarget, setSummaryTarget] = useState<HTMLElement | null>(null);
  const [summaryGroups, setSummaryGroups] = useState<LeadGroup[]>([]);

  useEffect(() => {
    const scan = () => {
      enhancePlaceCards();
      findRegionSection();
      findPlacesSection();
      const summary = findSummarySection();
      setSummaryTarget((current) => current === summary ? current : summary);
      if (summary) {
        const groups = readSummaryGroups(summary);
        const next = JSON.stringify(groups);
        setSummaryGroups((current) => JSON.stringify(current) === next ? current : groups);
      }
    };

    let frame = window.requestAnimationFrame(scan);
    const observer = new MutationObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(scan);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <TripPlannerStartV2 />
      {summaryTarget ? createPortal(<LeadFunnel groups={summaryGroups} />, summaryTarget) : null}
      <style jsx global>{`
        [data-trip-planner-summary="true"] {
          min-height: auto !important;
          justify-content: flex-start !important;
          padding-top: 26px !important;
          padding-bottom: 54px !important;
        }
        [data-trip-planner-summary="true"] > *:not(.trip-planner-lead-funnel) { display: none !important; }

        [data-trip-planner-beach-card="true"] [data-trip-planner-disclosure-summary="true"] {
          list-style: none;
          position: relative;
          display: flex;
          min-height: 42px;
          align-items: center;
          padding: 8px 34px 8px 0;
          color: #4f443a;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.35;
          cursor: pointer;
        }
        [data-trip-planner-beach-card="true"] [data-trip-planner-disclosure-summary="true"]::-webkit-details-marker { display: none; }
        [data-trip-planner-beach-card="true"] [data-trip-planner-disclosure-summary="true"]::after {
          content: "+";
          position: absolute;
          right: 2px;
          top: 50%;
          width: 28px;
          height: 28px;
          transform: translateY(-50%);
          border: 1px solid #ddd4c8;
          border-radius: 999px;
          background: #fffdf9;
          color: #8d765f;
          font-size: 19px;
          font-weight: 700;
          line-height: 25px;
          text-align: center;
        }
        [data-trip-planner-beach-card="true"] details[open] > [data-trip-planner-disclosure-summary="true"]::after { content: "−"; }
        [data-trip-planner-weather-details="true"] { margin-top: 7px !important; padding-top: 5px !important; border-top-color: #e3dbd0 !important; color: #5b5149 !important; font-size: 14px !important; font-weight: 700 !important; line-height: 1.5 !important; }
        [data-trip-planner-weather-details="true"] > div { margin-top: 7px !important; gap: 6px 14px !important; line-height: 1.45 !important; }
        [data-trip-planner-weather-details="true"] > p { margin-top: 8px !important; color: #71675e !important; font-size: 13px !important; font-weight: 700 !important; line-height: 1.45 !important; }
        .trip-planner-beach-details { margin-top: 7px; padding-top: 5px; border-top: 1px solid #e3dbd0; color: #595048; }
        .trip-planner-beach-details-body { display: grid; gap: 8px; padding: 4px 0 5px; font-size: 14px; font-weight: 700; line-height: 1.5; }
        .trip-planner-beach-detail-row { margin: 0; }
        .trip-planner-beach-detail-row strong { color: #403831; font-weight: 800; }

        [data-trip-planner-places-step="true"] > .text-center > p { font-weight: 700 !important; }
        [data-trip-planner-places-cta="true"] {
          background: #737d58 !important;
          color: #fff !important;
          font-size: 16px !important;
          font-weight: 800 !important;
          box-shadow: 0 10px 24px rgba(82,90,59,.22) !important;
        }
        [data-trip-planner-places-cta="true"]:hover:not(:disabled) { background: #65704c !important; }
        [data-trip-planner-places-cta="true"]:disabled {
          background: #c3c8b5 !important;
          color: rgba(255,255,255,.94) !important;
          opacity: 1 !important;
          box-shadow: none !important;
        }

        @media (min-width: 768px) {
          [data-trip-planner-places-step="true"] {
            width: min(1240px, calc(100% - 56px)) !important;
          }
          [data-trip-planner-places-step="true"] > .text-center > h2 { font-size: 50px !important; }
          [data-trip-planner-places-step="true"] > .text-center > h2 + p {
            max-width: 760px !important;
            font-size: 15px !important;
            font-weight: 700 !important;
            line-height: 1.6 !important;
            color: #6b6058 !important;
          }
          [data-trip-planner-places-step="true"] > .text-center > p:last-child {
            max-width: 760px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            line-height: 1.55 !important;
            color: #89786a !important;
          }
          [data-trip-planner-places-grid="true"] {
            gap: 18px !important;
            align-items: stretch !important;
          }
          [data-trip-planner-place-card="true"] {
            display: flex !important;
            height: 100% !important;
            min-height: 500px !important;
            flex-direction: column !important;
            border-radius: 22px !important;
          }
          [data-trip-planner-place-card="true"] > [data-trip-planner-place-image="true"] {
            height: 200px !important;
            flex: 0 0 200px !important;
          }
          [data-trip-planner-place-card="true"] > div:nth-child(2) {
            display: flex !important;
            flex: 1 1 auto !important;
            flex-direction: column !important;
            padding: 18px 18px 15px !important;
          }
          [data-trip-planner-place-card="true"] > div:nth-child(2) > div:first-child {
            font-size: 27px !important;
            font-weight: 800 !important;
            line-height: 1.12 !important;
          }
          [data-trip-planner-place-card="true"] > div:nth-child(2) > div:nth-child(2) {
            margin-top: 5px !important;
            font-size: 15px !important;
            font-weight: 700 !important;
            line-height: 1.4 !important;
            color: #665c54 !important;
          }
          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) {
            margin-top: 14px !important;
            padding: 14px !important;
          }
          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > div:first-child span {
            font-size: 13px !important;
            font-weight: 800 !important;
          }
          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) {
            font-size: 14px !important;
            font-weight: 800 !important;
          }
          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > p {
            font-size: 13px !important;
            font-weight: 800 !important;
            line-height: 1.45 !important;
          }
          [data-trip-planner-beach-card="true"] .trip-planner-beach-details {
            margin-top: auto !important;
          }
          [data-trip-planner-places-cta="true"] { min-height: 58px !important; }
        }

        @media (max-width: 767px) {
          [data-trip-planner-region-step="true"] > button:first-child { font-size: 14px !important; font-weight: 700 !important; }
          [data-trip-planner-region-step="true"] > p:first-of-type { font-size: 12px !important; font-weight: 800 !important; }
          [data-trip-planner-region-step="true"] > h2 + p { max-width: 590px !important; font-size: 15px !important; font-weight: 700 !important; line-height: 1.55 !important; }
          [data-trip-planner-region-step="true"] [aria-live="polite"] { padding: 15px !important; }
          [data-trip-planner-region-step="true"] [aria-live="polite"] p { font-size: 14px !important; font-weight: 700 !important; line-height: 1.55 !important; }
          [data-trip-planner-region-step="true"] [aria-live="polite"] p:first-child { font-size: 12px !important; font-weight: 800 !important; }
          [data-trip-planner-region-step="true"] [aria-live="polite"] p:nth-child(2) { font-size: 16px !important; font-weight: 800 !important; }
          [data-trip-planner-region-step="true"] button span:first-child { font-size: 19px !important; font-weight: 800 !important; }
          [data-trip-planner-region-step="true"] button span:nth-child(2) { font-size: 12px !important; font-weight: 700 !important; line-height: 1.25 !important; }
          [data-trip-planner-region-step="true"] > button:last-child { width: 245px !important; min-height: 52px !important; font-size: 16px !important; font-weight: 800 !important; }

          [data-trip-planner-places-step="true"] > .text-center > h2 + p { font-size: 14px !important; font-weight: 700 !important; line-height: 1.5 !important; }
          [data-trip-planner-places-step="true"] > .text-center > p:last-child { font-size: 12px !important; font-weight: 700 !important; line-height: 1.45 !important; }
          [data-trip-planner-place-card="true"] { width: 82vw !important; max-width: 340px !important; }
          [data-trip-planner-place-card="true"] > [data-trip-planner-place-image="true"] { height: 148px !important; }
          [data-trip-planner-place-card="true"] > [data-trip-planner-place-image="true"] img:last-of-type { object-fit: contain !important; object-position: center center !important; }
          [data-trip-planner-place-card="true"] > div:nth-child(2) { padding: 12px 14px 10px !important; }
          [data-trip-planner-place-card="true"] > div:nth-child(2) > div:first-child { font-size: 24px !important; font-weight: 800 !important; line-height: 1.12 !important; }
          [data-trip-planner-place-card="true"] > div:nth-child(2) > div:nth-child(2) { margin-top: 4px !important; color: #665c54 !important; font-size: 14px !important; font-weight: 700 !important; line-height: 1.35 !important; }
          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) { margin-top: 9px !important; padding: 11px 12px 9px !important; border-radius: 14px !important; }
          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > div:first-child span { font-size: 13px !important; font-weight: 800 !important; }
          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) { margin-top: 8px !important; column-gap: 14px !important; row-gap: 6px !important; color: #514840 !important; font-size: 14px !important; font-weight: 800 !important; }
          [data-trip-planner-beach-card="true"] > div:nth-child(2) > div:nth-child(3) > p { margin-top: 7px !important; color: #506947 !important; font-size: 13px !important; font-weight: 800 !important; line-height: 1.4 !important; }
          [data-trip-planner-places-cta="true"] { min-height: 56px !important; }
        }
      `}</style>
    </>
  );
}
