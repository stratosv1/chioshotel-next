const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "content", "schema.ts");

if (!fs.existsSync(file)) {
  console.error("Missing content/schema.ts");
  process.exit(1);
}

let text = fs.readFileSync(file, "utf8");
const original = text;

text = text.replace(
`      {
        "@type": "ListItem",
        position: 1,
        url: absoluteUrl("/chios-rooms/standard-double-room/"),
        name: "Double Rooms and Triple Rooms in Chios",
        item: {
          "@type": "HotelRoom",
          "@id": schemaId("/chios-rooms/standard-double-room/", "room"),
          name: "Double Rooms and Triple Rooms in Chios",
          url: absoluteUrl("/chios-rooms/standard-double-room/"),
          description:
            "Fully renovated double and triple rooms at Voulamandis House in Kampos, Chios, suitable for up to 4 guests.",
          containedInPlace: hotel,
        },
      },`,
`      {
        "@type": "ListItem",
        position: 1,
        url: absoluteUrl("/chios-rooms/standard-double-room/"),
        name: "Double Rooms and Triple Rooms in Chios",
      },`
);

text = text.replace(
`      {
        "@type": "ListItem",
        position: 2,
        url: absoluteUrl("/chios-rooms/economy-double-rooms/"),
        name: "Economy Double Rooms in Chios",
        item: {
          "@type": "HotelRoom",
          "@id": schemaId("/chios-rooms/economy-double-rooms/", "room"),
          name: "Economy Double Rooms in Chios",
          url: absoluteUrl("/chios-rooms/economy-double-rooms/"),
          description:
            "Economy double rooms at Voulamandis House in Kampos, Chios, ideal for couples or two guests looking for comfortable value-for-money accommodation.",
          containedInPlace: hotel,
        },
      },`,
`      {
        "@type": "ListItem",
        position: 2,
        url: absoluteUrl("/chios-rooms/economy-double-rooms/"),
        name: "Economy Double Rooms in Chios",
      },`
);

text = text.replace(
`      {
        "@type": "ListItem",
        position: 3,
        url: absoluteUrl("/chios-rooms/family-chios-apartments/"),
        name: "Family Chios Apartments",
        item: {
          "@type": "HotelRoom",
          "@id": schemaId("/chios-rooms/family-chios-apartments/", "room"),
          name: "Family Chios Apartments",
          url: absoluteUrl("/chios-rooms/family-chios-apartments/"),
          description:
            "Spacious family apartments at Voulamandis House in Kampos, Chios, with a separate bedroom, kitchen and living area.",
          containedInPlace: hotel,
        },
      },`,
`      {
        "@type": "ListItem",
        position: 3,
        url: absoluteUrl("/chios-rooms/family-chios-apartments/"),
        name: "Family Chios Apartments",
      },`
);

if (text === original) {
  console.log("No changes made. The exact blocks were not found.");
  process.exit(0);
}

fs.writeFileSync(file, text, "utf8");
console.log("UPDATED content/schema.ts");
