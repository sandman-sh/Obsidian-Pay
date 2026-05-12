import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "border-2 border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--sh-lg)] anim-in",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted)]">
      {children}
    </p>
  );
}

export function Heading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div>
      <Label>{eyebrow}</Label>
      <h3 className="mt-1.5 text-xl font-black uppercase leading-tight tracking-tight">
        {title}
      </h3>
      {body ? (
        <p className="mt-1.5 max-w-xl text-sm text-[var(--muted)]">{body}</p>
      ) : null}
    </div>
  );
}

export function Metric({
  label,
  value,
  helper,
  icon,
  accent,
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "border-2 border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--sh-md)] transition-transform hover:-translate-y-0.5 anim-in",
        accent,
      )}
    >
      <div className="flex items-start justify-between">
        <Label>{label}</Label>
        {icon ? <div className="text-[var(--muted)]">{icon}</div> : null}
      </div>
      <p className="mt-2 text-2xl font-black uppercase tracking-tight">{value}</p>
      {helper ? <p className="mt-1 text-xs text-[var(--muted)]">{helper}</p> : null}
    </div>
  );
}

export function Chip({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("border-2 border-[var(--border)] bg-[var(--surface)] p-2.5", className)}>
      <Label>{label}</Label>
      <p className="mt-0.5 text-sm font-bold uppercase tracking-tight">{value}</p>
    </div>
  );
}
