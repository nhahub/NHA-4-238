using IronCore.DTOs;

namespace IronCore.Services
{
    public interface ITrainerService
    {
        Task<ApiResponse<TrainerDto?>> AddTrainer(AddTrainerDto dto);
        Task<ApiResponse<TrainerDto?>> UpdateTrainer(int trainerId, UpdateTrainerDto dto);
        Task<ApiResponse<TrainerDto?>> GetTrainer (int trainerId);
        Task<ApiResponse<TrainerDto?>> DeleteTrainer(int trainerId);
        Task<ApiResponse<List<TrainerDto>>> GetTrainersList();
    }
}
