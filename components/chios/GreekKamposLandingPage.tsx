import Image from "next/image";
import type { ReactNode } from "react";
import type { KamposChiosPageData } from "@/content/kampos-chios";

type Props = {
  data: KamposChiosPageData;
};

type CtaProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  external?: boolean;
};

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const eyebrow =
  "text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#8a6a52] sm:text-xs";
const heading =
  "text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#49372b] sm:text-4xl lg:text-5xl";
const body = "text-[0.96rem] leading-7 text-[#6d5949] sm:text-lg sm:leading-8";

function Cta({ href, children, variant = "primary", external = false }: CtaProps) {
  const styles = {
    primary:
      "bg-[#6b5141] !text-[#fffaf3] shadow-lg shadow-[#4b3425]/15 hover:bg-[#594236]",
    secondary:
      "border border-[#cdb9a4] bg-[#fffaf3] !text-[#5a4436] hover:border-[#a9896f] hover:bg-[#f4eadf]",
    light:
      "bg-[#fffaf3] !text-[#5a4436] shadow-lg shadow-[#4b3425]/15 hover:bg-[#efe3d6]",
  } as const;

  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-center text-[0.78rem] font-extrabold transition duration-200 hover:-translate-y-0.5 sm:min-h-12 sm:px-6 sm:py-3 sm:text-sm ${styles[variant]}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="!text-inherit">{children}</span>
    </a>
  );
}

const facts = [
  ["1,5 χλμ.", "παραλία"],
  ["3 χλμ.", "αεροδρόμιο"],
  ["6 χλμ.", "πόλη & λιμάνι"],
  ["Δωρεάν", "στάθμευση"],
] as const;

const benefits = [
  ["01", "Ησυχία", "Μακριά από τον θόρυβο, χωρίς απομόνωση."],
  ["02", "Αυθεντικότητα", "Αρχοντικά, πέτρα και ιστορία αιώνων."],
  ["03", "Περιβόλια", "Μανταρινιές, πορτοκαλιές και λεμονιές."],
  ["04", "Καλοκαιρινή δροσιά", "Δροσερά απογεύματα όταν ποτίζονται τα περιβόλια."],
  ["05", "Βραδιές στη βεράντα", "Ησυχία και αστέρια, χωρίς βιασύνη."],
  ["06", "Κοντά στις παραλίες", "Εύκολη πρόσβαση στις ακτές της νότιας Χίου."],
] as const;

const rooms = [
  {
    title: "Οικονομικά δίκλινα",
    subtitle: "Για 2 άτομα",
    description: "Οικονομική επιλογή για ζευγάρια που θέλουν ηρεμία.",
    image: "/images/rooms/received_1753964631359257.webp",
    imageAlt: "Οικονομικό δίκλινο δωμάτιο στον Κάμπο της Χίου",
    href: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    badge: "Καλή τιμή",
    details: ["2 άτομα", "16 m²", "Ψυγείο"],
  },
  {
    title: "Ισόγεια δωμάτια",
    subtitle: "Δίκλινα και τρίκλινα",
    description: "Άμεση πρόσβαση στην αυλή και στον κήπο, χωρίς σκάλες.",
    image: "/images/rooms/double-triple-room.jpg",
    imageAlt: "Ισόγειο δωμάτιο με πρόσβαση στον κήπο του Voulamandis House",
    href: "/el/domatia-xios/diklina-triklina-domatia/",
    badge: "Κοντά στον κήπο",
    details: ["2–3 άτομα", "Ισόγειο", "Χωρίς σκάλες"],
  },
  {
    title: "Δωμάτια ορόφου",
    subtitle: "Δίκλινα και τρίκλινα",
    description: "Φωτεινά δωμάτια με βεράντα και θέα στα εσπεριδοειδή.",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    imageAlt: "Δωμάτιο ορόφου με βεράντα στον Κάμπο της Χίου",
    href: "/el/domatia-xios/diklina-triklina-domatia/",
    badge: "Βεράντα & θέα",
    details: ["2–3 άτομα", "Όροφος", "Θέα"],
  },
  {
    title: "Οικογενειακά διαμερίσματα",
    subtitle: "Χώρος και κουζίνα",
    description: "Ανεξάρτητα διαμερίσματα με καθιστικό και πλήρη κουζίνα.",
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    imageAlt: "Οικογενειακό διαμέρισμα στον Κάμπο της Χίου",
    href: "/el/domatia-xios/oikogeneiako-diamerisma/",
    badge: "Για οικογένειες",
    details: ["Έως 4 άτομα", "40–45 m²", "Κουζίνα"],
  },
] as const;

