using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class UpdatePasswordDto
    {
        [Required]
        public string OldPassword { get; set; } = null!;
        [Required]
        public string NewPassword { get; set; } = null!;
    }
}
