using IronCore.DTOs;
using IronCore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IronCore.Controllers
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

        [HttpPost("Attendance")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> AttendSession(AttendSessionDto dto)
        {
            var result = await _sessionService.AttendSession(dto);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("Today")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> TodaySessions()
        {
            var result = await _sessionService.GetTodaySessions();
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPost("Generate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GenerateNextSessions()
        {
            var result = await _sessionService.AddNextSessions(60);
            return StatusCode(statusCode: result.StatusCode,result);
        }

        

    }
}
