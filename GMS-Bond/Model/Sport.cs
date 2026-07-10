namespace GMS_Bond.Model
{
    public class Sport
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string ImagePath { get; set; } = "";
        public virtual ICollection<Plan> Plans { get; set; }
         = new HashSet<Plan>();
        public virtual ICollection<Trainer> Trainers { get; set; }
        = new HashSet<Trainer>();
    }
}
