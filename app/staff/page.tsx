import type { Metadata } from "next";
import styles from "./staff.module.css";

export const metadata: Metadata = {
  title: "Staff Area | Voulamandis House",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const staffLinks = [
  {
    href: "https://chioshotels.elementor.cloud/new1/",
    icon: "📞",
    label: "Τιμές & Διαθεσιμότητα",
    subText: "Για τις τηλεφωνικές κλήσεις",
    className: styles.callPrices,
  },
  {
    href: "https://chioshotels.elementor.cloud/booker/",
    icon: "📅",
    label: "Εδώ καταχωρείται απευθείας κράτηση",
    subText: "Online Σύστημα",
    className: styles.directBooking,
  },
  {
    href: "https://chioshotels.elementor.cloud/housekeeping/",
    icon: "🧹",
    label: "Υπηρεσίες Housekeeping",
    subText: "Αιτήματα για δωμάτιο & ανέσεις",
    className: styles.housekeeping,
  },
  {
    href: "https://chioshotels.elementor.cloud/performance/",
    icon: "📈",
    label: "Στατιστικά Performance",
    subText: "Προστατευμένη πρόσβαση staff",
    className: styles.performance,
  },
  {
    href: "/staff/expenses",
    icon: "🧾",
    label: "Έξοδα Ξενοδοχείου",
    subText: "Καταχώρηση & ανάλυση εξόδων",
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
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <span className={styles.cardIcon} aria-hidden="true">
                {item.icon}
              </span>

              <span className={styles.cardContent}>
                <span className={styles.cardLabel}>{item.label}</span>
                <span className={styles.cardSubText}>{item.subText}</span>
              </span>
            </a>
          ))}
        </section>

        <section className={styles.staffNotice}>
          <strong>Σημείωση ασφαλείας:</strong> Μην αποθηκεύεις προσωπικά
          στοιχεία πελατών ή ευαίσθητα οικονομικά δεδομένα μέσα σε αυτή τη
          σελίδα. Η σελίδα λειτουργεί μόνο ως προστατευμένο κέντρο γρήγορης
          πρόσβασης.
        </section>
      </div>
    </main>
  );
}

