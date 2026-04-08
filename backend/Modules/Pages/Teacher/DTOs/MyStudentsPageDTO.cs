namespace backend.Modules.Pages.Teacher.DTOs
{
    public class MyStudentsPageDTO
    {
        public List<MyStudentCardDTO> Tutoring { get; set; } = [];
        public List<MyStudentCardDTO> LearningPath { get; set; } = [];
    }
}
