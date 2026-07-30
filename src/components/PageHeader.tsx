import type { ReactNode } from "react";
import { BackButton } from "./BackButton";
import { VerifiedBadge } from "./VerifiedBadge";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  showBack?: boolean;
  trailing?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  backHref,
  showBack = true,
  trailing,
}: Props) {
  return (
    <header className="mb-6 animate-fade-up">
      <div className="mb-4 flex items-start gap-3">
        {showBack ? <BackButton href={backHref} /> : null}
        <div className="min-w-0 flex-1 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[22px] font-bold leading-tight text-navy">
              {title}
            </h1>
            {trailing ?? <VerifiedBadge />}
          </div>
          {subtitle ? (
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
