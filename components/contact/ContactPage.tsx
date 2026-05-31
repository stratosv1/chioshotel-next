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

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function buildInquiryText(lead: ContactLead) {
  return [
    "Voulamandis House - New Inquiry",
    "",
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Check-in: ${lead.checkin}`,
    `Check-out: ${lead.checkout}`,
    `Room: ${lead.room}`,
    "",
    `Message: ${lead.message || "-"}`,
  ].join("\n");
}

function buildMailto(data: ContactPageData, lead: ContactLead) {
  const subject = `${data.form.emailSubjectPrefix} - ${lead.firstName} ${lead.lastName}`;
  const body = buildInquiryText(lead);

  return `mailto:${data.form.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body,
  )}`;
}

function buildWhatsAppUrl(data: ContactPageData, lead: ContactLead) {
  return `https://wa.me/${data.form.whatsappPhone}?text=${encodeURIComponent(buildInquiryText(lead))}`;
}

export function ContactPage({ data }: ContactPageProps) {
  const today = useMemo(() => getTodayDate(), []);
  const tomorrow = useMemo(() => getTomorrowDate(), []);

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

  const mailtoHref = buildMailto(data, lead);
  const whatsappHref = buildWhatsAppUrl(data, lead);

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
    if (!lead.firstName.trim()) return "Please enter your first name.";
    if (!lead.lastName.trim()) return "Please enter your last name.";
    if (!lead.email.trim()) return "Please enter your email.";
    if (!lead.phone.trim()) return "Please enter your phone number.";
    if (!lead.checkin || !lead.checkout) return "Please select check-in and check-out dates.";
    if (lead.checkout <= lead.checkin) return "Check-out must be after check-in.";
    return "";
  }

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const error = validateLead();

    if (error) {
      setFeedback(error);
      return;
    }

    setFeedback("Opening your email app...");
    window.location.href = mailtoHref;
  }

  function handleWhatsAppClick() {
    const error = validateLead();

    if (error) {
      setFeedback(error);
      return;
    }

    setFeedback("Opening WhatsApp...");
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
                  <label htmlFor="contact-first-name">First name</label>
                  <input
                    id="contact-first-name"
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder="John"
                    value={lead.firstName}
                    onChange={(event) => updateLead("firstName", event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-last-name">Last name</label>
                  <input
                    id="contact-last-name"
                    type="text"
                    required
                    autoComplete="family-name"
                    placeholder="Smith"
                    value={lead.lastName}
                    onChange={(event) => updateLead("lastName", event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="mail@example.com"
                    value={lead.email}
                    onChange={(event) => updateLead("email", event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-phone">Phone number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+44..."
                    value={lead.phone}
                    onChange={(event) => updateLead("phone", event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-checkin">Check-in</label>
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
                  <label htmlFor="contact-checkout">Check-out</label>
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
                  <label htmlFor="contact-room">Room selection</label>
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
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us more about your stay..."
                    value={lead.message}
                    onChange={(event) => updateLead("message", event.target.value)}
                  />
                </div>
              </div>

              <div className="contact-actions">
                <button type="submit" className="contact-btn contact-btn--email">
                  ✉️ Send email
                </button>

                <button
                  type="button"
                  className="contact-btn contact-btn--whatsapp"
                  onClick={handleWhatsAppClick}
                >
                  💬 WhatsApp
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