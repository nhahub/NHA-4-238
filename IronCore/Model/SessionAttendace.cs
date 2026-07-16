
using System.ComponentModel.DataAnnotations.Schema;

namespace IronCore.Model
{
    public class SessionAttendace
    {
        [ForeignKey("Member")]
        public int MemberId { get; set; }
        public virtual Member Member { get; set; } = null!;

        [ForeignKey("Session")]
        public int SessionId { get; set; }
        public virtual Session Session { get; set; } = null!;
        
        
    }
}
