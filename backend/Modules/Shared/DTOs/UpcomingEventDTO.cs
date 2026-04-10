using backend.Modules.Scheduling.Models;

namespace backend.Modules.Shared.DTOs
{
    public class UpcomingEventDTO
    {
        public Guid EventId { get; set; }
        public Guid InstanceId { get; set; }
        public string? Title { get; set; } = null;
        public DateOnly StartDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string ParticipantName { get; set; } = string.Empty;
        public required string ParticipantId { get; set; }
        public EventType EventType { get; set; } 
        public string Description { get; set; } = string.Empty;
    }
}
