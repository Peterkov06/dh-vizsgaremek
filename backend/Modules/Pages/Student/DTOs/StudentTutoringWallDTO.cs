namespace backend.Modules.Pages.Student.DTOs
{
    public class StudentTutoringWallDTO
    {
        public required string CourseName { get; set; }
        public Guid CourseBaseId { get; set; }
        public Guid InstanceId { get; set; }
        public required string TeacherName { get; set; }
        public required string TeacherId { get; set; }
        public string? BannerURL { get; set; } = null;
        public string? IconURL { get; set; } = null;
        public int TokenCount { get; set; } = 0;
        public required bool WroteReview { get; set; } = false;
        public List<TutoringWallEventCardDTO> NextHandins { get; set; } = [];
        public List<TutoringWallEventCardDTO> NextLessons { get; set; } = [];

    }
}
