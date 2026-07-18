const fs = require("node:fs");
const path = require("node:path");

const uiFile = path.join(process.cwd(), "components/ai/AIRoomFinder.tsx");
let ui = fs.readFileSync(uiFile, "utf8");

if (!ui.includes("priceProposalOffer")) {
  ui = ui.replace(
    '  const [manualSuccess, setManualSuccess] = useState("");',
    '  const [manualSuccess, setManualSuccess] = useState("");\n  const [priceProposalOffer, setPriceProposalOffer] = useState<Offer | null>(null);\n  const [proposalName, setProposalName] = useState("");\n  const [proposalPhone, setProposalPhone] = useState("");\n  const [proposalEmail, setProposalEmail] = useState("");\n  const [proposalTotal, setProposalTotal] = useState("");\n  const [proposalSending, setProposalSending] = useState(false);\n  const [proposalSuccess, setProposalSuccess] = useState("");',
  );

  ui = ui.replace(
    '  }, [activeOffer, requestOffer, manualCardOpen]);',
    '  }, [activeOffer, requestOffer, manualCardOpen, priceProposalOffer]);',
  );

  ui = ui.replace(
    '      const offers = Array.isArray(data.offers) ? data.offers : [];\n      setMessages((current) => [...current, { role: "assistant", content: data.answer, offers }]);',
    '      const offers = Array.isArray(data.offers) ? data.offers : [];\n      const wantsPriceProposal = typeof data.answer === "string" && data.answer.includes("[OPEN_PRICE_PROPOSAL]");\n      const cleanAnswer = typeof data.answer === "string" ? data.answer.replace("[OPEN_PRICE_PROPOSAL]", "").trim() : data.answer;\n      setMessages((current) => [...current, { role: "assistant", content: cleanAnswer, offers }]);\n      if (wantsPriceProposal && lastOffers.length) {\n        setProposalSuccess("");\n        setPriceProposalOffer(lastOffers[0]);\n      }',
  );

  ui = ui.replace(
    '  function openRequest(offer: Offer) {',
    '  async function submitPriceProposal(event: FormEvent<HTMLFormElement>) {\n    event.preventDefault();\n    if (!priceProposalOffer || !search.checkin || !search.checkout || !search.guests) return;\n    const proposedTotal = Number(proposalTotal.replace(",", "."));\n    if (!proposalName.trim() || !proposalPhone.trim() || !proposalEmail.trim() || !Number.isFinite(proposedTotal) || proposedTotal <= 0) return;\n    setProposalSending(true); setError("");\n    const payload = {\n      name: proposalName.trim(),\n      contact: `Τηλέφωνο: ${proposalPhone.trim()} | Email: ${proposalEmail.trim()}`,\n      message: `ΑΙΤΗΜΑ ΕΙΔΙΚΗΣ ΤΙΜΗΣ\\nΠροτεινόμενη συνολική τιμή πελάτη: ${proposedTotal.toFixed(2)} €\\nΤρέχουσα απευθείας τιμή: ${priceProposalOffer.directTotal.toFixed(2)} €`,\n      checkin: search.checkin, checkout: search.checkout, guests: search.guests,\n      roomId: priceProposalOffer.roomId, unitId: priceProposalOffer.unitId, roomName: priceProposalOffer.name,\n      originalTotal: priceProposalOffer.originalTotal, directTotal: priceProposalOffer.directTotal, proposedTotal,\n      phone: proposalPhone.trim(), email: proposalEmail.trim(),\n      conversation: messages.slice(-16).map(({ role, content }) => ({ role, content })),\n    };\n    try {\n      const response = await fetch("/api/ai-assistant/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });\n      const result = await response.json();\n      if (!response.ok || !result?.ok) throw new Error(result?.error || t.error);\n      const emailResponse = await fetch("/api/ai-assistant/request-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, requestId: result.requestId }) });\n      const emailResult = await emailResponse.json().catch(() => null);\n      if (!emailResponse.ok || !emailResult?.ok) throw new Error(emailResult?.error || t.error);\n      setProposalSuccess(language === "el" ? "Η πρότασή σας στάλθηκε στη reception 🙏 Θα επικοινωνήσουμε μαζί σας απευθείας. Δεν έχει πραγματοποιηθεί κράτηση." : "Your proposal was sent to reception 🙏 They will contact you directly. No booking has been made.");\n    } catch (cause) { setError(cause instanceof Error ? cause.message : t.error); } finally { setProposalSending(false); }\n  }\n\n  function openRequest(offer: Offer) {',
  );

  ui = ui.replace(
    '      {requestOffer ? <div className="fixed inset-0 z-[110]',
    '      {priceProposalOffer ? <div className="fixed inset-0 z-[115] flex items-end justify-center bg-stone-950/55 sm:items-center sm:p-5" role="dialog" aria-modal="true"><div className="max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] shadow-2xl sm:rounded-[2rem]"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700">💶 {language === "el" ? "Πρόταση τιμής" : "Price proposal"}</p><h2 className="mt-1 text-2xl font-black">{priceProposalOffer.name}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{language === "el" ? "Πείτε μας ποια συνολική τιμή θεωρείτε δίκαιη. Η reception θα ελέγξει προσωπικά το αίτημά σας." : "Tell us the total price you consider fair. Reception will personally review your request."}</p></div><button type="button" onClick={() => setPriceProposalOffer(null)} className="rounded-full border px-3 py-2" aria-label={t.close}>✕</button></div>{proposalSuccess ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6"><p className="font-bold">{proposalSuccess}</p></div> : <form onSubmit={submitPriceProposal} className="mt-5 space-y-4"><div className="rounded-2xl bg-stone-50 p-4"><div className="flex items-center justify-between gap-3"><span className="text-sm text-stone-600">{language === "el" ? "Τρέχουσα απευθείας τιμή" : "Current direct price"}</span><strong className="text-lg">{money(priceProposalOffer.directTotal)}</strong></div></div><label className="block text-sm font-semibold">{language === "el" ? "Η συνολική τιμή που προτείνετε" : "Your proposed total price"}<div className="relative mt-1.5"><input required inputMode="decimal" value={proposalTotal} onChange={(event) => setProposalTotal(event.target.value)} className="w-full rounded-2xl border px-4 py-3 pr-10 text-lg font-bold" placeholder="0,00" /><span className="absolute right-4 top-3.5 font-bold text-stone-500">€</span></div></label><label className="block text-sm font-semibold">{language === "el" ? "Ονοματεπώνυμο" : "Full name"}<input required value={proposalName} onChange={(event) => setProposalName(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label><label className="block text-sm font-semibold">{language === "el" ? "Κινητό" : "Mobile"}<input required type="tel" value={proposalPhone} onChange={(event) => setProposalPhone(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label><label className="block text-sm font-semibold">Email<input required type="email" value={proposalEmail} onChange={(event) => setProposalEmail(event.target.value)} className="mt-1.5 w-full rounded-2xl border px-4 py-3" /></label><button disabled={proposalSending} className="w-full rounded-2xl bg-stone-950 px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">{proposalSending ? t.sending : (language === "el" ? "Στείλε την πρότασή μου στη reception" : "Send my proposal to reception")}</button><p className="text-center text-xs leading-5 text-stone-500">{language === "el" ? "Η πρόταση δεν δεσμεύει τη reception και δεν αποτελεί κράτηση." : "The proposal is not binding and does not constitute a booking."}</p></form>}</div></div> : null}\n\n      {requestOffer ? <div className="fixed inset-0 z-[110]',
  );
}

if (!ui.includes("submitPriceProposal")) throw new Error("Special price request UI was not applied");
fs.writeFileSync(uiFile, ui);

const apiFile = path.join(process.cwd(), "app/api/ai-assistant/route.ts");
let api = fs.readFileSync(apiFile, "utf8");
const apiAnchor = '                "For respond, answer must contain a short, genuinely helpful response in the user\'s language.",';
if (!api.includes("[OPEN_PRICE_PROPOSAL]")) {
  if (!api.includes(apiAnchor)) throw new Error("AI response prompt anchor not found");
  api = api.replace(apiAnchor, apiAnchor + '\n                "When the guest asks for a better price, discount, negotiation or says the offer is too expensive after room results already exist, respond warmly and briefly, explain that reception can personally review their own fair-price proposal, and append the exact marker [OPEN_PRICE_PROPOSAL]. Do not promise acceptance.",');
}
fs.writeFileSync(apiFile, api);
console.log("Applied special price proposal lead-capture flow");
