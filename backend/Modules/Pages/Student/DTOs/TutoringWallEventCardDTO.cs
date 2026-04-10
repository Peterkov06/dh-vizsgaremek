namespace backend.Modules.Pages.Student.DTOs
{
    public class TutoringWallEventCardDTO
    {
        public string? Title { get; set; } = null;
        public string? Description { get; set; } = null;
        public DateOnly StartDate { get; set; }
        public TimeOnly StartTime { get; set; }

    }
}
