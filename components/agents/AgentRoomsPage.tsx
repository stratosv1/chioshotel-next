import type { LanguageCode } from "@/lib/languages";
import { siteUrl } from "@/lib/seo";
import { AgentRoomsGuide } from "@/components/agents/AgentRoomsGuide";
import {
  agentRoomGuideCopy,
  agentRoomGuidePaths,
  getAgentLanguageTag,
} from "@/content/agent-room-guide";
import {
  agentRoomGuideExtras,
  buildAgentGuideFaq,
  computeAgentGuideStats,
} from "@/content/agent-room-guide-extras";
import { getAgentRoomGuideData } from "@/lib/agent-room-guide-data";

type Props = {
  language: LanguageCode;
};

function absolute(path: string) {
  return new URL(path, siteUrl).toString();
}

export async function AgentRoomsPage({ language }: Props) {
  const { rooms, commonAmenities } = await getAgentRoomGuideData();
  const copy = agentRoomGuideCopy[language];
  const extras = agentRoomGuideExtras[language];
  const stats = computeAgentGuideStats(rooms);
  const faq = buildAgentGuideFaq(language, stats);
  const pageUrl = absolute(agentRoomGuidePaths[language]);
  const homePath = language === "en" ? "/" : `/${language}/`;
  const pageImages = rooms
    .map((room) => room.gallery[0])
    .filter(Boolean)
    .map((path) => absolute(path));

  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: copy.seo.title,
    description: copy.seo.description,
    url: pageUrl,
    inLanguage: getAgentLanguageTag(language),
    primaryImageOfPage: pageImages[0],
    image: pageImages,
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    isPartOf: {
      "@type": "WebSite",
      name: "Voulamandis House",
      url: absolute("/"),
    },
    about: {
      "@type": "LodgingBusiness",
      name: "Voulamandis House",
      url: absolute("/"),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kampos",
        addressRegion: "Chios",
        addressCountry: "GR",
      },
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Travel agents and tour operators",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: rooms.length,
      itemListElement: rooms.map((room, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Accommodation",
          name: `${room.roomType === "apartment" ? copy.labels.apartment : copy.labels.room} ${room.roomNumber}`,
          url: `${pageUrl}#room-${room.roomNumber}`,
          numberOfRooms: room.spaceLayout === "one_space" ? 1 : 2,
          occupancy: {
            "@type": "QuantitativeValue",
            maxValue: room.maxGuests,
          },
          floorSize: {
            "@type": "QuantitativeValue",
            value: room.sizeM2,
            unitCode: "MTK",
          },
          amenityFeature: [
            {
              "@type": "LocationFeatureSpecification",
              name: copy.labels.beds,
              value: Object.entries(room.bedSetup)
                .map(([key, count]) => {
                  const labels = copy.beds[key] || [key, key];
                  return `${count} ${labels[count === 1 ? 0 : 1]}`;
                })
                .join(" + "),
            },
            ...commonAmenities.map((amenity) => ({
              "@type": "LocationFeatureSpecification",
              name: copy.amenities[amenity.key] || amenity.label,
              value: true,
            })),
          ],
          image: room.gallery.map((path) => absolute(path)),
        },
      })),
    },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      webPage,
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: extras.breadcrumbHome, item: absolute(homePath) },
          { "@type": "ListItem", position: 2, name: extras.breadcrumbAgents, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: getAgentLanguageTag(language),
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentRoomsGuide
        language={language}
        copy={copy}
        rooms={rooms}
        commonAmenities={commonAmenities}
        extras={extras}
        stats={stats}
        faq={faq}
      />
    </>
  );
}
