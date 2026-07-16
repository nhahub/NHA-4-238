using Azure.Core;
using GMS_Bond.DTOs;
using GMS_Bond.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GMS_Bond.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainerController : ControllerBase
    {
        private readonly ITrainerService _trainerService;
        public TrainerController(ITrainerService trainerService) {

            _trainerService = trainerService;
        }

        [HttpGet("/api/Trainers")]
        public async Task<IActionResult> Trainers()
        {
            var result = await _trainerService.GetTrainersList();
            result.Data?.ForEach(t => t.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{t.ImageUrl}");
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpGet("{trainerId:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetTrainer(int trainerId)
        {
            var result = await _trainerService.GetTrainer(trainerId);
            if (result.Data != null && result.Data.ImageUrl != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";

            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> AddTrainer([FromForm] AddTrainerDto dto)
        {
            if(!ModelState.IsValid)
            {
                var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

                var response = ApiResponse<UserAccount>.ValidationError(errors);
                return StatusCode(statusCode: response.StatusCode, response);
            }


            var result = await _trainerService.AddTrainer(dto);
            return StatusCode(statusCode:result.StatusCode, result);
            
        }

        [HttpPut("{trainerId:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateTrainer(int  trainerId , [FromForm] UpdateTrainerDto dto)
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

            var result = await _trainerService.UpdateTrainer(trainerId ,  dto);
            return StatusCode(statusCode: result.StatusCode, result);
        }
       
        
        [HttpDelete("{trainerId:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeleteTrainer(int trainerId) 
        {
           var result = await _trainerService.DeleteTrainer(trainerId);
            return StatusCode(statusCode: result.StatusCode, result);

        }

        
    }
}
