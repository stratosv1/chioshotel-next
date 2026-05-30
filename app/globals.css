:root {
  --vh-bg: #f6f0e8;
  --vh-bg-soft: #fbf7f2;
  --vh-surface: #fffdfa;
  --vh-surface-2: #f3eadf;
  --vh-text: #2f261f;
  --vh-muted: #574b3f;
  --vh-line: #e7d8c7;
  --vh-accent: #9a6b3f;
  --vh-accent-dark: #8e6607;
  --vh-dark: #241c16;
  --vh-white: #fff;
  --vh-shadow: 0 12px 34px rgba(47, 38, 31, 0.08);
  --vh-shadow-strong: 0 18px 48px rgba(47, 38, 31, 0.14);
  --vh-radius-xxl: 34px;
  --vh-radius-xl: 26px;
  --vh-radius-lg: 20px;
  --vh-radius-md: 16px;
  --vh-container: 1240px;
  --transition: all 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --orange: #e67e22;
  --orange-dark: #d35400;
  --green: #22c55e;
  --green-dark: #15803d;
  --viber: #7360f2;
  --viber-dark: #5f4fd8;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  margin: 0;
  background: linear-gradient(180deg, #faf6f0 0%, var(--vh-bg) 100%);
  color: var(--vh-text);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.5;
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

img,
iframe,
video {
  display: block;
  max-width: 100%;
  height: auto;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.vh-homepage {
  width: 100%;
  overflow-x: hidden;
}

.vh-wrap,
.lm-shell {
  width: min(var(--vh-container), calc(100% - 32px));
  margin: 0 auto;
}

.vh-section {
  position: relative;
  padding: 82px 0;
}

.vh-section--tight {
  padding: 64px 0;
}

.vh-section-head {
  margin-bottom: 28px;
}

.vh-kicker {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--vh-accent-dark) !important;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.vh-title {
  margin: 0 0 14px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(30px, 4vw, 54px);
  line-height: 1.05;
  color: var(--vh-accent-dark) !important;
  font-weight: 700 !important;
}

.vh-subtitle,
.vh-copy {
  margin: 0;
  color: var(--vh-muted);
  font-size: 16px;
  line-height: 1.8;
  max-width: 900px;
}

.vh-btn,
.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 54px;
  padding: 0 28px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
  text-decoration: none !important;
  white-space: nowrap;
  transition: var(--transition);
}

.vh-btn:hover,
.vh-btn:focus-visible,
.btn-primary:hover,
.btn-primary:focus-visible,
.btn-ghost:hover,
.btn-ghost:focus-visible {
  transform: translateY(-2px);
  outline: none;
}

.vh-btn--primary,
.btn-primary {
  background: linear-gradient(135deg, var(--vh-accent) 0%, var(--vh-accent-dark) 100%);
  color: #fff !important;
  box-shadow: 0 12px 28px rgba(142, 102, 7, 0.28);
}

.btn-primary {
  background: var(--orange);
  border-color: var(--orange);
  box-shadow: 0 8px 20px rgba(230, 126, 34, 0.32);
}

.btn-primary:hover {
  background: var(--orange-dark);
}

.vh-btn--secondary,
.btn-ghost {
  background: #fff;
  color: var(--vh-accent-dark) !important;
  border-color: rgba(142, 102, 7, 0.18);
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.42);
  color: #fff !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.vh-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.vh-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.vh-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 13px;
  border-radius: 999px;
  background: rgba(142, 102, 7, 0.08);
  border: 1px solid rgba(142, 102, 7, 0.13);
  color: #6a4b00 !important;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* HERO */

.hero {
  position: relative;
  min-height: 88vh;
  overflow: hidden;
  color: #fff !important;
  display: flex;
  align-items: flex-end;
  background: #111;
}

.hero-media,
.hero-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-media {
  z-index: 0;
}

.hero-media img {
  object-fit: cover;
  object-position: center;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.08) 0%,
    rgba(0, 0, 0, 0.12) 40%,
    rgba(0, 0, 0, 0.58) 100%
  );
}

.hero-inner {
  position: relative;
  z-index: 2;
  width: min(1280px, 92vw);
  min-height: 88vh;
  margin: 0 auto;
  padding: 58px 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.hero-content-box {
  width: 590px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 30px 28px;
  border-radius: 30px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.38));
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 28px 64px rgba(0, 0, 0, 0.32);
}

.rating-card {
  background: rgba(255, 255, 255, 0.94);
  color: #333;
  border-radius: 999px;
  padding: 9px 15px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.rating-card strong {
  display: block;
  font-size: 14px;
  font-weight: 900;
  color: #5d4037;
}

.rating-card span {
  font-size: 11px;
  color: #666;
  font-weight: 700;
}

.stars {
  color: #f1c40f;
  font-size: 13px;
  line-height: 1;
}

.hero-kicker {
  letter-spacing: 2px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  color: #fff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.hero-title {
  margin: 0;
  max-width: 16ch;
  color: #fff !important;
  font-size: clamp(38px, 3vw, 52px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  text-wrap: balance;
}

.hero-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.94) !important;
  font-size: 16px;
  line-height: 1.7;
}

.hero-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  margin-top: 4px;
}

.hero-quiz-card {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: #fff !important;
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.hero-quiz-card::after,
.discount-box::after,
.premium-btn-quiz::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 90%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.26), transparent);
  animation: shineMove 3.4s infinite;
}

.discount-box::after {
  animation-duration: 4.4s;
}

.premium-btn-quiz::after {
  animation-duration: 3.6s;
}

