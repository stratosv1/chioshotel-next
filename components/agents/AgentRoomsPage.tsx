import type { LanguageCode } from "@/lib/languages";
import { siteUrl } from "@/lib/seo";
import { AgentRoomsGuide } from "@/components/agents/AgentRoomsGuide";
import {
  agentRoomGuideCopy,
  agentRoomGuidePaths,
  getAgentLanguageTag,
} from "@/content/agent-room-guide";
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.seo.title,
    description: copy.seo.description,
    url: absolute(agentRoomGuidePaths[language]),
    inLanguage: getAgentLanguageTag(language),
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
      />
    </>
  );
}
