"use client";

import { useRouter } from "next/navigation";

type Props = {
  href?: string;
};

export function BackButton({ href }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => (href ? router.push(href) : router.back())}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card shadow-[0_2px_10px_rgba(26,26,46,0.08)] transition hover:bg-white active:scale-95"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
