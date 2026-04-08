using backend.Modules.Scheduling.Models;

namespace backend.Modules.Scheduling.DTOs
{
    public class BookingDTO
    {
        public Guid InstanceId { get; set; }
        public Guid CourseBaseId { get; set; }
        public required TimeblockDTO Timeblock { get; set; }
        public EventType Type { get; set; } = EventType.Lesson;
        public string? Title { get; set; } = null;
        public string? Description { get; set; } = null;
    }
}
