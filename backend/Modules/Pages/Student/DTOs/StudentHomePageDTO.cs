using backend.Modules.Pages.Shared.DTOs;
using backend.Modules.Shared.DTOs;

namespace backend.Modules.Pages.Student.DTOs
{
    public class StudentHomePageDTO
    {
        public AttendedCoursesDTO AttendedCourses { get; set; } = new();
        public List<UpcomingEventDTO> UpcomingEvents { get; set; } = [];
        public List<PopularCourseDTO> PopularCourses { get; set; } = [];
        public NotificationsDTO Notifications { get; set; } = new();
    }
}
