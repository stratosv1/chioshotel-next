"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildCampaignEmail, emptyCampaignText, isCampaignReady, type Campaign, type CampaignText } from "@/lib/crm/campaign-templates";
import type { EmailLanguage } from "@/lib/crm/email-design";

// Email one offer to chosen groups (owner, 2026-11-28). Desktop: controls on the
// left, live email preview on the right. Sending happens slowly on the server.

type Counts = { total: number; sent: number; failed: number; waiting: number };
type Status = { byLanguage: Record<EmailLanguage, Counts>; sentToday: number; dailyLimit: number };
type View = { campaign: Campaign; status: Status; live: boolean; testEmail: string };

export const GROUPS: { key: EmailLanguage; flag: string; label: string; language: string }[] = [
  { key: "tr", flag: "🇹🇷", label: "Τούρκοι", language: "στα τουρκικά" },
  { key: "el", flag: "🇬🇷", label: "Έλληνες", language: "στα ελληνικά" },
  { key: "en", flag: "🌍", label: "Υπόλοιποι", language: "στα αγγλικά" },
];

const SAMPLE_NAME: Record<EmailLanguage, [string, string]> = { tr: ["Ayşe", "Yılmaz"], el: ["Μαρία", "Παπαδοπούλου"], en: ["Emma", "Smith"] };
const PER_HOUR = 140;

export const STATE_LABELS: Record<string, { label: string; className: string }> = {
  draft: { label: "Δεν έχει σταλεί", className: "bg-[#eef3f7] text-[#4b5b70]" },
  sending: { label: "Στέλνεται σιγά σιγά…", className: "bg-sky-100 text-sky-900" },
  paused: { label: "Σε παύση", className: "bg-amber-100 text-amber-900" },
  done: { label: "Ολοκληρώθηκε", className: "bg-emerald-100 text-emerald-900" },
  stopped: { label: "Σταμάτησε", className: "bg-red-100 text-red-900" },
};

const API = "/api/staff/offers/campaign/";
const inputClass = "w-full rounded-xl border border-[#cfd9e4] bg-white px-3 py-2.5 text-[15px] text-[#1f2a3c] outline-none focus:border-[#5443c9] focus:ring-2 focus:ring-[#e9e4fe]";
const labelClass = "mb-1 block text-xs font-black uppercase tracking-[0.08em] text-[#4b5b70]";

function hoursLabel(count: number) {
  if (count <= 0) return "";
  const days = Math.ceil(count / 300);
  if (days > 1) return `περίπου ${days} μέρες (έως 300 την ημέρα)`;
  const hours = count / PER_HOUR;
  return hours < 1 ? `περίπου ${Math.max(1, Math.round(hours * 60))} λεπτά` : `περίπου ${Math.round(hours * 10) / 10} ώρες`;
}

async function call(body?: Record<string, unknown>, key?: string): Promise<View & { to?: string }> {
  const response = await fetch(body ? API : `${API}?key=${encodeURIComponent(key ?? "")}`, body
    ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    : { cache: "no-store" });
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || "Κάτι πήγε στραβά.");
  return payload;
}

