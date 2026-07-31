"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { buildChatBrief, saveChatBrief } from "@/lib/recommend";

type Role = "assistant" | "user";

type Msg = {
  id: string;
  role: Role;
  text: string;
};

const OPENING: Msg = {
  id: "m0",
  role: "assistant",
  text: "Hey — tell me about your store or product. What are you building, who is it for, and what’s the story behind it?",
};

export default function NewCampaignChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([OPENING]);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text || typing || done) return;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text },
    ]);
    setInput("");
    setDone(true);
    setTyping(true);

    const brief = buildChatBrief(text, text);
    saveChatBrief(brief);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Got it. I’ll pull the best-fit creators and show you up to 5 of their existing reels — pick the style you love.",
        },
      ]);
      setTyping(false);
    }, 500);

    window.setTimeout(() => {
      router.push("/dashboard/campaigns/new/reels");
    }, 1400);
  }

  return (
    <PageFrame
      title="New campaign"
      subtitle="Share your product story — we’ll match influencers and show you reels to like"
    >
      <div className="mx-auto flex h-[min(680px,calc(100dvh-220px))] max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple text-xs font-extrabold text-white">
            NI
          </div>
          <div>
            <p className="text-sm font-bold text-navy">Campaign matcher</p>
            <p className="text-[11px] text-muted">
              {done ? "Finding creators…" : "Usually replies instantly"}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-md bg-purple text-white"
                    : "rounded-bl-md bg-background text-navy"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing ? (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-background px-4 py-3 text-sm text-muted">
                <span className="inline-flex gap-1">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse" style={{ animationDelay: "120ms" }}>
                    ●
                  </span>
                  <span className="animate-pulse" style={{ animationDelay: "240ms" }}>
                    ●
                  </span>
                </span>
              </div>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-4">
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={done || typing}
              placeholder="Describe your product or store…"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-purple disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing || done}
              className="rounded-xl bg-orange px-5 py-3 text-sm font-bold text-white transition hover:bg-[#f05f20] disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </PageFrame>
  );
}