.hero-quiz-icon {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 22px;
  z-index: 1;
}

.hero-quiz-copy,
.hero-quiz-link {
  z-index: 1;
}

.hero-quiz-copy strong {
  display: block;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-quiz-copy span {
  display: block;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  line-height: 1.35;
}

.hero-quiz-live {
  display: inline-flex !important;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  color: #bbf7d0 !important;
  font-size: 10px !important;
  font-weight: 900 !important;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-quiz-live::before,
.discount-badge::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--green);
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.8);
  animation: pulseDot 1.35s infinite;
}

.hero-quiz-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fff;
  color: var(--vh-accent-dark) !important;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.vh-hero-announce {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 17px 22px;
  background: linear-gradient(135deg, var(--vh-accent-dark), #6a4b00);
  color: #fff !important;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
}

.vh-hero-announce-arrow {
  font-weight: 900;
  animation: bounceDown 2s infinite;
}

/* CARDS / PANELS */

.vh-panel,
.vh-highlight-card,
.vh-location-copy,
.vh-reviews-shell,
.b-card,
.vh-room-card,
.vh-link-card,
.vh-amenity {
  background: var(--vh-surface);
  border: 1px solid rgba(154, 107, 63, 0.1);
  box-shadow: var(--vh-shadow);
}

.vh-intro-grid,
.vh-split-highlight {
  display: grid;
  grid-template-columns: 1.02fr 0.98fr;
  gap: 24px;
  align-items: stretch;
}

.vh-split-highlight {
  grid-template-columns: 1.08fr 0.92fr;
  gap: 22px;
  margin-bottom: 24px;
}

.vh-panel,
.vh-highlight-card,
.vh-location-copy,
.vh-reviews-shell {
  border-radius: var(--vh-radius-xxl);
  padding: 34px;
}

.vh-panel {
  background: rgba(255, 253, 250, 0.86);
}

.vh-highlight-card,
.vh-reviews-shell {
  background: linear-gradient(180deg, #fffdfa 0%, #f7efe5 100%);
}

.vh-panel h2,
.vh-panel h3,
.vh-highlight-card h3 {
  margin: 0 0 12px;
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.1;
  color: var(--vh-accent-dark) !important;
  font-weight: 700 !important;
}

.vh-panel h2 {
  font-size: 40px;
}

.vh-panel h3 {
  font-size: 30px;
}

.vh-highlight-card h3 {
  font-size: 34px;
}

.vh-panel p,
.vh-highlight-card p,
.vh-location-copy p,
.vh-link-body p,
.vh-room-body p {
  margin: 0;
  color: var(--vh-muted);
  font-size: 16px;
  line-height: 1.8;
}

.vh-unique-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.vh-unique-card {
  min-height: 140px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffdfa 0%, #f7efe5 100%);
  border: 1px solid rgba(154, 107, 63, 0.1);
}

.vh-unique-card strong {
  display: block;
  margin-bottom: 8px;
  color: var(--vh-accent-dark) !important;
  font-size: 15px;
  font-weight: 700;
}

.vh-unique-card span {
  display: block;
  color: var(--vh-muted);
  font-size: 14px;
  line-height: 1.7;
}

/* LOCATION */

.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 18px;
  margin-top: 20px;
}

.b7 {
  grid-column: span 7;
}

.b5 {
  grid-column: span 5;
}

.b12 {
  grid-column: span 12;
}

.b-card {
  border-radius: var(--vh-radius-xl);
  overflow: hidden;
  transition: var(--transition);
}

.b-card:hover,
.vh-room-card:hover,
.vh-link-card:hover,
.vh-traveler-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--vh-shadow-strong);
}

.b-pad {
  padding: 30px;
}

.map-preview {
  height: 260px;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
  background-image:
    linear-gradient(to top, rgba(0, 0, 0, 0.36), rgba(0, 0, 0, 0.05)),
    url("https://chioshotel.gr/wp-content/uploads/2026/03/voulamandis.house_.google.maps_.webp");
  background-position: center;
  background-size: cover;
}

.map-iframe {
  width: 100%;
  height: 380px;
  border: 0;
  display: none;
}

.map-iframe.is-visible {
  display: block;
}

.distance-badge {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 18px;
  border-top: 1px solid rgba(154, 107, 63, 0.1);
  background: #fffdfa;
  text-align: center;
}

.distance-badge > div {
  padding: 14px 10px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(154, 107, 63, 0.1);
}

.distance-badge span {
  color: var(--vh-muted);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.distance-badge strong {
  display: block;
  margin-top: 4px;
  color: var(--vh-accent-dark) !important;
  font-family: Georgia, serif;
  font-size: 15px;
  font-weight: 700 !important;
}

.discount-box {
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #fffdfa, var(--vh-surface-2));
}

.discount-badge {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #a87842, var(--vh-accent-dark));
  color: #fff !important;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
  box-shadow: 0 10px 22px rgba(142, 102, 7, 0.18);
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.email-input {
  flex: 1;
  min-width: 220px;
  padding: 14px 18px;
  border-radius: 999px;
  border: 1px solid rgba(154, 107, 63, 0.2);
  outline: none;
  font-size: 15px;
}

.email-input:focus {
  border-color: var(--vh-accent);
}

.discount-success,
.discount-error {
  display: none;
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 800;
}

.discount-success {
  background: #fdfaf3;
  border: 1px solid var(--vh-accent-dark);
}

.discount-code-value {
  margin-top: 8px;
  color: var(--vh-accent-dark);
  font-size: 22px;
  word-break: break-word;
}

.discount-error {
  background: #fff4f4;
  border: 1px solid #d66;
  color: #a33;
  font-size: 14px;
}

.discount-consent {
  margin-top: 10px;
  color: var(--vh-dark);
  font-size: 12px;
}

.vh-check-list {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  color: var(--vh-dark);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.9;
}

/* ROOMS */

.vh-room-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.vh-room-card,
.vh-link-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: var(--vh-radius-xl);
  overflow: hidden;
  transition: var(--transition);
}

.vh-room-image,
.vh-link-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #e8ddcf;
}

