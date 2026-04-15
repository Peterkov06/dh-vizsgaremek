namespace backend.Modules.Engagement.DTOs
{
    public class CourseReviewDTO
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public string ReviewerName { get; set; } = string.Empty;
        public string? ReviewerImage { get; set; } = null;
        public bool Recommended { get; set; }
        public required string Text { get; set; }
        public int ReviewScore { get; set; }
    }
}
