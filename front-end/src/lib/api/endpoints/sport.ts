import { apiGet, apiForm, apiDelete } from "../client";
import type { Sport } from "@/types";

export const sportApi = {
  getAll: () => apiGet<Sport[]>("/api/Sports"),
  getById: (id: number) => apiGet<Sport>(`/api/Sport/${id}`),
  create: (formData: FormData) => apiForm<Sport>("/api/Sport", "POST", formData),
  update: (id: number, formData: FormData) =>
    apiForm<Sport>(`/api/Sport/${id}`, "PUT", formData),
  delete: (id: number) => apiDelete(`/api/Sport/${id}`),
};