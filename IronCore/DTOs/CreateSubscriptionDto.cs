using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class CreateSubscriptionDto
    {
        [Required]
        public int MemberId { get; set; }

        [Required]
        public int PackageId { get; set; }
    }
}
