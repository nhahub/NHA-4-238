namespace IronCore.DTOs
{
    public class TodaySessionDto
    {
        public int PlanId { get; set; }
        public required int SessionId {  get; set; }
        public required string TrainerName { get; set; }
        public required string PlanName { get; set; }
        public required string Time { get; set; }
        public List<MemberAttendanceDto> Members { get; set; }
            = new List<MemberAttendanceDto>();
    }
}
