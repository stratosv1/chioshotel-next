/**
 * "Medieval villages of Chios" — fortress-village guide content (7 languages).
 * Differentiates the category page from the individual village pages:
 * history of the fortress villages, how they were built, a comparison table,
 * a one-day route from Kambos, a mid-page stay block, distances and FAQ.
 *
 * Historical framing based on the travel.gr feature on the medieval villages
 * of Chios (Byzantine origins, Genoese defensive planning against pirates,
 * Ottoman period; Mesta's maze-like layout; Armolia pottery; Pyrgi xysta)
 * plus widely documented dates of Genoese rule (1346–1566).
 */

export type MedievalGuideLanguage = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";

export type MedievalGuide = {
  answer: { kicker: string; title: string; text: string; bullets: string[] };
  history: {
    kicker: string;
    title: string;
    intro: string;
    sections: { title: string; paragraphs: string[] }[];
  };
  comparison: {
    kicker: string;
    title: string;
    intro: string;
    headers: { village: string; character: string; mustSee: string; time: string };
    rows: { name: string; href: string; character: string; mustSee: string; time: string }[];
  };
  route: {
    kicker: string;
    title: string;
    intro: string;
    steps: { title: string; text: string; href?: string; linkLabel?: string }[];
  };
  stay: {
    title: string;
    text: string;
    linkLabel: string;
    href: string;
    benefits: string[];
    primaryLabel: string;
    secondaryLabel: string;
    imageAlt: string;
    imageLabel: string;
  };
  distances: {
    title: string;
    note: string;
    items: { label: string; value: string; href?: string }[];
  };
  faq: { kicker: string; title: string; items: { question: string; answer: string }[] };
  seo: { title: string; description: string };
  hero: { title: string; description: string };
};

type Paths = {
  stay: string;
  mesta: string;
  pyrgi: string;
  olympoi: string;
  vessa: string;
  armolia: string;
  volissos: string;
  masticMuseum: string;
  masticVillages: string;
};

const paths: Record<MedievalGuideLanguage, Paths> = {
  en: {
    stay: "/chios-accommodation/",
    mesta: "/chios/chios-villages/mesta-chios/",
    pyrgi: "/chios/chios-villages/chios-pyrgi/",
    olympoi: "/chios/chios-villages/olympoi-chios/",
    vessa: "/chios/chios-villages/vessa-chios/",
    armolia: "/chios/chios-villages/armolia-chios/",
    volissos: "/chios/chios-villages/volissos-chios/",
    masticMuseum: "/chios/chios-museums/the-mastic-museum-chios/",
    masticVillages: "/chios-mastic-villages/",
  },
  el: {
    stay: "/el/diamoni-sti-xio/",
    mesta: "/el/xoria-xios/mesta-xios/",
    pyrgi: "/el/xoria-xios/pyrgi-xios/",
    olympoi: "/el/xoria-xios/olympoi-xios/",
    vessa: "/el/xoria-xios/vessa-xios/",
    armolia: "/el/xoria-xios/armolia-xios/",
    volissos: "/el/xoria-xios/volissos-xios/",
    masticMuseum: "/el/mouseia-xios/mouseio-mastichas-xios/",
    masticVillages: "/el/mastichochoria-xios/",
  },
  fr: {
    stay: "/fr/hebergement-chios/",
    mesta: "/fr/villages-de-chios/village-mesta/",
    pyrgi: "/fr/villages-de-chios/village-pyrgi/",
    olympoi: "/fr/villages-de-chios/village-olympoi/",
    vessa: "/fr/villages-de-chios/village-vessa/",
    armolia: "/fr/villages-de-chios/village-armolia/",
    volissos: "/fr/villages-de-chios/village-volissos/",
    masticMuseum: "/fr/musees-de-chios/musee-du-mastic-chios/",
    masticVillages: "/fr/villages-du-mastic-chios/",
  },
  de: {
    stay: "/de/chios-unterkunft/",
    mesta: "/de/doerfer-chios/mesta-dorf/",
    pyrgi: "/de/doerfer-chios/pyrgi-dorf/",
    olympoi: "/de/doerfer-chios/olympoi-dorf/",
    vessa: "/de/doerfer-chios/vessa-dorf/",
    armolia: "/de/doerfer-chios/armolia-dorf/",
    volissos: "/de/doerfer-chios/volissos-dorf/",
    masticMuseum: "/de/museen-chios/mastix-museum-chios/",
    masticVillages: "/de/mastixdoerfer-chios/",
  },
  it: {
    stay: "/it/alloggio-chios/",
    mesta: "/it/villaggi-chios/villaggio-mesta/",
    pyrgi: "/it/villaggi-chios/villaggio-pyrgi/",
    olympoi: "/it/villaggi-chios/villaggio-olympoi/",
    vessa: "/it/villaggi-chios/villaggio-vessa/",
    armolia: "/it/villaggi-chios/villaggio-armolia/",
    volissos: "/it/villaggi-chios/villaggio-volissos/",
    masticMuseum: "/it/musei-chios/museo-del-mastice-chios/",
    masticVillages: "/it/villaggi-del-mastice-chios/",
  },
  es: {
    stay: "/es/alojamiento-chios/",
    mesta: "/es/pueblos-chios/pueblo-mesta/",
    pyrgi: "/es/pueblos-chios/pueblo-pyrgi/",
    olympoi: "/es/pueblos-chios/pueblo-olympoi/",
    vessa: "/es/pueblos-chios/pueblo-vessa/",
    armolia: "/es/pueblos-chios/pueblo-armolia/",
    volissos: "/es/pueblos-chios/pueblo-volissos/",
    masticMuseum: "/es/museos-chios/museo-mastiha-chios/",
    masticVillages: "/es/pueblos-del-mastiha-quios/",
  },
  tr: {
    stay: "/tr/sakiz-adasi-konaklama/",
    mesta: "/tr/sakiz-adasi-koyleri/mesta-koyu/",
    pyrgi: "/tr/sakiz-adasi-koyleri/pyrgi-koyu/",
    olympoi: "/tr/sakiz-adasi-koyleri/olympoi-koyu/",
    vessa: "/tr/sakiz-adasi-koyleri/vessa-koyu/",
    armolia: "/tr/sakiz-adasi-koyleri/armolia-koyu/",
    volissos: "/tr/sakiz-adasi-koyleri/volissos-koyu/",
    masticMuseum: "/tr/sakiz-adasi-muzeleri/sakiz-mastik-muzesi/",
    masticVillages: "/tr/sakiz-adasi-mastik-koyleri/",
  },
};

