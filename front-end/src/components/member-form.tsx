import { type FormEvent } from "react";
import { Save, Upload } from "lucide-react";

export type MemberFormValues = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  image?: File;
};

type MemberFormProps = {
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: MemberFormValues) => void;
};

export function MemberForm({ isSubmitting = false, error, onCancel, onSubmit }: MemberFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const image = fd.get("image");

    onSubmit({
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      birthDate: String(fd.get("birthDate") ?? ""),
      email: String(fd.get("email") ?? "").trim(),
      phoneNumber: String(fd.get("phoneNumber") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
      confirmPassword: String(fd.get("confirmPassword") ?? ""),
      image: image instanceof File && image.size > 0 ? image : undefined,
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            First Name
          </span>
          <input
            name="firstName"
            required
            placeholder="Ahmed"
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            Last Name
          </span>
          <input
            name="lastName"
            required
            placeholder="Hassan"
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          />
        </label>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="ahmed@example.com"
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Phone</span>
          <input
            name="phoneNumber"
            type="tel"
            required
            placeholder="+20 1xx xxx xxxx"
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          />
        </label>
      </div>

      {/* Birthdate */}
      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Date of Birth
        </span>
        <input
          name="birthDate"
          type="date"
          required
          className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white focus:border-volt/50 focus:outline-none"
        />
      </label>

      {/* Password row */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            Confirm Password
          </span>
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          />
        </label>
      </div>

      {/* Image */}
      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Profile Image (optional)
        </span>
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-carbon px-3 py-3 text-sm text-white/60">
          <Upload className="h-4 w-4 text-white/40" />
          <input
            name="image"
            type="file"
            accept="image/png,image/jpeg"
            className="min-w-0 flex-1 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-white/15"
          />
        </div>
      </label>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

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
          {isSubmitting ? "Saving..." : "Add Member"}
        </button>
      </div>
    </form>
  );
}
