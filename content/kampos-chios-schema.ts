import type { KamposChiosPageData } from "@/content/kampos-chios";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildHotelSchema,
  buildImageSchema,
  buildItemListSchema,
  buildOrganizationSchema,
  buildSchemaGraph,
  buildTouristPlaceSchema,
  buildWebPageSchema,
  buildWebsiteSchema,
  type SchemaObject,
} from "@/lib/structured-data";

const pageTitle = "Διαμονή στον Κάμπο Χίου | Ενοικιαζόμενα Δωμάτια";
const pageDescription =
  "Ήσυχα ενοικιαζόμενα δωμάτια και οικογενειακά διαμερίσματα στον ιστορικό Κάμπο της Χίου. Κοντά σε παραλίες, αεροδρόμιο και πόλη.";

const faqItems = [
  {
    question: "Γιατί να επιλέξω διαμονή στον Κάμπο της Χίου;",
    answer:
      "Ο Κάμπος συνδυάζει ησυχία, ιστορικό χαρακτήρα και φύση, ενώ παραμένει κοντά στην πόλη, το αεροδρόμιο και τις παραλίες.",
  },
  {
    question: "Υπάρχουν ενοικιαζόμενα δωμάτια μέσα στον Κάμπο;",
    answer:
      "Ναι. Το Voulamandis House διαθέτει δίκλινα δωμάτια, ισόγειες και επιλογές ορόφου, καθώς και οικογενειακά διαμερίσματα με κουζίνα.",
  },
  {
    question: "Είναι κατάλληλος για οικογένειες και ζευγάρια;",
    answer:
      "Ναι. Ο κήπος, η ήρεμη ατμόσφαιρα, η δωρεάν στάθμευση και οι διαφορετικές επιλογές διαμονής εξυπηρετούν οικογένειες και ζευγάρια.",
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
];

const roomItems = [
  {
    name: "Οικονομικά δίκλινα δωμάτια",
    url: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    image: "/images/rooms/received_1753964631359257.webp",
    description: "Οικονομική επιλογή για δύο άτομα στον Κάμπο της Χίου.",
  },
  {
    name: "Ισόγεια δίκλινα και τρίκλινα δωμάτια",
    url: "/el/domatia-xios/diklina-triklina-domatia/",
    image: "/images/rooms/double-triple-room.jpg",
    description: "Δωμάτια με εύκολη πρόσβαση στην αυλή και στον κήπο.",
  },
  {
    name: "Δωμάτια ορόφου με βεράντα",
    url: "/el/domatia-xios/diklina-triklina-domatia/",
    image: "/images/rooms/DSC07776-2-e1675109942622.webp",
    description: "Φωτεινά δωμάτια με βεράντα και θέα στα εσπεριδοειδή.",
  },
  {
    name: "Οικογενειακά διαμερίσματα",
    url: "/el/domatia-xios/oikogeneiako-diamerisma/",
    image: "/images/rooms/chios-apartments-voulamandis.webp",
    description: "Ανεξάρτητα διαμερίσματα με καθιστικό και πλήρη κουζίνα.",
  },
];

export function buildKamposChiosSchema(data: KamposChiosPageData): SchemaObject {
  const path = data.seo.canonicalPath;
  const faq = buildFaqSchema({ path, questions: faqItems });

  return buildSchemaGraph([
    buildOrganizationSchema(),
    buildHotelSchema({
      path,
      description:
        "Το Voulamandis House είναι οικογενειακό κατάλυμα στον ιστορικό Κάμπο της Χίου με δωμάτια και οικογενειακά διαμερίσματα κοντά στις παραλίες, το αεροδρόμιο και την πόλη της Χίου.",
    }),
    buildWebsiteSchema(),
    buildImageSchema(
      {
        url: data.seo.ogImage,
        alt: "Voulamandis House και διαμονή στον Κάμπο της Χίου",
        caption: "Διαμονή και ενοικιαζόμενα δωμάτια στον Κάμπο της Χίου",
      },
      path,
    ),
    buildWebPageSchema({
      path,
      title: pageTitle,
      description: pageDescription,
      image: data.seo.ogImage,
      breadcrumbs: [
        { name: "Χίος", path: "/el/chios/" },
        { name: "Διαμονή στον Κάμπο της Χίου", path },
      ],
    }),
    buildTouristPlaceSchema({
      path,
      name: "Κάμπος της Χίου",
      description:
        "Ιστορικός και παραδοσιακός οικισμός της Χίου με αρχοντικά, περιβόλια εσπεριδοειδών, πέτρινες αυλόπορτες και ήρεμα σοκάκια.",
      image: data.gallery[0]?.image || data.seo.ogImage,
      addressLocality: "Χίος",
      addressRegion: "Βόρειο Αιγαίο",
      addressCountry: "GR",
      latitude: 38.3436,
      longitude: 26.1374,
    }),
    buildItemListSchema({
      path,
      name: "Δωμάτια και διαμερίσματα στον Κάμπο της Χίου",
      description:
        "Επιλογές διαμονής στο Voulamandis House για ζευγάρια και οικογένειες.",
      items: roomItems,
    }),
    buildBreadcrumbSchema(path, [
      { name: "Χίος", path: "/el/chios/" },
      { name: "Διαμονή στον Κάμπο της Χίου", path },
    ]),
    faq,
  ]);
}
