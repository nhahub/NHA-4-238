import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge, DataCard, StatCard, VoltButton } from "@/components/ui-bits";
import {
  CalendarCheck,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Percent,
  TrendingUp,
} from "lucide-react";
import { memberApi } from "@/lib/api/endpoints/member";
import { useAuth } from "@/contexts/auth-context";

export const Route = createFileRoute("/member/attendance")({
  component: Page,
});

type DayState = "attended" | "missed" | "upcoming" | "empty";

function Page() {
  const { user } = useAuth();
  const memberId = user?.id;

  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 }); // month is 1-indexed to match backend

  const { data, isLoading } = useQuery({
    queryKey: ["member-calendar", memberId, cursor.year, cursor.month],
    queryFn: () => memberApi.getCalendar(memberId!, cursor.year, cursor.month),
    enabled: !!memberId,
  });

  const recentSessions = data?.recentSessions ?? [];
  const upcomingSessions = data?.upcomingSessions ?? [];

  const dayStateMap = new Map<string, DayState>();
  for (const s of recentSessions) {
    dayStateMap.set(s.date, s.attended ? "attended" : "missed");
  }
  for (const s of upcomingSessions) {
    if (!dayStateMap.has(s.date)) dayStateMap.set(s.date, "upcoming");
  }

  const monthLabel = new Date(cursor.year, cursor.month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(cursor.year, cursor.month, 0).getDate();
  const firstWeekday = new Date(cursor.year, cursor.month - 1, 1).getDay();

  const toDateKey = (day: number) => {
    const mm = String(cursor.month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${cursor.year}-${mm}-${dd}`;
  };

  const goPrevMonth = () => {
    setCursor((c) =>
      c.month === 1 ? { year: c.year - 1, month: 12 } : { year: c.year, month: c.month - 1 },
    );
  };
  const goNextMonth = () => {
    setCursor((c) =>
      c.month === 12 ? { year: c.year + 1, month: 1 } : { year: c.year, month: c.month + 1 },
    );
  };
  const goToday = () => setCursor({ year: now.getFullYear(), month: now.getMonth() + 1 });

  const isCurrentMonth = cursor.year === now.getFullYear() && cursor.month === now.getMonth() + 1;

  const attendedCount = recentSessions.filter((s) => s.attended).length;
  const missedCount = recentSessions.filter((s) => !s.attended).length;
  const totalPast = attendedCount + missedCount;
  const attendanceRate = totalPast > 0 ? Math.round((attendedCount / totalPast) * 100) : 0;

  const sortedRecent = [...recentSessions].sort((a, b) => (a.date < b.date ? 1 : -1));
  let streak = 0;
  for (const s of sortedRecent) {
    if (s.attended) streak++;
    else break;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          trend={monthLabel}
          icon={Percent}
          accent
        />
        <StatCard
          label="Sessions Attended"
          value={String(attendedCount)}
          trend={monthLabel}
          icon={CalendarCheck}
        />
        <StatCard label="Missed" value={String(missedCount)} trend={monthLabel} icon={CalendarX} />
        <StatCard
          label="Streak"
          value={`${streak} session${streak === 1 ? "" : "s"}`}
          trend="Current"
          icon={TrendingUp}
        />
      </div>

      <DataCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goPrevMonth}
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="w-40 text-center text-lg font-bold">{monthLabel}</h3>
            <button
              onClick={goNextMonth}
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            {!isCurrentMonth && (
              <VoltButton variant="ghost" onClick={goToday}>
                Today
              </VoltButton>
            )}
          </div>
          <div className="flex gap-3 text-[10px] uppercase tracking-widest text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-volt" /> Attended
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-red-500/60" /> Missed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-white/20" /> Upcoming
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-white/[0.04]" /> No Session
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-white/40">Loading…</div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={i}
                className="text-center text-[10px] uppercase tracking-widest text-white/40"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const state = dayStateMap.get(toDateKey(day)) ?? "empty";
              return (
                <div
                  key={day}
                  className={`grid aspect-square place-items-center rounded-lg text-sm font-bold ${
                    state === "attended"
                      ? "bg-volt-soft text-volt"
                      : state === "missed"
                        ? "bg-red-500/10 text-red-400"
                        : state === "upcoming"
                          ? "bg-white/[0.06] text-white/50"
                          : "bg-transparent text-white/30"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        )}
      </DataCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <DataCard className="p-6">
          <h3 className="mb-4 text-lg font-bold">Recent Sessions</h3>
          <ul className="divide-y divide-white/5">
            {recentSessions.map((s) => (
              <li key={`${s.sessionId}-${s.date}`} className="flex items-center gap-4 py-3">
                <div className="text-xs font-bold text-volt">{s.date}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.planName}</div>
                  <div className="truncate text-[11px] text-white/40">{s.trainerName}</div>
                </div>
                <Badge variant={s.attended ? "active" : "expired"}>
                  {s.attended ? "Checked in" : "Missed"}
                </Badge>
              </li>
            ))}
            {recentSessions.length === 0 && (
              <li className="py-3 text-sm text-white/40">No recent sessions for {monthLabel}.</li>
            )}
          </ul>
        </DataCard>
        <DataCard className="p-6">
          <h3 className="mb-4 text-lg font-bold">Upcoming</h3>
          <ul className="divide-y divide-white/5">
            {upcomingSessions.map((s) => (
              <li key={`${s.sessionId}-${s.date}`} className="flex items-center gap-4 py-3">
                <div className="text-xs font-bold text-white/60">{s.date}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.planName}</div>
                  <div className="truncate text-[11px] text-white/40">{s.trainerName}</div>
                </div>
                <Badge>Booked</Badge>
              </li>
            ))}
            {upcomingSessions.length === 0 && (
              <li className="py-3 text-sm text-white/40">No upcoming sessions for {monthLabel}.</li>
            )}
          </ul>
        </DataCard>
      </div>
    </div>
  );
}
