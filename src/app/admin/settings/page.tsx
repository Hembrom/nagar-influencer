"use client";

const TEAM_MEMBERS = [
  { id: 1, name: "Meera Joshi", role: "Account Manager", campaigns: "3 active campaigns" },
  { id: 2, name: "Rohan Kapoor", role: "Account Manager", campaigns: "2 active campaigns" },
  { id: 3, name: "Priya Sharma", role: "Analyst", campaigns: "1 active campaigns" },
];

const INTEGRATIONS = [
  { name: "Instagram API", status: "Connected" },
  { name: "YouTube API", status: "Connected" },
  { name: "WhatsApp Business", status: "Set up" },
];

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings & Team</h1>

      {/* Team Members Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Team Members</h2>
        
        <div className="space-y-4">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.role} · {member.campaigns}</p>
                </div>
              </div>
              <button className="text-orange-400 hover:text-orange-300 transition font-medium text-sm">
                Edit
              </button>
            </div>
          ))}
        </div>

        <button className="mt-6 px-4 py-2 text-sm font-medium text-orange-400 border border-orange-500/20 rounded-lg hover:bg-orange-500/10 transition">
          + Invite team member
        </button>
      </div>

      {/* Integrations Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Integrations</h2>

        <div className="space-y-4">
          {INTEGRATIONS.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
              <p className="text-sm font-medium text-gray-900">{integration.name}</p>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-lg ${
                  integration.status === "Connected"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-orange-500/10 text-orange-400"
                }`}
              >
                {integration.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
