using backend.Data;
using backend.Modules.Engagement.Models;

namespace backend.Modules.Engagement.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _db;

        public NotificationService(AppDbContext db)
        {
            _db = db;
        }

        public async Task NotifyAsync(string recipientId, NotificationType type, string title, string? message, Guid referenceId)
        {
            _db.Notifications.Add(new Notification {  RecipientId = recipientId, Title = title, Type = type, Message = message, ReferenceId = referenceId });

            await _db.SaveChangesAsync();
        }
    }
}
