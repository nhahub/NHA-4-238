import { apiGet, apiForm, apiJson, apiDelete } from "../client";
import type { UserDto, AddStaffDto, UpdateUserDto } from "@/types";

export const staffApi = {
  getAll: () => apiGet<UserDto[]>("/api/Account/Staff"),
  create: (formData: FormData) =>
    apiForm<UserDto>("/api/Account/Staff", "POST", formData),
 
};