.vh-link-image {
  aspect-ratio: 16 / 10;
}

.vh-room-image img,
.vh-link-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.room-offer-stack {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  z-index: 2;
}

.room-live-badge,
.room-direct-badge,
.room-bed-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
}

.room-live-badge {
  padding: 8px 12px;
  background: linear-gradient(135deg, var(--green), #16a34a);
  color: #fff;
}

.room-live-badge::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #bbf7d0;
  box-shadow: 0 0 0 0 rgba(187, 247, 208, 0.9);
  animation: pulseDotLight 1.35s infinite;
}

.room-direct-badge {
  margin-left: auto;
  padding: 7px 10px;
  background: rgba(240, 253, 244, 0.96);
  color: var(--green-dark);
}

.room-bed-badge {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 2;
  padding: 7px 10px;
  background: rgba(255, 255, 255, 0.94);
  color: #3d3530;
}

.vh-room-body,
.vh-link-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px;
}

.vh-room-body h3,
.vh-link-body h3 {
  margin: 0 0 10px;
  color: var(--vh-accent-dark) !important;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  line-height: 1.12;
  font-weight: 700 !important;
}

.vh-link-body h3 {
  font-size: 26px;
}

.vh-room-body p,
.vh-link-body p {
  margin-bottom: 18px;
  flex: 1;
  font-size: 15px;
  line-height: 1.75;
}

.vh-room-meta,
.vh-room-amenities {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.vh-room-meta {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.vh-room-amenities {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.vh-room-meta span,
.vh-room-amenities span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--vh-surface-2);
  border: 1px solid rgba(154, 107, 63, 0.1);
  color: var(--vh-accent-dark) !important;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vh-room-amenities span {
  background: #fff;
  color: #3d3530 !important;
  font-size: 10.5px;
  letter-spacing: 0;
  text-transform: none;
}

/* LAST MINUTE */

.lm-widget {
  width: 100%;
  max-width: 100%;
  color: var(--vh-text);
  font-family: Arial, Helvetica, sans-serif;
}

.lm-panel {
  padding: 14px;
  border: 1px solid #eadfd3;
  border-radius: 24px;
  background: linear-gradient(180deg, #fffdfa 0%, #fbf6f0 100%);
  box-shadow: 0 10px 28px rgba(61, 53, 48, 0.06);
}

#deals-app {
  max-width: 100%;
  margin: auto;
}

.rb-hero,
.rb-search-card,
.rb-results-wrap {
  background: #fff;
  border: 1px solid #eae3dc;
  border-radius: 20px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.05);
}

.rb-hero {
  margin-bottom: 12px;
  padding: 16px 18px;
  background: linear-gradient(145deg, #fff, #fff8f2);
  border-color: rgba(212, 163, 115, 0.35);
}

.rb-hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.rb-hero-head {
  flex: 1 1 580px;
  min-width: 280px;
}

.rb-hero-actions {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rb-hero-timer {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ecd8c2;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff8f0 0%, #fffdf9 100%);
  box-shadow: 0 8px 20px rgba(142, 102, 7, 0.06);
}

.rb-hero-timer-label {
  margin: 0 0 6px;
  color: #7b6656;
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
}

.rb-hero-timer-value {
  margin: 0;
  color: var(--vh-accent-dark);
  font-size: 1.7rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-align: center;
}

.rb-title {
  margin: 0 0 6px;
  color: var(--vh-accent-dark) !important;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.6rem;
  font-weight: 900;
  line-height: 1.12;
}

.rb-subtitle {
  margin: 0;
  max-width: 1050px;
  color: #6f645b;
  font-size: 0.96rem;
  line-height: 1.6;
}

.rb-trust-line {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #fff8e8;
  border: 1px solid #efdfaa;
  color: #8f6d08;
  font-size: 0.82rem;
  font-weight: 800;
}

.rb-search-card,
.rb-results-wrap {
  padding: 16px;
  margin-bottom: 12px;
}

.rb-section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.rb-section-head h2,
.rb-section-head h3 {
  margin: 0 0 4px;
  color: var(--vh-accent-dark) !important;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.15rem;
  font-weight: 900;
}

.rb-section-head p {
  margin: 0;
  color: #6f645b;
  font-size: 0.88rem;
  line-height: 1.45;
}

.rb-guest-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.rb-guest-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  min-width: 0;
  padding: 10px;
  border: 2px solid #eae3dc;
  border-radius: 13px;
  background: #fff;
  color: #3d3530;
  font-size: 0.88rem;
  font-weight: 900;
  white-space: nowrap;
  transition: 0.2s ease;
}

.rb-guest-btn.is-active {
  background: linear-gradient(135deg, var(--vh-accent-dark), #6a4b00);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 8px 18px rgba(156, 102, 68, 0.22);
}

.rb-helper {
  margin-top: 8px;
  color: #6f645b;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.45;
}

.rb-loading {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff8f2;
  border: 1px solid rgba(212, 163, 115, 0.35);
  color: var(--vh-accent-dark);
  font-size: 0.84rem;
  font-weight: 800;
}

.rb-results-wrap {
  display: none;
}

.rb-results-wrap.is-visible {
  display: block;
}

.rb-results-meta {
  margin-top: 4px;
  color: #6f645b;
  font-size: 0.84rem;
  font-weight: 700;
}

.rb-filter-row {
  display: none;
  gap: 8px;
  flex-wrap: wrap;
  margin: 0 0 12px;
  padding: 0 0 12px;
  border-bottom: 1px solid #eae3dc;
}

.rb-filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid #eae3dc;
  border-radius: 999px;
  background: #fff;
  color: #3d3530;
  font-size: 0.76rem;
  font-weight: 800;
}

.rb-filter-chip.is-active {
  background: #fff8f2;
  border-color: var(--vh-accent-dark);
  color: var(--vh-accent-dark);
}

.rb-empty {
  margin-top: 10px;
  padding: 18px 14px;
  border: 1px solid #eae3dc;
  border-radius: 14px;
  background: #fff;
  color: #6f645b;
  font-size: 0.86rem;
  font-weight: 800;
  text-align: center;
}

.rb-room-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 12px;
}

.rb-room-card {
  background: #fff;
  border: 1px solid rgba(212, 163, 115, 0.22);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(61, 53, 48, 0.06);
}

.rb-room-main {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr) 210px;
  grid-template-areas: "left center panel" "total total total";
  gap: 12px;
  align-items: start;
  padding: 12px;
}

