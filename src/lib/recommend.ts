import { CAMPAIGN_FORMATS, getFormat, type CampaignFormat } from "./formats";

export type CampaignGoal =
  | "awareness"
  | "trust"
  | "conversions"
  | "launch";

export type ProductType =
  | "saas"
  | "app"
  | "hardware"
  | "d2c"
  | "other";

export type CampaignBrief = {
  brandName: string;
  productName: string;
  productType: ProductType;
  goal: CampaignGoal;
  audience: string;
  story: string;
  want: string;
  timeline: "asap" | "2weeks" | "flexible";
};

export type MatchResult = {
  primary: CampaignFormat;
  alternatives: CampaignFormat[];
  reasons: string[];
  confidence: "high" | "medium";
};

const BRIEF_KEY = "ni_campaign_brief";

export function saveBrief(brief: CampaignBrief) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(BRIEF_KEY, JSON.stringify(brief));
}

export function loadBrief(): CampaignBrief | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(BRIEF_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CampaignBrief;
  } catch {
    return null;
  }
}

export function recommendFromBrief(brief: CampaignBrief): MatchResult {
  const scores = new Map<string, number>();
  const reasons: string[] = [];

  const bump = (id: string, points: number) => {
    scores.set(id, (scores.get(id) ?? 0) + points);
  };

  // Product type signals
  if (brief.productType === "saas") {
    bump("youtube-video", 5);
    bump("product-review", 4);
    reasons.push("SaaS products convert best with long-form demos and reviews.");
  } else if (brief.productType === "app") {
    bump("instagram-reel", 4);
    bump("youtube-shorts", 3);
    bump("product-review", 3);
    reasons.push("Apps win with short walkthroughs plus a deeper feature review.");
  } else if (brief.productType === "hardware") {
    bump("unboxing-video", 5);
    bump("product-review", 4);
    bump("youtube-video", 2);
    reasons.push("Hardware needs first-impression unboxing and hands-on proof.");
  } else if (brief.productType === "d2c") {
    bump("instagram-reel", 5);
    bump("youtube-shorts", 3);
    bump("brand-collaboration", 2);
    reasons.push("D2C brands get discovery from Reels and trend-led Shorts.");
  } else {
    bump("brand-collaboration", 3);
    bump("youtube-video", 2);
  }

  // Goal signals
  if (brief.goal === "awareness") {
    bump("instagram-reel", 4);
    bump("youtube-shorts", 4);
    reasons.push("Awareness goals favor high-reach short-form formats.");
  } else if (brief.goal === "trust") {
    bump("youtube-video", 4);
    bump("product-review", 5);
    reasons.push("Trust is built with authentic reviews and dedicated integrations.");
  } else if (brief.goal === "conversions") {
    bump("youtube-video", 5);
    bump("product-review", 4);
    reasons.push("Conversion campaigns need SEO-ready long-form with clear CTAs.");
  } else if (brief.goal === "launch") {
    bump("unboxing-video", 3);
    bump("brand-collaboration", 4);
    bump("instagram-reel", 2);
    reasons.push("Launches benefit from multi-touch collaboration around release week.");
  }

  // Free-text cues
  const text = `${brief.story} ${brief.want} ${brief.audience}`.toLowerCase();
  if (/seo|demo|tutorial|deep|educat/.test(text)) {
    bump("youtube-video", 3);
    reasons.push("Your brief mentions education/demo — YouTube long-form fits.");
  }
  if (/viral|trend|reel|instagram|aesthetic/.test(text)) {
    bump("instagram-reel", 3);
  }
  if (/unbox|packaging|first look|gadget/.test(text)) {
    bump("unboxing-video", 3);
  }
  if (/review|honest|test|compar/.test(text)) {
    bump("product-review", 3);
  }
  if (/multi|cross.?platform|full funnel|campaign pack/.test(text)) {
    bump("brand-collaboration", 3);
  }

  if (brief.timeline === "asap") {
    bump("instagram-reel", 1);
    bump("youtube-shorts", 1);
  }

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => getFormat(id));

  // Ensure we always have a primary
  const primary = ranked[0] ?? CAMPAIGN_FORMATS[0];
  const alternatives = ranked
    .filter((f) => f.id !== primary.id)
    .slice(0, 2);

  // Fill alternatives if scoring was sparse
  while (alternatives.length < 2) {
    const next = CAMPAIGN_FORMATS.find(
      (f) => f.id !== primary.id && !alternatives.some((a) => a.id === f.id),
    );
    if (!next) break;
    alternatives.push(next);
  }

  const topScore = Math.max(...scores.values(), 0);
  const confidence = topScore >= 8 ? "high" : "medium";

  const uniqueReasons = [...new Set(reasons)].slice(0, 3);

  return {
    primary,
    alternatives,
    reasons:
      uniqueReasons.length > 0
        ? uniqueReasons
        : ["Matched to your product type and campaign goal."],
    confidence,
  };
}
