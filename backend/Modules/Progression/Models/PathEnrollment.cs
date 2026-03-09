using backend.Modules.Identity.Models;
using backend.Shared.Models;

namespace backend.Modules.Progression.Models
{
    public class PathEnrollment: ModelBase
    {
        public required Guid CourseId { get; set; }
        public required string AttendantId { get; set; }
        public required Guid? LastLessonId { get; set; } = null;
        public required EnrollmentStatus Status { get; set; }
        public int TokenCount { get; set; }

        public Student? Attendant { get; set; }
    }
}
