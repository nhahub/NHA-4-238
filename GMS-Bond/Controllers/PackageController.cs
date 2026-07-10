using GMS_Bond.DTOs;
using GMS_Bond.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GMS_Bond.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackageController : ControllerBase
    {
        private readonly IPackageService _packageService;

        public PackageController(IPackageService packageService)
            => _packageService = packageService;


        [HttpGet("Packages")]
        //[Authorize(Roles ="Member")]
        public async Task<IActionResult> GetPackages()
        {
            var result = await _packageService.GetPackages();
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("Packages/{planId:int}")]
        //[Authorize(Roles ="Member")]
        public async Task<IActionResult> GetPackageByPlan(int planId)
        {
            var result = await _packageService.GetPackagesByPlan(planId);
            return StatusCode(statusCode: result.StatusCode , result);
        }

        [HttpGet("{packageId:int}")]
        //[Authorize(Roles = "Member")]
        public async Task<IActionResult> GetPackage(int packageId)
        {
            var result = await _packageService.GetPackage(packageId);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPost]
        //[Authorize(Roles ="Admin,Staff")]
        public async Task<IActionResult> AddPackage(AddUpdatePackageDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

                var response = ApiResponse<UserAccount>.ValidationError(errors);
                return StatusCode(statusCode: response.StatusCode, response);
            }

            var result = await _packageService.AddPackage(dto);
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpDelete("{packageId:int}")]
        //[Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeletePackage(int packageId)
        {

            var result = await _packageService.DeletePackage(packageId);
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpPut("{packageId:int}")]
        //[Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdatePackage(int packageId , AddUpdatePackageDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

                var response = ApiResponse<UserAccount>.ValidationError(errors);
                return StatusCode(statusCode: response.StatusCode, response);
            }

            var result = await _packageService.UpdatePackage(packageId , dto);
            return StatusCode(statusCode: result.StatusCode, result);

        }

        
    }
}
