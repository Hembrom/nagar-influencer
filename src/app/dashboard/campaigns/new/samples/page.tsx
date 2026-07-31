import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ format?: string }> };

/** Samples step removed — reel pick already covers example work. */
export default async function SamplesRedirect({ searchParams }: Props) {
  const { format } = await searchParams;
  const q = format ? `?format=${format}` : "";
  redirect(`/dashboard/campaigns/new/confirm${q}`);
}
