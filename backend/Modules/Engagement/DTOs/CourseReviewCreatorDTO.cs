namespace backend.Modules.Engagement.DTOs
{
    public class CourseReviewCreatorDTO
    {
        public Guid CourseId { get; set; }
        public Guid WallId { get; set; }
        public bool Recommended { get; set; }
        public required string Text { get; set; }
        public int ReviewScore { get; set; }
    }
}
