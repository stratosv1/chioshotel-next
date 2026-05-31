"use client";

import { useState } from "react";

const mainLinks = [
  {
    label: "Rooms",
    href: "/chios-rooms/",
  },
  {
    label: "Rates",
    href: "/chios-hotels-rates/",
  },
  {
    label: "Chios Island",
    href: "/chios-island/",
  },
  {
    label: "Beaches",
    href: "/chios/chios-beaches/",
  },
  {
    label: "Villages",
    href: "/chios/chios-villages/",
  },
  {
    label: "Museums",
    href: "/chios/chios-museums/",
  },
  {
    label: "Contact",
    href: "/voulamandis-house-contact-us-form-fill-in-the-form/",
  },
];

const exploreLinks = [
  {
    title: "Chios Beaches",
    text: "Crystal waters, volcanic coves and family-friendly shores.",
    href: "/chios/chios-beaches/",
  },
  {
    title: "Chios Villages",
    text: "Mastic villages, medieval alleys and local life.",
    href: "/chios/chios-villages/",
  },
  {
    title: "Chios Museums",
    text: "Mastic culture, history, books and maritime heritage.",
    href: "/chios/chios-museums/",
  },
];

export function VoulamandisHeader() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="vh-header">
      <div className="vh-header__inner">
        <a className="vh-header__brand" href="/" onClick={closeMenu}>
          <span className="vh-header__logo-mark">VH</span>

          <span className="vh-header__brand-text">
            <strong>Voulamandis House</strong>
            <small>Kampos, Chios</small>
          </span>
        </a>

        <nav className="vh-header__nav" aria-label="Main navigation">
          {mainLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="vh-header__actions">
          <a className="vh-header__book" href="/chios-hotels-rates/">
            Book Now
          </a>

          <button
            className={`vh-header__burger ${isOpen ? "is-open" : ""}`}
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`vh-mobile-menu ${isOpen ? "is-open" : ""}`}>
        <button
          className="vh-mobile-menu__backdrop"
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
        />

        <div className="vh-mobile-menu__panel">
          <div className="vh-mobile-menu__head">
            <div>
              <span>Menu</span>
              <h2>Explore Voulamandis House</h2>
            </div>

            <button type="button" onClick={closeMenu} aria-label="Close menu">
              ×
            </button>
          </div>

          <a
            className="vh-mobile-menu__primary"
            href="/chios-hotels-rates/"
            onClick={closeMenu}
          >
            Book your stay
          </a>

          <div className="vh-mobile-menu__section">
            <span className="vh-mobile-menu__label">Stay</span>

            <div className="vh-mobile-menu__links">
              <a href="/chios-rooms/" onClick={closeMenu}>
                Rooms
              </a>

              <a href="/chios-hotels-rates/" onClick={closeMenu}>
                Rates & Availability
              </a>

              <a
                href="/voulamandis-house-contact-us-form-fill-in-the-form/"
                onClick={closeMenu}
              >
                Contact
              </a>
            </div>
          </div>

          <div className="vh-mobile-menu__section">
            <span className="vh-mobile-menu__label">Explore Chios</span>

            <div className="vh-mobile-menu__cards">
              {exploreLinks.map((link) => (
                <a href={link.href} key={link.href} onClick={closeMenu}>
                  <strong>{link.title}</strong>
                  <small>{link.text}</small>
                </a>
              ))}
            </div>
          </div>

          <div className="vh-mobile-menu__footer">
            <a
              href="https://wa.me/306944474226"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>

            <a href="/chios-island/" onClick={closeMenu}>
              Chios Island Guide
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}