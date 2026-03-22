using backend.Modules.Pages.Student.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Pages.Student.Services
{
    public interface IHomePageService
    {
        Task<ServiceResult<StudentHomePageDTO>> GetStudentHomePageAsync(string userId);
    }
}
