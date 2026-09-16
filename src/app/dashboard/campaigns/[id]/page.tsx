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
type TabType = "progress" | "videos" | "dashboard";
type ViewMode = "tabs" | "group-chat";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

type ChatMessage = {
  id: string;
  sender: "user" | "team";
  senderName?: string;
  text: string;
  timestamp: Date;
};

type VideoStats = {
  title: string;
  platform: string;
  views: number;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
  thumbUrl: string;
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

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "aisha",
    name: "Aisha",
    role: "Strategist",
    avatar: "A",
  },
  {
    id: "rahul",
    name: "Rahul",
    role: "Creator Manager",
    avatar: "R",
  },
  {
    id: "priya",
    name: "Priya",
    role: "Content Lead",
    avatar: "P",
  },
];

function TrackerContent() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id || "");
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>("progress");
  const [viewMode, setViewMode] = useState<ViewMode>("tabs");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const c = await getCampaign(id);
      if (!cancelled) {
        setCampaign(c);
        // If campaign is live, default to dashboard tab
        if (c && c.status === "campaign_live") {
          setActiveTab("dashboard");
        }
      }
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
    if (!inputText.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      senderName: "You",
      text: inputText,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    
    // Simulate team response after 1 second
    setTimeout(() => {
      const teamResponses = [
        { name: "Aisha", messages: [
          "Got it! I'm reviewing your campaign brief now.",
          "Your brief looks great. I think we can find perfect creators for this.",
          "Let me check creator availability for your timeline.",
        ]},
        { name: "Rahul", messages: [
          "Thanks for the message! I'm here to help with creator coordination.",
          "I'll make sure we get the best creators for your campaign.",
          "Let me check our creator roster for your needs.",
        ]},
        { name: "Priya", messages: [
          "Great! I can help refine the content strategy.",
          "Based on your message, here are some content ideas...",
          "Let's discuss the creative direction for this campaign.",
        ]},
      ];
      
      const randomTeam = teamResponses[Math.floor(Math.random() * teamResponses.length)];
      const randomMessage = randomTeam.messages[Math.floor(Math.random() * randomTeam.messages.length)];
      
      const teamMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "team",
        senderName: randomTeam.name,
        text: randomMessage,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, teamMessage]);
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
    <div>
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-card border-b border-border p-4 lg:hidden">
        <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
          CAMPAIGN
        </p>
        <h2 className="text-lg font-bold text-navy mt-1">{campaign.packageName}</h2>
        <p className="text-xs text-muted mt-1">{STATUS_LABEL[campaign.status]}</p>
      </div>

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
        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:grid gap-0 lg:grid-cols-[280px_1fr]">
          {/* MERGED SIDEBAR - SECTIONS + TEAM CHAT */}
          <div className="sticky top-0 h-dvh border-r border-border bg-card p-5 flex flex-col overflow-y-auto">
            {/* SECTIONS */}
            <div className="mb-6">
              <p className="text-[10px] font-bold text-muted-light mb-3 uppercase tracking-wider">Sections</p>
              <div className="space-y-2 flex flex-col">
                <button
                  onClick={() => {
                    setViewMode("group-chat");
                    setMessages([]);
                  }}
                  className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                    viewMode === "group-chat"
                      ? "bg-orange text-white"
                      : "bg-background text-navy hover:bg-orange-soft"
                  }`}
                >
                  💬 Chat
                </button>
                {campaign?.status === "campaign_live" && (
                  <button
                    onClick={() => {
                      setViewMode("tabs");
                      setActiveTab("dashboard");
                    }}
                    className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                      activeTab === "dashboard" && viewMode === "tabs"
                        ? "bg-orange text-white"
                        : "bg-background text-navy hover:bg-orange-soft"
                    }`}
                  >
                    📊 Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    setViewMode("tabs");
                    setActiveTab("progress");
                  }}
                  className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                    activeTab === "progress" && viewMode === "tabs"
                      ? "bg-orange text-white"
                      : "bg-background text-navy hover:bg-orange-soft"
                  }`}
                >
                  📈 Progress
                </button>
                <button
                  onClick={() => {
                    setViewMode("tabs");
                    setActiveTab("videos");
                  }}
                  className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                    activeTab === "videos" && viewMode === "tabs"
                      ? "bg-orange text-white"
                      : "bg-background text-navy hover:bg-orange-soft"
                  }`}
                >
                  🎬 Videos
                </button>
              </div>
            </div>

            {/* TEAM CHAT / TEAM MEMBERS */}
            <div className="flex-1 border-t border-border pt-6">
              <p className="text-[10px] font-bold text-muted-light mb-3 uppercase tracking-wider">Team</p>
              <div className="space-y-2">
                {TEAM_MEMBERS.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background p-2 hover:bg-orange-soft transition cursor-pointer"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple text-[10px] font-bold text-white">
                      {member.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-navy truncate">{member.name}</p>
                      <p className="text-[10px] text-muted truncate">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        {/* MAIN CONTENT - Desktop */}
        <div className="hidden lg:block space-y-5 overflow-y-auto">
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

          {/* SHOW GROUP CHAT OR TABS - Desktop and Mobile */}
          {viewMode === "group-chat" ? (
            /* GROUP CHAT PANEL */
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
                  TEAM CHAT
                </p>
                <button
                  onClick={() => setViewMode("tabs")}
                  className="text-xs text-muted hover:text-navy transition"
                >
                  ✕ Close
                </button>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted text-center py-8">
                    👋 Start chatting with your team
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                          msg.sender === "user" ? "bg-orange" : "bg-purple"
                        }`}
                      >
                        {msg.sender === "user" ? "Y" : msg.senderName?.slice(0, 1) || "T"}
                      </div>
                      <div className={`${msg.sender === "user" ? "text-right" : ""}`}>
                        <p className="text-xs font-semibold text-muted">
                          {msg.senderName}
                        </p>
                        <div
                          className={`mt-1 rounded-lg px-3 py-2 text-sm ${
                            msg.sender === "user"
                              ? "bg-orange text-white rounded-tr-none"
                              : "bg-background text-navy rounded-tl-none border border-border"
                          }`}
                        >
                          {msg.text}
                        </div>
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
          ) : activeTab === "dashboard" ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="mb-6 text-xs font-bold tracking-[0.08em] text-muted-light">
                  CAMPAIGN PERFORMANCE
                </p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs text-muted-light font-semibold">Total Views</p>
                    <p className="mt-2 text-2xl font-bold text-navy">24.5K</p>
                    <p className="mt-1 text-xs text-green">↑ 12% vs last week</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs text-muted-light font-semibold">Engagement</p>
                    <p className="mt-2 text-2xl font-bold text-orange">3.2%</p>
                    <p className="mt-1 text-xs text-green">↑ 0.8% vs last week</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs text-muted-light font-semibold">Likes</p>
                    <p className="mt-2 text-2xl font-bold text-purple">842</p>
                    <p className="mt-1 text-xs text-muted">+120 today</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs text-muted-light font-semibold">Comments</p>
                    <p className="mt-2 text-2xl font-bold text-teal">156</p>
                    <p className="mt-1 text-xs text-muted">+32 today</p>
                  </div>
                </div>

                {/* Videos Performance */}
                <p className="mb-4 text-sm font-semibold text-navy">Video Performance</p>
                <div className="space-y-3">
                  {[
                    {
                      title: "Instagram Reel",
                      platform: "Instagram",
                      views: 12400,
                      engagement: 3.8,
                      likes: 480,
                      comments: 92,
                      shares: 34,
                    },
                    {
                      title: "YouTube Short",
                      platform: "YouTube",
                      views: 8200,
                      engagement: 2.9,
                      likes: 240,
                      comments: 48,
                      shares: 18,
                    },
                    {
                      title: "TikTok Video",
                      platform: "TikTok",
                      views: 3900,
                      engagement: 2.1,
                      likes: 122,
                      comments: 16,
                      shares: 8,
                    },
                  ].map((video) => (
                    <div
                      key={video.title}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-navy">{video.title}</p>
                          <p className="text-xs text-muted">{video.platform}</p>
                          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                            <div>
                              <p className="text-xs text-muted-light">Views</p>
                              <p className="mt-1 font-bold text-navy">
                                {(video.views / 1000).toFixed(1)}K
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-light">Engagement</p>
                              <p className="mt-1 font-bold text-orange">
                                {video.engagement}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-light">Likes</p>
                              <p className="mt-1 font-bold text-purple">{video.likes}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-light">Comments</p>
                              <p className="mt-1 font-bold text-teal">{video.comments}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-light">Shares</p>
                              <p className="mt-1 font-bold text-green">{video.shares}</p>
                            </div>
                          </div>
                        </div>
                        <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === "progress" ? (
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
        </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="lg:hidden">
          {/* Show card menu if no content selected */}
          {viewMode === "tabs" && !activeTab && (
            <div className="space-y-3">
              {/* TEAM CHAT CARD */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <button
                  onClick={() => setViewMode("group-chat")}
                  className="w-full text-left"
                >
                  <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
                    WORKING ON THIS
                  </p>
                  <p className="mt-2 text-sm font-semibold text-navy">
                    Team Chat
                  </p>
                  <p className="text-xs text-muted mt-2">
                    {TEAM_MEMBERS.length} team members
                  </p>
                </button>
              </div>

              {/* DASHBOARD CARD (if live) */}
              {campaign?.status === "campaign_live" && (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <button
                    onClick={() => {
                      setViewMode("tabs");
                      setActiveTab("dashboard");
                    }}
                    className="w-full text-left"
                  >
                    <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
                      PERFORMANCE
                    </p>
                    <p className="mt-2 text-sm font-semibold text-navy">
                      Dashboard
                    </p>
                    <p className="text-xs text-muted mt-2">
                      View live video performance
                    </p>
                  </button>
                </div>
              )}

              {/* PROGRESS CARD */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <button
                  onClick={() => {
                    setViewMode("tabs");
                    setActiveTab("progress");
                  }}
                  className="w-full text-left"
                >
                  <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
                    WORKFLOW
                  </p>
                  <p className="mt-2 text-sm font-semibold text-navy">
                    Progress
                  </p>
                  <p className="text-xs text-muted mt-2">
                    Campaign status & timeline
                  </p>
                </button>
              </div>

              {/* VIDEOS CARD */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <button
                  onClick={() => {
                    setViewMode("tabs");
                    setActiveTab("videos");
                  }}
                  className="w-full text-left"
                >
                  <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
                    DELIVERABLES
                  </p>
                  <p className="mt-2 text-sm font-semibold text-navy">
                    Videos
                  </p>
                  <p className="text-xs text-muted mt-2">
                    Delivered & pending content
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Show content when selected */}
          {viewMode === "group-chat" && (
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold tracking-[0.08em] text-muted-light">
                  TEAM CHAT
                </p>
                <button
                  onClick={() => setViewMode("tabs")}
                  className="text-xs text-muted hover:text-navy transition"
                >
                  ✕ Back
                </button>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted text-center py-8">
                    👋 Start chatting with your team
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                          msg.sender === "user" ? "bg-orange" : "bg-purple"
                        }`}
                      >
                        {msg.sender === "user" ? "Y" : msg.senderName?.slice(0, 1) || "T"}
                      </div>
                      <div className={`flex-1 rounded-lg px-3 py-2 ${msg.sender === "user" ? "bg-orange text-white" : "bg-background text-navy"}`}>
                        <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <button 
                  onClick={handleSendMessage}
                  className="rounded-lg bg-orange px-3 py-2 text-xs font-semibold text-white"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Show tabs content */}
          {viewMode === "tabs" && activeTab && (
            <div>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setViewMode("tabs")}
                  className="text-sm font-semibold text-muted hover:text-navy"
                >
                  ← Back
                </button>
              </div>
              
              {activeTab === "dashboard" && (
                <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
                  {/* Dashboard content */}
                  <div>
                    <p className="text-sm font-bold text-navy mb-3">Campaign Performance</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-xs text-muted">Total Views</p>
                        <p className="text-lg font-bold text-navy mt-1">2.4K</p>
                      </div>
                      <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-xs text-muted">Engagement</p>
                        <p className="text-lg font-bold text-orange mt-1">8.2%</p>
                      </div>
                      <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-xs text-muted">Likes</p>
                        <p className="text-lg font-bold text-purple mt-1">156</p>
                      </div>
                      <div className="rounded-lg border border-border p-3 text-center">
                        <p className="text-xs text-muted">Comments</p>
                        <p className="text-lg font-bold text-green mt-1">42</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "progress" && (
                <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
                  {stepStates(campaign.status).map((state, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${
                          state === "done" ? "text-green" : state === "active" ? "text-orange" : "text-muted"
                        }`}>
                          {FLOW[i].title}
                        </p>
                        <p className="text-xs text-muted mt-1">{FLOW[i].subtitle}</p>
                      </div>
                      <div className="mt-1">
                        {state === "done" && <span className="text-green font-bold">✓</span>}
                        {state === "active" && <span className="text-orange font-bold">●</span>}
                        {state === "pending" && <span className="text-muted font-bold">○</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "videos" && (
                <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
                  {/* Delivered Videos */}
                  <div>
                    <p className="text-sm font-semibold text-green mb-3">Delivered</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 rounded-lg border border-green/30 bg-green/5 p-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-200" />
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
                    <p className="text-sm font-semibold text-orange mb-3">Pending</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 rounded-lg border border-orange/30 bg-orange/5 p-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-200" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-navy">YouTube Video</p>
                          <p className="text-xs text-muted">Expected Sep 20</p>
                        </div>
                        <span className="text-xs font-bold text-orange">●</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </PageFrame>
    </div>
  );
}

export default function CampaignTrackerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Loading…</div>}>
      <TrackerContent />
    </Suspense>
  );
}
