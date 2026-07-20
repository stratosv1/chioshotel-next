import Image from "next/image";
import type { KamposChiosPageData } from "@/content/kampos-chios";

type KamposChiosPageProps = {
  data: KamposChiosPageData;
};

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
    icon: "⭐",
    title: "Βραδιές κάτω από τα αστέρια",
    text: "Η βεράντα και ο κήπος γίνονται το πιο ήρεμο σημείο της ημέρας, χωρίς βιασύνη και χωρίς άγχος.",
  },
  {
    icon: "🏖️",
    title: "Κοντά στις παραλίες",
    text: "Εύκολη πρόσβαση σε κοντινές ακτές και στις παραλίες της νότιας Χίου, χωρίς να μένεις μέσα στην πολυκοσμία.",
  },
] as const;

function GreekKamposLanding({ data }: KamposChiosPageProps) {
  return (
    <main className="kc-page kc-page--landing">
      <section className="kc-landing-hero" aria-labelledby="kampos-landing-title">
        <div className="kc-landing-hero__content">
          <p className="kc-kicker">Κάμπος Χίου · Voulamandis House</p>
          <h1 id="kampos-landing-title">Διαμονή στον Κάμπο της Χίου</h1>
          <p className="kc-landing-hero__lead">
            Ήσυχα ενοικιαζόμενα δωμάτια και οικογενειακά διαμερίσματα μέσα στον
            ιστορικό Κάμπο, ανάμεσα σε περιβόλια εσπεριδοειδών. Κοντά στις
            παραλίες και την πόλη, μακριά από τον θόρυβο και το άγχος.
          </p>

          <div className="kc-actions">
            <a className="kc-btn kc-btn--primary" href="/el/domatia-xios/">
              Δείτε δωμάτια
            </a>
            <a
              className="kc-btn kc-btn--secondary"
              href="/el/amesi-kratisi-voulamandis-house/"
            >
              Τιμές & διαθεσιμότητα
            </a>
          </div>

          <ul className="kc-hero-facts" aria-label="Κύριες αποστάσεις και παροχές">
            <li><strong>1,5 χλμ.</strong><span>από παραλία</span></li>
            <li><strong>3 χλμ.</strong><span>από αεροδρόμιο</span></li>
            <li><strong>6 χλμ.</strong><span>από πόλη & λιμάνι</span></li>
            <li><strong>Δωρεάν</strong><span>χώρος στάθμευσης</span></li>
          </ul>
        </div>

        <div className="kc-landing-hero__visual">
          <Image
            src="/images/voulamandis-house-og.jpg"
            alt="Voulamandis House και ενοικιαζόμενα δωμάτια στον Κάμπο της Χίου"
            width={1200}
            height={900}
            priority
            sizes="(max-width: 980px) 100vw, 48vw"
          />
          <div className="kc-hero-note">
            <span>Για ζευγάρια & οικογένειες</span>
            <strong>Ηρεμία στον ιστορικό Κάμπο</strong>
          </div>
        </div>
      </section>

      <nav className="kc-jump-nav" aria-label="Περιεχόμενα σελίδας">
        <a href="#giati-kampos">Γιατί Κάμπος</a>
        <a href="#domatia-kampos">Δωμάτια</a>
        <a href="#topothesia">Τοποθεσία</a>
        <a href="#istoria-kampou">Ιστορία</a>
        <a href="#syxnes-erotiseis">Συχνές ερωτήσεις</a>
      </nav>

      <section className="kc-story" id="giati-kampos" aria-labelledby="kampos-story-title">
        <div className="kc-story__heading">
          <p className="kc-kicker">Διακοπές με διαφορετικό ρυθμό</p>
          <h2 id="kampos-story-title">Στον Κάμπο θυμάσαι πώς ήταν η ζωή μακριά από το άγχος</h2>
        </div>
        <div className="kc-story__copy">
          <p>
            Ο Κάμπος της Χίου δεν είναι απλώς μια τοποθεσία για διαμονή. Είναι
            ένας τόπος που μυρίζει ιστορία, μανταρίνι και βρεγμένο χώμα. Πίσω
            από τους ψηλούς τοίχους από θυμιανούσικη πέτρα κρύβονται αρχοντικά,
            βοτσαλωτές αυλές, παλιές στέρνες, γούρνες, μαγγανοπήγαδα και
            περιβόλια που καλλιεργούνται εδώ και αιώνες.
          </p>
          <p>
            Τα απογεύματα του καλοκαιριού, όταν ποτίζονται τα περιβόλια, ο
            αέρας δροσίζει και γεμίζει αρώματα. Τα βράδια περνούν στη βεράντα
            του δωματίου, κάτω από τα αστέρια, χωρίς φασαρία και χωρίς βιασύνη.
            Εδώ οι διακοπές αποκτούν ξανά τον χρόνο που τους αξίζει.
          </p>
        </div>
      </section>

      <section className="kc-benefits" aria-labelledby="kampos-benefits-title">
        <div className="kc-section-heading kc-section-heading--center">
          <p className="kc-kicker">Τα οφέλη της διαμονής στον Κάμπο</p>
          <h2 id="kampos-benefits-title">Ηρεμία, αυθεντικότητα και εύκολη πρόσβαση στη Χίο</h2>
          <p>
            Ιδανικός για ζευγάρια και οικογένειες που αγαπούν τη φύση και θέλουν
            να μένουν κοντά στις παραλίες, όχι όμως μέσα στον θόρυβο.
          </p>
        </div>

        <div className="kc-benefits__grid">
          {greekBenefits.map((benefit) => (
            <article className="kc-benefit-card" key={benefit.title}>
              <span className="kc-benefit-card__icon" aria-hidden="true">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kc-sensory" aria-labelledby="kampos-sensory-title">
        <div className="kc-sensory__image">
          <Image
            src={data.gallery[1].image}
            alt={data.gallery[1].imageAlt}
            width={1000}
            height={780}
            sizes="(max-width: 900px) 100vw, 48vw"
          />
        </div>
        <div className="kc-sensory__content">
          <p className="kc-kicker">Μια εμπειρία που δεν αντιγράφεται</p>
          <h2 id="kampos-sensory-title">Αρχοντικά, περιβόλια και το άρωμα του μανταρινιού της Χίου</h2>
          <p>
            Ο Κάμπος είναι ένας προστατευόμενος ιστορικός τόπος και παραδοσιακός
            οικισμός. Η αρχιτεκτονική του γεννήθηκε από τη συνάντηση της τοπικής
            παράδοσης με τις επιρροές των Γενουατών και των αρχοντικών οικογενειών
            της Χίου.
          </p>
          <p>
            Μεγάλες αυλόπορτες, αψιδωτά ανοίγματα, μαρμάρινες στοές και πέτρινα
            σπίτια συνυπάρχουν με τα περιβόλια. Το περίφημο χιώτικο μανταρίνι,
            οι λεμονιές και οι πορτοκαλιές δεν αποτελούν απλώς καλλιέργειες·
            είναι μέρος της ταυτότητας του τόπου.
          </p>
        </div>
      </section>

      <section className="kc-rooms" id="domatia-kampos" aria-labelledby="kampos-rooms-title">
        <div className="kc-section-heading">
          <p className="kc-kicker">Ενοικιαζόμενα δωμάτια στον Κάμπο Χίου</p>
          <h2 id="kampos-rooms-title">Βρείτε τη διαμονή που ταιριάζει στις διακοπές σας</h2>
          <p>
            Από οικονομικά δίκλινα για ζευγάρια έως άνετα οικογενειακά
            διαμερίσματα, όλες οι επιλογές βρίσκονται μέσα στο ήρεμο περιβάλλον
            του Voulamandis House.
          </p>
        </div>

        <div className="kc-rooms__grid">
          {greekKamposRooms.map((room) => (
            <article className="kc-room-card" key={room.title}>
              <a className="kc-room-card__image" href={room.href} aria-label={`Δείτε ${room.title}`}>
                <Image
                  src={room.image}
                  alt={room.imageAlt}
                  width={720}
                  height={520}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                />
                <span>{room.badge}</span>
              </a>
              <div className="kc-room-card__content">
                <p>{room.subtitle}</p>
                <h3>{room.title}</h3>
                <ul>
                  {room.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
                <p className="kc-room-card__description">{room.description}</p>
                <a className="kc-text-link" href={room.href}>Δείτε λεπτομέρειες <span aria-hidden="true">→</span></a>
              </div>
            </article>
          ))}
        </div>

        <div className="kc-inline-cta">
          <div>
            <strong>Δεν είστε σίγουροι ποιο δωμάτιο σας ταιριάζει;</strong>
            <span>Δείτε όλες τις επιλογές και επιλέξτε ανάλογα με τα άτομα, τον όροφο και τον χώρο.</span>
          </div>
          <a className="kc-btn kc-btn--primary" href="/el/domatia-xios/">Όλα τα δωμάτια</a>
        </div>
      </section>

      <section className="kc-location" id="topothesia" aria-labelledby="kampos-location-title">
        <div className="kc-location__content">
          <p className="kc-kicker">Κοντά στις παραλίες, μακριά από τον θόρυβο</p>
          <h2 id="kampos-location-title">Μια ήρεμη βάση για να γνωρίσετε ολόκληρη τη Χίο</h2>
          <p>
            Το Voulamandis House βρίσκεται σε σημείο που σας επιτρέπει να
            απολαμβάνετε την ησυχία του Κάμπου και παράλληλα να φτάνετε εύκολα
            στην πόλη, το αεροδρόμιο και τις κοντινές παραλίες.
          </p>

          <div className="kc-distance-grid">
            <article><strong>1,5 χλμ.</strong><span>κοντινότερη παραλία</span></article>
            <article><strong>3 χλμ.</strong><span>αεροδρόμιο Χίου</span></article>
            <article><strong>6 χλμ.</strong><span>πόλη και λιμάνι</span></article>
            <article><strong>Εύκολη διαδρομή</strong><span>προς Καρφά, Μέγα Λιμνιώνα και νότια Χίο</span></article>
          </div>

          <div className="kc-actions">
            <a className="kc-btn kc-btn--primary" href="/el/paralies-xios/">Δείτε τις παραλίες της Χίου</a>
            <a
              className="kc-btn kc-btn--secondary"
              href="https://www.google.com/maps/search/?api=1&query=Voulamandis+House+Chios"
              target="_blank"
              rel="noreferrer"
            >
              Ανοίξτε τον χάρτη
            </a>
          </div>
        </div>

        <div className="kc-location__image">
          <Image
            src={data.gallery[2].image}
            alt={data.gallery[2].imageAlt}
            width={1000}
            height={780}
            sizes="(max-width: 900px) 100vw, 44vw"
          />
        </div>
      </section>

      <section className="kc-audience" aria-labelledby="kampos-audience-title">
        <div className="kc-section-heading kc-section-heading--center">
          <p className="kc-kicker">Για ποιους είναι ιδανικός ο Κάμπος;</p>
          <h2 id="kampos-audience-title">Για ανθρώπους που θέλουν πραγματικές διακοπές</h2>
        </div>
        <div className="kc-audience__grid">
          <article>
            <span aria-hidden="true">♥</span>
            <h3>Ζευγάρια</h3>
            <p>Ήρεμα πρωινά, βραδιές στη βεράντα και αυθεντική ατμόσφαιρα μακριά από την πολυκοσμία.</p>
          </article>
          <article>
            <span aria-hidden="true">⌂</span>
            <h3>Οικογένειες</h3>
            <p>Περισσότερος χώρος, κήπος, δωρεάν parking και διαμερίσματα με κουζίνα για άνετες διακοπές.</p>
          </article>
          <article>
            <span aria-hidden="true">☀</span>
            <h3>Λάτρεις της ησυχίας</h3>
            <p>Για όσους προτιμούν τα περιβόλια, τα ήσυχα σοκάκια και τον φυσικό ρυθμό ενός ιστορικού τόπου.</p>
          </article>
        </div>
      </section>

      <section className="kc-history" id="istoria-kampou" aria-labelledby="kampos-history-title">
        <div className="kc-history__media">
          <Image
            src={data.gallery[3].image}
            alt={data.gallery[3].imageAlt}
            width={1100}
            height={820}
            sizes="(max-width: 900px) 100vw, 46vw"
          />
        </div>
        <div className="kc-history__content">
          <p className="kc-kicker">Η ιστορία του Κάμπου</p>
          <h2 id="kampos-history-title">Ένας τόπος που διατηρεί τη μνήμη και τον χαρακτήρα του</h2>
          <p>
            Από τον 14ο αιώνα, οικογένειες της Χίου και Γενουάτες ευγενείς
            δημιούργησαν στον Κάμπο πύργους, αρχοντικές κατοικίες και οργανωμένα
            κτήματα. Οι ψηλοί πέτρινοι τοίχοι προστάτευαν τα εσπεριδοειδή από
            τον αέρα και τη σκόνη, ενώ τα πηγάδια, οι μάγγανοι, οι στέρνες και
            οι γούρνες εξασφάλιζαν το πότισμα.
          </p>
          <p>
            Παρά τις καταστροφές του 1822, τον παγετό του 1850 και τον σεισμό
            του 1881, ο Κάμπος συνέχισε να ζει. Σήμερα παραμένει ένα σπάνιο
            πολιτιστικό τοπίο, όπου η κατοικία, η γεωργία και η φιλοξενία
            συνυπάρχουν.
          </p>
          <p className="kc-history__note">
            Η διαμονή εδώ δεν είναι μια απλή επίσκεψη σε αξιοθέατο. Είναι η
            ευκαιρία να ξυπνάτε και να κοιμάστε μέσα σε αυτό το τοπίο.
          </p>
        </div>
      </section>

      <section className="kc-faq" id="syxnes-erotiseis" aria-labelledby="kampos-faq-title">
        <div className="kc-section-heading">
          <p className="kc-kicker">Χρήσιμες πληροφορίες</p>
          <h2 id="kampos-faq-title">Συχνές ερωτήσεις για διαμονή στον Κάμπο της Χίου</h2>
        </div>

        <div className="kc-faq__list">
          {greekKamposFaqs.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="kc-final-cta" aria-labelledby="kampos-final-title">
        <div>
          <p className="kc-kicker">Voulamandis House · Κάμπος Χίου</p>
          <h2 id="kampos-final-title">Μείνετε κοντά σε όλα, αλλά μακριά από το άγχος</h2>
          <p>
            Επιλέξτε δωμάτιο ή οικογενειακό διαμέρισμα και ζήστε τη Χίο μέσα
            από την ηρεμία, τα αρώματα και την ιστορία του Κάμπου.
          </p>
        </div>
        <div className="kc-actions">
          <a className="kc-btn kc-btn--primary" href="/el/amesi-kratisi-voulamandis-house/">
            Δείτε τιμές & διαθεσιμότητα
          </a>
          <a className="kc-btn kc-btn--secondary" href="/el/domatia-xios/">
            Δείτε τα δωμάτια
          </a>
        </div>
      </section>
    </main>
  );
}

function StandardKamposPage({ data }: KamposChiosPageProps) {
  return (
    <main className="kc-page">
      <section className="kc-hero">
        <div className="kc-hero__content">
          <p className="kc-kicker">{data.hero.kicker}</p>
          <h1>{data.hero.title}</h1>
          <p>{data.hero.description}</p>

          <div className="kc-actions">
            <a className="kc-btn kc-btn--primary" href={data.hero.primaryCta.href}>
              {data.hero.primaryCta.label}
            </a>
            <a className="kc-btn kc-btn--secondary" href={data.hero.secondaryCta.href}>
              {data.hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="kc-hero__image">
          <Image
            src={data.hero.image}
            alt={data.hero.imageAlt}
            width={1200}
            height={800}
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="kc-intro">
        <div>
          <p className="kc-kicker">{data.language === "el" ? "Γιατί αξίζει" : "Why it matters"}</p>
          <h2>{data.intro.title}</h2>
        </div>

        <div className="kc-intro__text">
          {data.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="kc-highlights" aria-label="Kampos highlights">
        {data.highlights.map((item) => (
          <article key={`${item.label}-${item.value}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="kc-sections">
        {data.sections.map((section, index) => (
          <article className="kc-feature" key={section.title}>
            <div className="kc-feature__image">
              <Image
                src={section.image}
                alt={section.imageAlt}
                width={900}
                height={650}
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>

            <div className="kc-feature__content">
              <span className="kc-number">{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="kc-gallery" aria-label="Kampos Chios gallery">
        {data.gallery.map((item) => (
          <figure key={item.image}>
            <Image
              src={item.image}
              alt={item.imageAlt}
              width={700}
              height={520}
              sizes="(max-width: 900px) 50vw, 25vw"
            />
          </figure>
        ))}
      </section>

      <section className="kc-stay">
        <p className="kc-kicker">{data.stay.kicker}</p>
        <h2>{data.stay.title}</h2>
        <p>{data.stay.text}</p>

        <div className="kc-actions">
          <a className="kc-btn kc-btn--primary" href={data.stay.primaryCta.href}>
            {data.stay.primaryCta.label}
          </a>
          <a className="kc-btn kc-btn--secondary" href={data.stay.secondaryCta.href}>
            {data.stay.secondaryCta.label}
          </a>
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
