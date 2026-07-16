import { createFileRoute } from "@tanstack/react-router";
import { AdminTableShell, Td, Th } from "@/components/admin-table";
import { Badge } from "@/components/ui-bits";
import { AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type Trainer } from "@/types/domain/trainer";
import { trainerApi } from "@/lib/api/endpoints/trainer";
import { sportApi } from "@/lib/api/endpoints/sport";
import { useRequireRole } from "@/hooks/use-require-role";
import { TrainerForm, type TrainerFormValues } from "@/components/trainer-form";
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

export const Route = createFileRoute("/admin/trainers")({
  component: Page,
});

function Page() {
  const allowed = useRequireRole(["Admin", "Staff"]);
  const queryClient = useQueryClient();
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingTrainerId, setEditingTrainerId] = useState<number | null>(null);
  const [deletingTrainer, setDeletingTrainer] = useState<Trainer | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const trainersQuery = useQuery({
    queryKey: ["trainers"],
    queryFn: trainerApi.getAll,
    enabled: allowed,
  });
  const sportsQuery = useQuery({
    queryKey: ["sports"],
    queryFn: sportApi.getAll,
    enabled: allowed,
  });

  const editingTrainerQuery = useQuery({
    queryKey: ["trainer", editingTrainerId],
    queryFn: () => trainerApi.getById(editingTrainerId!),
    enabled: formMode === "edit" && editingTrainerId != null && allowed,
  });

  const createTrainer = useMutation({
    mutationFn: trainerApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trainers"] });
      closeForm();
    },
    onError: (error) => setFormError(error.message),
  });

  const updateTrainer = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      trainerApi.update(id, formData),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trainers"] }),
        queryClient.invalidateQueries({ queryKey: ["trainer", variables.id] }),
      ]);
      closeForm();
    },
    onError: (error) => setFormError(error.message),
  });

  const deleteTrainer = useMutation({
    mutationFn: trainerApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trainers"] });
      setDeletingTrainer(null);
    },
  });

  const trainers = trainersQuery.data ?? [];
  const sports = sportsQuery.data ?? [];

  function openCreateForm() {
    setFormError(null);
    setEditingTrainerId(null);
    setFormMode("create");
  }

  function openEditForm(id: number) {
    setFormError(null);
    setEditingTrainerId(id);
    setFormMode("edit");
  }

  function closeForm() {
    setFormMode(null);
    setEditingTrainerId(null);
    setFormError(null);
  }

  function buildTrainerFormData(values: TrainerFormValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("yearsOfExperience", String(values.yearsOfExperience));
    formData.append("sportId", String(values.sportId));
    if (values.image) formData.append("image", values.image);
    return formData;
  }

  function handleFormSubmit(values: TrainerFormValues) {
    setFormError(null);

    if (!values.name || !values.title || !values.description) {
      setFormError("Name, title, and description are required.");
      return;
    }

    if (!values.sportId) {
      setFormError("Please select a sport.");
      return;
    }

    if (formMode === "create") {
      if (!values.image) {
        setFormError("Image is required when adding a trainer.");
        return;
      }
      createTrainer.mutate(buildTrainerFormData(values));
      return;
    }

    if (formMode === "edit" && editingTrainerId != null) {
      updateTrainer.mutate({ id: editingTrainerId, formData: buildTrainerFormData(values) });
    }
  }

  const isSaving = createTrainer.isPending || updateTrainer.isPending;
  const isFormOpen = formMode != null;
  const editingTrainer = editingTrainerQuery.data;
  const [search, setSearch] = useState("");

  const filteredTrainers = trainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(search.toLowerCase()),
  );
  if (!allowed) return null;
  return (
    <>
      <AdminTableShell
        title="Trainers"
        subtitle={`${trainers.length} coaches on roster`}
        addLabel="Add Trainer"
        onAdd={openCreateForm}
        searchValue={search}
        onSearchChange={setSearch}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <Th>Trainer</Th>
              <Th>Sport</Th>
              <Th>Experience</Th>
              <Th>Role</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {trainersQuery.isLoading && (
              <tr>
                <Td colSpan={5} className="text-center text-sm text-white/50">
                  Loading trainers...
                </Td>
              </tr>
            )}
            {trainersQuery.isError && (
              <tr>
                <Td colSpan={5} className="text-center text-sm text-red-300">
                  {trainersQuery.error.message}
                </Td>
              </tr>
            )}
            {!trainersQuery.isLoading && !trainersQuery.isError && trainers.length === 0 && (
              <tr>
                <Td colSpan={5} className="text-center text-sm text-white/50">
                  No trainers yet.
                </Td>
              </tr>
            )}
            {filteredTrainers.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.02]">
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.imageUrl}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-[11px] text-white/40">{t.description.slice(0, 40)}…</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <Badge>{t.sport}</Badge>
                </Td>
                <Td className="text-white/70">{t.yearsOfExperience} yrs</Td>
                <Td className="text-white/70">{t.title}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(t.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-volt-soft hover:text-volt"
                      aria-label={`Edit ${t.name}`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingTrainer(t)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${t.name}`}
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
            <DialogTitle>{formMode === "edit" ? "Edit Trainer" : "Add Trainer"}</DialogTitle>
            <DialogDescription>
              {formMode === "edit"
                ? "Review the saved trainer details before changing them."
                : "Create a new trainer with their details and a profile image."}
            </DialogDescription>
          </DialogHeader>
          {formMode === "edit" && editingTrainerQuery.isLoading ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
              Loading saved trainer data...
            </div>
          ) : formMode === "edit" && editingTrainerQuery.isError ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {editingTrainerQuery.error.message}
            </div>
          ) : (
            <TrainerForm
              key={formMode === "edit" ? editingTrainer?.id : "create"}
              mode={formMode ?? "create"}
              trainer={formMode === "edit" ? editingTrainer : null}
              sports={sports}
              isSubmitting={isSaving}
              error={formError}
              onCancel={closeForm}
              onSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletingTrainer != null}
        onOpenChange={(open) => !open && setDeletingTrainer(null)}
      >
        <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Trainer
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingTrainer?.name}. Any plans assigned to this
              trainer will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTrainer.isError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {deleteTrainer.error.message}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteTrainer.isPending}
              onClick={(event) => {
                event.preventDefault();
                if (deletingTrainer) deleteTrainer.mutate(deletingTrainer.id);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteTrainer.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
