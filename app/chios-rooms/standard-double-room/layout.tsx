import type { ReactNode } from "react";
import "../../css-split/pages/room-detail.css";
import "../../css-split/pages/room-detail-cards.css";
import "../../css-split/pages/room-detail-floor-groups.css";
import "../../css-split/pages/room-detail-i18n-fix.css";
import "../../css-split/overrides/room-detail-mobile-compact.css";

export default function RouteCssLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
