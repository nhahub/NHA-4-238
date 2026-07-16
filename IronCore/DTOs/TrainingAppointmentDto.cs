using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class TrainingAppointmentDto
    {
        [Required]
        public DayOfWeek Day { get; set; }
        [Required]
        public TimeOnly Time { get; set; } 
    }
}
