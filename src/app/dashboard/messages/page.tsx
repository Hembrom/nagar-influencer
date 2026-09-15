"use client";

import { useState } from "react";
import { PageFrame } from "@/components/dashboard/PageFrame";

type Message = {
  id: string;
  sender: "user" | "agent";
  senderName: string;
  text: string;
  time: string;
};

const CAMPAIGNS = [
  {
    id: "1",
    name: "Product · Instagram Reel",
    status: "Representative Assigned",
    agents: ["Aisha", "Rahul"],
    unread: true,
    messages: [
      {
        id: "1",
        sender: "agent",
        senderName: "Aisha",
        text: "Hi! I've received your campaign brief. Let me review it quickly.",
        time: "2h ago",
      },
      {
        id: "2",
        sender: "user",
        senderName: "You",
        text: "Great! Let me know if you need any clarifications.",
        time: "1h 55m ago",
      },
      {
        id: "3",
        sender: "agent",
        senderName: "Rahul",
        text: "I'll join your dashboard shortly to lock the brief.",
        time: "2h ago",
      },
    ],
  },
  {
    id: "2",
    name: "Service Launch · YouTube Video",
    status: "Campaign Finalized",
    agents: ["Aisha", "Rahul"],
    unread: false,
    messages: [
      {
        id: "1",
        sender: "agent",
        senderName: "Rahul",
        text: "Your campaign is all set! Video guidelines locked.",
        time: "Yesterday",
      },
      {
        id: "2",
        sender: "agent",
        senderName: "Aisha",
        text: "Delivery window: Sep 18-22. Our creator starts filming tomorrow.",
        time: "Yesterday",
      },
    ],
  },
];

export default function MessagesPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(CAMPAIGNS[0].id);
  const [inputText, setInputText] = useState("");

  const selectedCampaign = CAMPAIGNS.find((c) => c.id === selectedCampaignId);

  return (
    <PageFrame title="Messages" subtitle="Campaign conversations">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* SIDEBAR - CAMPAIGN LIST */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {CAMPAIGNS.map((campaign) => (
            <button
              key={campaign.id}
              onClick={() => setSelectedCampaignId(campaign.id)}
              className={`w-full border-b border-border px-4 py-4 text-left transition last:border-0 ${
                selectedCampaignId === campaign.id
                  ? "bg-orange-soft"
                  : "hover:bg-background"
              } ${campaign.unread ? "bg-purple-soft/20" : ""}`}
            >
              <p className="font-semibold text-navy">{campaign.name}</p>
              <p className="mt-1 text-xs text-orange">{campaign.status}</p>
              <div className="mt-2 flex gap-1">
                {campaign.agents.map((agent) => (
                  <span
                    key={agent}
                    className="inline-block rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-muted"
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* MAIN CHAT */}
        {selectedCampaign && (
          <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
            {/* HEADER */}
            <div className="border-b border-border px-6 py-4">
              <p className="font-bold text-navy">{selectedCampaign.name}</p>
              <p className="mt-1 text-xs text-muted">{selectedCampaign.status}</p>
              <div className="mt-2 flex gap-2">
                {selectedCampaign.agents.map((agent) => (
                  <div
                    key={agent}
                    className="flex items-center gap-1 rounded-lg bg-background px-2 py-1"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple text-[10px] font-bold text-white">
                      {agent.slice(0, 1)}
                    </div>
                    <span className="text-xs font-semibold text-navy">{agent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto space-y-4 px-6 py-5">
              {selectedCampaign.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      msg.sender === "user" ? "bg-orange" : "bg-purple"
                    }`}
                  >
                    {msg.senderName.slice(0, 1)}
                  </div>
                  <div
                    className={`max-w-xs ${msg.sender === "user" ? "text-right" : ""}`}
                  >
                    <p className="text-xs font-semibold text-muted">
                      {msg.senderName}
                    </p>
                    <div
                      className={`mt-1 rounded-xl px-4 py-2 text-sm ${
                        msg.sender === "user"
                          ? "bg-orange text-white rounded-tr-none"
                          : "bg-background text-navy border border-border rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className="mt-1 text-xs text-muted">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="border-t border-border p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Write a message…"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-orange"
                />
                <button className="rounded-xl bg-orange px-5 py-3 text-sm font-bold text-white transition hover:bg-[#f05f20]">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageFrame>
  );
}
