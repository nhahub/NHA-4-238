import type { SubscriptionDto } from "./subscription";
import type { TodaySessionDto } from "./session";

export type MonthlyRevenue = {
  revenue: number;
  month: string;
};

export type SportSubscribersDto = {
  sport: string;
  activeSubscriptions: number;
};

export type AdminDashboardDto = {
  todaySessionsList: TodaySessionDto[];
  monthlyRevenues: MonthlyRevenue[];
  sportSubscribers: SportSubscribersDto[];
  lastSubscriptions: SubscriptionDto[];
  totalRevenue: number;
  totalMembers: number;
  activeSubscriptions: number;
  currentMonthSubscriptions: number;
  totalPlans: number;
  totalPackages: number;
  totalTrainers: number;
  todaySessions: number;
};