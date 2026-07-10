namespace GMS_Bond.DTOs
{
    public class JwtDto
    {
        public string AccessToken { get; set; } = null!;
        public int ExpiresIn { get; set; }
    }
}
