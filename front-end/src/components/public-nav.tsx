import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "./brand";
import { useAuth } from "@/contexts/auth-context";
import type { Role } from "@/types/auth";

const links = [
  { to: "/sports", label: "Sports" },
  { to: "/plans", label: "Training Plans" },
  { to: "/packages", label: "Packages" },
  { to: "/trainers", label: "Trainers" },
] as const;

function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "Admin":
      return "/admin";
    case "Staff":
      return "/admin/sports";
    case "Member":
      return "/member";
  }
}

export function PublicNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate({ to: "/" });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-carbon/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20">
        <Brand />
        <div className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`transition-colors hover:text-volt ${pathname === l.to ? "text-white" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to={dashboardPathForRole(user.role)}
                className="rounded-full bg-volt px-5 py-2.5 text-sm font-bold text-carbon transition-transform hover:scale-105"
              >
                My Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-volt px-5 py-2.5 text-sm font-bold text-carbon transition-transform hover:scale-105"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
        <button onClick={() => setOpen((v) => !v)} className="md:hidden" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/5 bg-carbon px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-white/80">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={dashboardPathForRole(user.role)}
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-volt px-5 py-2.5 text-center text-sm font-bold text-carbon"
                >
                  My Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-volt px-5 py-2.5 text-center text-sm font-bold text-carbon"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
