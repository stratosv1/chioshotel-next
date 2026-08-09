import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Temporary compatibility alias for the original Greek Trip Planner URL.
 * The active planner currently lives at /trip-planner/ while localization is
 * being rebuilt on top of the current mobile-first flow.
 */
export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== "el") {
    notFound();
  }

  redirect("/trip-planner/");
}
