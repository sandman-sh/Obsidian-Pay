import { clsx } from "clsx";

export function cn(...classes: Array<string | false | null | undefined>) {
  return clsx(classes);
}

export function formatUsdFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function statusTone(status: string) {
  const s = status.toLowerCase();

  if (["paid", "active", "healthy", "succeeded"].includes(s)) {
    return "bg-[var(--green)] text-[var(--ink)]";
  }

  if (["processing", "review", "scheduled", "trialing"].includes(s)) {
    return "bg-[var(--amber)] text-[var(--ink)]";
  }

  if (["failed", "paused", "cancelled"].includes(s)) {
    return "bg-[var(--red)] text-white";
  }

  return "bg-[var(--bg)] text-[var(--ink)]";
}
