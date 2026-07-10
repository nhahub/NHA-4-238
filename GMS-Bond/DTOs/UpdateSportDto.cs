using System.ComponentModel.DataAnnotations;

namespace GMS_Bond.DTOs
{
    public class UpdateSportDto
    {
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Description { get; set; } = null!;
        
        public IFormFile? Image { get; set; } 
    }
}
