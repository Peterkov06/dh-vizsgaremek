using System.ComponentModel.DataAnnotations;

namespace backend.Models.Chat
{
    public class ConversationParticipant
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public string UserId { get; set; }
        public DateTime? LastOnlineAt { get; set; }

        public Conversation Conversation { get; set; }
        public ApplicationUser User { get; set; }
    }
}
