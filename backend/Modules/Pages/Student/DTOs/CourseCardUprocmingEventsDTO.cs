namespace backend.Modules.Pages.Student.DTOs
{
    public class CourseCardUprocmingEventsDTO
    {
        public Guid EventId { get; set; }
        public string EventUrl { get; set; } = "";
        public string Title { get; set; } = "";
        public DateOnly StartDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public string EventType { get; set; } = "";
        public string Description { get; set; } = "";
    }
}
