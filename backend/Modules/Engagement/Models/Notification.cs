using backend.Models;
using backend.Shared.Models;

namespace backend.Modules.Engagement.Models
{
    public class Notification: ModelBase
    {
        public required string RecipientId { get; set; }
        public required string Title { get; set; }
        public string? Message { get; set; } = null;
        public NotificationType Type { get; set; }
        public Guid ReferenceId { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }

        public ApplicationUser? User { get; set; }
    }
}
