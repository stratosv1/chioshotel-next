import type { Metadata } from "next";
import { RoomDetailPage } from "@/components/rooms/RoomDetailPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { familyChiosApartmentsEl, type RoomDetailData } from "@/content/room-details";
import { buildRoomDetailSchema } from "@/content/room-detail-schema";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

const data: RoomDetailData = {
  ...familyChiosApartmentsEl,
  seo: {
    ...familyChiosApartmentsEl.seo,
    title: "Διαμερίσματα στη Χίο | Οικογενειακά Διαμερίσματα",
    description:
      "Διαμερίσματα στη Χίο στο Voulamandis House στον Κάμπο. Τρία ευρύχωρα οικογενειακά διαμερίσματα 40–45m² με κουζίνα, υπνοδωμάτιο και καθιστικό για έως 4 άτομα.",
  },
  hero: {
    ...familyChiosApartmentsEl.hero,
    kicker: "Διαμερίσματα στη Χίο • Voulamandis House",
    title: "Διαμερίσματα στη Χίο",
    subtitle: "Οικογενειακά διαμερίσματα με χώρο, κουζίνα και άνεση σαν στο σπίτι",
    description:
      "Ευρύχωρα διαμερίσματα στη Χίο με ξεχωριστό υπνοδωμάτιο, πλήρη κουζίνα και καθιστικό. Ιδανικά για οικογένειες, παρέες έως 4 ατόμων και επισκέπτες που θέλουν περισσότερη ανεξαρτησία ή μεγαλύτερη διαμονή στον Κάμπο.",
    imageAlt: "Διαμερίσματα στη Χίο στο Voulamandis House στον Κάμπο",
    primaryCta: {
      label: "Δείτε διαθεσιμότητα",
      href: "/el/amesi-kratisi-voulamandis-house/",
    },
  },
  overview: {
    ...familyChiosApartmentsEl.overview,
    title: "Διαμερίσματα στη Χίο για οικογένειες και μεγαλύτερες διαμονές",
    paragraphs: [
      "Τα διαμερίσματα του Voulamandis House στη Χίο είναι σχεδιασμένα για επισκέπτες που θέλουν περισσότερο χώρο και την πρακτικότητα μιας πλήρους κουζίνας κατά τη διαμονή τους.",
      "Κάθε οικογενειακό διαμέρισμα προσφέρει πιο ανεξάρτητη εμπειρία, με ξεχωριστό υπνοδωμάτιο, καθιστικό και πρακτικές παροχές για οικογένειες ή παρέες έως 4 ατόμων.",
      "Είναι ιδιαίτερα κατάλληλα για οικογένειες με παιδιά, επισκέπτες που μένουν περισσότερες νύχτες και ταξιδιώτες που προτιμούν άνεση διαμερίσματος αντί για ένα απλό δωμάτιο.",
    ],
  },
  individualRooms: {
    ...familyChiosApartmentsEl.individualRooms,
    kicker: "Διαμερίσματα Voulamandis House",
    title: "Τα διαθέσιμα διαμερίσματα στη Χίο",
    description:
      "Η κατηγορία περιλαμβάνει τα Διαμερίσματα 8, 9 και 10: τρεις ανεξάρτητες μονάδες για έως 4 άτομα, με κουζίνα, καθιστικό και επιπλέον χώρο για οικογένειες ή μεγαλύτερες διαμονές.",
  },
  booking: {
    ...familyChiosApartmentsEl.booking,
    title: "Βρείτε το διαθέσιμο διαμέρισμα για τις ημερομηνίες σας",
    text: "Πείτε μας ημερομηνίες και αριθμό ατόμων και θα σας προτείνουμε το καταλληλότερο διαθέσιμο διαμέρισμα στη Χίο για τη διαμονή σας.",
  },
};

export const metadata: Metadata = {
  ...buildPageMetadata({
    path: data.seo.canonicalPath,
    title: data.seo.title,
    description: data.seo.description,
    image: data.seo.ogImage,
  }),
  alternates: {
    canonical: absoluteUrl(data.seo.canonicalPath),
    languages: {
      en: absoluteUrl("/chios-rooms/family-chios-apartments/"),
      el: absoluteUrl("/el/domatia-xios/oikogeneiako-diamerisma/"),
      fr: absoluteUrl("/fr/chambres-a-chios/appartements-familiaux-de-chios/"),
      de: absoluteUrl("/de/zimmer-chios/familienapartments-in-chios/"),
      it: absoluteUrl("/it/stanze-a-chios/appartamenti-familiari-a-chios/"),
      es: absoluteUrl("/es/habitaciones-en-chios/apartamentos-familiares-en-chios/"),
      tr: absoluteUrl("/tr/chios-odalari/sakiz-adasinda-buyuk-aile-daireleri/"),
      "x-default": absoluteUrl("/chios-rooms/family-chios-apartments/"),
    },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={buildRoomDetailSchema(data)} />
      <RoomDetailPage data={data} />
    </>
  );
}
