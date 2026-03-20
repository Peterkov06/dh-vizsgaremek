namespace backend.Modules.Tutoring.DTOs
{
    public class TutoringWallEnrollmentTeacherDTO
    {
        public Guid? Id { get; set; } = null;
        public required string StudentName { get; set; }
        public required string StudentId { get; set; }
        public required string CourseName { get; set; }
        public required Guid CourseId { get; set; }
    }
}
