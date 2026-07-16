import { apiGet, apiJson } from "../client";
import type { Subscription } from "@/types";

export const subscriptionApi = {
  getAll: () => apiGet<Subscription[]>("/api/Subscriptions"),
  getByMember: (memberId: number) =>
    apiGet<Subscription[]>(`/api/Subscription/Member/${memberId}`),
  create: (body: { memberId: number; packageId: number }) =>
    apiJson<Subscription>("/api/Subscription", "POST", body),
};