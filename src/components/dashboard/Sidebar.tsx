"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  {
    href: "/dashboard/campaigns/new",
    label: "New campaign",
    icon: PlusIcon,
  },
  {
    href: "/dashboard/campaigns",
    label: "All campaigns",
    icon: CampaignsIcon,
    exact: true,
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: MessagesIcon,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: SettingsIcon,
  },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  if (href === "/dashboard/campaigns/new") {
    return pathname.startsWith("/dashboard/campaigns/new");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  user: User | null;
};

export function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Brand account";
  const email = user?.email ?? "Demo mode";
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  async function signOut() {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (
        url &&
        key &&
        !url.includes("YOUR_PROJECT_REF") &&
        !key.includes("your_anon_key")
      ) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
    } catch {
      // ignore when supabase unset
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-dvh w-[260px] shrink-0 flex-col border-r border-border bg-[#0f0a1f] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/dashboard/campaigns" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange text-xs font-extrabold text-white">
            NI
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">NagarInfluence</p>
            <p className="text-[11px] text-white/45">Brand workspace</p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-white/12 text-white"
                  : "text-white/60 hover:bg-white/6 hover:text-white"
              }`}
            >
              <Icon active={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple text-xs font-bold">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-[11px] text-white/45">{email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-white/55 transition hover:bg-white/8 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

function PlusIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={active ? "text-orange" : ""}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CampaignsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={active ? "text-orange" : ""}>
      <rect x="3" y="4" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MessagesIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={active ? "text-orange" : ""}>
      <path
        d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7A2.5 2.5 0 0117.5 16H9l-4 3.5V6.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={active ? "text-orange" : ""}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
