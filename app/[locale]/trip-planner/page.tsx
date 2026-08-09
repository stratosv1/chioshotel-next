import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Compatibility alias for the original Greek Trip Planner URL.
 * Keep this lightweight until the current planner flow is localized.
 */
export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "el") {
    notFound();
  }

  redirect("/trip-planner/");
}
