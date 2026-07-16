using IronCore.DTOs;
namespace IronCore.Services
{
    public interface IPackageService
    {
        Task<ApiResponse<List<PackageDto>>> GetPackages();
        Task<ApiResponse<List<PackageDto>>> GetPackagesByPlan(int planId);
        Task<ApiResponse<PackageDto>> AddPackage(AddUpdatePackageDto dto);
        Task<ApiResponse<PackageDto>> DeletePackage(int packageId);
        Task<ApiResponse<PackageDto>> UpdatePackage(int packageId , AddUpdatePackageDto dto);
        Task<ApiResponse<PackageDto>> GetPackage(int packageId);
        
    }
}
