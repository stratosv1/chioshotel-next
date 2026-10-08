"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Lang = "el" | "en" | "fr" | "de" | "it" | "es" | "tr";
const LANGS: Lang[] = ["el", "en", "fr", "de", "it", "es", "tr"];
const LANG_LABELS: Record<Lang, string> = {
  el: "Ελληνικά",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
  tr: "Türkçe",
};

type Translation = { title: string; description: string; tip: string; discountLabel: string; tags: string[] };

type Offer = {
  id: string;
  slug: string;
  roomKey: string;
  couponCode: string;
  image: string | null;
  validFrom: string | null;
  validUntil: string | null;
  active: boolean;
  sortOrder: number;
  translations: Partial<Record<Lang, Translation>>;
  live: boolean;
  shareLinks: Record<Lang, string>;
};

type Payload = {
  ok: boolean;
  error?: string;
  offers: Offer[];
  rooms: { key: string; label: string }[];
  images: { key: string; label: string; image: string }[];
  dealsPages: Record<Lang, string>;
};

type Subscriber = {
  email: string;
  language: string;
  source: string | null;
  offerSlug: string | null;
  consentAt: string;
  unsubscribedAt: string | null;
};

type FormState = {
  id?: string;
  slug: string;
  roomKey: string;
  couponCode: string;
  image: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
  sortOrder: number;
  translations: Record<Lang, { title: string; description: string; tip: string; discountLabel: string; tags: string }>;
};

const API = "/api/staff/offers/";

function emptyTranslations(): FormState["translations"] {
  return Object.fromEntries(
    LANGS.map((lang) => [lang, { title: "", description: "", tip: "", discountLabel: "", tags: "" }]),
  ) as FormState["translations"];
}

function emptyForm(): FormState {
  return {
    slug: "",
    roomKey: "economy-double",
    couponCode: "",
    image: "",
    validFrom: "",
    validUntil: "",
    active: true,
    sortOrder: 0,
    translations: emptyTranslations(),
  };
}

