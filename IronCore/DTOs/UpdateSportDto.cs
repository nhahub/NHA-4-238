using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
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
