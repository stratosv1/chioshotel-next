import Link from "next/link";
import { listPhysicsCourses } from "@/lib/mixalis/db";
import { LessonProgress, StudyOverview } from "@/components/mixalis/study/StudyOverview";

type SubLink = { label: string; href: string };
type Lesson = {
  title: string;
  subtitle: string;
  href: string;
  links: SubLink[];
  pdf?: string;
  plain?: boolean; // served outside Next routing (static HTML route)
  study?: string; // key used by the ✓ / ★ study marks
};
type Subject = {
  key: string;
  name: string;
  badge: string;
  accent: string; // tailwind classes for the accent bar / badge
  soft: string;
  lessons: Lesson[];
};

const SUBJECTS: Subject[] = [
  {
    key: "fysiki-prosanatolismou",
    name: "Φυσική Προσανατολισμού",
    badge: "Φ",
    accent: "bg-[#2f5d8a] text-white",
    soft: "bg-[#e6eef6] text-[#24496d]",
    lessons: [
      {
        title: "Ομαλή κυκλική κίνηση",
        subtitle: "Το βασικό μάθημα: επιτάχυνση, κεντρομόλος δύναμη, στροφές με κλίση, λυμένα, ασκήσεις και Τράπεζα Θεμάτων.",
        href: "/mixalis/omali",
        links: [
          { label: "Επιτάχυνση", href: "/mixalis/omali#epitaxynsi" },
          { label: "Δύναμη", href: "/mixalis/omali#dynami" },
          { label: "Κλίση", href: "/mixalis/omali#klisi" },
          { label: "Δίσκος & τροχοί", href: "/mixalis/omali#diskos" },
          { label: "Εργαστήριο", href: "/mixalis/omali#lab" },
          { label: "Λυμένα", href: "/mixalis/omali#paradeigmata" },
          { label: "Ασκήσεις", href: "/mixalis/omali#askiseis" },
          { label: "Θέμα 2", href: "/mixalis/omali#thema2" },
          { label: "Τράπεζα Θεμάτων", href: "/mixalis/omali#trapeza" },
          { label: "Τυπολόγιο", href: "/mixalis/omali#typologio" },
          { label: "Τεστ", href: "/mixalis/omali#test" },
        ],
      },
      {
        title: "Κυκλική κίνηση · τυπολόγιο",
        subtitle: "Όλοι οι τύποι της κυκλικής κίνησης με κινούμενα σχέδια.",
        href: "/mixalis/omali2",
        links: [],
        pdf: "/mixalis/omali-typologio-A4.pdf",
      },
      {
        title: "Βολές · τυπολόγιο",
        subtitle: "Πλάγια και οριζόντια βολή: σχέδιο τροχιάς, όλοι οι τύποι και εξήγηση με αριθμούς για τον καθένα.",
        href: "/mixalis/voli",
        links: [
          { label: "Μέγιστο ύψος", href: "/mixalis/voli#k6" },
          { label: "Βεληνεκές", href: "/mixalis/voli#k7" },
          { label: "Οριζόντια βολή", href: "/mixalis/voli#k8" },
        ],
      },
      {
        title: "Ορμή και κρούσεις",
        subtitle: "Θεωρία, τυπολόγιο με κινούμενα σχέδια και οι φωτοτυπίες του Τριπολίτη λυμένες.",
        href: "/mixalis/ormi",
        study: "ormi",
        links: [
          { label: "Θεωρία", href: "/mixalis/ormi#theoria" },
          { label: "Ασκήσεις Τριπολίτη (λυμένες)", href: "/mixalis/ormi#askiseis" },
        ],
        pdf: "/mixalis/ormi-typologio-A4.pdf",
      },
    ],
  },
  {
    key: "fysiki-genikis",
    name: "Φυσική Γενικής Παιδείας",
    badge: "Φ",
    accent: "bg-[#6a4c93] text-white",
    soft: "bg-[#efe9f6] text-[#4f3772]",
    lessons: [
      {
        title: "Ηλεκτρικό πεδίο",
        subtitle: "Ένταση, ομογενές πεδίο, δυναμική ενέργεια, δυναμικό και πυκνωτής, με εισαγωγή και κινούμενα σχέδια.",
        href: "/mixalis/pedio",
        study: "pedio",
        links: [{ label: "Εισαγωγή", href: "/mixalis/pedio#eisagogi" }],
        pdf: "/mixalis/pedio-typologio-A4.pdf",
      },
    ],
  },
  {
    key: "mathimatika",
    name: "Μαθηματικά",
    badge: "Μ",
    accent: "bg-[#b5562a] text-white",
    soft: "bg-[#f8e9e0] text-[#86391a]",
    lessons: [
      {
        title: "Διανύσματα: συντεταγμένες",
        subtitle: "Θεωρία με κινούμενα σχέδια, θέματα Τράπεζας Θεμάτων λυμένα βήμα-βήμα και εξάσκηση.",
        href: "/mixalis/dianismata",
        links: [
          { label: "Θεωρία", href: "/mixalis/dianismata#theoria" },
          { label: "Τράπεζα Θεμάτων", href: "/mixalis/dianismata#trapeza" },
          { label: "Εξάσκηση", href: "/mixalis/dianismata#eksaskisi" },
        ],
      },
      {
        title: "Διάνυσμα: πέρα από το βέλος",
        subtitle: "12 βασικές ιδέες για τα διανύσματα, συνιστώσες με τριγωνομετρία και λυμένα παραδείγματα.",
        href: "/mixalis/dianisma",
        links: [
          { label: "12 ιδέες", href: "/mixalis/dianisma#ideas" },
          { label: "Τριγωνομετρία", href: "/mixalis/dianisma#trig" },
          { label: "Εργαστήριο", href: "/mixalis/dianisma#lab" },
          { label: "Παραδείγματα", href: "/mixalis/dianisma#examples" },
          { label: "Τεστ", href: "/mixalis/dianisma#quiz" },
          { label: "Τυπολόγιο", href: "/mixalis/dianisma#summary" },
        ],
      },
    ],
  },
  {
    key: "ximeia",
    name: "Χημεία",
    badge: "Χ",
    accent: "bg-[#0b7a6a] text-white",
    soft: "bg-[#ddf0ec] text-[#08584d]",
    lessons: [
      {
        title: "Οργανική χημεία",
        subtitle: "Κεφάλαια 0–5 με κινούμενα μόρια, ασκήσεις, quiz, «Φτιάξε την ταυτότητα» των ομόλογων σειρών και λεξικό.",
        href: "/mixalis/organiki1",
        study: "organiki1",
        plain: true,
        links: [
          { label: "0 · Πριν ξεκινήσεις", href: "/mixalis/organiki1#start" },
          { label: "1 · Εισαγωγή", href: "/mixalis/organiki1#ch1" },
          { label: "2 · Ομόλογες σειρές", href: "/mixalis/organiki1#ch2" },
          { label: "3 · Ονοματολογία", href: "/mixalis/organiki1#ch3" },
          { label: "4 · Ισομέρεια", href: "/mixalis/organiki1#ch4" },
          { label: "5 · Μοριακός τύπος", href: "/mixalis/organiki1#ch5" },
          { label: "Εργαστήριο", href: "/mixalis/organiki1#lab" },
          { label: "Τυπολόγιο", href: "/mixalis/organiki1#sheet" },
          { label: "Λεξικό", href: "/mixalis/organiki1#lexiko" },
        ],
      },
    ],
  },
];