/** ISO (UTC) -> value for <input type="datetime-local"> in the browser's local time. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("el-GR", { dateStyle: "medium", timeStyle: "short" });
}

function status(offer: Offer) {
  const now = Date.now();
  if (!offer.active) return { label: "Ανενεργή", className: "bg-stone-200 text-stone-700" };
  if (offer.validUntil && new Date(offer.validUntil).getTime() <= now) return { label: "Έληξε", className: "bg-red-100 text-red-800" };
  if (offer.validFrom && new Date(offer.validFrom).getTime() > now) return { label: "Ξεκινά σύντομα", className: "bg-sky-100 text-sky-800" };
  return { label: "Live στο site", className: "bg-emerald-100 text-emerald-800" };
}

function offerToForm(offer: Offer): FormState {
  const translations = emptyTranslations();
  for (const lang of LANGS) {
    const t = offer.translations[lang];
    if (t) translations[lang] = { ...t, tags: t.tags.join(", ") };
  }
  return {
    id: offer.id,
    slug: offer.slug,
    roomKey: offer.roomKey,
    couponCode: offer.couponCode,
    image: offer.image ?? "",
    validFrom: toLocalInput(offer.validFrom),
    validUntil: toLocalInput(offer.validUntil),
    active: offer.active,
    sortOrder: offer.sortOrder,
    translations,
  };
}

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-[15px] text-stone-900 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-200";
const labelClass = "mb-1 block text-xs font-black uppercase tracking-[0.08em] text-stone-600";

export default function OffersApp() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [lang, setLang] = useState<Lang>("el");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"offers" | "newsletter">("offers");
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
  const [shareLang, setShareLang] = useState<Lang>("el");

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch(API, { cache: "no-store" });
      const payload = (await response.json()) as Payload;
      if (!payload.ok) throw new Error(payload.error || "Σφάλμα");
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα φόρτωσης");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (tab !== "newsletter" || subscribers) return;
    fetch("/api/staff/newsletter/", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setSubscribers(payload.ok ? payload.subscribers : []))
      .catch(() => setSubscribers([]));
  }, [tab, subscribers]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  async function copy(text: string, message = "Αντιγράφηκε") {
    try {
      await navigator.clipboard.writeText(text);
      flash(message);
    } catch {
      window.prompt("Αντιγράψτε:", text);
    }
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setError("");
    const translations: Partial<Record<Lang, Translation>> = {};
    for (const l of LANGS) {
      const t = form.translations[l];
      if (!t.title.trim()) continue;
      translations[l] = {
        title: t.title,
        description: t.description,
        tip: t.tip,
        discountLabel: t.discountLabel,
        tags: t.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
    }
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          slug: form.slug,
          roomKey: form.roomKey,
          couponCode: form.couponCode,
          image: form.image,
          validFrom: fromLocalInput(form.validFrom),
          validUntil: fromLocalInput(form.validUntil),
          active: form.active,
          sortOrder: form.sortOrder,
          translations,
        }),
      });
      const payload = (await response.json()) as Payload;
      if (!payload.ok) throw new Error(payload.error || "Σφάλμα αποθήκευσης");
      setData(payload);
      setForm(null);
      flash("Αποθηκεύτηκε · η σελίδα προσφορών ενημερώθηκε");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Σφάλμα αποθήκευσης");
    } finally {
      setSaving(false);
    }
  }

  async function remove(offer: Offer) {
    const title = offer.translations.el?.title ?? offer.slug;
    if (!window.confirm(`Διαγραφή της προσφοράς «${title}»; Αν θέλετε απλώς να μη φαίνεται, βάλτε την ανενεργή.`)) return;
    const response = await fetch(`${API}?id=${offer.id}`, { method: "DELETE" });
    const payload = (await response.json()) as Payload;
    if (payload.ok) {
      setData(payload);
      flash("Διαγράφηκε");
    } else setError(payload.error || "Σφάλμα διαγραφής");
  }

  const liveCount = useMemo(() => data?.offers.filter((offer) => offer.live).length ?? 0, [data]);
  const activeSubscribers = subscribers?.filter((s) => !s.unsubscribedAt) ?? [];

  return (
    <main className="min-h-screen bg-[#f6efe5] px-4 py-6 text-stone-900 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <a href="/staff" className="text-sm font-bold text-amber-800">← Staff</a>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Προσφορές & Newsletter</h1>
            <p className="mt-1 text-sm text-stone-600">
              Ό,τι αποθηκεύετε εμφανίζεται αμέσως στη σελίδα προσφορών και στις 7 γλώσσες. Οι ληγμένες προσφορές κρύβονται μόνες τους.
            </p>
          </div>
          {data ? (
            <a
              href={data.dealsPages.el}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-amber-800/30 bg-white px-4 py-2 text-sm font-black text-amber-900"
            >
              Άνοιγμα σελίδας ↗
            </a>
          ) : null}
        </header>

        <div className="mb-5 flex gap-2">
          {(["offers", "newsletter"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-5 py-2 text-sm font-black ${tab === key ? "bg-stone-900 text-white" : "bg-white text-stone-700"}`}
            >
              {key === "offers" ? `Προσφορές (${liveCount} live)` : "Newsletter"}
            </button>
          ))}
        </div>

        {notice ? <div className="mb-4 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{notice}</div> : null}
        {error ? <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">{error}</div> : null}

        {tab === "offers" ? (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-sm text-stone-700">
                <strong>Last minute:</strong> η ενότητα «Last minute αυτής της εβδομάδας» γεμίζει αυτόματα από τα Live Deals (διαθεσιμότητα των επόμενων 7 ημερών). Δεν χρειάζεται καταχώρηση εδώ.
              </div>
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm());
                  setLang("el");
                }}
                className="rounded-full bg-amber-800 px-5 py-2.5 text-sm font-black text-white shadow"
              >
                + Νέα προσφορά
              </button>
            </div>

            {form && data ? (
              <section className="mb-6 rounded-2xl border border-amber-800/20 bg-white p-5 shadow-md">
                <h2 className="mb-4 text-xl font-black">{form.id ? "Επεξεργασία προσφοράς" : "Νέα προσφορά"}</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>Δωμάτιο / κατηγορία</label>
                    <select className={inputClass} value={form.roomKey} onChange={(e) => setForm({ ...form, roomKey: e.target.value })}>
                      {data.rooms.map((room) => (
                        <option key={room.key} value={room.key}>{room.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Κωδικός έκπτωσης (Beds24)</label>
                    <input className={`${inputClass} font-mono uppercase`} value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} placeholder="π.χ. WINTER15" />
                  </div>
                  <div>
                    <label className={labelClass}>Σειρά εμφάνισης</label>
                    <input type="number" className={inputClass} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className={labelClass}>Ξεκινά (προαιρετικό)</label>
                    <input type="datetime-local" className={inputClass} value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Λήγει (προαιρετικό)</label>
                    <input type="datetime-local" className={inputClass} value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
                    <p className="mt-1 text-xs text-stone-500">Με λήξη εμφανίζεται αντίστροφη μέτρηση· μετά τη λήξη κρύβεται.</p>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input id="active" type="checkbox" className="h-5 w-5" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                    <label htmlFor="active" className="text-sm font-bold">Ενεργή (εμφανίζεται στο site)</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Φωτογραφία</label>
                    <select className={inputClass} value={data.images.some((i) => i.image === form.image) ? form.image : form.image ? "custom" : ""} onChange={(e) => setForm({ ...form, image: e.target.value === "custom" ? form.image || "https://" : e.target.value })}>
                      <option value="">Αυτόματα (φωτογραφία του δωματίου)</option>
                      {data.images.map((image) => (
                        <option key={image.key} value={image.image}>{image.label}</option>
                      ))}
                      <option value="custom">Άλλο link φωτογραφίας…</option>
                    </select>
                    {form.image && !data.images.some((i) => i.image === form.image) ? (
                      <input className={`${inputClass} mt-2`} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://… ή /images/…" />
                    ) : null}
                  </div>
                  <div>
                    <label className={labelClass}>Όνομα για το link (προαιρετικό)</label>
                    <input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="π.χ. winter-family" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {LANGS.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        className={`rounded-full px-3 py-1.5 text-xs font-black ${lang === l ? "bg-amber-800 text-white" : form.translations[l].title ? "bg-amber-100 text-amber-900" : "bg-stone-100 text-stone-500"}`}
                      >
                        {LANG_LABELS[l]}{l === "el" || l === "en" ? " *" : ""}
                      </button>
                    ))}
                  </div>
                  <p className="mb-3 text-xs text-stone-500">
                    * Ελληνικά και Αγγλικά υποχρεωτικά. Όσες γλώσσες μείνουν κενές δείχνουν το αγγλικό κείμενο.
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Τίτλος</label>
                      <input className={inputClass} value={form.translations[lang].title} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [lang]: { ...form.translations[lang], title: e.target.value } } })} />
                    </div>
                    <div>
                      <label className={labelClass}>Ετικέτα έκπτωσης</label>
                      <input className={inputClass} value={form.translations[lang].discountLabel} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [lang]: { ...form.translations[lang], discountLabel: e.target.value } } })} placeholder="π.χ. −15% χειμερινή προσφορά" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Περιγραφή</label>
                      <textarea rows={3} className={inputClass} value={form.translations[lang].description} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [lang]: { ...form.translations[lang], description: e.target.value } } })} />
                    </div>
                    <div>
                      <label className={labelClass}>Συμβουλή κράτησης</label>
                      <input className={inputClass} value={form.translations[lang].tip} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [lang]: { ...form.translations[lang], tip: e.target.value } } })} />
                    </div>
                    <div>
                      <label className={labelClass}>Ετικέτες (με κόμμα)</label>
                      <input className={inputClass} value={form.translations[lang].tags} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [lang]: { ...form.translations[lang], tags: e.target.value } } })} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" disabled={saving} onClick={save} className="rounded-full bg-stone-900 px-6 py-3 text-sm font-black text-white disabled:opacity-50">
                    {saving ? "Αποθήκευση…" : "Αποθήκευση"}
                  </button>
                  <button type="button" onClick={() => setForm(null)} className="rounded-full bg-stone-100 px-6 py-3 text-sm font-black text-stone-700">
                    Ακύρωση
                  </button>
                </div>
              </section>
            ) : null}

            {!data && !error ? <p className="text-sm text-stone-600">Φόρτωση…</p> : null}

            <div className="mb-3 flex items-center gap-2 text-sm">
              <span className="font-bold text-stone-700">Links newsletter σε:</span>
              <select className="rounded-lg border border-stone-300 bg-white px-2 py-1" value={shareLang} onChange={(e) => setShareLang(e.target.value as Lang)}>
                {LANGS.map((l) => (
                  <option key={l} value={l}>{LANG_LABELS[l]}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4">
              {data?.offers.map((offer) => {
                const st = status(offer);
                const room = data.rooms.find((r) => r.key === offer.roomKey)?.label ?? offer.roomKey;
                return (
                  <article key={offer.id} className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${st.className}`}>{st.label}</span>
                        <h3 className="mt-2 text-lg font-black">{offer.translations.el?.title ?? offer.slug}</h3>
                        <p className="text-sm text-stone-600">
                          {room} · Κωδικός <strong className="font-mono">{offer.couponCode || "—"}</strong>
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          Από {formatDate(offer.validFrom)} · Λήξη {formatDate(offer.validUntil)} · Γλώσσες: {LANGS.filter((l) => offer.translations[l]).join(", ")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setForm(offerToForm(offer)); setLang("el"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-900">
                          Επεξεργασία
                        </button>
                        <button type="button" onClick={() => remove(offer)} className="rounded-full bg-stone-100 px-4 py-2 text-sm font-black text-stone-600">
                          Διαγραφή
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-stone-50 p-3">
                      <code className="min-w-0 flex-1 truncate text-xs text-stone-700">{offer.shareLinks[shareLang]}</code>
                      <button type="button" onClick={() => copy(offer.shareLinks[shareLang], "Link αντιγράφηκε για newsletter")} className="rounded-full bg-stone-900 px-4 py-2 text-xs font-black text-white">
                        Αντιγραφή link
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">Εγγραφές στο newsletter</h2>
                <p className="text-sm text-stone-600">
                  {subscribers ? `${activeSubscribers.length} ενεργές εγγραφές` : "Φόρτωση…"} · Μόνο όσοι έδωσαν ρητή συγκατάθεση στη σελίδα προσφορών.
                </p>
              </div>
              <a href="/api/staff/newsletter/?format=csv" className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-black text-white">
                Λήψη CSV
              </a>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-stone-500">
                  <tr>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Γλώσσα</th>
                    <th className="py-2 pr-4">Από</th>
                    <th className="py-2">Ημερομηνία</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {activeSubscribers.slice(0, 200).map((s) => (
                    <tr key={s.email}>
                      <td className="py-2 pr-4 font-bold">{s.email}</td>
                      <td className="py-2 pr-4">{s.language}</td>
                      <td className="py-2 pr-4">{s.offerSlug ? `προσφορά ${s.offerSlug}` : s.source ?? "—"}</td>
                      <td className="py-2">{formatDate(s.consentAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