function el(p: Paths): MedievalGuide {
  return {
    seo: {
      title: "Μεσαιωνικά χωριά Χίου | Τα καστροχώρια & η ιστορία τους",
      description:
        "Τα μεσαιωνικά χωριά της Χίου: γιατί χτίστηκαν σαν κάστρα, πώς να ξεχωρίσετε Μεστά, Πυργί, Ολύμπους και Βέσσα, και διαδρομή μίας μέρας από τον Κάμπο.",
    },
    hero: {
      title: "Τα καστροχώρια της Χίου",
      description:
        "Μεσαιωνικά χωριά χτισμένα σαν φρούρια για να προστατεύουν τη μαστίχα: τι τα κάνει μοναδικά, πώς να τα ξεχωρίσετε και πώς να τα δείτε σε μία μέρα.",
    },
    answer: {
      kicker: "Γρήγορη απάντηση",
      title: "Ποια είναι τα μεσαιωνικά χωριά της Χίου;",
      text: "Είναι τα καστροχώρια της νότιας Χίου, χτισμένα σαν φρούρια για να προστατεύουν τη μαστίχα από τους πειρατές. Τα πιο ακέραια είναι τα Μεστά και οι Ολύμποι. Το Πυργί ξεχωρίζει για τα ξυστά του και η Βολισσός για το κάστρο της στα βορειοδυτικά.",
      bullets: [
        "Μεστά: το πιο ακέραιο καστροχώρι",
        "Πυργί: το «ζωγραφιστό» χωριό με τα ξυστά",
        "Ολύμποι και Βέσσα: πιο ήσυχα, με λίγο κόσμο",
        "Όλα τα νότια χωριά χωρούν σε μία μέρα από τον Κάμπο",
      ],
    },
    history: {
      kicker: "Ιστορία",
      title: "Γιατί η Χίος έχει χωριά-κάστρα",
      intro:
        "Η Χίος βρισκόταν για αιώνες στο σταυροδρόμι Ανατολής και Δύσης. Ο πλούτος της, η μαστίχα, την έκανε στόχο πειρατών, και τα χωριά του νότου απάντησαν με έναν μοναδικό τρόπο δόμησης.",
      sections: [
        {
          title: "Από το Βυζάντιο στους Γενουάτες",
          paragraphs: [
            "Οι οικισμοί έχουν τις ρίζες τους στη βυζαντινή εποχή. Τη μορφή που βλέπουμε σήμερα την έδωσαν κυρίως οι Γενουάτες, που κυβέρνησαν το νησί από το 1346 έως το 1566 και έλεγχαν το εμπόριο της μαστίχας.",
            "Για να προστατέψουν τη συγκομιδή και τους κατοίκους από τις επιδρομές, οργάνωσαν τα χωριά σαν οχυρά. Μετά το 1566 η Χίος πέρασε στους Οθωμανούς, αλλά τα καστροχώρια κράτησαν τη δομή τους.",
          ],
        },
        {
          title: "Πώς είναι χτισμένο ένα καστροχώρι",
          paragraphs: [
            "Τα εξωτερικά σπίτια ενώνονται μεταξύ τους και σχηματίζουν συνεχές τείχος χωρίς παράθυρα προς τα έξω. Μέσα, τα σοκάκια είναι στενά, στρίβουν σαν λαβύρινθος και περνούν κάτω από καμάρες και θολωτά περάσματα.",
            "Στο κέντρο υπήρχε ένας πύργος, το τελευταίο καταφύγιο σε περίπτωση επίθεσης. Στην αρχιτεκτονική φαίνονται έντονες ιταλικές επιρροές, δεμένες με την ντόπια πέτρα.",
          ],
        },
        {
          title: "Τι θα δείτε γύρω από τα χωριά",
          paragraphs: [
            "Στην ύπαιθρο των Μαστιχοχωρίων θα συναντήσετε μεσαιωνικούς πύργους παρατήρησης, μικρές εκκλησίες και αρχαιολογικά ίχνη παλιότερων οικισμών. Ανάμεσά τους απλώνονται τα μαστιχόδεντρα που έκαναν αυτά τα χωριά πλούσια.",
          ],
        },
      ],
    },
    comparison: {
      kicker: "Σύγκριση",
      title: "Ποιο μεσαιωνικό χωριό να διαλέξετε",
      intro: "Αν δεν έχετε χρόνο για όλα, αυτός ο πίνακας δείχνει τι κάνει το καθένα ξεχωριστό.",
      headers: { village: "Χωριό", character: "Χαρακτήρας", mustSee: "Μην χάσετε", time: "Χρόνος" },
      rows: [
        { name: "Μεστά", href: p.mesta, character: "Το πιο ακέραιο καστροχώρι", mustSee: "Τα δύο Ταξιάρχες και τα σοκάκια με καμάρες", time: "1,5–2 ώρες" },
        { name: "Πυργί", href: p.pyrgi, character: "Το «ζωγραφιστό» χωριό", mustSee: "Τα ασπρόμαυρα ξυστά στις προσόψεις", time: "1–1,5 ώρα" },
        { name: "Ολύμποι", href: p.olympoi, character: "Ήσυχο καστροχώρι", mustSee: "Τον κεντρικό πύργο και το κοντινό σπήλαιο", time: "45–60 λεπτά" },
        { name: "Βέσσα", href: p.vessa, character: "Μικρό και ήσυχο", mustSee: "Τα πέτρινα σπίτια χωρίς τουριστικό κόσμο", time: "30–45 λεπτά" },
        { name: "Αρμόλια", href: p.armolia, character: "Το χωριό της κεραμικής", mustSee: "Τα εργαστήρια με στάμνες, κύκνους, ήλιους και φεγγάρια", time: "30–45 λεπτά" },
        { name: "Βολισσός", href: p.volissos, character: "Βορειοδυτικά, με κάστρο", mustSee: "Το κάστρο στον λόφο και τη θέα", time: "Ξεχωριστή μέρα" },
      ],
    },
    route: {
      kicker: "Διαδρομή μίας μέρας",
      title: "Τα νότια καστροχώρια σε μία μέρα από τον Κάμπο",
      intro: "Ο Κάμπος βρίσκεται στη νότια έξοδο της πόλης, πάνω στον δρόμο για τα Μαστιχοχώρια. Αυτή η σειρά αποφεύγει τα πήγαινε-έλα.",
      steps: [
        { title: "Πρωί: ξεκίνημα από τον Κάμπο", text: "Φύγετε νωρίς, πριν τη ζέστη. Η πρώτη στάση είναι περίπου 25 λεπτά μακριά.", href: p.stay, linkLabel: "Διαμονή στον Κάμπο →" },
        { title: "Αρμόλια", text: "Σύντομη στάση στα εργαστήρια κεραμικής, μια τέχνη που περνά από γενιά σε γενιά.", href: p.armolia, linkLabel: "Αρμόλια →" },
        { title: "Πυργί και Μουσείο Μαστίχας", text: "Περπατήστε ανάμεσα στα ξυστά και δείτε στο μουσείο πώς καλλιεργείται η μαστίχα.", href: p.pyrgi, linkLabel: "Πυργί →" },
        { title: "Ολύμποι", text: "Ήσυχη βόλτα γύρω από τον κεντρικό πύργο, λίγο πριν το μεσημέρι.", href: p.olympoi, linkLabel: "Ολύμποι →" },
        { title: "Μεστά για φαγητό", text: "Χαθείτε στα σοκάκια και φάτε στην πλατεία ή στο Λιμάνι Μεστών.", href: p.mesta, linkLabel: "Μεστά →" },
        { title: "Απόγευμα και επιστροφή", text: "Μπάνιο σε μια παραλία του νότου, όπως τα Μαύρα Βόλια ή η Κώμη, και επιστροφή στον Κάμπο για βραδινό.", href: p.masticVillages, linkLabel: "Μαστιχοχώρια →" },
      ],
    },
    stay: {
      title: "Τα καστροχώρια ξεκινούν 25 λεπτά από το περιβόλι σας",
      text: "Ο Κάμπος είναι πάνω στον δρόμο για τα Μαστιχοχώρια: φεύγετε νωρίς χωρίς να περάσετε από την πόλη και το βράδυ επιστρέφετε σε ένα ήσυχο, ιστορικό περιβόλι.",
      linkLabel: "Διαμονή στη Χίο στο Voulamandis House",
      href: p.stay,
      benefits: [
        "Δωρεάν στάθμευση για τις εκδρομές σας",
        "Δωμάτια και οικογενειακά διαμερίσματα",
        "Απευθείας κράτηση χωρίς προμήθειες",
      ],
      primaryLabel: "Δείτε διαθεσιμότητα",
      secondaryLabel: "Δωμάτια & διαμερίσματα",
      imageAlt: "Η αυλή του Voulamandis House στον Κάμπο της Χίου",
      imageLabel: "Voulamandis House · Κάμπος",
    },
    distances: {
      title: "Αποστάσεις από τον Κάμπο",
      note: "Ενδεικτικοί χρόνοι με αυτοκίνητο.",
      items: [
        { label: "Αρμόλια", value: "περίπου 25 λεπτά" },
        { label: "Πυργί", value: "περίπου 30 λεπτά" },
        { label: "Ολύμποι", value: "περίπου 35–40 λεπτά" },
        { label: "Μεστά", value: "περίπου 40–45 λεπτά" },
        { label: "Βέσσα", value: "περίπου 40 λεπτά" },
        { label: "Βολισσός", value: "περίπου 1 ώρα" },
        { label: "Voulamandis House", value: "Δείτε τη διαμονή στον Κάμπο", href: p.stay },
      ],
    },
    faq: {
      kicker: "Συχνές ερωτήσεις",
      title: "Ερωτήσεις για τα μεσαιωνικά χωριά της Χίου",
      items: [
        { question: "Ποια είναι τα μεσαιωνικά χωριά της Χίου;", answer: "Τα πιο γνωστά είναι τα Μεστά, το Πυργί, οι Ολύμποι και η Βέσσα στη νότια Χίο, και η Βολισσός με το κάστρο της στα βορειοδυτικά." },
        { question: "Γιατί λέγονται καστροχώρια;", answer: "Γιατί είναι χτισμένα σαν κάστρα: τα εξωτερικά σπίτια σχηματίζουν τείχος, τα σοκάκια είναι λαβύρινθος και στο κέντρο υπήρχε πύργος για άμυνα." },
        { question: "Ποιο να δω αν έχω λίγο χρόνο;", answer: "Τα Μεστά για την οχυρωμένη δομή και το Πυργί για τα ξυστά. Απέχουν περίπου 10 χλμ. και χωρούν σε ένα πρωινό." },
        { question: "Μπορώ να τα δω όλα σε μία μέρα;", answer: "Τα νότια ναι: Αρμόλια, Πυργί, Ολύμποι και Μεστά. Τη Βολισσό είναι καλύτερα να την αφήσετε για ξεχωριστή μέρα." },
        { question: "Πού να μείνω για να επισκεφθώ τα καστροχώρια;", answer: "Ο Κάμπος είναι πρακτική βάση, γιατί βρίσκεται στη νότια έξοδο της πόλης, πάνω στον δρόμο για τα Μαστιχοχώρια, και κοντά στο αεροδρόμιο." },
        { question: "Χρειάζομαι αυτοκίνητο;", answer: "Είναι ο πιο πρακτικός τρόπος, γιατί τα χωριά απέχουν μεταξύ τους. Στα παλιά κέντρα δεν μπαίνουν αυτοκίνητα, οπότε παρκάρετε έξω και περπατάτε." },
      ],
    },
  };
}

