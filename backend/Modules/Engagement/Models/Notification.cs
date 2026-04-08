using backend.Models;
using backend.Modules.Shared.Models;

namespace backend.Modules.Engagement.Models
{
    public class Notification: ModelBase
    {
        public required string RecipientId { get; set; }
        public string? SenderId { get; set; } = null;
        public string? Message { get; set; } = null;
        public NotificationType Type { get; set; }
        public Guid? ReferenceId { get; set; } = null;
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }

        public ApplicationUser? RecipientUser { get; set; }
        public ApplicationUser? SenderUser { get; set; }
    }
}
