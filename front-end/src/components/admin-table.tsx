import { Search, Filter, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { VoltButton, DataCard } from "./ui-bits";

export function AdminTableShell({
  title,
  subtitle,
  addLabel = "Add New",
  onAdd,
  children,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
}: {
  title: string;
  subtitle?: string;
  addLabel?: string;
  onAdd?: () => void;
  children: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}) {
  return (
    <DataCard className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-white/50">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-white/10 bg-carbon py-2 pl-9 pr-3 text-sm placeholder:text-white/30 focus:border-volt/50 focus:outline-none sm:w-56"
            />
          </div>

          <VoltButton onClick={onAdd}>
            <Plus className="h-4 w-4" /> {addLabel}
          </VoltButton>
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </DataCard>
  );
}

export function Th({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40 ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
  colSpan,
}: {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
}
