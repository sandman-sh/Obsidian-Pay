import { BillingCheckoutButton } from "@/components/billing-actions";
import { AppShell } from "@/components/shell";
import { Card, Heading, Label } from "@/components/cards";
import { getDashboardData } from "@/lib/dashboard";
import { env, hasDodoConfig } from "@/lib/env";
import { formatUsdFromCents, statusTone } from "@/lib/utils";
import { CreditCard, Shield, Webhook, CheckCircle2, XCircle } from "lucide-react";

export default async function BillingPage() {
  const data = await getDashboardData();

  return (
    <AppShell currentPath="/billing">
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        {/* ── Dodo config ───────────────────────────── */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border-2 border-[var(--border)] bg-[var(--blue)] text-white">
              <CreditCard className="h-4 w-4" />
            </div>
            <Heading eyebrow="Monetization" title="Dodo billing" body="SaaS billing via Dodo. Solana handles disbursement." />
          </div>
          <div className="mt-4 space-y-1.5">
            {[
              { icon: Shield, label: "Environment", value: env.dodoEnvironment },
              {
                icon: CreditCard,
                label: "Product",
                value: hasDodoConfig() ? "Configured" : "Missing keys",
                ok: hasDodoConfig(),
              },
              {
                icon: Webhook,
                label: "Webhook",
                value: env.dodoWebhookKey ? "Enabled" : "Waiting",
                ok: Boolean(env.dodoWebhookKey),
              },
            ].map((row) => {
              const Icon = row.icon;
              const StatusIcon = row.ok === false ? XCircle : row.ok === true ? CheckCircle2 : null;
              return (
                <div key={row.label} className="flex items-center gap-3 border-2 border-[var(--border)] bg-[var(--bg)] p-3">
                  <Icon className="h-4 w-4 text-[var(--muted)]" />
                  <div className="flex-1">
                    <Label>{row.label}</Label>
                    <p className="text-xs font-bold uppercase">{row.value}</p>
                  </div>
                  {StatusIcon ? (
                    <StatusIcon
                      className={`h-4 w-4 ${row.ok ? "text-[var(--green)]" : "text-[var(--red)]"}`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <BillingCheckoutButton />
          </div>
        </Card>

        {/* ── Audit trail ───────────────────────────── */}
        <Card>
          <Heading eyebrow="Audit trail" title="Billing activity" body="Webhook events for reconciliation." />
          <div className="mt-4 space-y-2 stagger">
            {data.billingEvents.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">No billing events yet.</p>
            ) : null}
            {data.billingEvents.map((ev) => (
              <div key={ev.id} className="border-2 border-[var(--border)] bg-[var(--bg)] p-3.5 transition-all hover:shadow-[var(--sh-sm)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">{ev.eventType}</p>
                    <p className="mt-0.5 text-[0.6rem] text-[var(--muted)] line-clamp-1">{ev.notes ?? "Webhook record stored."}</p>
                  </div>
                  <span className={`badge ${statusTone(ev.status)}`}>{ev.status}</span>
                </div>
                <p className="mt-2 text-sm font-bold uppercase">
                  {ev.amountUsdCents ? formatUsdFromCents(ev.amountUsdCents) : "—"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
