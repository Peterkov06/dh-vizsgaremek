using backend.Modules.CoursesBase.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.CoursesBase.Services
{
    public interface ICourseBaseService
    {
        Task<ServiceResult<List<CourseBaseExplorerDTO>>> GetAllCourses(CancellationToken ct);
        Task<ServiceResult<List<CourseBaseExplorerDTO>>> GetTeacherCourses(string TeacherId, CancellationToken ct);
        Task<ServiceResult<CourseBaseListResultDTO>> GetCoursesPage(CourseFiltersDTO filtersDTO, CancellationToken ct);
        Task<ServiceResult<CourseBaseCreationDTO>> CreateCourseBaseAsync(CourseBaseCreationDTO newCourse, CancellationToken ct);
        Task<ServiceResult<CourseBaseCreationDTO>> UpdateCourseBaseAsync(CancellationToken ct);
        Task<ServiceResult> DeleteCourseBaseAsync(CancellationToken ct);
    }
}
