import BeachCard from "@/components/trip-planner/BeachCard";

export const metadata = {
  title: "Beach Card Preview",
  robots: { index: false, follow: false },
};

export default function BeachCardPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ee] px-4 py-8 text-[#2f2722]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#b1763f]">Beach Card Preview</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] md:text-4xl">Νέα κάρτα παραλίας</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#766c64]">Mobile-first preview πριν περάσει μέσα στον Trip Planner.</p>
        </div>

        <div className="mx-auto flex max-w-[380px] justify-center">
          <BeachCard
            name="Βρουλίδια"
            image="/images/beaches/elinta-beach-chios.jpg"
            meta="ήσυχη · φυσική · καθαρά νερά"
            defaultSelected={false}
            weather={{
              ratingLabel: "Εξαιρετική σήμερα",
              ratingTone: "excellent",
              timeWindow: "11:00–16:00",
              temperatureC: 29,
              weatherLabel: "Καθαρός",
              windSpeedKmh: 13,
              windDirection: "ΒΑ",
              sheltered: true,
              score: 91,
              gustsKmh: 23,
              waveHeightM: 0.4,
              waveDirection: "ΒΑ",
              wavePeriodS: 4.8,
            }}
            details={[
              { label: "Ακτή", value: "μικρό βότσαλο και καθαρά γαλαζοπράσινα νερά" },
              { label: "Οργάνωση", value: "μη οργανωμένη — πάρε νερό και ό,τι χρειάζεσαι μαζί σου" },
              { label: "Πρόσβαση", value: "οδική πρόσβαση και μικρή διαδρομή μέχρι την παραλία" },
              { label: "Οικογένειες", value: "καλύτερα για οικογένειες με μεγαλύτερα παιδιά" },
              { label: "Tip", value: "προτίμησε πρωινές ώρες για πιο ήρεμη εμπειρία" },
            ]}
          />
        </div>
      </div>
    </main>
  );
}
