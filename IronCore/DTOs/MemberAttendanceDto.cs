namespace IronCore.DTOs
{
    public class MemberAttendanceDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string PhoneNumber { get; set; }
        public required bool Attended { get; set; }
    }
}
