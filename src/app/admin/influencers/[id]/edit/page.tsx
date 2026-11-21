"use client";

import Link from "next/link";
import { use, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getInfluencerById, updateInfluencer, type Influencer } from "@/lib/supabase/influencers";

const fieldClass = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-orange-500";

export default function EditInfluencerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "", handle: "", email: "", category: "", bio: "", location: "", profilePhoto: "",
    followers: "", audienceSize: "", collaborationInterests: "", instagramUrl: "", youtubeUrl: "", tiktokUrl: "",
    instagramFollowers: "", instagramFollowing: "", instagramPosts: "", engagementRate: "", fakeScore: "", trustScore: "",
    estimatedPostPrice: "", femaleAudience: "", maleAudience: "", ageGroup: "", ageGroupShare: "", topCity: "", languages: "",
    reachWeek1: "", reachWeek2: "", reachWeek3: "", reachWeek4: "", portfolioLinks: ["", "", "", "", ""],
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getInfluencerById(id);
        setInfluencer(data);
        setFormData({
          name: data.name || "", handle: data.handle || "", email: data.email || "", category: data.category || "",
          bio: data.bio || "", location: data.location || "", profilePhoto: data.profile_photo || "",
          followers: data.followers || "", audienceSize: data.audience_size || "", collaborationInterests: data.collaboration_interests || "",
          instagramUrl: data.instagram_url || "", youtubeUrl: data.youtube_url || "", tiktokUrl: data.tiktok_url || "",
          instagramFollowers: data.instagram_followers || "", instagramFollowing: data.instagram_following || "", instagramPosts: data.instagram_posts || "",
          engagementRate: data.engagement_rate || "", fakeScore: data.fake_score || "", trustScore: data.trust_score || "",
          estimatedPostPrice: data.estimated_post_price || "", femaleAudience: data.female_audience || "", maleAudience: data.male_audience || "",
          ageGroup: data.age_group || "", ageGroupShare: data.age_group_share || "", topCity: data.top_city || "", languages: data.languages || "",
          reachWeek1: data.reach_week_1 || "", reachWeek2: data.reach_week_2 || "", reachWeek3: data.reach_week_3 || "", reachWeek4: data.reach_week_4 || "",
          portfolioLinks: [...(data.portfolio_links || []), "", "", "", ""].slice(0, 5),
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load influencer.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!influencer) return;
    setError("");
    if (!formData.name || !formData.email || !formData.handle || !formData.category) {
      setError("Name, email, handle, and category are required.");
      return;
    }

    setSubmitting(true);
    try {
      await updateInfluencer(influencer.id, {
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
        engagement_rate: formData.engagementRate || null,
        fake_score: formData.fakeScore || null,
        trust_score: formData.trustScore || null,
        estimated_post_price: formData.estimatedPostPrice || null,
        female_audience: formData.femaleAudience || null,
        male_audience: formData.maleAudience || null,
        age_group: formData.ageGroup || null,
        age_group_share: formData.ageGroupShare || null,
        top_city: formData.topCity || null,
        languages: formData.languages || null,
        reach_week_1: formData.reachWeek1 || null,
        reach_week_2: formData.reachWeek2 || null,
        reach_week_3: formData.reachWeek3 || null,
        reach_week_4: formData.reachWeek4 || null,
        portfolio_links: formData.portfolioLinks.filter((link) => link.trim()),
      });
      router.push(`/admin/influencers/${influencer.id}`);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save influencer.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-8 text-sm text-gray-600">Loading editor...</div>;

  return (
    <div className="min-h-dvh bg-gray-50 p-8">
      <Link href={`/admin/influencers/${id}`} className="text-sm font-bold text-orange-600 hover:underline">← Back to profile</Link>
      <div className="mt-6 max-w-5xl">
        <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900">Edit influencer profile</h1><p className="mt-2 text-sm text-gray-600">All values on this page are manual entries.</p></div>
        {error && <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <form onSubmit={saveProfile} className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionTitle title="Basic profile" />
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Name *" value={formData.name} onChange={(value) => updateField("name", value)} required />
            <Field label="Handle *" value={formData.handle} onChange={(value) => updateField("handle", value)} required />
            <Field label="Email *" value={formData.email} onChange={(value) => updateField("email", value)} type="email" required />
            <Field label="Category *" value={formData.category} onChange={(value) => updateField("category", value)} required />
            <Field label="Location" value={formData.location} onChange={(value) => updateField("location", value)} />
            <Field label="Profile photo URL" value={formData.profilePhoto} onChange={(value) => updateField("profilePhoto", value)} type="url" />
            <label className="text-sm font-medium text-gray-700 md:col-span-2">Bio<textarea value={formData.bio} onChange={(event) => updateField("bio", event.target.value)} rows={4} className={`${fieldClass} mt-2`} /></label>
          </div>

          <SectionTitle title="Social accounts" />
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Instagram profile URL" value={formData.instagramUrl} onChange={(value) => updateField("instagramUrl", value)} type="url" placeholder="https://www.instagram.com/username/" />
            <Field label="YouTube channel URL" value={formData.youtubeUrl} onChange={(value) => updateField("youtubeUrl", value)} type="url" />
            <Field label="TikTok profile URL" value={formData.tiktokUrl} onChange={(value) => updateField("tiktokUrl", value)} type="url" />
            <label className="text-sm font-medium text-gray-700">Audience size<select value={formData.audienceSize} onChange={(event) => updateField("audienceSize", event.target.value)} className={`${fieldClass} mt-2`}><option value="">Not provided</option>{["1K - 10K","10K - 50K","50K - 100K","100K - 500K","500K - 1M","1M+"].map((value) => <option key={value}>{value}</option>)}</select></label>
          </div>

          <SectionTitle title="Campaign performance" />
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field label="Followers" value={formData.instagramFollowers} onChange={(value) => updateField("instagramFollowers", value)} placeholder="1.2M" />
            <Field label="Following" value={formData.instagramFollowing} onChange={(value) => updateField("instagramFollowing", value)} placeholder="694" />
            <Field label="Posts" value={formData.instagramPosts} onChange={(value) => updateField("instagramPosts", value)} placeholder="3,201" />
            <Field label="Engagement" value={formData.engagementRate} onChange={(value) => updateField("engagementRate", value)} placeholder="4.8%" />
            <Field label="Fake score" value={formData.fakeScore} onChange={(value) => updateField("fakeScore", value)} placeholder="12" />
            <Field label="Trust score" value={formData.trustScore} onChange={(value) => updateField("trustScore", value)} placeholder="88/100" />
            <Field label="Estimated per post" value={formData.estimatedPostPrice} onChange={(value) => updateField("estimatedPostPrice", value)} placeholder="₹45,000" />
            <Field label="Languages" value={formData.languages} onChange={(value) => updateField("languages", value)} placeholder="Hindi, English" />
          </div>

          <SectionTitle title="Audience breakdown" />
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Field label="Female audience" value={formData.femaleAudience} onChange={(value) => updateField("femaleAudience", value)} placeholder="72%" />
            <Field label="Male audience" value={formData.maleAudience} onChange={(value) => updateField("maleAudience", value)} placeholder="28%" />
            <Field label="Top age group" value={formData.ageGroup} onChange={(value) => updateField("ageGroup", value)} placeholder="25-34" />
            <Field label="Top age share" value={formData.ageGroupShare} onChange={(value) => updateField("ageGroupShare", value)} placeholder="45%" />
            <Field label="Top city" value={formData.topCity} onChange={(value) => updateField("topCity", value)} placeholder="Mumbai" />
          </div>

          <SectionTitle title="4-week reach estimate" />
          <div className="mt-5 grid gap-5 md:grid-cols-4">
            <Field label="Week 1" value={formData.reachWeek1} onChange={(value) => updateField("reachWeek1", value)} placeholder="80K" />
            <Field label="Week 2" value={formData.reachWeek2} onChange={(value) => updateField("reachWeek2", value)} placeholder="110K" />
            <Field label="Week 3" value={formData.reachWeek3} onChange={(value) => updateField("reachWeek3", value)} placeholder="140K" />
            <Field label="Week 4" value={formData.reachWeek4} onChange={(value) => updateField("reachWeek4", value)} placeholder="200K" />
          </div>

          <SectionTitle title="Collaboration and portfolio" />
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700 md:col-span-2">Collaboration interests<input value={formData.collaborationInterests} onChange={(event) => updateField("collaborationInterests", event.target.value)} placeholder="Food reviews, brand partnerships" className={`${fieldClass} mt-2`} /></label>
            {formData.portfolioLinks.map((link, index) => (
              <label key={index} className="text-sm font-medium text-gray-700">Portfolio / video link {index + 1}<input type="url" value={link} onChange={(event) => { const next = [...formData.portfolioLinks]; next[index] = event.target.value; setFormData((current) => ({ ...current, portfolioLinks: next })); }} className={`${fieldClass} mt-2`} /></label>
            ))}
          </div>

          <div className="mt-8 flex gap-3 border-t border-gray-200 pt-6"><button type="submit" disabled={submitting} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{submitting ? "Saving..." : "Save profile"}</button><Link href={`/admin/influencers/${id}`} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700">Cancel</Link></div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="mt-8 border-t border-gray-200 pt-8 text-lg font-bold text-gray-900">{title}</h2>;
}

function Field({ label, value, onChange, type = "text", placeholder = "", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return <label className="text-sm font-medium text-gray-700">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${fieldClass} mt-2`} /></label>;
}
