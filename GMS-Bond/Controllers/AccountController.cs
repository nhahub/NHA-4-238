using GMS_Bond.DTOs;
using GMS_Bond.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;


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
       // [Authorize(Roles = "Admin")]
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


        [HttpDelete("Staff/{userId:int}")]
       // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStaff(int userId)
        {
            var result = await _accountService.DeleteAccount(userId);
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpDelete("Member/{userId:int}")]
       // [Authorize(Roles = "Admin,Member")]
        public async Task<IActionResult> DeleteMember(int userId)
        {
            var result = await _accountService.DeleteAccount(userId);
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpPut("Member/{memberId:int}")]
        public async Task<IActionResult> UpdateMember(int memberId, UpdateMemberDto dto)
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

            var result = await _accountService.UpdateMember(memberId, dto);
            return StatusCode(statusCode: result.StatusCode, result);
        }
        
        [HttpPut("{userId:int}/Password")]
        public async Task<IActionResult> ChangePassword(int userId, UpdatePasswordDto dto)
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

            var result = await _accountService.ChangePassword(userId, dto);
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpGet("Members")]
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
        public async Task<IActionResult> GetMember(int memberId)
        {
            var result = await _accountService.GetMember(memberId);
            if (result.Data != null && result.Data.ImageUrl != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";
            return StatusCode(statusCode: result.StatusCode, result);

        }

        [HttpGet("Staffs")]
        public async Task<IActionResult> GetStaffs()
        {
            var result = await _accountService.GetStaffs();
            result.Data!.ForEach(e =>
            {
                if (e.ImageUrl != null)
                    e.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{e.ImageUrl}";
            });
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpGet("Staff")]
        public async Task<IActionResult> GetStaff(int staffId)
        {
            var result = await _accountService.GetStaff(staffId);
            if(result.Data != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";
            return StatusCode(statusCode: result.StatusCode, result);
        }
        [HttpPut("Staff/{staffId:int}")]
        public async Task<IActionResult> UpdateStaff(int staffId , UpdateStaffDto dto)
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

            var result = await _accountService.UpdateStaff(staffId, dto);
            if (result.Data != null && result.Data.ImageUrl != null)
                result.Data.ImageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data.ImageUrl}";
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpPut("{userId:int}/Image")]
        public async Task<IActionResult> UpdateImage(int userId , IFormFile image)
        {
            var result = await _accountService.UpdateImage(userId, image);
            if (result.Data != null)
                result.Data = $"{Request.Scheme}://{Request.Host}/uploads/{result.Data}";
            return StatusCode(statusCode: result.StatusCode, result);
        }

        [HttpDelete("{userId:int}/Image")]
        public async Task<IActionResult> DeleteImage(int userId)
        {
            var result = await _accountService.DeleteImage(userId);
            return StatusCode(statusCode: result.StatusCode, result);
        }
    }

}
