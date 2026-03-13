namespace backend.Modules.Homepage.DTOs.Shared
{
    public class NotificationsDTO
    {
        public int UnreadNotificationNumber { get; set; }
        public LastUnreadNotificationDTO LastUnread { get; set; } = new();
    }

    public class LastUnreadNotificationDTO
    {
        public Guid NotificationId { get; set; }
        public string EventUrl { get; set; } = "";
        public string CourseName { get; set; } = "";
        public string Text { get; set; } = "";
    }
}
