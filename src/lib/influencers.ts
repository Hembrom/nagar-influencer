export type InfluencerReel = {
  id: string;
  title: string;
  formatId: string;
  formatLabel: string;
  views: string;
  duration: string;
  gradient: string;
  style: string;
};

export type Influencer = {
  id: string;
  name: string;
  handle: string;
  niche: string[];
  followers: string;
  platforms: string[];
  vibe: string;
  reels: InfluencerReel[];
};

/** Seed “database” of verified creators + existing work */
export const INFLUENCERS: Influencer[] = [
  {
    id: "inf-arjun",
    name: "Arjun Mehta",
    handle: "@arjunbuilds",
    niche: ["saas", "b2b", "productivity"],
    followers: "182K",
    platforms: ["YouTube", "Instagram"],
    vibe: "Calm product demos & founder storytelling",
    reels: [
      {
        id: "arjun-saas-demo",
        title: "SaaS dashboard walkthrough that converts",
        formatId: "youtube-video",
        formatLabel: "YouTube Video",
        views: "145K",
        duration: "12:40",
        gradient: "from-slate-700 via-indigo-800 to-slate-900",
        style: "Long-form demo",
      },
      {
        id: "arjun-trust-review",
        title: "Honest 7-day SaaS review",
        formatId: "product-review",
        formatLabel: "Product Review",
        views: "98K",
        duration: "09:15",
        gradient: "from-violet-700 via-purple-800 to-slate-900",
        style: "Trust review",
      },
    ],
  },
  {
    id: "inf-neha",
    name: "Neha Kapoor",
    handle: "@nehacreates",
    niche: ["app", "d2c", "lifestyle"],
    followers: "310K",
    platforms: ["Instagram", "YouTube Shorts"],
    vibe: "Aesthetic short-form that feels native to Reels",
    reels: [
      {
        id: "neha-reel-app",
        title: "App feature in 30 seconds",
        formatId: "instagram-reel",
        formatLabel: "Instagram Reel",
        views: "420K",
        duration: "0:32",
        gradient: "from-fuchsia-600 via-rose-500 to-orange-400",
        style: "Viral Reel",
      },
      {
        id: "neha-shorts",
        title: "Trend hook → product CTA",
        formatId: "youtube-shorts",
        formatLabel: "YouTube Shorts",
        views: "210K",
        duration: "0:41",
        gradient: "from-orange-500 via-amber-500 to-rose-600",
        style: "Shorts hook",
      },
    ],
  },
  {
    id: "inf-vikram",
    name: "Vikram Shah",
    handle: "@unboxvikram",
    niche: ["hardware", "gadgets", "launch"],
    followers: "540K",
    platforms: ["YouTube"],
    vibe: "High-energy unboxing & first impressions",
    reels: [
      {
        id: "vikram-unbox",
        title: "Premium gadget first look",
        formatId: "unboxing-video",
        formatLabel: "Unboxing Video",
        views: "380K",
        duration: "11:20",
        gradient: "from-amber-700 via-stone-700 to-neutral-900",
        style: "Unboxing",
      },
    ],
  },
  {
    id: "inf-sara",
    name: "Sara Iqbal",
    handle: "@saralaunches",
    niche: ["launch", "d2c", "brand"],
    followers: "225K",
    platforms: ["Instagram", "YouTube"],
    vibe: "Multi-platform launch narratives",
    reels: [
      {
        id: "sara-collab",
        title: "Cross-platform launch week story",
        formatId: "brand-collaboration",
        formatLabel: "Brand Collaboration",
        views: "156K",
        duration: "08:05",
        gradient: "from-teal-700 via-cyan-800 to-indigo-900",
        style: "Launch collab",
      },
      {
        id: "sara-reel",
        title: "Drop-day Reel energy",
        formatId: "instagram-reel",
        formatLabel: "Instagram Reel",
        views: "290K",
        duration: "0:28",
        gradient: "from-pink-500 via-purple-600 to-indigo-700",
        style: "Launch Reel",
      },
    ],
  },
  {
    id: "inf-rohan",
    name: "Rohan Desai",
    handle: "@rohanreviews",
    niche: ["saas", "app", "trust"],
    followers: "128K",
    platforms: ["YouTube"],
    vibe: "Structured testing with clear pros/cons",
    reels: [
      {
        id: "rohan-review",
        title: "Side-by-side product stress test",
        formatId: "product-review",
        formatLabel: "Product Review",
        views: "112K",
        duration: "14:02",
        gradient: "from-emerald-800 via-teal-800 to-slate-900",
        style: "Deep review",
      },
    ],
  },
];

