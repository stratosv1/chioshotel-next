"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildCampaignEmail,
  emptyCampaignText,
  isCampaignReady,
  type Campaign,
  type CampaignContent,
  type CampaignText,
} from "@/lib/crm/campaign-templates";
import type { EmailLanguage } from "@/lib/crm/email-design";
import { useBulkSend, type BulkBatchResult } from "./useBulkSend";

type Source = "guest" | "website" | "staff";
type Contact = { email: string; name: string; language: EmailLanguage; country: string | null; sources: Source[]; stays: number; unsubscribed: boolean };
type Counts = { total: number; sent: number; failed: number; waiting: number };
type Status = { byLanguage: Record<EmailLanguage, Counts>; sentToday: number; dailyLimit: number };
type CampaignRow = Campaign & { sent: number };
type Draft = { id: number | null; title: string; image: string; content: Record<EmailLanguage, CampaignText> };

const API = "/api/staff/crm/newsletter/";
const LANGUAGES: { key: EmailLanguage; label: string }[] = [
  { key: "el", label: "Ελληνικά" },
  { key: "en", label: "Αγγλικά" },
  { key: "tr", label: "Τουρκικά" },
];
const SOURCE_LABELS: Record<Source, string> = { guest: "Πελάτης", website: "Από το site", staff: "Πρόσθεσες εσύ" };
const panelClass = "rounded-2xl bg-white p-4 shadow-sm";
const inputClass = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const secondaryButton = "rounded-full border border-amber-800/30 bg-white px-4 py-2 text-sm font-black text-amber-900 disabled:opacity-50";
const primaryButton = "rounded-full bg-amber-800 px-4 py-2 text-sm font-black text-white disabled:opacity-50";
const chipClass = (active: boolean) => `min-h-10 rounded-full px-4 text-sm font-black disabled:opacity-50 ${active ? "bg-stone-900 text-white" : "border border-stone-300 bg-white text-stone-700"}`;

async function request(url: string, body?: Record<string, unknown>) {
  const response = await fetch(url, body ? {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  } : { cache: "no-store" });
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || "Κάτι πήγε στραβά.");
  return payload;
}

const message = (reason: unknown) => (reason instanceof Error ? reason.message : "Κάτι πήγε στραβά.");

function csv(contacts: Contact[]) {
  const cell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
  const lines = contacts.map((contact) => [contact.email, contact.name, contact.language, contact.country ?? "", contact.sources.join(" ")].map(cell).join(","));
  return `email,name,language,country,source\n${lines.join("\n")}\n`;
}

// ---- Contact list -----------------------------------------------------------

