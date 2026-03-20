using backend.Modules.Shared.Models;

namespace backend.Modules.Tutoring.DTOs
{
    public class TutoringWallEnrollmentDTO
    {
        public Guid? Id { get; set; } = null;
        public required string StudentId { get; set; }
        public required Guid CourseId { get; set; }
        public EnrollmentStatus Status { get; set; } = EnrollmentStatus.Pending;
        public int TokenCount { get; set; } = 0;
    }
}
