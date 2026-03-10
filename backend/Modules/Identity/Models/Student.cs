using backend.Models;
using backend.Modules.Progression.Models;
using backend.Modules.Tutoring.Models;

namespace backend.Modules.Identity.Models
{
    public class Student
    {
        public required string UserId { get; set; }

        public ApplicationUser? User { get; set; }

        public ICollection<PathEnrollment> LearningPathEnrollments { get; set; } = [];
        public ICollection<TutoringWall> TutoringWalls { get; set; } = [];
    }
}
