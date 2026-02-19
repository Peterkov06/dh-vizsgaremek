using System.ComponentModel.DataAnnotations;

namespace backend.Models.Chat
{
    public class ConversationParticipant
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public string SenderId { get; set; }
        public DateTime LastOnlineAt { get; set; }

        public Conversation Conversation { get; set; }
        public ApplicationUser Sender { get; set; }
    }
}
