namespace backend.Modules.Pages.Student.DTOs
{
    public class AttendedCourseDTO
    {
        public Guid CourseId { get; set; }
        public Guid InstanceId { get; set; }
        public string CourseName { get; set; } = "";
        public string TeacherName { get; set; } = "";
        public string? CourseBannerURL { get; set; } = null;
        public string? CourseIconURL { get; set; } = null;
        public string CourseType { get; set; } = "";
        public int Progress { get; set; }
        public List<CourseCardUpcomingEventsDTO>? UpcomingEvents { get; set; } = null;
    }
}