.rb-room-left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.rb-room-center {
  grid-area: center;
  min-width: 0;
}

.rb-booking-panel {
  grid-area: panel;
}

.rb-inline-total-wrapper {
  grid-area: total;
  width: 100%;
}

.rb-booking-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border: 1px solid #eae3dc;
  border-radius: 12px;
  background: #fcfbfa;
}

.rb-booking-badges,
.rb-booking-state {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.rb-booking-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff8f2;
  border: 1px solid #e5c6aa;
  color: #3d3530;
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1.35;
}

.rb-room-media {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.rb-room-media img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.rb-room-title {
  margin: 2px 0 0;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.15;
}

.rb-mini-pill,
.rb-info-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border: 1px solid #eae3dc;
  border-radius: 999px;
  background: #f7f4f0;
  color: #3d3530;
  font-size: 0.68rem;
  font-weight: 800;
}

.rb-calendar-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 6px;
}

.rb-calendar-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.rb-calendar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.rb-calendar-head h4 {
  margin: 0;
  color: var(--vh-accent-dark);
  font-family: Georgia, serif;
  font-size: 1rem;
  font-weight: 900;
}

.rb-calendar-legend {
  color: #6f645b;
  font-size: 0.72rem;
  font-weight: 700;
}

.rb-calendar-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.rb-calendar {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.rb-day {
  min-height: 84px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 6px;
  border: 1px solid #eae3dc;
  border-radius: 10px;
  background: #fcfbfa;
  transition: 0.18s ease;
  text-align: left;
}

.rb-day.free {
  background: #f4fbf5;
  cursor: pointer;
}

.rb-day.free:hover {
  transform: translateY(-1px);
}

.rb-day.busy {
  background: #fff3f3;
}

.rb-day.selected {
  background: #dff3e1;
  border: 2px solid #2e7d32;
}

.rb-day-date {
  font-size: 0.68rem;
  font-weight: 800;
  line-height: 1.3;
}

.rb-day-status {
  margin: 2px 0;
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1;
}

.rb-day.free .rb-day-status {
  color: #2e7d32;
}

.rb-day.busy .rb-day-status {
  color: #c62828;
}

.rb-day-old {
  color: #888;
  font-size: 0.62rem;
  text-decoration: line-through;
}

.rb-day-deal {
  color: #188038;
  font-size: 0.86rem;
  font-weight: 900;
  line-height: 1.15;
}

.rb-inline-total-box {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  grid-template-areas: "summary services actions";
  gap: 20px;
  align-items: center;
  width: 100%;
  padding: 16px 20px;
  border: 1px solid #e5c6aa;
  border-radius: 12px;
  background: #fff8f2;
}

.rb-inline-summary {
  grid-area: summary;
  min-width: 0;
}

.rb-service-wrap {
  grid-area: services;
}

.rb-inline-actions {
  grid-area: actions;
}

.rb-inline-total-label {
  color: #8f8176;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.rb-inline-total-price {
  margin-top: 4px;
  color: #3d3530;
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1;
}

.rb-inline-total-meta {
  margin-top: 4px;
  color: #6f645b;
  font-size: 0.92rem;
  font-weight: 700;
}

.rb-inline-save {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  border: 1px solid #d8eadb;
  border-radius: 999px;
  background: #f4fbf5;
  color: #188038;
  font-size: 0.84rem;
  font-weight: 800;
}

.rb-service-wrap {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  width: 100%;
}

.rb-service-option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #e7ddd2;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
}

.rb-service-option input {
  margin: 0;
  accent-color: var(--vh-accent-dark);
  flex: 0 0 auto;
}

.rb-service-icon {
  font-size: 1.1rem;
  line-height: 1;
  flex: 0 0 auto;
}

.rb-service-title {
  display: block;
  color: #2f261f;
  font-size: 0.88rem;
  font-weight: 900;
  line-height: 1.2;
}

.rb-inline-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  min-width: 0;
}

