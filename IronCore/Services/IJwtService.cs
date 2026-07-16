using IronCore.DTOs;

namespace IronCore.Services
{
    public interface IJwtService
    {
        Task<JwtDto?> GenerateToken(UserAccount user);
    }
}