const faqs = [
  {
    question: "Γιατί να επιλέξω διαμονή στον Κάμπο της Χίου;",
    answer:
      "Ο Κάμπος συνδυάζει ησυχία, ιστορικό χαρακτήρα και φύση, ενώ παραμένει κοντά στην πόλη, το αεροδρόμιο και τις παραλίες.",
  },
  {
    question: "Υπάρχουν ενοικιαζόμενα δωμάτια μέσα στον Κάμπο;",
    answer:
      "Ναι. Το Voulamandis House διαθέτει δίκλινα, ισόγεια και δωμάτια ορόφου, καθώς και οικογενειακά διαμερίσματα με κουζίνα.",
  },
  {
    question: "Είναι κατάλληλος για οικογένειες και ζευγάρια;",
    answer:
      "Ναι. Ο κήπος, η ήρεμη ατμόσφαιρα, η στάθμευση και οι διαφορετικές επιλογές διαμονής εξυπηρετούν τόσο οικογένειες όσο και ζευγάρια.",
  },
  {
    question: "Πόσο κοντά είναι οι παραλίες;",
    answer:
      "Η κοντινότερη παραλία βρίσκεται περίπου 1,5 χλμ. μακριά. Ο Καρφάς, ο Μέγας Λιμνιώνας και οι παραλίες της νότιας Χίου προσεγγίζονται εύκολα με αυτοκίνητο.",
  },
  {
    question: "Χρειάζεται αυτοκίνητο;",
    answer:
      "Δεν είναι απαραίτητο για να απολαύσετε το κατάλυμα, αλλά διευκολύνει τις διαδρομές προς παραλίες, χωριά και αξιοθέατα. Διατίθεται δωρεάν στάθμευση.",
  },
] as const;

