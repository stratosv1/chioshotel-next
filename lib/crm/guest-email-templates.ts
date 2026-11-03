import {
  button,
  callout,
  dateLabel,
  emailShell,
  esc,
  htmlToText,
  linkList,
  paragraph as p,
  sectionTitle,
  SITE_URL,
  stayTicket,
  steps,
  subjectPrefix,
  type EmailLanguage,
} from "@/lib/crm/email-design";

export type { EmailLanguage };

export const EMAIL_TYPES = ["arrival", "arrival_time", "chios_info", "welcome", "daily", "breakfast", "checkout", "thank_you"] as const;
export type EmailType = (typeof EMAIL_TYPES)[number];
export const EMAIL_LANGUAGES = ["el", "en", "tr"] as const;

export const EMAIL_TYPE_LABELS: Record<EmailType, { label: string; when: string }> = {
  arrival: { label: "Pre-arrival", when: "7 ημέρες πριν, ή μόλις έχουμε email αν είναι πιο αργά" },
  arrival_time: { label: "Υπενθύμιση ώρας άφιξης", when: "1–2 ημέρες πριν, μόνο αν δεν έχουμε την ώρα" },
  chios_info: { label: "Πληροφορίες για το νησί", when: "3 ημέρες πριν την άφιξη, το πρωί" },
  welcome: { label: "Καλωσόρισμα", when: "Ημέρα άφιξης, το πρωί" },
  daily: { label: "Πρόταση ημέρας", when: "Κάθε πρωί της διαμονής, με βάση τον καιρό" },
  breakfast: { label: "Υπενθύμιση πρωινού", when: "Κάθε βράδυ της διαμονής, γύρω στις 9" },
  checkout: { label: "Υπενθύμιση αναχώρησης", when: "Την προηγούμενη της αναχώρησης, το πρωί" },
  thank_you: { label: "Ευχαριστούμε", when: "Την επόμενη της αναχώρησης, το πρωί" },
};

/** These three carry the booking number, so guest replies reach the booking. */
const SUBJECT_WITH_BOOKING: EmailType[] = ["arrival", "arrival_time", "chios_info"];

export type DailySuggestion = {
  areaTitle: string;
  beachName: string | null;
  seaState: "calm" | "some-waves" | "wavy" | null;
  beaufort: number | null;
  swimSeason: boolean;
  routeUrl: string;
  stops: string[];
};

export type EmailRoom = { room: string; checkin: string; checkout: string };

export type EmailContext = {
  firstName: string;
  lastName: string;
  bookingIds: string[];
  rooms: EmailRoom[];
  suggestion?: DailySuggestion | null;
};

const PRE_ARRIVAL_URL = `${SITE_URL}/pre-arrival/`;
const WELCOME_URL = `${SITE_URL}/welcome/`;
const AI_URL = `${SITE_URL}/ai-assistant/`;
const BREAKFAST_IMAGE = `${SITE_URL}/images/welcome/voulamandis-breakfast.jpg`;

const REFERENCE = { el: "Αριθμός κράτησης", en: "Booking no.", tr: "Rezervasyon no." };

