"use client";

export default function AdminDashboardPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-dvh">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back to your admin panel</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Active Campaigns</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-green-600 mt-2">+2 this week</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹28.5L</p>
          <p className="text-xs text-green-600 mt-2">+12% this month</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Active Influencers</p>
          <p className="text-3xl font-bold text-gray-900">42</p>
          <p className="text-xs text-gray-600 mt-2">Verified</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Total Clients</p>
          <p className="text-3xl font-bold text-gray-900">18</p>
          <p className="text-xs text-orange-400 mt-2">4 new this month</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#131829] border border-[#1e2847] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#1e2847]">
            <div>
              <p className="text-sm font-medium text-white">Diwali Collection Launch</p>
              <p className="text-xs text-gray-500">Moved to LIVE</p>
            </div>
            <p className="text-xs text-gray-400">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-[#1e2847]">
            <div>
              <p className="text-sm font-medium text-white">New client: HomeDecor Plus</p>
              <p className="text-xs text-gray-500">Campaign brief received</p>
            </div>
            <p className="text-xs text-gray-400">1 day ago</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Priya Sharma submitted report</p>
              <p className="text-xs text-gray-500">Protein Shake Launch</p>
            </div>
            <p className="text-xs text-gray-400">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
