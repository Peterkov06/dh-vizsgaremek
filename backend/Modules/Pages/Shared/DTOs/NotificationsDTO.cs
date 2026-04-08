namespace backend.Modules.Pages.Shared.DTOs
{
    public class NotificationsDTO
    {
        public int UnreadNotificationNumber { get; set; }
        public LastUnreadNotificationDTO? LastUnread { get; set; } = null;
    }

    public class LastUnreadNotificationDTO
    {
        public Guid NotificationId { get; set; }
        public Guid? ReferenceId { get; set; } = null;
        public string FirstText { get; set; } = "";
        public string SecondText { get; set; } = "";
    }
}
