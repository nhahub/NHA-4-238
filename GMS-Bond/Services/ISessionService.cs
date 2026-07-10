using GMS_Bond.DTOs;

namespace GMS_Bond.Services
{
    public interface ISessionService
    {
        Task<ApiResponse<AttendSessionDto>> AttendSession(AttendSessionDto dto);
        Task<ApiResponse<List<TodaySessionDto>>> GetTodaySessions();
        Task<ApiResponse<int>> AddNextSessions(int days);
        Task<List<TodaySessionDto>> TodaySessions();


    }
}
