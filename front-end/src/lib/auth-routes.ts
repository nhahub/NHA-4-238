import type { Role } from "@/types/auth";

export const ROLE_LANDING_PATH: Record<Role, string> = {
  Admin: "/admin",
  Staff: "/admin/sports",
  Member: "/member",
};

export function getRoleLandingPath(role: Role): string {
  return ROLE_LANDING_PATH[role];
}