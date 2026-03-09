using backend.Models;
using backend.Modules.CoursesBase.Models;

namespace backend.Modules.Identity.Models
{
    public class Teacher
    {
        public required string TeacherId { get; set; }

        public ApplicationUser? User { get; set; }

        public ICollection<CourseBaseModel>? Courses { get; set; }
    }
}
