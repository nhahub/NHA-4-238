import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useRequireRole } from "@/hooks/use-require-role";
import { Calendar, CreditCard, LayoutDashboard, User } from "lucide-react";

const NAV = [
  { to: "/member", label: "Dashboard", icon: LayoutDashboard },
  { to: "/member/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/member/attendance", label: "Attendance", icon: Calendar },
  { to: "/member/profile", label: "Profile", icon: User },
];

const TITLES: Record<string, string> = {
  "/member": "Dashboard",
  "/member/subscriptions": "My Subscriptions",
  "/member/attendance": "Attendance",
  "/member/profile": "Profile",
};

export const Route = createFileRoute("/member")({
  head: () => ({ meta: [{ title: "Member Portal — IronCore" }] }),
  component: MemberLayout,
});

function MemberLayout() {
  const allowed = useRequireRole(["Member"]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();

  if (!allowed || !user) return null;

  const initials = user.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShell
      items={NAV}
      user={{ name: user.fullName, role: "Member", initials, imageUrl: user.imageUrl }}
      title={TITLES[pathname] ?? "Member"}
    >
      <Outlet />
    </AppShell>
  );
}
