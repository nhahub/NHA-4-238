using System.ComponentModel.DataAnnotations;

namespace GMS_Bond.DTOs
{
    public class AttendSessionDto
    {
        [Required]
        public int SessionId{ get; set; }
        [Required]
        public int MemberId{  get; set; }
    }
}
