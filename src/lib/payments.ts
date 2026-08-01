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
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_PREFIX = "ni_payments:";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function readLocal(userId: string): Payment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const list = JSON.parse(raw) as Payment[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeLocal(userId: string, list: Payment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(list));
}

/**
 * Dummy payment processor — always succeeds for ₹500.
 * Swap provider to "razorpay" + real providerPaymentId when integrating.
 */
export async function createDummyPayment(input: {
  orderId: string;
  userId: string;
  method: PaymentMethod;
  amount?: number;
}): Promise<Payment> {
  const now = new Date().toISOString();
  const paymentRef = niId();
  const amount = input.amount ?? 500;

  await new Promise((r) => setTimeout(r, 400));

  const payment: Payment = {
    id: paymentRef,
    paymentRef,
    orderId: input.orderId,
    userId: input.userId,
    amount,
    currency: "INR",
    method: input.method,
    status: "success",
    provider: "dummy",
    providerPaymentId: `dummy_${paymentRef}`,
    createdAt: now,
    updatedAt: now,
  };

  const list = readLocal(input.userId);
  list.unshift(payment);
  writeLocal(input.userId, list);

  if (getSupabaseEnv() && input.userId !== "demo") {
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

export function listPayments(userId: string): Payment[] {
  return readLocal(userId).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function getPaymentByOrder(
  userId: string,
  orderId: string,
): Payment | null {
  return readLocal(userId).find((p) => p.orderId === orderId) ?? null;
}
