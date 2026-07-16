import { createFileRoute } from "@tanstack/react-router";
import { AdminTableShell, Td, Th } from "@/components/admin-table";
import { AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type Sport } from "@/types/domain/sport";
import { sportApi } from "@/lib/api/endpoints/sport";
import { SportForm, type SportFormValues } from "@/components/sport-form";
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
import { useRequireRole } from "@/hooks/use-require-role";
export const Route = createFileRoute("/admin/sports")({
  component: Page,
});

function Page() {
  const allowed = useRequireRole(["Admin", "Staff"]);
  const queryClient = useQueryClient();
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingSportId, setEditingSportId] = useState<number | null>(null);
  const [deletingSport, setDeletingSport] = useState<Sport | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const sportsQuery = useQuery({
    queryKey: ["sports"],
    queryFn: sportApi.getAll,
    enabled: allowed,
  });
  const editingSportQuery = useQuery({
    queryKey: ["sport", editingSportId],
    queryFn: () => sportApi.getById(editingSportId!),
    enabled: formMode === "edit" && editingSportId != null && allowed,
  });

  const createSport = useMutation({
    mutationFn: sportApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sports"] });
      closeForm();
    },
    onError: (error) => setFormError(error.message),
  });

  const updateSport = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      sportApi.update(id, formData),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sports"] }),
        queryClient.invalidateQueries({ queryKey: ["sport", variables.id] }),
      ]);
      closeForm();
    },
    onError: (error) => setFormError(error.message),
  });

  const deleteSport = useMutation({
    mutationFn: sportApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sports"] });
      setDeletingSport(null);
    },
  });

  const sports = sportsQuery.data ?? [];

  function openCreateForm() {
    setFormError(null);
    setEditingSportId(null);
    setFormMode("create");
  }

  function openEditForm(id: number) {
    setFormError(null);
    setEditingSportId(id);
    setFormMode("edit");
  }

  function closeForm() {
    setFormMode(null);
    setEditingSportId(null);
    setFormError(null);
  }

  function buildSportFormData(values: SportFormValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (values.image) formData.append("image", values.image);
    return formData;
  }

  function handleFormSubmit(values: SportFormValues) {
    setFormError(null);

    if (!values.name || !values.description) {
      setFormError("Name and description are required.");
      return;
    }

    if (formMode === "create") {
      if (!values.image) {
        setFormError("Image is required when adding a sport.");
        return;
      }
      createSport.mutate(buildSportFormData(values));
      return;
    }

    if (formMode === "edit" && editingSportId != null) {
      updateSport.mutate({ id: editingSportId, formData: buildSportFormData(values) });
    }
  }

  const isSaving = createSport.isPending || updateSport.isPending;
  const isFormOpen = formMode != null;
  const editingSport = editingSportQuery.data;
  const [search, setSearch] = useState("");

  const filteredSports = sports.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  if (!allowed) return null;
  return (
    <>
      <AdminTableShell
        title="Sports"
        searchValue={search}
        onSearchChange={setSearch}
        subtitle={`${sports.length} disciplines managed`}
        addLabel="Add Sport"
        onAdd={openCreateForm}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <Th>Sport</Th>
              <Th>Description</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sportsQuery.isLoading && (
              <tr>
                <Td colSpan={3} className="text-center text-sm text-white/50">
                  Loading sports...
                </Td>
              </tr>
            )}
            {sportsQuery.isError && (
              <tr>
                <Td colSpan={3} className="text-center text-sm text-red-300">
                  {sportsQuery.error.message}
                </Td>
              </tr>
            )}
            {!sportsQuery.isLoading && !sportsQuery.isError && sports.length === 0 && (
              <tr>
                <Td colSpan={3} className="text-center text-sm text-white/50">
                  No sports yet.
                </Td>
              </tr>
            )}
            {filteredSports.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="h-10 w-10 rounded-lg object-cover"
                      width={40}
                      height={40}
                    />
                    <div className="font-bold">{s.name}</div>
                  </div>
                </Td>
                <Td className="max-w-md text-sm text-white/60">{s.description}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(s.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-volt-soft hover:text-volt"
                      aria-label={`Edit ${s.name}`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingSport(s)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${s.name}`}
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
            <DialogTitle>{formMode === "edit" ? "Edit Sport" : "Add Sport"}</DialogTitle>
            <DialogDescription>
              {formMode === "edit"
                ? "Review the saved sport details before changing them."
                : "Create a new sport with a name, description, and image."}
            </DialogDescription>
          </DialogHeader>
          {formMode === "edit" && editingSportQuery.isLoading ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
              Loading saved sport data...
            </div>
          ) : formMode === "edit" && editingSportQuery.isError ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {editingSportQuery.error.message}
            </div>
          ) : (
            <SportForm
              key={formMode === "edit" ? editingSport?.id : "create"}
              mode={formMode ?? "create"}
              sport={formMode === "edit" ? editingSport : null}
              isSubmitting={isSaving}
              error={formError}
              onCancel={closeForm}
              onSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletingSport != null}
        onOpenChange={(open) => !open && setDeletingSport(null)}
      >
        <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Sport
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingSport?.name}. This action will lead to loss of
              data(plans of the sport).
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteSport.isError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {deleteSport.error.message}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteSport.isPending}
              onClick={(event) => {
                event.preventDefault();
                if (deletingSport) deleteSport.mutate(deletingSport.id);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteSport.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
