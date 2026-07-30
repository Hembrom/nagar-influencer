import { redirect } from "next/navigation";

export default function BrandsRedirect() {
  redirect("/dashboard/campaigns/new");
}
