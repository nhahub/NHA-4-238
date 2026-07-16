import { apiGet, apiForm, apiJson, apiDelete } from "../client";
import type {
  MemberDto,
  AddMemberDto,
  UpdateMemberDto,
  MemberCalendar,
  MemberDashboard,
} from "@/types";
import type { LoginResponseDto } from "@/types/auth";

export const memberApi = {
  getAll: () => apiGet<MemberDto[]>("/api/Account/Members"),
  getById: (id: number) => apiGet<MemberDto>(`/api/Account/Member/${id}`),
  create: (formData: FormData) =>
    apiForm<LoginResponseDto>("/api/Account/Member", "POST", formData),
  update: (id: number, body: UpdateMemberDto) =>
    apiJson<MemberDto>(`/api/Account/Member/${id}`, "PUT", body),

  // Member-specific endpoints
  getCalendar: (memberId: number, year: number, month: number) =>
    apiGet<MemberCalendar>(
      `/api/Member/Calendar/${memberId}?year=${year}&month=${month}`
    ),
  getDashboard: (memberId: number) =>
    apiGet<MemberDashboard>(`/api/Member/Dashboard/${memberId}`),
};