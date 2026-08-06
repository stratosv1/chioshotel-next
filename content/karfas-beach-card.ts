import { chiosBeachesPageEl } from "@/content/chios-beaches";

const karfasBeachCard = {
  id: "karfas",
  name: "Καρφάς",
  title: "Παραλία Καρφάς: άμμος και ρηχά νερά",
  description:
    "Μεγάλη οργανωμένη αμμώδης παραλία κοντά στην πόλη και τον Κάμπο, με ρηχά νερά, ξαπλώστρες, beach bars και εύκολη πρόσβαση.",
  image: "/images/beaches/karfas-beach-chios.webp",
  imageAlt:
    "Παραλία Καρφάς στη Χίο με αμμώδη ακτή, ξαπλώστρες και ρηχά νερά",
  href: "/el/paralies-xios/paralia-karfas/",
  region: "Κεντρική Χίος",
  mood: "Οργανωμένη και οικογενειακή",
  badges: ["Αμμώδης", "Ρηχά νερά", "Κοντά στην πόλη"],
  size: "wide" as const,
};

const elintaBeachCard = {
  id: "elinta",
  name: "Ελίντα",
  title: "Παραλία Ελίντα: απάνεμος κόλπος και λευκά βότσαλα",
  description:
    "Ήσυχος, κλειστός κόλπος στη δυτική Χίο με ολόλευκα βότσαλα, κρύα πρασινογάλανα νερά και άγριο φυσικό τοπίο.",
  image: "/images/beaches/elinta-beach-chios.jpg",
  imageAlt:
    "Παραλία Ελίντα στη δυτική Χίο με λευκά βότσαλα και πρασινογάλανα νερά",
  href: "/el/paralies-xios/paralia-elinta/",
  region: "Δυτική Χίος",
  mood: "Ήσυχη και φυσική",
  badges: ["Λευκά βότσαλα", "Απάνεμη", "Μη οργανωμένη"],
  size: "wide" as const,
};

export function ensureKarfasBeachCard() {
  const cards = [elintaBeachCard, karfasBeachCard];

  for (const card of cards) {
    if (chiosBeachesPageEl.beaches.some((beach) => beach.id === card.id)) {
      continue;
    }

    const lithiIndex = chiosBeachesPageEl.beaches.findIndex(
      (beach) => beach.id === "lithi",
    );
    const insertAt = lithiIndex >= 0 ? lithiIndex + 1 : 0;
    chiosBeachesPageEl.beaches.splice(insertAt, 0, card);
  }
}