.rb-inline-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 46px;
  padding: 12px 14px;
  border: 0;
  border-radius: 999px;
  color: #fff !important;
  font-size: 0.9rem;
  font-weight: 900;
  text-align: center;
  white-space: nowrap;
}

.rb-inline-wa {
  background: #25d366;
}

.rb-inline-viber {
  background: var(--viber);
}

.rb-booking-item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #eae3dc;
  border-radius: 10px;
  background: #fff;
  font-size: 0.78rem;
}

.rb-booking-item span:first-child {
  color: #6f645b;
  font-weight: 800;
}

.rb-booking-item span:last-child {
  color: #3d3530;
  font-weight: 900;
  text-align: right;
}

/* REVIEWS / AMENITIES / LINKS */

.vh-reviews-widget {
  margin-top: 20px;
  padding: 18px;
  border: 1px solid rgba(154, 107, 63, 0.08);
  border-radius: 22px;
  background: #fff;
  min-height: 120px;
}

.vh-amenities-grid,
.vh-link-grid,
.vh-traveler-grid {
  display: grid;
  gap: 16px;
}

.vh-amenities-grid {
  grid-template-columns: repeat(4, 1fr);
}

.vh-link-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.vh-traveler-grid {
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
  margin-top: 30px;
}

.vh-amenity {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 16px 18px;
  border-radius: 22px;
}

.vh-amenity-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border: 1px solid rgba(154, 107, 63, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: var(--vh-accent-dark) !important;
  font-size: 18px;
}

.vh-amenity span {
  color: var(--vh-dark);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
}

.vh-traveler-section {
  background: linear-gradient(180deg, #f8f3ec 0%, var(--vh-bg) 100%);
}

.vh-traveler-card {
  position: relative;
  height: 460px;
  border-radius: 26px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  color: #fff !important;
  box-shadow: 0 15px 35px rgba(61, 43, 31, 0.12);
  transition: var(--transition);
}

.vh-traveler-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vh-traveler-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(61, 43, 31, 0.85) 0%, rgba(61, 43, 31, 0.25) 55%, rgba(0, 0, 0, 0) 100%);
}

.vh-traveler-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.vh-traveler-content h3 {
  margin: 0 0 10px;
  color: #fff !important;
  font-size: 28px;
  font-weight: 800;
}

.vh-traveler-content p {
  margin: 0 0 18px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.5;
}

