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
};

const containerClass = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const kickerClass =
  "text-xs font-black uppercase tracking-[0.22em] text-amber-700 sm:text-sm";
const headingClass =
  "text-balance font-serif text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-stone-950 sm:text-4xl lg:text-5xl";
const bodyClass = "text-base leading-8 text-stone-600 sm:text-lg";

function CtaLink({
  href,
  children,
  variant = "primary",
  external = false,
}: CtaLinkProps) {
  const variants = {
    primary:
      "bg-stone-900 text-white shadow-lg shadow-stone-950/15 hover:-translate-y-0.5 hover:bg-amber-800",
    secondary:
      "border border-stone-300 bg-white/80 text-stone-900 shadow-sm hover:-translate-y-0.5 hover:border-amber-700 hover:text-amber-800",
    light:
      "bg-white text-stone-950 shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:bg-amber-50",
    ghost:
      "border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white/20",
  } as const;

  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-center text-sm font-extrabold transition duration-200 sm:text-base ${variants[variant]}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export const greekKamposRooms = [
  {
    title: "Οικονομικά δίκλινα",
    subtitle: "Για 2 άτομα",
    description:
      "Μια προσεγμένη και οικονομική επιλογή για ζευγάρια που θέλουν ήσυχη διαμονή στον Κάμπο.",
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
      "Άμεση πρόσβαση στην αυλή και στον κήπο, χωρίς σκάλες, για εύκολες και χαλαρές διακοπές.",
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
      "Φωτεινά δωμάτια με κοινόχρηστη βεράντα και θέα προς το κτήμα και τα εσπεριδοειδή.",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    imageAlt: "Δωμάτιο ορόφου με βεράντα στον Κάμπο της Χίου",
    href: "/el/domatia-xios/diklina-triklina-domatia/",
    badge: "Βεράντα & θέα",
    details: ["2–3 άτομα", "Όροφος", "Θέα"],
  },
  {
    title: "Οικογενειακά διαμερίσματα",
    subtitle: "Περισσότερος χώρος και κουζίνα",
    description:
      "Ανεξάρτητα διαμερίσματα για οικογένειες που χρειάζονται άνεση, καθιστικό και πλήρη κουζίνα.",
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
      "Ο Κάμπος συνδυάζει ησυχία, ιστορικό χαρακτήρα και φύση, ενώ παραμένει κοντά στην πόλη, το αεροδρόμιο και τις παραλίες. Είναι ιδανικός για όσους θέλουν να εξερευνούν τη Χίο την ημέρα και να επιστρέφουν το βράδυ σε ένα ήρεμο περιβάλλον.",
  },
  {
    question: "Υπάρχουν ενοικιαζόμενα δωμάτια μέσα στον Κάμπο;",
    answer:
      "Ναι. Το Voulamandis House βρίσκεται στον ιστορικό Κάμπο και διαθέτει οικονομικά δίκλινα, ισόγεια και δωμάτια ορόφου, καθώς και οικογενειακά διαμερίσματα με κουζίνα.",
  },
  {
    question: "Είναι ο Κάμπος κατάλληλος για οικογένειες;",
    answer:
      "Ναι. Η ήρεμη ατμόσφαιρα, ο κήπος, η δωρεάν στάθμευση και τα οικογενειακά διαμερίσματα κάνουν την περιοχή πρακτική επιλογή για διακοπές με παιδιά.",
  },
  {
    question: "Είναι καλή επιλογή για ζευγάρια;",
    answer:
      "Ο Κάμπος ταιριάζει ιδιαίτερα σε ζευγάρια που προτιμούν ήρεμα πρωινά, βραδιές στη βεράντα, αυθεντική αρχιτεκτονική και διαμονή μακριά από τη φασαρία.",
  },
  {
    question: "Πόσο κοντά είναι οι παραλίες;",
    answer:
      "Η κοντινότερη παραλία βρίσκεται περίπου 1,5 χλμ. από το Voulamandis House, ενώ ο Καρφάς, ο Μέγας Λιμνιώνας και άλλες παραλίες της νότιας Χίου προσεγγίζονται εύκολα με αυτοκίνητο.",
  },
  {
    question: "Χρειάζεται αυτοκίνητο για διαμονή στον Κάμπο;",
    answer:
      "Το αυτοκίνητο δεν είναι απαραίτητο για να απολαύσετε το κατάλυμα, αλλά κάνει πολύ πιο εύκολες τις μετακινήσεις προς παραλίες, χωριά και αξιοθέατα. Στο Voulamandis House διατίθεται δωρεάν χώρος στάθμευσης.",
  },
] as const;

const greekBenefits = [
  {
    icon: "🌿",
    title: "Ησυχία χωρίς απομόνωση",
    text: "Μακριά από τον θόρυβο και την ένταση της πόλης, αλλά σε μικρή απόσταση από όσα χρειάζεστε.",
  },
  {
    icon: "🏛️",
    title: "Αυθεντική διαμονή",
    text: "Μένεις σε έναν ιστορικό τόπο με αρχοντικά, πέτρινες αυλόπορτες, στέρνες και μαγγανοπήγαδα.",
  },
  {
    icon: "🍊",
    title: "Περιβόλια και αρώματα",
    text: "Μανταρινιές, πορτοκαλιές και λεμονιές δημιουργούν την ατμόσφαιρα που έκανε τον Κάμπο γνωστό.",
  },
  {
    icon: "💧",
    title: "Καλοκαιρινή δροσιά",
    text: "Όταν ποτίζονται τα περιβόλια, το βρεγμένο χώμα και η βλάστηση δροσίζουν τα απογεύματα.",
  },
  {
    icon: "✦",
    title: "Βραδιές κάτω από τα αστέρια",
    text: "Η βεράντα και ο κήπος γίνονται το πιο ήρεμο σημείο της ημέρας, χωρίς βιασύνη και χωρίς άγχος.",
  },
  {
    icon: "🏖️",
    title: "Κοντά στις παραλίες",
    text: "Εύκολη πρόσβαση σε κοντινές ακτές και στις παραλίες της νότιας Χίου, χωρίς να μένεις μέσα στην πολυκοσμία.",
  },
] as const;

const heroFacts = [
  ["1,5 χλμ.", "από παραλία"],
  ["3 χλμ.", "από αεροδρόμιο"],
  ["6 χλμ.", "από πόλη & λιμάνι"],
  ["Δωρεάν", "χώρος στάθμευσης"],
] as const;

function GreekKamposLanding({ data }: KamposChiosPageProps) {
  return (
    <main className="overflow-hidden bg-[#fbf7ef] text-stone-900">
      <section
        className="relative isolate overflow-hidden bg-gradient-to-br from-amber-50 via-[#f7efe1] to-stone-100 pt-24 sm:pt-28 lg:pt-32"
        aria-labelledby="kampos-landing-title"
      >
        <div className="absolute -left-24 top-28 -z-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute -right-28 bottom-10 -z-10 h-96 w-96 rounded-full bg-emerald-900/10 blur-3xl" />

        <div className={`${containerClass} grid items-center gap-10 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-16`}>
          <div className="py-4 lg:py-10">
            <p className={kickerClass}>Κάμπος Χίου · Voulamandis House</p>
            <h1
              id="kampos-landing-title"
              className="mt-4 max-w-4xl text-balance font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-stone-950 sm:text-6xl lg:text-7xl"
            >
              Διαμονή στον Κάμπο της Χίου
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">
              Ήσυχα ενοικιαζόμενα δωμάτια και οικογενειακά διαμερίσματα μέσα
              στον ιστορικό Κάμπο, ανάμεσα σε περιβόλια εσπεριδοειδών. Κοντά
              στις παραλίες και την πόλη, μακριά από τον θόρυβο και το άγχος.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/el/domatia-xios/">Δείτε δωμάτια</CtaLink>
              <CtaLink href="/el/amesi-kratisi-voulamandis-house/" variant="secondary">
                Τιμές & διαθεσιμότητα
              </CtaLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-sm font-bold text-stone-700">
              {["Για ζευγάρια", "Για οικογένειες", "Μέσα στη φύση", "Απευθείας κράτηση"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-stone-300/80 bg-white/70 px-4 py-2 backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative pb-12 lg:pb-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200 shadow-2xl shadow-stone-900/20 sm:aspect-[5/4] lg:aspect-[4/5] lg:rounded-[2.75rem]">
              <Image
                src="/images/voulamandis-house-og.jpg"
                alt="Voulamandis House και ενοικιαζόμενα δωμάτια στον Κάμπο της Χίου"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/25 bg-stone-950/45 p-5 text-white backdrop-blur-md sm:inset-x-7 sm:bottom-7">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                  Για ζευγάρια & οικογένειες
                </span>
                <strong className="mt-2 block font-serif text-2xl font-semibold">
                  Ηρεμία στον ιστορικό Κάμπο
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className={`${containerClass} relative z-10 -mb-10`}>
          <ul className="grid overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-xl shadow-stone-900/10 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
            {heroFacts.map(([value, label], index) => (
              <li
                key={label}
                className={`p-5 sm:p-6 ${index ? "border-t border-stone-200 sm:border-l sm:border-t-0" : ""} ${index === 2 ? "sm:border-l-0 lg:border-l" : ""}`}
              >
                <strong className="block font-serif text-2xl text-stone-950">{value}</strong>
                <span className="mt-1 block text-sm font-semibold text-stone-500">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-16 sm:pt-20">
        <nav
          className={`${containerClass} flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          aria-label="Περιεχόμενα σελίδας"
        >
          {[
            ["#giati-kampos", "Γιατί Κάμπος"],
            ["#domatia-kampos", "Δωμάτια"],
            ["#topothesia", "Τοποθεσία"],
            ["#istoria-kampou", "Ιστορία"],
            ["#syxnes-erotiseis", "Συχνές ερωτήσεις"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-amber-700 hover:text-amber-800"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <section
        id="giati-kampos"
        className={`${containerClass} scroll-mt-28 py-16 sm:py-24`}
        aria-labelledby="kampos-story-title"
      >
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className={kickerClass}>Διακοπές με διαφορετικό ρυθμό</p>
            <h2 id="kampos-story-title" className={`${headingClass} mt-4`}>
              Στον Κάμπο θυμάσαι πώς ήταν η ζωή μακριά από το άγχος
            </h2>
          </div>
          <div className="space-y-5">
            <p className={bodyClass}>
              Ο Κάμπος της Χίου δεν είναι απλώς μια τοποθεσία για διαμονή. Είναι
              ένας τόπος που μυρίζει ιστορία, μανταρίνι και βρεγμένο χώμα. Πίσω
              από τους ψηλούς τοίχους από θυμιανούσικη πέτρα κρύβονται αρχοντικά,
              βοτσαλωτές αυλές, παλιές στέρνες, γούρνες, μαγγανοπήγαδα και
              περιβόλια που καλλιεργούνται εδώ και αιώνες.
            </p>
            <p className={bodyClass}>
              Τα απογεύματα του καλοκαιριού, όταν ποτίζονται τα περιβόλια, ο
              αέρας δροσίζει και γεμίζει αρώματα. Τα βράδια περνούν στη βεράντα
              του δωματίου, κάτω από τα αστέρια, χωρίς φασαρία και χωρίς βιασύνη.
              Εδώ οι διακοπές αποκτούν ξανά τον χρόνο που τους αξίζει.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#eee6d7] py-16 sm:py-24" aria-labelledby="kampos-benefits-title">
        <div className={containerClass}>
          <div className="mx-auto max-w-3xl text-center">
            <p className={kickerClass}>Τα οφέλη της διαμονής στον Κάμπο</p>
            <h2 id="kampos-benefits-title" className={`${headingClass} mt-4`}>
              Ηρεμία, αυθεντικότητα και εύκολη πρόσβαση στη Χίο
            </h2>
            <p className={`${bodyClass} mt-5`}>
              Ιδανικός για ζευγάρια και οικογένειες που αγαπούν τη φύση και
              θέλουν να μένουν κοντά στις παραλίες, όχι όμως μέσα στον θόρυβο.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {greekBenefits.map((benefit) => (
              <article
                key={benefit.title}
                className="group rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10 sm:p-7"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-xl transition group-hover:scale-105"
                  aria-hidden="true"
                >
                  {benefit.icon}
                </span>
                <h3 className="mt-5 font-serif text-2xl font-semibold text-stone-950">
                  {benefit.title}
                </h3>
                <p className="mt-3 leading-7 text-stone-600">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${containerClass} py-16 sm:py-24`} aria-labelledby="kampos-sensory-title">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-stone-900/15 lg:aspect-[4/5] lg:rounded-[2.5rem]">
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
            <h2 id="kampos-sensory-title" className={`${headingClass} mt-4`}>
              Αρχοντικά, περιβόλια και το άρωμα του μανταρινιού της Χίου
            </h2>
            <div className="mt-6 space-y-5">
              <p className={bodyClass}>
                Ο Κάμπος είναι ένας προστατευόμενος ιστορικός τόπος και
                παραδοσιακός οικισμός. Η αρχιτεκτονική του γεννήθηκε από τη
                συνάντηση της τοπικής παράδοσης με τις επιρροές των Γενουατών και
                των αρχοντικών οικογενειών της Χίου.
              </p>
              <p className={bodyClass}>
                Μεγάλες αυλόπορτες, αψιδωτά ανοίγματα, μαρμάρινες στοές και
                πέτρινα σπίτια συνυπάρχουν με τα περιβόλια. Το περίφημο χιώτικο
                μανταρίνι, οι λεμονιές και οι πορτοκαλιές είναι μέρος της
                ταυτότητας του τόπου.
              </p>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {["Ιστορικός τόπος", "Παραδοσιακός οικισμός", "Θυμιανούσικη πέτρα", "Χιώτικο μανταρίνι"].map(
                (item) => (
                  <div key={item} className="rounded-2xl bg-white p-4 text-sm font-bold text-stone-700 shadow-sm">
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="domatia-kampos"
        className="scroll-mt-28 bg-stone-950 py-16 text-white sm:py-24"
        aria-labelledby="kampos-rooms-title"
      >
        <div className={containerClass}>
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300 sm:text-sm">
              Ενοικιαζόμενα δωμάτια στον Κάμπο Χίου
            </p>
            <h2
              id="kampos-rooms-title"
              className="mt-4 text-balance font-serif text-3xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-4xl lg:text-5xl"
            >
              Βρείτε τη διαμονή που ταιριάζει στις διακοπές σας
            </h2>
            <p className="mt-5 text-base leading-8 text-stone-300 sm:text-lg">
              Από οικονομικά δίκλινα για ζευγάρια έως άνετα οικογενειακά
              διαμερίσματα, όλες οι επιλογές βρίσκονται μέσα στο ήρεμο περιβάλλον
              του Voulamandis House.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {greekKamposRooms.map((room) => (
              <article
                key={room.title}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1]"
              >
                <a
                  className="relative block aspect-[4/3] overflow-hidden"
                  href={room.href}
                  aria-label={`Δείτε ${room.title}`}
                >
                  <Image
                    src={room.image}
                    alt={room.imageAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-stone-900 backdrop-blur-sm">
                    {room.badge}
                  </span>
                </a>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
                    {room.subtitle}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">{room.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {room.details.map((detail) => (
                      <li key={detail} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-stone-200">
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-stone-300">{room.description}</p>
                  <a href={room.href} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-amber-300 transition group-hover:gap-3">
                    Δείτε λεπτομέρειες <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 sm:flex-row sm:items-center">
            <div>
              <strong className="block font-serif text-xl">Δεν είστε σίγουροι ποιο δωμάτιο σας ταιριάζει;</strong>
              <span className="mt-1 block text-sm leading-6 text-stone-300">
                Δείτε όλες τις επιλογές ανάλογα με τα άτομα, τον όροφο και τον χώρο.
              </span>
            </div>
            <CtaLink href="/el/domatia-xios/" variant="light">Όλα τα δωμάτια</CtaLink>
          </div>
        </div>
      </section>

      <section
        id="topothesia"
        className={`${containerClass} scroll-mt-28 py-16 sm:py-24`}
        aria-labelledby="kampos-location-title"
      >
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div>
            <p className={kickerClass}>Κοντά στις παραλίες, μακριά από τον θόρυβο</p>
            <h2 id="kampos-location-title" className={`${headingClass} mt-4`}>
              Μια ήρεμη βάση για να γνωρίσετε ολόκληρη τη Χίο
            </h2>
            <p className={`${bodyClass} mt-6`}>
              Το Voulamandis House βρίσκεται σε σημείο που σας επιτρέπει να
              απολαμβάνετε την ησυχία του Κάμπου και παράλληλα να φτάνετε εύκολα
              στην πόλη, το αεροδρόμιο και τις κοντινές παραλίες.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["1,5 χλμ.", "κοντινότερη παραλία"],
                ["3 χλμ.", "αεροδρόμιο Χίου"],
                ["6 χλμ.", "πόλη και λιμάνι"],
                ["Εύκολη πρόσβαση", "Καρφάς, Μέγας Λιμνιώνας & νότια Χίος"],
              ].map(([value, label]) => (
                <article key={label} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                  <strong className="block font-serif text-2xl text-stone-950">{value}</strong>
                  <span className="mt-1 block text-sm leading-6 text-stone-500">{label}</span>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/el/paralies-xios/">Δείτε τις παραλίες της Χίου</CtaLink>
              <CtaLink
                href="https://www.google.com/maps/search/?api=1&query=Voulamandis+House+Chios"
                variant="secondary"
                external
              >
                Ανοίξτε τον χάρτη
              </CtaLink>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-stone-900/15 lg:aspect-[4/5] lg:rounded-[2.5rem]">
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

      <section className="bg-[#e8eadf] py-16 sm:py-24" aria-labelledby="kampos-audience-title">
        <div className={containerClass}>
          <div className="mx-auto max-w-3xl text-center">
            <p className={kickerClass}>Για ποιους είναι ιδανικός ο Κάμπος;</p>
            <h2 id="kampos-audience-title" className={`${headingClass} mt-4`}>
              Για ανθρώπους που θέλουν πραγματικές διακοπές
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["♥", "Ζευγάρια", "Ήρεμα πρωινά, βραδιές στη βεράντα και αυθεντική ατμόσφαιρα μακριά από την πολυκοσμία."],
              ["⌂", "Οικογένειες", "Περισσότερος χώρος, κήπος, δωρεάν parking και διαμερίσματα με κουζίνα για άνετες διακοπές."],
              ["☀", "Λάτρεις της ησυχίας", "Για όσους προτιμούν τα περιβόλια, τα ήσυχα σοκάκια και τον φυσικό ρυθμό ενός ιστορικού τόπου."],
            ].map(([icon, title, text]) => (
              <article key={title} className="rounded-[1.75rem] bg-white/75 p-7 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#5b6040] text-2xl text-white" aria-hidden="true">
                  {icon}
                </span>
                <h3 className="mt-5 font-serif text-2xl font-semibold text-stone-950">{title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="istoria-kampou"
        className={`${containerClass} scroll-mt-28 py-16 sm:py-24`}
        aria-labelledby="kampos-history-title"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-stone-900/15 lg:aspect-[4/5] lg:rounded-[2.5rem]">
            <Image
              src={data.gallery[3].image}
              alt={data.gallery[3].imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
          </div>
          <div>
            <p className={kickerClass}>Η ιστορία του Κάμπου</p>
            <h2 id="kampos-history-title" className={`${headingClass} mt-4`}>
              Ένας τόπος που διατηρεί τη μνήμη και τον χαρακτήρα του
            </h2>
            <div className="mt-6 space-y-5">
              <p className={bodyClass}>
                Από τον 14ο αιώνα, οικογένειες της Χίου και Γενουάτες ευγενείς
                δημιούργησαν στον Κάμπο πύργους, αρχοντικές κατοικίες και
                οργανωμένα κτήματα. Οι ψηλοί πέτρινοι τοίχοι προστάτευαν τα
                εσπεριδοειδή, ενώ τα πηγάδια, οι μάγγανοι, οι στέρνες και οι
                γούρνες εξασφάλιζαν το πότισμα.
              </p>
              <p className={bodyClass}>
                Παρά τις καταστροφές του 1822, τον παγετό του 1850 και τον σεισμό
                του 1881, ο Κάμπος συνέχισε να ζει. Σήμερα παραμένει ένα σπάνιο
                πολιτιστικό τοπίο, όπου η κατοικία, η γεωργία και η φιλοξενία
                συνυπάρχουν.
              </p>
            </div>
            <blockquote className="mt-7 rounded-3xl border-l-4 border-amber-700 bg-white p-6 font-serif text-xl leading-8 text-stone-800 shadow-sm">
              Η διαμονή εδώ δεν είναι μια απλή επίσκεψη σε αξιοθέατο. Είναι η
              ευκαιρία να ξυπνάτε και να κοιμάστε μέσα σε αυτό το τοπίο.
            </blockquote>
          </div>
        </div>
      </section>

      <section
        id="syxnes-erotiseis"
        className="scroll-mt-28 bg-white py-16 sm:py-24"
        aria-labelledby="kampos-faq-title"
      >
        <div className={`${containerClass} grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20`}>
          <div>
            <p className={kickerClass}>Χρήσιμες πληροφορίες</p>
            <h2 id="kampos-faq-title" className={`${headingClass} mt-4`}>
              Συχνές ερωτήσεις για διαμονή στον Κάμπο της Χίου
            </h2>
          </div>

          <div className="divide-y divide-stone-200 rounded-[1.75rem] border border-stone-200 bg-[#fbf7ef] px-5 sm:px-7">
            {greekKamposFaqs.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-serif text-lg font-semibold text-stone-950 sm:text-xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-900 text-lg text-white transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-2 pt-4 leading-7 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-stone-950 px-6 py-12 text-white shadow-2xl shadow-stone-900/20 sm:px-10 sm:py-16 lg:rounded-[2.75rem] lg:px-16">
          <Image
            src="/images/kampos/kampos-chios-citrus-estate.webp"
            alt="Περιβόλι εσπεριδοειδών στον Κάμπο της Χίου"
            fill
            className="object-cover opacity-35"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-900/45" />
          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300 sm:text-sm">
                Voulamandis House · Κάμπος Χίου
              </p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Μείνετε κοντά σε όλα, αλλά μακριά από το άγχος
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-200 sm:text-lg">
                Επιλέξτε δωμάτιο ή οικογενειακό διαμέρισμα και ζήστε τη Χίο μέσα
                από την ηρεμία, τα αρώματα και την ιστορία του Κάμπου.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <CtaLink href="/el/amesi-kratisi-voulamandis-house/" variant="light">
                Τιμές & διαθεσιμότητα
              </CtaLink>
              <CtaLink href="/el/domatia-xios/" variant="ghost">Δείτε τα δωμάτια</CtaLink>
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
      <section className="bg-gradient-to-br from-amber-50 via-[#f7efe1] to-stone-100 pt-24 sm:pt-28 lg:pt-32">
        <div className={`${containerClass} grid items-center gap-10 pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-24`}>
          <div>
            <p className={kickerClass}>{data.hero.kicker}</p>
            <h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-stone-950 sm:text-6xl lg:text-7xl">
              {data.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">
              {data.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={data.hero.primaryCta.href}>{data.hero.primaryCta.label}</CtaLink>
              <CtaLink href={data.hero.secondaryCta.href} variant="secondary">
                {data.hero.secondaryCta.label}
              </CtaLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-stone-900/20 lg:aspect-[4/5] lg:rounded-[2.75rem]">
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

      <section className={`${containerClass} py-16 sm:py-24`}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className={kickerClass}>{data.language === "el" ? "Γιατί αξίζει" : "Why it matters"}</p>
            <h2 className={`${headingClass} mt-4`}>{data.intro.title}</h2>
          </div>
          <div className="space-y-5">
            {data.intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className={bodyClass}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.highlights.map((item) => (
            <article key={`${item.label}-${item.value}`} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-stone-500">{item.label}</span>
              <strong className="mt-2 block font-serif text-xl text-stone-950">{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#eee6d7] py-16 sm:py-24">
        <div className={`${containerClass} space-y-16 sm:space-y-24`}>
          {data.sections.map((section, index) => (
            <article key={section.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl shadow-stone-900/10 ${index % 2 ? "lg:order-2" : ""}`}>
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 46vw"
                />
              </div>
              <div>
                <span className="text-sm font-black tracking-[0.2em] text-amber-700">{String(index + 1).padStart(2, "0")}</span>
                <h2 className={`${headingClass} mt-4`}>{section.title}</h2>
                <p className={`${bodyClass} mt-5`}>{section.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${containerClass} py-16 sm:py-24`} aria-label="Kampos Chios gallery">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.gallery.map((item) => (
            <figure key={item.image} className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg shadow-stone-900/10">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-stone-950 px-6 py-12 text-white sm:px-10 sm:py-16 lg:rounded-[2.75rem] lg:px-16">
          <Image
            src="/images/kampos/kampos-chios-citrus-estate.webp"
            alt={data.hero.imageAlt}
            fill
            className="object-cover opacity-35"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-900/45" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300 sm:text-sm">{data.stay.kicker}</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-4xl lg:text-5xl">{data.stay.title}</h2>
            <p className="mt-5 text-base leading-8 text-stone-200 sm:text-lg">{data.stay.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={data.stay.primaryCta.href} variant="light">{data.stay.primaryCta.label}</CtaLink>
              <CtaLink href={data.stay.secondaryCta.href} variant="ghost">{data.stay.secondaryCta.label}</CtaLink>
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
