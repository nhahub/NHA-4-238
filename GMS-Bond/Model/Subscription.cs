using System.ComponentModel.DataAnnotations.Schema;

namespace GMS_Bond.Model
{
    public class Subscription
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Paid { get; set; }

        [ForeignKey("Member")]
        public int? MemberId { get; set; }
        public virtual Member? Member { get; set; }

        [ForeignKey("Package")]
        public int? PackageId { get; set; }
        public virtual Package? Package { get; set; } 


        

    }
}
