namespace backend.Modules.Engagement.DTOs
{
    public class ChatMessageDTO
    {
        public required string SenderId { get; set; }
        public required string SenderName { get; set; }
        public string? SenderImage { get; set; } = null;
        public required string Text { get; set; }
        public DateTime SentTime { get; set; }
        public bool IsRead { get; set; }
        public bool IsOwn { get; set; }
    }
}
