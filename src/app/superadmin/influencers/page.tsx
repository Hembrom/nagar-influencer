"use client";

import { useState, useEffect } from "react";
import { addInfluencerByAdmin, getAllInfluencers } from "@/lib/supabase/influencers";

export default function InfluencersManagementPage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSource, setFilterSource] = useState<"all" | "self-registered" | "admin-added">("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    category: "",
    followers: "",
  });

  // Load influencers on mount
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        const data = await getAllInfluencers();
        setInfluencers(data || []);
        setError("");
      } catch (err) {
        console.error("Error fetching influencers:", err);
        setError("Failed to load influencers. Check your Supabase connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  const handleAddInfluencer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.handle || !formData.category || !formData.followers) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const result = await addInfluencerByAdmin({
        name: formData.name,
        email: formData.email,
        handle: formData.handle,
        followers: formData.followers,
        category: formData.category,
        status: "verified",
        source: "admin-added",
      });

      if (result && result[0]) {
        setInfluencers([...influencers, result[0]]);
        setFormData({ name: "", handle: "", email: "", category: "", followers: "" });
        setShowAddForm(false);
        setSuccess("✅ Influencer added to database successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error adding influencer:", err);
      setError(`Failed to add influencer: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveInfluencer = async (id: string) => {
    setError("");
    try {
      setInfluencers(influencers.filter((inf) => inf.id !== id));
      setSuccess("Influencer removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error removing influencer:", err);
      setError("Failed to remove influencer");
    }
  };

  const displayInfluencers = influencers.filter(
    (inf) => filterSource === "all" || inf.source === filterSource
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Influencers Management</h1>
          <p className="text-gray-600">Manage influencer profiles and verifications</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
        >
          + Add Influencer
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 text-sm">
          Loading influencers from database...
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
                disabled={submitting}
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
              >
                {submitting ? "Adding..." : "Add Influencer"}
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
      {!loading && (
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
              {displayInfluencers.length > 0 ? (
                displayInfluencers.map((influencer) => (
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
                        ✓ Verified
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
                      <p className="text-sm text-gray-600">{new Date(influencer.created_at).toLocaleDateString()}</p>
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
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    No influencers found. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
