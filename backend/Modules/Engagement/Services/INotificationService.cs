using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Shared.Results;

namespace backend.Modules.Engagement.Services
{
    public interface INotificationService
    {
        Task NotifyAsync(string recipientId, NotificationType type, string? message = null, Guid? referenceId = null, string? senderId = null);
        Task<ServiceResult<List<NotificationDTO>>> GetUserNotifications(string userId, CancellationToken ct);
        Task SetNotificationsToRead(List<Guid> notificationIds, CancellationToken ct);
    }
}
