using backend.Modules.Scheduling.Models;

namespace backend.Modules.Pages.Student.DTOs
{
    public class CourseCardUpcomingEventsDTO
    {
        public Guid EventId { get; set; }
        public Guid InstanceId { get; set; }
        public string? Title { get; set; } = null;
        public DateOnly StartDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public EventType EventType { get; set; } 
        public string Description { get; set; } = "";
    }
}
