import type { FormEvent } from "react";
import { Save, Upload } from "lucide-react";
import type { Sport } from "@/types/domain/sport";

export type SportFormValues = {
  name: string;
  description: string;
  image?: File;
};

type SportFormProps = {
  sport?: Sport | null;
  mode: "create" | "edit";
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: SportFormValues) => void;
};

export function SportForm({
  sport,
  mode,
  isSubmitting = false,
  error,
  onCancel,
  onSubmit,
}: SportFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const image = formData.get("image");

    onSubmit({
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      image: image instanceof File && image.size > 0 ? image : undefined,
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {mode === "edit" && sport && (
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <img
            src={sport.imageUrl}
            alt={sport.name}
            className="h-14 w-14 rounded-lg object-cover"
            width={56}
            height={56}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white">{sport.name}</div>
            <div className="line-clamp-2 text-xs text-white/50">{sport.description}</div>
          </div>
        </div>
      )}

      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Name</span>
        <input
          name="name"
          required
          defaultValue={sport?.name ?? ""}
          className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          placeholder="Sport name"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Description
        </span>
        <textarea
          name="description"
          required
          defaultValue={sport?.description ?? ""}
          rows={4}
          className="w-full resize-none rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          placeholder="Short description"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Image {mode === "edit" ? "(optional)" : ""}
        </span>
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-carbon px-3 py-3 text-sm text-white/60">
          <Upload className="h-4 w-4 text-white/40" />
          <input
            name="image"
            type="file"
            accept="image/png,image/jpeg"
            required={mode === "create"}
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
          {isSubmitting ? "Saving..." : "Save Sport"}
        </button>
      </div>
    </form>
  );
}
