const fs = require('node:fs');

function replaceRequired(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing target: ${label}`);
  return source.replace(before, after);
}

const routePath = 'app/api/ai-assistant/summary-email/route.ts';
let route = fs.readFileSync(routePath, 'utf8');

route = replaceRequired(
  route,
  `type SummaryEmailBody = {\n  subject?: string;\n  message?: string;\n};`,
  `type SummaryEmailBody = {\n  subject?: string;\n  message?: string;\n  source?: string;\n  guest?: { email?: string };\n};`,
  'summary email body',
);

route = replaceRequired(
  route,
  `function clean(value: unknown, max: number) {\n  return String(value ?? "").trim().slice(0, max);\n}\n`,
  `function clean(value: unknown, max: number) {\n  return String(value ?? "").trim().slice(0, max);\n}\n\nfunction isLikelyEmail(value: string) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);\n}\n`,
  'email validator',
);

route = replaceRequired(
  route,
  `    const subject = clean(body.subject, 180) || "Αίτημα διαμονής από AI Room Finder";\n    const message = clean(body.message, 6000);`,
  `    const subject = clean(body.subject, 180) || "Αίτημα διαμονής από AI Room Finder";\n    const message = clean(body.message, 6000);\n    const source = clean(body.source, 40);\n    const heading = source === "room-wizard"\n      ? "Νέο αίτημα διαμονής από το Room Wizard"\n      : "Νέο αίτημα διαμονής από το AI Room Finder";\n    const guestEmail = clean(body.guest?.email, 254);`,
  'source-aware email heading',
);

route = replaceRequired(
  route,
  `      replyTo: smtpUser,`,
  `      replyTo: isLikelyEmail(guestEmail) ? guestEmail : smtpUser,`,
  'guest reply-to',
);

route = replaceRequired(
  route,
  `          <h2>Νέο αίτημα διαμονής από το AI Room Finder</h2>`,
  `          <h2>${'${escapeHtml(heading)}'}</h2>`,
  'dynamic email heading',
);

fs.writeFileSync(routePath, route);

const wizardPath = 'components/rooms/GreekRoomWizardTailwind.tsx';
let wizard = fs.readFileSync(wizardPath, 'utf8');

wizard = replaceRequired(
  wizard,
  `type WizardPrefs = {\n  guests?: number;\n  budget?: boolean;\n  noStairs?: boolean;\n  upperView?: boolean;\n  kitchen?: boolean;\n};`,
  `type WizardPrefs = {\n  guests?: number;\n  budget?: boolean;\n  noStairs?: boolean;\n  upperView?: boolean;\n  kitchen?: boolean;\n};\n\ntype EmailSendStatus = "idle" | "sending" | "sent" | "error";`,
  'email send status type',
);

wizard = replaceRequired(
  wizard,
  `  const [hasStarted, setHasStarted] = useState(false);\n  const [step, setStep] = useState(0);\n  const resultsCarouselRef = useRef<HTMLDivElement>(null);`,
  `  const [hasStarted, setHasStarted] = useState(false);\n  const [step, setStep] = useState(0);\n  const [emailStatus, setEmailStatus] = useState<Record<string, EmailSendStatus>>({});\n  const resultsCarouselRef = useRef<HTMLDivElement>(null);`,
  'email status state',
);

wizard = replaceRequired(
  wizard,
  `  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {`,
  `  async function sendRoomEmail(room: RoomWizardRoom) {\n    const key = String(room.id);\n    const currentStatus = emailStatus[key] || "idle";\n    if (currentStatus === "sending" || currentStatus === "sent") return;\n\n    setEmailStatus((current) => ({ ...current, [key]: "sending" }));\n    const guestName = [lead.firstName, lead.lastName].filter(Boolean).join(" ").trim();\n    const preferenceSummary = roomTags(room, prefs).join(", ") || "Δεν δηλώθηκαν";\n    const message = [\n      "Νέο αίτημα ενδιαφέροντος από το Room Wizard",\n      "",\n      \`Δωμάτιο: \${roomName(room.name)}\`,\n      \`Κατηγορία: \${roomType(room.type)}\`,\n      \`Τοποθεσία: \${roomLocation(room.location)}\`,\n      \`Άφιξη: \${lead.checkin}\`,\n      \`Αναχώρηση: \${lead.checkout}\`,\n      \`Άτομα: \${prefs.guests || "—"}\`,\n      \`Προτιμήσεις: \${preferenceSummary}\`,\n      "",\n      \`Όνομα: \${guestName}\`,\n      \`Email: \${lead.email}\`,\n      \`Τηλέφωνο: \${lead.phone}\`,\n    ].join("\\n");\n\n    try {\n      const response = await fetch("/api/ai-assistant/summary-email", {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({\n          subject: \`Room Wizard — \${guestName} — \${roomName(room.name)}\`,\n          message,\n          source: "room-wizard",\n          guest: { email: lead.email },\n        }),\n      });\n      const payload = await response.json().catch(() => null);\n      if (!response.ok || !payload?.ok) throw new Error("Email send failed");\n      setEmailStatus((current) => ({ ...current, [key]: "sent" }));\n    } catch {\n      setEmailStatus((current) => ({ ...current, [key]: "error" }));\n    }\n  }\n\n  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {`,
  'direct email sender',
);

wizard = replaceRequired(
  wizard,
  `                const tags = roomTags(room, prefs);\n                const label = index === 0 ? "Καλύτερη επιλογή" : "Εναλλακτική επιλογή";`,
  `                const tags = roomTags(room, prefs);\n                const label = index === 0 ? "Καλύτερη επιλογή" : "Εναλλακτική επιλογή";\n                const roomEmailStatus = emailStatus[String(room.id)] || "idle";`,
  'room-specific email status',
);

wizard = replaceRequired(
  wizard,
  `                    <div className="mt-5 grid gap-3 sm:grid-cols-2">\n                      <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-5 text-xs font-black uppercase tracking-[0.1em] text-white" href={getWhatsAppUrl(room, lead, prefs, whatsappPhone)} target="_blank" rel="noopener noreferrer">WhatsApp</a>\n                      <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#6f7f3f]/25 bg-[#efe6d8] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#3f4f2f]" href={\`mailto:chioshotel@gmail.com?subject=\${encodeURIComponent(\`Δωμάτιο - \${lead.firstName} \${lead.lastName} - \${roomName(room.name)}\`)}\`}>Email</a>\n                    </div>`,
  `                    <div className="mt-5 grid gap-3 sm:grid-cols-2">\n                      <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-5 text-xs font-black uppercase tracking-[0.1em] text-white" href={getWhatsAppUrl(room, lead, prefs, whatsappPhone)} target="_blank" rel="noopener noreferrer">WhatsApp</a>\n                      <button\n                        type="button"\n                        onClick={() => void sendRoomEmail(room)}\n                        disabled={roomEmailStatus === "sending" || roomEmailStatus === "sent"}\n                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#6f7f3f]/25 bg-[#efe6d8] px-5 text-xs font-black uppercase tracking-[0.1em] text-[#3f4f2f] transition hover:bg-[#e7dbc9] disabled:cursor-not-allowed disabled:opacity-70"\n                      >\n                        {roomEmailStatus === "sending" ? "Αποστολή…" : roomEmailStatus === "sent" ? "Στάλθηκε ✓" : roomEmailStatus === "error" ? "Προσπαθήστε ξανά" : "Email"}\n                      </button>\n                    </div>\n                    <div className="mt-3 min-h-5 text-center text-xs font-bold" aria-live="polite">\n                      {roomEmailStatus === "sent" ? <span className="text-[#3f6d2f]">Το αίτημα στάλθηκε στην υποδοχή.</span> : null}\n                      {roomEmailStatus === "error" ? <span className="text-red-700">Η αποστολή απέτυχε. Πατήστε ξανά.</span> : null}\n                    </div>`,
  'replace mailto with direct email button',
);

wizard = replaceRequired(
  wizard,
  `onClick={() => { setHasStarted(false); setStep(0); setPrefs({}); }}>Ξεκινήστε ξανά</button>`,
  `onClick={() => { setHasStarted(false); setStep(0); setPrefs({}); setEmailStatus({}); }}>Ξεκινήστε ξανά</button>`,
  'reset email status',
);

fs.writeFileSync(wizardPath, wizard);
console.log('Applied Room Wizard direct email sending.');
