import type { MemberSessionsDto } from "./session";

export type MonthlyActivity = {
  month: string;
  numberOfAttendedSessions: number;
};

export type MemberDashboard = {
  joinedBefore: number;
  activeSubscriptions: number;
  monthAttendance: number;
  totalSpend: number;
  recentSessions: MemberSessionsDto[];
  upcomingSessions: MemberSessionsDto[];
  monthlyActivity: MonthlyActivity[];
};