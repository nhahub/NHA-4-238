using GMS_Bond.DTOs;
using GMS_Bond.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GMS_Bond.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly ISessionService _sessionService;
        public SessionController(ISessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpPost]
       // [Authorize(Roles ="Staff")]
        public async Task<IActionResult> AttendSession(AttendSessionDto dto)
        {
            var result = await _sessionService.AttendSession(dto);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("Today")]
        public async Task<IActionResult> TodaySessions()
        {
            var result = await _sessionService.GetTodaySessions();
            return StatusCode(statusCode: result.StatusCode, result);
        }

         [HttpPost("Generate")]
         public async Task<IActionResult> GenerateNextSessions()
        {
            var result = await _sessionService.AddNextSessions(60);
            return StatusCode(statusCode: result.StatusCode,result);
        }

        

    }
}
