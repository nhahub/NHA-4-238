import { type FormEvent, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import type { Sport } from "@/types/domain/sport";
import type { Trainer } from "@/types/domain/trainer";
import { WEEK_DAYS } from "@/types/enums";

export type AppointmentValue = {
  day: number;
  time: string;
};

export type PlanFormValues = {
  title: string;
  description: string;
  trainerId: number;
  sportId: number;
  appointments: AppointmentValue[];
};

type PlanFormProps = {
  plan?: {
    title: string;
    description: string;
    trainerId: number;
    sportId: number;
    appointments: AppointmentValue[];
  } | null;
  trainers: Trainer[];
  sports: Sport[];
  mode: "create" | "edit";
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: PlanFormValues) => void;
};

function emptyAppointment(): AppointmentValue {
  return { day: 0, time: "08:00" };
}

export function PlanForm({
  plan,
  trainers,
  sports,
  mode,
  isSubmitting = false,
  error,
  onCancel,
  onSubmit,
}: PlanFormProps) {
  const [appointments, setAppointments] = useState<AppointmentValue[]>(
    plan?.appointments?.length
      ? plan.appointments.map((a) => ({ day: Number(a.day), time: a.time.slice(0, 5) }))
      : [emptyAppointment()],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    onSubmit({
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      trainerId: Number(formData.get("trainerId")),
      sportId: Number(formData.get("sportId")),
      appointments,
    });
  }

  function addAppointment() {
    setAppointments((prev) => [...prev, emptyAppointment()]);
  }

  function removeAppointment(index: number) {
    setAppointments((prev) => prev.filter((_, i) => i !== index));
  }

  function updateAppointment(index: number, field: keyof AppointmentValue, value: string | number) {
    setAppointments((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Title */}
      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Title</span>
        <input
          name="title"
          required
          defaultValue={plan?.title ?? ""}
          className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          placeholder="Plan title"
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
          defaultValue={plan?.description ?? ""}
          rows={3}
          className="w-full resize-none rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-volt/50 focus:outline-none"
          placeholder="What this plan covers"
        />
      </label>

      {/* Sport + Trainer dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Sport</span>
          <select
            name="sportId"
            required
            defaultValue={plan?.sportId ?? ""}
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white focus:border-volt/50 focus:outline-none"
          >
            <option value="" disabled>
              Select sport
            </option>
            {sports.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">Trainer</span>
          <select
            name="trainerId"
            required
            defaultValue={plan?.trainerId ?? ""}
            className="w-full rounded-lg border border-white/10 bg-carbon px-3 py-2.5 text-sm text-white focus:border-volt/50 focus:outline-none"
          >
            <option value="" disabled>
              Select trainer
            </option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Appointments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50">
            Weekly Schedule
          </span>
          <button
            type="button"
            onClick={addAppointment}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/70 hover:bg-white/10"
          >
            <Plus className="h-3 w-3" /> Add Slot
          </button>
        </div>

        {appointments.length === 0 && (
          <p className="rounded-lg border border-dashed border-white/10 py-4 text-center text-xs text-white/30">
            No sessions yet — click "Add Slot" to add one.
          </p>
        )}

        <div className="space-y-2">
          {appointments.map((appt, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              {/* Day pill selector */}
              <div className="flex flex-wrap gap-1">
                {WEEK_DAYS.map((day, dayIndex) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => updateAppointment(index, "day", dayIndex)}
                    className={`rounded-md px-2 py-1 text-[10px] font-bold transition-colors ${
                      Number(appt.day) === dayIndex // ← Number() here
                        ? "bg-volt text-carbon"
                        : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* Time input */}
              <input
                type="time"
                value={appt.time}
                onChange={(e) => updateAppointment(index, "time", e.target.value)}
                className="rounded-lg border border-white/10 bg-carbon px-2 py-1.5 text-sm text-white focus:border-volt/50 focus:outline-none"
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeAppointment(index)}
                disabled={appointments.length === 1}
                className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-white/30 hover:bg-red-500/10 hover:text-red-400 disabled:pointer-events-none disabled:opacity-20"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
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
          {isSubmitting ? "Saving..." : "Save Plan"}
        </button>
      </div>
    </form>
  );
}
