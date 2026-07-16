import { createFileRoute } from "@tanstack/react-router";
import { AdminTableShell, Td, Th } from "@/components/admin-table";
import { type MemberDto } from "@/types/domain/member";
import { memberApi } from "@/lib/api/endpoints/member";
import { accountApi } from "@/lib/api/endpoints/account";
import { Eye, Trash2, AlertTriangle, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MemberForm, type MemberFormValues } from "@/components/member-form";
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

export const Route = createFileRoute("/admin/members")({
  component: Page,
});

function Page() {
  const allowed = useRequireRole(["Admin", "Staff"]);
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewingMember, setViewingMember] = useState<MemberDto | null>(null);
  const [deletingMember, setDeletingMember] = useState<MemberDto | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: memberApi.getAll,
    enabled: allowed,
  });

  const members = membersQuery.data ?? [];
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [noPermission, setNoPermission] = useState(false);
  const createMember = useMutation({
    mutationFn: memberApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      setShowCreateForm(false);
      setFormError(null);
    },
    onError: (error) => setFormError(error.message),
  });

  const deleteMember = useMutation({
    mutationFn: accountApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      setDeletingMember(null);
    },
  });

  function handleFormSubmit(values: MemberFormValues) {
    setFormError(null);

    if (values.password !== values.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const fd = new FormData();
    fd.append("firstName", values.firstName);
    fd.append("lastName", values.lastName);
    fd.append("birthDate", values.birthDate);
    fd.append("email", values.email);
    fd.append("phoneNumber", values.phoneNumber);
    fd.append("password", values.password);
    fd.append("confirmPassword", values.confirmPassword);
    if (values.image) fd.append("image", values.image);

    createMember.mutate(fd);
  }
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(search.toLowerCase()) ||
      member.lastName.toLowerCase().includes(search.toLowerCase()),
  );
  if (!allowed) return null;
  return (
    <>
      <AdminTableShell
        title="Members Directory"
        searchValue={search}
        onSearchChange={setSearch}
        subtitle={`${members.length} registered members`}
        addLabel="Add Member"
        onAdd={() => {
          setFormError(null);
          setShowCreateForm(true);
        }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <Th>Id</Th>
              <Th>Member</Th>
              <Th>Birthdate</Th>
              <Th>Joined</Th>
              <Th>Active Subs</Th>
              <Th>Sessions</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {membersQuery.isLoading && <StatusRow>Loading members...</StatusRow>}
            {membersQuery.isError && <StatusRow>{membersQuery.error.message}</StatusRow>}
            {!membersQuery.isLoading && !membersQuery.isError && members.length === 0 && (
              <StatusRow>No members yet.</StatusRow>
            )}
            {filteredMembers.map((m) => (
              <tr key={m.id} className="hover:bg-white/[0.02]">
                <Td className="font-mono text-xs text-white/50">{m.id}</Td>

                <Td>
                  <div className="flex items-center gap-3">
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt={m.firstName}
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
                        {m.firstName} {m.lastName}
                      </div>
                      <div className="truncate text-[11px] text-white/40">
                        {m.email} · {m.phoneNumber}
                      </div>
                    </div>
                  </div>
                </Td>
                <Td className="text-white/70">{m.birthDate}</Td>
                <Td className="text-white/60">{m.createdAt}</Td>
                <Td className="text-white/60">{m.activeSubscriptions ?? "—"}</Td>
                <Td className="text-white/60">{m.totalAttendedSessions ?? "—"}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingMember(m)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-volt-soft hover:text-volt"
                      aria-label={`View ${m.firstName}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAdmin) {
                          setNoPermission(true);
                          return;
                        }
                        setDeletingMember(m);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                      aria-label={`Delete ${m.firstName}`}
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

      {/* Create modal */}
      <Dialog open={showCreateForm} onOpenChange={(open) => !open && setShowCreateForm(false)}>
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Register a new member and create their academy account.
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            isSubmitting={createMember.isPending}
            error={formError}
            onCancel={() => setShowCreateForm(false)}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* View modal */}
      <Dialog open={viewingMember != null} onOpenChange={(open) => !open && setViewingMember(null)}>
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
          </DialogHeader>
          {viewingMember && (
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                {viewingMember.imageUrl ? (
                  <img
                    src={viewingMember.imageUrl}
                    alt={viewingMember.firstName}
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-white/10 ring-2 ring-white/10">
                    <User className="h-9 w-9 text-white/40" />
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="text-center">
                <div className="text-lg font-bold">
                  {viewingMember.firstName} {viewingMember.lastName}
                </div>
                <div className="text-sm text-white/50">Member #{viewingMember.id}</div>
              </div>

              {/* Details */}
              <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                {[
                  ["Email", viewingMember.email],
                  ["Phone", viewingMember.phoneNumber],
                  ["Birthdate", viewingMember.birthDate],
                  ["Joined", viewingMember.createdAt],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 text-sm">
                    <span className="text-white/40">{label}</span>
                    <span className="text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deletingMember != null}
        onOpenChange={(open) => !open && setDeletingMember(null)}
      >
        <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-bold text-white">
                {deletingMember?.firstName} {deletingMember?.lastName}
              </span>{" "}
              and all their subscriptions and attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteMember.isError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {deleteMember.error.message}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMember.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (deletingMember) deleteMember.mutate(deletingMember.id);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteMember.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* No permission notice */}
      <AlertDialog open={noPermission} onOpenChange={setNoPermission}>
        <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Permission Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              Only admins can delete members. Please contact an admin if this member needs to be
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setNoPermission(false)}
              className="bg-volt text-black hover:bg-volt/90"
            >
              Got it
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
      <Td className="text-sm text-white/60" colSpan={6}>
        {children}
      </Td>
    </tr>
  );
}
