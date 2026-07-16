using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class UpdateTrainerDto
    {
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Title { get; set; } = null!;
        [Required]
        public string Description { get; set; } = null!;
        [Required]
        public int YearsOfExperience { get; set; }
        public IFormFile? Image { get; set; }
        [Required]
        public int SportId { get; set; }
    }
}
