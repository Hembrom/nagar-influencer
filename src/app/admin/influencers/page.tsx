"use client";

import { useState, useEffect } from "react";
import { addInfluencerByAdmin, getAllInfluencers, deleteInfluencer } from "@/lib/supabase/influencers";

export default function AdminInfluencersPage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSource, setFilterSource] = useState<"all" | "self-registered" | "admin-added">("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    email: "",
    category: "",
    followers: "",
    instagram_url: "",
    youtube_url: "",
    tiktok_url: "",
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

    if (!formData.name || !formData.email || !formData.handle || !formData.category) {
      setError("Name, Email, Handle, and Category are required");
      return;
    }

    setSubmitting(true);
    try {
      const result = await addInfluencerByAdmin({
        name: formData.name,
        email: formData.email,
        handle: formData.handle,
        followers: formData.followers || null,
        category: formData.category,
        instagram_url: formData.instagram_url || null,
        youtube_url: formData.youtube_url || null,
        tiktok_url: formData.tiktok_url || null,
        status: "verified",
      });

      if (result && result[0]) {
        setInfluencers([result[0], ...influencers]);
        setFormData({ name: "", handle: "", email: "", category: "", followers: "", instagram_url: "", youtube_url: "", tiktok_url: "" });
        setShowAddForm(false);
        setSuccess("✅ Influencer added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error adding influencer:", err);
      setError(`Failed to add influencer: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInfluencer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this influencer?")) return;
    
    try {
      await deleteInfluencer(id);
      setInfluencers(influencers.filter((inf) => inf.id !== id));
      setSuccess("Influencer deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting influencer:", err);
      setError("Failed to delete influencer");
    }
  };

  // Get unique categories
  const allCategories = ["all", ...new Set(influencers.map(i => i.category).filter(Boolean))];

  // Filter influencers
  const filteredInfluencers = influencers.filter(inf => {
    const matchesSource = filterSource === "all" || inf.source === filterSource;
    const matchesCategory = filterCategory === "all" || inf.category === filterCategory;
    const matchesSearch = searchQuery === "" || 
      inf.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.handle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-dvh">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Influencers Management</h1>
            <p className="text-gray-600">Manage and view registered influencers from database</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition"
          >
            + Add Influencer
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 text-sm">
            Loading influencers from database...
          </div>
        )}
      </div>

      {/* Add Influencer Form */}
      {showAddForm && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Influencer</h2>
          <form onSubmit={handleAddInfluencer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Priya Sharma"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Handle *</label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  placeholder="@username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="influencer@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Beauty, Fashion, Tech"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Followers (optional)</label>
                <input
                  type="text"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  placeholder="e.g., 500K, 1M"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL (optional)</label>
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL (optional)</label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/@username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TikTok URL (optional)</label>
                <input
                  type="url"
                  value={formData.tiktok_url}
                  onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                  placeholder="https://tiktok.com/@username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition"
              >
                {submitting ? "Adding..." : "Add Influencer"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, handle, or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All ({influencers.length})</option>
                <option value="self-registered">Self-Registered ({influencers.filter(i => i.source === "self-registered").length})</option>
                <option value="admin-added">Admin-Added ({influencers.filter(i => i.source === "admin-added").length})</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Influencers List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-orange-500 border-r-transparent rounded-full"></div>
          <p className="text-gray-600 mt-4">Loading influencers...</p>
        </div>
      ) : filteredInfluencers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No influencers found</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
          >
            Add the first influencer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer) => (
            <div key={influencer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {influencer.handle?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{influencer.name}</p>
                    <p className="text-xs text-gray-600 truncate">@{influencer.handle}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                  influencer.source === "self-registered" 
                    ? "bg-blue-100 text-blue-700" 
                    : "bg-green-100 text-green-700"
                }`}>
                  {influencer.source === "self-registered" ? "Self-Reg" : "Admin"}
                </span>
              </div>

              <div className="space-y-3 mb-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-600">Email</p>
                  <p className="text-gray-900 truncate">{influencer.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Category</p>
                  <p className="text-gray-900">{influencer.category}</p>
                </div>
                {influencer.followers && (
                  <div>
                    <p className="text-xs font-medium text-gray-600">Followers</p>
                    <p className="text-gray-900">{influencer.followers}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDeleteInfluencer(influencer.id)}
                className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
