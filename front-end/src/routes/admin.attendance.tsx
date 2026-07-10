import { createFileRoute } from "@tanstack/react-router";
import { Badge, DataCard, StatCard } from "@/components/ui-bits";
import { CheckCircle2, Clock, Users, XCircle, User } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type TodaySessionDto } from "@/types/domain/session";
import { sessionApi } from "@/lib/api/endpoints/session";

export const Route = createFileRoute("/admin/attendance")({
  component: Page,
});

function Page() {
  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const sessionsQuery = useQuery({
    queryKey: ["today-sessions"],
    queryFn: sessionApi.getToday,
  });

  const sessions: TodaySessionDto[] = sessionsQuery.data ?? [];

  // Default to first session once loaded
  const activeSession =
    sessions.find((s) => s.sessionId === activeSessionId) ?? sessions[0] ?? null;

  // Track who has been checked in this browser session
  // key: `${sessionId}-${memberId}` → true
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set());

  const markAttendance = useMutation({
    mutationFn: sessionApi.markAttendance,
    onSuccess: (_, variables) => {
      setCheckedIn((prev) => {
        const next = new Set(prev);
        next.add(`${variables.sessionId}-${variables.memberId}`);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["today-sessions"] });
    },
  });

  const isCheckedIn = (sessionId: number, memberId: number) => {
    if (checkedIn.has(`${sessionId}-${memberId}`)) return true;
    const session = sessions.find((s) => s.sessionId === sessionId);
    return session?.members.find((m) => m.id === memberId)?.attended ?? false;
  };

  const totalMembers = sessions.reduce((a, s) => a + s.members.length, 0);
  const totalChecked = sessions.reduce(
    (total, s) =>
      total + s.members.filter((m) => m.attended || checkedIn.has(`${s.sessionId}-${m.id}`)).length,
    0,
  );
  const totalNoShows = Math.max(0, totalMembers - totalChecked);

  if (sessionsQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-white/40">
        Loading today's sessions...
      </div>
    );
  }

  if (sessionsQuery.isError) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
        {sessionsQuery.error.message}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <Clock className="h-10 w-10 text-white/20" />
        <p className="text-sm text-white/40">No sessions scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stats ── */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Today's Sessions" value={String(sessions.length)} icon={Clock} accent />
        <StatCard label="Total Members" value={String(totalMembers)} icon={Users} />
        <StatCard label="Checked In" value={String(totalChecked)} icon={CheckCircle2} />
        <StatCard label="Remaining" value={String(totalNoShows)} icon={XCircle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Session list ── */}
        <DataCard className="p-4 lg:col-span-1">
          <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
            Today's Sessions
          </div>
          <div className="space-y-1">
            {sessions.map((s) => {
              const sessionChecked = s.members.filter((m) => m.attended).length;
              const isActive = activeSession?.sessionId === s.sessionId;

              return (
                <button
                  key={s.sessionId}
                  onClick={() => setActiveSessionId(s.sessionId)}
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                    isActive ? "bg-volt-soft" : "hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`text-sm font-extrabold ${isActive ? "text-volt" : "text-white/70"}`}
                  >
                    {s.time}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{s.planName}</div>
                    <div className="truncate text-[11px] text-white/40">{s.trainerName}</div>
                  </div>
                  <Badge>
                    {sessionChecked}/{s.members.length}
                  </Badge>
                </button>
              );
            })}
          </div>
        </DataCard>

        {/* ── Roster ── */}
        <DataCard className="lg:col-span-2">
          {activeSession ? (
            <>
              <div className="flex items-center justify-between border-b border-white/5 p-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-volt">
                    Active Session
                  </div>
                  <h3 className="mt-1 text-lg font-bold">
                    {activeSession.planName} · {activeSession.time}
                  </h3>
                  <p className="text-xs text-white/50">{activeSession.trainerName}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-volt">
                    {
                      activeSession.members.filter((m) =>
                        isCheckedIn(activeSession.sessionId, m.id),
                      ).length
                    }
                    <span className="text-sm font-normal text-white/30">
                      /{activeSession.members.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40">checked in</div>
                </div>
              </div>

              {activeSession.members.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                  <Users className="h-8 w-8 text-white/20" />
                  <p className="text-sm text-white/40">No members subscribed to this session.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {activeSession.members.map((m) => {
                    const here = isCheckedIn(activeSession.sessionId, m.id);
                    const pending =
                      markAttendance.isPending &&
                      markAttendance.variables?.memberId === m.id &&
                      markAttendance.variables?.sessionId === activeSession.sessionId;

                    return (
                      <div key={m.id} className="flex items-center gap-3 p-4">
                        {/* Avatar */}
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-xs font-bold text-white/70">
                          <User className="h-4 w-4" />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{m.name}</div>
                          <div className="truncate text-[11px] text-white/40">{m.phoneNumber}</div>
                        </div>

                        {/* Check-in button */}
                        <button
                          disabled={here || pending}
                          onClick={() =>
                            markAttendance.mutate({
                              sessionId: activeSession.sessionId,
                              memberId: m.id,
                            })
                          }
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                            here
                              ? "bg-volt text-carbon cursor-default"
                              : pending
                                ? "border border-white/10 text-white/30 cursor-wait"
                                : "border border-white/10 text-white/60 hover:border-volt/50 hover:text-volt"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {here ? "Checked In" : pending ? "Saving…" : "Mark Present"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : null}
        </DataCard>
      </div>
    </div>
  );
}
