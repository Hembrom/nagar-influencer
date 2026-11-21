"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteInfluencer, getInfluencerById, type Influencer } from "@/lib/supabase/influencers";

function getPlatform(url: string) {
  const value = url.toLowerCase();
  if (value.includes("instagram.com")) return "Instagram";
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "YouTube";
  if (value.includes("tiktok.com")) return "TikTok";
  return "Website";
}

function splitTags(value: string | null) {
  if (!value) return [];
  return value
    .split(/[,|]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function AdminInfluencerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setInfluencer(await getInfluencerById(id));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load influencer.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleDeleteProfile() {
    if (!influencer || confirmationName.trim() !== influencer.name.trim()) return;

    try {
      setDeleting(true);
      setDeleteError("");
      await deleteInfluencer(influencer.id);
      router.push("/admin/influencers");
      router.refresh();
    } catch (deleteFailure) {
      setDeleteError(deleteFailure instanceof Error ? deleteFailure.message : "Failed to delete influencer.");
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-sm text-gray-600">Loading influencer profile...</div>;
  }

  if (error || !influencer) {
    return (
      <div className="p-8">
        <Link href="/admin/influencers" className="text-sm font-semibold text-orange-600 hover:underline">
          ← Back to influencer search
        </Link>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
          {error || "Influencer not found"}
        </div>
      </div>
    );
  }

  const collaborationTags = splitTags(influencer.collaboration_interests);
  const contentTags = splitTags(influencer.category);
  const portfolioLinks = influencer.portfolio_links || [];
  const socialLinks = [
    ["Instagram", influencer.instagram_url],
    ["YouTube", influencer.youtube_url],
    ["TikTok", influencer.tiktok_url],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  const reachValues = [
    influencer.reach_week_1,
    influencer.reach_week_2,
    influencer.reach_week_3,
    influencer.reach_week_4,
  ].map((value) => value || "—");

  return (
    <div className="min-h-dvh bg-[#f4f6f8] p-4 text-slate-900 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/influencers" className="text-sm font-semibold text-orange-600 hover:underline">
          ← Back to influencer search
        </Link>
        <Link
          href={`/admin/influencers/${influencer.id}/edit`}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
        >
          Edit profile
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-5">
            {influencer.profile_photo ? (
              <Image
                src={influencer.profile_photo}
                alt={influencer.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-3xl font-bold text-white">
                {influencer.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{influencer.name}</h1>
                {influencer.status === "verified" && (
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600">@{influencer.handle}</p>
              <p className="mt-1 text-sm text-gray-500">{influencer.location || "Location not specified"}</p>

              {influencer.bio && <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-700">{influencer.bio}</p>}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Followers", influencer.instagram_followers || influencer.followers || influencer.audience_size || "Not provided"],
              ["Following", influencer.instagram_following || "Not provided"],
              ["Posts", influencer.instagram_posts || "Not provided"],
              ["Engagement", influencer.engagement_rate || "Not provided"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className={`mt-1 text-2xl font-bold ${label === "Engagement" ? "text-teal-700" : label === "Trust score" ? "text-amber-700" : "text-slate-900"}`}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-gray-900">Profile details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="mt-0.5 break-all font-medium text-gray-900">{influencer.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Source</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {influencer.source === "self-registered" ? "Self-registered" : "Admin-added"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Registered</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {new Date(influencer.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-gray-900">Social accounts</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.length ? socialLinks.map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:border-orange-300 hover:text-orange-600"
                >
                  {platform}
                </a>
              )) : <p className="text-sm text-gray-500">No social accounts linked</p>}
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Audience breakdown</h2>
          {[
            ["Female", influencer.female_audience],
            ["Male", influencer.male_audience],
            [`${influencer.age_group || "Top age"}`, influencer.age_group_share],
            ["Top city", influencer.top_city],
            ["Languages", influencer.languages],
          ].map(([label, value]) => (
            <div key={label} className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600"><span>{label}</span><span className="font-semibold text-slate-800">{value || "—"}</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600" style={{ width: value?.endsWith("%") ? value : "28%" }} /></div>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Pricing & platform</h2>
          <p className="mt-5 text-3xl font-bold text-slate-900">{influencer.estimated_post_price || "Not provided"}</p>
          <p className="mt-1 text-xs text-slate-500">Estimated per post</p>
          <div className="mt-5 border-t border-slate-200 pt-5">
            {socialLinks.map(([platform]) => <p key={platform} className="mt-2 text-sm font-bold text-slate-700">● {platform}</p>)}
            <p className="mt-5 text-xs text-slate-500">Trust score</p>
            <p className="mt-1 text-sm font-bold text-amber-700">{influencer.trust_score || "Not provided"}</p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold text-slate-900">Content and collaboration tags</h2>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Content categories</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {contentTags.length ? contentTags.map((tag) => (
                <span key={tag} className="rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700">{tag}</span>
              )) : <span className="text-sm text-gray-500">No categories provided</span>}
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Collaboration interests</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {collaborationTags.length ? collaborationTags.map((tag) => (
                <span key={tag} className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700">{tag}</span>
              )) : <span className="text-sm text-gray-500">No collaboration interests provided</span>}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-gray-900">Video portfolio</h2>
            <span className="text-xs font-semibold text-gray-500">{portfolioLinks.length} links</span>
          </div>

          {portfolioLinks.length ? (
            <div className="mt-4 space-y-3">
              {portfolioLinks.map((url, index) => (
                <a
                  key={`${url}-${index}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 hover:border-orange-300"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">Video {index + 1}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{url}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                    {getPlatform(url)}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <p className="text-sm font-semibold text-gray-700">No video portfolio added</p>
              <p className="mt-1 text-xs text-gray-500">The creator can add up to five portfolio links in profile setup.</p>
            </div>
          )}
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Reach estimate · 4 week campaign</h2>
          <div className="mt-6 flex h-44 items-end gap-3 border-b border-dashed border-slate-200">
            {reachValues.map((value, index) => (
              <div key={index} className="flex h-full flex-1 items-end"><div className="w-full rounded-t-sm bg-orange-500" style={{ height: value === "—" ? "8%" : `${25 + index * 18}%` }} title={`Week ${index + 1}: ${value}`} /></div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-4 text-center text-xs text-slate-500">{reachValues.map((value, index) => <div key={index}>W{index + 1}<br /><span className="font-semibold text-slate-700">{value}</span></div>)}</div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-red-900">Danger Zone</h2>
            <p className="mt-1 text-sm text-red-700">Deleting this profile removes it from the influencer database.</p>
          </div>
          {!showDeleteConfirmation && (
            <button
              type="button"
              onClick={() => {
                setConfirmationName("");
                setDeleteError("");
                setShowDeleteConfirmation(true);
              }}
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
            >
              Delete influencer profile
            </button>
          )}
        </div>

        {showDeleteConfirmation && (
          <div className="mt-5 rounded-lg border border-red-200 bg-white p-5">
            <p className="text-sm font-semibold text-gray-900">Verify deletion</p>
            <p className="mt-1 text-sm text-gray-600">
              Type <span className="font-bold text-gray-900">{influencer.name}</span> to confirm removal.
            </p>
            <input
              value={confirmationName}
              onChange={(event) => setConfirmationName(event.target.value)}
              placeholder={influencer.name}
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-red-500"
            />
            {deleteError && <p className="mt-3 text-sm text-red-700">{deleteError}</p>}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleDeleteProfile}
                disabled={deleting || confirmationName.trim() !== influencer.name.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Permanently delete"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
