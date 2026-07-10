import { apiGet, apiJson, apiDelete } from "../client";
import type { Plan, AddUpdatePlanDto } from "@/types";

export const planApi = {
  getAll: () => apiGet<Plan[]>("/api/Plan/Plans"),
  getById: (id: number) => apiGet<Plan>(`/api/Plan/${id}`),
  create: (body: AddUpdatePlanDto) => apiJson<Plan>("/api/Plan", "POST", body),
  update: (id: number, body: AddUpdatePlanDto) =>
    apiJson<Plan>(`/api/Plan/${id}`, "PUT", body),
  delete: (id: number) => apiDelete(`/api/Plan/${id}`),
};