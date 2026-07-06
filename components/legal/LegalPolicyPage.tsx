type LanguageCode = "en" | "el" | "fr" | "de" | "it" | "es" | "tr";
type PolicyKind = "privacy" | "cookies";

const titles: Record<LanguageCode, { privacy: string; cookies: string; updated: string }> = {
  en: { privacy: "Privacy Policy", cookies: "Cookie Policy", updated: "Last updated: July 2026" },
  el: { privacy: "Πολιτική απορρήτου", cookies: "Πολιτική cookies", updated: "Τελευταία ενημέρωση: Ιούλιος 2026" },
  fr: { privacy: "Politique de confidentialité", cookies: "Politique de cookies", updated: "Dernière mise à jour : juillet 2026" },
  de: { privacy: "Datenschutzerklärung", cookies: "Cookie-Richtlinie", updated: "Zuletzt aktualisiert: Juli 2026" },
  it: { privacy: "Privacy policy", cookies: "Cookie policy", updated: "Ultimo aggiornamento: luglio 2026" },
  es: { privacy: "Política de privacidad", cookies: "Política de cookies", updated: "Última actualización: julio de 2026" },
  tr: { privacy: "Gizlilik politikası", cookies: "Çerez politikası", updated: "Son güncelleme: Temmuz 2026" },
};

const body: Record<LanguageCode, string[]> = {
  en: [
    "Voulamandis House uses necessary site technologies and optional analytics only after consent.",
    "Analytics may measure anonymous page visits and button clicks for WhatsApp, calls, booking, availability, menu and contact forms.",
    "We do not send names, email addresses or phone numbers to analytics.",
    "You can change your choice by clearing site data for chioshotel.gr and choosing again.",
  ],
  el: [
    "Το Voulamandis House χρησιμοποιεί απαραίτητες τεχνολογίες site και προαιρετικά analytics μόνο μετά από συγκατάθεση.",
    "Τα analytics μπορεί να μετρούν ανώνυμες επισκέψεις και clicks σε WhatsApp, τηλέφωνο, κράτηση, διαθεσιμότητα, menu και φόρμες.",
    "Δεν στέλνουμε ονόματα, email ή τηλέφωνα στα analytics.",
    "Μπορείτε να αλλάξετε επιλογή καθαρίζοντας τα site data για το chioshotel.gr και επιλέγοντας ξανά.",
  ],
  fr: ["Voulamandis House utilise des technologies nécessaires et des analytics optionnels uniquement après consentement.", "Les analytics peuvent mesurer des visites anonymes et des clics de navigation ou de contact.", "Nous n’envoyons pas de noms, emails ou téléphones aux analytics.", "Vous pouvez modifier votre choix en supprimant les données du site chioshotel.gr."],
  de: ["Voulamandis House nutzt notwendige Website-Technologien und optionale Analytics nur nach Einwilligung.", "Analytics kann anonyme Besuche und Klicks für Kontakt und Buchung messen.", "Wir senden keine Namen, E-Mails oder Telefonnummern an Analytics.", "Sie können Ihre Auswahl ändern, indem Sie Website-Daten für chioshotel.gr löschen."],
  it: ["Voulamandis House usa tecnologie necessarie e analytics opzionali solo dopo il consenso.", "Gli analytics possono misurare visite anonime e clic di contatto o prenotazione.", "Non inviamo nomi, email o telefoni agli analytics.", "Puoi modificare la scelta cancellando i dati del sito chioshotel.gr."],
  es: ["Voulamandis House usa tecnologías necesarias y analytics opcionales solo después del consentimiento.", "Analytics puede medir visitas anónimas y clics de contacto o reserva.", "No enviamos nombres, emails ni teléfonos a analytics.", "Puedes cambiar tu elección borrando los datos del sitio chioshotel.gr."],
  tr: ["Voulamandis House gerekli site teknolojilerini ve isteğe bağlı analytics’i yalnızca onaydan sonra kullanır.", "Analytics anonim ziyaretleri ve iletişim ya da rezervasyon tıklamalarını ölçebilir.", "Analytics’e isim, e-posta veya telefon göndermeyiz.", "Seçiminizi chioshotel.gr site verilerini silerek değiştirebilirsiniz."],
};

export function LegalPolicyPage({ language, kind }: { language: LanguageCode; kind: PolicyKind }) {
  const t = titles[language] || titles.en;
  const paragraphs = body[language] || body.en;
  const title = kind === "privacy" ? t.privacy : t.cookies;

  return (
    <main className="mx-auto max-w-4xl px-5 py-16 text-[#2f261f]">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#6a4b00]">Voulamandis House</p>
      <h1 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">{title}</h1>
      <p className="mt-3 text-sm font-semibold text-[#766a61]">{t.updated}</p>
      <section className="mt-8 rounded-[2rem] border border-[#eadfce] bg-[#fffdfa] p-6 shadow-sm">
        {paragraphs.map((paragraph) => <p className="mt-4 text-lg leading-8 text-[#574b3f]" key={paragraph}>{paragraph}</p>)}
      </section>
    </main>
  );
}
