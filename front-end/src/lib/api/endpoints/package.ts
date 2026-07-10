import { apiGet, apiJson, apiDelete } from "../client";
import type { PackageOption, AddUpdatePackageDto } from "@/types";

export const packageApi = {
  getAll: () => apiGet<PackageOption[]>("/api/Package/Packages"),
  getById: (id: number) => apiGet<PackageOption>(`/api/Package/${id}`),
  create: (body: AddUpdatePackageDto) =>
    apiJson<PackageOption>("/api/Package", "POST", body),
  update: (id: number, body: AddUpdatePackageDto) =>
    apiJson<PackageOption>(`/api/Package/${id}`, "PUT", body),
  delete: (id: number) => apiDelete(`/api/Package/${id}`),
};