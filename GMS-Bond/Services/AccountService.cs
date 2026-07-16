using Azure.Core;
using GMS_Bond.DTOs;
using GMS_Bond.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System.Data;

namespace GMS_Bond.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly IMemberRepository _memberRepository;
        private readonly IJwtService _jwtService;
        private readonly IImageService _imageService;

        public AccountService(UserManager<UserAccount> userManager, IMemberRepository memberRepository,
            IJwtService jwtService, IImageService imageService)
        {
            _userManager = userManager;
            _memberRepository = memberRepository;
            _jwtService = jwtService;
            _imageService = imageService;
        }

        string[] allowedImageExtensions = [".jpg", ".jpeg", ".png"];

        public async Task<ApiResponse<LoginResponseDto?>> RegisterStaff(RegisterStaffDto dto)
        {

            string? createdImageName = null;
            if (dto.Image != null)
            {
                if (dto.Image?.Length > 5 * 1024 * 1024)
                    return ApiResponse<LoginResponseDto?>.ValidationError(message: "File size should not exceed 1 MB");

                try
                {
                    createdImageName = await _imageService.SaveFileAsync(dto.Image!, allowedImageExtensions);
                }
                catch (Exception ex)
                {
                    return ApiResponse<LoginResponseDto?>.Fail(ex.Message);
                }
            }


            var user = new UserAccount()
            {
                UserName = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                BirthDate = dto.BirthDate,
                Email = dto.Email,
                CreatedAt = DateTime.Now,
                PhoneNumber = dto.PhoneNumber,
                ImagePath = createdImageName
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return ApiResponse<LoginResponseDto?>.Fail("Error creating an account", result.Errors.Select(e => e.Description).ToList());

            await _userManager.AddToRoleAsync(user, Roles.Staff);

            var response = new LoginResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FirstName + " " + user.LastName,
                Role = Roles.Staff,
            };


            return ApiResponse<LoginResponseDto?>.Created(response, "Account created successfully");

        }

        public async Task<ApiResponse<LoginResponseDto?>> RegisterMember(RegisterMemberDto dto)
        {

            string? createdImageName = null;
            if (dto.Image != null)
            {
                if (dto.Image?.Length > 1 * 1024 * 1024)
                    return ApiResponse<LoginResponseDto?>.ValidationError(message: "File size should not exceed 1 MB");

                try
                {
                    createdImageName = await _imageService.SaveFileAsync(dto.Image!, allowedImageExtensions);
                }
                catch (Exception ex)
                {
                    return ApiResponse<LoginResponseDto?>.Fail(ex.Message);
                }
            }

            var user = new UserAccount()
            {
                Email = dto.Email,
                UserName = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                BirthDate = dto.BirthDate,
                CreatedAt = DateTime.Now,
                PhoneNumber = dto.PhoneNumber,
                ImagePath = createdImageName
            };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return ApiResponse<LoginResponseDto?>.Fail("Error creating an account", result.Errors.Select(e => e.Description).ToList());

            await _userManager.AddToRoleAsync(user, Roles.Member);

            var response = new LoginResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FirstName + " " + user.LastName,
                Role = Roles.Member,
                ImageUrl = user.ImagePath
            };

            Member member = new Member();
            member.MemberId = user.Id;
            await _memberRepository.AddAsync(member);
            await _memberRepository.SaveAsync();

            var tokenDto = await _jwtService.GenerateToken(user);
            response.AccessToken = tokenDto?.AccessToken;
            response.ExpiresIn = tokenDto?.ExpiresIn;

            return ApiResponse<LoginResponseDto?>.Created(response, "Account created and logged in successfully");


        }

        public async Task<ApiResponse<LoginResponseDto?>> Login(LoginRequestDto request)
        {
            if (request is null || request.UsernameOrEmail is null || request.Password is null)
                return ApiResponse<LoginResponseDto?>.ValidationError(message: "Invalid Data");

            UserAccount? user = await _userManager.FindByNameAsync(request.UsernameOrEmail);

            if (user is null)
            {
                user = await _userManager.FindByEmailAsync(request.UsernameOrEmail);
                if (user is null) return ApiResponse<LoginResponseDto?>.ValidationError(message: "Invalid username/email or passowrd");
            }

            bool validPassword = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!validPassword)
                return ApiResponse<LoginResponseDto?>.ValidationError(message: "Invalid username/email or passowrd");

            var userRoles = await _userManager.GetRolesAsync(user);
            var tokenDto = await _jwtService.GenerateToken(user);

            var response = new LoginResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName= user.FirstName + " " +user.LastName,
                ImageUrl = user.ImagePath,
                Role = userRoles.FirstOrDefault(),
                AccessToken = tokenDto?.AccessToken,
                ExpiresIn = tokenDto?.ExpiresIn,
            };
            return ApiResponse<LoginResponseDto?>.Created(response, "Logged in successfully");

        }
        
        public async Task<ApiResponse<LoginResponseDto>> DeleteAccount(int userId)
        {
            UserAccount? user = await _userManager.FindByIdAsync(userId.ToString());

            if (user is null)
            {
                return ApiResponse<LoginResponseDto>.NotFound("Account not found");
            }
            string? image = user.ImagePath;
            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
                return ApiResponse<LoginResponseDto>.Fail("Error deleting an account", result.Errors.Select(e => e.Description).ToList());

            if (image != null)
                _imageService.DeleteFile(image);

            return ApiResponse<LoginResponseDto>.Ok(null, "Account deleted successfully");

        }

        public async Task<ApiResponse<MemberDto?>> ChangePassword(int userId, UpdatePasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponse<MemberDto?>.NotFound("Account not found");

            var result = await _userManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);
            if (!result.Succeeded)
                return ApiResponse<MemberDto?>.
                     Fail("Error changing password", result.Errors.Select(e => e.Description).ToList());
            return ApiResponse<MemberDto?>.Ok(null);
        }

        public async Task<ApiResponse<bool>> DeleteImage(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponse<bool>.NotFound("User not found");

            if (user.ImagePath != null)
                _imageService.DeleteFile(user.ImagePath);
            user.ImagePath = null;
            await _userManager.UpdateAsync(user);
            return ApiResponse<bool>.Ok(true);
        }
        
        public async Task<ApiResponse<string?>> UpdateImage(int userId, IFormFile image)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponse<string?>.NotFound("User not found");

            string createdImageName;

            if (image.Length > 5 * 1024 * 1024)
                return ApiResponse<string?>.ValidationError(message: "File size should not exceed 5 MB");

            try
            {
                createdImageName = await _imageService.SaveFileAsync(image, allowedImageExtensions);
            }
            catch (Exception ex)
            {
                return ApiResponse<string?>.Fail(ex.Message);
            }

            if (user.ImagePath != null)
                _imageService.DeleteFile(user.ImagePath);
            user.ImagePath = createdImageName;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return ApiResponse<string?>
                    .Fail("Error updating image", result.Errors.Select(e => e.Description).ToList());

            return ApiResponse<string?>.Ok(createdImageName);

        }

        public async Task<ApiResponse<MemberDto?>> UpdateMember(int memberId, UpdateMemberDto dto)
        {
            var member = await _memberRepository.GetByIdAsync(memberId);
            if (member == null)
               return ApiResponse<MemberDto?>.NotFound("Member not found");
            var account = await _userManager.FindByIdAsync(memberId.ToString());
            
            account!.FirstName = dto.FirstName;
            account!.LastName = dto.LastName;
            account!.Email = dto.Email;
            account!.UserName = dto.Email;
            account!.PhoneNumber = dto.PhoneNumber;
            account!.BirthDate = dto.BirthDate;
            var result = await _userManager.UpdateAsync(account);
            if (!result.Succeeded)
                return ApiResponse<MemberDto?>.
                    Fail("Error updating Profile", result.Errors.Select(e => e.Description).ToList());
            var data = new MemberDto
            {
                Id = memberId,
                Email = account.Email,
                FirstName = account.FirstName,
                LastName = account.LastName,
                BirthDate = account.BirthDate.ToString("yyyy-MM-dd"),
                PhoneNumber = account.PhoneNumber,
                CreatedAt = account.CreatedAt.ToString("yyyy-MM-dd"),
            };
            return ApiResponse<MemberDto?>.Ok(data);
        }

        public ApiResponse<List<MemberDto>> GetMembers()
        {
            var data = _memberRepository.GetAll()
                .Select(m => new MemberDto
                {
                    Id = m.MemberId,
                    FirstName = m.Account.FirstName,
                    LastName = m.Account.LastName,
                    BirthDate = m.Account.BirthDate.ToString("yyyy-MM-dd"),
                    Email = m.Account.Email!,
                    PhoneNumber = m.Account.PhoneNumber!,
                    CreatedAt = m.Account.CreatedAt.ToString("yyyy-MM-dd"),
                    ImageUrl = m.Account.ImagePath,
                    ActiveSubscriptions = m.Subscriptions.Where(s => s.EndDate >= DateTime.UtcNow).Count(),
                    TotalAttendedSessions = m.Attendaces.Count(),
                }).ToList();

            return ApiResponse<List<MemberDto>>.Ok(data);
        }

        public async Task<ApiResponse<MemberDto>> GetMember(int memberId)
        {
            var member = await _memberRepository.GetAll().
                Include(m => m.Account)
                .Where(m => m.MemberId == memberId).FirstOrDefaultAsync();

            if (member == null)
                return ApiResponse<MemberDto>.NotFound("Member not found");


            var data = new MemberDto
            {
                Id = member.MemberId,
                FirstName = member.Account.FirstName,
                LastName = member.Account.LastName,
                Email = member.Account.Email!,
                PhoneNumber = member.Account.PhoneNumber!,
                CreatedAt = member.Account.CreatedAt.ToString("yyyy-MM-dd"),
                ImageUrl = member.Account.ImagePath,
                BirthDate = member.Account.BirthDate.ToString("yyyy-MM-dd"),
            };
            return ApiResponse<MemberDto>.Ok(data);
        }

        
        public async Task<ApiResponse<List<UserDto>>> GetStaff()
        {
            var data = (await _userManager.GetUsersInRoleAsync(Roles.Staff))
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.UserName!,
                    Email = u.Email! ,
                    FirstName = u.FirstName ,
                    LastName = u.LastName ,
                    PhoneNumber = u.PhoneNumber!,
                    BirthDate = u.BirthDate.ToString("yyyy-MM-dd"),
                    CreatedAt = u.CreatedAt.ToString("yyyy-MM-dd"),
                    ImageUrl=u.ImagePath,
                }).ToList();
            return ApiResponse<List<UserDto>>.Ok(data);
        }

        public async Task<ApiResponse<UserDto?>> GetUser(int userId)

        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponse<UserDto?>.NotFound("User not found");
            var data = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                BirthDate = user.BirthDate.ToString("yyyy-MM-dd"),
                CreatedAt = user.CreatedAt.ToString("yyyy-MM-dd"),
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber!,
                ImageUrl = user.ImagePath,
                Username = user.UserName!

            };
            return ApiResponse<UserDto?>.Ok(data);
        }

        public async Task<ApiResponse<UserDto?>> UpdateUser(int staffId, UpdateUserDto dto)
        {

            var user = await _userManager.FindByIdAsync(staffId.ToString());

            if (user == null)
                return ApiResponse<UserDto?>.NotFound("User not found");


            user.UserName = dto.Username;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;
            user.BirthDate = dto.BirthDate;
            user.Email = dto.Email;

            var result = await _userManager.UpdateAsync(user);
            

            if (!result.Succeeded)
                return ApiResponse<UserDto?>
                    .Fail("Error updating user", result.Errors.Select(e => e.Description).ToList());

            var data = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                BirthDate = user.BirthDate.ToString("yyyy-MM-dd"),
                PhoneNumber = user.PhoneNumber,
                Username = user.UserName,
                CreatedAt = user.CreatedAt.ToString("yyyy-MM-dd"),
                Email = user.Email,
                ImageUrl = user.ImagePath
            };
            return ApiResponse<UserDto?>.Ok(data);
        }



           
    }
}
