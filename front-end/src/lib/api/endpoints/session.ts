import { apiGet, apiJson } from "../client";
import type { TodaySessionDto } from "@/types";

export const sessionApi = {
  getToday: () => apiGet<TodaySessionDto[]>("/api/Session/Today"),
  markAttendance: (body: { sessionId: number; memberId: number }) =>
    apiJson<void>("/api/Session", "POST", body),
  generate: (daysAhead: number) =>
    apiJson<number>("/api/Session/Generate", "POST", { daysAhead }),
};