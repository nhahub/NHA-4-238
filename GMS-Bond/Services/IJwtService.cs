using GMS_Bond.DTOs;

namespace GMS_Bond.Services
{
    public interface IJwtService
    {
        Task<JwtDto?> GenerateToken(UserAccount user);
    }
}
