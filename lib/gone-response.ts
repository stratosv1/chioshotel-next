export function goneResponse() {
  return new Response("Gone", {
    status: 410,
    headers: {
      "Cache-Control": "public, max-age=86400",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
