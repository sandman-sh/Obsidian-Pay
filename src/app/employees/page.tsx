import { AppShell } from "@/components/shell";
import { Card, Heading, Label } from "@/components/cards";
import { createEmployee } from "@/app/actions";
import { getDashboardData } from "@/lib/dashboard";
import { formatUsdFromCents, statusTone } from "@/lib/utils";
import { UserPlus, MapPin, Wallet, Briefcase } from "lucide-react";

export default async function EmployeesPage() {
  const data = await getDashboardData();

  return (
    <AppShell currentPath="/employees">
      <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        {/* ── Form ──────────────────────────────────── */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border-2 border-[var(--border)] bg-[var(--blue)] text-white">
              <UserPlus className="h-4 w-4" />
            </div>
            <Heading eyebrow="Onboard" title="Add a teammate" />
          </div>
          <form action={createEmployee} className="mt-4 grid gap-2.5">
            <input name="fullName" placeholder="Full name" className="field" required />
            <input name="email" type="email" placeholder="Email" className="field" required />
            <div className="grid gap-2.5 md:grid-cols-2">
              <input name="country" placeholder="Country" className="field" required />
              <input name="nativeCurrency" placeholder="Currency (INR, USD)" className="field" required />
            </div>
            <div className="grid gap-2.5 md:grid-cols-2">
              <input name="monthlySalaryUsd" type="number" step="0.01" placeholder="Monthly salary USD" className="field" required />
              <input name="bonusUsd" type="number" step="0.01" placeholder="Monthly bonus USD" className="field" defaultValue="0" required />
            </div>
            <div className="grid gap-2.5 md:grid-cols-2">
              <input name="department" placeholder="Department" className="field" required />
              <input name="title" placeholder="Title" className="field" required />
            </div>
            <textarea name="walletAddress" placeholder="Solana wallet address" className="field min-h-20 resize-none" required />
            <button type="submit" className="btn btn-primary">
              <UserPlus className="h-3.5 w-3.5" /> Save Employee
            </button>
          </form>
        </Card>

        {/* ── Roster ────────────────────────────────── */}
        <Card>
          <Heading eyebrow="Registry" title="Team roster" body="Payroll-ready employees." />
          <div className="mt-4 space-y-2.5 stagger">
            {data.employees.map((emp) => (
              <div key={emp.id} className="border-2 border-[var(--border)] bg-[var(--bg)] p-3.5 transition-all hover:shadow-[var(--sh-sm)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">{emp.fullName}</p>
                    <p className="text-[0.6rem] text-[var(--muted)]">{emp.title} · {emp.department}</p>
                  </div>
                  <span className={`badge ${statusTone(emp.status)}`}>{emp.status}</span>
                </div>
                <div className="mt-2.5 grid gap-1.5 sm:grid-cols-3">
                  <div className="flex items-center gap-1.5 border border-[var(--subtle)] bg-[var(--surface)] p-2">
                    <Briefcase className="h-3 w-3 text-[var(--muted)]" />
                    <div>
                      <Label>Pay</Label>
                      <p className="text-[0.65rem] font-bold uppercase">{formatUsdFromCents(emp.monthlySalaryUsdCents + emp.bonusUsdCents)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 border border-[var(--subtle)] bg-[var(--surface)] p-2">
                    <MapPin className="h-3 w-3 text-[var(--muted)]" />
                    <div>
                      <Label>Country</Label>
                      <p className="text-[0.65rem] font-bold uppercase">{emp.country} · {emp.nativeCurrency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 border border-[var(--subtle)] bg-[var(--surface)] p-2">
                    <Wallet className="h-3 w-3 text-[var(--muted)]" />
                    <div>
                      <Label>Wallet</Label>
                      <p className="truncate font-mono text-[0.55rem]">{emp.walletAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
