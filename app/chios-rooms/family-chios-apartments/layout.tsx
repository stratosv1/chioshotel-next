import type { ReactNode } from "react";
import "../../css-split/pages/room-detail.css";
import "../../css-split/pages/room-detail-cards.css";
import "../../css-split/pages/room-detail-i18n-fix.css";

export default function RouteCssLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
