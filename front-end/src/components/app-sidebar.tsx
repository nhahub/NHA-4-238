import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronLeft, LogOut, Search } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Brand } from "./brand";
import { useAuth } from "@/contexts/auth-context";

export type NavItem = { to: string; label: string; icon: LucideIcon };

export function AppShell({
  items,
  user,
  title,
  children,
}: {
  items: NavItem[];
  user: { name: string; role: string; initials: string; imageUrl?: string | null };
  title: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen bg-carbon text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/5 bg-slate-950 transition-all duration-300 lg:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/5 px-4">
          {collapsed ? (
            <Link to="/" className="grid h-8 w-8 place-items-center rounded-lg bg-volt shadow-volt">
              <div className="h-3 w-3 rotate-45 rounded-sm bg-carbon" />
            </Link>
          ) : (
            <Brand />
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-md p-1 text-white/40 hover:bg-white/5 hover:text-white"
            aria-label="Toggle"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {items.map((it) => {
            const active =
              pathname === it.to ||
              (it.to !== "/admin" && it.to !== "/member" && pathname.startsWith(it.to));
            const exactActive = pathname === it.to;
            const isActive =
              it.to.endsWith("admin") || it.to.endsWith("member") ? exactActive : active;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-volt-soft text-volt"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <it.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{it.label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-volt shadow-volt" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
                width={36}
                height={36}
              />
            ) : (
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-volt text-xs font-bold text-carbon">
                {user.initials}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{user.name}</div>
                <div className="truncate text-[10px] uppercase tracking-widest text-white/40">
                  {user.role}
                </div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="text-white/40 hover:text-white"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={`${collapsed ? "lg:pl-20" : "lg:pl-64"} transition-all duration-300`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-carbon/80 px-4 backdrop-blur-xl sm:px-8">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              {user.role} Portal
            </div>
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="hidden rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:border-volt/50 hover:text-white sm:block"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="border-b border-white/5 bg-slate-950 lg:hidden">
          <div className="flex overflow-x-auto px-4 py-2">
            {items.map((it) => {
              const isActive = pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                    isActive ? "bg-volt-soft text-volt" : "text-white/60"
                  }`}
                >
                  <it.icon className="h-3.5 w-3.5" />
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