const ISLAND_LINKS: Record<EmailLanguage, { title: string; items: { href: string; title: string; note?: string }[] }[]> = {
  en: [
    { title: "Beaches", items: [
      { href: "https://goo.gl/maps/YcHxJ653pkUP95qJ6", title: "Organized beaches", note: "With umbrellas and beach facilities" },
      { href: "https://goo.gl/maps/yuUyLbmN49wYt5L6A", title: "Beaches you must visit", note: "Our favourites" },
      { href: "https://goo.gl/maps/1fowQrvsm6pU1cXi7", title: "Beaches in the south", note: "Off-the-beaten-path spots we love" },
    ] },
    { title: "Villages & attractions", items: [
      { href: "https://goo.gl/maps/59YhVp1uUtcHtrjX9", title: "Northeastern attractions" },
      { href: "https://goo.gl/maps/kG8rRzLZzJUbeSpp9", title: "Northwestern attractions" },
      { href: "https://goo.gl/maps/Ais3Y1oZvddrsvPX9", title: "West Chios" },
    ] },
    { title: "Where to eat & drink", items: [
      { href: "https://goo.gl/maps/Xnsuq5v885sxty5R8", title: "Taverns near Voulamandis House" },
      { href: "https://goo.gl/maps/1kXfE22WSL2GYeo57", title: "Evening drinks" },
    ] },
    { title: "Museums & culture", items: [{ href: "https://maps.app.goo.gl/CzHmQbwp13KMRPHQ6", title: "Museums of Chios" }] },
    { title: "Useful information", items: [
      { href: "https://maps.app.goo.gl/LjmKAQKJS9Lt6AM79", title: "Pharmacies and supermarkets nearby" },
      { href: "https://maps.app.goo.gl/rx9AE4nW384H2exj9", title: "Playgrounds for children" },
      { href: "https://www.chios.gr/en/taksidi-diamoni/touristikes-plirofories", title: "Useful telephone numbers" },
    ] },
  ],
  el: [
    { title: "Παραλίες", items: [
      { href: "https://goo.gl/maps/YcHxJ653pkUP95qJ6", title: "Οργανωμένες παραλίες", note: "Με ομπρέλες και παροχές" },
      { href: "https://goo.gl/maps/yuUyLbmN49wYt5L6A", title: "Παραλίες που αξίζει να δείτε", note: "Οι αγαπημένες μας" },
      { href: "https://goo.gl/maps/1fowQrvsm6pU1cXi7", title: "Παραλίες στον νότο", note: "Λιγότερο γνωστά σημεία που αγαπάμε" },
    ] },
    { title: "Χωριά & αξιοθέατα", items: [
      { href: "https://goo.gl/maps/59YhVp1uUtcHtrjX9", title: "Αξιοθέατα βορειοανατολικά" },
      { href: "https://goo.gl/maps/kG8rRzLZzJUbeSpp9", title: "Αξιοθέατα βορειοδυτικά" },
      { href: "https://goo.gl/maps/Ais3Y1oZvddrsvPX9", title: "Δυτική Χίος" },
    ] },
    { title: "Φαγητό & ποτό", items: [
      { href: "https://goo.gl/maps/Xnsuq5v885sxty5R8", title: "Ταβέρνες κοντά στο Voulamandis House" },
      { href: "https://goo.gl/maps/1kXfE22WSL2GYeo57", title: "Για ποτό το βράδυ" },
    ] },
    { title: "Μουσεία & πολιτισμός", items: [{ href: "https://maps.app.goo.gl/CzHmQbwp13KMRPHQ6", title: "Μουσεία της Χίου" }] },
    { title: "Χρήσιμες πληροφορίες", items: [
      { href: "https://maps.app.goo.gl/LjmKAQKJS9Lt6AM79", title: "Φαρμακεία και σούπερ μάρκετ κοντά μας" },
      { href: "https://maps.app.goo.gl/rx9AE4nW384H2exj9", title: "Παιδικές χαρές" },
      { href: "https://www.chios.gr/en/taksidi-diamoni/touristikes-plirofories", title: "Χρήσιμα τηλέφωνα" },
    ] },
  ],
  tr: [
    { title: "Plajlar", items: [
      { href: "https://goo.gl/maps/YcHxJ653pkUP95qJ6", title: "Düzenli plajlar", note: "Şemsiyeli ve olanakları olan plajlar" },
      { href: "https://goo.gl/maps/yuUyLbmN49wYt5L6A", title: "Mutlaka görmeniz gereken plajlar", note: "Favorilerimiz" },
      { href: "https://goo.gl/maps/1fowQrvsm6pU1cXi7", title: "Güneydeki plajlar", note: "Sevdiğimiz daha sakin noktalar" },
    ] },
    { title: "Köyler ve gezilecek yerler", items: [
      { href: "https://goo.gl/maps/59YhVp1uUtcHtrjX9", title: "Kuzeydoğudaki yerler" },
      { href: "https://goo.gl/maps/kG8rRzLZzJUbeSpp9", title: "Kuzeybatıdaki yerler" },
      { href: "https://goo.gl/maps/Ais3Y1oZvddrsvPX9", title: "Batı Sakız" },
    ] },
    { title: "Yeme ve içme", items: [
      { href: "https://goo.gl/maps/Xnsuq5v885sxty5R8", title: "Voulamandis House yakınındaki tavernalar" },
      { href: "https://goo.gl/maps/1kXfE22WSL2GYeo57", title: "Akşam içkisi için" },
    ] },
    { title: "Müzeler ve kültür", items: [{ href: "https://maps.app.goo.gl/CzHmQbwp13KMRPHQ6", title: "Sakız müzeleri" }] },
    { title: "Faydalı bilgiler", items: [
      { href: "https://maps.app.goo.gl/LjmKAQKJS9Lt6AM79", title: "Yakındaki eczaneler ve marketler" },
      { href: "https://maps.app.goo.gl/rx9AE4nW384H2exj9", title: "Çocuk oyun alanları" },
      { href: "https://www.chios.gr/en/taksidi-diamoni/touristikes-plirofories", title: "Faydalı telefon numaraları" },
    ] },
  ],
};

