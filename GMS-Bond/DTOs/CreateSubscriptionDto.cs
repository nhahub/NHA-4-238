using System.ComponentModel.DataAnnotations;

namespace GMS_Bond.DTOs
{
    public class CreateSubscriptionDto
    {
        [Required]
        public int MemberId { get; set; }

        [Required]
        public int PackageId { get; set; }
    }
}
