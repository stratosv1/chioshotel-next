import type { ReactNode } from "react";
import "../css-split/pages/rooms-category.css";
import "../css-split/pages/room-wizard.css";

export default function RouteCssLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
