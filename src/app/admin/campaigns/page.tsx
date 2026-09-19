"use client";

const CAMPAIGNS_DATA = {
  brief_received: [
    { id: 1, name: "Festive Home Refresh Q4", brand: "HomeDecor Plus", budget: "₹1.2L", status: "6/8" },
  ],
  shortlisting: [
    { id: 2, name: "Tech Gadget Awareness", brand: "GadgetZone India", budget: "₹2.5L", status: "Months" },
  ],
  negotiating: [
    { id: 3, name: "Healthy India Campaign", brand: "NutriWell Foods", budget: "₹1.8L", status: "3/4" },
  ],
  live: [
    { id: 4, name: "Diwali Collection Launch", brand: "NutriWell Foods", budget: "₹2.1L", status: "3/4" },
  ],
  report_due: [
    { id: 5, name: "Protein Shake Launch", brand: "NutriWell Foods", budget: "₹1.5L", status: "" },
  ],
};

export default function CampaignsPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-dvh">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaigns</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            🎯 Board
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            📊 Table
          </button>
          <button className="ml-auto px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition">
            + New
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-6 overflow-x-auto pb-4">
        {/* Brief Received */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-4">
            BRIEF RECEIVED <span className="text-orange-500">1</span>
          </div>
          <div className="space-y-3">
            {CAMPAIGNS_DATA.brief_received.map((campaign) => (
              <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-400 hover:shadow-sm transition">
                <p className="text-sm font-semibold text-gray-900 mb-2">{campaign.name}</p>
                <p className="text-xs text-gray-600 mb-3">{campaign.brand}</p>
                <p className="text-xs font-medium text-orange-500">{campaign.budget}</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-1 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{campaign.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shortlisting */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-4">
            SHORTLISTING <span className="text-orange-500">1</span>
          </div>
          <div className="space-y-3">
            {CAMPAIGNS_DATA.shortlisting.map((campaign) => (
              <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-400 hover:shadow-sm transition">
                <p className="text-sm font-semibold text-gray-900 mb-2">{campaign.name}</p>
                <p className="text-xs text-gray-600 mb-3">{campaign.brand}</p>
                <p className="text-xs font-medium text-orange-500">{campaign.budget}</p>
                <p className="text-xs text-gray-600 mt-3">{campaign.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Negotiating */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-4">
            NEGOTIATING <span className="text-orange-500">1</span>
          </div>
          <div className="space-y-3">
            {CAMPAIGNS_DATA.negotiating.map((campaign) => (
              <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-400 hover:shadow-sm transition">
                <p className="text-sm font-semibold text-gray-900 mb-2">{campaign.name}</p>
                <p className="text-xs text-gray-600 mb-3">{campaign.brand}</p>
                <p className="text-xs font-medium text-orange-500">{campaign.budget}</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-1 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{campaign.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-4">
            LIVE <span className="text-orange-500">1</span>
          </div>
          <div className="space-y-3">
            {CAMPAIGNS_DATA.live.map((campaign) => (
              <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-400 hover:shadow-sm transition">
                <p className="text-sm font-semibold text-gray-900 mb-2">{campaign.name}</p>
                <p className="text-xs text-gray-600 mb-3">{campaign.brand}</p>
                <p className="text-xs font-medium text-orange-500">{campaign.budget}</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-1 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{campaign.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Due */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-4">
            REPORT DUE <span className="text-orange-500">1</span>
          </div>
          <div className="space-y-3">
            {CAMPAIGNS_DATA.report_due.map((campaign) => (
              <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-400 hover:shadow-sm transition">
                <p className="text-sm font-semibold text-gray-900 mb-2">{campaign.name}</p>
                <p className="text-xs text-gray-600 mb-3">{campaign.brand}</p>
                <p className="text-xs font-medium text-orange-500">{campaign.budget}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
