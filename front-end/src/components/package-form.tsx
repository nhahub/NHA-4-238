import { type FormEvent } from "react";
import { Save } from "lucide-react";
import type { Plan } from "@/types/domain/plan";
import type { PackageOption } from "@/types/domain/package";

export type PackageFormValues = {
  title: string;
  description: string;
  price: number;
  numberOfMonthes: number;
  numberOfSessions: number;
  planId: number;
};

type PackageFormProps = {
  pkg?: PackageOption | null;
  plans: Plan[];
  mode: "create" | "edit";
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: PackageFormValues) => void;
};

export function PackageForm({
  pkg,
  plans,
  mode,
  isSubmitting = false,
  error,
  onCancel,
  onSubmit,
}: PackageFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);

    onSubmit({
      title: String(fd.get("title") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      price: Number(fd.get("price")),
      numberOfMonthes: Number(fd.get("numberOfMonthes")),
      numberOfSessions: Number(fd.get("numberOfSessions")),
      planId: Number(fd.get("planId")),
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Preview when editing */}
      {mode === "edit" && pkg && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="text-sm font-bold text-white">{pkg.title}</div>
          <div className="mt-0.5 text-xs text-white/50">{pkg.planTitle ?? "No plan linked"}</div>
        </div>
      )}

      {/* Title */}
      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Title</span>
        <input
          name="title"
          required
          defaultValue={pkg?.title ?? ""}
          placeholder="e.g. Football Foundations – Monthly"
          className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
        />
      </label>

      {/* Description */}
      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Description
        </span>
        <textarea
          name="description"
          required
          defaultValue={pkg?.description ?? ""}
          rows={3}
          placeholder="What's included in this package"
          className="w-full resize-none rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
        />
      </label>

      {/* Plan */}
      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Linked Plan
        </span>
        <select
          name="planId"
          required
          defaultValue={pkg?.planId ?? ""}
          className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white focus:border-volt/50 focus:outline-none"
        >
          <option value="" disabled>
            Select a plan
          </option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>

      {/* Price / Months / Sessions */}
      <div className="grid grid-cols-3 gap-4">
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Price</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">
              $
            </span>
            <input
              name="price"
              type="number"
              required
              min={0}
              step={0.01}
              defaultValue={pkg?.price ?? ""}
              className="w-full rounded-lg border border-white/10 bg-carbon py-2.5 pl-7 pr-3 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Months</span>
          <input
            name="numberOfMonthes"
            type="number"
            required
            min={1}
            max={60}
            defaultValue={pkg?.numberOfMonthes ?? 1}
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white focus:border-volt/50 focus:outline-none"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            Sessions
          </span>
          <input
            name="numberOfSessions"
            type="number"
            required
            min={1}
            defaultValue={pkg?.numberOfSessions ?? ""}
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white focus:border-volt/50 focus:outline-none"
          />
        </label>
      </div>

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
          {isSubmitting ? "Saving..." : "Save Package"}
        </button>
      </div>
    </form>
  );
}
