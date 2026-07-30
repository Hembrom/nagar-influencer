import { PageFrame } from "@/components/dashboard/PageFrame";

const THREADS = [
  {
    id: "1",
    name: "Rahul Sharma",
    role: "Campaign strategist",
    preview: "I'll join your dashboard shortly to lock the brief.",
    time: "2h ago",
    unread: true,
  },
  {
    id: "2",
    name: "NagarInfluence Support",
    role: "Support",
    preview: "Your token payment was received successfully.",
    time: "Yesterday",
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <PageFrame
      title="Messages"
      subtitle="Conversations with strategists and support"
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {THREADS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`flex w-full gap-3 border-b border-border px-4 py-4 text-left last:border-0 transition hover:bg-background ${
                t.unread ? "bg-purple-soft/40" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple text-sm font-bold text-white">
                {t.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold text-navy">{t.name}</p>
                  <span className="shrink-0 text-[11px] text-muted-light">
                    {t.time}
                  </span>
                </div>
                <p className="text-[11px] text-muted">{t.role}</p>
                <p className="mt-1 truncate text-xs text-muted">{t.preview}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <p className="font-bold text-navy">Rahul Sharma</p>
            <p className="text-xs text-muted">Campaign strategist · Usually replies in 2h</p>
          </div>
          <div className="flex flex-1 flex-col gap-4 px-5 py-5">
            <div className="max-w-[75%] rounded-2xl rounded-tl-md bg-background px-4 py-3 text-sm text-navy">
              Hi! Your Gold YouTube Package token is confirmed. I&apos;ll help
              finalize the brief and delivery window.
            </div>
            <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-md bg-purple px-4 py-3 text-sm text-white">
              Great — we want a SaaS demo angle for the Indian SMB market.
            </div>
          </div>
          <div className="border-t border-border p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Write a message…"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-purple"
              />
              <button
                type="button"
                className="rounded-xl bg-purple-deep px-5 py-3 text-sm font-bold text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
