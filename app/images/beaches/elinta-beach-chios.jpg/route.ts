const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/f/fb/Elinda_beach.jpg";

export const revalidate = 86400;

export async function GET() {
  const response = await fetch(imageUrl, { next: { revalidate: 86400 } });

  if (!response.ok) {
    return new Response("Image unavailable", { status: 502 });
  }

  return new Response(await response.arrayBuffer(), {
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "Content-Type": "image/jpeg",
      "X-Image-Attribution": "Asterious / Wikimedia Commons / CC BY-SA 4.0",
    },
  });
}
