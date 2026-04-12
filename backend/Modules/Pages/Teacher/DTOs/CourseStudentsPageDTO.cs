namespace backend.Modules.Pages.Teacher.DTOs
{
    public class CourseStudentsPageDTO
    {
        public List<EnrollmentItemDTO> PendingEnrollments { get; set; } = [];
        public List<MyStudentCardDTO> Students { get; set; } = [];
    }
}
