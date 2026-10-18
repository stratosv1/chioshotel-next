import { sanitizeJsonLd } from "@/lib/schema-sanitize";

type JsonLdProps = {
  data: unknown;
};

export function JsonLd({ data }: JsonLdProps) {
  if (!data) {
    return null;
  }

  const json = JSON.stringify(sanitizeJsonLd(data)).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
