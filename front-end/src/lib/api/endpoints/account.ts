import { apiForm, apiJson, apiDelete } from "../client";
import type { ChangePasswordDto } from "@/types";

/**
 * Shared account operations for any user type (member, staff, admin, etc.)
 * All endpoints use the account ID, regardless of role.
 */
export const accountApi = {
  /** Update profile image for any account by ID */
  updateImage: (id: number, formData: FormData) =>
    apiForm<string>(`/api/Account/${id}/Image`, "PUT", formData),

  /** Delete profile image for any account by ID */
  deleteImage: (id: number) => apiDelete(`/api/Account/${id}/Image`),

  /** Change password for any account by ID */
  changePassword: (id: number, body: ChangePasswordDto) =>
    apiJson<void>(`/api/Account/${id}/Password`, "PUT", body),
};