using backend.Shared.Models;

namespace backend.Modules.Engagement.Models
{
    public class Notification: ModelBase
    {
        public string? SenderId { get; set; } = null;
        public required string Title { get; set; }
        public string? Message { get; set; } = null;
        public Guid Referenceid { get; set; }
        public bool IsRead { get; set; }
    }
}
