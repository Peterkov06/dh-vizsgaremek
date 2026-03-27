using backend.Modules.Identity.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Identity.Services
{
    public interface IProfileService
    {
        Task<ServiceResult<TeacherProfileDTO>> GetTeacherProfile(string userId, CancellationToken ct);
        Task<ServiceResult<StudentProfileDTO>> GetStudentProfile(string userId, CancellationToken ct);
    }
}
