import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 transition-colors hover:border-volt/30">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          {label}
        </span>
        <div
          className={`grid h-8 w-8 place-items-center rounded-lg ${accent ? "bg-volt text-carbon" : "bg-white/5 text-white/60"}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={`mt-4 text-3xl font-extrabold tracking-tight ${accent ? "text-volt" : ""}`}>
        {value}
      </div>
      {trend && <div className="mt-1 text-[11px] text-white/40">{trend}</div>}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <div className="mb-2 inline-block rounded-full bg-volt-soft px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-volt">
            {eyebrow}
          </div>
        )}
        <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-white/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "active" | "expiring" | "expired" | "volt";
}) {
  const styles = {
    default: "bg-white/5 text-white/70",
    active: "bg-volt/10 text-volt",
    expiring: "bg-orange-500/10 text-orange-400",
    expired: "bg-red-500/10 text-red-400",
    volt: "bg-volt text-carbon",
  }[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles}`}
    >
      {variant === "active" && <span className="h-1.5 w-1.5 rounded-full bg-volt shadow-volt" />}
      {children}
    </span>
  );
}

export function VoltButton({
  children,
  to,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none";
  const styles = {
    primary: "bg-volt text-carbon hover:scale-105 hover:shadow-volt",
    ghost: "bg-white/5 text-white hover:bg-white/10 border border-white/10",
    outline: "border border-volt/50 text-volt hover:bg-volt hover:text-carbon",
  }[variant];
  const cls = `${base} ${styles} ${className}`;
  if (to)
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function DataCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-slate-900 ${className}`}>{children}</div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-slate-900/50 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-white/5">
        <Icon className="h-5 w-5 text-white/40" />
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-white/50">{desc}</p>
    </div>
  );
}
