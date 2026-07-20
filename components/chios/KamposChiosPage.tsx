import Image from "next/image";
import type { ReactNode } from "react";
import type { KamposChiosPageData } from "@/content/kampos-chios";

type KamposChiosPageProps = {
  data: KamposChiosPageData;
};

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost";
  external?: boolean;
  compact?: boolean;
};

const containerClass = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const kickerClass =
  "text-[0.68rem] font-black uppercase tracking-[0.2em] text-amber-700 sm:text-xs";
const headingClass =
  "text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.035em] text-stone-950 sm:text-4xl lg:text-5xl";
const bodyClass = "text-[0.98rem] leading-7 text-stone-600 sm:text-lg sm:leading-8";

function CtaLink({
  href,
  children,
  variant = "primary",
  external = false,
  compact = false,
}: CtaLinkProps) {
  const variants = {
    primary:
      "bg-stone-950 !text-white shadow-lg shadow-stone-950/15 hover:bg-amber-800",
    secondary:
      "border border-stone-300 bg-white !text-stone-950 shadow-sm hover:border-amber-700 hover:!text-amber-800",
    light:
      "bg-white !text-stone-950 shadow-lg shadow-black/20 hover:bg-amber-50",
    ghost:
      "border border-white/35 bg-white/10 !text-white backdrop-blur-sm hover:bg-white/20",
  } as const;

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full text-center font-extrabold transition duration-200 hover:-translate-y-0.5 ${
        compact
          ? "min-h-11 px-4 py-2.5 text-[0.78rem] sm:text-sm"
          : "min-h-12 px-5 py-3 text-sm sm:px-6 sm:text-base"
      } ${variants[variant]}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="!text-inherit">{children}</span>
    </a>
  );
}

export const greekKamposRooms = [
  {
    title: "Οικονομικά δίκλινα",
    subtitle: "Για 2 άτομα",
    description:
      "Οικονομική επιλογή για ζευγάρια που θέλουν ήσυχη διαμονή στον Κάμπο.",
    image: "/images/rooms/received_1753964631359257.webp",
    imageAlt: "Οικονομικό δίκλινο δωμάτιο στον Κάμπο της Χίου",
    href: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    badge: "Καλή τιμή",
    details: ["2 άτομα", "16 m²", "Ψυγείο"],
  },
  {
    title: "Ισόγεια δωμάτια",
    subtitle: "Δίκλινα και τρίκλινα",
    description:
      "Άμεση πρόσβαση στην αυλή και στον κήπο, χωρίς σκάλες.",
    image: "/images/rooms/double-triple-room.jpg",
    imageAlt: "Ισόγειο δωμάτιο με πρόσβαση στον κήπο του Voulamandis House",
    href: "/el/domatia-xios/diklina-triklina-domatia/",
    badge: "Κοντά στον κήπο",
    details: ["2–3 άτομα", "Ισόγειο", "Χωρίς σκάλες"],
  },
  {
    title: "Δωμάτια ορόφου",
    subtitle: "Δίκλινα και τρίκλινα",
    description:
      "Φωτεινά δωμάτια με κοινόχρηστη βεράντα και θέα στα εσπεριδοειδή.",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    imageAlt: "Δωμάτιο ορόφου με βεράντα στον Κάμπο της Χίου",
    href: "/el/domatia-xios/diklina-triklina-domatia/",
    badge: "Βεράντα & θέα",
    details: ["2–3 άτομα", "Όροφος", "Θέα"],
  },
  {
    title: "Οικογενειακά διαμερίσματα",
    subtitle: "Χώρος και κουζίνα",
    description:
      "Ανεξάρτητα διαμερίσματα με καθιστικό και πλήρη κουζίνα.",
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    imageAlt: "Οικογενειακό διαμέρισμα στον Κάμπο της Χίου",
    href: "/el/domatia-xios/oikogeneiako-diamerisma/",
    badge: "Για οικογένειες",
    details: ["Έως 4 άτομα", "40–45 m²", "Κουζίνα"],
  },
] as const;

