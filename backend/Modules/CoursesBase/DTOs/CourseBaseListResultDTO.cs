namespace backend.Modules.CoursesBase.DTOs
{
    public class CourseBaseListResultDTO
    {
        public List<CourseBaseExplorerDTO> Courses { get; set; } = [];
        public int TotalCourses { get; set; }
        public int TotalPages { get; set; }
        public int PageNum { get; set; }
        public int CoursesPerPage { get; set; }
    }
}
