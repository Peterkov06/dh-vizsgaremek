  namespace backend.Modules.Pages.Teacher.DTOs
{
    public class CourseCardDTO
    {
        public Guid CourseId { get; set; }
        public required string CourseName { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string CourseType { get; set; } = string.Empty;
        public int EnrolledStudents { get; set; } = 0;
    }
}
