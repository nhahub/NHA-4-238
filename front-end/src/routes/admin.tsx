import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useRequireRole } from "@/hooks/use-require-role";
import {
  Calendar,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  ListChecks,
  User,
  PersonStanding,
  Tag,
  Users,
  UserCog,
} from "lucide-react";
import { profile } from "console";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
  { to: "/admin/sports", label: "Sports", icon: Dumbbell },
  { to: "/admin/trainers", label: "Trainers", icon: UserCog },
  { to: "/admin/plans", label: "Plans", icon: ListChecks },
  { to: "/admin/packages", label: "Packages", icon: Tag },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/staff", label: "Staff", icon: PersonStanding, adminOnly: true },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/admin/attendance", label: "Attendance", icon: Calendar },
  { to: "/admin/profile", label: "Profile", icon: User },
];

const TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/sports": "Manage Sports",
  "/admin/trainers": "Manage Trainers",
  "/admin/plans": "Manage Plans",
  "/admin/packages": "Manage Packages",
  "/admin/members": "Members Directory",
  "/admin/staff": "Staff",
  "/admin/subscriptions": "Subscriptions",
  "/admin/attendance": "Attendance Sessions",
  "admin/profile": "Profile",
};

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — IronCore" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const allowed = useRequireRole(["Admin", "Staff"]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();

  if (!allowed || !user) return null;

  const visibleNav = NAV.filter((item) => !item.adminOnly || user.role === "Admin");
  const initials = user.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShell
      items={visibleNav}
      user={{ name: user.fullName, role: user.role, initials, imageUrl: user.imageUrl }}
      title={TITLES[pathname] ?? "Admin"}
    >
      <Outlet />
    </AppShell>
  );
}
