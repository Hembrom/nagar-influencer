import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ format?: string }> };

export default async function BrandsConfirmRedirect({ searchParams }: Props) {
  const { format } = await searchParams;
  const q = format ? `?format=${format}` : "";
  redirect(`/dashboard/campaigns/new/confirm${q}`);
}
