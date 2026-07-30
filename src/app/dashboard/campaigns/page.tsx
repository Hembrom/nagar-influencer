import Link from "next/link";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { BOOKING } from "@/lib/formats";

const DEMO_CAMPAIGNS = [
  {
    id: BOOKING.orderId,
    name: BOOKING.packageName,
    format: "YouTube Video",
    status: "Representative Assigned",
    token: BOOKING.tokenAmount,
    updated: "Today",
  },
];

export default function CampaignsPage() {
  return (
    <PageFrame
      title="All campaigns"
      subtitle="Every booking and live campaign in your workspace"
      actions={
        <Link
          href="/dashboard/campaigns/new"
          className="rounded-xl bg-orange px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(255,107,43,0.3)] transition hover:bg-[#f05f20]"
        >
          New campaign
        </Link>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-[11px] font-bold tracking-wider text-muted-light uppercase">
            <tr>
              <th className="px-5 py-3.5">Campaign</th>
              <th className="px-5 py-3.5">Format</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Token</th>
              <th className="px-5 py-3.5">Updated</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {DEMO_CAMPAIGNS.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-5 py-4">
                  <p className="font-bold text-navy">{c.name}</p>
                  <p className="text-xs text-muted">ID: {c.id}</p>
                </td>
                <td className="px-5 py-4 text-muted">{c.format}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-orange-soft px-2.5 py-1 text-xs font-bold text-orange">
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-green">
                  ₹{c.token}
                </td>
                <td className="px-5 py-4 text-muted">{c.updated}</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/dashboard/campaigns/${c.id}`}
                    className="font-semibold text-purple hover:underline"
                  >
                    Track
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageFrame>
  );
}
