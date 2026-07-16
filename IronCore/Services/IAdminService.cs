using IronCore.DTOs;

namespace IronCore.Services
{
    public interface IAdminService
    {
        Task<ApiResponse<AdminDashboard>> AdminDashboard();
    }
}
