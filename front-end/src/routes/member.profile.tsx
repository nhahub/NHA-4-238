import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthInput } from "@/components/auth-shell";
import { Badge, DataCard, VoltButton } from "@/components/ui-bits";
import { Camera, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRequireRole } from "@/hooks/use-require-role";
import { type UpdateMemberDto, type ChangePasswordDto } from "@/types/domain/member";
import { formatDisplayDate, toDateInputValue } from "@/lib/date-utils";
import { memberApi } from "@/lib/api/endpoints/member";
import { accountApi } from "@/lib/api/endpoints/account";

export const Route = createFileRoute("/member/profile")({
  component: Page,
});

function Page() {
  const allowed = useRequireRole(["Member"]);
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();

  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: ["member-profile", user?.id],
    queryFn: () => memberApi.getById(user!.id),
    enabled: !!user && allowed,
  });

  const updateProfile = useMutation({
    mutationFn: (body: UpdateMemberDto) => memberApi.update(user!.id, body),
    onSuccess: async (updatedMember, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["member-profile", user?.id] });
      refreshUser({
        fullName: `${variables.firstName} ${variables.lastName}`,
        email: variables.email,
      });
      setProfileError(null);
    },
    onError: (e) => setProfileError(e.message),
  });
  const changePassword = useMutation({
    mutationFn: (body: ChangePasswordDto) => accountApi.changePassword(user!.id, body),
    onSuccess: () => {
      setPasswordError(null);
      setPasswordSuccess(true);
    },
    onError: (e) => {
      setPasswordSuccess(false);
      setPasswordError(e.message);
    },
  });

  const updateImage = useMutation({
    mutationFn: (image: File) => {
      const fd = new FormData();
      fd.append("image", image);
      return accountApi.updateImage(user!.id, fd);
    },
    onSuccess: async (newImageUrl: string) => {
      await queryClient.invalidateQueries({ queryKey: ["member-profile", user?.id] });
      refreshUser({ imageUrl: newImageUrl });

      setImageError(null);
    },
    onError: (e) => setImageError(e.message),
  });

  const deleteImage = useMutation({
    mutationFn: () => accountApi.deleteImage(user!.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["member-profile", user?.id] });
      refreshUser({ imageUrl: null });
      setImageError(null);
    },
    onError: (e) => setImageError(e.message),
  });

  function handleProfileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileError(null);
    const data = new FormData(e.currentTarget);
    updateProfile.mutate({
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      birthDate: String(data.get("birthDate") ?? ""),
      email: String(data.get("email") ?? ""),
      phoneNumber: String(data.get("phoneNumber") ?? ""),
    });
  }

  function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordSuccess(false);
    const data = new FormData(e.currentTarget);
    changePassword.mutate({
      oldPassword: String(data.get("oldPassword") ?? ""),
      newPassword: String(data.get("newPassword") ?? ""),
    });
    e.currentTarget.reset();
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) updateImage.mutate(file);
  }

  if (!allowed || !user) return null;

  const member = profileQuery.data;
  const initials = user.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <DataCard className="p-6 lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {member?.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={user.fullName}
                className="h-24 w-24 rounded-full object-cover"
                width={96}
                height={96}
              />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-full bg-volt text-3xl font-extrabold text-carbon">
                {initials}
              </div>
            )}
            <label className="absolute bottom-0 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-slate-800 ring-2 ring-carbon hover:bg-volt hover:text-carbon">
              <Camera className="h-3.5 w-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
            </label>
          </div>
          <h3 className="mt-4 text-xl font-bold">{user.fullName}</h3>
          <p className="text-xs text-white/50">{user.email}</p>

          {imageError && <p className="mt-2 text-xs text-red-400">{imageError}</p>}
          {member?.imageUrl && (
            <button
              type="button"
              onClick={() => deleteImage.mutate()}
              disabled={deleteImage.isPending}
              className="mt-2 text-xs text-white/40 hover:text-red-400"
            >
              {deleteImage.isPending ? "Removing…" : "Remove photo"}
            </button>
          )}
        </div>
        <div className="mt-6 space-y-2 border-t border-white/5 pt-6 text-sm">
          <Row label="Member since" value={formatDisplayDate(member?.createdAt ?? "")} />
          <Row label="Member ID" value={`M-${user.id}`} />
        </div>
      </DataCard>

      <DataCard className="p-6 lg:col-span-2">
        <h3 className="mb-6 text-lg font-bold">Personal Information</h3>

        {profileQuery.isLoading && <p className="text-sm text-white/50">Loading profile…</p>}
        {profileQuery.isError && (
          <p className="text-sm text-red-400">{profileQuery.error.message}</p>
        )}

        {member && (
          <form key={member.id} onSubmit={handleProfileSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthInput
                label="First name"
                name="firstName"
                defaultValue={member.firstName}
                required
              />
              <AuthInput
                label="Last name"
                name="lastName"
                defaultValue={member.lastName}
                required
              />
              <AuthInput
                label="Email"
                name="email"
                type="email"
                defaultValue={member.email}
                required
              />
              <AuthInput
                label="Phone"
                name="phoneNumber"
                type="tel"
                defaultValue={member.phoneNumber}
                required
              />
              <AuthInput
                label="Date of birth"
                name="birthDate"
                type="date"
                defaultValue={toDateInputValue(member.birthDate)}
                required
              />
            </div>

            {profileError && <p className="mt-4 text-sm text-red-400">{profileError}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <VoltButton type="button" variant="ghost" onClick={() => profileQuery.refetch()}>
                Cancel
              </VoltButton>
              <VoltButton type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving…" : "Save Changes"}
              </VoltButton>
            </div>
          </form>
        )}

        <h3 className="mb-6 mt-12 flex items-center gap-2 text-lg font-bold">
          <Lock className="h-4 w-4 text-volt" /> Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AuthInput label="Current password" name="oldPassword" type="password" required />
            <AuthInput label="New password" name="newPassword" type="password" required />
          </div>

          {passwordError && <p className="mt-4 text-sm text-red-400">{passwordError}</p>}
          {passwordSuccess && (
            <p className="mt-4 text-sm text-emerald-400">Password updated successfully.</p>
          )}

          <div className="mt-6 flex justify-end">
            <VoltButton type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Updating…" : "Update Password"}
            </VoltButton>
          </div>
        </form>
      </DataCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-widest text-white/40">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
