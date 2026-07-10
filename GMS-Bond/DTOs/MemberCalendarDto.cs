namespace GMS_Bond.DTOs
{
    public class MemberCalendarDto
    {
        public List<MemberSessionsDto> RecentSessions { get; set; }
        = new List<MemberSessionsDto>();

        public List<MemberSessionsDto> UpcomingSessions { get; set; }
        = new List<MemberSessionsDto>();
    }
}
