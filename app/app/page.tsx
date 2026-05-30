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
            <div className="rating-card" aria-label="Guest rating 4.8 out of 5 from 143 reviews">
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
              <strong>rooms in Chios</strong>? <strong>Voulamandis House</strong> is an
              authentic accommodation choice in Kampos, with comfortable rooms, peaceful
              surroundings and excellent guest reviews.
            </p>

            <div className="hero-actions">
              <a className="btn-primary" href="/room-finder/">
                <span aria-hidden="true">✨</span> Find Room
              </a>

              <a className="btn-ghost" href="/chios-hotels-rates/">
                <span aria-hidden="true">🔥</span> Book now
              </a>
            </div>

            <a className="hero-quiz-card" href="/chios-holidays-quiz/">
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

      <a href="#rooms" className="vh-hero-announce">
        <span aria-hidden="true">🔥</span>
        <span>
          Traveling to Chios this week? <strong>See available accommodation deals.</strong>
        </span>
        <span aria-hidden="true">↓</span>
      </a>

      <section className="vh-section vh-section--tight" id="rooms">
        <div className="vh-wrap">
          <div className="vh-section-head" style={{ textAlign: "center" }}>
            <span className="vh-kicker">Rooms & accommodation in Chios</span>
            <h2 className="vh-title">Rooms in Chios for couples and families</h2>
            <p className="vh-subtitle" style={{ margin: "0 auto" }}>
              Our rooms are cleaned daily and designed for a comfortable, peaceful and quality stay.
            </p>
          </div>

          <div className="vh-room-grid">
            <a className="vh-room-card" href="/chios-rooms/economy-double-rooms/">
              <div className="vh-room-image vh-room-image--economy" aria-hidden="true">
                <div className="room-offer-stack">
                  <span className="room-live-badge">LIVE</span>
                  <span className="room-direct-badge">🎁 -10% Discount</span>
                </div>
                <span className="room-bed-badge">🛏️ 1 double or 2 singles</span>
              </div>

              <div className="vh-room-body">
                <h3>Economy Double</h3>
                <p>Ideal for two guests who want a well-kept stay in Kampos, Chios.</p>

                <div className="vh-room-meta">
                  <span>👥 2 guests</span>
                  <span>Economy</span>
                  <span>🍊 Kampos</span>
                </div>

                <div className="vh-room-amenities">
                  <span>❄️ A/C</span>
                  <span>📶 Wi-Fi</span>
                  <span>☕ Coffee</span>
                  <span>🧊 Fridge</span>
                </div>

                <span className="vh-btn vh-btn--secondary">🔎 View room</span>
              </div>
            </a>

            <a className="vh-room-card" href="/chios-rooms/standard-double-room/">
              <div className="vh-room-image vh-room-image--ground" aria-hidden="true">
                <div className="room-offer-stack">
                  <span className="room-live-badge">LIVE</span>
                  <span className="room-direct-badge">🎁 -10% Discount</span>
                </div>
                <span className="room-bed-badge">🛏️ Double + extra</span>
              </div>

              <div className="vh-room-body">
                <h3>Ground Floor Double & Triple</h3>
                <p>A comfortable choice for couples or small families with easy access.</p>

                <div className="vh-room-meta">
                  <span>👤 ×2-3</span>
                  <span>🌿 Ground</span>
                  <span>Easy</span>
                </div>

                <div className="vh-room-amenities">
                  <span>❄️ A/C</span>
                  <span>📶 Wi-Fi</span>
                  <span>☕ Coffee</span>
                  <span>🧊 Fridge</span>
                </div>

                <span className="vh-btn vh-btn--secondary">🔎 View room</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
