using backend.Modules.CoursesBase.Models;
using backend.Modules.Identity.Models;
using backend.Modules.Progression.Models;
using backend.Modules.Shared.Models;
using backend.Modules.Tutoring.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Scheduling.Models
{
    public class Event: ModelBase
    {
        public required string OrganiserId { get; set; }
        public required EventType Type { get; set; }
        public required DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; } = null;
        public Guid? PathCourseId { get; set; } = null;
        public Guid? TutoringWallId { get; set; } = null;
        public Guid? PathEnrollmentId { get; set; } = null;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = null;

        public Teacher? Organiser { get; set; }
        public CourseBaseModel? PathCourse { get; set; }
        public TutoringWall? TutoringWall { get; set; }
        public PathEnrollment? Enrollment { get; set; }
    }
}
