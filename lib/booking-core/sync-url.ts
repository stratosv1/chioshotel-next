import { siteUrl } from "@/lib/site-url";

// URL of the Booking Core sync endpoint for server-side on-demand refreshes.
//
// The refresh call carries CRON_SECRET, so in production it must always go to
// the canonical site and never to an origin derived from the incoming request
// (the Host header is client-controlled). Preview and local deployments call
// their own origin so they keep refreshing their own inventory.
export function bookingCoreSyncUrl(requestOrigin: string) {
  const base = process.env.VERCEL_ENV === "production" ? siteUrl : requestOrigin;
  return new URL("/api/booking-core/sync/", base);
}
