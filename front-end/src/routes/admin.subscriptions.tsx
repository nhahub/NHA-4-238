import { createFileRoute } from "@tanstack/react-router";
import { AdminTableShell, Td, Th } from "@/components/admin-table";
import { Badge } from "@/components/ui-bits";
import { type Subscription } from "@/types/domain/subscription";
import { subscriptionApi } from "@/lib/api/endpoints/subscription";
import { planApi } from "@/lib/api/endpoints/plan";
import { packageApi } from "@/lib/api/endpoints/package";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SubscriptionForm, type SubscriptionFormValues } from "@/components/subscription-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memberApi } from "@/lib/api/endpoints/member";

export const Route = createFileRoute("/admin/subscriptions")({
  component: Page,
});

function Page() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const subscriptionsQuery = useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: subscriptionApi.getAll,
  });
  const plansQuery = useQuery({ queryKey: ["plans"], queryFn: planApi.getAll });
  const packagesQuery = useQuery({ queryKey: ["packages"], queryFn: packageApi.getAll });

  const createSubscription = useMutation({
    mutationFn: subscriptionApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      setShowCreate(false);
      setFormError(null);
    },
    onError: (e) => setFormError(e.message),
  });

  const subscriptions = subscriptionsQuery.data ?? [];
  const plans = plansQuery.data ?? [];
  const packages = packagesQuery.data ?? [];

  function handleSubmit(values: SubscriptionFormValues) {
    setFormError(null);
    createSubscription.mutate(values);
  }
  const [search, setSearch] = useState("");

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.memberName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <AdminTableShell
        title="Subscriptions"
        searchValue={search}
        onSearchChange={setSearch}
        subtitle="All active, expiring & expired subscriptions"
        addLabel="New Subscription"
        onAdd={() => {
          setFormError(null);
          setShowCreate(true);
        }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <Th>Sub ID</Th>
              <Th>Member</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th>Window</Th>
              <Th align="right">Paid</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {subscriptionsQuery.isLoading && <StatusRow>Loading subscriptions...</StatusRow>}
            {subscriptionsQuery.isError && (
              <StatusRow>{subscriptionsQuery.error.message}</StatusRow>
            )}
            {!subscriptionsQuery.isLoading &&
              !subscriptionsQuery.isError &&
              subscriptions.length === 0 && <StatusRow>No subscriptions yet.</StatusRow>}
            {filteredSubscriptions.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02]">
                <Td className="font-mono text-xs text-white/50">SUB-{s.id}</Td>
                <Td>
                  <div className="font-bold">{s.memberName}</div>
                  <div className="text-[11px] text-white/40">{s.email}</div>
                </Td>
                <Td className="text-white/70">{s.planName}</Td>
                <Td>
                  <Badge
                    variant={
                      s.status === "Active"
                        ? "active"
                        : s.status === "Expiring"
                          ? "expiring"
                          : "expired"
                    }
                  >
                    {s.status}
                  </Badge>
                </Td>
                <Td className="text-white/60">
                  {s.startDate} → {s.endDate}
                </Td>
                <Td className="text-right font-bold text-volt">${s.paid}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <Dialog open={showCreate} onOpenChange={(open) => !open && setShowCreate(false)}>
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Subscription</DialogTitle>
            <DialogDescription>
              Look up a member by ID then pick a package to subscribe them to.
            </DialogDescription>
          </DialogHeader>
          <SubscriptionForm
            plans={plans}
            packages={packages}
            isSubmitting={createSubscription.isPending}
            error={formError}
            onCancel={() => setShowCreate(false)}
            onSubmit={handleSubmit}
            onLookupMember={async (id) => {
              try {
                return await memberApi.getById(id);
              } catch {
                return null;
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusRow({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <Td className="text-sm text-white/60" colSpan={6}>
        {children}
      </Td>
    </tr>
  );
}
