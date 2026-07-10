import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, DataCard, StatCard } from "@/components/ui-bits";
import { adminApi } from "@/lib/api/endpoints/admin";
import { sessionApi } from "@/lib/api/endpoints/session";
import { formatDisplayDate } from "@/lib/date-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { VoltButton } from "@/components/ui-bits";
import {
  Activity,
  CalendarCheck,
  CreditCard,
  DollarSign,
  Dumbbell,
  Tag,
  TrendingUp,
  Users,
  CalendarPlus,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRequireRole } from "@/hooks/use-require-role";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

// ---- Types mirroring the backend DTOs (System.Text.Json default = camelCase) ----
// TODO: move these into src/lib/types.ts alongside your other entity types

const COLORS = ["#CEFF05", "#9ACE00", "#6B8C00", "#3E5100", "#1F2900"];

function statusVariant(status: string): "active" | "expiring" | "expired" {
  const s = status.toLowerCase();
  if (s === "active") return "active";
  if (s === "expiring") return "expiring";
  return "expired";
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function AdminDashboard() {
  const allowed = useRequireRole(["Admin"]);
  const queryClient = useQueryClient();
  const [generateMessage, setGenerateMessage] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.getDashboard(),
    enabled: allowed,
  });

  const generateSessions = useMutation({
    mutationFn: () => sessionApi.generate(60),
    onSuccess: async (count) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setGenerateMessage(`Generated ${count} session${count === 1 ? "" : "s"}.`);
    },
    onError: (e) => setGenerateMessage(e.message),
  });

  if (!allowed) return null;
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <DataCard key={i} className="h-24 animate-pulse p-6">
            <div className="h-full w-full" />
          </DataCard>
        ))}
      </div>
    );
  }

  const revenueData = data.monthlyRevenues.map((m) => ({
    month: m.month,
    revenue: m.revenue,
  }));

  const sportData = data.sportSubscribers.slice(0, 5).map((s) => ({
    name: s.sport,
    members: s.activeSubscriptions,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Members"
          value={data.totalMembers.toLocaleString()}
          icon={Users}
          accent
        />
        <StatCard
          label="Active Subscriptions"
          value={data.activeSubscriptions.toLocaleString()}
          icon={CreditCard}
        />
        <StatCard
          label="Revenue (MTD)"
          value={formatCurrency(data.totalRevenue)}
          icon={DollarSign}
        />
        <StatCard
          label="This Month Subscriptions"
          value={`+ ${data.currentMonthSubscriptions}`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DataCard className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Revenue
              </div>
              <div className="text-xl font-bold">Monthly trend</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CEFF05" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#CEFF05" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#CEFF05"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DataCard>

        <DataCard className="p-6">
          <div className="mb-4 text-xl font-bold">Sport Distribution</div>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sportData}
                  dataKey="members"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {sportData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 space-y-2">
            {sportData.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="flex-1 text-white/70">{s.name}</span>
                <span className="font-bold">{s.members}</span>
              </li>
            ))}
          </ul>
        </DataCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DataCard className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-bold">Today's Sessions</div>
          </div>
          <div className="divide-y divide-white/5">
            {data.todaySessionsList.map((s) => {
              const total = s.members.length;
              const attended = s.members.filter((m) => m.attended).length;
              return (
                <div key={s.sessionId} className="flex items-center gap-4 py-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/5 text-center">
                    <div className="text-sm font-extrabold text-volt">{s.time}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{s.planName}</div>
                    <div className="truncate text-xs text-white/40">{s.trainerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">
                      {attended}/{total}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">
                      attended
                    </div>
                  </div>
                </div>
              );
            })}
            {data.todaySessionsList.length === 0 && (
              <div className="py-6 text-center text-sm text-white/40">
                No sessions scheduled today.
              </div>
            )}
          </div>
        </DataCard>
        <DataCard className="flex flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-volt-soft">
            <CalendarPlus className="h-7 w-7 text-volt" />
          </div>
          <div>
            <div className="text-lg font-bold">Session Generator</div>
            <p className="mt-1 text-sm text-white/50">
              Automatically schedule the next 60 days of sessions from your active plans.
            </p>
          </div>
          <VoltButton
            className="w-full"
            onClick={() => {
              setGenerateMessage(null);
              generateSessions.mutate();
            }}
            disabled={generateSessions.isPending}
          >
            {generateSessions.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate Next 60 Days
              </>
            )}
          </VoltButton>
          {generateMessage && <p className="text-xs text-white/50">{generateMessage}</p>}
        </DataCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Plans" value={data.totalPlans.toString()} icon={Dumbbell} />
        <StatCard label="Packages" value={data.totalPackages.toString()} icon={Tag} />
        <StatCard
          label="Today Sessions"
          value={data.todaySessions.toString()}
          icon={CalendarCheck}
        />
        <StatCard label="Trainers" value={data.totalTrainers.toString()} icon={Activity} />
      </div>

      <DataCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xl font-bold">Recent Subscriptions</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40">
                <th className="py-3 pr-4 font-bold">Member</th>
                <th className="py-3 pr-4 font-bold">Plan</th>
                <th className="py-3 pr-4 font-bold">Status</th>
                <th className="py-3 pr-4 font-bold">Paid</th>
                <th className="py-3 pr-4 font-bold">Start</th>
                <th className="py-3 pr-4 font-bold">End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.lastSubscriptions.slice(0, 5).map((s) => (
                <tr key={s.id}>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{s.memberName ?? "—"}</div>
                    <div className="text-[11px] text-white/40">{s.email ?? "—"}</div>
                  </td>
                  <td className="py-3 pr-4 text-white/70">{s.planName}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusVariant(s.status)}>{s.status}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-white/60">{formatCurrency(s.paid)}</td>
                  <td className="py-3 pr-4 text-white/60">{formatDisplayDate(s.startDate)}</td>
                  <td className="py-3 pr-4 text-white/60">{formatDisplayDate(s.endDate)}</td>
                </tr>
              ))}
              {data.lastSubscriptions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-white/40">
                    No subscriptions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
}
