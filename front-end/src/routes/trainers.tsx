import { createFileRoute } from "@tanstack/react-router";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { trainerApi } from "@/lib/api/endpoints/trainer";
import { SectionHeader } from "@/components/ui-bits";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/trainers")({
  head: () => ({
    meta: [
      { title: "Trainers — IronCore" },
      { name: "description", content: "Meet the coaches who run IronCore." },
      { property: "og:title", content: "Trainers — IronCore" },
      { property: "og:description", content: "Meet the coaches who run IronCore." },
    ],
  }),
  component: TrainersPage,
});

function TrainersPage() {
  const trainersQuery = useQuery({ queryKey: ["trainers"], queryFn: trainerApi.getAll });
  const trainers = trainersQuery.data ?? [];

  return (
    <div className="min-h-screen bg-carbon text-white">
      <PublicNav />
      <header className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Faculty"
            title="The Coaches"
            subtitle="Working professionals. Real competitive history. Available to you."
          />
        </div>
      </header>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-2">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="group grid overflow-hidden rounded-3xl border border-white/5 bg-slate-900 sm:grid-cols-[1fr_2fr]"
            >
              <div className="aspect-square overflow-hidden bg-slate-800 sm:aspect-auto">
                <img
                  src={t.imageUrl}
                  alt={t.name}
                  loading="lazy"
                  width={700}
                  height={900}
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-volt">
                  {t.sport}
                </div>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{t.name}</h3>
                <p className="mt-1 text-sm text-white/50">{t.title}</p>
                <p className="mt-4 text-sm text-white/70">{t.description}</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-white/60">
                  <Award className="h-4 w-4 text-volt" /> {t.yearsOfExperience} years coaching
                  experience
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