export const greekKamposFaqs = [
  {
    question: "Γιατί να επιλέξω διαμονή στον Κάμπο της Χίου;",
    answer:
      "Ο Κάμπος συνδυάζει ησυχία, ιστορικό χαρακτήρα και φύση, ενώ παραμένει κοντά στην πόλη, το αεροδρόμιο και τις παραλίες.",
  },
  {
    question: "Υπάρχουν ενοικιαζόμενα δωμάτια μέσα στον Κάμπο;",
    answer:
      "Ναι. Το Voulamandis House διαθέτει οικονομικά δίκλινα, ισόγεια και δωμάτια ορόφου, καθώς και οικογενειακά διαμερίσματα με κουζίνα.",
  },
  {
    question: "Είναι ο Κάμπος κατάλληλος για οικογένειες;",
    answer:
      "Ναι. Η ήρεμη ατμόσφαιρα, ο κήπος, η δωρεάν στάθμευση και τα οικογενειακά διαμερίσματα τον κάνουν πρακτική επιλογή για διακοπές με παιδιά.",
  },
  {
    question: "Είναι καλή επιλογή για ζευγάρια;",
    answer:
      "Ταιριάζει σε ζευγάρια που προτιμούν ήρεμα πρωινά, βραδιές στη βεράντα και αυθεντική ατμόσφαιρα μακριά από τη φασαρία.",
  },
  {
    question: "Πόσο κοντά είναι οι παραλίες;",
    answer:
      "Η κοντινότερη παραλία βρίσκεται περίπου 1,5 χλμ. μακριά, ενώ ο Καρφάς, ο Μέγας Λιμνιώνας και οι παραλίες της νότιας Χίου προσεγγίζονται εύκολα με αυτοκίνητο.",
  },
  {
    question: "Χρειάζεται αυτοκίνητο για διαμονή στον Κάμπο;",
    answer:
      "Δεν είναι απαραίτητο για να απολαύσετε το κατάλυμα, αλλά διευκολύνει τις μετακινήσεις προς παραλίες, χωριά και αξιοθέατα. Διατίθεται δωρεάν στάθμευση.",
  },
] as const;

const greekBenefits = [
  {
    icon: "🌿",
    title: "Ησυχία",
    text: "Μακριά από τον θόρυβο, χωρίς να είστε απομονωμένοι.",
  },
  {
    icon: "🏛️",
    title: "Αυθεντικότητα",
    text: "Αρχοντικά, πέτρινες αυλόπορτες και ιστορία αιώνων.",
  },
  {
    icon: "🍊",
    title: "Περιβόλια",
    text: "Μανταρινιές, πορτοκαλιές και αρώματα εσπεριδοειδών.",
  },
  {
    icon: "💧",
    title: "Καλοκαιρινή δροσιά",
    text: "Δροσερά απογεύματα όταν ποτίζονται τα περιβόλια.",
  },
  {
    icon: "✦",
    title: "Βραδιές στη βεράντα",
    text: "Ησυχία και αστέρια, χωρίς βιασύνη και άγχος.",
  },
  {
    icon: "🏖️",
    title: "Κοντά στις παραλίες",
    text: "Εύκολη πρόσβαση στις ακτές της νότιας Χίου.",
  },
] as const;

const heroFacts = [
  ["1,5 χλμ.", "παραλία"],
  ["3 χλμ.", "αεροδρόμιο"],
  ["6 χλμ.", "πόλη & λιμάνι"],
  ["Δωρεάν", "parking"],
] as const;