function L({ href, plain, className, children }: { href: string; plain?: boolean; className: string; children: React.ReactNode }) {
  // The organic chemistry lesson is a standalone HTML route, so use a plain anchor for it.
  if (plain) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={false} className={className}>
      {children}
    </Link>
  );
}

export default async function MixalisDashboardPage() {
  const courses = await listPhysicsCourses();
  const lessonCount = SUBJECTS.reduce((n, s) => n + s.lessons.length, 0);

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">Β΄ Λυκείου</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Τα μαθήματα του Μιχάλη</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b625b] sm:text-base">
              {lessonCount} μαθήματα σε {SUBJECTS.length} αντικείμενα. Πάτησε ένα μάθημα για να το ανοίξεις ή μια ενότητα για να πας κατευθείαν εκεί.
            </p>
          </div>
          <form action="/mixalis/auth/logout" method="post">
            <button type="submit" className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-[#f7f4ef]">
              Αποσύνδεση
            </button>
          </form>
        </header>

        <StudyOverview />

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

              <div className="grid gap-5 md:grid-cols-2">
                {s.lessons.map((lesson) => (
                  <article key={lesson.href} className="flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                    <div className={`h-1.5 ${s.accent}`} />
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div>
                        <L href={lesson.href} plain={lesson.plain} className="group inline-flex items-baseline gap-2">
                          <h3 className="text-xl font-semibold tracking-tight group-hover:underline sm:text-2xl">{lesson.title}</h3>
                        </L>
                        <p className="mt-2 text-sm leading-6 text-[#6f665f] sm:text-base">{lesson.subtitle}</p>
                      </div>

                      {lesson.study ? <LessonProgress lesson={lesson.study} /> : null}

                      {lesson.links.length > 0 && (
                        <ul className="flex flex-wrap gap-2">
                          {lesson.links.map((link) => (
                            <li key={link.href}>
                              <L
                                href={link.href}
                                plain={lesson.plain}
                                className="inline-block rounded-full border border-black/10 bg-[#f7f4ef] px-3 py-1.5 text-sm font-medium text-[#4d4138] transition hover:bg-[#ece4da]"
                              >
                                {link.label}
                              </L>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-black/10 pt-4">
                        <L
                          href={lesson.href}
                          plain={lesson.plain}
                          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 ${s.accent}`}
                        >
                          Άνοιγμα μαθήματος →
                        </L>
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
            </section>
          ))}
        </div>

        <details className="mt-12 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
            Χώρος εργασίας (δημιουργία μαθημάτων Φυσικής)
          </summary>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/mixalis/sources"
              prefetch={false}
              className="rounded-xl bg-[#e9e0d5] px-4 py-2.5 text-sm font-semibold text-[#4d4138] transition hover:bg-[#ddd1c3]"
            >
              Βιβλιοθήκη πηγών
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/mixalis/courses/${course.code}`}
                prefetch={false}
                className="group flex flex-col rounded-2xl border border-black/10 bg-[#faf8f5] p-5 transition hover:shadow-md"
              >
                <span className="text-xs font-medium text-[#8a817a]">
                  {course.chapterCount} κεφάλαια · {course.subchapterCount} υποκεφάλαια
                </span>
                <span className="mt-2 text-lg font-semibold group-hover:text-[#6d5848]">{course.title}</span>
                <span className="mt-3 text-sm font-semibold text-[#5f5045]">Άνοιγμα →</span>
              </Link>
            ))}
          </div>
        </details>
      </div>
    </main>
  );
}
