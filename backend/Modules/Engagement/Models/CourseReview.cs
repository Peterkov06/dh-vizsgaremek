using backend.Models;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Identity.Models;
using backend.Modules.Progression.Models;
using backend.Modules.Shared.Models;
using backend.Modules.Tutoring.Models;

namespace backend.Modules.Engagement.Models
{
    public class CourseReview: ModelBase
    {
        public Guid CourseId { get; set; }
        public required string ReviewerId { get; set; }
        public bool Recommended { get; set; }
        public required string Text { get; set; }
        public Guid? WallId { get; set; }
        public Guid? EnrollmentId { get; set; }
        public int ReviewScore { get; set; }

        public TutoringWall? Wall { get; set; }
        public PathEnrollment? Enrollment { get; set; }
        public CourseBaseModel? Course { get; set; }
        public Student? Reviewer { get; set; }
    }
}
