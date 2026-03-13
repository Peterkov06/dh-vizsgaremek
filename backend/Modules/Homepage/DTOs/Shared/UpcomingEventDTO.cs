namespace backend.Modules.Homepage.DTOs.Shared
{
    public class UpcomingEventDTO
    {
        public Guid EventId { get; set; }
        public string EventUrl { get; set; } = "";
        public string Title { get; set; } = "";
        public DateOnly StartDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public string CourseName { get; set; } = "";
        public string TeacherName { get; set; } = "";
        public string EventType { get; set; } = "";
        public string Description { get; set; } = "";
    }
}
