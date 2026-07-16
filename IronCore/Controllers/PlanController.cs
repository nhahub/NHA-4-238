using IronCore.DTOs;
using IronCore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IronCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanController : ControllerBase
    {
        private readonly IPlanService _planService;
        public PlanController(IPlanService planService)
        {
            _planService = planService;
        }

        [HttpGet("/api/Plans")]
        public IActionResult GetPlans()
        {
            var result = _planService.GetPlans();
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("{planId:int}")]
        [Authorize]
        public async Task<IActionResult> GetPlan(int planId)
        {
            var result = await _planService.GetPlan(planId);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPost]
        [Authorize(Roles ="Admin,Staff")]
        public async Task<IActionResult> AddPlan(AddUpdatePlanDto dto)
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
            var result = await _planService.AddPlan(dto);
            return StatusCode(statusCode: result.StatusCode, result);
            

        }

        [HttpPut("{planId:int}")]
        [Authorize(Roles ="Admin,Staff")]
        public async Task<IActionResult> UpdatePlan(int planId, AddUpdatePlanDto dto)
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
            var result = await _planService.UpdatePlan(planId, dto);
            return StatusCode(statusCode: result.StatusCode, result);

        }
        

        [HttpDelete("{planId:int}")]
        [Authorize(Roles ="Admin,Staff")]
        public async Task<IActionResult> DeletePlan(int planId)
        {
            var result = await _planService.DeletePlan(planId);
            return StatusCode(statusCode: result.StatusCode, result);

        }
    }
}
