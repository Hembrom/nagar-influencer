"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const SUPERADMIN_NAV = [
  { name: "Dashboard", href: "/superadmin", icon: "📊" },
  { name: "Admin Management", href: "/superadmin/admins", icon: "👨‍💼" },
  { name: "Influencers", href: "/superadmin/influencers", icon: "🌟" },
  { name: "Client Requests", href: "/superadmin/requests", icon: "📋" },
  { name: "Reports", href: "/superadmin/reports", icon: "📈" },
  { name: "Settings", href: "/superadmin/settings", icon: "⚙️" },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Don't protect the login page
  const isLoginPage = pathname === "/superadmin/login";

  useEffect(() => {
    // Check if user is logged in
    const superadminSession = localStorage.getItem("superadmin_session");
    if (!superadminSession && !isLoginPage) {
      router.push("/superadmin/login");
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router, isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem("superadmin_session");
    router.push("/superadmin/login");
  };

  // Show login page without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-sm font-bold text-white">
            SA
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">NagarInfluence</p>
            <p className="text-xs text-gray-500">SuperAdmin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {SUPERADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-purple-50 border border-purple-300 text-purple-600"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
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
          className="w-full px-4 py-2 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
