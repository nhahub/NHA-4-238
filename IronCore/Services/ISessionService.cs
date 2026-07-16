using IronCore.DTOs;

namespace IronCore.Services
{
    public interface ISessionService
    {
        Task<ApiResponse<AttendSessionDto>> AttendSession(AttendSessionDto dto);
        Task<ApiResponse<List<TodaySessionDto>>> GetTodaySessions();
        Task<ApiResponse<int>> AddNextSessions(int days);
        Task<List<TodaySessionDto>> TodaySessions();


    }
}