function en(p: Paths): MedievalGuide {
  return {
    seo: {
      title: "Medieval Villages of Chios | Fortress Villages & History",
      description:
        "The medieval villages of Chios: why they were built like castles, how Mesta, Pyrgi, Olympoi and Vessa differ, and a one-day route from Kambos.",
    },
    hero: {
      title: "The fortress villages of Chios",
      description:
        "Medieval villages built like castles to protect the mastic: what makes them unique, how to tell them apart and how to see them in one day.",
    },
    answer: {
      kicker: "Quick answer",
      title: "Which are the medieval villages of Chios?",
      text: "They are the fortress villages of southern Chios, built like castles to protect the mastic from pirates. The most intact are Mesta and Olympoi. Pyrgi stands out for its xysta, and Volissos for its castle in the northwest.",
      bullets: [
        "Mesta: the most intact fortress village",
        "Pyrgi: the “painted” village with xysta",
        "Olympoi and Vessa: quieter, with few visitors",
        "All southern villages fit into one day from Kambos",
      ],
    },
    history: {
      kicker: "History",
      title: "Why Chios has castle villages",
      intro:
        "For centuries Chios sat at the crossroads of East and West. Its wealth, mastic, made it a target for pirates, and the villages of the south answered with a unique way of building.",
      sections: [
        {
          title: "From Byzantium to the Genoese",
          paragraphs: [
            "The settlements have their roots in the Byzantine era. Their present form was shaped mainly by the Genoese, who ruled the island from 1346 to 1566 and controlled the mastic trade.",
            "To protect the harvest and the villagers from raids, they organised the villages as strongholds. After 1566 Chios passed to the Ottomans, but the fortress villages kept their structure.",
          ],
        },
        {
          title: "How a fortress village is built",
          paragraphs: [
            "The outer houses join together to form a continuous wall with no windows facing out. Inside, the alleys are narrow, twist like a maze and pass under arches and vaulted passages.",
            "At the centre stood a tower, the last refuge during an attack. The architecture shows strong Italian influences, combined with local stone.",
          ],
        },
        {
          title: "What you will see around the villages",
          paragraphs: [
            "In the countryside of the mastic villages you will find medieval watchtowers, small churches and archaeological traces of older settlements. Between them grow the mastic trees that made these villages rich.",
          ],
        },
      ],
    },
    comparison: {
      kicker: "Comparison",
      title: "Which medieval village to choose",
      intro: "If you do not have time for all of them, this table shows what makes each one special.",
      headers: { village: "Village", character: "Character", mustSee: "Don’t miss", time: "Time" },
      rows: [
        { name: "Mesta", href: p.mesta, character: "The most intact fortress village", mustSee: "The two Taxiarchis churches and arched alleys", time: "1.5–2 hours" },
        { name: "Pyrgi", href: p.pyrgi, character: "The “painted” village", mustSee: "The black-and-white xysta on the facades", time: "1–1.5 hours" },
        { name: "Olympoi", href: p.olympoi, character: "Quiet fortress village", mustSee: "The central tower and the nearby cave", time: "45–60 minutes" },
        { name: "Vessa", href: p.vessa, character: "Small and quiet", mustSee: "Stone houses without the crowds", time: "30–45 minutes" },
        { name: "Armolia", href: p.armolia, character: "The pottery village", mustSee: "Workshops with jugs, swans, suns and moons", time: "30–45 minutes" },
        { name: "Volissos", href: p.volissos, character: "Northwest, with a castle", mustSee: "The hilltop castle and the views", time: "A separate day" },
      ],
    },
    route: {
      kicker: "One-day route",
      title: "The southern fortress villages in one day from Kambos",
      intro: "Kambos sits at the southern edge of town, on the road to the mastic villages. This order avoids doubling back.",
      steps: [
        { title: "Morning: start from Kambos", text: "Leave early, before the heat. The first stop is about 25 minutes away.", href: p.stay, linkLabel: "Stay in Kambos →" },
        { title: "Armolia", text: "A short stop at the pottery workshops, a craft passed down through generations.", href: p.armolia, linkLabel: "Armolia →" },
        { title: "Pyrgi and the Mastic Museum", text: "Walk among the xysta and see at the museum how mastic is cultivated.", href: p.pyrgi, linkLabel: "Pyrgi →" },
        { title: "Olympoi", text: "A quiet walk around the central tower, just before midday.", href: p.olympoi, linkLabel: "Olympoi →" },
        { title: "Lunch in Mesta", text: "Get lost in the alleys and eat on the square or at Limenas Meston.", href: p.mesta, linkLabel: "Mesta →" },
        { title: "Afternoon and return", text: "Swim at a southern beach such as Mavra Volia or Komi, then head back to Kambos for dinner.", href: p.masticVillages, linkLabel: "Mastic villages →" },
      ],
    },
    stay: {
      title: "The fortress villages start 25 minutes from your garden",
      text: "Kambos lies on the road to the mastic villages: leave early without driving through town and come back in the evening to a quiet, historic citrus garden.",
      linkLabel: "Chios accommodation at Voulamandis House",
      href: p.stay,
      benefits: [
        "Free parking for your day trips",
        "Rooms and family apartments",
        "Direct booking with no commission",
      ],
      primaryLabel: "Check availability",
      secondaryLabel: "Rooms & apartments",
      imageAlt: "Courtyard of Voulamandis House in Kambos, Chios",
      imageLabel: "Voulamandis House · Kambos",
    },
    distances: {
      title: "Distances from Kambos",
      note: "Approximate driving times.",
      items: [
        { label: "Armolia", value: "about 25 minutes" },
        { label: "Pyrgi", value: "about 30 minutes" },
        { label: "Olympoi", value: "about 35–40 minutes" },
        { label: "Mesta", value: "about 40–45 minutes" },
        { label: "Vessa", value: "about 40 minutes" },
        { label: "Volissos", value: "about 1 hour" },
        { label: "Voulamandis House", value: "See accommodation in Kambos", href: p.stay },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Questions about the medieval villages of Chios",
      items: [
        { question: "Which are the medieval villages of Chios?", answer: "The best known are Mesta, Pyrgi, Olympoi and Vessa in southern Chios, and Volissos with its castle in the northwest." },
        { question: "Why are they called fortress villages?", answer: "Because they are built like castles: the outer houses form a wall, the alleys are a maze and a tower stood at the centre for defence." },
        { question: "Which one should I see if I am short on time?", answer: "Mesta for its fortified layout and Pyrgi for the xysta. They are about 10 km apart and fit into one morning." },
        { question: "Can I see them all in one day?", answer: "The southern ones, yes: Armolia, Pyrgi, Olympoi and Mesta. Volissos is better left for a separate day." },
        { question: "Where should I stay to visit the fortress villages?", answer: "Kambos is a practical base: it sits at the southern edge of town, on the road to the mastic villages, and close to the airport." },
        { question: "Do I need a car?", answer: "It is the most practical way, as the villages are spread out. Cars cannot enter the old centres, so you park outside and walk in." },
      ],
    },
  };
}

function fr(p: Paths): MedievalGuide {
  return {
    seo: {
      title: "Villages médiévaux de Chios | Villages fortifiés & histoire",
      description:
        "Les villages médiévaux de Chios : pourquoi ils ont été bâtis comme des forteresses, en quoi Mesta, Pyrgi, Olympoi et Vessa diffèrent, et un itinéraire d’une journée depuis Kambos.",
    },
    hero: {
      title: "Les villages fortifiés de Chios",
      description:
        "Des villages médiévaux bâtis comme des forteresses pour protéger le mastic : ce qui les rend uniques, comment les distinguer et comment les voir en une journée.",
    },
    answer: {
      kicker: "Réponse rapide",
      title: "Quels sont les villages médiévaux de Chios ?",
      text: "Ce sont les villages fortifiés du sud de Chios, construits comme des forteresses pour protéger le mastic des pirates. Les plus intacts sont Mesta et Olympoi. Pyrgi se distingue par ses xysta, et Volissos par son château au nord-ouest.",
      bullets: [
        "Mesta : le village fortifié le plus intact",
        "Pyrgi : le village « peint » aux xysta",
        "Olympoi et Vessa : plus calmes, peu fréquentés",
        "Tous les villages du sud en une journée depuis Kambos",
      ],
    },
    history: {
      kicker: "Histoire",
      title: "Pourquoi Chios a des villages-forteresses",
      intro:
        "Pendant des siècles, Chios s’est trouvée au carrefour de l’Orient et de l’Occident. Sa richesse, le mastic, en faisait une cible pour les pirates, et les villages du sud ont répondu par une manière unique de bâtir.",
      sections: [
        {
          title: "De Byzance aux Génois",
          paragraphs: [
            "Les villages trouvent leurs racines à l’époque byzantine. Leur forme actuelle est surtout l’œuvre des Génois, qui gouvernèrent l’île de 1346 à 1566 et contrôlaient le commerce du mastic.",
            "Pour protéger la récolte et les habitants des raids, ils organisèrent les villages comme des places fortes. Après 1566, Chios passa aux Ottomans, mais les villages fortifiés gardèrent leur structure.",
          ],
        },
        {
          title: "Comment est construit un village fortifié",
          paragraphs: [
            "Les maisons extérieures sont accolées et forment un rempart continu, sans fenêtres vers l’extérieur. À l’intérieur, les ruelles étroites serpentent comme un labyrinthe et passent sous des arches et des passages voûtés.",
            "Au centre se dressait une tour, dernier refuge en cas d’attaque. L’architecture montre de fortes influences italiennes, mêlées à la pierre locale.",
          ],
        },
        {
          title: "Ce que vous verrez autour des villages",
          paragraphs: [
            "Dans la campagne des villages du mastic, vous croiserez des tours de guet médiévales, de petites églises et des vestiges archéologiques d’anciens habitats. Entre eux poussent les lentisques qui ont fait la richesse de ces villages.",
          ],
        },
      ],
    },
    comparison: {
      kicker: "Comparaison",
      title: "Quel village médiéval choisir",
      intro: "Si vous n’avez pas le temps de tout voir, ce tableau montre ce qui rend chacun unique.",
      headers: { village: "Village", character: "Caractère", mustSee: "À ne pas manquer", time: "Durée" },
      rows: [
        { name: "Mesta", href: p.mesta, character: "Le village fortifié le plus intact", mustSee: "Les deux Taxiarques et les ruelles à arches", time: "1 h 30–2 h" },
        { name: "Pyrgi", href: p.pyrgi, character: "Le village « peint »", mustSee: "Les xysta noir et blanc des façades", time: "1 h–1 h 30" },
        { name: "Olympoi", href: p.olympoi, character: "Village fortifié paisible", mustSee: "La tour centrale et la grotte voisine", time: "45–60 min" },
        { name: "Vessa", href: p.vessa, character: "Petit et calme", mustSee: "Les maisons en pierre, loin de la foule", time: "30–45 min" },
        { name: "Armolia", href: p.armolia, character: "Le village de la poterie", mustSee: "Les ateliers : cruches, cygnes, soleils et lunes", time: "30–45 min" },
        { name: "Volissos", href: p.volissos, character: "Nord-ouest, avec château", mustSee: "Le château sur la colline et la vue", time: "Une journée à part" },
      ],
    },
    route: {
      kicker: "Itinéraire d’une journée",
      title: "Les villages fortifiés du sud en une journée depuis Kambos",
      intro: "Kambos se trouve à la sortie sud de la ville, sur la route des villages du mastic. Cet ordre évite les allers-retours.",
      steps: [
        { title: "Matin : départ de Kambos", text: "Partez tôt, avant la chaleur. Le premier arrêt est à environ 25 minutes.", href: p.stay, linkLabel: "Séjourner à Kambos →" },
        { title: "Armolia", text: "Courte halte dans les ateliers de poterie, un savoir-faire transmis de génération en génération.", href: p.armolia, linkLabel: "Armolia →" },
        { title: "Pyrgi et le Musée du Mastic", text: "Promenez-vous parmi les xysta et découvrez au musée comment on cultive le mastic.", href: p.pyrgi, linkLabel: "Pyrgi →" },
        { title: "Olympoi", text: "Balade tranquille autour de la tour centrale, juste avant midi.", href: p.olympoi, linkLabel: "Olympoi →" },
        { title: "Déjeuner à Mesta", text: "Perdez-vous dans les ruelles et mangez sur la place ou à Limenas Meston.", href: p.mesta, linkLabel: "Mesta →" },
        { title: "Après-midi et retour", text: "Baignade sur une plage du sud comme Mavra Volia ou Komi, puis retour à Kambos pour le dîner.", href: p.masticVillages, linkLabel: "Villages du mastic →" },
      ],
    },
    stay: {
      title: "Les villages fortifiés à 25 minutes de votre jardin",
      text: "Kambos se trouve sur la route des villages du mastic : partez tôt sans traverser la ville et revenez le soir dans un jardin d’agrumes calme et historique.",
      linkLabel: "Hébergement à Chios au Voulamandis House",
      href: p.stay,
      benefits: [
        "Parking gratuit pour vos excursions",
        "Chambres et appartements familiaux",
        "Réservation directe sans commission",
      ],
      primaryLabel: "Voir les disponibilités",
      secondaryLabel: "Chambres & appartements",
      imageAlt: "Cour du Voulamandis House à Kambos, Chios",
      imageLabel: "Voulamandis House · Kambos",
    },
    distances: {
      title: "Distances depuis Kambos",
      note: "Temps de trajet indicatifs en voiture.",
      items: [
        { label: "Armolia", value: "environ 25 minutes" },
        { label: "Pyrgi", value: "environ 30 minutes" },
        { label: "Olympoi", value: "environ 35–40 minutes" },
        { label: "Mesta", value: "environ 40–45 minutes" },
        { label: "Vessa", value: "environ 40 minutes" },
        { label: "Volissos", value: "environ 1 heure" },
        { label: "Voulamandis House", value: "Voir l’hébergement à Kambos", href: p.stay },
      ],
    },
    faq: {
      kicker: "Questions fréquentes",
      title: "Questions sur les villages médiévaux de Chios",
      items: [
        { question: "Quels sont les villages médiévaux de Chios ?", answer: "Les plus connus sont Mesta, Pyrgi, Olympoi et Vessa au sud de Chios, et Volissos avec son château au nord-ouest." },
        { question: "Pourquoi parle-t-on de villages fortifiés ?", answer: "Parce qu’ils sont bâtis comme des forteresses : les maisons extérieures forment un rempart, les ruelles sont un labyrinthe et une tour se dressait au centre." },
        { question: "Lequel voir si j’ai peu de temps ?", answer: "Mesta pour son plan fortifié et Pyrgi pour les xysta. Ils sont à environ 10 km l’un de l’autre et tiennent en une matinée." },
        { question: "Peut-on tous les voir en une journée ?", answer: "Ceux du sud, oui : Armolia, Pyrgi, Olympoi et Mesta. Mieux vaut garder Volissos pour une autre journée." },
        { question: "Où loger pour visiter les villages fortifiés ?", answer: "Kambos est une base pratique : à la sortie sud de la ville, sur la route des villages du mastic et près de l’aéroport." },
        { question: "Faut-il une voiture ?", answer: "C’est le plus pratique, car les villages sont éloignés les uns des autres. Les voitures n’entrent pas dans les vieux centres : on se gare à l’extérieur." },
      ],
    },
  };
}

function de(p: Paths): MedievalGuide {
  return {
    seo: {
      title: "Mittelalterliche Dörfer auf Chios | Wehrdörfer & Geschichte",
      description:
        "Die mittelalterlichen Dörfer von Chios: warum sie wie Burgen gebaut wurden, wie sich Mesta, Pyrgi, Olympoi und Vessa unterscheiden und eine Tagesroute ab Kambos.",
    },
    hero: {
      title: "Die Wehrdörfer von Chios",
      description:
        "Mittelalterliche Dörfer, wie Festungen gebaut, um den Mastix zu schützen: was sie einzigartig macht, wie man sie unterscheidet und wie man sie an einem Tag sieht.",
    },
    answer: {
      kicker: "Kurze Antwort",
      title: "Welche sind die mittelalterlichen Dörfer von Chios?",
      text: "Es sind die Wehrdörfer im Süden von Chios, wie Festungen gebaut, um den Mastix vor Piraten zu schützen. Am besten erhalten sind Mesta und Olympoi. Pyrgi fällt durch seine Xysta auf, Volissos durch seine Burg im Nordwesten.",
      bullets: [
        "Mesta: das am besten erhaltene Wehrdorf",
        "Pyrgi: das „bemalte“ Dorf mit den Xysta",
        "Olympoi und Vessa: ruhiger, mit wenigen Besuchern",
        "Alle Süddörfer an einem Tag ab Kambos",
      ],
    },
    history: {
      kicker: "Geschichte",
      title: "Warum Chios Burgdörfer hat",
      intro:
        "Über Jahrhunderte lag Chios am Kreuzweg zwischen Ost und West. Sein Reichtum, der Mastix, machte die Insel zum Ziel von Piraten – und die Dörfer im Süden antworteten mit einer einzigartigen Bauweise.",
      sections: [
        {
          title: "Von Byzanz zu den Genuesen",
          paragraphs: [
            "Die Siedlungen gehen auf die byzantinische Zeit zurück. Ihre heutige Form erhielten sie vor allem durch die Genuesen, die die Insel von 1346 bis 1566 regierten und den Mastixhandel kontrollierten.",
            "Um Ernte und Bewohner vor Überfällen zu schützen, legten sie die Dörfer als Festungen an. Nach 1566 kam Chios unter osmanische Herrschaft, doch die Wehrdörfer behielten ihre Struktur.",
          ],
        },
        {
          title: "Wie ein Wehrdorf gebaut ist",
          paragraphs: [
            "Die äußeren Häuser sind aneinandergebaut und bilden eine geschlossene Mauer ohne Fenster nach außen. Innen sind die Gassen eng, winden sich wie ein Labyrinth und führen unter Bögen und gewölbten Durchgängen hindurch.",
            "In der Mitte stand ein Turm, die letzte Zuflucht bei einem Angriff. Die Architektur zeigt starke italienische Einflüsse, verbunden mit dem örtlichen Stein.",
          ],
        },
        {
          title: "Was Sie rund um die Dörfer sehen",
          paragraphs: [
            "In der Landschaft der Mastixdörfer stoßen Sie auf mittelalterliche Wachtürme, kleine Kirchen und archäologische Spuren älterer Siedlungen. Dazwischen wachsen die Mastixbäume, die diese Dörfer reich gemacht haben.",
          ],
        },
      ],
    },
    comparison: {
      kicker: "Vergleich",
      title: "Welches mittelalterliche Dorf passt zu Ihnen",
      intro: "Wenn Sie nicht alle besuchen können, zeigt diese Tabelle, was jedes Dorf besonders macht.",
      headers: { village: "Dorf", character: "Charakter", mustSee: "Nicht verpassen", time: "Zeit" },
      rows: [
        { name: "Mesta", href: p.mesta, character: "Das am besten erhaltene Wehrdorf", mustSee: "Die beiden Taxiarchis-Kirchen und die Bogengassen", time: "1,5–2 Stunden" },
        { name: "Pyrgi", href: p.pyrgi, character: "Das „bemalte“ Dorf", mustSee: "Die schwarz-weißen Xysta an den Fassaden", time: "1–1,5 Stunden" },
        { name: "Olympoi", href: p.olympoi, character: "Ruhiges Wehrdorf", mustSee: "Der zentrale Turm und die nahe Höhle", time: "45–60 Minuten" },
        { name: "Vessa", href: p.vessa, character: "Klein und ruhig", mustSee: "Steinhäuser ohne Touristenandrang", time: "30–45 Minuten" },
        { name: "Armolia", href: p.armolia, character: "Das Töpferdorf", mustSee: "Werkstätten mit Krügen, Schwänen, Sonnen und Monden", time: "30–45 Minuten" },
        { name: "Volissos", href: p.volissos, character: "Nordwesten, mit Burg", mustSee: "Die Burg auf dem Hügel und die Aussicht", time: "Eigener Tag" },
      ],
    },
    route: {
      kicker: "Tagesroute",
      title: "Die südlichen Wehrdörfer an einem Tag ab Kambos",
      intro: "Kambos liegt am südlichen Stadtrand, direkt an der Straße zu den Mastixdörfern. Diese Reihenfolge erspart Umwege.",
      steps: [
        { title: "Morgens: Start in Kambos", text: "Fahren Sie früh los, vor der Hitze. Der erste Stopp ist etwa 25 Minuten entfernt.", href: p.stay, linkLabel: "Unterkunft in Kambos →" },
        { title: "Armolia", text: "Kurzer Halt bei den Töpferwerkstätten, einem Handwerk, das über Generationen weitergegeben wird.", href: p.armolia, linkLabel: "Armolia →" },
        { title: "Pyrgi und Mastixmuseum", text: "Spazieren Sie zwischen den Xysta und erfahren Sie im Museum, wie Mastix angebaut wird.", href: p.pyrgi, linkLabel: "Pyrgi →" },
        { title: "Olympoi", text: "Ruhiger Rundgang um den zentralen Turm, kurz vor Mittag.", href: p.olympoi, linkLabel: "Olympoi →" },
        { title: "Mittagessen in Mesta", text: "Verlieren Sie sich in den Gassen und essen Sie am Dorfplatz oder in Limenas Meston.", href: p.mesta, linkLabel: "Mesta →" },
        { title: "Nachmittag und Rückfahrt", text: "Baden an einem Südstrand wie Mavra Volia oder Komi, abends zurück nach Kambos.", href: p.masticVillages, linkLabel: "Mastixdörfer →" },
      ],
    },
    stay: {
      title: "Die Wehrdörfer beginnen 25 Minuten von Ihrem Garten",
      text: "Kambos liegt an der Straße zu den Mastixdörfern: Starten Sie früh, ohne durch die Stadt zu fahren, und kehren Sie abends in einen ruhigen, historischen Zitrusgarten zurück.",
      linkLabel: "Unterkunft auf Chios im Voulamandis House",
      href: p.stay,
      benefits: [
        "Kostenlose Parkplätze für Ihre Ausflüge",
        "Zimmer und Familienapartments",
        "Direktbuchung ohne Provision",
      ],
      primaryLabel: "Verfügbarkeit prüfen",
      secondaryLabel: "Zimmer & Apartments",
      imageAlt: "Innenhof des Voulamandis House in Kambos, Chios",
      imageLabel: "Voulamandis House · Kambos",
    },
    distances: {
      title: "Entfernungen ab Kambos",
      note: "Ungefähre Fahrzeiten mit dem Auto.",
      items: [
        { label: "Armolia", value: "etwa 25 Minuten" },
        { label: "Pyrgi", value: "etwa 30 Minuten" },
        { label: "Olympoi", value: "etwa 35–40 Minuten" },
        { label: "Mesta", value: "etwa 40–45 Minuten" },
        { label: "Vessa", value: "etwa 40 Minuten" },
        { label: "Volissos", value: "etwa 1 Stunde" },
        { label: "Voulamandis House", value: "Unterkunft in Kambos ansehen", href: p.stay },
      ],
    },
    faq: {
      kicker: "Häufige Fragen",
      title: "Fragen zu den mittelalterlichen Dörfern von Chios",
      items: [
        { question: "Welche sind die mittelalterlichen Dörfer von Chios?", answer: "Am bekanntesten sind Mesta, Pyrgi, Olympoi und Vessa im Süden sowie Volissos mit seiner Burg im Nordwesten." },
        { question: "Warum heißen sie Wehrdörfer?", answer: "Weil sie wie Burgen gebaut sind: Die äußeren Häuser bilden eine Mauer, die Gassen sind ein Labyrinth und in der Mitte stand ein Verteidigungsturm." },
        { question: "Welches Dorf, wenn ich wenig Zeit habe?", answer: "Mesta für die Festungsstruktur und Pyrgi für die Xysta. Sie liegen etwa 10 km auseinander und passen in einen Vormittag." },
        { question: "Kann ich alle an einem Tag sehen?", answer: "Die südlichen ja: Armolia, Pyrgi, Olympoi und Mesta. Volissos planen Sie besser für einen eigenen Tag." },
        { question: "Wo übernachte ich am besten für die Wehrdörfer?", answer: "Kambos ist eine praktische Basis: am südlichen Stadtrand, an der Straße zu den Mastixdörfern und nahe am Flughafen." },
        { question: "Brauche ich ein Auto?", answer: "Es ist am praktischsten, da die Dörfer verstreut liegen. In die alten Ortskerne fahren keine Autos – Sie parken außerhalb und gehen zu Fuß." },
      ],
    },
  };
}

function it(p: Paths): MedievalGuide {
  return {
    seo: {
      title: "Villaggi medievali di Chios | Borghi fortificati e storia",
      description:
        "I villaggi medievali di Chios: perché furono costruiti come castelli, come distinguere Mesta, Pyrgi, Olympoi e Vessa e un itinerario di un giorno da Kambos.",
    },
    hero: {
      title: "I borghi fortificati di Chios",
      description:
        "Villaggi medievali costruiti come fortezze per proteggere il mastice: cosa li rende unici, come distinguerli e come vederli in un giorno.",
    },
    answer: {
      kicker: "Risposta rapida",
      title: "Quali sono i villaggi medievali di Chios?",
      text: "Sono i borghi fortificati del sud di Chios, costruiti come fortezze per proteggere il mastice dai pirati. I più integri sono Mesta e Olympoi. Pyrgi si distingue per gli xysta e Volissos per il castello a nord-ovest.",
      bullets: [
        "Mesta: il borgo fortificato più integro",
        "Pyrgi: il villaggio “dipinto” con gli xysta",
        "Olympoi e Vessa: più tranquilli, poco affollati",
        "Tutti i villaggi del sud in un giorno da Kambos",
      ],
    },
    history: {
      kicker: "Storia",
      title: "Perché Chios ha villaggi-castello",
      intro:
        "Per secoli Chios si è trovata all’incrocio tra Oriente e Occidente. La sua ricchezza, il mastice, la rendeva bersaglio dei pirati, e i villaggi del sud risposero con un modo unico di costruire.",
      sections: [
        {
          title: "Da Bisanzio ai Genovesi",
          paragraphs: [
            "Gli insediamenti hanno radici in epoca bizantina. La forma attuale si deve soprattutto ai Genovesi, che governarono l’isola dal 1346 al 1566 e controllavano il commercio del mastice.",
            "Per proteggere il raccolto e gli abitanti dalle incursioni, organizzarono i villaggi come roccaforti. Dopo il 1566 Chios passò agli Ottomani, ma i borghi fortificati conservarono la loro struttura.",
          ],
        },
        {
          title: "Come è costruito un borgo fortificato",
          paragraphs: [
            "Le case esterne sono unite tra loro e formano un muro continuo, senza finestre verso l’esterno. All’interno i vicoli sono stretti, si snodano come un labirinto e passano sotto archi e passaggi a volta.",
            "Al centro sorgeva una torre, l’ultimo rifugio in caso di attacco. L’architettura mostra forti influenze italiane, fuse con la pietra locale.",
          ],
        },
        {
          title: "Cosa vedrete intorno ai villaggi",
          paragraphs: [
            "Nella campagna dei villaggi del mastice incontrerete torri di avvistamento medievali, piccole chiese e tracce archeologiche di antichi insediamenti. Tra loro crescono gli alberi di mastice che resero ricchi questi villaggi.",
          ],
        },
      ],
    },
    comparison: {
      kicker: "Confronto",
      title: "Quale villaggio medievale scegliere",
      intro: "Se non avete tempo per tutti, questa tabella mostra cosa rende speciale ciascuno.",
      headers: { village: "Villaggio", character: "Carattere", mustSee: "Da non perdere", time: "Tempo" },
      rows: [
        { name: "Mesta", href: p.mesta, character: "Il borgo fortificato più integro", mustSee: "I due Taxiarchis e i vicoli ad arco", time: "1,5–2 ore" },
        { name: "Pyrgi", href: p.pyrgi, character: "Il villaggio “dipinto”", mustSee: "Gli xysta bianchi e neri sulle facciate", time: "1–1,5 ore" },
        { name: "Olympoi", href: p.olympoi, character: "Borgo fortificato tranquillo", mustSee: "La torre centrale e la grotta vicina", time: "45–60 minuti" },
        { name: "Vessa", href: p.vessa, character: "Piccolo e tranquillo", mustSee: "Case in pietra senza folla", time: "30–45 minuti" },
        { name: "Armolia", href: p.armolia, character: "Il villaggio della ceramica", mustSee: "Botteghe con brocche, cigni, soli e lune", time: "30–45 minuti" },
        { name: "Volissos", href: p.volissos, character: "Nord-ovest, con castello", mustSee: "Il castello sulla collina e la vista", time: "Un giorno a parte" },
      ],
    },
    route: {
      kicker: "Itinerario di un giorno",
      title: "I borghi fortificati del sud in un giorno da Kambos",
      intro: "Kambos si trova all’uscita sud della città, sulla strada per i villaggi del mastice. Questo ordine evita di tornare indietro.",
      steps: [
        { title: "Mattina: partenza da Kambos", text: "Partite presto, prima del caldo. La prima tappa è a circa 25 minuti.", href: p.stay, linkLabel: "Alloggio a Kambos →" },
        { title: "Armolia", text: "Breve sosta nelle botteghe di ceramica, un mestiere tramandato di generazione in generazione.", href: p.armolia, linkLabel: "Armolia →" },
        { title: "Pyrgi e Museo del Mastice", text: "Passeggiate tra gli xysta e scoprite al museo come si coltiva il mastice.", href: p.pyrgi, linkLabel: "Pyrgi →" },
        { title: "Olympoi", text: "Passeggiata tranquilla intorno alla torre centrale, poco prima di mezzogiorno.", href: p.olympoi, linkLabel: "Olympoi →" },
        { title: "Pranzo a Mesta", text: "Perdetevi tra i vicoli e mangiate in piazza o a Limenas Meston.", href: p.mesta, linkLabel: "Mesta →" },
        { title: "Pomeriggio e rientro", text: "Bagno in una spiaggia del sud come Mavra Volia o Komi, poi rientro a Kambos per cena.", href: p.masticVillages, linkLabel: "Villaggi del mastice →" },
      ],
    },
    stay: {
      title: "I borghi fortificati iniziano a 25 minuti dal vostro giardino",
      text: "Kambos si trova sulla strada per i villaggi del mastice: partite presto senza attraversare la città e rientrate la sera in un giardino di agrumi tranquillo e storico.",
      linkLabel: "Alloggio a Chios al Voulamandis House",
      href: p.stay,
      benefits: [
        "Parcheggio gratuito per le vostre escursioni",
        "Camere e appartamenti per famiglie",
        "Prenotazione diretta senza commissioni",
      ],
      primaryLabel: "Verifica disponibilità",
      secondaryLabel: "Camere & appartamenti",
      imageAlt: "Cortile del Voulamandis House a Kambos, Chios",
      imageLabel: "Voulamandis House · Kambos",
    },
    distances: {
      title: "Distanze da Kambos",
      note: "Tempi indicativi in auto.",
      items: [
        { label: "Armolia", value: "circa 25 minuti" },
        { label: "Pyrgi", value: "circa 30 minuti" },
        { label: "Olympoi", value: "circa 35–40 minuti" },
        { label: "Mesta", value: "circa 40–45 minuti" },
        { label: "Vessa", value: "circa 40 minuti" },
        { label: "Volissos", value: "circa 1 ora" },
        { label: "Voulamandis House", value: "Vedi l’alloggio a Kambos", href: p.stay },
      ],
    },
    faq: {
      kicker: "Domande frequenti",
      title: "Domande sui villaggi medievali di Chios",
      items: [
        { question: "Quali sono i villaggi medievali di Chios?", answer: "I più noti sono Mesta, Pyrgi, Olympoi e Vessa nel sud, e Volissos con il suo castello a nord-ovest." },
        { question: "Perché si chiamano borghi fortificati?", answer: "Perché sono costruiti come castelli: le case esterne formano un muro, i vicoli sono un labirinto e al centro c’era una torre difensiva." },
        { question: "Quale vedere se ho poco tempo?", answer: "Mesta per la struttura fortificata e Pyrgi per gli xysta. Distano circa 10 km e stanno in una mattinata." },
        { question: "Si possono vedere tutti in un giorno?", answer: "Quelli del sud sì: Armolia, Pyrgi, Olympoi e Mesta. Volissos è meglio lasciarla per un altro giorno." },
        { question: "Dove alloggiare per visitare i borghi fortificati?", answer: "Kambos è una base pratica: all’uscita sud della città, sulla strada per i villaggi del mastice e vicino all’aeroporto." },
        { question: "Serve l’auto?", answer: "È il modo più pratico, perché i villaggi sono distanti tra loro. Nei centri storici non si entra in auto: si parcheggia fuori e si prosegue a piedi." },
      ],
    },
  };
}

function es(p: Paths): MedievalGuide {
  return {
    seo: {
      title: "Pueblos medievales de Quíos | Pueblos fortificados e historia",
      description:
        "Los pueblos medievales de Quíos: por qué se construyeron como castillos, en qué se diferencian Mesta, Pyrgi, Olympoi y Vessa, y una ruta de un día desde Kambos.",
    },
    hero: {
      title: "Los pueblos fortificados de Quíos",
      description:
        "Pueblos medievales construidos como fortalezas para proteger la almáciga: qué los hace únicos, cómo distinguirlos y cómo verlos en un día.",
    },
    answer: {
      kicker: "Respuesta rápida",
      title: "¿Cuáles son los pueblos medievales de Quíos?",
      text: "Son los pueblos fortificados del sur de Quíos, construidos como fortalezas para proteger la almáciga de los piratas. Los más intactos son Mesta y Olympoi. Pyrgi destaca por sus xysta y Volissos por su castillo en el noroeste.",
      bullets: [
        "Mesta: el pueblo fortificado más intacto",
        "Pyrgi: el pueblo “pintado” con xysta",
        "Olympoi y Vessa: más tranquilos, con pocos visitantes",
        "Todos los pueblos del sur en un día desde Kambos",
      ],
    },
    history: {
      kicker: "Historia",
      title: "Por qué Quíos tiene pueblos-castillo",
      intro:
        "Durante siglos Quíos estuvo en la encrucijada entre Oriente y Occidente. Su riqueza, la almáciga, la convirtió en objetivo de piratas, y los pueblos del sur respondieron con una forma única de construir.",
      sections: [
        {
          title: "De Bizancio a los genoveses",
          paragraphs: [
            "Los asentamientos tienen sus raíces en la época bizantina. Su forma actual se debe sobre todo a los genoveses, que gobernaron la isla de 1346 a 1566 y controlaban el comercio de la almáciga.",
            "Para proteger la cosecha y a los habitantes de las incursiones, organizaron los pueblos como plazas fuertes. Tras 1566 Quíos pasó a los otomanos, pero los pueblos fortificados conservaron su estructura.",
          ],
        },
        {
          title: "Cómo se construye un pueblo fortificado",
          paragraphs: [
            "Las casas exteriores están unidas y forman una muralla continua, sin ventanas hacia fuera. Dentro, las callejuelas son estrechas, serpentean como un laberinto y pasan bajo arcos y pasajes abovedados.",
            "En el centro se alzaba una torre, el último refugio ante un ataque. La arquitectura muestra fuertes influencias italianas, unidas a la piedra local.",
          ],
        },
        {
          title: "Qué verá alrededor de los pueblos",
          paragraphs: [
            "En el campo de los pueblos de la almáciga encontrará torres de vigía medievales, pequeñas iglesias y restos arqueológicos de antiguos asentamientos. Entre ellos crecen los lentiscos que hicieron ricos a estos pueblos.",
          ],
        },
      ],
    },
    comparison: {
      kicker: "Comparación",
      title: "Qué pueblo medieval elegir",
      intro: "Si no tiene tiempo para todos, esta tabla muestra qué hace especial a cada uno.",
      headers: { village: "Pueblo", character: "Carácter", mustSee: "No se pierda", time: "Tiempo" },
      rows: [
        { name: "Mesta", href: p.mesta, character: "El pueblo fortificado más intacto", mustSee: "Los dos Taxiarcas y las callejuelas con arcos", time: "1,5–2 horas" },
        { name: "Pyrgi", href: p.pyrgi, character: "El pueblo “pintado”", mustSee: "Los xysta en blanco y negro de las fachadas", time: "1–1,5 horas" },
        { name: "Olympoi", href: p.olympoi, character: "Pueblo fortificado tranquilo", mustSee: "La torre central y la cueva cercana", time: "45–60 minutos" },
        { name: "Vessa", href: p.vessa, character: "Pequeño y tranquilo", mustSee: "Casas de piedra sin multitudes", time: "30–45 minutos" },
        { name: "Armolia", href: p.armolia, character: "El pueblo de la cerámica", mustSee: "Talleres con cántaros, cisnes, soles y lunas", time: "30–45 minutos" },
        { name: "Volissos", href: p.volissos, character: "Noroeste, con castillo", mustSee: "El castillo en la colina y las vistas", time: "Un día aparte" },
      ],
    },
    route: {
      kicker: "Ruta de un día",
      title: "Los pueblos fortificados del sur en un día desde Kambos",
      intro: "Kambos está en la salida sur de la ciudad, en la carretera hacia los pueblos de la almáciga. Este orden evita ir y volver.",
      steps: [
        { title: "Mañana: salida desde Kambos", text: "Salga temprano, antes del calor. La primera parada está a unos 25 minutos.", href: p.stay, linkLabel: "Alojarse en Kambos →" },
        { title: "Armolia", text: "Parada breve en los talleres de cerámica, un oficio transmitido de generación en generación.", href: p.armolia, linkLabel: "Armolia →" },
        { title: "Pyrgi y el Museo de la Almáciga", text: "Pasee entre los xysta y descubra en el museo cómo se cultiva la almáciga.", href: p.pyrgi, linkLabel: "Pyrgi →" },
        { title: "Olympoi", text: "Paseo tranquilo alrededor de la torre central, poco antes del mediodía.", href: p.olympoi, linkLabel: "Olympoi →" },
        { title: "Comida en Mesta", text: "Piérdase por las callejuelas y coma en la plaza o en Limenas Meston.", href: p.mesta, linkLabel: "Mesta →" },
        { title: "Tarde y regreso", text: "Baño en una playa del sur como Mavra Volia o Komi y vuelta a Kambos para cenar.", href: p.masticVillages, linkLabel: "Pueblos de la almáciga →" },
      ],
    },
    stay: {
      title: "Los pueblos fortificados empiezan a 25 minutos de su jardín",
      text: "Kambos está en la carretera hacia los pueblos de la almáciga: salga temprano sin cruzar la ciudad y vuelva por la noche a un jardín de cítricos tranquilo e histórico.",
      linkLabel: "Alojamiento en Quíos en Voulamandis House",
      href: p.stay,
      benefits: [
        "Aparcamiento gratuito para sus excursiones",
        "Habitaciones y apartamentos familiares",
        "Reserva directa sin comisiones",
      ],
      primaryLabel: "Ver disponibilidad",
      secondaryLabel: "Habitaciones & apartamentos",
      imageAlt: "Patio de Voulamandis House en Kambos, Quíos",
      imageLabel: "Voulamandis House · Kambos",
    },
    distances: {
      title: "Distancias desde Kambos",
      note: "Tiempos aproximados en coche.",
      items: [
        { label: "Armolia", value: "unos 25 minutos" },
        { label: "Pyrgi", value: "unos 30 minutos" },
        { label: "Olympoi", value: "unos 35–40 minutos" },
        { label: "Mesta", value: "unos 40–45 minutos" },
        { label: "Vessa", value: "unos 40 minutos" },
        { label: "Volissos", value: "aproximadamente 1 hora" },
        { label: "Voulamandis House", value: "Ver alojamiento en Kambos", href: p.stay },
      ],
    },
    faq: {
      kicker: "Preguntas frecuentes",
      title: "Preguntas sobre los pueblos medievales de Quíos",
      items: [
        { question: "¿Cuáles son los pueblos medievales de Quíos?", answer: "Los más conocidos son Mesta, Pyrgi, Olympoi y Vessa en el sur, y Volissos con su castillo en el noroeste." },
        { question: "¿Por qué se llaman pueblos fortificados?", answer: "Porque están construidos como castillos: las casas exteriores forman una muralla, las callejuelas son un laberinto y en el centro había una torre defensiva." },
        { question: "¿Cuál ver si tengo poco tiempo?", answer: "Mesta por su trazado fortificado y Pyrgi por los xysta. Están a unos 10 km y caben en una mañana." },
        { question: "¿Se pueden ver todos en un día?", answer: "Los del sur, sí: Armolia, Pyrgi, Olympoi y Mesta. Volissos es mejor dejarlo para otro día." },
        { question: "¿Dónde alojarse para visitar los pueblos fortificados?", answer: "Kambos es una base práctica: en la salida sur de la ciudad, en la carretera hacia los pueblos de la almáciga y cerca del aeropuerto." },
        { question: "¿Necesito coche?", answer: "Es lo más práctico, porque los pueblos están separados. En los cascos antiguos no entran coches: se aparca fuera y se entra a pie." },
      ],
    },
  };
}

function tr(p: Paths): MedievalGuide {
  return {
    seo: {
      title: "Sakız Adası Orta Çağ köyleri | Kale köyler ve tarihi",
      description:
        "Sakız Adası’nın Orta Çağ köyleri: neden kale gibi inşa edildiler, Mesta, Pyrgi, Olympoi ve Vessa nasıl farklı ve Kambos’tan bir günlük rota.",
    },
    hero: {
      title: "Sakız Adası’nın kale köyleri",
      description:
        "Mastiği korumak için kale gibi inşa edilmiş Orta Çağ köyleri: onları eşsiz kılan nedir, nasıl ayırt edilir ve bir günde nasıl gezilir.",
    },
    answer: {
      kicker: "Kısa cevap",
      title: "Sakız Adası’nın Orta Çağ köyleri hangileri?",
      text: "Sakız’ın güneyindeki, mastiği korsanlardan korumak için kale gibi inşa edilmiş köylerdir. En bütün kalanlar Mesta ve Olympoi’dir. Pyrgi xysta desenleriyle, Volissos ise kuzeybatıdaki kalesiyle öne çıkar.",
      bullets: [
        "Mesta: en bütün kalmış kale köy",
        "Pyrgi: xysta desenli “boyalı” köy",
        "Olympoi ve Vessa: daha sakin, az ziyaretçili",
        "Güneydeki tüm köyler Kambos’tan bir günde",
      ],
    },
    history: {
      kicker: "Tarih",
      title: "Sakız Adası’nda neden kale köyler var?",
      intro:
        "Sakız yüzyıllar boyunca Doğu ile Batı’nın kesiştiği noktadaydı. Zenginliği olan mastik, adayı korsanların hedefi yaptı; güneydeki köyler de buna eşsiz bir yapı tarzıyla karşılık verdi.",
      sections: [
        {
          title: "Bizans’tan Cenevizlilere",
          paragraphs: [
            "Yerleşimlerin kökleri Bizans dönemine uzanır. Bugünkü biçimlerini büyük ölçüde 1346–1566 arasında adayı yöneten ve mastik ticaretini kontrol eden Cenevizliler verdi.",
            "Hasadı ve köylüleri baskınlardan korumak için köyleri birer kale gibi düzenlediler. 1566’dan sonra Sakız Osmanlı yönetimine geçti, ama kale köyler yapılarını korudu.",
          ],
        },
        {
          title: "Bir kale köy nasıl inşa edilmiştir?",
          paragraphs: [
            "Dış evler birbirine bitişiktir ve dışa bakan penceresi olmayan kesintisiz bir sur oluşturur. İçeride sokaklar dardır, labirent gibi kıvrılır ve kemerlerin ve tonozlu geçitlerin altından geçer.",
            "Ortada saldırı anında son sığınak olan bir kule bulunurdu. Mimaride, yerel taşla birleşen güçlü İtalyan etkileri görülür.",
          ],
        },
        {
          title: "Köylerin çevresinde neler göreceksiniz?",
          paragraphs: [
            "Mastik köylerinin kırsalında Orta Çağ gözetleme kuleleri, küçük kiliseler ve eski yerleşimlere ait arkeolojik izler görürsünüz. Aralarında bu köyleri zengin eden mastik ağaçları uzanır.",
          ],
        },
      ],
    },
    comparison: {
      kicker: "Karşılaştırma",
      title: "Hangi Orta Çağ köyünü seçmeli?",
      intro: "Hepsine vaktiniz yoksa, bu tablo her birini özel kılan şeyi gösterir.",
      headers: { village: "Köy", character: "Karakter", mustSee: "Kaçırmayın", time: "Süre" },
      rows: [
        { name: "Mesta", href: p.mesta, character: "En bütün kalmış kale köy", mustSee: "İki Taksiyarhis kilisesi ve kemerli sokaklar", time: "1,5–2 saat" },
        { name: "Pyrgi", href: p.pyrgi, character: "“Boyalı” köy", mustSee: "Cephelerdeki siyah-beyaz xysta desenleri", time: "1–1,5 saat" },
        { name: "Olympoi", href: p.olympoi, character: "Sakin kale köy", mustSee: "Merkezdeki kule ve yakındaki mağara", time: "45–60 dakika" },
        { name: "Vessa", href: p.vessa, character: "Küçük ve sakin", mustSee: "Kalabalıktan uzak taş evler", time: "30–45 dakika" },
        { name: "Armolia", href: p.armolia, character: "Seramik köyü", mustSee: "Testi, kuğu, güneş ve ay yapan atölyeler", time: "30–45 dakika" },
        { name: "Volissos", href: p.volissos, character: "Kuzeybatıda, kaleli", mustSee: "Tepedeki kale ve manzara", time: "Ayrı bir gün" },
      ],
    },
    route: {
      kicker: "Bir günlük rota",
      title: "Güneydeki kale köyler Kambos’tan bir günde",
      intro: "Kambos, şehrin güney çıkışında, mastik köylerine giden yol üzerindedir. Bu sıra gereksiz gidiş-dönüşleri önler.",
      steps: [
        { title: "Sabah: Kambos’tan çıkış", text: "Sıcak bastırmadan erken çıkın. İlk durak yaklaşık 25 dakika uzaklıkta.", href: p.stay, linkLabel: "Kambos’ta konaklama →" },
        { title: "Armolia", text: "Kuşaktan kuşağa aktarılan seramik zanaatının atölyelerinde kısa bir mola.", href: p.armolia, linkLabel: "Armolia →" },
        { title: "Pyrgi ve Mastik Müzesi", text: "Xysta desenleri arasında yürüyün ve müzede mastiğin nasıl yetiştirildiğini görün.", href: p.pyrgi, linkLabel: "Pyrgi →" },
        { title: "Olympoi", text: "Öğleden hemen önce merkezdeki kulenin çevresinde sakin bir yürüyüş.", href: p.olympoi, linkLabel: "Olympoi →" },
        { title: "Mesta’da öğle yemeği", text: "Sokaklarda kaybolun, meydanda ya da Limenas Meston’da yemek yiyin.", href: p.mesta, linkLabel: "Mesta →" },
        { title: "Öğleden sonra ve dönüş", text: "Mavra Volia veya Komi gibi güneydeki bir plajda deniz, akşam yemeği için Kambos’a dönüş.", href: p.masticVillages, linkLabel: "Mastik köyleri →" },
      ],
    },
    stay: {
      title: "Kale köyler bahçenizden 25 dakika uzakta başlıyor",
      text: "Kambos mastik köylerine giden yol üzerindedir: şehrin içinden geçmeden erken çıkın, akşam sakin ve tarihi bir narenciye bahçesine dönün.",
      linkLabel: "Voulamandis House’ta Sakız Adası konaklama",
      href: p.stay,
      benefits: [
        "Geziler için ücretsiz otopark",
        "Odalar ve aile daireleri",
        "Komisyonsuz doğrudan rezervasyon",
      ],
      primaryLabel: "Müsaitliği görün",
      secondaryLabel: "Oda & daireler",
      imageAlt: "Sakız Adası Kambos’taki Voulamandis House avlusu",
      imageLabel: "Voulamandis House · Kambos",
    },
    distances: {
      title: "Kambos’tan mesafeler",
      note: "Arabayla yaklaşık süreler.",
      items: [
        { label: "Armolia", value: "yaklaşık 25 dakika" },
        { label: "Pyrgi", value: "yaklaşık 30 dakika" },
        { label: "Olympoi", value: "yaklaşık 35–40 dakika" },
        { label: "Mesta", value: "yaklaşık 40–45 dakika" },
        { label: "Vessa", value: "yaklaşık 40 dakika" },
        { label: "Volissos", value: "yaklaşık 1 saat" },
        { label: "Voulamandis House", value: "Kambos’ta konaklamayı görün", href: p.stay },
      ],
    },
    faq: {
      kicker: "Sık sorulan sorular",
      title: "Sakız Adası Orta Çağ köyleri hakkında sorular",
      items: [
        { question: "Sakız Adası’nın Orta Çağ köyleri hangileri?", answer: "En bilinenleri güneydeki Mesta, Pyrgi, Olympoi ve Vessa ile kuzeybatıda kalesiyle Volissos’tur." },
        { question: "Neden kale köy deniyor?", answer: "Çünkü kale gibi inşa edilmişlerdir: dış evler sur oluşturur, sokaklar labirent gibidir ve ortada savunma kulesi bulunurdu." },
        { question: "Az vaktim varsa hangisini görmeliyim?", answer: "Kale düzeni için Mesta’yı, xysta desenleri için Pyrgi’yi. Aralarında yaklaşık 10 km var ve bir sabaha sığar." },
        { question: "Hepsini bir günde görebilir miyim?", answer: "Güneydekileri evet: Armolia, Pyrgi, Olympoi ve Mesta. Volissos’u ayrı bir güne bırakmak daha iyidir." },
        { question: "Kale köyleri gezmek için nerede kalmalıyım?", answer: "Kambos pratik bir üstür: şehrin güney çıkışında, mastik köylerine giden yol üzerinde ve havalimanına yakındır." },
        { question: "Araba gerekli mi?", answer: "En pratik yol budur, çünkü köyler birbirinden uzaktır. Eski köy merkezlerine araç girmez; dışarıda park edip yürüyerek girersiniz." },
      ],
    },
  };
}

const builders: Record<MedievalGuideLanguage, (p: Paths) => MedievalGuide> = { en, el, fr, de, it, es, tr };

export function getMedievalGuide(language: MedievalGuideLanguage): MedievalGuide {
  return builders[language](paths[language]);
}
