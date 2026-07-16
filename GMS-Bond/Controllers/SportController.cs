using GMS_Bond.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GMS_Bond.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace GMS_Bond.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SportController : ControllerBase
    {
        private readonly ISportService _sportService;
        public SportController(ISportService sportService)
        {
            _sportService = sportService;
        }

        [HttpGet("/api/Sports")]
        public async Task<IActionResult> Sports()
        {
            var result = await _sportService.GetSportsList();
            result.Data?.ForEach(s => s.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{s.ImageUrl}");
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpGet("{sportId:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetSport(int sportId)
        {
            var result = await _sportService.GetSport(sportId);
            if(result.Data != null) 
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPut("{sportId:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateSport(int sportId , UpdateSportDto dto)
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
            var result = await _sportService.UpdateSport(sportId, dto);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> AddSport(AddSportDto dto)
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
            var result = await _sportService.AddSport( dto);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpDelete("{sportId:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeleteSport(int sportId)
        {
            var result = await _sportService.DeleteSport(sportId);
            return StatusCode(statusCode: result.StatusCode, result);
        }
    }
}
