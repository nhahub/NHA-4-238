import { type FormEvent } from "react";
import { Save, Upload, KeyRound, Camera, Trash2 } from "lucide-react";
import type { StaffDto } from "@/types/domain/staff";

// ── Create ──────────────────────────────────────────────────
export type StaffCreateValues = {
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  image?: File;
};

// ── Update profile ───────────────────────────────────────────
export type StaffUpdateValues = {
  firstName: string;
  lastName: string;
  birthDate: string;
  username: string;
  email: string;
  phoneNumber: string;
};

// ── Change password ──────────────────────────────────────────
export type StaffPasswordValues = {
  oldPassword: string;
  newPassword: string;
};

// ─────────────────────────────────────────────────────────────
// CREATE FORM
// ─────────────────────────────────────────────────────────────
type CreateFormProps = {
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: StaffCreateValues) => void;
};

export function StaffCreateForm({
  isSubmitting = false,
  error,
  onCancel,
  onSubmit,
}: CreateFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const image = fd.get("image");
    onSubmit({
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      birthDate: String(fd.get("birthDate") ?? ""),
      username: String(fd.get("username") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phoneNumber: String(fd.get("phoneNumber") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
      confirmPassword: String(fd.get("confirmPassword") ?? ""),
      image: image instanceof File && image.size > 0 ? image : undefined,
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name">
          <input name="firstName" required placeholder="Ahmed" className={input} />
        </Field>
        <Field label="Last Name">
          <input name="lastName" required placeholder="Hassan" className={input} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Username">
          <input name="username" required placeholder="ahmed.hassan" className={input} />
        </Field>
        <Field label="Date of Birth">
          <input name="birthDate" type="date" required className={input} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            placeholder="ahmed@academy.com"
            className={input}
          />
        </Field>
        <Field label="Phone">
          <input
            name="phoneNumber"
            type="tel"
            required
            placeholder="+20 1xx xxx xxxx"
            className={input}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Password">
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className={input}
          />
        </Field>
        <Field label="Confirm Password">
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            className={input}
          />
        </Field>
      </div>

      <Field label="Profile Image (optional)">
        <FileInput name="image" />
      </Field>

      {error && <ErrorBox>{error}</ErrorBox>}

      <FormFooter onCancel={onCancel} isSubmitting={isSubmitting} label="Add Staff" />
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// EDIT FORM  — three independent sections
// ─────────────────────────────────────────────────────────────
type EditFormProps = {
  staff: StaffDto;
  isUpdating?: boolean;
  isChangingPassword?: boolean;
  isUpdatingImage?: boolean;
  isDeletingImage?: boolean;
  updateError?: string | null;
  passwordError?: string | null;
  imageError?: string | null;
  onCancel: () => void;
  onUpdate: (values: StaffUpdateValues) => void;
  onChangePassword: (values: StaffPasswordValues) => void;
  onUpdateImage: (image: File) => void;
  onDeleteImage: () => void;
};

export function StaffEditForm({
  staff,
  isUpdating = false,
  isChangingPassword = false,
  isUpdatingImage = false,
  isDeletingImage = false,
  updateError,
  passwordError,
  imageError,
  onCancel,
  onUpdate,
  onChangePassword,
  onUpdateImage,
  onDeleteImage,
}: EditFormProps) {
  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    onUpdate({
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      birthDate: String(fd.get("birthDate") ?? ""),
      username: String(fd.get("username") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phoneNumber: String(fd.get("phoneNumber") ?? "").trim(),
    });
  }

  function handlePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    onChangePassword({
      oldPassword: String(fd.get("oldPassword") ?? ""),
      newPassword: String(fd.get("newPassword") ?? ""),
    });
  }

  function handleImageChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const image = fd.get("image");
    if (image instanceof File && image.size > 0) onUpdateImage(image);
  }

  return (
    <div className="space-y-6">
      {/* ── Section 1: Profile info ── */}
      <Section title="Profile Information">
        <form className="space-y-4" onSubmit={handleUpdate}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name">
              <input name="firstName" required defaultValue={staff.firstName} className={input} />
            </Field>
            <Field label="Last Name">
              <input name="lastName" required defaultValue={staff.lastName} className={input} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Username">
              <input name="username" required defaultValue={staff.username} className={input} />
            </Field>
            <Field label="Date of Birth">
              <input
                name="birthDate"
                type="date"
                required
                defaultValue={staff.birthDate}
                className={input}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <input
                name="email"
                type="email"
                required
                defaultValue={staff.email}
                className={input}
              />
            </Field>
            <Field label="Phone">
              <input
                name="phoneNumber"
                type="tel"
                required
                defaultValue={staff.phoneNumber}
                className={input}
              />
            </Field>
          </div>

          {updateError && <ErrorBox>{updateError}</ErrorBox>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 text-sm font-bold text-carbon transition-all hover:scale-105 hover:shadow-volt disabled:pointer-events-none disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Section>

      {/* ── Section 2: Profile image ── */}
      <Section title="Profile Image">
        <div className="flex items-center gap-4">
          {/* Current avatar */}
          {staff.imageUrl ? (
            <img
              src={staff.imageUrl}
              alt={staff.firstName}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10 ring-2 ring-white/10">
              <Camera className="h-6 w-6 text-white/30" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <form className="flex items-center gap-2" onSubmit={handleImageChange}>
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-dashed border-white/15 bg-carbon px-3 py-2">
                <Upload className="h-3.5 w-3.5 shrink-0 text-white/40" />
                <input
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="min-w-0 flex-1 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-white/10 file:px-2 file:py-1 file:text-xs file:font-bold file:text-white hover:file:bg-white/15"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingImage}
                className="shrink-0 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 disabled:opacity-60"
              >
                {isUpdatingImage ? "Uploading..." : "Upload"}
              </button>
            </form>

            {staff.imageUrl && (
              <button
                type="button"
                disabled={isDeletingImage}
                onClick={onDeleteImage}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 disabled:opacity-60"
              >
                <Trash2 className="h-3 w-3" />
                {isDeletingImage ? "Removing..." : "Remove current photo"}
              </button>
            )}
          </div>
        </div>
        {imageError && <ErrorBox>{imageError}</ErrorBox>}
      </Section>

      {/* ── Section 3: Change password ── */}
      <Section title="Change Password">
        <form className="space-y-4" onSubmit={handlePassword}>
          <Field label="Current Password">
            <input
              name="oldPassword"
              type="password"
              required
              placeholder="••••••••"
              className={input}
            />
          </Field>
          <Field label="New Password">
            <input
              name="newPassword"
              type="password"
              required
              placeholder="••••••••"
              className={input}
            />
          </Field>

          {passwordError && <ErrorBox>{passwordError}</ErrorBox>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white/80 transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-60"
            >
              <KeyRound className="h-4 w-4" />
              {isChangingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </Section>

      {/* Cancel */}
      <div className="flex justify-start pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white/50 transition-colors hover:bg-white/5"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared small components
// ─────────────────────────────────────────────────────────────
const input =
  "w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-widest text-white/50">{label}</span>
      {children}
    </label>
  );
}

function FileInput({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-carbon px-3 py-3">
      <Upload className="h-4 w-4 shrink-0 text-white/40" />
      <input
        name={name}
        type="file"
        accept="image/png,image/jpeg"
        className="min-w-0 flex-1 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-white/15"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div className="text-xs font-bold uppercase tracking-widest text-white/40">{title}</div>
      {children}
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {children}
    </div>
  );
}

function FormFooter({
  onCancel,
  isSubmitting,
  label,
}: {
  onCancel: () => void;
  isSubmitting: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white/70 transition-colors hover:bg-white/5"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-volt px-5 py-2.5 text-sm font-bold text-carbon transition-all hover:scale-105 hover:shadow-volt disabled:pointer-events-none disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {isSubmitting ? "Saving..." : label}
      </button>
    </div>
  );
}
