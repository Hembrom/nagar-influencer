import { CAMPAIGN_FORMATS, getFormat, type CampaignFormat } from "./formats";
import { getReelById, type MatchedReel } from "./influencers";

export type ChatBrief = {
  story: string;
  want: string;
  productHint: string;
  selectedReelId?: string;
};

export type MatchResult = {
  primary: CampaignFormat;
  alternatives: CampaignFormat[];
  reasons: string[];
  confidence: "high" | "medium";
  reel: MatchedReel | null;
  productHint: string;
};

const BRIEF_KEY = "ni_chat_brief";

export function saveChatBrief(brief: ChatBrief) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(BRIEF_KEY, JSON.stringify(brief));
}

export function loadChatBrief(): ChatBrief | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(BRIEF_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ChatBrief;
  } catch {
    return null;
  }
}

export function updateSelectedReel(reelId: string) {
  const brief = loadChatBrief();
  if (!brief) return;
  saveChatBrief({ ...brief, selectedReelId: reelId });
}

function inferProductHint(story: string, want: string) {
  const text = `${story} ${want}`.trim();
  const firstLine = text.split(/[.\n]/)[0]?.trim() ?? "";
  if (firstLine.length > 8 && firstLine.length < 80) return firstLine;
  const words = text.split(/\s+/).slice(0, 6).join(" ");
  return words || "your product";
}

export function buildChatBrief(story: string, want: string): ChatBrief {
  return {
    story: story.trim(),
    want: want.trim(),
    productHint: inferProductHint(story, want),
  };
}

export function recommendFromSelection(brief: ChatBrief): MatchResult {
  const reel = brief.selectedReelId
    ? getReelById(brief.selectedReelId)
    : null;

  const primaryId = reel?.formatId ?? "youtube-video";
  const primary = getFormat(primaryId);

  const text = `${brief.story} ${brief.want}`.toLowerCase();
  const scores = new Map<string, number>();
  const bump = (id: string, n: number) =>
    scores.set(id, (scores.get(id) ?? 0) + n);

  bump(primaryId, 10);

  for (const f of CAMPAIGN_FORMATS) {
    if (f.id === primaryId) continue;
    bump(f.id, 1);
  }

  if (/trust|review|proof/.test(text)) bump("product-review", 3);
  if (/viral|reel|awareness/.test(text)) bump("instagram-reel", 3);
  if (/short/.test(text)) bump("youtube-shorts", 2);
  if (/unbox|gadget|hardware/.test(text)) bump("unboxing-video", 3);
  if (/launch|multi|cross/.test(text)) bump("brand-collaboration", 3);
  if (/demo|saas|youtube|long/.test(text)) bump("youtube-video", 2);

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => getFormat(id));

  const alternatives = ranked
    .filter((f) => f.id !== primary.id)
    .slice(0, 2);

  const reasons: string[] = [];
  if (reel) {
    reasons.push(
      `You liked ${reel.influencerName}'s “${reel.title}” — we locked ${reel.formatLabel} as the lead format.`,
    );
    reasons.push(`${reel.influencerName} (${reel.followers}) fits: ${reel.vibe}.`);
  }
  if (brief.story) {
    reasons.push(
      `Matched from your product story: “${brief.story.slice(0, 120)}${brief.story.length > 120 ? "…" : ""}”`,
    );
  }

  return {
    primary,
    alternatives,
    reasons:
      reasons.length > 0
        ? reasons
        : ["Matched from your story and the reel you chose."],
    confidence: reel ? "high" : "medium",
    reel,
    productHint: brief.productHint,
  };
}

/** @deprecated kept for any stray imports — use ChatBrief */
export type CampaignBrief = ChatBrief;
export function saveBrief(brief: ChatBrief) {
  saveChatBrief(brief);
}
export function loadBrief() {
  return loadChatBrief();
}
export function recommendFromBrief(brief: ChatBrief) {
  return recommendFromSelection(brief);
}
