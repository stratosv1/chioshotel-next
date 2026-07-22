import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Voulamandis House",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-16">
      <h1>Privacy Policy</h1>
      <p>Analytics is optional and runs only after consent.</p>
    </main>
  );
}
