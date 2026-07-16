import { apiForm, apiJson, apiDelete,apiGet } from "../client";
import type {UserDto ,ChangePasswordDto,UpdateUserDto } from "@/types";


export const accountApi = {
  updateImage: (id: number, formData: FormData) =>
    apiForm<string>(`/api/Account/${id}/Image`, "PUT", formData),

  deleteImage: (id: number) => apiDelete(`/api/Account/${id}/Image`),

  changePassword: (id: number, body: ChangePasswordDto) =>
    apiJson<void>(`/api/Account/${id}/Password`, "PUT", body),

  delete: (id: number) => apiDelete(`/api/Account/${id}`),

   update: (id: number, body: UpdateUserDto) =>
    apiJson<UserDto>(`/api/Account/User/${id}`, "PUT", body),

  getUserById: (id: number) => apiGet<UserDto>(`/api/Account/User/${id}`),
};