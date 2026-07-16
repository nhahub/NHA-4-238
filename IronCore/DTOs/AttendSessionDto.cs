using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class AttendSessionDto
    {
        [Required]
        public int SessionId{ get; set; }
        [Required]
        public int MemberId{  get; set; }
    }
}
