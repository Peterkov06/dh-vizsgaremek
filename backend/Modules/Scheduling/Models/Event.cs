using backend.Shared.Models;

namespace backend.Modules.Scheduling.Models
{
    public class Event: ModelBase
    {
        public required string Organiser { get; set; }
        public required EventType Type { get; set; }
        public required DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; } = null;
        public Guid? PathCourseId { get; set; } = null;
        public Guid? TutoringCourseId { get; set; } = null;
        public Guid? PathEnrollmentId { get; set; } = null;
    }
}