export type MatchedReel = InfluencerReel & {
  influencerId: string;
  influencerName: string;
  influencerHandle: string;
  followers: string;
  vibe: string;
};

export function matchReelsFromStory(story: string, want: string): MatchedReel[] {
  const text = `${story} ${want}`.toLowerCase();
  const scored = INFLUENCERS.map((inf) => {
    let score = 0;
    for (const tag of inf.niche) {
      if (text.includes(tag)) score += 3;
    }
    if (/saas|b2b|software|dashboard|demo|analytics/.test(text)) {
      if (inf.niche.includes("saas") || inf.niche.includes("b2b")) score += 4;
    }
    if (/app|mobile|ios|android/.test(text)) {
      if (inf.niche.includes("app")) score += 4;
    }
    if (/gadget|hardware|device|unbox/.test(text)) {
      if (inf.niche.includes("hardware") || inf.niche.includes("gadgets"))
        score += 4;
    }
    if (/d2c|consumer|lifestyle|brand|shop/.test(text)) {
      if (inf.niche.includes("d2c") || inf.niche.includes("lifestyle")) score += 3;
    }
    if (/trust|review|honest|proof|credibility/.test(text)) {
      if (inf.niche.includes("trust") || inf.id === "inf-rohan") score += 3;
      score += inf.reels.some((r) => r.formatId === "product-review") ? 2 : 0;
    }
    if (/viral|reel|short|awareness|discover/.test(text)) {
      score += inf.reels.some((r) =>
        ["instagram-reel", "youtube-shorts"].includes(r.formatId),
      )
        ? 3
        : 0;
    }
    if (/launch|release|drop/.test(text)) {
      if (inf.niche.includes("launch")) score += 4;
    }
    if (/youtube|long.?form|integration|educat/.test(text)) {
      score += inf.reels.some((r) => r.formatId === "youtube-video") ? 3 : 0;
    }
    // slight diversity boost for higher reach
    score += Number.parseInt(inf.followers, 10) / 200;
    return { inf, score };
  }).sort((a, b) => b.score - a.score);

  const reels: MatchedReel[] = [];
  const seenFormats = new Set<string>();

  for (const { inf } of scored) {
    for (const reel of inf.reels) {
      if (reels.length >= 5) break;
      // Prefer format diversity across the 5
      const formatPenalty = seenFormats.has(reel.formatId) ? 1 : 0;
      if (formatPenalty && reels.length < 3) continue;
      reels.push({
        ...reel,
        influencerId: inf.id,
        influencerName: inf.name,
        influencerHandle: inf.handle,
        followers: inf.followers,
        vibe: inf.vibe,
      });
      seenFormats.add(reel.formatId);
    }
    if (reels.length >= 5) break;
  }

  // Fill to 5 if needed
  if (reels.length < 5) {
    for (const inf of INFLUENCERS) {
      for (const reel of inf.reels) {
        if (reels.some((r) => r.id === reel.id)) continue;
        reels.push({
          ...reel,
          influencerId: inf.id,
          influencerName: inf.name,
          influencerHandle: inf.handle,
          followers: inf.followers,
          vibe: inf.vibe,
        });
        if (reels.length >= 5) break;
      }
      if (reels.length >= 5) break;
    }
  }

  return reels.slice(0, 5);
}

export function getReelById(id: string): MatchedReel | null {
  for (const inf of INFLUENCERS) {
    const reel = inf.reels.find((r) => r.id === id);
    if (reel) {
      return {
        ...reel,
        influencerId: inf.id,
        influencerName: inf.name,
        influencerHandle: inf.handle,
        followers: inf.followers,
        vibe: inf.vibe,
      };
    }
  }
  return null;
}
