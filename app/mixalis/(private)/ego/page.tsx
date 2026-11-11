import { redirect } from "next/navigation";

/** Backward-compatible short link for the work-energy lesson. */
export default function EgoAlias() {
  redirect("/mixalis/ergo");
}
