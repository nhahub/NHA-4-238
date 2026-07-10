import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { packageApi } from "@/lib/api/endpoints/package";
import { Badge, SectionHeader } from "@/components/ui-bits";
import { Calendar, Dumbbell } from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Packages - IronCore" },
      { name: "description", content: "Pricing packages for each training plan." },
      { property: "og:title", content: "Packages - IronCore" },
      { property: "og:description", content: "Pricing packages for each training plan." },
    ],
  }),
  component: PackagessPage,
});

function PackagessPage() {
  const packagesQuery = useQuery({ queryKey: ["packages"], queryFn: packageApi.getAll });
  const packages = packagesQuery.data ?? [];

  return (
    <div className="min-h-screen bg-carbon text-white">
      <PublicNav />
      <header className="border-b border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Pricing"
            title="Training Packages"
            subtitle="Packages are the pricing options for each training plan."
          />
        </div>
      </header>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {packagesQuery.isLoading && <StatusMessage>Loading packages...</StatusMessage>}
          {packagesQuery.isError && <StatusMessage>{packagesQuery.error.message}</StatusMessage>}
          {!packagesQuery.isLoading && !packagesQuery.isError && packages.length === 0 && (
            <StatusMessage>No packages found.</StatusMessage>
          )}

          {packages.map((pkg) => (
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
                <div className="mt-5 space-y-2 border-t border-white/5 pt-4 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-3.5 w-3.5 text-white/40" />{" "}
                    {pkg.planTitle ?? "Linked plan not set"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-white/40" /> {pkg.numberOfSessions}{" "}
                    sessions
                  </div>
                </div>
              </div>
            </Link>
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
