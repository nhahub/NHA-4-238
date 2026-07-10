using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GMS_Bond.DTOs
{
    public class AddUpdatePlanDto
    {
        [Required]
        public string Title { get; set; } = null!;
        [Required]
        public string Description { get; set; } = null!;
        
        [Required]
        public int TrainerId { get; set; }
        [Required]
        public int SportId { get; set; }
        public List<TrainingAppointmentDto> Appointments { get; set; } = 
            new List<TrainingAppointmentDto>();
    }
}
