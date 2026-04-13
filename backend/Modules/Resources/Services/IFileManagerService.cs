using backend.Modules.Resources.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Resources.Services
{
    public interface IFileManagerService
    {
        Task<ServiceResult<UploadResultDTO>> UploadFile(IFormFile file, string ownerId, string subFolder, UploadType type, CancellationToken ct);
    }
}
