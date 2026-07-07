const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

// Ensure RoomCard receives copy in destructuring
s = s.replace(
  /function RoomCard\(\{\s*room,\s*active,\s*index,\s*amount,\s*onSelect,\s*\}: \{/,
  `function RoomCard({
  room,
  active,
  index,
  amount,
  onSelect,
  copy,
}: {`
);

// Ensure RoomCard prop type includes copy
s = s.replace(
  /  amount: number \| null;\s*\n  onSelect: \(\) => void;\s*\n\}\) \{/,
  `  amount: number | null;
  onSelect: () => void;
  copy: (typeof LIVE_REQUEST_COPY)[LiveRequestLocale];
}) {`
);

// Ensure localized vars exist inside RoomCard
if (!s.includes("const roomName = localizeRoomName(room.displayName, copy);")) {
  s = s.replace(
    /function RoomCard\([\s\S]*?\}\) \{/,
    (match) => `${match}
  const roomName = localizeRoomName(room.displayName, copy);
  const roomType = localizeRoomType(room.type, copy);
  const primaryBadge = localizeBadge(room.primaryBadge, copy);
  const featureBadges = room.featureBadges.map((badge) => localizeBadge(badge, copy));`
  );
}

// Ensure RoomCard call passes copy
s = s.replace(
  /<RoomCard\s*\n\s*key=\{roomKey\(room\)\}\s*\n\s*room=\{room\}\s*\n\s*index=\{index\}/,
  `<RoomCard
                      key={roomKey(room)}
                      room={room}
                      copy={copy}
                      index={index}`
);

fs.writeFileSync(file, s, "utf8");
console.log("Fixed RoomCard localized variables.");
