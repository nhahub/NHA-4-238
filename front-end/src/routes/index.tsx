import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  Calendar,
  Dumbbell,
  Flame,
  Quote,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { VoltButton, SectionHeader, Badge } from "@/components/ui-bits";
import heroImg from "@/assets/hero-athlete.jpg";
import { type Plan } from "@/types/domain/plan";
import { planApi } from "@/lib/api/endpoints/plan";
import { sportApi } from "@/lib/api/endpoints/sport";
import { trainerApi } from "@/lib/api/endpoints/trainer";
import { packageApi } from "@/lib/api/endpoints/package";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IronCore — Peak Performance is a System" },
      {
        name: "description",
        content: "Premium gym & academy management for elite trainers, members, and operators.",
      },
      { property: "og:title", content: "IronCore — Peak Performance is a System" },
      {
        property: "og:description",
        content: "Premium gym & academy management for elite trainers, members, and operators.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const plansQuery = useQuery({ queryKey: ["plans"], queryFn: planApi.getAll });
  const packagesQuery = useQuery({ queryKey: ["packages"], queryFn: packageApi.getAll });
  const sportsQuery = useQuery({ queryKey: ["sports"], queryFn: sportApi.getAll });
  const trainersQuery = useQuery({ queryKey: ["trainers"], queryFn: trainerApi.getAll });
  const sports = sportsQuery.data ?? [];
  const trainers = trainersQuery.data ?? [];
  const plans = plansQuery.data ?? [];
  const packages = packagesQuery.data ?? [];

  return (
    <div className="min-h-screen bg-carbon text-white">
      <PublicNav />

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="h-full w-full object-cover opacity-30"
            width={1600}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 inline-block rounded-full bg-volt-soft px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-volt">
              Premium Academy Management
            </div>
            <h1 className="text-5xl font-extrabold leading-[0.9] tracking-tighter sm:text-6xl md:text-8xl">
              PEAK <span className="italic text-volt">PERFORMANCE</span>
              <br />
              IS A SYSTEM.
            </h1>
            <p className="mt-8 max-w-lg text-base text-white/60 sm:text-lg">
              The elite management suite for high-performance academies, professional trainers, and
              dedicated athletes. Built for the people who treat training as a craft.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <VoltButton to="/register">
                Join Now! <ArrowRight className="h-4 w-4" />
              </VoltButton>
              <VoltButton to="/plans" variant="ghost">
                Browse Plans
              </VoltButton>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { v: sports.length, l: "Featured Sports" },
                { v: plans.length, l: "Active Plans" },
                { v: packages.length, l: "Training Packages" },
                { v: trainers.length, l: "Elite Coaches" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-extrabold sm:text-3xl">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Sports */}
      <section className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Disciplines"
            title="Featured Sports"
            subtitle="Six pillars of training, taught by working professionals."
            action={
              <VoltButton to="/sports" variant="ghost">
                All Sports
              </VoltButton>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sports.slice(0, 6).map((s) => (
              <Link
                key={s.id}
                to="/sports"
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900"
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
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="mt-2 text-xl font-bold">{s.name}</h3>
                  <p className="mt-1 text-sm text-white/60">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plans */}
      <section className="border-b border-white/5 bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Programs"
            title="Top Training Plans"
            action={
              <VoltButton to="/plans" variant="ghost">
                All Plans
              </VoltButton>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.slice(0, 3).map((p) => (
              <PlanCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Pricing"
            title="Training Packages"
            action={
              <VoltButton to="/packages" variant="ghost">
                All Packages
              </VoltButton>
            }
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.slice(0, 3).map((pkg) => (
              <Link
                key={pkg.id}
                to="/packages"
                className="group rounded-2xl border border-white/5 bg-slate-900 transition-colors hover:border-volt/40"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <Badge>{pkg.sport ?? "Package"}</Badge>
                    <Badge variant="volt">{pkg.numberOfMonthes} mo</Badge>
                  </div>
                  <h4 className="mt-4 text-xl font-bold">{pkg.title}</h4>
                  <p className="mt-2 text-sm text-white/50">{pkg.description}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold">${pkg.price}</span>
                    <span className="text-xs text-white/40">/package</span>
                  </div>
                  <div className="mt-5 border-t border-white/5 pt-4 text-xs text-white/60">
                    {pkg.planTitle ?? "Linked plan not set"} · {pkg.numberOfSessions} sessions
                  </div>
                </div>
              </Link>
            ))}
            {packagesQuery.isLoading && (
              <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 text-sm text-white/60 md:col-span-2 lg:col-span-3">
                Loading packages...
              </div>
            )}
            {!packagesQuery.isLoading && packages.length === 0 && (
              <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 text-sm text-white/60 md:col-span-2 lg:col-span-3">
                No packages found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="border-b border-white/5 bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Faculty"
            title="Meet The Coaches"
            action={
              <VoltButton to="/trainers" variant="ghost">
                All Trainers
              </VoltButton>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-slate-900"
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    loading="lazy"
                    width={700}
                    height={900}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-volt">
                    {t.sport}
                  </div>
                  <h4 className="mt-1 text-base font-bold">{t.name}</h4>
                  <p className="text-xs text-white/40">
                    {t.title} · {t.yearsOfExperience} yrs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-4xl font-extrabold tracking-tighter sm:text-6xl">
            Stop training <span className="italic text-volt">soft</span>.
          </h2>
          <p className="mt-4 text-white/60">Join an academy built for serious athletes.</p>
          <div className="mt-8 flex justify-center gap-3">
            <VoltButton to="/register">
              Join IronCore <ArrowRight className="h-4 w-4" />
            </VoltButton>
            <VoltButton to="/login" variant="ghost">
              Member Login
            </VoltButton>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function PlanCard({ p }: { p: Plan }) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-slate-900 p-6 transition-colors hover:border-volt/40">
      <div className="flex items-start justify-between">
        <Badge variant="default">{p.sport}</Badge>
      </div>
      <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
      <p className="mt-2 text-sm text-white/50">{p.description}</p>
      <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
        <Users className="h-4 w-4 text-white/40" />
        <span className="text-xs text-white/60">{p.trainerName}</span>
        <Calendar className="ml-auto h-4 w-4 text-white/40" />
        <span className="text-xs text-white/60">{p.appointments.length} appointments</span>
      </div>
      <div className="mt-6 flex items-baseline justify-between">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-white/40">Pricing</span>
          <div className="text-xs text-white/50">Packages hold the price</div>
        </div>
        <VoltButton to="/plans" variant="outline">
          View
        </VoltButton>
      </div>
    </div>
  );
}
