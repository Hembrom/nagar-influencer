import { getFormat } from "@/lib/formats";
import { loadChatBrief } from "@/lib/recommend";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type CampaignStatus =
  | "order_placed"
  | "representative_assigned"
  | "campaign_finalized"
  | "campaign_live"
  | "cancelled"
  | "refunded";

export type Campaign = {
  id: string;
  orderId: string;
  formatId: string;
  packageName: string;
  tokenAmount: number;
  paymentMethod: "upi" | "card";
  status: CampaignStatus;
  productHint?: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "ni_campaigns";

export const STATUS_LABEL: Record<CampaignStatus, string> = {
  order_placed: "Order Placed",
  representative_assigned: "Representative Assigned",
  campaign_finalized: "Campaign Finalized",
  campaign_live: "Campaign Live",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function readLocal(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Campaign[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeLocal(list: Campaign[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatCode(formatId: string) {
  const map: Record<string, string> = {
    "youtube-video": "YT",
    "instagram-reel": "IG",
    "youtube-shorts": "YS",
    "product-review": "PR",
    "unboxing-video": "UB",
    "brand-collaboration": "BC",
  };
  return map[formatId] ?? "CM";
}

export function generateOrderId(formatId: string) {
  const n = Math.floor(1000 + Math.random() * 9000);
  return {
    orderId: `NI-${n}`,
    orderIdFull: `NI-${n}-${formatCode(formatId)}`,
  };
}

export function packageNameFor(formatId: string, productHint?: string) {
  const format = getFormat(formatId);
  const hint = productHint?.trim();
  if (hint && hint.length < 48) {
    return `${hint} · ${format.title}`;
  }
  return `Gold ${format.title} Package`;
}

export function listCampaigns(): Campaign[] {
  return readLocal().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function getCampaign(orderId: string): Campaign | null {
  return readLocal().find((c) => c.orderId === orderId) ?? null;
}

export async function createCampaign(input: {
  formatId: string;
  paymentMethod: "upi" | "card";
}): Promise<Campaign> {
  const brief = loadChatBrief();
  const { orderId, orderIdFull } = generateOrderId(input.formatId);
  const now = new Date().toISOString();
  const productHint = brief?.productHint;
  const campaign: Campaign = {
    id: orderIdFull,
    orderId,
    formatId: input.formatId,
    packageName: packageNameFor(input.formatId, productHint),
    tokenAmount: 500,
    paymentMethod: input.paymentMethod,
    status: "order_placed",
    productHint,
    createdAt: now,
    updatedAt: now,
  };

  const list = readLocal();
  list.unshift(campaign);
  writeLocal(list);

  if (getSupabaseEnv()) {
    try {
      const supabase = createClient();
      await supabase.from("bookings").insert({
        order_id: orderId,
        format_id: input.formatId,
        package_name: campaign.packageName,
        token_amount: campaign.tokenAmount,
        payment_method: input.paymentMethod,
        status: campaign.status,
      });
    } catch {
      // local list remains source of truth when Supabase fails
    }
  }

  return campaign;
}

export function formatRelativeDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  ) {
    return "Yesterday";
  }
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
