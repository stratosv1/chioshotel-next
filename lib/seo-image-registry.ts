import { normalizePath } from "./languages";

export type SeoImageAsset = {
  src: string;
  alt: string;
  caption: string;
};

export type SeoImageSet = {
  path: string;
  heading: string;
  intro: string;
  images: readonly SeoImageAsset[];
};

const sets: readonly SeoImageSet[] = [
  {
    path: "/el/xenodoxeia-xios/",
    heading: "Δωμάτια και διαμερίσματα στον Κάμπο της Χίου",
    intro:
      "Δείτε αντιπροσωπευτικές εικόνες από το Voulamandis House, τα δωμάτια, τα οικογενειακά διαμερίσματα και το ήσυχο περιβάλλον του Κάμπου.",
    images: [
      {
        src: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
        alt: "Voulamandis House μέσα στα περιβόλια του Κάμπου της Χίου",
        caption: "Το Voulamandis House στον ιστορικό Κάμπο",
      },
      {
        src: "/images/rooms/double-triple-room.jpg",
        alt: "Δίκλινο δωμάτιο ισογείου με πρόσβαση στον κήπο στη Χίο",
        caption: "Ισόγειο δωμάτιο με εύκολη πρόσβαση",
      },
      {
        src: "/images/rooms/DSC07776-2-e1675109942622.webp",
        alt: "Δωμάτιο πρώτου ορόφου στο Voulamandis House στη Χίο",
        caption: "Φωτεινό δωμάτιο πρώτου ορόφου",
      },
      {
        src: "/images/rooms/chios-apartments-voulamandis.webp",
        alt: "Οικογενειακό διαμέρισμα με κουζίνα στον Κάμπο της Χίου",
        caption: "Οικογενειακό διαμέρισμα με πλήρη κουζίνα",
      },
    ],
  },
  {
    path: "/el/domatia-xios/",
    heading: "Δωμάτια και διαμερίσματα στη Χίο",
    intro:
      "Συγκρίνετε οπτικά τις βασικές κατηγορίες: οικονομικά δίκλινα, ισόγεια δωμάτια, δωμάτια ορόφου και οικογενειακά διαμερίσματα.",
    images: [
      {
        src: "/images/rooms/received_1753964631359257.webp",
        alt: "Οικονομικό δίκλινο δωμάτιο ισογείου στη Χίο",
        caption: "Οικονομικό δίκλινο για 2 άτομα",
      },
      {
        src: "/images/rooms/double-triple-room.jpg",
        alt: "Ισόγειο δίκλινο ή τρίκλινο δωμάτιο στον Κάμπο της Χίου",
        caption: "Ισόγειο δωμάτιο με πρόσβαση στον κήπο",
      },
      {
        src: "/images/rooms/DSC07776-2-e1675109942622.webp",
        alt: "Δίκλινο ή τρίκλινο δωμάτιο πρώτου ορόφου στη Χίο",
        caption: "Δωμάτιο πρώτου ορόφου με φωτεινή ατμόσφαιρα",
      },
      {
        src: "/images/rooms/chios-apartments-voulamandis.webp",
        alt: "Οικογενειακό διαμέρισμα στη Χίο με πλήρη κουζίνα",
        caption: "Οικογενειακό διαμέρισμα 8 ή 9",
      },
      {
        src: "/images/rooms/DSC07899.webp",
        alt: "Οικογενειακό διαμέρισμα 10 στο Voulamandis House στη Χίο",
        caption: "Οικογενειακό διαμέρισμα 10",
      },
    ],
  },
  {
    path: "/el/diamoni-sti-xio/",
    heading: "Διαμονή στη Χίο στον ιστορικό Κάμπο",
    intro:
      "Δωμάτια και οικογενειακά διαμερίσματα σε ήσυχο κτήμα με κήπο και περιβόλια, κοντά στην πόλη, το αεροδρόμιο και τις παραλίες.",
    images: [
      {
        src: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
        alt: "Διαμονή στο Voulamandis House μέσα στα περιβόλια του Κάμπου",
        caption: "Ήσυχη διαμονή στον Κάμπο της Χίου",
      },
      {
        src: "/images/rooms/received_1753964631359257.webp",
        alt: "Οικονομικό δίκλινο δωμάτιο για διαμονή στη Χίο",
        caption: "Οικονομική επιλογή για δύο άτομα",
      },
      {
        src: "/images/rooms/double-triple-room.jpg",
        alt: "Ισόγειο δωμάτιο με πρόσβαση στον κήπο στον Κάμπο Χίου",
        caption: "Ισόγειο δωμάτιο χωρίς σκάλες",
      },
      {
        src: "/images/rooms/DSC07776-2-e1675109942622.webp",
        alt: "Δωμάτιο πρώτου ορόφου στον Κάμπο της Χίου",
        caption: "Δωμάτιο ορόφου με φωτεινή ατμόσφαιρα",
      },
      {
        src: "/images/rooms/chios-apartments-voulamandis.webp",
        alt: "Οικογενειακό διαμέρισμα για διαμονή στη Χίο με κουζίνα",
        caption: "Διαμέρισμα για οικογένειες και μεγαλύτερη άνεση",
      },
    ],
  },
  {
    path: "/el/domatia-xios/oikonomiko-diklino-domatio/",
    heading: "Οικονομικά δίκλινα δωμάτια στη Χίο",
    intro:
      "Τα δωμάτια 2 και 6 είναι οι οικονομικές επιλογές για δύο άτομα, με διαφορετική θέση στον πρώτο όροφο ή στο ισόγειο.",
    images: [
      {
        src: "/images/rooms/DSC07803-1.webp",
        alt: "Οικονομικό δίκλινο δωμάτιο 2 στον πρώτο όροφο στη Χίο",
        caption: "Δωμάτιο 2 — οικονομικό δίκλινο πρώτου ορόφου",
      },
      {
        src: "/images/rooms/DSC07839.webp",
        alt: "Διπλό κρεβάτι στο οικονομικό δωμάτιο 2 στη Χίο",
        caption: "Δωμάτιο 2 — χώρος ύπνου",
      },
      {
        src: "/images/rooms/received_1753964631359257.webp",
        alt: "Οικονομικό δίκλινο δωμάτιο 6 στο ισόγειο στη Χίο",
        caption: "Δωμάτιο 6 — οικονομικό δίκλινο ισογείου",
      },
      {
        src: "/images/rooms/received_1753964581359262.webp",
        alt: "Διπλό κρεβάτι στο οικονομικό δωμάτιο 6 στον Κάμπο Χίου",
        caption: "Δωμάτιο 6 — ανακαινισμένος χώρος ύπνου",
      },
    ],
  },
  {
    path: "/el/domatia-xios/diklina-triklina-domatia/",
    heading: "Δίκλινα και τρίκλινα δωμάτια στη Χίο",
    intro:
      "Δείτε τις διαφορετικές επιλογές ισογείου και πρώτου ορόφου, με πρόσβαση στον κήπο, βεράντα ή μικρή κουζίνα ανά δωμάτιο.",
    images: [
      {
        src: "/images/rooms/voulamandis-house-rooms.webp",
        alt: "Δωμάτιο 5 ισογείου για δύο ή τρία άτομα στη Χίο",
        caption: "Δωμάτιο 5 — ισόγειο με πρόσβαση στην αυλή",
      },
      {
        src: "/images/rooms/double-triple-room.jpg",
        alt: "Δωμάτιο 7 ισογείου με καναπέ κρεβάτι στη Χίο",
        caption: "Δωμάτιο 7 — ισόγειο με ευέλικτη διάταξη",
      },
      {
        src: "/images/rooms/DSC07776-2-e1675109942622.webp",
        alt: "Δωμάτιο 1 πρώτου ορόφου για έως τέσσερα άτομα στη Χίο",
        caption: "Δωμάτιο 1 — πρώτος όροφος και ιδιωτικό μπαλκόνι",
      },
      {
        src: "/images/rooms/DSC07867-1.webp",
        alt: "Δωμάτιο 3 πρώτου ορόφου με μικρή κουζίνα στη Χίο",
        caption: "Δωμάτιο 3 — πρώτος όροφος με kitchenette",
      },
      {
        src: "/images/rooms/received_1748354861920234.webp",
        alt: "Δωμάτιο 4 πρώτου ορόφου στο Voulamandis House στη Χίο",
        caption: "Δωμάτιο 4 — πρώτος όροφος με καναπέ κρεβάτι",
      },
    ],
  },
  {
    path: "/el/domatia-xios/oikogeneiako-diamerisma/",
    heading: "Οικογενειακά διαμερίσματα στη Χίο",
    intro:
      "Τα διαμερίσματα 8 και 9 έχουν την ίδια διαρρύθμιση και κοινό αντιπροσωπευτικό φωτογραφικό υλικό. Το διαμέρισμα 10 έχει διαφορετική διάταξη.",
    images: [
      {
        src: "/images/rooms/chios-apartments-voulamandis.webp",
        alt: "Οικογενειακό διαμέρισμα 8 ή 9 στον Κάμπο της Χίου",
        caption: "Διαμερίσματα 8 και 9 — υπνοδωμάτιο και καθιστικό",
      },
      {
        src: "/images/rooms/chios-hotels-family-apartments.webp",
        alt: "Καθιστικό οικογενειακού διαμερίσματος 8 ή 9 στη Χίο",
        caption: "Διαμερίσματα 8 και 9 — οικογενειακός χώρος",
      },
      {
        src: "/images/rooms/family-room.webp",
        alt: "Οικογενειακή διάταξη κρεβατιών σε διαμέρισμα στη Χίο",
        caption: "Διαμερίσματα 8 και 9 — διάταξη για οικογένεια",
      },
      {
        src: "/images/rooms/DSC07899.webp",
        alt: "Οικογενειακό διαμέρισμα 10 στο Voulamandis House στη Χίο",
        caption: "Διαμέρισμα 10 — διαφορετική οικογενειακή διάταξη",
      },
      {
        src: "/images/rooms/DSC07909.webp",
        alt: "Χώρος καθιστικού στο οικογενειακό διαμέρισμα 10 στη Χίο",
        caption: "Διαμέρισμα 10 — καθιστικό και επιπλέον χώρος ύπνου",
      },
    ],
  },
  {
    path: "/el/chios/kampos-chios/",
    heading: "Διαμονή και δωμάτια στον Κάμπο της Χίου",
    intro:
      "Η εμπειρία του Κάμπου συνδυάζει περιβόλια, πέτρινους τοίχους, ήρεμους εξωτερικούς χώρους και δωμάτια κοντά στην πόλη της Χίου.",
    images: [
      {
        src: "/images/kampos/kambos-chios.jpg",
        alt: "Ιστορικός Κάμπος της Χίου με παραδοσιακή αρχιτεκτονική",
        caption: "Ο ιστορικός Κάμπος της Χίου",
      },
      {
        src: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
        alt: "Voulamandis House μέσα σε περιβόλι στον Κάμπο της Χίου",
        caption: "Διαμονή μέσα στα περιβόλια του Κάμπου",
      },
      {
        src: "/images/rooms/double-triple-room.jpg",
        alt: "Δωμάτιο με πρόσβαση στον κήπο στον Κάμπο της Χίου",
        caption: "Ισόγειο δωμάτιο κοντά στον κήπο",
      },
      {
        src: "/images/rooms/DSC07776-2-e1675109942622.webp",
        alt: "Δωμάτιο πρώτου ορόφου στον ιστορικό Κάμπο Χίου",
        caption: "Δωμάτιο ορόφου με θέα προς το κτήμα",
      },
      {
        src: "/images/rooms/chios-apartments-voulamandis.webp",
        alt: "Οικογενειακό διαμέρισμα στον Κάμπο της Χίου",
        caption: "Οικογενειακό διαμέρισμα στον Κάμπο",
      },
    ],
  },
  {
    path: "/el/amesi-kratisi-voulamandis-house/",
    heading: "Επιλογές για άμεση κράτηση στη Χίο",
    intro:
      "Επιλέξτε ανάμεσα σε οικονομικά δίκλινα, δωμάτια ισογείου ή ορόφου και οικογενειακά διαμερίσματα πριν ελέγξετε διαθεσιμότητα.",
    images: [
      {
        src: "/images/rooms/received_1753964631359257.webp",
        alt: "Οικονομικό δίκλινο δωμάτιο διαθέσιμο για άμεση κράτηση στη Χίο",
        caption: "Οικονομικό δίκλινο",
      },
      {
        src: "/images/rooms/double-triple-room.jpg",
        alt: "Ισόγειο δωμάτιο για άμεση κράτηση στη Χίο",
        caption: "Ισόγειο δωμάτιο",
      },
      {
        src: "/images/rooms/DSC07776-2-e1675109942622.webp",
        alt: "Δωμάτιο πρώτου ορόφου για άμεση κράτηση στη Χίο",
        caption: "Δωμάτιο πρώτου ορόφου",
      },
      {
        src: "/images/rooms/chios-apartments-voulamandis.webp",
        alt: "Οικογενειακό διαμέρισμα για άμεση κράτηση στη Χίο",
        caption: "Οικογενειακό διαμέρισμα",
      },
    ],
  },
  {
    path: "/el/romantiki-diamoni-sti-xio/",
    heading: "Ρομαντική διαμονή στη Χίο",
    intro:
      "Ήσυχα δωμάτια, αυλή και ατμόσφαιρα Κάμπου για ζευγάρια που θέλουν μια πιο προσωπική εμπειρία διαμονής.",
    images: [
      {
        src: "/images/activities/chios.hotels.voulamandis.house_.hero_.image_.webp",
        alt: "Ρομαντική διαμονή στο Voulamandis House στον Κάμπο της Χίου",
        caption: "Ήσυχη ατμόσφαιρα στον Κάμπο",
      },
      {
        src: "/images/rooms/received_1753964631359257.webp",
        alt: "Δίκλινο δωμάτιο για ζευγάρι στη Χίο",
        caption: "Δίκλινο δωμάτιο για δύο",
      },
      {
        src: "/images/rooms/DSC07776-2-e1675109942622.webp",
        alt: "Φωτεινό δωμάτιο ορόφου για ζευγάρι στη Χίο",
        caption: "Δωμάτιο ορόφου με ήρεμη ατμόσφαιρα",
      },
      {
        src: "/images/kampos/kambos-chios.jpg",
        alt: "Ιστορικός Κάμπος της Χίου κοντά στο Voulamandis House",
        caption: "Ο ιστορικός Κάμπος γύρω από το κατάλυμα",
      },
    ],
  },
];

export const seoImageSets = new Map(
  sets.map((set) => [normalizePath(set.path), set] as const),
);

export function getSeoImageSet(path: string): SeoImageSet | undefined {
  return seoImageSets.get(normalizePath(path));
}

export function getAllSeoImageSets(): readonly SeoImageSet[] {
  return sets;
}
