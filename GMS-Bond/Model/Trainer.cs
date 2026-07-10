using System.ComponentModel.DataAnnotations.Schema;

namespace GMS_Bond.Model
{
    public class Trainer
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public int YearsOfExperience { get; set; }
        public string ImagePath { get; set; } = "";
        public virtual ICollection<Plan> Plans { get; set; }
         = new HashSet<Plan>();

        [ForeignKey("Sport")]
        public int? SportId { get; set; }
        public virtual Sport? Sport { get; set; } 
    }
}
