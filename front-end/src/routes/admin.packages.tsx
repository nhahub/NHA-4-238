import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminTableShell, Td, Th } from "@/components/admin-table";
import { Badge } from "@/components/ui-bits";
import { type PackageOption } from "@/types/domain/package";
import { packageApi } from "@/lib/api/endpoints/package";
import { planApi } from "@/lib/api/endpoints/plan";
import { PackageForm, type PackageFormValues } from "@/components/package-form";
import { AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRequireRole } from "@/hooks/use-require-role";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/packages")({
  component: Page,
});

function Page() {
  const allowed = useRequireRole(["Admin", "Staff"]);
  const queryClient = useQueryClient();
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<PackageOption | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const packagesQuery = useQuery({
    queryKey: ["packages"],
    queryFn: packageApi.getAll,
    enabled: allowed,
  });
  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: planApi.getAll,
    enabled: allowed,
  });

  const editingPackageQuery = useQuery({
    queryKey: ["package", editingPackageId],
    queryFn: () => packageApi.getById(editingPackageId!),
    enabled: formMode === "edit" && editingPackageId != null && allowed,
  });

  const createPackage = useMutation({
    mutationFn: packageApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["packages"] });
      closeForm();
    },
    onError: (error) => setFormError(error.message),
  });

  const updatePackage = useMutation({
    mutationFn: ({ id, body }: { id: number; body: PackageFormValues }) =>
      packageApi.update(id, body),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["packages"] }),
        queryClient.invalidateQueries({ queryKey: ["package", variables.id] }),
      ]);
      closeForm();
    },
    onError: (error) => setFormError(error.message),
  });

  const deletePackage = useMutation({
    mutationFn: packageApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["packages"] });
      setDeletingPackage(null);
    },
  });

  const packages = packagesQuery.data ?? [];
  const plans = plansQuery.data ?? [];

  function openCreateForm() {
    setFormError(null);
    setEditingPackageId(null);
    setFormMode("create");
  }

  function openEditForm(id: number) {
    setFormError(null);
    setEditingPackageId(id);
    setFormMode("edit");
  }

  function closeForm() {
    setFormMode(null);
    setEditingPackageId(null);
    setFormError(null);
  }

  function handleFormSubmit(values: PackageFormValues) {
    setFormError(null);

    if (!values.title || !values.description) {
      setFormError("Title and description are required.");
      return;
    }
    if (!values.planId) {
      setFormError("Please select a plan.");
      return;
    }
    if (values.price <= 0) {
      setFormError("Price must be greater than 0.");
      return;
    }

    if (formMode === "create") {
      createPackage.mutate(values);
      return;
    }
    if (formMode === "edit" && editingPackageId != null) {
      updatePackage.mutate({ id: editingPackageId, body: values });
    }
  }

  const isSaving = createPackage.isPending || updatePackage.isPending;
  const isFormOpen = formMode != null;
  const editingPackage = editingPackageQuery.data;
  const [search, setSearch] = useState("");

  const filteredPackages = packages.filter((pkg) =>
    pkg.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (!allowed) return null;
  return (
    <>
      <AdminTableShell
        title="Packages"
        searchValue={search}
        onSearchChange={setSearch}
        subtitle={`${packages.length} pricing packages`}
        addLabel="Add Package"
        onAdd={openCreateForm}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <Th>Package</Th>
              <Th>Linked Plan</Th>
              <Th>Sport</Th>
              <Th>Duration</Th>
              <Th>Sessions</Th>
              <Th>Price</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packagesQuery.isLoading && <StatusRow>Loading packages...</StatusRow>}
            {packagesQuery.isError && <StatusRow>{packagesQuery.error.message}</StatusRow>}
            {!packagesQuery.isLoading && !packagesQuery.isError && packages.length === 0 && (
              <StatusRow>No packages yet.</StatusRow>
            )}
            {filteredPackages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-white/[0.02]">
                <Td>
                  <div className="font-bold">{pkg.title}</div>
                  <div className="text-[11px] text-white/40">{pkg.description}</div>
                </Td>
                <Td className="text-white/70">{pkg.planTitle ?? "Not linked"}</Td>
                <Td>
                  <Badge>{pkg.sport ?? "Not set"}</Badge>
                </Td>
                <Td className="text-white/70">
                  {pkg.numberOfMonthes} month{pkg.numberOfMonthes === 1 ? "" : "s"}
                </Td>
                <Td className="text-white/70">{pkg.numberOfSessions}</Td>
                <Td className="font-bold">${pkg.price}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(pkg.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-volt-soft hover:text-volt"
                      aria-label={`Edit ${pkg.title}`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingPackage(pkg)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${pkg.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formMode === "edit" ? "Edit Package" : "Add Package"}</DialogTitle>
            <DialogDescription>
              {formMode === "edit"
                ? "Update the package details and pricing."
                : "Create a new package and link it to a training plan."}
            </DialogDescription>
          </DialogHeader>

          {formMode === "edit" && editingPackageQuery.isLoading ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
              Loading package data...
            </div>
          ) : formMode === "edit" && editingPackageQuery.isError ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {editingPackageQuery.error.message}
            </div>
          ) : (
            <PackageForm
              key={formMode === "edit" ? editingPackage?.id : "create"}
              mode={formMode ?? "create"}
              pkg={formMode === "edit" ? editingPackage : null}
              plans={plans}
              isSubmitting={isSaving}
              error={formError}
              onCancel={closeForm}
              onSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletingPackage != null}
        onOpenChange={(open) => !open && setDeletingPackage(null)}
      >
        <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Package
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-bold text-white">{deletingPackage?.title}</span>. Any active
              subscriptions using this package will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletePackage.isError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {deletePackage.error.message}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deletePackage.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deletingPackage) deletePackage.mutate(deletingPackage.id);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deletePackage.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatusRow({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <Td className="text-sm text-white/60" colSpan={7}>
        {children}
      </Td>
    </tr>
  );
}
