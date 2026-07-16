using IronCore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IronCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        private readonly IMemberService _memberService;
        public MemberController(IMemberService memberService) 
        {
            _memberService = memberService;
        }

        [HttpGet("Calendar/{memberId:int}")]
        [Authorize]
        public async Task<IActionResult> MemberCalendar(int memberId, [FromQuery] int year , [FromQuery] int month)
        {
            var result = await _memberService.MemberMonthCalendar(memberId ,year , month);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("Dashboard/{memberId:int}")]
        [Authorize]
        public async Task<IActionResult> MemberDashboard(int memberId)
        {
            var result = await _memberService.MemberDashboard(memberId);
            return StatusCode(statusCode: result.StatusCode, result);
        }
    }

}
