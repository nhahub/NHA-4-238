namespace IronCore.DTOs
{
    public class UserDto
    {
        public required int Id { get; set; }
        public required string Username { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string BirthDate { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string CreatedAt { get; set; }
        public string? ImageUrl { get; set; }
    }
}
