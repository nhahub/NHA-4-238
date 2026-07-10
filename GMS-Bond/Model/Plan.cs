using System.ComponentModel.DataAnnotations.Schema;

namespace GMS_Bond.Model
{
    public class Plan
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";

        [ForeignKey("Trainer")]
        public int TrainerId { get; set; }
        public virtual Trainer Trainer { get; set; } = null!; 

        [ForeignKey("Sport")]
        public int SportId { get; set; }
        public virtual Sport Sport { get; set; } = null!;

        public virtual ICollection<Session> Sessions { get; set; } = 
            new HashSet<Session>();
        public virtual ICollection<TrainingAppointment> TrainingAppointments { get; set; } = 
            new HashSet<TrainingAppointment>();
        public virtual ICollection<Package> Packages { get; set; } =
            new HashSet<Package>();

    }
}
