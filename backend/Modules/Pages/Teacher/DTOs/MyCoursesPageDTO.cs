using backend.Modules.CoursesBase.Models;

namespace backend.Modules.Pages.Teacher.DTOs
{
    public class MyCoursesPageDTO
    {
        public List<MyCoursesCourseCardDTO> TutoringCourses { get; set; } = [];
        public List<MyCoursesCourseCardDTO> PathCourses { get; set; } = [];
        public List<DraftCourseDTO> DraftCourses { get; set; } = [];
    }

    public class MyCoursesCourseCardDTO
    {
        public required string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public CourseType Type { get; set; } = CourseType.Tutoring;
        public CourseStatus Status { get; set; } = CourseStatus.Active;
        public int EnrolledStudents { get; set; } = 0;
        public int OngoingAssignments { get; set; } = 0;
        public double CourseRating { get; set; } = 0;
        public string CoursePictureURL { get; set; } = string.Empty;
        public string CourseBannerURL { get; set; } = string.Empty;
    }

    public class DraftCourseDTO
    {
        public required string CourseName { get; set; }
        public Guid CourseId { get; set; }
        public CourseType Type { get; set; } = CourseType.Tutoring;
        public string CoursePictureURL { get; set; } = string.Empty;
        public string CourseBannerURL { get; set; } = string.Empty;
    }
}
