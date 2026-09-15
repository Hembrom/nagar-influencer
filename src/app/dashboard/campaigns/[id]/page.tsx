"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  getCampaign,
  STATUS_LABEL,
  type Campaign,
  type CampaignStatus,
} from "@/lib/campaigns";

type StepState = "done" | "active" | "pending";
type TabType = "progress" | "videos";
type Agent = "aisha" | "rahul" | null;

type ChatMessage = {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
};

const FLOW: {
  status: CampaignStatus;
  title: string;
  subtitle: string;
}[] = [
  {
    status: "order_placed",
    title: "Order Placed",
    subtitle: "Token of ₹500 received",
  },
  {
    status: "representative_assigned",
    title: "Representative Assigned",
    subtitle: "Strategist joining your dashboard soon",
  },
  {
    status: "campaign_finalized",
    title: "Campaign Finalized",
    subtitle: "Video guidelines and delivery dates locked",
  },
  {
    status: "campaign_live",
    title: "Campaign Live",
    subtitle: "Creator uploads dedicated video content",
  },
];

function stepStates(status: CampaignStatus): StepState[] {
  const idx = FLOW.findIndex((s) => s.status === status);
  const active = idx < 0 ? 0 : idx;
  return FLOW.map((_, i) => {
    if (i < active) return "done";
    if (i === active) return i === 0 ? "done" : "active";
    return "pending";
  }).map((state, i) => {
    if (status === "order_placed") {
      if (i === 0) return "done";
      if (i === 1) return "active";
      return "pending";
    }
    return state;
  });
}

