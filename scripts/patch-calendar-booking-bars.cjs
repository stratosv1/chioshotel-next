const fs = require("fs");

const file = "app/staff/calendar/CalendarApp.tsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
`function isBookingStart(booking: BookingRow, date: string) {
  return booking.arrival === date;
}`,
`function isBookingStart(booking: BookingRow, date: string) {
  return booking.arrival === date;
}

function daysBetween(start: string, end: string) {
  const first = parseDate(start);
  const last = parseDate(end);
  return Math.max(1, Math.round((last.getTime() - first.getTime()) / 86400000));
}

function clampBookingStart(booking: BookingRow, rangeStart: string) {
  return booking.arrival < rangeStart ? rangeStart : booking.arrival;
}

function clampBookingEnd(booking: BookingRow, rangeEnd: string) {
  const endExclusive = booking.departure > rangeEnd ? rangeEnd : booking.departure;
  return endExclusive;
}

function isBookingVisibleStart(booking: BookingRow, day: string, rangeStart: string) {
  return day === clampBookingStart(booking, rangeStart);
}`
);

s = s.replace(
`                          if (booking) {
                            const starts = isBookingStart(booking, day);

                            return (
                              <button
                                key={\`\${key}-\${day}\`}
                                type="button"
                                onClick={() => setSelectedBooking(booking)}
                                className={[
                                  "relative min-h-[72px] border-b border-r border-stone-200 p-1 text-left transition hover:brightness-95",
                                  bookingColor(booking.referrer),
                                ].join(" ")}
                              >
                                {starts ? (
                                  <div className="h-full rounded-xl border border-current/20 bg-white/70 p-2 shadow-sm">
                                    <div className="truncate text-xs font-black">
                                      {booking.guest_name || "Guest"}
                                    </div>
                                    <div className="mt-1 truncate text-[10px] font-black opacity-70">
                                      {booking.referrer || "Other"}
                                    </div>
                                    <div className="mt-1 text-[10px] font-black opacity-70">
                                      {booking.arrival.slice(5)} → {booking.departure.slice(5)}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid h-full place-items-center text-[10px] font-black opacity-50">
                                    stay
                                  </div>
                                )}
                              </button>
                            );
                          }`,
`                          if (booking) {
                            const starts = isBookingVisibleStart(booking, day, range.start);

                            if (!starts) {
                              return (
                                <div
                                  key={\`\${key}-\${day}\`}
                                  className="relative min-h-[72px] border-b border-r border-stone-200 bg-white p-1"
                                />
                              );
                            }

                            const visibleStart = clampBookingStart(booking, range.start);
                            const visibleEnd = clampBookingEnd(booking, range.end);
                            const spanDays = daysBetween(visibleStart, visibleEnd);

                            return (
                              <button
                                key={\`\${key}-\${day}\`}
                                type="button"
                                onClick={() => setSelectedBooking(booking)}
                                className="relative min-h-[72px] border-b border-r border-stone-200 bg-white p-1 text-left"
                                style={{
                                  gridColumn: \`span \${spanDays} / span \${spanDays}\`,
                                }}
                              >
                                <div
                                  className={[
                                    "flex h-full min-w-0 items-center rounded-2xl border px-3 py-2 shadow-sm transition hover:brightness-95",
                                    bookingColor(booking.referrer),
                                  ].join(" ")}
                                >
                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-black">
                                      {booking.guest_name || "Guest"}
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-black opacity-75">
                                      <span>{booking.referrer || "Other"}</span>
                                      <span>{booking.arrival.slice(5)} → {booking.departure.slice(5)}</span>
                                      <span>ID {booking.booking_id}</span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          }`
);

fs.writeFileSync(file, s, "utf8");
console.log("OK - CalendarApp booking bars patched");
