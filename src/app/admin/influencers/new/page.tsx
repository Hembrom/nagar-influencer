"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { addInfluencerByAdmin } from "@/lib/supabase/influencers";

const EMPTY_FORM = {
  name: "",
  handle: "",
  email: "",
  category: "",
  bio: "",
  location: "",
  profilePhoto: "",
  followers: "",
  audienceSize: "",
  collaborationInterests: "",
  instagramUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
  instagramFollowers: "",
  instagramFollowing: "",
  instagramPosts: "",
  portfolioLinks: ["", "", "", "", ""],
};

const fieldClass = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-orange-500";

export default function NewInfluencerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.handle || !formData.category) {
      setError("Name, email, handle, and category are required.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await addInfluencerByAdmin({
        name: formData.name,
        email: formData.email,
        handle: formData.handle.replace(/^@/, ""),
        followers: formData.followers || formData.instagramFollowers || null,
        category: formData.category,
        bio: formData.bio || null,
        location: formData.location || null,
        profile_photo: formData.profilePhoto || null,
        audience_size: formData.audienceSize || null,
        collaboration_interests: formData.collaborationInterests || null,
        instagram_url: formData.instagramUrl || null,
        youtube_url: formData.youtubeUrl || null,
        tiktok_url: formData.tiktokUrl || null,
        instagram_followers: formData.instagramFollowers || null,
        instagram_following: formData.instagramFollowing || null,
        instagram_posts: formData.instagramPosts || null,
        portfolio_links: formData.portfolioLinks.filter((link) => link.trim()),
        status: "verified",
      });

      if (result?.[0]) {
        router.push(`/admin/influencers/${result[0].id}`);
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to add influencer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gray-50 p-8">
      <Link href="/admin/influencers" className="text-sm font-bold text-orange-600 hover:underline">
        ← Back to influencer search
      </Link>

      <div className="mt-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add influencer profile</h1>
          <p className="mt-2 text-sm text-gray-600">Enter profile, social, and portfolio information manually.</p>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <section>
            <h2 className="text-lg font-bold text-gray-900">Basic profile</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">Name *
                <input required value={formData.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Kunal Vijjayakar" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">Handle *
                <input required value={formData.handle} onChange={(event) => updateField("handle", event.target.value)} placeholder="@kunalvijayakar" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">Email *
                <input required type="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} placeholder="creator@example.com" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">Category *
                <input required value={formData.category} onChange={(event) => updateField("category", event.target.value)} placeholder="Food, Travel, Lifestyle" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">Location
                <input value={formData.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Mumbai, Maharashtra" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">Profile photo URL
                <input type="url" value={formData.profilePhoto} onChange={(event) => updateField("profilePhoto", event.target.value)} placeholder="https://.../profile.jpg" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700 md:col-span-2">Bio
                <textarea value={formData.bio} onChange={(event) => updateField("bio", event.target.value)} placeholder="Food creator, presenter, and local experience storyteller" rows={4} className={`${fieldClass} mt-2`} />
              </label>
            </div>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900">Social accounts</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">Instagram profile URL
                <input type="url" value={formData.instagramUrl} onChange={(event) => updateField("instagramUrl", event.target.value)} placeholder="https://www.instagram.com/kunalvijayakar/" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">YouTube channel URL
                <input type="url" value={formData.youtubeUrl} onChange={(event) => updateField("youtubeUrl", event.target.value)} placeholder="https://youtube.com/@username" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">TikTok profile URL
                <input type="url" value={formData.tiktokUrl} onChange={(event) => updateField("tiktokUrl", event.target.value)} placeholder="https://tiktok.com/@username" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">Audience size
                <select value={formData.audienceSize} onChange={(event) => updateField("audienceSize", event.target.value)} className={`${fieldClass} mt-2`}>
                  <option value="">Not provided</option>
                  <option value="1K - 10K">1K - 10K</option>
                  <option value="10K - 50K">10K - 50K</option>
                  <option value="50K - 100K">50K - 100K</option>
                  <option value="100K - 500K">100K - 500K</option>
                  <option value="500K - 1M">500K - 1M</option>
                  <option value="1M+">1M+</option>
                </select>
              </label>
            </div>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">Manual Instagram metrics</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Manually entered</span>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <label className="text-sm font-medium text-gray-700">Followers
                <input value={formData.instagramFollowers} onChange={(event) => updateField("instagramFollowers", event.target.value)} placeholder="220K" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">Following
                <input value={formData.instagramFollowing} onChange={(event) => updateField("instagramFollowing", event.target.value)} placeholder="695" className={`${fieldClass} mt-2`} />
              </label>
              <label className="text-sm font-medium text-gray-700">Posts
                <input value={formData.instagramPosts} onChange={(event) => updateField("instagramPosts", event.target.value)} placeholder="3,201" className={`${fieldClass} mt-2`} />
              </label>
            </div>
          </section>

          <section className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900">Collaboration and portfolio</h2>
            <label className="mt-5 block text-sm font-medium text-gray-700">Collaboration interests
              <input value={formData.collaborationInterests} onChange={(event) => updateField("collaborationInterests", event.target.value)} placeholder="Food reviews, brand partnerships, event promotion" className={`${fieldClass} mt-2`} />
            </label>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {formData.portfolioLinks.map((link, index) => (
                <label key={index} className="text-sm font-medium text-gray-700">Portfolio / video link {index + 1}
                  <input type="url" value={link} onChange={(event) => {
                    const nextLinks = [...formData.portfolioLinks];
                    nextLinks[index] = event.target.value;
                    setFormData((current) => ({ ...current, portfolioLinks: nextLinks }));
                  }} placeholder="https://www.instagram.com/p/..." className={`${fieldClass} mt-2`} />
                </label>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
            <button type="submit" disabled={submitting} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50">
              {submitting ? "Adding..." : "Add influencer"}
            </button>
            <Link href="/admin/influencers" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
