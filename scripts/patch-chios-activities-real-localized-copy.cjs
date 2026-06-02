const fs = require("fs");

const contentFile = "content/chios-activities.ts";
const urlMapFile = "lib/url-map.ts";

let text = fs.readFileSync(contentFile, "utf8");

const start = text.indexOf("\nfunction localizePage(");
const end = text.indexOf("\nexport function getChiosActivitiesPageByLocale", start);

if (start === -1 || end === -1) {
  console.error("ERROR: Could not find localizePage block in content/chios-activities.ts");
  process.exit(1);
}

const replacement = `
const localizedActivityCopy: Partial<
  Record<LanguageCode, Partial<Record<ChiosActivityKey, any>>>
> = {
  el: {
    hub: {
      seo: {
        title: "Δραστηριότητες στη Χίο - Τι να κάνετε στη Χίο | Voulamandis House",
        description:
          "Ανακαλύψτε δραστηριότητες στη Χίο, όπως Μόστρα, πεζοπορία, ιαματικά λουτρά, ορχιδέες, μαθήματα ελληνικών και Ρουκετοπόλεμο.",
      },
      hero: {
        eyebrow: "Προτάσεις από το Voulamandis House",
        title: "Τι μπορείτε να κάνετε στη Χίο;",
        subtitle:
          "Αυθεντικές εμπειρίες, τοπικές παραδόσεις, φύση και δραστηριότητες για τις διακοπές σας στη Χίο.",
      },
      intro: {
        title: "Ανακαλύψτε αυθεντικές εμπειρίες στη Χίο",
        text: [
          "Η Χίος είναι ένα νησί με ιστορία, πολιτισμό, φύση και ξεχωριστές τοπικές παραδόσεις.",
          "Από γιορτές και πεζοπορικές διαδρομές μέχρι ιαματικά λουτρά, ορχιδέες και τον Ρουκετοπόλεμο, το νησί προσφέρει εμπειρίες για κάθε ταξιδιώτη.",
        ],
      },
      cards: [
        {
          key: "mostra",
          title: "Μόστρα Θυμιανών",
          description:
            "Γνωρίστε το πολύχρωμο καρναβαλικό έθιμο των Θυμιανών με μουσική, χορό και τοπική γιορτή.",
          image: images.mostra,
          imageAlt: "Μόστρα στα Θυμιανά της Χίου",
          href: chiosActivityDetailPaths.mostra.el,
          buttonLabel: "Δείτε τη Μόστρα",
        },
        {
          key: "greekCourses",
          title: "Μαθήματα Ελληνικών στη Χίο",
          description:
            "Μάθετε ελληνικά και γνωρίστε τον πολιτισμό, την ιστορία και την καθημερινή ζωή της Χίου.",
          image: images.greekCourses,
          imageAlt: "Μαθήματα ελληνικών στη Χίο",
          href: chiosActivityDetailPaths.greekCourses.el,
          buttonLabel: "Δείτε τα μαθήματα",
        },
        {
          key: "hiking",
          title: "Πεζοπορία στη Χίο",
          description:
            "Ακολουθήστε μονοπάτια σε μαστιχοχώρια, βουνά, παραθαλάσσιες διαδρομές και φυσικά τοπία.",
          image: images.hiking,
          imageAlt: "Πεζοπορία στη Χίο",
          href: chiosActivityDetailPaths.hiking.el,
          buttonLabel: "Δείτε τις διαδρομές",
        },
        {
          key: "thermalBaths",
          title: "Ιαματικά Λουτρά Χίου",
          description:
            "Χαλαρώστε στις φυσικές ιαματικές πηγές των Αγιασμάτων μέσα σε ήρεμο φυσικό περιβάλλον.",
          image: images.thermalBaths,
          imageAlt: "Ιαματικά λουτρά Αγιασμάτων Χίου",
          href: chiosActivityDetailPaths.thermalBaths.el,
          buttonLabel: "Δείτε τα λουτρά",
        },
        {
          key: "rocketWar",
          title: "Ρουκετοπόλεμος Χίου",
          description:
            "Ζήστε το διάσημο πασχαλινό έθιμο του Βροντάδου που φωτίζει τον ουρανό της Χίου.",
          image: images.rocketWar,
          imageAlt: "Ρουκετοπόλεμος Χίου",
          href: chiosActivityDetailPaths.rocketWar.el,
          buttonLabel: "Δείτε τον Ρουκετοπόλεμο",
        },
        {
          key: "orchids",
          title: "Ορχιδέες της Χίου",
          description:
            "Ανακαλύψτε τις άγριες ορχιδέες και τα ανοιξιάτικα λουλούδια της χιώτικης φύσης.",
          image: images.orchids,
          imageAlt: "Άγριες ορχιδέες της Χίου",
          href: chiosActivityDetailPaths.orchids.el,
          buttonLabel: "Δείτε τις ορχιδέες",
        },
      ],
      cta: {
        title: "Οργανώστε την εμπειρία σας στη Χίο",
        text: "Μείνετε στο Voulamandis House και γνωρίστε τη Χίο μέσα από φύση, παράδοση και αυθεντικές τοπικές εμπειρίες.",
        primaryLabel: "Κάντε κράτηση",
      },
    },
    mostra: {
      seo: {
        title: "Μόστρα Θυμιανών στη Χίο | Voulamandis House",
        description:
          "Γνωρίστε τη Μόστρα Θυμιανών, μια από τις πιο ζωντανές καρναβαλικές παραδόσεις της Χίου.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Μόστρα Θυμιανών",
        subtitle: "Ζήστε την πολύχρωμη καρναβαλική γιορτή των Θυμιανών.",
      },
      sections: [
        {
          title: "Μια ζωντανή παράδοση κοντά στον Κάμπο",
          text: [
            "Η Μόστρα είναι από τις πιο χαρακτηριστικές τοπικές γιορτές της Χίου και γίνεται στα Θυμιανά.",
            "Το χωριό γεμίζει μουσική, στολές, χορό και γιορτινή ατμόσφαιρα.",
          ],
        },
        {
          title: "Διαμονή κοντά στη γιορτή",
          text: [
            "Το Voulamandis House στον Κάμπο είναι μια ήρεμη βάση για να γνωρίσετε τη Μόστρα και τη γύρω περιοχή.",
          ],
        },
      ],
      cta: {
        title: "Ανακαλύψτε τη Χίο την περίοδο του καρναβαλιού",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
      },
    },
    greekCourses: {
      seo: {
        title: "Μαθήματα Ελληνικών στη Χίο | Voulamandis House",
        description:
          "Συνδυάστε μαθήματα ελληνικής γλώσσας με πολιτισμό, ιστορία και καθημερινή ζωή στη Χίο.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Μαθήματα Ελληνικών στη Χίο",
        subtitle: "Μάθετε ελληνικά μέσα από τον πολιτισμό και τη ζωή του νησιού.",
      },
      sections: [
        {
          title: "Γλώσσα και πολιτισμός",
          text: [
            "Τα μαθήματα ελληνικών στη Χίο συνδυάζουν τη γλωσσική μάθηση με την τοπική ιστορία, μουσική, παράδοση και καθημερινότητα.",
          ],
        },
        {
          title: "Μάθηση και διακοπές",
          text: [
            "Η Χίος προσφέρει ένα ιδανικό περιβάλλον για όσους θέλουν να μάθουν ελληνικά και να γνωρίσουν αυθεντική νησιωτική ζωή.",
          ],
        },
      ],
      cta: {
        title: "Συνδυάστε τα μαθήματα με διαμονή στον Κάμπο",
        text: "Το Voulamandis House προσφέρει ήρεμη διαμονή για μαθητές και ταξιδιώτες.",
        primaryLabel: "Δείτε το Alexandria Institute",
        secondaryLabel: "Κάντε κράτηση",
      },
    },
    hiking: {
      seo: {
        title: "Πεζοπορία στη Χίο - Μονοπάτια και Φύση | Voulamandis House",
        description:
          "Ανακαλύψτε πεζοπορικές διαδρομές στη Χίο μέσα από μαστιχοχώρια, βουνά, δάση και παραθαλάσσια τοπία.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Πεζοπορία στη Χίο",
        subtitle: "Εξερευνήστε χωριά, βουνά, μονοπάτια και παραθαλάσσιες διαδρομές.",
      },
      sections: [
        {
          title: "Γιατί να κάνετε πεζοπορία στη Χίο;",
          text: [
            "Η πεζοπορία είναι ένας από τους καλύτερους τρόπους για να γνωρίσετε τη φύση της Χίου.",
            "Τα μονοπάτια περνούν από μαστιχόδεντρα, μεσαιωνικά χωριά, βουνά και ακτές.",
          ],
        },
        {
          title: "Διαδρομές για διαφορετικά επίπεδα",
          text: [
            "Η Χίος προσφέρει εύκολες βόλτες αλλά και πιο απαιτητικές πεζοπορίες για φυσιολάτρες.",
          ],
        },
      ],
      cta: {
        title: "Ξεκινήστε τις πεζοπορίες σας από το Voulamandis House",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
      },
    },
    thermalBaths: {
      seo: {
        title: "Ιαματικά Λουτρά Χίου - Αγιάσματα | Voulamandis House",
        description:
          "Χαλαρώστε στα φυσικά ιαματικά λουτρά των Αγιασμάτων στη βόρεια Χίο.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Ιαματικά Λουτρά Χίου",
        subtitle: "Χαλαρώστε στις φυσικές ιαματικές πηγές των Αγιασμάτων.",
      },
      sections: [
        {
          title: "Ένας ήρεμος προορισμός ευεξίας",
          text: [
            "Τα Αγιάσματα στη βόρεια Χίο είναι γνωστά για τα φυσικά ιαματικά νερά και το ήρεμο πράσινο περιβάλλον.",
          ],
        },
        {
          title: "Περισσότερα από λουτρά",
          text: [
            "Η περιοχή προσφέρεται και για ήπιες βόλτες, φύση, θέα και τοπικό φαγητό.",
          ],
        },
      ],
      cta: {
        title: "Προσθέστε μια μέρα χαλάρωσης στις διακοπές σας",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
      },
    },
    rocketWar: {
      seo: {
        title: "Ρουκετοπόλεμος Χίου - Πάσχα στον Βροντάδο | Voulamandis House",
        description:
          "Ζήστε τον διάσημο Ρουκετοπόλεμο της Χίου, το εντυπωσιακό πασχαλινό έθιμο του Βροντάδου.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Ρουκετοπόλεμος Χίου",
        subtitle: "Ζήστε το διάσημο πασχαλινό έθιμο του Βροντάδου.",
      },
      sections: [
        {
          title: "Το διάσημο έθιμο του Ρουκετοπόλεμου",
          text: [
            "Ο Ρουκετοπόλεμος είναι ένα από τα πιο γνωστά πασχαλινά έθιμα της Χίου.",
            "Γίνεται στον Βροντάδο το βράδυ της Ανάστασης και προσελκύει επισκέπτες από όλο τον κόσμο.",
          ],
        },
        {
          title: "Μια αξέχαστη εμπειρία",
          text: [
            "Οι επισκέπτες πρέπει πάντα να ακολουθούν τις τοπικές οδηγίες ασφαλείας και να παρακολουθούν από προτεινόμενα σημεία.",
          ],
        },
      ],
      cta: {
        title: "Μείνετε στο Voulamandis House το Πάσχα στη Χίο",
        primaryLabel: "Κάντε κράτηση για Πάσχα",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
      },
    },
    orchids: {
      seo: {
        title: "Ορχιδέες της Χίου - Άγρια Λουλούδια και Φύση | Voulamandis House",
        description:
          "Ανακαλύψτε τις άγριες ορχιδέες της Χίου, τα ανοιξιάτικα λουλούδια και τις φυσικές διαδρομές του νησιού.",
      },
      hero: {
        eyebrow: "Δραστηριότητες στη Χίο",
        title: "Ορχιδέες της Χίου",
        subtitle: "Ανακαλύψτε την άγρια ανθοφορία και τη βοτανική ομορφιά της Χίου.",
      },
      sections: [
        {
          title: "Η ομορφιά των ορχιδέων της Χίου",
          text: [
            "Η Χίος είναι γνωστή για τα άγρια λουλούδια και τις ορχιδέες της, ειδικά από το τέλος του χειμώνα έως τις αρχές του καλοκαιριού.",
          ],
        },
        {
          title: "Πού θα δείτε άγρια λουλούδια",
          text: [
            "Όμορφες περιοχές για ορχιδέες είναι ο Κάτω Φανάς, ο Μάναγρος, το Πελινναίο, η Καμπιά και οι λόφοι γύρω από Πυργί, Ολύμπους και Μεστά.",
          ],
        },
      ],
      cta: {
        title: "Ανακαλύψτε την ανοιξιάτικη φύση της Χίου",
        secondaryLabel: "Πίσω στις Δραστηριότητες",
      },
    },
  },

  fr: {
    hub: {
      seo: {
        title: "Activités à Chios - Que faire à Chios | Voulamandis House",
        description:
          "Découvrez les meilleures activités à Chios, dont Mostra, la randonnée, les sources thermales, les orchidées, les cours de grec et la Guerre des fusées.",
      },
      hero: {
        eyebrow: "Recommandé par Voulamandis House",
        title: "Que faire à Chios ?",
        subtitle:
          "Traditions locales, nature, culture et expériences authentiques pendant votre séjour à Chios.",
      },
      intro: {
        title: "Découvrez des expériences authentiques à Chios",
        text: [
          "Chios est une île riche en histoire, culture, nature et traditions locales.",
          "Festivals, randonnées, sources thermales, orchidées, cours de grec et Guerre des fusées offrent des expériences mémorables.",
        ],
      },
      cta: {
        title: "Organisez votre expérience à Chios",
        text: "Séjournez à Voulamandis House et découvrez Chios à travers la nature, la tradition et la culture locale.",
        primaryLabel: "Réserver",
      },
    },
    mostra: {
      seo: { title: "Festival Mostra à Chios | Voulamandis House" },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Festival Mostra",
        subtitle: "Découvrez la fête carnavalesque colorée de Thymiana.",
      },
      sections: [
        {
          title: "Une tradition vivante près de Kampos",
          text: [
            "Mostra est l'une des fêtes locales les plus vivantes de Chios.",
            "Le village se remplit de musique, de costumes, de danse et d'ambiance festive.",
          ],
        },
      ],
      cta: { title: "Découvrez Chios pendant la saison du carnaval", secondaryLabel: "Retour aux activités" },
    },
    greekCourses: {
      seo: { title: "Cours de grec à Chios | Voulamandis House" },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Cours de grec à Chios",
        subtitle: "Apprenez le grec tout en découvrant la culture de Chios.",
      },
      sections: [
        {
          title: "Langue et culture",
          text: [
            "Les cours associent apprentissage de la langue, histoire, traditions et vie quotidienne de l'île.",
          ],
        },
      ],
      cta: { title: "Combinez vos cours avec un séjour à Kampos", primaryLabel: "Voir Alexandria Institute", secondaryLabel: "Réserver" },
    },
    hiking: {
      seo: { title: "Randonnée à Chios | Voulamandis House" },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Randonnée à Chios",
        subtitle: "Explorez villages, montagnes, sentiers et paysages côtiers.",
      },
      sections: [
        {
          title: "Pourquoi randonner à Chios ?",
          text: [
            "La randonnée est l'une des meilleures façons de découvrir la nature de Chios.",
            "Les sentiers traversent villages médiévaux, montagnes, forêts et côtes.",
          ],
        },
      ],
      cta: { title: "Commencez vos randonnées depuis Voulamandis House", secondaryLabel: "Retour aux activités" },
    },
    thermalBaths: {
      seo: { title: "Sources thermales de Chios | Voulamandis House" },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Sources thermales de Chios",
        subtitle: "Détendez-vous aux sources naturelles d'Agiasmata.",
      },
      sections: [
        {
          title: "Un lieu paisible de bien-être",
          text: [
            "Agiasmata, dans le nord de Chios, est connu pour ses eaux thermales naturelles et son environnement calme.",
          ],
        },
      ],
      cta: { title: "Ajoutez une journée bien-être à vos vacances", secondaryLabel: "Retour aux activités" },
    },
    rocketWar: {
      seo: { title: "Guerre des fusées à Chios | Voulamandis House" },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Guerre des fusées de Chios",
        subtitle: "Découvrez la célèbre tradition de Pâques à Vrontados.",
      },
      sections: [
        {
          title: "La célèbre tradition de Rouketopolemos",
          text: [
            "La Guerre des fusées est l'une des traditions de Pâques les plus connues de Chios.",
            "Elle a lieu à Vrontados la veille du dimanche de Pâques orthodoxe.",
          ],
        },
      ],
      cta: { title: "Séjournez à Voulamandis House pendant Pâques", primaryLabel: "Réserver pour Pâques", secondaryLabel: "Retour aux activités" },
    },
    orchids: {
      seo: { title: "Orchidées de Chios | Voulamandis House" },
      hero: {
        eyebrow: "Activités à Chios",
        title: "Orchidées de Chios",
        subtitle: "Découvrez les fleurs sauvages et la beauté botanique de Chios.",
      },
      sections: [
        {
          title: "La beauté des orchidées de Chios",
          text: [
            "Chios est connue pour ses fleurs sauvages et ses orchidées, surtout du printemps au début de l'été.",
          ],
        },
      ],
      cta: { title: "Découvrez la nature printanière de Chios", secondaryLabel: "Retour aux activités" },
    },
  },

  de: {
    hub: {
      seo: {
        title: "Aktivitäten auf Chios - Was tun auf Chios | Voulamandis House",
        description:
          "Entdecken Sie Aktivitäten auf Chios: Mostra, Wandern, Thermalquellen, Orchideen, Griechischkurse und den Raketenkrieg.",
      },
      hero: {
        eyebrow: "Empfohlen von Voulamandis House",
        title: "Was kann man auf Chios unternehmen?",
        subtitle:
          "Authentische Erlebnisse, lokale Traditionen, Natur und Kultur während Ihres Aufenthalts auf Chios.",
      },
      intro: {
        title: "Authentische Erlebnisse auf Chios",
        text: [
          "Chios ist reich an Geschichte, Kultur, Natur und lokalen Traditionen.",
          "Festivals, Wanderwege, Thermalquellen, Orchideen und der berühmte Raketenkrieg machen die Insel besonders.",
        ],
      },
      cta: {
        title: "Planen Sie Ihr Chios-Erlebnis",
        text: "Übernachten Sie im Voulamandis House und entdecken Sie Natur, Tradition und lokale Kultur.",
        primaryLabel: "Jetzt buchen",
      },
    },
    mostra: {
      seo: { title: "Mostra Festival auf Chios | Voulamandis House" },
      hero: { eyebrow: "Aktivitäten auf Chios", title: "Mostra Festival", subtitle: "Erleben Sie das farbenfrohe Karnevalsfest in Thymiana." },
      sections: [{ title: "Eine lebendige Tradition nahe Kampos", text: ["Mostra ist eines der lebendigsten lokalen Feste auf Chios.", "Musik, Kostüme und Tanz erfüllen das Dorf mit festlicher Atmosphäre."] }],
      cta: { title: "Entdecken Sie Chios zur Karnevalszeit", secondaryLabel: "Zurück zu den Aktivitäten" },
    },
    greekCourses: {
      seo: { title: "Griechischkurse auf Chios | Voulamandis House" },
      hero: { eyebrow: "Aktivitäten auf Chios", title: "Griechischkurse auf Chios", subtitle: "Lernen Sie Griechisch und entdecken Sie die Kultur von Chios." },
      sections: [{ title: "Sprache und Kultur", text: ["Die Kurse verbinden Sprachunterricht mit Geschichte, Traditionen und dem Alltag der Insel."] }],
      cta: { title: "Kombinieren Sie Ihren Kurs mit einem Aufenthalt in Kampos", primaryLabel: "Alexandria Institute ansehen", secondaryLabel: "Jetzt buchen" },
    },
    hiking: {
      seo: { title: "Wandern auf Chios | Voulamandis House" },
      hero: { eyebrow: "Aktivitäten auf Chios", title: "Wandern auf Chios", subtitle: "Entdecken Sie Dörfer, Berge, Wege und Küstenlandschaften." },
      sections: [{ title: "Warum auf Chios wandern?", text: ["Wandern ist eine der besten Arten, die Natur von Chios zu erleben.", "Die Wege führen durch Mastixdörfer, Berge, Wälder und Küstengebiete."] }],
      cta: { title: "Starten Sie Ihren Wanderurlaub im Voulamandis House", secondaryLabel: "Zurück zu den Aktivitäten" },
    },
    thermalBaths: {
      seo: { title: "Thermalquellen auf Chios | Voulamandis House" },
      hero: { eyebrow: "Aktivitäten auf Chios", title: "Thermalquellen auf Chios", subtitle: "Entspannen Sie an den natürlichen Quellen von Agiasmata." },
      sections: [{ title: "Ein ruhiger Wellness-Ort", text: ["Agiasmata im Norden von Chios ist bekannt für natürliche Thermalquellen und eine ruhige grüne Umgebung."] }],
      cta: { title: "Fügen Sie Ihrem Urlaub einen Wellness-Tag hinzu", secondaryLabel: "Zurück zu den Aktivitäten" },
    },
    rocketWar: {
      seo: { title: "Raketenkrieg auf Chios | Voulamandis House" },
      hero: { eyebrow: "Aktivitäten auf Chios", title: "Raketenkrieg auf Chios", subtitle: "Erleben Sie die berühmte Ostertradition in Vrontados." },
      sections: [{ title: "Die berühmte Rouketopolemos-Tradition", text: ["Der Raketenkrieg ist eine der bekanntesten Ostertraditionen auf Chios.", "Er findet in Vrontados am Abend vor dem orthodoxen Ostersonntag statt."] }],
      cta: { title: "Übernachten Sie zu Ostern im Voulamandis House", primaryLabel: "Osteraufenthalt buchen", secondaryLabel: "Zurück zu den Aktivitäten" },
    },
    orchids: {
      seo: { title: "Orchideen auf Chios | Voulamandis House" },
      hero: { eyebrow: "Aktivitäten auf Chios", title: "Orchideen auf Chios", subtitle: "Entdecken Sie Wildblumen und botanische Schönheit." },
      sections: [{ title: "Die Schönheit der Orchideen", text: ["Chios ist bekannt für seine Wildblumen und Orchideen, besonders vom späten Winter bis zum Frühsommer."] }],
      cta: { title: "Entdecken Sie die Frühlingsnatur von Chios", secondaryLabel: "Zurück zu den Aktivitäten" },
    },
  },

  it: {
    hub: {
      seo: {
        title: "Attività a Chios - Cosa fare a Chios | Voulamandis House",
        description:
          "Scopri attività a Chios: Mostra, trekking, terme, orchidee, corsi di greco e la Guerra dei razzi.",
      },
      hero: {
        eyebrow: "Consigliato da Voulamandis House",
        title: "Cosa fare a Chios?",
        subtitle:
          "Esperienze autentiche, tradizioni locali, natura e cultura durante il tuo soggiorno a Chios.",
      },
      intro: {
        title: "Scopri esperienze autentiche a Chios",
        text: [
          "Chios è un'isola ricca di storia, cultura, natura e tradizioni locali.",
          "Festival, sentieri, terme, orchidee e la famosa Guerra dei razzi rendono il soggiorno speciale.",
        ],
      },
      cta: {
        title: "Organizza la tua esperienza a Chios",
        text: "Soggiorna al Voulamandis House e scopri Chios attraverso natura, tradizione e cultura locale.",
        primaryLabel: "Prenota",
      },
    },
    mostra: {
      seo: { title: "Festival Mostra a Chios | Voulamandis House" },
      hero: { eyebrow: "Attività a Chios", title: "Festival Mostra", subtitle: "Vivi la festa carnevalesca colorata di Thymiana." },
      sections: [{ title: "Una tradizione vivace vicino a Kampos", text: ["Mostra è una delle feste locali più vive di Chios.", "Musica, costumi e danze creano un'atmosfera festosa."] }],
      cta: { title: "Scopri Chios durante il Carnevale", secondaryLabel: "Torna alle attività" },
    },
    greekCourses: {
      seo: { title: "Corsi di greco a Chios | Voulamandis House" },
      hero: { eyebrow: "Attività a Chios", title: "Corsi di greco a Chios", subtitle: "Impara il greco e scopri la cultura di Chios." },
      sections: [{ title: "Lingua e cultura", text: ["I corsi uniscono lingua, storia, tradizioni e vita quotidiana dell'isola."] }],
      cta: { title: "Abbina il corso a un soggiorno a Kampos", primaryLabel: "Visita Alexandria Institute", secondaryLabel: "Prenota" },
    },
    hiking: {
      seo: { title: "Trekking a Chios | Voulamandis House" },
      hero: { eyebrow: "Attività a Chios", title: "Trekking a Chios", subtitle: "Esplora villaggi, montagne, sentieri e paesaggi costieri." },
      sections: [{ title: "Perché fare trekking a Chios?", text: ["Il trekking è uno dei modi migliori per scoprire la natura di Chios.", "I percorsi attraversano villaggi del mastice, montagne, boschi e coste."] }],
      cta: { title: "Inizia la tua vacanza trekking da Voulamandis House", secondaryLabel: "Torna alle attività" },
    },
    thermalBaths: {
      seo: { title: "Terme di Chios | Voulamandis House" },
      hero: { eyebrow: "Attività a Chios", title: "Terme di Chios", subtitle: "Rilassati alle sorgenti naturali di Agiasmata." },
      sections: [{ title: "Una destinazione tranquilla per il benessere", text: ["Agiasmata, nel nord di Chios, è nota per le sue acque termali naturali e l'ambiente sereno."] }],
      cta: { title: "Aggiungi una giornata di benessere alla vacanza", secondaryLabel: "Torna alle attività" },
    },
    rocketWar: {
      seo: { title: "Guerra dei razzi a Chios | Voulamandis House" },
      hero: { eyebrow: "Attività a Chios", title: "Guerra dei razzi di Chios", subtitle: "Vivi la famosa tradizione pasquale di Vrontados." },
      sections: [{ title: "La famosa tradizione del Rouketopolemos", text: ["La Guerra dei razzi è una delle tradizioni pasquali più famose di Chios.", "Si svolge a Vrontados la sera prima della Pasqua ortodossa."] }],
      cta: { title: "Soggiorna al Voulamandis House durante la Pasqua", primaryLabel: "Prenota per Pasqua", secondaryLabel: "Torna alle attività" },
    },
    orchids: {
      seo: { title: "Orchidee di Chios | Voulamandis House" },
      hero: { eyebrow: "Attività a Chios", title: "Orchidee di Chios", subtitle: "Scopri i fiori selvatici e la bellezza botanica di Chios." },
      sections: [{ title: "La bellezza delle orchidee", text: ["Chios è conosciuta per i suoi fiori selvatici e le orchidee, soprattutto dalla fine dell'inverno all'inizio dell'estate."] }],
      cta: { title: "Scopri la natura primaverile di Chios", secondaryLabel: "Torna alle attività" },
    },
  },

  es: {
    hub: {
      seo: {
        title: "Actividades en Quíos - Qué hacer en Quíos | Voulamandis House",
        description:
          "Descubre actividades en Quíos: Mostra, senderismo, baños termales, orquídeas, cursos de griego y la Guerra de cohetes.",
      },
      hero: {
        eyebrow: "Recomendado por Voulamandis House",
        title: "¿Qué hacer en Quíos?",
        subtitle:
          "Experiencias auténticas, tradiciones locales, naturaleza y cultura durante tu estancia en Quíos.",
      },
      intro: {
        title: "Descubre experiencias auténticas en Quíos",
        text: [
          "Quíos es una isla con historia, cultura, naturaleza y tradiciones locales.",
          "Festivales, rutas de senderismo, baños termales, orquídeas y la famosa Guerra de cohetes ofrecen experiencias memorables.",
        ],
      },
      cta: {
        title: "Organiza tu experiencia en Quíos",
        text: "Alójate en Voulamandis House y descubre Quíos a través de la naturaleza, la tradición y la cultura local.",
        primaryLabel: "Reservar",
      },
    },
    mostra: {
      seo: { title: "Festival Mostra en Quíos | Voulamandis House" },
      hero: { eyebrow: "Actividades en Quíos", title: "Festival Mostra", subtitle: "Vive la colorida fiesta de carnaval de Thymiana." },
      sections: [{ title: "Una tradición viva cerca de Kampos", text: ["Mostra es una de las fiestas locales más animadas de Quíos.", "La música, los trajes y el baile llenan el pueblo de ambiente festivo."] }],
      cta: { title: "Descubre Quíos durante el carnaval", secondaryLabel: "Volver a actividades" },
    },
    greekCourses: {
      seo: { title: "Cursos de griego en Quíos | Voulamandis House" },
      hero: { eyebrow: "Actividades en Quíos", title: "Cursos de griego en Quíos", subtitle: "Aprende griego mientras descubres la cultura de Quíos." },
      sections: [{ title: "Lengua y cultura", text: ["Los cursos combinan aprendizaje del idioma, historia, tradiciones y vida cotidiana de la isla."] }],
      cta: { title: "Combina tu curso con una estancia en Kampos", primaryLabel: "Ver Alexandria Institute", secondaryLabel: "Reservar" },
    },
    hiking: {
      seo: { title: "Senderismo en Quíos | Voulamandis House" },
      hero: { eyebrow: "Actividades en Quíos", title: "Senderismo en Quíos", subtitle: "Explora pueblos, montañas, senderos y paisajes costeros." },
      sections: [{ title: "¿Por qué hacer senderismo en Quíos?", text: ["El senderismo es una de las mejores formas de descubrir la naturaleza de Quíos.", "Las rutas pasan por pueblos de mastiha, montañas, bosques y costas."] }],
      cta: { title: "Empieza tus rutas desde Voulamandis House", secondaryLabel: "Volver a actividades" },
    },
    thermalBaths: {
      seo: { title: "Baños termales de Quíos | Voulamandis House" },
      hero: { eyebrow: "Actividades en Quíos", title: "Baños termales de Quíos", subtitle: "Relájate en las fuentes naturales de Agiasmata." },
      sections: [{ title: "Un destino tranquilo de bienestar", text: ["Agiasmata, en el norte de Quíos, es conocido por sus aguas termales naturales y su ambiente tranquilo."] }],
      cta: { title: "Añade un día de bienestar a tus vacaciones", secondaryLabel: "Volver a actividades" },
    },
    rocketWar: {
      seo: { title: "Guerra de cohetes en Quíos | Voulamandis House" },
      hero: { eyebrow: "Actividades en Quíos", title: "Guerra de cohetes de Quíos", subtitle: "Vive la famosa tradición de Pascua en Vrontados." },
      sections: [{ title: "La famosa tradición del Rouketopolemos", text: ["La Guerra de cohetes es una de las tradiciones de Pascua más famosas de Quíos.", "Tiene lugar en Vrontados la noche anterior al domingo de Pascua ortodoxa."] }],
      cta: { title: "Alójate en Voulamandis House durante la Pascua", primaryLabel: "Reservar para Pascua", secondaryLabel: "Volver a actividades" },
    },
    orchids: {
      seo: { title: "Orquídeas de Quíos | Voulamandis House" },
      hero: { eyebrow: "Actividades en Quíos", title: "Orquídeas de Quíos", subtitle: "Descubre las flores silvestres y la belleza botánica de Quíos." },
      sections: [{ title: "La belleza de las orquídeas", text: ["Quíos es conocida por sus flores silvestres y orquídeas, especialmente desde finales del invierno hasta principios del verano."] }],
      cta: { title: "Descubre la naturaleza primaveral de Quíos", secondaryLabel: "Volver a actividades" },
    },
  },

  tr: {
    hub: {
      seo: {
        title: "Sakız Adası Aktiviteleri - Sakız Adası'nda Ne Yapılır | Voulamandis House",
        description:
          "Sakız Adası'nda Mostra, yürüyüş, termal kaplıcalar, orkideler, Yunanca kursları ve Roket Savaşı gibi aktiviteleri keşfedin.",
      },
      hero: {
        eyebrow: "Voulamandis House öneriyor",
        title: "Sakız Adası'nda ne yapılır?",
        subtitle:
          "Sakız Adası tatilinizde yerel gelenekler, doğa, kültür ve otantik deneyimler.",
      },
      intro: {
        title: "Sakız Adası'nda otantik deneyimler",
        text: [
          "Sakız Adası tarih, kültür, doğa ve yerel geleneklerle dolu özel bir adadır.",
          "Festivaller, yürüyüş rotaları, termal kaplıcalar, orkideler ve ünlü Roket Savaşı unutulmaz deneyimler sunar.",
        ],
      },
      cta: {
        title: "Sakız Adası deneyiminizi planlayın",
        text: "Voulamandis House'ta konaklayın ve Sakız Adası'nı doğa, gelenek ve yerel kültürle keşfedin.",
        primaryLabel: "Rezervasyon",
      },
    },
    mostra: {
      seo: { title: "Sakız Adası Mostra Festivali | Voulamandis House" },
      hero: { eyebrow: "Sakız Adası aktiviteleri", title: "Mostra Festivali", subtitle: "Thymiana'nın renkli karnaval geleneğini yaşayın." },
      sections: [{ title: "Kampos yakınında canlı bir gelenek", text: ["Mostra, Sakız Adası'nın en canlı yerel kutlamalarından biridir.", "Müzik, kostümler ve dans köye bayram havası katar."] }],
      cta: { title: "Karnaval döneminde Sakız Adası'nı keşfedin", secondaryLabel: "Aktivitelere dön" },
    },
    greekCourses: {
      seo: { title: "Sakız Adası'nda Yunanca Kursları | Voulamandis House" },
      hero: { eyebrow: "Sakız Adası aktiviteleri", title: "Sakız Adası'nda Yunanca Kursları", subtitle: "Yunanca öğrenirken Sakız kültürünü keşfedin." },
      sections: [{ title: "Dil ve kültür", text: ["Kurslar dil öğrenimini tarih, gelenekler ve adanın günlük yaşamıyla birleştirir."] }],
      cta: { title: "Kursunuzu Kampos'ta konaklama ile birleştirin", primaryLabel: "Alexandria Institute'u ziyaret edin", secondaryLabel: "Rezervasyon" },
    },
    hiking: {
      seo: { title: "Sakız Adası Yürüyüş Rotaları | Voulamandis House" },
      hero: { eyebrow: "Sakız Adası aktiviteleri", title: "Sakız Adası'nda yürüyüş", subtitle: "Köyleri, dağları, patikaları ve kıyı manzaralarını keşfedin." },
      sections: [{ title: "Neden Sakız Adası'nda yürüyüş?", text: ["Yürüyüş, Sakız Adası'nın doğasını keşfetmenin en güzel yollarından biridir.", "Rotalar mastik köylerinden, dağlardan, ormanlardan ve kıyılardan geçer."] }],
      cta: { title: "Yürüyüş tatilinize Voulamandis House'tan başlayın", secondaryLabel: "Aktivitelere dön" },
    },
    thermalBaths: {
      seo: { title: "Sakız Adası Termal Kaplıcaları | Voulamandis House" },
      hero: { eyebrow: "Sakız Adası aktiviteleri", title: "Sakız Adası Termal Kaplıcaları", subtitle: "Agiasmata'nın doğal termal sularında rahatlayın." },
      sections: [{ title: "Sakin bir sağlık ve dinlenme noktası", text: ["Kuzey Sakız'daki Agiasmata, doğal termal suları ve huzurlu çevresiyle bilinir."] }],
      cta: { title: "Tatilinize bir dinlenme günü ekleyin", secondaryLabel: "Aktivitelere dön" },
    },
    rocketWar: {
      seo: { title: "Sakız Adası Roket Savaşı | Voulamandis House" },
      hero: { eyebrow: "Sakız Adası aktiviteleri", title: "Sakız Adası Roket Savaşı", subtitle: "Vrontados'taki ünlü Paskalya geleneğini yaşayın." },
      sections: [{ title: "Ünlü Rouketopolemos geleneği", text: ["Roket Savaşı, Sakız Adası'nın en ünlü Paskalya geleneklerinden biridir.", "Ortodoks Paskalya'dan önceki gece Vrontados'ta gerçekleşir."] }],
      cta: { title: "Paskalya döneminde Voulamandis House'ta konaklayın", primaryLabel: "Paskalya konaklaması ayırtın", secondaryLabel: "Aktivitelere dön" },
    },
    orchids: {
      seo: { title: "Sakız Adası Orkideleri | Voulamandis House" },
      hero: { eyebrow: "Sakız Adası aktiviteleri", title: "Sakız Adası Orkideleri", subtitle: "Sakız Adası'nın yabani çiçeklerini ve botanik güzelliğini keşfedin." },
      sections: [{ title: "Sakız orkidelerinin güzelliği", text: ["Sakız Adası, özellikle kış sonundan yaz başına kadar yabani çiçekleri ve orkideleriyle bilinir."] }],
      cta: { title: "Sakız Adası'nın bahar doğasını keşfedin", secondaryLabel: "Aktivitelere dön" },
    },
  },
};

function mergeLocalizedPage(
  page: ChiosActivitiesPageData,
  locale: LanguageCode,
): ChiosActivitiesPageData {
  if (locale === "en") return page;

  const overrides = localizedActivityCopy[locale]?.[page.key];

  if (page.key === "hub") {
    return {
      ...page,
      ...overrides,
      locale,
      path: chiosActivitiesPaths[locale],
      seo: {
        ...page.seo,
        ...overrides?.seo,
      },
      hero: {
        ...page.hero,
        ...overrides?.hero,
      },
      intro: overrides?.intro ?? page.intro,
      cards: overrides?.cards ?? getHubCards(locale),
      cta: {
        ...baseCta(locale),
        ...overrides?.cta,
        primaryHref: bookingLinks[locale],
      },
    };
  }

  return {
    ...page,
    ...overrides,
    locale,
    path: chiosActivityDetailPaths[page.key][locale],
    seo: {
      ...page.seo,
      ...overrides?.seo,
    },
    hero: {
      ...page.hero,
      ...overrides?.hero,
    },
    sections: overrides?.sections ?? page.sections,
    cta: {
      ...page.cta,
      ...overrides?.cta,
      primaryHref:
        page.key === "greekCourses" ? page.cta.primaryHref : bookingLinks[locale],
      secondaryHref: chiosActivitiesPaths[locale],
    },
  };
}

function localizePage(
  page: ChiosActivitiesPageData,
  locale: LanguageCode,
): ChiosActivitiesPageData {
  return mergeLocalizedPage(page, locale);
}
`;

text = text.slice(0, start) + replacement + text.slice(end);

fs.writeFileSync(contentFile, text, "utf8");

let urlMap = fs.readFileSync(urlMapFile, "utf8");
urlMap = urlMap.replaceAll(
  "/tr/sakiz-adasinda-yunanca-kurslari/",
  "/tr/sakiz-adasi-yunanca-kurslari/",
);
urlMap = urlMap.replaceAll(
  "/tr/sakiz-adasinda-yuruyus/",
  "/tr/sakiz-adasi-yuruyus-rotalari/",
);
fs.writeFileSync(urlMapFile, urlMap, "utf8");

console.log("SUCCESS: Chios Activities localized content patched.");
