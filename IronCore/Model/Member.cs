using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IronCore.Model
{
    public class Member
    {
        [Key]
        [ForeignKey("Account")]
        public int MemberId { get; set; }
        public virtual UserAccount Account { get; set; } = null!;

        public virtual ICollection<SessionAttendace> Attendaces { get; set; } =
           new HashSet<SessionAttendace>();
        public virtual ICollection<Subscription> Subscriptions { get; set; } =
            new HashSet<Subscription>();
    }
}
