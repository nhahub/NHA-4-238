using IronCore.DTOs;

namespace IronCore.Services
{
    public interface IPlanService
    {
         ApiResponse<List<PlanDto>> GetPlans();
         ApiResponse<List<PlanDto>> GetPlansBySport(int sportId);
         Task<ApiResponse<PlanDto?>> GetPlan(int planId);
         Task<ApiResponse<PlanDto?>> AddPlan(AddUpdatePlanDto dto);
         Task<ApiResponse<PlanDto?>> UpdatePlan(int PlanId, AddUpdatePlanDto dto);
         Task<ApiResponse<PlanDto?>> DeletePlan(int PlanId);
    }
}
