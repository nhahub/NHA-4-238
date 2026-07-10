using System.ComponentModel.DataAnnotations.Schema;

namespace GMS_Bond.Model
{
    public class Session
    {
        public int Id { get; set; }
        public DateTime SessionDate { get; set; }
        
        [ForeignKey("Plan")]
        public int PlanId { get; set; }
        public virtual Plan Plan { get; set; } = null!;

        public virtual ICollection<SessionAttendace> Attendaces { get; set; } = 
            new HashSet<SessionAttendace>();
    }
}
