"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const ADMIN_NAV = [
  { name: "Campaigns", href: "/admin/campaigns", icon: "📊" },
  { name: "Influencer Search", href: "/admin/influencers", icon: "🔍" },
  { name: "Clients", href: "/admin/clients", icon: "👥" },
  { name: "Reports", href: "/admin/reports", icon: "📈" },
  { name: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Don't protect the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Check if user is logged in
    const adminSession = localStorage.getItem("admin_session");
    if (!adminSession && !isLoginPage) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin/login");
  };

  // Show login page without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-dvh bg-[#0a0e27] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1225] border-r border-[#1e2847] p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
            NI
          </div>
          <div>
            <p className="text-sm font-bold text-white">NagarInfluence</p>
            <p className="text-xs text-gray-500">Manager Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-orange-500/20 border border-orange-500 text-orange-400"
                    : "text-gray-400 hover:text-gray-300 hover:bg-[#1e2847]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
