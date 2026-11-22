"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="min-h-[44px] rounded-2xl bg-[#6b3fa0] px-5 py-2 font-bold text-white shadow-sm print:hidden"
    >
      🖨️ Εκτύπωση
    </button>
  );
}
