"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export function ExecutePayoutButton({ runId }: { runId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleExecute() {
    setState("loading");
    setMessage(null);

    const response = await fetch(`/api/payouts/${runId}`, { method: "POST" });
    const payload = (await response.json()) as { message?: string; error?: string };

    if (!response.ok) {
      setState("idle");
      setMessage(payload.error ?? "Payout failed.");
      return;
    }

    setState("done");
    setMessage(payload.message ?? "Payroll sent.");
    window.location.reload();
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={handleExecute}
        disabled={state === "loading"}
        className="btn btn-success disabled:cursor-wait disabled:opacity-60"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-3.5 w-3.5" />
            Execute Payout
          </>
        )}
      </button>
      {message ? (
        <p className="text-xs font-semibold text-[var(--muted)]">{message}</p>
      ) : null}
    </div>
  );
}