.vh-traveler-link {
  display: inline-block;
  padding: 10px 18px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff !important;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* QUIZ BAR */

.premium-seo-bar {
  width: 100%;
  margin: 40px 0;
  padding: 22px 0;
  background: var(--vh-surface-2);
  border-top: 1px solid rgba(154, 107, 63, 0.1);
  border-bottom: 1px solid rgba(154, 107, 63, 0.1);
  box-shadow: var(--vh-shadow);
}

.bar-inner {
  max-width: var(--vh-container);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 0 16px;
}

.premium-label {
  display: block;
  margin-bottom: 4px;
  color: var(--vh-accent-dark) !important;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.premium-text {
  margin: 0;
  color: var(--vh-dark);
  font-size: 15px;
  line-height: 1.6;
}

.premium-btn-quiz {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 36px;
  border-radius: 50px;
  background: linear-gradient(135deg, #a87842, var(--vh-accent-dark));
  color: #fff !important;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.5px;
  white-space: nowrap;
  box-shadow: 0 10px 25px rgba(142, 102, 7, 0.3);
}

/* FAQ */

.vh-faq-grid {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.vh-faq-item {
  overflow: hidden;
  border: 1px solid rgba(154, 107, 63, 0.15);
  border-radius: var(--vh-radius-md);
  background: #fffdfa;
  box-shadow: var(--vh-shadow);
}

.vh-faq-item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  color: var(--vh-accent-dark) !important;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  list-style: none;
}

.vh-faq-item summary::-webkit-details-marker {
  display: none;
}

.vh-faq-item summary::after {
  content: "+";
  font-size: 20px;
  color: var(--vh-accent-dark) !important;
  transition: transform 0.3s ease;
}

.vh-faq-item[open] summary::after {
  transform: rotate(45deg);
}

.vh-faq-answer {
  padding: 14px 24px 24px;
  border-top: 1px solid rgba(154, 107, 63, 0.05);
  color: var(--vh-muted);
  font-size: 15px;
  line-height: 1.7;
}

/* FINAL */

.vh-final {
  padding: 0 0 92px;
}

.vh-final-shell {
  position: relative;
  min-height: 460px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 44px;
  border-radius: var(--vh-radius-xxl);
  background:
    linear-gradient(180deg, rgba(36, 28, 22, 0.22) 0%, rgba(36, 28, 22, 0.72) 72%, rgba(36, 28, 22, 0.88) 100%),
    url("https://chioshotel.gr/wp-content/uploads/2026/04/Screenshot_2026-04-25-14-11-19-166_com.instagram.android-edit-1.webp") center / cover no-repeat;
  color: #fff;
  box-shadow: var(--vh-shadow-strong);
}

.vh-final-shell h2 {
  max-width: 12ch;
  margin: 0 0 12px;
  color: #fff !important;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(34px, 4.3vw, 58px);
  line-height: 1.05;
  text-shadow: 0 3px 18px rgba(0, 0, 0, 0.45);
}

.vh-final-shell p {
  max-width: 560px;
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: 16px;
  line-height: 1.65;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
}

.vh-title,
.vh-subtitle,
.vh-copy,
.vh-panel p,
.vh-room-body p,
.vh-link-body p,
.vh-faq-answer {
  overflow-wrap: break-word;
}

/* MOBILE STICKY */

.vh-mobile-sticky {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
  background: rgba(255, 253, 250, 0.96);
  border-top: 1px solid rgba(154, 107, 63, 0.14);
  box-shadow: 0 -10px 30px rgba(47, 38, 31, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.vh-mobile-sticky__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}

.vh-mobile-sticky .vh-btn {
  min-height: 50px;
  border-radius: 18px;
  font-size: 10.5px;
}

.vh-mobile-sticky .vh-btn--primary {
  background: var(--viber) !important;
  border-color: var(--viber) !important;
  color: #fff !important;
  box-shadow: 0 10px 24px rgba(115, 96, 242, 0.28) !important;
}

/* ANIMATIONS */

@keyframes shineMove {
  0% {
    left: -120%;
  }
  45%,
  100% {
    left: 130%;
  }
}

@keyframes pulseDot {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.78);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

@keyframes pulseDotLight {
  0% {
    box-shadow: 0 0 0 0 rgba(187, 247, 208, 0.9);
  }
  70% {
    box-shadow: 0 0 0 9px rgba(187, 247, 208, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(187, 247, 208, 0);
  }
}

@keyframes bounceDown {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(4px);
  }
  60% {
    transform: translateY(2px);
  }
}

/* TABLET */

@media (max-width: 1180px) {
  .vh-intro-grid,
  .vh-split-highlight {
    grid-template-columns: 1fr;
  }

  .vh-room-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .vh-amenities-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .vh-link-grid,
  .vh-traveler-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .b7,
  .b5,
  .b12 {
    grid-column: span 12;
  }

  .rb-room-main {
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-areas:
      "left center"
      "panel panel"
      "total total";
  }

  .rb-inline-total-box {
    grid-template-columns: 1fr;
    grid-template-areas:
      "summary"
      "services"
      "actions";
    gap: 14px;
  }

  .rb-service-wrap,
  .rb-inline-actions {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 960px) {
  .rb-hero-top {
    flex-direction: column;
    align-items: stretch;
  }

  .rb-hero-head,
  .rb-hero-actions {
    flex: none;
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 820px) {
  .rb-room-media img {
    height: 190px;
  }

  .rb-room-main {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .rb-room-left,
  .rb-room-center,
  .rb-booking-panel,
  .rb-inline-total-wrapper {
    width: 100%;
  }
}

/* MOBILE */

@media (max-width: 767px) {
  html,
  body,
  .vh-homepage {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  .vh-wrap,
  .lm-shell {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .vh-section,
  .vh-section--tight {
    width: 100% !important;
    max-width: 100% !important;
    padding: 32px 0 !important;
  }

  .vh-section-head {
    margin-bottom: 14px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  .vh-title {
    margin-bottom: 10px !important;
    font-size: 28px !important;
    line-height: 1.08 !important;
  }

  .vh-subtitle,
  .vh-copy,
  .vh-panel p,
  .vh-highlight-card p,
  .vh-location-copy p,
  .vh-link-body p,
  .vh-room-body p,
  .vh-faq-answer,
  .premium-text {
    font-size: 14px !important;
    line-height: 1.58 !important;
  }

  .hero {
    width: 100% !important;
    height: 76svh !important;
    min-height: 590px !important;
    max-height: 720px !important;
    align-items: stretch !important;
    border-radius: 0 !important;
    background: #000 !important;
  }

  .hero-media img {
    object-position: center top !important;
    filter: none !important;
  }

  .hero::after {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.04) 35%,
      rgba(0, 0, 0, 0.4) 68%,
      rgba(0, 0, 0, 0.82) 100%
    ) !important;
  }

  .hero-inner {
    width: 100% !important;
    min-height: 100% !important;
    margin: 0 !important;
    padding: 12px 12px 18px !important;
    align-items: flex-end !important;
    justify-content: flex-end !important;
  }

  .hero-content-box {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    gap: 10px !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  .rating-card {
    position: absolute !important;
    top: 14px !important;
    left: 12px !important;
    z-index: 3 !important;
    max-width: calc(100% - 24px) !important;
    padding: 8px 12px !important;
    background: rgba(255, 255, 255, 0.92) !important;
    color: #2f261f !important;
    gap: 10px !important;
  }

  .rating-card strong {
    font-size: 13px !important;
    line-height: 1.1 !important;
  }

  .rating-card span {
    font-size: 10px !important;
  }

  .stars {
    font-size: 12px !important;
  }

  .hero-kicker {
    color: rgba(255, 255, 255, 0.92) !important;
    font-size: 10px !important;
    line-height: 1.2 !important;
    letter-spacing: 0.16em !important;
  }

  .hero-title {
    max-width: 11ch !important;
    font-size: 34px !important;
    line-height: 0.98 !important;
    letter-spacing: -0.035em !important;
  }

  .hero-description {
    max-width: 100% !important;
    font-size: 14px !important;
    line-height: 1.45 !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }

  .hero-actions {
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
    width: 100% !important;
  }

  .btn-primary,
  .btn-ghost {
    min-height: 52px !important;
    padding: 0 10px !important;
    border-radius: 18px !important;
    font-size: 11px !important;
    line-height: 1.15 !important;
    letter-spacing: 0.06em !important;
    white-space: normal !important;
  }

  .hero-quiz-card {
    grid-template-columns: auto 1fr !important;
    gap: 10px !important;
    padding: 11px 12px !important;
    border-radius: 18px !important;
  }

  .hero-quiz-link {
    grid-column: 1 / -1 !important;
    width: 100% !important;
  }

  .hero-quiz-icon {
    width: 38px !important;
    height: 38px !important;
    border-radius: 14px !important;
    font-size: 19px !important;
  }

  .hero-quiz-copy strong {
    font-size: 12px !important;
  }

  .hero-quiz-copy span {
    font-size: 11.5px !important;
  }

  .vh-hero-announce {
    padding: 12px 14px !important;
    gap: 8px !important;
    font-size: 13px !important;
    line-height: 1.35 !important;
  }

  .vh-panel,
  .vh-highlight-card,
  .vh-location-copy,
  .vh-reviews-shell,
  .vh-final-shell,
  .b-pad,
  .b-card {
    padding: 16px 12px !important;
    border-radius: 20px !important;
  }

  .vh-panel h2 {
    font-size: 28px !important;
  }

  .vh-panel h3,
  .vh-highlight-card h3 {
    font-size: 24px !important;
  }

  .vh-intro-grid,
  .vh-split-highlight,
  .bento {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  .vh-pill-row {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 8px !important;
  }

  .vh-pill {
    width: 100% !important;
    min-height: 36px !important;
    padding: 0 8px !important;
    font-size: 10px !important;
    text-align: center !important;
  }

  .vh-unique-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 8px !important;
    margin-top: 14px !important;
  }

  .vh-unique-card {
    min-height: 118px !important;
    padding: 10px 6px !important;
    border-radius: 15px !important;
  }

  .vh-unique-card strong {
    margin-bottom: 5px !important;
    font-size: 10.8px !important;
    line-height: 1.15 !important;
  }

  .vh-unique-card span {
    font-size: 9.8px !important;
    line-height: 1.25 !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 4 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }

  section[aria-labelledby="vh-rooms-title"] {
    padding-top: 24px !important;
  }

  section[aria-labelledby="vh-rooms-title"] .vh-highlight-card:nth-child(2) {
    display: none !important;
  }

  section[aria-labelledby="vh-rooms-title"] .vh-btn-row {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 8px !important;
    margin-top: 14px !important;
  }

  .vh-room-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .vh-room-card {
    display: grid !important;
    grid-template-columns: 44% 56% !important;
    min-height: 220px !important;
    border-left: 0 !important;
    border-right: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .vh-room-card + .vh-room-card {
    border-top: 1px solid rgba(154, 107, 63, 0.14) !important;
  }

  .vh-room-image {
    height: 100% !important;
    min-height: 220px !important;
    aspect-ratio: auto !important;
  }

  .room-offer-stack {
    top: 8px !important;
    left: 8px !important;
    right: 8px !important;
    gap: 6px !important;
  }

  .room-live-badge,
  .room-direct-badge {
    padding: 6px 8px !important;
    font-size: 9px !important;
  }

  .room-direct-badge {
    max-width: 56% !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .room-bed-badge {
    left: 8px !important;
    bottom: 9px !important;
    max-width: calc(100% - 16px) !important;
    padding: 6px 8px !important;
    font-size: 9.5px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .vh-room-body {
    min-width: 0 !important;
    padding: 12px 10px !important;
  }

  .vh-room-body h3 {
    margin: 0 0 7px !important;
    font-size: 25px !important;
    line-height: 1 !important;
    letter-spacing: -0.025em !important;
  }

  .vh-room-body p {
    margin: 0 0 8px !important;
    font-size: 13px !important;
    line-height: 1.32 !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }

  .vh-room-meta,
  .vh-room-amenities {
    width: 100% !important;
    gap: 5px !important;
    margin: 0 0 7px !important;
  }

  .vh-room-amenities {
    gap: 4px !important;
    margin-bottom: 8px !important;
  }

  .vh-room-meta span,
  .vh-room-amenities span {
    width: 100% !important;
    min-height: 26px !important;
    padding: 0 3px !important;
    font-size: 8px !important;
    line-height: 1.05 !important;
  }

  .vh-room-amenities span {
    font-size: 7.8px !important;
  }

  .vh-room-body .vh-btn {
    width: 100% !important;
    min-height: 36px !important;
    margin-top: auto !important;
    padding: 0 7px !important;
    border-radius: 12px !important;
    font-size: 9px !important;
    letter-spacing: 0.08em !important;
  }

  .vh-amenities-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 8px !important;
    padding: 0 10px !important;
  }

  .vh-amenity {
    min-height: 70px !important;
    flex-direction: column !important;
    justify-content: center !important;
    gap: 5px !important;
    padding: 8px 6px !important;
    border-radius: 16px !important;
    text-align: center !important;
  }

  .vh-amenity-icon {
    width: 30px !important;
    height: 30px !important;
    flex-basis: 30px !important;
    font-size: 15px !important;
  }

  .vh-amenity span {
    font-size: 10.5px !important;
    line-height: 1.18 !important;
  }

  .vh-link-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  .vh-link-body {
    padding: 16px !important;
  }

  .vh-link-body h3 {
    font-size: 21px !important;
  }

  .vh-traveler-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px !important;
    padding: 0 10px !important;
    margin-top: 14px !important;
  }

  .vh-traveler-card {
    height: 245px !important;
    padding: 14px !important;
    border-radius: 18px !important;
  }

  .vh-traveler-content h3 {
    margin-bottom: 6px !important;
    font-size: 20px !important;
  }

  .vh-traveler-content p {
    margin-bottom: 10px !important;
    font-size: 11.5px !important;
    line-height: 1.32 !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }

  .vh-traveler-link {
    padding: 8px 10px !important;
    font-size: 9px !important;
  }

  .distance-badge {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 6px !important;
    padding: 10px !important;
  }

  .distance-badge > div {
    padding: 10px 4px !important;
    border-radius: 14px !important;
  }

  .distance-badge span {
    font-size: 8.5px !important;
    line-height: 1.1 !important;
  }

  .distance-badge strong {
    font-size: 14px !important;
    line-height: 1.1 !important;
  }

  .b7,
  .b5,
  .b12 {
    grid-column: span 1 !important;
  }

  .map-preview,
  .map-iframe {
    height: 240px !important;
    border-radius: 18px !important;
  }

  .form-row {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  .email-input {
    width: 100% !important;
    min-width: 100% !important;
    border-radius: 14px !important;
  }

  .discount-badge {
    width: 100% !important;
    justify-content: center !important;
    min-height: 42px !important;
    border-radius: 16px !important;
  }

  .vh-btn,
  .premium-btn-quiz {
    width: 100% !important;
    max-width: 100% !important;
    min-height: 48px !important;
    padding: 0 14px !important;
    white-space: normal !important;
  }

  .premium-seo-bar {
    margin: 24px 0 !important;
    padding: 16px 0 !important;
  }

  .bar-inner {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
    text-align: left !important;
  }

  .vh-faq-item summary {
    padding: 15px 16px !important;
    font-size: 14px !important;
    line-height: 1.45 !important;
  }

  .vh-faq-answer {
    padding: 10px 16px 16px !important;
  }

  .vh-final {
    padding-bottom: 86px !important;
  }

  .vh-final-shell {
    min-height: 470px !important;
    padding: 18px 12px !important;
    background:
      linear-gradient(180deg, rgba(36, 28, 22, 0.05) 0%, rgba(36, 28, 22, 0.28) 45%, rgba(36, 28, 22, 0.78) 82%, rgba(36, 28, 22, 0.92) 100%),
      url("https://chioshotel.gr/wp-content/uploads/2026/04/Screenshot_2026-04-25-14-11-19-166_com.instagram.android-edit-1.webp") center / cover no-repeat !important;
  }

  .vh-final-shell .vh-kicker {
    margin-bottom: 6px !important;
    color: #f0ddca !important;
    font-size: 10px !important;
  }

  .vh-final-shell h2 {
    max-width: 11ch !important;
    margin-bottom: 8px !important;
    font-size: 26px !important;
    line-height: 1.05 !important;
  }

  .vh-final-shell p {
    max-width: 100% !important;
    font-size: 13px !important;
    line-height: 1.35 !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }

  .vh-final-shell .vh-btn-row {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 8px !important;
    margin-top: 12px !important;
  }

  #lmDealsWidget,
  #lmDealsWidget * {
    box-sizing: border-box;
    min-width: 0;
  }

  .lm-panel {
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
  }

  .rb-hero,
  .rb-search-card,
  .rb-results-wrap,
  .rb-room-card {
    border-radius: 16px !important;
    margin-bottom: 12px !important;
  }

  .rb-hero,
  .rb-search-card,
  .rb-results-wrap {
    padding: 14px 12px !important;
  }

  .rb-title {
    font-size: 1.35rem !important;
  }

  .rb-subtitle {
    font-size: 0.9rem !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 3 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }

  .rb-trust-line {
    border-radius: 14px !important;
    font-size: 0.78rem !important;
    line-height: 1.35 !important;
  }

  .rb-hero-timer-value {
    font-size: 1.8rem !important;
  }

  .rb-guest-row {
    gap: 6px !important;
  }

  .rb-guest-btn {
    min-height: 45px !important;
    padding: 0 4px !important;
    border-radius: 13px !important;
    font-size: 13px !important;
    line-height: 1 !important;
    white-space: nowrap !important;
  }

  .rb-room-main {
    padding: 10px !important;
    gap: 12px !important;
  }

  .rb-booking-panel {
    padding: 8px !important;
  }

  .rb-booking-badges,
  .rb-booking-state {
    grid-template-columns: 1fr 1fr !important;
    gap: 8px !important;
  }

  .rb-booking-badge {
    padding: 8px !important;
    font-size: 0.74rem !important;
  }

  .rb-booking-item {
    min-height: 54px !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    padding: 8px !important;
  }

  .rb-calendar {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    gap: 6px !important;
    overflow: hidden !important;
  }

  .rb-day {
    width: 100% !important;
    min-height: 72px !important;
    padding: 6px 4px !important;
  }

  .rb-day-date {
    font-size: 0.63rem !important;
  }

  .rb-day-status {
    font-size: 0.92rem !important;
  }

  .rb-day-old {
    font-size: 0.56rem !important;
  }

  .rb-day-deal {
    font-size: 0.72rem !important;
  }

  .rb-inline-total-box {
    grid-template-columns: 1fr !important;
    grid-template-areas:
      "summary"
      "services"
      "actions" !important;
    gap: 12px !important;
    padding: 14px 12px !important;
  }

  .rb-inline-total-price {
    font-size: 1.55rem !important;
  }

  .rb-inline-save {
    width: 100% !important;
    justify-content: center !important;
    text-align: center !important;
  }

  .rb-service-wrap,
  .rb-inline-actions {
    grid-template-columns: 1fr !important;
  }

  .rb-inline-action {
    min-height: 48px !important;
    font-size: 0.88rem !important;
    white-space: normal !important;
  }
}

@media (min-width: 768px) {
  .vh-mobile-sticky {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation: none !important;
    transition: none !important;
  }
}
