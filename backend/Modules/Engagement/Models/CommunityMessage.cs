using backend.Modules.Shared.Models;

namespace backend.Modules.Engagement.Models
{
    public class CommunityMessage: ModelBase
    {
        public required string SenderId { get; set; }
        public required string Text { get; set; }
        public Guid ThreadId { get; set; }

        public CommunityThread? Thread { get; set; }
    }
}
