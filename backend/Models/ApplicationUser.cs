using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string? Introduction { get; set; }
        public string? Nickname { get; set; }
    }
}
