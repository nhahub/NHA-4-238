import { apiGet, apiForm, apiJson, apiDelete } from "../client";
import type { StaffDto, AddStaffDto, UpdateStaffDto } from "@/types";

export const staffApi = {
  getAll: () => apiGet<StaffDto[]>("/api/Account/Staffs"),
  create: (formData: FormData) =>
    apiForm<StaffDto>("/api/Account/Staff", "POST", formData),
  update: (id: number, body: UpdateStaffDto) =>
    apiJson<StaffDto>(`/api/Account/Staff/${id}`, "PUT", body),
  delete: (id: number) => apiDelete(`/api/Account/Staff/${id}`),
};