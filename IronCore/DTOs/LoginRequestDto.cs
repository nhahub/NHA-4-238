using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class LoginRequestDto
    {
        [Required]
        public required string UsernameOrEmail { get; set; }

        [Required]
        public required string Password { get; set; }
    }
}
