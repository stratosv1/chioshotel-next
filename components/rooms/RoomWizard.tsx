"use client";

import { useMemo, useState } from "react";
import type { RoomWizardRoom } from "@/content/rooms";

type RoomWizardProps = {
  rooms: RoomWizardRoom[];
  whatsappPhone: string;
};

type LeadData = {
  firstName: string;
  lastName: string;
  checkin: string;
  checkout: string;
  email: string;
  phone: string;
};

type WizardPrefs = {
  guests?: number;
  budget?: boolean;
  noStairs?: boolean;
  upperView?: boolean;
  gardenView?: boolean;
  kitchen?: boolean;
};

type QuestionId = "guests" | "budget" | "stairs" | "view" | "kitchen";

type QuestionOption = {
  title: string;
  hint: string;
  icon: string;
  tag?: string;
  tagClass?: "tag-up" | "tag-down";
  apply: (prefs: WizardPrefs) => WizardPrefs;
};

type Question = {
  id: QuestionId;
  question: string;
  options: QuestionOption[];
};

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function scoreRoom(room: RoomWizardRoom, prefs: WizardPrefs) {
  if (!prefs.guests || room.maxGuests < prefs.guests) {
    return -999;
  }

  let score = 0;

  score += Math.max(0, 3 - Math.abs(room.maxGuests - prefs.guests));

  if (prefs.budget) {
    score += room.budget ? 6 : -6;
    score += 5 - room.priceLevel;
  } else {
    score += !room.budget ? 6 : -6;
    score += room.priceLevel;
  }

  if (prefs.noStairs) {
    score += !room.stairs ? 4 : -4;
  } else {
    score += room.stairs ? 2 : 1;
  }

  if (prefs.upperView) {
    score += room.upperView ? 4 : -2;
  }

  if (prefs.gardenView) {
    score += room.gardenView ? 4 : -2;
  }

  if (!prefs.upperView && !prefs.gardenView) {
    score += 1;
  }

  if (prefs.kitchen) {
    if (room.fullKitchen) {
      score += 5;
    } else if (room.kitchenette) {
      score += 3;
    } else {
      score -= 5;
    }
  } else {
    if (room.fullKitchen) {
      score -= 2;
    } else if (room.kitchenette) {
      score -= 1;
    }
  }

  return score;
}

function getMatchRows(room: RoomWizardRoom, prefs: WizardPrefs) {
  const matches: string[] = [];
  const misses: string[] = [];

  if (prefs.guests) {
    if (room.maxGuests >= prefs.guests) {
      matches.push(`Comfortably fits ${prefs.guests} guests`);
    } else {
      misses.push(`Does not fit ${prefs.guests} guests`);
    }
  }

  if (prefs.budget) {
    if (room.budget) {
      matches.push("Budget-friendly economy option");
    } else {
      misses.push("Not an economy room");
    }
  } else {
    if (!room.budget) {
      matches.push("Standard / premium room category");
    } else {
      misses.push("Economy room, while you selected standard / premium");
    }
  }

  if (prefs.noStairs) {
    if (!room.stairs) {
      matches.push("Easy access without stairs");
    } else {
      misses.push("Has stairs");
    }
  } else {
    matches.push(room.stairs ? "First floor is OK" : "Easy ground-floor access");
  }

  if (prefs.upperView) {
    if (room.upperView) {
      matches.push("Upper view");
    } else {
      misses.push("No upper view");
    }
  }

  if (prefs.gardenView) {
    if (room.gardenView) {
      matches.push("Garden view");
    } else {
      misses.push("No garden view");
    }
  }

  if (prefs.kitchen) {
    if (room.fullKitchen) {
      matches.push("Full kitchen");
    } else if (room.kitchenette) {
      matches.push("Kitchenette");
    } else {
      misses.push("No kitchen facilities");
    }
  }

  return { matches, misses };
}

