using backend.Modules.Pages.Student.DTOs;

namespace backend.Modules.Pages.Teacher.DTOs
{
    public class TeacherTutoringWallDTO
    {
        public required string CourseName { get; set; }
        public Guid CourseBaseId { get; set; }
        public Guid InstanceId { get; set; }
        public required string StudentName { get; set; }
        public required string StudentId { get; set; }
        public string? BannerURL { get; set; } = null;
        public string? IconURL { get; set; } = null;
        public int TokenCount { get; set; } = 0;
        public List<TutoringWallEventCardDTO> NextHandins { get; set; } = [];
        public List<TutoringWallEventCardDTO> NextLessons { get; set; } = [];
    }
}
