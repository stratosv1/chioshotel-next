import { getWhatsAppTracking } from "@/lib/whatsapp/tracking";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WhatsAppStatusPage() {
  const tracking = await getWhatsAppTracking();
  const counts = tracking.messages.reduce<Record<string, number>>((acc, row) => {
    const status = String(row.status || "unknown").toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#f7f3eb] px-4 py-10 text-stone-900">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">Voulamandis House</p>
        <h1 className="mt-2 text-3xl font-bold">WhatsApp Delivery Status</h1>
        <p className="mt-3 text-sm text-stone-600">Κατάσταση των μηνυμάτων που καταγράφονται από τη 360dialog.</p>

        <section className="mt-6 grid grid-cols-2 gap-3 text-center md:grid-cols-6">
          {[['Accepted', counts.accepted || 0], ['Sent', counts.sent || 0], ['Delivered', counts.delivered || 0], ['Read', counts.read || 0], ['Failed', counts.failed || 0], ['Stop offers', tracking.optOuts.length]].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl bg-stone-100 p-4">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs">{label}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-stone-200">
          <div className="bg-stone-50 px-4 py-3 font-bold">Recent messages</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-stone-200 text-xs uppercase text-stone-500">
                <tr><th className="p-3">WhatsApp</th><th className="p-3">Template</th><th className="p-3">Status</th><th className="p-3">Message ID</th></tr>
              </thead>
              <tbody>
                {tracking.messages.length ? tracking.messages.map((row) => (
                  <tr key={String(row.id)} className="border-b border-stone-100 last:border-0">
                    <td className="p-3 font-mono">{String(row.recipient_phone || '—')}</td>
                    <td className="p-3">{String(row.subject || '—')}</td>
                    <td className="p-3 font-bold">{String(row.status || '—')}</td>
                    <td className="max-w-[320px] truncate p-3 font-mono text-xs text-stone-500">{String(row.provider_message_id || '—')}</td>
                  </tr>
                )) : <tr><td colSpan={4} className="p-6 text-center text-stone-500">Τα επόμενα tracked messages θα εμφανιστούν εδώ.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
