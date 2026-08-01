import { niId } from "@/lib/ids";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type PaymentStatus = "pending" | "success" | "failed" | "refunded";
export type PaymentProvider = "dummy" | "razorpay";
export type PaymentMethod = "upi" | "card";

export type Payment = {
  id: string;
  paymentRef: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "ni_payments";

function readLocal(): Payment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Payment[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeLocal(list: Payment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * Dummy payment processor — always succeeds for ₹500.
 * Swap provider to "razorpay" + real providerPaymentId when integrating.
 */
export async function createDummyPayment(input: {
  orderId: string;
  method: PaymentMethod;
  amount?: number;
}): Promise<Payment> {
  const now = new Date().toISOString();
  const paymentRef = niId();
  const amount = input.amount ?? 500;

  // Simulate async gateway
  await new Promise((r) => setTimeout(r, 400));

  const payment: Payment = {
    id: paymentRef,
    paymentRef,
    orderId: input.orderId,
    amount,
    currency: "INR",
    method: input.method,
    status: "success",
    provider: "dummy",
    providerPaymentId: `dummy_${paymentRef}`,
    createdAt: now,
    updatedAt: now,
  };

  const list = readLocal();
  list.unshift(payment);
  writeLocal(list);

  if (getSupabaseEnv()) {
    try {
      const supabase = createClient();
      await supabase.from("payments").insert({
        payment_ref: payment.paymentRef,
        order_id: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: payment.status,
        provider: payment.provider,
        provider_payment_id: payment.providerPaymentId,
      });
    } catch {
      // local payment still recorded
    }
  }

  return payment;
}

export function listPayments(): Payment[] {
  return readLocal().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function getPaymentByOrder(orderId: string): Payment | null {
  return readLocal().find((p) => p.orderId === orderId) ?? null;
}
