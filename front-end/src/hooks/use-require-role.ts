import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-context";
import { getRoleLandingPath } from "@/lib/auth-routes";
import type { Role } from "@/types/auth";

export function useRequireRole(allowedRoles: Role[]): boolean {
  const { user, isHydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      // Authenticated, but wrong role for this page — send them to their own home
      navigate({ to: getRoleLandingPath(user.role) });
    }
  }, [isHydrated, user, allowedRoles, navigate]);

  return isHydrated && !!user && allowedRoles.includes(user.role);
}