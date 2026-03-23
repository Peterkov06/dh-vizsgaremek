using backend.Modules.Pages.Shared.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Pages.Shared.Services
{
    public interface ICourseExplorerPageService
    {
        Task<ServiceResult<CourseExplorerPageDTO>> GetExplorerPage(CancellationToken ct);
    }
}
