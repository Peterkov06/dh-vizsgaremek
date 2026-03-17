using backend.Modules.Shared.Models;

namespace backend.Modules.Engagement.Models
{
    public class ChatMessage: ModelBase
    {
        public required string SenderId { get; set; }
        public required string Text { get; set; }
        public Guid ChatId { get; set; }

        public ChatRoom? Chat { get; set; }
    }
}