export function GreekKamposLandingPage({ data }: Props) {
  return (
    <main className="overflow-hidden bg-[#f7f1e8] text-[#49372b]">
      <section
        className="bg-gradient-to-br from-[#fbf7f0] via-[#efe3d6] to-[#e6d5c3] pt-20 sm:pt-28"
        aria-labelledby="kampos-title"
      >
        <div className={`${shell} grid items-center gap-6 pb-8 sm:gap-10 sm:pb-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14`}>
          <div>
            <p className={eyebrow}>Κάμπος Χίου · Voulamandis House</p>
            <h1
              id="kampos-title"
              className="mt-3 max-w-4xl text-balance font-serif text-[2.45rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[#49372b] sm:text-6xl lg:text-7xl"
            >
              Διαμονή στον Κάμπο της Χίου
            </h1>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-[#6d5949] sm:mt-6 sm:text-xl sm:leading-9">
              Ήσυχα ενοικιαζόμενα δωμάτια και οικογενειακά διαμερίσματα ανάμεσα
              σε περιβόλια. Κοντά στις παραλίες και την πόλη, μακριά από τον
              θόρυβο και το άγχος.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:flex">
              <Cta href="/el/domatia-xios/">Δείτε δωμάτια</Cta>
              <Cta href="/el/amesi-kratisi-voulamandis-house/" variant="secondary">
                Τιμές & διαθεσιμότητα
              </Cta>
            </div>

            <ul className="mt-5 grid grid-cols-2 gap-2 sm:mt-7 sm:grid-cols-4">
              {facts.map(([value, label]) => (
                <li
                  key={label}
                  className="rounded-2xl border border-[#ddcdbd] bg-[#fffaf3]/85 px-3 py-3 shadow-sm shadow-[#6b5141]/5 backdrop-blur"
                >
                  <strong className="block font-serif text-lg text-[#5a4436] sm:text-xl">
                    {value}
                  </strong>
                  <span className="block text-[0.7rem] font-semibold text-[#8a7462] sm:text-xs">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] shadow-xl shadow-[#4b3425]/15 sm:aspect-[5/4] sm:rounded-[2.5rem] lg:aspect-[4/5]">
            <Image
              src="/images/voulamandis-house-og.jpg"
              alt="Voulamandis House και ενοικιαζόμενα δωμάτια στον Κάμπο της Χίου"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4d392d]/70 via-transparent to-transparent" />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-[#fff4e8]/25 bg-[#5a4436]/70 px-4 py-3 text-[#fffaf3] backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#ead6c0] sm:text-xs">
                Ζευγάρια & οικογένειες
              </span>
              <strong className="mt-1 block font-serif text-lg font-semibold sm:text-2xl">
                Ηρεμία στον ιστορικό Κάμπο
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className={`${shell} py-9 sm:py-20`} aria-labelledby="kampos-experience">
        <div className="grid items-center gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div>
            <p className={eyebrow}>Διακοπές με διαφορετικό ρυθμό</p>
            <h2 id="kampos-experience" className={`${heading} mt-3`}>
              Η ζωή μακριά από το άγχος
            </h2>
          </div>
          <div className="rounded-3xl border border-[#e1d2c3] bg-[#fffaf3] p-5 shadow-sm shadow-[#6b5141]/5 sm:p-7">
            <p className={body}>
              Ο Κάμπος μυρίζει ιστορία, μανταρίνι και βρεγμένο χώμα. Πίσω από
              τους πέτρινους τοίχους κρύβονται αρχοντικά, στέρνες,
              μαγγανοπήγαδα και περιβόλια. Τα βράδια περνούν στη βεράντα, κάτω
              από τα αστέρια.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Ζευγάρια", "Οικογένειες", "Λάτρεις της ησυχίας"].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#efe3d6] px-3 py-1.5 text-xs font-bold text-[#6b5141]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e9ded1] py-9 sm:py-20" aria-labelledby="kampos-benefits">
        <div className={shell}>
          <p className={eyebrow}>Γιατί να μείνετε στον Κάμπο</p>
          <h2 id="kampos-benefits" className={`${heading} mt-3 max-w-3xl`}>
            Ηρεμία, αυθεντικότητα και εύκολη πρόσβαση
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-9 sm:grid-cols-3 lg:grid-cols-6">
            {benefits.map(([number, title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-[#f4eadf] bg-[#fffaf3]/90 p-4 shadow-sm shadow-[#6b5141]/5 sm:p-5"
              >
                <span className="font-serif text-sm font-semibold text-[#a1836c]">{number}</span>
                <h3 className="mt-2 font-serif text-[1.05rem] font-semibold leading-tight text-[#513d31] sm:text-xl">
                  {title}
                </h3>
                <p className="mt-2 text-[0.75rem] leading-5 text-[#796555] sm:text-sm sm:leading-6">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="domatia-kampos"
        className="bg-gradient-to-br from-[#655044] via-[#725b4d] to-[#806858] py-10 text-[#fffaf3] sm:py-20"
        aria-labelledby="rooms-title"
      >
        <div className={shell}>
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#ead6c0] sm:text-xs">
            Ενοικιαζόμενα δωμάτια στον Κάμπο Χίου
          </p>
          <h2
            id="rooms-title"
            className="mt-3 max-w-3xl text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#fffaf3] sm:text-4xl lg:text-5xl"
          >
            Επιλέξτε τη διαμονή που σας ταιριάζει
          </h2>

          <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {rooms.map((room) => (
              <article
                key={room.title}
                className="w-[82vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-[#f1dfce]/15 bg-[#fffaf3]/10 sm:w-auto sm:max-w-none"
              >
                <a className="relative block aspect-[16/10] overflow-hidden" href={room.href}>
                  <Image
                    src={room.image}
                    alt={room.imageAlt}
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#fffaf3]/90 px-3 py-1.5 text-[0.68rem] font-extrabold text-[#5a4436]">
                    {room.badge}
                  </span>
                </a>
                <div className="p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#ead6c0]">
                    {room.subtitle}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[1.5rem] font-semibold leading-tight text-[#fffaf3]">
                    {room.title}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {room.details.map((detail) => (
                      <li
                        key={detail}
                        className="rounded-full bg-[#fffaf3]/12 px-2.5 py-1 text-[0.67rem] font-semibold text-[#f5e8dc]"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm leading-6 text-[#eaded3]">{room.description}</p>
                  <a href={room.href} className="mt-4 inline-flex text-sm font-extrabold !text-[#f2d7be]">
                    Δείτε λεπτομέρειες&nbsp; →
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#f1dfce]/15 bg-[#fffaf3]/10 p-4">
            <p className="text-sm leading-6 text-[#eaded3]">Δεν είστε σίγουροι ποιο δωμάτιο σας ταιριάζει;</p>
            <Cta href="/el/domatia-xios/" variant="light">Όλα τα δωμάτια</Cta>
          </div>
        </div>
      </section>

      <section id="topothesia" className={`${shell} py-9 sm:py-20`} aria-labelledby="location-title">
        <div className="grid items-center gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className={eyebrow}>Κοντά στις παραλίες, μακριά από τον θόρυβο</p>
            <h2 id="location-title" className={`${heading} mt-3`}>
              Ήρεμη βάση για να γνωρίσετε τη Χίο
            </h2>
            <p className={`${body} mt-4`}>
              Απολαμβάνετε την ησυχία του Κάμπου και φτάνετε εύκολα στην πόλη,
              το αεροδρόμιο και τις κοντινές παραλίες.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7">
              {facts.map(([value, label]) => (
                <article key={label} className="rounded-2xl border border-[#dfcfbf] bg-[#fffaf3] p-4 shadow-sm shadow-[#6b5141]/5">
                  <strong className="block font-serif text-xl text-[#5a4436] sm:text-2xl">{value}</strong>
                  <span className="mt-0.5 block text-xs text-[#8a7462]">{label}</span>
                </article>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex">
              <Cta href="/el/paralies-xios/">Παραλίες Χίου</Cta>
              <Cta
                href="https://www.google.com/maps/search/?api=1&query=Voulamandis+House+Chios"
                variant="secondary"
                external
              >
                Ανοίξτε τον χάρτη
              </Cta>
            </div>
          </div>

          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-xl shadow-[#4b3425]/12 md:block">
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

      <section className={`${shell} pb-9 sm:pb-20`}>
        <details className="group overflow-hidden rounded-[1.6rem] border border-[#ddcdbd] bg-[#fffaf3] shadow-sm shadow-[#6b5141]/5">
          <summary className="flex cursor-pointer list-none items-center gap-4 p-4 sm:p-6 [&::-webkit-details-marker]:hidden">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36">
              <Image src={data.gallery[3].image} alt={data.gallery[3].imageAlt} fill className="object-cover" sizes="144px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={eyebrow}>Η ιστορία του Κάμπου</p>
              <h2 className="mt-1 font-serif text-xl font-semibold leading-tight text-[#513d31] sm:text-3xl">
                Ένας τόπος που διατηρεί τη μνήμη του
              </h2>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6b5141] text-[#fffaf3] transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="border-t border-[#e3d4c5] px-5 py-5 sm:px-7 sm:py-7">
            <div className="grid gap-4 text-sm leading-7 text-[#6d5949] sm:grid-cols-2 sm:text-base">
              <p>
                Από τον 14ο αιώνα, οικογένειες της Χίου και Γενουάτες ευγενείς
                δημιούργησαν πύργους, αρχοντικά και οργανωμένα κτήματα. Οι πέτρινοι
                τοίχοι προστάτευαν τα εσπεριδοειδή, ενώ πηγάδια, μάγγανοι, στέρνες
                και γούρνες εξασφάλιζαν το πότισμα.
              </p>
              <p>
                Παρά τις καταστροφές του 1822, τον παγετό του 1850 και τον σεισμό
                του 1881, ο Κάμπος συνέχισε να ζει και παραμένει ένα σπάνιο
                πολιτιστικό τοπίο.
              </p>
            </div>
          </div>
        </details>
      </section>

      <section className="bg-[#eee4d8] py-9 sm:py-20" aria-labelledby="faq-title">
        <div className={shell}>
          <p className={eyebrow}>Χρήσιμες πληροφορίες</p>
          <h2 id="faq-title" className={`${heading} mt-3 max-w-3xl`}>
            Συχνές ερωτήσεις για διαμονή στον Κάμπο
          </h2>
          <div className="mt-6 divide-y divide-[#dfcfbf] rounded-[1.5rem] border border-[#ddcdbd] bg-[#fffaf3] px-4 sm:px-7">
            {faqs.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[1.02rem] font-semibold leading-snug text-[#513d31] sm:text-xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6b5141] text-[#fffaf3] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-1 pt-3 text-sm leading-6 text-[#6d5949] sm:text-base sm:leading-7">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-7 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.6rem] bg-[#665044] px-5 py-8 text-[#fffaf3] shadow-xl shadow-[#4b3425]/15 sm:rounded-[2.5rem] sm:px-10 sm:py-14">
          <Image
            src="/images/kampos/kampos-chios-citrus-estate.webp"
            alt="Περιβόλι εσπεριδοειδών στον Κάμπο της Χίου"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#5b4539]/95 via-[#665044]/90 to-[#806858]/65" />
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#ead6c0] sm:text-xs">
                Voulamandis House · Κάμπος Χίου
              </p>
              <h2 className="mt-3 text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#fffaf3] sm:text-4xl lg:text-5xl">
                Κοντά σε όλα, μακριά από το άγχος
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#eaded3] sm:text-lg sm:leading-8">
                Επιλέξτε δωμάτιο ή οικογενειακό διαμέρισμα και ζήστε τη Χίο μέσα
                από την ηρεμία του Κάμπου.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:flex">
              <Cta href="/el/amesi-kratisi-voulamandis-house/" variant="light">
                Τιμές & διαθεσιμότητα
              </Cta>
              <Cta href="/el/domatia-xios/" variant="secondary">Δείτε δωμάτια</Cta>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
