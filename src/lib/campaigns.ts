import { getFormat } from "@/lib/formats";
import { niId } from "@/lib/ids";
import { createDummyPayment } from "@/lib/payments";
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
  userId: string;
  formatId: string;
  packageName: string;
  tokenAmount: number;
  paymentMethod: "upi" | "card";
  paymentRef: string;
  status: CampaignStatus;
  productHint?: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_PREFIX = "ni_campaigns:";

export const STATUS_LABEL: Record<CampaignStatus, string> = {
  order_placed: "Order Placed",
  representative_assigned: "Representative Assigned",
  campaign_finalized: "Campaign Finalized",
  campaign_live: "Campaign Live",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function readLocal(userId: string): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const list = JSON.parse(raw) as Campaign[];
    return Array.isArray(list) ? list.filter((c) => c.userId === userId) : [];
  } catch {
    return [];
  }
}

function writeLocal(userId: string, list: Campaign[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(list));
}

export async function getCurrentUserId(): Promise<string | null> {
  if (!getSupabaseEnv()) return null;
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/** Resolve account key for storage — logged-in user, else demo bucket */
export async function resolveAccountId(): Promise<string> {
  return (await getCurrentUserId()) ?? "demo";
}

export function packageNameFor(formatId: string, productHint?: string) {
  const format = getFormat(formatId);
  const hint = productHint?.trim();
  if (hint && hint.length < 48) {
    return `${hint} · ${format.title}`;
  }
  return `Gold ${format.title} Package`;
}

function mapBookingRow(row: {
  order_id: string;
  user_id: string | null;
  format_id: string;
  package_name: string;
  token_amount: number;
  payment_method: "upi" | "card";
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
}): Campaign {
  return {
    id: row.order_id,
    orderId: row.order_id,
    userId: row.user_id ?? "unknown",
    formatId: row.format_id,
    packageName: row.package_name,
    tokenAmount: row.token_amount,
    paymentMethod: row.payment_method,
    paymentRef: "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const DUMMY_LIVE_CAMPAIGN: Campaign = {
  id: "demo-live-campaign",
  orderId: "NI-1689494386602",
  userId: "demo",
  formatId: "instagram-reel",
  packageName: "Product Launch · Instagram Reel",
  tokenAmount: 500,
  paymentMethod: "card",
  paymentRef: "PAY-DUMMY-001",
  status: "campaign_live",
  productHint: "E-commerce platform launch",
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
};

export async function listCampaigns(): Promise<Campaign[]> {
  const accountId = await resolveAccountId();
  const local = readLocal(accountId);

  if (getSupabaseEnv() && accountId !== "demo") {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", accountId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const remote = data.map(mapBookingRow);
        // Prefer remote as source of truth; keep local-only rows not yet synced
        const remoteIds = new Set(remote.map((c) => c.orderId));
        const localOnly = local.filter((c) => !remoteIds.has(c.orderId));
        const merged = [...remote, ...localOnly].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
        );
        writeLocal(accountId, merged);
        return merged;
      }
    } catch {
      // fall back to local
    }
  }

  const campaigns = local.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );

  // For demo mode, add dummy live campaign for testing
  if (accountId === "demo") {
    const hasDummyLive = campaigns.some((c) => c.id === "demo-live-campaign");
    if (!hasDummyLive) {
      campaigns.unshift(DUMMY_LIVE_CAMPAIGN);
    }
  }

  return campaigns;
}

export async function getCampaign(orderId: string): Promise<Campaign | null> {
  const accountId = await resolveAccountId();
  
  // Check dummy live campaign
  if (accountId === "demo" && orderId === "demo-live-campaign") {
    return DUMMY_LIVE_CAMPAIGN;
  }
  
  const local =
    readLocal(accountId).find(
      (c) => c.orderId === orderId || c.id === orderId,
    ) ?? null;

  if (local) return local;

  if (getSupabaseEnv() && accountId !== "demo") {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("order_id", orderId)
        .eq("user_id", accountId)
        .maybeSingle();
      if (data) return mapBookingRow(data);
    } catch {
      // ignore
    }
  }

  return null;
}

export async function createCampaign(input: {
  formatId: string;
  paymentMethod: "upi" | "card";
}): Promise<Campaign> {
  const accountId = await resolveAccountId();
  const brief = loadChatBrief();
  const orderId = niId();
  const now = new Date().toISOString();
  const productHint = brief?.productHint;
  const tokenAmount = 500;
  const packageName = packageNameFor(input.formatId, productHint);

  if (getSupabaseEnv() && accountId !== "demo") {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("bookings").insert({
        order_id: orderId,
        user_id: accountId,
        format_id: input.formatId,
        package_name: packageName,
        token_amount: tokenAmount,
        payment_method: input.paymentMethod,
        status: "order_placed",
      });
      if (error) {
        console.warn("bookings insert failed", error.message);
      }
    } catch {
      // continue with local
    }
  }

  const payment = await createDummyPayment({
    orderId,
    userId: accountId,
    method: input.paymentMethod,
    amount: tokenAmount,
  });

  const campaign: Campaign = {
    id: orderId,
    orderId,
    userId: accountId,
    formatId: input.formatId,
    packageName,
    tokenAmount,
    paymentMethod: input.paymentMethod,
    paymentRef: payment.paymentRef,
    status: "order_placed",
    productHint,
    createdAt: now,
    updatedAt: now,
  };

  const list = readLocal(accountId);
  list.unshift(campaign);
  writeLocal(accountId, list);

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
