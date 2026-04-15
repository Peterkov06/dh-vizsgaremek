namespace backend.Modules.Pages.Shared.DTOs
{
    public class PopularCourseDTO
    {
        public Guid CourseId { get; set; }
        public required string CourseName { get; set; } = "";
        public string? CourseBannerURL { get; set; } = null;
        public string TeacherName { get; set; } = "";
        public string CourseType { get; set; } = "";
        public string Description { get; set; } = "";
        public PriceDTO LessonPrice { get; set; } = new();

    }
}
