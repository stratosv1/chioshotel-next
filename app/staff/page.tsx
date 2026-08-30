import type { Metadata } from "next";
import styles from "./staff.module.css";

export const metadata: Metadata = {
  title: "Staff Area | Voulamandis House",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const staffLinks = [
  {
    href: "/staff/room-agreements",
    icon: "📲",
    label: "Αναζήτηση & Συμφωνία",
    subText: "Mobile room finder · split stay · αποστολή SMS · ιστορικό",
    className: styles.directBooking,
  },
  {
    href: "/staff/booker",
    icon: "📞",
    label: "Τιμές, Διαθεσιμότητα & Κράτηση",
    subText: "Staff Room Finder · έλεγχος διαθεσιμότητας · απευθείας καταχώρηση στο Beds24",
    className: styles.callPrices,
  },
  {
    href: "/staff/ai-room-finder",
    icon: "💬",
    label: "AI Room Finder Inbox",
    subText: "Live συνομιλίες πελατών · μη αναγνωσμένα · αιτήματα ενδιαφέροντος",
    className: styles.performance,
  },
  {
    href: "https://chioshotels.elementor.cloud/housekeeping/",
    icon: "🧹",
    label: "Υπηρεσίες Housekeeping",
    subText: "Αιτήματα για δωμάτιο & ανέσεις",
    className: styles.housekeeping,
    external: true,
  },
  {
    href: "/staff/statistics",
    icon: "📈",
    label: "Στατιστικά Voulamandis House",
    subText: "Αναμενόμενα έσοδα από επόμενα check-in · 2026 έναντι 2025",
    className: styles.performance,
  },
  {
    href: "/staff/expenses",
    icon: "🧾",
    label: "Έξοδα",
    subText: "Καταχώρηση & ανάλυση εξόδων Κάμπου, Σπιτιού και Tailormade",
    className: styles.expenses,
  },
  {
    href: "/staff/payroll",
    icon: "💶",
    label: "Μισθοδοσία",
    subText: "Στοιχεία προσωπικού",
    className: styles.payroll,
  },
];

export default function StaffPage() {
  return (
    <main className={styles.staffWrapper}>
      <div className={styles.staffShell}>
        <header className={styles.staffHeader}>
          <p className={styles.staffEyebrow}>Voulamandis House</p>
          <h1 className={styles.staffTitle}>Staff Area</h1>
          <p className={styles.staffIntro}>
            Εσωτερική σελίδα προσωπικού για γρήγορη πρόσβαση σε κρατήσεις,
            τιμές, housekeeping, έξοδα, μισθοδοσία και στατιστικά.
          </p>
        </header>

        <section className={styles.cardGrid} aria-label="Staff tools">
          {staffLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.staffCard} ${item.className}`}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "nofollow noopener noreferrer" : "nofollow"}
            >
              <span className={styles.cardIcon} aria-hidden="true">{item.icon}</span>
              <span className={styles.cardContent}>
                <span className={styles.cardLabel}>{item.label}</span>
                <span className={styles.cardSubText}>{item.subText}</span>
              </span>
            </a>
          ))}
        </section>

        <section className={styles.staffNotice}>
          <strong>Σημείωση ασφαλείας:</strong> Η περιοχή Staff είναι ιδιωτική και δεν εμφανίζεται στις μηχανές αναζήτησης.
        </section>
      </div>
    </main>
  );
}
