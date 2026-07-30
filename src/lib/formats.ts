export type CampaignFormat = {
  id: string;
  title: string;
  subtitle: string;
  icon: "play" | "reel" | "shorts" | "review" | "unboxing" | "collab";
  description: string;
  deliverables: string[];
  recommendation?: string;
};

export const CAMPAIGN_FORMATS: CampaignFormat[] = [
  {
    id: "youtube-video",
    title: "YouTube Video",
    subtitle: "Dedicated long-form integration",
    icon: "play",
    description:
      "Dedicated long-form integration of 5-15 mins duration. Ideal for deep product educational reviews, SaaS demos, and high trust building. Includes SEO-optimized title & description mapping.",
    deliverables: [
      "Dedicated 5-15 mins video content focused entirely on your product value props",
      "Link placement at the very top of description & pinned comment section",
      "SEO optimized titles, tags and metadata matching tech-search trends in India",
      "Comprehensive analytics dashboard for views, clicks & conversion tracking",
    ],
    recommendation:
      "YouTube Videos have a 3.4x higher conversion rate for tech and SaaS products in India.",
  },
  {
    id: "instagram-reel",
    title: "Instagram Reel",
    subtitle: "Short high-impact aesthetic viral video",
    icon: "reel",
    description:
      "High-energy short-form Reels engineered for discovery. Ideal for product drops, feature highlights, and lifestyle storytelling under 60 seconds.",
    deliverables: [
      "15–60 sec vertical Reel tailored to your brand aesthetic",
      "Story reshare + swipe-up / link sticker where eligible",
      "Trending audio & caption strategy for reach",
      "Performance snapshot: views, shares, saves & profile visits",
    ],
  },
  {
    id: "youtube-shorts",
    title: "YouTube Shorts",
    subtitle: "Quick rapid-fire trend integrations",
    icon: "shorts",
    description:
      "Rapid-fire Shorts built around trends and hooks. Great for awareness bursts and driving traffic into longer product content.",
    deliverables: [
      "Hook-first Shorts under 60 seconds",
      "End-screen / pinned comment CTA to your offer",
      "Trend-aligned packaging for Shorts feed discovery",
      "View & engagement reporting within 7 days of publish",
    ],
  },
  {
    id: "product-review",
    title: "Product Review",
    subtitle: "Detailed authentic testing & feedback",
    icon: "review",
    description:
      "Authentic hands-on testing with honest feedback. Builds trust for SaaS, gadgets, and consumer products seeking conversion-ready proof.",
    deliverables: [
      "Structured review covering pros, cons & use cases",
      "On-screen demos of core workflows or features",
      "SEO-ready title & description with product keywords",
      "Pinned comment with offer link and discount code support",
    ],
  },
  {
    id: "unboxing-video",
    title: "Unboxing Video",
    subtitle: "Excitement builder for first impressions",
    icon: "unboxing",
    description:
      "First-impression unboxing that captures excitement and packaging quality — perfect for hardware, kits, and premium product launches.",
    deliverables: [
      "Full unboxing with first reactions and setup",
      "Close-up shots of packaging & product details",
      "Call-to-action for where to buy / claim offer",
      "Thumbnail concepts optimized for click-through",
    ],
  },
  {
    id: "brand-collaboration",
    title: "Brand Collaboration",
    subtitle: "Cross-platform custom campaign",
    icon: "collab",
    description:
      "Custom multi-platform collaboration spanning YouTube, Instagram, and community channels — built around your launch calendar.",
    deliverables: [
      "Cross-platform content plan tailored to your goals",
      "Coordinated publish windows across formats",
      "Dedicated strategist for brief & creative alignment",
      "Unified reporting across all campaign assets",
    ],
  },
];

export type SampleVideo = {
  id: string;
  title: string;
  views: string;
  duration: string;
  gradient: string;
  imageHint: string;
};

export const SAMPLE_VIDEOS: Record<string, SampleVideo[]> = {
  "youtube-video": [
    {
      id: "saas-demo",
      title: "Tech Product Review — SaaS Demo",
      views: "145K views",
      duration: "12:40 mins",
      gradient: "from-slate-700 via-indigo-800 to-slate-900",
      imageHint: "SaaS dashboard demo",
    },
    {
      id: "app-walkthrough",
      title: "App Feature Walkthrough",
      views: "89K views",
      duration: "08:15 mins",
      gradient: "from-violet-600 via-fuchsia-600 to-orange-500",
      imageHint: "Mobile app UI",
    },
    {
      id: "unboxing",
      title: "Unboxing & First Impressions",
      views: "210K views",
      duration: "15:30 mins",
      gradient: "from-amber-700 via-stone-600 to-neutral-800",
      imageHint: "Product unboxing",
    },
  ],
  default: [
    {
      id: "sample-1",
      title: "Creator Sample Campaign",
      views: "98K views",
      duration: "09:20 mins",
      gradient: "from-purple-700 via-indigo-700 to-slate-900",
      imageHint: "Campaign sample",
    },
    {
      id: "sample-2",
      title: "Product Highlight Reel",
      views: "122K views",
      duration: "06:45 mins",
      gradient: "from-orange-600 via-rose-600 to-purple-800",
      imageHint: "Product highlight",
    },
    {
      id: "sample-3",
      title: "Launch Day Coverage",
      views: "176K views",
      duration: "11:10 mins",
      gradient: "from-teal-700 via-cyan-800 to-slate-900",
      imageHint: "Launch coverage",
    },
  ],
};

export function getFormat(id: string | null | undefined) {
  return CAMPAIGN_FORMATS.find((f) => f.id === id) ?? CAMPAIGN_FORMATS[0];
}

export function getSamples(formatId: string) {
  return SAMPLE_VIDEOS[formatId] ?? SAMPLE_VIDEOS.default;
}

export const BOOKING = {
  tokenAmount: 500,
  packageName: "Gold YouTube Package",
  orderId: "NI-9836",
  orderIdFull: "NI-9836-YT",
  campaignValue: 36000,
  originalValue: 45000,
};
