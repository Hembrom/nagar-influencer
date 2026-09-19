"use client";

const CLIENTS = [
  {
    id: 1,
    name: "Priya Fashion",
    contact: "Priya Malhotra",
    city: "Mumbai",
    campaigns: 4,
    spend: "₹8.2L",
  },
  {
    id: 2,
    name: "NutriWell Foods",
    contact: "Vikram Mor",
    city: "Delhi",
    campaigns: 2,
    spend: "₹3.6L",
  },
  {
    id: 3,
    name: "GadgetZone India",
    contact: "Suresh Nambiar",
    city: "Bangalore",
    campaigns: 1,
    spend: "₹2.5L",
  },
  {
    id: 4,
    name: "HomeDecor Plus",
    contact: "Anjali Singh",
    city: "Pune",
    campaigns: 3,
    spend: "₹4.5L",
  },
];

export default function ClientsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition">
          + Add client
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#131829] border border-[#1e2847] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e2847]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Business</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">City</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Campaigns</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Lifetime Spend</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((client) => (
              <tr key={client.id} className="border-b border-[#1e2847] hover:bg-[#1e2847] transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-white">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{client.contact}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{client.city}</td>
                <td className="px-6 py-4 text-sm text-white font-medium">{client.campaigns}</td>
                <td className="px-6 py-4 text-sm font-semibold text-orange-400">{client.spend}</td>
                <td className="px-6 py-4 text-sm text-gray-400 hover:text-orange-400 cursor-pointer transition">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
