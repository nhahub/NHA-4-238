using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace GMS_Bond.Model
{
    public class Package
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }    
        public int NumberOfMonthes { get; set; }
        public int NumberOfSessions { get; set; }
        [ForeignKey(nameof(Plan))]
        public int PlanId { get; set; }
        public virtual Plan Plan { get; set; } = null!;

        public virtual ICollection<Subscription> Subscriptions { get; set; } = 
            new HashSet<Subscription>();
                                                      
    }
}