function dailyBody(language: EmailLanguage, ctx: EmailContext) {
  const s = ctx.suggestion;
  if (!s) return "";
  const sea = s.seaState ? {
    el: { calm: "ήρεμη", "some-waves": "με λίγο κύμα", wavy: "με κύμα" },
    en: { calm: "calm", "some-waves": "a little wavy", wavy: "wavy" },
    tr: { calm: "sakin", "some-waves": "biraz dalgalı", wavy: "dalgalı" },
  }[language][s.seaState] : null;
  const wind = s.beaufort !== null ? { el: `${s.beaufort} μποφόρ`, en: `${s.beaufort} Beaufort`, tr: `${s.beaufort} bofor` }[language] : "";
  const beach = s.swimSeason ? s.beachName : null;
  const label = {
    el: { sea: "Θάλασσα", wind: "Άνεμος", beach: "Παραλία", plan: "Το πλάνο της ημέρας", route: "Δείτε τη διαδρομή", change: "Θέλετε κάτι διαφορετικό;", planner: "Φτιάξτε τη δική σας μέρα", intro: "Με βάση τον σημερινό καιρό και τη θάλασσα, αυτή είναι η πρότασή μας:" },
    en: { sea: "Sea", wind: "Wind", beach: "Beach", plan: "Today’s plan", route: "See the route", change: "", planner: "", intro: "Based on today’s weather and sea, this is our suggestion:" },
    tr: { sea: "Deniz", wind: "Rüzgâr", beach: "Plaj", plan: "Günün planı", route: "Rotayı görün", change: "", planner: "", intro: "Bugünkü hava ve deniz durumuna göre önerimiz:" },
  }[language];
  const chips = [beach ? `${label.beach}: <strong>${esc(beach)}</strong>` : "", sea ? `${label.sea}: <strong>${esc(sea)}</strong>` : "", wind ? `${label.wind}: <strong>${esc(wind)}</strong>` : ""].filter(Boolean).join("<br>");
  const stops = s.stops.length ? sectionTitle(label.plan) + s.stops.map((stop) => p(esc(stop))).join("") : "";
  const planner = language === "el" ? p(`${label.change} <a href="${SITE_URL}/trip-planner/?src=crm" style="color:#2f6b4f;font-weight:700;text-decoration:none">${label.planner} →</a>`) : "";
  return p(label.intro) + callout(s.areaTitle, chips) + stops + button(s.routeUrl, label.route) + planner;
}

type Entry = { subject: string; eyebrow: string; heading: string; preheader: string; body: string; heroImage?: string | null };

