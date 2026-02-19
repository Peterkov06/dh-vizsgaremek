using System.ComponentModel.DataAnnotations;

namespace backend.Models.Chat
{
    public class Message
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }
        public DateTime SentAt { get; set; }

        public Conversation Conversation { get; set; }
        public ApplicationUser Sender { get; set; }

    }
}
