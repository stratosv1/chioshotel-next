"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { ContactPageData } from "@/content/contact";

type ContactPageProps = {
  data: ContactPageData;
};

type ContactLead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkin: string;
  checkout: string;
  room: string;
  message: string;
};

type ContactUiText = {
  inquiryTitle: string;
  labels: {
    name: string;
    email: string;
    phone: string;
    checkin: string;
    checkout: string;
    room: string;
    message: string;
  };
  placeholders: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  };
  buttons: {
    email: string;
    whatsapp: string;
  };
  validation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dates: string;
    checkoutAfterCheckin: string;
  };
  feedback: {
    email: string;
    whatsapp: string;
  };
  inquiryLabels: {
    name: string;
    email: string;
    phone: string;
    checkin: string;
    checkout: string;
    room: string;
    message: string;
  };
};

const contactUiByLocale: Record<string, ContactUiText> = {
  en: {
    inquiryTitle: "Voulamandis House - New Inquiry",
    labels: {
      name: "Name",
      email: "Email address",
      phone: "Phone number",
      checkin: "Check-in",
      checkout: "Check-out",
      room: "Room selection",
      message: "Message",
    },
    placeholders: {
      firstName: "John",
      lastName: "Smith",
      email: "mail@example.com",
      phone: "+44...",
      message: "Tell us more about your stay...",
    },
    buttons: {
      email: "✉️ Send email",
      whatsapp: "💬 WhatsApp",
    },
    validation: {
      firstName: "Please enter your first name.",
      lastName: "Please enter your last name.",
      email: "Please enter your email.",
      phone: "Please enter your phone number.",
      dates: "Please select check-in and check-out dates.",
      checkoutAfterCheckin: "Check-out must be after check-in.",
    },
    feedback: {
      email: "Opening your email app...",
      whatsapp: "Opening WhatsApp...",
    },
    inquiryLabels: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      checkin: "Check-in",
      checkout: "Check-out",
      room: "Room",
      message: "Message",
    },
  },
  el: {
    inquiryTitle: "Voulamandis House - Νέο αίτημα",
    labels: {
      name: "Ονοματεπώνυμο",
      email: "Email",
      phone: "Τηλέφωνο",
      checkin: "Άφιξη",
      checkout: "Αναχώρηση",
      room: "Επιλογή δωματίου",
      message: "Μήνυμα",
    },
    placeholders: {
      firstName: "Όνομα",
      lastName: "Επώνυμο",
      email: "mail@example.com",
      phone: "+30...",
      message: "Γράψτε μας περισσότερες λεπτομέρειες για τη διαμονή σας...",
    },
    buttons: {
      email: "✉️ Αποστολή email",
      whatsapp: "💬 WhatsApp",
    },
    validation: {
      firstName: "Παρακαλώ συμπληρώστε το όνομά σας.",
      lastName: "Παρακαλώ συμπληρώστε το επώνυμό σας.",
      email: "Παρακαλώ συμπληρώστε το email σας.",
      phone: "Παρακαλώ συμπληρώστε το τηλέφωνό σας.",
      dates: "Παρακαλώ επιλέξτε ημερομηνίες άφιξης και αναχώρησης.",
      checkoutAfterCheckin: "Η αναχώρηση πρέπει να είναι μετά την άφιξη.",
    },
    feedback: {
      email: "Άνοιγμα εφαρμογής email...",
      whatsapp: "Άνοιγμα WhatsApp...",
    },
    inquiryLabels: {
      name: "Ονοματεπώνυμο",
      email: "Email",
      phone: "Τηλέφωνο",
      checkin: "Άφιξη",
      checkout: "Αναχώρηση",
      room: "Δωμάτιο",
      message: "Μήνυμα",
    },
  },
  fr: {
    inquiryTitle: "Voulamandis House - Nouvelle demande",
    labels: {
      name: "Nom complet",
      email: "Adresse email",
      phone: "Téléphone",
      checkin: "Arrivée",
      checkout: "Départ",
      room: "Choix de chambre",
      message: "Message",
    },
    placeholders: {
      firstName: "Prénom",
      lastName: "Nom",
      email: "mail@example.com",
      phone: "+33...",
      message: "Ajoutez plus de détails sur votre séjour...",
    },
    buttons: {
      email: "✉️ Envoyer un email",
      whatsapp: "💬 WhatsApp",
    },
    validation: {
      firstName: "Veuillez saisir votre prénom.",
      lastName: "Veuillez saisir votre nom.",
      email: "Veuillez saisir votre email.",
      phone: "Veuillez saisir votre téléphone.",
      dates: "Veuillez sélectionner les dates d’arrivée et de départ.",
      checkoutAfterCheckin: "La date de départ doit être après la date d’arrivée.",
    },
    feedback: {
      email: "Ouverture de votre application email...",
      whatsapp: "Ouverture de WhatsApp...",
    },
    inquiryLabels: {
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      checkin: "Arrivée",
      checkout: "Départ",
      room: "Chambre",
      message: "Message",
    },
  },
  de: {
    inquiryTitle: "Voulamandis House - Neue Anfrage",
    labels: {
      name: "Vollständiger Name",
      email: "E-Mail-Adresse",
      phone: "Telefonnummer",
      checkin: "Anreise",
      checkout: "Abreise",
      room: "Zimmerauswahl",
      message: "Nachricht",
    },
    placeholders: {
      firstName: "Vorname",
      lastName: "Nachname",
      email: "mail@example.com",
      phone: "+49...",
      message: "Teilen Sie uns weitere Details zu Ihrem Aufenthalt mit...",
    },
    buttons: {
      email: "✉️ E-Mail senden",
      whatsapp: "💬 WhatsApp",
    },
    validation: {
      firstName: "Bitte geben Sie Ihren Vornamen ein.",
      lastName: "Bitte geben Sie Ihren Nachnamen ein.",
      email: "Bitte geben Sie Ihre E-Mail-Adresse ein.",
      phone: "Bitte geben Sie Ihre Telefonnummer ein.",
      dates: "Bitte wählen Sie Anreise- und Abreisedatum aus.",
      checkoutAfterCheckin: "Die Abreise muss nach der Anreise liegen.",
    },
    feedback: {
      email: "E-Mail-App wird geöffnet...",
      whatsapp: "WhatsApp wird geöffnet...",
    },
    inquiryLabels: {
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      checkin: "Anreise",
      checkout: "Abreise",
      room: "Zimmer",
      message: "Nachricht",
    },
  },
  it: {
    inquiryTitle: "Voulamandis House - Nuova richiesta",
    labels: {
      name: "Nome completo",
      email: "Indirizzo email",
      phone: "Telefono",
      checkin: "Arrivo",
      checkout: "Partenza",
      room: "Scelta camera",
      message: "Messaggio",
    },
    placeholders: {
      firstName: "Nome",
      lastName: "Cognome",
      email: "mail@example.com",
      phone: "+39...",
      message: "Scrivici altri dettagli sul tuo soggiorno...",
    },
    buttons: {
      email: "✉️ Invia email",
      whatsapp: "💬 WhatsApp",
    },
    validation: {
      firstName: "Inserisci il tuo nome.",
      lastName: "Inserisci il tuo cognome.",
      email: "Inserisci la tua email.",
      phone: "Inserisci il tuo numero di telefono.",
      dates: "Seleziona le date di arrivo e partenza.",
      checkoutAfterCheckin: "La partenza deve essere dopo l’arrivo.",
    },
    feedback: {
      email: "Apertura dell’app email...",
      whatsapp: "Apertura di WhatsApp...",
    },
    inquiryLabels: {
      name: "Nome",
      email: "Email",
      phone: "Telefono",
      checkin: "Arrivo",
      checkout: "Partenza",
      room: "Camera",
      message: "Messaggio",
    },
  },
  es: {
    inquiryTitle: "Voulamandis House - Nueva consulta",
    labels: {
      name: "Nombre completo",
      email: "Correo electrónico",
      phone: "Teléfono",
      checkin: "Llegada",
      checkout: "Salida",
      room: "Selección de habitación",
      message: "Mensaje",
    },
    placeholders: {
      firstName: "Nombre",
      lastName: "Apellido",
      email: "mail@example.com",
      phone: "+34...",
      message: "Cuéntanos más detalles sobre tu estancia...",
    },
    buttons: {
      email: "✉️ Enviar email",
      whatsapp: "💬 WhatsApp",
    },
    validation: {
      firstName: "Introduce tu nombre.",
      lastName: "Introduce tu apellido.",
      email: "Introduce tu correo electrónico.",
      phone: "Introduce tu teléfono.",
      dates: "Selecciona las fechas de llegada y salida.",
      checkoutAfterCheckin: "La salida debe ser posterior a la llegada.",
    },
    feedback: {
      email: "Abriendo tu aplicación de email...",
      whatsapp: "Abriendo WhatsApp...",
    },
    inquiryLabels: {
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      checkin: "Llegada",
      checkout: "Salida",
      room: "Habitación",
      message: "Mensaje",
    },
  },
  tr: {
    inquiryTitle: "Voulamandis House - Yeni talep",
    labels: {
      name: "Ad soyad",
      email: "E-posta adresi",
      phone: "Telefon numarası",
      checkin: "Giriş",
      checkout: "Çıkış",
      room: "Oda seçimi",
      message: "Mesaj",
    },
    placeholders: {
      firstName: "Ad",
      lastName: "Soyad",
      email: "mail@example.com",
      phone: "+90...",
      message: "Konaklamanız hakkında daha fazla bilgi yazın...",
    },
    buttons: {
      email: "✉️ E-posta gönder",
      whatsapp: "💬 WhatsApp",
    },
    validation: {
      firstName: "Lütfen adınızı girin.",
      lastName: "Lütfen soyadınızı girin.",
      email: "Lütfen e-posta adresinizi girin.",
      phone: "Lütfen telefon numaranızı girin.",
      dates: "Lütfen giriş ve çıkış tarihlerini seçin.",
      checkoutAfterCheckin: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
    },
    feedback: {
      email: "E-posta uygulamanız açılıyor...",
      whatsapp: "WhatsApp açılıyor...",
    },
    inquiryLabels: {
      name: "Ad soyad",
      email: "E-posta",
      phone: "Telefon",
      checkin: "Giriş",
      checkout: "Çıkış",
      room: "Oda",
      message: "Mesaj",
    },
  },
};