function TrackerContent() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id || "");
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>("progress");
  const [activeAgent, setActiveAgent] = useState<Agent>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const c = await getCampaign(id);
      if (!cancelled) setCampaign(c);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const states = useMemo(
    () => (campaign ? stepStates(campaign.status) : []),
    [campaign],
  );

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeAgent) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    
    // Simulate agent response after 1 second
    setTimeout(() => {
      const agentName = activeAgent === "aisha" ? "Aisha" : "Rahul";
      const responses = {
        aisha: [
          "Got it! I'm reviewing your campaign brief now.",
          "Your brief looks great. I think we can find perfect creators for this.",
          "Let me check creator availability for your timeline.",
        ],
        rahul: [
          "Thanks for the message! I'm here to help with creator coordination.",
          "I'll make sure we get the best creators for your campaign.",
          "Let me check our creator roster for your needs.",
        ],
      };
      
      const agentResponses = responses[activeAgent];
      const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
      
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: randomResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, agentMessage]);
    }, 1000);
  };

  if (campaign === undefined) {
    return <div className="p-8 text-muted">Loading tracker…</div>;
  }

  if (!campaign) {
    return (
      <PageFrame title="Campaign tracker" subtitle="Order not found">
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
          <p className="font-bold text-navy">No campaign with ID {id}</p>
          <p className="mt-2 text-sm text-muted">
            Complete payment on a new campaign to create a trackable order.
          </p>
          <Link
            href="/dashboard/campaigns"
            className="mt-5 inline-flex text-sm font-semibold text-purple hover:underline"
          >
            ← All campaigns
          </Link>
        </div>
      </PageFrame>
    );
  }

  return (
    <PageFrame
      title="Campaign tracker"
      subtitle="Live tracking of your slot reservation & callback"
      footer={
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <PrimaryButton variant="purple" href="/dashboard/messages">
              Need help? Message us
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="grid gap-0 lg:grid-cols-[240px_1fr]">
        {/* LEFT SIDEBAR - AGENTS */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 text-xs font-bold tracking-[0.08em] text-muted-light">
            WORKING ON THIS
          </p>
          <div className="space-y-3">
            {/* Agent 1 */}
            <button
              onClick={() => {
                setActiveAgent("aisha");
                setMessages([]);
              }}
              className={`w-full flex items-center gap-3 rounded-lg border p-3 transition cursor-pointer ${
                activeAgent === "aisha"
                  ? "border-orange bg-orange-soft"
                  : "border-border bg-background hover:bg-orange-soft hover:border-orange"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple text-xs font-bold text-white flex-shrink-0">
                A
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-navy">Aisha</p>
                <p className="text-xs text-muted">Strategist</p>
              </div>
            </button>
            {/* Agent 2 */}
            <button
              onClick={() => {
                setActiveAgent("rahul");
                setMessages([]);
              }}
              className={`w-full flex items-center gap-3 rounded-lg border p-3 transition cursor-pointer ${
                activeAgent === "rahul"
                  ? "border-orange bg-orange-soft"
                  : "border-border bg-background hover:bg-orange-soft hover:border-orange"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange text-xs font-bold text-white flex-shrink-0">
                R
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-navy">Rahul</p>
                <p className="text-xs text-muted">Creator Manager</p>
              </div>
            </button>
          </div>

          {/* TAB TABS */}
          <div className="mt-8 space-y-2 border-t border-border pt-6">
            <button
              onClick={() => setActiveTab("progress")}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeTab === "progress"
                  ? "bg-orange text-white"
                  : "bg-background text-navy hover:bg-orange-soft"
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeTab === "videos"
                  ? "bg-orange text-white"
                  : "bg-background text-navy hover:bg-orange-soft"
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="space-y-5">
          {/* CAMPAIGN HEADER */}
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5">
            <div>
              <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
                ACTIVE CAMPAIGN
              </p>
              <p className="mt-1 text-lg font-bold text-navy">
                {campaign.packageName}
              </p>
              <p className="mt-1 text-xs text-muted">
                {STATUS_LABEL[campaign.status]}
              </p>
            </div>
            <span className="rounded-full bg-orange-soft px-3 py-1 text-xs font-bold text-orange">
              ID: {campaign.orderId}
            </span>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "progress" ? (
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="mb-6 text-xs font-bold tracking-[0.08em] text-muted-light">
                LIVE PROGRESS
              </p>
              <ol>
                {FLOW.map((step, i) => {
                  const state = states[i];
                  const isLast = i === FLOW.length - 1;
                  const lineColor =
                    state === "done" ? "bg-green" : "bg-[#e5e7eb]";
                  const titleColor =
                    state === "active"
                      ? "text-orange"
                      : state === "done"
                        ? "text-navy"
                        : "text-muted";

                  return (
                    <li
                      key={step.title}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {!isLast ? (
                        <span
                          className={`absolute top-8 left-[13px] h-[calc(100%-1.5rem)] w-0.5 ${lineColor}`}
                        />
                      ) : null}
                      {state === "done" ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green text-white">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      ) : state === "active" ? (
                        <span className="animate-pulse-soft flex h-7 w-7 items-center justify-center rounded-full bg-orange">
                          <span className="h-2 w-2 rounded-full bg-white" />
                        </span>
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5e7eb]">
                          <span className="h-2 w-2 rounded-full bg-[#9ca3af]" />
                        </span>
                      )}
                      <div>
                        <p className={`text-base font-bold ${titleColor}`}>
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted">{step.subtitle}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="mb-6 text-xs font-bold tracking-[0.08em] text-muted-light">
                VIDEOS
              </p>
              <div className="space-y-4">
                {/* Delivered Videos */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-navy">Delivered</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-lg border border-green/30 bg-green/5 p-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-200" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy">Instagram Reel</p>
                        <p className="text-xs text-muted">Delivered today</p>
                      </div>
                      <span className="text-xs font-bold text-green">✓</span>
                    </div>
                  </div>
                </div>

                {/* Pending Videos */}
                <div>
                  <p className="mb-3 text-sm font-semibold text-navy">Pending</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-lg border border-orange/30 bg-orange/5 p-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-200" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy">YouTube Video</p>
                        <p className="text-xs text-muted">Expected Sep 20</p>
                      </div>
                      <span className="text-xs font-bold text-orange">●</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-200" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy">Product Review</p>
                        <p className="text-xs text-muted">Awaiting brief finalization</p>
                      </div>
                      <span className="text-xs font-bold text-muted">○</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAT PANEL */}
          {activeAgent && (
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col h-[500px]">
              <p className="mb-4 text-xs font-bold tracking-[0.08em] text-muted-light">
                CHAT WITH {activeAgent === "aisha" ? "AISHA" : "RAHUL"}
              </p>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted text-center py-8">
                    👋 Start a conversation with {activeAgent === "aisha" ? "Aisha" : "Rahul"}
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          msg.sender === "user"
                            ? "bg-orange text-white rounded-br-none"
                            : "bg-background text-navy rounded-bl-none border border-border"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-navy text-sm placeholder-muted focus:outline-none focus:border-orange"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="px-4 py-2 rounded-lg bg-orange text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f05f20]"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageFrame>
  );
}

export default function CampaignTrackerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Loading…</div>}>
      <TrackerContent />
    </Suspense>
  );
}