function entries(language: EmailLanguage, ctx: EmailContext): Record<EmailType, Entry> {
  const first = esc(ctx.firstName);
  const full = esc(`${ctx.firstName} ${ctx.lastName}`.trim());
  const reference = ctx.bookingIds.length ? `${REFERENCE[language]}: ${ctx.bookingIds.join(", ")}` : "";
  const ticket = ctx.rooms.length ? stayTicket(language, ctx.rooms, reference) : "";
  const leaving = ctx.rooms[0] ? esc(dateLabel(ctx.rooms[0].checkout, language, true)) : "";
  const island = ISLAND_LINKS[language].map((group) => sectionTitle(group.title) + linkList(group.items)).join("");

  return {
    arrival: {
      en: {
        subject: "Your arrival is approaching", eyebrow: "Your stay is coming up", heading: "See you in a few days", preheader: "Two quick things for a smooth arrival.",
        body: p(`Dear ${full},`) + p(`We are truly excited to welcome you to Voulamandis House in just a few days! Here is everything for a smooth arrival and a great stay.`) + ticket + sectionTitle("Two things we need from you") + steps([
          { title: "Tell us when you arrive", html: "Simply reply to this email with your estimated arrival time and whether you are coming by car, ferry or plane." },
          { title: "Use our directions", html: `Google Maps can lead you through confusing back roads. <a href="${PRE_ARRIVAL_URL}" style="color:#2f6b4f;font-weight:700">Follow our custom directions</a> for an easy arrival.` },
        ]) + button(PRE_ARRIVAL_URL, "Directions to Voulamandis House") + callout("More on the way", "We will soon send you our tips for beaches, villages and authentic Chios experiences.") + p("If you have any questions or special requests, we are always here to help. We want you to feel at home from the moment you arrive."),
      },
      el: {
        subject: "Η άφιξή σας πλησιάζει", eyebrow: "Η διαμονή σας πλησιάζει", heading: "Τα λέμε σε λίγες μέρες", preheader: "Δύο μικρά πράγματα για μια εύκολη άφιξη.",
        body: p(`Αγαπητέ/ή ${full},`) + p(`Ανυπομονούμε να σας υποδεχτούμε στο Voulamandis House σε λίγες μέρες! Εδώ θα βρείτε ό,τι χρειάζεστε για μια εύκολη άφιξη και μια υπέροχη διαμονή.`) + ticket + sectionTitle("Δύο πράγματα που χρειαζόμαστε") + steps([
          { title: "Πείτε μας πότε φτάνετε", html: "Απαντήστε σε αυτό το email με την ώρα άφιξης και αν έρχεστε με αυτοκίνητο, πλοίο ή αεροπλάνο." },
          { title: "Ακολουθήστε τις οδηγίες μας", html: `Το Google Maps μπορεί να σας οδηγήσει σε μπερδεμένους δρόμους. <a href="${PRE_ARRIVAL_URL}" style="color:#2f6b4f;font-weight:700">Δείτε τη διαδρομή που προτείνουμε</a> για να φτάσετε εύκολα.` },
        ]) + button(PRE_ARRIVAL_URL, "Οδηγίες για το Voulamandis House") + callout("Έρχονται κι άλλα", "Σύντομα θα σας στείλουμε τις προτάσεις μας για παραλίες, χωριά και αυθεντικές εμπειρίες στη Χίο.") + p("Για οποιαδήποτε ερώτηση ή ιδιαίτερο αίτημα, είμαστε εδώ. Θέλουμε να νιώσετε σαν στο σπίτι σας από την πρώτη στιγμή."),
      },
      tr: {
        subject: "Varışınız yaklaşıyor", eyebrow: "Konaklamanız yaklaşıyor", heading: "Birkaç gün sonra görüşmek üzere", preheader: "Kolay bir varış için iki küçük adım.",
        body: p(`Sevgili ${full},`) + p(`Sizi birkaç gün sonra Voulamandis House’ta ağırlamak için sabırsızlanıyoruz! Kolay bir varış ve güzel bir konaklama için ihtiyacınız olan her şey burada.`) + ticket + sectionTitle("Sizden iki ricamız var") + steps([
          { title: "Ne zaman geleceğinizi bildirin", html: "Bu e-postayı yanıtlayarak tahmini varış saatinizi ve araba, feribot veya uçakla mı geleceğinizi yazın." },
          { title: "Yol tarifimizi kullanın", html: `Google Maps sizi karışık ara yollara götürebilir. Kolayca ulaşmak için <a href="${PRE_ARRIVAL_URL}" style="color:#2f6b4f;font-weight:700">özel yol tarifimizi</a> izleyin.` },
        ]) + button(PRE_ARRIVAL_URL, "Voulamandis House yol tarifi") + callout("Devamı geliyor", "Yakında size plajlar, köyler ve gerçek Sakız deneyimleri için önerilerimizi göndereceğiz.") + p("Her türlü soru veya özel isteğiniz için buradayız. İlk andan itibaren kendinizi evinizde hissetmenizi istiyoruz."),
      },
    }[language],
    arrival_time: {
      en: { subject: "What time will you arrive?", eyebrow: "Almost there", heading: "What time will you arrive?", preheader: "Reply with your arrival time, so we can be ready for you.",
        body: p(`Dear ${first},`) + p("Your stay is almost here! Please reply to this email with your approximate arrival time, so we can be ready to welcome you.") + button(PRE_ARRIVAL_URL, "Directions to Voulamandis House") },
      el: { subject: "Τι ώρα θα φτάσετε;", eyebrow: "Σχεδόν φτάσατε", heading: "Τι ώρα θα φτάσετε;", preheader: "Απαντήστε με την ώρα άφιξης, για να είμαστε έτοιμοι.",
        body: p(`Αγαπητέ/ή ${first},`) + p("Η διαμονή σας πλησιάζει! Απαντήστε σε αυτό το email με την ώρα άφιξής σας περίπου, για να είμαστε έτοιμοι να σας υποδεχτούμε.") + button(PRE_ARRIVAL_URL, "Οδηγίες για το Voulamandis House") },
      tr: { subject: "Saat kaçta geleceksiniz?", eyebrow: "Az kaldı", heading: "Saat kaçta geleceksiniz?", preheader: "Hazır olabilmemiz için varış saatinizi yazın.",
        body: p(`Sevgili ${first},`) + p("Konaklamanız çok yakın! Sizi karşılamaya hazır olabilmemiz için lütfen bu e-postayı yaklaşık varış saatinizle yanıtlayın.") + button(PRE_ARRIVAL_URL, "Voulamandis House yol tarifi") },
    }[language],
    chios_info: {
      en: {
        subject: "Get ready for Chios", eyebrow: "Your Chios guide", heading: "Get ready for Chios", preheader: "Our best beaches, villages, food and useful tips.",
        body: p("We are excited to welcome you to our beautiful island. To help you plan your days, we have gathered our very best suggestions. It is all just a click away!") + ticket + island + callout("Ask our AI assistant", `Get personalised day trips, find things to do based on your interests, or ask any question about the island.<br><a href="${AI_URL}" style="color:#2f6b4f;font-weight:700">Try the assistant →</a>`),
      },
      el: {
        subject: "Ετοιμαστείτε για τη Χίο", eyebrow: "Ο οδηγός σας για τη Χίο", heading: "Ετοιμαστείτε για τη Χίο", preheader: "Οι καλύτερες παραλίες, χωριά, φαγητό και χρήσιμες πληροφορίες.",
        body: p("Ανυπομονούμε να σας υποδεχτούμε στο όμορφο νησί μας. Για να οργανώσετε τις μέρες σας, μαζέψαμε τις καλύτερες προτάσεις μας, όλες με ένα κλικ!") + ticket + island + callout("Ρωτήστε τον AI βοηθό μας", `Πάρτε εξατομικευμένες ημερήσιες εκδρομές, βρείτε τι να κάνετε με βάση τα ενδιαφέροντά σας ή ρωτήστε ό,τι θέλετε για το νησί.<br><a href="${AI_URL}" style="color:#2f6b4f;font-weight:700">Δοκιμάστε τον βοηθό →</a>`),
      },
      tr: {
        subject: "Sakız Adası için hazırlanın", eyebrow: "Sakız rehberiniz", heading: "Sakız Adası için hazırlanın", preheader: "En güzel plajlar, köyler, yemekler ve faydalı bilgiler.",
        body: p("Sizi güzel adamızda ağırlamak için sabırsızlanıyoruz. Günlerinizi planlamanıza yardımcı olmak için en iyi önerilerimizi bir araya getirdik, hepsi bir tık uzağınızda!") + ticket + island + callout("Yapay zekâ asistanımıza sorun", `Size özel günlük geziler alın, ilgi alanlarınıza göre yapılacaklar bulun veya ada hakkında istediğinizi sorun.<br><a href="${AI_URL}" style="color:#2f6b4f;font-weight:700">Asistanı deneyin →</a>`),
      },
    }[language],
    welcome: {
      en: { subject: "Welcome to Voulamandis House", eyebrow: "Today is the day", heading: "Welcome to Voulamandis House", preheader: "Everything you need for your stay, in one place.",
        body: p(`Dear ${full},`) + p("Welcome to our family accommodation. Michalis, Stratos and Angeliki are here to help in any way, and will be happy to give you any information you need for a pleasant stay and an interesting exploration of Chios.") + p("Please take 2 minutes to read our stay guide, with all the useful information for your stay.") + button(WELCOME_URL, "Open your stay guide") },
      el: { subject: "Καλώς ήρθατε στο Voulamandis House", eyebrow: "Η μέρα έφτασε", heading: "Καλώς ήρθατε στο Voulamandis House", preheader: "Όλα όσα χρειάζεστε για τη διαμονή σας, σε ένα σημείο.",
        body: p(`Αγαπητέ/ή ${full},`) + p("Καλώς ήρθατε στο οικογενειακό μας κατάλυμα. Ο Μιχάλης, ο Στράτος και η Αγγελική είναι εδώ για ό,τι χρειαστείτε και θα χαρούν να σας δώσουν κάθε πληροφορία για μια ευχάριστη διαμονή και μια ενδιαφέρουσα εξερεύνηση της Χίου.") + p("Αφιερώστε 2 λεπτά στον οδηγό διαμονής μας, με όλες τις χρήσιμες πληροφορίες για τη διαμονή σας.") + button(WELCOME_URL, "Ανοίξτε τον οδηγό διαμονής") },
      tr: { subject: "Voulamandis House’a hoş geldiniz", eyebrow: "Beklenen gün geldi", heading: "Voulamandis House’a hoş geldiniz", preheader: "Konaklamanız için ihtiyacınız olan her şey tek bir yerde.",
        body: p(`Sevgili ${full},`) + p("Aile işletmemize hoş geldiniz. Michalis, Stratos ve Angeliki her konuda yardımcı olmak için burada ve keyifli bir konaklama ile Sakız Adası’nı keşfetmeniz için ihtiyacınız olan bilgileri memnuniyetle paylaşacak.") + p("Lütfen konaklamanız için tüm faydalı bilgileri içeren rehberimize 2 dakikanızı ayırın.") + button(WELCOME_URL, "Konaklama rehberini açın") },
    }[language],
    daily: {
      en: { subject: "Today in Chios: our suggestion", eyebrow: "Your day in Chios", heading: `Good morning ${ctx.firstName}`.trim(), preheader: "A day plan based on today’s weather and sea.", body: dailyBody("en", ctx) },
      el: { subject: "Σήμερα στη Χίο: η πρότασή μας", eyebrow: "Η μέρα σας στη Χίο", heading: `Καλημέρα ${ctx.firstName}`.trim(), preheader: "Ένα πλάνο ημέρας με βάση τον σημερινό καιρό και τη θάλασσα.", body: dailyBody("el", ctx) },
      tr: { subject: "Bugün Sakız’da: önerimiz", eyebrow: "Sakız’da gününüz", heading: `Günaydın ${ctx.firstName}`.trim(), preheader: "Bugünkü hava ve denize göre bir gün planı.", body: dailyBody("tr", ctx) },
    }[language],
    breakfast: {
      en: { subject: "Breakfast tomorrow?", eyebrow: "For tomorrow morning", heading: "Join us for breakfast?", preheader: "Let us know by tonight: €12 per person, 8:00 to 10:30.", heroImage: BREAKFAST_IMAGE,
        body: p(`Dear ${first},`) + p("In case you would like to join our breakfast in the morning, we kindly ask you to let us know from the previous day. Our breakfast includes products freshly prepared by us.") + callout("Breakfast", "<strong>€12</strong> per person per day<br>From <strong>8:00</strong> until <strong>10:30</strong>") + p("You may reply to this email or inform the reception desk.") + p("There is also a QR code on your room key. Scan it to connect with us via WhatsApp or Viber.") + p("Thank you in advance!") },
      el: { subject: "Πρωινό για αύριο;", eyebrow: "Για αύριο το πρωί", heading: "Θα μας κάνετε παρέα στο πρωινό;", preheader: "Πείτε μας από απόψε: 12€ το άτομο, 8:00 έως 10:30.", heroImage: BREAKFAST_IMAGE,
        body: p(`Αγαπητέ/ή ${first},`) + p("Αν θέλετε να απολαύσετε το πρωινό μας, σας παρακαλούμε να μας ενημερώσετε από την προηγούμενη μέρα. Το πρωινό μας περιλαμβάνει προϊόντα που ετοιμάζουμε φρέσκα εμείς.") + callout("Πρωινό", "<strong>12€</strong> ανά άτομο την ημέρα<br>Από τις <strong>8:00</strong> έως τις <strong>10:30</strong>") + p("Μπορείτε να απαντήσετε σε αυτό το email ή να ενημερώσετε τη ρεσεψιόν.") + p("Επίσης, στο κλειδί του δωματίου σας υπάρχει QR code. Σκανάρετέ το για να επικοινωνήσετε μαζί μας μέσω WhatsApp ή Viber.") + p("Σας ευχαριστούμε εκ των προτέρων!") },
      tr: { subject: "Yarın kahvaltı?", eyebrow: "Yarın sabah için", heading: "Kahvaltıda bize katılır mısınız?", preheader: "Bu akşama kadar bildirin: kişi başı 12€, 8:00 - 10:30.", heroImage: BREAKFAST_IMAGE,
        body: p(`Sevgili ${first},`) + p("Sabah kahvaltımıza katılmak isterseniz, lütfen bir gün önceden bize bildirin. Kahvaltımız, tarafımızdan taze hazırlanan ürünlerden oluşur.") + callout("Kahvaltı", "Kişi başı günlük <strong>12€</strong><br><strong>8:00</strong> - <strong>10:30</strong> arası") + p("Bu e-postayı yanıtlayabilir veya resepsiyona bildirebilirsiniz.") + p("Ayrıca oda anahtarınızda bir QR kod bulunuyor. Taratarak bize WhatsApp veya Viber üzerinden ulaşabilirsiniz.") + p("Şimdiden teşekkür ederiz!") },
    }[language],
    checkout: {
      en: { subject: "Your check-out is coming up", eyebrow: "Before you leave", heading: "A quick check-out reminder", preheader: "Check-out time, luggage, taxi and payment.",
        body: p(`Dear ${first},`) + p(`We hope you are having a wonderful stay at Voulamandis House! Just a quick reminder that your check-out day is <strong>${leaving}</strong>. Check-out time is around <strong>11:00</strong>.`) + sectionTitle("Luggage & transportation") + p("Want to explore a bit more after check-out? We are happy to <strong>safely store your luggage</strong>, so you can pick it up later.") + p("Would you like a taxi for your departure? Just let us know in advance and we will gladly arrange it.") + sectionTitle("Payment options") + p("You can settle your bill with <strong>cash</strong> or a <strong>credit or debit card</strong> (Visa / Mastercard, AMEX not accepted).") + callout("Our homemade jams", "Before you go, try our <strong>handmade fruit jams</strong>, made with fresh local ingredients from our orchard and no preservatives: <strong>mandarin, bergamot and lemon</strong>.<br><br>Available at the front desk. If you are interested, just let Angeliki know in advance.") },
      el: { subject: "Η αναχώρησή σας πλησιάζει", eyebrow: "Πριν φύγετε", heading: "Μια μικρή υπενθύμιση για την αναχώρηση", preheader: "Ώρα αναχώρησης, αποσκευές, ταξί και πληρωμή.",
        body: p(`Αγαπητέ/ή ${first},`) + p(`Ελπίζουμε να περνάτε υπέροχα στο Voulamandis House! Σας υπενθυμίζουμε ότι η αναχώρησή σας είναι <strong>${leaving}</strong>. Η ώρα αναχώρησης είναι γύρω στις <strong>11:00</strong>.`) + sectionTitle("Αποσκευές & μεταφορά") + p("Θέλετε να εξερευνήσετε λίγο ακόμα μετά την αναχώρηση; Με χαρά <strong>φυλάμε τις αποσκευές σας</strong> για να τις παραλάβετε αργότερα.") + p("Θέλετε ταξί για την αναχώρησή σας; Πείτε μας από νωρίτερα και θα το κανονίσουμε.") + sectionTitle("Τρόποι πληρωμής") + p("Μπορείτε να εξοφλήσετε με <strong>μετρητά</strong> ή με <strong>πιστωτική ή χρεωστική κάρτα</strong> (Visa / Mastercard, δεν δεχόμαστε AMEX).") + callout("Οι σπιτικές μας μαρμελάδες", "Πριν φύγετε, δοκιμάστε τις <strong>χειροποίητες μαρμελάδες</strong> μας, φτιαγμένες με φρέσκα τοπικά υλικά από το περιβόλι μας, χωρίς συντηρητικά: <strong>μανταρίνι, περγαμόντο και λεμόνι</strong>.<br><br>Θα τις βρείτε στη ρεσεψιόν. Αν σας ενδιαφέρουν, ενημερώστε την Αγγελική από νωρίτερα.") },
      tr: { subject: "Çıkışınız yaklaşıyor", eyebrow: "Ayrılmadan önce", heading: "Çıkış için küçük bir hatırlatma", preheader: "Çıkış saati, bagaj, taksi ve ödeme.",
        body: p(`Sevgili ${first},`) + p(`Umarız Voulamandis House’ta harika vakit geçiriyorsunuzdur! Çıkış gününüzün <strong>${leaving}</strong> olduğunu hatırlatmak isteriz. Çıkış saati yaklaşık <strong>11:00</strong>’dir.`) + sectionTitle("Bagaj ve ulaşım") + p("Çıkıştan sonra biraz daha gezmek ister misiniz? <strong>Bagajlarınızı güvenle saklıyor</strong>, daha sonra almanızı sağlıyoruz.") + p("Ayrılışınız için taksi ister misiniz? Önceden haber verin, memnuniyetle ayarlayalım.") + sectionTitle("Ödeme seçenekleri") + p("Hesabınızı <strong>nakit</strong> veya <strong>kredi ya da banka kartı</strong> ile ödeyebilirsiniz (Visa / Mastercard, AMEX kabul edilmez).") + callout("Ev yapımı reçellerimiz", "Ayrılmadan önce, bahçemizin taze yerel malzemeleriyle koruyucu kullanmadan yaptığımız <strong>el yapımı reçellerimizi</strong> deneyin: <strong>mandalina, bergamot ve limon</strong>.<br><br>Resepsiyonda satın alabilirsiniz. İlgileniyorsanız Angeliki’ye önceden haber vermeniz yeterli.") },
    }[language],
    thank_you: {
      en: { subject: "Thank you for staying with us", eyebrow: "Until next time", heading: "Thank you", preheader: "It was a joy to have you at Voulamandis House.",
        body: p(`Dear ${first},`) + p("We would like to thank you for visiting our family accommodation, Voulamandis House. We hope we managed to offer you a lovely holiday and fulfil your expectations.") },
      el: { subject: "Σας ευχαριστούμε για τη διαμονή σας", eyebrow: "Μέχρι την επόμενη φορά", heading: "Σας ευχαριστούμε", preheader: "Ήταν χαρά μας που σας φιλοξενήσαμε στο Voulamandis House.",
        body: p(`Αγαπητέ/ή ${first},`) + p("Θέλουμε να σας ευχαριστήσουμε που επισκεφθήκατε το οικογενειακό μας κατάλυμα, το Voulamandis House. Ελπίζουμε να σας προσφέραμε όμορφες διακοπές και να ανταποκριθήκαμε στις προσδοκίες σας.") },
      tr: { subject: "Bizimle kaldığınız için teşekkürler", eyebrow: "Bir dahaki sefere", heading: "Teşekkür ederiz", preheader: "Sizi Voulamandis House’ta ağırlamak bir mutluluktu.",
        body: p(`Sevgili ${first},`) + p("Aile işletmemiz Voulamandis House’u ziyaret ettiğiniz için teşekkür ederiz. Umarız size güzel bir tatil yaşatmış ve beklentilerinizi karşılamışızdır.") },
    }[language],
  };
}

export function buildGuestEmail(type: EmailType, language: EmailLanguage, ctx: EmailContext) {
  const entry = entries(language, ctx)[type];
  const html = emailShell({ language, preheader: entry.preheader, eyebrow: entry.eyebrow, heading: entry.heading, body: entry.body, heroImage: entry.heroImage });
  const subject = SUBJECT_WITH_BOOKING.includes(type) && ctx.bookingIds.length
    ? `${subjectPrefix(ctx.bookingIds, ctx.lastName)} - ${entry.subject}`
    : entry.subject;
  return { subject, html, text: htmlToText(html) };
}

