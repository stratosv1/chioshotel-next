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
    "/chios/chios-villages/",
    {
      title: "Chios Villages: The 7 Most Beautiful (Local's Guide)",
      description:
        "From painted Pyrgi to medieval Mesta and seaside Lagada: the 7 Chios villages worth a day, with route ideas and tips from locals in Kambos.",
    },
  ],
  [
    "/es/pueblos-chios/",
    {
      title: "Pueblos de Quíos: los 7 más bonitos (guía local)",
      description:
        "De la pintada Pyrgi a la medieval Mesta y el puerto de Lagada: los 7 pueblos imprescindibles de Quíos, con rutas y consejos de quienes viven en Kambos.",
    },
  ],
  [
    "/es/playas-chios/",
    {
      title: "Playas de Quíos: las 11 mejores + olas y viento hoy",
      description:
        "El mar en directo en 26 playas de Quíos: dónde está en calma hoy, olas y viento a 3 días y las 11 mejores playas, de Mavra Volia a Komi.",
    },
  ],
  [
    "/chios/chios-beaches/",
    {
      title: "Chios Beaches: 11 Best + Today's Waves & Wind",
      description:
        "Live sea check for 26 Chios beaches: where the sea is calm today, waves and wind for 3 days, plus the 11 best beaches from Mavra Volia to Komi.",
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
        "Guide to Mesta, the medieval fortress village of Chios: what to see, how to get there, where to park, how much time you need and what to combine.",
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
      // Matches the title/description the page sets explicitly (page.tsx), so
      // the WebPage JSON-LD and the rendered metadata agree.
      title: "Οικονομικά Δωμάτια στη Χίο | Οικονομικό Δίκλινο",
      description:
        "Ψάχνετε οικονομικά ή φθηνά δωμάτια στη Χίο; Δείτε τα οικονομικά δίκλινα του Voulamandis House στον Κάμπο για 2 άτομα, με μπάνιο, WiFi, κλιματισμό και ψυγείο.",
    },
  ],
  [
    "/el/domatia-xios/diklina-triklina-domatia/",
    {
      title: "Δίκλινα & Τρίκλινα Δωμάτια Ορόφου στη Χίο",
      description:
        "Δωμάτια ορόφου 1, 3 & 4 στον Κάμπο Χίου: 30–35 m², έως 4 άτομα, βεράντα ή ιδιωτικό μπαλκόνι, μικρή κουζίνα στα 3 & 4. Κλείστε απευθείας με 10% έκπτωση.",
    },
  ],
  [
    "/el/domatia-xios/oikogeneiako-diamerisma/",
    {
      // Matches the title/description the page sets explicitly (page.tsx owns
      // the Greek apartment intent), so the WebPage JSON-LD and metadata agree.
      title: "Διαμερίσματα στη Χίο | Οικογενειακά Διαμερίσματα",
      description:
        "Διαμερίσματα στη Χίο στο Voulamandis House στον Κάμπο. Τρία ευρύχωρα οικογενειακά διαμερίσματα 40–45 m² με πλήρη κουζίνα, καθιστικό και χώρο για έως 4 άτομα.",
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
      title: "Προσφορές διαμονής στη Χίο {{currentYear}} | Άμεση κράτηση",
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
      title: "Παραλίες Χίου: Οι 11 καλύτερες + κύμα & αέρας σήμερα",
      description:
        "Δείτε live πού έχει κύμα σήμερα σε 26 παραλίες της Χίου και πού είναι ήρεμα, με πρόγνωση 3 ημερών. Μαύρα Βόλια, Κώμη, Αγία Δύναμη και άλλες.",
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
        "Οδηγός για τα Μεστά Χίου, το μεσαιωνικό καστροχώρι: τι να δείτε, πώς θα πάτε, πού να παρκάρετε, πόση ώρα χρειάζεστε και τι να συνδυάσετε.",
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
      title: "Μεσαιωνικά χωριά Χίου | Τα καστροχώρια & η ιστορία τους",
      description:
        "Τα μεσαιωνικά χωριά της Χίου: γιατί χτίστηκαν σαν κάστρα, πώς να ξεχωρίσετε Μεστά, Πυργί, Ολύμπους και Βέσσα, και διαδρομή μίας μέρας από τον Κάμπο.",
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
  // Ahrefs audit (2026-10): meta descriptions too long/short. CTR-focused rewrites,
  // 120–155 chars, keyword first, concrete hook + honest benefit.
  [
    "/",
    {
      title: "Chios Accommodation in Kambos | 4.8★ Rooms & Apartments",
      description:
        "Rated 4.8/5 by guests: peaceful rooms & family apartments in a citrus garden in Kambos, minutes from Chios Town & the airport. Book direct, save 10%.",
    },
  ],
  [
    "/es/chios-en-grecia/",
    {
      title: "Guía de Quíos: playas secretas, pueblos medievales y masilla",
      description:
        "Calas turquesas, pueblos medievales pintados y la masilla que solo crece aquí: Quíos contada por locales de Kambos, con sus mejores consejos.",
    },
  ],
  [
    "/fr/chios-en-grece/",
    {
      title: "Guide de Chios : plages secrètes, villages médiévaux, mastic",
      description:
        "Criques turquoise, villages médiévaux peints et le mastic qui ne pousse qu’ici : Chios racontée par des locaux de Kambos, avec leurs meilleurs conseils.",
    },
  ],
  [
    "/de/chios-insel/",
    {
      title: "Chios Reiseführer: versteckte Strände, Dörfer & Mastix",
      description:
        "Türkisblaue Buchten, bemalte mittelalterliche Dörfer und Mastix, der nur hier wächst: Chios mit den besten Insidertipps von Einheimischen aus Kambos.",
    },
  ],
  [
    "/fr/plages-de-chios/plage-mavra-volia/",
    {
      title: "Plage Mavra Volia, Chios | Galets noirs volcaniques",
      description:
        "La plage la plus spectaculaire de Chios : galets noirs volcaniques, trois criques et falaises sauvages à Emporios. Accès et conseils de locaux.",
    },
  ],
  [
    "/es/playas-chios/playa-mavra-volia/",
    {
      title: "Playa Mavra Volia Emporios Chios | Paisaje volcánico único",
      description:
        "La playa más espectacular de Quíos: guijarros negros volcánicos, tres calas y acantilados salvajes en Emporios. Cómo llegar y consejos locales.",
    },
  ],
  [
    "/tr/sakiz-adasi-romantik-konaklama/",
    {
      title: "Sakız Adası Romantik Konaklama | Çiftler için Voulamandis House",
      description:
        "Çiftler için sakin bir kaçamak: Kambos’ta narenciye bahçesi, çift kişilik odalar, teraslar ve 4.8/5 misafir puanı. Direkt rezervasyonda %10 indirim.",
    },
  ],
  [
    "/it/spiagge-chios/spiaggia-elinta/",
    {
      title: "Spiaggia di Elinta a Chios | Baia riparata e ciottoli bianchi",
      description:
        "Una baia nascosta a ovest di Chios: ciottoli bianchi, acqua verde-azzurra e ombra naturale. Come arrivare e consigli dei locali per una giornata perfetta.",
    },
  ],
  [
    "/es/playas-chios/playa-agia-dynami/",
    {
      title: "Playa Agia Dynami Chios | Aguas esmeralda y cala escondida",
      description:
        "Una cala de ensueño cerca de Olympoi: aguas esmeralda, arena fina y sombra natural. Cómo llegar y consejos locales para disfrutarla al máximo.",
    },
  ],
  [
    "/fr/plages-de-chios/plage-agia-dynami/",
    {
      title: "Plage Agia Dynami à Chios | Eaux émeraude & crique cachée",
      description:
        "Une crique de rêve près d’Olympoi : eaux émeraude, sable fin et ombre naturelle. Accès et conseils de locaux pour en profiter pleinement.",
    },
  ],
  [
    "/fr/plages-de-chios/plage-avlonia/",
    {
      title: "Plage d’Avlonia à Chios | Joyau caché du sud de Chios",
      description:
        "Un joyau caché près de Pyrgi : eaux turquoise, nature sauvage et fonds parfaits pour le snorkeling. Accès et conseils de locaux pour y aller.",
    },
  ],
  [
    "/el/paralies-xios/paralia-lefkathia/",
    {
      title: "Παραλία Λευκάθια Χίος | Κρυστάλλινα νερά στη Βολισσό",
      description:
        "Κρυστάλλινα νερά, αρμυρίκια και από τα ωραιότερα ηλιοβασιλέματα της Χίου, δίπλα στη Βολισσό. Πώς θα πάτε και συμβουλές από ντόπιους.",
    },
  ],
  [
    "/el/paralies-xios/paralia-avlonia/",
    {
      title: "Παραλία Αυλωνιά Χίος | Κρυμμένος θησαυρός της νότιας Χίου",
      description:
        "Κρυμμένος κόλπος κοντά στο Πυργί με τιρκουάζ νερά, άγρια ομορφιά και βυθό ιδανικό για snorkeling. Πώς θα πάτε και συμβουλές από ντόπιους.",
    },
  ],
  [
    "/es/playas-chios/playa-avlonia/",
    {
      title: "Playa de Avlonia Chios | Joya escondida del sur de Chios",
      description:
        "Una joya escondida cerca de Pyrgi: aguas turquesas, naturaleza salvaje y fondos perfectos para hacer snorkel. Cómo llegar y consejos locales.",
    },
  ],
  [
    "/es/playas-chios/playa-nagos/",
    {
      title: "Playa de Nagos Chios | Paisaje verde del norte de Chios",
      description:
        "Un oasis verde en el norte de Quíos: manantiales, plátanos de sombra y aguas cristalinas junto a Kardamyla. Cómo llegar y consejos locales.",
    },
  ],
  [
    "/es/playas-chios/playa-salagona/",
    {
      title: "Playa de Salagona Chios | Tesoro turquesa escondido",
      description:
        "Un tesoro turquesa escondido cerca de los pueblos medievales: agua en calma, guijarros finos y snorkel excelente. Cómo llegar y consejos locales.",
    },
  ],
  [
    "/fr/plages-de-chios/plage-salagona/",
    {
      title: "Plage de Salagona à Chios | Trésor turquoise caché",
      description:
        "Un trésor turquoise caché près des villages médiévaux : eau calme, fins galets et snorkeling superbe. Accès et conseils de locaux pour y aller.",
    },
  ],
  [
    "/es/habitaciones-en-chios/habitaciones-dobles-estandar/",
    {
      title: "Habitaciones dobles y triples en primera planta en Quíos",
      description:
        "Habitaciones 1, 3 y 4 en Kambos, Quíos: 30–35 m², hasta 4 personas, terraza o balcón y kitchenette en la 3 y la 4. Reserva directa: -10%.",
    },
  ],
  [
    "/fr/plages-de-chios/plage-lithi/",
    {
      title: "Plage de Lithi à Chios | Sable familial & poisson frais",
      description:
        "Port naturel, eaux peu profondes et sable doré : la plage idéale en famille, avec tavernes de poisson les pieds dans l’eau. Accès et conseils.",
    },
  ],
  [
    "/es/playas-chios/playa-komi/",
    {
      title: "Playa de Komi, Quíos | Arena dorada y aguas poco profundas",
      description:
        "Una de las playas de arena favoritas de Quíos: aguas poco profundas, tabernas, beach bars y actividades. Ideal en familia. Cómo llegar y consejos.",
    },
  ],
  [
    "/fr/villages-medievaux-chios/",
    {
      title: "Villages médiévaux de Chios | Villages fortifiés & histoire",
      description:
        "Pourquoi Mesta, Pyrgi, Olympoi et Vessa ont été bâtis comme des forteresses, ce qui les distingue, et l’itinéraire parfait d’une journée.",
    },
  ],
  [
    "/es/playas-chios/playa-lefkathia/",
    {
      title: "Playa de Lefkathia Chios | Aguas cristalinas en Volissos",
      description:
        "Aguas cristalinas, tamariscos y uno de los atardeceres más bonitos de Quíos, junto a Volissos. Cómo llegar y consejos de quienes viven aquí.",
    },
  ],
  [
    "/fr/plages-de-chios/plage-lefkathia/",
    {
      title: "Plage de Lefkathia à Chios | Eaux cristallines à Volissos",
      description:
        "Eaux cristallines, tamaris et l’un des plus beaux couchers de soleil de Chios, près de Volissos. Accès et conseils de ceux qui vivent ici.",
    },
  ],
  [
    "/de/mittelalterliche-doerfer-chios/",
    {
      title: "Mittelalterliche Dörfer auf Chios | Wehrdörfer & Geschichte",
      description:
        "Warum Mesta, Pyrgi, Olympoi und Vessa wie Festungen gebaut wurden, was sie unterscheidet und die perfekte Tagesroute ab Kambos.",
    },
  ],
  [
    "/it/spiagge-vicine-voulamandis-house/",
    {
      title: "Spiagge vicino a Kambos, Chios: le 4 più comode",
      description:
        "Karfas, Glari, Agia Fotia e Daskalopetra: le spiagge più comode da Kambos, a breve distanza in auto. Perfette per mezze giornate, arrivi e partenze.",
    },
  ],
  [
    "/it/spiagge-di-sabbia-chios/",
    {
      title: "Spiagge di sabbia a Chios: Lithi, Karfas e Komi",
      description:
        "Sabbia dorata e acqua bassa: le 3 migliori spiagge di sabbia di Chios, perfette anche con i bambini. Come arrivare, servizi e consigli dei locali.",
    },
  ],
  [
    "/de/raketenkrieg-chios/",
    {
      title: "Raketenkrieg auf Chios | Rouketopolemos an Ostern",
      description:
        "In der Osternacht beschießen sich zwei Kirchengemeinden in Vrontados mit Tausenden Raketen. Wann, wo und wie Sie das Spektakel live erleben.",
    },
  ],
  [
    "/de/ruhige-straende-chios/",
    {
      title: "Ruhige Strände auf Chios: Elinta, Vroulidia & Nagos",
      description:
        "Weg von den Massen: Elinta, Vroulidia und Nagos sind die stillen Buchten von Chios mit klarem Wasser und wilder Natur. Anfahrt und Insidertipps.",
    },
  ],
  [
    "/tr/sakiz-adasi-roket-savasi/",
    {
      title: "Sakız Adası Roket Savaşı | Vrontados Paskalya geleneği",
      description:
        "Paskalya gecesi Vrontados’ta iki kilise binlerce roketle birbirini hedef alır. Sakız’ın en çılgın geleneğini ne zaman, nerede ve nasıl izleyeceğiniz.",
    },
  ],
  [
    "/it/spiagge-tranquille-chios/",
    {
      title: "Spiagge tranquille a Chios: Elinta, Vroulidia e Nagos",
      description:
        "Lontano dalla folla: Elinta, Vroulidia e Nagos sono le baie più silenziose di Chios, con acqua limpida e natura selvaggia. Come arrivare e consigli.",
    },
  ],
  [
    "/de/sandstraende-chios/",
    {
      title: "Sandstrände auf Chios: Lithi, Karfas & Komi",
      description:
        "Goldener Sand und flaches Wasser: die 3 schönsten Sandstrände von Chios, ideal auch mit Kindern. Anfahrt, Ausstattung und Tipps von Einheimischen.",
    },
  ],
  [
    "/es/guerra-de-cohetes-quios/",
    {
      title: "Guerra de cohetes de Quíos | Rouketopolemos en Pascua",
      description:
        "En la noche de Pascua, dos parroquias de Vrontados se lanzan miles de cohetes. Cuándo, dónde y cómo vivir en directo la tradición más loca de Quíos.",
    },
  ],
  [
    "/tr/sakiz-adasi-mostra-festivali/",
    {
      title: "Sakız Adası Mostra Festivali | Thymiana karnavalı",
      description:
        "Kostümler, müzik ve sokaklarda dans: Thymiana’nın renkli Mostra karnavalı, Kambos’a birkaç dakika. Sakız’ın en neşeli geleneğini yakından tanıyın.",
    },
  ],
  [
    "/de/straende-nahe-voulamandis-house/",
    {
      title: "Strände nahe Kambos, Chios: die 4 bequemsten",
      description:
        "Karfas, Glari, Agia Fotia und Daskalopetra: die bequemsten Strände ab Kambos, nur eine kurze Autofahrt entfernt. Ideal für halbe Tage und Anreisetage.",
    },
  ],
  [
    "/fr/guerre-des-fusees-chios/",
    {
      title: "Guerre des fusées de Chios | Rouketopolemos à Pâques",
      description:
        "La nuit de Pâques, deux paroisses de Vrontados s’envoient des milliers de fusées. Quand, où et comment vivre en direct la tradition la plus folle de Chios.",
    },
  ],
  [
    "/es/museos-chios/biblioteca-korais-chios/",
    {
      title: "Biblioteca Korais de Quíos | Libros raros y manuscritos",
      description:
        "Una de las bibliotecas históricas más importantes de Grecia: libros raros, manuscritos y el legado de Adamantios Korais. Qué ver y consejos de visita.",
    },
  ],
  [
    "/chios-quiet-beaches/",
    {
      title: "Quiet Beaches in Chios: Elinta, Vroulidia & Nagos",
      description:
        "Escape the crowds: Elinta, Vroulidia and Nagos are the calmest coves in Chios, with clear water and wild scenery. How to get there and local tips.",
    },
  ],
  [
    "/es/playas-de-arena-quios/",
    {
      title: "Playas de arena en Quíos: Lithi, Karfas y Komi",
      description:
        "Arena dorada y aguas poco profundas: las 3 mejores playas de arena de Quíos, ideales también con niños. Cómo llegar, servicios y consejos locales.",
    },
  ],
  [
    "/fr/plages-proches-voulamandis-house/",
    {
      title: "Plages près de Kambos, Chios : les 4 plus pratiques",
      description:
        "Karfas, Glari, Agia Fotia et Daskalopetra : les plages les plus pratiques depuis Kambos, à quelques minutes en voiture. Idéales pour une demi-journée.",
    },
  ],
  [
    "/tr/sakiz-adasi-sakin-plajlar/",
    {
      title: "Sakız Adası’nın sakin plajları: Elinta, Vroulidia, Nagos",
      description:
        "Kalabalıktan uzak: Elinta, Vroulidia ve Nagos, Sakız’ın berrak sulu ve vahşi doğalı en sakin koyları. Nasıl gidilir ve yerel öneriler.",
    },
  ],
  [
    "/es/playas-cerca-voulamandis-house/",
    {
      title: "Playas cerca de Kambos, Quíos: las 4 más cómodas",
      description:
        "Karfas, Glari, Agia Fotia y Daskalopetra: las playas más cómodas desde Kambos, a pocos minutos en coche. Perfectas para medias jornadas y llegadas.",
    },
  ],
  [
    "/fr/plages-de-sable-chios/",
    {
      title: "Plages de sable à Chios : Lithi, Karfas et Komi",
      description:
        "Sable doré et eaux peu profondes : les 3 plus belles plages de sable de Chios, idéales aussi avec des enfants. Accès, services et conseils de locaux.",
    },
  ],
  [
    "/es/playas-tranquilas-quios/",
    {
      title: "Playas tranquilas en Quíos: Elinta, Vroulidia y Nagos",
      description:
        "Lejos de las multitudes: Elinta, Vroulidia y Nagos son las calas más tranquilas de Quíos, con agua cristalina y naturaleza salvaje. Cómo llegar.",
    },
  ],
  [
    "/tr/sakiz-adasi-kumlu-plajlar/",
    {
      title: "Sakız Adası kumlu plajları: Lithi, Karfas ve Komi",
      description:
        "Altın kum ve sığ deniz: Sakız Adası’nın en güzel 3 kumlu plajı, çocuklu aileler için de ideal. Nasıl gidilir, olanaklar ve yerel öneriler.",
    },
  ],
  [
    "/tr/voulamandis-house-yakin-plajlar/",
    {
      title: "Kambos’a yakın plajlar, Sakız Adası: en pratik 4 plaj",
      description:
        "Karfas, Glari, Agia Fotia ve Daskalopetra: Kambos’tan arabayla kısa mesafedeki en pratik plajlar. Yarım gün, varış ve ayrılış günleri için ideal.",
    },
  ],
]);
