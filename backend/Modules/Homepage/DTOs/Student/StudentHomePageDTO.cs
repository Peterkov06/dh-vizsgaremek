using backend.Modules.Homepage.DTOs.Shared;

namespace backend.Modules.Homepage.DTOs.Student
{
    public class StudentHomePageDTO
    {
        public AttendedCoursesDTO AttendedCourses { get; set; } = new();
        public List<UpcomingEventDTO> UpcomingEvents { get; set; } = [];
        public List<PopularCourseDTO> PopularCourses { get; set; } = [];
        public NotificationsDTO Notifications { get; set; } = new();
    }
}
