namespace GMS_Bond.DTOs
{
    public class MemberSubscriptionBoard
    {
        public required decimal TotalSpend { get; set; }
        public List<SubscriptionDto> Subscriptions { get; set; }
        = new List<SubscriptionDto>();
    }
}
