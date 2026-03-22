using backend.Modules.Pages.Student.DTOs.Student;

namespace backend.Modules.Pages.Student.DTOs
{
    public class AttendedCoursesDTO
    {
        public List<AttendedCourseDTO> Active { get; set; } = [];
        public List<AttendedCourseDTO> Inactive { get; set; } = [];
    }
}
