namespace backend.Modules.Pages.Teacher.DTOs
{
    public class EnrollmentItemDTO
    {
        public Guid CourseId { get; set; }
        public string CourseName { get; set; } = "";
        public string UserId { get; set; } = "";
        public string UserName { get; set; } = "";
        public DateTime EnrollmentDate { get; set; }
        public Guid EnrollmentId { get; set; }
        public string? ProfilePictureUrl { get; set; } = null;
    }
}
