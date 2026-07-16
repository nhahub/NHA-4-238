using System.ComponentModel.DataAnnotations.Schema;

namespace IronCore.Model
{
    
    public class TrainingAppointment
    {
        public int Id { get; set; }

        public DayOfWeek Day { get; set; }

        public TimeOnly Time { get; set; }

        [ForeignKey("Plan")]
        public int PlanId { get; set; }
        public Plan Plan { get; set; } = null!;
    }
}
