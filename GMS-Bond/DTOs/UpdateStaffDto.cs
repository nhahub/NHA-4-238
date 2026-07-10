using System.ComponentModel.DataAnnotations;

namespace GMS_Bond.DTOs
{
    public class UpdateStaffDto
    {
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string FirstName { get; set; } = null!;
        [Required]
        public string LastName { get; set; } = null!;
        [Required]
        public DateTime BirthDate { get; set; }
        [Required]
        public string Email { get; set; } = null!;
        [Required]        
        public string PhoneNumber { get; set; } = null!;

    }
}
