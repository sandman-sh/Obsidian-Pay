import Link from "next/link";
import { ReactNode } from "react";
import {
  ArrowRightLeft,
  BanknoteArrowDown,
  LayoutDashboard,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderWalletButton } from "@/components/header-wallet";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/employees", label: "Team", icon: Users },
  { href: "/payroll", label: "Payroll", icon: BanknoteArrowDown },
  { href: "/billing", label: "Billing", icon: ArrowRightLeft },
];

export function AppShell({
  children,
  currentPath,
}: {
  children: ReactNode;
  currentPath: string;
}) {
  const currentLabel =
    links.find((l) => l.href === currentPath)?.label ?? "Control Room";

  return (
    <div className="min-h-screen text-[var(--ink)]">
      {/* ── Top ticker ──────────────────────────────── */}
      <div className="ticker-bar">
        <div className="ticker-inner">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i}>
              SOLANA USDC ● GLOBAL PAYROLL ● DODO BILLING ● NATIVE CURRENCY ● DEVNET LIVE ●
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[1400px] gap-0 md:gap-5 px-4 py-5 md:px-6">
        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="hidden w-[260px] shrink-0 flex-col gap-3 lg:flex anim-slide">
          {/* Logo block */}
          <Link
            href="/"
            className="group border-2 border-[var(--border)] bg-[var(--ink)] p-5 shadow-[var(--sh-lg)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 text-white">
              <img src="/icon.png" alt="OBSIDIAN PAY" className="h-4 w-4" />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] opacity-60">
                Solana + Dodo
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-black uppercase leading-none text-white tracking-tight">
              OBSIDIAN
              <br />
              PAY
            </h1>
            <p className="mt-2 text-[0.65rem] text-zinc-400">
              Devnet-native payroll for distributed teams.
            </p>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-col gap-1.5 stagger">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-item flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-black uppercase tracking-wide",
                    isActive ? "active" : "bg-[var(--surface)]",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Status block */}
          <div className="mt-auto border-2 border-[var(--green)] bg-[var(--surface)] p-3.5 shadow-[3px_3px_0_0_var(--green)]">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)] pulse-live" />
              <p className="text-[0.6rem] font-black uppercase tracking-wider">Devnet Live</p>
            </div>
            <p className="mt-1.5 text-[0.6rem] text-[var(--muted)] leading-relaxed">
              Dodo test-mode billing. Solana devnet payouts. Audit-grade history.
            </p>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Header bar */}
          <header className="border-2 border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-[var(--sh-lg)] anim-in">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                  SaaS Payroll Control Room
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {currentLabel}
                </h2>
              </div>
              <HeaderWalletButton />
            </div>
          </header>

          {/* Page body */}
          <div className="flex flex-col gap-4">{children}</div>
        </div>
      </div>

      {/* ── Mobile bottom nav ──────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t-2 border-[var(--border)] bg-[var(--surface)] lg:hidden">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[0.55rem] font-black uppercase tracking-wider",
                isActive ? "bg-[var(--blue)] text-white" : "text-[var(--ink)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
