namespace IronCore.DTOs
{
    public class MemberDashboard
    {
        public required int JoinedBefore {  get; set; }
        public required int ActiveSubscriptions { get; set; }
        public required int MonthAttendance { get; set; }
        public required decimal TotalSpend { get; set; }
        public List<MonthlyActivity> MonthlyActivity { get; set; }
         = new List<MonthlyActivity>();
        public List<MemberSessionsDto> UpcomingSessions { get; set; }
         = new List<MemberSessionsDto>();
        public List<MemberSessionsDto> RecentSessions { get; set; }
         = new List<MemberSessionsDto>();
    }
}
