import Link from "next/link";

type SubLink = { label: string; href: string };
type Lesson = {
  title: string;
  subtitle: string;
  href: string;
  links: SubLink[];
  pdf?: string;
};
type Subject = {
  key: string;
  name: string;
  badge: string;
  accent: string; // tailwind classes for the accent bar / badge
  soft: string;
  lessons: Lesson[];
};

// Add a lesson here when its page exists under app/sideris/(private)/<slug>.
const SUBJECTS: Subject[] = [
  {
    key: "agglika",
    name: "Αγγλικά",
    badge: "EN",
    accent: "bg-[#2f5d8a] text-white",
    soft: "bg-[#e6eef6] text-[#24496d]",
    lessons: [],
  },
  {
    key: "germanika",
    name: "Γερμανικά",
    badge: "DE",
    accent: "bg-[#b5562a] text-white",
    soft: "bg-[#f8e9e0] text-[#86391a]",
    lessons: [],
  },
];

export default function SiderisDashboardPage() {
  const lessonCount = SUBJECTS.reduce((n, s) => n + s.lessons.length, 0);

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">Α΄ Γυμνασίου</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Τα μαθήματα του Σιδέρη</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b625b] sm:text-base">
              {lessonCount > 0
                ? `${lessonCount} μαθήματα σε ${SUBJECTS.length} αντικείμενα. Πάτησε ένα μάθημα για να το ανοίξεις ή μια ενότητα για να πας κατευθείαν εκεί.`
                : "Εδώ θα μπαίνουν τα μαθήματά σου, με θεωρία, λεξιλόγιο, γραμματική και ασκήσεις."}
            </p>
          </div>
          <form action="/sideris/auth/logout" method="post">
            <button type="submit" className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-[#f7f4ef]">
              Αποσύνδεση
            </button>
          </form>
        </header>

        {SUBJECTS.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight">Δεν υπάρχουν ακόμη μαθήματα</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#6f665f]">
              Τα πρώτα μαθήματα θα εμφανιστούν σύντομα εδώ, χωρισμένα ανά αντικείμενο.
            </p>
          </section>
        ) : (
          <>
            <nav aria-label="Αντικείμενα" className="mb-8 flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <a key={s.key} href={`#${s.key}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${s.soft}`}>
                  {s.name}
                </a>
              ))}
            </nav>

            <div className="space-y-10">
              {SUBJECTS.map((s) => (
                <section key={s.key} id={s.key} className="scroll-mt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl text-lg font-bold ${s.accent}`}>{s.badge}</span>
                    <h2 className="text-2xl font-semibold tracking-tight">{s.name}</h2>
                  </div>

                  {s.lessons.length === 0 ? (
                    <p className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-6 text-sm leading-6 text-[#6f665f]">
                      Τα μαθήματα για {s.name} θα εμφανιστούν σύντομα εδώ.
                    </p>
                  ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {s.lessons.map((lesson) => (
                      <article key={lesson.href} className="flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                        <div className={`h-1.5 ${s.accent}`} />
                        <div className="flex flex-1 flex-col gap-4 p-6">
                          <div>
                            <Link href={lesson.href} prefetch={false} className="group inline-flex items-baseline gap-2">
                              <h3 className="text-xl font-semibold tracking-tight group-hover:underline sm:text-2xl">{lesson.title}</h3>
                            </Link>
                            <p className="mt-2 text-sm leading-6 text-[#6f665f] sm:text-base">{lesson.subtitle}</p>
                          </div>

                          {lesson.links.length > 0 && (
                            <ul className="flex flex-wrap gap-2">
                              {lesson.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    prefetch={false}
                                    className="inline-block rounded-full border border-black/10 bg-[#f7f4ef] px-3 py-1.5 text-sm font-medium text-[#4d4138] transition hover:bg-[#ece4da]"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-black/10 pt-4">
                            <Link
                              href={lesson.href}
                              prefetch={false}
                              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 ${s.accent}`}
                            >
                              Άνοιγμα μαθήματος →
                            </Link>
                            {lesson.pdf && (
                              <a href={lesson.pdf} target="_blank" rel="noopener" className="text-sm font-semibold text-[#5f5045] underline-offset-4 hover:underline">
                                Τυπολόγιο A4 (PDF)
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
