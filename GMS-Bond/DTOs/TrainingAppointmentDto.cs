using System.ComponentModel.DataAnnotations;

namespace GMS_Bond.DTOs
{
    public class TrainingAppointmentDto
    {
        [Required]
        public DayOfWeek Day { get; set; }
        [Required]
        public TimeOnly Time { get; set; } 
    }
}
