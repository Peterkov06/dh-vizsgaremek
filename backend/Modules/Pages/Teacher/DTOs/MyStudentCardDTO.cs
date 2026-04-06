namespace backend.Modules.Pages.Teacher.DTOs
{
    public class MyStudentCardDTO
    {
        public required string StudentId { get; set; }
        public required string Name { get; set; }
        public string? Nickname { get; set; } = null;
        public int CourseNumber { get; set; } = 0;
        public int OngoingHandins { get; set; } = 0;
        public Guid ChatId { get; set; }
        public Guid WallId { get; set; }
    }
}
