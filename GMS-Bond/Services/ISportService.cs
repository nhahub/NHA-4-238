using GMS_Bond.DTOs;
namespace GMS_Bond.Services
{
    public interface ISportService
    {
        Task<ApiResponse<List<SportDto>>> GetSportsList();
        Task<ApiResponse<SportDto?>> AddSport(AddSportDto dto);
        Task<ApiResponse<SportDto?>> UpdateSport(int sportId , UpdateSportDto dto);
        Task<ApiResponse<SportDto?>> DeleteSport(int sportId);
        Task<ApiResponse<SportDto?>> GetSport(int sportId);
    }
}
