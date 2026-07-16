using Microsoft.AspNetCore.Identity;

namespace IronCore.Model
{
    public class UserAccount : IdentityUser<int>
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public DateTime BirthDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ImagePath { get; set; }

    }
}
