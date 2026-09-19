"use client";

import { useState } from "react";

const INFLUENCERS = [
  {
    id: 1,
    name: "@priyanka_beauty_official",
    handle: "priyanka_beauty_official",
    followers: "1.2M",
    engagement: "4.8%",
    niche: "Beauty & Fashion",
    category: "Beauty & Fashion",
  },
  {
    id: 2,
    name: "@dishguru_ramesh",
    handle: "dishguru_ramesh",
    followers: "854K",
    engagement: "6.1%",
    niche: "Food & Travel",
    category: "Food & Travel",
  },
  {
    id: 3,
    name: "@mumbai_foodie_tales",
    handle: "mumbai_foodie_tales",
    followers: "634K",
    engagement: "5.1%",
    niche: "Food & Travel",
    category: "Food & Travel",
  },
  {
    id: 4,
    name: "@fitnessgirl_nisha",
    handle: "fitnessgirl_nisha",
    followers: "428K",
    engagement: "8.1%",
    niche: "Fitness & Wellness",
    category: "Health & Fitness",
  },
];

export default function InfluencersPage() {
  const [selectedCategory, setSelectedCategory] = useState("Beauty & Fashion");

  const CATEGORIES = ["Beauty & Fashion", "Food & Travel", "Tech & Gadgets", "Health & Fitness", "Lifestyle"];
  const MIN_FOLLOWERS = ["Any", "100K+", "500K+", "1M+"];

  return (
    <div className="p-8 bg-gray-50 min-h-dvh">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Influencer Search</h1>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search influencers...</label>
              <input
                type="text"
                placeholder="@username"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Niche</label>
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-orange-500">
                <option>All categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Followers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min. Followers</label>
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-orange-500">
                {MIN_FOLLOWERS.map((min) => (
                  <option key={min}>{min}</option>
                ))}
              </select>
            </div>

            {/* Verified */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-orange-500">
                <option>All</option>
                <option>Verified only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INFLUENCERS.map((inf) => (
          <div key={inf.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-lg font-bold">
                  {inf.handle.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{inf.name}</p>
                  <p className="text-xs text-gray-600">{inf.followers}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                ✓ Verified
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-600">Engagement Rate</p>
                <p className="text-lg font-bold text-orange-500">{inf.engagement}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Niche</p>
                <p className="text-sm text-gray-700">{inf.niche}</p>
              </div>
            </div>

            <button className="w-full px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 rounded-lg text-sm font-medium transition">
              Add to campaign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
