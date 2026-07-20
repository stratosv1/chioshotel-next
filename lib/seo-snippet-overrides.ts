export type SeoSnippetOverride = {
  title: string;
  description: string;
};

/**
 * CTR-focused overrides for pages with strong impressions and room to improve.
 * Keep these evergreen: do not add an automatically changing month or year
 * unless the visible page content is genuinely time-sensitive.
 */
export const seoSnippetOverrides = new Map<string, SeoSnippetOverride>([
  [
    "/chios/chios-beaches/",
    {
      title: "Best Beaches in Chios | Map, Access & Local Tips",
      description:
        "Compare the best beaches in Chios by area, access, facilities and sea conditions, with local tips for families, quiet swims and day routes.",
    },
  ],
  [
    "/chios/chios-villages/chios-pyrgi/",
    {
      title: "Pyrgi Chios | Painted Village, Xysta & Visitor Tips",
      description:
        "Plan your visit to Pyrgi in Chios: see the famous black-and-white xysta, explore medieval alleys and combine the village with nearby beaches.",
    },
  ],
  [
    "/chios/chios-villages/mesta-chios/",
    {
      title: "Mesta Chios | Medieval Village, Alleys & Visitor Tips",
      description:
        "Visit Mesta in Chios, a preserved medieval fortress village. Find access details, what to see, local tips and ideas for a south Chios route.",
    },
  ],
  [
    "/chios/chios-beaches/agia-dynami-beach-chios/",
    {
      title: "Agia Dynami Beach Chios | Access, Water & Local Tips",
      description:
        "Plan a visit to Agia Dynami Beach in southern Chios. Check access, beach conditions, natural shade and local tips for this small turquoise cove.",
    },
  ],
  [
    "/chios/chios-beaches/komi-beach/",
    {
      title: "Komi Beach Chios | Sand, Facilities & Family Tips",
      description:
        "Plan your visit to Komi Beach in Chios: sandy shore, shallow water, sunbeds, restaurants, family-friendly facilities and easy road access.",
    },
  ],
  [
    "/chios/chios-beaches/emporios-beach/",
    {
      title: "Mavra Volia Beach Chios | Black Pebbles & Access",
      description:
        "Visit Mavra Volia Beach in Chios, famous for black volcanic pebbles and deep blue water. See access details, swimming tips and nearby stops.",
    },
  ],
  [
    "/el/chios/kampos-chios/",
    {
      title: "Διαμονή στον Κάμπο Χίου | Ενοικιαζόμενα Δωμάτια",
      description:
        "Ήσυχα ενοικιαζόμενα δωμάτια και οικογενειακά διαμερίσματα στον ιστορικό Κάμπο της Χίου. Κοντά σε παραλίες, αεροδρόμιο και πόλη.",
    },
  ],
  [
    "/el/paralies-xios/",
    {
      title: "Παραλίες Χίου | Χάρτης, πρόσβαση & τοπικές συμβουλές",
      description:
        "Συγκρίνετε τις καλύτερες παραλίες της Χίου ανά περιοχή, πρόσβαση και παροχές, με τοπικές συμβουλές για οικογένειες, ηρεμία και ημερήσιες διαδρομές.",
    },
  ],
  [
    "/el/xoria-xios/pyrgi-xios/",
    {
      title: "Πυργί Χίου | Ξυστά, αξιοθέατα & οδηγός επίσκεψης",
      description:
        "Οργανώστε την επίσκεψή σας στο Πυργί Χίου: δείτε τα ξυστά, περπατήστε στα μεσαιωνικά σοκάκια και συνδυάστε το χωριό με κοντινές παραλίες.",
    },
  ],
  [
    "/el/xoria-xios/mesta-xios/",
    {
      title: "Μεστά Χίου | Μεσαιωνικό καστροχώρι & οδηγός επίσκεψης",
      description:
        "Επισκεφθείτε τα Μεστά Χίου, ένα καλοδιατηρημένο μεσαιωνικό καστροχώρι, με πληροφορίες πρόσβασης, αξιοθέατα, τοπικές συμβουλές και ιδέες διαδρομής.",
    },
  ],
  [
    "/el/paralies-xios/paralia-agia-dynami/",
    {
      title: "Αγία Δύναμη Χίου | Πρόσβαση, νερά & χρήσιμες συμβουλές",
      description:
        "Οργανώστε επίσκεψη στην Αγία Δύναμη Χίου: πρόσβαση, χαρακτηριστικά παραλίας, φυσική σκιά και χρήσιμες συμβουλές για τον μικρό γαλαζοπράσινο όρμο.",
    },
  ],
  [
    "/el/paralies-xios/paralia-komi/",
    {
      title: "Παραλία Κώμη Χίου | Άμμος, παροχές & οικογενειακές συμβουλές",
      description:
        "Οργανώστε επίσκεψη στην παραλία Κώμη της Χίου: αμμουδιά, ρηχά νερά, ξαπλώστρες, εστιατόρια, οικογενειακές παροχές και εύκολη πρόσβαση.",
    },
  ],
  [
    "/el/paralies-xios/paralia-mavra-volia/",
    {
      title: "Μαύρα Βόλια Χίου | Μαύρα βότσαλα, πρόσβαση & συμβουλές",
      description:
        "Επισκεφθείτε τα Μαύρα Βόλια Χίου, τη διάσημη ηφαιστειακή παραλία με μαύρα βότσαλα. Δείτε πρόσβαση, συμβουλές κολύμβησης και κοντινές στάσεις.",
    },
  ],
]);