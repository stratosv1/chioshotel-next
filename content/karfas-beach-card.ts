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

export function ensureKarfasBeachCard() {
  if (chiosBeachesPageEl.beaches.some((beach) => beach.id === karfasBeachCard.id)) {
    return;
  }

  const lithiIndex = chiosBeachesPageEl.beaches.findIndex(
    (beach) => beach.id === "lithi",
  );
  const insertAt = lithiIndex >= 0 ? lithiIndex + 1 : 0;

  chiosBeachesPageEl.beaches.splice(insertAt, 0, karfasBeachCard);
}
