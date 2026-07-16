using GMS_Bond.DTOs;
using GMS_Bond.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GMS_Bond.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;
        public SubscriptionController(ISubscriptionService subscriptionService)
        {
           _subscriptionService = subscriptionService;
        }

        [HttpGet("/api/Subscriptions")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetSubscriptions()
        {
            var result = _subscriptionService.GetSubscriptions();
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> CreateSubscription(CreateSubscriptionDto  dto)
        {
            var result = await _subscriptionService.CreateSubscription(dto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("Member/{memberid:int}")]
        [Authorize]
        public async Task<IActionResult> MemberSubscriptions(int memberId)
        {
            var result = await _subscriptionService.MemberSubscriptions(memberId);
            return StatusCode(statusCode: result.StatusCode, result);
        }
    }
}
