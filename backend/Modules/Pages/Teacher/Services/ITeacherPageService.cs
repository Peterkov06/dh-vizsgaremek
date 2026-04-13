using backend.Modules.Pages.Teacher.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Pages.Teacher.Services
{
    public interface ITeacherPageService
    {
        Task<ServiceResult<TeacherHomePageDTO>> GetTeacherHomepage(string userId, CancellationToken ct);
        Task<ServiceResult<CourseBaseCreationPageDTO>> GetCourseCreationPage(CancellationToken ct);
        Task<ServiceResult<MyStudentsPageDTO>> GetStudentsPage(string userId, CancellationToken ct, string? searchText = null);
        Task<ServiceResult<MyCoursesPageDTO>> GetMyCoursesPage(string userId, CancellationToken ct, string? searchText = null);
        Task<ServiceResult<CourseStudentsPageDTO>> GetTutoringStudents(string userId, Guid courseId, string? searchText = null, CancellationToken ct = default);
        Task<ServiceResult<TeacherTutoringWallDTO>> GetTutoringWallData(Guid wallId, CancellationToken ct = default);
        Task<ServiceResult<TeacherInvoicesPageDTO>> GetInvoicesPage(string userId, CancellationToken ct);
    }
}
