using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class AddSportDto
    {
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Description { get; set; } = null! ;
        [Required]
        public IFormFile Image { get; set; } = null!;
    }
}
