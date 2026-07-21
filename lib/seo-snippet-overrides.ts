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
    "/chios/kampos-chios/",
    {
      title: "Stay in Kambos Chios | Rooms & Family Apartments",
      description:
        "Quiet rooms and family apartments in historic Kambos, Chios. Stay among citrus gardens near beaches, the airport and Chios Town.",
    },
  ],
  [
    "/fr/chios/kampos-chios/",
    {
      title: "Séjour à Kambos Chios | Chambres & Appartements",
      description:
        "Chambres calmes et appartements familiaux dans le Kambos historique de Chios, près des plages, de l’aéroport et de la ville.",
    },
  ],
  [
    "/de/chios/kampos-chios/",
    {
      title: "Übernachten in Kambos Chios | Zimmer & Apartments",
      description:
        "Ruhige Zimmer und Familienapartments im historischen Kambos auf Chios, nahe Stränden, Flughafen und Chios-Stadt.",
    },
  ],
  [
    "/it/chios/kampos-chios/",
    {
      title: "Soggiorno a Kambos Chios | Camere & Appartamenti",
      description:
        "Camere tranquille e appartamenti familiari nello storico Kambos di Chios, vicino a spiagge, aeroporto e città.",
    },
  ],
  [
    "/es/chios/kampos-chios/",
    {
      title: "Alojamiento en Kambos Quíos | Habitaciones y Apartamentos",
      description:
        "Habitaciones tranquilas y apartamentos familiares en el Kambos histórico de Quíos, cerca de playas, aeropuerto y ciudad.",
    },
  ],
  [
    "/tr/chios/kampos-chios/",
    {
      title: "Sakız Kambos Konaklama | Oda ve Aile Daireleri",
      description:
        "Tarihi Kambos’ta sakin odalar ve aile daireleri. Plajlara, havaalanına ve Sakız merkeze yakın narenciye bahçeleri içinde konaklama.",
    },
  ],
  [
    "/el/chios/kampos-chios/",
    {
      title: "Διαμονή στον Κάμπο Χίου | Ενοικιαζόμενα δωμάτια",
      description:
        "Ήσυχα ενοικιαζόμενα δωμάτια και οικογενειακά διαμερίσματα στον ιστορικό Κάμπο της Χίου, κοντά σε παραλίες, αεροδρόμιο και πόλη.",
    },
  ],
  [
    "/el/diamoni-sti-xio/",
    {
      title: "Διαμονή στη Χίο | Δωμάτια & διαμερίσματα στον Κάμπο",
      description:
        "Μείνετε στον ιστορικό Κάμπο της Χίου σε ήσυχα δωμάτια ή οικογενειακά διαμερίσματα, κοντά σε πόλη, αεροδρόμιο και παραλίες.",
    },
  ],
  [
    "/el/domatia-xios/",
    {
      title: "Δωμάτια στη Χίο | Δίκλινα & οικογενειακά διαμερίσματα",
      description:
        "Συγκρίνετε οικονομικά δίκλινα, δωμάτια ισογείου ή ορόφου και οικογενειακά διαμερίσματα στον Κάμπο της Χίου.",
    },
  ],
  [
    "/el/domatia-xios/oikonomiko-diklino-domatio/",
    {
      title: "Οικονομικά δίκλινα δωμάτια στη Χίο | Κάμπος",
      description:
        "Ανακαινισμένα οικονομικά δίκλινα για 2 άτομα στον Κάμπο της Χίου, με κλιματισμό, Wi‑Fi, ψυγείο και ιδιωτικό μπάνιο.",
    },
  ],
  [
    "/el/domatia-xios/diklina-triklina-domatia/",
    {
      title: "Δίκλινα & τρίκλινα δωμάτια στη Χίο | Κάμπος",
      description:
        "Επιλέξτε ισόγειο δωμάτιο με πρόσβαση στον κήπο ή δωμάτιο ορόφου με βεράντα, για 2–4 άτομα στο Voulamandis House.",
    },
  ],
  [
    "/el/domatia-xios/oikogeneiako-diamerisma/",
    {
      title: "Οικογενειακά διαμερίσματα στη Χίο | Κουζίνα & άνεση",
      description:
        "Ευρύχωρα οικογενειακά διαμερίσματα 40–45 m² στον Κάμπο, με πλήρη κουζίνα, καθιστικό και χώρο για έως 4 άτομα.",
    },
  ],
  [
    "/el/amesi-kratisi-voulamandis-house/",
    {
      title: "Άμεση κράτηση στη Χίο | Διαθεσιμότητα & καλύτερη τιμή",
      description:
        "Ελέγξτε διαθεσιμότητα σε πραγματικό χρόνο, επιλέξτε δωμάτιο ή διαμέρισμα και κάντε ασφαλή απευθείας κράτηση χωρίς προμήθειες.",
    },
  ],
  [
    "/el/vres-to-domatio-sou/",
    {
      title: "Βρες δωμάτιο στη Χίο | Σύγκρινε διαθέσιμες επιλογές",
      description:
        "Διάλεξε ημερομηνίες και επισκέπτες, σύγκρινε διαθέσιμα δωμάτια και άμεσες τιμές και στείλε έτοιμο αίτημα στο Voulamandis House.",
    },
  ],
  [
    "/el/crazy-travel-deals-for-chios-hotels/",
    {
      title: "Προσφορές διαμονής στη Χίο | Κωδικοί άμεσης κράτησης",
      description:
        "Δείτε διαθέσιμες προσφορές για δωμάτια και διαμερίσματα στη Χίο, εκπτωτικούς κωδικούς και επιλογές απευθείας κράτησης.",
    },
  ],
  [
    "/el/diakopes-sti-chio-quiz/",
    {
      title: "Quiz διακοπών στη Χίο | Βρες την ιδανική εμπειρία",
      description:
        "Κάντε το quiz, ανακαλύψτε ποιες παραλίες, χωριά και εμπειρίες της Χίου σας ταιριάζουν και λάβετε κωδικό για τη διαμονή σας.",
    },
  ],
  [
    "/el/geuseis-tis-xiou/",
    {
      title: "Γεύσεις της Χίου | Μαστίχα, προϊόντα & τοπικό φαγητό",
      description:
        "Ανακαλύψτε μαστίχα, μανταρίνι, παραδοσιακά γλυκά, τοπικά ποτά, ταβέρνες και αυθεντικές γαστρονομικές εμπειρίες στη Χίο.",
    },
  ],
  [
    "/el/exerevnisi-xiou/",
    {
      title: "Εξερεύνηση Χίου | Χωριά, πολιτισμός & διαδρομές",
      description:
        "Οργανώστε πολιτιστικές διαδρομές στη Χίο με μεσαιωνικά χωριά, μουσεία, μαστίχα, βιβλιοθήκες, μονοπάτια και στάσεις δίπλα στη θάλασσα.",
    },
  ],
  [
    "/el/festival-mostra-thymiana-xios/",
    {
      title: "Μόστρα Θυμιανών Χίου | Έθιμο, ιστορία & πρόγραμμα",
      description:
        "Γνωρίστε τη Μόστρα των Θυμιανών, το αποκριάτικο έθιμο της Χίου με μουσική, χορό, παραδοσιακές στολές και γιορτινή ατμόσφαιρα.",
    },
  ],
  [
    "/el/mathimata-ellinikon-sti-xio/",
    {
      title: "Μαθήματα Ελληνικών στη Χίο | Alexandria Institute",
      description:
        "Συνδυάστε μαθήματα ελληνικής γλώσσας στη Χίο με πολιτισμό, ιστορία, μαστίχα, πασχαλινά έθιμα και καθημερινή νησιωτική ζωή.",
    },
  ],
  [
    "/el/rouketopolemos-xios/",
    {
      title: "Ρουκετοπόλεμος Χίου | Πασχαλινό έθιμο στον Βροντάδο",
      description:
        "Μάθετε την ιστορία του Ρουκετοπόλεμου στον Βροντάδο, πότε γίνεται, από πού να τον παρακολουθήσετε και τι χρειάζεται να γνωρίζετε.",
    },
  ],
  [
    "/el/orchidees-xiou/",
    {
      title: "Ορχιδέες της Χίου | Είδη, εποχή & τοποθεσίες",
      description:
        "Ανακαλύψτε άγριες ορχιδέες της Χίου, την καλύτερη εποχή ανθοφορίας και περιοχές όπου μπορείτε να τις παρατηρήσετε με σεβασμό στη φύση.",
    },
  ],
  [
    "/el/pezoporia-sti-xio/",
    {
      title: "Πεζοπορία στη Χίο | Μονοπάτια, διαδρομές & φύση",
      description:
        "Ανακαλύψτε πεζοπορικές διαδρομές στη Χίο μέσα από μαστιχοχώρια, βουνά, περιβόλια και παράκτια τοπία, με πρακτικές συμβουλές.",
    },
  ],
  [
    "/el/iamatika-loutra-xiou/",
    {
      title: "Ιαματικά λουτρά Χίου | Αγιάσματα & χρήσιμες πληροφορίες",
      description:
        "Οργανώστε επίσκεψη στα ιαματικά λουτρά Αγιασμάτων στη βόρεια Χίο, με πληροφορίες πρόσβασης, εμπειρίας και κοντινών διαδρομών.",
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
    "/el/paralies-xios-gia-paidia/",
    {
      title: "Παραλίες Χίου για παιδιά | Οικογενειακός οδηγός",
      description:
        "Δείτε Κώμη, Καρφά, Λιθί και Αγία Δύναμη, με πληροφορίες για άμμο, πρόσβαση, παροχές και πρακτική οργάνωση για οικογένειες.",
    },
  ],
  [
    "/el/paralies-me-ammo-xios/",
    {
      title: "Παραλίες με άμμο στη Χίο | Λιθί, Καρφάς & Κώμη",
      description:
        "Τοπικός οδηγός για αμμώδεις παραλίες στη Χίο, με πληροφορίες για είσοδο στη θάλασσα, πρόσβαση, παροχές και επιλογή ανάλογα με τον αέρα.",
    },
  ],
  [
    "/el/apanemes-paralies-xios/",
    {
      title: "Απάνεμες παραλίες Χίου | Επιλογές ανάλογα με τον αέρα",
      description:
        "Δείτε Σαλάγωνα, Αγία Δύναμη, Βρουλίδια, Κάτω Φανά και Ελίντα, με πρακτικές συμβουλές για πιο προστατευμένο μπάνιο στη Χίο.",
    },
  ],
  [
    "/el/organomenes-paralies-xios/",
    {
      title: "Οργανωμένες παραλίες Χίου | Παροχές, πρόσβαση & φαγητό",
      description:
        "Συγκρίνετε οργανωμένες παραλίες στη Χίο με ξαπλώστρες, εύκολη πρόσβαση, χώρους στάθμευσης, καφέ και επιλογές φαγητού.",
    },
  ],
  [
    "/el/isixes-paralies-xios/",
    {
      title: "Ήσυχες παραλίες Χίου | Ελίντα, Βρουλίδια & Ναγός",
      description:
        "Ανακαλύψτε ήσυχες παραλίες της Χίου με λιγότερο κόσμο και φυσικό τοπίο, μαζί με συμβουλές πρόσβασης και απαραίτητες προμήθειες.",
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
  [
    "/el/paralies-xios/paralia-salagona/",
    {
      title: "Παραλία Σαλάγωνα Χίου | Πρόσβαση, νερά & συμβουλές",
      description:
        "Οργανώστε επίσκεψη στη Σαλάγωνα της Χίου, μια ήσυχη παραλία με άμμο και βότσαλο, καθαρά νερά και πιο απομονωμένη ατμόσφαιρα.",
    },
  ],
  [
    "/el/paralies-xios/paralia-agia-fotia/",
    {
      title: "Αγία Φωτιά Χίου | Παραλία, πρόσβαση & παροχές",
      description:
        "Δείτε πώς θα φτάσετε στην Αγία Φωτιά Χίου, τι παροχές θα βρείτε, πού μπορείτε να φάτε και τι να γνωρίζετε πριν από το μπάνιο σας.",
    },
  ],
  [
    "/el/paralies-xios/paralia-lithi/",
    {
      title: "Παραλία Λιθί Χίου | Άμμος, ρηχά νερά & ταβέρνες",
      description:
        "Ανακαλύψτε την παραλία Λιθί στη δυτική Χίο, με αμμουδιά, ρηχά νερά, εύκολη πρόσβαση και ψαροταβέρνες δίπλα στη θάλασσα.",
    },
  ],
  [
    "/el/paralies-xios/paralia-vroulidia/",
    {
      title: "Παραλία Βρουλίδια Χίου | Πρόσβαση, νερά & συμβουλές",
      description:
        "Οργανώστε επίσκεψη στα Βρουλίδια της νότιας Χίου, με πληροφορίες πρόσβασης, χαρακτηριστικά παραλίας και πρακτικές συμβουλές.",
    },
  ],
  [
    "/el/paralies-xios/paralia-nagos/",
    {
      title: "Παραλία Ναγός Χίου | Πρόσβαση, σκιά & χρήσιμες συμβουλές",
      description:
        "Ανακαλύψτε τον Ναγό στη βόρεια Χίο, με καθαρά νερά, φυσική σκιά και πληροφορίες για πρόσβαση, παροχές και κοντινές στάσεις.",
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
    "/el/mastichochoria-xios/",
    {
      title: "Μαστιχοχώρια Χίου | Χωριά, μαστίχα & διαδρομές",
      description:
        "Οργανώστε διαδρομή σε Πυργί, Μεστά, Ολύμπους, Αρμόλια και Βέσσα, με μεσαιωνικά σοκάκια, ξυστά, μαστίχα και τοπική παράδοση.",
    },
  ],
  [
    "/el/mesaionika-xoria-xios/",
    {
      title: "Μεσαιωνικά χωριά Χίου | Καστροχώρια & διαδρομές",
      description:
        "Ανακαλύψτε τα μεσαιωνικά χωριά της Χίου, με οχυρωμένη αρχιτεκτονική, πέτρινα σοκάκια, ιστορία και ιδέες για ημερήσιες διαδρομές.",
    },
  ],
  [
    "/el/parathalassia-xoria-xios/",
    {
      title: "Παραθαλάσσια χωριά Χίου | Λιμάνια, φαγητό & διαδρομές",
      description:
        "Γνωρίστε παραθαλάσσια χωριά της Χίου, μικρά λιμάνια, ταβέρνες και όμορφες ακτογραμμές, με προτάσεις για στάσεις και ημερήσιες εκδρομές.",
    },
  ],
  [
    "/el/mouseia-xios/",
    {
      title: "Μουσεία Χίου | Ιστορία, μαστίχα & πολιτισμός",
      description:
        "Ανακαλύψτε τα σημαντικότερα μουσεία της Χίου για αρχαιολογία, βυζαντινή τέχνη, ναυτική ιστορία, σπάνια βιβλία, λαογραφία και μαστίχα.",
    },
  ],
  [
    "/el/mouseia-xios/vyzantino-mouseio-xios/",
    {
      title: "Βυζαντινό Μουσείο Χίου | Εκθέματα & οδηγός επίσκεψης",
      description:
        "Επισκεφθείτε το Βυζαντινό Μουσείο Χίου και ανακαλύψτε εικόνες, τοιχογραφίες, χειρόγραφα και τη βυζαντινή κληρονομιά του νησιού.",
    },
  ],
  [
    "/el/mouseia-xios/arxaiologiko-mouseio-xios/",
    {
      title: "Αρχαιολογικό Μουσείο Χίου | Εκθέματα & πληροφορίες",
      description:
        "Δείτε αρχαία ευρήματα, κεραμική, γλυπτά, ειδώλια και κοσμήματα στο Αρχαιολογικό Μουσείο Χίου, με χρήσιμες πληροφορίες επίσκεψης.",
    },
  ],
  [
    "/el/mouseia-xios/vivliothiki-korai-xios/",
    {
      title: "Βιβλιοθήκη Κοραή Χίου | Σπάνια βιβλία & χειρόγραφα",
      description:
        "Επισκεφθείτε τη Βιβλιοθήκη Κοραή στη Χίο και γνωρίστε σπάνια βιβλία, χειρόγραφα, ιστορικά αρχεία και σημαντικές συλλογές.",
    },
  ],
  [
    "/el/mouseia-xios/mouseio-mastichas-xios/",
    {
      title: "Μουσείο Μαστίχας Χίου | Καλλιέργεια, ιστορία & επίσκεψη",
      description:
        "Ανακαλύψτε την καλλιέργεια, τη συλλογή και την ιστορία της μαστίχας στο Μουσείο Μαστίχας Χίου και συνδυάστε το με τα Μαστιχοχώρια.",
    },
  ],
  [
    "/el/mouseia-xios/naftiko-mouseio-xios/",
    {
      title: "Ναυτικό Μουσείο Χίου | Ναυτιλία, πλοία & ιστορία",
      description:
        "Γνωρίστε τη ναυτική παράδοση της Χίου μέσα από μοντέλα πλοίων, εργαλεία, αρχεία και εκθέματα για τη ναυτιλία και το εμπόριο.",
    },
  ],
]);
