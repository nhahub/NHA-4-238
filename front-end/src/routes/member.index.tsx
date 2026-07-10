import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CreditCard, Flame, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, DataCard, StatCard, VoltButton } from "@/components/ui-bits";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { memberApi } from "@/lib/api/endpoints/member";

export const Route = createFileRoute("/member/")({
  component: MemberDashboard,
});

function MemberDashboard() {
  const { user } = useAuth();
  const memberId = user?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["member-dashboard", memberId],
    queryFn: () => memberApi.getDashboard(memberId!),
    enabled: !!memberId,
  });

  const upcomingSessions = data?.upcomingSessions ?? [];
  const recentSessions = data?.recentSessions ?? [];
  const monthlyActivity = data?.monthlyActivity ?? [];

  const activityTrend = (() => {
    if (monthlyActivity.length < 2) return null;
    const curr = monthlyActivity[monthlyActivity.length - 1].numberOfAttendedSessions;
    const prev = monthlyActivity[monthlyActivity.length - 2].numberOfAttendedSessions;
    if (prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 100);
  })();

  // streak: consecutive attended sessions counting back from most recent
  const sortedRecent = [...recentSessions].sort((a, b) => (a.date < b.date ? 1 : -1));
  let streak = 0;
  for (const s of sortedRecent) {
    if (s.attended) streak++;
    else break;
  }
  const last7 = sortedRecent.slice(0, 7).reverse();

  if (isLoading) {
    return <div className="text-white/60">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Member Since"
          value={`${data?.joinedBefore ?? 0} days`}
          trend="Since joining"
          icon={Calendar}
          accent
        />
        <StatCard
          label="Attendance"
          value={`${data?.monthAttendance ?? 0}`}
          trend="This month"
          icon={TrendingUp}
        />
        <StatCard
          label="Active Subscriptions"
          value={String(data?.activeSubscriptions ?? 0)}
          trend="Currently active"
          icon={Flame}
        />
        <StatCard
          label="Total Spend"
          value={`$${(data?.totalSpend ?? 0).toLocaleString()}`}
          trend="All time"
          icon={CreditCard}
        />
      </div>

      {/* Charts + Streak */}
      <div className="grid gap-6 lg:grid-cols-3">
        <DataCard className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Monthly Activity
              </div>
              <div className="text-xl font-bold">Sessions per month</div>
            </div>
            {activityTrend !== null && (
              <Badge variant={"active"}>
                {activityTrend >= 0 ? "+" : ""}
                {activityTrend}%
              </Badge>
            )}
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={monthlyActivity}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="numberOfAttendedSessions"
                  stroke="#CEFF05"
                  strokeWidth={2}
                  fill="url(#g1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DataCard>

        <DataCard className="p-6">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
            Current Streak
          </div>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-4xl font-black text-volt">{streak}</span>
            <span className="text-sm font-medium text-white/50">
              session{streak === 1 ? "" : "s"} in a row
            </span>
          </div>
          <div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">
            Last {last7.length || 0} sessions
          </div>
          <div className="flex gap-1.5">
            {last7.length > 0 ? (
              last7.map((s) => (
                <div
                  key={`${s.sessionId}-${s.date}`}
                  title={`${s.date} · ${s.attended ? "Attended" : "Missed"}`}
                  className={`h-8 flex-1 rounded-md ${s.attended ? "bg-volt" : "bg-red-500/50"}`}
                />
              ))
            ) : (
              <div className="text-sm text-white/40">No recent activity yet.</div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-white/40">
            <Flame className="h-3.5 w-3.5 text-volt" />
            Keep it going — consistency compounds.
          </div>
        </DataCard>
      </div>

      {/* Upcoming + Recent */}
      <div className="grid gap-6 lg:grid-cols-3">
        <DataCard className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-bold">Upcoming Sessions</div>
          </div>
          <div className="divide-y divide-white/5">
            {upcomingSessions.slice(0, 4).map((s) => (
              <div key={`${s.sessionId}-${s.date}`} className="flex items-center gap-4 py-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/5 text-center">
                  <div className="text-sm font-extrabold text-volt">{s.time}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{s.planName}</div>
                  <div className="truncate text-xs text-white/40">
                    {s.trainerName} - {s.date}
                  </div>
                </div>
                <Badge variant="active">Confirmed</Badge>
              </div>
            ))}
            {upcomingSessions.length === 0 && (
              <div className="py-3 text-sm text-white/40">No upcoming sessions.</div>
            )}
          </div>
        </DataCard>

        <DataCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-bold">Recent</div>
          </div>
          <div className="divide-y divide-white/5">
            {sortedRecent.slice(0, 4).map((s) => (
              <div key={`${s.sessionId}-${s.date}`} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.planName}</div>
                  <div className="truncate text-[11px] text-white/40">
                    {s.date} · {s.trainerName}
                  </div>
                </div>
                <Badge variant={s.attended ? "active" : "expired"}>
                  {s.attended ? "Attended" : "Missed"}
                </Badge>
              </div>
            ))}
            {recentSessions.length === 0 && (
              <div className="py-3 text-sm text-white/40">No recent sessions.</div>
            )}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
