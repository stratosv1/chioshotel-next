type AnswerFirstSeoBlockProps = {
  kind: "villages" | "beaches";
  language?: "en" | "el";
};

const answerFirstCopy = {
  villages: {
    en: {
      eyebrow: "Quick answer",
      title: "Which villages should you visit in Chios?",
      answer:
        "The best-known villages in Chios are Pyrgi, Mesta, Olympoi, Vessa, Armolia, Lagada and Volissos. Pyrgi and Mesta are the most famous medieval mastic villages, Olympoi and Vessa are quieter historic villages, Armolia is known for pottery, Lagada is a seaside food stop and Volissos is the main village of northwest Chios.",
      bullets: [
        "Pyrgi — black-and-white geometric house decorations",
        "Mesta — preserved medieval fortress village",
        "Olympoi and Vessa — quieter mastic village routes",
        "Armolia — pottery tradition and local craft",
        "Lagada and Volissos — seaside food, castle views and northern routes",
      ],
      note:
        "For a practical day route, combine Pyrgi, Mesta, Olympoi and Vessa in south Chios, then plan Lagada or Volissos as separate village days.",
    },
    el: {
      eyebrow: "Γρήγορη απάντηση",
      title: "Ποια χωριά αξίζει να δείτε στη Χίο;",
      answer:
        "Τα πιο γνωστά χωριά της Χίου είναι το Πυργί, τα Μεστά, οι Ολύμποι, η Βέσσα, τα Αρμόλια, η Λαγκάδα και η Βολισσός. Το Πυργί και τα Μεστά είναι τα πιο διάσημα μεσαιωνικά Μαστιχοχώρια, οι Ολύμποι και η Βέσσα είναι πιο ήσυχες ιστορικές στάσεις, τα Αρμόλια είναι γνωστά για την κεραμική, η Λαγκάδα για το λιμανάκι και το φαγητό, ενώ η Βολισσός για τη βορειοδυτική Χίο και το κάστρο.",
      bullets: [
        "Πυργί — ξυστά και ασπρόμαυρα γεωμετρικά σχέδια",
        "Μεστά — καλοδιατηρημένο μεσαιωνικό καστροχώρι",
        "Ολύμποι και Βέσσα — πιο ήρεμες διαδρομές στα Μαστιχοχώρια",
        "Αρμόλια — κεραμική παράδοση και τοπική χειροτεχνία",
        "Λαγκάδα και Βολισσός — θάλασσα, φαγητό, κάστρο και βόρεια Χίος",
      ],
      note:
        "Για πρακτική διαδρομή, συνδυάστε Πυργί, Μεστά, Ολύμπους και Βέσσα στη νότια Χίο και κρατήστε Λαγκάδα ή Βολισσό για ξεχωριστή εκδρομή.",
    },
  },
  beaches: {
    en: {
      eyebrow: "Quick answer",
      title: "Which beaches should you visit in Chios?",
      answer:
        "The most famous beaches in Chios are Mavra Volia, Agia Dynami, Komi, Agia Fotia, Lithi, Nagos and Avlonia. Choose Mavra Volia for the dramatic black-pebble landscape, Komi and Agia Fotia for an easier organized beach day, Agia Dynami for turquoise water, Lithi for a relaxed sandy beach and Nagos or Avlonia for a quieter route.",
      bullets: [
        "Mavra Volia — volcanic black pebbles and dramatic scenery",
        "Agia Dynami — turquoise water and a memorable south Chios stop",
        "Komi and Agia Fotia — easier organized beach days",
        "Lithi — sandy beach and relaxed seafood stop",
        "Nagos and Avlonia — quieter coastal routes",
      ],
      note:
        "For a first visit, plan one day for south Chios beaches and another for quieter northern or western coastal routes.",
    },
    el: {
      eyebrow: "Γρήγορη απάντηση",
      title: "Ποιες παραλίες αξίζει να δείτε στη Χίο;",
      answer:
        "Οι πιο γνωστές παραλίες της Χίου είναι τα Μαύρα Βόλια, η Αγία Δύναμη, η Κώμη, η Αγία Φωτιά, το Λιθί, ο Ναγός και η Αυλωνιά. Τα Μαύρα Βόλια ξεχωρίζουν για το ηφαιστειακό τοπίο, η Κώμη και η Αγία Φωτιά για πιο εύκολη οργανωμένη μέρα, η Αγία Δύναμη για τα γαλαζοπράσινα νερά, το Λιθί για άμμο και φαγητό, ενώ ο Ναγός και η Αυλωνιά για πιο ήσυχες διαδρομές.",
      bullets: [
        "Μαύρα Βόλια — ηφαιστειακά μαύρα βότσαλα και εντυπωσιακό τοπίο",
        "Αγία Δύναμη — γαλαζοπράσινα νερά και νότια Χίος",
        "Κώμη και Αγία Φωτιά — πιο εύκολες οργανωμένες επιλογές",
        "Λιθί — άμμος και χαλαρή στάση για φαγητό",
        "Ναγός και Αυλωνιά — πιο ήσυχες παραθαλάσσιες διαδρομές",
      ],
      note:
        "Για πρώτη επίσκεψη, οργανώστε μία μέρα για τις νότιες παραλίες και μία δεύτερη για πιο ήσυχες βόρειες ή δυτικές ακτές.",
    },
  },
} as const;

export function AnswerFirstSeoBlock({ kind, language = "en" }: AnswerFirstSeoBlockProps) {
  const copy = answerFirstCopy[kind][language] ?? answerFirstCopy[kind].en;

  return (
    <section className="bg-[#f7efe5] px-4 py-8 text-[#2f261f] md:px-6 md:py-10">
      <div className="mx-auto max-w-[1180px] rounded-[32px] border border-[#8e6607]/20 bg-white p-6 shadow-xl shadow-black/5 md:p-8">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8e6607]">
          {copy.eyebrow}
        </span>

        <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] md:text-4xl">
          {copy.title}
        </h2>

        <p className="mt-4 text-base font-semibold leading-8 text-[#4d4238] md:text-lg">
          {copy.answer}
        </p>

        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {copy.bullets.map((item) => (
            <li
              className="rounded-2xl bg-[#fff7e8] px-4 py-3 text-sm font-bold leading-6 text-[#493b2f] ring-1 ring-[#8e6607]/10"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-5 rounded-2xl bg-[#2f261f] px-4 py-4 text-sm font-bold leading-6 text-white md:text-base">
          {copy.note}
        </p>
      </div>
    </section>
  );
}
