export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-purple-soft px-2.5 py-1 text-[10px] font-bold tracking-wide text-purple">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 2l2.4 2.1 3.2-.4.9 3.1 2.8 1.6-1.5 2.8.6 3.2-3.1.9-1.6 2.8-2.8-1.5-3.2.6-.9-3.1-2.8-1.6 1.5-2.8-.6-3.2 3.1-.9L12 2z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M12 3.5l1.9 1.7 2.6-.3.7 2.5 2.3 1.3-1.2 2.3.5 2.6-2.5.7-1.3 2.3-2.3-1.2-2.6.5-.7-2.5-2.3-1.3 1.2-2.3-.5-2.6 2.5-.7L12 3.5z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M9.5 12.2l1.7 1.7 3.5-3.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      VERIFIED
    </span>
  );
}
