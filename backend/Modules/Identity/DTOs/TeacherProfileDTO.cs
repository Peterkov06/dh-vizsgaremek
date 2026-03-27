namespace backend.Modules.Identity.DTOs
{
    public class TeacherProfileDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Introduction { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
        public List<string> TeachingLocations { get; set; } = [];
        public List<string> Qualifications { get; set; } = [];

        public float RatingAverage { get; set; } = 0f;
        public int TotalStudents { get; set; } = 0;
        public int TotalCourses { get; set; } = 0;
    }
}
