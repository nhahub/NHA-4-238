namespace GMS_Bond.DTOs
{
    public class LoginResponseDto
    {
        public required int Id { get; set; } 
        public required string? Email { get; set; }
        public required string FullName { get; set; }
        public string? ImageUrl { get; set; }
        public string? Role {  get; set; }
        public string? AccessToken { get; set; }
        public int? ExpiresIn { get; set; }
    }
}
