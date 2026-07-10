import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useQuery } from "@tanstack/react-query";
import { sportApi } from "@/lib/api/endpoints/sport";
import { Badge, SectionHeader, VoltButton } from "@/components/ui-bits";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "Sports — IronCore" },
      { name: "description", content: "Six core disciplines coached by working professionals." },
      { property: "og:title", content: "Sports — IronCore" },
      {
        property: "og:description",
        content: "Six core disciplines coached by working professionals.",
      },
    ],
  }),
  component: SportsPage,
});

function SportsPage() {
  const sportsQuery = useQuery({ queryKey: ["sports"], queryFn: sportApi.getAll });
  const sports = sportsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-carbon text-white">
      <PublicNav />
      <header className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Disciplines"
            title="Every Sport We Train"
            subtitle="Pick your path. Each discipline is led by a working coach with real competitive history."
          />
        </div>
      </header>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {sports.map((s) => (
            <div
              key={s.id}
              className="group overflow-hidden rounded-2xl border border-white/5 bg-slate-900"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="mt-3 text-xl font-bold">{s.name}</h3>
                <p className="mt-2 text-sm text-white/50">{s.description}</p>
                <Link
                  to="/plans"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-volt"
                >
                  View plans <ArrowRight className="h-4 w-4" />
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
