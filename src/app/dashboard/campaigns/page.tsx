"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/dashboard/PageFrame";
import {
  formatRelativeDate,
  listCampaigns,
  STATUS_LABEL,
  type Campaign,
} from "@/lib/campaigns";
import { getFormat } from "@/lib/formats";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const list = await listCampaigns();
      if (!cancelled) {
        setCampaigns(list);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      {loading ? (
        <div className="py-16 text-center text-sm text-muted">
          Loading your campaigns…
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="text-base font-bold text-navy">No campaigns yet</p>
          <p className="mt-2 text-sm text-muted">
            Create a campaign and pay the ₹500 token — a new trackable order
            will show up here for this account only.
          </p>
          <Link
            href="/dashboard/campaigns/new"
            className="mt-6 inline-flex rounded-xl bg-orange px-5 py-2.5 text-sm font-bold text-white"
          >
            Start new campaign
          </Link>
        </div>
      ) : (
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
              {campaigns.map((c) => (
                <tr key={c.orderId} className="border-b border-border last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-bold text-navy">{c.packageName}</p>
                    <p className="font-mono text-xs text-muted" title={c.orderId}>
                      {c.orderId}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {getFormat(c.formatId).title}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-orange-soft px-2.5 py-1 text-xs font-bold text-orange">
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-green">
                    ₹{c.tokenAmount}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {formatRelativeDate(c.updatedAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/campaigns/${c.orderId}`}
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
      )}
    </PageFrame>
  );
}
