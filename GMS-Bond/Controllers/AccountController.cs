using GMS_Bond.DTOs;
using GMS_Bond.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;


namespace GMS_Bond.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly IAccountService _accountService;
        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequestDto request)
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

            var result = await _accountService.Login(request);

            if (result.Data != null && result.Data.ImageUrl != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";

            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPost("Staff")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterStaff(RegisterStaffDto dto)
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
            var result = await _accountService.RegisterStaff(dto);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPost("Member")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterMember(RegisterMemberDto dto)
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

            var result = await _accountService.RegisterMember(dto);
            if (result.Data != null && result.Data.ImageUrl != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";
            return StatusCode(statusCode: result.StatusCode, result);
        }


        [HttpDelete("{userId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAccount(int userId)
        {
            var result = await _accountService.DeleteAccount(userId);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPut("Member/{memberId:int}")]
        [Authorize(Roles = "Admin,Member")]

        public async Task<IActionResult> UpdateMember(int memberId, UpdateMemberDto dto)
        {
            var callerIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (callerIdClaim is null || !int.TryParse(callerIdClaim, out var callerId))
            {
                var unAuth = ApiResponse<bool>.Unauthorized();
                return StatusCode(statusCode: unAuth.StatusCode, unAuth);
            }
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && callerId != memberId)
            {
                var forbid = ApiResponse<bool>.Forbid("You are not allowed to update do this action");
                return StatusCode(statusCode: forbid.StatusCode, forbid);
            }
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

                var response = ApiResponse<UserAccount>.ValidationError(errors);
                return StatusCode(statusCode: response.StatusCode, response);
            }

            var result = await _accountService.UpdateMember(memberId, dto);
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPut("{userId:int}/Password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(int userId, UpdatePasswordDto dto)
        {
            var callerIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (callerIdClaim is null || !int.TryParse(callerIdClaim, out var callerId))
            {
                var unAuth = ApiResponse<bool>.Unauthorized();
                return StatusCode(statusCode: unAuth.StatusCode, unAuth);
            }
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && callerId != userId)
            {
                var forbid = ApiResponse<bool>.Forbid("You are not allowed to update do this action");
                return StatusCode(statusCode: forbid.StatusCode, forbid);
            }
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

                var response = ApiResponse<UserAccount>.ValidationError(errors);
                return StatusCode(statusCode: response.StatusCode, response);
            }

            var result = await _accountService.ChangePassword(userId, dto);
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpGet("Members")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetMembers()
        {
            var result = _accountService.GetMembers();
            result.Data!.ForEach(e =>
            {
                if (e.ImageUrl != null)
                    e.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{e.ImageUrl}";
            });

            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("Member/{memberId:int}")]
        [Authorize]
        public async Task<IActionResult> GetMember(int memberId)
        {
            var callerIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                               ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (callerIdClaim is null || !int.TryParse(callerIdClaim, out var callerId))
            {
                var unAuth = ApiResponse<bool>.Unauthorized();
                return StatusCode(statusCode: unAuth.StatusCode, unAuth);
            }
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && callerId != memberId)
            {
                var forbid = ApiResponse<bool>.Forbid("You are not allowed to do this action");
                return StatusCode(statusCode: forbid.StatusCode, forbid);
            }
            var result = await _accountService.GetMember(memberId);
            if (result.Data != null && result.Data.ImageUrl != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpGet("Staff")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStaff()
        {
            var result = await _accountService.GetStaff();
            result.Data!.ForEach(e =>
            {
                if (e.ImageUrl != null)
                    e.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{e.ImageUrl}";
            });
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("User/{userId:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetUser(int userId)
        {
            var result = await _accountService.GetUser(userId);
            if (result.Data != null && result.Data.ImageUrl != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPut("User/{userId:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateUser(int userId, UpdateUserDto dto)
        {
            var callerIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (callerIdClaim is null || !int.TryParse(callerIdClaim, out var callerId))
            {
                var unAuth = ApiResponse<bool>.Unauthorized();
                return StatusCode(statusCode: unAuth.StatusCode, unAuth);
            }
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && callerId != userId)
            {
                var forbid = ApiResponse<bool>.Forbid("You are not allowed to do this action");
                return StatusCode(statusCode: forbid.StatusCode, forbid);
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

                var response = ApiResponse<UserDto>.ValidationError(errors);
                return StatusCode(statusCode: response.StatusCode, response);
            }

            var result = await _accountService.UpdateUser(userId, dto);
            if (result.Data != null && result.Data.ImageUrl != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPut("{userId:int}/Image")]
        [Authorize]
        public async Task<IActionResult> UpdateImage(int userId, IFormFile image)
        {
            var callerIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (callerIdClaim is null || !int.TryParse(callerIdClaim, out var callerId))
            {
                var unAuth = ApiResponse<bool>.Unauthorized();
                return StatusCode(statusCode: unAuth.StatusCode, unAuth);
            }
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && callerId != userId)
            {
                var forbid = ApiResponse<bool>.Forbid("You are not allowed to do this action");
                return StatusCode(statusCode: forbid.StatusCode, forbid);
            }

            var result = await _accountService.UpdateImage(userId, image);
            if (result.Data != null)
                result.Data = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data}";
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpDelete("{userId:int}/Image")]
        [Authorize]
        public async Task<IActionResult> DeleteImage(int userId)
        {
            var callerIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (callerIdClaim is null || !int.TryParse(callerIdClaim, out var callerId))
            {
                var unAuth = ApiResponse<bool>.Unauthorized();
                return StatusCode(statusCode: unAuth.StatusCode, unAuth);
            }
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && callerId != userId)
            {
                var forbid = ApiResponse<bool>.Forbid("You are not allowed to do this action");
                return StatusCode(statusCode: forbid.StatusCode, forbid);
            }


            var result = await _accountService.DeleteImage(userId);
            return StatusCode(statusCode: result.StatusCode, result);
        }


    }

}
