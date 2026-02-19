using System.ComponentModel.DataAnnotations;

namespace backend.Models.Chat
{
    public class Conversation
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }

        public ICollection<ConversationParticipant> ConversationParticipants { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