function getRequirementTags(room: RoomWizardRoom, prefs: WizardPrefs) {
  const good: string[] = [];
  const bad: string[] = [];

  if (prefs.guests) {
    if (room.maxGuests >= prefs.guests) {
      good.push(`Fits ${prefs.guests} guests`);
    } else {
      bad.push(`Fits ${prefs.guests} guests`);
    }
  }

  if (prefs.budget) {
    if (room.budget) {
      good.push("Economy");
    } else {
      bad.push("Economy");
    }
  } else {
    if (!room.budget) {
      good.push("Standard/Premium");
    } else {
      bad.push("Standard/Premium");
    }
  }

  if (prefs.noStairs) {
    if (!room.stairs) {
      good.push("No stairs");
    } else {
      bad.push("No stairs");
    }
  }

  if (prefs.upperView) {
    if (room.upperView) {
      good.push("Upper view");
    } else {
      bad.push("Upper view");
    }
  }

  if (prefs.gardenView) {
    if (room.gardenView) {
      good.push("Garden view");
    } else {
      bad.push("Garden view");
    }
  }

  if (prefs.kitchen) {
    if (room.fullKitchen) {
      good.push("Full kitchen");
    } else if (room.kitchenette) {
      good.push("Kitchenette");
    } else {
      bad.push("Kitchen facilities");
    }
  }

  return { good, bad };
}

