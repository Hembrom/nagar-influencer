import type { CampaignFormat } from "@/lib/formats";

type Props = {
  icon: CampaignFormat["icon"];
  className?: string;
  active?: boolean;
};

export function FormatIcon({ icon, className = "", active }: Props) {
  const color = active ? "text-orange" : "text-purple";
  const bg = active ? "bg-orange-soft" : "bg-purple-soft";

  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color} ${className}`}
    >
      {icon === "play" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.5v13l11-6.5L8 5.5z" />
        </svg>
      )}
      {icon === "reel" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor" />
        </svg>
      )}
      {icon === "shorts" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L4 14h7l-1 8 10-14h-7l0-6z" />
        </svg>
      )}
      {icon === "review" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {icon === "unboxing" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 8l8-4 8 4v8l-8 4-8-4V8z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M4 8l8 4 8-4M12 12v8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )}
      {icon === "collab" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M3.5 18c.8-2.4 2.8-3.5 5.5-3.5s4.7 1.1 5.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M14 16.5c.6-1.2 1.8-1.8 3.5-1.8 1.5 0 2.6.5 3.2 1.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}
