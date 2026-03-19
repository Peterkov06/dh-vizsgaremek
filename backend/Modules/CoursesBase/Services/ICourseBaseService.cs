using backend.Modules.CoursesBase.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.CoursesBase.Services
{
    public interface ICourseBaseService
    {
        Task<ServiceResult<List<CourseBaseDTO>>> GetAllCourses(CancellationToken ct);
        Task<ServiceResult<List<CourseBaseDTO>>> GetTeacherCourses(CancellationToken ct);
        Task<ServiceResult<List<CourseBaseDTO>>> GetCoursesPage(int perPage, int pageNum, CancellationToken ct);
        Task<ServiceResult<List<CourseBaseDTO>>> GetTeacherCoursesPage(int perPage, int pageNum, CancellationToken ct);
        Task<ServiceResult<CourseBaseCreationDTO>> CreateCourseBaseAsync(CourseBaseCreationDTO newCourse, CancellationToken ct);
        Task<ServiceResult<CourseBaseCreationDTO>> UpdateCourseBaseAsync(CancellationToken ct);
        Task<ServiceResult> DeleteCourseBaseAsync(CancellationToken ct);
    }
}
