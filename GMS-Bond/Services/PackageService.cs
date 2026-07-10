using GMS_Bond.DTOs;
using GMS_Bond.Repository;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Contracts;

namespace GMS_Bond.Services
{
    public class PackageService : IPackageService
    {
        private readonly IPackageRepository _packageRepository;
        private readonly IPlanRepository _planRepository;
        public PackageService(IPackageRepository packageRepository ,IPlanRepository planRepository)
 
        {
            _packageRepository = packageRepository;
            _planRepository = planRepository;
        }
        public async Task<ApiResponse<List<PackageDto>>> GetPackages()
        {
            List<PackageDto> packages = _packageRepository.GetAll()
                .Select(o => new PackageDto
                {
                    Id = o.Id,
                    Title = o.Title,
                    Description = o.Description,
                    Price = o.Price,
                    NumberOfMonthes = o.NumberOfMonthes,
                    NumberOfSessions = o.NumberOfSessions,
                    PlanId = o.PlanId,
                    PlanTitle = o.Plan == null ? null : o.Plan.Title,
                    Sport = o.Plan == null ? null : o.Plan.Sport.Name
                })
                .ToList();

            return ApiResponse<List<PackageDto>>.Ok(packages);
        }

        public async Task<ApiResponse<List<PackageDto>>> GetPackagesByPlan(int planId)
        {
            List<PackageDto> packages = _packageRepository.GetAll().
                Where(o => o.PlanId == planId).
                Select(o => new PackageDto
                {
                    Id = o.Id,
                    Title = o.Title,
                    Description = o.Description,
                    Price = o.Price,
                    NumberOfMonthes = o.NumberOfMonthes,
                    NumberOfSessions = o.NumberOfSessions,
                    PlanId = o.PlanId,
                    PlanTitle = o.Plan == null ? null : o.Plan.Title,
                    Sport = o.Plan == null ? null : o.Plan.Sport.Name,
                })
                .ToList();
            return ApiResponse<List<PackageDto>>.Ok(packages);
        }
        public async Task<ApiResponse<PackageDto>> AddPackage(AddUpdatePackageDto dto)
        {
           
            var plan = await _planRepository.GetByIdAsync((int)dto.PlanId);
            if (plan == null)
            {
                return ApiResponse<PackageDto>.NotFound("Plan not found");
            }
            Package package = new Package()
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                NumberOfMonthes = dto.NumberOfMonthes,
                NumberOfSessions = dto.NumberOfSessions,
                PlanId = dto.PlanId
            };

            bool result = await _packageRepository.AddAsync(package);
            
            if(result) {
                await _packageRepository.SaveAsync();
                var data = new PackageDto
                {
                    Id = package.Id,
                    Title = package.Title,
                    Description = package.Description,
                    Price = package.Price,
                    NumberOfMonthes = package.NumberOfMonthes,
                    NumberOfSessions = package.NumberOfSessions,
                    PlanId = package.PlanId,
                    PlanTitle = plan.Title,
                };
                return ApiResponse<PackageDto>.Created(data , "Package added successfully");
            }
            return ApiResponse<PackageDto>.Fail("Error adding Package");
        }

        public async Task<ApiResponse<PackageDto>> DeletePackage(int packageId)
        {
            bool result = await _packageRepository.DeleteAsync(packageId);
            if (result)
            {
                await _packageRepository.SaveAsync();
                return ApiResponse<PackageDto>.Ok(null , "Package deleted successfully");
            }
            return ApiResponse<PackageDto>.Fail("Error deleting Package");

        }

        public async Task<ApiResponse<PackageDto>> UpdatePackage(int packageId , AddUpdatePackageDto dto)
        {
            var package = await _packageRepository.GetByIdAsync(packageId);
            if(package == null)
            {
                return ApiResponse<PackageDto>.NotFound("Package not found");
            }

            var plan = await _planRepository.GetByIdAsync((int)dto.PlanId);
            if (plan == null)
            {
                return ApiResponse<PackageDto>.NotFound("Plan not found");
            }

            package.Title = dto.Title;
            package.Description = dto.Description;
            package.Price = dto.Price;
            package.NumberOfMonthes = dto.NumberOfMonthes;
            package.NumberOfSessions = dto.NumberOfSessions;
            package.PlanId = dto.PlanId;

            bool result = await _packageRepository.UpdateAsync(package);

            if (result)
            {
                await _packageRepository.SaveAsync();
                var data = new PackageDto
                {
                    Id = package.Id,
                    Title = package.Title,
                    Description = package.Description,
                    Price = package.Price,
                    NumberOfMonthes = package.NumberOfMonthes,
                    NumberOfSessions = package.NumberOfSessions,
                    PlanId = package.PlanId,
                    PlanTitle = plan.Title,
                };
                return ApiResponse<PackageDto>.Created(data, "Package updated successfully");
            }
            return ApiResponse<PackageDto>.Fail("Error updating Package");

        }

        public async Task<ApiResponse<PackageDto>> GetPackage(int packageId) 
        {
            var package= await _packageRepository.GetByIdAsync(packageId);
            if(package == null)
                return ApiResponse<PackageDto>.NotFound("Package not found");
            var plan = await _planRepository.GetByIdAsync(package.PlanId);

            var data = new PackageDto
            {
                Id = package.Id,
                Title = package.Title,
                Description = package.Description,
                NumberOfMonthes = package.NumberOfMonthes,
                NumberOfSessions = package.NumberOfSessions,
                Price = package.Price,
                PlanId = plan!.Id,
                PlanTitle = plan!.Title
            };

            return ApiResponse<PackageDto>.Ok(data);

    
        }


    }
}

