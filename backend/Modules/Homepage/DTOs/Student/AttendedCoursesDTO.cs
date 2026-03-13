namespace backend.Modules.Homepage.DTOs.Student
{
    public class AttendedCoursesDTO
    {
        public List<AttendedCourseDTO> Active { get; set; } = [];
        public List<AttendedCourseDTO> Inactive { get; set; } = [];
    }
}
