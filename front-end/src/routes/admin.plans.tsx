import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminTableShell, Td, Th } from "@/components/admin-table";
import { Badge } from "@/components/ui-bits";
import { type Plan } from "@/types/domain/plan";
import { planApi } from "@/lib/api/endpoints/plan";
import { trainerApi } from "@/lib/api/endpoints/trainer";
import { sportApi } from "@/lib/api/endpoints/sport";
import { PlanForm, type PlanFormValues } from "@/components/plan-form";
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

export const Route = createFileRoute("/admin/plans")({
  component: Page,
});

function Page() {
  const allowed = useRequireRole(["Admin", "Staff"]);
  const queryClient = useQueryClient();
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: planApi.getAll,
    enabled: allowed,
  });
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

  const editingPlanQuery = useQuery({
    queryKey: ["plan", editingPlanId],
    queryFn: () => planApi.getById(editingPlanId!),
    enabled: formMode === "edit" && editingPlanId != null && allowed,
  });

  const createPlan = useMutation({
    mutationFn: planApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["plans"] });
      closeForm();
    },
    onError: (error) => setFormError(error.message),
  });

  const updatePlan = useMutation({
    mutationFn: ({ id, body }: { id: number; body: PlanFormValues }) => planApi.update(id, body),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["plans"] }),
        queryClient.invalidateQueries({ queryKey: ["plan", variables.id] }),
      ]);
      closeForm();
    },
    onError: (error) => setFormError(error.message),
  });

  const deletePlan = useMutation({
    mutationFn: planApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["plans"] });
      setDeletingPlan(null);
    },
  });

  const plans = plansQuery.data ?? [];
  const trainers = trainersQuery.data ?? [];
  const sports = sportsQuery.data ?? [];

  function openCreateForm() {
    setFormError(null);
    setEditingPlanId(null);
    setFormMode("create");
  }

  function openEditForm(id: number) {
    setFormError(null);
    setEditingPlanId(id);
    setFormMode("edit");
  }

  function closeForm() {
    setFormMode(null);
    setEditingPlanId(null);
    setFormError(null);
  }

  function handleFormSubmit(values: PlanFormValues) {
    setFormError(null);

    if (!values.title || !values.description) {
      setFormError("Title and description are required.");
      return;
    }
    if (!values.trainerId || !values.sportId) {
      setFormError("Please select both a sport and a trainer.");
      return;
    }

    if (formMode === "create") {
      createPlan.mutate(values);
      return;
    }
    if (formMode === "edit" && editingPlanId != null) {
      updatePlan.mutate({ id: editingPlanId, body: values });
    }
  }

  const isSaving = createPlan.isPending || updatePlan.isPending;
  const isFormOpen = formMode != null;
  const editingPlan = editingPlanQuery.data;
  const [search, setSearch] = useState("");

  const filteredPlans = plans.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  if (!allowed) return null;
  return (
    <>
      <AdminTableShell
        title="Training Plans"
        searchValue={search}
        onSearchChange={setSearch}
        subtitle={`${plans.length} active programs`}
        addLabel="Add Plan"
        onAdd={openCreateForm}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <Th>Plan</Th>
              <Th>Sport</Th>
              <Th>Trainer</Th>
              <Th>Schedule</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {plansQuery.isLoading && <StatusRow cols={5}>Loading plans...</StatusRow>}
            {plansQuery.isError && <StatusRow cols={5}>{plansQuery.error.message}</StatusRow>}
            {!plansQuery.isLoading && !plansQuery.isError && plans.length === 0 && (
              <StatusRow cols={5}>No plans yet.</StatusRow>
            )}
            {filteredPlans.map((plan) => (
              <tr key={plan.id} className="hover:bg-white/[0.02]">
                <Td>
                  <div className="font-bold">{plan.title}</div>
                  <div className="text-[11px] text-white/40">{plan.description.slice(0, 50)}…</div>
                </Td>
                <Td>
                  <Badge>{plan.sport}</Badge>
                </Td>
                <Td className="text-white/70">{plan.trainerName}</Td>
                <Td className="text-white/70">{plan.appointments.length} sessions/wk</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(plan.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-volt-soft hover:text-volt"
                      aria-label={`Edit ${plan.title}`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingPlan(plan)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${plan.title}`}
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
            <DialogTitle>{formMode === "edit" ? "Edit Plan" : "Add Plan"}</DialogTitle>
            <DialogDescription>
              {formMode === "edit"
                ? "Update the plan details and weekly schedule."
                : "Create a new training plan with a schedule."}
            </DialogDescription>
          </DialogHeader>

          {formMode === "edit" && editingPlanQuery.isLoading ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
              Loading plan data...
            </div>
          ) : formMode === "edit" && editingPlanQuery.isError ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {editingPlanQuery.error.message}
            </div>
          ) : (
            <PlanForm
              key={formMode === "edit" ? editingPlan?.id : "create"}
              mode={formMode ?? "create"}
              plan={formMode === "edit" ? editingPlan : null}
              trainers={trainers}
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
        open={deletingPlan != null}
        onOpenChange={(open) => !open && setDeletingPlan(null)}
      >
        <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Plan
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-bold text-white">{deletingPlan?.title}</span>. All sessions and
              packages linked to this plan will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletePlan.isError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {deletePlan.error.message}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deletePlan.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deletingPlan) deletePlan.mutate(deletingPlan.id);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deletePlan.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatusRow({ children, cols }: { children: React.ReactNode; cols: number }) {
  return (
    <tr>
      <Td className="text-sm text-white/60" colSpan={cols}>
        {children}
      </Td>
    </tr>
  );
}
