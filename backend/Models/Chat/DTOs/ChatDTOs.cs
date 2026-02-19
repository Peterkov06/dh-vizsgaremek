namespace backend.Models.Chat.DTOs
{
    public class ConversationDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public List<ParticipantDTO> Participants { get; set; }
    }

    public class ParticipantDTO
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public DateTime? LastOnlineAt { get; set; }
    }
}
