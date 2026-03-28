namespace backend.Modules.Identity.DTOs
{
    public class TeacherProfileDTO: ProfileBaseDTO
    {
        public List<string> TeachingLocations { get; set; } = [];
        public List<string> Qualifications { get; set; } = [];

        public float RatingAverage { get; set; } = 0f;
        public int TotalStudents { get; set; } = 0;
        public int TotalCourses { get; set; } = 0;
    }
}