export default function OfferCampaignDrawer({ offerKey, title, onClose, onChanged }: {
  offerKey: string;
  title: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [view, setView] = useState<View | null>(null);
  const [content, setContent] = useState<Record<EmailLanguage, CampaignText> | null>(null);
  const [tab, setTab] = useState<EmailLanguage>("tr");
  const [groups, setGroups] = useState<EmailLanguage[]>(["tr"]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  const apply = useCallback((next: View, resetText: boolean) => {
    setView(next);
    if (resetText) {
      setContent({
        tr: { ...emptyCampaignText(), ...next.campaign.content.tr },
        el: { ...emptyCampaignText(), ...next.campaign.content.el },
        en: { ...emptyCampaignText(), ...next.campaign.content.en },
      });
      if (next.campaign.sendLanguages?.length) setGroups(next.campaign.sendLanguages);
    }
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
    call(undefined, offerKey).then((next) => apply(next, true)).catch((err) => setError(err.message));
  }, [offerKey, apply]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const state = view?.campaign.sendState ?? "draft";
  // While sending, refresh the counters every 15 seconds.
  useEffect(() => {
    if (state !== "sending") return;
    const timer = window.setInterval(() => {
      call(undefined, offerKey).then((next) => apply(next, false)).catch(() => undefined);
    }, 15_000);
    return () => window.clearInterval(timer);
  }, [state, offerKey, apply]);

  const run = async (body: Record<string, unknown>, message: string, resetText = false) => {
    setBusy(true);
    setError("");
    try {
      const next = await call({ key: offerKey, content, ...body });
      apply(next, resetText);
      setNotice(next.to ? `${message} ${next.to}` : message);
      window.setTimeout(() => setNotice(""), 4000);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Κάτι πήγε στραβά.");
    } finally {
      setBusy(false);
    }
  };

  const text = content?.[tab] ?? emptyCampaignText();
  const setText = (patch: Partial<CampaignText>) => content && setContent({ ...content, [tab]: { ...content[tab], ...patch } });

  const preview = useMemo(() => {
    if (!view || !content || !isCampaignReady(content[tab])) return "";
    const [firstName, lastName] = SAMPLE_NAME[tab];
    return buildCampaignEmail(content[tab], tab, {
      firstName, lastName, image: view.campaign.image, unsubscribeUrl: "#",
      offer: view.campaign.offer?.blocks?.[tab] ?? null,
    }).html;
  }, [view, content, tab]);

  const waitingFor = (key: EmailLanguage) => view?.status.byLanguage[key].waiting ?? 0;
  const toSend = groups.reduce((sum, key) => sum + waitingFor(key), 0);
  const sending = state === "sending";
  const started = state !== "draft";

  const start = () => {
    if (!content) return;
    const names = GROUPS.filter((group) => groups.includes(group.key)).map((group) => `${group.flag} ${group.label} (${waitingFor(group.key)})`).join(", ");
    if (!toSend) {
      setError("Όλοι στις ομάδες που διάλεξες έχουν ήδη πάρει αυτή την προσφορά.");
      return;
    }
    if (!window.confirm(`Θα σταλεί σε ${toSend} πελάτες: ${names}.\n\nΤα email φεύγουν σιγά σιγά (${hoursLabel(toSend)}) και η αποστολή συνεχίζει ακόμα κι αν κλείσεις τη σελίδα.\n\nΝα ξεκινήσει;`)) return;
    void run({ action: "start", languages: groups }, "Η αποστολή ξεκίνησε.");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0f172a]/40" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="ocd-title" className="flex h-full w-full max-w-[1180px] flex-col bg-[#f4f7fa] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#e3e9f0] bg-white px-6 py-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#5443c9]">Αποστολή με email</p>
            <h2 id="ocd-title" className="truncate text-xl font-black">{title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="rounded-full bg-[#eef3f7] px-4 py-2 text-sm font-black text-[#334155]" aria-label="Κλείσιμο">✕ Κλείσιμο</button>
        </header>

        {!view || !content ? (
          <p className="p-6 text-sm text-[#4b5b70]">{error || "Φόρτωση…"}</p>
        ) : (
          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,640px)]">
            <div className="min-h-0 overflow-y-auto p-6">
              {notice ? <div className="mb-4 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900" role="status">{notice}</div> : null}
              {error ? <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900" role="alert">{error}</div> : null}
              {!view.live && !started ? (
                <div className="mb-4 rounded-xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-900">Η προσφορά δεν είναι live στο site αυτή τη στιγμή, οπότε δεν μπορεί να σταλεί.</div>
              ) : null}

              {started ? (
                <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-black ${STATE_LABELS[state]?.className ?? ""}`}>{STATE_LABELS[state]?.label ?? state}</span>
                    {state === "sending" ? (
                      <button type="button" disabled={busy} onClick={() => run({ action: "pause", id: view.campaign.id }, "Η αποστολή μπήκε σε παύση.")} className="rounded-full bg-[#eef3f7] px-4 py-2 text-sm font-black text-[#334155] disabled:opacity-50">⏸ Παύση</button>
                    ) : state === "paused" ? (
                      <button type="button" disabled={busy} onClick={() => run({ action: "resume", id: view.campaign.id }, "Η αποστολή συνεχίζει.")} className="rounded-full bg-[#5443c9] px-4 py-2 text-sm font-black text-white disabled:opacity-50">▶ Συνέχεια</button>
                    ) : null}
                  </div>
                  {view.campaign.sendNote ? <p className="mt-3 text-sm font-bold text-[#7a4b00]">{view.campaign.sendNote}</p> : null}
                  <div className="mt-4 grid gap-3">
                    {GROUPS.filter((group) => view.campaign.sendLanguages?.includes(group.key) || view.status.byLanguage[group.key].sent).map((group) => {
                      const counts = view.status.byLanguage[group.key];
                      const done = counts.sent + counts.failed;
                      const percent = counts.total ? Math.round((done / counts.total) * 100) : 0;
                      return (
                        <div key={group.key}>
                          <div className="mb-1 flex justify-between text-sm font-bold">
                            <span>{group.flag} {group.label}</span>
                            <span className="text-[#4b5b70]">{counts.sent} από {counts.total}{counts.failed ? ` · ${counts.failed} απέτυχαν` : ""}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-[#e3e9f0]" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${group.label}: ${percent}%`}>
                            <div className="h-full rounded-full bg-[#5443c9]" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-[#5b6b80]">Σήμερα στάλθηκαν {view.status.sentToday} από τα {view.status.dailyLimit} email της ημέρας (μαζί με τις ευχές και τα newsletter).</p>
                </section>
              ) : null}

              <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-base font-black">1. Σε ποιους</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {GROUPS.map((group) => {
                    const counts = view.status.byLanguage[group.key];
                    const checked = groups.includes(group.key);
                    return (
                      <label key={group.key} className={`cursor-pointer rounded-2xl border-2 p-4 transition ${checked ? "border-[#5443c9] bg-[#f3f0ff]" : "border-[#e3e9f0] bg-white hover:border-[#c7bff7]"}`}>
                        <span className="flex items-center justify-between">
                          <span className="text-2xl" aria-hidden>{group.flag}</span>
                          <input type="checkbox" className="h-5 w-5 accent-[#5443c9]" checked={checked} onChange={() => setGroups(checked ? groups.filter((key) => key !== group.key) : [...groups, group.key])} />
                        </span>
                        <span className="mt-2 block text-lg font-black">{group.label}</span>
                        <span className="block text-sm text-[#4b5b70]">{counts.total} πελάτες · {group.language}</span>
                        {counts.sent ? <span className="mt-1 block text-xs font-bold text-emerald-800">Το έλαβαν ήδη {counts.sent}</span> : null}
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-black">2. Το μήνυμα</h3>
                  <div className="flex gap-2" role="tablist" aria-label="Κείμενο ανά ομάδα">
                    {GROUPS.map((group) => (
                      <button key={group.key} type="button" role="tab" aria-selected={tab === group.key} onClick={() => setTab(group.key)} className={`rounded-full px-3 py-1.5 text-xs font-black ${tab === group.key ? "bg-[#5443c9] text-white" : "bg-[#eef3f7] text-[#334155]"}`}>
                        {group.flag} {group.label}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mb-3 text-xs text-[#5b6b80]">Γράφτηκε αυτόματα από την προσφορά. Άλλαξε ό,τι θέλεις· το «Αγαπητέ/ή Όνομα», η κάρτα της προσφοράς και το link διαγραφής μπαίνουν μόνα τους.</p>
                <div className="grid gap-3">
                  <div>
                    <label htmlFor="ocd-subject" className={labelClass}>Θέμα email</label>
                    <input id="ocd-subject" className={inputClass} value={text.subject} onChange={(event) => setText({ subject: event.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="ocd-heading" className={labelClass}>Μεγάλος τίτλος</label>
                    <input id="ocd-heading" className={inputClass} value={text.heading} onChange={(event) => setText({ heading: event.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="ocd-body" className={labelClass}>Κείμενο</label>
                    <textarea id="ocd-body" rows={6} className={inputClass} value={text.body} onChange={(event) => setText({ body: event.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="ocd-button" className={labelClass}>Κείμενο κουμπιού</label>
                    <input id="ocd-button" className={inputClass} value={text.buttonLabel} onChange={(event) => setText({ buttonLabel: event.target.value })} />
                    <p className="mt-1 truncate text-xs text-[#5b6b80]">Ανοίγει: {text.buttonUrl}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={() => run({ action: "save" }, "Αποθηκεύτηκε.")} className="rounded-full border border-[#cfd9e4] bg-white px-4 py-2 text-sm font-black text-[#3b2f8a] disabled:opacity-50">Αποθήκευση κειμένου</button>
                  <button type="button" disabled={busy || !isCampaignReady(text)} onClick={() => run({ action: "send_test", language: tab }, "Το δοκιμαστικό στάλθηκε στο")} className="rounded-full border border-[#cfd9e4] bg-white px-4 py-2 text-sm font-black text-[#3b2f8a] disabled:opacity-50">
                    ✉️ Στείλε μου δοκιμαστικό{view.testEmail ? ` (${view.testEmail})` : ""}
                  </button>
                </div>
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="mb-2 text-base font-black">3. Αποστολή</h3>
                <p className="text-sm text-[#334155]">
                  {toSend
                    ? <>Θα σταλεί σε <strong>{toSend}</strong> πελάτες που δεν την έχουν πάρει ακόμα · {hoursLabel(toSend)}.</>
                    : groups.length ? "Όλοι στις ομάδες που διάλεξες την έχουν ήδη πάρει." : "Διάλεξε τουλάχιστον μία ομάδα."}
                </p>
                <p className="mt-1 text-xs text-[#5b6b80]">Ένα email περίπου κάθε 25 δευτερόλεπτα, έως 300 την ημέρα. Συνεχίζει και με κλειστή τη σελίδα. Όποιος έχει κάνει διαγραφή δεν το παίρνει, και κανείς δεν το παίρνει δύο φορές.</p>
                <button type="button" disabled={busy || sending || !view.live || !toSend || groups.some((key) => !isCampaignReady(content[key]))} onClick={start} className="mt-4 rounded-full bg-[#5443c9] px-6 py-3 text-sm font-black text-white shadow disabled:opacity-50">
                  {sending ? "Στέλνεται…" : state === "done" || state === "stopped" ? "Στείλε στους νέους πελάτες" : "🚀 Ξεκίνα την αποστολή"}
                </button>
                {groups.some((key) => !isCampaignReady(content[key])) ? <p className="mt-2 text-xs font-bold text-red-800">Λείπει θέμα ή κείμενο σε κάποια ομάδα που διάλεξες.</p> : null}
              </section>
            </div>

            <aside className="hidden min-h-0 flex-col border-l border-[#e3e9f0] bg-[#e9edf2] lg:flex" aria-label="Προεπισκόπηση email">
              <p className="px-5 pt-4 text-xs font-black uppercase tracking-[0.1em] text-[#4b5b70]">
                Προεπισκόπηση · {GROUPS.find((group) => group.key === tab)?.flag} {GROUPS.find((group) => group.key === tab)?.label}
              </p>
              <p className="truncate px-5 pb-3 text-sm font-bold text-[#1f2a3c]">{text.subject || "—"}</p>
              {preview ? (
                <iframe title="Προεπισκόπηση email" srcDoc={preview} sandbox="" className="mx-4 mb-4 min-h-0 flex-1 rounded-xl border border-[#d5dde6] bg-white" />
              ) : (
                <p className="px-5 text-sm text-[#4b5b70]">Γράψε θέμα και κείμενο για να δεις το email.</p>
              )}
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
