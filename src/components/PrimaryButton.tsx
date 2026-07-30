import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "orange" | "purple";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

const variants = {
  orange: "bg-orange hover:bg-[#f05f20] shadow-[0_8px_24px_rgba(255,107,43,0.35)]",
  purple: "bg-purple-deep hover:bg-[#3a22a0] shadow-[0_8px_24px_rgba(67,41,183,0.35)]",
};

export function PrimaryButton({
  children,
  href,
  onClick,
  variant = "orange",
  type = "button",
  disabled,
  className = "",
}: Props) {
  const classes = `flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[16px] font-bold text-white transition active:scale-[0.98] disabled:opacity-50 ${variants[variant]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
