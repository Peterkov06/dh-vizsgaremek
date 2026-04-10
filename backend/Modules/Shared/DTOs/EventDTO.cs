namespace backend.Modules.Shared.DTOs
{
    public class EventDTO: UpcomingEventDTO
    {
        //public required string Place { get; set; }
        public int LessonLength { get; set; } = 1;
    }
}
