namespace IronCore.DTOs
{
    public class AdminDashboard
    {
        public List<TodaySessionDto> TodaySessionsList { get; set; }
         = new List<TodaySessionDto>();
        public List<MonthlyRevenue> MonthlyRevenues { get; set; }
         = new List<MonthlyRevenue>();
        public List<SportSubscribersDto> SportSubscribers { get; set; }
         = new List<SportSubscribersDto>();

        public List<SubscriptionDto> LastSubscriptions { get; set; }
         = new List<SubscriptionDto> ();
        public required decimal TotalRevenue { get; set; }
        public required int TotalMembers { get; set; }
        public required int ActiveSubscriptions { get; set; }
        public required int CurrentMonthSubscriptions { get; set; }

        public required int TotalPlans { get; set; }
        public required int TotalPackages { get; set; }
        public required int TotalTrainers { get; set; }
        public int TodaySessions => TodaySessionsList.Count;


    }
}
