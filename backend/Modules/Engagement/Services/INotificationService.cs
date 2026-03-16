using backend.Modules.Engagement.Models;

namespace backend.Modules.Engagement.Services
{
    public interface INotificationService
    {
        Task NotifyAsync(string recipientId, NotificationType type, string title, string? message, Guid referenceId);
    }
}
