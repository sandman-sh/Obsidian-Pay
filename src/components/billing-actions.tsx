"use client";

import { useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";

export function BillingCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", { method: "POST" });
      const payload = (await response.json()) as { checkoutUrl?: string; error?: string };

      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Unable to create checkout session.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Checkout failed.");
      setLoading(false);
      return;
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="btn btn-primary disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Opening Dodo…
          </>
        ) : (
          <>
            <ArrowUpRight className="h-3.5 w-3.5" />
            Upgrade with Dodo
          </>
        )}
      </button>
      {error ? (
        <p className="border-2 border-[var(--red)] bg-red-50 px-3 py-2 text-xs font-semibold text-[var(--red)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
