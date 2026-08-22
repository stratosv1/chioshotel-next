import Link from "next/link";
import { listPhysicsCourses } from "@/lib/mixalis/db";

const courseDescriptions: Record<string, string> = {
  general_education:
    "Ηλεκτρισμός, φως και ατομικά φαινόμενα οργανωμένα σύμφωνα με το επίσημο σχολικό βιβλίο.",
  orientation:
    "Καμπυλόγραμμες κινήσεις, ορμή, αέρια, θερμοδυναμική και ηλεκτρικό πεδίο.",
};

export default async function MixalisDashboardPage() {
  const courses = await listPhysicsCourses();
  const chapterCount = courses.reduce((total, course) => total + course.chapterCount, 0);
  const subchapterCount = courses.reduce(
    (total, course) => total + course.subchapterCount,
    0,
  );
  const materialBatchCount = courses.reduce(
    (total, course) => total + course.materialBatchCount,
    0,
  );

  return (
    <main className="min-h-screen bg-[#f3efe8] px-4 py-5 text-[#2c2825] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#857261]">
              Physics Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Φυσική Β΄ Λυκείου
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b625b] sm:text-base">
              Δύο ξεχωριστά μαθήματα, με τη δική τους ύλη, κεφάλαια, υποκεφάλαια και πηγές. Διάλεξε πρώτα ποια Φυσική θέλεις να ανοίξεις.
            </p>
          </div>

          <form action="/mixalis/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-[#f7f4ef]"
            >
              Αποσύνδεση
            </button>
          </form>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-[#ded4c7] p-5">
            <p className="text-sm text-[#64584e]">Μαθήματα Φυσικής</p>
            <p className="mt-2 text-3xl font-semibold">{courses.length}</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-sm text-[#736a63]">Κεφάλαια / Υποκεφάλαια</p>
            <p className="mt-2 text-3xl font-semibold">
              {chapterCount} / {subchapterCount}
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-sm text-[#736a63]">Προσθήκες υλικού</p>
            <p className="mt-2 text-3xl font-semibold">{materialBatchCount}</p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#857261]">
              Μαθήματα
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Διάλεξε Φυσική</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/mixalis/courses/${course.code}`}
                className="group flex min-h-72 flex-col rounded-3xl border border-black/10 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f1ede7] px-3 py-1 text-xs font-semibold text-[#74665b]">
                    {course.chapterCount} κεφάλαια
                  </span>
                  <span className="text-xs font-medium text-[#8a817a]">
                    {course.subchapterCount} υποκεφάλαια
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-semibold tracking-tight transition group-hover:text-[#6d5848] sm:text-3xl">
                  {course.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-6 text-[#6f665f] sm:text-base">
                  {courseDescriptions[course.code]}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5">
                  <span className="text-sm text-[#7d7269]">
                    {course.materialBatchCount} προσθήκες υλικού
                  </span>
                  <span className="text-sm font-semibold text-[#5f5045]">
                    Άνοιγμα →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