function ContactsView({ onNotice, onError }: { onNotice: (text: string) => void; onError: (text: string) => void }) {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [pendingOta, setPendingOta] = useState(0);
  const [outreachEnabled, setOutreachEnabled] = useState(false);
  const [language, setLanguage] = useState<EmailLanguage | "all">("all");
  const [search, setSearch] = useState("");
  const [showUnsubscribed, setShowUnsubscribed] = useState(false);
  const [addText, setAddText] = useState("");
  const [addLanguage, setAddLanguage] = useState<EmailLanguage>("el");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const payload = await request(`${API}?view=contacts`);
    setContacts(payload.contacts);
    setPendingOta(payload.pendingOta);
    setOutreachEnabled(payload.outreachEnabled);
  }, []);

  useEffect(() => {
    load().catch((reason) => onError(message(reason)));
  }, [load, onError]);

  const active = useMemo(() => (contacts ?? []).filter((contact) => !contact.unsubscribed), [contacts]);
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (contacts ?? []).filter((contact) =>
      contact.unsubscribed === showUnsubscribed
      && (language === "all" || contact.language === language)
      && (!query || contact.email.includes(query) || contact.name.toLowerCase().includes(query)));
  }, [contacts, search, language, showUnsubscribed]);

  const act = async (body: Record<string, unknown>, done: string) => {
    setBusy(true);
    try {
      const payload = await request(API, body);
      await load();
      onNotice(payload.result ? done.replace("{n}", String(payload.result.added)) : done);
      return payload;
    } catch (reason) {
      onError(message(reason));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const add = async () => {
    const payload = await act({ action: "add_contacts", text: addText, language: addLanguage }, "Προστέθηκαν {n}.");
    if (!payload) return;
    const { added, existing, rejectedOta, invalid } = payload.result as { added: number; existing: number; rejectedOta: string[]; invalid: string[] };
    const parts = [`Προστέθηκαν ${added}`];
    if (existing) parts.push(`${existing} υπήρχαν ήδη`);
    if (rejectedOta.length) parts.push(`${rejectedOta.length} απορρίφθηκαν γιατί είναι Booking/Expedia`);
    if (invalid.length) parts.push(`${invalid.length} δεν είναι σωστά email (${invalid.slice(0, 3).join(", ")}${invalid.length > 3 ? "…" : ""})`);
    onNotice(`${parts.join(" · ")}.`);
    setAddText("");
  };

  const download = () => {
    const blob = new Blob([csv(visible)], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-${language}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!contacts) return <p className="text-sm text-stone-600">Φόρτωση…</p>;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {LANGUAGES.map(({ key, label }) => (
          <div key={key} className={panelClass}>
            <p className="text-sm font-bold text-stone-500">{label}</p>
            <p className="mt-1 text-3xl font-black">{active.filter((contact) => contact.language === key).length}</p>
          </div>
        ))}
        <div className={panelClass}>
          <p className="text-sm font-bold text-stone-500">Έχουν κάνει διαγραφή</p>
          <p className="mt-1 text-3xl font-black">{contacts.length - active.length}</p>
        </div>
      </div>

      <section className={`rounded-2xl p-4 shadow-sm ${pendingOta ? "bg-amber-100" : "bg-white"}`}>
        <h2 className="text-lg font-black">Προσωπικό email από Booking / Expedia</h2>
        <p className="mt-1 text-sm">
          Τα email του Booking.com και του Expedia δεν μπαίνουν ποτέ στη λίστα. {pendingOta} τρέχουσες και επόμενες κρατήσεις δεν έχουν ακόμα προσωπικό email.
          {" "}Το αυτόματο μήνυμα που το ζητάει είναι <strong>{outreachEnabled ? "ανοιχτό" : "κλειστό"}</strong>
          {outreachEnabled ? "." : ": άνοιξέ το στα «Αυτόματα email» → «Μήνυμα σε πελάτες Booking / Expedia»."}
          {" "}Μόλις ο πελάτης απαντήσει με το email του, μπαίνει αυτόματα εδώ.
        </p>
      </section>

      <section className={panelClass}>
        <h2 className="text-lg font-black">Προσθήκη email</h2>
        <p className="mt-1 text-sm text-stone-600">Ένα email ανά γραμμή. Αν θες και όνομα: <code>email, όνομα</code>. Μπορείς να επικολλήσεις μια ολόκληρη παλιά λίστα.</p>
        <form
          className="mt-3 grid gap-3"
          onSubmit={(event) => { event.preventDefault(); void add(); }}
        >
          <label htmlFor="nl-add" className="sr-only">Email για προσθήκη</label>
          <textarea id="nl-add" rows={4} required className={inputClass} value={addText} onChange={(event) => setAddText(event.target.value)} placeholder={"maria@example.com, Maria Papadopoulou\njohn@example.com"} />
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label htmlFor="nl-add-language" className="mb-1 block text-sm font-bold">Γλώσσα</label>
              <select id="nl-add-language" className={inputClass} value={addLanguage} onChange={(event) => setAddLanguage(event.target.value as EmailLanguage)}>
                {LANGUAGES.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
            <button type="submit" disabled={busy} className={primaryButton}>Προσθήκη</button>
          </div>
        </form>
      </section>

      <section className={panelClass}>
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Φίλτρο γλώσσας">
          <button type="button" aria-pressed={language === "all"} className={chipClass(language === "all")} onClick={() => setLanguage("all")}>Όλες</button>
          {LANGUAGES.map(({ key, label }) => (
            <button key={key} type="button" aria-pressed={language === key} className={chipClass(language === key)} onClick={() => setLanguage(key)}>{label}</button>
          ))}
        </div>
        <div className="mb-3 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <div>
            <label htmlFor="nl-search" className="mb-1 block text-sm font-bold">Αναζήτηση</label>
            <input id="nl-search" className={inputClass} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Όνομα ή email" />
          </div>
          <label className="flex min-h-10 items-center gap-2 text-sm font-bold">
            <input type="checkbox" className="h-5 w-5" checked={showUnsubscribed} onChange={(event) => setShowUnsubscribed(event.target.checked)} />
            Δείξε όσους έκαναν διαγραφή
          </label>
          <button type="button" className={secondaryButton} disabled={!visible.length} onClick={download}>Λήψη CSV</button>
        </div>
        <p className="mb-2 text-sm font-bold text-stone-600">{visible.length} email</p>
        <ul className="grid gap-1">
          {visible.slice(0, 200).map((contact) => (
            <li key={contact.email} className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 py-2">
              <div className="min-w-0">
                <p className="break-all font-black">{contact.email}</p>
                <p className="text-sm text-stone-600">
                  {contact.name || "Χωρίς όνομα"} · {contact.sources.map((source) => SOURCE_LABELS[source]).join(", ")}
                  {contact.stays ? ` · ${contact.stays} ${contact.stays === 1 ? "διαμονή" : "διαμονές"}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor={`nl-lang-${contact.email}`} className="sr-only">Γλώσσα για {contact.email}</label>
                <select
                  id={`nl-lang-${contact.email}`}
                  className="rounded-xl border border-stone-300 bg-white px-2 py-1.5 text-sm"
                  value={contact.language}
                  disabled={busy}
                  onChange={(event) => act({ action: "set_language", email: contact.email, language: event.target.value }, "Η γλώσσα άλλαξε.")}
                >
                  {LANGUAGES.map(({ key }) => <option key={key} value={key}>{key.toUpperCase()}</option>)}
                </select>
                {contact.unsubscribed ? (
                  <button type="button" className={secondaryButton} disabled={busy} onClick={() => {
                    if (!window.confirm(`Ο ${contact.email} σου ζήτησε να ξαναμπεί στη λίστα;`)) return;
                    void act({ action: "resubscribe", email: contact.email }, "Ξαναμπήκε στη λίστα.");
                  }}>Επαναφορά</button>
                ) : (
                  <button type="button" className={secondaryButton} disabled={busy} onClick={() => {
                    if (!window.confirm(`Να βγει ο ${contact.email} από τις ευχές και τις καμπάνιες;`)) return;
                    void act({ action: "unsubscribe", email: contact.email, language: contact.language }, "Βγήκε από τη λίστα.");
                  }}>Αφαίρεση</button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {visible.length > 200 ? <p className="mt-3 text-sm text-stone-600">Εμφανίζονται τα πρώτα 200. Χρησιμοποίησε αναζήτηση ή γλώσσα.</p> : null}
      </section>
    </div>
  );
}

// ---- Campaigns --------------------------------------------------------------

const emptyDraft = (): Draft => ({ id: null, title: "", image: "", content: { el: emptyCampaignText(), en: emptyCampaignText(), tr: emptyCampaignText() } });

const toDraft = (campaign: Campaign): Draft => ({
  id: campaign.id,
  title: campaign.title,
  image: campaign.image,
  content: {
    el: { ...emptyCampaignText(), ...campaign.content.el },
    en: { ...emptyCampaignText(), ...campaign.content.en },
    tr: { ...emptyCampaignText(), ...campaign.content.tr },
  },
});

function CampaignEditor({ initial, onClose, onNotice, onError }: { initial: Draft; onClose: () => void; onNotice: (text: string) => void; onError: (text: string) => void }) {
  const [draft, setDraft] = useState<Draft>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [editLanguage, setEditLanguage] = useState<EmailLanguage>("el");
  const [status, setStatus] = useState<Status | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [selected, setSelected] = useState<EmailLanguage[]>([]);
  const [busy, setBusy] = useState(false);
  const { sending, progress, run, stop } = useBulkSend();
  const dirty = JSON.stringify(draft) !== saved;

  const loadStatus = useCallback(async (id: number) => {
    const payload = await request(`${API}?view=campaign&id=${id}`);
    setStatus(payload.status);
    setTestEmail(payload.testEmail);
  }, []);

  useEffect(() => {
    if (draft.id) loadStatus(draft.id).catch((reason) => onError(message(reason)));
  }, [draft.id, loadStatus, onError]);

  const ready = LANGUAGES.filter(({ key }) => isCampaignReady(draft.content[key])).map(({ key }) => key);
  const readyKey = ready.join(",");
  // Every written language starts ticked; unticking one survives later edits.
  useEffect(() => {
    const languages = readyKey ? (readyKey.split(",") as EmailLanguage[]) : [];
    setSelected((current) => {
      const kept = current.filter((key) => languages.includes(key));
      return kept.length ? kept : languages;
    });
  }, [readyKey]);

  const text = draft.content[editLanguage];
  const setText = (patch: Partial<CampaignText>) => setDraft({ ...draft, content: { ...draft.content, [editLanguage]: { ...text, ...patch } } });

  const preview = useMemo(() => {
    if (!isCampaignReady(text)) return null;
    return buildCampaignEmail(text, editLanguage, { firstName: "Maria", lastName: "Papadopoulou", image: draft.image, unsubscribeUrl: "https://chioshotel.gr/" });
  }, [text, editLanguage, draft.image]);

  const save = async () => {
    setBusy(true);
    try {
      const payload = await request(API, { action: "save_campaign", id: draft.id, title: draft.title, image: draft.image, content: draft.content as CampaignContent });
      const next = { ...draft, id: payload.id };
      setDraft(next);
      setSaved(JSON.stringify(next));
      onNotice("Η καμπάνια αποθηκεύτηκε.");
    } catch (reason) {
      onError(message(reason));
    } finally {
      setBusy(false);
    }
  };

  const sendTest = async () => {
    setBusy(true);
    try {
      const payload = await request(API, { action: "send_test", id: draft.id, language: editLanguage });
      onNotice(`Η δοκιμή στάλθηκε στο ${payload.to}.`);
    } catch (reason) {
      onError(message(reason));
    } finally {
      setBusy(false);
    }
  };

  const waiting = status ? selected.reduce((sum, key) => sum + status.byLanguage[key].waiting, 0) : 0;
  const failed = status ? selected.reduce((sum, key) => sum + status.byLanguage[key].failed, 0) : 0;

  const sendAll = async (retryFailed: boolean) => {
    const names = LANGUAGES.filter(({ key }) => selected.includes(key)).map(({ label }) => label).join(", ");
    if (!window.confirm(`Να σταλεί η καμπάνια «${draft.title}» σε ${retryFailed ? failed : waiting} email (${names});`)) return;
    try {
      onNotice(await run(async () => (await request(API, { action: "send_batch", id: draft.id, languages: selected, retryFailed })).result as BulkBatchResult));
    } catch (reason) {
      onError(message(reason));
    } finally {
      if (draft.id) await loadStatus(draft.id).catch(() => undefined);
    }
  };

  return (
    <div className="grid gap-4">
      <button type="button" className="justify-self-start text-sm font-bold text-amber-800" onClick={() => {
        if (dirty && !window.confirm("Έχεις αλλαγές που δεν αποθηκεύτηκαν. Να φύγω;")) return;
        onClose();
      }}>← Όλες οι καμπάνιες</button>

      <section className={`${panelClass} grid gap-3`}>
        <div>
          <label htmlFor="cmp-title" className="mb-1 block text-sm font-bold">Τίτλος (μόνο για εσένα)</label>
          <input id="cmp-title" className={inputClass} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="π.χ. Προσφορά Μαΐου 2027" />
        </div>
        <div>
          <label htmlFor="cmp-image" className="mb-1 block text-sm font-bold">Φωτογραφία πάνω (link, προαιρετικό)</label>
          <input id="cmp-image" className={inputClass} value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="https://chioshotel.gr/images/…  (κενό = η κλασική φωτογραφία)" />
        </div>
      </section>

      <section className={`${panelClass} grid gap-3`}>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Γλώσσα κειμένου">
          {LANGUAGES.map(({ key, label }) => (
            <button key={key} type="button" aria-pressed={editLanguage === key} className={chipClass(editLanguage === key)} onClick={() => setEditLanguage(key)}>
              {label}{isCampaignReady(draft.content[key]) ? " ✓" : ""}
            </button>
          ))}
        </div>
        <p className="text-sm text-stone-600">Γράψε το μήνυμα σε κάθε γλώσσα που θες να στείλεις. Όποια γλώσσα μείνει κενή δεν στέλνεται. Το «Αγαπητέ/ή Όνομα» μπαίνει μόνο του.</p>
        <div>
          <label htmlFor="cmp-subject" className="mb-1 block text-sm font-bold">Θέμα email</label>
          <input id="cmp-subject" className={inputClass} value={text.subject} onChange={(event) => setText({ subject: event.target.value })} />
        </div>
        <div>
          <label htmlFor="cmp-heading" className="mb-1 block text-sm font-bold">Μεγάλος τίτλος (προαιρετικό)</label>
          <input id="cmp-heading" className={inputClass} value={text.heading} onChange={(event) => setText({ heading: event.target.value })} />
        </div>
        <div>
          <label htmlFor="cmp-body" className="mb-1 block text-sm font-bold">Κείμενο</label>
          <textarea id="cmp-body" rows={9} className={inputClass} value={text.body} onChange={(event) => setText({ body: event.target.value })} placeholder="Άφησε μια κενή γραμμή για νέα παράγραφο." />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="cmp-button-label" className="mb-1 block text-sm font-bold">Κουμπί: κείμενο (προαιρετικό)</label>
            <input id="cmp-button-label" className={inputClass} value={text.buttonLabel} onChange={(event) => setText({ buttonLabel: event.target.value })} placeholder="π.χ. Δείτε την προσφορά" />
          </div>
          <div>
            <label htmlFor="cmp-button-url" className="mb-1 block text-sm font-bold">Κουμπί: link</label>
            <input id="cmp-button-url" className={inputClass} value={text.buttonUrl} onChange={(event) => setText({ buttonUrl: event.target.value })} placeholder="https://chioshotel.gr/…" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={primaryButton} disabled={busy || sending || !dirty || !draft.title.trim()} onClick={save}>Αποθήκευση</button>
          <button type="button" className={secondaryButton} disabled={busy || sending || dirty || !draft.id || !isCampaignReady(text) || !testEmail} onClick={sendTest}>
            Στείλε μου δοκιμή ({editLanguage.toUpperCase()})
          </button>
        </div>
        {dirty ? <p className="text-xs text-stone-500">Αποθήκευσε για να στείλεις δοκιμή ή την καμπάνια.</p> : null}
      </section>

      {draft.id && !dirty ? (
        <section className={panelClass}>
          <h2 className="mb-3 text-lg font-black">Αποστολή</h2>
          {!status ? <p className="text-sm text-stone-600">Φόρτωση…</p> : (
            <>
              <ul className="grid gap-1">
                {LANGUAGES.map(({ key, label }) => {
                  const counts = status.byLanguage[key];
                  const canSend = ready.includes(key);
                  return (
                    <li key={key} className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 py-2">
                      <label className={`flex items-center gap-2 font-black ${canSend ? "" : "text-stone-400"}`}>
                        <input
                          type="checkbox"
                          className="h-5 w-5"
                          checked={selected.includes(key)}
                          disabled={sending || !canSend}
                          onChange={(event) => setSelected(event.target.checked ? [...selected, key] : selected.filter((item) => item !== key))}
                        />
                        {label}{canSend ? "" : " (χωρίς κείμενο)"}
                      </label>
                      <span className="text-sm text-stone-600">
                        {counts.total} στη λίστα · {counts.sent} στάλθηκαν · {counts.waiting} περιμένουν{counts.failed ? ` · ${counts.failed} απέτυχαν` : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs text-stone-500">Σήμερα στάλθηκαν {status.sentToday} από {status.dailyLimit} μαζικά email (όριο για να μη μπλοκάρει το Gmail). Κάθε email παίρνει την καμπάνια μία φορά.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className={primaryButton} disabled={sending || busy || !waiting} onClick={() => sendAll(false)}>
                  {sending ? "Αποστολή…" : `Αποστολή σε ${waiting}`}
                </button>
                {sending ? <button type="button" className={secondaryButton} onClick={stop}>Διακοπή</button> : null}
                {!sending && failed ? <button type="button" className={secondaryButton} disabled={busy} onClick={() => sendAll(true)}>Ξαναδοκίμασε {failed} αποτυχημένα</button> : null}
              </div>
              {progress ? <p role="status" className="mt-3 text-sm font-bold text-stone-700">{progress}</p> : null}
            </>
          )}
        </section>
      ) : null}

      <section className={panelClass}>
        <h2 className="mb-2 text-lg font-black">Προεπισκόπηση ({editLanguage.toUpperCase()})</h2>
        {preview ? (
          <>
            <p className="mb-2 text-sm font-bold">Θέμα: {preview.subject}</p>
            <iframe title="Προεπισκόπηση καμπάνιας" sandbox="" srcDoc={preview.html} className="h-[620px] w-full rounded-xl border border-stone-200 bg-white" />
          </>
        ) : <p className="text-sm text-stone-600">Γράψε θέμα και κείμενο για να δεις την προεπισκόπηση.</p>}
      </section>
    </div>
  );
}

function CampaignsView({ onNotice, onError }: { onNotice: (text: string) => void; onError: (text: string) => void }) {
  const [campaigns, setCampaigns] = useState<CampaignRow[] | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);

  const load = useCallback(async () => {
    setCampaigns((await request(`${API}?view=campaigns`)).campaigns);
  }, []);

  useEffect(() => {
    if (!editing) load().catch((reason) => onError(message(reason)));
  }, [editing, load, onError]);

  if (editing) return <CampaignEditor initial={editing} onClose={() => setEditing(null)} onNotice={onNotice} onError={onError} />;

  return (
    <div className="grid gap-4">
      <div>
        <button type="button" className={primaryButton} onClick={() => setEditing(emptyDraft())}>Νέα καμπάνια</button>
      </div>
      {!campaigns ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}
      {campaigns && !campaigns.length ? <p className={panelClass}>Δεν υπάρχει καμπάνια ακόμα.</p> : null}
      <ul className="grid gap-2">
        {(campaigns ?? []).map((campaign) => (
          <li key={campaign.id} className={`${panelClass} flex flex-wrap items-center justify-between gap-3`}>
            <div>
              <p className="font-black">{campaign.title}</p>
              <p className="text-sm text-stone-600">
                {LANGUAGES.filter(({ key }) => isCampaignReady(campaign.content[key])).map(({ key }) => key.toUpperCase()).join(" · ") || "Χωρίς κείμενο"}
                {" · "}{campaign.sent ? `στάλθηκε σε ${campaign.sent}` : "δεν έχει σταλεί"} · {campaign.updatedAt}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={secondaryButton} onClick={() => setEditing(toDraft(campaign))}>Άνοιγμα</button>
              <button type="button" className={secondaryButton} onClick={() => setEditing({ ...toDraft(campaign), id: null, title: `${campaign.title} (αντίγραφο)` })}>Αντίγραφο</button>
              {!campaign.sent ? (
                <button type="button" className={secondaryButton} onClick={async () => {
                  if (!window.confirm(`Να διαγραφεί η καμπάνια «${campaign.title}»;`)) return;
                  try {
                    await request(API, { action: "delete_campaign", id: campaign.id });
                    await load();
                    onNotice("Η καμπάνια διαγράφηκε.");
                  } catch (reason) {
                    onError(message(reason));
                  }
                }}>Διαγραφή</button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function NewsletterPanel() {
  const [view, setView] = useState<"contacts" | "campaigns">("contacts");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const onNotice = useCallback((text: string) => { setError(""); setNotice(text); }, []);
  const onError = useCallback((text: string) => { setNotice(""); setError(text); }, []);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Newsletter">
        <button type="button" aria-pressed={view === "contacts"} className={chipClass(view === "contacts")} onClick={() => { setView("contacts"); setNotice(""); setError(""); }}>Λίστα email</button>
        <button type="button" aria-pressed={view === "campaigns"} className={chipClass(view === "campaigns")} onClick={() => { setView("campaigns"); setNotice(""); setError(""); }}>Καμπάνιες</button>
      </div>
      {notice ? <div role="status" className="rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{notice}</div> : null}
      {error ? <div role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</div> : null}
      {view === "contacts" ? <ContactsView onNotice={onNotice} onError={onError} /> : <CampaignsView onNotice={onNotice} onError={onError} />}
    </div>
  );
}
