namespace backend.Modules.Pages.Student.DTOs.Student
{
    public class AttendedCourseDTO
    {
        public Guid CourseId { get; set; }
        public Guid InstanceId { get; set; }
        public string CourseName { get; set; } = "";
        public string TeacherName { get; set; } = "";
        public string ImageUrl { get; set; } = "";
        public string CourseType { get; set; } = "";
        public int Progress { get; set; }
        public List<CourseCardUprocmingEventsDTO>? UpcomingEvents { get; set; } = null;
    }
}
