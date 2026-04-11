namespace backend.Modules.Engagement.DTOs
{
    public class ChatContactDTO
    {
        public required string ParticipantName { get; set; }
        public string? ParticipantNickname { get; set; } = null;
        public required string ParticipantId { get; set; }
        public string? ParticipantImageURL { get; set; } = null;
        public required Guid ChatId { get; set; }
        public int? CourseNumber { get; set; } = null;
        public bool NewMessage { get; set; } = false;
    }
}
