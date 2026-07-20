import Image from "next/image";
import type { ReactNode } from "react";
import type { KamposChiosPageData } from "@/content/kampos-chios";

type Props = {
  data: KamposChiosPageData;
};

type CtaProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
};

const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const eyebrow =
  "text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[#9a7a62] sm:text-xs";
const heading =
  "text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#493a31] sm:text-4xl lg:text-5xl";
const body = "text-[0.96rem] leading-7 text-[#75665b] sm:text-lg sm:leading-8";

function Cta({ href, children, variant = "primary", external = false }: CtaProps) {
  const styles = {
    primary:
      "bg-[#6f5949] !text-white shadow-md shadow-[#6f5949]/15 hover:bg-[#5e493c]",
    secondary:
      "border border-[#d8c8b8] bg-[#fffdf9] !text-[#57463b] shadow-sm hover:border-[#bca58f] hover:bg-[#f5ede4]",
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
  ["Ησυχία", "Μακριά από τον θόρυβο, χωρίς απομόνωση."],
  ["Αυθεντικότητα", "Αρχοντικά, πέτρα και ιστορία αιώνων."],
  ["Περιβόλια", "Μανταρινιές, πορτοκαλιές και λεμονιές."],
  ["Καλοκαιρινή δροσιά", "Δροσερά απογεύματα όταν ποτίζονται τα περιβόλια."],
  ["Βραδιές στη βεράντα", "Ησυχία και αστέρια, χωρίς βιασύνη."],
  ["Κοντά στις παραλίες", "Εύκολη πρόσβαση στις ακτές της νότιας Χίου."],
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

export function GreekKamposLandingPageElegant({ data }: Props) {
  return (
    <main className="overflow-hidden bg-[#f8f4ee] text-[#493a31]">
      <section
        className="bg-gradient-to-br from-[#fffdf9] via-[#f4ede5] to-[#eadfd4] pt-20 sm:pt-28"
        aria-labelledby="kampos-title"
      >
        <div className={`${shell} grid items-center gap-6 pb-8 sm:gap-10 sm:pb-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14`}>
          <div>
            <p className={eyebrow}>Κάμπος Χίου · Voulamandis House</p>
            <h1
              id="kampos-title"
              className="mt-3 max-w-4xl text-balance font-serif text-[2.4rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#493a31] sm:text-6xl lg:text-7xl"
            >
              Διαμονή στον Κάμπο της Χίου
            </h1>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-[#75665b] sm:mt-6 sm:text-xl sm:leading-9">
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
                  className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9]/90 px-3 py-3 shadow-sm shadow-[#6f5949]/5"
                >
                  <strong className="block font-serif text-lg text-[#59473b] sm:text-xl">
                    {value}
                  </strong>
                  <span className="block text-[0.7rem] font-semibold text-[#8a7869] sm:text-xs">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.7rem] border border-white/70 shadow-xl shadow-[#6f5949]/10 sm:aspect-[5/4] sm:rounded-[2.5rem] lg:aspect-[4/5]">
            <Image
              src="/images/voulamandis-house-og.jpg"
              alt="Voulamandis House στον Κάμπο της Χίου"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 46vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4e3c30]/55 via-transparent to-transparent" />
            <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/25 bg-[#5f4a3b]/75 px-4 py-3 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#f3e8dc] sm:text-xs">
                Ζευγάρια & οικογένειες
              </span>
              <strong className="mt-1 block font-serif text-lg font-semibold sm:text-2xl">
                Ηρεμία στον ιστορικό Κάμπο
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className={`${shell} py-9 sm:py-16`} aria-labelledby="why-kampos">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <p className={eyebrow}>Διακοπές με διαφορετικό ρυθμό</p>
            <h2 id="why-kampos" className={`${heading} mt-3`}>
              Η ζωή μακριά από το άγχος
            </h2>
          </div>
          <p className={`${body} rounded-3xl border border-[#eadfd4] bg-[#fffdf9] p-5 shadow-sm sm:p-7`}>
            Ο Κάμπος μυρίζει ιστορία, μανταρίνι και βρεγμένο χώμα. Πίσω από τους
            πέτρινους τοίχους κρύβονται αρχοντικά, στέρνες και περιβόλια. Τα
            καλοκαιρινά απογεύματα δροσίζουν και τα βράδια περνούν στη βεράντα,
            κάτω από τα αστέρια.
          </p>
        </div>
      </section>

      <section className="bg-[#eee6dd] py-9 sm:py-16" aria-labelledby="benefits-title">
        <div className={shell}>
          <p className={eyebrow}>Γιατί να μείνετε στον Κάμπο</p>
          <h2 id="benefits-title" className={`${heading} mt-3 max-w-3xl`}>
            Ηρεμία, αυθεντικότητα και εύκολη πρόσβαση
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {benefits.map(([title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9] p-4 shadow-sm"
              >
                <span className="block h-1 w-9 rounded-full bg-[#b49a82]" />
                <h3 className="mt-3 font-serif text-[1.05rem] font-semibold leading-tight text-[#4e3d32] sm:text-xl">
                  {title}
                </h3>
                <p className="mt-2 text-[0.76rem] leading-5 text-[#7b6a5d] sm:text-sm sm:leading-6">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="domatia-kampos"
        className="bg-[#f5eee7] py-9 sm:py-16"
        aria-labelledby="rooms-title"
      >
        <div className={shell}>
          <p className={eyebrow}>Ενοικιαζόμενα δωμάτια στον Κάμπο Χίου</p>
          <h2 id="rooms-title" className={`${heading} mt-3 max-w-3xl`}>
            Επιλέξτε τη διαμονή που σας ταιριάζει
          </h2>

          <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {rooms.map((room) => (
              <article
                key={room.title}
                className="w-[80vw] max-w-[315px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-[#dfd1c4] bg-[#fffdf9] shadow-md shadow-[#6f5949]/8 sm:w-auto sm:max-w-none"
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
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-[#fffdf9]/90 px-3 py-1.5 text-[0.68rem] font-extrabold text-[#57463b] backdrop-blur-sm">
                    {room.badge}
                  </span>
                </a>
                <div className="p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#9b7d66]">
                    {room.subtitle}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[1.5rem] font-semibold leading-tight text-[#4d3c31]">
                    {room.title}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {room.details.map((detail) => (
                      <li
                        key={detail}
                        className="rounded-full bg-[#efe5dc] px-2.5 py-1 text-[0.67rem] font-semibold text-[#6d5848]"
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm leading-6 text-[#77675b]">{room.description}</p>
                  <a
                    href={room.href}
                    className="mt-4 inline-flex text-sm font-extrabold !text-[#6f5949]"
                  >
                    Δείτε λεπτομέρειες&nbsp; →
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#dfd1c4] bg-[#fffdf9] p-4 shadow-sm">
            <p className="text-sm leading-6 text-[#75665b]">
              Δεν είστε σίγουροι ποιο δωμάτιο σας ταιριάζει;
            </p>
            <Cta href="/el/domatia-xios/" variant="secondary">
              Όλα τα δωμάτια
            </Cta>
          </div>
        </div>
      </section>

      <section className={`${shell} py-9 sm:py-16`} aria-labelledby="location-title">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
          <div>
            <p className={eyebrow}>Κοντά στις παραλίες, μακριά από τον θόρυβο</p>
            <h2 id="location-title" className={`${heading} mt-3`}>
              Ήρεμη βάση για να γνωρίσετε τη Χίο
            </h2>
            <p className={`${body} mt-4`}>
              Απολαμβάνετε την ησυχία του Κάμπου και φτάνετε εύκολα στην πόλη,
              το αεροδρόμιο και τις κοντινές παραλίες.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {facts.map(([value, label]) => (
                <article
                  key={label}
                  className="rounded-2xl border border-[#e4d7cb] bg-[#fffdf9] p-4 shadow-sm"
                >
                  <strong className="block font-serif text-xl text-[#4f3e33] sm:text-2xl">
                    {value}
                  </strong>
                  <span className="mt-0.5 block text-xs text-[#897668]">{label}</span>
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

          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[2rem] border border-white shadow-xl shadow-[#6f5949]/10 md:block">
            <Image
              src={data.gallery[2].image}
              alt={data.gallery[2].imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#efe7de] py-9 sm:py-16">
        <div className={shell}>
          <details className="group overflow-hidden rounded-[1.5rem] border border-[#ddcfc2] bg-[#fffdf9] shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
              <div>
                <p className={eyebrow}>Η ιστορία του Κάμπου</p>
                <h2 className="mt-2 font-serif text-xl font-semibold text-[#4d3c31] sm:text-3xl">
                  Ένας τόπος που διατηρεί τη μνήμη του
                </h2>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6f5949] text-white transition group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-[#e4d7cb] px-5 py-5 text-sm leading-7 text-[#75665b] sm:text-base">
              Από τον 14ο αιώνα, οικογένειες της Χίου και Γενουάτες ευγενείς
              δημιούργησαν πύργους, αρχοντικά και οργανωμένα κτήματα. Παρά τις
              καταστροφές του 1822, τον παγετό του 1850 και τον σεισμό του 1881,
              ο Κάμπος συνέχισε να ζει και παραμένει ένα σπάνιο πολιτιστικό τοπίο.
            </div>
          </details>

          <div className="mt-5 divide-y divide-[#e4d7cb] rounded-[1.5rem] border border-[#ddcfc2] bg-[#fffdf9] px-4 shadow-sm sm:px-7">
            {faqs.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[1.02rem] font-semibold leading-snug text-[#4d3c31] sm:text-xl [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6f5949] text-white transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-1 pt-3 text-sm leading-6 text-[#75665b] sm:text-base sm:leading-7">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-7 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[1.6rem] border border-[#d9c7b6] bg-gradient-to-br from-[#d8c6b5] via-[#c9b09b] to-[#b99a82] px-5 py-8 shadow-xl shadow-[#6f5949]/10 sm:rounded-[2.5rem] sm:px-10 sm:py-12">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#654f40] sm:text-xs">
                Voulamandis House · Κάμπος Χίου
              </p>
              <h2 className="mt-3 text-balance font-serif text-[2rem] font-semibold leading-[1.02] tracking-[-0.035em] text-[#47372d] sm:text-4xl lg:text-5xl">
                Κοντά σε όλα, μακριά από το άγχος
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#5f4e42] sm:text-lg sm:leading-8">
                Επιλέξτε δωμάτιο ή οικογενειακό διαμέρισμα και ζήστε τη Χίο μέσα
                από την ηρεμία του Κάμπου.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:flex">
              <Cta href="/el/amesi-kratisi-voulamandis-house/">Τιμές & διαθεσιμότητα</Cta>
              <Cta href="/el/domatia-xios/" variant="secondary">
                Δείτε δωμάτια
              </Cta>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
