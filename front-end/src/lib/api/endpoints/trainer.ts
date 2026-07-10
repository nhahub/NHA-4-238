import { apiGet, apiForm, apiDelete } from "../client";
import type { Trainer } from "@/types";

export const trainerApi = {
  getAll: () => apiGet<Trainer[]>("/api/Trainer/Trainers"),
  getById: (id: number) => apiGet<Trainer>(`/api/Trainer/${id}`),
  create: (formData: FormData) =>
    apiForm<Trainer>("/api/Trainer", "POST", formData),
  update: (id: number, formData: FormData) =>
    apiForm<Trainer>(`/api/Trainer/${id}`, "PUT", formData),
  delete: (id: number) => apiDelete(`/api/Trainer/${id}`),
};