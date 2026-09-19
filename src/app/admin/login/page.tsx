"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Hardcoded credentials
    if (username === "Admin" && password === "Admin") {
      // Set admin session
      localStorage.setItem("admin_session", JSON.stringify({
        username: "Admin",
        loginTime: new Date().toISOString(),
      }));
      router.push("/admin");
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#0a0e27] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#131829] border border-[#1e2847] rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
              NI
            </div>
            <div>
              <p className="text-sm font-semibold text-white">NagarInfluence</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-sm text-gray-400 mb-8">
            Enter your credentials to access the admin dashboard
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin"
                className="w-full px-4 py-2 bg-[#0a0e27] border border-[#1e2847] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-[#0a0e27] border border-[#1e2847] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition mt-6"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-[#1e2847]">
            <p className="text-xs text-gray-500 text-center">
              Demo Credentials:<br />
              <span className="text-gray-400">Username: Admin</span><br />
              <span className="text-gray-400">Password: Admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
