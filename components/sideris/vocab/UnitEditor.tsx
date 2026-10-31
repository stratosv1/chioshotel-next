"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Word = { term: string; meaning: string; note: string; example: string };

const MAX_SIDE = 2000;

async function fileToDataUrl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Η φωτογραφία δεν άνοιξε. Δοκίμασε JPG ή PNG."));
      el.src = url;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Ο browser δεν μπορεί να επεξεργαστεί τη φωτογραφία.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

const emptyWord = (): Word => ({ term: "", meaning: "", note: "", example: "" });

export function UnitEditor({
  language,
  subjectSlug,
  termLabel,
  initialNumber,
  initialTitle = "",
  initialWords = [],
  existing = false,
  accent,
}: {
  language: "en" | "de";
  subjectSlug: string;
  termLabel: string;
  initialNumber: number;
  initialTitle?: string;
  initialWords?: Word[];
  existing?: boolean;
  accent: string;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [number, setNumber] = useState(initialNumber);
  const [title, setTitle] = useState(initialTitle);
  const [words, setWordsState] = useState<Word[]>(initialWords);
  const wordsRef = useRef<Word[]>(initialWords);
  const setWords = (next: Word[] | ((current: Word[]) => Word[])) => {
    wordsRef.current = typeof next === "function" ? next(wordsRef.current) : next;
    setWordsState(wordsRef.current);
  };
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function readPhotos(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const list = Array.from(files).slice(0, 6);
    let added = 0;
    for (let i = 0; i < list.length; i++) {
      setBusy(`Διαβάζω τη φωτογραφία ${i + 1} από ${list.length}…`);
      try {
        const image = await fileToDataUrl(list[i]);
        const response = await fetch("/sideris/api/vocab/extract/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, image }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.error || "Η ανάγνωση απέτυχε.");
        if (data?.title) setTitle((t) => t || data.title);
        const incoming: Word[] = Array.isArray(data?.words) ? data.words : [];
        const seen = new Set(wordsRef.current.map((w) => w.term.toLowerCase()));
        const fresh = incoming.filter((w) => !seen.has(w.term.toLowerCase()));
        added += fresh.length;
        wordsRef.current = [...wordsRef.current, ...fresh];
        setWords(wordsRef.current);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Η ανάγνωση απέτυχε.");
      }
    }
    setBusy(null);
    if (fileInput.current) fileInput.current.value = "";
    if (added === 0) setError((e) => e || "Δεν βρέθηκαν λέξεις στη φωτογραφία. Δοκίμασε πιο καθαρή φωτογραφία.");
  }

  function update(index: number, field: keyof Word, value: string) {
    setWords((current) => current.map((w, i) => (i === index ? { ...w, [field]: value } : w)));
  }

  async function save() {
    setError(null);
    const ready = words.filter((w) => w.term.trim() && w.meaning.trim());
    if (ready.length === 0) {
      setError("Πρόσθεσε τουλάχιστον μία λέξη με σημασία.");
      return;
    }
    setBusy("Αποθήκευση…");
    try {
      const response = await fetch("/sideris/api/vocab/units/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, number, title, words: ready }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Η αποθήκευση απέτυχε.");
      router.push(`/sideris/${subjectSlug}/lexeis/${number}/`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Η αποθήκευση απέτυχε.");
      setBusy(null);
    }
  }

  async function remove() {
    if (!window.confirm(`Να διαγραφεί το κεφάλαιο ${initialNumber} με όλες τις λέξεις του;`)) return;
    setBusy("Διαγραφή…");
    const response = await fetch(`/sideris/api/vocab/units/?language=${language}&number=${initialNumber}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Η διαγραφή απέτυχε.");
      setBusy(null);
      return;
    }
    router.push(`/sideris/${subjectSlug}/lexeis/`);
    router.refresh();
  }

  const input =
    "w-full rounded-xl border border-black/15 bg-[#fbfaf8] px-3 py-2 text-sm outline-none focus:border-[#725f4e] focus:ring-4 focus:ring-[#725f4e]/10";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Κεφάλαιο</span>
          <input
            type="number"
            min={1}
            max={200}
            value={number}
            disabled={existing}
            onChange={(e) => setNumber(Math.max(1, Number(e.target.value) || 1))}
            className={input}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Τίτλος (προαιρετικά)</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="π.χ. My family" className={input} />
        </label>
      </div>

      <div className="rounded-2xl border border-dashed border-black/20 bg-[#faf8f5] p-5">
        <p className="text-sm leading-6 text-[#6f665f]">
          Φωτογράφισε τη σελίδα με τις λέξεις, ίσια και με καλό φως. Μπορείς να βάλεις και περισσότερες
          φωτογραφίες αν οι λέξεις είναι σε πολλές σελίδες.
        </p>
        <label
          className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#3e352f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f2823] ${busy ? "pointer-events-none opacity-50" : ""}`}
        >
          📷 {words.length ? "Πρόσθεσε κι άλλη φωτογραφία" : "Ανέβασε φωτογραφία"}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            disabled={Boolean(busy)}
            onChange={(e) => readPhotos(e.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      {busy ? (
        <p className="flex items-center gap-3 rounded-2xl bg-[#fff6e5] px-4 py-3 text-sm font-medium text-[#7a5414]">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {busy}
        </p>
      ) : null}
      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      {words.length > 0 ? (
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">Έλεγξε τις λέξεις ({words.length})</h3>
            <span className="text-xs text-[#857a70]">Διόρθωσε ό,τι δεν διαβάστηκε σωστά.</span>
          </div>
          <ol className="space-y-3">
            {words.map((w, i) => (
              <li key={i} className="rounded-2xl border border-black/10 bg-white p-3">
                <div className="grid gap-2 sm:grid-cols-[2rem_1fr_1fr_auto] sm:items-center">
                  <span className="text-xs font-semibold text-[#9a8f86]">{i + 1}</span>
                  <input aria-label={termLabel} value={w.term} onChange={(e) => update(i, "term", e.target.value)} placeholder={termLabel} className={`${input} font-semibold`} />
                  <input aria-label="Ελληνικά" value={w.meaning} onChange={(e) => update(i, "meaning", e.target.value)} placeholder="Ελληνικά" className={input} />
                  <button
                    type="button"
                    onClick={() => setWords((c) => c.filter((_, j) => j !== i))}
                    className="justify-self-end rounded-lg px-2 py-1 text-sm text-red-700 hover:bg-red-50"
                    aria-label="Αφαίρεση λέξης"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:ml-[2.5rem] sm:grid-cols-2">
                  <input aria-label="Σημείωση" value={w.note} onChange={(e) => update(i, "note", e.target.value)} placeholder="Σημείωση (π.χ. ρήμα, πληθυντικός)" className={`${input} text-xs`} />
                  <input aria-label="Παράδειγμα" value={w.example} onChange={(e) => update(i, "example", e.target.value)} placeholder="Παράδειγμα" className={`${input} text-xs`} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setWords((c) => [...c, emptyWord()])}
          className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#f7f4ef]"
        >
          + Λέξη με το χέρι
        </button>
        <button
          type="button"
          onClick={save}
          disabled={Boolean(busy) || words.length === 0}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50 ${accent}`}
        >
          Αποθήκευση κεφαλαίου
        </button>
        {existing ? (
          <button type="button" onClick={remove} disabled={Boolean(busy)} className="ml-auto text-sm font-medium text-red-700 hover:underline">
            Διαγραφή κεφαλαίου
          </button>
        ) : null}
      </div>
    </div>
  );
}
