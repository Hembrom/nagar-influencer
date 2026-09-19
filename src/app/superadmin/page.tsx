"use client";

export default function SuperAdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and key metrics</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Total Admins</p>
          <p className="text-3xl font-bold text-gray-900">5</p>
          <p className="text-xs text-green-600 mt-2">All active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Active Influencers</p>
          <p className="text-3xl font-bold text-gray-900">248</p>
          <p className="text-xs text-green-600 mt-2">+12 this week</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Active Campaigns</p>
          <p className="text-3xl font-bold text-gray-900">42</p>
          <p className="text-xs text-gray-600 mt-2">In progress</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Platform Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹156L</p>
          <p className="text-xs text-green-600 mt-2">+18% this month</p>
        </div>
      </div>

      {/* Key Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              <span className="text-sm text-gray-700">2 client requests awaiting assignment</span>
            </li>
            <li className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              <span className="text-sm text-gray-700">5 new influencer applications to review</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              <span className="text-sm text-gray-700">3 reports pending approval</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-700">API Health</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✓ Healthy</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-700">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✓ Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">All Services</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">✓ Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
