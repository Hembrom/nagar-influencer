"use client";

import { useState } from "react";

const DEFAULT_INFLUENCERS = [
  {
    id: 1,
    name: "Priya Sharma",
    handle: "@priyanka_beauty",
    followers: "1.2M",
    category: "Beauty & Fashion",
    email: "priya@example.com",
    status: "verified",
    joinedDate: "2026-08-10",
    source: "self-registered",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    handle: "@dishguru_ramesh",
    followers: "854K",
    category: "Food & Travel",
    email: "rahul@example.com",
    status: "verified",
    joinedDate: "2026-08-15",
    source: "admin-added",
  },
];

export default function InfluencersManagementPage() {
  const [influencers, setInfluencers] = useState(DEFAULT_INFLUENCERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSource, setFilterSource] = useState<"all" | "self-registered" | "admin-added">("all");
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    category: "",
    followers: "",
  });
  const [success, setSuccess] = useState("");

  const handleAddInfluencer = (e: React.FormEvent) => {
    e.preventDefault();

    const newInfluencer = {
      id: influencers.length + 1,
      name: formData.name,
      handle: formData.handle,
      followers: formData.followers,
      category: formData.category,
      email: formData.email,
      status: "verified",
      joinedDate: new Date().toISOString().split("T")[0],
      source: "admin-added",
    };

    setInfluencers([...influencers, newInfluencer]);
    setFormData({ name: "", handle: "", email: "", category: "", followers: "" });
    setShowAddForm(false);
    setSuccess("Influencer added successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleRemoveInfluencer = (id: number) => {
    setInfluencers(influencers.filter((inf) => inf.id !== id));
    setSuccess("Influencer removed successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Influencers Management</h1>
          <p className="text-gray-600">Manage influencer profiles and verifications</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
        >
          + Add Influencer
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setFilterSource("all")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            filterSource === "all"
              ? "bg-purple-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          All ({influencers.length})
        </button>
        <button
          onClick={() => setFilterSource("self-registered")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            filterSource === "self-registered"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Self-Registered ({influencers.filter(i => i.source === "self-registered").length})
        </button>
        <button
          onClick={() => setFilterSource("admin-added")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            filterSource === "admin-added"
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Admin Added ({influencers.filter(i => i.source === "admin-added").length})
        </button>
      </div>

      {/* Add Influencer Form */}
      {showAddForm && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Influencer</h2>
          <form onSubmit={handleAddInfluencer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Priya Sharma"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Handle</label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  placeholder="@username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="influencer@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Beauty & Fashion">Beauty & Fashion</option>
                  <option value="Food & Travel">Food & Travel</option>
                  <option value="Tech & Gadgets">Tech & Gadgets</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Followers</label>
                <input
                  type="text"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  placeholder="e.g., 1.2M"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
              >
                Add Influencer
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Influencers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Handle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Followers</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Added By</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {influencers
              .filter((inf) => filterSource === "all" || inf.source === filterSource)
              .map((influencer) => (
              <tr key={influencer.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{influencer.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{influencer.handle}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{influencer.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {influencer.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{influencer.followers}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {influencer.status === "verified" ? "✓ Verified" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    influencer.source === "self-registered"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {influencer.source === "self-registered" ? "📝 Self" : "👤 Admin"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{influencer.joinedDate}</p>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRemoveInfluencer(influencer.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