function getWhatsAppUrl(room: RoomWizardRoom, lead: LeadData, prefs: WizardPrefs, phone: string) {
  const text = `Hello! My name is ${lead.firstName} ${lead.lastName} and I would like to book.

🏨 Room: ${room.name}
📅 Check-in: ${lead.checkin}
📅 Check-out: ${lead.checkout}
👥 Guests: ${prefs.guests}
📧 Email: ${lead.email}
📞 Phone: ${lead.phone}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function BedPills({ room }: { room: RoomWizardRoom }) {
  return (
    <div className="rw-bed-row" aria-label="Bed types">
      {room.beds.double > 0 && (
        <span className="rw-bed-pill">
          🛏️ Double <span className="rw-bed-count">x{room.beds.double}</span>
        </span>
      )}
      {room.beds.single > 0 && (
        <span className="rw-bed-pill">
          🛌 Single <span className="rw-bed-count">x{room.beds.single}</span>
        </span>
      )}
      {room.beds.sofa > 0 && (
        <span className="rw-bed-pill">
          🛋️ Sofa bed <span className="rw-bed-count">x{room.beds.sofa}</span>
        </span>
      )}
    </div>
  );
}

function RoomGallery({ room }: { room: RoomWizardRoom }) {
  const [activeImage, setActiveImage] = useState(room.images[0]);

  if (!room.images.length) {
    return null;
  }

  return (
    <div className="rw-gallery" id={`gal-${slugify(room.name)}`}>
      <img
        className="rw-gallery-main"
        src={activeImage}
        alt={room.name}
        loading="lazy"
      />

      <div className="rw-gallery-thumbs" aria-label="Gallery thumbnails">
        {room.images.map((image, index) => (
          <button
            type="button"
            className={`rw-thumb-button ${activeImage === image ? "active" : ""}`}
            key={image}
            onClick={() => setActiveImage(image)}
            aria-label={`${room.name} photo ${index + 1}`}
          >
            <img
              className="rw-thumb"
              src={image}
              alt={`${room.name} photo ${index + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchAnalysis({ room, prefs }: { room: RoomWizardRoom; prefs: WizardPrefs }) {
  const { matches, misses } = getMatchRows(room, prefs);

  return (
    <div className="rw-analysis">
      <h3 className="rw-analysis-title">WHY IT FITS:</h3>

      {matches.map((match) => (
        <div className="rw-match-row good" key={match}>
          ✓ {match}
        </div>
      ))}

      {misses.map((miss) => (
        <div className="rw-match-row bad" key={miss}>
          ✕ {miss}
        </div>
      ))}

      {misses.length === 0 && (
        <div className="rw-match-row good" style={{ marginTop: 10, fontWeight: 900 }}>
          ✓ Matches 100% of your criteria!
        </div>
      )}
    </div>
  );
}

function RequirementTags({ room, prefs }: { room: RoomWizardRoom; prefs: WizardPrefs }) {
  const tags = getRequirementTags(room, prefs);

  return (
    <div className="rw-req-tags">
      {tags.good.map((tag) => (
        <span className="rw-req-tag good" key={`good-${tag}`}>
          {tag}
        </span>
      ))}

      {tags.bad.map((tag) => (
        <span className="rw-req-tag bad" key={`bad-${tag}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function AlternativeRoom({
  room,
  bestRoom,
  lead,
  prefs,
  whatsappPhone,
}: {
  room: RoomWizardRoom;
  bestRoom: RoomWizardRoom;
  lead: LeadData;
  prefs: WizardPrefs;
  whatsappPhone: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  let priceClass = "compare-same";
  let priceText = "Same price category";

  if (room.priceLevel > bestRoom.priceLevel) {
    priceClass = "compare-up";
    priceText = "More expensive than the best match";
  }

  if (room.priceLevel < bestRoom.priceLevel) {
    priceClass = "compare-down";
    priceText = "Cheaper than the best match";
  }

  return (
    <div className={`rw-accordion ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="rw-accordion-header"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{room.name}</span>
        <span className="rw-acc-icon">⌄</span>
      </button>

      <div className="rw-accordion-body">
        <div className="acc-meta">
          {room.type} • {room.location}
        </div>

        <div className={`rw-price-compare-tag ${priceClass}`}>{priceText}</div>

        <RequirementTags room={room} prefs={prefs} />
        <BedPills room={room} />
        <RoomGallery room={room} />

        <div className="rw-analysis-title">WHAT IT OFFERS / WHAT’S MISSING:</div>
        <MatchAnalysis room={room} prefs={prefs} />

        <div className="rw-btn-group">
          <a
            href={getWhatsAppUrl(room, lead, prefs, whatsappPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="rw-action-btn btn-wa"
          >
            WhatsApp
          </a>

          <a
            className="rw-action-btn btn-email"
            href={`mailto:info@chioshotel.gr?subject=${encodeURIComponent(
              `Inquiry - ${lead.firstName} ${lead.lastName} - ${room.name}`,
            )}`}
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

export function RoomWizard({ rooms, whatsappPhone }: RoomWizardProps) {
  const minDate = getTomorrowDate();

  const [lead, setLead] = useState<LeadData>({
    firstName: "",
    lastName: "",
    checkin: "",
    checkout: "",
    email: "",
    phone: "",
  });

  const [prefs, setPrefs] = useState<WizardPrefs>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);

  const questions: Question[] = useMemo(
    () => [
      {
        id: "guests",
        question: "How many guests?",
        options: [
          {
            title: "Couple (2 Guests)",
            hint: "Ideal for 2 adults",
            icon: "👥",
            apply: (current) => ({ ...current, guests: 2 }),
          },
          {
            title: "3 Guests",
            hint: "Family or friends",
            icon: "👨‍👩‍👦",
            apply: (current) => ({ ...current, guests: 3 }),
          },
          {
            title: "4 Guests",
            hint: "Maximum comfort",
            icon: "👨‍👩‍👧‍👦",
            apply: (current) => ({ ...current, guests: 4 }),
          },
        ],
      },
      {
        id: "budget",
        question: "Which price level do you prefer?",
        options: [
          {
            title: "Economy",
            hint: "More budget-friendly",
            icon: "💶",
            tag: "↓ Budget option",
            tagClass: "tag-down",
            apply: (current) => ({ ...current, budget: true }),
          },
          {
            title: "Standard / Premium",
            hint: "Regular pricing",
            icon: "💶",
            tag: "↑ Regular cost",
            tagClass: "tag-up",
            apply: (current) => ({ ...current, budget: false }),
          },
        ],
      },
      {
        id: "stairs",
        question: "Access & stairs?",
        options: [
          {
            title: "No stairs",
            hint: "Ground floor or stand-alone apartment",
            icon: "🧳",
            tag: "↓ Often cheaper",
            tagClass: "tag-down",
            apply: (current) => ({ ...current, noStairs: true }),
          },
          {
            title: "Stairs are OK",
            hint: "Includes first-floor options",
            icon: "🪜",
            tag: "↑ More options",
            tagClass: "tag-up",
            apply: (current) => ({ ...current, noStairs: false }),
          },
        ],
      },
      {
        id: "view",
        question: "Preferred view?",
        options: [
          {
            title: "Upper view",
            hint: "More premium feel",
            icon: "👁️",
            tag: "↑ Premium vibe",
            tagClass: "tag-up",
            apply: (current) => ({ ...current, upperView: true, gardenView: false }),
          },
          {
            title: "Garden view",
            hint: "Peaceful atmosphere",
            icon: "🌿",
            tag: "↓ Often cheaper",
            tagClass: "tag-down",
            apply: (current) => ({ ...current, upperView: false, gardenView: true }),
          },
          {
            title: "Any view",
            hint: "Not a priority",
            icon: "✨",
            apply: (current) => ({ ...current, upperView: false, gardenView: false }),
          },
        ],
      },
      {
        id: "kitchen",
        question: "Do you need a kitchen?",
        options: [
          {
            title: "Yes, full kitchen",
            hint: "For maximum independence",
            icon: "🍳",
            tag: "↑ Higher cost",
            tagClass: "tag-up",
            apply: (current) => ({ ...current, kitchen: true }),
          },
          {
            title: "No, not needed",
            hint: "More budget-friendly",
            icon: "🍽️",
            tag: "↓ Cheaper",
            tagClass: "tag-down",
            apply: (current) => ({ ...current, kitchen: false }),
          },
        ],
      },
    ],
    [],
  );

  const visibleQuestions = useMemo(() => {
    const skipView = prefs.guests === 2 && prefs.budget === true;
    return questions.filter((question) => !(skipView && question.id === "view"));
  }, [prefs.budget, prefs.guests, questions]);

  const currentQuestion = visibleQuestions[step];
  const isFinished = hasStarted && step >= visibleQuestions.length;

  const results = useMemo(() => {
    return rooms
      .map((room) => ({
        room,
        score: scoreRoom(room, prefs),
      }))
      .filter((item) => item.score > -999)
      .sort((a, b) => b.score - a.score);
  }, [prefs, rooms]);

  const bestRoom = results[0]?.room;
  const alternativeRooms = results.slice(1, 3).map((item) => item.room);

  function handleLeadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lead.checkin || !lead.checkout || lead.checkout <= lead.checkin) {
      alert("Check-out must be after check-in.");
      return;
    }

    setHasStarted(true);
    setStep(0);
  }

  function handleOption(option: QuestionOption) {
    setPrefs((current) => option.apply(current));
    setStep((current) => current + 1);
  }

  function goBack() {
    if (step > 0) {
      setStep((current) => current - 1);
      return;
    }

    setHasStarted(false);
    setPrefs({});
  }

  function resetWizard() {
    setHasStarted(false);
    setStep(0);
    setPrefs({});
  }

  return (
    <section className="rw-wrapper" id="room-wizard-app" aria-labelledby="rw-main-title">
      <div className="rw-main-card">
        {hasStarted && (
          <header className="rw-header active" id="rw-header">
            <div className="rw-header-flex">
              <div className="rw-logo">🏠 Room Finder</div>
              <div className="rw-step-tag" aria-live="polite">
                Step <span>{Math.min(step + 1, visibleQuestions.length)}</span>/
                <span>{visibleQuestions.length}</span>
              </div>
            </div>

            <div className="rw-progress-track">
              <div
                className="rw-progress-bar"
                role="progressbar"
                aria-valuenow={Math.round(
                  (Math.min(step + 1, visibleQuestions.length) / visibleQuestions.length) * 100,
                )}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{
                  width: `${
                    (Math.min(step + 1, visibleQuestions.length) / visibleQuestions.length) * 100
                  }%`,
                }}
              />
            </div>
          </header>
        )}

        {!hasStarted && (
          <>
            <header className="rw-intro-header">
              <h3 className="rw-intro-title" id="rw-main-title">
                Let’s begin!
              </h3>
              <p className="rw-intro-sub">
                Answer 5 quick questions and we’ll suggest the best room or apartment for your stay
                in Chios.
              </p>
            </header>

            <form onSubmit={handleLeadSubmit}>
              <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                <div className="rw-form-grid">
                  <div className="rw-form-group">
                    <input
                      type="text"
                      className="rw-input"
                      placeholder=" "
                      required
                      autoComplete="given-name"
                      value={lead.firstName}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, firstName: event.target.value }))
                      }
                    />
                    <label className="rw-label">First name</label>
                  </div>

                  <div className="rw-form-group">
                    <input
                      type="text"
                      className="rw-input"
                      placeholder=" "
                      required
                      autoComplete="family-name"
                      value={lead.lastName}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, lastName: event.target.value }))
                      }
                    />
                    <label className="rw-label">Last name</label>
                  </div>

                  <div className="rw-form-group">
                    <input
                      type="date"
                      className="rw-input"
                      min={minDate}
                      placeholder=" "
                      required
                      value={lead.checkin}
                      onChange={(event) =>
                        setLead((current) => ({
                          ...current,
                          checkin: event.target.value,
                          checkout:
                            current.checkout && current.checkout <= event.target.value
                              ? ""
                              : current.checkout,
                        }))
                      }
                    />
                    <label className="rw-label">Check-in</label>
                  </div>

                  <div className="rw-form-group">
                    <input
                      type="date"
                      className="rw-input"
                      min={lead.checkin || minDate}
                      placeholder=" "
                      required
                      value={lead.checkout}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, checkout: event.target.value }))
                      }
                    />
                    <label className="rw-label">Check-out</label>
                  </div>

                  <div className="rw-form-group full">
                    <input
                      type="email"
                      className="rw-input"
                      placeholder=" "
                      required
                      autoComplete="email"
                      value={lead.email}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, email: event.target.value }))
                      }
                    />
                    <label className="rw-label">Email</label>
                  </div>

                  <div className="rw-form-group full">
                    <input
                      type="tel"
                      className="rw-input"
                      placeholder=" "
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      value={lead.phone}
                      onChange={(event) =>
                        setLead((current) => ({ ...current, phone: event.target.value }))
                      }
                    />
                    <label className="rw-label">Phone</label>
                  </div>

                  <div className="rw-form-group full rw-checkbox-group">
                    <input type="checkbox" required />
                    <label>
                      I consent to the processing of my personal data for the purpose of receiving
                      accommodation suggestions.
                    </label>
                  </div>
                </div>
              </fieldset>

              <button type="submit" className="rw-start-btn">
                Start
              </button>
            </form>
          </>
        )}

        {hasStarted && currentQuestion && !isFinished && (
          <>
            <h2 className="rw-question-text">{currentQuestion.question}</h2>

            <div className="rw-options-list">
              {currentQuestion.options.map((option) => (
                <button
                  type="button"
                  className="rw-opt-card"
                  key={option.title}
                  onClick={() => handleOption(option)}
                >
                  <div className="rw-opt-icon">{option.icon}</div>

                  <div className="rw-opt-content">
                    <h4>{option.title}</h4>
                    <div className="rw-opt-hint">{option.hint}</div>

                    {option.tag && (
                      <div className={`rw-price-tag ${option.tagClass || ""}`}>{option.tag}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="rw-nav-footer">
              <button type="button" className="rw-back-btn" onClick={goBack}>
                ← Back
              </button>
            </div>
          </>
        )}

        {isFinished && bestRoom && (
          <>
            <article className="rw-hero-card">
              <div className="rw-hero-badge">★ Best Match</div>

              <h2 className="rw-hero-name">{bestRoom.name}</h2>

              <div className="rw-hero-meta">
                {bestRoom.type} • {bestRoom.location}
              </div>

              <RequirementTags room={bestRoom} prefs={prefs} />
              <BedPills room={bestRoom} />
              <RoomGallery room={bestRoom} />
              <MatchAnalysis room={bestRoom} prefs={prefs} />

              <div className="rw-btn-group">
                <a
                  href={getWhatsAppUrl(bestRoom, lead, prefs, whatsappPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rw-action-btn btn-wa"
                >
                  WhatsApp
                </a>

                <a
                  className="rw-action-btn btn-email"
                  href={`mailto:info@chioshotel.gr?subject=${encodeURIComponent(
                    `Inquiry - ${lead.firstName} ${lead.lastName} - ${bestRoom.name}`,
                  )}`}
                >
                  Send by Email
                </a>
              </div>
            </article>

            {alternativeRooms.length > 0 && (
              <>
                <h3 className="rw-acc-title">Alternative Options</h3>

                {alternativeRooms.map((room) => (
                  <AlternativeRoom
                    key={room.id}
                    room={room}
                    bestRoom={bestRoom}
                    lead={lead}
                    prefs={prefs}
                    whatsappPhone={whatsappPhone}
                  />
                ))}
              </>
            )}

            <div style={{ marginTop: 18 }}>
              <div className="rw-nav-footer">
                <button type="button" className="rw-back-btn" onClick={goBack}>
                  ← Back
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button
                  type="button"
                  className="rw-back-btn"
                  onClick={resetWizard}
                  style={{ justifyContent: "center" }}
                >
                  Start over
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}