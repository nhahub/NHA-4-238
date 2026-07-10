namespace GMS_Bond.DTOs
{
    public class SubscriptionDto
    {
        public required int Id { get; set; }
        public string? MemberName { get; set; }
        public string? Email {  get; set; }
        public required string PlanName { get; set; }
        public required string StartDate { get; set; }
        public required string EndDate { get; set; }
        public required string Status { get; set; }
        public required Decimal Paid { get; set; }
    }
}
