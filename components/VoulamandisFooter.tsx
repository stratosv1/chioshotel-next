const footerGroups = [
  {
    title: "Stay",
    links: [
      {
        label: "Rooms",
        href: "/chios-rooms/",
      },
      {
        label: "Rates & Availability",
        href: "/chios-hotels-rates/",
      },
      {
        label: "Contact",
        href: "/voulamandis-house-contact-us-form-fill-in-the-form/",
      },
    ],
  },
  {
    title: "Explore Chios",
    links: [
      {
        label: "Chios Island Guide",
        href: "/chios-island/",
      },
      {
        label: "Chios Beaches",
        href: "/chios/chios-beaches/",
      },
      {
        label: "Chios Villages",
        href: "/chios/chios-villages/",
      },
      {
        label: "Chios Museums",
        href: "/chios/chios-museums/",
      },
      {
        label: "Chios Holiday Quiz",
        href: "/chios-holidays-quiz/",
      },
    ],
  },
  {
    title: "Popular Guides",
    links: [
      {
        label: "Agia Dynami Beach",
        href: "/chios/chios-beaches/agia-dynami-beach-chios/",
      },
      {
        label: "Mavra Volia Beach",
        href: "/chios/chios-beaches/emporios-beach/",
      },
      {
        label: "Pyrgi Village",
        href: "/chios/chios-villages/chios-pyrgi/",
      },
      {
        label: "Mesta Village",
        href: "/chios/chios-villages/mesta-chios/",
      },
      {
        label: "Chios Mastic Museum",
        href: "/chios/chios-museums/the-mastic-museum-chios/",
      },
    ],
  },
];

export function VoulamandisFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="vh-footer">
      <div className="vh-footer__inner">
        <section className="vh-footer__brand">
          <a className="vh-footer__logo" href="/">
            <span>VH</span>
            <div>
              <strong>Voulamandis House</strong>
              <small>Kampos, Chios</small>
            </div>
          </a>

          <p>
            Quiet rooms and apartments in the historic Kampos area of Chios,
            with easy access to Chios Town, the airport, beaches, villages and
            cultural landmarks.
          </p>

          <div className="vh-footer__cta-row">
            <a className="vh-footer__primary" href="/chios-hotels-rates/">
              Book your stay
            </a>

            <a
              className="vh-footer__secondary"
              href="https://wa.me/306944474226"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>
          </div>
        </section>

        <nav className="vh-footer__nav" aria-label="Footer navigation">
          {footerGroups.map((group) => (
            <div className="vh-footer__group" key={group.title}>
              <h2>{group.title}</h2>

              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="vh-footer__bottom">
        <p>© {year} Voulamandis House. All rights reserved.</p>

        <div>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="/robots.txt">Robots</a>
        </div>
      </div>
    </footer>
  );
}