using GMS_Bond.DTOs;

namespace GMS_Bond.Services
{
    public interface IAdminService
    {
        Task<ApiResponse<AdminDashboard>> AdminDashboard();
    }
}
