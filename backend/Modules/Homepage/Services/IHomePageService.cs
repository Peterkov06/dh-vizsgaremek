using backend.Modules.Homepage.DTOs.Student;
using backend.Shared.Results;

namespace backend.Modules.Homepage.Services
{
    public interface IHomePageService
    {
        Task<ServiceResult<StudentHomePageDTO>> GetStudentHomePageAsync(string userId);
    }
}
