namespace backend.Modules.Pages.Shared.DTOs
{
    public class UpcomingEventDTO
    {
        public Guid EventId { get; set; }
        public string EventUrl { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
