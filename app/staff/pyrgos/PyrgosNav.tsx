"use client";

import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; match?: string };

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Λειτουργία",
    items: [
      { href: "/staff/pyrgos/", label: "Σήμερα", match: "/staff/pyrgos" },
      { href: "/staff/pyrgos/plano/", label: "Πλάνο κρατήσεων", match: "/staff/pyrgos/plano" },
      { href: "/staff/rooms/", label: "Αφίξεις & δωμάτια", match: "/staff/rooms" },
      { href: "/staff/pyrgos/#katharismos", label: "Καθαριότητα" },
      { href: "/staff/pyrgos/ergasies/", label: "Βλάβες & εργασίες", match: "/staff/pyrgos/ergasies" },
    ],
  },
  {
    title: "Πελάτες",
    items: [
      { href: "/staff/crm/", label: "Πελάτες (CRM)", match: "/staff/crm" },
      { href: "/staff/ai-room-finder/", label: "AI συνομιλίες", match: "/staff/ai-room-finder" },
      { href: "/staff/offers/", label: "Προσφορές & newsletter", match: "/staff/offers" },
    ],
  },
  {
    title: "Οικονομικά",
    items: [
      { href: "/staff/statistics/", label: "Στατιστικά", match: "/staff/statistics" },
      { href: "/staff/expenses/", label: "Έξοδα", match: "/staff/expenses" },
      { href: "/staff/payroll/", label: "Μισθοδοσία", match: "/staff/payroll" },
    ],
  },
];

function isActive(pathname: string, item: NavItem) {
  if (!item.match) return false;
  const path = pathname.replace(/\/+$/, "") || "/";
  if (item.match === "/staff/pyrgos") return path === "/staff/pyrgos";
  return path === item.match || path.startsWith(`${item.match}/`);
}

const base = "rounded-xl px-3 py-2 text-sm whitespace-nowrap";
const idle = `${base} text-[#4b5b70] hover:bg-[#f4f7fa]`;
const active = `${base} bg-[#e9e4fe] font-bold text-[#3b2f8a]`;

/** One shared menu for every module of the control tower (Πύργος ελέγχου). */
export default function PyrgosNav({ wide = "lg" }: { wide?: "lg" | "xl" }) {
  const pathname = usePathname() || "";
  const nav =
    wide === "xl"
      ? "flex w-full gap-1 overflow-x-auto border-b border-[#e3e9f0] bg-white p-3 xl:sticky xl:top-0 xl:h-screen xl:w-56 xl:shrink-0 xl:flex-col xl:overflow-y-auto xl:border-b-0 xl:border-r xl:p-4"
      : "flex w-full gap-1 overflow-x-auto border-b border-[#e3e9f0] bg-white p-3 lg:sticky lg:top-0 lg:h-screen lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-4";
  const desktopOnly = wide === "xl" ? "hidden xl:block" : "hidden lg:block";
  const bottom = wide === "xl" ? "xl:mt-auto" : "lg:mt-auto";

  return (
    <nav aria-label="Μενού πύργου ελέγχου" className={nav}>
      <div className={`${desktopOnly} px-3 pb-3`}>
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5443c9]">Voulamandis House</div>
        <div className="text-lg font-black text-[#1f2a3c]">Πύργος ελέγχου</div>
      </div>
      {groups.map((group) => (
        <div key={group.title} className="contents">
          <div className={`${desktopOnly} px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a97a8]`}>
            {group.title}
          </div>
          {group.items.map((item) => {
            const on = isActive(pathname, item);
            return (
              <a key={item.href} href={item.href} aria-current={on ? "page" : undefined} className={on ? active : idle}>
                {item.label}
              </a>
            );
          })}
        </div>
      ))}
      <a href="/staff/" className={`${idle} ${bottom}`}>
        ← Παλιό staff
      </a>
    </nav>
  );
}
