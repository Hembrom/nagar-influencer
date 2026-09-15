import { PageFrame } from "@/components/dashboard/PageFrame";

const CAMPAIGN_THREADS = [
  {
    id: "1",
    campaignName: "Product · Instagram Reel",
    status: "representative_assigned",
    statusLabel: "Representative Assigned",
    agents: [
      { name: "Aisha", role: "Strategist" },
      { name: "Rahul", role: "Creator Manager" },
    ],
    lastMessage: "I'll join your dashboard shortly to lock the brief.",
    lastMessageTime: "2h ago",
    lastMessageFrom: "Aisha",
    unread: true,
    messageCount: 3,
  },
  {
    id: "2",
    campaignName: "Service Launch · YouTube Video",
    status: "campaign_finalized",
    statusLabel: "Campaign Finalized",
    agents: [
      { name: "Aisha", role: "Strategist" },
      { name: "Rahul", role: "Creator Manager" },
    ],
    lastMessage: "Video guidelines and delivery dates locked.",
    lastMessageTime: "Yesterday",
    lastMessageFrom: "Rahul",
    unread: false,
    messageCount: 12,
  },
];

export default function MessagesPage() {
  return (
    <PageFrame
      title="Messages"
      subtitle="Campaign conversations and agent updates"
    >
      <div className="space-y-4">
        {CAMPAIGN_THREADS.map((campaign) => (
          <div
            key={campaign.id}
            className={`rounded-2xl border transition ${
              campaign.unread
                ? "border-orange bg-orange-soft/30"
                : "border-border bg-card"
            }`}
          >
            {/* Header - Campaign Info */}
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-navy">{campaign.campaignName}</p>
                  <p className="mt-1 text-xs font-semibold text-orange">
                    {campaign.statusLabel}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-background px-3 py-1 text-xs font-bold text-muted">
                  {campaign.messageCount} messages
                </span>
              </div>

              {/* Agents */}
              <div className="mt-3 flex gap-2">
                {campaign.agents.map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-center gap-2 rounded-lg bg-background px-3 py-2"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple text-xs font-bold text-white">
                      {agent.name.slice(0, 1)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy">{agent.name}</p>
                      <p className="text-[10px] text-muted">{agent.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Last Message Preview */}
            <div className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
                  {campaign.lastMessageFrom.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted-light">
                    {campaign.lastMessageFrom}
                  </p>
                  <p className="mt-1 truncate text-sm text-navy">
                    {campaign.lastMessage}
                  </p>
                  <p className="mt-2 text-xs text-muted-light">
                    {campaign.lastMessageTime}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-border px-6 py-3">
              <button className="w-full rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#f05f20]">
                View Conversation →
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}
