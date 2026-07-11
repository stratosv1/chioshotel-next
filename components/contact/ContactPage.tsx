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

function buildWhatsAppUrl(data: ContactPageData, lead: ContactLead, ui: ContactUiText) {
  return `https://wa.me/${data.form.whatsappPhone}?text=${encodeURIComponent(buildInquiryText(lead, ui))}`;
}

const labelClass = "ml-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#8b5e34]";
const fieldClass = "w-full rounded-full border border-[#eee5db] bg-white px-[18px] py-3.5 text-[15px] text-[#42362b] outline-none transition focus:border-[#c7925b] focus:ring-4 focus:ring-[#c7925b]/15";

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
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#fcfaf8] to-[#f5f0ea] text-[#42362b]">
      <section className="relative flex min-h-[440px] items-end overflow-hidden text-white max-md:min-h-[76svh]" aria-labelledby="contact-hero-title">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img className="h-full w-full object-cover" src={data.hero.image} alt="" loading="eager" />
        </div>

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(46,35,27,.86)_0%,rgba(92,65,42,.58)_58%,rgba(46,35,27,.28)_100%),linear-gradient(0deg,rgba(46,35,27,.76)_0%,transparent_60%)]" />

        <div className="relative z-[2] mx-auto w-[min(1180px,calc(100%-40px))] py-[70px] pt-[110px] max-md:w-[calc(100%-24px)] max-md:py-6 max-md:pt-5">
          <div className="max-w-[820px] rounded-[34px] border border-white/20 bg-white/10 p-[clamp(30px,5vw,52px)] shadow-[0_34px_90px_rgba(0,0,0,.24)] backdrop-blur-xl max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none max-md:backdrop-blur-0">
            <span className="mb-[18px] inline-flex min-h-8 items-center rounded-full border border-white/25 bg-white/15 px-3.5 text-[11px] font-black uppercase tracking-[0.12em] text-white">
              {data.hero.kicker}
            </span>
            <h1 id="contact-hero-title" className="m-0 max-w-[12ch] text-[clamp(40px,6vw,76px)] font-black leading-[0.96] tracking-[-0.055em] text-white drop-shadow-lg">
              {data.hero.title}
            </h1>
            <p className="mt-[18px] max-w-[720px] text-base leading-7 text-white/95 md:text-lg md:leading-8">{data.hero.description}</p>
          </div>
        </div>
      </section>

      <section className="py-8 pb-14 md:py-14 md:pb-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-40px))] items-start gap-7 max-md:w-[calc(100%-24px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(330px,.65fr)]">
          <article className="rounded-[34px] border border-[#e2d1c1] bg-[#fffdfa] p-[clamp(24px,4vw,42px)] shadow-xl shadow-stone-900/5 max-md:rounded-[26px] max-md:p-5">
            <header className="mb-7 text-center">
              <span className="inline-flex min-h-8 items-center rounded-full bg-[#efe6d8] px-3.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#8b5e34]">{data.form.kicker}</span>
              <h2 className="mt-3.5 text-[clamp(30px,4vw,46px)] font-black leading-none tracking-[-0.05em] text-[#42362b]">{data.form.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-[#786858]">{data.form.subtitle}</p>
            </header>

            <form onSubmit={handleEmailSubmit}>
              <div className="grid gap-x-5 gap-y-[18px] md:grid-cols-2">
                <div className="grid gap-2">
                  <label className={labelClass} htmlFor="contact-first-name">{ui.labels.name}</label>
                  <input className={fieldClass} id="contact-first-name" type="text" required autoComplete="given-name" placeholder={ui.placeholders.firstName} value={lead.firstName} onChange={(event) => updateLead("firstName", event.target.value)} />
                </div>

                <div className="grid gap-2">
                  <label className={labelClass} htmlFor="contact-last-name">{ui.labels.name}</label>
                  <input className={fieldClass} id="contact-last-name" type="text" required autoComplete="family-name" placeholder={ui.placeholders.lastName} value={lead.lastName} onChange={(event) => updateLead("lastName", event.target.value)} />
                </div>

                <div className="grid gap-2">
                  <label className={labelClass} htmlFor="contact-email">{ui.labels.email}</label>
                  <input className={fieldClass} id="contact-email" type="email" required autoComplete="email" placeholder={ui.placeholders.email} value={lead.email} onChange={(event) => updateLead("email", event.target.value)} />
                </div>

                <div className="grid gap-2">
                  <label className={labelClass} htmlFor="contact-phone">{ui.labels.phone}</label>
                  <input className={fieldClass} id="contact-phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder={ui.placeholders.phone} value={lead.phone} onChange={(event) => updateLead("phone", event.target.value)} />
                </div>

                <div className="grid gap-2">
                  <label className={labelClass} htmlFor="contact-checkin">{ui.labels.checkin}</label>
                  <input className={fieldClass} id="contact-checkin" type="date" required min={today} value={lead.checkin} onChange={(event) => handleCheckin(event.target.value)} />
                </div>

                <div className="grid gap-2">
                  <label className={labelClass} htmlFor="contact-checkout">{ui.labels.checkout}</label>
                  <input className={fieldClass} id="contact-checkout" type="date" required min={lead.checkin || tomorrow} value={lead.checkout} onChange={(event) => updateLead("checkout", event.target.value)} />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <label className={labelClass} htmlFor="contact-room">{ui.labels.room}</label>
                  <select className={fieldClass} id="contact-room" value={lead.room} onChange={(event) => updateLead("room", event.target.value)}>
                    {data.form.roomOptions.map((option) => (
                      <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <label className={labelClass} htmlFor="contact-message">{ui.labels.message}</label>
                  <textarea className="min-h-[120px] w-full resize-y rounded-3xl border border-[#eee5db] bg-white px-[18px] py-3.5 text-[15px] leading-7 text-[#42362b] outline-none transition focus:border-[#c7925b] focus:ring-4 focus:ring-[#c7925b]/15" id="contact-message" rows={4} placeholder={ui.placeholders.message} value={lead.message} onChange={(event) => updateLead("message", event.target.value)} />
                </div>
              </div>

              <div className="mt-7 grid gap-3.5 md:grid-cols-2">
                <button type="submit" className="min-h-[58px] rounded-full bg-[#8b5e34] text-xs font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-[#8b5e34]/20 transition hover:-translate-y-0.5">
                  {ui.buttons.email}
                </button>

                <button type="button" className="min-h-[58px] rounded-full bg-[#25d366] text-xs font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-[#25d366]/20 transition hover:-translate-y-0.5" onClick={handleWhatsAppClick}>
                  {ui.buttons.whatsapp}
                </button>
              </div>

              {feedback && <p className="mt-5 text-center text-sm font-extrabold text-[#8b5e34]" role="status">{feedback}</p>}
            </form>
          </article>

          <aside className="grid gap-5">
            <article className="rounded-[34px] border border-[#e2d1c1] bg-[#fffdfa] p-6 shadow-xl shadow-stone-900/5 max-md:rounded-[26px] max-md:p-5">
              <h2 className="text-[clamp(30px,4vw,46px)] font-black leading-none tracking-[-0.05em] text-[#42362b]">{data.contactInfo.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-[#786858]">{data.contactInfo.text}</p>

              <div className="mt-5 grid gap-3">
                {data.contactInfo.items.map((item) => (
                  <a href={item.href} className="flex items-start gap-3 rounded-2xl border border-[#e2d1c1] bg-[#fcfaf8] p-4" key={item.label}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c7925b]/15 text-lg" aria-hidden="true">{item.icon}</span>
                    <div>
                      <strong className="block text-sm font-black text-[#42362b]">{item.label}</strong>
                      <small className="mt-1 block text-[13px] leading-5 text-[#786858]">{item.value}</small>
                    </div>
                  </a>
                ))}
              </div>
            </article>

            <article className="rounded-[34px] border border-[#e2d1c1] bg-[#fffdfa] p-6 shadow-xl shadow-stone-900/5 max-md:rounded-[26px] max-md:p-5">
              <h2 className="text-[clamp(30px,4vw,46px)] font-black leading-none tracking-[-0.05em] text-[#42362b]">{data.trust.title}</h2>

              <div className="mt-5 grid gap-3">
                {data.trust.items.map((item) => (
                  <div className="flex items-start gap-3 rounded-2xl border border-[#e2d1c1] bg-[#fcfaf8] p-4" key={item.title}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c7925b]/15 text-lg" aria-hidden="true">{item.icon}</span>
                    <div>
                      <strong className="block text-sm font-black text-[#42362b]">{item.title}</strong>
                      <p className="mt-1 text-[13px] leading-6 text-[#786858]">{item.text}</p>
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
