namespace backend.Modules.Tutoring.DTOs
{
    public class WallCommentDTO
    {
        public required string SenderId { get; set; }
        public required string SenderName { get; set; }
        public required string SenderImg { get; set; }
        public DateTime SentTime { get; set; }
        public required string Text { get; set; }
    }
}
