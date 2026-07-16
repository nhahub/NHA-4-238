using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class MemberDto
    {
        public required int Id { get; set; }
        public required string FirstName { get; set; } 
        public required string LastName { get; set; } 
        public required string BirthDate { get; set; }
        public required string Email { get; set; } 
        public required string PhoneNumber { get; set; }
        public required string CreatedAt { get; set; }
        public string? ImageUrl { get; set; }
        public int? ActiveSubscriptions {  get; set; }
        public int? TotalAttendedSessions { get; set; }
        
    }
}
