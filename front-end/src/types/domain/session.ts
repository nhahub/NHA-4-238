export type MemberAttendanceDto = {
  id: number;
  name: string;
  phoneNumber: string;
  attended: boolean;
};

export type TodaySessionDto = {
  planId: number;
  sessionId: number;
  trainerName: string;
  planName: string;
  time: string;
  members: MemberAttendanceDto[];
};

export type MemberSessionsDto = {
  planId: number;
  sessionId: number;
  trainerName: string;
  planName: string;
  date: string;
  time: string;
  attended: boolean;
};

export type MemberCalendar = {
  recentSessions: MemberSessionsDto[];
  upcomingSessions: MemberSessionsDto[];
};