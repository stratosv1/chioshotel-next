const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'components/ai/GuestAssistantMultilingual.tsx');
let source = fs.readFileSync(file, 'utf8');

source = source.replace(
  'type Message = { role: "user" | "assistant"; content: string; offers?: Offer[]; knowledge?: KnowledgeCard[] };',
  'type Message = { role: "user" | "assistant"; content: string; offers?: Offer[]; knowledge?: KnowledgeCard[]; menu?: string[] };'
);

source = source.replace(
  'setMessages((current) => [...current, { role: "assistant", content: data.answer, offers: Array.isArray(data.offers) ? data.offers : [], knowledge: Array.isArray(data.knowledge) ? data.knowledge.slice(0, 4) : [] }]);',
  'setMessages((current) => [...current, { role: "assistant", content: data.answer, offers: Array.isArray(data.offers) ? data.offers : [], knowledge: Array.isArray(data.knowledge) ? data.knowledge.slice(0, 3) : [], menu: Array.isArray(data.menu) ? data.menu : [] }]);'
);

if (!source.includes('async function restartFromMenu')) {
  source = source.replace(
    '  async function submitRequest(event: FormEvent<HTMLFormElement>) {',
    `  async function restartFromMenu(text: string) {
    if (loading) return;
    const freshMessages: Message[] = [{ role: "assistant", content: t.welcome }, { role: "user", content: text }];
    setMessages(freshMessages); setSearch({}); setSelectedRoom(undefined); setDetailsOffer(null); setSelectedOffer(null); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/ai-assistant/smart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: freshMessages.map(({ role, content }) => ({ role, content })), search: {}, language }) });
      const data = await response.json(); if (!response.ok || !data?.answer) throw new Error(data?.error || t.error);
      if (data.search) setSearch(data.search);
      setMessages([...freshMessages, { role: "assistant", content: data.answer, offers: Array.isArray(data.offers) ? data.offers : [], knowledge: Array.isArray(data.knowledge) ? data.knowledge.slice(0, 3) : [], menu: Array.isArray(data.menu) ? data.menu : [] }]);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    } catch (e) { setError(e instanceof Error ? e.message : t.error); } finally { setLoading(false); inputRef.current?.focus(); }
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {`
  );
}

if (!source.includes('m.menu?.length')) {
  source = source.replace(
    '{i === 0 && messages.length === 1 ? <div className="mt-4 flex flex-wrap gap-2">{t.quick.map((q: string) => <button key={q} onClick={() => void sendMessage(q)} className="rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 shadow-sm">{q}</button>)}</div> : null}',
    `{i === 0 && messages.length === 1 ? <div className="mt-4 flex flex-wrap gap-2">{t.quick.map((q: string) => <button key={q} onClick={() => void sendMessage(q)} className="rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 shadow-sm">{q}</button>)}</div> : null}
        {m.menu?.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2">{m.menu.map((action) => <button key={action} onClick={() => void restartFromMenu(action)} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-900 shadow-sm">{action}</button>)}</div> : null}`
  );
}

fs.writeFileSync(file, source);
console.log('safe fallback frontend patched');
