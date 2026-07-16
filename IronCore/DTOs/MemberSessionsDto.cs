namespace IronCore.DTOs
{
    public class MemberSessionsDto
    {
        public int PlanId { get; set; }
        public required int SessionId { get; set; }
        public required string TrainerName { get; set; }
        public required string PlanName { get; set; }
        public required string Date { get; set; }
        public required string Time { get; set; }
        public required bool Attended { get; set; }
    }
}
