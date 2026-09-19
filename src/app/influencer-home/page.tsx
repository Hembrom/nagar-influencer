"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AVAILABLE_TASKS = [
  {
    id: 1,
    brand: "Priya Fashion",
    campaignName: "Summer Collection Launch",
    type: "Instagram Reel",
    budget: "₹50,000",
    deadline: "5 days",
    followers: "100K+",
    engagement: "4%+",
    description: "Showcase our new summer collection with a creative reel. Focus on styling and trends.",
    status: "open",
  },
  {
    id: 2,
    brand: "NutriWell Foods",
    campaignName: "Healthy Lifestyle Campaign",
    type: "YouTube Video",
    budget: "₹75,000",
    deadline: "7 days",
    followers: "200K+",
    engagement: "5%+",
    description: "Create an authentic video showcasing how NutriWell fits into your daily routine.",
    status: "open",
  },
  {
    id: 3,
    brand: "TechGadget Pro",
    campaignName: "Product Review Series",
    type: "Instagram Reels + Stories",
    budget: "₹60,000",
    deadline: "3 days",
    followers: "50K+",
    engagement: "3%+",
    description: "Honest review of our latest gadget in your signature style. Full creative freedom.",
    status: "open",
  },
  {
    id: 4,
    brand: "Urban Cafe",
    campaignName: "Cafe Experience Challenge",
    type: "TikTok Video",
    budget: "₹40,000",
    deadline: "10 days",
    followers: "75K+",
    engagement: "6%+",
    description: "Create a fun, engaging video featuring our cafe vibe. Perfect for food creators!",
    status: "open",
  },
];

export default function InfluencerHomePage() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [applied, setApplied] = useState<number[]>([]);

  const handleApply = (taskId: number) => {
    if (!applied.includes(taskId)) {
      setApplied([...applied, taskId]);
      setTimeout(() => {
        alert("Application sent! The brand will review and get back to you soon.");
      }, 300);
    }
  };

  const task = selectedTask ? AVAILABLE_TASKS.find((t) => t.id === selectedTask) : null;

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              NI
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">NagarInfluence</p>
              <p className="text-xs text-gray-500">Creator Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/influencer/dashboard"
              className="text-sm text-gray-700 hover:text-gray-900 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/influencer/setup"
              className="text-sm text-gray-700 hover:text-gray-900 font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Available Creator Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            We've matched you with 4 brand collaborations. Review details, apply to ones that fit your style, and start earning with NagarInfluence!
          </p>
        </div>

        {/* Company Info Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Tasks</p>
              <p className="text-3xl font-bold text-indigo-600">4</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Budget Pool</p>
              <p className="text-3xl font-bold text-indigo-600">₹2.25L</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Application Success Rate</p>
              <p className="text-3xl font-bold text-indigo-600">68%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Response Time</p>
              <p className="text-3xl font-bold text-indigo-600">24 hrs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {AVAILABLE_TASKS.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`bg-white border-2 rounded-lg p-6 cursor-pointer transition ${
                    selectedTask === task.id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{task.brand}</h3>
                      <p className="text-sm text-gray-600">{task.campaignName}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Open
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Format</p>
                      <p className="text-sm font-semibold text-gray-900">{task.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="text-sm font-bold text-indigo-600">{task.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Deadline</p>
                      <p className="text-sm font-semibold text-gray-900">{task.deadline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Requirements</p>
                      <p className="text-sm font-semibold text-gray-900">{task.followers}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Task Details Panel */}
          <div className="lg:col-span-1">
            {task ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Task Details</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Brand</p>
                    <p className="text-sm font-semibold text-gray-900">{task.brand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Campaign</p>
                    <p className="text-sm font-semibold text-gray-900">{task.campaignName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Content Format</p>
                    <p className="text-sm font-semibold text-gray-900">{task.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Engagement Required</p>
                    <p className="text-sm font-semibold text-gray-900">{task.engagement}</p>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">💰 Compensation</p>
                  <p className="text-2xl font-bold text-indigo-600">{task.budget}</p>
                  <p className="text-xs text-gray-500 mt-1">One-time payment after approval</p>
                </div>

                <div className="mb-6">
                  <div className="inline-block px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                    ⏰ {task.deadline} remaining
                  </div>
                </div>

                {applied.includes(task.id) ? (
                  <div className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
                    ✓ Application Sent
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(task.id)}
                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Apply Now
                  </button>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  By applying, you agree to our creator terms and policies.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <p className="text-gray-600 text-center">
                  👈 Select a task to view details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-2xl mb-2">🏆</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Why Work with Us</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✓ Verified brands only</li>
              <li>✓ Fair payment guaranteed</li>
              <li>✓ Quick approvals</li>
              <li>✓ Full creative freedom</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-2xl mb-2">📋</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">How It Works</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>1️⃣ Browse opportunities</li>
              <li>2️⃣ Review requirements</li>
              <li>3️⃣ Apply to tasks</li>
              <li>4️⃣ Get paid on approval</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-2xl mb-2">🎁</p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Creator Perks</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>💰 Instant payouts</li>
              <li>📈 Growth analytics</li>
              <li>🤝 Brand partnerships</li>
              <li>📱 Community support</li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to start earning?</h2>
          <p className="text-indigo-100 mb-6">
            Complete your profile to unlock more opportunities and increase your chances of getting selected.
          </p>
          <Link
            href="/influencer/setup"
            className="inline-block px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition"
          >
            Complete Your Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
