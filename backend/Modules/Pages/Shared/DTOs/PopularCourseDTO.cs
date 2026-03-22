namespace backend.Modules.Pages.Shared.DTOs
{
    public class PopularCourseDTO
    {
        public Guid CourseId { get; set; }
        public required string CourseName { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string TeacherName { get; set; } = "";
        public string CourseType { get; set; } = "";
        public string Description { get; set; } = "";
        public PriceDTO LessonPrice { get; set; } = new();

    }
}
