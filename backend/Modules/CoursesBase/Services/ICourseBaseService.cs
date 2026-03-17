namespace backend.Modules.CoursesBase.Services
{
    public interface ICourseBaseService
    {
        Task GetAllCourses();
        Task GetTeacherCourses();
        Task GetCoursesPage(int perPage, int pageNum);
        Task GetTeacherCoursesPage(int perPage, int pageNum);
        Task CreateCourseBaseAsync();
        Task UpdateCourseBaseAsync();
        Task DeleteCourseBaseAsync();
    }
}
