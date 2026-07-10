import { apiGet } from "../client";
import type { AdminDashboardDto } from "@/types";

export const adminApi = {
  getDashboard: () => apiGet<AdminDashboardDto>("/api/Admin/Dashboard"),
};