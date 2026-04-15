using backend.Modules.CoursesBase.Models;
using backend.Modules.Shared.Models;

namespace backend.Modules.Pages.Student.DTOs
{
    public class StudentMyCourseDTO
    {
        public Guid CourseBaseId { get; set; }
        public Guid InstanceId { get; set; }
        public required string CourseName { get; set; }
        public required string TeacherName { get; set; }
        public required string TeacherId { get; set; }
        public string? CourseIconURL { get; set; }
        public string? TeacherProfilePictureURL { get; set; }
        public string? CourseBannerURL { get; set; }
        public EnrollmentStatus Status { get; set; } 
    }
}
