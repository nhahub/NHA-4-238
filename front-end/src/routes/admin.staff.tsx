import { createFileRoute } from "@tanstack/react-router";
import { AdminTableShell, Td, Th } from "@/components/admin-table";
import { type StaffDto } from "@/types/domain/staff";
import { staffApi } from "@/lib/api/endpoints/staff";
import { accountApi } from "@/lib/api/endpoints/account";
import { Edit, Trash2, AlertTriangle, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";
import {
  StaffCreateForm,
  StaffEditForm,
  type StaffCreateValues,
  type StaffUpdateValues,
  type StaffPasswordValues,
} from "@/components/staff-form";
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

export const Route = createFileRoute("/admin/staff")({
  component: Page,
});
function Page() {
  const allowed = useRequireRole(["Admin"]);
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);

  const [editingStaff, setEditingStaff] = useState<StaffDto | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffDto | null>(null);

  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const staffQuery = useQuery({ queryKey: ["staff"], queryFn: staffApi.getAll });
  const staff = staffQuery.data ?? [];

  // ── Mutations ────────────────────────────────────────────
  const createStaff = useMutation({
    mutationFn: staffApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      setShowCreate(false);
      setCreateError(null);
    },
    onError: (e) => setCreateError(e.message),
  });

  const updateStaff = useMutation({
    mutationFn: ({ id, body }: { id: number; body: StaffUpdateValues }) =>
      staffApi.update(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      setUpdateError(null);
    },
    onError: (e) => setUpdateError(e.message),
  });

  const changePassword = useMutation({
    mutationFn: ({ id, body }: { id: number; body: StaffPasswordValues }) =>
      accountApi.changePassword(id, body),
    onSuccess: () => setPasswordError(null),
    onError: (e) => setPasswordError(e.message),
  });

  const updateImage = useMutation({
    mutationFn: ({ id, image }: { id: number; image: File }) => {
      const fd = new FormData();
      fd.append("image", image);
      return accountApi.updateImage(id, fd);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      setImageError(null);
    },
    onError: (e) => setImageError(e.message),
  });

  const deleteImage = useMutation({
    mutationFn: (id: number) => accountApi.deleteImage(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      setImageError(null);
    },
    onError: (e) => setImageError(e.message),
  });

  const deleteStaff = useMutation({
    mutationFn: staffApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      setDeletingStaff(null);
    },
  });

  // ── Handlers ─────────────────────────────────────────────
  function handleCreate(values: StaffCreateValues) {
    setCreateError(null);
    if (values.password !== values.confirmPassword) {
      setCreateError("Passwords do not match.");
      return;
    }
    const fd = new FormData();
    fd.append("firstName", values.firstName);
    fd.append("lastName", values.lastName);
    fd.append("birthDate", values.birthDate);
    fd.append("username", values.username);
    fd.append("email", values.email);
    fd.append("phoneNumber", values.phoneNumber);
    fd.append("password", values.password);
    fd.append("confirmPassword", values.confirmPassword);
    if (values.image) fd.append("image", values.image);
    createStaff.mutate(fd);
  }
  if (!allowed) return null;

  const [search, setSearch] = useState("");

  const filteredStaff = staff.filter(
    (s) =>
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <AdminTableShell
        title="Staff"
        searchValue={search}
        onSearchChange={setSearch}
        subtitle={`${staff.length} staff members`}
        addLabel="Add Staff"
        onAdd={() => {
          setCreateError(null);
          setShowCreate(true);
        }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <Th>Staff Member</Th>
              <Th>Username</Th>
              <Th>Phone</Th>
              <Th>Joined</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {staffQuery.isLoading && <StatusRow>Loading staff...</StatusRow>}
            {staffQuery.isError && <StatusRow>{staffQuery.error.message}</StatusRow>}
            {!staffQuery.isLoading && !staffQuery.isError && staff.length === 0 && (
              <StatusRow>No staff members yet.</StatusRow>
            )}
            {filteredStaff.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <Td>
                  <div className="flex items-center gap-3">
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        alt={s.firstName}
                        className="h-10 w-10 rounded-full object-cover"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                        <User className="h-5 w-5 text-white/40" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-bold">
                        {s.firstName} {s.lastName}
                      </div>
                      <div className="truncate text-[11px] text-white/40">{s.email}</div>
                    </div>
                  </div>
                </Td>
                <Td className="text-white/70">@{s.username}</Td>
                <Td className="text-white/70">{s.phoneNumber}</Td>
                <Td className="text-white/60">{s.createdAt}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUpdateError(null);
                        setPasswordError(null);
                        setImageError(null);
                        setEditingStaff(s);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-volt-soft hover:text-volt"
                      aria-label={`Edit ${s.firstName}`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingStaff(s)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${s.firstName}`}
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

      {/* ── Create dialog ── */}
      <Dialog open={showCreate} onOpenChange={(open) => !open && setShowCreate(false)}>
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>Create a new staff account for the academy.</DialogDescription>
          </DialogHeader>
          <StaffCreateForm
            isSubmitting={createStaff.isPending}
            error={createError}
            onCancel={() => setShowCreate(false)}
            onSubmit={handleCreate}
          />
        </DialogContent>
      </Dialog>

      {/* ── Edit dialog ── */}
      <Dialog open={editingStaff != null} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update profile info, photo, or password independently.
            </DialogDescription>
          </DialogHeader>
          {editingStaff && (
            <StaffEditForm
              staff={editingStaff}
              isUpdating={updateStaff.isPending}
              isChangingPassword={changePassword.isPending}
              isUpdatingImage={updateImage.isPending}
              isDeletingImage={deleteImage.isPending}
              updateError={updateError}
              passwordError={passwordError}
              imageError={imageError}
              onCancel={() => setEditingStaff(null)}
              onUpdate={(values) => updateStaff.mutate({ id: editingStaff.id, body: values })}
              onChangePassword={(values) =>
                changePassword.mutate({ id: editingStaff.id, body: values })
              }
              onUpdateImage={(image) => updateImage.mutate({ id: editingStaff.id, image })}
              onDeleteImage={() => deleteImage.mutate(editingStaff.id)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete dialog ── */}
      <AlertDialog
        open={deletingStaff != null}
        onOpenChange={(open) => !open && setDeletingStaff(null)}
      >
        <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Staff Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-bold text-white">
                {deletingStaff?.firstName} {deletingStaff?.lastName}
              </span>{" "}
              and revoke their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteStaff.isError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {deleteStaff.error.message}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteStaff.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deletingStaff) deleteStaff.mutate(deletingStaff.id);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteStaff.isPending ? "Deleting..." : "Delete"}
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
      <Td className="text-sm text-white/60" colSpan={5}>
        {children}
      </Td>
    </tr>
  );
}
