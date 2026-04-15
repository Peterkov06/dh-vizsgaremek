using backend.Modules.Resources.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Resources.Services
{
    public interface IFileManagerService
    {
        Task<ServiceResult<UploadResultDTO>> UploadFile(IFormFile file, string ownerId, string subFolder, UploadType type, CancellationToken ct);
        Task<ServiceResult<FileServeDTO>> ServeFile(string storagePath, CancellationToken ct);
        Task<ServiceResult> DeleteFile(string userId, Guid fileId, CancellationToken ct);
        Task<ServiceResult> ChangeProfilePicture(string userId, IFormFile file, CancellationToken ct);
        Task<ServiceResult> ChangeCourseIconPicture(string userId, Guid courseId, IFormFile file, CancellationToken ct);
        Task<ServiceResult> ChangeCourseBannerPicture(string userId, Guid courseId, IFormFile file, CancellationToken ct);

    }
}
