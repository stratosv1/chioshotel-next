const lang = "el";
export default function HomePage() {
  return (
    <main className="vh-homepage">
      <section className="hero" aria-label="Rooms and apartments in Chios, Kampos">
        <div className="hero-media" aria-hidden="true">
          <img
            src="https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp"
            alt="Chios Hotels and Apartments in Kampos - Voulamandis House"
            width="1200"
            height="675"
          />
        </div>

        <div className="hero-inner">
          <div className="hero-content-box">
            <div
              className="rating-card"
              aria-label="Guest rating 4.8 out of 5 from 143 reviews"
            >
              <div>
                <strong>4.8 / 5</strong>
                <span>143 reviews</span>
              </div>
              <div className="stars" aria-hidden="true">
                ★★★★★
              </div>
            </div>

            <div className="hero-kicker">KAMPOS CHIOS • VOULAMANDIS HOUSE</div>

            <h1 className="hero-title">Chios Hotels and Apartments in Kambos</h1>

            <p className="hero-description">
              Looking for <strong>hotels in Chios</strong> or{" "}
              <strong>rooms in Chios</strong>?{" "}
              <strong>Voulamandis House</strong> is an authentic accommodation
              choice in Kampos, with comfortable rooms, peaceful surroundings and
              excellent guest reviews.
            </p>

            <div className="hero-actions">
              <a
                className="btn-primary"
                href="https://chioshotel.gr/room-finder/"
              >
                <span aria-hidden="true">✨</span> Find Room
              </a>

              <a
                className="btn-ghost"
                href="https://chioshotel.gr/chios-hotels-rates/"
              >
                <span aria-hidden="true">🔥</span> Book now
              </a>
            </div>

            <a
              className="hero-quiz-card"
              href="https://chioshotel.gr/chios-holidays-quiz/"
            >
              <span className="hero-quiz-icon" aria-hidden="true">
                🧭
              </span>

              <span className="hero-quiz-copy">
                <span className="hero-quiz-live">LIVE discount code</span>
                <strong>Discover Chios</strong>
                <span>Learn the island’s secrets and get a code for your stay.</span>
              </span>

              <span className="hero-quiz-link">Start →</span>
            </a>
          </div>
        </div>
      </section>

      <a href="#vh-lastminute-title" className="vh-hero-announce">
        <span aria-hidden="true">🔥</span>
        <span>
          Traveling to Chios this week?{" "}
          <strong>See available accommodation deals.</strong>
        </span>
        <span aria-hidden="true">↓</span>
      </a>

      <section className="vh-section vh-section--tight" aria-labelledby="vh-intro-title">
        <div className="vh-wrap">
          <div className="vh-intro-grid">
            <article className="vh-panel">
              <span className="vh-kicker">
                Authentic hospitality in Kampos, Chios
              </span>

              <h2 id="vh-intro-title">
                <span aria-hidden="true">🏡</span> Stay in Chios at Voulamandis House
              </h2>

              <p>
                Looking for <strong>rooms in Chios</strong> or{" "}
                <strong>Chios accommodation</strong> for a peaceful and well-kept
                stay? Voulamandis House welcomes you to the historic Kampos area
                of Chios, offering an authentic hospitality experience in a setting
                of natural beauty. If you are searching for{" "}
                <strong>hotels in Chios</strong> but prefer something more personal,
                our property is a warm alternative.
              </p>

              <div className="vh-pill-row" aria-label="Key features">
                <span className="vh-pill">🌴 Holidays in Chios</span>
                <span className="vh-pill">🍊 Kampos Chios</span>
                <span className="vh-pill">🛏️ Comfortable rooms</span>
                <span className="vh-pill">💎 Value for money</span>
              </div>
            </article>

            <article className="vh-panel">
              <span className="vh-kicker">What makes Voulamandis House special</span>

              <h3>
                Six reasons that make your stay more comfortable, personal and
                authentic
              </h3>

              <div className="vh-unique-grid">
                <div className="vh-unique-card">
                  <strong>🥐 Homemade breakfast</strong>
                  <span>Breakfast in the garden with products from the farm.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>🌿 Courtyard & calm</strong>
                  <span>Quiet atmosphere, garden and authentic Kampos feeling.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>🧭 Room Wizard</strong>
                  <span>Help to find the room that best suits your trip.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>📍 Practical location</strong>
                  <span>Close to town, airport, port and beaches.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>🛎️ -10% Direct booking</strong>
                  <span>Direct contact with the property and clear availability.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>🍊 Chios secrets</strong>
                  <span>Suggestions for beaches, villages and island routes.</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="vh-section vh-section--tight" aria-labelledby="vh-rooms-title">
        <div className="vh-wrap">
          <div className="vh-split-highlight">
            <article className="vh-highlight-card">
              <span className="vh-kicker">Rooms & accommodation in Chios</span>

              <h2 className="vh-title" id="vh-rooms-title">
                <span aria-hidden="true">🛏️</span> Rooms in Chios for couples and
                families
              </h2>

              <p>
                Our rooms are cleaned daily and designed for a comfortable,
                peaceful and quality stay in Kampos, Chios.
              </p>

              <div className="vh-btn-row">
                <a className="vh-btn vh-btn--primary" href="https://chioshotel.gr/room-finder/">
                  <span aria-hidden="true">✨</span> Room Wizard
                </a>

                <a className="vh-btn vh-btn--secondary" href="https://chioshotel.gr/chios-rooms/">
                  <span aria-hidden="true">🗂️</span> All rooms
                </a>
              </div>
            </article>

            <article className="vh-highlight-card">
              <span className="vh-kicker">Rooms in Chios</span>
              <h3>From budget stays to family solutions</h3>
              <p>
                If you are looking for hotels in Chios but prefer more personal
                hospitality, Voulamandis House offers an authentic alternative in
                Kampos.
              </p>
            </article>
          </div>

          <div className="vh-room-grid">
            <RoomCard
              href="https://chioshotel.gr/chios-rooms/economy-double-rooms/"
              imageClass="vh-room-image--economy"
              bed="🛏️ 1 double or 2 singles"
              title="Economy Double"
              text="Ideal for two guests who want a well-kept stay in Kampos, Chios."
              meta={["👥 2 guests", "Economy", "🍊 Kampos"]}
              button="View room"
            />

            <RoomCard
              href="https://chioshotel.gr/chios-rooms/standard-double-room/"
              imageClass="vh-room-image--ground"
              bed="🛏️ Double + extra"
              title="Ground Floor Double & Triple"
              text="A comfortable choice for couples or small families with easy access."
              meta={["👤 ×2-3", "🌿 Ground", "Easy"]}
              button="View room"
            />

            <RoomCard
              href="https://chioshotel.gr/chios-rooms/standard-double-room/"
              imageClass="vh-room-image--upper"
              bed="🛏️ Double + extra"
              title="Upper Floor Double & Triple"
              text="A choice for guests looking for a quieter atmosphere and classic hospitality."
              meta={["👤 ×2-3", "🏛️ Upper", "Quiet"]}
              button="View room"
            />

            <RoomCard
              href="https://chioshotel.gr/chios-rooms/family-chios-apartments/"
              imageClass="vh-room-image--family"
              bed="🛏️ Family beds"
              title="Family Apartment"
              text="Ideal for families or small groups who need more space."
              meta={["👤 ×4", "Space", "🏡 Apt"]}
              button="View apartment"
            />
          </div>
        </div>
      </section>

      <section className="vh-section vh-section--tight" aria-labelledby="vh-amenities-title">
        <div className="vh-wrap">
          <header className="vh-section-head">
            <span className="vh-kicker">Accommodation amenities</span>
            <h2 className="vh-title" id="vh-amenities-title">
              <span aria-hidden="true">🛋️</span> Everything you need for a comfortable stay
            </h2>
          </header>

          <div className="vh-amenities-grid">
            {[
              "📶 Wi-Fi / Internet",
              "❄️ Air Conditioning",
              "🔥 Heating",
              "📺 TV",
              "🧊 Fridge",
              "☕ Coffee / Tea",
              "🧼 Daily housekeeping",
              "🌿 Garden & seating",
              "🍖 BBQ area",
              "🚗 Parking",
              "🚕 Transfer options",
              "🏡 Authentic hospitality",
            ].map((item) => (
              <div className="vh-amenity" key={item}>
                <div className="vh-amenity-icon">{item.split(" ")[0]}</div>
                <span>{item.replace(item.split(" ")[0] + " ", "")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vh-final" aria-labelledby="vh-final-title">
        <div className="vh-wrap">
          <div className="vh-final-shell">
            <span className="vh-kicker">Book your stay</span>

            <h2 id="vh-final-title">
              <span aria-hidden="true">✈️</span> Your trip to Chios starts here
            </h2>

            <p>
              Warm hospitality, authentic atmosphere and an ideal location in Kampos.
            </p>

            <div className="vh-btn-row">
              <a className="vh-btn vh-btn--primary" href="https://chioshotel.gr/chios-hotels-rates/">
                <span aria-hidden="true">🛎️</span> Book Direct
              </a>

              <a
                className="vh-btn vh-btn--secondary"
                href="https://chioshotel.gr/voulamandis-house-contact-us-form-fill-in-the-form/"
              >
                <span aria-hidden="true">✉️</span> Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="vh-mobile-sticky" aria-label="Quick communication actions">
        <div className="vh-mobile-sticky__inner">
          <a className="vh-btn vh-btn--secondary" href="tel:+306944764654">
            📞 CALL
          </a>

          <a className="vh-btn vh-btn--primary" href="viber://chat?number=%2B306944474226">
            💬 VIBER
          </a>
        </div>
      </div>
    </main>
  );
}

function RoomCard({
  href,
  imageClass,
  bed,
  title,
  text,
  meta,
  button,
}: {
  href: string;
  imageClass: string;
  bed: string;
  title: string;
  text: string;
  meta: string[];
  button: string;
}) {
  return (
    <a className="vh-room-card" href={href}>
      <div className={`vh-room-image ${imageClass}`} aria-hidden="true">
        <div className="room-offer-stack">
          <span className="room-live-badge">LIVE</span>
          <span className="room-direct-badge">🎁 -10% Discount</span>
        </div>
        <span className="room-bed-badge">{bed}</span>
      </div>

      <div className="vh-room-body">
        <h3>{title}</h3>
        <p>{text}</p>

        <div className="vh-room-meta">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="vh-room-amenities">
          <span>❄️ A/C</span>
          <span>📶 Wi-Fi</span>
          <span>☕ Coffee</span>
          <span>🧊 Fridge</span>
        </div>

        <span className="vh-btn vh-btn--secondary">
          <span aria-hidden="true">🔎</span> {button}
        </span>
      </div>
    </a>
  );
}
