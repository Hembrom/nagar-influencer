import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function MobileShell({ children, footer, className = "" }: Props) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <div className={`flex-1 px-5 pt-5 pb-6 ${className}`}>{children}</div>
      {footer ? (
        <div className="sticky bottom-0 border-t border-transparent bg-background/95 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
