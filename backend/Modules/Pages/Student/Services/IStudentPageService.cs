using backend.Modules.Pages.Student.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Pages.Student.Services
{
    public interface IStudentPageService
    {
        Task<ServiceResult<StudentHomePageDTO>> GetStudentHomePageAsync(string userId, CancellationToken ct);
        Task<ServiceResult<List<StudentMyCourseDTO>>> GetStudentMyCoursesPageAsync(string userId, CancellationToken ct);
        Task<ServiceResult<StudentTutoringWallDTO>> GetTutoringWallData(Guid wallId, string userId, CancellationToken ct);
        Task<ServiceResult<StudentInvoicesPageDTO>> GetInvoicesPage(string userId, CancellationToken ct);
    }
}
