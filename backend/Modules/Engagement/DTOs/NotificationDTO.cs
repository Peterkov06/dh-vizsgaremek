using backend.Modules.Engagement.Models;
using backend.Modules.Shared.DTOs;

namespace backend.Modules.Engagement.DTOs
{
    public class NotificationDTO
    {
        public Guid Id { get; set; }
        public NotificationType Type { get; set; }
        public string Sender { get; set; } = string.Empty;
        public Guid? ReferenceId { get; set; } = null;
        public string? Message { get; set; } = null;
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; } = false;
    }
}
