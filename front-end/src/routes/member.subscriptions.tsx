import { createFileRoute } from "@tanstack/react-router";
import { Badge, DataCard, StatCard, VoltButton } from "@/components/ui-bits";
import { CreditCard, DollarSign, Receipt } from "lucide-react";
import { Subscription } from "@/types/domain/subscription";
import { subscriptionApi } from "@/lib/api/endpoints/subscription";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useRequireRole } from "@/hooks/use-require-role";
export const Route = createFileRoute("/member/subscriptions")({
  component: Page,
});

function Page() {
  const allowed = useRequireRole(["Member"]);
  const { user } = useAuth();

  const subscriptionsQuery = useQuery({
    queryKey: ["memberSubscriptions", user!.id],
    queryFn: () => subscriptionApi.getByMember(user!.id),
    enabled: allowed,
  });

  const memberSubscriptions = subscriptionsQuery.data ?? [];
  const active = memberSubscriptions.filter((s) => s.status === "Active");
  const expired = memberSubscriptions.filter((s) => s.status === "Expired");
  if (!allowed) return null;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Spend"
          value={String(memberSubscriptions.reduce((sum, s) => sum + s.paid, 0))}
          trend="Lifetime"
          icon={DollarSign}
          accent
        />
        <StatCard
          label="Active"
          value={String(active.length)}
          trend="Subscriptions currently running"
          icon={CreditCard}
        />
        <StatCard
          label="Past Subscriptions"
          value={String(expired.length)}
          trend="Archived"
          icon={Receipt}
        />
      </div>

      <DataCard>
        <div className="flex items-center justify-between p-6">
          <h3 className="text-lg font-bold">Active Subscriptions</h3>
          {/* <VoltButton>Renew / Add Plan</VoltButton> */}
        </div>
        <SubsTable rows={active} />
      </DataCard>

      <DataCard>
        <div className="p-6">
          <h3 className="text-lg font-bold">History</h3>
        </div>
        <SubsTable rows={expired} />
      </DataCard>
    </div>
  );
}

function SubsTable({ rows }: { rows: Subscription[] }) {
  return (
    <div className="overflow-x-auto border-t border-white/5">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40">
            <th className="px-6 py-3 font-bold">ID</th>
            <th className="px-6 py-3 font-bold">Plan</th>
            <th className="px-6 py-3 font-bold">Start</th>
            <th className="px-6 py-3 font-bold">End</th>
            <th className="px-6 py-3 font-bold">Status</th>
            <th className="px-6 py-3 font-bold text-right">Paid</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 font-mono text-xs text-white/50">{r.id}</td>
              <td className="px-6 py-4 font-medium">{r.planName}</td>
              <td className="px-6 py-4 text-white/60">{r.startDate}</td>
              <td className="px-6 py-4 text-white/60">{r.endDate}</td>
              <td className="px-6 py-4">
                <Badge variant={r.status === "Active" ? "active" : "expired"}>{r.status}</Badge>
              </td>
              <td className="px-6 py-4 text-right font-bold">${r.paid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
