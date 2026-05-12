import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck, Wallet, Zap } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "USDC Treasury",
    body: "Fund a devnet treasury, review allocations, execute USDC payouts in one click.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    body: "Quote payroll in INR, USD, EUR, GBP, AED, or SGD with live FX rates.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-Grade",
    body: "Every payout stores its Solana tx signature for reconciliation.",
  },
  {
    icon: Zap,
    title: "Dodo Billing",
    body: "Employer-facing SaaS subscriptions with webhook ingestion.",
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="min-h-screen text-[var(--ink)]">
      {/* ── Ticker ──────────────────────────────────── */}
      <div className="ticker-bar">
        <div className="ticker-inner">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i}>
              SOLANA USDC ● GLOBAL PAYROLL ● DODO PAYMENTS ● MULTI-CURRENCY ● DEVNET ●
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
        {/* ── Hero ──────────────────────────────────── */}
        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="border-2 border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--sh-lg)] anim-in md:p-12">
            <div className="flex items-center gap-2">
              <img src="/icon.png" alt="OBSIDIAN PAY" className="h-4 w-4" />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                Global payroll for remote-first companies
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-black uppercase leading-[0.92] tracking-tight md:text-5xl lg:text-6xl">
              Pay teams in
              <br />
              <span className="text-[var(--blue)]">Solana USDC.</span>
              <br />
              Report in their
              <br />
              native currency.
            </h1>
            <p className="mt-6 max-w-lg text-sm text-[var(--muted)] leading-relaxed">
              OBSIDIAN PAY combines Solana devnet settlement,
              Dodo-powered SaaS billing, local-currency quoting, payroll
              run approvals, and audit-grade payout logs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn btn-primary">
                Open Control Room
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/billing" className="btn">
                Dodo Billing
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right stack */}
          <div className="flex flex-col gap-5">
            <div className="border-2 border-[var(--border)] bg-[var(--ink)] p-6 text-white shadow-[var(--sh-lg)] anim-in">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-zinc-400">
                What ships now
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-bold uppercase tracking-tight stagger">
                {[
                  "Employee registry with wallets & compensation",
                  "Payroll runs with FX snapshots",
                  "Devnet USDC disbursements via treasury",
                  "Dodo checkout & webhook ingestion",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 bg-[var(--green)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--sh-lg)] anim-in">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                Architecture
              </p>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                Dodo handles employer-facing subscription billing. Solana devnet
                handles the treasury-to-wallet payout path. Native-currency
                amounts are quoted in-app for distributed teams.
              </p>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────── */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 stagger">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group border-2 border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--sh-md)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--sh-lg)]"
              >
                <div className="flex h-9 w-9 items-center justify-center border-2 border-[var(--border)] bg-[var(--bg)] transition-colors group-hover:bg-[var(--blue)] group-hover:text-white group-hover:border-[var(--blue)]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-black uppercase tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                  {f.body}
                </p>
              </div>
            );
          })}
        </section>

        {/* ── Footer ────────────────────────────────── */}
        <footer className="mt-10 border-2 border-[var(--border)] bg-[var(--ink)] p-6 text-white shadow-[var(--sh-lg)] anim-in">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-zinc-500">
                OBSIDIAN PAY
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                Built on Solana, powered by Dodo Payments.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="btn border-white bg-white text-[var(--ink)] shadow-[5px_5px_0_0_rgba(255,255,255,0.15)]"
            >
              Launch App
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
