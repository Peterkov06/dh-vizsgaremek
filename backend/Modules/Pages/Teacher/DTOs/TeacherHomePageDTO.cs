using backend.Modules.Pages.Shared.DTOs;

namespace backend.Modules.Pages.Teacher.DTOs
{
    public class TeacherHomePageDTO
    {
        public List<CourseCardDTO> ActiveCourses { get; set; } = [];
        public List<UpcomingEventDTO> UpcomingEvents { get; set; } = [];
        public List<GradingItemDTO> GradingQueue { get; set; } = [];
        public List<EnrollmentItemDTO> PendingEnrollments { get; set; } = [];
        public List<PaymentItemDTO> PendingPayments { get; set; } = [];
        public List<StudentItemDTO> Students { get; set; } = [];
        public required NotificationsDTO Notifications { get; set; }
    }
}