function getContactLocale(path: string) {
  const locale = path.split("/").filter(Boolean)[0];
  return locale && contactUiByLocale[locale] ? locale : "en";
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function buildInquiryText(lead: ContactLead, ui: ContactUiText) {
  return [
    ui.inquiryTitle,
    "",
    `${ui.inquiryLabels.name}: ${lead.firstName} ${lead.lastName}`,
    `${ui.inquiryLabels.email}: ${lead.email}`,
    `${ui.inquiryLabels.phone}: ${lead.phone}`,
    `${ui.inquiryLabels.checkin}: ${lead.checkin}`,
    `${ui.inquiryLabels.checkout}: ${lead.checkout}`,
    `${ui.inquiryLabels.room}: ${lead.room}`,
    "",
    `${ui.inquiryLabels.message}: ${lead.message || "-"}`,
  ].join("\n");
}

function buildMailto(data: ContactPageData, lead: ContactLead, ui: ContactUiText) {
  const subject = `${data.form.emailSubjectPrefix} - ${lead.firstName} ${lead.lastName}`;
  const body = buildInquiryText(lead, ui);

  return `mailto:${data.form.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body,
  )}`;
}

function buildWhatsAppUrl(data: ContactPageData, lead: ContactLead, ui: ContactUiText) {
  return `https://wa.me/${data.form.whatsappPhone}?text=${encodeURIComponent(buildInquiryText(lead, ui))}`;
}

export function ContactPage({ data }: ContactPageProps) {
  const today = useMemo(() => getTodayDate(), []);
  const tomorrow = useMemo(() => getTomorrowDate(), []);
  const ui = contactUiByLocale[getContactLocale(data.seo.canonicalPath)];

  const [lead, setLead] = useState<ContactLead>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkin: today,
    checkout: tomorrow,
    room: data.form.roomOptions[0]?.value || "",
    message: "",
  });

  const [feedback, setFeedback] = useState("");
  const whatsappHref = buildWhatsAppUrl(data, lead, ui);

  function updateLead<K extends keyof ContactLead>(key: K, value: ContactLead[K]) {
    setLead((current) => ({ ...current, [key]: value }));
  }

  function handleCheckin(value: string) {
    const nextDay = new Date(value);
    nextDay.setDate(nextDay.getDate() + 1);
    const minCheckout = nextDay.toISOString().split("T")[0];

    setLead((current) => ({
      ...current,
      checkin: value,
      checkout: current.checkout < minCheckout ? minCheckout : current.checkout,
    }));
  }

  function validateLead() {
    if (!lead.firstName.trim()) return ui.validation.firstName;
    if (!lead.lastName.trim()) return ui.validation.lastName;
    if (!lead.email.trim()) return ui.validation.email;
    if (!lead.phone.trim()) return ui.validation.phone;
    if (!lead.checkin || !lead.checkout) return ui.validation.dates;
    if (lead.checkout <= lead.checkin) return ui.validation.checkoutAfterCheckin;
    return "";
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const error = validateLead();

    if (error) {
      setFeedback(error);
      return;
    }

    setFeedback("Sending your message...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...lead,
          language: getContactLocale(data.seo.canonicalPath),
          page: data.seo.canonicalPath,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setFeedback(result.error || "Could not send message. Please try again.");
        return;
      }

      setFeedback("Message sent successfully. We will reply as soon as possible.");
    } catch {
      setFeedback("Could not send message. Please try again or contact us by WhatsApp.");
    }
  }

  function handleWhatsAppClick() {
    const error = validateLead();

    if (error) {
      setFeedback(error);
      return;
    }

    setFeedback(ui.feedback.whatsapp);
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="contact-page">
      <section className="contact-hero" aria-labelledby="contact-hero-title">
        <div className="contact-hero-bg" aria-hidden="true">
          <img src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="contact-hero-overlay" />

        <div className="contact-wrap contact-hero-inner">
          <div className="contact-hero-content">
            <span className="contact-kicker contact-kicker--light">{data.hero.kicker}</span>
            <h1 id="contact-hero-title">{data.hero.title}</h1>
            <p>{data.hero.description}</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-wrap contact-grid">
          <article className="contact-card contact-form-card">
            <header className="contact-form-header">
              <span className="contact-kicker">{data.form.kicker}</span>
              <h2>{data.form.title}</h2>
              <p>{data.form.subtitle}</p>
            </header>

            <form onSubmit={handleEmailSubmit}>
              <div className="contact-form-grid">
                <div className="contact-field">
                  <label htmlFor="contact-first-name">{ui.labels.name}</label>
                  <input
                    id="contact-first-name"
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder={ui.placeholders.firstName}
                    value={lead.firstName}
                    onChange={(event) => updateLead("firstName", event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-last-name">{ui.labels.name}</label>
                  <input
                    id="contact-last-name"
                    type="text"
                    required
                    autoComplete="family-name"
                    placeholder={ui.placeholders.lastName}
                    value={lead.lastName}
                    onChange={(event) => updateLead("lastName", event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">{ui.labels.email}</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={ui.placeholders.email}
                    value={lead.email}
                    onChange={(event) => updateLead("email", event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-phone">{ui.labels.phone}</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder={ui.placeholders.phone}
                    value={lead.phone}
                    onChange={(event) => updateLead("phone", event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-checkin">{ui.labels.checkin}</label>
                  <input
                    id="contact-checkin"
                    type="date"
                    required
                    min={today}
                    value={lead.checkin}
                    onChange={(event) => handleCheckin(event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-checkout">{ui.labels.checkout}</label>
                  <input
                    id="contact-checkout"
                    type="date"
                    required
                    min={lead.checkin || tomorrow}
                    value={lead.checkout}
                    onChange={(event) => updateLead("checkout", event.target.value)}
                  />
                </div>

                <div className="contact-field contact-field--full">
                  <label htmlFor="contact-room">{ui.labels.room}</label>
                  <select
                    id="contact-room"
                    value={lead.room}
                    onChange={(event) => updateLead("room", event.target.value)}
                  >
                    {data.form.roomOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contact-field contact-field--full">
                  <label htmlFor="contact-message">{ui.labels.message}</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder={ui.placeholders.message}
                    value={lead.message}
                    onChange={(event) => updateLead("message", event.target.value)}
                  />
                </div>
              </div>

              <div className="contact-actions">
                <button type="submit" className="contact-btn contact-btn--email">
                  {ui.buttons.email}
                </button>

                <button
                  type="button"
                  className="contact-btn contact-btn--whatsapp"
                  onClick={handleWhatsAppClick}
                >
                  {ui.buttons.whatsapp}
                </button>
              </div>

              {feedback && (
                <p className="contact-feedback" role="status">
                  {feedback}
                </p>
              )}
            </form>
          </article>

          <aside className="contact-side">
            <article className="contact-card contact-info-card">
              <h2>{data.contactInfo.title}</h2>
              <p>{data.contactInfo.text}</p>

              <div className="contact-info-list">
                {data.contactInfo.items.map((item) => (
                  <a href={item.href} className="contact-info-item" key={item.label}>
                    <span aria-hidden="true">{item.icon}</span>
                    <div>
                      <strong>{item.label}</strong>
                      <small>{item.value}</small>
                    </div>
                  </a>
                ))}
              </div>
            </article>

            <article className="contact-card contact-trust-card">
              <h2>{data.trust.title}</h2>

              <div className="contact-trust-list">
                {data.trust.items.map((item) => (
                  <div className="contact-trust-item" key={item.title}>
                    <span aria-hidden="true">{item.icon}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}