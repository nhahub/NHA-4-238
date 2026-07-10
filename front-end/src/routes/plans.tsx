import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { Badge, SectionHeader } from "@/components/ui-bits";
import { Calendar, Clock, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { formatAppointment } from "../utils/format";
import { planApi } from "@/lib/api/endpoints/plan";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Training Plans - IronCore" },
      { name: "description", content: "Structured programs from foundations to fight camps." },
      { property: "og:title", content: "Training Plans - IronCore" },
      {
        property: "og:description",
        content: "Structured programs from foundations to fight camps.",
      },
    ],
  }),
  component: PlansPage,
});

function PlansPage() {
  const plansQuery = useQuery({ queryKey: ["plans"], queryFn: planApi.getAll });
  const plans = plansQuery.data ?? [];
  const sports = Array.from(new Set(plans.map((p) => p.sport))).sort();
  const [filter, setFilter] = useState<string>("All");
  const filtered = filter === "All" ? plans : plans.filter((p) => p.sport === filter);

  return (
    <div className="min-h-screen bg-carbon text-white">
      <PublicNav />
      <header className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Programs"
            title="Training Plans"
            subtitle="Plans are the training programs. Packages hold the prices, months, and sessions."
          />
          <div className="flex flex-wrap gap-2">
            {["All", ...sports].map((sport) => (
              <button
                key={sport}
                onClick={() => setFilter(sport)}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                  filter === sport
                    ? "border-volt bg-volt text-carbon"
                    : "border-white/10 text-white/60 hover:border-white/30"
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
      </header>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {plansQuery.isLoading && <StatusMessage>Loading training plans...</StatusMessage>}
          {plansQuery.isError && <StatusMessage>{plansQuery.error.message}</StatusMessage>}
          {!plansQuery.isLoading && !plansQuery.isError && filtered.length === 0 && (
            <StatusMessage>No plans found.</StatusMessage>
          )}

          {filtered.map((plan) => (
            <div
              key={plan.id}
              className="group flex flex-col rounded-2xl border border-white/5 bg-slate-900 p-6 transition-colors hover:border-volt/40"
            >
              <div className="flex items-start justify-between">
                <Badge>{plan.sport}</Badge>
              </div>
              <h3 className="mt-4 text-xl font-bold">{plan.title}</h3>
              <p className="mt-2 text-sm text-white/50">{plan.description}</p>

              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Users className="h-3.5 w-3.5 text-white/40" /> {plan.trainerName}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Calendar className="h-3.5 w-3.5 text-white/40" /> {plan.appointments.length}{" "}
                  weekly appointments
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-carbon/60 p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Weekly Schedule
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {plan.appointments.map((appointment) => (
                    <span
                      key={`${appointment.day}-${appointment.time}`}
                      className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-[10px] text-white/70"
                    >
                      <Clock className="h-3 w-3" /> {formatAppointment(appointment)}
                    </span>
                  ))}
                  {plan.appointments.length === 0 && (
                    <span className="text-xs text-white/40">No schedule added yet.</span>
                  )}
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between pt-6">
                <div>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/40">
                    Pricing
                  </span>
                  <div className="text-xs text-white/50">Choose a package for this plan</div>
                </div>
                <Link
                  to="/packages"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-volt px-5 py-2.5 text-sm font-bold text-carbon transition-transform hover:scale-105"
                >
                  View Packages
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}

function StatusMessage({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 text-sm text-white/60 md:col-span-2 lg:col-span-3">
      {children}
    </div>
  );
}
