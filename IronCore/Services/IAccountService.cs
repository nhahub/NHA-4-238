using IronCore.DTOs;
using Microsoft.AspNetCore.Identity;

namespace IronCore.Services
{
    public interface IAccountService
    {
        Task<ApiResponse<LoginResponseDto?>> RegisterStaff(RegisterStaffDto dto );
        Task<ApiResponse<LoginResponseDto?>> RegisterMember(RegisterMemberDto dto);
        Task<ApiResponse<LoginResponseDto>> DeleteAccount(int userId);
        Task<ApiResponse<LoginResponseDto?>> Login(LoginRequestDto request);
        Task<ApiResponse<MemberDto?>> UpdateMember(int memberId, UpdateMemberDto dto);
        Task<ApiResponse<MemberDto?>> ChangePassword(int userId, UpdatePasswordDto dto);
        ApiResponse<List<MemberDto>> GetMembers();
        Task<ApiResponse<MemberDto>> GetMember(int memberId);
        Task<ApiResponse<List<UserDto>>> GetStaff();
        Task<ApiResponse<UserDto?>> GetUser(int staffId);
        Task<ApiResponse<UserDto?>> UpdateUser(int userId, UpdateUserDto dto);
        Task<ApiResponse<string?>> UpdateImage(int userId, IFormFile image);
        Task<ApiResponse<bool>> DeleteImage(int userId);
    }
}
