import { createPayrollRun } from "@/app/actions";
import { ExecutePayoutButton } from "@/components/payout-button";
import { AppShell } from "@/components/shell";
import { Card, Heading, Chip } from "@/components/cards";
import { getDashboardData } from "@/lib/dashboard";
import { formatCurrency, formatUsdFromCents, statusTone } from "@/lib/utils";
import { ClipboardList, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PayrollPage() {
  const data = await getDashboardData();

  return (
    <AppShell currentPath="/payroll">
      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        {/* ── Create run ────────────────────────────── */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border-2 border-[var(--border)] bg-[var(--blue)] text-white">
              <ClipboardList className="h-4 w-4" />
            </div>
            <Heading eyebrow="Create run" title="Generate batch" />
          </div>
          <form action={createPayrollRun} className="mt-4 space-y-2.5">
            <input name="periodLabel" placeholder="May 2026 Payroll" className="field" required />
            <button type="submit" className="btn btn-primary">
              <ClipboardList className="h-3.5 w-3.5" /> Snapshot Run
            </button>
          </form>
          <div className="mt-4 border-2 border-[var(--border)] bg-[var(--bg)] p-3.5">
            <div className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-[var(--muted)]" />
              <p className="text-xs font-black uppercase">Notes</p>
            </div>
            <ul className="mt-2 space-y-1 text-[0.65rem] text-[var(--muted)]">
              <li>→ Fund devnet treasury with SOL + USDC</li>
              <li>→ USDC transfers settle to employee ATAs</li>
              <li>→ Payout stores Solana signature for audit</li>
            </ul>
          </div>
        </Card>

        {/* ── Run queue ─────────────────────────────── */}
        <Card>
          <Heading eyebrow="Run queue" title="Review & execute" body="Runs stay in review until treasury sends USDC on devnet." />
          <div className="mt-4 space-y-3 stagger">
            {data.payrollRuns.length === 0 ? (
              <p className="text-xs text-[var(--muted)]">No runs created yet.</p>
            ) : null}
            {data.payrollRuns.map((run) => (
              <div key={run.id} className="border-2 border-[var(--border)] bg-[var(--bg)] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-black uppercase tracking-tight">{run.periodLabel}</p>
                    <p className="font-mono text-[0.55rem] text-[var(--muted)]">{run.code}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${statusTone(run.status)}`}>{run.status}</span>
                    {run.status !== "paid" ? <ExecutePayoutButton runId={run.id} /> : null}
                  </div>
                </div>
                <div className="mt-2.5 grid gap-1.5 md:grid-cols-2">
                  <Chip label="USD total" value={formatUsdFromCents(run.totalUsdCents)} className="bg-[var(--surface)]" />
                  <Chip label="Line items" value={`${run.items.length} payouts`} className="bg-[var(--surface)]" />
                </div>
                {run.items.length > 0 ? (
                  <div className="b-table mt-2.5">
                    <table className="w-full text-left">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>USD</th>
                          <th>Local</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {run.items.map((item) => (
                          <tr key={item.id}>
                            <td className="text-xs font-bold uppercase">{item.employee.fullName}</td>
                            <td className="text-xs">{formatUsdFromCents(item.usdAmountCents)}</td>
                            <td className="text-xs">{formatCurrency(item.localAmount, item.localCurrency)}</td>
                            <td>
                              <span className={`badge ${statusTone(item.status)}`}>{item.status}</span>
                              {item.txSignature ? (
                                <p className="mt-0.5 truncate font-mono text-[0.5rem] text-[var(--muted)]">{item.txSignature}</p>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
