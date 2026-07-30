import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function PageFrame({ title, subtitle, actions, children, footer }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-start justify-between gap-4 border-b border-border bg-card px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
      </header>
      <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
      {footer ? (
        <div className="border-t border-border bg-card px-8 py-4">{footer}</div>
      ) : null}
    </div>
  );
}
