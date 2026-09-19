"use client";

import { useState } from "react";

const DEFAULT_REQUESTS = [
  {
    id: 1,
    clientName: "Priya Fashion",
    contactEmail: "priya@fashionbrand.com",
    campaignType: "Instagram Reel Campaign",
    budget: "₹2.5L",
    status: "pending",
    submittedDate: "2026-09-18",
    assignedAdmin: null,
  },
  {
    id: 2,
    clientName: "NutriWell Foods",
    contactEmail: "vikram@nutriwell.com",
    campaignType: "Influencer Collaboration",
    budget: "₹1.8L",
    status: "pending",
    submittedDate: "2026-09-17",
    assignedAdmin: null,
  },
  {
    id: 3,
    clientName: "GadgetZone India",
    contactEmail: "suresh@gadgetzone.com",
    campaignType: "Product Launch",
    budget: "₹3.2L",
    status: "assigned",
    submittedDate: "2026-09-16",
    assignedAdmin: "Admin",
  },
];

const ADMINS = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Admin_Mumbai" },
  { id: 3, name: "Admin_Delhi" },
];

export default function ClientRequestsPage() {
  const [requests, setRequests] = useState(DEFAULT_REQUESTS);
  const [selectedAdmin, setSelectedAdmin] = useState<{ [key: number]: string }>({});
  const [success, setSuccess] = useState("");

  const handleAssignRequest = (requestId: number) => {
    const adminName = selectedAdmin[requestId];
    if (!adminName) return;

    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: "assigned", assignedAdmin: adminName }
          : req
      )
    );
    setSelectedAdmin({ ...selectedAdmin, [requestId]: "" });
    setSuccess("Request assigned successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleReassign = (requestId: number) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: "pending", assignedAdmin: null }
          : req
      )
    );
    setSuccess("Request reassigned. Waiting for admin assignment.");
    setTimeout(() => setSuccess(""), 3000);
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const assignedRequests = requests.filter((r) => r.status === "assigned");

  return (
    <div className="p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Requests</h1>
        <p className="text-gray-600 mb-8">Manage and assign client campaign requests to admins</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Pending Requests */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pending Requests ({pendingRequests.length})
        </h2>
        <div className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Client</p>
                    <p className="text-sm font-semibold text-gray-900">{request.clientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Campaign Type</p>
                    <p className="text-sm font-semibold text-gray-900">{request.campaignType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Budget</p>
                    <p className="text-sm font-semibold text-purple-600">{request.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Submitted</p>
                    <p className="text-sm font-semibold text-gray-900">{request.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                      Pending
                    </span>
                  </div>
                </div>

                {/* Assignment */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign to Admin
                    </label>
                    <select
                      value={selectedAdmin[request.id] || ""}
                      onChange={(e) =>
                        setSelectedAdmin({ ...selectedAdmin, [request.id]: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select an admin...</option>
                      {ADMINS.map((admin) => (
                        <option key={admin.id} value={admin.name}>
                          {admin.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleAssignRequest(request.id)}
                    disabled={!selectedAdmin[request.id]}
                    className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Assign
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-700 font-medium">✓ All requests assigned!</p>
            </div>
          )}
        </div>
      </div>

      {/* Assigned Requests */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Assigned Requests ({assignedRequests.length})
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Campaign</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned Admin</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{request.clientName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{request.campaignType}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-purple-600">{request.budget}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {request.assignedAdmin}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      ✓ Assigned
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleReassign(request.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
