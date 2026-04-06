using backend.Data;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace backend.Modules.Engagement.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _db;

        public NotificationService(AppDbContext db)
        {
            _db = db;
        }

        public async Task NotifyAsync(string recipientId, NotificationType type, string? message = null, Guid? referenceId = null, string? senderId = null)
        {
            _db.Notifications.Add(new Notification {  RecipientId = recipientId, Type = type, Message = message, ReferenceId = referenceId, IsRead = false, ReadAt = null, SenderId = senderId});

            await _db.SaveChangesAsync();
        }

        public async Task<ServiceResult<List<NotificationDTO>>> GetUserNotifications(string userId, CancellationToken ct = default)
        {
            var notifications = await _db.Notifications
                .Where(x => x.RecipientId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .Select(NotificationToDTO)
                .ToListAsync(ct);
            return ServiceResult<List<NotificationDTO>>.Success(notifications);
        }
        
        public async Task SetNotificationsToRead(List<Guid> notificationIds, CancellationToken ct = default)
        {
            await _db.Notifications
                .Where(x => notificationIds.Contains(x.Id))
                .ExecuteUpdateAsync(s => s
                    .SetProperty(n => n.IsRead, true)
                    .SetProperty(n => n.ReadAt, DateTime.UtcNow),
                ct);
        }

        public static Expression<Func<Notification, NotificationDTO>> NotificationToDTO =>
            notification => new NotificationDTO
            {
                CreatedAt = notification.CreatedAt,
                Id = notification.Id,
                IsRead = notification.IsRead,
                Message = notification.Message,
                ReferenceId = notification.ReferenceId,
                Sender = notification.SenderUser.FullName ?? "[Deleted]",
                Type = notification.Type,
            };
    }
}
