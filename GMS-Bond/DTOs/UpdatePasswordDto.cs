using System.ComponentModel.DataAnnotations;

namespace GMS_Bond.DTOs
{
    public class UpdatePasswordDto
    {
        [Required]
        public string OldPassword { get; set; } = null!;
        [Required]
        public string NewPassword { get; set; } = null!;
    }
}
