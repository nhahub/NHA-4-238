using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;

namespace GMS_Bond.DTOs
{
    public class PlanDto
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = null!;
        [Required]
        public string Description { get; set; } = null!;
        [Required]
        public int TrainerId { get; set; }
        [Required]
        public string TrainerName { get; set; } = null!;
        [Required]
        public int SportId { get; set; }
        [Required]
        public string Sport { get; set; } = null!;
        [Required]
        public List<TrainingAppointmentDto> Appointments { get; set; }
            = new List<TrainingAppointmentDto>();
    }
}
