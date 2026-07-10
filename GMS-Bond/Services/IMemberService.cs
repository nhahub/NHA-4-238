using GMS_Bond.DTOs;

namespace GMS_Bond.Services
{
    public interface IMemberService
    {
        Task<ApiResponse<MemberDashboard>> MemberDashboard(int memberId);
        Task<ApiResponse<MemberCalendarDto?>> MemberMonthCalendar(int memberId , int year, int month);
    }
}
