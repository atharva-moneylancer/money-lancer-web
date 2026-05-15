import { redirect } from "next/navigation";

// NFO page removed — redirect any stale links back to the funds hub.
export default function NfoRedirect() {
  redirect("/funds");
}
