"use client";

const REPORTS = [
  {
    id: 1,
    name: "Summer Wardrobe Drop",
    brand: "Priya Fashion",
    date: "Jul 2026",
    views: "198K",
    engagement: "14.2K",
    clicks: "7.2%",
    conversions: "3.1K",
    status: "Completed",
  },
  {
    id: 2,
    name: "Protein Shake Launch",
    brand: "NutriWell Foods",
    date: "Aug 2026",
    views: "—",
    engagement: "—",
    clicks: "—",
    conversions: "—",
    status: "Report Due",
  },
];

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reports Archive</h1>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {REPORTS.map((report) => (
          <div key={report.id} className="bg-[#131829] border border-[#1e2847] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{report.name}</h3>
                <p className="text-sm text-gray-500">{report.brand} · {report.date}</p>
              </div>
              <div className="flex gap-2">
                {report.status === "Completed" && (
                  <button className="px-4 py-2 text-sm font-medium text-gray-400 border border-[#1e2847] rounded-lg hover:bg-[#1e2847] transition">
                    ✓ Completed
                  </button>
                )}
                {report.status === "Report Due" && (
                  <button className="px-4 py-2 text-sm font-medium text-orange-400 border border-orange-500/20 rounded-lg hover:bg-orange-500/10 transition">
                    ⚠ Report Due
                  </button>
                )}
                <button className="px-4 py-2 text-sm font-medium text-gray-400 border border-[#1e2847] rounded-lg hover:bg-[#1e2847] transition">
                  ⬇ Download
                </button>
              </div>
            </div>

            {/* Metrics */}
            {report.status === "Completed" && (
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-[#1e2847]">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Views</p>
                  <p className="text-xl font-bold text-white">{report.views}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Engagements</p>
                  <p className="text-xl font-bold text-white">{report.engagement}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">CTR</p>
                  <p className="text-xl font-bold text-orange-400">{report.clicks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Conversions</p>
                  <p className="text-xl font-bold text-green-400">{report.conversions}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
