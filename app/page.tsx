const ROOM_IMAGES = {
  economy: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07803-1.webp",
  ground: "https://chioshotel.gr/wp-content/uploads/2022/12/double-triple-room.jpg",
  upper: "https://chioshotel.gr/wp-content/uploads/2022/12/DSC07867-1.webp",
  family: "https://chioshotel.gr/wp-content/uploads/2022/12/chios-hotels-family-apartments.webp",
};

export default function HomePage() {
  return (
    <main className="vh-homepage">
      <section className="hero" aria-label="Δωμάτια και διαμερίσματα στη Χίο, Κάμπος">
        <div className="hero-media" aria-hidden="true">
          <img
            src="https://chioshotel.gr/wp-content/uploads/2026/03/chios.hotels.voulamandis.house_.hero_.image_.webp"
            alt="Ξενοδοχείο και διαμερίσματα στη Χίο - Voulamandis House"
            width="1200"
            height="675"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="hero-inner">
          <div className="hero-content-box">
            <div className="rating-card" aria-label="Αξιολόγηση επισκεπτών 4.8 στα 5 από 143 κριτικές">
              <div>
                <strong>4.8 / 5</strong>
                <span>143 κριτικές</span>
              </div>
              <div className="stars" aria-hidden="true">★★★★★</div>
            </div>

            <div className="hero-kicker">ΚΑΜΠΟΣ ΧΙΟΥ • VOULAMANDIS HOUSE</div>

            <h1 className="hero-title">Ξενοδοχείο και διαμερίσματα στη Χίο</h1>

            <p className="hero-description">
              Αναζητάτε <strong>ξενοδοχείο στη Χίο</strong> ή{" "}
              <strong>δωμάτια στη Χίο</strong>; Το{" "}
              <strong>Voulamandis House</strong> είναι μια αυθεντική επιλογή
              διαμονής στον Κάμπο, με άνετα δωμάτια, ήσυχο περιβάλλον και
              εξαιρετικές κριτικές επισκεπτών.
            </p>

            <div className="hero-actions">
              <a className="btn-primary" href="https://chioshotel.gr/room-finder/">
                <span aria-hidden="true">✨</span> Βρες δωμάτιο
              </a>

              <a className="btn-ghost" href="https://chioshotel.gr/chios-hotels-rates/">
                <span aria-hidden="true">🔥</span> Κράτηση τώρα
              </a>
            </div>

            <a className="hero-quiz-card" href="https://chioshotel.gr/chios-holidays-quiz/">
              <span className="hero-quiz-icon" aria-hidden="true">🧭</span>

              <span className="hero-quiz-copy">
                <span className="hero-quiz-live">LIVE εκπτωτικός κωδικός</span>
                <strong>Ανακαλύψτε τη Χίο</strong>
                <span>
                  Μάθετε τα μυστικά του νησιού και πάρτε κωδικό έκπτωσης για τη
                  διαμονή σας.
                </span>
              </span>

              <span className="hero-quiz-link">Έναρξη →</span>
            </a>
          </div>
        </div>
      </section>

      <a href="#vh-lastminute-title" className="vh-hero-announce">
        <span aria-hidden="true">🔥</span>
        <span>
          Ταξιδεύετε στη Χίο αυτή την εβδομάδα;{" "}
          <strong>Δείτε διαθέσιμες προσφορές διαμονής.</strong>
        </span>
        <span aria-hidden="true">↓</span>
      </a>

      <section className="vh-section vh-section--tight" aria-labelledby="vh-intro-title">
        <div className="vh-wrap">
          <div className="vh-intro-grid">
            <article className="vh-panel">
              <span className="vh-kicker">Αυθεντική φιλοξενία στον Κάμπο της Χίου</span>

              <h2 id="vh-intro-title">
                <span aria-hidden="true">🏡</span> Διαμονή στη Χίο στο Voulamandis House
              </h2>

              <p>
                Αναζητάτε <strong>δωμάτια στη Χίο</strong> ή{" "}
                <strong>διαμονή στη Χίο</strong> για ήρεμες και προσεγμένες
                διακοπές; Το Voulamandis House σας υποδέχεται στον ιστορικό
                Κάμπο της Χίου, προσφέροντας μια αυθεντική εμπειρία φιλοξενίας
                μέσα σε ένα όμορφο και φυσικό περιβάλλον.
              </p>

              <div className="vh-pill-row" aria-label="Βασικά χαρακτηριστικά">
                <span className="vh-pill">🌴 Διακοπές στη Χίο</span>
                <span className="vh-pill">🍊 Κάμπος Χίου</span>
                <span className="vh-pill">🛏️ Άνετα δωμάτια</span>
                <span className="vh-pill">💎 Value for money</span>
              </div>
            </article>

            <article className="vh-panel">
              <span className="vh-kicker">Τι κάνει το Voulamandis House ξεχωριστό</span>

              <h3>Έξι λόγοι που κάνουν τη διαμονή σας πιο άνετη και αυθεντική</h3>

              <div className="vh-unique-grid">
                <div className="vh-unique-card">
                  <strong>🥐 Σπιτικό πρωινό</strong>
                  <span>Πρωινό στον κήπο με προϊόντα από το αγρόκτημα.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>🌿 Αυλή & ηρεμία</strong>
                  <span>Ήσυχη ατμόσφαιρα, κήπος και αυθεντική αίσθηση Κάμπου.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>🧭 Room Wizard</strong>
                  <span>Βοήθεια για να βρείτε το δωμάτιο που ταιριάζει στο ταξίδι σας.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>📍 Πρακτική τοποθεσία</strong>
                  <span>Κοντά σε πόλη, αεροδρόμιο, λιμάνι και παραλίες.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>🛎️ -10% απευθείας κράτηση</strong>
                  <span>Άμεση επικοινωνία με το κατάλυμα και καθαρή διαθεσιμότητα.</span>
                </div>

                <div className="vh-unique-card">
                  <strong>🍊 Μυστικά της Χίου</strong>
                  <span>Προτάσεις για παραλίες, χωριά και αυθεντικές διαδρομές.</span>
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
              <span className="vh-kicker">Δωμάτια & διαμονή στη Χίο</span>

              <h2 className="vh-title" id="vh-rooms-title">
                <span aria-hidden="true">🛏️</span> Δωμάτια στη Χίο για ζευγάρια και οικογένειες
              </h2>

              <p>
                Τα δωμάτιά μας καθαρίζονται καθημερινά και είναι σχεδιασμένα για
                άνετη, ήρεμη και ποιοτική διαμονή στον Κάμπο της Χίου.
              </p>

              <div className="vh-btn-row">
                <a className="vh-btn vh-btn--primary" href="https://chioshotel.gr/room-finder/">
                  <span aria-hidden="true">✨</span> Room Wizard
                </a>

                <a className="vh-btn vh-btn--secondary" href="https://chioshotel.gr/chios-rooms/">
                  <span aria-hidden="true">🗂️</span> Όλα τα δωμάτια
                </a>
              </div>
            </article>

            <article className="vh-highlight-card">
              <span className="vh-kicker">Δωμάτια στη Χίο</span>
              <h3>Από οικονομική διαμονή μέχρι οικογενειακές λύσεις</h3>
              <p>
                Αν ψάχνετε ξενοδοχείο στη Χίο αλλά προτιμάτε πιο προσωπική
                φιλοξενία, το Voulamandis House είναι μια αυθεντική εναλλακτική
                στον Κάμπο.
              </p>
            </article>
          </div>

          <div className="vh-room-grid">
            <RoomCard
              href="https://chioshotel.gr/chios-rooms/economy-double-rooms/"
              image={ROOM_IMAGES.economy}
              bed="🛏️ 1 διπλό ή 2 μονά"
              title="Economy Double"
              text="Ιδανικό για δύο επισκέπτες που θέλουν προσεγμένη διαμονή στον Κάμπο της Χίου."
              meta={["👥 2 άτομα", "Economy", "🍊 Κάμπος"]}
              button="Δείτε δωμάτιο"
            />

            <RoomCard
              href="https://chioshotel.gr/chios-rooms/standard-double-room/"
              image={ROOM_IMAGES.ground}
              bed="🛏️ Διπλό + έξτρα"
              title="Ground Floor Double & Triple"
              text="Άνετη επιλογή για ζευγάρια ή μικρές οικογένειες με εύκολη πρόσβαση."
              meta={["👤 ×2-3", "🌿 Ισόγειο", "Εύκολο"]}
              button="Δείτε δωμάτιο"
            />

            <RoomCard
              href="https://chioshotel.gr/chios-rooms/standard-double-room/"
              image={ROOM_IMAGES.upper}
              bed="🛏️ Διπλό + έξτρα"
              title="Upper Floor Double & Triple"
              text="Επιλογή για επισκέπτες που θέλουν πιο ήσυχη ατμόσφαιρα και κλασική φιλοξενία."
              meta={["👤 ×2-3", "🏛️ Όροφος", "Ήσυχο"]}
              button="Δείτε δωμάτιο"
            />

            <RoomCard
              href="https://chioshotel.gr/chios-rooms/family-chios-apartments/"
              image={ROOM_IMAGES.family}
              bed="🛏️ Οικογενειακά κρεβάτια"
              title="Family Apartment"
              text="Ιδανικό για οικογένειες ή μικρές παρέες που χρειάζονται περισσότερο χώρο."
              meta={["👤 ×4", "Άνεση", "🏡 Apt"]}
              button="Δείτε διαμέρισμα"
            />
          </div>
        </div>
      </section>

      <section className="vh-section vh-section--tight" aria-labelledby="vh-amenities-title">
        <div className="vh-wrap">
          <header className="vh-section-head">
            <span className="vh-kicker">Παροχές διαμονής</span>
            <h2 className="vh-title" id="vh-amenities-title">
              <span aria-hidden="true">🛋️</span> Όλα όσα χρειάζεστε για μια άνετη διαμονή
            </h2>
          </header>

          <div className="vh-amenities-grid">
            {[
              "📶 Wi-Fi / Internet",
              "❄️ Κλιματισμός",
              "🔥 Θέρμανση",
              "📺 Τηλεόραση",
              "🧊 Ψυγείο",
              "☕ Καφές / Τσάι",
              "🧼 Καθημερινή καθαριότητα",
              "🌿 Κήπος & καθιστικό",
              "🍖 BBQ",
              "🚗 Parking",
              "🚕 Επιλογές μεταφοράς",
              "🏡 Αυθεντική φιλοξενία",
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
            <span className="vh-kicker">Κλείστε τη διαμονή σας</span>

            <h2 id="vh-final-title">
              <span aria-hidden="true">✈️</span> Το ταξίδι σας στη Χίο ξεκινά εδώ
            </h2>

            <p>
              Ζεστή φιλοξενία, αυθεντική ατμόσφαιρα και ιδανική τοποθεσία στον Κάμπο.
            </p>

            <div className="vh-btn-row">
              <a className="vh-btn vh-btn--primary" href="https://chioshotel.gr/chios-hotels-rates/">
                <span aria-hidden="true">🛎️</span> Άμεση κράτηση
              </a>

              <a
                className="vh-btn vh-btn--secondary"
                href="https://chioshotel.gr/voulamandis-house-contact-us-form-fill-in-the-form/"
              >
                <span aria-hidden="true">✉️</span> Επικοινωνία
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="vh-mobile-sticky" aria-label="Γρήγορη επικοινωνία">
        <div className="vh-mobile-sticky__inner">
          <a className="vh-btn vh-btn--secondary" href="tel:+306944764654">
            📞 ΚΛΗΣΗ
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
  image,
  bed,
  title,
  text,
  meta,
  button,
}: {
  href: string;
  image: string;
  bed: string;
  title: string;
  text: string;
  meta: string[];
  button: string;
}) {
  return (
    <a className="vh-room-card" href={href}>
      <div className="vh-room-image" aria-hidden="true">
        <img
          src={image}
          alt=""
          width="600"
          height="450"
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div className="room-offer-stack">
          <span className="room-live-badge">LIVE</span>
          <span className="room-direct-badge">🎁 -10% Έκπτωση</span>
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
          <span>☕ Καφές</span>
          <span>🧊 Ψυγείο</span>
        </div>

        <span className="vh-btn vh-btn--secondary">
          <span aria-hidden="true">🔎</span> {button}
        </span>
      </div>
    </a>
  );
}
