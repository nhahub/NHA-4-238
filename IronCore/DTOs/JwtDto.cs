namespace IronCore.DTOs
{
    public class JwtDto
    {
        public string AccessToken { get; set; } = null!;
        public int ExpiresIn { get; set; }
    }
}
