using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class AddUpdatePackageDto
    {
        [Required]
        public string Title { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        [Required]
        public decimal Price { get; set; }
        
        [Required]
        public int NumberOfSessions { get; set; }

        [Required]
        [Range(minimum: 1, 60, ErrorMessage = "Number of monthes is not valid")]
        public int NumberOfMonthes { get; set; }
        [Required]
        public int PlanId { get; set; }
    }
}
