using GMS_Bond.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GMS_Bond.Controllers
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
        public async Task<IActionResult> MemberCalendar(int memberId, int year , int month)
        {
            var result = await _memberService.MemberMonthCalendar(memberId ,year , month);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("Dashboard/{memberId:int}")]
        public async Task<IActionResult> MemberDashboard(int memberId)
        {
            var result = await _memberService.MemberDashboard(memberId);
            return StatusCode(statusCode: result.StatusCode, result);
        }
    }

}
