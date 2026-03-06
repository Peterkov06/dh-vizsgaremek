using backend.Models;

namespace backend.Modules.Identity.Models
{
    public class Student
    {
        public required string UserId { get; set; }

        public ApplicationUser? User { get; set; }
    }
}