function GreekKamposLanding({ data }: KamposChiosPageProps) {
  return (
    <main className="overflow-hidden bg-[#fbf7ef] text-stone-900">
      <section
        className="bg-gradient-to-br from-amber-50 via-[#f5ecde] to-stone-100 pt-20 sm:pt-28"
        aria-labelledby="kampos-landing-title"
      >
        <div
          className={`${containerClass} grid items-center gap-6 pb-7 sm:gap-10 sm:pb-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pb-16`}
        >
          <div>
            <p className={kickerClass}>Κάμπος Χίου · Voulamandis House</p>
            <h1
              id="kampos-landing-title"
              className="mt-3 max-w-4xl text-balance font-serif text-[2.45rem] font-semibold leading-[0.95] tracking-[-0.045em] text-stone-950 sm:mt-4 sm:text-6xl lg:text-7xl"
            >
              Διαμονή στον Κάμπο της Χίου
            </h1>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-stone-600 sm:mt-6 sm:text-xl sm:leading-9">
              Ήσυχα ενοικιαζόμενα δωμάτια και οικογενειακά διαμερίσματα ανάμεσα
              σε περιβόλια. Κοντά στις παραλίες και την πόλη, μακριά από τον
              θόρυβο και το άγχος.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:gap-3">
              <CtaLink href="/el/domatia-xios/" compact>
                Δείτε δωμάτια
              </CtaLink>
              <CtaLink
                href="/el/amesi-kratisi-voulamandis-house/"
                variant="secondary"
                compact
              >
                Τιμές & διαθεσιμότητα
              </CtaLink>
            </div>

            <ul className="mt-5 grid grid-cols-2 gap-2 sm:mt-7 sm:grid-cols-4">
              {heroFacts.map(([value, label]) => (
                <li
                  key={label}
                  className="rounded-2xl border border-white/80 bg-white/75 px-3 py-3 shadow-sm backdrop-blur"
                >
                  <strong className="block font-serif text-lg text-stone-950 sm:text-xl">
                    {value}
                  </strong>
                  <span className="block text-[0.7rem] font-semibold text-stone-500 sm:text-xs">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-xl shadow-stone-900/15 sm:aspect-[5/4] sm:rounded-[2.5rem] lg:aspect-[4/5]">
            <Image
              src="/images/voulamandis-house-og.jpg"
              alt="Voulamandis House και ενοικιαζόμενα δωμάτια στον Κάμπο της Χίου"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-stone-950/55 px-4 py-3 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-amber-200 sm:text-xs">
                Ζευγάρια & οικογένειες
              </span>
              <strong className="mt-1 block font-serif text-lg font-semibold sm:text-2xl">
                Ηρεμία στον ιστορικό Κάμπο
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section
        id="giati-kampos"
        className={`${containerClass} py-10 sm:py-20`}
        aria-labelledby="kampos-story-title"
      >
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className={kickerClass}>Διακοπές με διαφορετικό ρυθμό</p>
            <h2 id="kampos-story-title" className={`${headingClass} mt-3`}>
              Θυμάσαι πώς είναι η ζωή μακριά από το άγχος
            </h2>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            <p className={bodyClass}>
              Ο Κάμπος μυρίζει ιστορία, μανταρίνι και βρεγμένο χώμα. Πίσω από
              τους πέτρινους τοίχους κρύβονται αρχοντικά, στέρνες,
              μαγγανοπήγαδα και περιβόλια. Τα καλοκαιρινά απογεύματα δροσίζουν
              και τα βράδια περνούν στη βεράντα, κάτω από τα αστέρια.
            </p>
          </div>
        </div>
      </section>

      <section
        className="bg-[#e9e7dd] py-10 sm:py-20"
        aria-labelledby="kampos-benefits-title"
      >
        <div className={containerClass}>
          <div className="max-w-3xl">
            <p className={kickerClass}>Γιατί να μείνετε στον Κάμπο</p>
            <h2 id="kampos-benefits-title" className={`${headingClass} mt-3`}>
              Ηρεμία, αυθεντικότητα και εύκολη πρόσβαση
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-9 sm:grid-cols-3 lg:grid-cols-6">
            {greekBenefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm sm:p-5"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-base"
                  aria-hidden="true"
                >
                  {benefit.icon}
                </span>
                <h3 className="mt-3 font-serif text-[1.08rem] font-semibold leading-tight text-stone-950 sm:text-xl">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-[0.76rem] leading-5 text-stone-600 sm:text-sm sm:leading-6">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${containerClass} py-10 sm:py-20`}
        aria-labelledby="kampos-sensory-title"
      >
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-xl shadow-stone-900/10 sm:aspect-[4/3] sm:rounded-[2.5rem]">
            <Image
              src={data.gallery[1].image}
              alt={data.gallery[1].imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
          <div>
            <p className={kickerClass}>Μια εμπειρία που δεν αντιγράφεται</p>
            <h2 id="kampos-sensory-title" className={`${headingClass} mt-3`}>
              Αρχοντικά, περιβόλια και χιώτικο μανταρίνι
            </h2>
            <p className={`${bodyClass} mt-4`}>
              Μεγάλες αυλόπορτες, αψιδωτά ανοίγματα και πέτρινα σπίτια
              συνυπάρχουν με λεμονιές, πορτοκαλιές και μανταρινιές σε έναν
              προστατευόμενο ιστορικό τόπο.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Ιστορικός τόπος",
                "Θυμιανούσικη πέτρα",
                "Χιώτικο μανταρίνι",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="domatia-kampos"
        className="bg-stone-950 py-10 text-white sm:py-20"
        aria-labelledby="kampos-rooms-title"
      >
        <div className={containerClass}>
          <div className="max-w-3xl">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-amber-300 sm:text-xs">
              Ενοικιαζόμενα δωμάτια στον Κάμπο Χίου
            </p>
            <h2
              id="kampos-rooms-title"
              className="mt-3 text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl"
            >
              Επιλέξτε τη διαμονή που σας ταιριάζει
            </h2>
          </div>

          <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {greekKamposRooms.map((room) => (
              <article
                key={room.title}
                className="w-[82vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.07] sm:w-auto sm:max-w-none"
              >
                <a
                  className="relative block aspect-[16/10] overflow-hidden"
                  href={room.href}
                  aria-label={`Δείτε ${room.title}`}
                >
                  <Image
                    src={room.image}
                    alt={room.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[0.68rem] font-extrabold text-stone-950">
                    {room.badge}
                  </span>
                </a>
                <div className="p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-amber-300">
                    {room.subtitle}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[1.55rem] font-semibold leading-tight text-white">
                    {room.title}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {room.details.map((detail) => (
                      <li
                        key={detail}
                        className="rounded-full bg-white/10 px-2.5 py-1 text-[0.67rem] font-semibold text-stone-200"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm leading-6 text-stone-300">
                    {room.description}
                  </p>
                  <a
                    href={room.href}
                    className="mt-4 inline-flex !text-amber-300 text-sm font-extrabold"
                  >
                    Δείτε λεπτομέρειες&nbsp; →
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-sm leading-6 text-stone-300">
              Δεν είστε σίγουροι ποιο δωμάτιο σας ταιριάζει;
            </p>
            <CtaLink href="/el/domatia-xios/" variant="light" compact>
              Όλα τα δωμάτια
            </CtaLink>
          </div>
        </div>
      </section>

      <section
        id="topothesia"
        className={`${containerClass} py-10 sm:py-20`}
        aria-labelledby="kampos-location-title"
      >
        <div className="grid items-center gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <p className={kickerClass}>Κοντά στις παραλίες, μακριά από τον θόρυβο</p>
            <h2 id="kampos-location-title" className={`${headingClass} mt-3`}>
              Ήρεμη βάση για να γνωρίσετε τη Χίο
            </h2>
            <p className={`${bodyClass} mt-4`}>
              Απολαμβάνετε την ησυχία του Κάμπου και φτάνετε εύκολα στην πόλη,
              το αεροδρόμιο και τις κοντινές παραλίες.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7">
              {[
                ["1,5 χλμ.", "παραλία"],
                ["3 χλμ.", "αεροδρόμιο"],
                ["6 χλμ.", "πόλη & λιμάνι"],
                ["Εύκολα", "νότια Χίος"],
              ].map(([value, label]) => (
                <article
                  key={label}
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <strong className="block font-serif text-xl text-stone-950 sm:text-2xl">
                    {value}
                  </strong>
                  <span className="mt-0.5 block text-xs text-stone-500">
                    {label}
                  </span>
                </article>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3">
              <CtaLink href="/el/paralies-xios/" compact>
                Παραλίες Χίου
              </CtaLink>
              <CtaLink
                href="https://www.google.com/maps/search/?api=1&query=Voulamandis+House+Chios"
                variant="secondary"
                external
                compact
              >
                Ανοίξτε τον χάρτη
              </CtaLink>
            </div>
          </div>

          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-xl shadow-stone-900/10 md:block">
            <Image
              src={data.gallery[2].image}
              alt={data.gallery[2].imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 44vw"
            />
          </div>
        </div>
      </section>

      <section
        className="bg-[#e8eadf] py-10 sm:py-20"
        aria-labelledby="kampos-audience-title"
      >
        <div className={containerClass}>
          <p className={kickerClass}>Για ποιους είναι ιδανικός ο Κάμπος;</p>
          <h2 id="kampos-audience-title" className={`${headingClass} mt-3`}>
            Για ανθρώπους που θέλουν πραγματικές διακοπές
          </h2>

          <div className="-mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 [&::-webkit-scrollbar]:hidden">
            {[
              [
                "♥",
                "Ζευγάρια",
                "Ήρεμα πρωινά και βραδιές στη βεράντα.",
              ],
              [
                "⌂",
                "Οικογένειες",
                "Κήπος, parking και διαμερίσματα με κουζίνα.",
              ],
              [
                "☀",
                "Λάτρεις της ησυχίας",
                "Περιβόλια, σοκάκια και φυσικός ρυθμός.",
              ],
            ].map(([icon, title, text]) => (
              <article
                key={title}
                className="w-[72vw] max-w-[280px] shrink-0 snap-center rounded-2xl bg-white/80 p-5 shadow-sm sm:w-auto sm:max-w-none"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5b6040] text-lg text-white"
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-stone-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="istoria-kampou"
        className={`${containerClass} py-10 sm:py-20`}
        aria-labelledby="kampos-history-title"
      >
        <details className="group overflow-hidden rounded-[1.6rem] border border-stone-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center gap-4 p-4 sm:p-6 [&::-webkit-details-marker]:hidden">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36">
              <Image
                src={data.gallery[3].image}
                alt={data.gallery[3].imageAlt}
                fill
                className="object-cover"
                sizes="144px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className={kickerClass}>Η ιστορία του Κάμπου</p>
              <h2
                id="kampos-history-title"
                className="mt-1 font-serif text-xl font-semibold leading-tight text-stone-950 sm:text-3xl"
              >
                Ένας τόπος που διατηρεί τη μνήμη του
              </h2>
            </div>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>

          <div className="border-t border-stone-200 px-5 py-5 sm:px-7 sm:py-7">
            <div className="grid gap-4 text-sm leading-7 text-stone-600 sm:grid-cols-2 sm:text-base">
              <p>
                Από τον 14ο αιώνα, οικογένειες της Χίου και Γενουάτες ευγενείς
                δημιούργησαν πύργους, αρχοντικά και οργανωμένα κτήματα. Οι
                πέτρινοι τοίχοι προστάτευαν τα εσπεριδοειδή, ενώ πηγάδια,
                μάγγανοι, στέρνες και γούρνες εξασφάλιζαν το πότισμα.
              </p>
              <p>
                Παρά τις καταστροφές του 1822, τον παγετό του 1850 και τον
                σεισμό του 1881, ο Κάμπος συνέχισε να ζει και παραμένει ένα
                σπάνιο πολιτιστικό τοπίο.
              </p>
            </div>
            <blockquote className="mt-5 rounded-2xl border-l-4 border-amber-700 bg-[#fbf7ef] p-4 font-serif text-lg leading-7 text-stone-800">
              Εδώ δεν επισκέπτεστε απλώς ένα αξιοθέατο. Ξυπνάτε και κοιμάστε
              μέσα σε αυτό το τοπίο.
            </blockquote>
          </div>
        </details>
      </section>

      <section
        id="syxnes-erotiseis"
        className="bg-white py-10 sm:py-20"
        aria-labelledby="kampos-faq-title"
      >
        <div className={containerClass}>
          <div className="max-w-3xl">
            <p className={kickerClass}>Χρήσιμες πληροφορίες</p>
            <h2 id="kampos-faq-title" className={`${headingClass} mt-3`}>
              Συχνές ερωτήσεις για διαμονή στον Κάμπο
            </h2>
          </div>

          <div className="mt-6 divide-y divide-stone-200 rounded-[1.5rem] border border-stone-200 bg-[#fbf7ef] px-4 sm:px-7">
            {greekKamposFaqs.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[1.04rem] font-semibold leading-snug text-stone-950 sm:text-xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-1 pt-3 text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-7 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] bg-stone-950 px-5 py-8 text-white shadow-xl shadow-stone-900/15 sm:rounded-[2.5rem] sm:px-10 sm:py-14">
          <Image
            src="/images/kampos/kampos-chios-citrus-estate.webp"
            alt="Περιβόλι εσπεριδοειδών στον Κάμπο της Χίου"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-900/55" />
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-amber-300 sm:text-xs">
                Voulamandis House · Κάμπος Χίου
              </p>
              <h2 className="mt-3 text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                Κοντά σε όλα, μακριά από το άγχος
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-200 sm:text-lg sm:leading-8">
                Επιλέξτε δωμάτιο ή οικογενειακό διαμέρισμα και ζήστε τη Χίο
                μέσα από την ηρεμία του Κάμπου.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:flex">
              <CtaLink
                href="/el/amesi-kratisi-voulamandis-house/"
                variant="light"
                compact
              >
                Τιμές & διαθεσιμότητα
              </CtaLink>
              <CtaLink href="/el/domatia-xios/" variant="ghost" compact>
                Δείτε δωμάτια
              </CtaLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StandardKamposPage({ data }: KamposChiosPageProps) {
  return (
    <main className="overflow-hidden bg-[#fbf7ef] text-stone-900">
      <section className="bg-gradient-to-br from-amber-50 via-[#f5ecde] to-stone-100 pt-20 sm:pt-28">
        <div
          className={`${containerClass} grid items-center gap-7 pb-10 sm:gap-10 sm:pb-16 lg:grid-cols-2 lg:gap-16`}
        >
          <div>
            <p className={kickerClass}>{data.hero.kicker}</p>
            <h1 className="mt-3 text-balance font-serif text-[2.45rem] font-semibold leading-[0.95] tracking-[-0.045em] text-stone-950 sm:text-6xl lg:text-7xl">
              {data.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:mt-6 sm:text-xl sm:leading-9">
              {data.hero.description}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex sm:gap-3">
              <CtaLink href={data.hero.primaryCta.href} compact>
                {data.hero.primaryCta.label}
              </CtaLink>
              <CtaLink href={data.hero.secondaryCta.href} variant="secondary" compact>
                {data.hero.secondaryCta.label}
              </CtaLink>
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-xl shadow-stone-900/15 sm:aspect-[4/3] sm:rounded-[2.5rem]">
            <Image
              src={data.hero.image}
              alt={data.hero.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
        </div>
      </section>

      <section className={`${containerClass} py-10 sm:py-20`}>
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className={kickerClass}>Why it matters</p>
            <h2 className={`${headingClass} mt-3`}>{data.intro.title}</h2>
          </div>
          <div className="space-y-4 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
            {data.intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className={bodyClass}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e9e7dd] py-10 sm:py-20">
        <div className={containerClass}>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {data.highlights.map((item) => (
              <article
                key={`${item.label}-${item.value}`}
                className="rounded-2xl bg-white/85 p-4 shadow-sm sm:p-6"
              >
                <span className="block text-[0.68rem] font-black uppercase tracking-[0.16em] text-amber-700">
                  {item.label}
                </span>
                <strong className="mt-2 block font-serif text-lg text-stone-950 sm:text-2xl">
                  {item.value}
                </strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${containerClass} py-10 sm:py-20`}>
        <div className="space-y-8 sm:space-y-14">
          {data.sections.map((section, index) => (
            <article
              key={section.title}
              className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14"
            >
              <div
                className={`relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-xl shadow-stone-900/10 sm:aspect-[4/3] sm:rounded-[2.5rem] ${
                  index % 2 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                />
              </div>
              <div>
                <span className="text-xs font-black tracking-[0.18em] text-amber-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className={`${headingClass} mt-3`}>{section.title}</h2>
                <p className={`${bodyClass} mt-4`}>{section.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] bg-stone-950 px-5 py-8 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-14">
          <Image
            src={data.gallery[1]?.image || data.hero.image}
            alt={data.gallery[1]?.imageAlt || data.hero.imageAlt}
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-stone-950/75" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-amber-300">
              {data.stay.kicker}
            </p>
            <h2 className="mt-3 font-serif text-[2rem] font-semibold leading-[1.02] text-white sm:text-4xl">
              {data.stay.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-200 sm:text-lg sm:leading-8">
              {data.stay.text}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex">
              <CtaLink href={data.stay.primaryCta.href} variant="light" compact>
                {data.stay.primaryCta.label}
              </CtaLink>
              <CtaLink href={data.stay.secondaryCta.href} variant="ghost" compact>
                {data.stay.secondaryCta.label}
              </CtaLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function KamposChiosPage({ data }: KamposChiosPageProps) {
  if (data.language === "el") {
    return <GreekKamposLanding data={data} />;
  }

  return <StandardKamposPage data={data} />;
}
