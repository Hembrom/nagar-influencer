"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { getInfluencerById, type Influencer } from "@/lib/supabase/influencers";

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
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-dvh bg-gray-50 p-8">
      <Link href="/admin/influencers" className="text-sm font-semibold text-orange-600 hover:underline">
        ← Back to influencer search
      </Link>

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
              ["Audience", influencer.audience_size || influencer.followers || "Not provided"],
              ["Portfolio videos", String(portfolioLinks.length)],
              ["Platforms", String(socialLinks.length)],
              ["Collaboration tags", String(collaborationTags.length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
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
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-bold text-gray-900">Content and collaboration tags</h2>
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
      </div>

      <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-sm font-bold text-amber-900">Video performance</h2>
        <p className="mt-1 text-sm text-amber-800">
          Views, reach, engagement, likes, comments, and shares are not currently stored in the database. Add video analytics ingestion to show verified collaboration performance here.
        </p>
      </section>
    </div>
  );
}
