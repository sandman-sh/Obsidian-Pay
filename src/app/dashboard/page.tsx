import { AppShell } from "@/components/shell";
import { Card, Metric, Heading, Chip, Label } from "@/components/cards";
import { getDashboardData } from "@/lib/dashboard";
import { formatCurrency, formatUsdFromCents, statusTone } from "@/lib/utils";
import { Users, DollarSign, Landmark, CreditCard, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const latestRun = data.payrollRuns[0];
  const active = data.employees.filter((e) => e.status === "active");

  return (
    <AppShell currentPath="/dashboard">
      {/* ── Metrics ─────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 stagger">
        <Metric
          label="Active teammates"
          value={String(active.length)}
          helper="Ready for next payroll run"
          icon={<Users className="h-4 w-4" />}
        />
        <Metric
          label="Annualized payroll"
          value={formatUsdFromCents(data.annualizedUsdCents)}
          helper="Base compensation across actives"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <Metric
          label="Treasury USDC"
          value={`${data.treasury?.usdc?.toFixed(2) ?? "0.00"}`}
          helper="Devnet treasury balance"
          icon={<Landmark className="h-4 w-4" />}
        />
        <Metric
          label="Billing status"
          value={data.organization.dodoSubscriptionState}
          helper="Dodo subscription state"
          icon={<CreditCard className="h-4 w-4" />}
        />
      </section>

      {/* ── Main grid ───────────────────────────────── */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Left: team table */}
        <Card className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <Heading
              eyebrow="Operating picture"
              title="Team payroll overview"
              body="Salary, local currency conversion, and wallet addresses."
            />
            <Link href="/employees" className="btn text-[0.65rem]">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <Chip
              label="Treasury wallet"
              value={data.treasury?.wallet ?? "Add SOLANA_TREASURY_SECRET_KEY"}
              className="bg-[var(--bg)]"
            />
            <Chip
              label="USDC mint"
              value={data.treasury?.usdcMint ?? "4zMMC9...ncDU"}
              className="bg-[var(--bg)]"
            />
          </div>

          <div className="b-table">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>USD base</th>
                  <th>Native</th>
                  <th>Wallet</th>
                </tr>
              </thead>
              <tbody>
                {active.map((emp) => {
                  const total = emp.monthlySalaryUsdCents + emp.bonusUsdCents;
                  const fx = data.fxRates[emp.nativeCurrency] ?? 1;
                  return (
                    <tr key={emp.id}>
                      <td>
                        <p className="text-xs font-bold uppercase">{emp.fullName}</p>
                        <p className="text-[0.6rem] text-[var(--muted)]">{emp.title}</p>
                      </td>
                      <td className="text-xs font-semibold">{formatUsdFromCents(total)}</td>
                      <td className="text-xs">{formatCurrency((total / 100) * fx, emp.nativeCurrency)}</td>
                      <td className="max-w-[160px] truncate font-mono text-[0.6rem] text-[var(--muted)]">{emp.walletAddress}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: latest run + billing */}
        <div className="flex flex-col gap-4">
          <Card className="border-[var(--blue)] shadow-[5px_5px_0_0_rgba(61,90,254,0.2)]">
            <Heading
              eyebrow="Latest run"
              title={latestRun ? latestRun.periodLabel : "No payroll runs yet"}
              body="USD amount, native conversions, and payout signatures."
            />
            {latestRun ? (
              <div className="mt-3 grid gap-1.5 stagger">
                <Chip label="Code" value={latestRun.code} className="bg-[var(--bg)]" />
                <Chip label="Total" value={formatUsdFromCents(latestRun.totalUsdCents)} className="bg-[var(--bg)]" />
                <div className="flex items-center gap-2">
                  <Chip label="Status" value={latestRun.status} className="flex-1 bg-[var(--bg)]" />
                  <Link href="/payroll" className="btn text-[0.6rem]">
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ) : null}
          </Card>

          <Card>
            <Heading
              eyebrow="Billing feed"
              title="Recent Dodo events"
            />
            <div className="mt-3 space-y-1.5 stagger">
              {data.billingEvents.length === 0 ? (
                <p className="text-xs text-[var(--muted)]">No billing events yet.</p>
              ) : null}
              {data.billingEvents.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between gap-3 border-2 border-[var(--border)] bg-[var(--bg)] p-2.5">
                  <div>
                    <p className="text-xs font-black uppercase">{ev.eventType}</p>
                    <p className="text-[0.6rem] text-[var(--muted)]">
                      {ev.amountUsdCents ? formatUsdFromCents(ev.amountUsdCents) : "—"}
                    </p>
                  </div>
                  <span className={`badge ${statusTone(ev.status)}`}>{ev.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
